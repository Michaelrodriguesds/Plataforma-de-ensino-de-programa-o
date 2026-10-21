// Executa código JavaScript do aluno.
// - console.log vira "saida" (texto)
// - prompt() lê a próxima linha da "entrada" (e mostra como num terminal)
// - suporta await e setTimeout (espera os timers terminarem)
// Funciona dentro do Web Worker (navegador) e no Node (validador).
(function (raiz) {
  var fmt = raiz.cqFormatarArgs || (typeof require !== 'undefined' ? require('./formatar.js').formatarArgs : null);

  function executarJs(codigo, entrada, aoImprimir, tempoMax, extras) {
    extras = extras || {}; // variáveis a mais (ex: document e window no modo página)
    tempoMax = tempoMax || 4000;
    var linhas = entrada ? String(entrada).replace(/\r/g, '').split('\n') : [];
    var pendentes = 0;
    var _setTimeout = raiz.setTimeout.bind(raiz);
    var _clearTimeout = raiz.clearTimeout.bind(raiz);
    var ids = {};

    var meuConsole = {
      log: function () { aoImprimir(fmt(arguments)); },
      info: function () { aoImprimir(fmt(arguments)); },
      warn: function () { aoImprimir(fmt(arguments)); },
      error: function () { aoImprimir(fmt(arguments)); },
      table: function (t) { aoImprimir(fmt([t])); }
    };
    function meuPrompt(msg) {
      if (!linhas.length || (linhas.length === 1 && linhas[0] === '' )) {
        throw new Error('Acabaram os dados de entrada (prompt sem resposta)');
      }
      var l = linhas.shift();
      aoImprimir((msg !== undefined ? String(msg) : '') + l);
      return l;
    }
    function meuSetTimeout(fn, ms) {
      pendentes++;
      var id = _setTimeout(function () { pendentes--; delete ids[id]; try { fn(); } catch (e) { erroTardio = e; } }, Math.min(ms || 0, 3000));
      ids[id] = true;
      return id;
    }
    function meuClearTimeout(id) { if (ids[id]) { delete ids[id]; pendentes--; } _clearTimeout(id); }
    var erroTardio = null;

    return new Promise(function (resolve) {
      var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      var fn;
      try {
        var nomes = ['console', 'prompt', 'setTimeout', 'clearTimeout', 'alert'].concat(Object.keys(extras));
        fn = AsyncFunction.apply(null, nomes.concat(['"use strict";\n' + codigo]));
      } catch (e) {
        return resolve({ erro: descreverErro(e, codigo) });
      }
      var acabou = false;
      var limite = _setTimeout(function () {
        if (!acabou) { acabou = true; resolve({ erro: 'Tempo esgotado. Será que tem um laço infinito ou uma Promise que nunca termina?' }); }
      }, tempoMax);
      var valores = [meuConsole, meuPrompt, meuSetTimeout, meuClearTimeout, function (m) { aoImprimir(String(m)); }].concat(Object.keys(extras).map(function (k) { return extras[k]; }));
      fn.apply(null, valores)
        .then(function () { esperar(); })
        .catch(function (e) { acabou = true; _clearTimeout(limite); resolve({ erro: descreverErro(e, codigo) }); });
      function esperar() {
        if (acabou) return;
        if (erroTardio) { acabou = true; _clearTimeout(limite); return resolve({ erro: descreverErro(erroTardio, codigo) }); }
        if (pendentes > 0) return _setTimeout(esperar, 20);
        // um "respiro" para Promises encadeadas terminarem
        _setTimeout(function () {
          if (pendentes > 0) return esperar();
          acabou = true; _clearTimeout(limite);
          resolve(erroTardio ? { erro: descreverErro(erroTardio, codigo) } : {});
        }, 30);
      }
    });
  }

  function descreverErro(e, codigo) {
    if (!e || typeof e !== 'object') return 'Erro: ' + String(e);
    var msg = (e.name || 'Erro') + ': ' + e.message;
    var m = String(e.stack || '').match(/<anonymous>:(\d+):(\d+)/);
    if (m) msg += '\n(linha ' + Math.max(1, Number(m[1]) - 3) + ')';
    return msg;
  }

  raiz.cqExecutarJs = executarJs;
  if (typeof module !== 'undefined' && module.exports) module.exports = { executarJs: executarJs };
})(typeof self !== 'undefined' ? self : globalThis);
