// =============================================================
// Validador de conteúdo: roda TODAS as respostas das fases e confere
// se a saída bate com o esperado. Use depois de criar/editar fases:
//     npm run validar
// Requisitos: python3 (ou python) e Java (javac) instalados no PC.
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

const normalizar = s => String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

const PY = ['python3', 'python'].find(c => { try { return spawnSync(c, ['--version']).status === 0; } catch { return false; } });

const { parseHTML } = require('linkedom');

async function rodar(ling, codigo, entrada, dom) {
  if (ling === 'javascript') {
    const linhas = [];
    let extras = {};
    if (dom !== undefined) { // modo página: mesma biblioteca usada no navegador
      const p = parseHTML('<!doctype html><html><head></head><body>' + dom + '</body></html>');
      extras = { document: p.document, window: p.window, Event: p.window.Event };
    }
    const r = await executarJs(codigo, entrada || '', l => linhas.push(l), 5000, extras);
    return { saida: linhas.join('\n'), erro: r.erro };
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
  let total = 0, falhas = 0;
  const ids = new Set();
  const falhou = (onde, msg) => { falhas++; console.log(`❌ ${onde}\n   ${msg.replace(/\n/g, '\n   ')}`); };

  for (const curso of Object.values(sandbox.window.CURSOS)) {
    if (filtro && curso.id !== filtro) continue;
    const ling = curso.ling;
    if (ling === 'java' && !temJava()) { console.log('⚠️  Java não instalado: pulando curso de Java'); continue; }
    if (ling === 'python' && !PY) { console.log('⚠️  Python não instalado: pulando curso de Python'); continue; }
    let nFases = 0, nEx = 0;
    for (const mundo of curso.mundos) for (const fase of mundo.fases) {
      nFases++;
      if (ids.has(fase.id)) falhou(fase.id, 'ID de fase repetido');
      ids.add(fase.id);
      for (const card of fase.licao || []) {
        if (card.codigo) {
          total++;
          const r = await rodar(ling, card.codigo, card.entrada, card.dom);
          if (r.erro && !card.erroEsperado) falhou(`${fase.id} lição "${card.titulo}"`, 'Exemplo da lição deu erro:\n' + r.erro);
        }
      }
      for (const [i, ex] of (fase.ex || []).entries()) {
        nEx++; total++;
        const onde = `${fase.id} ex${i + 1} (${ex.tipo})`;
        try {
          if (ex.tipo === 'quiz' || ex.tipo === 'prever') {
            if (!(ex.c >= 0 && ex.c < ex.op.length)) { falhou(onde, 'Índice da resposta certa (c) inválido'); continue; }
            if (new Set(ex.op).size !== ex.op.length) falhou(onde, 'Alternativas repetidas');
          }
          if (ex.tipo === 'prever') {
            const r = await rodar(ling, ex.codigo, ex.entrada, ex.dom);
            const esperado = ex.saidaReal !== undefined ? ex.saidaReal : ex.op[ex.c];
            if (ex.erro) { if (!r.erro) falhou(onde, 'Era para dar erro, mas rodou'); }
            else if (r.erro) falhou(onde, 'Código deu erro:\n' + r.erro);
            else if (normalizar(r.saida) !== normalizar(esperado)) falhou(onde, `Saída real:\n${r.saida}\nResposta marcada:\n${esperado}`);
          }
          if (ex.tipo === 'completar') {
            const nLacunas = (ex.codigo.match(/___/g) || []).length;
            if (nLacunas !== ex.resp.length) falhou(onde, `Lacunas (${nLacunas}) != respostas (${ex.resp.length})`);
            if (ex.saida !== undefined) {
              const r = await rodar(ling, preencher(ex.codigo, ex.resp), ex.entrada, ex.dom);
              if (r.erro || normalizar(r.saida) !== normalizar(ex.saida)) falhou(onde, `Saída: ${r.saida}\nErro: ${r.erro || '-'}\nEsperado: ${ex.saida}`);
            }
          }
          if (ex.tipo === 'montar' && ex.saida !== undefined) {
            const r = await rodar(ling, ex.linhas.join('\n'), ex.entrada, ex.dom);
            if (r.erro || normalizar(r.saida) !== normalizar(ex.saida)) falhou(onde, `Saída: ${r.saida}\nErro: ${r.erro || '-'}\nEsperado: ${ex.saida}`);
          }
          if (ex.tipo === 'codigo') {
            const testes = ex.testes || [{ entrada: ex.entrada, saida: ex.saida }];
            for (const t of testes) {
              const codigo = montarCodigo(ling, ex.sol, ex.teste).codigo;
              const r = await rodar(ling, codigo, t.entrada, ex.dom);
              if (r.erro || normalizar(r.saida) !== normalizar(t.saida)) {
                falhou(onde, `Solução falhou (entrada: ${JSON.stringify(t.entrada || '')})\nSaída: ${r.saida}\nErro: ${r.erro || '-'}\nEsperado: ${t.saida}`);
              }
            }
            for (const [re, msg] of ex.usar || []) {
              if (!new RegExp(re).test(ex.sol)) falhou(onde, `A solução não passa na regra "usar": ${msg}`);
            }
            if (!ex.dicas || ex.dicas.length < 2) falhou(onde, 'Coloque pelo menos 2 dicas');
          }
        } catch (e) {
          falhou(onde, 'Exceção no validador: ' + e.message);
        }
      }
    }
    console.log(`📘 ${curso.nome}: ${nFases} fases, ${nEx} exercícios`);
  }
  console.log(falhas ? `\n${falhas} problema(s) em ${total} verificações.` : `\n✅ Tudo certo! ${total} verificações passaram.`);
  process.exit(falhas ? 1 : 0);
}
main();
