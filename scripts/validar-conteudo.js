// =============================================================
// Validador de conteúdo: roda TODAS as respostas das fases e confere
// se a saída bate com o esperado. Use depois de criar/editar fases:
//     npm run validar            (todas as trilhas)
//     npm run validar -- sql     (só uma trilha, pelo id)
// Requisitos: python3 (ou python) e Java (javac) instalados no PC,
// e as ferramentas de desenvolvimento (npm install, sem --omit=dev).
// =============================================================
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const { executarJs } = require('../public/js/runtime/jsexec.js');
const { PREAMBULO } = require('../public/js/runtime/pypre.js');
const { rodarJava, temJava } = require('../src/javaRunner.js');
const { montarCodigo } = require('../public/js/runtime/montar.js');
const { criarAjudantes } = require('../public/js/runtime/csshelp.js');
const { rodarSql } = require('../public/js/runtime/sqlexec.js');
const { criarAmbiente } = require('../public/js/runtime/nodesim.js');
const { criarTerminal } = require('../public/js/runtime/terminal.js');
const { preparar: prepararReact } = require('../public/js/runtime/reactprep.js');

const normalizar = s => String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

const PY = ['python3', 'python'].find(c => { try { return spawnSync(c, ['--version']).status === 0; } catch { return false; } });

let parseHTML, SQL = null, reactLib = null;
try { ({ parseHTML } = require('linkedom')); } catch { /* sem linkedom */ }

async function prepararFerramentas(lings) {
  if (lings.has('sql')) SQL = await require('sql.js')();
  if (lings.has('react')) { require('../public/js/runtime/reactlib.js'); reactLib = globalThis.cqReactLib; }
}

// ctx: { dom, banco, pasta, api, teste }
async function rodar(ling, codigo, entrada, ctx = {}) {
  const linhas = [];
  const imprimir = l => linhas.push(l);
  if (ling === 'javascript') {
    let extras = {};
    if (ctx.dom !== undefined) { // modo página: mesma biblioteca usada no navegador
      const p = parseHTML('<!doctype html><html><head></head><body>' + ctx.dom + '</body></html>');
      extras = { document: p.document, window: p.window, Event: p.window.Event };
    }
    const r = await executarJs(codigo, entrada || '', imprimir, 5000, extras);
    return { saida: linhas.join('\n'), erro: r.erro };
  }
  if (ling === 'html') {
    let html = String(codigo || '');
    if (!/<html[\s>]/i.test(html)) html = '<!doctype html><html><head></head><body>' + html + '</body></html>';
    const p = parseHTML(html);
    const r = await executarJs(ctx.teste || '', '', imprimir, 5000, Object.assign({ document: p.document, window: p.window, Event: p.window.Event }, criarAjudantes(p.document)));
    return { saida: linhas.join('\n'), erro: r.erro };
  }
  if (ling === 'sql') {
    const r = rodarSql(SQL, ctx.banco, codigo, imprimir);
    return { saida: linhas.join('\n'), erro: r.erro };
  }
  if (ling === 'node') {
    const r = await executarJs(codigo, '', imprimir, 5000, criarAmbiente(imprimir));
    return { saida: linhas.join('\n'), erro: r.erro };
  }
  if (ling === 'react') {
    const p = parseHTML('<!doctype html><html><head></head><body>' + (ctx.dom === undefined ? '<div id="root"></div>' : ctx.dom) + '</body></html>');
    globalThis.document = p.document;
    const prep = prepararReact(codigo, reactLib, p.document, p.window, ctx.api);
    if (prep.erro) return { saida: '', erro: prep.erro };
    const r = await executarJs(prep.codigo, '', imprimir, 5000, prep.extras);
    return { saida: linhas.join('\n'), erro: r.erro };
  }
  if (ling === 'terminal') {
    const t = criarTerminal();
    const rodarNode = (cod, pasta, impr) => {
      const arqs = {};
      const todos = t.arquivos();
      Object.keys(todos).forEach(k => { if (k.indexOf(pasta + '/') === 0) arqs[k.slice(pasta.length + 1)] = todos[k]; });
      return executarJs(cod, '', impr, 3000, criarAmbiente(impr, { arquivos: arqs }));
    };
    if (ctx.pasta) {
      const pre = await t.rodar(ctx.pasta, { silencioso: true, rodarNode });
      if (pre.erros) return { saida: '', erro: 'O preparo da pasta (campo "pasta") deu erro' };
    }
    const r = await t.rodar(codigo, { rodarNode });
    return { saida: r.saida, erro: '', errosTerminal: r.erros, tela: r.tela };
  }
  if (ling === 'python') {
    const arq = path.join(os.tmpdir(), `cq-val-${process.pid}.py`);
    fs.writeFileSync(arq, codigo);
    const prog = `${PREAMBULO}\nimport sys\nexec(compile(open(sys.argv[1], encoding="utf-8").read(), "seu_codigo.py", "exec"), {"__name__": "__main__"})`;
    const r = spawnSync(PY, ['-I', '-c', prog, arq], { input: entrada || '', encoding: 'utf8', cwd: os.tmpdir(), env: { ...process.env, PYTHONIOENCODING: 'utf-8' }, timeout: 10000 });
    return { saida: r.stdout, erro: r.status === 0 ? '' : (r.stderr || 'erro') };
  }
  if (ling === 'java') {
    const r = await rodarJava(codigo, entrada || '');
    return { saida: r.saida || '', erro: r.ok ? '' : r.erro };
  }
  return { saida: '', erro: 'Linguagem desconhecida: ' + ling };
}

