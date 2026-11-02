// Junta o código do aluno com o código de teste do exercício.
// Python/JS/React/Node/SQL: o teste vai no final.
// HTML: a página do aluno e o teste em JavaScript rodam separados.
// Terminal: os comandos de teste vêm depois de uma marca.
// Java: o aluno escreve só métodos ou classes, e nós criamos a classe
// Main com o método main() contendo o teste.
// Devolve { codigo, deslocamento } — deslocamento = quantas linhas
// foram colocadas ANTES do código do aluno (para corrigir o nº da linha do erro).
(function (raiz) {
  function montarCodigo(ling, codigoAluno, teste) {
    // HTML: o código do aluno é a página; o teste (JavaScript) roda separado, olhando a página
    if (ling === 'html') return { codigo: codigoAluno, teste: teste || '', deslocamento: 0 };
    if (!teste) return { codigo: codigoAluno, deslocamento: 0 };
    // JavaScript (e React e Node): o teste roda dentro de { } para as variáveis dele não colidirem com as do aluno
    if (ling === 'javascript' || ling === 'react' || ling === 'node') return { codigo: codigoAluno + '\n{\n' + teste + '\n}', deslocamento: 0 };
    // Terminal: só a saída dos comandos de teste é conferida (a marca separa as duas partes)
    if (ling === 'terminal') return { codigo: codigoAluno + '\n#__TESTE__\n' + teste, deslocamento: 0 };
    if (ling === 'sql') return { codigo: codigoAluno + '\n;\n' + teste, deslocamento: 0 };
    if (ling !== 'java') return { codigo: codigoAluno + '\n' + teste, deslocamento: 0 };

    var imports = [];
    var corpo = codigoAluno.split('\n').map(function (l) {
      if (/^\s*import\s+[\w.*]+\s*;\s*$/.test(l)) { imports.push(l.trim()); return ''; }
      return l;
    }).join('\n');
    var topo = ['import java.util.*;', 'import java.util.function.*;', 'import java.util.stream.*;'].concat(imports);
    var mainTeste = '  public static void main(String[] args) throws Exception {\n' + teste + '\n  }';
    if (/\b(class|interface|enum|record)\s+\w+/.test(codigoAluno)) {
      // modo classes: classes do aluno + classe Main de teste
      return {
        codigo: topo.join('\n') + '\n' + corpo + '\n\npublic class Main {\n' + mainTeste + '\n}\n',
        deslocamento: topo.length
      };
    }
    // modo métodos: os métodos do aluno ficam dentro da classe Main
    return {
      codigo: topo.join('\n') + '\npublic class Main {\n' + corpo + '\n\n' + mainTeste + '\n}\n',
      deslocamento: topo.length + 1
    };
  }
  raiz.cqMontarCodigo = montarCodigo;
  if (typeof module !== 'undefined' && module.exports) module.exports = { montarCodigo: montarCodigo };
})(typeof self !== 'undefined' ? self : globalThis);
