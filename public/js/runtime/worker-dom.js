// Web Worker do "modo página": roda JavaScript que mexe numa página HTML
// (document.querySelector, eventos, criar elementos...).
// A página é simulada pela biblioteca linkedom, aqui dentro do worker:
// se o código travar num laço infinito, o worker é fechado e o site continua.
importScripts('formatar.js', 'jsexec.js', 'linkedom.js');

self.onmessage = function (e) {
  var d = e.data;
  var pagina = self.linkedom.parseHTML('<!doctype html><html><head></head><body>' + (d.html || '') + '</body></html>');
  var doc = pagina.document, win = pagina.window;
  self.cqExecutarJs(d.codigo, d.entrada, function (linha) {
    self.postMessage({ tipo: 'saida', texto: linha });
  }, 4000, { document: doc, window: win, Event: win.Event }).then(function (r) {
    self.postMessage({ tipo: 'fim', erro: r.erro || '', html: doc.body.innerHTML });
  });
};
