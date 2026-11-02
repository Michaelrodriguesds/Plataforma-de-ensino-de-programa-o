// =============================================================
// jogo.js — as "regras do jogo": XP, estrelas, ofensiva (dias seguidos),
// conquistas, ranking semanal e revisão espaçada.
//
// Tudo que vale ponto é calculado AQUI no servidor, não no celular.
// Assim ninguém consegue "inventar" XP para subir no ranking.
// =============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FUSO = process.env.FUSO_HORARIO || 'America/Sao_Paulo';

// ---------- 1. Carregar o conteúdo dos cursos ----------
// Os arquivos de lições ficam em public/js/conteudo e são usados pelo
// navegador. O servidor lê os MESMOS arquivos para saber quais fases
// existem e quanto XP cada uma vale.
function carregarCursos() {
  const pasta = path.join(__dirname, '..', 'public', 'js', 'conteudo');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const arq of fs.readdirSync(pasta).filter(f => f.endsWith('.js')).sort()) {
    vm.runInContext(fs.readFileSync(path.join(pasta, arq), 'utf8'), sandbox, { filename: arq });
  }
  const cursos = sandbox.window.CURSOS || {};
  const fases = new Map();
  for (const curso of Object.values(cursos)) {
    let anterior = null;
    curso.mundos.forEach((mundo, mi) => {
      mundo.fases.forEach(fase => {
        const revisaveis = [];
        (fase.ex || []).forEach((ex, i) => {
          if (['quiz', 'prever', 'completar', 'montar'].includes(ex.tipo)) revisaveis.push(`${fase.id}:${i}`);
        });
        fases.set(fase.id, {
          id: fase.id, curso: curso.id, mundo: mi, poo: !!mundo.poo,
          xp: fase.xp || 15 + mi * 5, anterior, revisaveis
        });
        anterior = fase.id;
      });
    });
  }
  return { cursos, fases };
}

