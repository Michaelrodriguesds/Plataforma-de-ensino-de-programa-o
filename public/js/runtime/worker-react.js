// Web Worker da trilha React: traduz o JSX (sucrase), desenha os
// componentes numa página simulada (linkedom) usando Preact com a
// "camada React" (preact/compat) e roda o código de teste.
importScripts('formatar.js', 'jsexec.js', 'linkedom.js', 'reactlib.js', 'reactprep.js');

self.onmessage = function (e) {
  var d = e.data;
  var pagina = self.linkedom.parseHTML('<!doctype html><html><head></head><body>' + (d.html === undefined || d.html === null ? '<div id="root"></div>' : d.html) + '</body></html>');
  var doc = pagina.document, win = pagina.window;
  self.document = doc;
  var imprimir = function (linha) { self.postMessage({ tipo: 'saida', texto: linha }); };
  var prep = self.cqReactPrep.preparar(d.codigo, self.cqReactLib, doc, win, d.api);
  if (prep.erro) { self.postMessage({ tipo: 'fim', erro: prep.erro, html: doc.body.innerHTML }); return; }
  self.cqExecutarJs(prep.codigo, '', imprimir, 5000, prep.extras).then(function (r) {
    self.postMessage({ tipo: 'fim', erro: r.erro || '', html: doc.body.innerHTML });
  });
};
