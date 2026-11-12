// Testes da API: liga um servidor de verdade numa porta livre, com um banco
// separado (arquivo temporário), e faz os pedidos que o app faria.
// Rode com: npm test
// Para testar também com MongoDB: defina TESTE_MONGODB_URI (ex: mongodb://127.0.0.1:27017)
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const zlib = require('zlib');

const PASTA = fs.mkdtempSync(path.join(os.tmpdir(), 'cq-teste-'));
const PORTA = 4100 + Math.floor(Math.random() * 800);
let servidor;

function pedir(metodo, caminho, corpo, { token, cabecalhos } = {}) {
  return new Promise((ok, erro) => {
    const h = Object.assign({ 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (teste)' }, cabecalhos || {});
    if (token) h.Authorization = 'Bearer ' + token;
    const q = http.request({ host: '127.0.0.1', port: PORTA, path: caminho, method: metodo, headers: h }, r => {
      const partes = [];
      r.on('data', p => partes.push(p));
      r.on('end', () => {
        let buf = Buffer.concat(partes);
        if (r.headers['content-encoding'] === 'gzip') buf = zlib.gunzipSync(buf);
        const texto = buf.toString('utf8');
        let json = null;
        try { json = JSON.parse(texto); } catch { /* html */ }
        ok({ status: r.statusCode, cab: r.headers, json, texto });
      });
    });
    q.on('error', erro);
    if (corpo !== undefined) q.write(typeof corpo === 'string' ? corpo : JSON.stringify(corpo));
    q.end();
  });
}

test.before(async () => {
  const env = Object.assign({}, process.env, {
    PORT: String(PORTA), JWT_SECRET: 'segredo-de-teste-' + Date.now(), ADMIN_USUARIOS: 'dona_teste',
    ARQUIVO_DADOS: path.join(PASTA, 'db.json'), CONTATO_EMAIL: 'contato@teste.com', MONGODB_DB: 'cq_teste_' + Date.now()
  });
  delete env.MONGODB_URI;
  if (process.env.TESTE_MONGODB_URI) env.MONGODB_URI = process.env.TESTE_MONGODB_URI;
  servidor = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  servidor.stdout.on('data', d => { log += d; });
  servidor.stderr.on('data', d => { log += d; });
  for (let i = 0; i < 100; i++) {
    try { const r = await pedir('GET', '/api/saude'); if (r.status === 200) return; } catch { /* ainda ligando */ }
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('O servidor não ligou:\n' + log);
});
test.after(() => { if (servidor) servidor.kill(); fs.rmSync(PASTA, { recursive: true, force: true }); });

async function cadastrar(usuario, extra) {
  const r = await pedir('POST', '/api/auth/cadastro', Object.assign({ nome: 'Pessoa ' + usuario, usuario, senha: 'senha123', avatar: '🦊' }, extra || {}));
  assert.equal(r.status, 200, JSON.stringify(r.json));
  return r.json.token;
}

test('cadastro e login validam os dados', async () => {
  assert.equal((await pedir('POST', '/api/auth/cadastro', { nome: 'A', usuario: 'ab', senha: '123456' })).status, 400);
  assert.equal((await pedir('POST', '/api/auth/cadastro', { nome: 'Ana', usuario: 'ana_val', senha: { length: 10 } })).status, 400);
  assert.equal((await pedir('POST', '/api/auth/cadastro', { nome: 'Ana', usuario: 'merda123', senha: '123456' })).status, 400);
  const t = await cadastrar('ana_val', { avatar: '<img src=x>' });
  const eu = await pedir('GET', '/api/eu', undefined, { token: t });
  assert.equal(eu.json.usuario.avatar.includes('<'), false, 'avatar sem HTML');
  assert.equal(eu.json.usuario.senhaHash, undefined, 'nunca devolve o hash da senha');
  assert.equal((await pedir('POST', '/api/auth/cadastro', { nome: 'Ana', usuario: 'ana_val', senha: '123456' })).status, 409);
  assert.equal((await pedir('POST', '/api/auth/login', { usuario: 'ana_val', senha: 'errada' })).status, 401);
  assert.equal((await pedir('POST', '/api/auth/login', { usuario: 'ANA_VAL', senha: 'senha123' })).status, 200);
  assert.equal((await pedir('GET', '/api/eu', undefined, { token: 'lixo' })).status, 401);
});

test('progresso: ordem das fases, revisão e ranking', async () => {
  const t = await cadastrar('bia_prog');
  assert.equal((await pedir('POST', '/api/progresso/fase', { faseId: 'py-02' }, { token: t })).status, 400);
  const r = await pedir('POST', '/api/progresso/fase', { faseId: 'py-01', erros: 0 }, { token: t });
  assert.equal(r.status, 200);
  assert.ok(r.json.xpGanho > 0);
  assert.ok(r.json.conquistas.includes('primeira-fase'));
  assert.equal((await pedir('POST', '/api/progresso/revisao', { resultados: { x: 1 } }, { token: t })).status, 200);
  const rk = await pedir('GET', '/api/ranking?periodo=semana', undefined, { token: t });
  assert.ok(rk.json.lista.some(l => l.usuario === 'bia_prog' && l.eu));
});

test('trocar senha derruba os logins antigos; senha errada não desloga', async () => {
  const t = await cadastrar('caio_senha');
  assert.equal((await pedir('POST', '/api/eu/senha', { atual: 'errada', nova: 'novasenha' }, { token: t })).status, 403);
  const r = await pedir('POST', '/api/eu/senha', { atual: 'senha123', nova: 'novasenha' }, { token: t });
  assert.equal(r.status, 200);
  assert.equal((await pedir('GET', '/api/eu', undefined, { token: t })).status, 401, 'token antigo deixa de valer');
  assert.equal((await pedir('GET', '/api/eu', undefined, { token: r.json.token })).status, 200);
  assert.equal((await pedir('POST', '/api/eu/excluir', { senha: 'errada' }, { token: r.json.token })).status, 403);
});

test('sugestões com e sem conta', async () => {
  assert.equal((await pedir('POST', '/api/sugestao', { tipo: 'xyz', texto: 'olá mundo' })).status, 400);
  assert.equal((await pedir('POST', '/api/sugestao', { tipo: 'sugestao', texto: 'oi' })).status, 400);
  assert.equal((await pedir('POST', '/api/sugestao', { tipo: 'conteudo', texto: 'Quero TypeScript', nota: 5, contato: 'a@b.com' })).status, 200);
  const t = await cadastrar('duda_sug');
  assert.equal((await pedir('POST', '/api/sugestao', { tipo: 'elogio', texto: 'Muito bom!', nota: 9 }, { token: t })).status, 200);
  assert.equal((await pedir('POST', '/api/feedback', { faseId: 'py-01', passo: 'licao', texto: 'erro na lição' }, { token: t })).status, 200);
});

test('painel e ferramentas só para o administrador', async () => {
  const comum = await cadastrar('edu_comum');
  assert.equal((await pedir('GET', '/api/admin/painel', undefined, { token: comum })).status, 403);
  assert.equal((await pedir('GET', '/api/admin/backup', undefined, { token: comum })).status, 403);
  const adm = await cadastrar('dona_teste');
  await pedir('POST', '/api/evento', { vid: 'aparelho-teste-1', pagina: 'site/inicio' });
  await pedir('POST', '/api/evento', { vid: 'robo-teste-123', pagina: 'site/inicio' }, { cabecalhos: { 'User-Agent': 'Googlebot/2.1' } });
  const p = await pedir('GET', '/api/admin/painel', undefined, { token: adm });
  assert.equal(p.status, 200);
  assert.ok(p.json.online.agora >= 1);
  assert.equal(p.json.funil.length, 8, 'funil com as 8 trilhas');
  const fb = await pedir('GET', '/api/admin/feedback', undefined, { token: adm });
  const tipos = fb.json.lista.map(f => f.tipo || 'aula');
  assert.ok(tipos.includes('conteudo') && tipos.includes('elogio') && tipos.includes('aula'));
  const elogio = fb.json.lista.find(f => f.tipo === 'elogio');
  assert.equal(elogio.nota, null, 'nota fora de 1 a 5 é descartada');
  // senha provisória derruba o login antigo do aluno
  const tAluno = await cadastrar('fe_esqueceu');
  const sp = await pedir('POST', '/api/admin/usuarios/fe_esqueceu/senha', undefined, { token: adm });
  assert.equal(sp.status, 200);
  assert.equal((await pedir('GET', '/api/eu', undefined, { token: tAluno })).status, 401);
  assert.equal((await pedir('POST', '/api/auth/login', { usuario: 'fe_esqueceu', senha: sp.json.senha })).status, 200);
  const bk = await pedir('GET', '/api/admin/backup', undefined, { token: adm });
  assert.ok(bk.json.total >= 5);
});

test('prova final e certificado', async () => {
  const t = await cadastrar('gabi_cert');
  assert.equal((await pedir('POST', '/api/prova/git/iniciar', undefined, { token: t })).status, 403, 'bloqueada antes de concluir');
  const vm = require('vm');
  const sb = { window: {} };
  vm.createContext(sb);
  const pasta = path.join(__dirname, '..', 'public', 'js', 'conteudo');
  for (const f of fs.readdirSync(pasta).sort()) vm.runInContext(fs.readFileSync(path.join(pasta, f), 'utf8'), sb);
  const git = sb.window.CURSOS.git;
  for (const m of git.mundos) for (const f of m.fases) {
    const r = await pedir('POST', '/api/progresso/fase', { faseId: f.id }, { token: t });
    assert.equal(r.status, 200, f.id + ' ' + JSON.stringify(r.json));
  }
  const certa = id => { const [fid, i] = id.split(':'); for (const m of git.mundos) for (const f of m.fases) if (f.id === fid) return f.ex[Number(i)].c; };
  // tentativa 1: tudo errado
  let ini = await pedir('POST', '/api/prova/git/iniciar', undefined, { token: t });
  assert.equal(ini.status, 200);
  assert.equal(ini.json.ids.length, 15);
  let env = await pedir('POST', '/api/prova/git/enviar', { token: ini.json.token, respostas: ini.json.ids.map(() => 99) }, { token: t });
  assert.equal(env.json.aprovado, false);
  // reenviar a mesma prova (já com o gabarito em mãos) não pode
  const reenvio = await pedir('POST', '/api/prova/git/enviar', { token: ini.json.token, respostas: ini.json.ids.map(certa) }, { token: t });
  assert.equal(reenvio.status, 400);
  assert.equal((await pedir('POST', '/api/certificados/git', { nome: 'Gabi Silva' }, { token: t })).status, 403);
  // tentativa 2: certo
  ini = await pedir('POST', '/api/prova/git/iniciar', undefined, { token: t });
  env = await pedir('POST', '/api/prova/git/enviar', { token: ini.json.token, respostas: ini.json.ids.map(certa) }, { token: t });
  assert.equal(env.json.nota, 100);
  assert.equal(env.json.aprovado, true);
  // token de outra pessoa não serve
  const outro = await cadastrar('hugo_intruso');
  assert.equal((await pedir('POST', '/api/prova/git/enviar', { token: ini.json.token, respostas: [] }, { token: outro })).status, 400);
  const cert = await pedir('POST', '/api/certificados/git', { nome: '  Gabi   Silva  ' }, { token: t });
  assert.equal(cert.status, 200);
  assert.equal(cert.json.certificado.nome, 'Gabi Silva');
  assert.match(cert.json.certificado.codigo, /^CQ-/);
  const pag = await pedir('GET', cert.json.url);
  assert.equal(pag.status, 200);
  assert.ok(pag.texto.includes('Gabi Silva') && pag.texto.includes('noindex') && pag.texto.includes('MEC'));
  assert.equal((await pedir('GET', '/certificado/CQ-AAAA-2222')).status, 404);
  // reemitir mantém o mesmo código
  const de_novo = await pedir('POST', '/api/certificados/git', { nome: 'Gabi S.' }, { token: t });
  assert.equal(de_novo.json.certificado.codigo, cert.json.certificado.codigo);
  // tentativa 3 e limite diário
  await pedir('POST', '/api/prova/git/iniciar', undefined, { token: t });
  assert.equal((await pedir('POST', '/api/prova/git/iniciar', undefined, { token: t })).status, 429);
});

test('site público, segurança e compressão', async () => {
  const inicio = await pedir('GET', '/', undefined, { cabecalhos: { 'Accept-Encoding': 'gzip' } });
  assert.equal(inicio.status, 200);
  assert.equal(inicio.cab['content-encoding'], 'gzip', 'respostas compactadas');
  assert.ok(inicio.cab['x-content-type-options'], 'cabeçalhos do helmet');
  assert.equal(inicio.cab['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.ok(inicio.texto.includes('Carreira Full Stack'));
  for (const c of ['/aprender', '/aprender/react', '/aprender/sql/sql-12', '/sobre', '/privacidade', '/termos']) {
    assert.equal((await pedir('GET', c)).status, 200, c);
  }
  assert.equal((await pedir('GET', '/aprender/nada')).status, 404);
  const app = await pedir('GET', '/app');
  for (const f of ['python.js', 'htmlcss-1.js', 'git.js']) assert.ok(app.texto.includes('/js/conteudo/' + f), f);
  const sm = await pedir('GET', '/sitemap.xml');
  assert.ok((sm.texto.match(/<loc>/g) || []).length > 200);
  assert.ok((await pedir('GET', '/robots.txt')).texto.includes('Sitemap:'));
  assert.equal((await pedir('GET', '/ads.txt')).status, 404, 'sem ADSENSE_CLIENTE não há ads.txt');
  assert.ok(!inicio.texto.includes('pagead2') && !inicio.texto.includes('google-adsense-account'), 'sem ADSENSE_CLIENTE não há código do AdSense');
  const wasm = await pedir('GET', '/js/runtime/sql/sql-wasm.wasm');
  assert.equal(wasm.cab['content-type'], 'application/wasm');
  assert.equal((await pedir('GET', '/api/nada')).status, 404);
});
