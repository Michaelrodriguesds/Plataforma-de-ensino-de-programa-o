// =============================================================
// nodesim.js — um "Node.js de mentirinha" que roda dentro do navegador,
// para a trilha de Back-end.
//
// O aluno escreve um servidor de verdade (com Express, rotas, JSON,
// JWT, bcrypt, MongoDB...) e o código de teste faz pedidos com fetch().
// Nada sai do aparelho: o "servidor" e o "banco" vivem na memória do
// Web Worker e somem quando a execução termina.
//
// Módulos que o require() entende:
//   express, http, jsonwebtoken, bcryptjs, mongodb, cors, dotenv,
//   crypto, path, fs (arquivos só na memória)
// Funciona no Web Worker (navegador) e no Node (validador).
// =============================================================
(function (raiz) {
  // ---------- SHA-256 e HMAC (para JWT e para o "bcrypt") ----------
  var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function utf8(s) {
    s = String(s);
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) { c = 0x10000 + ((c - 0xd800) << 10) + (s.charCodeAt(++i) - 0xdc00); }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function sha256(bytes) {
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var m = bytes.slice(), bits = bytes.length * 8;
    m.push(0x80);
    while (m.length % 64 !== 56) m.push(0);
    for (var s = 7; s >= 0; s--) m.push(s >= 4 ? 0 : (bits >>> (s * 8)) & 255);
    var w = new Array(64);
    for (var off = 0; off < m.length; off += 64) {
      for (var t = 0; t < 16; t++) w[t] = (m[off + t * 4] << 24) | (m[off + t * 4 + 1] << 16) | (m[off + t * 4 + 2] << 8) | m[off + t * 4 + 3];
      for (t = 16; t < 64; t++) {
        var x = w[t - 15], y = w[t - 2];
        var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
        var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = [];
    H.forEach(function (v) { out.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255); });
    return out;
  }
  function hmac(chave, msg) {
    var k = utf8(chave);
    if (k.length > 64) k = sha256(k);
    while (k.length < 64) k.push(0);
    var ipad = k.map(function (b) { return b ^ 0x36; }), opad = k.map(function (b) { return b ^ 0x5c; });
    return sha256(opad.concat(sha256(ipad.concat(utf8(msg)))));
  }
  function hex(bytes) { return bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(''); }
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function base64(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < bytes.length ? B64[n & 63] : '=');
    }
    return s;
  }
  function base64url(bytes) { return base64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function deBase64url(s) {
    s = String(s).replace(/-/g, '+').replace(/_/g, '/');
    var bytes = [], buf = 0, nbits = 0;
    for (var i = 0; i < s.length; i++) {
      var v = B64.indexOf(s[i]);
      if (v < 0) continue;
      buf = (buf << 6) | v; nbits += 6;
      if (nbits >= 8) { nbits -= 8; bytes.push((buf >> nbits) & 255); }
    }
    var txt = '';
    for (var j = 0; j < bytes.length; j++) txt += '%' + (bytes[j] < 16 ? '0' : '') + bytes[j].toString(16);
    return decodeURIComponent(txt);
  }

  // Copia profunda (para o "banco" não compartilhar objetos com o código do aluno)
  function clonar(v) {
    if (v === null || typeof v !== 'object') return v;
    if (v instanceof Date) return new Date(v.getTime());
    if (v instanceof ObjectId) return v;
    if (v instanceof RegExp) return v;
    if (Array.isArray(v)) return v.map(clonar);
    var o = {};
    Object.keys(v).forEach(function (k) { o[k] = clonar(v[k]); });
    return o;
  }

  // ---------- MongoDB (na memória) ----------
  var contadorId = 0;
  function ObjectId(valor) {
    if (!(this instanceof ObjectId)) return new ObjectId(valor);
    if (valor instanceof ObjectId) valor = valor.hex;
    if (valor !== undefined) {
      if (!/^[0-9a-f]{24}$/i.test(String(valor))) throw new Error('input must be a 24 character hex string');
      this.hex = String(valor).toLowerCase();
    } else {
      contadorId++;
      this.hex = '665f1c2a' + ('0000000000000000' + contadorId.toString(16)).slice(-16);
    }
  }
  ObjectId.prototype.toString = function () { return this.hex; };
  ObjectId.prototype.toHexString = function () { return this.hex; };
  ObjectId.prototype.toJSON = function () { return this.hex; };
  ObjectId.prototype.equals = function (o) { return String(o) === this.hex; };
  ObjectId.isValid = function (v) { return /^[0-9a-f]{24}$/i.test(String(v)); };
  ObjectId.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () { return 'new ObjectId(\'' + this.hex + '\')'; };

  function pegar(doc, caminho) {
    return caminho.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, doc);
  }
  function igual(a, b) {
    if (a instanceof ObjectId || b instanceof ObjectId) return String(a) === String(b);
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (Array.isArray(a) && !Array.isArray(b)) return a.some(function (x) { return igual(x, b); });
    if (a && b && typeof a === 'object' && typeof b === 'object') return JSON.stringify(a) === JSON.stringify(b);
    return a === b;
  }
  function comparar(a, b) {
    if (a instanceof Date) a = a.getTime();
    if (b instanceof Date) b = b.getTime();
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function casaFiltro(doc, filtro) {
    if (!filtro) return true;
    return Object.keys(filtro).every(function (k) {
      var cond = filtro[k];
      if (k === '$or') return cond.some(function (f) { return casaFiltro(doc, f); });
      if (k === '$and') return cond.every(function (f) { return casaFiltro(doc, f); });
      if (k === '$nor') return !cond.some(function (f) { return casaFiltro(doc, f); });
      var v = pegar(doc, k);
      if (cond instanceof RegExp) return typeof v === 'string' && cond.test(v);
      if (cond && typeof cond === 'object' && !(cond instanceof ObjectId) && !(cond instanceof Date) && !Array.isArray(cond) && Object.keys(cond).some(function (o) { return o[0] === '$'; })) {
        return Object.keys(cond).every(function (op) {
          var x = cond[op];
          switch (op) {
            case '$eq': return igual(v, x);
            case '$ne': return !igual(v, x);
            case '$gt': return v != null && comparar(v, x) > 0;
            case '$gte': return v != null && comparar(v, x) >= 0;
            case '$lt': return v != null && comparar(v, x) < 0;
            case '$lte': return v != null && comparar(v, x) <= 0;
            case '$in': return x.some(function (y) { return igual(v, y); });
            case '$nin': return !x.some(function (y) { return igual(v, y); });
            case '$exists': return (v !== undefined) === !!x;
            case '$regex': return typeof v === 'string' && new RegExp(x, cond.$options || '').test(v);
            case '$options': return true;
            case '$size': return Array.isArray(v) && v.length === x;
            default: throw new Error('Operador ' + op + ' não é suportado aqui no CodeQuest');
          }
        });
      }
      return igual(v, cond);
    });
  }
  function definir(doc, caminho, valor) {
    var partes = caminho.split('.'), o = doc;
    for (var i = 0; i < partes.length - 1; i++) { if (o[partes[i]] == null || typeof o[partes[i]] !== 'object') o[partes[i]] = {}; o = o[partes[i]]; }
    o[partes[partes.length - 1]] = valor;
  }
  function aplicar(doc, att) {
    var mudou = false;
    var ops = Object.keys(att);
    if (!ops.length || ops.some(function (o) { return o[0] !== '$'; })) throw new Error('A atualização precisa usar operadores como $set ou $inc (ex: { $set: { preco: 50 } })');
    ops.forEach(function (op) {
      Object.keys(att[op]).forEach(function (campo) {
        var x = clonar(att[op][campo]), antes = JSON.stringify(pegar(doc, campo));
        if (op === '$set') definir(doc, campo, x);
        else if (op === '$inc') definir(doc, campo, (pegar(doc, campo) || 0) + x);
        else if (op === '$mul') definir(doc, campo, (pegar(doc, campo) || 0) * x);
        else if (op === '$unset') { var partes = campo.split('.'); var o = partes.length > 1 ? pegar(doc, partes.slice(0, -1).join('.')) : doc; if (o) delete o[partes[partes.length - 1]]; }
        else if (op === '$push') { var arr = pegar(doc, campo) || []; arr.push(x); definir(doc, campo, arr); }
        else if (op === '$pull') { var a2 = pegar(doc, campo) || []; definir(doc, campo, a2.filter(function (y) { return !igual(y, x); })); }
        else if (op === '$addToSet') { var a3 = pegar(doc, campo) || []; if (!a3.some(function (y) { return igual(y, x); })) a3.push(x); definir(doc, campo, a3); }
        else throw new Error('Operador ' + op + ' não é suportado aqui no CodeQuest');
        if (JSON.stringify(pegar(doc, campo)) !== antes) mudou = true;
      });
    });
    return mudou;
  }
  function projetar(doc, proj) {
    if (!proj || !Object.keys(proj).length) return doc;
    var incluir = Object.keys(proj).some(function (k) { return proj[k] && k !== '_id'; });
    var r = {};
    if (incluir) {
      if (proj._id !== 0 && proj._id !== false) r._id = doc._id;
      Object.keys(proj).forEach(function (k) { if (proj[k] && pegar(doc, k) !== undefined) definir(r, k, pegar(doc, k)); });
    } else {
      r = doc;
      Object.keys(proj).forEach(function (k) { if (!proj[k]) delete r[k]; });
    }
    return r;
  }
  function criarMongo() {
    var bancos = {};
    function colecao(banco, nome) {
      var dados = (bancos[banco] = bancos[banco] || {})[nome] = (bancos[banco] || {})[nome] || [];
      function cursor(filtro, opcoes) {
        var ordem = null, lim = 0, pular = 0, proj = (opcoes && opcoes.projection) || null;
        var c = {
          sort: function (o) { ordem = o; return c; },
          limit: function (n) { lim = n; return c; },
          skip: function (n) { pular = n; return c; },
          project: function (p) { proj = p; return c; },
          toArray: function () {
            var lista = dados.filter(function (d) { return casaFiltro(d, filtro); }).map(clonar);
            if (ordem) {
              var chaves = Object.keys(ordem);
              lista.sort(function (a, b) { for (var i = 0; i < chaves.length; i++) { var r = comparar(pegar(a, chaves[i]), pegar(b, chaves[i])) * (ordem[chaves[i]] < 0 ? -1 : 1); if (r) return r; } return 0; });
            }
            lista = lista.slice(pular, lim ? pular + lim : undefined).map(function (d) { return projetar(d, proj); });
            return Promise.resolve(lista);
          }
        };
        return c;
      }
      function achar(filtro) { return dados.find(function (d) { return casaFiltro(d, filtro); }); }
      return {
        collectionName: nome,
        insertOne: function (doc) {
          var novo = clonar(doc);
          if (novo._id === undefined) novo = Object.assign({ _id: new ObjectId() }, novo);
          if (dados.some(function (d) { return igual(d._id, novo._id); })) return Promise.reject(new Error('E11000 duplicate key error: _id já existe'));
          doc._id = novo._id;
          dados.push(novo);
          return Promise.resolve({ acknowledged: true, insertedId: novo._id });
        },
        insertMany: function (docs) {
          var ids = {};
          docs.forEach(function (doc, i) { var novo = clonar(doc); if (novo._id === undefined) novo = Object.assign({ _id: new ObjectId() }, novo); doc._id = novo._id; dados.push(novo); ids[i] = novo._id; });
          return Promise.resolve({ acknowledged: true, insertedCount: docs.length, insertedIds: ids });
        },
        find: function (filtro, opcoes) { return cursor(filtro || {}, opcoes); },
        findOne: function (filtro, opcoes) { var d = achar(filtro || {}); return Promise.resolve(d ? projetar(clonar(d), opcoes && opcoes.projection) : null); },
        updateOne: function (filtro, att, opcoes) {
          var d = achar(filtro || {});
          if (!d && opcoes && opcoes.upsert) { var novo = {}; Object.keys(filtro).forEach(function (k) { if (k[0] !== '$') definir(novo, k, clonar(filtro[k])); }); novo._id = new ObjectId(); aplicar(novo, att); dados.push(novo); return Promise.resolve({ acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedId: novo._id, upsertedCount: 1 }); }
          var mudou = d ? aplicar(d, att) : false;
          return Promise.resolve({ acknowledged: true, matchedCount: d ? 1 : 0, modifiedCount: mudou ? 1 : 0 });
        },
        updateMany: function (filtro, att) {
          var achados = dados.filter(function (d) { return casaFiltro(d, filtro || {}); }), n = 0;
          achados.forEach(function (d) { if (aplicar(d, att)) n++; });
          return Promise.resolve({ acknowledged: true, matchedCount: achados.length, modifiedCount: n });
        },
        findOneAndUpdate: function (filtro, att, opcoes) {
          var d = achar(filtro || {});
          if (!d) return Promise.resolve(null);
          var antes = clonar(d);
          aplicar(d, att);
          return Promise.resolve(opcoes && opcoes.returnDocument === 'after' ? clonar(d) : antes);
        },
        deleteOne: function (filtro) {
          var i = dados.findIndex(function (d) { return casaFiltro(d, filtro || {}); });
          if (i >= 0) dados.splice(i, 1);
          return Promise.resolve({ acknowledged: true, deletedCount: i >= 0 ? 1 : 0 });
        },
        deleteMany: function (filtro) {
          var antes = dados.length;
          for (var i = dados.length - 1; i >= 0; i--) if (casaFiltro(dados[i], filtro || {})) dados.splice(i, 1);
          return Promise.resolve({ acknowledged: true, deletedCount: antes - dados.length });
        },
        countDocuments: function (filtro) { return Promise.resolve(dados.filter(function (d) { return casaFiltro(d, filtro || {}); }).length); },
        createIndex: function () { return Promise.resolve('indice'); },
        aggregate: function () { throw new Error('aggregate não está disponível aqui no CodeQuest; use find, sort e limit'); }
      };
    }
    function MongoClient(url) {
      this.url = url;
      var conectado = false;
      this.connect = function () {
        if (!/^mongodb(\+srv)?:\/\//.test(String(url))) return Promise.reject(new Error('Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"'));
        conectado = true;
        return Promise.resolve(this);
      };
      this.db = function (nome) {
        if (!conectado) throw new Error('MongoClient must be connected before calling MongoClient.prototype.db');
        nome = nome || 'test';
        return { databaseName: nome, collection: function (c) { return colecao(nome, c); } };
      };
      this.close = function () { conectado = false; return Promise.resolve(); };
    }
    return { MongoClient: MongoClient, ObjectId: ObjectId };
  }

  // ---------- Pedido e resposta HTTP ----------
  var TEXTO_STATUS = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error' };

  function lerQuery(qs) {
    var q = {};
    if (!qs) return q;
    qs.split('&').forEach(function (par) {
      if (!par) return;
      var i = par.indexOf('='), k = decodeURIComponent((i < 0 ? par : par.slice(0, i)).replace(/\+/g, ' ')), v = i < 0 ? '' : decodeURIComponent(par.slice(i + 1).replace(/\+/g, ' '));
      if (q[k] === undefined) q[k] = v; else if (Array.isArray(q[k])) q[k].push(v); else q[k] = [q[k], v];
    });
    return q;
  }

  function criarResposta(fim, aoImprimir) {
    var res = {
      statusCode: 200, headersSent: false, locals: {}, _cab: {},
      status: function (c) { res.statusCode = c; return res; },
      set: function (n, v) { if (typeof n === 'object') { Object.keys(n).forEach(function (k) { res._cab[k.toLowerCase()] = String(n[k]); }); } else res._cab[String(n).toLowerCase()] = String(v); return res; },
      header: function (n, v) { return res.set(n, v); },
      setHeader: function (n, v) { res._cab[String(n).toLowerCase()] = String(v); return res; },
      get: function (n) { return res._cab[String(n).toLowerCase()]; },
      getHeader: function (n) { return res._cab[String(n).toLowerCase()]; },
      type: function (t) { res._cab['content-type'] = t === 'json' ? 'application/json' : t === 'html' ? 'text/html' : t === 'text' ? 'text/plain' : t; return res; },
      writeHead: function (c, cab) { res.statusCode = c; if (cab) res.set(cab); return res; },
      _corpo: '',
      write: function (txt) { res._corpo += String(txt); return true; },
      end: function (txt) {
        if (res.headersSent) { aoImprimir('Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'); return res; }
        if (txt !== undefined) res._corpo += String(txt);
        res.headersSent = true;
        fim({ status: res.statusCode, cab: res._cab, corpo: res._corpo });
        return res;
      },
      json: function (obj) {
        if (!res._cab['content-type']) res._cab['content-type'] = 'application/json; charset=utf-8';
        return res.end(obj === undefined ? '' : JSON.stringify(obj));
      },
      send: function (x) {
        if (x !== null && typeof x === 'object') return res.json(x);
        if (typeof x === 'number') { res.statusCode = x; x = TEXTO_STATUS[x] || String(x); }
        if (!res._cab['content-type']) res._cab['content-type'] = 'text/html; charset=utf-8';
        return res.end(x === undefined ? '' : String(x));
      },
      sendStatus: function (c) { res.statusCode = c; res._cab['content-type'] = 'text/plain; charset=utf-8'; return res.end(TEXTO_STATUS[c] || String(c)); },
      redirect: function (a, b) { var c = typeof a === 'number' ? a : 302, url = typeof a === 'number' ? b : a; res.statusCode = c; res._cab.location = url; return res.end('Redirecting to ' + url); },
      cookie: function (n, v) { res._cab['set-cookie'] = n + '=' + encodeURIComponent(v); return res; }
    };
    return res;
  }

  // ---------- Express ----------
  function compilarCaminho(caminho, fim) {
    if (caminho instanceof RegExp) return { re: caminho, nomes: [] };
    var nomes = [];
    var padrao = String(caminho).replace(/\/+$/, '').replace(/[.+?^${}()|[\]\\]/g, function (c) { return c === '?' ? '?' : '\\' + c; })
      .replace(/\\\(|\\\)/g, '')
      .replace(/:(\w+)(\?)?/g, function (_, n, opc) { nomes.push(n); return opc ? '?([^/]*)' : '([^/]+)'; })
      .replace(/\*/g, '(.*)');
    return { re: new RegExp('^' + padrao + (fim ? '/?$' : '(?=/|$)'), 'i'), nomes: nomes };
  }

  function criarRoteador(aoImprimir) {
    var camadas = [];
    function r() {}
    function adicionar(metodo, caminho, fns) {
      fns = [].concat.apply([], fns);
      fns.forEach(function (f) { if (typeof f !== 'function' && !(f && f.handle)) throw new TypeError('Route.' + (metodo || 'use') + '() requires a callback function but got a ' + (f === undefined ? 'undefined' : typeof f)); });
      camadas.push({ metodo: metodo, caminho: caminho, comp: compilarCaminho(caminho, !!metodo), fns: fns });
    }
    ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(function (m) {
      r[m] = function (caminho) { adicionar(m === 'all' ? '*' : m.toUpperCase(), caminho, Array.prototype.slice.call(arguments, 1)); return r; };
    });
    r.use = function (a) {
      var args = Array.prototype.slice.call(arguments);
      var caminho = '/';
      if (typeof a === 'string' || a instanceof RegExp) { caminho = a; args = args.slice(1); }
      adicionar(null, caminho === '/' ? '' : caminho, args);
      return r;
    };
    r.route = function (caminho) {
      var o = {};
      ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(function (m) { o[m] = function () { r[m].apply(null, [caminho].concat(Array.prototype.slice.call(arguments))); return o; }; });
      return o;
    };
    r.handle = function (req, res, sair) {
      var i = 0;
      var urlOriginal = req.url, baseOriginal = req.baseUrl || '';
      function proximo(err) {
        if (err === 'route') err = undefined;
        if (err === 'router') return sair();
        if (res.headersSent) return;
        var camada;
        while ((camada = camadas[i++])) {
          var caminho = req.url.split('?')[0] || '/';
          var m = camada.comp.re.exec(caminho);
          if (!m) continue;
          if (camada.metodo && camada.metodo !== '*' && camada.metodo !== req.method && !(camada.metodo === 'GET' && req.method === 'HEAD')) continue;
          var params = {};
          camada.comp.nomes.forEach(function (n, k) { if (m[k + 1] !== undefined) params[n] = decodeURIComponent(m[k + 1]); });
          if (camada.metodo) req.params = params; else if (Object.keys(params).length) req.params = Object.assign({}, req.params, params);
          return rodarCamada(camada, m, err);
        }
        sair(err);
      }
      function rodarCamada(camada, m, err) {
        var fns = camada.fns, j = 0;
        var prefixo = camada.metodo ? '' : m[0];
        function seguinte(e) {
          if (e === 'route') { return proximo(); }
          if (e !== undefined) err = e;
          if (res.headersSent) return;
          var f = fns[j++];
          if (!f) { req.url = urlOriginal; req.baseUrl = baseOriginal; return proximo(err); }
          if (f.handle) { // roteador montado com app.use('/api', router)
            if (err) return seguinte(err);
            req.baseUrl = baseOriginal + prefixo;
            req.url = req.url.slice(prefixo.length) || '/';
            if (req.url[0] !== '/') req.url = '/' + req.url;
            req.path = req.url.split('?')[0];
            return f.handle(req, res, function (e2) { req.url = urlOriginal; req.baseUrl = baseOriginal; req.path = urlOriginal.split('?')[0]; seguinte(e2); });
          }
          var ehErro = f.length === 4;
          if (!!err !== ehErro) return seguinte();
          try {
            var ret = ehErro ? f(err, req, res, seguinte) : f(req, res, seguinte);
            if (ret && typeof ret.then === 'function') ret.then(null, function (e3) { seguinte(e3 || new Error('Promise rejeitada')); });
          } catch (e4) { err = undefined; seguinte(e4); }
        }
        seguinte();
      }
      proximo();
    };
    return r;
  }

  function criarExpress(ambiente, aoImprimir) {
    function express() {
      var app = criarRoteador(aoImprimir);
      var ajustes = {};
      var getRota = app.get;
      app.get = function (a) { if (arguments.length === 1 && typeof a === 'string') return ajustes[a]; return getRota.apply(null, arguments); };
      app.set = function (k, v) { ajustes[k] = v; return app; };
      app.locals = {};
      app.listen = function (porta, cb) {
        if (typeof porta === 'function') { cb = porta; porta = 3000; }
        porta = Number(porta) || 3000;
        ambiente.servidores[porta] = { tipo: 'express', app: app };
        ambiente.ultimaPorta = porta;
        if (cb) Promise.resolve().then(function () { cb(); });
        return { close: function (f) { delete ambiente.servidores[porta]; if (f) f(); }, address: function () { return { port: porta }; } };
      };
      app.__express = true;
      return app;
    }
    express.json = function () {
      return function json(req, res, next) {
        var tipo = String(req.headers['content-type'] || '');
        if (req._corpoTexto && /json/i.test(tipo)) {
          try { req.body = JSON.parse(req._corpoTexto); } catch (e) { var err = new SyntaxError(e.message); err.status = 400; err.type = 'entity.parse.failed'; return next(err); }
        } else if (req.body === undefined) req.body = {};
        next();
      };
    };
    express.urlencoded = function () {
      return function (req, res, next) {
        if (req._corpoTexto && /x-www-form-urlencoded/i.test(String(req.headers['content-type'] || ''))) req.body = lerQuery(req._corpoTexto);
        else if (req.body === undefined) req.body = {};
        next();
      };
    };
    express.static = function () { return function (req, res, next) { next(); }; };
    express.Router = function () { return criarRoteador(aoImprimir); };
    return express;
  }

  // ---------- fetch(): o "navegador" que faz pedidos ao servidor ----------
  function criarFetch(ambiente, aoImprimir) {
    return function fetch(url, opcoes) {
      opcoes = opcoes || {};
      return new Promise(function (resolve, reject) {
        var m = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::(\d+))?(\/.*)?$/i.exec(String(url));
        var porta, caminho;
        if (m) { porta = Number(m[1] || 80); caminho = m[2] || '/'; }
        else if (String(url)[0] === '/') { porta = ambiente.ultimaPorta; caminho = String(url); }
        else return reject(new TypeError('fetch failed: aqui no CodeQuest só dá para acessar o seu próprio servidor (http://localhost:PORTA/...). Endereço recebido: ' + url));
        var serv = ambiente.servidores[porta];
        if (!serv) return reject(new TypeError('fetch failed: nenhum servidor está ouvindo na porta ' + porta + '. Você chamou app.listen(' + porta + ')?'));
        var cab = {};
        var h = opcoes.headers || {};
        if (typeof h.forEach === 'function' && !Array.isArray(h)) h.forEach(function (v, k) { cab[k.toLowerCase()] = String(v); });
        else Object.keys(h).forEach(function (k) { cab[k.toLowerCase()] = String(h[k]); });
        var metodo = String(opcoes.method || 'GET').toUpperCase();
        var corpo = opcoes.body === undefined || opcoes.body === null ? '' : String(opcoes.body);
        if (corpo && !cab['content-type']) cab['content-type'] = 'text/plain;charset=UTF-8';
        var terminou = false;
        function fim(r) {
          if (terminou) return;
          terminou = true;
          var cabResp = r.cab;
          resolve({
            status: r.status, ok: r.status >= 200 && r.status < 300, statusText: TEXTO_STATUS[r.status] || '', url: String(url),
            headers: { get: function (n) { var v = cabResp[String(n).toLowerCase()]; return v === undefined ? null : v; } },
            text: function () { return Promise.resolve(r.corpo); },
            json: function () {
              try { return Promise.resolve(JSON.parse(r.corpo)); }
              catch (e) { return Promise.reject(new SyntaxError('Unexpected token in JSON: a resposta não é JSON (veio: "' + String(r.corpo).slice(0, 40) + '")')); }
            }
          });
        }
        var res = criarResposta(fim, aoImprimir);
        var qs = caminho.indexOf('?') >= 0 ? caminho.slice(caminho.indexOf('?') + 1) : '';
        var req = {
          method: metodo, url: caminho, originalUrl: caminho, path: caminho.split('?')[0], baseUrl: '',
          headers: cab, query: lerQuery(qs), params: {}, body: undefined, _corpoTexto: corpo, ip: '127.0.0.1', hostname: 'localhost', protocol: 'http',
          get: function (n) { return cab[String(n).toLowerCase()]; },
          header: function (n) { return cab[String(n).toLowerCase()]; },
          on: function (ev, fn) {
            if (ev === 'data' && corpo) Promise.resolve().then(function () { fn(corpo); });
            if (ev === 'end') Promise.resolve().then(function () { Promise.resolve().then(fn); });
            return req;
          }
        };
        // o servidor responde "depois", como na rede de verdade
        Promise.resolve().then(function () {
          if (serv.tipo === 'http') {
            try {
              var ret = serv.fn(req, res);
              if (ret && ret.then) ret.then(null, function (e) { aoImprimir(descrever(e)); fim({ status: 500, cab: {}, corpo: '' }); });
            } catch (e) { aoImprimir(descrever(e)); fim({ status: 500, cab: {}, corpo: '' }); }
            return;
          }
          serv.app.handle(req, res, function (err) {
            if (res.headersSent) return;
            if (err) {
              var st = err.status || err.statusCode || 500;
              if (st >= 500) aoImprimir(descrever(err));
              res._cab = { 'content-type': 'text/html; charset=utf-8' };
              res.statusCode = st;
              res.end(st >= 500 ? 'Internal Server Error' : (err.message || TEXTO_STATUS[st]));
            } else {
              res.statusCode = 404;
              res._cab = { 'content-type': 'text/html; charset=utf-8' };
              res.end('Cannot ' + metodo + ' ' + req.path);
            }
          });
        });
      });
    };
  }
  function descrever(e) {
    if (!e || typeof e !== 'object') return 'Error: ' + String(e);
    return (e.name || 'Error') + ': ' + e.message;
  }

  // ---------- Os outros módulos ----------
  function criarJwt() {
    function JsonWebTokenError(msg) { var e = new Error(msg); e.name = 'JsonWebTokenError'; return e; }
    function segundos(x) {
      if (typeof x === 'number') return x;
      var m = /^(\d+)\s*(s|m|h|d)?$/.exec(String(x));
      if (!m) throw new Error('"expiresIn" deve ser um número de segundos ou algo como "1h", "7d"');
      return Number(m[1]) * ({ s: 1, m: 60, h: 3600, d: 86400 }[m[2] || 's']);
    }
    return {
      sign: function (payload, segredo, opcoes) {
        if (!segredo) throw new Error('secretOrPrivateKey must have a value');
        opcoes = opcoes || {};
        var corpo = Object.assign({}, payload);
        corpo.iat = Math.floor(Date.now() / 1000);
        if (opcoes.expiresIn !== undefined) corpo.exp = corpo.iat + segundos(opcoes.expiresIn);
        var h = base64url(utf8(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
        var p = base64url(utf8(JSON.stringify(corpo)));
        return h + '.' + p + '.' + base64url(hmac(segredo, h + '.' + p));
      },
      verify: function (token, segredo) {
        var partes = String(token || '').split('.');
        if (partes.length !== 3) throw JsonWebTokenError('jwt malformed');
        if (base64url(hmac(segredo, partes[0] + '.' + partes[1])) !== partes[2]) throw JsonWebTokenError('invalid signature');
        var corpo = JSON.parse(deBase64url(partes[1]));
        if (corpo.exp && Math.floor(Date.now() / 1000) >= corpo.exp) { var e = new Error('jwt expired'); e.name = 'TokenExpiredError'; throw e; }
        return corpo;
      },
      decode: function (token) {
        try { return JSON.parse(deBase64url(String(token).split('.')[1])); } catch (e) { return null; }
      }
    };
  }
  function criarBcrypt() {
    var ALF = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function sal(rodadas) {
      var s = '';
      for (var i = 0; i < 22; i++) s += ALF[Math.floor(Math.random() * 64)];
      return '$2a$' + ('0' + (rodadas || 10)).slice(-2) + '$' + s;
    }
    function resumo(salStr, senha) {
      var b = sha256(utf8(salStr + String(senha)));
      return base64(b).replace(/[+=]/g, '.').replace(/\//g, '/').slice(0, 31);
    }
    function hashSync(senha, s) {
      if (senha === undefined || senha === null) throw new Error('Illegal arguments: ' + typeof senha);
      if (typeof s === 'number' || s === undefined) s = sal(s);
      return s + resumo(s, senha);
    }
    function compareSync(senha, hash) {
      hash = String(hash || '');
      if (hash.length !== 60) return false;
      return resumo(hash.slice(0, 29), senha) === hash.slice(29);
    }
    return {
      genSaltSync: sal, genSalt: function (r) { return Promise.resolve(sal(r)); },
      hashSync: hashSync, hash: function (senha, s) { try { return Promise.resolve(hashSync(senha, s)); } catch (e) { return Promise.reject(e); } },
      compareSync: compareSync, compare: function (senha, hash) { return Promise.resolve(compareSync(senha, hash)); }
    };
  }
  function criarFs(arquivos) {
    function erroNaoExiste(p) { var e = new Error("ENOENT: no such file or directory, open '" + p + "'"); e.code = 'ENOENT'; return e; }
    var fs = {
      readFileSync: function (p) { p = String(p).replace(/^\.\//, ''); if (!(p in arquivos)) throw erroNaoExiste(p); return arquivos[p]; },
      writeFileSync: function (p, txt) { arquivos[String(p).replace(/^\.\//, '')] = String(txt); },
      appendFileSync: function (p, txt) { p = String(p).replace(/^\.\//, ''); arquivos[p] = (arquivos[p] || '') + String(txt); },
      existsSync: function (p) { return String(p).replace(/^\.\//, '') in arquivos; },
      unlinkSync: function (p) { p = String(p).replace(/^\.\//, ''); if (!(p in arquivos)) throw erroNaoExiste(p); delete arquivos[p]; }
    };
    fs.promises = {
      readFile: function (p, e) { try { return Promise.resolve(fs.readFileSync(p, e)); } catch (x) { return Promise.reject(x); } },
      writeFile: function (p, t) { fs.writeFileSync(p, t); return Promise.resolve(); },
      appendFile: function (p, t) { fs.appendFileSync(p, t); return Promise.resolve(); }
    };
    return fs;
  }

  // ---------- Monta tudo para uma execução ----------
  function criarAmbiente(aoImprimir, opcoes) {
    opcoes = opcoes || {};
    contadorId = 0; // ids previsíveis a cada execução
    var ambiente = { servidores: {}, ultimaPorta: 3000 };
    var arquivos = Object.assign({}, opcoes.arquivos || {});
    var env = Object.assign({}, opcoes.env || {});
    var cacheMod = {};
    var contUuid = 0;
    var express = criarExpress(ambiente, aoImprimir);
    var fabricas = {
      express: function () { return express; },
      http: function () {
        return {
          createServer: function (fn) {
            return { listen: function (porta, cb) { porta = Number(porta) || 3000; ambiente.servidores[porta] = { tipo: 'http', fn: fn }; ambiente.ultimaPorta = porta; if (cb) Promise.resolve().then(cb); return this; }, close: function () {} };
          },
          STATUS_CODES: TEXTO_STATUS
        };
      },
      jsonwebtoken: criarJwt,
      bcryptjs: criarBcrypt,
      bcrypt: criarBcrypt,
      mongodb: criarMongo,
      cors: function () { return function () { return function (req, res, next) { res.set('Access-Control-Allow-Origin', '*'); next(); }; }; },
      dotenv: function () {
        return { config: function () {
          var txt = arquivos['.env'];
          if (txt === undefined) return { parsed: {} };
          var lido = {};
          txt.split('\n').forEach(function (l) { var m = /^\s*([\w.]+)\s*=\s*(.*?)\s*$/.exec(l); if (m && !/^#/.test(l.trim())) { lido[m[1]] = m[2].replace(/^["']|["']$/g, ''); if (env[m[1]] === undefined) env[m[1]] = lido[m[1]]; } });
          return { parsed: lido };
        } };
      },
      crypto: function () {
        return {
          randomUUID: function () { contUuid++; var h = ('000000000000' + contUuid.toString(16)).slice(-12); return '5f3c2a1b-0d4e-4c6f-8a7b-' + h; },
          createHash: function () { var dados = ''; var o = { update: function (x) { dados += String(x); return o; }, digest: function (f) { var b = sha256(utf8(dados)); return f === 'base64' ? base64(b) : hex(b); } }; return o; },
          randomBytes: function (n) { var b = []; for (var i = 0; i < n; i++) b.push(Math.floor(Math.random() * 256)); return { toString: function (f) { return f === 'base64' ? base64(b) : hex(b); } }; }
        };
      },
      path: function () {
        return {
          join: function () { return Array.prototype.slice.call(arguments).join('/').replace(/\/+/g, '/').replace(/\/\.\//g, '/'); },
          extname: function (p) { var m = /\.[^./]*$/.exec(String(p)); return m ? m[0] : ''; },
          basename: function (p) { return String(p).split('/').pop(); },
          resolve: function () { return '/projeto/' + Array.prototype.slice.call(arguments).join('/'); }
        };
      },
      fs: function () { return criarFs(arquivos); }
    };
    function require(nome) {
      var n = String(nome).replace(/^node:/, '');
      if (n === 'fs/promises') return require('fs').promises;
      if (/^\.\.?\//.test(n)) throw new Error("Cannot find module '" + nome + "'. Aqui no CodeQuest todo o código fica num arquivo só: escreva tudo junto, sem require de arquivos.");
      if (!fabricas[n]) {
        var e = new Error("Cannot find module '" + nome + "'. Módulos disponíveis aqui: " + Object.keys(fabricas).join(', '));
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      }
      if (!cacheMod[n]) cacheMod[n] = fabricas[n]();
      return cacheMod[n];
    }
    var module = { exports: {} };
    return {
      require: require,
      module: module,
      exports: module.exports,
      process: { env: env, argv: ['node', 'index.js'], platform: 'linux', version: 'v22.0.0', exit: function () {}, on: function () {}, cwd: function () { return '/projeto'; } },
      fetch: criarFetch(ambiente, aoImprimir),
      __dirname: '/projeto',
      __filename: '/projeto/index.js'
    };
  }

  var api = { criarAmbiente: criarAmbiente, sha256: function (s) { return hex(sha256(utf8(s))); } };
  raiz.cqNode = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
