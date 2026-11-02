// =============================================================
// server.js — o "balcão de atendimento" do CodeQuest.
//
// O navegador (celular/notebook) faz pedidos para cá:
//   "quero me cadastrar", "terminei a fase X", "me mostra o ranking"...
// e o servidor responde. Ele também entrega:
//   /            site público (aulas abertas, bom para o Google e o AdSense)
//   /app         o aplicativo de exercícios (precisa de conta)
//   /api/...     os pedidos do aplicativo
// =============================================================
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { criarStore } = require('./src/store');
const jogo = require('./src/jogo');
const { rodarJava, temJava } = require('./src/javaRunner');
const { criarPaginas } = require('./src/paginas');
const { montarPainel } = require('./src/painel');

const PORTA = process.env.PORT || 3000;

// Chave secreta que "assina" o crachá (token) de cada jogador.
// Se você não definir JWT_SECRET no .env, criamos uma e guardamos em data/.segredo
function obterSegredo() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const arq = path.join(__dirname, 'data', '.segredo');
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  if (!fs.existsSync(arq)) fs.writeFileSync(arq, crypto.randomBytes(48).toString('hex'));
  if (process.env.NODE_ENV === 'production') console.warn('⚠️  Defina JWT_SECRET nas variáveis de ambiente em produção!');
  return fs.readFileSync(arq, 'utf8').trim();
}
const SEGREDO = obterSegredo();

// ---------- Configurações de anúncios, estatísticas e contato (.env) ----------
const ADSENSE_CLIENTE = (process.env.ADSENSE_CLIENTE || '').trim();      // ex: ca-pub-1234567890123456
const ADSENSE_SLOT = (process.env.ADSENSE_SLOT || '').trim();            // ex: 1234567890
const GA_ID = (process.env.GA_ID || '').trim();                          // ex: G-XXXXXXX (opcional)
const ANUNCIOS_DEMO = process.env.ANUNCIOS_DEMO === '1';                 // mostra caixas no lugar dos anúncios
const ADMINS = (process.env.ADMIN_USUARIOS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const config = {
  contato: (process.env.CONTATO_EMAIL || '').trim(),
  verificacaoGoogle: (process.env.GOOGLE_VERIFICACAO || '').trim(), // código do Search Console
  ga: GA_ID,
  dataPolitica: process.env.DATA_POLITICA || '21/10/2026',
  siteUrl: req => (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, ''),
  publico: semAnuncio => ({
    adsense: ADSENSE_CLIENTE && !semAnuncio ? { cliente: ADSENSE_CLIENTE, slot: ADSENSE_SLOT } : null,
    demo: ANUNCIOS_DEMO && !semAnuncio, ga: GA_ID || null,
    contato: (process.env.CONTATO_EMAIL || '').trim() || null
  }),
  scriptConfig: semAnuncio => `<script>window.CQ_CONFIG=${JSON.stringify(config.publico(semAnuncio)).replace(/</g, '\\u003c')};</script>`
};

const store = criarStore();
const { fases: FASES, cursos: CURSOS } = jogo.carregarCursos();
const paginas = criarPaginas({ cursos: CURSOS, config });
console.log(`📚 ${FASES.size} fases carregadas`);

const app = express();
app.set('trust proxy', 1); // necessário no Render/Railway (eles ficam na frente do app)
// contentSecurityPolicy desligada: AdSense, Analytics e Pyodide carregam scripts de vários domínios.
// referrerPolicy padrão dos navegadores: o AdSense e o Analytics precisam saber de onde veio a visita.
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, referrerPolicy: { policy: 'strict-origin-when-cross-origin' } }));
app.use(compression()); // compacta as respostas (o conteúdo das trilhas fica ~5x menor no celular)
app.use(express.json({ limit: '100kb' }));

