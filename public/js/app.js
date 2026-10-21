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
  var ORDEM = ['python', 'javascript', 'java'].filter(function (c) { return CURSOS[c]; });
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
      '<h2 class="titulo-secao">Suas trilhas</h2>' +
      '<div class="cursos">' + ORDEM.map(function (cid) {
        var c = CURSOS[cid], p = progressoCurso(cid);
        var pct = Math.round(p.feitas / p.total * 100);
        return '<article class="cartao-curso" style="--cor:' + c.cor + '">' +
          '<div class="cc-topo"><span class="cc-icone">' + c.icone + '</span><div><h3>' + esc(c.nome) + '</h3><p>' + esc(c.desc) + '</p></div></div>' +
          '<div class="barra" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso em ' + esc(c.nome) + '"><i style="width:' + pct + '%"></i></div>' +
          '<p class="cc-status">' + p.feitas + ' de ' + p.total + ' fases' + (p.proxima ? ' · próxima: <b>' + esc(p.proxima.titulo) + '</b>' : ' · trilha completa 🎓') + '</p>' +
          '<div class="cc-acoes">' +
          (p.proxima ? '<a class="btn" href="#/fase/' + p.proxima.id + '">' + (p.feitas ? 'Continuar' : 'Começar') + '</a>' : '') +
          '<a class="btn btn-sec" href="#/trilha/' + cid + '">Ver trilha</a>' +
          '<a class="btn btn-sec" href="#/lab/' + cid + '" title="Laboratório: escreva e rode código livre">🧪 Lab</a>' +
          '</div></article>';
      }).join('') + '</div>' +
      '<div class="anuncio-slot"></div>' +
      '<section class="dica-estudo"><h2 class="titulo-secao">Como estudar aqui</h2><ol>' +
      '<li><b>Leia o cartão e rode o exemplo.</b> Antes de rodar, tente prever o que vai aparecer.</li>' +
      '<li><b>Erre sem medo.</b> Pergunta errada volta no fim da fase, e as dicas aparecem aos poucos.</li>' +
      '<li><b>Volte amanhã.</b> A revisão traz de volta o que você aprendeu na hora em que estaria esquecendo.</li>' +
      '<li><b>Digite o código.</b> Nos desafios, escrever com as próprias mãos é o que fixa.</li>' +
      '</ol></section>';
    tela(html, 'inicio');
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
      blocoPagina(c.dom) +
      (c.codigo ? '<div class="exemplo">' + codigoHtml(c.codigo, s.cfg.ling) +
        (c.entrada ? '<p class="entrada-info">Entrada (o que seria digitado): <code>' + esc(c.entrada).replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
        '<p class="prever-dica">🤔 Antes de rodar: o que você acha que vai aparecer?</p>' +
        '<button class="btn btn-sec btn-rodar">▶ Rodar exemplo</button><div class="saida" hidden></div></div>' : '') +
      '</article>';
    var b = s.corpo.querySelector('.btn-rodar');
    if (b) b.onclick = async function () {
      b.disabled = true; b.textContent = 'Rodando...';
      var r = await window.cqExecutor.executar(s.cfg.ling, c.codigo, c.entrada || '', { dom: c.dom });
      mostrarSaida(s.corpo.querySelector('.saida'), r);
      b.disabled = false; b.textContent = '▶ Rodar de novo';
    };
    botao(s, 'Continuar', function () { proximo(s); });
  }

  function mostrarSaida(el, r, esperado) {
    el.hidden = false;
    var html = '<div class="saida-rotulo">Saída</div><pre>' + (r.saida ? esc(r.saida) : '<span class="vazio">(nada foi mostrado)</span>') + '</pre>';
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
      blocoPagina(ex.dom) +
      (ex.codigo ? codigoHtml(ex.codigo, s.cfg.ling || p.ling) : '') +
      (ex.entrada ? '<p class="entrada-info">Entrada digitada: <code>' + esc(ex.entrada).replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
      '<div class="opcoes" role="radiogroup">' + ordem.map(function (i) {
        return '<button class="opcao" role="radio" aria-checked="false" data-i="' + i + '">' + (ex.tipo === 'prever' ? '<pre>' + esc(ex.op[i]) + '</pre>' : esc(ex.op[i])) + '</button>';
      }).join('') + '</div></article>';
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
    s.corpo.innerHTML = '<article class="exercicio"><span class="selo">Complete o código</span><h1>' + ex.p + '</h1>' + blocoPagina(ex.dom) +
      '<pre class="codigo codigo-lacunas"><code>' + html + '</code></pre>' +
      (ex.op ? '<div class="fichas" aria-label="Sugestões">' + embaralhar(ex.op).map(function (o) { return '<button class="ficha" type="button">' + esc(o) + '</button>'; }).join('') + '</div>' : '') +
      '</article>';
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
      blocoPagina(ex.dom) +
      '<p class="instrucao">Toque nas linhas na ordem certa. ' + (ex.extras && ex.extras.length ? 'Cuidado: tem linha sobrando que não serve!' : '') + ' Toque numa linha da resposta para devolvê-la.</p>' +
      '<div class="montar-resposta" aria-label="Sua resposta"></div>' +
      '<div class="montar-banco" aria-label="Linhas disponíveis"></div></article>';
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
      blocoPagina(ex.dom) +
      (ex.teste ? '<details class="teste-info"><summary>Código de teste que vamos rodar junto com o seu</summary>' + codigoHtml(ex.teste, ling) + '</details>' : '') +
      '<div class="editor-box"></div>' +
      '<div class="desafio-botoes"><button class="btn btn-sec b-rodar">▶ Executar</button><button class="btn btn-sec b-dica">💡 Dica</button><button class="btn btn-sec b-sol" hidden>👀 Ver solução</button><button class="btn btn-sec b-reset" title="Voltar ao código inicial">↺</button></div>' +
      '<div class="dicas"></div><div class="saida" hidden></div></article>';
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
      return window.cqExecutor.executar(ling, m.codigo, entrada || '', { deslocamento: m.deslocamento, dom: ex.dom });
    }
    var bRodar = s.corpo.querySelector('.b-rodar');
    bRodar.onclick = async function () {
      bRodar.disabled = true; bRodar.textContent = 'Rodando...';
      var r = await rodar(editor.valor(), testes[0].entrada);
      mostrarSaida(elSaida, r);
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
        mostrarSaida(elSaida, r2);
      } else {
        elSaida.hidden = false;
        elSaida.innerHTML = '<div class="comparar">' +
          '<div><div class="saida-rotulo">Esperado</div><pre>' + diffHtml(falhou.t.saida, r2.saida, true) + '</pre></div>' +
          '<div><div class="saida-rotulo">Seu programa mostrou</div><pre>' + (r2.saida ? diffHtml(r2.saida, falhou.t.saida, false) : '<span class="vazio">(nada)</span>') + '</pre></div></div>' +
          (testes.length > 1 ? '<p class="entrada-info">Teste ' + (falhou.n + 1) + ' com entrada: <code>' + esc(falhou.t.entrada || '').replace(/\n/g, ' ⏎ ') + '</code></p>' : '') +
          '<p class="dica-diff">As linhas destacadas são diferentes. Confira letras, espaços, acentos e pontuação.</p>';
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
      (prox ? '<a class="btn btn-grande" href="#/fase/' + prox + '">Próxima: ' + esc(FASES[prox].fase.titulo) + '</a>' : '<a class="btn btn-grande" href="#/trilha/' + info.curso.id + '">Trilha completa! 🎓</a>') +
      '<a class="btn btn-sec" href="#/trilha/' + info.curso.id + '">Ver trilha</a></div>' +
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
    var passos = escolhidos.map(function (it) { return { tipo: 'ex', ex: it.ex, chave: it.id, ling: it.ling, idx: 0 }; });
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
      '<h2 class="titulo-secao">Conquistas</h2><div class="conquistas">' + conquistas.map(function (c) {
        var tem = u.conquistas.indexOf(c.id) >= 0;
        return '<div class="conquista ' + (tem ? 'on' : '') + '"><span>' + (tem ? c.icone : '🔒') + '</span><b>' + esc(c.nome) + '</b><small>' + esc(c.desc) + '</small></div>';
      }).join('') + '</div>' +
      '<h2 class="titulo-secao">Ajustes</h2><div class="ajustes">' +
      '<label>Meta diária<select class="sel-meta">' + [10, 20, 30, 50, 80].map(function (m) { return '<option value="' + m + '"' + (m === u.metaDiaria ? ' selected' : '') + '>' + m + ' XP por dia' + (m === 10 ? ' (tranquilo)' : m === 30 ? ' (recomendado)' : m === 80 ? ' (intenso)' : '') + '</option>'; }).join('') + '</select></label>' +
      '<label class="linha-check"><input type="checkbox" class="chk-som"' + (E.somLigado() ? ' checked' : '') + '> Sons de acerto e erro</label>' +
      '<button class="btn btn-sec btn-sair">Sair da conta</button></div>' +
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
  // LABORATÓRIO (código livre)
  // =============================================================
  function telaLab(cid) {
    var c = CURSOS[cid], ling = c.ling;
    var exemplo = { python: 'nome = input("Seu nome: ")\nfor i in range(3):\n    print(f"{i + 1}. Olá, {nome}!")\n', javascript: 'const nome = prompt("Seu nome: ");\nfor (let i = 1; i <= 3; i++) {\n  console.log(`${i}. Olá, ${nome}!`);\n}\n', java: 'Scanner sc = new Scanner(System.in);\nString nome = sc.nextLine();\nfor (int i = 1; i <= 3; i++) {\n    System.out.println(i + ". Olá, " + nome + "!");\n}\n' }[ling];
    tela('<section class="lab" style="--cor:' + c.cor + '"><div class="trilha-cab"><a href="#/trilha/' + cid + '" class="voltar" aria-label="Voltar">‹</a><span class="cc-icone">' + c.icone + '</span><div><h1>Laboratório de ' + esc(c.nome) + '</h1><p>Teste qualquer ideia. Seu código fica salvo neste aparelho.</p></div></div>' +
      '<div class="editor-box"></div>' +
      '<label class="lab-entrada">Entrada (uma resposta por linha, para ' + (ling === 'python' ? 'input()' : ling === 'javascript' ? 'prompt()' : 'Scanner') + ')<textarea rows="2" spellcheck="false">Michael</textarea></label>' +
      '<div class="desafio-botoes"><button class="btn b-rodar">▶ Executar</button><button class="btn btn-sec b-limpar">Limpar</button></div>' +
      (ling === 'java' ? '<p class="nota">No Java, se você não escrever uma classe com main, a plataforma coloca seu código dentro de um main automaticamente.</p>' : '') +
      '<div class="saida" hidden></div></section>', 'lab-tela');
    if (ling === 'python') window.cqExecutor.prepararPython();
    var chave = 'cq_lab_' + cid;
    var ed = window.cqCriarEditor($app.querySelector('.editor-box'), { ling: ling, valor: ls(chave) || exemplo, aoMudar: function (v) { ls(chave, v); }, aoAtalho: function () { b.click(); } });
    var b = $app.querySelector('.b-rodar'), saida = $app.querySelector('.saida');
    b.onclick = async function () {
      b.disabled = true; b.textContent = ling === 'python' && !window.cqExecutor.pythonPronto() ? 'Carregando Python...' : 'Rodando...';
      var r = await window.cqExecutor.executar(ling, ed.valor(), $app.querySelector('.lab-entrada textarea').value);
      mostrarSaida(saida, r);
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
      '<h2 class="titulo-secao">Problemas reportados pelos alunos</h2><div class="avisos"><div class="carregando"><div class="spinner"></div></div></div>' +
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
    try {
      var r = await api('GET', '/admin/feedback');
      if (!r.lista.length) { el.innerHTML = '<p class="nota">Nenhum problema reportado. Os alunos avisam pelo botão ⚑ dentro das fases.</p>'; return; }
      el.innerHTML = r.lista.map(function (f) {
        var info = FASES[f.faseId];
        return '<div class="aviso-item" data-id="' + esc(f._id) + '"><div><b>' + (info ? info.curso.icone + ' ' + esc(info.curso.nome) + ' · Fase ' + info.num + ': ' + esc(info.fase.titulo) : esc(f.faseId || 'geral')) + '</b>' +
          (f.passo && f.passo !== 'licao' ? ' <small>(exercício ' + (Number(String(f.passo).split(':')[1]) + 1 || '?') + ')</small>' : f.passo === 'licao' ? ' <small>(lição)</small>' : '') +
          '<p>' + esc(f.texto) + '</p><small>@' + esc(f.usuario) + ' · ' + new Date(f.em).toLocaleString('pt-BR') + '</small></div>' +
          '<button class="btn btn-sec b-resolvido">✔ Resolvido</button></div>';
      }).join('');
      el.querySelectorAll('.b-resolvido').forEach(function (b) {
        b.onclick = async function () {
          var item = b.closest('.aviso-item');
          await api('DELETE', '/admin/feedback/' + encodeURIComponent(item.dataset.id));
          item.remove();
        };
      });
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
