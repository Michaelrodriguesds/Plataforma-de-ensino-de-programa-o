// =============================================================
// erros.js — tradutor de mensagens de erro.
// O computador reclama em inglês e de um jeito seco. Aqui a gente
// reconhece os erros mais comuns e explica em português, com dica.
// =============================================================
(function () {
  var REGRAS = [
    // ---------- Avisos do próprio CodeQuest (servidor) ----------
    [/Muitas execuções seguidas/i, 'Calma, muitas execuções seguidas', 'O Java roda no nosso servidor e cada aluno pode rodar até 20 vezes por minuto. Espere um minutinho e tente de novo: seu código continua aí.'],
    [/Sem conexão com o servidor/i, 'Sem conexão', 'O Java roda no nosso servidor e a internet caiu ou o servidor está acordando (no plano grátis ele dorme quando ninguém usa). Espere uns segundos e tente de novo.'],
    [/Faça login|Entre na sua conta|Sessão expirada/i, 'Entre na sua conta', 'Para rodar Java é preciso estar logado. Entre de novo e volte para esta fase.'],
    // ---------- SQL (SQLite) ----------
    [/no such table: (\w+)/i, 'Tabela não existe: $1', 'Não existe tabela chamada "$1". Confira o nome nas tabelas do exercício (o SQL não perdoa letra trocada) ou se você criou a tabela com CREATE TABLE antes.'],
    [/no such column: ([\w.]+)/i, 'Coluna não existe: $1', 'A coluna "$1" não existe. Confira o nome nas tabelas. Se era um texto, ele precisa de aspas simples: \'Ana\'.'],
    [/ambiguous column name: (\w+)/i, 'Coluna ambígua: $1', 'Duas tabelas do JOIN têm a coluna "$1". Diga de qual tabela ela é: tabela.$1 (ou apelido.$1).'],
    [/near "(.+?)": syntax error/i, 'Erro de escrita perto de "$1"', 'O SQL não entendeu o comando perto de "$1". Confira a ordem (SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...), vírgulas entre colunas e aspas simples nos textos.'],
    [/incomplete input/i, 'Comando incompleto', 'O comando terminou no meio. Faltou fechar um parêntese ou aspas?'],
    [/UNIQUE constraint failed: ([\w.]+)/i, 'Valor repetido em $1', 'A coluna $1 não aceita valores repetidos (UNIQUE ou PRIMARY KEY) e já existe uma linha com esse valor.'],
    [/NOT NULL constraint failed: ([\w.]+)/i, '$1 não pode ficar vazio', 'A coluna $1 é NOT NULL: todo INSERT precisa informar um valor para ela.'],
    [/FOREIGN KEY constraint failed/i, 'Chave estrangeira inválida', 'Você apontou para um registro que não existe na outra tabela (ou tentou apagar um registro que ainda é usado). Confira o id.'],
    [/CHECK constraint failed/i, 'Regra CHECK desrespeitada', 'O valor não obedece à regra CHECK da tabela (ex: preço maior que zero).'],
    [/table (\w+) already exists/i, 'Tabela $1 já existe', 'Essa tabela já foi criada. Use outro nome ou CREATE TABLE IF NOT EXISTS.'],
    [/(\d+) values for (\d+) columns|table \w+ has (\d+) columns but (\d+) values were supplied/i, 'Quantidade de valores errada', 'O número de valores no VALUES precisa ser igual ao número de colunas listadas.'],
    [/misuse of aggregate/i, 'Função de grupo no lugar errado', 'COUNT, SUM, AVG... não podem ir no WHERE. Para filtrar grupos use HAVING depois do GROUP BY.'],
    [/Erro de SQL/i, 'Erro no SQL', 'Leia a mensagem: ela diz o que o banco não entendeu. Compare com o exemplo da lição.'],
    // ---------- Back-end (Node simulado) ----------
    [/nenhum servidor está ouvindo na porta (\d+)/i, 'Servidor desligado', 'Ninguém está ouvindo na porta $1. Você chamou app.listen($1)? Confira também se a porta do fetch é a mesma do listen.'],
    [/Cannot find module '\.\//i, 'Arquivo separado', 'Aqui no CodeQuest todo o código fica num arquivo só. Em vez de require("./arquivo"), escreva tudo junto.'],
    [/Cannot find module '([^']+)'/i, 'Módulo não encontrado: $1', 'O módulo "$1" não está instalado. Confira o nome (express, jsonwebtoken, bcryptjs, mongodb, cors, dotenv).'],
    [/ERR_HTTP_HEADERS_SENT|Cannot set headers after they are sent/i, 'Respondeu duas vezes', 'Cada pedido só pode ter UMA resposta. Depois de res.json(...) ou res.send(...), use return para sair da função.'],
    [/requires a callback function but got a (\w+)/i, 'Rota sem função', 'Uma rota recebeu $1 no lugar da função (req, res) => { ... }. Confira se o nome da função está certo e se ela foi criada antes.'],
    [/a resposta não é JSON/i, 'Resposta não é JSON', 'O servidor respondeu com texto, não JSON. Use res.json(...) no servidor, ou r.text() no fetch.'],
    [/invalid signature|jwt malformed|jwt expired/i, 'Token inválido', 'O token JWT não confere: foi assinado com outro segredo, está incompleto ou venceu.'],
    [/secretOrPrivateKey must have a value/i, 'Faltou o segredo', 'jwt.sign precisa de um segredo: jwt.sign(dados, SEGREDO). Confira se a variável do segredo tem valor.'],
    [/MongoClient must be connected/i, 'Banco não conectado', 'Chame await cliente.connect() antes de usar cliente.db(...).'],
    [/A atualização precisa usar operadores/i, 'Use $set', 'No MongoDB, para mudar campos use { $set: { campo: valor } } (ou $inc, $push...).'],
    // ---------- React ----------
    [/Adjacent JSX elements must be wrapped|JSX expressions must have one parent/i, 'Um elemento só por fora', 'Um componente devolve UM elemento. Embrulhe tudo numa <div> ou num fragmento <>...</>.'],
    [/Unterminated JSX|Expected corresponding JSX closing tag/i, 'Etiqueta JSX sem fechar', 'Toda etiqueta aberta precisa fechar: <p>...</p>. Etiquetas vazias fecham com barra: <img />, <input />, <br />.'],
    [/Objects are not valid as a React child/i, 'Objeto na tela', 'Você colocou um objeto inteiro dentro do JSX. Mostre um campo dele: {cliente.nome}.'],
    [/Too many re-renders|Maximum update depth/i, 'Laço de atualização', 'Algum setEstado está rodando a cada desenho. Em eventos use uma função: onClick={() => setN(n + 1)}, e não onClick={setN(n + 1)}.'],
    [/Não encontrei nenhum elemento com o seletor/i, 'Elemento não encontrado', 'O teste procurou um elemento que não está na tela. Confira as etiquetas, ids e classes pedidos no enunciado.'],
    // ---------- Python ----------
    [/IndentationError|unexpected indent|expected an indented block|unindent does not match/i, 'Recuo errado', 'Confira os espaços no começo das linhas. Tudo que fica "dentro" de um if, for, while, def ou class precisa estar recuado (4 espaços), e as linhas do mesmo bloco precisam ter o mesmo recuo.'],
    [/SyntaxError: expected ':'/i, 'Faltou os dois pontos', 'Linhas com if, elif, else, for, while, def e class terminam com dois pontos ( : ).'],
    [/SyntaxError: (unterminated string|EOL while scanning)/i, 'Aspas abertas', 'Você abriu aspas e não fechou. Todo texto precisa de aspas no começo e no fim.'],
    [/SyntaxError: '\(' was never closed|unexpected EOF/i, 'Parêntese aberto', 'Algum ( ficou sem o ) correspondente. Conte os parênteses da linha.'],
    [/SyntaxError: invalid syntax\. Maybe you meant '==' /i, '= no lugar de ==', 'Para COMPARAR use == (dois iguais). Um = só serve para guardar valor.'],
    [/SyntaxError/i, 'Erro de escrita (sintaxe)', 'O Python não entendeu como a linha foi escrita. Confira: aspas fechadas, parênteses fechados, dois pontos no fim de if/for/def e vírgulas entre valores.'],
    [/NameError: name '(\w+)' is not defined/i, 'Nome desconhecido: $1', '"$1" não existe ainda. Pode ser: erro de digitação (maiúsculas contam!), variável usada antes de ser criada, ou um texto sem aspas.'],
    [/TypeError: can only concatenate str|unsupported operand type\(s\) for \+: 'int' and 'str'|must be str, not int/i, 'Texto + número', 'Não dá para somar texto com número. Use f-string: f"Idade: {idade}" ou converta com str(numero). Se queria fazer conta, converta o texto com int().'],
    [/TypeError: '(\w+)' object is not callable/i, 'Chamou algo que não é função', 'Você colocou () depois de algo que não é função. Às vezes é uma variável com o mesmo nome de uma função (ex: sum = 10 e depois sum(...)).'],
    [/TypeError: .*missing (\d+) required positional argument/i, 'Faltou argumento', 'A função espera mais valores do que você passou. Confira quantos parâmetros ela tem. Em métodos, lembre que o self vem primeiro na definição.'],
    [/TypeError: .*takes (\d+) positional arguments? but (\d+) (were|was) given/i, 'Argumentos demais', 'Você passou mais valores do que a função aceita. Em métodos de classe, esqueceu o self na definição?'],
    [/ValueError: invalid literal for int\(\)/i, 'Não é um número inteiro', 'int() só converte textos que são números inteiros, como "42". Textos como "abc" ou "4.5" dão erro (para "4.5" use float()).'],
    [/ZeroDivisionError/i, 'Divisão por zero', 'Nenhum número pode ser dividido por zero. Confira o divisor antes de dividir (if divisor != 0).'],
    [/IndexError: (list|string|tuple) index out of range/i, 'Posição que não existe', 'Você pediu uma posição além do fim. Lembre: a contagem começa em 0, então numa lista de 3 itens a última posição é 2.'],
    [/KeyError: (.+)/i, 'Chave não encontrada: $1', 'Essa chave não existe no dicionário. Use dic.get(chave, padrao) ou verifique com "if chave in dic".'],
    [/AttributeError: '(\w+)' object has no attribute '(\w+)'/i, '"$1" não tem "$2"', 'O objeto não tem esse atributo ou método. Erro de digitação? Esqueceu de criar no __init__ com self.$2 = ...?'],
    [/RecursionError/i, 'Recursão sem fim', 'A função se chamou vezes demais. Confira o caso base (a condição que faz a recursão parar).'],
    [/EOFError/i, 'Acabou a entrada', 'Seu programa pediu mais input() do que os dados de entrada disponíveis. Confira quantas vezes você chama input().'],
    // ---------- JavaScript ----------
    [/ReferenceError: (\w+) is not defined/i, 'Nome desconhecido: $1', '"$1" não existe. Erro de digitação (maiúsculas contam!)? Esqueceu de criar com let/const? Ou era um texto e faltaram as aspas?'],
    [/ReferenceError: Cannot access '(\w+)' before initialization/i, 'Usou antes de criar', 'Você usou "$1" antes da linha onde ele é criado. Mova a criação para cima.'],
    [/TypeError: Assignment to constant variable/i, 'const não muda', 'Você tentou trocar o valor de uma const. Se o valor precisa mudar, crie com let.'],
    [/TypeError: (.+) is not a function/i, 'Não é uma função', '"$1" não é uma função. Confira o nome (ex: toUpperCase, com U e C maiúsculos) e se o valor é do tipo certo (texto, array...).'],
    [/TypeError: Cannot read propert(y|ies) of (undefined|null)/i, 'Algo está vazio ($2)', 'Você tentou pegar um campo de algo que é $2. Confira se a variável foi preenchida, se o índice existe no array ou se o nome do campo está certo.'],
    [/TypeError: Cannot set propert(y|ies) of (undefined|null)/i, 'Algo está vazio ($2)', 'Você tentou guardar um campo em algo que é $2.'],
    [/SyntaxError: Unexpected end of input/i, 'Faltou fechar algo', 'Alguma chave { , parêntese ( ou crase ` ficou aberta. Conte se cada abertura tem seu fechamento.'],
    [/SyntaxError: missing \) after argument list/i, 'Parêntese ou vírgula', 'Faltou fechar um parêntese, ou falta uma vírgula entre os valores, ou um texto ficou sem aspas.'],
    [/SyntaxError: Invalid or unexpected token/i, 'Caractere inesperado', 'Tem algum caractere estranho: aspas não fechadas ou aspas "curvas" copiadas de outro lugar ( “ ” ). Use aspas retas.'],
    [/SyntaxError: Identifier '(\w+)' has already been declared/i, '"$1" já existe', 'Você criou "$1" duas vezes com let/const. Para trocar o valor, use só $1 = novoValor (sem let).'],
    [/SyntaxError: Unexpected token/i, 'Erro de escrita (sintaxe)', 'O JavaScript encontrou algo fora do lugar. Confira chaves, parênteses, vírgulas e ponto e vírgula perto da linha indicada.'],
    [/RangeError: Maximum call stack/i, 'Recursão sem fim', 'Uma função se chamou vezes demais. Confira o caso base da recursão.'],
    [/Acabaram os dados de entrada/i, 'Acabou a entrada', 'Você chamou prompt()/input() mais vezes do que os dados de entrada disponíveis.'],
    // ---------- Java ----------
    [/';' expected/i, 'Faltou ponto e vírgula', 'Em Java, toda instrução termina com ; — confira o fim da linha indicada (ou da linha de cima).'],
    [/cannot find symbol[\s\S]*?symbol:\s+(variable|method|class) (\w+)/i, 'Não achei "$2"', 'O Java não conhece "$2". Erro de digitação (maiúsculas contam: String, System)? Esqueceu de declarar a variável com o tipo (int x = ...)? Usou fora das chaves onde ela foi criada?'],
    [/cannot find symbol/i, 'Nome desconhecido', 'O Java não reconhece um nome. Confira a digitação, maiúsculas e se a variável foi declarada.'],
    [/incompatible types: String cannot be converted to int/i, 'Texto no lugar de número', 'Você tentou guardar texto numa variável int. Use Integer.parseInt(texto) para converter.'],
    [/incompatible types: possible lossy conversion from double to int/i, 'double em int', 'Um número com vírgula não cabe num int. Mude a variável para double ou converta com (int).'],
    [/incompatible types/i, 'Tipos incompatíveis', 'O valor não combina com o tipo da variável ou do retorno. Confira os tipos declarados.'],
    [/missing return statement/i, 'Faltou o return', 'O método promete devolver um valor, mas existe um caminho sem return. Garanta um return no final.'],
    [/reached end of file while parsing/i, 'Faltou fechar chave', 'Alguma { ficou sem a } correspondente. Conte as chaves.'],
    [/class, interface, enum, or record expected|illegal start of (type|expression)/i, 'Chave fora do lugar', 'Tem uma } a mais ou código fora de um método/classe. Confira o equilíbrio das chaves.'],
    [/unclosed string literal/i, 'Aspas abertas', 'Um texto abriu aspas e não fechou.'],
    [/non-static (method|variable) (\w+).*cannot be referenced from a static context/i, 'static', '"$2" pertence a um objeto, mas você usou dentro de um método static. Crie um objeto com new, ou declare como static.'],
    [/is not abstract and does not override abstract method (\w+)/i, 'Faltou implementar $1', 'A classe precisa implementar o método $1 (exigido pela classe abstrata ou interface).'],
    [/attempting to assign weaker access privileges/i, 'Falta public', 'Métodos que implementam uma interface precisam ser public.'],
    [/ArithmeticException: \/ by zero/i, 'Divisão por zero', 'Divisão de inteiro por zero. Confira o divisor antes.'],
    [/ArrayIndexOutOfBoundsException|IndexOutOfBoundsException/i, 'Posição que não existe', 'Você acessou uma posição fora do array/lista. A última posição é tamanho - 1.'],
    [/NullPointerException/i, 'Algo está null', 'Você usou um objeto que está null (vazio). Confira se ele foi criado com new e se o campo foi preenchido.'],
    [/NumberFormatException/i, 'Não é um número', 'Integer.parseInt / Double.parseDouble recebeu um texto que não é número.'],
    [/InputMismatchException/i, 'Entrada do tipo errado', 'O Scanner esperava um número mas a entrada é texto (ou vice-versa). Confira a ordem dos nextInt/nextLine.'],
    [/NoSuchElementException/i, 'Acabou a entrada', 'O Scanner tentou ler mais do que os dados de entrada disponíveis.'],
    [/StackOverflowError/i, 'Recursão sem fim', 'Um método se chamou vezes demais. Confira o caso base.'],
    [/Tempo esgotado/i, 'Laço infinito?', 'O programa não terminou a tempo. Confira se a condição do while muda em algum momento (ex: i++).']
  ];

  function explicar(erro) {
    if (!erro) return null;
    for (var i = 0; i < REGRAS.length; i++) {
      var m = String(erro).match(REGRAS[i][0]);
      if (m) {
        var trocar = function (t) { return t.replace(/\$(\d)/g, function (_, n) { return m[Number(n)] || ''; }); };
        return { titulo: trocar(REGRAS[i][1]), dica: trocar(REGRAS[i][2]) };
      }
    }
    return { titulo: 'Erro ao rodar', dica: 'Leia a mensagem: ela costuma dizer a linha e o tipo do problema. Compare com o exemplo da lição.' };
  }
  window.cqExplicarErro = explicar;
})();