// ---------- Limites contra abuso ----------
const limiteLogin = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { erro: 'Muitas tentativas. Espere alguns minutos.' } });
// Limites por ALUNO (não por IP): numa escola, a turma toda sai pelo mesmo IP.
// Estes limites ficam sempre depois de exigirLogin, então req.usuarioId existe.
const porAluno = req => 'u:' + req.usuarioId;
const limiteJava = rateLimit({ windowMs: 60 * 1000, limit: 20, keyGenerator: porAluno, message: { erro: 'Calma! Muitas execuções seguidas. Espere um minutinho.' } });
const limiteFeedback = rateLimit({ windowMs: 60 * 1000, limit: 10, message: { erro: 'Muitos avisos seguidos. Obrigado! Espere um pouco.' } });
const limiteEvento = rateLimit({ windowMs: 60 * 1000, limit: 120, message: { erro: 'Muitos eventos.' } });
const limiteProgresso = rateLimit({ windowMs: 60 * 1000, limit: 40, keyGenerator: porAluno, message: { erro: 'Calma! Muitas fases seguidas. Espere um pouco.' } });

// ---------- "Porteiro": confere o crachá (token) ----------
// O token leva o id e a "versão" (tv). Trocar a senha aumenta a versão e
// derruba os logins antigos (útil se alguém descobriu a senha).
function lerTokenCompleto(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { const d = jwt.verify(h.slice(7), SEGREDO); return d && d.id ? d : null; } catch { return null; }
}
function lerToken(req) { const d = lerTokenCompleto(req); return d ? d.id : null; }
// Confere o crachá E se a conta ainda existe; deixa a conta em req.u
async function exigirLoginAsync(req, res, next) {
  const d = lerTokenCompleto(req);
  if (!d) return res.status(401).json({ erro: 'Faça login para continuar.' });
  const u = await store.buscarPorId(d.id);
  if (!u || (u.tv || 0) !== (d.tv || 0)) return res.status(401).json({ erro: 'Sua sessão terminou. Entre de novo.' });
  req.usuarioId = d.id;
  req.u = u;
  next();
}
const exigirLogin = (req, res, next) => exigirLoginAsync(req, res, next).catch(e => { console.error(e); res.status(500).json({ erro: 'Erro no servidor. Tente de novo.' }); });
const ehAdmin = u => !!u && ADMINS.includes(u.usuario);
async function exigirAdmin(req, res, next) {
  if (!ehAdmin(req.u)) return res.status(403).json({ erro: 'Área só para o administrador.' });
  next();
}
// Avatar: só emoji/texto curto, sem caracteres de HTML
const limparAvatar = a => String(a || '').replace(/[<>&"'`\\]/g, '').slice(0, 8) || '🦊';
const pub = u => ({ ...jogo.usuarioPublico(u), admin: ehAdmin(u) });

// Filtro simples de nomes ofensivos (o nome aparece no ranking público).
// Acrescente palavras se precisar. A comparação ignora acentos e maiúsculas.
const PALAVRAS_PROIBIDAS = ['porra', 'caralho', 'buceta', 'putaria', 'filhadaputa', 'viado', 'cuzao', 'merda', 'fdp', 'vagabund', 'arrombad', 'piroca', 'nazista', 'hitler', 'admin', 'codequest'];
const semAcento = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const nomeProibido = t => PALAVRAS_PROIBIDAS.some(p => semAcento(t).includes(p));
const criarToken = u => jwt.sign({ id: u._id, tv: u.tv || 0 }, SEGREDO, { expiresIn: '60d' });
const ok = fn => (req, res, next) => fn(req, res, next).catch(e => { console.error(e); res.status(500).json({ erro: 'Erro no servidor. Tente de novo.' }); });
// estatística nunca pode derrubar o pedido principal
const anotar = dados => store.registrarAtividade({ dia: jogo.hojeStr(), ...dados }).catch(e => console.error('estatística:', e.message));

// ---------- Cadastro e login ----------
app.post('/api/auth/cadastro', limiteLogin, ok(async (req, res) => {
  let { usuario, nome, senha, avatar } = req.body || {};
  usuario = String(usuario || '').trim().toLowerCase();
  nome = String(nome || '').trim().slice(0, 30);
  if (!/^[a-z0-9_.]{3,20}$/.test(usuario)) return res.status(400).json({ erro: 'Usuário: 3 a 20 letras, números, ponto ou _ (sem espaço e sem acento).' });
  if (nome.length < 2) return res.status(400).json({ erro: 'Digite seu nome (pelo menos 2 letras).' });
  senha = typeof senha === 'string' ? senha : '';
  if (senha.length < 6) return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
  if (senha.length > 72) return res.status(400).json({ erro: 'Senha longa demais (máximo 72 caracteres).' });
  if (nomeProibido(usuario) || nomeProibido(nome)) return res.status(400).json({ erro: 'Escolha outro nome: ele aparece no ranking para todo mundo.' });
  if (await store.buscarPorUsuario(usuario)) return res.status(409).json({ erro: 'Esse usuário já existe. Escolha outro.' });
  const senhaHash = await bcrypt.hash(senha, 10);
  const u = await store.criar(jogo.novoUsuario({ usuario, nome, senhaHash, avatar: limparAvatar(avatar) }));
  anotar({ uid: u._id, tipo: 'cadastro' });
  res.json({ token: criarToken(u), usuario: pub(u) });
}));

app.post('/api/auth/login', limiteLogin, ok(async (req, res) => {
  const usuario = String((req.body || {}).usuario || '').trim().toLowerCase();
  const u = await store.buscarPorUsuario(usuario);
  if (!u || !(await bcrypt.compare(String(req.body.senha || ''), u.senhaHash))) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }
  res.json({ token: criarToken(u), usuario: pub(u) });
}));

// ---------- Dados do jogador ----------
app.get('/api/eu', exigirLogin, ok(async (req, res) => {
  const u = req.u;
  res.json({ usuario: pub(u) });
}));

app.patch('/api/eu', exigirLogin, ok(async (req, res) => {
  const u = req.u;
  const { nome, avatar, metaDiaria } = req.body || {};
  if (nome && nomeProibido(nome)) return res.status(400).json({ erro: 'Escolha outro nome: ele aparece no ranking para todo mundo.' });
  if (nome && String(nome).trim().length >= 2) u.nome = String(nome).trim().slice(0, 30);
  if (avatar) u.avatar = limparAvatar(avatar);
  if ([10, 20, 30, 50, 80].includes(Number(metaDiaria))) u.metaDiaria = Number(metaDiaria);
  await store.salvar(u);
  res.json({ usuario: pub(u) });
}));

// Trocar a própria senha (pede a atual). Derruba os outros logins.
app.post('/api/eu/senha', exigirLogin, limiteLogin, ok(async (req, res) => {
  const u = req.u;
  const { atual, nova } = req.body || {};
  if (!(await bcrypt.compare(String(atual || ''), u.senhaHash))) return res.status(403).json({ erro: 'A senha atual não confere.' });
  if (typeof nova !== 'string' || nova.length < 6) return res.status(400).json({ erro: 'A nova senha precisa ter pelo menos 6 caracteres.' });
  if (nova.length > 72) return res.status(400).json({ erro: 'Senha longa demais (máximo 72 caracteres).' });
  u.senhaHash = await bcrypt.hash(nova, 10);
  u.tv = (u.tv || 0) + 1;
  await store.salvar(u);
  res.json({ ok: true, token: criarToken(u) });
}));

// Excluir a própria conta (direito previsto na LGPD). Pede a senha para confirmar.
app.post('/api/eu/excluir', exigirLogin, limiteLogin, ok(async (req, res) => {
  const u = req.u;
  if (!u || !(await bcrypt.compare(String((req.body || {}).senha || ''), u.senhaHash))) {
    return res.status(403).json({ erro: 'Senha incorreta.' }); // 403 (e não 401) para o app não deslogar a pessoa
  }
  await store.excluir(u._id);
  res.json({ ok: true });
}));

app.get('/api/meta', (req, res) => {
  res.json({ conquistas: jogo.CONQUISTAS, java: temJava(), hoje: jogo.hojeStr() });
});

// ---------- Progresso ----------
app.post('/api/progresso/fase', exigirLogin, limiteProgresso, ok(async (req, res) => {
  const u = req.u;
  const { faseId, erros, dicas, solucoes } = req.body || {};
  const r = jogo.concluirFase(u, FASES, String(faseId), {
    erros: Number(erros) || 0, dicas: Number(dicas) || 0, solucoes: Number(solucoes) || 0
  });
  if (r.erro) return res.status(400).json(r);
  await store.salvar(u);
  anotar({ uid: u._id, tipo: 'fase', curso: FASES.get(String(faseId)).curso });
  res.json({ ...r, usuario: pub(u) });
}));

app.post('/api/progresso/revisao', exigirLogin, limiteProgresso, ok(async (req, res) => {
  const u = req.u;
  const r = jogo.registrarRevisao(u, FASES, (req.body || {}).resultados);
  await store.salvar(u);
  anotar({ uid: u._id, tipo: 'revisao' });
  res.json({ ...r, usuario: pub(u) });
}));

// ---------- Ranking ----------
app.get('/api/ranking', exigirLogin, ok(async (req, res) => {
  const semanal = req.query.periodo !== 'geral';
  const sk = jogo.semanaKey();
  const lista = await store.ranking({ semanaKey: semanal ? sk : null, limite: 50 });
  const eu = req.u;
  res.json({
    periodo: semanal ? 'semana' : 'geral',
    lista: lista.map((u, i) => ({
      posicao: i + 1, nome: u.nome, usuario: u.usuario, avatar: u.avatar,
      xp: semanal ? u.semana.xp : u.xp, nivel: jogo.nivelDoXp(u.xp).nivel, eu: u._id === eu._id
    }))
  });
}));

// ---------- Executar Java ----------
app.post('/api/executar/java', exigirLogin, limiteJava, ok(async (req, res) => {
  const { codigo, entrada, deslocamento } = req.body || {};
  res.json(await rodarJava(String(codigo || ''), String(entrada || '').slice(0, 5000), deslocamento));
}));

// ---------- Estatísticas de visita ----------
// Cada tela aberta manda: { vid: código aleatório do aparelho, pagina: 'app/inicio' }
const ROBO = /bot|crawl|spider|slurp|mediapartners|lighthouse|headless|preview|facebookexternalhit|whatsapp/i;
// "Online agora": aparelhos que deram sinal nos últimos 5 minutos.
// Fica só na memória (zera se o servidor reiniciar) e não guarda nada pessoal.
const ONLINE_MS = 5 * 60 * 1000;
const online = new Map(); // vid -> { t, logado, pagina }
function contarOnline() {
  const limite = Date.now() - ONLINE_MS;
  let agora = 0, logados = 0;
  const paginas = {};
  for (const [vid, o] of online) {
    if (o.t < limite) { online.delete(vid); continue; }
    agora++;
    if (o.logado) logados++;
    const area = String(o.pagina || '').split('/').slice(0, 2).join('/') || '?';
    paginas[area] = (paginas[area] || 0) + 1;
  }
  return { agora, logados, visitantes: agora - logados, paginas: Object.entries(paginas).sort((a, b) => b[1] - a[1]).slice(0, 6) };
}
app.post('/api/evento', limiteEvento, ok(async (req, res) => {
  if (ROBO.test(req.get('user-agent') || '')) return res.status(204).end(); // robôs não contam
  const { vid, pagina, tipo } = req.body || {};
  if (!/^[\w-]{8,64}$/.test(String(vid || ''))) return res.status(400).json({ erro: 'vid inválido' });
  const uid = lerToken(req);
  if (online.size < 50000) online.set(String(vid), { t: Date.now(), logado: !!uid, pagina: String(pagina || '').slice(0, 60) });
  if (tipo === 'sinal') return res.status(204).end(); // "ainda estou aqui": não conta como visualização
  await store.registrarVisita({ dia: jogo.hojeStr(), vid: String(vid), uid, pagina: String(pagina || '') });
  res.status(204).end();
}));

// ---------- Painel do administrador ----------
app.get('/api/admin/painel', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  const painel = await montarPainel(store, CURSOS);
  painel.online = contarOnline();
  res.json(painel);
}));

