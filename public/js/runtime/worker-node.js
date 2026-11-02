// Web Worker da trilha de Back-end: roda o servidor do aluno num
// "Node.js de mentirinha" (nodesim.js) e o código de teste faz pedidos
// com fetch(). Nada sai do aparelho.
importScripts('formatar.js', 'jsexec.js', 'nodesim.js');

self.onmessage = function (e) {
  var d = e.data;
  var imprimir = function (linha) { self.postMessage({ tipo: 'saida', texto: linha }); };
  var ambiente = self.cqNode.criarAmbiente(imprimir, { arquivos: d.arquivos || {} });
  self.cqExecutarJs(d.codigo, '', imprimir, 5000, ambiente).then(function (r) {
    self.postMessage({ tipo: 'fim', erro: r.erro || '' });
  });
};
