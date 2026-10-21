// =============================================================
// realce.js — pinta o código com cores (palavras-chave, textos, números,
// comentários). É como um marca-texto automático para ler código melhor.
// =============================================================
(function () {
  var PALAVRAS = {
    python: 'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield True False None self print input len range int str float list dict set tuple bool super isinstance sum min max round sorted enumerate type',
    javascript: 'async await break case catch class const continue default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while yield true false null undefined console log prompt Math Number String Object Array Promise Error get set',
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

  function realcarHtml(codigo) {
    return esc(codigo).replace(/(&lt;\/?)([a-zA-Z0-9]+)([^&]*?)(\/?&gt;)/g, function (_, a, tag, attrs, b) {
      attrs = attrs.replace(/([\w-]+)(=)("[^"]*"|'[^']*')/g, '<span class="tk-ano">$1</span>$2<span class="tk-str">$3</span>');
      return '<span class="tk-com">' + a + '</span><span class="tk-kw">' + tag + '</span>' + attrs + '<span class="tk-com">' + b + '</span>';
    });
  }
  function realcar(codigo, ling) {
    if (ling === 'html') return realcarHtml(codigo);
    var kw = conjunto(ling);
    var comentario = ling === 'python' ? '#[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$)';
    var textos = ling === 'javascript'
      ? '`(?:\\\\[\\s\\S]|[^`\\\\])*`?|"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?'
      : ling === 'python'
        ? '[fFrRbB]{0,2}(?:"""[\\s\\S]*?(?:"""|$)|"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?)'
        : '"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?';
    var re = new RegExp('(' + comentario + ')|(' + textos + ')|(\\b\\d+(?:\\.\\d+)?\\b)|(@\\w+)|([A-Za-z_$][\\w$]*)', 'g');
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