// ---------- Avisos de problema nas aulas ("Reportar problema") ----------
app.post('/api/feedback', exigirLogin, limiteFeedback, ok(async (req, res) => {
  const { faseId, passo, texto } = req.body || {};
  const t = String(texto || '').trim().slice(0, 1000);
  if (t.length < 3) return res.status(400).json({ erro: 'Escreva o que aconteceu.' });
  const u = req.u;
  await store.salvarFeedback({ faseId: String(faseId || '').slice(0, 30), passo: String(passo || '').slice(0, 30), texto: t, usuario: u ? u.usuario : '?', em: new Date().toISOString() });
  res.json({ ok: true });
}));

// ---------- Prova final e certificado ----------
// Regras em src/jogo.js (PROVA). O certificado é ilustrativo: não é reconhecido pelo MEC.
const limiteProva = rateLimit({ windowMs: 60 * 1000, limit: 20, keyGenerator: porAluno, message: { erro: 'Muitas tentativas. Espere um minutinho.' } });
function cursoDaRota(req, res) {
  const c = CURSOS[req.params.curso];
  if (!c) { res.status(404).json({ erro: 'Trilha não encontrada.' }); return null; }
  return c;
}
app.get('/api/prova/:curso', exigirLogin, ok(async (req, res) => {
  const c = cursoDaRota(req, res); if (!c) return;
  const u = req.u;
  res.json(jogo.situacaoProva(u, c));
}));
app.post('/api/prova/:curso/iniciar', exigirLogin, limiteProva, ok(async (req, res) => {
  const c = cursoDaRota(req, res); if (!c) return;
  const u = req.u;
  const st = jogo.situacaoProva(u, c);
  if (!st.liberada) return res.status(403).json({ erro: `Conclua todas as fases da trilha para liberar a prova (faltam ${st.faltam}).` });
  if (st.restantesHoje <= 0) return res.status(429).json({ erro: `Você já usou as ${jogo.PROVA.tentativasPorDia} tentativas de hoje. Revise as fases e tente amanhã!` });
  const ids = jogo.sortear(jogo.bancoProva(c), jogo.PROVA.questoes);
  u.provas = u.provas || {};
  const p = u.provas[c.id] = u.provas[c.id] || { tentativas: [] };
  const tid = crypto.randomUUID();
  p.tentativas.push({ tid, dia: jogo.hojeStr(), em: new Date().toISOString(), nota: null });
  p.tentativas = p.tentativas.slice(-30);
  await store.salvar(u);
  // As perguntas sorteadas vão "assinadas": na correção, o servidor confere que são as mesmas
  const token = jwt.sign({ uid: u._id, curso: c.id, ids, tid }, SEGREDO, { expiresIn: '3h' });
  res.json({ ids, token, minimo: jogo.PROVA.minimo });
}));
app.post('/api/prova/:curso/enviar', exigirLogin, limiteProva, ok(async (req, res) => {
  const c = cursoDaRota(req, res); if (!c) return;
  let dados;
  try { dados = jwt.verify(String((req.body || {}).token || ''), SEGREDO); } catch { return res.status(400).json({ erro: 'Prova vencida ou inválida. Comece de novo.' }); }
  if (dados.uid !== req.usuarioId || dados.curso !== c.id) return res.status(400).json({ erro: 'Prova inválida.' });
  // cada prova só pode ser entregue uma vez (senão daria para usar o gabarito e reenviar)
  const pendente = ((req.u.provas || {})[c.id] || { tentativas: [] }).tentativas.find(t => t.tid === dados.tid && t.nota === null);
  if (!pendente) return res.status(400).json({ erro: 'Esta prova já foi entregue. Comece uma nova tentativa.' });
  const respostas = Array.isArray(req.body.respostas) ? req.body.respostas : [];
  const gabarito = dados.ids.map((id, i) => {
    const ex = jogo.exercicioPorId(c, id);
    return { id, certa: ex ? ex.c : null, marcada: Number.isInteger(respostas[i]) ? respostas[i] : null, acertou: !!ex && respostas[i] === ex.c };
  });
  const acertos = gabarito.filter(g => g.acertou).length;
  const nota = Math.round(acertos / gabarito.length * 100);
  const aprovado = acertos / gabarito.length >= jogo.PROVA.minimo;
  const u = req.u;
  const p = (u.provas = u.provas || {})[c.id] = (u.provas[c.id] || { tentativas: [] });
  const tentativa = p.tentativas.find(t => t.tid === dados.tid);
  if (tentativa) tentativa.nota = nota;
  p.melhor = Math.max(p.melhor || 0, nota);
  if (aprovado && !p.aprovado) p.aprovado = { nota, em: new Date().toISOString() };
  // se já tem certificado e melhorou a nota, o certificado mostra a melhor
  if (u.certificados && u.certificados[c.id]) u.certificados[c.id].nota = p.melhor;
  await store.salvar(u);
  res.json({ acertos, total: gabarito.length, nota, aprovado, minimo: Math.round(jogo.PROVA.minimo * 100), gabarito, usuario: pub(u) });
}));
app.post('/api/certificados/:curso', exigirLogin, ok(async (req, res) => {
  const c = cursoDaRota(req, res); if (!c) return;
  const u = req.u;
  const p = (u.provas || {})[c.id];
  if (!p || !p.aprovado) return res.status(403).json({ erro: 'Passe na prova final para emitir o certificado.' });
  const nome = String((req.body || {}).nome || u.nome).replace(/\s+/g, ' ').trim().slice(0, 80);
  if (nome.length < 3) return res.status(400).json({ erro: 'Escreva seu nome completo.' });
  if (nomeProibido(nome)) return res.status(400).json({ erro: 'Escolha outro nome.' });
  u.certificados = u.certificados || {};
  const antigo = u.certificados[c.id];
  const cert = {
    codigo: antigo ? antigo.codigo : jogo.gerarCodigoCertificado(),
    curso: c.id, nome, nota: p.melhor, horas: jogo.cargaHoraria(c),
    em: antigo ? antigo.em : new Date().toISOString()
  };
  u.certificados[c.id] = cert;
  u.codigosCert = Array.from(new Set([...(u.codigosCert || []), cert.codigo]));
  await store.salvar(u);
  res.json({ certificado: cert, url: '/certificado/' + cert.codigo, usuario: pub(u) });
}));

