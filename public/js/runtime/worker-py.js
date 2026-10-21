// Web Worker que roda Python dentro do navegador usando o Pyodide
// (o Python de verdade, compilado para WebAssembly).
// Na primeira vez baixa ~10 MB; depois o navegador guarda em cache.
var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.6/full/';
importScripts(PYODIDE_URL + 'pyodide.js', 'pypre.js');

var pronto = (async function () {
  var py = await loadPyodide({ indexURL: PYODIDE_URL });
  py.runPython(self.CQ_PY_PREAMBULO);
  return py;
})();

pronto.then(function () { self.postMessage({ tipo: 'pronto' }); })
  .catch(function (e) { self.postMessage({ tipo: 'falhou', erro: String(e) }); });

function limparErro(msg) {
  // Mostra só a parte que interessa: a linha do SEU código e o erro.
  var linhas = String(msg).split('\n');
  var linhaNum = null;
  linhas.forEach(function (l) {
    var m = l.match(/File "seu_codigo\.py", line (\d+)/);
    if (m) linhaNum = m[1];
  });
  var ultima = '', iUltima = linhas.length;
  for (var i = linhas.length - 1; i >= 0; i--) { if (linhas[i].trim()) { ultima = linhas[i].trim(); iUltima = i; break; } }
  // erros de sintaxe trazem o trecho com ^ apontando
  var trecho = '';
  var idx = linhas.findIndex(function (l) { return /File "seu_codigo\.py"/.test(l); });
  if (/^(SyntaxError|IndentationError|TabError)/.test(ultima) && idx >= 0) {
    trecho = linhas.slice(idx + 1, iUltima).join('\n').replace(/\s+$/, '');
  }
  return (linhaNum ? 'Linha ' + linhaNum + ': ' : '') + ultima + (trecho ? '\n' + trecho : '');
}

self.onmessage = async function (e) {
  var d = e.data;
  var py = await pronto;
  var entrada = d.entrada ? String(d.entrada).replace(/\r/g, '').split('\n') : [];
  py.setStdout({ batched: function (t) { self.postMessage({ tipo: 'saida', texto: t }); } });
  py.setStderr({ batched: function (t) { self.postMessage({ tipo: 'saida', texto: t }); } });
  py.setStdin({ stdin: function () { return entrada.length ? entrada.shift() + '\n' : undefined; } });
  var globais = py.globals.get('dict')();
  globais.set('__name__', '__main__');
  try {
    py.runPython(d.codigo, { globals: globais, filename: 'seu_codigo.py' });
    self.postMessage({ tipo: 'fim', erro: '' });
  } catch (err) {
    self.postMessage({ tipo: 'fim', erro: limparErro(err.message || err) });
  } finally {
    globais.destroy();
  }
};
