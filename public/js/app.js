// =============================================================
// app.js — a interface do CodeQuest.
//
// É um "SPA" (aplicativo de página única): só existe um index.html,
// e trocamos o conteúdo da tela conforme o endereço depois do #.
//   #/entrar        login          #/trilha/python   mapa de fases
//   #/cadastro      criar conta    #/fase/py-01      jogar uma fase
//   #/              início         #/revisao         revisão do dia
//   #/ranking       ranking        #/perfil          perfil
//   #/lab/python    laboratório livre
// =============================================================
(function () {
  'use strict';
  var CURSOS = window.CURSOS || {};
  var ORDEM = ['python', 'javascript', 'java', 'htmlcss', 'react', 'backend', 'sql', 'git'].filter(function (c) { return CURSOS[c]; });
  // A "Carreira Full Stack": a ordem recomendada para virar desenvolvedor web completo
  var FULLSTACK = ['htmlcss', 'javascript', 'react', 'backend', 'sql', 'git'].filter(function (c) { return CURSOS[c]; });
  var LINGUAGENS = ['python', 'javascript', 'java'].filter(function (c) { return CURSOS[c]; });
  var $app = document.getElementById('app');
  var E = window.cqEfeitos;
  var estado = { usuario: null, meta: null };
  var AVATARES = ['🦊', '🐱', '🐼', '🦁', '🐸', '🐙', '🦄', '🐧', '🐯', '🐨', '🦉', '🐝', '🤖', '👩🏽‍💻', '👨🏾‍💻', '💇🏽‍♀️', '🛵', '🚀'];
  var ACERTOS = ['Mandou bem!', 'Isso aí!', 'Perfeito!', 'Arrasou!', 'Certinho!', 'Show!'];
  var QUASE = ['Quase!', 'Não foi dessa vez', 'Ops, ainda não'];

  // ---------- utilidades ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sorteio(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function embaralhar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ir(h) { if (location.hash === h) rotear(); else location.hash = h; }
  // Mostra uma página HTML desenhada (sem rodar scripts) dentro de um quadro
  function previaHtml(html, titulo) {
    var doc = '<!doctype html><html><head><meta charset="utf-8"><style>body{font:16px/1.5 system-ui,sans-serif;margin:12px;color:#1b1b2f;background:#fff}button{font:inherit;padding:4px 12px}input{font:inherit;padding:4px}li{margin:2px 0}.oculto{display:none}</style></head><body>' + (html || '') + '</body></html>';
    return '<div class="previa"><div class="previa-barra"><i></i><i></i><i></i><span>' + esc(titulo || 'Página') + '</span></div><iframe sandbox="" title="' + esc(titulo || 'Prévia da página') + '" srcdoc="' + esc(doc) + '"></iframe></div>';
  }
  // Mostra a página que o aluno escreveu (HTML + CSS de verdade, sem scripts)
  function previaDoc(codigo, titulo) {
    var base = '<meta charset="utf-8"><style>body{font:16px/1.5 system-ui,sans-serif;margin:12px;color:#1b1b2f;background:#fff}</style>';
    var doc = String(codigo || '');
    if (/<head[^>]*>/i.test(doc)) doc = doc.replace(/<head[^>]*>/i, function (h) { return h + base; });
    else doc = '<!doctype html><html><head>' + base + '</head><body>' + doc + '</body></html>';
    return '<div class="previa previa-alta"><div class="previa-barra"><i></i><i></i><i></i><span>' + esc(titulo || 'Sua página') + '</span></div><iframe sandbox="" title="' + esc(titulo || 'Prévia da página') + '" srcdoc="' + esc(doc) + '"></iframe></div>';
  }
  // Pega o "cenário" do exercício: página, banco, pasta ou API (o do exercício,
  // ou o padrão da fase, ou o padrão da trilha)
  function contexto(p, s) {
    var info = p.info || (s && s.cfg.info) || null;
    var fase = info ? info.fase : {}, curso = info ? info.curso : {};
    var o = p.card || p.ex || {};
    var pegar = function () { for (var i = 0; i < arguments.length; i++) if (arguments[i] !== undefined) return arguments[i]; };
    return { dom: o.dom, banco: pegar(o.banco, fase.banco, curso.banco), pasta: pegar(o.pasta, fase.pasta), api: pegar(o.api, fase.api) };
  }
  // Mostra o cenário: a página (DOM), as tabelas (SQL) ou a pasta (terminal)
  function blocoContexto(ling, ctx) {
    var h = '';
    if (ctx.dom !== undefined) h += blocoPagina(ctx.dom);
    if (ling === 'sql' && ctx.banco) h += '<details class="pagina-html bloco-banco" open><summary>🗄️ As tabelas do banco</summary><div class="banco-tabelas" data-banco="' + esc(ctx.banco) + '"><p class="vazio">Carregando as tabelas...</p></div></details>';
    if (ling === 'terminal' && ctx.pasta) h += '<details class="pagina-html"><summary>📁 Antes de você, alguém já rodou estes comandos</summary>' + codigoHtml(ctx.pasta, 'terminal') + '</details>';
    return h;
  }
  function tabelaHtml(t) {
    return '<div class="tabela-rolar"><table class="tabela-sql">' + (t.nome ? '<caption>' + esc(t.nome) + '</caption>' : '') +
      '<thead><tr>' + t.colunas.map(function (c, i) { return '<th>' + esc(c) + (t.tipos && t.tipos[i] ? '<small>' + esc(t.tipos[i]) + '</small>' : '') + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + (t.linhas.length ? t.linhas.map(function (l) { return '<tr>' + l.map(function (v) { return '<td' + (v === 'NULL' ? ' class="nulo"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + t.colunas.length + '" class="nulo">(vazia)</td></tr>') + '</tbody></table></div>';
  }
  // Preenche os quadros de tabelas (o banco roda num Web Worker, então chega depois)
  function hidratarBancos(raiz) {
    raiz.querySelectorAll('.banco-tabelas[data-banco]').forEach(function (el) {
      var banco = el.getAttribute('data-banco');
      el.removeAttribute('data-banco');
      window.cqExecutor.descreverBanco(banco).then(function (tabs) {
        el.innerHTML = tabs.length ? tabs.map(tabelaHtml).join('') : '<p class="vazio">(banco vazio)</p>';
      });
    });
  }
  // Saída de SQL ("a | b") vira tabela de verdade na tela
  function saidaSqlHtml(texto) {
    return texto.split(/\n\n/).map(function (bloco) {
      var linhas = bloco.split('\n');
      if (linhas.length < 1 || !linhas[0]) return '';
      var cols = linhas[0].split(' | ');
      var corpo = linhas.slice(1);
      if (corpo.length === 1 && corpo[0] === '(nenhuma linha)') corpo = [];
      return tabelaHtml({ colunas: cols, linhas: corpo.map(function (l) { return l.split(' | '); }) });
    }).join('');
  }
  function blocoPagina(dom) {
    if (dom === undefined) return '';
    return '<details class="pagina-html" open><summary>🌐 A página (HTML)</summary>' + codigoHtml(dom, 'html') + previaHtml(dom, 'Como a página começa') + '</details>';
  }
  function codigoHtml(codigo, ling) { return '<pre class="codigo"><code>' + window.cqRealcar(codigo, ling) + '</code></pre>'; }
  function ls(chave, valor) { try { if (valor === undefined) return localStorage.getItem(chave); if (valor === null) localStorage.removeItem(chave); else localStorage.setItem(chave, valor); } catch (e) { return null; } }

  // ---------- índice das fases ----------
  var FASES = {}; // id -> { fase, curso, mundo, mundoIdx, anterior, proxima, num }
  ORDEM.forEach(function (cid) {
    var curso = CURSOS[cid], ant = null, num = 0;
    curso.mundos.forEach(function (m, mi) {
      m.fases.forEach(function (f) {
        num++;
        FASES[f.id] = { fase: f, curso: curso, mundo: m, mundoIdx: mi, anterior: ant, proxima: null, num: num };
        if (ant) FASES[ant].proxima = f.id;
        ant = f.id;
      });
    });
  });
  function fasesDoCurso(cid) { var r = []; CURSOS[cid].mundos.forEach(function (m) { m.fases.forEach(function (f) { r.push(f); }); }); return r; }
  function feita(id) { return !!(estado.usuario && estado.usuario.fases[id]); }
  function liberada(id) { var f = FASES[id]; return f && (!f.anterior || feita(f.anterior)); }
  function progressoCurso(cid) {
    var todas = fasesDoCurso(cid), feitas = todas.filter(function (f) { return feita(f.id); });
    var prox = todas.find(function (f) { return !feita(f.id); });
    return { total: todas.length, feitas: feitas.length, proxima: prox || null };
  }
  function itensParaRevisar() {
    var u = estado.usuario; if (!u) return [];
    var r = [];
    Object.keys(u.revisao || {}).forEach(function (id) {
      if (u.revisao[id].proxima > u.hoje) return;
      var p = id.split(':'), info = FASES[p[0]];
      if (!info) return;
      var ex = info.fase.ex[Number(p[1])];
      if (ex) r.push({ id: id, ex: ex, ling: info.curso.ling, info: info });
    });
    return r;
  }

  // ---------- comunicação com o servidor ----------
  async function api(metodo, caminho, corpo) {
    var resp;
    try {
      resp = await fetch('/api' + caminho, {
        method: metodo,
        headers: Object.assign({ 'Content-Type': 'application/json' }, ls('cq_token') ? { Authorization: 'Bearer ' + ls('cq_token') } : {}),
        body: corpo ? JSON.stringify(corpo) : undefined
      });
    } catch (e) {
      throw new Error('Sem conexão com o servidor. Confira sua internet.');
    }
    var dados = {};
    try { dados = await resp.json(); } catch (e) { /* vazio */ }
    if (resp.status === 401 && caminho.indexOf('/auth/') !== 0) { sair(true); throw new Error(dados.erro || 'Entre de novo.'); }
    if (!resp.ok) throw new Error(dados.erro || 'Algo deu errado (' + resp.status + ').');
    if (dados.usuario) estado.usuario = dados.usuario;
    return dados;
  }
  function sair(silencioso) {
    ls('cq_token', null);
    estado.usuario = null;
    if (!silencioso) E.aviso('Até logo! 👋');
    ir('#/entrar');
  }

  // ---------- molde das telas ----------
  function barraTopo() {
    var u = estado.usuario;
    var n = u.nivel;
    var pct = Math.round(n.xpNoNivel / n.xpProximo * 100);
    var rev = itensParaRevisar().length;
    return '<header class="topo">' +
      '<a href="#/" class="marca" aria-label="Início">Code<span>Quest</span></a>' +
      '<nav class="nav-topo" aria-label="Principal">' + linksNav(rev) + '</nav>' +
      '<div class="status">' +
      '<span class="chip chip-fogo' + (u.estudouHoje ? ' aceso' : '') + '" title="Ofensiva: dias seguidos estudando">🔥 ' + u.ofensiva + '</span>' +
      '<span class="chip chip-xp" title="Pontos de experiência">⭐ ' + u.xp + '</span>' +
      '<span class="chip chip-nivel" title="Nível ' + n.nivel + ' — faltam ' + (n.xpProximo - n.xpNoNivel) + ' XP para o próximo"><b>Nv ' + n.nivel + '</b><i style="--p:' + pct + '%"></i></span>' +
      '</div></header>';
  }
  function linksNav(rev) {
    var h = location.hash || '#/';
    var itens = [['#/', '🏠', 'Início'], ['#/revisao', '🧠', 'Revisão'], ['#/ranking', '🏆', 'Ranking'], ['#/perfil', estado.usuario.avatar, 'Perfil']];
    if (estado.usuario.admin) itens.push(['#/admin', '📊', 'Painel']);
    return itens.map(function (it) {
      var ativo = (it[0] === '#/' ? (h === '#/' || h === '#' || h.indexOf('#/trilha') === 0 || h.indexOf('#/lab') === 0) : h.indexOf(it[0]) === 0);
      return '<a href="' + it[0] + '" class="' + (ativo ? 'ativo' : '') + '"' + (ativo ? ' aria-current="page"' : '') + '><span class="ico">' + it[1] + '</span><span>' + it[2] + '</span>' +
        (it[0] === '#/revisao' && rev ? '<b class="bolinha">' + rev + '</b>' : '') + '</a>';
    }).join('');
  }
  function tela(html, classe) {
    $app.innerHTML = barraTopo() + '<main class="tela ' + (classe || '') + '">' + html + '</main>' +
      '<nav class="nav-baixo" aria-label="Principal">' + linksNav(itensParaRevisar().length) + '</nav>';
    window.scrollTo(0, 0);
    window.cqAnuncios.colocar($app);
  }

  // ---------- roteador ----------
  async function rotear() {
    var partes = (location.hash.replace(/^#\/?/, '') || '').split('/');
    var rota = partes[0] || '';
    // conta a tela para as estatísticas (o painel do dono não entra na conta)
    if (rota !== 'admin') window.cqRastrear('app/' + (rota || 'inicio') + (partes[1] ? '/' + partes[1] : ''));
    if (rota === 'entrar' || rota === 'cadastro') return telaEntrar(rota);
    if (rota === 'sugestao' && !ls('cq_token')) return telaSugestao(); // dá para mandar sugestão sem conta
    if (!ls('cq_token')) {
      // guarda para onde a pessoa queria ir (ex: uma fase aberta pelo site) e volta lá depois do login
      try { if (rota) sessionStorage.setItem('cq_destino', location.hash); } catch (e) {}
      return ir('#/cadastro');
    }
    if (!estado.usuario) {
      $app.innerHTML = '<div class="carregando"><div class="spinner"></div><p>Carregando sua jornada...</p></div>';
      try {
        var r = await Promise.all([api('GET', '/eu'), api('GET', '/meta')]);
        estado.meta = r[1];
      } catch (e) {
        if (!ls('cq_token')) return;
        $app.innerHTML = '<div class="carregando"><p>' + esc(e.message) + '</p><button class="btn" onclick="location.reload()">Tentar de novo</button></div>';
        return;
      }
    }
    if (rota === '') return telaInicio();
    if (rota === 'trilha' && CURSOS[partes[1]]) return telaTrilha(partes[1]);
    if (rota === 'fase' && FASES[partes[1]]) return telaFase(partes[1]);
    if (rota === 'revisao') return telaRevisao();
    if (rota === 'ranking') return telaRanking(partes[1] || 'semana');
    if (rota === 'perfil') return telaPerfil();
    if (rota === 'lab' && CURSOS[partes[1]]) return telaLab(partes[1]);
    if (rota === 'sugestao') return telaSugestao();
    if (rota === 'prova' && CURSOS[partes[1]]) return telaProva(partes[1]);
    if (rota === 'admin') return telaAdmin();
    ir('#/');
  }
  window.addEventListener('hashchange', rotear);

  // =============================================================
  // ENTRAR / CADASTRO
  // =============================================================
  function telaEntrar(modo) {
    var cadastro = modo === 'cadastro';
    var av = AVATARES[0];
    $app.innerHTML =
      '<main class="entrada">' +
      '<section class="entrada-capa">' +
      '<h1 class="logo-grande">Code<span>Quest</span></h1>' +
      '<p class="entrada-frase">Aprenda a programar jogando. Uma fase por dia, em português, do primeiro <code>print</code> até Orientação a Objetos.</p>' +
      '<ul class="entrada-trilhas">' + ORDEM.map(function (c) { return '<li style="--cor:' + CURSOS[c].cor + '"><span>' + CURSOS[c].icone + '</span>' + esc(CURSOS[c].nome) + '<small>' + fasesDoCurso(c).length + ' fases</small></li>'; }).join('') + '</ul>' +
      '</section>' +
      '<section class="entrada-form">' +
      '<div class="abas" role="tablist">' +
      '<a role="tab" href="#/entrar" class="' + (!cadastro ? 'ativo' : '') + '" aria-selected="' + !cadastro + '">Entrar</a>' +
      '<a role="tab" href="#/cadastro" class="' + (cadastro ? 'ativo' : '') + '" aria-selected="' + cadastro + '">Criar conta</a>' +
      '</div>' +
      '<form id="form-entrar" novalidate>' +
      (cadastro ? '<label>Seu nome<input name="nome" autocomplete="name" maxlength="30" required placeholder="Como quer ser chamado"></label>' : '') +
      '<label>Usuário<input name="usuario" autocomplete="username" autocapitalize="off" maxlength="20" required placeholder="ex: michael_dev"></label>' +
      '<label>Senha<input name="senha" type="password" autocomplete="' + (cadastro ? 'new-password' : 'current-password') + '" required placeholder="' + (cadastro ? 'mínimo 6 caracteres' : '') + '"></label>' +
      (cadastro ? '<fieldset class="avatares"><legend>Escolha seu avatar</legend>' + AVATARES.map(function (a, i) { return '<button type="button" class="avatar' + (i === 0 ? ' sel' : '') + '" data-av="' + a + '" aria-label="Avatar ' + a + '">' + a + '</button>'; }).join('') + '</fieldset>' : '') +
      '<p class="erro-form" role="alert"></p>' +
      '<button class="btn btn-grande" type="submit">' + (cadastro ? 'Criar conta e começar' : 'Entrar') + '</button>' +
      (!cadastro ? '<details class="esqueci"><summary>Esqueci minha senha</summary><p>' +
        ((window.CQ_CONFIG || {}).contato ? 'Mande um e-mail para <a href="mailto:' + esc(window.CQ_CONFIG.contato) + '?subject=Esqueci%20minha%20senha">' + esc(window.CQ_CONFIG.contato) + '</a> com seu nome de usuário. Você recebe uma senha provisória.' : 'Fale com o responsável pelo site informando seu nome de usuário para receber uma senha provisória.') +
        '</p></details>' : '') +
      '</form></section></main>';
    var form = document.getElementById('form-entrar');
    form.querySelectorAll('.avatar').forEach(function (b) {
      b.onclick = function () { form.querySelectorAll('.avatar').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); av = b.dataset.av; };
    });
    form.onsubmit = async function (e) {
      e.preventDefault();
      var dados = Object.fromEntries(new FormData(form));
      dados.avatar = av;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        var r = await api('POST', cadastro ? '/auth/cadastro' : '/auth/login', dados);
        ls('cq_token', r.token);
        estado.usuario = r.usuario;
        estado.meta = await api('GET', '/meta');
        if (cadastro) E.aviso('Conta criada! Bem-vindo(a), ' + esc(r.usuario.nome) + ' 🎉', 'ok');
        var destino = null;
        try { destino = sessionStorage.getItem('cq_destino'); sessionStorage.removeItem('cq_destino'); } catch (e2) {}
        ir(destino || '#/');
      } catch (err) {
        form.querySelector('.erro-form').textContent = err.message;
        btn.disabled = false;
      }
    };
  }

  // =============================================================
  // INÍCIO
  // =============================================================
  function telaInicio() {
    var u = estado.usuario;
    var meta = u.metaDiaria, hoje = Math.min(u.xpHoje, meta);
    var ang = Math.round(hoje / meta * 100);
    var rev = itensParaRevisar().length;
    var html =
      '<section class="saudacao">' +
      '<div class="meta-anel" style="--p:' + ang + '" role="img" aria-label="Meta diária: ' + u.xpHoje + ' de ' + meta + ' XP">' +
      '<span>' + u.avatar + '</span></div>' +
      '<div><h1>Oi, ' + esc(u.nome.split(' ')[0]) + '!</h1>' +
      '<p>' + (u.xpHoje >= meta ? 'Meta de hoje batida! ' + u.xpHoje + ' XP. Quer ir além?' : 'Meta de hoje: <b>' + u.xpHoje + '/' + meta + ' XP</b>. ' + (u.estudouHoje ? 'Continue assim!' : 'Faça uma fase para manter a ofensiva 🔥')) + '</p></div>' +
      '</section>' +
      (rev ? '<a class="cartao-revisao" href="#/revisao"><span class="ico-grande">🧠</span><span><b>Revisão do dia</b><br>' + rev + ' pergunta' + (rev > 1 ? 's' : '') + ' esperando. Revisar no dia certo é o que faz você não esquecer.</span><span class="seta" aria-hidden="true">›</span></a>' : '') +
      '<h2 class="titulo-secao">Linguagens de programação</h2>' +
      '<div class="cursos">' + LINGUAGENS.map(cartaoCurso).join('') + '</div>' +
      (FULLSTACK.length > 1 ? '<h2 class="titulo-secao">🚀 Carreira Full Stack</h2>' +
        '<p class="secao-sub">O caminho para criar sites e sistemas completos: a tela (front-end), o servidor (back-end), o banco de dados e a publicação. Siga na ordem:</p>' +
        mapaFullStack() +
        '<div class="cursos">' + FULLSTACK.filter(function (c) { return LINGUAGENS.indexOf(c) < 0; }).map(cartaoCurso).join('') + '</div>' : '') +
      '<div class="anuncio-slot"></div>' +
      '<a class="cartao-sugestao" href="#/sugestao"><span class="ico-grande">💬</span><span><b>Ajude a melhorar o CodeQuest</b><br>Mande uma sugestão, peça uma aula nova ou conte um problema. A gente lê tudo.</span><span class="seta" aria-hidden="true">›</span></a>' +
      '<section class="dica-estudo"><h2 class="titulo-secao">Como estudar aqui</h2><ol>' +
      '<li><b>Leia o cartão e rode o exemplo.</b> Antes de rodar, tente prever o que vai aparecer.</li>' +
      '<li><b>Erre sem medo.</b> Pergunta errada volta no fim da fase, e as dicas aparecem aos poucos.</li>' +
      '<li><b>Volte amanhã.</b> A revisão traz de volta o que você aprendeu na hora em que estaria esquecendo.</li>' +
      '<li><b>Digite o código.</b> Nos desafios, escrever com as próprias mãos é o que fixa.</li>' +
      '</ol></section>';
    tela(html, 'inicio');
  }

  function cartaoCurso(cid) {
    var c = CURSOS[cid], p = progressoCurso(cid);
    var pct = Math.round(p.feitas / p.total * 100);
    return '<article class="cartao-curso" style="--cor:' + c.cor + '">' +
      '<div class="cc-topo"><span class="cc-icone">' + c.icone + '</span><div><h3>' + esc(c.nome) + '</h3><p>' + esc(c.desc) + '</p></div></div>' +
      '<div class="barra" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso em ' + esc(c.nome) + '"><i style="width:' + pct + '%"></i></div>' +
      '<p class="cc-status">' + p.feitas + ' de ' + p.total + ' fases' + (p.proxima ? ' · próxima: <b>' + esc(p.proxima.titulo) + '</b>' : ' · trilha completa 🎓') + '</p>' +
      '<div class="cc-acoes">' +
      (p.proxima ? '<a class="btn" href="#/fase/' + p.proxima.id + '">' + (p.feitas ? 'Continuar' : 'Começar') + '</a>' : (certificadoDe(cid) ? '<a class="btn" href="/certificado/' + certificadoDe(cid).codigo + '">🎓 Ver certificado</a>' : '<a class="btn" href="#/prova/' + cid + '">🎓 Prova final</a>')) +
      '<a class="btn btn-sec" href="#/trilha/' + cid + '">Ver trilha</a>' +
      '<a class="btn btn-sec" href="#/lab/' + cid + '" title="Laboratório: escreva e rode código livre">🧪 Lab</a>' +
      '</div></article>';
  }
  // A trilha Full Stack em passos: mostra onde a pessoa está
  function mapaFullStack() {
    return '<ol class="mapa-fs">' + FULLSTACK.map(function (cid, i) {
      var c = CURSOS[cid], p = progressoCurso(cid);
      var pct = Math.round(p.feitas / p.total * 100);
      var est = pct === 100 ? 'feita' : pct > 0 ? 'atual' : '';
      return '<li class="' + est + '" style="--cor:' + c.cor + '"><a href="#/trilha/' + cid + '"><span class="mfs-num">' + (pct === 100 ? '✓' : i + 1) + '</span><span class="mfs-ico">' + c.icone + '</span><b>' + esc(c.nome) + '</b><small>' + (pct ? pct + '%' : p.total + ' fases') + '</small></a></li>';
    }).join('') + '</ol>';
  }

  // =============================================================
  // TRILHA (mapa de fases)
  // =============================================================
  function telaTrilha(cid) {
    var c = CURSOS[cid], p = progressoCurso(cid);
    var OFF = [0, 1, 2, 1, 0, -1, -2, -1];
    var LARG = 320, PASSO = 112, DESL = 62;
    var html = '<section class="trilha-cab" style="--cor:' + c.cor + '">' +
      '<a href="#/" class="voltar" aria-label="Voltar">‹</a><span class="cc-icone">' + c.icone + '</span>' +
      '<div><h1>' + esc(c.nome) + '</h1><p>' + p.feitas + ' de ' + p.total + ' fases concluídas</p></div>' +
      '<a class="btn btn-sec" href="#/lab/' + cid + '">🧪 Lab</a></section>';
    var contador = 0;
    c.mundos.forEach(function (m, mi) {
      var feitasM = m.fases.filter(function (f) { return feita(f.id); }).length;
      html += '<section class="mundo" style="--cor:' + c.cor + '">' +
        '<header class="mundo-cab"><span class="mundo-num">Mundo ' + (mi + 1) + (m.poo ? ' · POO' : '') + '</span><h2>' + esc(m.titulo) + '</h2><p>' + esc(m.desc) + '</p><span class="mundo-cont">' + feitasM + '/' + m.fases.length + '</span></header>';
      var alt = m.fases.length * PASSO;
      var pts = m.fases.map(function (f, i) { return [LARG / 2 + OFF[(contador + i) % OFF.length] * DESL, i * PASSO + 46]; });
      html += '<div class="caminho" style="height:' + alt + 'px;width:' + LARG + 'px">' +
        '<svg class="caminho-linha" width="' + LARG + '" height="' + alt + '" aria-hidden="true"><polyline points="' + pts.map(function (q) { return q.join(','); }).join(' ') + '"/></svg>';
      m.fases.forEach(function (f, i) {
        var est = feita(f.id) ? 'feita' : liberada(f.id) ? 'atual' : 'bloqueada';
        var estrelas = feita(f.id) ? estado.usuario.fases[f.id].estrelas : 0;
        var x = pts[i][0], y = pts[i][1];
        var rotulo = 'Fase ' + FASES[f.id].num + ': ' + f.titulo + (est === 'bloqueada' ? ' (bloqueada)' : est === 'feita' ? ' (' + estrelas + ' estrelas)' : ' (disponível)');
        html += '<div class="no ' + est + (f.xp >= 60 ? ' chefe' : '') + '" style="left:' + x + 'px;top:' + y + 'px">' +
          (est === 'bloqueada' ? '<span class="no-botao" aria-label="' + esc(rotulo) + '" role="img">🔒</span>' : '<a class="no-botao" href="#/fase/' + f.id + '" aria-label="' + esc(rotulo) + '">' + f.icone + '</a>') +
          '<span class="no-titulo">' + esc(f.titulo) + '</span>' +
          (est === 'feita' ? '<span class="no-estrelas" aria-hidden="true">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= estrelas ? 'on' : '') + '">★</i>'; }).join('') + '</span>' : '') +
          '</div>';
      });
      html += '</div></section>';
      contador += m.fases.length;
      if (mi === 1) html += '<div class="anuncio-slot"></div>';
    });
    html += cartaoProva(cid);
    tela(html, 'trilha');
    var atual = $app.querySelector('.no.atual');
    if (atual) setTimeout(function () { atual.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 150);
  }

  // =============================================================
  // JOGADOR DE FASES (e de revisão)
  // =============================================================
  // Cria uma sessão: lista de passos (cartões de lição + exercícios).
  // Exercício errado (exceto de código) volta para o fim da fila uma vez.
  function telaFase(faseId) {
    var info = FASES[faseId];
    if (!liberada(faseId)) { E.aviso('Conclua a fase anterior primeiro 🔒'); return ir('#/trilha/' + info.curso.id); }
    var passos = [];
    (info.fase.licao || []).forEach(function (card) { passos.push({ tipo: 'licao', card: card }); });
    (info.fase.ex || []).forEach(function (ex, i) { passos.push({ tipo: 'ex', ex: ex, idx: i, chave: faseId + ':' + i }); });
    iniciarSessao({
      modo: 'fase', info: info, ling: info.curso.ling, passos: passos,
      titulo: info.fase.titulo, sair: '#/trilha/' + info.curso.id,
      aoTerminar: function (s) { return terminarFase(s); }
    });
  }

  function iniciarSessao(cfg) {
    var s = {
      cfg: cfg, passos: cfg.passos.slice(), i: 0, erros: 0, dicas: 0, solucoes: 0,
      combo: 0, maxCombo: 0, acertosPrimeira: 0, totalEx: cfg.passos.filter(function (p) { return p.tipo === 'ex'; }).length,
      repetidos: {}, resultados: {}
    };
    if (cfg.ling === 'python' && cfg.passos.some(function (p) { return p.tipo === 'licao' ? p.card.codigo : p.ex.tipo === 'codigo'; })) {
      window.cqExecutor.prepararPython();
    }
    $app.innerHTML =
      '<div class="jogo" style="--cor:' + (CURSOS[cfg.info ? cfg.info.curso.id : ORDEM[0]] || {}).cor + '">' +
      '<header class="jogo-topo"><button class="fechar" aria-label="Sair da fase">✕</button>' +
      '<div class="jogo-barra" role="progressbar" aria-label="Progresso da fase"><i></i></div>' +
      '<span class="combo" aria-live="polite"></span>' +
      '<button class="reportar" title="Reportar problema nesta tela" aria-label="Reportar problema nesta tela">⚑</button></header>' +
      '<div class="py-status" hidden></div>' +
      '<main class="jogo-corpo"></main>' +
      '<footer class="jogo-rodape"><div class="feedback" hidden></div><div class="jogo-acoes"><button class="btn btn-grande btn-acao" disabled>Verificar</button></div></footer>' +
      '</div>';
    $app.querySelector('.fechar').onclick = function () {
      if (s.i === 0 || confirm('Sair da fase? Seu progresso nesta fase será perdido.')) ir(cfg.sair);
    };
    $app.querySelector('.reportar').onclick = async function () {
      var p = s.passos[s.i];
      var texto = prompt('Achou um erro nesta tela (explicação confusa, resposta errada, bug)? Conte o que aconteceu:');
      if (!texto || !texto.trim()) return;
      try {
        await api('POST', '/feedback', { faseId: p && p.chave ? p.chave.split(':')[0] : (cfg.info ? cfg.info.fase.id : 'revisao'), passo: p ? (p.tipo === 'licao' ? 'licao' : p.chave) : '', texto: texto });
        E.aviso('Obrigado! Seu aviso vai ajudar a melhorar as aulas 💜', 'ok');
      } catch (e) { E.aviso(esc(e.message), 'erro'); }
    };
    var pyStatus = $app.querySelector('.py-status');
    window.cqExecutor.aoStatusPython(function (st) {
      if (!document.body.contains(pyStatus)) return;
      pyStatus.hidden = st === 'pronto';
      pyStatus.textContent = st === 'carregando' ? '🐍 Preparando o Python no seu navegador (só demora na primeira vez)...' : st === 'erro' ? '⚠️ Não consegui carregar o Python. Confira a internet e recarregue.' : '';
    });
    if (cfg.ling === 'python' && !window.cqExecutor.pythonPronto() && cfg.passos.some(function (p) { return p.tipo === 'licao' ? p.card.codigo : p.ex.tipo === 'codigo'; })) {
      pyStatus.hidden = false; pyStatus.textContent = '🐍 Preparando o Python no seu navegador (só demora na primeira vez)...';
    }
    document.onkeydown = function (e) {
      if (!document.body.contains(s.botao)) { document.onkeydown = null; return; }
      if (e.key === 'Enter' && !e.target.closest('textarea') && !e.target.closest('input') && !s.botao.disabled) { e.preventDefault(); s.botao.click(); }
    };
    s.botao = $app.querySelector('.btn-acao');
    s.feedback = $app.querySelector('.feedback');
    s.corpo = $app.querySelector('.jogo-corpo');
    mostrarPasso(s);
  }

  function atualizarBarra(s) {
    var pct = Math.round(s.i / s.passos.length * 100);
    $app.querySelector('.jogo-barra i').style.width = pct + '%';
    var c = $app.querySelector('.combo');
    c.textContent = s.combo >= 2 ? '🔥 ' + s.combo + ' seguidas' : '';
    c.classList.toggle('quente', s.combo >= 2);
  }

  function mostrarPasso(s) {
    atualizarBarra(s);
    if (s.i >= s.passos.length) return s.cfg.aoTerminar(s);
    var p = s.passos[s.i];
    if (s.cfg.modo === 'revisao' && p.ling) s.cfg.ling = p.ling; // revisão mistura linguagens
    s.feedback.hidden = true; s.feedback.className = 'feedback';
    s.botao.disabled = false;
    s.botao.className = 'btn btn-grande btn-acao';
    s.corpo.innerHTML = '';
    s.corpo.scrollTop = 0; window.scrollTo(0, 0);
    if (p.tipo === 'licao') return passoLicao(s, p);
    var ex = p.ex;
    if (ex.tipo === 'quiz' || ex.tipo === 'prever') passoEscolha(s, p);
    else if (ex.tipo === 'completar') passoCompletar(s, p);
    else if (ex.tipo === 'montar') passoMontar(s, p);
    else if (ex.tipo === 'codigo') passoCodigo(s, p);
    else return proximo(s);
    if (s.cfg.modo === 'revisao' && CURSOS[p.ling]) {
      // na revisão, cada pergunta mostra a cor e o nome da sua linguagem
      $app.querySelector('.jogo').style.setProperty('--cor', CURSOS[p.ling].cor);
      var selo = s.corpo.querySelector('.selo');
      if (selo) selo.textContent = CURSOS[p.ling].icone + ' ' + CURSOS[p.ling].nome + ' · ' + selo.textContent;
    }
  }
  function proximo(s) { s.i++; mostrarPasso(s); }

  function botao(s, texto, fn, desabilitado) {
    s.botao.textContent = texto;
    s.botao.disabled = !!desabilitado;
    s.botao.onclick = fn;
  }

  // Registra acerto/erro de um exercício e mostra a faixa de feedback
  function resultado(s, p, ok, detalhesHtml) {
    var primeira = !s.repetidos[p.chave];
    if (s.resultados[p.chave] === undefined) s.resultados[p.chave] = ok; // vale a primeira tentativa (para a revisão)
    if (ok) {
      s.combo++; s.maxCombo = Math.max(s.maxCombo, s.combo);
      if (primeira) s.acertosPrimeira++;
      E.sons.certo();
      s.feedback.className = 'feedback certo';
      s.feedback.innerHTML = '<b>' + sorteio(ACERTOS) + '</b>' + (detalhesHtml ? '<div>' + detalhesHtml + '</div>' : '');
    } else {
      s.combo = 0; s.erros++;
      E.sons.erro();
      s.feedback.className = 'feedback errado';
      s.feedback.innerHTML = '<b>' + sorteio(QUASE) + '</b>' + (detalhesHtml ? '<div>' + detalhesHtml + '</div>' : '') +
        (p.ex.tipo !== 'codigo' && !s.repetidos[p.chave] ? '<small>Essa pergunta volta no fim da fase para você tentar de novo.</small>' : '');
      if (p.ex.tipo !== 'codigo' && !s.repetidos[p.chave]) {
        s.repetidos[p.chave] = true;
        s.passos.push(p);
      }
    }
    s.feedback.hidden = false;
    atualizarBarra(s);
    s.botao.className = 'btn btn-grande btn-acao ' + (ok ? 'ok' : 'nok');
    botao(s, 'Continuar', function () { proximo(s); });
    s.botao.focus();
  }

  // ---------- cartão de lição ----------
  function passoLicao(s, p) {
    var c = p.card;
    s.corpo.innerHTML = '<article class="licao">' +
      '<span class="selo">Lição</span><h1>' + esc(c.titulo) + '</h1>' +
      '<div class="texto">' + c.texto + '</div>' +
      blocoContexto(s.cfg.ling, contexto(p, s)) +
      (c.codigo ? '<div class="exemplo">' + codigoHtml(c.codigo, s.cfg.ling) +
        (c.entrada ? '<p class="entrada-info">Entrada (o que seria digitado): <code>' + esc(c.entrada).replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
        '<p class="prever-dica">🤔 Antes de rodar: o que você acha que vai aparecer?</p>' +
        '<button class="btn btn-sec btn-rodar">▶ Rodar exemplo</button><div class="saida" hidden></div></div>' : '') +
      '</article>';
    var b = s.corpo.querySelector('.btn-rodar');
    if (b) b.onclick = async function () {
      b.disabled = true; b.textContent = 'Rodando...';
      var m = window.cqMontarCodigo(s.cfg.ling, c.codigo, c.teste);
      var r = await window.cqExecutor.executar(s.cfg.ling, m.codigo, c.entrada || '', Object.assign({ teste: m.teste }, contexto(p, s)));
      mostrarSaida(s.corpo.querySelector('.saida'), r, s.cfg.ling);
      b.disabled = false; b.textContent = '▶ Rodar de novo';
    };
    hidratarBancos(s.corpo);
    botao(s, 'Continuar', function () { proximo(s); });
  }

  function mostrarSaida(el, r, ling) {
    el.hidden = false;
    var html;
    if (r.tela !== undefined) html = '<div class="saida-rotulo">Terminal</div><pre class="terminal">' + (r.tela ? esc(r.tela) : '<span class="vazio">(nenhum comando)</span>') + '</pre>';
    else if (r.pagina !== undefined && !r.saida && !r.erro) html = '';
    else if (ling === 'sql' && r.saida && !r.erro) html = '<div class="saida-rotulo">Resultado</div>' + saidaSqlHtml(r.saida);
    else html = '<div class="saida-rotulo">Saída</div><pre>' + (r.saida ? esc(r.saida) : '<span class="vazio">(nada foi mostrado)</span>') + '</pre>';
    if (r.pagina !== undefined) html = '<div class="saida-rotulo">Sua página</div>' + previaDoc(r.pagina) + (html ? html.replace('>Saída<', '>Resultado do teste<') : '');
    if (r.erro) {
      var ex = window.cqExplicarErro(r.erro);
      html += '<div class="erro-caixa"><b>⚠️ ' + esc(ex.titulo) + '</b><p>' + esc(ex.dica) + '</p><details><summary>Mensagem original</summary><pre>' + esc(r.erro) + '</pre></details></div>';
    }
    if (r.html !== undefined) html += '<div class="saida-rotulo">Como a página ficou</div>' + previaHtml(r.html, 'Depois do seu código');
    el.innerHTML = html;
  }

  // ---------- quiz / prever ----------
  function passoEscolha(s, p) {
    var ex = p.ex;
    var ordem = embaralhar(ex.op.map(function (_, i) { return i; }));
    var escolhido = null;
    s.corpo.innerHTML = '<article class="exercicio">' +
      '<span class="selo">' + (ex.tipo === 'prever' ? 'Preveja a saída' : 'Pergunta') + '</span>' +
      '<h1>' + (ex.tipo === 'prever' ? (ex.p || 'O que aparece na tela?') : ex.p) + '</h1>' +
      blocoContexto(s.cfg.ling || p.ling, contexto(p, s)) +
      (ex.codigo ? codigoHtml(ex.codigo, s.cfg.ling || p.ling) : '') +
      (ex.codigo && (s.cfg.ling || p.ling) === 'html' && ex.previa ? previaDoc(ex.codigo, 'Como fica') : '') +
      (ex.entrada ? '<p class="entrada-info">Entrada digitada: <code>' + esc(ex.entrada).replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
      '<div class="opcoes" role="radiogroup">' + ordem.map(function (i) {
        return '<button class="opcao" role="radio" aria-checked="false" data-i="' + i + '">' + (ex.tipo === 'prever' ? '<pre>' + esc(ex.op[i]) + '</pre>' : esc(ex.op[i])) + '</button>';
      }).join('') + '</div></article>';
    hidratarBancos(s.corpo);
    var botoes = s.corpo.querySelectorAll('.opcao');
    botoes.forEach(function (b) {
      b.onclick = function () {
        if (s.feedback.hidden === false) return;
        botoes.forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('sel'); b.setAttribute('aria-checked', 'true');
        escolhido = Number(b.dataset.i);
        s.botao.disabled = false;
      };
    });
    botao(s, 'Verificar', function () {
      var ok = escolhido === ex.c;
      botoes.forEach(function (b) {
        b.disabled = true;
        if (Number(b.dataset.i) === ex.c) b.classList.add('certa');
        else if (Number(b.dataset.i) === escolhido) b.classList.add('errada');
      });
      resultado(s, p, ok, esc(ex.exp || ''));
    }, true);
  }

  // ---------- completar lacunas ----------
  function passoCompletar(s, p) {
    var ex = p.ex, ling = s.cfg.ling || p.ling;
    var partes = ex.codigo.split('___');
    var html = '';
    partes.forEach(function (parte, i) {
      html += window.cqRealcar(parte, ling);
      if (i < partes.length - 1) {
        var r = ex.resp[i], tam = Math.max.apply(null, [].concat(r).map(function (x) { return x.length; }));
        html += '<input class="lacuna" data-i="' + i + '" style="--tam:' + Math.max(tam, 2) + 'ch" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="Lacuna ' + (i + 1) + '">';
      }
    });
    s.corpo.innerHTML = '<article class="exercicio"><span class="selo">Complete o código</span><h1>' + ex.p + '</h1>' + blocoContexto(ling, contexto(p, s)) +
      '<pre class="codigo codigo-lacunas"><code>' + html + '</code></pre>' +
      (ex.op ? '<div class="fichas" aria-label="Sugestões">' + embaralhar(ex.op).map(function (o) { return '<button class="ficha" type="button">' + esc(o) + '</button>'; }).join('') + '</div>' : '') +
      '</article>';
    hidratarBancos(s.corpo);
    var inputs = Array.prototype.slice.call(s.corpo.querySelectorAll('.lacuna'));
    var foco = inputs[0];
    inputs.forEach(function (inp) { inp.addEventListener('focus', function () { foco = inp; }); });
    s.corpo.querySelectorAll('.ficha').forEach(function (f) {
      f.onclick = function () {
        var alvo = (foco && !foco.value) ? foco : (inputs.find(function (x) { return !x.value; }) || foco);
        alvo.value = f.textContent;
        var prox = inputs.find(function (x) { return !x.value; });
        foco = prox || alvo;
      };
    });
    var norm = function (t) { return String(t).trim().replace(/\s+/g, ' '); };
    botao(s, 'Verificar', function () {
      var ok = true;
      inputs.forEach(function (inp, i) {
        var aceitas = [].concat(ex.resp[i]).map(norm);
        var certo = aceitas.indexOf(norm(inp.value)) >= 0;
        inp.classList.add(certo ? 'certa' : 'errada');
        inp.disabled = true;
        if (!certo) ok = false;
      });
      var resposta = '';
      if (!ok) {
        var i = 0;
        resposta = '<p>Resposta:</p>' + codigoHtml(ex.codigo.replace(/___/g, function () { return [].concat(ex.resp[i++])[0]; }), ling);
      }
      resultado(s, p, ok, resposta + esc(ex.exp || ''));
    });
    if (inputs[0] && !('ontouchstart' in window)) inputs[0].focus();
  }

  // ---------- montar (ordenar linhas) ----------
  function passoMontar(s, p) {
    var ex = p.ex, ling = s.cfg.ling || p.ling;
    var todas = ex.linhas.map(function (l, i) { return { t: l, k: 'c' + i }; }).concat((ex.extras || []).map(function (l, i) { return { t: l, k: 'x' + i }; }));
    var banco = embaralhar(todas), resposta = [];
    if (banco.map(function (b) { return b.t; }).join('\n') === ex.linhas.join('\n')) banco.reverse();
    s.corpo.innerHTML = '<article class="exercicio"><span class="selo">Monte o código</span><h1>' + ex.p + '</h1>' +
      blocoContexto(ling, contexto(p, s)) +
      '<p class="instrucao">Toque nas linhas na ordem certa. ' + (ex.extras && ex.extras.length ? 'Cuidado: tem linha sobrando que não serve!' : '') + ' Toque numa linha da resposta para devolvê-la.</p>' +
      '<div class="montar-resposta" aria-label="Sua resposta"></div>' +
      '<div class="montar-banco" aria-label="Linhas disponíveis"></div></article>';
    hidratarBancos(s.corpo);
    var elR = s.corpo.querySelector('.montar-resposta'), elB = s.corpo.querySelector('.montar-banco');
    function desenhar() {
      elR.innerHTML = resposta.length ? resposta.map(function (b, i) { return '<button class="linha" data-i="' + i + '"><code>' + window.cqRealcar(b.t, ling) + '</code></button>'; }).join('') : '<p class="vazio">Sua resposta aparece aqui</p>';
      elB.innerHTML = banco.map(function (b, i) { return '<button class="linha" data-i="' + i + '"><code>' + window.cqRealcar(b.t, ling) + '</code></button>'; }).join('');
      elR.querySelectorAll('.linha').forEach(function (el) { el.onclick = function () { if (!s.feedback.hidden) return; banco.push(resposta.splice(Number(el.dataset.i), 1)[0]); desenhar(); }; });
      elB.querySelectorAll('.linha').forEach(function (el) { el.onclick = function () { if (!s.feedback.hidden) return; resposta.push(banco.splice(Number(el.dataset.i), 1)[0]); desenhar(); E.sons.clique(); }; });
      s.botao.disabled = resposta.length === 0;
    }
    desenhar();
    botao(s, 'Verificar', function () {
      var ok = resposta.map(function (b) { return b.t; }).join('\n') === ex.linhas.join('\n');
      elR.classList.add(ok ? 'certa' : 'errada');
      resultado(s, p, ok, (ok ? '' : '<p>Ordem certa:</p>' + codigoHtml(ex.linhas.join('\n'), ling)) + esc(ex.exp || ''));
    }, true);
  }

  // ---------- desafio de código ----------
  function passoCodigo(s, p) {
    var ex = p.ex, ling = s.cfg.ling;
    var chaveRasc = 'cq_rasc_' + p.chave;
    var falhas = 0, dicasVistas = 0, viuSolucao = false;
    var testes = ex.testes || [{ entrada: ex.entrada, saida: ex.saida }];
    s.corpo.innerHTML = '<article class="exercicio desafio">' +
      '<span class="selo">Desafio de código</span><div class="enunciado">' + ex.p + '</div>' +
      (testes[0].entrada ? '<p class="entrada-info">Entrada (o que será "digitado"): <code>' + esc(testes[0].entrada).replace(/\n/g, ' ⏎ ') + '</code>' + (testes.length > 1 ? ' — e mais ' + (testes.length - 1) + ' teste(s) com outras entradas' : '') + '</p>' : '') +
      blocoContexto(ling, contexto(p, s)) +
      (ex.teste ? '<details class="teste-info"><summary>' + (ling === 'html' ? 'Teste que vamos rodar na sua página (JavaScript)' : ling === 'terminal' ? 'Comandos de teste que vamos rodar depois dos seus' : 'Código de teste que vamos rodar junto com o seu') + '</summary>' + codigoHtml(ex.teste, ling === 'html' ? 'javascript' : ling) + '</details>' : '') +
      '<div class="editor-box"></div>' +
      '<div class="desafio-botoes"><button class="btn btn-sec b-rodar">▶ Executar</button><button class="btn btn-sec b-dica">💡 Dica</button><button class="btn btn-sec b-sol" hidden>👀 Ver solução</button><button class="btn btn-sec b-reset" title="Voltar ao código inicial">↺</button></div>' +
      '<div class="dicas"></div><div class="saida" hidden></div></article>';
    hidratarBancos(s.corpo);
    var editor = window.cqCriarEditor(s.corpo.querySelector('.editor-box'), {
      ling: ling, valor: ls(chaveRasc) || ex.inicio || '',
      aoMudar: function (v) { ls(chaveRasc, v); },
      aoAtalho: function () { s.botao.click(); }
    });
    var elSaida = s.corpo.querySelector('.saida'), elDicas = s.corpo.querySelector('.dicas');
    var bSol = s.corpo.querySelector('.b-sol'), bDica = s.corpo.querySelector('.b-dica');
    function atualizarBotoesAjuda() {
      bDica.textContent = dicasVistas < ex.dicas.length ? '💡 Dica (' + dicasVistas + '/' + ex.dicas.length + ')' : '💡 Sem mais dicas';
      bDica.disabled = dicasVistas >= ex.dicas.length;
      bSol.hidden = !(falhas >= 3 || dicasVistas >= ex.dicas.length);
      if (falhas >= 2 && dicasVistas < ex.dicas.length) bDica.classList.add('pulsar'); else bDica.classList.remove('pulsar');
    }
    atualizarBotoesAjuda();
    bDica.onclick = function () {
      if (dicasVistas >= ex.dicas.length) return;
      var d = ex.dicas[dicasVistas++];
      s.dicas++;
      elDicas.insertAdjacentHTML('beforeend', '<div class="dica"><b>Dica ' + dicasVistas + '</b>' + (/\n|[;{}()=]/.test(d) && d.length < 200 && /[=(]/.test(d) ? '<pre>' + esc(d) + '</pre>' : '<p>' + esc(d) + '</p>') + '</div>');
      atualizarBotoesAjuda();
    };
    bSol.onclick = function () {
      if (!viuSolucao && !confirm('Ver a solução? Tudo bem usar quando travar: estude cada linha e depois rode você mesmo. Esta fase vai valer menos estrelas.')) return;
      if (!viuSolucao) { viuSolucao = true; s.solucoes++; }
      editor.definir(ex.sol);
      elDicas.insertAdjacentHTML('beforeend', '<div class="dica sol"><b>Solução carregada no editor</b><p>Leia linha por linha, rode com ▶ e depois clique em Verificar.</p></div>');
    };
    s.corpo.querySelector('.b-reset').onclick = function () { if (confirm('Voltar ao código inicial?')) editor.definir(ex.inicio || ''); };
    async function rodar(codigo, entrada) {
      var m = window.cqMontarCodigo(ling, codigo, ex.teste);
      return window.cqExecutor.executar(ling, m.codigo, entrada || '', Object.assign({ deslocamento: m.deslocamento, teste: m.teste }, contexto(p, s)));
    }
    var bRodar = s.corpo.querySelector('.b-rodar');
    bRodar.onclick = async function () {
      bRodar.disabled = true; bRodar.textContent = 'Rodando...';
      var r = await rodar(editor.valor(), testes[0].entrada);
      mostrarSaida(elSaida, r, ling);
      bRodar.disabled = false; bRodar.textContent = '▶ Executar';
    };
    botao(s, 'Verificar', async function () {
      var codigo = editor.valor();
      for (var k = 0; k < (ex.usar || []).length; k++) {
        if (!new RegExp(ex.usar[k][0]).test(codigo)) {
          elSaida.hidden = false;
          elSaida.innerHTML = '<div class="erro-caixa"><b>📌 Quase lá</b><p>' + esc(ex.usar[k][1]) + '. O objetivo deste desafio é praticar isso.</p></div>';
          return;
        }
      }
      s.botao.disabled = true; s.botao.textContent = 'Testando...';
      var falhou = null;
      for (var t = 0; t < testes.length; t++) {
        var r = await rodar(codigo, testes[t].entrada);
        var ok = !r.erro && window.cqExecutor.normalizar(r.saida) === window.cqExecutor.normalizar(testes[t].saida);
        if (!ok) { falhou = { r: r, t: testes[t], n: t }; break; }
      }
      s.botao.disabled = false;
      if (!falhou) {
        ls(chaveRasc, null);
        elSaida.hidden = true;
        return resultado(s, p, true, testes.length > 1 ? 'Passou nos ' + testes.length + ' testes.' : 'A saída bateu certinho.');
      }
      falhas++; s.erros++; s.combo = 0; atualizarBarra(s);
      E.sons.erro();
      var r2 = falhou.r;
      if (r2.erro) {
        mostrarSaida(elSaida, r2, ling);
      } else {
        elSaida.hidden = false;
        elSaida.innerHTML = '<div class="comparar">' +
          '<div><div class="saida-rotulo">Esperado</div><pre>' + diffHtml(falhou.t.saida, r2.saida, true) + '</pre></div>' +
          '<div><div class="saida-rotulo">Seu programa mostrou</div><pre>' + (r2.saida ? diffHtml(r2.saida, falhou.t.saida, false) : '<span class="vazio">(nada)</span>') + '</pre></div></div>' +
          (testes.length > 1 ? '<p class="entrada-info">Teste ' + (falhou.n + 1) + ' com entrada: <code>' + esc(falhou.t.entrada || '').replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
          '<p class="dica-diff">As linhas destacadas são diferentes. Confira letras, espaços, acentos e pontuação.</p>' +
          (r2.pagina !== undefined ? '<div class="saida-rotulo">Sua página</div>' + previaDoc(r2.pagina) : '') +
          (r2.tela !== undefined ? '<details><summary>Ver o terminal</summary><pre class="terminal">' + esc(r2.tela) + '</pre></details>' : '');
      }
      botao(s, 'Verificar', s.botao.onclick);
      atualizarBotoesAjuda();
      if (falhas === 2) E.aviso('Travou? Toque em 💡 Dica: elas vão do mais leve ao mais detalhado.');
    });
  }
  function diffHtml(a, b, esperado) {
    var la = window.cqExecutor.normalizar(a).split('\n'), lb = window.cqExecutor.normalizar(b).split('\n');
    return la.map(function (l, i) { return l === lb[i] ? esc(l) : '<mark class="' + (esperado ? 'm-esp' : 'm-seu') + '">' + (esc(l) || ' ') + '</mark>'; }).join('\n');
  }

  // ---------- fim da fase ----------
  async function terminarFase(s) {
    var info = s.cfg.info;
    s.corpo.innerHTML = '<div class="carregando"><div class="spinner"></div><p>Salvando seu progresso...</p></div>';
    $app.querySelector('.jogo-rodape').hidden = true;
    var r;
    try {
      r = await api('POST', '/progresso/fase', { faseId: info.fase.id, erros: s.erros, dicas: s.dicas, solucoes: s.solucoes });
    } catch (e) {
      s.corpo.innerHTML = '<div class="carregando"><p>' + esc(e.message) + '</p><button class="btn">Tentar de novo</button></div>';
      s.corpo.querySelector('button').onclick = function () { terminarFase(s); };
      return;
    }
    var prox = info.proxima;
    s.corpo.innerHTML = '<section class="resultado">' +
      '<p class="res-sobre">' + esc(info.curso.nome) + ' · Fase ' + info.num + '</p>' +
      '<h1>' + (r.estrelas === 3 ? 'Fase perfeita!' : r.estrelas === 2 ? 'Muito bem!' : 'Fase concluída!') + '</h1>' +
      '<div class="res-estrelas" aria-label="' + r.estrelas + ' de 3 estrelas">' + [1, 2, 3].map(function (k) { return '<span class="' + (k <= r.estrelas ? 'on' : '') + '" style="--d:' + (k * 0.25) + 's">★</span>'; }).join('') + '</div>' +
      '<div class="res-numeros">' +
      '<div><b>+' + r.xpGanho + '</b><span>XP</span></div>' +
      '<div><b>' + s.acertosPrimeira + '/' + s.totalEx + '</b><span>de primeira</span></div>' +
      '<div><b>' + s.maxCombo + '</b><span>maior sequência</span></div>' +
      '</div>' +
      (r.estrelas < 3 ? '<p class="res-dica">' + (s.solucoes ? 'Você viu uma solução: refaça a fase depois sem olhar para ganhar 3 estrelas.' : 'Errar menos e usar menos dicas dá mais estrelas. Dá para refazer quando quiser.') + '</p>' : '') +
      (r.ofensivaSubiu ? '<p class="res-fogo">🔥 Ofensiva: ' + estado.usuario.ofensiva + ' dia' + (estado.usuario.ofensiva > 1 ? 's' : '') + ' seguido' + (estado.usuario.ofensiva > 1 ? 's' : '') + '!</p>' : '') +
      conquistasHtml(r.conquistas) +
      '<div class="res-acoes">' +
      (prox ? '<a class="btn btn-grande" href="#/fase/' + prox + '">Próxima: ' + esc(FASES[prox].fase.titulo) + '</a>' : (progressoCurso(info.curso.id).proxima ? '<a class="btn btn-grande" href="#/trilha/' + info.curso.id + '">Ver trilha</a>' : '<a class="btn btn-grande" href="#/prova/' + info.curso.id + '">🎓 Trilha completa! Fazer a prova final</a>')) +
      '<a class="btn btn-sec" href="#/trilha/' + info.curso.id + '">Ver trilha</a></div>' +
      '<p class="res-sugestao"><a href="#/sugestao">💬 O que achou desta fase? Mande uma sugestão</a></p>' +
      '<div class="anuncio-slot"></div>' +
      '</section>';
    E.sons.fase();
    E.comemorar();
    window.cqAnuncios.colocar(s.corpo);
  }
  function conquistasHtml(ids) {
    if (!ids || !ids.length || !estado.meta) return '';
    return '<div class="res-conquistas"><h2>Conquista desbloqueada!</h2>' + ids.map(function (id) {
      var c = estado.meta.conquistas.find(function (x) { return x.id === id; });
      return c ? '<div class="conquista on"><span>' + c.icone + '</span><b>' + esc(c.nome) + '</b><small>' + esc(c.desc) + '</small></div>' : '';
    }).join('') + '</div>';
  }

  // =============================================================
  // REVISÃO ESPAÇADA
  // =============================================================
  function telaRevisao() {
    var itens = itensParaRevisar();
    if (!itens.length) {
      var temAlgo = Object.keys(estado.usuario.revisao || {}).length > 0;
      return tela('<section class="vazio-grande"><span class="ico-grande">🧠</span><h1>Nada para revisar agora</h1>' +
        '<p>' + (temAlgo ? 'Você está em dia! As perguntas das fases voltam em 1, 3, 7, 14 e 30 dias. Cada vez que você acerta, ela demora mais para voltar.' : 'Quando você terminar uma fase, as perguntas dela voltam aqui no dia seguinte para fixar na memória.') + '</p>' +
        '<a class="btn btn-grande" href="#/">Ir para as trilhas</a></section>');
    }
    // mistura linguagens e fases (estudar intercalado ajuda a fixar)
    var escolhidos = embaralhar(itens).slice(0, 10);
    var passos = escolhidos.map(function (it) { return { tipo: 'ex', ex: it.ex, chave: it.id, ling: it.ling, idx: 0, info: it.info }; });
    var cfg = {
      modo: 'revisao', info: null, ling: null, passos: passos, sair: '#/',
      aoTerminar: async function (s) {
        s.corpo.innerHTML = '<div class="carregando"><div class="spinner"></div><p>Salvando...</p></div>';
        $app.querySelector('.jogo-rodape').hidden = true;
        var resultados = escolhidos.map(function (it) { return { id: it.id, ok: s.resultados[it.id] === true }; });
        try {
          var r = await api('POST', '/progresso/revisao', { resultados: resultados });
          s.corpo.innerHTML = '<section class="resultado"><h1>Revisão feita!</h1>' +
            '<div class="res-numeros"><div><b>+' + r.xpGanho + '</b><span>XP</span></div><div><b>' + r.certas + '/' + resultados.length + '</b><span>de primeira</span></div></div>' +
            '<p class="res-dica">As que você acertou voltam daqui a mais tempo; as que errou voltam amanhã.</p>' +
            (r.ofensivaSubiu ? '<p class="res-fogo">🔥 Ofensiva: ' + estado.usuario.ofensiva + '!</p>' : '') +
            conquistasHtml(r.conquistas) +
            '<div class="res-acoes"><a class="btn btn-grande" href="#/">Voltar ao início</a></div><div class="anuncio-slot"></div></section>';
          window.cqAnuncios.colocar(s.corpo);
          E.sons.fase();
        } catch (e) {
          s.corpo.innerHTML = '<div class="carregando"><p>' + esc(e.message) + '</p><a class="btn" href="#/">Voltar</a></div>';
        }
      }
    };
    iniciarSessaoRevisao(cfg);
  }
  function iniciarSessaoRevisao(cfg) {
    iniciarSessao(Object.assign({}, cfg, { ling: cfg.passos[0].ling }));
  }

  // =============================================================
  // RANKING
  // =============================================================
  async function telaRanking(periodo) {
    tela('<section class="ranking"><h1>Ranking</h1>' +
      '<div class="abas" role="tablist"><a role="tab" href="#/ranking/semana" class="' + (periodo !== 'geral' ? 'ativo' : '') + '">Esta semana</a><a role="tab" href="#/ranking/geral" class="' + (periodo === 'geral' ? 'ativo' : '') + '">Geral</a></div>' +
      '<p class="ranking-sub">' + (periodo !== 'geral' ? 'Zera toda segunda-feira. Todo mundo tem chance!' : 'Todo o XP desde o primeiro dia.') + '</p>' +
      '<ol class="lista-ranking"><li class="carregando"><div class="spinner"></div></li></ol><div class="anuncio-slot"></div></section>');
    try {
      var r = await api('GET', '/ranking?periodo=' + (periodo === 'geral' ? 'geral' : 'semana'));
      var ol = $app.querySelector('.lista-ranking');
      if (!ol) return;
      ol.innerHTML = r.lista.length ? r.lista.map(function (x) {
        var med = x.posicao === 1 ? '🥇' : x.posicao === 2 ? '🥈' : x.posicao === 3 ? '🥉' : x.posicao;
        return '<li class="' + (x.eu ? 'eu' : '') + '"><span class="pos">' + med + '</span><span class="av">' + esc(x.avatar) + '</span><span class="nome">' + esc(x.nome) + (x.eu ? ' (você)' : '') + '<small>@' + esc(x.usuario) + ' · Nv ' + x.nivel + '</small></span><b>' + x.xp + ' XP</b></li>';
      }).join('') : '<li class="vazio">Ninguém pontuou ainda nesta semana. Faça uma fase e seja o primeiro!</li>';
    } catch (e) { E.aviso(esc(e.message), 'erro'); }
  }

  // =============================================================
  // PERFIL
  // =============================================================
  function telaPerfil() {
    var u = estado.usuario, n = u.nivel;
    var conquistas = (estado.meta && estado.meta.conquistas) || [];
    var html = '<section class="perfil">' +
      '<div class="perfil-cab"><button class="perfil-av" aria-label="Trocar avatar">' + u.avatar + '</button><div><h1>' + esc(u.nome) + '</h1><p>@' + esc(u.usuario) + ' · desde ' + new Date(u.criadoEm).toLocaleDateString('pt-BR') + '</p></div></div>' +
      '<div class="avatares troca" hidden>' + AVATARES.map(function (a) { return '<button class="avatar' + (a === u.avatar ? ' sel' : '') + '" data-av="' + a + '">' + a + '</button>'; }).join('') + '</div>' +
      '<div class="nivel-box"><b>Nível ' + n.nivel + '</b><div class="barra"><i style="width:' + Math.round(n.xpNoNivel / n.xpProximo * 100) + '%"></i></div><small>' + n.xpNoNivel + ' / ' + n.xpProximo + ' XP para o nível ' + (n.nivel + 1) + '</small></div>' +
      '<div class="stats">' +
      '<div><b>' + u.xp + '</b><span>XP total</span></div>' +
      '<div><b>' + u.ofensiva + '🔥</b><span>ofensiva</span></div>' +
      '<div><b>' + u.maxOfensiva + '</b><span>maior ofensiva</span></div>' +
      '<div><b>' + u.protetores + '🛡️</b><span>protetores</span></div>' +
      '</div>' +
      '<p class="nota">🛡️ A cada 7 dias seguidos você ganha um protetor (máx. 2). Se faltar um dia, ele salva sua ofensiva.</p>' +
      '<h2 class="titulo-secao">Progresso</h2><div class="prog-cursos">' + ORDEM.map(function (cid) {
        var p = progressoCurso(cid), c = CURSOS[cid];
        var est = fasesDoCurso(cid).reduce(function (t, f) { return t + (feita(f.id) ? u.fases[f.id].estrelas : 0); }, 0);
        return '<a href="#/trilha/' + cid + '" style="--cor:' + c.cor + '"><span>' + c.icone + '</span><b>' + esc(c.nome) + '</b><small>' + p.feitas + '/' + p.total + ' fases · ' + est + '★</small><div class="barra"><i style="width:' + Math.round(p.feitas / p.total * 100) + '%"></i></div></a>';
      }).join('') + '</div>' +
      '<h2 class="titulo-secao">Certificados</h2>' + listaCertificados() +
      '<h2 class="titulo-secao">Conquistas</h2><div class="conquistas">' + conquistas.map(function (c) {
        var tem = u.conquistas.indexOf(c.id) >= 0;
        return '<div class="conquista ' + (tem ? 'on' : '') + '"><span>' + (tem ? c.icone : '🔒') + '</span><b>' + esc(c.nome) + '</b><small>' + esc(c.desc) + '</small></div>';
      }).join('') + '</div>' +
      '<h2 class="titulo-secao">Ajustes</h2><div class="ajustes">' +
      '<label>Meta diária<select class="sel-meta">' + [10, 20, 30, 50, 80].map(function (m) { return '<option value="' + m + '"' + (m === u.metaDiaria ? ' selected' : '') + '>' + m + ' XP por dia' + (m === 10 ? ' (tranquilo)' : m === 30 ? ' (recomendado)' : m === 80 ? ' (intenso)' : '') + '</option>'; }).join('') + '</select></label>' +
      '<label class="linha-check"><input type="checkbox" class="chk-som"' + (E.somLigado() ? ' checked' : '') + '> Sons de acerto e erro</label>' +
      '<button class="btn btn-sec btn-sair">Sair da conta</button></div>' +
      '<h2 class="titulo-secao">Sua opinião</h2><div class="ajustes"><p class="nota">Ideias, pedidos de aulas, problemas ou elogios: tudo chega direto para quem cuida do site.</p><a class="btn btn-sec" href="#/sugestao">💬 Enviar sugestão</a></div>' +
      '<h2 class="titulo-secao">Privacidade</h2><div class="ajustes">' +
      '<p class="nota"><a href="/privacidade">Política de privacidade</a> · <a href="/termos">Termos de uso</a> · <a href="/aprender">Aulas abertas</a></p>' +
      '<button class="btn btn-sec btn-cookies">Preferências de cookies</button>' +
      '<details class="excluir"><summary>Excluir minha conta</summary>' +
      '<p class="nota">Isso apaga para sempre seu cadastro, estrelas, ofensiva e progresso. Não dá para desfazer.</p>' +
      '<form class="form-excluir"><label>Digite sua senha para confirmar<input type="password" name="senha" autocomplete="current-password" required></label>' +
      '<p class="erro-form" role="alert"></p><button class="btn nok" type="submit">Excluir minha conta para sempre</button></form></details></div>' +
      '</section>';
    tela(html, 'perfil-tela');
    var troca = $app.querySelector('.avatares.troca');
    $app.querySelector('.perfil-av').onclick = function () { troca.hidden = !troca.hidden; };
    troca.querySelectorAll('.avatar').forEach(function (b) {
      b.onclick = async function () { await api('PATCH', '/eu', { avatar: b.dataset.av }); telaPerfil(); };
    });
    $app.querySelector('.sel-meta').onchange = async function (e) { await api('PATCH', '/eu', { metaDiaria: Number(e.target.value) }); E.aviso('Meta atualizada ✔'); };
    $app.querySelector('.chk-som').onchange = function (e) { ls('cq_som', e.target.checked ? 'on' : 'off'); };
    $app.querySelector('.btn-sair').onclick = function () { sair(); };
    $app.querySelector('.btn-cookies').onclick = function () { window.cqConsentimento.reabrir(); };
    $app.querySelector('.form-excluir').onsubmit = async function (e) {
      e.preventDefault();
      if (!confirm('Tem certeza? Sua conta e todo o progresso serão apagados.')) return;
      try {
        await api('POST', '/eu/excluir', { senha: e.target.senha.value });
        ls('cq_token', null); estado.usuario = null;
        E.aviso('Conta excluída. Obrigado por ter estudado com a gente 💜', 'ok');
        ir('#/cadastro');
      } catch (err) { e.target.querySelector('.erro-form').textContent = err.message; }
    };
  }

  // =============================================================
  // PROVA FINAL E CERTIFICADO (#/prova/python)
  // =============================================================
  function certificadoDe(cid) { return estado.usuario && estado.usuario.certificados ? estado.usuario.certificados[cid] || null : null; }
  function cartaoProva(cid) {
    var c = CURSOS[cid], p = progressoCurso(cid), cert = certificadoDe(cid);
    if (cert) return '<section class="cartao-prova" style="--cor:' + c.cor + '"><span class="ico-grande">🎓</span><h2>Trilha concluída!</h2><p>Você foi aprovado(a) na prova final com ' + cert.nota + '%.</p><a class="btn" href="/certificado/' + cert.codigo + '">Ver meu certificado</a><a class="btn btn-sec" href="#/prova/' + cid + '">Refazer a prova</a></section>';
    if (!p.proxima) return '<section class="cartao-prova" style="--cor:' + c.cor + '"><span class="ico-grande">🎓</span><h2>Prova final liberada!</h2><p>Passe com 70% e ganhe o certificado de ' + esc(c.nome) + '.</p><a class="btn btn-grande" href="#/prova/' + cid + '">Fazer a prova</a></section>';
    return '<section class="cartao-prova" style="--cor:' + c.cor + '"><span class="ico-grande">🔒</span><h2>Prova final e certificado</h2><p>Conclua as ' + (p.total - p.feitas) + ' fases que faltam para liberar a prova e ganhar o certificado de ' + esc(c.nome) + '.</p></section>';
  }
  function listaCertificados() {
    var lista = ORDEM.filter(function (cid) { return certificadoDe(cid); });
    var faltando = ORDEM.filter(function (cid) { return !certificadoDe(cid) && !progressoCurso(cid).proxima; });
    if (!lista.length && !faltando.length) return '<p class="nota">Conclua todas as fases de uma trilha e passe na prova final para ganhar o certificado dela.</p>';
    return '<div class="lista-certs">' + lista.map(function (cid) {
      var cert = certificadoDe(cid);
      return '<a class="item-cert" href="/certificado/' + cert.codigo + '"><span>' + CURSOS[cid].icone + '</span><span><b>' + esc(CURSOS[cid].nome) + '</b><small>' + cert.horas + ' horas · nota ' + cert.nota + '% · ' + esc(cert.codigo) + '</small></span></a>';
    }).join('') + faltando.map(function (cid) {
      return '<a class="item-cert" href="#/prova/' + cid + '"><span>' + CURSOS[cid].icone + '</span><span><b>' + esc(CURSOS[cid].nome) + '</b><small>Trilha concluída: faça a prova final</small></span></a>';
    }).join('') + '</div>';
  }

  async function telaProva(cid) {
    var c = CURSOS[cid];
    tela('<section class="prova-intro" style="--cor:' + c.cor + '"><div class="carregando"><div class="spinner"></div></div></section>', 'prova-tela');
    var st;
    try { st = await api('GET', '/prova/' + cid); } catch (e) { $app.querySelector('.prova-intro').innerHTML = '<p>' + esc(e.message) + '</p>'; return; }
    var box = $app.querySelector('.prova-intro');
    var cert = st.certificado;
    box.innerHTML = '<div class="trilha-cab"><a href="#/trilha/' + cid + '" class="voltar" aria-label="Voltar">‹</a><span class="cc-icone">' + c.icone + '</span><div><h1>Prova final de ' + esc(c.nome) + '</h1><p>Carga horária estimada da trilha: ' + st.horas + ' horas</p></div></div>' +
      (!st.liberada ? '<p class="nota">🔒 Conclua todas as fases da trilha para liberar a prova. Faltam <b>' + st.faltam + '</b>.</p><a class="btn" href="#/trilha/' + cid + '">Voltar à trilha</a>' :
        '<ul class="prova-regras">' +
        '<li><b>' + st.questoes + ' perguntas</b> sorteadas de toda a trilha (cada tentativa é diferente)</li>' +
        '<li>Sem dicas e sem ver a resposta durante a prova</li>' +
        '<li>Para passar: <b>' + Math.round(st.minimo * 100) + '%</b> de acertos</li>' +
        '<li>Até 3 tentativas por dia (restam <b>' + st.restantesHoje + '</b> hoje)</li>' +
        '<li>Os desafios de código das fases (inclusive os chefões) já foram a parte prática: esta prova confere a teoria</li></ul>' +
        (st.melhor ? '<p class="nota">Sua melhor nota até agora: <b>' + st.melhor + '%</b>.</p>' : '') +
        (cert ? '<p class="nota">✔ Você já tem o certificado. Refazer a prova pode melhorar a nota que aparece nele.</p><a class="btn btn-sec" href="/certificado/' + cert.codigo + '">Ver meu certificado</a>' : '') +
        (st.aprovado && !cert ? '<p class="nota">✔ Você já passou! Falta só emitir o certificado.</p><button class="btn btn-grande b-emitir">🎓 Emitir certificado</button>' : '') +
        (st.restantesHoje > 0 ? '<button class="btn btn-grande b-comecar">Começar a prova</button>' : '<p class="nota">Você usou as tentativas de hoje. Aproveite para revisar as fases e volte amanhã!</p>') +
        '<p class="nota">O certificado é ilustrativo: o CodeQuest não é reconhecido pelo MEC. Ele mostra o que você estudou, a carga horária e as habilidades da trilha.</p>');
    var bc = box.querySelector('.b-comecar');
    if (bc) bc.onclick = function () { comecarProva(cid); };
    var be = box.querySelector('.b-emitir');
    if (be) be.onclick = function () { telaEmitir(cid); };
  }

  async function comecarProva(cid) {
    var c = CURSOS[cid];
    var dados;
    try { dados = await api('POST', '/prova/' + cid + '/iniciar'); } catch (e) { E.aviso(esc(e.message), 'erro'); return; }
    var respostas = [], i = 0;
    function mostrar() {
      var id = dados.ids[i], partes = id.split(':'), info = FASES[partes[0]], ex = info.fase.ex[Number(partes[1])];
      var p = { ex: ex, info: info };
      var ordem = embaralhar(ex.op.map(function (_, k) { return k; }));
      $app.querySelector('main').innerHTML = '<section class="prova-intro" style="--cor:' + c.cor + '">' +
        '<div class="jogo-barra" role="progressbar" aria-label="Progresso da prova"><i style="width:' + Math.round(i / dados.ids.length * 100) + '%"></i></div>' +
        '<p class="nota">Pergunta ' + (i + 1) + ' de ' + dados.ids.length + ' · ' + esc(info.fase.titulo) + '</p>' +
        '<article class="exercicio"><h1>' + (ex.tipo === 'prever' ? (ex.p || 'O que aparece na tela?') : ex.p) + '</h1>' +
        blocoContexto(c.ling, contexto(p, null)) +
        (ex.codigo ? codigoHtml(ex.codigo, c.ling) : '') +
        (ex.entrada ? '<p class="entrada-info">Entrada digitada: <code>' + esc(ex.entrada).replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
        '<div class="opcoes" role="radiogroup">' + ordem.map(function (k) {
          return '<button class="opcao" role="radio" aria-checked="false" data-i="' + k + '">' + (ex.tipo === 'prever' ? '<pre>' + esc(ex.op[k]) + '</pre>' : esc(ex.op[k])) + '</button>';
        }).join('') + '</div></article>' +
        '<button class="btn btn-grande b-prox" disabled>' + (i === dados.ids.length - 1 ? 'Entregar a prova' : 'Próxima') + '</button></section>';
      hidratarBancos($app);
      window.scrollTo(0, 0);
      var escolhido = null, bp = $app.querySelector('.b-prox');
      $app.querySelectorAll('.opcao').forEach(function (b) {
        b.onclick = function () {
          $app.querySelectorAll('.opcao').forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
          b.classList.add('sel'); b.setAttribute('aria-checked', 'true');
          escolhido = Number(b.dataset.i); bp.disabled = false;
        };
      });
      bp.onclick = function () {
        respostas[i] = escolhido;
        i++;
        if (i < dados.ids.length) mostrar(); else entregar();
      };
    }
    async function entregar() {
      $app.querySelector('main').innerHTML = '<div class="carregando"><div class="spinner"></div><p>Corrigindo...</p></div>';
      var r;
      try { r = await api('POST', '/prova/' + cid + '/enviar', { token: dados.token, respostas: respostas }); }
      catch (e) { $app.querySelector('main').innerHTML = '<div class="carregando"><p>' + esc(e.message) + '</p><a class="btn" href="#/prova/' + cid + '">Voltar</a></div>'; return; }
      estado.usuario = r.usuario;
      var erradas = r.gabarito.filter(function (g) { return !g.acertou; });
      $app.querySelector('main').innerHTML = '<section class="prova-res resultado" style="--cor:' + c.cor + '">' +
        '<p class="res-sobre">Prova final · ' + esc(c.nome) + '</p>' +
        '<h1>' + (r.aprovado ? 'Aprovado(a)! 🎉' : 'Quase lá!') + '</h1>' +
        '<div class="res-numeros"><div><b>' + r.nota + '%</b><span>de acertos</span></div><div><b>' + r.acertos + '/' + r.total + '</b><span>perguntas</span></div><div><b>' + r.minimo + '%</b><span>para passar</span></div></div>' +
        (r.aprovado ? '<button class="btn btn-grande b-emitir">🎓 Emitir meu certificado</button>' : '<p class="res-dica">Revise as fases das perguntas abaixo e tente de novo. Cada tentativa sorteia perguntas diferentes.</p><a class="btn btn-grande" href="#/prova/' + cid + '">Tentar de novo</a>') +
        (erradas.length ? '<h2 class="titulo-secao">Para revisar</h2><ul class="gabarito">' + erradas.map(function (g) {
          var pt = g.id.split(':'), inf = FASES[pt[0]], ex = inf.fase.ex[Number(pt[1])];
          return '<li><b>' + esc(inf.fase.titulo) + '</b><br>' + (ex.tipo === 'prever' ? (ex.p || 'O que aparece na tela?') : ex.p) + '<br><small>Resposta certa:</small> <code>' + esc(ex.op[ex.c]).replace(/\n/g, ' ⏎ ') + '</code><br><small>' + esc(ex.exp || '') + '</small><br><a href="#/fase/' + pt[0] + '">Rever a fase</a></li>';
        }).join('') + '</ul>' : '') +
        '</section>';
      if (r.aprovado) { E.sons.fase(); E.comemorar(); }
      var be = $app.querySelector('.b-emitir');
      if (be) be.onclick = function () { telaEmitir(cid); };
    }
    mostrar();
  }

  function telaEmitir(cid) {
    var c = CURSOS[cid], u = estado.usuario;
    $app.querySelector('main').innerHTML = '<section class="prova-intro" style="--cor:' + c.cor + '"><h1>🎓 Seu certificado de ' + esc(c.nome) + '</h1>' +
      '<form class="form-sugestao f-emitir"><label>Nome completo que vai aparecer no certificado<input name="nome" maxlength="80" required value="' + esc((certificadoDe(cid) || {}).nome || u.nome) + '"></label>' +
      '<p class="nota">Confira com calma: escreva como quer que apareça (ex: Michael Rodrigues dos Santos).</p>' +
      '<p class="erro-form" role="alert"></p><button class="btn btn-grande" type="submit">Gerar certificado</button></form></section>';
    var f = $app.querySelector('.f-emitir');
    f.onsubmit = async function (e) {
      e.preventDefault();
      try {
        var r = await api('POST', '/certificados/' + cid, { nome: f.nome.value });
        estado.usuario = r.usuario;
        location.href = r.url;
      } catch (err) { f.querySelector('.erro-form').textContent = err.message; }
    };
  }

  // =============================================================
  // SUGESTÕES (#/sugestao) — funciona com ou sem conta
  // =============================================================
  var TIPOS_MSG = [
    ['sugestao', '💡', 'Ideia de melhoria'],
    ['conteudo', '📚', 'Pedir uma aula ou trilha'],
    ['problema', '🐞', 'Algo não funciona'],
    ['elogio', '💜', 'Elogio']
  ];
  function telaSugestao() {
    var tipo = 'sugestao', nota = 0;
    var corpo = '<section class="sugestao">' +
      '<h1>💬 Sua opinião</h1>' +
      '<p class="nota">O CodeQuest é grátis e feito para você. Conte o que pode ficar melhor: cada mensagem é lida.</p>' +
      '<form class="form-sugestao" novalidate>' +
      '<fieldset><legend>Sobre o quê?</legend><div class="tipos-msg">' + TIPOS_MSG.map(function (t, i) {
        return '<button type="button" class="tipo-msg' + (i === 0 ? ' sel' : '') + '" data-tipo="' + t[0] + '" aria-pressed="' + (i === 0) + '"><span>' + t[1] + '</span>' + esc(t[2]) + '</button>';
      }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Quanto você está gostando do CodeQuest? <small>(opcional)</small></legend><div class="estrelas-nota" role="radiogroup">' + [1, 2, 3, 4, 5].map(function (n) {
        return '<button type="button" class="estrela-nota" data-n="' + n + '" role="radio" aria-checked="false" aria-label="' + n + ' de 5">★</button>';
      }).join('') + '</div></fieldset>' +
      '<label>Sua mensagem<textarea name="texto" rows="5" maxlength="1500" required placeholder="Ex: queria uma trilha de TypeScript / a fase 12 de SQL está confusa / adorei o ranking"></textarea></label>' +
      '<label>Quer resposta? Deixe um e-mail ou WhatsApp <small>(opcional)</small><input name="contato" maxlength="100" autocomplete="email"></label>' +
      '<p class="erro-form" role="alert"></p>' +
      '<button class="btn btn-grande" type="submit">Enviar</button>' +
      '</form></section>';
    if (estado.usuario) tela(corpo, 'sugestao-tela');
    else {
      $app.innerHTML = '<header class="topo"><a href="/" class="marca" aria-label="Início">Code<span>Quest</span></a></header><main class="tela sugestao-tela">' + corpo +
        '<p class="nota"><a href="/">‹ Voltar ao site</a> · <a href="#/cadastro">Criar conta grátis</a></p></main>';
      window.scrollTo(0, 0);
    }
    var form = $app.querySelector('.form-sugestao');
    form.querySelectorAll('.tipo-msg').forEach(function (b) {
      b.onclick = function () {
        form.querySelectorAll('.tipo-msg').forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('sel'); b.setAttribute('aria-pressed', 'true'); tipo = b.dataset.tipo;
      };
    });
    var estrelas = form.querySelectorAll('.estrela-nota');
    estrelas.forEach(function (b) {
      b.onclick = function () {
        nota = Number(b.dataset.n);
        estrelas.forEach(function (x) { var on = Number(x.dataset.n) <= nota; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(Number(x.dataset.n) === nota)); });
      };
    });
    form.onsubmit = async function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        await api('POST', '/sugestao', { tipo: tipo, nota: nota || null, texto: form.texto.value, contato: form.contato.value, pagina: document.referrer ? 'site' : 'app' });
        form.innerHTML = '<div class="obrigado"><span class="ico-grande">🎉</span><h2>Recebido, obrigado!</h2><p>Sua mensagem ajuda a deixar o CodeQuest melhor para todo mundo.</p>' +
          (estado.usuario ? '<a class="btn" href="#/">Voltar às trilhas</a>' : '<a class="btn" href="/">Voltar ao site</a>') + '</div>';
      } catch (err) {
        form.querySelector('.erro-form').textContent = err.message;
        btn.disabled = false;
      }
    };
  }

  // =============================================================
  // LABORATÓRIO (código livre)
  // =============================================================
  function telaLab(cid) {
    var c = CURSOS[cid], ling = c.ling;
    var EXEMPLOS = {
      python: 'nome = input("Seu nome: ")\nfor i in range(3):\n    print(f"{i + 1}. Olá, {nome}!")\n',
      javascript: 'const nome = prompt("Seu nome: ");\nfor (let i = 1; i <= 3; i++) {\n  console.log(`${i}. Olá, ${nome}!`);\n}\n',
      java: 'Scanner sc = new Scanner(System.in);\nString nome = sc.nextLine();\nfor (int i = 1; i <= 3; i++) {\n    System.out.println(i + ". Olá, " + nome + "!");\n}\n',
      html: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <style>\n    body { font-family: sans-serif; }\n    h1 { color: #E91E63; }\n    .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }\n  </style>\n</head>\n<body>\n  <h1>Meu salão</h1>\n  <div class="card">\n    <p>Corte: <b>R$ 40</b></p>\n  </div>\n</body>\n</html>\n',
      sql: 'SELECT nome, preco\nFROM servicos\nORDER BY preco DESC;\n',
      node: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\napp.get("/ola", (req, res) => {\n  res.json({ mensagem: "Olá do servidor!" });\n});\n\napp.listen(3000, () => console.log("Servidor na porta 3000"));\n\n// testando como se fosse o navegador:\nconst r = await fetch("http://localhost:3000/ola");\nconsole.log(r.status, await r.json());\n',
      react: 'function Contador() {\n  const [n, setN] = useState(0);\n  return (\n    <div>\n      <p>Cliques: {n}</p>\n      <button onClick={() => setN(n + 1)}>+1</button>\n    </div>\n  );\n}\n\nrenderizar(<Contador />);\nclicar("button");\nconsole.log(document.querySelector("p").textContent);\n',
      terminal: 'mkdir meu-site\ncd meu-site\necho "<h1>Oi</h1>" > index.html\ngit init\ngit add .\ngit commit -m "Primeira versão"\ngit log --oneline\n'
    };
    var exemplo = EXEMPLOS[ling] || '';
    var temEntrada = ling === 'python' || ling === 'javascript' || ling === 'java';
    var ctxLab = { banco: c.banco };
    var dicaLab = {
      html: 'Escreva uma página inteira (HTML e CSS) e toque em Executar para ver como fica.',
      sql: 'As tabelas de exemplo estão abaixo. Cada vez que você executa, o banco volta ao original.',
      node: 'Aqui o servidor roda no seu navegador. Use fetch("http://localhost:3000/...") para testar as rotas.',
      react: 'Use renderizar(<Componente />) para desenhar na tela, e clicar("seletor") / digitar("seletor", "texto") para interagir.',
      terminal: 'Um terminal de treino: pastas, arquivos, Git e npm de mentirinha. Cada execução começa do zero, numa pasta vazia.'
    }[ling];
    tela('<section class="lab" style="--cor:' + c.cor + '"><div class="trilha-cab"><a href="#/trilha/' + cid + '" class="voltar" aria-label="Voltar">‹</a><span class="cc-icone">' + c.icone + '</span><div><h1>Laboratório de ' + esc(c.nome) + '</h1><p>Teste qualquer ideia. Seu código fica salvo neste aparelho.</p></div></div>' +
      (dicaLab ? '<p class="nota">' + esc(dicaLab) + '</p>' : '') +
      blocoContexto(ling, ctxLab) +
      '<div class="editor-box"></div>' +
      (temEntrada ? '<label class="lab-entrada">Entrada (uma resposta por linha, para ' + (ling === 'python' ? 'input()' : ling === 'javascript' ? 'prompt()' : 'Scanner') + ')<textarea rows="2" spellcheck="false">Michael</textarea></label>' : '') +
      '<div class="desafio-botoes"><button class="btn b-rodar">▶ Executar</button><button class="btn btn-sec b-limpar">Limpar</button></div>' +
      (ling === 'java' ? '<p class="nota">No Java, se você não escrever uma classe com main, a plataforma coloca seu código dentro de um main automaticamente.</p>' : '') +
      '<div class="saida" hidden></div></section>', 'lab-tela');
    hidratarBancos($app);
    if (ling === 'python') window.cqExecutor.prepararPython();
    var chave = 'cq_lab_' + cid;
    var ed = window.cqCriarEditor($app.querySelector('.editor-box'), { ling: ling, valor: ls(chave) || exemplo, aoMudar: function (v) { ls(chave, v); }, aoAtalho: function () { b.click(); } });
    var b = $app.querySelector('.b-rodar'), saida = $app.querySelector('.saida');
    b.onclick = async function () {
      b.disabled = true; b.textContent = ling === 'python' && !window.cqExecutor.pythonPronto() ? 'Carregando Python...' : 'Rodando...';
      var campoEntrada = $app.querySelector('.lab-entrada textarea');
      var r = await window.cqExecutor.executar(ling, ed.valor(), campoEntrada ? campoEntrada.value : '', ctxLab);
      mostrarSaida(saida, r, ling);
      b.disabled = false; b.textContent = '▶ Executar';
    };
    $app.querySelector('.b-limpar').onclick = function () { if (confirm('Apagar o código do laboratório?')) ed.definir(''); };
  }

  // =============================================================
  // PAINEL DO DONO (#/admin) — só para quem está em ADMIN_USUARIOS
  // =============================================================
  var SERIES = [ // cores validadas para o fundo escuro (contraste e daltonismo)
    { campo: 'visitantes', nome: 'Visitantes únicos', curto: 'Visitantes', cor: '#3987e5' },
    { campo: 'ativos', nome: 'Usuários ativos', curto: 'Ativos', cor: '#d95926' },
    { campo: 'estudaram', nome: 'Estudaram', curto: 'Estudaram', cor: '#199e70' }
  ];
  function fmt(n) { return Number(n || 0).toLocaleString('pt-BR'); }
  function pct(a, b) { return b ? Math.round(a / b * 100) + '%' : '—'; }
  function diaCurto(d) { return d.slice(8, 10) + '/' + d.slice(5, 7); }

  async function telaAdmin() {
    if (!estado.usuario.admin) { E.aviso('Área só para o administrador.'); return ir('#/'); }
    tela('<section class="admin"><div class="admin-cab"><h1>Painel</h1><button class="btn btn-sec b-atualizar">↻ Atualizar</button></div><div class="carregando"><div class="spinner"></div></div></section>', 'admin-tela');
    var d;
    try { d = await api('GET', '/admin/painel'); } catch (e) { $app.querySelector('.admin .carregando').innerHTML = '<p>' + esc(e.message) + '</p>'; return; }
    var P = d.periodos, T = d.totais;
    var tile = function (titulo, valor, linha, dica) {
      return '<div class="tile"><span class="tile-titulo">' + titulo + '</span><b>' + valor + '</b><small>' + linha + '</small>' + (dica ? '<i class="tile-dica">' + dica + '</i>' : '') + '</div>';
    };
    var trio = function (campo) { return 'hoje ' + fmt(P.hoje[campo]) + ' · 30 dias ' + fmt(P.d30[campo]); };
    var html = '<div class="admin-cab"><h1>Painel</h1><button class="btn btn-sec b-atualizar">↻ Atualizar</button></div>' +
      '<p class="nota">Números de hoje (' + d.hoje.split('-').reverse().join('/') + ') e dos últimos 7 e 30 dias. Os ganhos dos anúncios aparecem no <a href="https://adsense.google.com" target="_blank" rel="noopener">painel do AdSense</a>.</p>' +
      '<h2 class="titulo-secao">Agora</h2><div class="tiles">' +
      tile('🟢 Online agora', fmt(d.online.agora), fmt(d.online.logados) + ' com conta · ' + fmt(d.online.visitantes) + ' visitantes', 'Aparelhos com o site ou o app aberto nos últimos 5 minutos') +
      (d.online.paginas.length ? '<div class="tile"><span class="tile-titulo">Onde estão agora</span><small>' + d.online.paginas.map(function (p) { return esc(p[0]) + ': <b>' + p[1] + '</b>'; }).join('<br>') + '</small></div>' : '') +
      '</div>' +
      '<h2 class="titulo-secao">Pessoas</h2><div class="tiles">' +
      tile('Usuários cadastrados', fmt(T.usuarios), '+' + fmt(T.cadastrosHoje) + ' hoje · +' + fmt(T.cadastros7) + ' em 7 dias', 'Total de contas criadas') +
      tile('Visitantes únicos · 7 dias', fmt(P.d7.visitantes), trio('visitantes'), 'Aparelhos diferentes que abriram o site ou o app (com ou sem conta)') +
      tile('Usuários ativos · 7 dias', fmt(P.d7.ativos), trio('ativos'), 'Pessoas com conta que abriram o app') +
      tile('Estudaram · 7 dias', fmt(P.d7.estudaram), trio('estudaram'), 'Pessoas que concluíram fase ou revisão') +
      '</div>' +
      '<h2 class="titulo-secao">Uso</h2><div class="tiles">' +
      tile('Visualizações · 7 dias', fmt(P.d7.visualizacoes), trio('visualizacoes'), 'Telas e páginas abertas (cada uma pode ter anúncio)') +
      tile('Fases concluídas · 7 dias', fmt(P.d7.fases), trio('fases')) +
      tile('Conversão em cadastro', pct(T.cadastros30, P.d30.visitantesNovos), fmt(T.cadastros30) + ' cadastros de ' + fmt(P.d30.visitantesNovos) + ' visitantes novos (30 dias)') +
      tile('Retorno em 7 dias', pct(d.retorno.voltaram, d.retorno.coorte), fmt(d.retorno.voltaram) + ' de ' + fmt(d.retorno.coorte) + ' que entraram há 8–30 dias voltaram esta semana') +
      tile('Com ofensiva viva', fmt(T.comOfensiva), 'estudaram hoje ou ontem') +
      tile('Nunca jogaram', fmt(T.nuncaJogaram), 'criaram conta e não concluíram nenhuma fase') +
      tile('🎓 Certificados emitidos', fmt(T.certificados || 0), fmt(T.comCertificado || 0) + ' pessoa(s) com certificado', 'Quem concluiu uma trilha inteira e passou na prova final') +
      '</div>' +
      '<h2 class="titulo-secao">Últimos 30 dias</h2><div class="grafico-box"><div class="legenda">' +
      SERIES.map(function (sr) { return '<span><i style="background:' + sr.cor + '"></i>' + sr.nome + '</span>'; }).join('') +
      '</div><div class="grafico" role="img" aria-label="Gráfico de linhas dos últimos 30 dias: visitantes únicos, usuários ativos e quem estudou, por dia"></div>' +
      '<details class="tabela-dados"><summary>Ver como tabela</summary><div class="tabela-rolagem"><table><thead><tr><th>Dia</th><th>Visitantes</th><th>Novos</th><th>Ativos</th><th>Estudaram</th><th>Cadastros</th><th>Visualizações</th><th>Fases</th></tr></thead><tbody>' +
      d.porDia.slice().reverse().map(function (x) { return '<tr><td>' + diaCurto(x.dia) + '</td><td>' + x.visitantes + '</td><td>' + x.visitantesNovos + '</td><td>' + x.ativos + '</td><td>' + x.estudaram + '</td><td>' + x.cadastros + '</td><td>' + x.visualizacoes + '</td><td>' + x.fases + '</td></tr>'; }).join('') +
      '</tbody></table></div></details></div>' +
      '<h2 class="titulo-secao">Onde as pessoas param</h2><p class="nota">Quantas pessoas concluíram cada fase. Uma queda grande entre duas fases mostra uma aula que pode estar difícil demais.</p>' +
      d.funil.map(function (f, k) {
        var max = Math.max(1, f.comecaram);
        var pior = null;
        for (var i = 1; i < f.fases.length; i++) {
          var queda = f.fases[i - 1].concluiram - f.fases[i].concluiram;
          if (queda > 0 && (!pior || queda > pior.queda)) pior = { queda: queda, de: f.fases[i - 1], para: f.fases[i] };
        }
        return '<details class="funil"' + (k === 0 ? ' open' : '') + ' style="--cor:' + f.cor + '"><summary>' + f.icone + ' ' + esc(f.nome) + ' <small>' + fmt(f.comecaram) + ' começaram</small></summary>' +
          (pior ? '<p class="nota">Maior desistência: entre a fase ' + pior.de.num + ' (' + esc(pior.de.titulo) + ') e a ' + pior.para.num + ' (' + esc(pior.para.titulo) + '): −' + fmt(pior.queda) + ' pessoas.</p>' : '') +
          '<ol class="barras">' + f.fases.map(function (x) {
            return '<li title="' + esc(x.titulo) + ': ' + x.concluiram + ' concluíram"><span class="b-rot">' + x.num + '. ' + esc(x.titulo) + '</span><span class="b-trilho"><i style="width:' + (x.concluiram / max * 100) + '%"></i></span><b>' + fmt(x.concluiram) + '</b></li>';
          }).join('') + '</ol></details>';
      }).join('') +
      '<div class="admin-duas">' +
      '<section><h2 class="titulo-secao">Páginas mais vistas · 30 dias</h2><ol class="barras">' +
      (d.paginas.length ? d.paginas.map(function (p, i, arr) { return '<li><span class="b-rot">' + esc(p[0]) + '</span><span class="b-trilho"><i style="width:' + (p[1] / arr[0][1] * 100) + '%"></i></span><b>' + fmt(p[1]) + '</b></li>'; }).join('') : '<li class="vazio">Ainda sem visitas</li>') +
      '</ol></section>' +
      '<section><h2 class="titulo-secao">Fases concluídas por linguagem · 30 dias</h2><ol class="barras">' +
      (d.cursos.length ? d.cursos.map(function (c, i, arr) { var cc = CURSOS[c[0]] || { nome: c[0], icone: '' }; return '<li><span class="b-rot">' + cc.icone + ' ' + esc(cc.nome) + '</span><span class="b-trilho"><i style="width:' + (c[1] / arr[0][1] * 100) + '%"></i></span><b>' + fmt(c[1]) + '</b></li>'; }).join('') : '<li class="vazio">Nenhuma fase concluída ainda</li>') +
      '</ol></section></div>' +
      '<h2 class="titulo-secao">Cadastros recentes</h2><div class="tabela-rolagem"><table class="tabela-recentes"><thead><tr><th>Pessoa</th><th>Entrou em</th><th>Fases</th><th>XP</th><th>Último estudo</th></tr></thead><tbody>' +
      d.recentes.map(function (u) { return '<tr><td>' + esc(u.avatar) + ' ' + esc(u.nome) + ' <small>@' + esc(u.usuario) + '</small></td><td>' + new Date(u.criadoEm).toLocaleDateString('pt-BR') + '</td><td>' + u.fases + '</td><td>' + fmt(u.xp) + '</td><td>' + (u.ultimoDia ? u.ultimoDia.split('-').reverse().join('/') : '—') + '</td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<p class="nota">Como contamos: cada aparelho recebe um código aleatório (sem nome, e-mail ou IP). Robôs de busca não entram na conta. Visualizações do próprio painel também não.</p>' +
      '<h2 class="titulo-secao">Mensagens dos alunos</h2><p class="nota">Sugestões, pedidos de aulas, problemas e elogios (tela 💬) e os avisos do botão ⚑ dentro das fases.</p><div class="avisos"><div class="carregando"><div class="spinner"></div></div></div>' +
      '<h2 class="titulo-secao">Ferramentas</h2><div class="ferramentas">' +
      '<form class="f-usuario"><label>Nome de usuário<input name="usuario" autocapitalize="off" placeholder="ex: bia_estuda" required></label>' +
      '<div class="desafio-botoes"><button class="btn btn-sec" data-acao="senha" type="submit">🔑 Gerar senha provisória</button><button class="btn nok" data-acao="remover" type="submit">🗑 Remover usuário</button></div>' +
      '<p class="resultado-ferramenta" role="status"></p></form>' +
      '<div><p class="nota">O banco grátis do Atlas não faz backup. Baixe um por semana e guarde no Google Drive. O arquivo contém dados das contas: não compartilhe.</p><button class="btn btn-sec b-backup">💾 Baixar backup</button></div>' +
      '</div>';
    var box = $app.querySelector('.admin');
    box.innerHTML = html;
    box.querySelector('.b-atualizar').onclick = telaAdmin;
    desenharGrafico(box.querySelector('.grafico'), d.porDia);
    carregarAvisos(box.querySelector('.avisos'));
    var fu = box.querySelector('.f-usuario'), saida = box.querySelector('.resultado-ferramenta'), acao = 'senha';
    fu.querySelectorAll('button').forEach(function (b) { b.onclick = function () { acao = b.dataset.acao; }; });
    fu.onsubmit = async function (e) {
      e.preventDefault();
      var nomeU = fu.usuario.value.trim().toLowerCase();
      try {
        if (acao === 'remover') {
          if (!confirm('Remover @' + nomeU + ' e todo o progresso? Não dá para desfazer.')) return;
          await api('DELETE', '/admin/usuarios/' + encodeURIComponent(nomeU));
          saida.textContent = '@' + nomeU + ' removido.';
        } else {
          var r = await api('POST', '/admin/usuarios/' + encodeURIComponent(nomeU) + '/senha');
          saida.innerHTML = 'Senha provisória de <b>@' + esc(r.usuario) + '</b>: <code>' + esc(r.senha) + '</code> — envie para a pessoa e peça para ela entrar com essa senha.';
        }
      } catch (err) { saida.textContent = err.message; }
    };
    box.querySelector('.b-backup').onclick = async function () {
      var resp = await fetch('/api/admin/backup', { headers: { Authorization: 'Bearer ' + ls('cq_token') } });
      if (!resp.ok) return E.aviso('Não consegui gerar o backup.', 'erro');
      var blob = await resp.blob();
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'codequest-backup-' + d.hoje + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      E.aviso('Backup baixado ✔', 'ok');
    };
  }

  async function carregarAvisos(el) {
    var NOMES = { sugestao: '💡 Ideia', conteudo: '📚 Pedido de aula', problema: '🐞 Problema', elogio: '💜 Elogio', aula: '⚑ Aviso numa fase' };
    try {
      var r = await api('GET', '/admin/feedback');
      if (!r.lista.length) { el.innerHTML = '<p class="nota">Nenhuma mensagem ainda. Os alunos escrevem pela tela 💬 Sugestões (link no início, no perfil, no fim das fases e no rodapé do site) e pelo botão ⚑ dentro das fases.</p>'; return; }
      var lista = r.lista.map(function (f) { f.tipo = f.tipo || 'aula'; return f; });
      var cont = {}, notas = lista.filter(function (f) { return f.nota; });
      lista.forEach(function (f) { cont[f.tipo] = (cont[f.tipo] || 0) + 1; });
      var filtro = 'todos';
      var resumo = '<div class="filtro-msgs" role="tablist"><button class="ativo" data-f="todos">Todas (' + lista.length + ')</button>' +
        Object.keys(NOMES).filter(function (k) { return cont[k]; }).map(function (k) { return '<button data-f="' + k + '">' + NOMES[k] + ' (' + cont[k] + ')</button>'; }).join('') + '</div>' +
        (notas.length ? '<p class="nota">Nota média: <b>' + (notas.reduce(function (t, f) { return t + f.nota; }, 0) / notas.length).toFixed(1).replace('.', ',') + ' ★</b> em ' + notas.length + ' avaliação(ões).</p>' : '');
      el.innerHTML = resumo + '<div class="lista-msgs"></div>';
      function desenhar() {
        var box = el.querySelector('.lista-msgs');
        box.innerHTML = lista.filter(function (f) { return filtro === 'todos' || f.tipo === filtro; }).map(function (f) {
          var info = FASES[f.faseId];
          var onde = f.tipo === 'aula' ? (info ? info.curso.icone + ' ' + esc(info.curso.nome) + ' · Fase ' + info.num + ': ' + esc(info.fase.titulo) : esc(f.faseId || 'geral')) +
            (f.passo && f.passo !== 'licao' ? ' <small>(exercício ' + (Number(String(f.passo).split(':')[1]) + 1 || '?') + ')</small>' : f.passo === 'licao' ? ' <small>(lição)</small>' : '') : '';
          return '<div class="aviso-item" data-id="' + esc(f._id) + '"><div><span class="selo-msg selo-' + esc(f.tipo) + '">' + (NOMES[f.tipo] || esc(f.tipo)) + '</span>' +
            (f.nota ? ' <span class="nota-msg" aria-label="' + f.nota + ' de 5">' + '★★★★★'.slice(0, f.nota) + '<i>' + '★★★★★'.slice(f.nota) + '</i></span>' : '') +
            (onde ? '<br><b>' + onde + '</b>' : '') +
            '<p>' + esc(f.texto) + '</p><small>@' + esc(f.usuario) + ' · ' + new Date(f.em).toLocaleString('pt-BR') + (f.contato ? ' · contato: <b>' + esc(f.contato) + '</b>' : '') + '</small></div>' +
            '<button class="btn btn-sec b-resolvido">✔ ' + (f.tipo === 'elogio' ? 'Lido' : 'Resolvido') + '</button></div>';
        }).join('') || '<p class="nota">Nada aqui.</p>';
        box.querySelectorAll('.b-resolvido').forEach(function (b) {
          b.onclick = async function () {
            var item = b.closest('.aviso-item');
            await api('DELETE', '/admin/feedback/' + encodeURIComponent(item.dataset.id));
            lista = lista.filter(function (f) { return f._id !== item.dataset.id; });
            item.remove();
          };
        });
      }
      el.querySelectorAll('.filtro-msgs button').forEach(function (b) {
        b.onclick = function () { filtro = b.dataset.f; el.querySelectorAll('.filtro-msgs button').forEach(function (x) { x.classList.toggle('ativo', x === b); }); desenhar(); };
      });
      desenhar();
    } catch (e) { el.innerHTML = '<p class="nota">' + esc(e.message) + '</p>'; }
  }

  // Gráfico de linhas em SVG, com cursor que mostra os números de cada dia
  function desenharGrafico(el, dados) {
    function desenhar() {
      var W = Math.max(300, el.clientWidth), H = 240, m = { t: 14, r: 112, b: 26, l: 34 };
      if (W < 480) m.r = 12; // no celular os rótulos vão só na legenda
      var iw = W - m.l - m.r, ih = H - m.t - m.b;
      var maxV = 0;
      dados.forEach(function (x) { SERIES.forEach(function (sr) { maxV = Math.max(maxV, x[sr.campo]); }); });
      var passo = Math.max(1, Math.ceil(maxV / 4 / (maxV > 50 ? 10 : 1)) * (maxV > 50 ? 10 : 1));
      var topo = Math.max(4, passo * 4);
      var X = function (i) { return m.l + (dados.length === 1 ? iw / 2 : i / (dados.length - 1) * iw); };
      var Y = function (v) { return m.t + ih - v / topo * ih; };
      var svg = '<svg width="' + W + '" height="' + H + '" aria-hidden="true">';
      for (var g = 0; g <= 4; g++) {
        var v = passo * g, y = Y(v);
        svg += '<line class="g-grade" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y + '" y2="' + y + '"/><text class="g-eixo" x="' + (m.l - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + v + '</text>';
      }
      dados.forEach(function (x, i) {
        if (i % 5 === (dados.length - 1) % 5) svg += '<text class="g-eixo" x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + diaCurto(x.dia) + '</text>';
      });
      var rotulos = [];
      SERIES.forEach(function (sr) {
        svg += '<polyline class="g-linha" stroke="' + sr.cor + '" points="' + dados.map(function (x, i) { return X(i) + ',' + Y(x[sr.campo]); }).join(' ') + '"/>';
        var ult = dados[dados.length - 1];
        svg += '<circle cx="' + X(dados.length - 1) + '" cy="' + Y(ult[sr.campo]) + '" r="4" fill="' + sr.cor + '" stroke="var(--noite-2)" stroke-width="2"/>';
        rotulos.push({ y: Y(ult[sr.campo]), txt: sr.curto + ' ' + ult[sr.campo] });
      });
      if (m.r > 50) { // rótulos diretos no fim das linhas, sem encavalar
        rotulos.sort(function (a, b) { return a.y - b.y; });
        for (var k = 1; k < rotulos.length; k++) if (rotulos[k].y - rotulos[k - 1].y < 14) rotulos[k].y = rotulos[k - 1].y + 14;
        rotulos.forEach(function (r) { svg += '<text class="g-rotulo" x="' + (W - m.r + 8) + '" y="' + (r.y + 4) + '">' + esc(r.txt) + '</text>'; });
      }
      svg += '<line class="g-cursor" x1="0" x2="0" y1="' + m.t + '" y2="' + (m.t + ih) + '" visibility="hidden"/>';
      svg += '<rect class="g-alvo" x="' + m.l + '" y="0" width="' + iw + '" height="' + H + '" fill="transparent"/></svg>';
      el.innerHTML = svg + '<div class="g-dica" hidden></div>';
      var cursor = el.querySelector('.g-cursor'), dica = el.querySelector('.g-dica'), alvo = el.querySelector('.g-alvo');
      function mover(ev) {
        var r = el.getBoundingClientRect();
        var px = ev.clientX - r.left;
        var i = Math.round((px - m.l) / iw * (dados.length - 1));
        i = Math.max(0, Math.min(dados.length - 1, i));
        var x = dados[i];
        cursor.setAttribute('x1', X(i)); cursor.setAttribute('x2', X(i)); cursor.setAttribute('visibility', 'visible');
        dica.hidden = false;
        dica.innerHTML = '<b>' + diaCurto(x.dia) + '</b>' + SERIES.map(function (sr) { return '<span><i style="background:' + sr.cor + '"></i>' + sr.nome + ': <b>' + x[sr.campo] + '</b></span>'; }).join('') +
          '<span class="g-extra">Cadastros: ' + x.cadastros + ' · Visualizações: ' + x.visualizacoes + '</span>';
        var left = X(i) + 12;
        if (left + dica.offsetWidth > W) left = X(i) - dica.offsetWidth - 12;
        dica.style.left = Math.max(0, left) + 'px';
      }
      alvo.addEventListener('pointermove', mover);
      alvo.addEventListener('pointerdown', mover);
      alvo.addEventListener('pointerleave', function () { cursor.setAttribute('visibility', 'hidden'); dica.hidden = true; });
    }
    desenhar();
    var t;
    window.addEventListener('resize', function redesenhar() {
      if (!document.body.contains(el)) return window.removeEventListener('resize', redesenhar);
      clearTimeout(t); t = setTimeout(desenhar, 150);
    });
  }

  // ---------- PWA: funciona como app no celular ----------
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }

  rotear();
})();
