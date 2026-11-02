// =============================================================
// store.js — o "armário" onde guardamos os jogadores e as estatísticas.
//
// Funciona de dois jeitos:
//  1) Com MONGODB_URI no .env  -> guarda no MongoDB (Atlas ou local)
//  2) Sem MONGODB_URI          -> guarda num arquivo data/db.json
//     (ótimo para testar no seu PC sem configurar banco nenhum)
//
// ESTATÍSTICAS (para o painel do dono), guardadas por dia:
//  - visualizações de página        (cada tela aberta conta 1)
//  - visitantes únicos              (cada aparelho conta 1 por dia; usamos um
//                                    código aleatório guardado no navegador,
//                                    sem nome, sem IP)
//  - visitantes novos               (aparelho visto pela 1ª vez naquele dia)
//  - usuários ativos                (logados que abriram o app no dia)
//  - usuários que estudaram         (concluíram fase ou revisão no dia)
//  - cadastros, fases e revisões concluídas, páginas mais vistas, linguagens
// =============================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIAS_GUARDADOS = 400; // estatísticas mais antigas que isso são apagadas
const TIPOS = { fase: 'fases', revisao: 'revisoes', cadastro: 'cadastros' };
const limparChave = s => String(s || '').replace(/[^\w/-]/g, '_').slice(0, 80) || 'desconhecida';

