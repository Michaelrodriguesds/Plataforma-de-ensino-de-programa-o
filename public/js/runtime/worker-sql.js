// Web Worker da trilha SQL: cria um banco SQLite de verdade (sql.js,
// SQLite compilado para WebAssembly), coloca as tabelas do exercício
// e roda o SQL do aluno.
importScripts('sql/sql-wasm.js', 'sqlexec.js');

var pronto = self.initSqlJs({ locateFile: function (arq) { return 'sql/' + arq; } });

self.onmessage = function (e) {
  var d = e.data;
  pronto.then(function (SQL) {
    if (d.descrever) { self.postMessage({ tipo: 'fim', tabelas: self.cqSql.descreverBanco(SQL, d.banco) }); return; }
    var r = self.cqSql.rodarSql(SQL, d.banco, d.codigo, function (linha) { self.postMessage({ tipo: 'saida', texto: linha }); });
    self.postMessage({ tipo: 'fim', erro: r.erro || '' });
  }, function (err) {
    self.postMessage({ tipo: 'fim', erro: 'Não consegui carregar o banco de dados SQL: ' + err.message });
  });
};
