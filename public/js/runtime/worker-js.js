// Web Worker que roda o JavaScript do aluno numa "sala separada"
// (se o código travar num laço infinito, a gente fecha a sala e pronto).
importScripts('formatar.js', 'jsexec.js');

self.onmessage = function (e) {
  var d = e.data;
  self.cqExecutarJs(d.codigo, d.entrada, function (linha) {
    self.postMessage({ tipo: 'saida', texto: linha });
  }, 4000).then(function (r) {
    self.postMessage({ tipo: 'fim', erro: r.erro || '' });
  });
};