// ---------- Sugestões, pedidos e elogios (com ou sem conta) ----------
const TIPOS_SUGESTAO = ['sugestao', 'conteudo', 'problema', 'elogio'];
app.post('/api/sugestao', limiteFeedback, ok(async (req, res) => {
  const { tipo, texto, nota, contato, pagina } = req.body || {};
  const t = String(texto || '').trim().slice(0, 1500);
  if (!TIPOS_SUGESTAO.includes(tipo)) return res.status(400).json({ erro: 'Escolha o tipo da mensagem.' });
  if (t.length < 5) return res.status(400).json({ erro: 'Escreva um pouco mais, por favor.' });
  const n = Number(nota);
  const uid = lerToken(req);
  const u = uid ? await store.buscarPorId(uid) : null;
  await store.salvarFeedback({
    tipo, texto: t, nota: Number.isInteger(n) && n >= 1 && n <= 5 ? n : null,
    contato: String(contato || '').trim().slice(0, 100), pagina: String(pagina || '').slice(0, 60),
    usuario: u ? u.usuario : 'visitante', em: new Date().toISOString()
  });
  res.json({ ok: true });
}));

// ---------- Ferramentas do administrador ----------
app.get('/api/admin/feedback', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  res.json({ lista: await store.listarFeedback(100) });
}));
app.delete('/api/admin/feedback/:id', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  await store.excluirFeedback(req.params.id);
  res.json({ ok: true });
}));
// Redefinir senha de quem esqueceu (o site não manda e-mail): gera uma senha provisória
app.post('/api/admin/usuarios/:usuario/senha', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  const u = await store.buscarPorUsuario(String(req.params.usuario).toLowerCase());
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  const provisoria = crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'troque123';
  u.senhaHash = await bcrypt.hash(provisoria, 10);
  u.tv = (u.tv || 0) + 1; // quem estava logado com a senha antiga sai
  await store.salvar(u);
  res.json({ ok: true, usuario: u.usuario, senha: provisoria });
}));
// Remover usuário (ex: nome ofensivo no ranking)
app.delete('/api/admin/usuarios/:usuario', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  const u = await store.buscarPorUsuario(String(req.params.usuario).toLowerCase());
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  if (u._id === req.usuarioId) return res.status(400).json({ erro: 'Você não pode remover a própria conta por aqui.' });
  await store.excluir(u._id);
  res.json({ ok: true });
}));
// Backup: baixa todos os usuários e o progresso num arquivo JSON
app.get('/api/admin/backup', exigirLogin, ok(exigirAdmin), ok(async (req, res) => {
  const usuarios = await store.todosUsuarios();
  const nome = `codequest-backup-${jogo.hojeStr()}.json`;
  res.setHeader('Content-Disposition', `attachment; filename="${nome}"`);
  res.json({ versao: 1, geradoEm: new Date().toISOString(), total: usuarios.length, usuarios });
}));

