// Transforma valores do JavaScript em texto, do jeito que o console.log
// do Node mostra: [ 1, 2, 3 ]  { nome: 'Ana' }
// Usado no navegador (dentro do Worker) e no validador do servidor,
// para que a saída seja idêntica nos dois lugares.
(function (raiz) {
  function chaveValida(k) { return /^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'"; }

  function formatar(v, dentro, vistos) {
    vistos = vistos || [];
    if (typeof v === 'string') return dentro ? "'" + v.replace(/'/g, "\\'") + "'" : v;
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (typeof v === 'bigint') return v + 'n';
    if (typeof v === 'boolean' || v === undefined || v === null) return String(v);
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') {
      if (/^class\s/.test(Function.prototype.toString.call(v))) return '[class ' + (v.name || '(anonymous)') + ']';
      return '[Function: ' + (v.name || '(anonymous)') + ']';
    }
    if (vistos.indexOf(v) >= 0) return '[Circular]';
    vistos = vistos.concat([v]);
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      return '[ ' + v.map(function (x) { return formatar(x, true, vistos); }).join(', ') + ' ]';
    }
    if (v instanceof Error) return (v.name || 'Error') + ': ' + v.message;
    if (v instanceof Date) return v.toISOString();
    if (v instanceof Map) {
      if (!v.size) return 'Map(0) {}';
      var partes = [];
      v.forEach(function (val, k) { partes.push(formatar(k, true, vistos) + ' => ' + formatar(val, true, vistos)); });
      return 'Map(' + v.size + ') { ' + partes.join(', ') + ' }';
    }
    if (v instanceof Set) {
      if (!v.size) return 'Set(0) {}';
      var itens = [];
      v.forEach(function (x) { itens.push(formatar(x, true, vistos)); });
      return 'Set(' + v.size + ') { ' + itens.join(', ') + ' }';
    }
    if (typeof Promise !== 'undefined' && v instanceof Promise) return 'Promise { <pending> }';
    var nome = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + ' ' : '';
    if (Object.getPrototypeOf(v) === null) nome = '[Object: null prototype] ';
    var chaves = Object.keys(v);
    if (!chaves.length) return nome + '{}';
    return nome + '{ ' + chaves.map(function (k) { return chaveValida(k) + ': ' + formatar(v[k], true, vistos); }).join(', ') + ' }';
  }

  function formatarArgs(args) {
    return Array.prototype.map.call(args, function (a) { return formatar(a, false); }).join(' ');
  }

  raiz.cqFormatar = formatar;
  raiz.cqFormatarArgs = formatarArgs;
  if (typeof module !== 'undefined' && module.exports) module.exports = { formatar: formatar, formatarArgs: formatarArgs };
})(typeof self !== 'undefined' ? self : this);
