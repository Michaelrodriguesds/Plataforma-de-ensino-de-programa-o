// =============================================================
// csshelp.js — lê o CSS da página do aluno e responde "qual é o valor
// da propriedade X neste elemento?", como o navegador faria.
//
// Usado pelos testes da trilha HTML e CSS:
//   estilo("h1", "color")                     -> "#e91e63"
//   estilo(el, "flex-direction", { largura: 400 })  (tela de celular)
//   estilo("a", "color", { estado: "hover" })       (mouse em cima)
//
// Entende: seletores (pelo .matches do linkedom), especificidade,
// ordem, !important, estilo inline, herança (color, font...), inherit,
// variáveis CSS (var(--x)), @media com min-width/max-width e alguns
// atalhos (margin, padding, border, background, flex, gap).
// As cores são devolvidas em hexadecimal minúsculo (#ff0000).
// Funciona no Web Worker (navegador) e no Node (validador).
// =============================================================
(function (raiz) {
  var HERDADAS = /^(color|font|font-family|font-size|font-weight|font-style|line-height|text-align|text-transform|letter-spacing|visibility|list-style|list-style-type|cursor|white-space|word-spacing|--.*)$/;
  var CORES = {
    black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00',
    purple: '#800080', orange: '#ffa500', pink: '#ffc0cb', gray: '#808080', grey: '#808080', silver: '#c0c0c0',
    navy: '#000080', teal: '#008080', maroon: '#800000', lime: '#00ff00', aqua: '#00ffff', cyan: '#00ffff',
    magenta: '#ff00ff', fuchsia: '#ff00ff', gold: '#ffd700', brown: '#a52a2a', hotpink: '#ff69b4',
    darkblue: '#00008b', lightgray: '#d3d3d3', lightgrey: '#d3d3d3', darkgray: '#a9a9a9', tomato: '#ff6347',
    crimson: '#dc143c', coral: '#ff7f50', salmon: '#fa8072', violet: '#ee82ee', indigo: '#4b0082'
  };

  // ---------- 1. Ler o texto do CSS e transformar em regras ----------
  function analisar(texto) {
    var regras = [];
    texto = String(texto || '').replace(/\/\*[\s\S]*?\*\//g, '');
    var ordem = 0;
    function bloco(txt, midia) {
      var i = 0;
      while (i < txt.length) {
        var abre = txt.indexOf('{', i);
        if (abre < 0) break;
        var cabeca = txt.slice(i, abre).trim();
        // acha o } correspondente (pode ter blocos dentro, no caso de @media)
        var nivel = 1, j = abre + 1;
        while (j < txt.length && nivel > 0) { if (txt[j] === '{') nivel++; else if (txt[j] === '}') nivel--; j++; }
        var dentro = txt.slice(abre + 1, j - 1);
        if (/^@media/i.test(cabeca)) bloco(dentro, cabeca.replace(/^@media/i, '').trim());
        else if (/^@/.test(cabeca)) { /* @keyframes, @font-face...: ignorados */ }
        else if (cabeca) {
          var decls = declaracoes(dentro);
          cabeca.split(',').forEach(function (sel) {
            sel = sel.trim();
            if (sel) regras.push({ seletor: sel, decls: decls, midia: midia || null, ordem: ordem++, esp: especificidade(sel) });
          });
        }
        i = j;
      }
    }
    bloco(texto, null);
    return regras;
  }

  function declaracoes(txt) {
    var lista = [];
    // separa por ; (sem quebrar dentro de parênteses, como em url(...) ou rgb(...))
    var partes = [], atual = '', par = 0;
    for (var k = 0; k < txt.length; k++) {
      var c = txt[k];
      if (c === '(') par++;
      if (c === ')') par--;
      if (c === ';' && par === 0) { partes.push(atual); atual = ''; } else atual += c;
    }
    partes.push(atual);
    partes.forEach(function (p) {
      var dp = p.indexOf(':');
      if (dp < 0) return;
      var prop = p.slice(0, dp).trim().toLowerCase();
      var valor = p.slice(dp + 1).trim();
      if (!prop || !valor) return;
      var imp = /!\s*important\s*$/i.test(valor);
      valor = valor.replace(/!\s*important\s*$/i, '').trim();
      expandir(prop, valor).forEach(function (d) { lista.push({ prop: d[0], valor: d[1], imp: imp }); });
    });
    return lista;
  }

  // Atalhos: margin: 10px 20px vira margin-top, margin-right...
  function expandir(prop, valor) {
    var r = [[prop, valor]];
    var v = valor.split(/\s+(?![^(]*\))/);
    if (prop === 'margin' || prop === 'padding') {
      var t = v[0], d = v[1] || t, b = v[2] || t, e = v[3] || d;
      r.push([prop + '-top', t], [prop + '-right', d], [prop + '-bottom', b], [prop + '-left', e]);
    } else if (prop === 'gap') {
      r.push(['row-gap', v[0]], ['column-gap', v[1] || v[0]]);
    } else if (prop === 'background' && v.length === 1 && !/url\(|gradient\(/i.test(valor)) {
      r.push(['background-color', valor]);
    } else if (prop === 'border' || /^border-(top|right|bottom|left)$/.test(prop)) {
      var lados = prop === 'border' ? ['top', 'right', 'bottom', 'left'] : [prop.slice(7)];
      v.forEach(function (parte) {
        var tipo = /^(none|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden)$/i.test(parte) ? 'style' : /^\d|^0$/.test(parte) || /^(thin|medium|thick)$/i.test(parte) ? 'width' : 'color';
        if (prop === 'border') r.push(['border-' + tipo, parte]);
        lados.forEach(function (l) { r.push(['border-' + l + '-' + tipo, parte]); });
      });
    } else if (prop === 'flex') {
      if (v[0] === 'none') r.push(['flex-grow', '0'], ['flex-shrink', '0'], ['flex-basis', 'auto']);
      else if (v[0] === 'auto') r.push(['flex-grow', '1'], ['flex-shrink', '1'], ['flex-basis', 'auto']);
      else if (/^\d/.test(v[0])) { r.push(['flex-grow', v[0]]); if (v[1]) r.push([/^\d+(\.\d+)?$/.test(v[1]) ? 'flex-shrink' : 'flex-basis', v[1]]); if (v[2]) r.push(['flex-basis', v[2]]); }
    } else if (prop === 'font' ) {
      // só o tamanho e a família, que é o que importa nos exercícios
      var m = valor.match(/(\d+(?:\.\d+)?(?:px|rem|em|%))(?:\/\S+)?\s+(.+)$/);
      if (m) r.push(['font-size', m[1]], ['font-family', m[2]]);
    }
    return r;
  }

  // ---------- 2. Especificidade: quem "manda mais" ----------
  // (ids, classes/atributos/pseudo-classes, etiquetas)
  function especificidade(sel) {
    var s = sel.replace(/:not\(([^)]*)\)/g, ' $1 ').replace(/"[^"]*"|'[^']*'/g, '');
    var ids = (s.match(/#[\w-]+/g) || []).length;
    var classes = (s.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(\([^)]*\))?/g) || []).length;
    var tags = (s.replace(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+(\([^)]*\))?/g, ' ').match(/(^|[\s>+~])([a-zA-Z][\w-]*)/g) || []).length;
    tags += (s.match(/::[\w-]+/g) || []).length;
    return ids * 10000 + classes * 100 + tags;
  }

  // ---------- 3. @media: a regra vale para a largura da tela? ----------
  function midiaVale(cond, largura) {
    if (!cond) return true;
    return cond.split(',').some(function (parte) {
      parte = parte.trim().toLowerCase();
      if (/^(print|speech)\b/.test(parte) || /^not\b/.test(parte)) return false;
      var ok = true;
      var re = /\(\s*(min|max)-width\s*:\s*(\d+(?:\.\d+)?)(px|em|rem)\s*\)/g, m, achou = false;
      while ((m = re.exec(parte))) {
        achou = true;
        var px = Number(m[2]) * (m[3] === 'px' ? 1 : 16);
        if (m[1] === 'min' && largura < px) ok = false;
        if (m[1] === 'max' && largura > px) ok = false;
      }
      if (!achou && /\(/.test(parte)) {
        // outras condições (orientation, prefers-color-scheme...): consideramos falsas
        return false;
      }
      return ok;
    });
  }

  // ---------- 4. Normalizar valores para comparar ----------
  function hex2(n) { n = Math.max(0, Math.min(255, Math.round(Number(n)))); return (n < 16 ? '0' : '') + n.toString(16); }
  function normalizar(valor) {
    if (valor == null) return '';
    var v = String(valor).trim().replace(/\s+/g, ' ');
    var aspas = [];
    v = v.replace(/"[^"]*"|'[^']*'/g, function (q) { aspas.push(q.replace(/'/g, '"')); return '\u0000' + (aspas.length - 1) + '\u0000'; });
    v = v.toLowerCase().replace(/\s*,\s*/g, ', ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    v = v.replace(/rgba?\((\d+), (\d+), (\d+)(?:, (1|1\.0+))?\)/g, function (_, r, g, b) { return '#' + hex2(r) + hex2(g) + hex2(b); });
    v = v.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/g, '#$1$1$2$2$3$3');
    v = v.replace(/\b([a-z]+)\b/g, function (p) { return CORES[p] || p; });
    v = v.replace(/(^|[\s(,])0(px|rem|em|%)(?=$|[\s),])/g, '$10');
    v = v.replace(/\u0000(\d+)\u0000/g, function (_, i) { return aspas[Number(i)]; });
    return v;
  }

  // ---------- 5. A função usada pelos testes ----------
  function criar(document) {
    var cache = null;
    function regras() {
      var css = Array.prototype.map.call(document.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n');
      if (!cache || cache.css !== css) cache = { css: css, lista: analisar(css) };
      return cache.lista;
    }
    function casa(el, sel, estado) {
      var s = sel;
      if (/::/.test(s)) return false; // ::before, ::after não são o próprio elemento
      if (estado) s = s.replace(new RegExp(':' + estado + '\\b', 'g'), '');
      if (/:(hover|focus|active|visited|focus-within|focus-visible)\b/.test(s)) return false;
      if (!s.trim()) s = '*';
      try { return el.matches(s); } catch (e) { return false; }
    }
    function declarado(el, prop, op) {
      var largura = op.largura || 1024;
      var melhor = null;
      regras().forEach(function (r) {
        if (!midiaVale(r.midia, largura) || !casa(el, r.seletor, op.estado)) return;
        r.decls.forEach(function (d) {
          if (d.prop !== prop) return;
          var peso = (d.imp ? 1e9 : 0) + r.esp * 1e4 + r.ordem;
          if (!melhor || peso >= melhor.peso) melhor = { valor: d.valor, peso: peso };
        });
      });
      var inline = el.getAttribute && el.getAttribute('style');
      if (inline) {
        declaracoes(inline).forEach(function (d) {
          if (d.prop !== prop) return;
          var peso = (d.imp ? 2e9 : 1e9 - 1);
          if (!melhor || peso >= melhor.peso) melhor = { valor: d.valor, peso: peso };
        });
      }
      return melhor ? melhor.valor : null;
    }
    function valorDe(el, prop, op, profundidade) {
      if (!el || el.nodeType !== 1 || profundidade > 40) return '';
      var v = declarado(el, prop, op);
      if (v === null || v === 'inherit') {
        if (v === 'inherit' || HERDADAS.test(prop)) return el.parentElement ? valorDe(el.parentElement, prop, op, profundidade + 1) : '';
        return '';
      }
      // resolve var(--nome, reserva)
      var voltas = 0;
      while (/var\(/.test(v) && voltas++ < 10) {
        v = v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, function (_, nome, reserva) {
          var achado = valorDe(el, nome, op, profundidade + 1);
          return achado || (reserva ? reserva.trim() : '');
        });
      }
      return v;
    }
    return function estilo(alvo, prop, op) {
      op = op || {};
      var el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo;
      if (!el) throw new Error('estilo(): não encontrei nenhum elemento com o seletor "' + alvo + '"');
      return normalizar(valorDe(el, String(prop).trim().toLowerCase(), op, 0));
    };
  }

  // Ferramentas que os testes da trilha HTML e CSS usam (escritas em português
  // para o aluno entender o teste):
  //   texto("h1")            -> o texto do elemento (ou "(não encontrei h1)")
  //   existe("nav a")        -> true / false
  //   quantos("li")          -> quantos elementos combinam
  //   atributo("img", "alt") -> o valor do atributo (ou null)
  //   estilo("h1", "color")  -> o valor do CSS
  function criarAjudantes(document) {
    function limpar(t) { return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); }
    return {
      estilo: criar(document),
      texto: function (sel) { var el = document.querySelector(sel); return el ? limpar(el.textContent) : '(não encontrei ' + sel + ')'; },
      existe: function (sel) { return !!document.querySelector(sel); },
      quantos: function (sel) { return document.querySelectorAll(sel).length; },
      atributo: function (sel, nome) { var el = document.querySelector(sel); return el ? el.getAttribute(nome) : null; }
    };
  }

  var api = { analisar: analisar, especificidade: especificidade, normalizar: normalizar, criarEstilo: criar, criarAjudantes: criarAjudantes };
  raiz.cqCss = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
