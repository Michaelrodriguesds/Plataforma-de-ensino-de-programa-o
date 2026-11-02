// =============================================================
// editor.js — o editor de código (funciona no celular e no PC).
// Truque: um <textarea> transparente por cima de um <pre> colorido.
// Você digita no textarea; o pre mostra o mesmo texto com cores.
// Também tem uma barra de símbolos para o teclado do celular.
// =============================================================
(function () {
  var SIMBOLOS = {
    python: ['⇥', ':', '(', ')', '"', "'", '[', ']', '{', '}', '=', '+', '-', '*', '/', '%', '<', '>', '.', ',', '_', '#', 'f"'],
    javascript: ['⇥', ';', '(', ')', '{', '}', '[', ']', '"', "'", '`', '=', '=>', '+', '-', '*', '/', '%', '<', '>', '.', ',', '!', '&&', '||', '${'],
    java: ['⇥', ';', '(', ')', '{', '}', '[', ']', '"', "'", '=', '+', '-', '*', '/', '%', '<', '>', '.', ',', '!', '&&', '||', '->'],
    html: ['⇥', '<', '>', '/', '=', '"', '{', '}', ':', ';', '#', '.', '-', '(', ')', '!', '%'],
    sql: ['⇥', '*', ',', ';', '(', ')', "'", '=', '<', '>', '%', '_', '.'],
    terminal: ['-', '--', '.', '/', '"', '~', '>', '&&', '*', '#'],
    react: ['⇥', '<', '>', '/', '{', '}', '(', ')', '[', ']', '"', "'", '`', '=', '=>', ';', '.', ',', '!', '&&', '?', ':', '${'],
    node: ['⇥', ';', '(', ')', '{', '}', '[', ']', '"', "'", '`', '=', '=>', '+', '-', '.', ',', '!', '&&', '||', ':', '${', '/']
  };
  var PARES = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };

  function criarEditor(alvo, opcoes) {
    var ling = opcoes.ling;
    var recuo = ling === 'python' || ling === 'java' ? '    ' : '  ';
    alvo.innerHTML =
      '<div class="editor">' +
      '  <div class="editor-gutter" aria-hidden="true"></div>' +
      '  <div class="editor-area">' +
      '    <pre class="editor-realce" aria-hidden="true"><code></code></pre>' +
      '    <textarea class="editor-texto" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Editor de código"></textarea>' +
      '  </div>' +
      '</div>' +
      '<div class="simbolos" role="toolbar" aria-label="Símbolos"></div>';
    var ta = alvo.querySelector('textarea');
    var code = alvo.querySelector('.editor-realce code');
    var pre = alvo.querySelector('.editor-realce');
    var gutter = alvo.querySelector('.editor-gutter');
    var barra = alvo.querySelector('.simbolos');
    ta.value = opcoes.valor || '';

    function atualizar() {
      code.innerHTML = window.cqRealcar(ta.value, ling) + '\n';
      var n = ta.value.split('\n').length;
      var nums = '';
      for (var i = 1; i <= n; i++) nums += i + '\n';
      gutter.textContent = nums;
      if (opcoes.aoMudar) opcoes.aoMudar(ta.value);
    }
    function sincronizarRolagem() {
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft;
      gutter.scrollTop = ta.scrollTop;
    }

    function inserir(texto, recuarCursor) {
      ta.focus();
      var ok = false;
      try { ok = document.execCommand('insertText', false, texto); } catch (e) { ok = false; }
      if (!ok) {
        var ini = ta.selectionStart, fim = ta.selectionEnd;
        ta.setRangeText(texto, ini, fim, 'end');
      }
      if (recuarCursor) { var p = ta.selectionStart - recuarCursor; ta.setSelectionRange(p, p); }
      atualizar();
    }

    ta.addEventListener('input', atualizar);
    ta.addEventListener('scroll', sincronizarRolagem);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        inserir(recuo);
      } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
        // mantém o recuo da linha atual (e aumenta depois de : ou {)
        var antes = ta.value.slice(0, ta.selectionStart);
        var linha = antes.slice(antes.lastIndexOf('\n') + 1);
        var atual = (linha.match(/^\s*/) || [''])[0];
        var ultimo = linha.trim().slice(-1);
        var extra = (ultimo === ':' && ling === 'python') || ultimo === '{' ? recuo : '';
        var depois = ta.value.slice(ta.selectionEnd);
        e.preventDefault();
        if (ultimo === '{' && depois.trim().charAt(0) === '}' && depois.indexOf('\n') !== 0) {
          inserir('\n' + atual + extra + '\n' + atual, atual.length + 1);
        } else {
          inserir('\n' + atual + extra);
        }
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (opcoes.aoAtalho) opcoes.aoAtalho();
      } else if (e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) {
        // apaga um recuo inteiro de uma vez
        var a = ta.value.slice(0, ta.selectionStart);
        var lin = a.slice(a.lastIndexOf('\n') + 1);
        if (lin.length && /^ +$/.test(lin) && lin.length % recuo.length === 0) {
          e.preventDefault();
          ta.setSelectionRange(ta.selectionStart - recuo.length, ta.selectionStart);
          inserir('');
        }
      }
    });

    (SIMBOLOS[ling] || []).forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'simbolo';
      b.textContent = s;
      b.setAttribute('aria-label', s === '⇥' ? 'Inserir recuo' : 'Inserir ' + s);
      b.addEventListener('mousedown', function (e) { e.preventDefault(); }); // não tira o foco
      b.addEventListener('click', function () {
        if (s === '⇥') return inserir(recuo);
        if (s === '${') return inserir('${}', 1);
        if (s === 'f"') return inserir('f""', 1);
        if (PARES[s] && ta.selectionStart === ta.selectionEnd) return inserir(s + PARES[s], 1);
        inserir(s === '=>' || s === '->' || s === '&&' || s === '||' ? ' ' + s + ' ' : s);
      });
      barra.appendChild(b);
    });

    atualizar();
    return {
      valor: function () { return ta.value; },
      definir: function (v) { ta.value = v; atualizar(); },
      focar: function () { ta.focus(); }
    };
  }
  window.cqCriarEditor = criarEditor;
})();
