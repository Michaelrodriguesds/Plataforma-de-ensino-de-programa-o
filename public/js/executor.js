// =============================================================
// executor.js — o "motor" que roda o código do aluno.
//   JavaScript -> Web Worker no próprio navegador
//   Python     -> Pyodide (Python em WebAssembly) num Web Worker
//   Java       -> enviado ao servidor, que compila e executa
//   HTML/CSS   -> Web Worker com a página montada (linkedom) + teste em JS
//   SQL        -> SQLite (sql.js, WebAssembly) num Web Worker
//   Node       -> "Node de mentirinha" (Express, JWT, MongoDB...) num Web Worker
//   React      -> Preact + JSX (sucrase) num Web Worker
//   Terminal   -> bash + Git + npm simulados num Web Worker
// Todos devolvem a mesma coisa: { saida: "texto", erro: "texto ou vazio" }
// e, quando faz sentido: html (a página depois), pagina (HTML do aluno), tela (terminal)
// =============================================================
(function () {
  var TEMPO_MAX = { javascript: 6000, python: 8000, html: 6000, sql: 8000, node: 7000, react: 8000, terminal: 7000 };
  var WORKERS = { html: 'worker-html.js', sql: 'worker-sql.js', node: 'worker-node.js', react: 'worker-react.js', terminal: 'worker-terminal.js' };
  var py = null;          // worker do Python (fica vivo entre execuções)
  var pyPronto = null;    // Promise que resolve quando o Pyodide carregou
  var aoStatusPy = null;
  var pyOk = false;

  function iniciarPython() {
    if (pyPronto) return pyPronto;
    py = new Worker('/js/runtime/worker-py.js');
    pyPronto = new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('O Python demorou demais para carregar. Verifique sua internet.')); }, 90000);
      py.addEventListener('message', function ouvir(e) {
        if (e.data.tipo === 'pronto') { clearTimeout(t); py.removeEventListener('message', ouvir); resolve(); }
        if (e.data.tipo === 'falhou') { clearTimeout(t); reject(new Error('Não consegui carregar o Python: ' + e.data.erro)); }
      });
      py.onerror = function (e) { clearTimeout(t); reject(new Error('Não consegui carregar o Python (sem internet?).')); };
    });
    pyPronto.then(function () { pyOk = true; }, function () { py = null; pyPronto = null; pyOk = false; });
    if (aoStatusPy) aoStatusPy('carregando');
    pyPronto.then(function () { if (aoStatusPy) aoStatusPy('pronto'); }, function () { if (aoStatusPy) aoStatusPy('erro'); });
    return pyPronto;
  }

  function rodarNoWorker(worker, ling, codigo, entrada, recriar, html) {
    return new Promise(function (resolve) {
      var linhas = [];
      var terminou = false;
      var t = setTimeout(function () {
        if (terminou) return;
        terminou = true;
        worker.terminate();
        recriar();
        resolve({ saida: linhas.join('\n'), erro: 'Tempo esgotado: seu código demorou demais. Será que tem um laço infinito?' });
      }, TEMPO_MAX[ling]);
      worker.onmessage = function (e) {
        if (terminou) return;
        if (e.data.tipo === 'saida') {
          linhas.push(e.data.texto);
          if (linhas.length > 2000) {
            terminou = true; clearTimeout(t); worker.terminate(); recriar();
            resolve({ saida: linhas.slice(0, 2000).join('\n'), erro: 'Seu programa imprimiu linhas demais (laço infinito?).' });
          }
        } else if (e.data.tipo === 'fim') {
          terminou = true; clearTimeout(t);
          var r = { saida: e.data.saidaTexto !== undefined ? e.data.saidaTexto : linhas.join('\n'), erro: e.data.erro || '', html: e.data.html };
          if (e.data.tela !== undefined) r.tela = e.data.tela;
          if (e.data.tabelas !== undefined) r.tabelas = e.data.tabelas;
          resolve(r);
        }
      };
      worker.postMessage(typeof html === 'object' && html !== null ? Object.assign({ codigo: codigo, entrada: entrada || '' }, html) : { codigo: codigo, entrada: entrada || '', html: html });
    });
  }

  async function executar(ling, codigo, entrada, opcoes) {
    opcoes = opcoes || {};
    if (ling === 'javascript') {
      var w = new Worker(opcoes.dom !== undefined ? '/js/runtime/worker-dom.js' : '/js/runtime/worker-js.js');
      var r = await rodarNoWorker(w, ling, codigo, entrada, function () {}, opcoes.dom);
      w.terminate();
      return r;
    }
    if (WORKERS[ling]) {
      var w2 = new Worker('/js/runtime/' + WORKERS[ling]);
      var dados = { html: ling === 'html' ? codigo : opcoes.dom, banco: opcoes.banco, pasta: opcoes.pasta, api: opcoes.api, descrever: opcoes.descrever };
      var r2 = await rodarNoWorker(w2, ling, ling === 'html' ? (opcoes.teste || '') : codigo, entrada, function () {}, dados);
      w2.terminate();
      if (ling === 'html') { r2.pagina = codigo; delete r2.html; }
      return r2;
    }
    if (ling === 'python') {
      try { await iniciarPython(); } catch (e) { return { saida: '', erro: e.message }; }
      return rodarNoWorker(py, ling, codigo, entrada, function () { py = null; pyPronto = null; pyOk = false; iniciarPython(); });
    }
    if (ling === 'java') {
      try {
        var resp = await fetch('/api/executar/java', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('cq_token') || '') },
          body: JSON.stringify({ codigo: codigo, entrada: entrada || '', deslocamento: opcoes.deslocamento || 0 })
        });
        var dados = await resp.json();
        if (!resp.ok && dados.erro) return { saida: '', erro: dados.erro };
        return { saida: (dados.saida || '').replace(/\n$/, ''), erro: dados.ok ? '' : (dados.erro || 'Erro ao executar') };
      } catch (e) {
        return { saida: '', erro: 'Sem conexão com o servidor para rodar Java. Confira sua internet.' };
      }
    }
    return { saida: '', erro: 'Linguagem desconhecida' };
  }

  // Compara a saída ignorando espaços no fim das linhas e linhas vazias no final
  function normalizar(s) {
    return String(s == null ? '' : s).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/\n+$/, '');
  }

  window.cqExecutor = {
    executar: executar,
    normalizar: normalizar,
    // Tabelas do banco de um exercício de SQL (para mostrar ao aluno)
    descreverBanco: function (banco) {
      return executar('sql', '', '', { banco: banco, descrever: true }).then(function (r) { return r.tabelas || []; });
    },
    prepararPython: function () { return iniciarPython().catch(function () {}); },
    pythonPronto: function () { return pyOk; },
    aoStatusPython: function (fn) { aoStatusPy = fn; }
  };
})();
