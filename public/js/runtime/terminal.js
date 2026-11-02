// =============================================================
// terminal.js — um terminal (bash) de mentirinha com Git, npm e node,
// para a trilha "Git, Terminal e Deploy".
//
// Tudo acontece na memória: pastas, arquivos, commits, branches e até
// um "GitHub" (repositórios remotos para push, pull e clone).
// As mensagens imitam as do Git de verdade (em inglês, como você vai
// ver no seu computador), em versão resumida.
//
// Comandos: pwd ls cd mkdir touch echo cat rm mv cp clear
//           node npm (init, install, start, run) gh (repo create)
//           git (init config status add commit log diff branch switch
//                checkout restore merge remote push pull fetch clone tag rm)
// Também entende: aspas, && entre comandos, > e >> para gravar em arquivo
// e # para comentários.
// Funciona no Web Worker (navegador) e no Node (validador).
// =============================================================
(function (raiz) {
  var CASA = '/home/aluno';
  var VERSOES = { express: '^4.21.2', cors: '^2.8.5', dotenv: '^16.4.5', jsonwebtoken: '^9.0.2', bcryptjs: '^2.4.3', mongodb: '^6.12.0', react: '^18.3.1', 'react-dom': '^18.3.1', nodemon: '^3.1.9', vite: '^6.0.7', helmet: '^8.0.0', axios: '^1.7.9' };

  function hash(texto) {
    // duas variações do FNV-1a de 32 bits = 16 letras hexadecimais (e repetimos para chegar a 40)
    function fnv(s, semente) { var h = semente >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
    var a = fnv(texto, 2166136261), b = fnv(texto + '#', 3166136261), c = fnv('@' + texto, 1166136261), d = fnv(texto + texto, 4166136261), e = fnv(texto.length + texto, 166136261);
    return a + b + c + d + e;
  }

  function criarTerminal(opcoes) {
    opcoes = opcoes || {};
    var arquivos = {};            // caminho absoluto -> conteúdo
    var pastas = {};              // caminho absoluto -> true
    var cwd = CASA + '/projeto';
    var repos = {};               // raiz -> repositório
    var commits = {};             // id -> commit (compartilhado com o "GitHub")
    var github = {};              // url -> { branches: {}, padrao }
    var seq = 0;
    var usuarioGit = { nome: 'Aluno', email: 'aluno@exemplo.com' };
    var usuarioGh = opcoes.usuarioGithub || 'aluno';
    [ '/', '/home', CASA, CASA + '/projeto', '/tmp' ].forEach(function (p) { pastas[p] = true; });

    // ---------- caminhos ----------
    function resolver(p) {
      if (!p || p === '~') return CASA;
      p = String(p);
      if (p.indexOf('~/') === 0) p = CASA + p.slice(1);
      var base = p[0] === '/' ? [] : cwd.split('/').filter(Boolean);
      p.split('/').forEach(function (parte) {
        if (!parte || parte === '.') return;
        if (parte === '..') base.pop(); else base.push(parte);
      });
      return '/' + base.join('/');
    }
    function exibir(p) { return p === CASA ? '~' : p.indexOf(CASA + '/') === 0 ? '~' + p.slice(CASA.length) : p; }
    function pai(p) { var i = p.lastIndexOf('/'); return i <= 0 ? '/' : p.slice(0, i); }
    function nome(p) { return p.slice(p.lastIndexOf('/') + 1); }
    function existe(p) { return pastas[p] || arquivos[p] !== undefined; }
    function filhos(p) {
      var r = {};
      var pre = p === '/' ? '/' : p + '/';
      Object.keys(pastas).concat(Object.keys(arquivos)).forEach(function (q) {
        if (q !== p && q.indexOf(pre) === 0) { var resto = q.slice(pre.length); if (resto && resto.indexOf('/') < 0) r[resto] = true; }
      });
      return Object.keys(r).sort(function (a, b) { return a.replace(/^\./, '').toLowerCase() < b.replace(/^\./, '').toLowerCase() ? -1 : 1; });
    }
    function apagar(p) {
      var pre = p + '/';
      Object.keys(arquivos).forEach(function (q) { if (q === p || q.indexOf(pre) === 0) delete arquivos[q]; });
      Object.keys(pastas).forEach(function (q) { if (q === p || q.indexOf(pre) === 0) delete pastas[q]; });
    }
    function criarPastas(p) { var partes = p.split('/').filter(Boolean), atual = ''; partes.forEach(function (x) { atual += '/' + x; pastas[atual] = true; }); }
    function gravar(p, txt) { criarPastas(pai(p)); arquivos[p] = txt; }

    // ---------- separar a linha em palavras (respeitando aspas) ----------
    function palavras(linha) {
      var r = [], atual = '', aspas = null, tem = false;
      for (var i = 0; i < linha.length; i++) {
        var c = linha[i];
        if (aspas) { if (c === aspas) aspas = null; else if (c === '\\' && aspas === '"' && (linha[i + 1] === '"' || linha[i + 1] === '\\')) atual += linha[++i]; else atual += c; continue; }
        if (c === '"' || c === "'") { aspas = c; tem = true; continue; }
        if (c === ' ' || c === '\t') { if (atual || tem) { r.push(atual); atual = ''; tem = false; } continue; }
        if (c === '>' ) { if (atual || tem) { r.push(atual); atual = ''; tem = false; } if (linha[i + 1] === '>') { r.push({ op: '>>' }); i++; } else r.push({ op: '>' }); continue; }
        atual += c;
      }
      if (aspas) throw new Error('bash: unexpected EOF while looking for matching `' + aspas + "'");
      if (atual || tem) r.push(atual);
      return r;
    }
    function separarComandos(linha) {
      // divide por && e ; fora das aspas
      var r = [], atual = '', aspas = null;
      for (var i = 0; i < linha.length; i++) {
        var c = linha[i];
        if (aspas) { if (c === aspas) aspas = null; atual += c; continue; }
        if (c === '"' || c === "'") { aspas = c; atual += c; continue; }
        if (c === '#' && (i === 0 || /\s/.test(linha[i - 1]))) break;
        if (c === '&' && linha[i + 1] === '&') { r.push({ cmd: atual, op: '&&' }); atual = ''; i++; continue; }
        if (c === ';') { r.push({ cmd: atual, op: ';' }); atual = ''; continue; }
        atual += c;
      }
      r.push({ cmd: atual, op: null });
      return r.filter(function (x) { return x.cmd.trim(); });
    }

    // ---------- Git: ajudantes ----------
    function repoDe(p) {
      var q = p;
      while (true) { if (repos[q]) return repos[q]; if (q === '/') return null; q = pai(q); }
    }
    function exigirRepo() {
      var r = repoDe(cwd);
      if (!r) throw falha('fatal: not a git repository (or any of the parent directories): .git');
      return r;
    }
    function falha(msg) { var e = new Error(msg); e.terminal = true; return e; }
    function arvoreDe(id) { return id ? commits[id].arvore : {}; }
    function headId(r) { return r.head.branch ? r.branches[r.head.branch] || null : r.head.commit; }
    function ignoradoPor(r) {
      var txt = arquivos[r.raiz + '/.gitignore'];
      var pads = (txt || '').split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l && l[0] !== '#'; });
      return function (rel) {
        return pads.some(function (pd) {
          var soPasta = /\/$/.test(pd);
          var pp = pd.replace(/\/$/, '').replace(/^\//, '');
          var re = new RegExp('^' + pp.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0001').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]').replace(/\u0001/g, '.*') + '$');
          var partes = rel.split('/');
          if (pp.indexOf('/') >= 0) { for (var k = 1; k <= partes.length; k++) { if (re.test(partes.slice(0, k).join('/')) && (!soPasta || k < partes.length)) return true; } return false; }
          for (var i = 0; i < partes.length; i++) { if (re.test(partes[i]) && (!soPasta || i < partes.length - 1)) return true; }
          return false;
        });
      };
    }
    function trabalho(r) {
      var w = {}, pre = r.raiz + '/';
      Object.keys(arquivos).forEach(function (p) {
        if (p.indexOf(pre) !== 0) return;
        var rel = p.slice(pre.length);
        if (rel === '.git' || rel.indexOf('.git/') === 0) return;
        // um repositório dentro de outro fica de fora
        if (repoDe(p) !== r) return;
        w[rel] = arquivos[p];
      });
      return w;
    }
    function estadoGit(r) {
      var H = arvoreDe(headId(r)), I = r.indice, W = trabalho(r), ign = ignoradoPor(r);
      var preparados = [], naoPreparados = [], novos = [], conflitos = [];
      var todos = {};
      Object.keys(H).concat(Object.keys(I)).forEach(function (p) { todos[p] = true; });
      Object.keys(todos).sort().forEach(function (p) {
        if (r.merge && r.merge.conflitos[p]) return;
        if (H[p] === undefined && I[p] !== undefined) preparados.push(['A', p]);
        else if (H[p] !== undefined && I[p] === undefined) preparados.push(['D', p]);
        else if (H[p] !== I[p]) preparados.push(['M', p]);
      });
      Object.keys(I).sort().forEach(function (p) {
        if (r.merge && r.merge.conflitos[p]) return;
        if (W[p] === undefined) naoPreparados.push(['D', p]);
        else if (W[p] !== I[p]) naoPreparados.push(['M', p]);
      });
      if (r.merge) Object.keys(r.merge.conflitos).sort().forEach(function (p) { conflitos.push(p); });
      Object.keys(W).sort().forEach(function (p) { if (I[p] === undefined && !(r.merge && r.merge.conflitos[p]) && !ign(p)) novos.push(p); });
      return { preparados: preparados, naoPreparados: naoPreparados, novos: novos, conflitos: conflitos, H: H, I: I, W: W };
    }
    // Agrupa arquivos não rastreados por pasta (como o git mostra: "pasta/")
    function agruparNovos(r, novos, base) {
      var I = r.indice, res = {};
      novos.forEach(function (p) {
        var partes = p.split('/');
        var mostrar = p;
        for (var k = 1; k < partes.length; k++) {
          var pref = partes.slice(0, k).join('/') + '/';
          var temRastreado = Object.keys(I).some(function (q) { return q.indexOf(pref) === 0; });
          if (!temRastreado) { mostrar = pref; break; }
        }
        res[mostrar] = true;
      });
      return Object.keys(res).sort().map(function (p) { return relativo(r, p, base); });
    }
    function relativo(r, rel, base) {
      // caminho do arquivo visto a partir da pasta atual (como o git status faz)
      var abs = r.raiz + '/' + rel.replace(/\/$/, '');
      var de = (base || cwd).split('/').filter(Boolean), para = abs.split('/').filter(Boolean);
      var i = 0; while (i < de.length && i < para.length && de[i] === para[i]) i++;
      var out = de.slice(i).map(function () { return '..'; }).concat(para.slice(i)).join('/');
      return out + (/\/$/.test(rel) ? '/' : '');
    }
    function ancestrais(id) {
      var vistos = {}, fila = id ? [id] : [];
      while (fila.length) { var c = fila.shift(); if (!c || vistos[c]) continue; vistos[c] = true; (commits[c].pais || []).forEach(function (p) { fila.push(p); }); }
      return vistos;
    }
    function baseComum(a, b) {
      var A = ancestrais(a), melhor = null;
      Object.keys(ancestrais(b)).forEach(function (c) { if (A[c] && (!melhor || commits[c].seq > commits[melhor].seq)) melhor = c; });
      return melhor;
    }
    function contarLinhas(a, b) {
      // inserções e remoções (diferença simples por linhas)
      var la = a === undefined ? [] : a.replace(/\n$/, '').split('\n'), lb = b === undefined ? [] : b.replace(/\n$/, '').split('\n');
      if (a === '') la = []; if (b === '') lb = [];
      var n = la.length, m = lb.length, t = [];
      for (var i = 0; i <= n; i++) { t.push(new Array(m + 1).fill(0)); }
      for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) t[i][j] = la[i] === lb[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
      var comum = t[0][0];
      return { mais: m - comum, menos: n - comum, la: la, lb: lb, t: t };
    }
    function diffTexto(caminho, a, b, saida) {
      var d = contarLinhas(a, b);
      saida.push('diff --git a/' + caminho + ' b/' + caminho);
      if (a === undefined) saida.push('new file mode 100644');
      if (b === undefined) saida.push('deleted file mode 100644');
      saida.push('--- ' + (a === undefined ? '/dev/null' : 'a/' + caminho));
      saida.push('+++ ' + (b === undefined ? '/dev/null' : 'b/' + caminho));
      var i = 0, j = 0, la = d.la, lb = d.lb, t = d.t;
      while (i < la.length || j < lb.length) {
        if (i < la.length && j < lb.length && la[i] === lb[j]) { saida.push(' ' + la[i]); i++; j++; }
        else if (j < lb.length && (i >= la.length || t[i][j + 1] >= t[i + 1][j])) { saida.push('+' + lb[j]); j++; }
        else { saida.push('-' + la[i]); i++; }
      }
    }
    function decoracoes(r, id) {
      var d = [];
      if (r.head.branch && r.branches[r.head.branch] === id) d.push('HEAD -> ' + r.head.branch);
      else if (!r.head.branch && r.head.commit === id) d.push('HEAD');
      Object.keys(r.branches).sort().forEach(function (b) { if (r.branches[b] === id && b !== r.head.branch) d.push(b); });
      Object.keys(r.remotos).forEach(function (nm) { var rem = r.rastreio[nm] || {}; Object.keys(rem).sort().forEach(function (b) { if (rem[b] === id) d.push(nm + '/' + b); }); });
      Object.keys(r.tags).sort().forEach(function (t) { if (r.tags[t] === id) d.push('tag: ' + t); });
      return d;
    }
    function criarCommit(r, msg, pais, arvore) {
      seq++;
      var id = hash(msg + '|' + pais.join(',') + '|' + JSON.stringify(arvore) + '|' + seq);
      commits[id] = { id: id, msg: msg, pais: pais, arvore: arvore, seq: seq, autor: usuarioGit.nome, email: usuarioGit.email };
      return id;
    }
    function dataDe(c) {
      var d = new Date(Date.UTC(2026, 10, 2, 13, 0, 0) + c.seq * 60000);
      var dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var h = new Date(d.getTime() - 3 * 3600000);
      var dois = function (n) { return (n < 10 ? '0' : '') + n; };
      return dias[h.getUTCDay()] + ' ' + meses[h.getUTCMonth()] + ' ' + h.getUTCDate() + ' ' + dois(h.getUTCHours()) + ':' + dois(h.getUTCMinutes()) + ':00 ' + h.getUTCFullYear() + ' -0300';
    }
    // Atualiza a pasta de trabalho de uma árvore para outra (mantém o que não é rastreado)
    function trocarArvore(r, de, para) {
      Object.keys(de).forEach(function (p) { if (para[p] === undefined) delete arquivos[r.raiz + '/' + p]; });
      Object.keys(para).forEach(function (p) { gravar(r.raiz + '/' + p, para[p]); });
      // remove pastas que ficaram vazias
      Object.keys(pastas).sort(function (a, b) { return b.length - a.length; }).forEach(function (q) {
        if (q.indexOf(r.raiz + '/') === 0 && q.indexOf('/.git') < 0 && !filhos(q).length) {
          var rel = q.slice(r.raiz.length + 1);
          if (Object.keys(de).some(function (p) { return p.indexOf(rel + '/') === 0; })) delete pastas[q];
        }
      });
    }
    function urlParaNome(url) { return nome(String(url).replace(/\.git$/, '').replace(/\/$/, '')); }

    // ---------- Git: os comandos ----------
    function git(args, out) {
      var sub = args[0];
      if (!sub) { out.push('usage: git <command> [<args>]'); return; }
      if (sub === '--version' || sub === 'version') { out.push('git version 2.47.1'); return; }
      if (sub === 'config') {
        var chave = args.filter(function (a) { return a[0] !== '-'; })[1], valor = args.filter(function (a) { return a[0] !== '-'; })[2];
        if (chave === 'user.name') { if (valor === undefined) out.push(usuarioGit.nome); else usuarioGit.nome = valor; }
        else if (chave === 'user.email') { if (valor === undefined) out.push(usuarioGit.email); else usuarioGit.email = valor; }
        else if (args.indexOf('--list') >= 0 || args.indexOf('-l') >= 0) { out.push('user.name=' + usuarioGit.nome, 'user.email=' + usuarioGit.email, 'init.defaultbranch=main'); }
        return;
      }
      if (sub === 'init') {
        var alvo = args[1] && args[1][0] !== '-' ? resolver(args[1]) : cwd;
        criarPastas(alvo);
        var ramo = 'main';
        var ib = args.indexOf('-b'); if (ib >= 0 && args[ib + 1]) ramo = args[ib + 1];
        if (repos[alvo]) { out.push('Reinitialized existing Git repository in ' + alvo + '/.git/'); return; }
        repos[alvo] = { raiz: alvo, branches: {}, head: { branch: ramo }, indice: {}, remotos: {}, rastreio: {}, upstream: {}, tags: {}, merge: null };
        pastas[alvo + '/.git'] = true;
        out.push('Initialized empty Git repository in ' + alvo + '/.git/');
        return;
      }
      if (sub === 'clone') {
        var url = args[1];
        if (!url) throw falha('fatal: You must specify a repository to clone.');
        var remoto = github[url.replace(/\.git$/, '') + '.git'] || github[url];
        var destino = resolver(args[2] || urlParaNome(url));
        if (existe(destino) && filhos(destino).length) throw falha("fatal: destination path '" + nome(destino) + "' already exists and is not an empty directory.");
        out.push("Cloning into '" + (args[2] || urlParaNome(url)) + "'...");
        if (!remoto) throw falha("remote: Repository not found.\nfatal: repository '" + url + "/' not found");
        criarPastas(destino); pastas[destino + '/.git'] = true;
        var rc = { raiz: destino, branches: {}, head: { branch: remoto.padrao }, indice: {}, remotos: { origin: url }, rastreio: { origin: Object.assign({}, remoto.branches) }, upstream: {}, tags: {}, merge: null };
        repos[destino] = rc;
        var idc = remoto.branches[remoto.padrao];
        if (idc) {
          rc.branches[remoto.padrao] = idc; rc.upstream[remoto.padrao] = 'origin';
          rc.indice = Object.assign({}, arvoreDe(idc));
          Object.keys(rc.indice).forEach(function (p) { gravar(destino + '/' + p, rc.indice[p]); });
        } else out.push('warning: You appear to have cloned an empty repository.');
        return;
      }
      var r = exigirRepo();
      var st, H, i;
      switch (sub) {
        case 'status': {
          st = estadoGit(r);
          if (args.indexOf('-s') >= 0 || args.indexOf('--short') >= 0) {
            var linhas = {};
            st.preparados.forEach(function (x) { linhas[x[1]] = [x[0], ' ']; });
            st.naoPreparados.forEach(function (x) { linhas[x[1]] = [(linhas[x[1]] || [' '])[0], x[0]]; });
            st.conflitos.forEach(function (p) { linhas[p] = ['U', 'U']; });
            Object.keys(linhas).sort().forEach(function (p) { out.push(linhas[p][0] + linhas[p][1] + ' ' + relativo(r, p)); });
            agruparNovos(r, st.novos).forEach(function (p) { out.push('?? ' + p); });
            return;
          }
          out.push(r.head.branch ? 'On branch ' + r.head.branch : 'HEAD detached at ' + r.head.commit.slice(0, 7));
          var up = r.head.branch && r.upstream[r.head.branch];
          if (up && headId(r)) {
            var remId = (r.rastreio[up] || {})[r.head.branch];
            if (remId === headId(r)) out.push("Your branch is up to date with '" + up + '/' + r.head.branch + "'.");
            else if (remId && ancestrais(headId(r))[remId]) { var n = Object.keys(ancestrais(headId(r))).length - Object.keys(ancestrais(remId)).length; out.push("Your branch is ahead of '" + up + '/' + r.head.branch + "' by " + n + ' commit' + (n > 1 ? 's' : '') + '.'); }
            else if (remId && ancestrais(remId)[headId(r)]) { var n2 = Object.keys(ancestrais(remId)).length - Object.keys(ancestrais(headId(r))).length; out.push("Your branch is behind '" + up + '/' + r.head.branch + "' by " + n2 + ' commit' + (n2 > 1 ? 's' : '') + '.'); }
          }
          if (!headId(r)) { out.push(''); out.push('No commits yet'); }
          if (r.merge) { out.push('You have unmerged paths.'); }
          var nomeTipo = { A: 'new file:   ', M: 'modified:   ', D: 'deleted:    ' };
          if (st.preparados.length) { out.push('', 'Changes to be committed:'); st.preparados.forEach(function (x) { out.push('        ' + nomeTipo[x[0]] + relativo(r, x[1])); }); }
          if (st.conflitos.length) { out.push('', 'Unmerged paths:'); st.conflitos.forEach(function (p) { out.push('        both modified:   ' + relativo(r, p)); }); }
          if (st.naoPreparados.length) { out.push('', 'Changes not staged for commit:'); st.naoPreparados.forEach(function (x) { out.push('        ' + nomeTipo[x[0]] + relativo(r, x[1])); }); }
          var nv = agruparNovos(r, st.novos);
          if (nv.length) { out.push('', 'Untracked files:'); nv.forEach(function (p) { out.push('        ' + p); }); }
          if (!st.preparados.length && !st.naoPreparados.length && !st.conflitos.length) {
            out.push('');
            if (nv.length) out.push('nothing added to commit but untracked files present (use "git add" to track)');
            else out.push(headId(r) ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)');
          }
          return;
        }
        case 'add': {
          var alvos = args.slice(1).filter(function (a) { return a[0] !== '-' || a === '-A'; });
          if (!alvos.length) { out.push('Nothing specified, nothing added.'); return; }
          var W = trabalho(r), ign = ignoradoPor(r);
          alvos.forEach(function (a) {
            var tudo = a === '-A' || a === '--all';
            var abs = tudo ? r.raiz : resolver(a);
            var rel = abs === r.raiz ? '' : abs.slice(r.raiz.length + 1);
            var achou = false;
            var dentro = function (p) { return !rel || p === rel || p.indexOf(rel + '/') === 0; };
            Object.keys(W).forEach(function (p) {
              if (!dentro(p)) return;
              if (r.indice[p] === undefined && ign(p)) { if (p === rel) out.push('The following paths are ignored by one of your .gitignore files:\n' + p); return; }
              r.indice[p] = W[p]; achou = true;
              if (r.merge) delete r.merge.conflitos[p];
            });
            Object.keys(r.indice).forEach(function (p) { if (dentro(p) && W[p] === undefined) { delete r.indice[p]; achou = true; } });
            if (!achou && !existe(abs) && a !== '.' && !tudo) throw falha("fatal: pathspec '" + a + "' did not match any files");
          });
          return;
        }
        case 'rm': {
          args.slice(1).filter(function (a) { return a[0] !== '-'; }).forEach(function (a) {
            var abs = resolver(a), rel = abs.slice(r.raiz.length + 1);
            if (r.indice[rel] === undefined) throw falha("fatal: pathspec '" + a + "' did not match any files");
            delete r.indice[rel];
            if (args.indexOf('--cached') < 0) delete arquivos[abs];
            out.push("rm '" + rel + "'");
          });
          return;
        }
        case 'commit': {
          var im = args.indexOf('-m'), msg = null;
          var iam = args.indexOf('-am');
          if (iam >= 0) { im = iam; }
          if (im >= 0) msg = args[im + 1];
          var mm = args.filter(function (a) { return /^--message=/.test(a); })[0]; if (mm) msg = mm.slice(10);
          if (args.indexOf('-a') >= 0 || iam >= 0) {
            var W2 = trabalho(r);
            Object.keys(r.indice).forEach(function (p) { if (W2[p] === undefined) delete r.indice[p]; else r.indice[p] = W2[p]; });
          }
          if (msg === null || msg === undefined) throw falha('error: aqui no CodeQuest use git commit -m "sua mensagem" (no terminal de verdade, sem o -m abre um editor de texto)');
          if (!msg.trim()) throw falha('Aborting commit due to empty commit message.');
          if (r.merge && Object.keys(r.merge.conflitos).length) throw falha('error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add <file>\'\nfatal: Exiting because of an unresolved conflict.');
          H = arvoreDe(headId(r));
          if (!r.merge && JSON.stringify(sortKeys(H)) === JSON.stringify(sortKeys(r.indice))) {
            st = estadoGit(r);
            out.push(r.head.branch ? 'On branch ' + r.head.branch : 'HEAD detached');
            if (st.naoPreparados.length || st.novos.length) out.push('Changes not staged for commit or untracked files present', 'no changes added to commit (use "git add" and/or "git commit -a")');
            else out.push('nothing to commit, working tree clean');
            var e = falha(''); e.silencioso = true; throw e;
          }
          var pais = headId(r) ? [headId(r)] : [];
          if (r.merge) pais.push(r.merge.com);
          var novo = criarCommit(r, msg, pais, Object.assign({}, r.indice));
          var raizCommit = !headId(r);
          if (r.head.branch) r.branches[r.head.branch] = novo; else r.head.commit = novo;
          r.merge = null;
          out.push('[' + (r.head.branch || 'detached HEAD') + (raizCommit ? ' (root-commit)' : '') + ' ' + novo.slice(0, 7) + '] ' + msg.split('\n')[0]);
          var mudados = 0, mais = 0, menos = 0, criados = [], apagados = [];
          var todos = {};
          Object.keys(H).concat(Object.keys(r.indice)).forEach(function (p) { todos[p] = true; });
          Object.keys(todos).sort().forEach(function (p) {
            if (H[p] === r.indice[p]) return;
            mudados++;
            var c = contarLinhas(H[p], r.indice[p]); mais += c.mais; menos += c.menos;
            if (H[p] === undefined) criados.push(p); if (r.indice[p] === undefined) apagados.push(p);
          });
          if (pais.length < 2) {
            out.push(' ' + mudados + ' file' + (mudados !== 1 ? 's' : '') + ' changed' + (mais || !menos ? ', ' + mais + ' insertion' + (mais !== 1 ? 's' : '') + '(+)' : '') + (menos ? ', ' + menos + ' deletion' + (menos !== 1 ? 's' : '') + '(-)' : ''));
            criados.forEach(function (p) { out.push(' create mode 100644 ' + p); });
            apagados.forEach(function (p) { out.push(' delete mode 100644 ' + p); });
          }
          return;
        }
        case 'log': {
          var inicio = headId(r);
          var ramoLog = args.slice(1).filter(function (a) { return a[0] !== '-'; })[0];
          if (ramoLog) { inicio = r.branches[ramoLog] || (ramoLog.indexOf('/') > 0 ? (r.rastreio[ramoLog.split('/')[0]] || {})[ramoLog.split('/')[1]] : null); if (!inicio) throw falha("fatal: ambiguous argument '" + ramoLog + "': unknown revision or path not in the working tree."); }
          if (!inicio) throw falha("fatal: your current branch '" + r.head.branch + "' does not have any commits yet");
          var lista = Object.keys(ancestrais(inicio)).map(function (id) { return commits[id]; }).sort(function (a, b) { return b.seq - a.seq; });
          var limite = null;
          args.forEach(function (a, k) { var m = /^-(\d+)$/.exec(a); if (m) limite = Number(m[1]); if (a === '-n') limite = Number(args[k + 1]); });
          if (limite !== null) lista = lista.slice(0, limite);
          var fmt = null;
          args.forEach(function (a) { var m = /^--(?:format|pretty)=(?:format:|tformat:)?(.*)$/.exec(a); if (m) fmt = m[1]; });
          if (args.indexOf('--oneline') >= 0) fmt = '%h%d %s';
          lista.forEach(function (c, k) {
            if (fmt !== null) {
              var dec = decoracoes(r, c.id);
              out.push(fmt.replace(/%H/g, c.id).replace(/%h/g, c.id.slice(0, 7)).replace(/%s/g, c.msg.split('\n')[0]).replace(/%an/g, c.autor).replace(/%ae/g, c.email).replace(/%d/g, dec.length ? ' (' + dec.join(', ') + ')' : '').replace(/%n/g, '\n'));
              return;
            }
            if (k) out.push('');
            var d2 = decoracoes(r, c.id);
            out.push('commit ' + c.id + (d2.length ? ' (' + d2.join(', ') + ')' : ''));
            if (c.pais.length > 1) out.push('Merge: ' + c.pais.map(function (p) { return p.slice(0, 7); }).join(' '));
            out.push('Author: ' + c.autor + ' <' + c.email + '>', 'Date:   ' + dataDe(c), '');
            c.msg.split('\n').forEach(function (l) { out.push('    ' + l); });
          });
          return;
        }
        case 'diff': {
          var preparado = args.indexOf('--staged') >= 0 || args.indexOf('--cached') >= 0;
          st = estadoGit(r);
          var A = preparado ? st.H : st.I, B = preparado ? st.I : st.W;
          var ps = {};
          Object.keys(A).concat(preparado ? Object.keys(B) : []).forEach(function (p) { ps[p] = true; });
          var so = args.slice(1).filter(function (a) { return a[0] !== '-'; }).map(function (a) { return resolver(a).slice(r.raiz.length + 1); });
          Object.keys(ps).sort().forEach(function (p) {
            if (so.length && so.indexOf(p) < 0) return;
            if (A[p] !== B[p]) diffTexto(p, A[p], B[p], out);
          });
          return;
        }
        case 'branch': {
          var opc = args.slice(1);
          var nomes = opc.filter(function (a) { return a[0] !== '-'; });
          if (opc.indexOf('-d') >= 0 || opc.indexOf('-D') >= 0) {
            nomes.forEach(function (b) {
              if (!r.branches[b]) throw falha("error: branch '" + b + "' not found");
              if (b === r.head.branch) throw falha("error: cannot delete branch '" + b + "' used by worktree at '" + r.raiz + "'");
              if (opc.indexOf('-D') < 0 && !ancestrais(headId(r))[r.branches[b]]) throw falha("error: the branch '" + b + "' is not fully merged.\nhint: If you are sure you want to delete it, run 'git branch -D " + b + "'");
              out.push('Deleted branch ' + b + ' (was ' + r.branches[b].slice(0, 7) + ').');
              delete r.branches[b];
            });
            return;
          }
          if (opc.indexOf('-m') >= 0 || opc.indexOf('-M') >= 0) {
            var velho = nomes.length > 1 ? nomes[0] : r.head.branch, novoNome = nomes[nomes.length - 1];
            if (r.branches[velho]) { r.branches[novoNome] = r.branches[velho]; delete r.branches[velho]; }
            if (r.head.branch === velho) r.head.branch = novoNome;
            if (r.upstream[velho]) { r.upstream[novoNome] = r.upstream[velho]; delete r.upstream[velho]; }
            return;
          }
          if (nomes.length) {
            if (!headId(r)) throw falha("fatal: not a valid object name: '" + r.head.branch + "'");
            if (r.branches[nomes[0]]) throw falha("fatal: a branch named '" + nomes[0] + "' already exists");
            r.branches[nomes[0]] = headId(r);
            return;
          }
          var bs = Object.keys(r.branches);
          if (r.head.branch && bs.indexOf(r.head.branch) < 0 && headId(r)) bs.push(r.head.branch);
          bs.sort().forEach(function (b) { out.push((b === r.head.branch ? '* ' : '  ') + b); });
          if (opc.indexOf('-a') >= 0) Object.keys(r.rastreio).forEach(function (nm) { Object.keys(r.rastreio[nm]).sort().forEach(function (b) { out.push('  remotes/' + nm + '/' + b); }); });
          return;
        }
        case 'switch': case 'checkout': {
          var criar = args.indexOf('-c') >= 0 || args.indexOf('-b') >= 0 || args.indexOf('-C') >= 0;
          var resto = args.slice(1).filter(function (a) { return a[0] !== '-'; });
          if (sub === 'checkout' && (args.indexOf('--') >= 0 || (resto.length && !criar && !r.branches[resto[0]] && existe(resolver(resto[0])) && r.indice[resolver(resto[0]).slice(r.raiz.length + 1)] !== undefined))) {
            resto.forEach(function (a) { var rel = resolver(a).slice(r.raiz.length + 1); if (r.indice[rel] !== undefined) gravar(resolver(a), r.indice[rel]); });
            return;
          }
          var alvoB = resto[0];
          if (!alvoB) throw falha('fatal: missing branch or commit argument');
          if (criar) {
            if (r.branches[alvoB]) throw falha("fatal: a branch named '" + alvoB + "' already exists");
            if (headId(r)) r.branches[alvoB] = headId(r);
            r.head = { branch: alvoB };
            out.push("Switched to a new branch '" + alvoB + "'");
            return;
          }
          var destinoId = r.branches[alvoB];
          if (!destinoId) {
            // existe no remoto? cria a branch local rastreando (como o git faz)
            var remB = (r.rastreio.origin || {})[alvoB];
            if (remB) { r.branches[alvoB] = remB; r.upstream[alvoB] = 'origin'; destinoId = remB; out.push("branch '" + alvoB + "' set up to track 'origin/" + alvoB + "'."); }
            else throw falha(sub === 'switch' ? "fatal: invalid reference: " + alvoB : "error: pathspec '" + alvoB + "' did not match any file(s) known to git");
          }
          if (alvoB === r.head.branch) { out.push("Already on '" + alvoB + "'"); return; }
          st = estadoGit(r);
          var de = arvoreDe(headId(r)), para = arvoreDe(destinoId);
          var sujos = st.preparados.concat(st.naoPreparados).map(function (x) { return x[1]; }).filter(function (p) { return de[p] !== para[p]; });
          if (sujos.length) throw falha('error: Your local changes to the following files would be overwritten by checkout:\n        ' + sujos.join('\n        ') + '\nPlease commit your changes or stash them before you switch branches.\nAborting');
          var mudancas = {};
          st.preparados.concat(st.naoPreparados).forEach(function (x) { mudancas[x[1]] = true; });
          var Wv = st.W, Iv = st.I;
          trocarArvore(r, de, para);
          r.indice = Object.assign({}, para);
          Object.keys(mudancas).forEach(function (p) { if (Iv[p] === undefined) delete r.indice[p]; else r.indice[p] = Iv[p]; if (Wv[p] === undefined) delete arquivos[r.raiz + '/' + p]; else gravar(r.raiz + '/' + p, Wv[p]); });
          r.head = { branch: alvoB };
          out.push("Switched to branch '" + alvoB + "'");
          return;
        }
        case 'restore': {
          var staged = args.indexOf('--staged') >= 0;
          args.slice(1).filter(function (a) { return a[0] !== '-'; }).forEach(function (a) {
            var abs = resolver(a), rel = abs.slice(r.raiz.length + 1);
            H = arvoreDe(headId(r));
            if (staged) { if (H[rel] === undefined) delete r.indice[rel]; else r.indice[rel] = H[rel]; }
            else { if (r.indice[rel] === undefined) throw falha("error: pathspec '" + a + "' did not match any file(s) known to git"); gravar(abs, r.indice[rel]); }
          });
          return;
        }
        case 'merge': {
          if (args[1] === '--abort') {
            if (!r.merge) throw falha('fatal: There is no merge to abort (MERGE_HEAD missing).');
            H = arvoreDe(headId(r));
            trocarArvore(r, trabalho(r), H);
            r.indice = Object.assign({}, H); r.merge = null;
            return;
          }
          var outro = args.slice(1).filter(function (a) { return a[0] !== '-'; })[0];
          var outroId = r.branches[outro] || (outro && outro.indexOf('/') > 0 ? (r.rastreio[outro.split('/')[0]] || {})[outro.split('/')[1]] : null);
          if (!outroId) throw falha('merge: ' + outro + ' - not something we can merge');
          return mesclar(r, outroId, outro, out);
        }
        case 'remote': {
          if (args[1] === 'add') {
            if (r.remotos[args[2]]) throw falha('error: remote ' + args[2] + ' already exists.');
            r.remotos[args[2]] = args[3]; r.rastreio[args[2]] = r.rastreio[args[2]] || {};
            return;
          }
          if (args[1] === 'remove' || args[1] === 'rm') { delete r.remotos[args[2]]; delete r.rastreio[args[2]]; return; }
          if (args[1] === 'set-url') { if (!r.remotos[args[2]]) throw falha('error: No such remote \'' + args[2] + '\''); r.remotos[args[2]] = args[3]; return; }
          Object.keys(r.remotos).sort().forEach(function (nm) {
            if (args[1] === '-v') out.push(nm + '\t' + r.remotos[nm] + ' (fetch)', nm + '\t' + r.remotos[nm] + ' (push)');
            else out.push(nm);
          });
          return;
        }
        case 'push': {
          var semOpc = args.slice(1).filter(function (a) { return a[0] !== '-'; });
          var marcarUp = args.indexOf('-u') >= 0 || args.indexOf('--set-upstream') >= 0;
          var forcar = args.indexOf('-f') >= 0 || args.indexOf('--force') >= 0;
          var nomeRem = semOpc[0], ramoP = semOpc[1];
          if (!nomeRem) {
            if (!r.head.branch || !r.upstream[r.head.branch]) {
              if (!Object.keys(r.remotos).length) throw falha('fatal: No configured push destination.');
              throw falha('fatal: The current branch ' + r.head.branch + ' has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ' + r.head.branch + '\n');
            }
            nomeRem = r.upstream[r.head.branch];
          }
          ramoP = ramoP || r.head.branch;
          var urlP = r.remotos[nomeRem];
          if (!urlP) throw falha("fatal: '" + nomeRem + "' does not appear to be a git repository\nfatal: Could not read from remote repository.");
          var gh = github[urlP];
          if (!gh) throw falha("remote: Repository not found.\nfatal: repository '" + urlP + "' not found");
          var local = r.branches[ramoP];
          if (!local) throw falha('error: src refspec ' + ramoP + ' does not match any\nerror: failed to push some refs to \'' + urlP + "'");
          var remotoId = gh.branches[ramoP];
          out.push('To ' + urlP);
          if (remotoId === local) { out.push('Everything up-to-date'); }
          else if (!remotoId) { gh.branches[ramoP] = local; out.push(' * [new branch]      ' + ramoP + ' -> ' + ramoP); }
          else if (ancestrais(local)[remotoId] || forcar) { out.push((forcar && !ancestrais(local)[remotoId] ? ' + ' : '   ') + remotoId.slice(0, 7) + (forcar && !ancestrais(local)[remotoId] ? '...' : '..') + local.slice(0, 7) + '  ' + ramoP + ' -> ' + ramoP + (forcar && !ancestrais(local)[remotoId] ? ' (forced update)' : '')); gh.branches[ramoP] = local; }
          else {
            out.push(' ! [rejected]        ' + ramoP + ' -> ' + ramoP + ' (fetch first)');
            throw falha("error: failed to push some refs to '" + urlP + "'\nhint: Updates were rejected because the remote contains work that you do not\nhint: have locally. Integrate the remote changes (e.g. 'git pull ...') before pushing again.");
          }
          (r.rastreio[nomeRem] = r.rastreio[nomeRem] || {})[ramoP] = local;
          if (!gh.padrao || !gh.branches[gh.padrao]) gh.padrao = ramoP;
          if (marcarUp) { r.upstream[ramoP] = nomeRem; out.push("branch '" + ramoP + "' set up to track '" + nomeRem + '/' + ramoP + "'."); }
          return;
        }
        case 'fetch': case 'pull': {
          var nomeR = args.slice(1).filter(function (a) { return a[0] !== '-'; })[0] || (r.head.branch && r.upstream[r.head.branch]) || 'origin';
          var urlR = r.remotos[nomeR];
          if (!urlR) throw falha("fatal: '" + nomeR + "' does not appear to be a git repository");
          var ghR = github[urlR];
          if (!ghR) throw falha("remote: Repository not found.\nfatal: repository '" + urlR + "' not found");
          var antes = Object.assign({}, r.rastreio[nomeR] || {});
          r.rastreio[nomeR] = Object.assign({}, ghR.branches);
          var novidades = Object.keys(ghR.branches).filter(function (b) { return antes[b] !== ghR.branches[b]; });
          if (novidades.length) {
            out.push('From ' + urlR);
            novidades.sort().forEach(function (b) { out.push(antes[b] ? '   ' + antes[b].slice(0, 7) + '..' + ghR.branches[b].slice(0, 7) + '  ' + b + '       -> ' + nomeR + '/' + b : ' * [new branch]      ' + b + '       -> ' + nomeR + '/' + b); });
          }
          if (sub === 'fetch') return;
          var ramoPull = args.slice(1).filter(function (a) { return a[0] !== '-'; })[1] || r.head.branch;
          var idR = ghR.branches[ramoPull];
          if (!idR) throw falha("fatal: couldn't find remote ref " + ramoPull);
          if (!r.upstream[r.head.branch]) r.upstream[r.head.branch] = nomeR;
          return mesclar(r, idR, nomeR + '/' + ramoPull, out, true);
        }
        case 'tag': {
          var nt = args.slice(1).filter(function (a) { return a[0] !== '-'; });
          if (!nt.length) { Object.keys(r.tags).sort().forEach(function (t) { out.push(t); }); return; }
          if (!headId(r)) throw falha("fatal: Failed to resolve 'HEAD' as a valid ref.");
          if (r.tags[nt[0]]) throw falha("fatal: tag '" + nt[0] + "' already exists");
          r.tags[nt[0]] = headId(r);
          return;
        }
        default:
          throw falha("git: '" + sub + "' is not a git command. See 'git --help'.");
      }
    }
    function sortKeys(o) { var r = {}; Object.keys(o).sort().forEach(function (k) { r[k] = o[k]; }); return r; }

    function mesclar(r, outroId, nomeOutro, out, viaPull) {
      var atual = headId(r);
      if (!atual) {
        r.branches[r.head.branch] = outroId;
        trocarArvore(r, {}, arvoreDe(outroId));
        r.indice = Object.assign({}, arvoreDe(outroId));
        return;
      }
      if (atual === outroId || ancestrais(atual)[outroId]) { out.push('Already up to date.'); return; }
      var st = estadoGit(r);
      if (st.preparados.length || st.naoPreparados.length) throw falha('error: Your local changes to the following files would be overwritten by merge:\n        ' + st.preparados.concat(st.naoPreparados).map(function (x) { return x[1]; }).join('\n        ') + '\nPlease commit your changes or stash them before you merge.\nAborting');
      var A = arvoreDe(atual), B = arvoreDe(outroId);
      if (ancestrais(outroId)[atual]) {
        out.push('Updating ' + atual.slice(0, 7) + '..' + outroId.slice(0, 7), 'Fast-forward');
        resumoMudancas(A, B, out);
        trocarArvore(r, A, B);
        r.indice = Object.assign({}, B);
        r.branches[r.head.branch] = outroId;
        return;
      }
      var base = arvoreDe(baseComum(atual, outroId));
      var res = {}, conflitos = {};
      var todos = {};
      [base, A, B].forEach(function (t) { Object.keys(t).forEach(function (p) { todos[p] = true; }); });
      Object.keys(todos).sort().forEach(function (p) {
        var b0 = base[p], a = A[p], b = B[p];
        if (a === b) { if (a !== undefined) res[p] = a; return; }
        if (a === b0) { if (b !== undefined) res[p] = b; return; }
        if (b === b0) { if (a !== undefined) res[p] = a; return; }
        conflitos[p] = true;
        out.push('Auto-merging ' + p);
        out.push('CONFLICT (content): Merge conflict in ' + p);
        res[p] = '<<<<<<< HEAD\n' + (a || '') + (a && !/\n$/.test(a) ? '\n' : '') + '=======\n' + (b || '') + (b && !/\n$/.test(b) ? '\n' : '') + '>>>>>>> ' + nomeOutro + '\n';
      });
      trocarArvore(r, A, res);
      if (Object.keys(conflitos).length) {
        r.indice = Object.assign({}, A);
        Object.keys(res).forEach(function (p) { if (!conflitos[p]) r.indice[p] = res[p]; });
        r.merge = { com: outroId, conflitos: conflitos };
        out.push('Automatic merge failed; fix conflicts and then commit the result.');
        return;
      }
      r.indice = Object.assign({}, res);
      var msg = viaPull ? "Merge branch '" + r.head.branch + "' of " + r.remotos[nomeOutro.split('/')[0]] : "Merge branch '" + nomeOutro + "'";
      var id = criarCommit(r, msg, [atual, outroId], Object.assign({}, res));
      r.branches[r.head.branch] = id;
      out.push("Merge made by the 'ort' strategy.");
      resumoMudancas(A, res, out);
    }
    function resumoMudancas(A, B, out) {
      var todos = {}, n = 0, mais = 0, menos = 0;
      Object.keys(A).concat(Object.keys(B)).forEach(function (p) { todos[p] = true; });
      Object.keys(todos).sort().forEach(function (p) {
        if (A[p] === B[p]) return;
        n++; var c = contarLinhas(A[p], B[p]); mais += c.mais; menos += c.menos;
        out.push(' ' + p + ' | ' + (c.mais + c.menos) + ' ' + new Array(c.mais + 1).join('+') + new Array(c.menos + 1).join('-'));
      });
      if (n) out.push(' ' + n + ' file' + (n > 1 ? 's' : '') + ' changed' + (mais ? ', ' + mais + ' insertion' + (mais > 1 ? 's' : '') + '(+)' : '') + (menos ? ', ' + menos + ' deletion' + (menos > 1 ? 's' : '') + '(-)' : ''));
    }

    // ---------- npm e node ----------
    function lerPackage(dir) {
      var p = dir + '/package.json';
      if (arquivos[p] === undefined) throw falha('npm error code ENOENT\nnpm error path ' + p + '\nnpm error enoent Could not read package.json: Error: ENOENT: no such file or directory');
      try { return JSON.parse(arquivos[p]); } catch (e) { throw falha('npm error code EJSONPARSE\nnpm error JSON.parse Invalid package.json: ' + e.message); }
    }
    async function npm(args, out, rodarNode) {
      var sub = args[0];
      if (sub === '-v' || sub === '--version') { out.push('10.9.2'); return; }
      if (sub === 'init') {
        var pkg = { name: nome(cwd).toLowerCase().replace(/[^a-z0-9-_.]/g, '-'), version: '1.0.0', description: '', main: 'index.js', scripts: { test: 'echo "Error: no test specified" && exit 1' }, keywords: [], author: '', license: 'ISC' };
        gravar(cwd + '/package.json', JSON.stringify(pkg, null, 2) + '\n');
        out.push('Wrote to ' + cwd + '/package.json:', '', JSON.stringify(pkg, null, 2), '');
        return;
      }
      if (sub === 'install' || sub === 'i' || sub === 'add') {
        var pk = lerPackage(cwd);
        var dev = args.indexOf('-D') >= 0 || args.indexOf('--save-dev') >= 0;
        var nomes = args.slice(1).filter(function (a) { return a[0] !== '-'; });
        var campo = dev ? 'devDependencies' : 'dependencies';
        if (nomes.length) {
          pk[campo] = pk[campo] || {};
          nomes.forEach(function (n) {
            var m = /^(@?[^@]+)(?:@(.+))?$/.exec(n);
            if (!VERSOES[m[1]] && !m[2]) throw falha('npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/' + m[1] + " - Not found\nnpm error 404  '" + m[1] + "@*' is not in this registry.");
            pk[campo][m[1]] = m[2] ? '^' + m[2].replace(/^\^/, '') : VERSOES[m[1]];
          });
          var ord = {}; Object.keys(pk[campo]).sort().forEach(function (k) { ord[k] = pk[campo][k]; }); pk[campo] = ord;
          gravar(cwd + '/package.json', JSON.stringify(pk, null, 2) + '\n');
        }
        var todas = Object.keys(pk.dependencies || {}).concat(Object.keys(pk.devDependencies || {}));
        todas.forEach(function (n) { criarPastas(cwd + '/node_modules/' + n); gravar(cwd + '/node_modules/' + n + '/package.json', JSON.stringify({ name: n, version: (pk.dependencies && pk.dependencies[n] || pk.devDependencies[n]).replace(/^\^/, '') })); });
        gravar(cwd + '/package-lock.json', JSON.stringify({ name: pk.name, lockfileVersion: 3, packages: {} }, null, 2) + '\n');
        out.push('', 'added ' + (todas.length * 12 + 7) + ' packages, and audited ' + (todas.length * 12 + 8) + ' packages in 2s', '', 'found 0 vulnerabilities');
        return;
      }
      if (sub === 'uninstall' || sub === 'remove' || sub === 'rm') {
        var pu = lerPackage(cwd);
        args.slice(1).forEach(function (n) { if (pu.dependencies) delete pu.dependencies[n]; if (pu.devDependencies) delete pu.devDependencies[n]; apagar(cwd + '/node_modules/' + n); });
        gravar(cwd + '/package.json', JSON.stringify(pu, null, 2) + '\n');
        out.push('', 'removed ' + (args.length - 1) + ' package' + (args.length > 2 ? 's' : '') + ' in 1s');
        return;
      }
      if (sub === 'start' || sub === 'run' || sub === 'test' || sub === 't') {
        var ps = lerPackage(cwd);
        var script = sub === 'run' ? args[1] : sub === 't' ? 'test' : sub;
        if (!script) { out.push('Scripts available in ' + ps.name + ' via `npm run-script`:'); Object.keys(ps.scripts || {}).forEach(function (k) { out.push('  ' + k, '    ' + ps.scripts[k]); }); return; }
        var cmd = (ps.scripts || {})[script];
        if (!cmd) {
          if (script === 'start' && arquivos[cwd + '/server.js'] !== undefined) cmd = 'node server.js';
          else throw falha('npm error Missing script: "' + script + '"\nnpm error\nnpm error To see a list of scripts, run:\nnpm error   npm run');
        }
        out.push('', '> ' + ps.name + '@' + ps.version + ' ' + script, '> ' + cmd, '');
        await executarLinha(cmd, out, rodarNode);
        return;
      }
      throw falha('Unknown command: "' + sub + '"');
    }

    // ---------- um comando ----------
    async function executarCmd(texto, out, rodarNode) {
      var p = palavras(texto);
      var redir = null;
      for (var k = 0; k < p.length; k++) if (typeof p[k] === 'object') { redir = { op: p[k].op, arq: p[k + 1] }; p = p.slice(0, k); break; }
      var cmd = p[0], args = p.slice(1);
      var saida = redir ? [] : out;
      switch (cmd) {
        case 'pwd': saida.push(cwd); break;
        case 'cd': {
          var alvo = resolver(args[0] || '~');
          if (args[0] === '-') break;
          if (arquivos[alvo] !== undefined) throw falha('bash: cd: ' + args[0] + ': Not a directory');
          if (!pastas[alvo]) throw falha('bash: cd: ' + args[0] + ': No such file or directory');
          cwd = alvo; break;
        }
        case 'ls': case 'dir': {
          var todos = args.some(function (a) { return /^-\w*a/.test(a); });
          var marcar = args.some(function (a) { return /^-\w*F/.test(a); });
          var longo = args.some(function (a) { return /^-\w*l/.test(a); });
          var alvos = args.filter(function (a) { return a[0] !== '-'; });
          if (!alvos.length) alvos = ['.'];
          alvos.forEach(function (a, i) {
            var abs = resolver(a);
            if (arquivos[abs] !== undefined) { saida.push(a); return; }
            if (!pastas[abs]) throw falha("ls: cannot access '" + a + "': No such file or directory");
            if (alvos.length > 1) { if (i) saida.push(''); saida.push(a + ':'); }
            var itens = filhos(abs).filter(function (n) { return todos || n[0] !== '.'; });
            if (todos) itens = ['.', '..'].concat(itens);
            if (longo) itens.forEach(function (n) { var full = abs + '/' + n; var ehPasta = pastas[full] || n === '.' || n === '..'; saida.push((ehPasta ? 'drwxr-xr-x' : '-rw-r--r--') + ' aluno ' + (ehPasta ? '4096' : String((arquivos[full] || '').length).padStart(4, ' ')) + ' ' + n); });
            else if (itens.length) saida.push(itens.map(function (n) { return n + (marcar && pastas[abs + '/' + n] ? '/' : ''); }).join('  '));
          });
          break;
        }
        case 'mkdir': {
          var pp = args.indexOf('-p') >= 0;
          args.filter(function (a) { return a[0] !== '-'; }).forEach(function (a) {
            var abs = resolver(a);
            if (existe(abs)) { if (!pp) throw falha("mkdir: cannot create directory '" + a + "': File exists"); return; }
            if (!pp && !pastas[pai(abs)]) throw falha("mkdir: cannot create directory '" + a + "': No such file or directory");
            criarPastas(abs);
          });
          break;
        }
        case 'touch': args.forEach(function (a) { var abs = resolver(a); if (!pastas[pai(abs)]) throw falha("touch: cannot touch '" + a + "': No such file or directory"); if (arquivos[abs] === undefined && !pastas[abs]) arquivos[abs] = ''; }); break;
        case 'echo': saida.push(args.filter(function (a) { return a !== '-e' && a !== '-n'; }).join(' ')); break;
        case 'cat': args.forEach(function (a) {
          var abs = resolver(a);
          if (pastas[abs]) throw falha('cat: ' + a + ': Is a directory');
          if (arquivos[abs] === undefined) throw falha('cat: ' + a + ': No such file or directory');
          var t = arquivos[abs]; if (t) saida.push(t.replace(/\n$/, ''));
        }); break;
        case 'rm': {
          var rec = args.some(function (a) { return /^-\w*r/i.test(a); }), forca = args.some(function (a) { return /^-\w*f/.test(a); });
          args.filter(function (a) { return a[0] !== '-'; }).forEach(function (a) {
            var abs = resolver(a);
            if (!existe(abs)) { if (!forca) throw falha("rm: cannot remove '" + a + "': No such file or directory"); return; }
            if (pastas[abs] && !rec) throw falha("rm: cannot remove '" + a + "': Is a directory");
            if (repos[abs]) delete repos[abs];
            apagar(abs);
          });
          break;
        }
        case 'mv': case 'cp': {
          var lista = args.filter(function (a) { return a[0] !== '-'; });
          if (lista.length < 2) throw falha(cmd + ': missing destination file operand');
          var dest = resolver(lista[lista.length - 1]);
          lista.slice(0, -1).forEach(function (a) {
            var abs = resolver(a);
            if (!existe(abs)) throw falha(cmd + ": cannot stat '" + a + "': No such file or directory");
            var final = pastas[dest] ? dest + '/' + nome(abs) : dest;
            if (pastas[abs]) {
              if (cmd === 'cp' && !args.some(function (x) { return /^-\w*r/i.test(x); })) throw falha("cp: -r not specified; omitting directory '" + a + "'");
              Object.keys(pastas).forEach(function (q) { if (q === abs || q.indexOf(abs + '/') === 0) pastas[final + q.slice(abs.length)] = true; });
              Object.keys(arquivos).forEach(function (q) { if (q.indexOf(abs + '/') === 0) arquivos[final + q.slice(abs.length)] = arquivos[q]; });
            } else gravar(final, arquivos[abs]);
            if (cmd === 'mv') apagar(abs);
          });
          break;
        }
        case 'clear': case 'cls': out.length = 0; out.limpou = true; break;
        case 'whoami': saida.push('aluno'); break;
        case 'git': git(args, saida); break;
        case 'npm': await npm(args, saida, rodarNode); break;
        case 'npx': throw falha('npx: aqui no CodeQuest o npx não está disponível');
        case 'node': {
          if (args[0] === '-v' || args[0] === '--version') { saida.push('v22.12.0'); break; }
          if (!args[0]) throw falha('node: aqui no CodeQuest use node arquivo.js');
          var absJ = resolver(args[0]);
          if (arquivos[absJ] === undefined && arquivos[absJ + '.js'] !== undefined) absJ += '.js';
          if (arquivos[absJ] === undefined) throw falha("node:internal/modules/cjs/loader\nError: Cannot find module '" + absJ + "'");
          if (!rodarNode) throw falha('node: não disponível aqui');
          var r = await rodarNode(arquivos[absJ], cwd, function (l) { saida.push(l); });
          if (r && r.erro) throw falha(r.erro);
          break;
        }
        case 'gh': {
          if (args[0] === 'repo' && args[1] === 'create') {
            var nm = args[2];
            if (!nm) throw falha('gh: informe o nome: gh repo create meu-site --public');
            var dono = nm.indexOf('/') > 0 ? nm.split('/')[0] : usuarioGh;
            var nomeRepo = nm.indexOf('/') > 0 ? nm.split('/')[1] : nm;
            var url = 'https://github.com/' + dono + '/' + nomeRepo + '.git';
            if (github[url]) throw falha('GraphQL: Name already exists on this account (createRepository)');
            github[url] = { branches: {}, padrao: 'main' };
            saida.push('✓ Created repository ' + dono + '/' + nomeRepo + ' on GitHub', '  https://github.com/' + dono + '/' + nomeRepo);
            break;
          }
          if (args[0] === 'auth' && args[1] === 'status') { saida.push('github.com', '  ✓ Logged in to github.com account ' + usuarioGh); break; }
          throw falha('gh: aqui no CodeQuest só existe "gh repo create NOME"');
        }
        default:
          throw falha(cmd + ': command not found');
      }
      if (redir) {
        if (!redir.arq) throw falha('bash: syntax error near unexpected token `newline\'');
        var absR = resolver(redir.arq);
        if (absR === '/dev/null') return;
        if (pastas[absR]) throw falha('bash: ' + redir.arq + ': Is a directory');
        if (!pastas[pai(absR)]) throw falha('bash: ' + redir.arq + ': No such file or directory');
        var texto2 = saida.length ? saida.join('\n') + '\n' : '';
        arquivos[absR] = redir.op === '>>' ? (arquivos[absR] || '') + texto2 : texto2;
      }
    }

    async function executarLinha(linha, out, rodarNode) {
      var partes = separarComandos(linha);
      for (var i = 0; i < partes.length; i++) {
        try { await executarCmd(partes[i].cmd.trim(), out, rodarNode); }
        catch (e) {
          if (!e.terminal) throw e;
          out.erros = (out.erros || 0) + 1;
          if (e.message && !e.silencioso) e.message.split('\n').forEach(function (l) { out.push(l); });
          if (partes[i].op === '&&' || partes[i].op === null) {
            // depois de um erro, os comandos ligados por && não rodam
            var j = i; while (j < partes.length && partes[j].op === '&&') j++;
            i = j;
          }
        }
      }
    }

    // ---------- rodar um "script" (várias linhas) ----------
    // devolve { saida, tela }:
    //   saida = só o que os comandos mostraram (usado para conferir a resposta)
    //   tela  = como ficaria no terminal, com "~/projeto $ comando"
    async function rodar(script, opcoesRodar) {
      opcoesRodar = opcoesRodar || {};
      var saida = [], tela = [], erros = 0;
      var linhas = String(script || '').replace(/\r/g, '').split('\n');
      for (var i = 0; i < linhas.length; i++) {
        var l = linhas[i];
        if (l.trim() === '#__TESTE__') { saida = []; continue; }
        if (!l.trim()) continue;
        if (/^\s*#/.test(l)) { if (!opcoesRodar.silencioso) tela.push(l.trim()); continue; }
        var out = [];
        var pr = exibirPrompt();
        await executarLinha(l, out, opcoesRodar.rodarNode);
        erros += out.erros || 0;
        if (out.limpou) { tela = []; }
        else if (!opcoesRodar.silencioso) tela.push(pr + l.trim());
        out.forEach(function (x) { saida.push(x); if (!opcoesRodar.silencioso) tela.push(x); });
      }
      return { saida: saida.join('\n'), tela: tela.join('\n'), erros: erros };
    }
    function exibirPrompt() {
      var r = repoDe(cwd);
      return exibir(cwd) + (r && r.head.branch ? ' (' + (r.merge ? r.head.branch + '|MERGING' : r.head.branch) + ')' : '') + ' $ ';
    }

    return {
      rodar: rodar,
      prompt: exibirPrompt,
      arquivos: function () { return arquivos; },
      cwd: function () { return cwd; }
    };
  }

  var api = { criarTerminal: criarTerminal };
  raiz.cqTerminal = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