// ---------- Versão com arquivo JSON ----------
class ArquivoStore {
  constructor(arquivo) {
    this.arquivo = arquivo;
    this.usuarios = [];
    this.m = { estat: {}, visitantes: {}, vids: {}, usuariosDia: {} };
    this.feedback = [];
    this.fila = Promise.resolve(); // evita duas gravações ao mesmo tempo
    this.timer = null;
  }
  async conectar() {
    fs.mkdirSync(path.dirname(this.arquivo), { recursive: true });
    if (fs.existsSync(this.arquivo)) {
      const dados = JSON.parse(fs.readFileSync(this.arquivo, 'utf8'));
      this.usuarios = dados.usuarios || [];
      this.m = Object.assign(this.m, dados.metricas || {});
      this.feedback = dados.feedback || [];
    }
    console.log(`💾 Banco: arquivo local (${this.arquivo}) — ${this.usuarios.length} jogador(es)`);
  }
  _gravar() {
    // grava num arquivo temporário e troca de nome: se a luz cair no meio, o arquivo antigo continua inteiro
    this.fila = this.fila.then(() => {
      const tmp = this.arquivo + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify({ usuarios: this.usuarios, metricas: this.m, feedback: this.feedback }));
      fs.renameSync(tmp, this.arquivo);
    });
    return this.fila;
  }
  _gravarDepois() { // estatísticas: junta várias e grava de uma vez (a cada 3 s)
    if (this.timer) return;
    this.timer = setTimeout(() => { this.timer = null; this._limparAntigos(); this._gravar(); }, 3000);
  }
  _limparAntigos() {
    const limite = new Date(Date.now() - DIAS_GUARDADOS * 86400000).toISOString().slice(0, 10);
    for (const grupo of ['estat', 'visitantes', 'usuariosDia']) {
      for (const dia of Object.keys(this.m[grupo])) if (dia < limite) delete this.m[grupo][dia];
    }
  }
  async buscarPorUsuario(usuario) {
    return structuredClone(this.usuarios.find(u => u.usuario === usuario) || null);
  }
  async buscarPorId(id) {
    return structuredClone(this.usuarios.find(u => u._id === id) || null);
  }
  async buscarPorCertificado(codigo) {
    return structuredClone(this.usuarios.find(u => (u.codigosCert || []).includes(codigo)) || null);
  }
  async criar(doc) {
    doc._id = crypto.randomUUID();
    this.usuarios.push(structuredClone(doc));
    await this._gravar();
    return doc;
  }
  async salvar(doc) {
    const i = this.usuarios.findIndex(u => u._id === doc._id);
    if (i >= 0) this.usuarios[i] = structuredClone(doc);
    await this._gravar();
  }
  async ranking({ semanaKey, limite }) {
    let lista = this.usuarios;
    if (semanaKey) lista = lista.filter(u => u.semana && u.semana.key === semanaKey && u.semana.xp > 0);
    const campo = u => (semanaKey ? u.semana.xp : u.xp);
    return [...lista].sort((a, b) => campo(b) - campo(a)).slice(0, limite).map(u => structuredClone(u));
  }
  async contar() { return this.usuarios.length; }
  async excluir(id) {
    this.usuarios = this.usuarios.filter(u => u._id !== id);
    for (const ud of Object.values(this.m.usuariosDia)) delete ud[id];
    await this._gravar();
  }

  // ----- estatísticas -----
  _estatDia(dia) {
    return (this.m.estat[dia] = this.m.estat[dia] || { visualizacoes: 0, fases: 0, revisoes: 0, cadastros: 0, paginas: {}, cursos: {} });
  }
  async registrarVisita({ dia, vid, uid, pagina }) {
    const e = this._estatDia(dia);
    e.visualizacoes++;
    const p = limparChave(pagina);
    e.paginas[p] = (e.paginas[p] || 0) + 1;
    (this.m.visitantes[dia] = this.m.visitantes[dia] || {})[vid] = 1;
    if (!this.m.vids[vid]) this.m.vids[vid] = dia;
    if (uid) {
      const ud = (this.m.usuariosDia[dia] = this.m.usuariosDia[dia] || {});
      if (ud[uid] === undefined) ud[uid] = false;
    }
    this._gravarDepois();
  }
  async registrarAtividade({ dia, uid, tipo, curso }) {
    const e = this._estatDia(dia);
    if (TIPOS[tipo]) e[TIPOS[tipo]]++;
    if (tipo === 'fase' && curso) e.cursos[limparChave(curso)] = (e.cursos[limparChave(curso)] || 0) + 1;
    if (uid && (tipo === 'fase' || tipo === 'revisao')) (this.m.usuariosDia[dia] = this.m.usuariosDia[dia] || {})[uid] = true;
    this._gravarDepois();
  }
  async metricas(dias) {
    const porDia = dias.map(dia => {
      const e = this.m.estat[dia] || {};
      const ud = this.m.usuariosDia[dia] || {};
      return {
        dia,
        visualizacoes: e.visualizacoes || 0,
        visitantes: Object.keys(this.m.visitantes[dia] || {}).length,
        ativos: Object.keys(ud).length,
        estudaram: Object.values(ud).filter(Boolean).length,
        cadastros: e.cadastros || 0, fases: e.fases || 0, revisoes: e.revisoes || 0
      };
    });
    const novos = {};
    for (const d of Object.values(this.m.vids)) novos[d] = (novos[d] || 0) + 1;
    porDia.forEach(p => { p.visitantesNovos = novos[p.dia] || 0; });
    const unicos = lista => {
      const v = new Set(), a = new Set(), est = new Set();
      for (const dia of lista) {
        Object.keys(this.m.visitantes[dia] || {}).forEach(x => v.add(x));
        for (const [uid, estudou] of Object.entries(this.m.usuariosDia[dia] || {})) { a.add(uid); if (estudou) est.add(uid); }
      }
      return { visitantes: v.size, ativos: a.size, estudaram: est.size, idsAtivos: [...a] };
    };
    const paginas = {}, cursos = {};
    for (const dia of dias) {
      const e = this.m.estat[dia]; if (!e) continue;
      for (const [k, n] of Object.entries(e.paginas)) paginas[k] = (paginas[k] || 0) + n;
      for (const [k, n] of Object.entries(e.cursos)) cursos[k] = (cursos[k] || 0) + n;
    }
    return { porDia, unicos, paginas, cursos };
  }
  // ----- backup, avisos de problema -----
  async todosUsuarios() { return structuredClone(this.usuarios); }
  async restaurarUsuario(doc) {
    const i = this.usuarios.findIndex(u => u._id === doc._id || u.usuario === doc.usuario);
    if (i >= 0) this.usuarios[i] = structuredClone(doc); else this.usuarios.push(structuredClone(doc));
    await this._gravar();
  }
  async salvarFeedback(doc) {
    doc._id = crypto.randomUUID();
    this.feedback.unshift(doc);
    this.feedback = this.feedback.slice(0, 500);
    await this._gravar();
  }
  async listarFeedback(limite) { return structuredClone(this.feedback.slice(0, limite)); }
  async excluirFeedback(id) { this.feedback = this.feedback.filter(f => f._id !== id); await this._gravar(); }
  async resumoUsuarios() {
    return this.usuarios.map(u => ({ _id: u._id, nome: u.nome, usuario: u.usuario, avatar: u.avatar, criadoEm: u.criadoEm, xp: u.xp, ultimoDia: u.ultimoDia, ofensiva: u.ofensiva, fases: Object.keys(u.fases || {}), certificados: (u.codigosCert || []).length }));
  }
}