app.get('/api/saude', (req, res) => res.json({ ok: true, fases: FASES.size, java: temJava() }));

// ---------- Arquivos especiais para o Google ----------
app.get('/ads.txt', (req, res) => {
  if (!ADSENSE_CLIENTE) return res.status(404).type('text/plain').send('# Defina ADSENSE_CLIENTE no .env\n');
  // Linha padrão do AdSense: google.com, pub-SEU_ID, DIRECT, f08c47fec0942fa0
  res.type('text/plain').send(`google.com, ${ADSENSE_CLIENTE.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${config.siteUrl(req)}/sitemap.xml\n`);
});
app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(paginas.sitemap(req)));

// ---------- Site público ----------
const html = (res, conteudo) => conteudo ? res.type('html').send(conteudo) : res.status(404).type('html').send(paginas.naoEncontrada(res.req));
app.get('/', (req, res) => html(res, paginas.inicio(req)));
app.get('/aprender', (req, res) => html(res, paginas.aprender(req)));
app.get('/aprender/:curso', (req, res) => html(res, paginas.trilha(req, req.params.curso)));
app.get('/aprender/:curso/:fase', (req, res) => html(res, paginas.licao(req, req.params.curso, req.params.fase)));
app.get('/sobre', (req, res) => html(res, paginas.sobre(req)));
app.get('/privacidade', (req, res) => html(res, paginas.privacidade(req)));
app.get('/termos', (req, res) => html(res, paginas.termos(req)));
// Página pública do certificado (para imprimir, salvar em PDF e conferir pelo código)
app.get('/certificado/:codigo', ok(async (req, res) => {
  const codigo = String(req.params.codigo).toUpperCase();
  const u = /^CQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(codigo) ? await store.buscarPorCertificado(codigo) : null;
  const cert = u && Object.values(u.certificados || {}).find(x => x.codigo === codigo);
  html(res, cert && CURSOS[cert.curso] ? paginas.certificado(req, cert, CURSOS[cert.curso]) : null);
}));