// Roda um código já com o teste juntado (do jeito que o app faz)
function rodarComTeste(ling, codigo, teste, entrada, ctx) {
  const m = montarCodigo(ling, codigo, teste);
  return rodar(ling, m.codigo, entrada, Object.assign({}, ctx, { teste: m.teste }));
}

function preencher(codigo, resp) {
  let i = 0;
  return codigo.replace(/___/g, () => { const r = resp[i++]; return Array.isArray(r) ? r[0] : r; });
}

async function main() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const pasta = path.join(__dirname, '..', 'public', 'js', 'conteudo');
  const filtro = process.argv[2]; // ex: node scripts/validar-conteudo.js python
  for (const arq of fs.readdirSync(pasta).filter(f => f.endsWith('.js')).sort()) {
    vm.runInContext(fs.readFileSync(path.join(pasta, arq), 'utf8'), sandbox, { filename: arq });
  }
  const cursos = Object.values(sandbox.window.CURSOS).filter(c => !filtro || c.id === filtro);
  await prepararFerramentas(new Set(cursos.map(c => c.ling)));
  let total = 0, falhas = 0;
  const ids = new Set();
  const falhou = (onde, msg) => { falhas++; console.log(`❌ ${onde}\n   ${msg.replace(/\n/g, '\n   ')}`); };
  const ehErro = r => r.erro || r.errosTerminal;
  const textoErro = r => r.erro || (r.errosTerminal ? 'Um comando do terminal deu erro:\n' + r.tela : '');

  for (const curso of cursos) {
    const ling = curso.ling;
    if (ling === 'java' && !temJava()) { console.log('⚠️  Java não instalado: pulando curso de Java'); continue; }
    if (ling === 'python' && !PY) { console.log('⚠️  Python não instalado: pulando curso de Python'); continue; }
    if (['html', 'react', 'javascript'].includes(ling) && !parseHTML) { console.log(`⚠️  linkedom não instalado (rode npm install sem --omit=dev): pulando ${curso.nome}`); continue; }
    let nFases = 0, nEx = 0;
    for (const mundo of curso.mundos) for (const fase of mundo.fases) {
      nFases++;
      if (ids.has(fase.id)) falhou(fase.id, 'ID de fase repetido');
      ids.add(fase.id);
      if (!fase.licao || !fase.licao.length) falhou(fase.id, 'Fase sem lição');
      const ctxDe = obj => ({
        dom: obj.dom,
        banco: obj.banco ?? fase.banco ?? curso.banco,
        pasta: obj.pasta ?? fase.pasta,
        api: obj.api ?? fase.api
      });
      for (const card of fase.licao || []) {
        if (card.codigo) {
          total++;
          const r = await rodarComTeste(ling, card.codigo, card.teste, card.entrada, ctxDe(card));
          if (ehErro(r) && !card.erroEsperado) falhou(`${fase.id} lição "${card.titulo}"`, 'Exemplo da lição deu erro:\n' + textoErro(r));
        }
      }
      for (const [i, ex] of (fase.ex || []).entries()) {
        nEx++; total++;
        const onde = `${fase.id} ex${i + 1} (${ex.tipo})`;
        const ctx = ctxDe(ex);
        try {
          if (ex.tipo === 'quiz' || ex.tipo === 'prever') {
            if (!(ex.c >= 0 && ex.c < ex.op.length)) { falhou(onde, 'Índice da resposta certa (c) inválido'); continue; }
            if (new Set(ex.op).size !== ex.op.length) falhou(onde, 'Alternativas repetidas');
            if (!ex.exp) falhou(onde, 'Falta a explicação (exp)');
          }
          if (ex.tipo === 'prever') {
            const r = await rodarComTeste(ling, ex.codigo, ex.teste, ex.entrada, ctx);
            const esperado = ex.saidaReal !== undefined ? ex.saidaReal : ex.op[ex.c];
            if (ex.erro) { if (!ehErro(r)) falhou(onde, 'Era para dar erro, mas rodou'); }
            else if (ehErro(r) && ling !== 'terminal') falhou(onde, 'Código deu erro:\n' + textoErro(r));
            else if (normalizar(r.saida) !== normalizar(esperado)) falhou(onde, `Saída real:\n${r.saida}\nResposta marcada:\n${esperado}`);
          }
          if (ex.tipo === 'completar') {
            const nLacunas = (ex.codigo.match(/___/g) || []).length;
            if (nLacunas !== ex.resp.length) falhou(onde, `Lacunas (${nLacunas}) != respostas (${ex.resp.length})`);
            if (ex.saida !== undefined) {
              const r = await rodarComTeste(ling, preencher(ex.codigo, ex.resp), ex.teste, ex.entrada, ctx);
              if (ehErro(r) || normalizar(r.saida) !== normalizar(ex.saida)) falhou(onde, `Saída: ${r.saida}\nErro: ${textoErro(r) || '-'}\nEsperado: ${ex.saida}`);
            }
          }
          if (ex.tipo === 'montar' && ex.saida !== undefined) {
            const r = await rodarComTeste(ling, ex.linhas.join('\n'), ex.teste, ex.entrada, ctx);
            if (ehErro(r) || normalizar(r.saida) !== normalizar(ex.saida)) falhou(onde, `Saída: ${r.saida}\nErro: ${textoErro(r) || '-'}\nEsperado: ${ex.saida}`);
          }
          if (ex.tipo === 'codigo') {
            const testes = ex.testes || [{ entrada: ex.entrada, saida: ex.saida }];
            for (const t of testes) {
              const r = await rodarComTeste(ling, ex.sol, ex.teste, t.entrada, ctx);
              if (r.erro || normalizar(r.saida) !== normalizar(t.saida)) {
                falhou(onde, `Solução falhou (entrada: ${JSON.stringify(t.entrada || '')})\nSaída: ${r.saida}\nErro: ${r.erro || '-'}\nEsperado: ${t.saida}`);
              }
              // o código inicial NÃO pode passar sozinho (senão o desafio já vem resolvido)
              if (ex.inicio !== undefined && t === testes[0]) {
                const r0 = await rodarComTeste(ling, ex.inicio, ex.teste, t.entrada, ctx);
                if (!r0.erro && normalizar(r0.saida) === normalizar(t.saida) && (ex.usar || []).every(([re]) => new RegExp(re).test(ex.inicio))) falhou(onde, 'O código inicial já passa no teste: o desafio vem resolvido');
              }
            }
            for (const [re, msg] of ex.usar || []) {
              if (!new RegExp(re).test(ex.sol)) falhou(onde, `A solução não passa na regra "usar": ${msg}`);
            }
            if (!ex.dicas || ex.dicas.length < 2) falhou(onde, 'Coloque pelo menos 2 dicas');
          }
        } catch (e) {
          falhou(onde, 'Exceção no validador: ' + (e.stack || e.message));
        }
      }
    }
    console.log(`📘 ${curso.nome}: ${nFases} fases, ${nEx} exercícios`);
  }
  console.log(falhas ? `\n${falhas} problema(s) em ${total} verificações.` : `\n✅ Tudo certo! ${total} verificações passaram.`);
  process.exit(falhas ? 1 : 0);
}
main();
