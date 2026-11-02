// Web Worker da trilha Git e Terminal: um terminal simulado com Git,
// npm e node (terminal.js). O comando "node arquivo.js" roda o arquivo
// no Node simulado (nodesim.js).
importScripts('formatar.js', 'jsexec.js', 'nodesim.js', 'terminal.js');

function rodarNode(codigo, pasta, imprimir, arquivosTerminal) {
  var arquivos = {};
  Object.keys(arquivosTerminal).forEach(function (p) { if (p.indexOf(pasta + '/') === 0) arquivos[p.slice(pasta.length + 1)] = arquivosTerminal[p]; });
  var ambiente = self.cqNode.criarAmbiente(imprimir, { arquivos: arquivos });
  return self.cqExecutarJs(codigo, '', imprimir, 3000, ambiente);
}

self.onmessage = async function (e) {
  var d = e.data;
  var t = self.cqTerminal.criarTerminal();
  var rn = function (codigo, pasta, imprimir) { return rodarNode(codigo, pasta, imprimir, t.arquivos()); };
  try {
    if (d.pasta) await t.rodar(d.pasta, { silencioso: true, rodarNode: rn });
    var r = await t.rodar(d.codigo, { rodarNode: rn });
    self.postMessage({ tipo: 'fim', erro: '', saidaTexto: r.saida, tela: r.tela, errosTerminal: r.erros });
  } catch (err) {
    self.postMessage({ tipo: 'fim', erro: 'Erro no terminal: ' + err.message });
  }
};