// ---------- Versão com MongoDB ----------
class MongoStore {
  constructor(uri) { this.uri = uri; }
  async conectar() {
    const { MongoClient } = require('mongodb');
    if (/<(db_)?password>/i.test(this.uri)) throw new Error('A MONGODB_URI ainda tem o texto <db_password>. Troque pela senha do usuário do banco (sem os sinais < >).');
    this.cliente = new MongoClient(this.uri, { serverSelectionTimeoutMS: 15000 });
    await this.cliente.connect();
    const db = this.cliente.db(process.env.MONGODB_DB || 'codequest');
    this.col = db.collection('usuarios');
    this.estat = db.collection('estatisticas');     // 1 documento por dia
    this.visit = db.collection('visitantes_dia');   // 1 por aparelho por dia
    this.vids = db.collection('visitantes');        // 1 por aparelho (quando apareceu)
    this.udia = db.collection('usuarios_dia');      // 1 por usuário logado por dia
    this.fb = db.collection('feedback');            // avisos de problema nas aulas
    await this.col.createIndex({ usuario: 1 }, { unique: true });
    await this.col.createIndex({ xp: -1 });
    await this.col.createIndex({ codigosCert: 1 }); // conferir certificados pelo código
    await this.col.createIndex({ 'semana.key': 1, 'semana.xp': -1 });
    await this.visit.createIndex({ dia: 1 });
    await this.vids.createIndex({ primeiro: 1 });
    await this.udia.createIndex({ dia: 1 });
    // apaga sozinho registros diários com mais de 400 dias (TTL)
    // (se o banco não aceitar índices TTL, o site funciona igual: só não apaga os antigos sozinho)
    try {
      await this.visit.createIndex({ em: 1 }, { expireAfterSeconds: DIAS_GUARDADOS * 86400 });
      await this.udia.createIndex({ em: 1 }, { expireAfterSeconds: DIAS_GUARDADOS * 86400 });
    } catch (e) { console.warn('⚠️  Índice de limpeza automática não criado:', e.message); }
    console.log('💾 Banco: MongoDB conectado');
  }
  async buscarPorUsuario(usuario) { return this.col.findOne({ usuario }); }
  async buscarPorId(id) { return this.col.findOne({ _id: id }); }
  async buscarPorCertificado(codigo) { return this.col.findOne({ codigosCert: codigo }); }
  async criar(doc) {
    doc._id = crypto.randomUUID(); // usamos texto como id, igual à versão arquivo
    await this.col.insertOne(doc);
    return doc;
  }
  async salvar(doc) { await this.col.replaceOne({ _id: doc._id }, doc); }
  async ranking({ semanaKey, limite }) {
    if (semanaKey) {
      return this.col.find({ 'semana.key': semanaKey, 'semana.xp': { $gt: 0 } })
        .sort({ 'semana.xp': -1 }).limit(limite).toArray();
    }
    return this.col.find({}).sort({ xp: -1 }).limit(limite).toArray();
  }
  async contar() { return this.col.countDocuments(); }
  async excluir(id) {
    await this.col.deleteOne({ _id: id });
    await this.udia.deleteMany({ uid: id });
  }

