// Código Python que roda ANTES do código do aluno.
// Ele troca o input() por uma versão que lê da caixa "Entrada" e
// mostra o que foi "digitado", como num terminal de verdade.
(function (raiz) {
  var PREAMBULO = [
    'import builtins as _b, sys as _s',
    'def _cq_input(prompt=""):',
    '    _l = _s.stdin.readline()',
    '    if _l == "":',
    '        raise EOFError("Acabaram os dados de entrada (input() sem resposta)")',
    '    _l = _l.rstrip("\\n").rstrip("\\r")',
    '    print(str(prompt) + _l)',
    '    return _l',
    '_b.input = _cq_input',
    'del _cq_input'
  ].join('\n');
  raiz.CQ_PY_PREAMBULO = PREAMBULO;
  if (typeof module !== 'undefined' && module.exports) module.exports = { PREAMBULO: PREAMBULO };
})(typeof self !== 'undefined' ? self : globalThis);
