// =============================================================
// reactprep.js — prepara o código React do aluno para rodar:
//   1. tira as linhas de import/export (aqui tudo já vem pronto)
//   2. traduz o JSX (<App />) para JavaScript comum (sucrase)
//   3. monta as "ferramentas" que os testes usam:
//        renderizar(<App />)   desenha o componente no #root
//        clicar("button")      clica (e espera o React atualizar a tela)
//        digitar("input", "Ana")  digita num campo
//        enviar("form")        envia um formulário
//        esperar(100)          espera (para fetch e useEffect)
// Usado no Web Worker (navegador) e no validador (Node).
// =============================================================
(function (raiz) {
  function limparModulos(codigo) {
    return String(codigo)
      .replace(/^[ \t]*import\s+[^;\n]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, '')
      .replace(/^[ \t]*import\s+['"][^'"]+['"];?[ \t]*$/gm, '')
      .replace(/^([ \t]*)export\s+default\s+(function|class)\b/gm, '$1$2')
      .replace(/^[ \t]*export\s+default\s+[\w$]+\s*;?[ \t]*$/gm, '')
      .replace(/^([ \t]*)export\s+(const|let|var|function|class)\b/gm, '$1$2');
  }

  function preparar(codigo, lib, doc, win, api) {
    api = api || {};
    var js;
    try {
      js = lib.transformar(limparModulos(codigo));
    } catch (e) {
      var m = /\((\d+):(\d+)\)/.exec(e.message || '');
      return { erro: 'SyntaxError: ' + String(e.message || e).replace(/\s*\(\d+:\d+\)\s*$/, '') + (m ? '\n(linha ' + m[1] + ')' : '') };
    }
    var React = lib.React;
    var raizes = [];
    var act = lib.act;
    function elemento(alvo) {
      var el = typeof alvo === 'string' ? doc.querySelector(alvo) : alvo;
      if (!el) throw new Error('Não encontrei nenhum elemento com o seletor "' + alvo + '"');
      return el;
    }
    var extras = {
      React: React,
      ReactDOM: { createRoot: function (el) { var r = lib.createRoot(el); raizes.push(r); return r; } },
      createRoot: function (el) { var r = lib.createRoot(el); raizes.push(r); return r; },
      useState: React.useState, useEffect: React.useEffect, useRef: React.useRef, useMemo: React.useMemo,
      useCallback: React.useCallback, useContext: React.useContext, createContext: React.createContext,
      useReducer: React.useReducer, Fragment: React.Fragment, memo: React.memo,
      act: act, document: doc, window: win, Event: win.Event,
      renderizar: function (el, alvo) {
        var lugar = alvo ? elemento(alvo) : (doc.getElementById('root') || doc.body);
        var r = lib.createRoot(lugar);
        raizes.push(r);
        act(function () { r.render(el); });
        return lugar;
      },
      clicar: function (alvo) { var el = elemento(alvo); act(function () { el.click(); }); },
      digitar: function (alvo, texto) {
        var el = elemento(alvo);
        act(function () { el.value = String(texto); el.dispatchEvent(new win.Event('input', { bubbles: true })); });
      },
      marcar: function (alvo) {
        var el = elemento(alvo);
        act(function () { el.checked = !el.checked; el.dispatchEvent(new win.Event('change', { bubbles: true })); el.dispatchEvent(new win.Event('click', { bubbles: true })); });
      },
      escolher: function (alvo, valor) {
        // escolhe uma opção de um <select> (a página simulada não guarda o
        // valor do select sozinha, então marcamos a opção e o valor à mão)
        var el = elemento(alvo);
        valor = String(valor);
        act(function () {
          Array.prototype.forEach.call(el.querySelectorAll('option'), function (o) {
            var v = o.value !== undefined && o.value !== null ? String(o.value) : (o.getAttribute('value') !== null ? o.getAttribute('value') : o.textContent);
            if (v === valor) o.setAttribute('selected', ''); else o.removeAttribute('selected');
          });
          var atual = valor;
          try { Object.defineProperty(el, 'value', { configurable: true, get: function () { return atual; }, set: function (x) { atual = String(x); } }); } catch (e) { el.value = valor; }
          el.dispatchEvent(new win.Event('change', { bubbles: true }));
          el.dispatchEvent(new win.Event('input', { bubbles: true }));
        });
      },
      enviar: function (alvo) {
        var el = elemento(alvo || 'form');
        act(function () { el.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })); });
      },
      // fetch de mentirinha: responde com os dados do campo "api" do exercício
      fetch: function (url, op) {
        var caminho = String(url).replace(/^https?:\/\/[^/]+/, '');
        var dados = api[caminho];
        var metodo = String((op && op.method) || 'GET').toUpperCase();
        return new Promise(function (ok) {
          setTimeout(function () {
            var achou = dados !== undefined && metodo === 'GET';
            var corpo = achou ? JSON.stringify(dados) : (metodo !== 'GET' ? (op && op.body) || '{}' : JSON.stringify({ erro: 'Não encontrado' }));
            ok({ ok: achou || metodo !== 'GET', status: achou ? 200 : metodo !== 'GET' ? 201 : 404, json: function () { return Promise.resolve(JSON.parse(corpo)); }, text: function () { return Promise.resolve(corpo); } });
          }, 20);
        });
      },
      esperar: function (ms) {
        return new Promise(function (ok) { setTimeout(function () { act(function () {}); ok(); }, ms || 50); });
      }
    };
    return { codigo: js, extras: extras };
  }

  var api = { preparar: preparar, limparModulos: limparModulos };
  raiz.cqReactPrep = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