  // ----- estatísticas -----
  async registrarVisita({ dia, vid, uid, pagina }) {
    const em = new Date();
    const ops = [
      this.estat.updateOne({ _id: dia }, { $inc: { visualizacoes: 1, ['paginas.' + limparChave(pagina)]: 1 } }, { upsert: true }),
      this.visit.updateOne({ _id: dia + '|' + vid }, { $setOnInsert: { dia, vid, em }, $inc: { vistas: 1 } }, { upsert: true }),
      this.vids.updateOne({ _id: vid }, { $setOnInsert: { primeiro: dia } }, { upsert: true })
    ];
    if (uid) ops.push(this.udia.updateOne({ _id: dia + '|' + uid }, { $setOnInsert: { dia, uid, estudou: false, em } }, { upsert: true }));
    await Promise.all(ops);
  }
  async registrarAtividade({ dia, uid, tipo, curso }) {
    const inc = {};
    if (TIPOS[tipo]) inc[TIPOS[tipo]] = 1;
    if (tipo === 'fase' && curso) inc['cursos.' + limparChave(curso)] = 1;
    const ops = [this.estat.updateOne({ _id: dia }, { $inc: inc }, { upsert: true })];
    if (uid && (tipo === 'fase' || tipo === 'revisao')) {
      ops.push(this.udia.updateOne({ _id: dia + '|' + uid }, { $set: { dia, uid, estudou: true }, $setOnInsert: { em: new Date() } }, { upsert: true }));
    }
    await Promise.all(ops);
  }
  async metricas(dias) {
    const [estats, vis, novos, ud, udEst] = await Promise.all([
      this.estat.find({ _id: { $in: dias } }).toArray(),
      this.visit.aggregate([{ $match: { dia: { $in: dias } } }, { $group: { _id: '$dia', n: { $sum: 1 } } }]).toArray(),
      this.vids.aggregate([{ $match: { primeiro: { $in: dias } } }, { $group: { _id: '$primeiro', n: { $sum: 1 } } }]).toArray(),
      this.udia.aggregate([{ $match: { dia: { $in: dias } } }, { $group: { _id: '$dia', n: { $sum: 1 } } }]).toArray(),
      this.udia.aggregate([{ $match: { dia: { $in: dias }, estudou: true } }, { $group: { _id: '$dia', n: { $sum: 1 } } }]).toArray()
    ]);
    const mapa = (arr, f) => Object.fromEntries(arr.map(x => [x._id, f(x)]));
    const E = mapa(estats, x => x), V = mapa(vis, x => x.n), N = mapa(novos, x => x.n), U = mapa(ud, x => x), UE = mapa(udEst, x => x.n);
    const porDia = dias.map(dia => ({
      dia,
      visualizacoes: (E[dia] && E[dia].visualizacoes) || 0,
      visitantes: V[dia] || 0, visitantesNovos: N[dia] || 0,
      ativos: (U[dia] && U[dia].n) || 0, estudaram: UE[dia] || 0,
      cadastros: (E[dia] && E[dia].cadastros) || 0, fases: (E[dia] && E[dia].fases) || 0, revisoes: (E[dia] && E[dia].revisoes) || 0
    }));
    const unicos = async lista => {
      // (consultas simples, que funcionam em qualquer versão do MongoDB)
      const [v, a, e] = await Promise.all([
        this.visit.aggregate([{ $match: { dia: { $in: lista } } }, { $group: { _id: '$vid' } }, { $count: 'n' }]).toArray(),
        this.udia.aggregate([{ $match: { dia: { $in: lista } } }, { $group: { _id: '$uid' } }]).toArray(),
        this.udia.aggregate([{ $match: { dia: { $in: lista }, estudou: true } }, { $group: { _id: '$uid' } }]).toArray()
      ]);
      return { visitantes: v[0] ? v[0].n : 0, ativos: a.length, estudaram: e.length, idsAtivos: a.map(x => x._id) };
    };
    const paginas = {}, cursos = {};
    for (const e of estats) {
      for (const [k, n] of Object.entries(e.paginas || {})) paginas[k] = (paginas[k] || 0) + n;
      for (const [k, n] of Object.entries(e.cursos || {})) cursos[k] = (cursos[k] || 0) + n;
    }
    return { porDia, unicos, paginas, cursos };
  }
  // ----- backup, avisos de problema -----
  async todosUsuarios() { return this.col.find({}).toArray(); }
  async restaurarUsuario(doc) {
    await this.col.deleteMany({ usuario: doc.usuario, _id: { $ne: doc._id } });
    await this.col.replaceOne({ _id: doc._id }, doc, { upsert: true });
  }
  async salvarFeedback(doc) {
    doc._id = crypto.randomUUID();
    await this.fb.insertOne(doc);
    // guarda no máximo 2.000 mensagens: apaga as mais antigas (o plano grátis do Atlas tem 512 MB)
    const total = await this.fb.countDocuments();
    if (total > 2000) {
      const velhas = await this.fb.find({}, { projection: { _id: 1 } }).sort({ em: 1 }).limit(total - 2000).toArray();
      await this.fb.deleteMany({ _id: { $in: velhas.map(v => v._id) } });
    }
  }
  async listarFeedback(limite) { return this.fb.find({}).sort({ em: -1 }).limit(limite).toArray(); }
  async excluirFeedback(id) { await this.fb.deleteOne({ _id: id }); }
  async resumoUsuarios() {
    const lista = await this.col.find({}, { projection: { nome: 1, usuario: 1, avatar: 1, criadoEm: 1, xp: 1, ultimoDia: 1, ofensiva: 1, fases: 1, codigosCert: 1 } }).toArray();
    return lista.map(u => ({ ...u, fases: Object.keys(u.fases || {}), certificados: (u.codigosCert || []).length, codigosCert: undefined }));
  }
}

function criarStore() {
  // Tira espaços e aspas que às vezes vêm junto ao colar a string no Render ou no .env
  const uri = String(process.env.MONGODB_URI || '').trim().replace(/^["'`]+|["'`]+$/g, '').trim();
  if (uri) return new MongoStore(uri);
  return new ArquivoStore(process.env.ARQUIVO_DADOS || path.join(__dirname, '..', 'data', 'db.json'));
}

module.exports = { criarStore };