// ---------- Aplicativo (/app) ----------
// Entregamos o index.html com as configurações de anúncio já embutidas
// e com um <script> para cada arquivo de conteúdo (todas as trilhas, em ordem alfabética)
const arquivosConteudo = fs.readdirSync(path.join(__dirname, 'public', 'js', 'conteudo')).filter(f => f.endsWith('.js')).sort();
const indexApp = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8')
  .replace('<!--CONTEUDO-->', arquivosConteudo.map(f => `<script src="/js/conteudo/${f}"></script>`).join('\n  '));
app.get(['/app', '/app/'], (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.type('html').send(indexApp.replace('</head>', config.scriptConfig(false) + '\n</head>'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, p) => { if (p.endsWith('sw.js')) res.setHeader('Cache-Control', 'no-cache'); }
}));
app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use((req, res) => res.status(404).type('html').send(paginas.naoEncontrada(req)));

store.conectar().then(() => {
  app.listen(PORTA, () => {
    console.log(`\n🎮 CodeQuest rodando!`);
    console.log(`   Site público: http://localhost:${PORTA}`);
    console.log(`   Aplicativo:   http://localhost:${PORTA}/app`);
    console.log(`☕ Java no servidor: ${temJava() ? 'disponível' : 'NÃO encontrado (exercícios de Java não vão rodar)'}`);
    console.log(`💰 Anúncios: ${ADSENSE_CLIENTE ? 'AdSense ' + ADSENSE_CLIENTE : ANUNCIOS_DEMO ? 'modo demonstração' : 'desligados (defina ADSENSE_CLIENTE)'}`);
    console.log(`📊 Painel do dono: ${ADMINS.length ? ADMINS.join(', ') + ' → /app#/admin' : 'defina ADMIN_USUARIOS no .env'}\n`);
  });
}).catch(e => {
  const m = String(e && e.message || e);
  console.error('❌ Não consegui conectar no banco de dados:', m);
  let dica = 'Confira a MONGODB_URI (no Render: Environment; no PC: arquivo .env). Sem ela, o site usa o arquivo local.';
  if (/<(db_)?password>/i.test(m)) dica = 'Troque <db_password> pela senha do usuário do banco, sem os sinais < >.';
  else if (/scheme|must begin with|Invalid connection string|URI must include/i.test(m)) dica = 'A string precisa começar com mongodb+srv:// — copie de novo no Atlas: Connect → Drivers. Sem aspas e sem espaços.';
  else if (/bad auth|Authentication failed|auth/i.test(m)) dica = 'Usuário ou senha do banco errados. No Atlas: Database Access → Edit → Edit Password. Use uma senha só com letras e números e cole de novo na string.';
  else if (/unescaped|URI malformed|Password contains/i.test(m)) dica = 'A senha tem caractere especial (@ : / ? # % ). No Atlas, troque a senha por uma só com letras e números.';
  else if (/EBADNAME|ENOTFOUND|querySrv/i.test(m)) dica = 'O endereço do cluster na string está errado ou tem um caractere a mais (aspas, espaço). O trecho depois do @ deve ser só algo como cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority — copie de novo no Atlas (Connect → Drivers).';
  else if (/timed out|Server selection|ENOTFOUND|querySrv|ECONNREFUSED|whitelist|SSL|TLS/i.test(m)) dica = 'O Atlas não deixou o servidor entrar. No Atlas: Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0). Confira também se o cluster não está pausado.';
  console.error('   👉 ' + dica);
  process.exit(1);
});
