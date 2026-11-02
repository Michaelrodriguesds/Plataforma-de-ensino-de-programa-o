// =============================================================
// sqlexec.js — roda SQL num banco SQLite de verdade (sql.js), criado
// do zero a cada execução: primeiro o "banco" do exercício (as tabelas
// e os dados de exemplo), depois o código do aluno.
//
// Cada comando que devolve linhas (SELECT) vira um quadro de texto:
//   nome | preco
//   Corte | 40
//   Escova | 60
// Dois SELECTs seguidos ficam separados por uma linha em branco.
// Funciona no Web Worker (navegador) e no Node (validador).
// =============================================================
(function (raiz) {
  function formatarValor(v) {
    if (v === null || v === undefined) return 'NULL';
    if (v instanceof Uint8Array) return '[dados binários]';
    if (typeof v === 'number' && !Number.isInteger(v)) return String(Math.round(v * 1e6) / 1e6);
    return String(v);
  }

  // Divide o texto em comandos separados por ; (respeitando textos entre aspas e comentários)
  function separar(sql) {
    var cmds = [], atual = '', aspas = null;
    for (var i = 0; i < sql.length; i++) {
      var c = sql[i];
      if (aspas) {
        atual += c;
        if (c === aspas) { if (sql[i + 1] === aspas) { atual += sql[++i]; } else aspas = null; }
        continue;
      }
      if (c === '-' && sql[i + 1] === '-') { while (i < sql.length && sql[i] !== '\n') i++; atual += '\n'; continue; }
      if (c === '/' && sql[i + 1] === '*') { var fim = sql.indexOf('*/', i + 2); i = fim < 0 ? sql.length : fim + 1; atual += ' '; continue; }
      if (c === "'" || c === '"') { aspas = c; atual += c; continue; }
      if (c === ';') { if (atual.trim()) cmds.push(atual.trim()); atual = ''; continue; }
      atual += c;
    }
    if (atual.trim()) cmds.push(atual.trim());
    return cmds;
  }

  // Qual linha do código do aluno começa este comando? (para mensagens de erro)
  function linhaDe(codigo, cmd) {
    var pos = codigo.indexOf(cmd.split('\n')[0]);
    return pos < 0 ? null : codigo.slice(0, pos).split('\n').length;
  }

  function rodarSql(SQL, banco, codigo, aoImprimir) {
    var db = new SQL.Database();
    try {
      db.run('PRAGMA foreign_keys = ON;');
      if (banco) db.exec(banco);
    } catch (e) {
      db.close();
      return { erro: 'Erro no banco de exemplo do exercício: ' + e.message };
    }
    var primeiro = true;
    var cmds = separar(codigo || '');
    for (var i = 0; i < cmds.length; i++) {
      var cmd = cmds[i];
      var stmt;
      try {
        stmt = db.prepare(cmd);
        var colunas = stmt.getColumnNames();
        if (colunas.length) {
          if (!primeiro) aoImprimir('');
          primeiro = false;
          aoImprimir(colunas.join(' | '));
          var n = 0;
          while (stmt.step()) { aoImprimir(stmt.get().map(formatarValor).join(' | ')); n++; }
          if (n === 0) aoImprimir('(nenhuma linha)');
        } else {
          stmt.step();
        }
        stmt.free();
      } catch (e) {
        if (stmt) try { stmt.free(); } catch (e2) { /* nada */ }
        var l = linhaDe(codigo, cmd);
        db.close();
        return { erro: 'Erro de SQL: ' + e.message + (l ? '\n(linha ' + l + ')' : '') };
      }
    }
    db.close();
    return {};
  }

  // Lista as tabelas do banco do exercício com todas as linhas (para mostrar ao aluno)
  function descreverBanco(SQL, banco) {
    var db = new SQL.Database();
    var tabelas = [];
    try {
      db.exec(banco || '');
      var nomes = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid");
      (nomes[0] ? nomes[0].values : []).forEach(function (linha) {
        var nome = linha[0];
        var r = db.exec('SELECT * FROM "' + nome + '" LIMIT 30');
        var cols = db.exec('PRAGMA table_info("' + nome + '")')[0];
        tabelas.push({
          nome: nome,
          colunas: cols ? cols.values.map(function (c) { return c[1]; }) : [],
          tipos: cols ? cols.values.map(function (c) { return c[2]; }) : [],
          linhas: r[0] ? r[0].values.map(function (l) { return l.map(formatarValor); }) : []
        });
      });
    } catch (e) { /* banco inválido: mostra o que der */ }
    db.close();
    return tabelas;
  }

  var api = { rodarSql: rodarSql, descreverBanco: descreverBanco, separar: separar };
  raiz.cqSql = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
