// =============================================================
// painel.js — junta os números para o painel do dono (#/admin).
//
// Definições (as mesmas que aparecem na tela):
//  Visitante único  = um aparelho/navegador diferente (logado ou não)
//  Usuário ativo    = pessoa com conta que abriu o app naquele período
//  Estudou          = pessoa com conta que concluiu fase ou revisão
//  Retorno 7 dias   = dos que criaram conta entre 8 e 30 dias atrás,
//                     quantos voltaram a usar nos últimos 7 dias
// =============================================================
const jogo = require('./jogo');

function ultimosDias(n) {
  const hoje = jogo.hojeStr();
  const lista = [];
  for (let i = n - 1; i >= 0; i--) lista.push(jogo.somarDias(hoje, -i));
  return lista;
}

async function montarPainel(store, cursos) {
  const hoje = jogo.hojeStr();
  const d30 = ultimosDias(30), d7 = d30.slice(-7);
  const m = await store.metricas(d30);
  const [uHoje, u7, u30] = await Promise.all([m.unicos([hoje]), m.unicos(d7), m.unicos(d30)]);
  const usuarios = await store.resumoUsuarios();

  const diaCadastro = u => (u.criadoEm ? jogo.hojeStr(new Date(u.criadoEm)) : hoje);
  const idade = u => jogo.diasEntre(diaCadastro(u), hoje);
  const soma = (lista, campo) => m.porDia.filter(p => lista.includes(p.dia)).reduce((t, p) => t + p[campo], 0);

  // Retorno: dos que se cadastraram entre 8 e 30 dias atrás, quantos usaram nos últimos 7 dias
  const ativos7 = new Set(u7.idsAtivos);
  const coorte = usuarios.filter(u => idade(u) >= 8 && idade(u) <= 30);
  const voltaram = coorte.filter(u => ativos7.has(u._id)).length;

  // Funil: quantas pessoas concluíram cada fase (mostra onde desistem)
  const funil = ['python', 'javascript', 'java', 'htmlcss', 'react', 'backend', 'sql', 'git'].filter(id => cursos[id]).map(id => cursos[id]).map(c => {
    const fases = [];
    c.mundos.forEach(mu => mu.fases.forEach(f => fases.push(f)));
    const contagem = {};
    usuarios.forEach(u => u.fases.forEach(id => { contagem[id] = (contagem[id] || 0) + 1; }));
    const comecaram = usuarios.filter(u => u.fases.some(id => id.startsWith(fases[0].id.split('-')[0] + '-'))).length;
    return {
      curso: c.id, nome: c.nome, icone: c.icone, cor: c.cor, comecaram,
      fases: fases.map((f, i) => ({ id: f.id, num: i + 1, titulo: f.titulo, concluiram: contagem[f.id] || 0 }))
    };
  });

  const ordenar = obj => Object.entries(obj).sort((a, b) => b[1] - a[1]);
  return {
    geradoEm: new Date().toISOString(),
    hoje,
    totais: {
      usuarios: usuarios.length,
      cadastrosHoje: usuarios.filter(u => idade(u) === 0).length,
      cadastros7: usuarios.filter(u => idade(u) < 7).length,
      cadastros30: usuarios.filter(u => idade(u) < 30).length,
      comOfensiva: usuarios.filter(u => u.ultimoDia && jogo.diasEntre(u.ultimoDia, hoje) <= 1 && u.ofensiva > 0).length,
      nuncaJogaram: usuarios.filter(u => u.fases.length === 0).length,
      certificados: usuarios.reduce((t, u) => t + (u.certificados || 0), 0),
      comCertificado: usuarios.filter(u => u.certificados > 0).length
    },
    periodos: {
      hoje: { visitantes: uHoje.visitantes, ativos: uHoje.ativos, estudaram: uHoje.estudaram, visualizacoes: soma([hoje], 'visualizacoes'), fases: soma([hoje], 'fases'), visitantesNovos: soma([hoje], 'visitantesNovos') },
      d7: { visitantes: u7.visitantes, ativos: u7.ativos, estudaram: u7.estudaram, visualizacoes: soma(d7, 'visualizacoes'), fases: soma(d7, 'fases'), visitantesNovos: soma(d7, 'visitantesNovos') },
      d30: { visitantes: u30.visitantes, ativos: u30.ativos, estudaram: u30.estudaram, visualizacoes: soma(d30, 'visualizacoes'), fases: soma(d30, 'fases'), visitantesNovos: soma(d30, 'visitantesNovos') }
    },
    retorno: { coorte: coorte.length, voltaram },
    porDia: m.porDia,
    paginas: ordenar(m.paginas).slice(0, 12),
    cursos: ordenar(m.cursos),
    funil: funil.sort((a, b) => b.comecaram - a.comecaram), // a trilha mais jogada aparece aberta
    recentes: [...usuarios].sort((a, b) => String(b.criadoEm).localeCompare(String(a.criadoEm))).slice(0, 15)
      .map(u => ({ nome: u.nome, usuario: u.usuario, avatar: u.avatar, criadoEm: u.criadoEm, xp: u.xp, fases: u.fases.length, ultimoDia: u.ultimoDia || null }))
  };
}

module.exports = { montarPainel };
