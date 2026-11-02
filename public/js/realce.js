// =============================================================
// realce.js — pinta o código com cores (palavras-chave, textos, números,
// comentários). É como um marca-texto automático para ler código melhor.
// =============================================================
(function () {
  var PALAVRAS = {
    python: 'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield True False None self print input len range int str float list dict set tuple bool super isinstance sum min max round sorted enumerate type',
    javascript: 'require module exports useState useEffect useRef return async await break case catch class const continue default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while yield true false null undefined console log prompt Math Number String Object Array Promise Error get set',
    sql: 'select from where and or not in is null like between order by asc desc group having limit offset as distinct join inner left right outer on insert into values update set delete create table primary key foreign references unique default check integer int text real numeric varchar boolean date autoincrement drop alter add column index view if exists count sum avg min max round upper lower length coalesce case when then else end union all true false strftime substr replace trim',
    terminal: 'git npm node npx cd ls mkdir touch echo cat rm mv cp pwd clear gh dir',
    java: 'abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new package private protected public record return short static super switch this throw throws try var void while true false null String System out println print Scanner List ArrayList Map HashMap LinkedHashMap TreeMap Arrays Collections Math Integer Double Override'
  };
  var cache = {};
  function conjunto(ling) {
    if (!cache[ling]) {
      cache[ling] = {};
      (PALAVRAS[ling] || '').split(' ').forEach(function (p) { cache[ling][p] = true; });
    }
    return cache[ling];
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function realcarTags(codigo) {
    return esc(codigo).replace(/(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?)([a-zA-Z0-9!]+)([^&]*?)(\/?&gt;)/g, function (_, com, a, tag, attrs, b) {
      if (com) return '<span class="tk-com">' + com + '</span>';
      attrs = attrs.replace(/([\w-]+)(=)("[^"]*"|'[^']*')/g, '<span class="tk-ano">$1</span>$2<span class="tk-str">$3</span>');
      return '<span class="tk-com">' + a + '</span><span class="tk-kw">' + tag + '</span>' + attrs + '<span class="tk-com">' + b + '</span>';
    });
  }
  // CSS: seletores, propriedades e valores com cores diferentes
  function realcarCss(css) {
    var out = '', i = 0, dentro = 0;
    var re = /(\/\*[\s\S]*?(?:\*\/|$))|([{}])|([^{};]+)(?=[;}]|$)|(;)|([^{}]+)(?=\{)/g, m;
    while ((m = re.exec(css))) {
      if (m.index > i) out += esc(css.slice(i, m.index));
      if (m[1]) out += '<span class="tk-com">' + esc(m[1]) + '</span>';
      else if (m[2]) { dentro += m[2] === '{' ? 1 : -1; out += m[2]; }
      else if (m[4]) out += ';';
      else {
        var t = m[3] || m[5];
        if (dentro > 0 && /:/.test(t) && !/\{/.test(css.slice(re.lastIndex, re.lastIndex + 1))) {
          var k = t.indexOf(':');
          out += '<span class="tk-ano">' + esc(t.slice(0, k)) + '</span>:' + esc(t.slice(k + 1)).replace(/(#[0-9a-fA-F]{3,8}\b|-?\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|fr|s|deg)?\b)/g, '<span class="tk-num">$1</span>');
        } else out += '<span class="tk-fn">' + esc(t) + '</span>';
      }
      i = re.lastIndex;
    }
    return out + esc(css.slice(i));
  }
  function realcarHtml(codigo) {
    var partes = codigo.split(/(<style[^>]*>)([\s\S]*?)(?=<\/style>|$)/i);
    var saida = '';
    for (var k = 0; k < partes.length; k++) {
      if (k % 3 === 2) saida += realcarCss(partes[k]); else saida += realcarTags(partes[k]);
    }
    return saida;
  }
  function realcarSql(codigo) {
    var kw = conjunto('sql');
    var re = /(--[^\n]*)|('(?:''|[^'])*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)/g;
    var saida = '', ultimo = 0, m;
    while ((m = re.exec(codigo))) {
      saida += esc(codigo.slice(ultimo, m.index));
      if (m[1]) saida += '<span class="tk-com">' + esc(m[0]) + '</span>';
      else if (m[2]) saida += '<span class="tk-str">' + esc(m[0]) + '</span>';
      else if (m[3]) saida += '<span class="tk-num">' + m[0] + '</span>';
      else if (kw[m[0].toLowerCase()]) saida += '<span class="tk-kw">' + m[0] + '</span>';
      else saida += esc(m[0]);
      ultimo = re.lastIndex;
    }
    return saida + esc(codigo.slice(ultimo));
  }
  function realcarTerminal(codigo) {
    var kw = conjunto('terminal');
    return codigo.split('\n').map(function (linha) {
      if (/^\s*#/.test(linha)) return '<span class="tk-com">' + esc(linha) + '</span>';
      var re = /("[^"]*"?|'[^']*'?)|(\s--?[\w-]+(?:=\S*)?)|(&&|>>?)|([^\s"']+)/g, out = '', ult = 0, m, inicioCmd = true;
      while ((m = re.exec(linha))) {
        out += esc(linha.slice(ult, m.index));
        if (m[1]) out += '<span class="tk-str">' + esc(m[0]) + '</span>';
        else if (m[2]) out += '<span class="tk-ano">' + esc(m[0]) + '</span>';
        else if (m[3]) { out += '<span class="tk-com">' + esc(m[0]) + '</span>'; inicioCmd = true; ult = re.lastIndex; continue; }
        else if (inicioCmd && kw[m[0]]) out += '<span class="tk-kw">' + esc(m[0]) + '</span>';
        else out += esc(m[0]);
        inicioCmd = false;
        ult = re.lastIndex;
      }
      return out + esc(linha.slice(ult));
    }).join('\n');
  }
  function realcar(codigo, ling) {
    if (ling === 'html') return realcarHtml(codigo);
    if (ling === 'css') return realcarCss(codigo);
    if (ling === 'sql') return realcarSql(codigo);
    if (ling === 'terminal') return realcarTerminal(codigo);
    if (ling === 'react' || ling === 'node') ling = 'javascript';
    var kw = conjunto(ling);
    var comentario = ling === 'python' ? '#[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$)';
    var textos = ling === 'javascript'
      ? '`(?:\\\\[\\s\\S]|[^`\\\\])*`?|"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?'
      : ling === 'python'
        ? '[fFrRbB]{0,2}(?:"""[\\s\\S]*?(?:"""|$)|"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?)'
        : '"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?';
    var re = new RegExp('(' + comentario + ')|(' + textos + ')|(\\b\\d+(?:\\.\\d+)?\\b)|(@\\w+)|([A-Za-z_$\\u00C0-\\u024F][\\w$\\u00C0-\\u024F]*)', 'g');
    var saida = '', ultimo = 0, m;
    while ((m = re.exec(codigo))) {
      saida += esc(codigo.slice(ultimo, m.index));
      var t = m[0];
      if (m[1]) saida += '<span class="tk-com">' + esc(t) + '</span>';
      else if (m[2]) saida += '<span class="tk-str">' + esc(t) + '</span>';
      else if (m[3]) saida += '<span class="tk-num">' + t + '</span>';
      else if (m[4]) saida += '<span class="tk-ano">' + esc(t) + '</span>';
      else if (kw[t]) saida += '<span class="tk-kw">' + t + '</span>';
      else if (codigo[re.lastIndex] === '(') saida += '<span class="tk-fn">' + t + '</span>';
      else if (/^[A-Z]/.test(t)) saida += '<span class="tk-tipo">' + t + '</span>';
      else saida += esc(t);
      ultimo = re.lastIndex;
    }
    return saida + esc(codigo.slice(ultimo));
  }
  window.cqRealcar = realcar;
})();
