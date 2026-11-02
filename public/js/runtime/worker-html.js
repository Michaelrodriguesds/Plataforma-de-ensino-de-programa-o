// Web Worker da trilha HTML e CSS: monta a página que o aluno escreveu
// (com a biblioteca linkedom) e roda o código de teste em JavaScript,
// que confere a página com document.querySelector e estilo().
importScripts('formatar.js', 'jsexec.js', 'linkedom.js', 'csshelp.js');

self.onmessage = function (e) {
  var d = e.data;
  var html = String(d.html || '');
  if (!/<html[\s>]/i.test(html)) html = '<!doctype html><html><head></head><body>' + html + '</body></html>';
  var pagina = self.linkedom.parseHTML(html);
  var doc = pagina.document, win = pagina.window;
  var extras = Object.assign({ document: doc, window: win, Event: win.Event }, self.cqCss.criarAjudantes(doc));
  self.cqExecutarJs(d.codigo || '', '', function (linha) {
    self.postMessage({ tipo: 'saida', texto: linha });
  }, 4000, extras).then(function (r) {
    self.postMessage({ tipo: 'fim', erro: r.erro || '' });
  });
};