// ---------- 2. Datas (no fuso do Brasil) ----------
function hojeStr(data = new Date()) {
  // en-CA formata como AAAA-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(data);
}
function diasEntre(a, b) { // quantos dias de 'a' até 'b' (strings AAAA-MM-DD)
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}
function semanaKey(data = new Date()) {
  // Semana começa na segunda-feira. A chave é a data da segunda.
  const hoje = hojeStr(data);
  const d = new Date(hoje + 'T00:00:00Z');
  const diaSemana = (d.getUTCDay() + 6) % 7; // 0 = segunda
  d.setUTCDate(d.getUTCDate() - diaSemana);
  return d.toISOString().slice(0, 10);
}
function somarDias(diaStr, n) {
  const d = new Date(diaStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ---------- 3. Níveis ----------
// Cada nível pede um pouco mais de XP que o anterior (como num RPG).
function nivelDoXp(xp) {
  let nivel = 1, precisa = 60, acumulado = 0;
  while (xp >= acumulado + precisa) { acumulado += precisa; nivel++; precisa = Math.round(precisa * 1.18); }
  return { nivel, xpNoNivel: xp - acumulado, xpProximo: precisa };
}

// ---------- 4. Conquistas ----------
const CONQUISTAS = [
  { id: 'primeira-fase', icone: '🌱', nome: 'Primeiro passo', desc: 'Conclua sua primeira fase.' },
  { id: 'ofensiva-3', icone: '🔥', nome: 'Esquentando', desc: 'Estude 3 dias seguidos.' },
  { id: 'ofensiva-7', icone: '🚀', nome: 'Uma semana inteira', desc: 'Estude 7 dias seguidos.' },
  { id: 'ofensiva-30', icone: '🏆', nome: 'Hábito de programador', desc: 'Estude 30 dias seguidos.' },
  { id: 'xp-500', icone: '⭐', nome: '500 XP', desc: 'Junte 500 pontos de experiência.' },
  { id: 'xp-2000', icone: '🌟', nome: '2.000 XP', desc: 'Junte 2.000 pontos de experiência.' },
  { id: 'xp-6000', icone: '💫', nome: '6.000 XP', desc: 'Junte 6.000 pontos de experiência.' },
  { id: 'perfeito-10', icone: '💎', nome: 'Caprichoso', desc: 'Termine 10 fases com 3 estrelas.' },
  { id: 'revisor-50', icone: '🧠', nome: 'Memória de elefante', desc: 'Acerte 50 perguntas na revisão.' },
  { id: 'poliglota', icone: '🗺️', nome: 'Poliglota', desc: 'Conclua uma fase em Python, em JavaScript e em Java.' },
  { id: 'objetos', icone: '🧱', nome: 'Mestre dos objetos', desc: 'Conclua o mundo de Orientação a Objetos em qualquer linguagem.' },
  { id: 'formado-javascript', icone: '🟨', nome: 'Formado em JavaScript', desc: 'Conclua todas as fases de JavaScript.' },
  { id: 'formado-python', icone: '🐍', nome: 'Formado em Python', desc: 'Conclua todas as fases de Python.' },
  { id: 'formado-java', icone: '☕', nome: 'Formado em Java', desc: 'Conclua todas as fases de Java.' },
  { id: 'formado-htmlcss', icone: '🎨', nome: 'Formado em HTML e CSS', desc: 'Conclua todas as fases de HTML e CSS.' },
  { id: 'formado-react', icone: '⚛️', nome: 'Formado em React', desc: 'Conclua todas as fases de React.' },
  { id: 'formado-backend', icone: '🟩', nome: 'Formado em Back-end', desc: 'Conclua todas as fases de Back-end com Node.js.' },
  { id: 'formado-sql', icone: '🗄️', nome: 'Formado em SQL', desc: 'Conclua todas as fases de SQL e Bancos de Dados.' },
  { id: 'formado-git', icone: '🌿', nome: 'Formado em Git e Deploy', desc: 'Conclua todas as fases de Git, Terminal e Deploy.' },
  { id: 'fullstack', icone: '🚀', nome: 'Desenvolvedor Full Stack', desc: 'Conclua as trilhas de HTML e CSS, JavaScript, React, Back-end, SQL e Git.' }
];
const LINGUAGENS = ['python', 'javascript', 'java'];
const FULLSTACK = ['htmlcss', 'javascript', 'react', 'backend', 'sql', 'git'];

function verificarConquistas(u, fasesIdx) {
  const tem = new Set(u.conquistas);
  const novas = [];
  const ganhar = id => { if (!tem.has(id)) { tem.add(id); u.conquistas.push(id); novas.push(id); } };
  const feitas = Object.keys(u.fases);
  if (feitas.length >= 1) ganhar('primeira-fase');
  if (u.maxOfensiva >= 3) ganhar('ofensiva-3');
  if (u.maxOfensiva >= 7) ganhar('ofensiva-7');
  if (u.maxOfensiva >= 30) ganhar('ofensiva-30');
  if (u.xp >= 500) ganhar('xp-500');
  if (u.xp >= 2000) ganhar('xp-2000');
  if (u.xp >= 6000) ganhar('xp-6000');
  if (feitas.filter(id => u.fases[id].estrelas === 3).length >= 10) ganhar('perfeito-10');
  if ((u.revisoesCertas || 0) >= 50) ganhar('revisor-50');
  const porCurso = {};
  for (const f of fasesIdx.values()) {
    porCurso[f.curso] = porCurso[f.curso] || { total: 0, feitas: 0, poo: {} };
    const c = porCurso[f.curso];
    c.total++;
    if (u.fases[f.id]) c.feitas++;
    if (f.poo) { c.poo[f.mundo] = c.poo[f.mundo] || { t: 0, f: 0 }; c.poo[f.mundo].t++; if (u.fases[f.id]) c.poo[f.mundo].f++; }
  }
  const linguagens = LINGUAGENS.filter(c => porCurso[c]);
  if (linguagens.length && linguagens.every(c => porCurso[c].feitas > 0)) ganhar('poliglota');
  const trilhasFs = FULLSTACK.filter(c => porCurso[c]);
  if (trilhasFs.length === FULLSTACK.length && trilhasFs.every(c => porCurso[c].feitas === porCurso[c].total)) ganhar('fullstack');
  for (const [nome, c] of Object.entries(porCurso)) {
    if (Object.values(c.poo).some(m => m.t > 0 && m.f === m.t)) ganhar('objetos');
    if (c.total > 0 && c.feitas === c.total) ganhar('formado-' + nome);
  }
  return novas;
}

// ---------- 5. Usuário ----------
function novoUsuario({ usuario, nome, senhaHash, avatar }) {
  return {
    usuario, nome, senhaHash, avatar: avatar || '🦊',
    xp: 0, semana: { key: semanaKey(), xp: 0 }, hoje: { dia: hojeStr(), xp: 0 },
    metaDiaria: 30, ofensiva: 0, maxOfensiva: 0, ultimoDia: null, protetores: 0,
    fases: {}, revisao: {}, revisoesCertas: 0, conquistas: [],
    criadoEm: new Date().toISOString()
  };
}

// Ofensiva = quantos dias seguidos a pessoa estudou.
// "Protetor de ofensiva": a cada 7 dias seguidos você ganha 1 (máx. 2).
// Se faltar um dia, o protetor é gasto e a ofensiva não zera.
function atualizarOfensiva(u, hoje) {
  if (u.ultimoDia === hoje) return;
  if (!u.ultimoDia) u.ofensiva = 1;
  else {
    const dif = diasEntre(u.ultimoDia, hoje);
    if (dif === 1) u.ofensiva++;
    else if (dif > 1 && u.protetores >= dif - 1) { u.protetores -= dif - 1; u.ofensiva++; }
    else u.ofensiva = 1;
  }
  u.ultimoDia = hoje;
  if (u.ofensiva > u.maxOfensiva) u.maxOfensiva = u.ofensiva;
  if (u.ofensiva % 7 === 0 && u.protetores < 2) u.protetores++;
}

function ganharXp(u, qtd) {
  const hoje = hojeStr();
  const sk = semanaKey();
  if (!u.semana || u.semana.key !== sk) u.semana = { key: sk, xp: 0 };
  if (!u.hoje || u.hoje.dia !== hoje) u.hoje = { dia: hoje, xp: 0 };
  u.xp += qtd; u.semana.xp += qtd; u.hoje.xp += qtd;
  if (qtd > 0) atualizarOfensiva(u, hoje);
}

// Ofensiva que aparece na tela (se a pessoa sumiu, mostra 0)
function ofensivaVisivel(u) {
  if (!u.ultimoDia) return 0;
  const dif = diasEntre(u.ultimoDia, hojeStr());
  if (dif <= 1) return u.ofensiva;
  if (u.protetores >= dif - 1) return u.ofensiva;
  return 0;
}

function usuarioPublico(u) {
  const hoje = hojeStr();
  const { senhaHash, ...resto } = u;
  return {
    ...resto,
    ofensiva: ofensivaVisivel(u),
    xpHoje: u.hoje && u.hoje.dia === hoje ? u.hoje.xp : 0,
    xpSemana: u.semana && u.semana.key === semanaKey() ? u.semana.xp : 0,
    estudouHoje: u.ultimoDia === hoje,
    nivel: nivelDoXp(u.xp),
    hoje
  };
}

// ---------- 6. Concluir uma fase ----------
function calcularEstrelas({ erros = 0, dicas = 0, solucoes = 0 }) {
  let e = 3;
  if (erros >= 2 || dicas >= 3) e--;
  if (erros >= 5 || solucoes > 0) e--;
  return Math.max(1, e);
}

// Revisão espaçada: caixas de Leitner.
// Caixa 1 volta amanhã, caixa 2 em 3 dias, ... caixa 6 em 30 dias.
const INTERVALOS = [1, 3, 7, 14, 30, 60];

function concluirFase(u, fasesIdx, faseId, info) {
  const f = fasesIdx.get(faseId);
  if (!f) return { erro: 'Fase não encontrada.' };
  if (f.anterior && !u.fases[f.anterior]) return { erro: 'Conclua a fase anterior primeiro.' };
  const estrelas = calcularEstrelas(info || {});
  const xpDaFase = Math.round(f.xp * estrelas / 3);
  const antes = u.fases[faseId];
  let xpGanho;
  if (!antes) xpGanho = xpDaFase;                                   // primeira vez: XP cheio
  else if (xpDaFase > antes.melhorXp) xpGanho = xpDaFase - antes.melhorXp + 3; // melhorou
  else if (Date.now() - Date.parse(antes.em || 0) < 60 * 1000) xpGanho = 0; // repetiu em menos de 1 minuto: não vale (evita "farmar" XP)
  else xpGanho = 3;                                                  // treino repetido
  u.fases[faseId] = {
    estrelas: Math.max(estrelas, antes ? antes.estrelas : 0),
    melhorXp: Math.max(xpDaFase, antes ? antes.melhorXp : 0),
    vezes: (antes ? antes.vezes : 0) + 1,
    em: new Date().toISOString()
  };
  // As perguntas desta fase entram na revisão (voltam amanhã)
  if (!antes) {
    const amanha = somarDias(hojeStr(), 1);
    for (const id of f.revisaveis) u.revisao[id] = { caixa: 1, proxima: amanha };
  }
  const ofensivaAntes = ofensivaVisivel(u);
  ganharXp(u, xpGanho);
  const novas = verificarConquistas(u, fasesIdx);
  return { estrelas, xpGanho, conquistas: novas, ofensivaSubiu: u.ofensiva > ofensivaAntes };
}

function registrarRevisao(u, fasesIdx, resultados) {
  const hoje = hojeStr();
  let certas = 0;
  let validos = 0;
  for (const r of (Array.isArray(resultados) ? resultados : []).slice(0, 30)) {
    if (!r || typeof r !== 'object') continue;
    const item = u.revisao[String(r.id)];
    if (!item || item.proxima > hoje) continue; // só vale para itens que estavam "vencidos"
    validos++;
    if (r.ok === true) { item.caixa = Math.min(item.caixa + 1, INTERVALOS.length); certas++; }
    else item.caixa = 1;
    item.proxima = somarDias(hoje, INTERVALOS[item.caixa - 1]);
  }
  u.revisoesCertas = (u.revisoesCertas || 0) + certas;
  const xpGanho = certas * 2 + (validos ? 5 : 0); // o bônus de 5 só vale se havia algo para revisar
  const ofensivaAntes = ofensivaVisivel(u);
  ganharXp(u, xpGanho);
  const novas = verificarConquistas(u, fasesIdx);
  return { xpGanho, certas, conquistas: novas, ofensivaSubiu: u.ofensiva > ofensivaAntes };
}

// ---------- 8. Prova final e certificado ----------
// Ao concluir TODAS as fases de uma trilha, a pessoa faz uma prova de
// múltipla escolha (perguntas sorteadas das fases, sem dicas) e, se acertar
// pelo menos 70%, recebe um certificado de conclusão ilustrativo.
const PROVA = { questoes: 15, minimo: 0.7, tentativasPorDia: 3 };

// Carga horária estimada: tempo de leitura + exercícios, com folga para
// revisão e prática (iniciantes demoram mais: por isso o fator 1,5).
function cargaHoraria(curso) {
  let min = 0;
  for (const m of curso.mundos) for (const f of m.fases) {
    min += (f.licao || []).length * 5;
    for (const e of f.ex || []) {
      if (e.tipo === 'quiz' || e.tipo === 'prever') min += 1.5;
      else if (e.tipo === 'codigo') min += (f.xp || 0) >= 60 ? 25 : 12;
      else min += 3;
    }
  }
  return Math.ceil(min * 1.5 / 60);
}
// Perguntas que podem cair na prova (as de escolha: pergunta e prever)
function bancoProva(curso) {
  const ids = [];
  for (const m of curso.mundos) for (const f of m.fases) {
    (f.ex || []).forEach((e, i) => { if (e.tipo === 'quiz' || e.tipo === 'prever') ids.push(f.id + ':' + i); });
  }
  return ids;
}
function exercicioPorId(curso, id) {
  const [faseId, idx] = String(id).split(':');
  for (const m of curso.mundos) for (const f of m.fases) if (f.id === faseId) return (f.ex || [])[Number(idx)] || null;
  return null;
}
function sortear(lista, n) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}
function situacaoProva(u, curso) {
  const total = curso.mundos.reduce((t, m) => t + m.fases.length, 0);
  const feitas = curso.mundos.reduce((t, m) => t + m.fases.filter(f => u.fases && u.fases[f.id]).length, 0);
  const p = (u.provas || {})[curso.id] || { tentativas: [] };
  const hoje = hojeStr();
  const hojeN = p.tentativas.filter(t => t.dia === hoje).length;
  return {
    liberada: feitas === total, faltam: total - feitas,
    tentativasHoje: hojeN, restantesHoje: Math.max(0, PROVA.tentativasPorDia - hojeN),
    melhor: p.melhor || 0, aprovado: !!p.aprovado,
    certificado: (u.certificados || {})[curso.id] || null,
    questoes: Math.min(PROVA.questoes, bancoProva(curso).length), minimo: PROVA.minimo, horas: cargaHoraria(curso)
  };
}
function gerarCodigoCertificado() {
  const ALF = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem letras que confundem (0/O, 1/I)
  const b = require('crypto').randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) s += ALF[b[i] % ALF.length];
  return 'CQ-' + s.slice(0, 4) + '-' + s.slice(4);
}

module.exports = {
  PROVA, cargaHoraria, bancoProva, exercicioPorId, sortear, situacaoProva, gerarCodigoCertificado,
  carregarCursos, novoUsuario, usuarioPublico, concluirFase, registrarRevisao,
  CONQUISTAS, semanaKey, hojeStr, nivelDoXp, calcularEstrelas, somarDias, diasEntre
};
