// Testes das regras do jogo (src/jogo.js) e da integridade do conteúdo.
// Rode com: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const jogo = require('../src/jogo');

const { cursos, fases } = jogo.carregarCursos();
const ORDEM = ['python', 'javascript', 'java', 'htmlcss', 'react', 'backend', 'sql', 'git'];

test('todas as trilhas existem, com fases, habilidades e carga horária', () => {
  for (const id of ORDEM) {
    const c = cursos[id];
    assert.ok(c, 'trilha ' + id);
    assert.ok(c.mundos.length >= 3, id + ': mundos');
    assert.ok(Array.isArray(c.habilidades) && c.habilidades.length >= 5, id + ': habilidades');
    assert.ok(jogo.cargaHoraria(c) >= 5, id + ': carga horária');
    assert.ok(jogo.bancoProva(c).length >= jogo.PROVA.questoes, id + ': perguntas suficientes para a prova');
  }
  assert.equal(Object.keys(cursos).length, ORDEM.length, 'trilha sem lugar na ORDEM (app.js, paginas.js, jogo.js)');
});

test('ids de fase são únicos e seguem o prefixo da trilha', () => {
  const vistos = new Set();
  for (const c of Object.values(cursos)) for (const m of c.mundos) for (const f of m.fases) {
    assert.ok(!vistos.has(f.id), 'repetido: ' + f.id);
    vistos.add(f.id);
    assert.match(f.id, /^[a-z]+-\d{2}$/);
  }
  assert.equal(vistos.size, fases.size);
});

test('estrelas e níveis', () => {
  assert.equal(jogo.calcularEstrelas({}), 3);
  assert.equal(jogo.calcularEstrelas({ erros: 2 }), 2);
  assert.equal(jogo.calcularEstrelas({ solucoes: 1 }), 2);
  assert.equal(jogo.calcularEstrelas({ erros: 9, solucoes: 1 }), 1);
  assert.equal(jogo.nivelDoXp(0).nivel, 1);
  assert.equal(jogo.nivelDoXp(60).nivel, 2);
});

test('concluir fase: ordem, XP e repetição rápida não dá XP', () => {
  const u = jogo.novoUsuario({ usuario: 'teste', nome: 'Teste', senhaHash: 'x' });
  const primeira = cursos.sql.mundos[0].fases[0].id, segunda = cursos.sql.mundos[0].fases[1].id;
  assert.ok(jogo.concluirFase(u, fases, segunda, {}).erro, 'não pode pular fase');
  const r1 = jogo.concluirFase(u, fases, primeira, {});
  assert.ok(r1.xpGanho > 0);
  const r2 = jogo.concluirFase(u, fases, primeira, {});
  assert.equal(r2.xpGanho, 0, 'repetir em menos de 1 minuto não vale XP');
  u.fases[primeira].em = new Date(Date.now() - 120000).toISOString();
  assert.equal(jogo.concluirFase(u, fases, primeira, {}).xpGanho, 3, 'treino depois de um tempo vale 3');
  assert.ok(Object.keys(u.revisao).length > 0, 'perguntas entram na revisão');
});

test('revisão aceita só dados válidos e não dá bônus à toa', () => {
  const u = jogo.novoUsuario({ usuario: 'rev', nome: 'Rev', senhaHash: 'x' });
  assert.equal(jogo.registrarRevisao(u, fases, { malicioso: true }).xpGanho, 0);
  assert.equal(jogo.registrarRevisao(u, fases, 'texto').xpGanho, 0);
  assert.equal(jogo.registrarRevisao(u, fases, [{ id: 'nao-existe:0', ok: true }]).xpGanho, 0);
  u.revisao['py-01:0'] = { caixa: 1, proxima: '2000-01-01' };
  const r = jogo.registrarRevisao(u, fases, [{ id: 'py-01:0', ok: true }]);
  assert.equal(r.certas, 1);
  assert.equal(r.xpGanho, 7);
  assert.equal(u.revisao['py-01:0'].caixa, 2);
});

test('prova: liberação, sorteio e certificado', () => {
  const c = cursos.git;
  const u = jogo.novoUsuario({ usuario: 'p', nome: 'P', senhaHash: 'x' });
  let st = jogo.situacaoProva(u, c);
  assert.equal(st.liberada, false);
  assert.equal(st.faltam, c.mundos.reduce((t, m) => t + m.fases.length, 0));
  for (const m of c.mundos) for (const f of m.fases) u.fases[f.id] = { estrelas: 3 };
  st = jogo.situacaoProva(u, c);
  assert.equal(st.liberada, true);
  assert.equal(st.restantesHoje, jogo.PROVA.tentativasPorDia);
  const ids = jogo.sortear(jogo.bancoProva(c), 15);
  assert.equal(new Set(ids).size, 15);
  for (const id of ids) assert.ok(jogo.exercicioPorId(c, id), id);
  assert.match(jogo.gerarCodigoCertificado(), /^CQ-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
});
