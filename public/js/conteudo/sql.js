// =============================================================
// Trilha SQL e Bancos de Dados
// Tudo roda num SQLite de verdade (sql.js) dentro do navegador.
//
// O campo "banco" é o SQL que cria as tabelas e os dados de exemplo
// antes do código do aluno. Ele pode ficar no exercício, na fase ou na
// trilha inteira (o mais específico vale). A cada execução o banco é
// criado do zero, então o aluno pode apagar tudo sem medo.
//
// A saída de um SELECT é um quadro de texto (o app mostra como tabela):
//   nome | preco
//   Escova | 35
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});

  var T_CLIENTES = `CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT,
  nascimento TEXT,
  telefone TEXT
);
INSERT INTO clientes VALUES
  (1, 'Ana Souza', 'Campinas', '1990-03-12', '11 98888-1111'),
  (2, 'Bia Lima', 'São Paulo', '1985-07-30', '11 97777-2222'),
  (3, 'Caio Rocha', 'Campinas', '2001-11-05', NULL),
  (4, 'Duda Alves', 'Santos', '1995-01-20', '13 99999-4444'),
  (5, 'Edu Martins', 'São Paulo', '1978-09-14', '11 96666-5555'),
  (6, 'Fê Costa', 'Campinas', '1999-05-02', NULL),
  (7, 'Gabi Nunes', 'Santos', '2003-12-25', '13 95555-7777'),
  (8, 'Hugo Prado', 'São Paulo', '1992-06-18', '11 94444-8888');`;

  var T_SERVICOS = `CREATE TABLE servicos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco REAL NOT NULL,
  duracao_min INTEGER
);
INSERT INTO servicos VALUES
  (1, 'Corte feminino', 'Cabelo', 60, 45),
  (2, 'Corte masculino', 'Cabelo', 40, 30),
  (3, 'Escova', 'Cabelo', 35, 40),
  (4, 'Coloração', 'Química', 120, 90),
  (5, 'Progressiva', 'Química', 180, 150),
  (6, 'Manicure', 'Unhas', 25, 40),
  (7, 'Pedicure', 'Unhas', 30, 45);`;

  var T_PROFISSIONAIS = `CREATE TABLE profissionais (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  especialidade TEXT
);
INSERT INTO profissionais VALUES
  (1, 'Marta', 'Cabelo'),
  (2, 'Júlia', 'Química'),
  (3, 'Rita', 'Unhas');`;

  var T_AGENDAMENTOS = `CREATE TABLE agendamentos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  servico_id INTEGER NOT NULL REFERENCES servicos(id),
  profissional_id INTEGER REFERENCES profissionais(id),
  data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado'
);
INSERT INTO agendamentos VALUES
  (1, 1, 1, 1, '2026-10-01', 'concluido'),
  (2, 1, 6, 3, '2026-10-01', 'concluido'),
  (3, 2, 4, 2, '2026-10-03', 'concluido'),
  (4, 3, 2, 1, '2026-10-05', 'concluido'),
  (5, 4, 3, 1, '2026-10-08', 'cancelado'),
  (6, 2, 6, 3, '2026-10-10', 'concluido'),
  (7, 5, 2, 1, '2026-10-12', 'concluido'),
  (8, 6, 5, 2, '2026-10-15', 'concluido'),
  (9, 1, 3, 1, '2026-10-20', 'concluido'),
  (10, 4, 7, 3, '2026-10-22', 'concluido'),
  (11, 7, 1, 1, '2026-11-03', 'agendado'),
  (12, 2, 5, 2, '2026-11-04', 'agendado');`;

  var TUDO = [T_CLIENTES, T_SERVICOS, T_PROFISSIONAIS, T_AGENDAMENTOS].join('\n\n');
  var JUNTAR = TUDO;

  C.sql = {
    id: 'sql', nome: 'SQL e Bancos de Dados', icone: '🗄️', cor: '#B39DDB', ling: 'sql',
    desc: 'Onde os sistemas guardam tudo: clientes, vendas, agendamentos. Consultar, resumir, juntar e criar tabelas com SQL.',
    banco: TUDO,
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'Consultando dados', desc: 'Pedir ao banco exatamente o que você quer ver.',
        fases: [
          {
            id: 'sql-01', titulo: 'Sua primeira consulta', icone: '🔍', banco: T_SERVICOS,
            licao: [
              { titulo: 'Banco de dados é um armário de planilhas', texto: `<p>Todo sistema (o app do banco, o iFood, a agenda do salão) guarda as informações num <b>banco de dados</b>. Um banco relacional é como um armário cheio de <b>tabelas</b>, parecidas com planilhas:</p><ul><li>cada <b>tabela</b> guarda um tipo de coisa (clientes, serviços)</li><li>cada <b>coluna</b> é uma informação (nome, preço)</li><li>cada <b>linha</b> é um registro (um serviço)</li></ul><p>Para conversar com o banco usamos <b>SQL</b> (diz-se "ésse-quê-éle" ou "síquel"). Ele é usado em MySQL, PostgreSQL, SQLite, SQL Server... aprendeu um, aprendeu quase todos.</p>`, codigo: `SELECT * FROM servicos;` },
              { titulo: 'SELECT ... FROM ...', texto: `<p>A consulta mais simples tem duas partes:</p><ul><li><code>SELECT</code>: <b>o que</b> você quer ver. O <code>*</code> significa "todas as colunas"</li><li><code>FROM</code>: <b>de qual tabela</b></li></ul><p>O <code>;</code> marca o fim do comando. O SQL não liga para maiúsculas, mas escrever os comandos em MAIÚSCULAS é o costume, para diferenciar do nome das tabelas.</p>`, codigo: `SELECT nome, preco FROM servicos;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Numa tabela de clientes, cada <b>linha</b> representa...', op: ['Uma informação, como o telefone', 'Um cliente', 'A tabela inteira', 'Um comando SQL'], c: 1, exp: 'Linha = registro (um cliente). Coluna = um tipo de informação (o telefone de todos).' },
              { tipo: 'quiz', p: 'O que o <code>*</code> faz em <code>SELECT * FROM servicos</code>?', op: ['Multiplica', 'Mostra todas as colunas', 'Mostra só a primeira linha', 'Apaga a tabela'], c: 1, exp: 'O asterisco é um atalho para "todas as colunas".' },
              { tipo: 'prever', p: 'O que esta consulta mostra?', codigo: `SELECT categoria FROM servicos WHERE id = 6;`, op: ['categoria\nUnhas', 'Manicure', 'categoria\nManicure', '6'], c: 0, exp: 'Ela mostra a coluna categoria da linha com id 6 (a Manicure), que é Unhas. A primeira linha do resultado é sempre o nome da coluna.' },
              { tipo: 'codigo', p: 'Mostre o <b>nome</b> e a <b>duracao_min</b> de todos os serviços, nessa ordem de colunas.', inicio: `SELECT `, saida: 'nome | duracao_min\nCorte feminino | 45\nCorte masculino | 30\nEscova | 40\nColoração | 90\nProgressiva | 150\nManicure | 40\nPedicure | 45', dicas: ['Liste as colunas separadas por vírgula depois do SELECT.', 'SELECT nome, duracao_min FROM ...', 'SELECT nome, duracao_min FROM servicos;'], sol: `SELECT nome, duracao_min FROM servicos;` }
            ]
          },
          {
            id: 'sql-02', titulo: 'Colunas, apelidos e contas', icone: '🧾', banco: T_SERVICOS,
            licao: [
              { titulo: 'Apelidos com AS', texto: `<p>Com <code>AS</code> você dá um <b>apelido</b> para a coluna no resultado. A tabela não muda: só o nome que aparece em cima.</p><p>Se o apelido tiver espaço ou acento, use aspas duplas: <code>AS "Preço (R$)"</code>.</p>`, codigo: `SELECT nome AS servico, preco AS valor FROM servicos;` },
              { titulo: 'Contas no SELECT', texto: `<p>Dá para fazer contas direto na consulta: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>. O resultado vira uma coluna nova, só no resultado.</p><p>Cuidado com a divisão: <code>7 / 2</code> dá <b>3</b> no SQLite (divisão de inteiros). Para ter vírgula, use um número com ponto: <code>7 / 2.0</code> dá 3.5.</p>`, codigo: `SELECT nome, preco, preco * 0.9 AS com_desconto
FROM servicos;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT nome AS servico FROM servicos WHERE id = 3;`, op: ['servico\nEscova', 'nome\nEscova', 'Escova', 'servico\n3'], c: 0, exp: 'O AS troca o nome da coluna no resultado: aparece "servico" em vez de "nome".' },
              { tipo: 'prever', p: 'Quanto dá esta conta no SQLite?', codigo: `SELECT 7 / 2 AS a, 7 / 2.0 AS b;`, op: ['a | b\n3 | 3.5', 'a | b\n3.5 | 3.5', 'a | b\n3 | 3', 'a | b\n4 | 3.5'], c: 0, exp: 'Inteiro dividido por inteiro dá inteiro (a parte depois da vírgula é jogada fora). Com 2.0, a conta tem casas decimais.' },
              { tipo: 'completar', p: 'Mostre o nome e o preço com 10% de aumento, com o apelido <code>novo_preco</code>.', codigo: `SELECT nome, preco ___ 1.1 ___ novo_preco
FROM servicos
WHERE id = 1;`, resp: ['*', 'AS'], op: ['*', 'AS', '+', 'IS'], saida: 'nome | novo_preco\nCorte feminino | 66', exp: 'Multiplicar por 1.1 aumenta 10%. AS dá o apelido.' },
              { tipo: 'codigo', p: 'O salão quer saber quanto custa <b>cada minuto</b> de serviço. Mostre o <code>nome</code> e o preço dividido pela duração, com o apelido <code>por_minuto</code>, usando <code>ROUND(..., 2)</code> para arredondar com 2 casas.', inicio: `SELECT nome,
FROM servicos;`, saida: 'nome | por_minuto\nCorte feminino | 1.33\nCorte masculino | 1.33\nEscova | 0.88\nColoração | 1.33\nProgressiva | 1.2\nManicure | 0.63\nPedicure | 0.67', dicas: ['A conta é preco / duracao_min (o preço já tem casas decimais, então a divisão não perde a vírgula).', 'ROUND(preco / duracao_min, 2)', 'SELECT nome, ROUND(preco / duracao_min, 2) AS por_minuto FROM servicos;'], sol: `SELECT nome, ROUND(preco / duracao_min, 2) AS por_minuto
FROM servicos;` }
            ]
          },
          {
            id: 'sql-03', titulo: 'Filtrando com WHERE', icone: '🧹', banco: T_SERVICOS,
            licao: [
              { titulo: 'Só as linhas que interessam', texto: `<p>O <code>WHERE</code> é um filtro: só passam as linhas em que a condição é verdadeira.</p><ul><li><code>=</code> igual (um só, diferente do JavaScript!)</li><li><code>&lt;&gt;</code> ou <code>!=</code> diferente</li><li><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li></ul><p>Textos vão entre <b>aspas simples</b>: <code>'Cabelo'</code>. Números, sem aspas.</p>`, codigo: `SELECT nome, preco
FROM servicos
WHERE preco >= 60;` },
              { titulo: 'AND, OR e NOT', texto: `<ul><li><code>AND</code>: as duas condições precisam ser verdade</li><li><code>OR</code>: basta uma</li><li><code>NOT</code>: inverte</li></ul><p>Misturou AND com OR? Use <b>parênteses</b> para deixar claro, como na matemática.</p>`, codigo: `SELECT nome, categoria, preco
FROM servicos
WHERE categoria = 'Cabelo' AND preco < 50;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual WHERE está escrito certo?', op: ["WHERE categoria = Unhas", "WHERE categoria == 'Unhas'", "WHERE categoria = 'Unhas'", 'WHERE categoria = "Unhas" AND'], c: 2, exp: 'No SQL a comparação é com um = só, e textos vão entre aspas simples.' },
              { tipo: 'prever', codigo: `SELECT nome FROM servicos
WHERE categoria = 'Unhas' OR preco > 150;`, op: ['nome\nProgressiva\nManicure\nPedicure', 'nome\nManicure\nPedicure', 'nome\nProgressiva', 'nome\n(nenhuma linha)'], c: 0, exp: 'Com OR basta uma condição: as duas de Unhas, e a Progressiva, que custa mais de 150. Elas aparecem na ordem da tabela.' },
              { tipo: 'completar', p: 'Serviços de <b>Química</b> que custam <b>menos de 150</b>.', codigo: `SELECT nome FROM servicos
___ categoria = 'Química' ___ preco < 150;`, resp: ['WHERE', 'AND'], op: ['WHERE', 'AND', 'OR', 'IF'], saida: 'nome\nColoração', exp: 'WHERE abre o filtro; AND exige as duas condições.' },
              { tipo: 'codigo', p: 'Mostre o <code>nome</code> e o <code>preco</code> dos serviços que <b>não</b> são da categoria <code>Cabelo</code> e que duram <b>até 45 minutos</b> (<code>duracao_min</code> menor ou igual a 45).', inicio: `SELECT nome, preco
FROM servicos`, saida: 'nome | preco\nManicure | 25\nPedicure | 30', dicas: ['Duas condições ligadas por AND.', "categoria <> 'Cabelo'", "WHERE categoria <> 'Cabelo' AND duracao_min <= 45;"], sol: `SELECT nome, preco
FROM servicos
WHERE categoria <> 'Cabelo' AND duracao_min <= 45;` }
            ]
          },
          {
            id: 'sql-04', titulo: 'Filtros espertos', icone: '🔎', banco: T_CLIENTES,
            licao: [
              { titulo: 'IN, BETWEEN e LIKE', texto: `<ul><li><code>cidade IN ('Santos', 'Campinas')</code>: está na lista (troca vários OR)</li><li><code>nascimento BETWEEN '1990-01-01' AND '1999-12-31'</code>: entre dois valores, incluindo as pontas</li><li><code>nome LIKE 'A%'</code>: parecido com um modelo. <code>%</code> = qualquer coisa (até nada); <code>_</code> = exatamente um caractere</li></ul><p><code>LIKE '%Costa%'</code> acha "Costa" em qualquer parte do texto. No SQLite o LIKE não diferencia maiúsculas.</p>`, codigo: `SELECT nome, cidade
FROM clientes
WHERE cidade IN ('Santos', 'Campinas') AND nome LIKE '%a%';` },
              { titulo: 'O vazio: NULL', texto: `<p><code>NULL</code> significa "não informado". Ele não é zero nem texto vazio: é a <b>ausência</b> de valor.</p><p>Por isso <code>telefone = NULL</code> <b>não funciona</b> (nada é igual ao desconhecido). Use:</p><ul><li><code>telefone IS NULL</code></li><li><code>telefone IS NOT NULL</code></li></ul>`, codigo: `SELECT nome FROM clientes WHERE telefone IS NULL;` }
            ],
            ex: [
              { tipo: 'quiz', p: "Quais nomes combinam com <code>LIKE '_a%'</code>?", op: ['Os que começam com "a"', 'Os que têm "a" na segunda letra', 'Os que terminam com "a"', 'Os que têm exatamente 2 letras'], c: 1, exp: '_ é exatamente um caractere qualquer; depois vem "a"; depois % (qualquer coisa).' },
              { tipo: 'prever', codigo: `SELECT nome FROM clientes WHERE telefone = NULL;`, op: ['nome\nCaio Rocha\nFê Costa', 'nome\n(nenhuma linha)', 'Erro', 'nome\nAna Souza'], c: 1, exp: 'Comparar com = NULL nunca dá verdadeiro. O certo é IS NULL.' },
              { tipo: 'completar', p: 'Clientes nascidos nos anos 1990.', codigo: `SELECT nome FROM clientes
WHERE nascimento ___ '1990-01-01' ___ '1999-12-31';`, resp: ['BETWEEN', 'AND'], op: ['BETWEEN', 'AND', 'IN', 'OR'], saida: 'nome\nAna Souza\nDuda Alves\nFê Costa\nHugo Prado', exp: 'Datas no formato AAAA-MM-DD podem ser comparadas como texto, e o BETWEEN inclui as duas pontas.' },
              { tipo: 'codigo', p: 'A Bia quer mandar mensagem para os clientes de <b>São Paulo</b> ou <b>Santos</b> que <b>têm telefone</b> cadastrado e cujo <b>sobrenome</b> termina com <b>s</b>. Mostre <code>nome</code> e <code>telefone</code>.', inicio: `SELECT nome, telefone
FROM clientes`, saida: 'nome | telefone\nDuda Alves | 13 99999-4444\nEdu Martins | 11 96666-5555\nGabi Nunes | 13 95555-7777', dicas: ["cidade IN ('São Paulo', 'Santos')", 'telefone IS NOT NULL', "nome LIKE '%s' (termina com s). Junte tudo com AND."], sol: `SELECT nome, telefone
FROM clientes
WHERE cidade IN ('São Paulo', 'Santos')
  AND telefone IS NOT NULL
  AND nome LIKE '%s';` }
            ]
          },
          {
            id: 'sql-05', titulo: 'Ordenando e limitando', icone: '🔢', banco: T_SERVICOS,
            licao: [
              { titulo: 'ORDER BY', texto: `<p>Sem <code>ORDER BY</code>, o banco devolve na ordem que achar melhor (geralmente a de inserção, mas <b>não é garantido</b>). Para ordenar:</p><ul><li><code>ORDER BY preco</code>: do menor para o maior (<code>ASC</code>, o padrão)</li><li><code>ORDER BY preco DESC</code>: do maior para o menor</li><li><code>ORDER BY categoria, preco DESC</code>: primeiro por categoria; empatou, pelo preço</li></ul>`, codigo: `SELECT nome, categoria, preco
FROM servicos
ORDER BY categoria, preco DESC;` },
              { titulo: 'LIMIT e DISTINCT', texto: `<ul><li><code>LIMIT 3</code>: só as 3 primeiras linhas (o famoso "top 3", junto com ORDER BY)</li><li><code>LIMIT 3 OFFSET 3</code>: pula 3 e pega as próximas 3 (é assim que se faz paginação)</li><li><code>SELECT DISTINCT categoria</code>: sem repetidos</li></ul><p>A ordem dos pedaços importa: <code>SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...</code></p>`, codigo: `SELECT DISTINCT categoria FROM servicos;
SELECT nome, preco FROM servicos ORDER BY preco DESC LIMIT 2;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT nome FROM servicos ORDER BY preco LIMIT 2;`, op: ['nome\nManicure\nPedicure', 'nome\nProgressiva\nColoração', 'nome\nCorte feminino\nCorte masculino', 'nome\nPedicure\nManicure'], c: 0, exp: 'ORDER BY preco é do mais barato para o mais caro: Manicure (25) e Pedicure (30).' },
              { tipo: 'quiz', p: 'Qual ordem está correta?', op: ['SELECT ... ORDER BY ... WHERE ...', 'SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...', 'SELECT ... LIMIT ... FROM ...', 'FROM ... SELECT ... WHERE ...'], c: 1, exp: 'SELECT, FROM, WHERE, ORDER BY, LIMIT: sempre nessa ordem.' },
              { tipo: 'montar', p: 'Monte a consulta dos 3 serviços mais demorados.', linhas: ['SELECT nome, duracao_min', 'FROM servicos', 'ORDER BY duracao_min DESC', 'LIMIT 3;'], extras: ['ORDER BY duracao_min ASC'], saida: 'nome | duracao_min\nProgressiva | 150\nColoração | 90\nCorte feminino | 45', exp: 'DESC coloca os maiores primeiro, e o LIMIT pega só 3.' },
              { tipo: 'codigo', p: 'Mostre o <code>nome</code> e o <code>preco</code> do <b>segundo e do terceiro</b> serviços mais baratos (pule o primeiro), usando <code>LIMIT</code> e <code>OFFSET</code>.', inicio: `SELECT nome, preco
FROM servicos`, saida: 'nome | preco\nPedicure | 30\nEscova | 35', dicas: ['Ordene do mais barato para o mais caro: ORDER BY preco', 'LIMIT 2 pega duas linhas; OFFSET 1 pula a primeira.', 'ORDER BY preco LIMIT 2 OFFSET 1;'], sol: `SELECT nome, preco
FROM servicos
ORDER BY preco
LIMIT 2 OFFSET 1;` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'Resumindo dados', desc: 'Contar, somar e tirar médias: os relatórios que todo negócio pede.',
        fases: [
          {
            id: 'sql-06', titulo: 'Contar, somar e média', icone: '➕', banco: T_SERVICOS,
            licao: [
              { titulo: 'Funções de agregação', texto: `<p>Elas pegam <b>muitas linhas</b> e devolvem <b>um número</b>:</p><ul><li><code>COUNT(*)</code>: quantas linhas</li><li><code>SUM(preco)</code>: a soma</li><li><code>AVG(preco)</code>: a média</li><li><code>MIN(preco)</code> e <code>MAX(preco)</code>: o menor e o maior</li></ul><p>Combinam com WHERE: o filtro acontece <b>antes</b> da conta.</p>`, codigo: `SELECT COUNT(*) AS total, SUM(preco) AS soma, MIN(preco) AS menor, MAX(preco) AS maior
FROM servicos;` },
              { titulo: 'Arredondando', texto: `<p>Médias costumam ter muitas casas: use <code>ROUND(valor, 2)</code>.</p><p><code>COUNT(coluna)</code> conta só as linhas em que a coluna <b>não</b> é NULL. <code>COUNT(DISTINCT coluna)</code> conta os valores diferentes.</p>`, codigo: `SELECT ROUND(AVG(preco), 2) AS media, COUNT(DISTINCT categoria) AS categorias
FROM servicos;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT COUNT(*) AS qtd FROM servicos WHERE categoria = 'Cabelo';`, op: ['qtd\n3', 'qtd\n7', 'qtd\n135', 'qtd\nCabelo'], c: 0, exp: 'O WHERE deixa só os 3 serviços de Cabelo e o COUNT conta essas linhas.' },
              { tipo: 'quiz', p: 'Qual função dá o <b>maior</b> preço?', op: ['TOP(preco)', 'MAX(preco)', 'BIG(preco)', 'ORDER(preco)'], c: 1, exp: 'MAX devolve o maior valor; MIN, o menor.' },
              { tipo: 'completar', p: 'Soma e média (com 2 casas) dos preços de Unhas.', codigo: `SELECT ___(preco) AS soma, ROUND(___(preco), 2) AS media
FROM servicos WHERE categoria = 'Unhas';`, resp: ['SUM', 'AVG'], op: ['SUM', 'AVG', 'COUNT', 'MAX'], saida: 'soma | media\n55 | 27.5', exp: '25 + 30 = 55, e a média é 27,5.' },
              { tipo: 'codigo', p: 'Para os serviços de <b>Cabelo</b>, mostre numa linha só: quantos são (<code>qtd</code>), a média de duração arredondada sem casas (<code>duracao_media</code>, use <code>ROUND(..., 0)</code>) e o preço mais caro (<code>mais_caro</code>).', inicio: `SELECT
FROM servicos
WHERE categoria = 'Cabelo';`, saida: 'qtd | duracao_media | mais_caro\n3 | 38 | 60', dicas: ['Três funções separadas por vírgula: COUNT, AVG e MAX.', 'ROUND(AVG(duracao_min), 0) AS duracao_media', 'SELECT COUNT(*) AS qtd, ROUND(AVG(duracao_min), 0) AS duracao_media, MAX(preco) AS mais_caro'], sol: `SELECT COUNT(*) AS qtd, ROUND(AVG(duracao_min), 0) AS duracao_media, MAX(preco) AS mais_caro
FROM servicos
WHERE categoria = 'Cabelo';` }
            ]
          },
          {
            id: 'sql-07', titulo: 'Agrupando com GROUP BY', icone: '🗂️', banco: T_SERVICOS,
            licao: [
              { titulo: 'Uma conta para cada grupo', texto: `<p>E se você quiser a média de preço <b>de cada categoria</b>? O <code>GROUP BY</code> separa as linhas em montinhos e faz a conta em cada um:</p><pre>SELECT categoria, AVG(preco)\nFROM servicos\nGROUP BY categoria;</pre><p>Imagine separar as notas fiscais em pilhas por categoria e somar cada pilha.</p><p>Regra: no SELECT, tudo que não está dentro de uma função (COUNT, SUM...) precisa estar no GROUP BY.</p>`, codigo: `SELECT categoria, COUNT(*) AS qtd, ROUND(AVG(preco), 2) AS preco_medio
FROM servicos
GROUP BY categoria;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT categoria, SUM(duracao_min) AS minutos
FROM servicos
GROUP BY categoria
ORDER BY minutos DESC;`, op: ['categoria | minutos\nQuímica | 240\nCabelo | 115\nUnhas | 85', 'categoria | minutos\nCabelo | 115\nQuímica | 240\nUnhas | 85', 'minutos\n440', 'categoria | minutos\nUnhas | 85\nCabelo | 115\nQuímica | 240'], c: 0, exp: 'Química: 90 + 150 = 240. Cabelo: 45 + 30 + 40 = 115. Unhas: 40 + 45 = 85. DESC coloca o maior primeiro.' },
              { tipo: 'quiz', p: 'O que está errado em <code>SELECT categoria, nome, COUNT(*) FROM servicos GROUP BY categoria</code>?', op: ['Nada', 'nome não está no GROUP BY nem numa função: qual nome mostrar para o grupo?', 'Falta o WHERE', 'COUNT precisa de coluna'], c: 1, exp: 'Cada grupo vira UMA linha. O banco não sabe qual dos vários nomes mostrar (o SQLite até mostra um qualquer, mas outros bancos dão erro).' },
              { tipo: 'codigo', p: 'Mostre, para cada <code>categoria</code>, o serviço mais barato (<code>mais_barato</code>) e o mais caro (<code>mais_caro</code>), em ordem alfabética de categoria.', inicio: `SELECT categoria,
FROM servicos`, saida: 'categoria | mais_barato | mais_caro\nCabelo | 35 | 60\nQuímica | 120 | 180\nUnhas | 25 | 30', dicas: ['MIN(preco) AS mais_barato, MAX(preco) AS mais_caro', 'GROUP BY categoria', 'ORDER BY categoria;'], sol: `SELECT categoria, MIN(preco) AS mais_barato, MAX(preco) AS mais_caro
FROM servicos
GROUP BY categoria
ORDER BY categoria;` }
            ]
          },
          {
            id: 'sql-08', titulo: 'HAVING: filtrando grupos', icone: '🎛️', banco: T_AGENDAMENTOS.replace(/REFERENCES \w+\(id\)/g, ''),
            licao: [
              { titulo: 'WHERE filtra linhas, HAVING filtra grupos', texto: `<p>Quer saber quais clientes vieram <b>mais de uma vez</b>? Precisa contar primeiro e filtrar depois. O <code>WHERE</code> não serve (ele roda antes da contagem). Para isso existe o <code>HAVING</code>:</p><pre>SELECT cliente_id, COUNT(*)\nFROM agendamentos\nGROUP BY cliente_id\nHAVING COUNT(*) > 1;</pre><p>A ordem completa: <code>SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT</code></p>`, codigo: `SELECT cliente_id, COUNT(*) AS visitas
FROM agendamentos
WHERE status = 'concluido'
GROUP BY cliente_id
HAVING COUNT(*) >= 2;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Onde colocar o filtro <code>COUNT(*) > 3</code>?', op: ['No WHERE', 'No HAVING', 'No ORDER BY', 'No SELECT'], c: 1, exp: 'Filtros sobre o resultado de COUNT, SUM, AVG... vão no HAVING.' },
              { tipo: 'prever', codigo: `SELECT profissional_id, COUNT(*) AS qtd
FROM agendamentos
GROUP BY profissional_id
HAVING COUNT(*) > 3;`, op: ['profissional_id | qtd\n1 | 6', 'profissional_id | qtd\n1 | 6\n2 | 3\n3 | 3', 'profissional_id | qtd\n2 | 3\n3 | 3', 'profissional_id | qtd\n(nenhuma linha)'], c: 0, exp: 'A profissional 1 tem 6 agendamentos; as outras têm 3 cada, que não passam no HAVING.' },
              { tipo: 'codigo', p: 'Quais <b>dias</b> (<code>data</code>) tiveram <b>2 ou mais</b> agendamentos? Mostre a <code>data</code> e a quantidade (<code>qtd</code>).', inicio: `SELECT data,
FROM agendamentos`, saida: 'data | qtd\n2026-10-01 | 2', dicas: ['Agrupe por data: GROUP BY data', 'COUNT(*) AS qtd', 'HAVING COUNT(*) >= 2;'], sol: `SELECT data, COUNT(*) AS qtd
FROM agendamentos
GROUP BY data
HAVING COUNT(*) >= 2;` }
            ]
          },
          {
            id: 'sql-09', titulo: 'Textos, datas e CASE', icone: '📅', banco: T_CLIENTES,
            licao: [
              { titulo: 'Funções de texto', texto: `<ul><li><code>UPPER(nome)</code> / <code>LOWER(nome)</code>: maiúsculas / minúsculas</li><li><code>LENGTH(nome)</code>: quantas letras</li><li><code>nome || ' - ' || cidade</code>: junta textos (o <code>||</code> é o "+" dos textos no SQLite e no PostgreSQL)</li><li><code>SUBSTR(texto, inicio, tamanho)</code>: um pedaço</li><li><code>COALESCE(telefone, 'sem telefone')</code>: troca NULL por outro valor</li></ul>`, codigo: `SELECT UPPER(nome) AS nome, cidade || '/SP' AS local, COALESCE(telefone, 'sem telefone') AS fone
FROM clientes
WHERE id <= 3;` },
              { titulo: 'Datas e CASE', texto: `<p>No SQLite as datas são textos no formato <code>AAAA-MM-DD</code>. A função <code>strftime</code> tira pedaços delas: <code>strftime('%Y', nascimento)</code> é o ano, <code>'%m'</code> o mês.</p><p>O <code>CASE</code> é o "if" do SQL:</p><pre>CASE\n  WHEN condição THEN valor\n  ELSE outro\nEND</pre>`, codigo: `SELECT nome,
  strftime('%Y', nascimento) AS ano,
  CASE
    WHEN nascimento < '1990-01-01' THEN 'antes de 1990'
    ELSE '1990 ou depois'
  END AS geracao
FROM clientes
WHERE id <= 4;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT 'Olá, ' || nome || '!' AS msg FROM clientes WHERE id = 4;`, op: ['msg\nOlá, Duda Alves!', "msg\n'Olá, ' || Duda Alves || '!'", 'msg\nOlá, 4!', 'Erro'], c: 0, exp: 'O || cola os textos.' },
              { tipo: 'prever', codigo: `SELECT COUNT(*) AS qtd FROM clientes WHERE strftime('%m', nascimento) = '12';`, op: ['qtd\n1', 'qtd\n0', 'qtd\n12', 'qtd\n2'], c: 0, exp: "Só a Gabi nasceu em dezembro (mês '12')." },
              { tipo: 'completar', p: 'Troque o telefone vazio por um traço.', codigo: `SELECT nome, ___(telefone, '-') AS fone FROM clientes WHERE id = 3;`, resp: ['COALESCE'], op: ['COALESCE', 'IFNULL2', 'NULLIF', 'ISNULL'], saida: 'nome | fone\nCaio Rocha | -', exp: 'COALESCE devolve o primeiro valor que não é NULL.' },
              { tipo: 'codigo', p: 'Para a campanha de aniversário, mostre o <code>nome</code>, o <b>mês</b> de nascimento (<code>mes</code>, com <code>strftime</code>) e uma coluna <code>contato</code>: <code>WhatsApp</code> se tiver telefone, senão <code>Ligar no salão</code>. Ordene pelo mês.', inicio: `SELECT nome,
FROM clientes`, saida: 'nome | mes | contato\nDuda Alves | 01 | WhatsApp\nAna Souza | 03 | WhatsApp\nFê Costa | 05 | Ligar no salão\nHugo Prado | 06 | WhatsApp\nBia Lima | 07 | WhatsApp\nEdu Martins | 09 | WhatsApp\nCaio Rocha | 11 | Ligar no salão\nGabi Nunes | 12 | WhatsApp', dicas: ["strftime('%m', nascimento) AS mes", "CASE WHEN telefone IS NULL THEN 'Ligar no salão' ELSE 'WhatsApp' END AS contato", 'No fim: ORDER BY mes;'], sol: `SELECT nome,
  strftime('%m', nascimento) AS mes,
  CASE WHEN telefone IS NULL THEN 'Ligar no salão' ELSE 'WhatsApp' END AS contato
FROM clientes
ORDER BY mes;` }
            ]
          },
          {
            id: 'sql-10', titulo: 'Chefão: o relatório do mês', icone: '👑', xp: 60, banco: [T_SERVICOS, T_AGENDAMENTOS.replace(/REFERENCES \w+\(id\)/g, '')].join('\n\n'),
            licao: [
              { titulo: 'A dona do salão pediu números', texto: `<p>Todo começo de mês alguém pergunta: "quantos atendimentos tivemos? quantos cancelaram? qual o dia mais movimentado?" Essas respostas saem de consultas como as que você já sabe fazer.</p><p>Dica: escreva a consulta aos poucos. Primeiro o <code>SELECT * FROM</code> com o <code>WHERE</code>; confira; depois acrescente o <code>GROUP BY</code>; e só no fim o <code>ORDER BY</code>.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Faça o resumo de <b>outubro de 2026</b> por <code>status</code>: para cada status, a quantidade de agendamentos (<code>qtd</code>). Só os agendamentos com data de outubro (use <code>LIKE \'2026-10-%\'</code>). Ordene da maior quantidade para a menor.', inicio: `SELECT status,
FROM agendamentos`, saida: 'status | qtd\nconcluido | 9\ncancelado | 1', dicas: ["WHERE data LIKE '2026-10-%'", 'GROUP BY status', 'ORDER BY qtd DESC;'], sol: `SELECT status, COUNT(*) AS qtd
FROM agendamentos
WHERE data LIKE '2026-10-%'
GROUP BY status
ORDER BY qtd DESC;` },
              { tipo: 'codigo', p: 'Agora a pergunta difícil: quais <b>serviços</b> (<code>servico_id</code>) foram feitos (status <code>concluido</code>) <b>mais de uma vez</b>? Mostre <code>servico_id</code> e <code>vezes</code>, do mais feito para o menos. Em caso de empate, pelo <code>servico_id</code>.', inicio: `SELECT servico_id,
FROM agendamentos`, saida: 'servico_id | vezes\n2 | 2\n6 | 2', dicas: ["WHERE status = 'concluido'", 'GROUP BY servico_id HAVING COUNT(*) > 1', 'ORDER BY vezes DESC, servico_id;'], sol: `SELECT servico_id, COUNT(*) AS vezes
FROM agendamentos
WHERE status = 'concluido'
GROUP BY servico_id
HAVING COUNT(*) > 1
ORDER BY vezes DESC, servico_id;` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 3
      {
        titulo: 'Juntando tabelas', desc: 'Chaves, JOIN e subconsultas: o "relacional" do banco relacional.',
        fases: [
          {
            id: 'sql-11', titulo: 'Chaves e relacionamentos', icone: '🔑', banco: JUNTAR,
            licao: [
              { titulo: 'Por que tantas tabelas?', texto: `<p>Na tabela <code>agendamentos</code> não está escrito "Ana Souza" nem "Escova": está <code>cliente_id = 1</code> e <code>servico_id = 3</code>. Por quê?</p><ul><li>Se a Ana trocar de telefone, você muda <b>uma</b> linha em clientes, e não 50 agendamentos</li><li>Não tem como escrever o nome errado ("Ana Sousa") num agendamento</li><li>Ocupa menos espaço</li></ul><p>A <b>chave primária</b> (<i>primary key</i>, o <code>id</code>) identifica cada linha, sem repetir. A <b>chave estrangeira</b> (<i>foreign key</i>, como <code>cliente_id</code>) aponta para a chave primária de outra tabela.</p>`, codigo: `SELECT * FROM agendamentos WHERE id = 9;
SELECT nome FROM clientes WHERE id = 1;
SELECT nome FROM servicos WHERE id = 3;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que é a chave primária?', op: ['A primeira coluna, seja qual for', 'Uma coluna que identifica cada linha, sem repetir', 'A senha do banco', 'Uma coluna que aponta para outra tabela'], c: 1, exp: 'Normalmente é o id. A que aponta para outra tabela é a chave estrangeira.' },
              { tipo: 'quiz', p: 'Em <code>agendamentos</code>, o que é <code>servico_id</code>?', op: ['Chave primária', 'Chave estrangeira que aponta para servicos.id', 'O nome do serviço', 'Um contador'], c: 1, exp: 'Ela guarda o id de uma linha da tabela servicos.' },
              { tipo: 'prever', p: 'Qual o nome do cliente do agendamento 4?', codigo: `SELECT nome FROM clientes
WHERE id = (SELECT cliente_id FROM agendamentos WHERE id = 4);`, op: ['nome\nCaio Rocha', 'nome\nDuda Alves', 'nome\nAna Souza', 'nome\n4'], c: 0, exp: 'O agendamento 4 tem cliente_id 3, que é o Caio Rocha. (Essa consulta dentro de outra é uma subconsulta: você vai ver mais sobre ela.)' }
            ]
          },
          {
            id: 'sql-12', titulo: 'INNER JOIN', icone: '🔗', banco: JUNTAR,
            licao: [
              { titulo: 'Juntando duas tabelas', texto: `<p>O <code>JOIN</code> junta as linhas de duas tabelas que combinam:</p><pre>SELECT clientes.nome, agendamentos.data\nFROM agendamentos\nJOIN clientes ON clientes.id = agendamentos.cliente_id;</pre><p>O <code>ON</code> diz <b>como</b> elas se encaixam: o id do cliente igual ao cliente_id do agendamento. Como duas tabelas podem ter colunas com o mesmo nome (as duas têm <code>nome</code>!), escreva <code>tabela.coluna</code>.</p><p><code>JOIN</code> e <code>INNER JOIN</code> são a mesma coisa: só aparecem as linhas que têm par dos dois lados.</p>`, codigo: `SELECT a.data, c.nome AS cliente, s.nome AS servico
FROM agendamentos a
JOIN clientes c ON c.id = a.cliente_id
JOIN servicos s ON s.id = a.servico_id
WHERE a.id <= 3;` },
              { titulo: 'Apelidos de tabela', texto: `<p>No exemplo, <code>agendamentos a</code> dá o apelido <code>a</code> para a tabela, e assim escrevemos <code>a.data</code> em vez de <code>agendamentos.data</code>. Escolha apelidos curtos e óbvios (a primeira letra).</p><p>Dá para juntar quantas tabelas precisar, um JOIN de cada vez.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para que serve o <code>ON</code> no JOIN?', op: ['Ligar o banco', 'Dizer quais colunas se correspondem entre as tabelas', 'Ordenar', 'Filtrar por data'], c: 1, exp: 'O ON é a regra de encaixe: c.id = a.cliente_id.' },
              { tipo: 'completar', p: 'Junte agendamentos e serviços.', codigo: `SELECT a.data, s.nome
FROM agendamentos a
___ servicos s ___ s.id = a.servico_id
WHERE a.id = 5;`, resp: ['JOIN', 'ON'], op: ['JOIN', 'ON', 'WITH', 'WHERE'], saida: 'data | nome\n2026-10-08 | Escova', exp: 'JOIN tabela ON regra.' },
              { tipo: 'codigo', p: 'Liste os agendamentos com status <code>agendado</code>: a <code>data</code>, o nome do cliente (<code>cliente</code>) e o nome do serviço (<code>servico</code>), em ordem de data.', inicio: `SELECT
FROM agendamentos a`, saida: 'data | cliente | servico\n2026-11-03 | Gabi Nunes | Corte feminino\n2026-11-04 | Bia Lima | Progressiva', dicas: ['JOIN clientes c ON c.id = a.cliente_id', 'JOIN servicos s ON s.id = a.servico_id', "SELECT a.data, c.nome AS cliente, s.nome AS servico ... WHERE a.status = 'agendado' ORDER BY a.data;"], sol: `SELECT a.data, c.nome AS cliente, s.nome AS servico
FROM agendamentos a
JOIN clientes c ON c.id = a.cliente_id
JOIN servicos s ON s.id = a.servico_id
WHERE a.status = 'agendado'
ORDER BY a.data;` }
            ]
          },
          {
            id: 'sql-13', titulo: 'LEFT JOIN', icone: '⬅️', banco: JUNTAR,
            licao: [
              { titulo: 'Quem não tem par também aparece', texto: `<p>No <code>INNER JOIN</code>, um cliente que nunca agendou <b>some</b> do resultado (não tem par). Com <code>LEFT JOIN</code>, <b>todas</b> as linhas da tabela da esquerda (a do FROM) aparecem; quando não há par, as colunas da direita vêm <code>NULL</code>.</p><p>É o jeito de responder perguntas como "quais clientes <b>nunca</b> vieram?": LEFT JOIN + <code>WHERE ... IS NULL</code>.</p>`, codigo: `SELECT c.nome, a.data
FROM clientes c
LEFT JOIN agendamentos a ON a.cliente_id = c.id
WHERE c.id >= 7;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Num <code>clientes LEFT JOIN agendamentos</code>, o que acontece com um cliente sem agendamentos?', op: ['Some do resultado', 'Aparece, com as colunas de agendamentos em NULL', 'Dá erro', 'Aparece duplicado'], c: 1, exp: 'O LEFT JOIN garante todas as linhas da tabela da esquerda.' },
              { tipo: 'prever', codigo: `SELECT COUNT(*) AS qtd
FROM clientes c
JOIN agendamentos a ON a.cliente_id = c.id
WHERE c.id = 8;`, op: ['qtd\n0', 'qtd\n1', 'qtd\nNULL', 'qtd\n8'], c: 0, exp: 'O Hugo (id 8) nunca agendou. No JOIN comum ele some, então a contagem dá 0.' },
              { tipo: 'codigo', p: 'Quais clientes <b>nunca</b> agendaram nada? Mostre só o <code>nome</code>.', inicio: `SELECT c.nome
FROM clientes c`, saida: 'nome\nHugo Prado', dicas: ['LEFT JOIN agendamentos a ON a.cliente_id = c.id', 'Quem não tem par fica com a.id NULL.', 'WHERE a.id IS NULL;'], sol: `SELECT c.nome
FROM clientes c
LEFT JOIN agendamentos a ON a.cliente_id = c.id
WHERE a.id IS NULL;` }
            ]
          },
          {
            id: 'sql-14', titulo: 'JOIN com GROUP BY', icone: '📊',
            licao: [
              { titulo: 'Relatórios de verdade', texto: `<p>Juntar e depois agrupar é o que responde as perguntas de negócio: "quanto cada profissional faturou?", "qual cliente gastou mais?".</p><p>O caminho: <b>JOIN</b> para ter os dados lado a lado → <b>WHERE</b> para filtrar → <b>GROUP BY</b> para separar → <b>SUM/COUNT</b> para calcular.</p>`, codigo: `SELECT p.nome AS profissional, COUNT(*) AS atendimentos, SUM(s.preco) AS faturamento
FROM agendamentos a
JOIN profissionais p ON p.id = a.profissional_id
JOIN servicos s ON s.id = a.servico_id
WHERE a.status = 'concluido'
GROUP BY p.nome
ORDER BY faturamento DESC;` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT s.categoria, COUNT(*) AS qtd
FROM agendamentos a
JOIN servicos s ON s.id = a.servico_id
GROUP BY s.categoria
ORDER BY qtd DESC, s.categoria;`, op: ['categoria | qtd\nCabelo | 6\nQuímica | 3\nUnhas | 3', 'categoria | qtd\nCabelo | 3\nQuímica | 2\nUnhas | 2', 'categoria | qtd\nQuímica | 3\nUnhas | 3\nCabelo | 6', 'qtd\n12'], c: 0, exp: 'Contando os 12 agendamentos pela categoria do serviço: 6 de Cabelo, 3 de Química e 3 de Unhas (o empate fica em ordem alfabética).' },
              { tipo: 'codigo', p: 'Qual cliente mais gastou? Considere só os agendamentos <code>concluido</code>. Mostre o nome do cliente (<code>cliente</code>) e o total (<code>gasto</code>), do maior para o menor, só os <b>3 primeiros</b>.', inicio: `SELECT
FROM agendamentos a`, saida: 'cliente | gasto\nFê Costa | 180\nBia Lima | 145\nAna Souza | 120', dicas: ['JOIN clientes c ON c.id = a.cliente_id e JOIN servicos s ON s.id = a.servico_id', "WHERE a.status = 'concluido' GROUP BY c.nome", 'SELECT c.nome AS cliente, SUM(s.preco) AS gasto ... ORDER BY gasto DESC LIMIT 3;'], sol: `SELECT c.nome AS cliente, SUM(s.preco) AS gasto
FROM agendamentos a
JOIN clientes c ON c.id = a.cliente_id
JOIN servicos s ON s.id = a.servico_id
WHERE a.status = 'concluido'
GROUP BY c.nome
ORDER BY gasto DESC
LIMIT 3;` }
            ]
          },
          {
            id: 'sql-15', titulo: 'Subconsultas', icone: '🪆', banco: T_SERVICOS,
            licao: [
              { titulo: 'Uma consulta dentro da outra', texto: `<p>Quais serviços custam <b>acima da média</b>? Você precisaria saber a média antes. Com uma <b>subconsulta</b>, o banco calcula a média e já usa:</p><pre>SELECT nome, preco FROM servicos\nWHERE preco > (SELECT AVG(preco) FROM servicos);</pre><p>A consulta entre parênteses roda primeiro. Ela também pode devolver uma lista para usar com <code>IN</code>.</p>`, codigo: `SELECT ROUND(AVG(preco), 2) AS media FROM servicos;
SELECT nome, preco FROM servicos
WHERE preco > (SELECT AVG(preco) FROM servicos);` }
            ],
            ex: [
              { tipo: 'prever', codigo: `SELECT nome FROM servicos
WHERE preco = (SELECT MAX(preco) FROM servicos);`, op: ['nome\nProgressiva', 'nome\n180', 'nome\nColoração', 'nome\n(nenhuma linha)'], c: 0, exp: 'A subconsulta acha o maior preço (180), e a consulta de fora mostra o serviço com esse preço.' },
              { tipo: 'codigo', p: 'Mostre o <code>nome</code> e a <code>duracao_min</code> dos serviços que demoram <b>menos que a média</b> de duração, do mais rápido para o mais demorado.', inicio: `SELECT nome, duracao_min
FROM servicos`, saida: 'nome | duracao_min\nCorte masculino | 30\nEscova | 40\nManicure | 40\nCorte feminino | 45\nPedicure | 45', dicas: ['A média: (SELECT AVG(duracao_min) FROM servicos)', 'WHERE duracao_min < (SELECT AVG(duracao_min) FROM servicos)', 'ORDER BY duracao_min; (em empates, o banco mantém a ordem da tabela, mas para garantir use ORDER BY duracao_min, id)'], sol: `SELECT nome, duracao_min
FROM servicos
WHERE duracao_min < (SELECT AVG(duracao_min) FROM servicos)
ORDER BY duracao_min, id;` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 4
      {
        titulo: 'Criando e alterando', desc: 'Criar tabelas, inserir, atualizar e apagar com segurança.',
        fases: [
          {
            id: 'sql-16', titulo: 'CREATE TABLE', icone: '🏗️', banco: '',
            licao: [
              { titulo: 'Desenhando uma tabela', texto: `<p>Para criar uma tabela você diz o nome, as colunas e o <b>tipo</b> de cada uma:</p><ul><li><code>INTEGER</code>: número inteiro</li><li><code>REAL</code>: número com casas decimais</li><li><code>TEXT</code>: texto (datas também, no SQLite)</li></ul><p>E as <b>regras</b> (restrições):</p><ul><li><code>PRIMARY KEY</code>: a chave; no SQLite, <code>INTEGER PRIMARY KEY</code> se numera sozinho</li><li><code>NOT NULL</code>: obrigatório</li><li><code>UNIQUE</code>: não pode repetir (ex: e-mail)</li><li><code>DEFAULT valor</code>: valor padrão</li><li><code>CHECK (preco > 0)</code>: uma regra qualquer</li></ul>`, codigo: `CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE,
  preco REAL NOT NULL CHECK (preco > 0),
  estoque INTEGER DEFAULT 0
);
SELECT name, type, "notnull", pk FROM pragma_table_info('produtos');` },
              { titulo: 'Conferindo a estrutura', texto: `<p>Cada banco tem um jeito de mostrar a estrutura de uma tabela. No SQLite, <code>pragma_table_info('tabela')</code> lista as colunas: nome, tipo, se é obrigatória (<code>notnull</code> = 1) e se é chave (<code>pk</code> = 1). Os testes desta parte usam isso para conferir sua tabela.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual tipo usar para o preço de um produto?', op: ['INTEGER', 'REAL', 'TEXT', 'BOOLEAN'], c: 1, exp: 'Preço tem centavos: REAL (número com casas decimais). Em sistemas financeiros grandes também se guarda em centavos, como INTEGER.' },
              { tipo: 'quiz', p: 'O e-mail do cliente não pode se repetir. Qual regra?', op: ['NOT NULL', 'UNIQUE', 'DEFAULT', 'CHECK'], c: 1, exp: 'UNIQUE impede dois registros com o mesmo valor.' },
              { tipo: 'codigo', p: 'Crie a tabela <code>entregas</code> com:<ul><li><code>id</code>: inteiro, chave primária</li><li><code>endereco</code>: texto, obrigatório</li><li><code>bairro</code>: texto</li><li><code>peso_kg</code>: real</li><li><code>status</code>: texto, obrigatório, com padrão <code>\'pendente\'</code></li></ul>', inicio: `CREATE TABLE entregas (

);`, teste: `SELECT name, type, "notnull", pk FROM pragma_table_info('entregas');
INSERT INTO entregas (endereco) VALUES ('Rua A, 10');
SELECT id, status FROM entregas;`, saida: 'name | type | notnull | pk\nid | INTEGER | 0 | 1\nendereco | TEXT | 1 | 0\nbairro | TEXT | 0 | 0\npeso_kg | REAL | 0 | 0\nstatus | TEXT | 1 | 0\n\nid | status\n1 | pendente', dicas: ['Uma coluna por linha, separadas por vírgula (a última sem vírgula).', 'id INTEGER PRIMARY KEY,\nendereco TEXT NOT NULL,', "status TEXT NOT NULL DEFAULT 'pendente'"], sol: `CREATE TABLE entregas (
  id INTEGER PRIMARY KEY,
  endereco TEXT NOT NULL,
  bairro TEXT,
  peso_kg REAL,
  status TEXT NOT NULL DEFAULT 'pendente'
);` }
            ]
          },
          {
            id: 'sql-17', titulo: 'INSERT', icone: '📥', banco: T_SERVICOS,
            licao: [
              { titulo: 'Colocando linhas', texto: `<pre>INSERT INTO tabela (coluna1, coluna2)\nVALUES (valor1, valor2);</pre><ul><li>Sempre liste as colunas: fica claro e não quebra se a tabela ganhar colunas novas</li><li>As colunas que você não listar ficam com o DEFAULT (ou NULL)</li><li>O <code>id</code> com INTEGER PRIMARY KEY é preenchido sozinho</li><li>Vários de uma vez: <code>VALUES (...), (...), (...);</code></li></ul>`, codigo: `INSERT INTO servicos (nome, categoria, preco, duracao_min)
VALUES ('Hidratação', 'Cabelo', 70, 50);
SELECT * FROM servicos WHERE categoria = 'Cabelo';` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que acontece com <code>INSERT INTO servicos (nome) VALUES (\'Barba\');</code> nesta tabela (preço é NOT NULL)?', op: ['Insere com preço 0', 'Dá erro: NOT NULL constraint failed', 'Insere com preço NULL', 'Insere duas vezes'], c: 1, exp: 'Colunas NOT NULL sem DEFAULT precisam de valor no INSERT.' },
              { tipo: 'completar', p: 'Cadastre a Sobrancelha.', codigo: `___ ___ servicos (nome, categoria, preco, duracao_min)
___ ('Sobrancelha', 'Estética', 20, 15);
SELECT nome, preco FROM servicos WHERE id = 8;`, resp: ['INSERT', 'INTO', 'VALUES'], op: ['INSERT', 'INTO', 'VALUES', 'ADD'], saida: 'nome | preco\nSobrancelha | 20', exp: 'INSERT INTO tabela (colunas) VALUES (valores).' },
              { tipo: 'codigo', p: 'Cadastre de uma vez, num único INSERT, dois serviços na categoria <code>Estética</code>:<ul><li><b>Limpeza de pele</b>, 90 reais, 60 minutos</li><li><b>Design de sobrancelha</b>, 35 reais, 20 minutos</li></ul>', inicio: ``, teste: `SELECT id, nome, categoria, preco, duracao_min FROM servicos WHERE categoria = 'Estética';`, saida: 'id | nome | categoria | preco | duracao_min\n8 | Limpeza de pele | Estética | 90 | 60\n9 | Design de sobrancelha | Estética | 35 | 20', dicas: ['INSERT INTO servicos (nome, categoria, preco, duracao_min) VALUES', "('Limpeza de pele', 'Estética', 90, 60),", "Os dois grupos de valores separados por vírgula, e ; só no final."], sol: `INSERT INTO servicos (nome, categoria, preco, duracao_min) VALUES
  ('Limpeza de pele', 'Estética', 90, 60),
  ('Design de sobrancelha', 'Estética', 35, 20);` }
            ]
          },
          {
            id: 'sql-18', titulo: 'UPDATE e DELETE', icone: '✏️', banco: T_SERVICOS,
            licao: [
              { titulo: 'Mudando com cuidado', texto: `<pre>UPDATE servicos\nSET preco = 45\nWHERE id = 2;</pre><p>O <code>WHERE</code> diz <b>quais</b> linhas mudam. ⚠️ <b>Sem WHERE, TODAS as linhas mudam.</b> Esse é um dos erros mais caros que existem em sistemas de verdade.</p><p>Dá para usar contas: <code>SET preco = preco * 1.1</code> aumenta 10%.</p>`, codigo: `UPDATE servicos SET preco = preco * 1.1 WHERE categoria = 'Unhas';
SELECT nome, preco FROM servicos WHERE categoria = 'Unhas';` },
              { titulo: 'Apagando', texto: `<pre>DELETE FROM servicos WHERE id = 7;</pre><p>Mesma regra: <b>sem WHERE, apaga tudo</b>. Dica de profissional: antes de um UPDATE ou DELETE, rode um <code>SELECT</code> com o mesmo WHERE para ver quais linhas serão atingidas.</p><p>Muitos sistemas nem apagam de verdade: marcam como inativo (<code>UPDATE ... SET ativo = 0</code>), para não perder o histórico.</p>`, codigo: `SELECT * FROM servicos WHERE preco < 30;
DELETE FROM servicos WHERE preco < 30;
SELECT COUNT(*) AS restantes FROM servicos;` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que faz <code>UPDATE servicos SET preco = 0;</code>?', op: ['Nada, falta o WHERE', 'Zera o preço de TODOS os serviços', 'Zera só o primeiro', 'Dá erro'], c: 1, exp: 'Sem WHERE, a mudança vale para todas as linhas. Cuidado!' },
              { tipo: 'prever', codigo: `UPDATE servicos SET duracao_min = duracao_min + 10 WHERE categoria = 'Química';
SELECT SUM(duracao_min) AS total FROM servicos WHERE categoria = 'Química';`, op: ['total\n260', 'total\n240', 'total\n250', 'total\n20'], c: 0, exp: 'Os dois de Química (90 e 150) ganham 10 minutos cada: 100 + 160 = 260.' },
              { tipo: 'codigo', p: 'Duas mudanças:<ol><li>aumente em <b>5 reais</b> o preço de todos os serviços da categoria <code>Cabelo</code></li><li>apague o serviço <code>Pedicure</code> (pelo nome)</li></ol>', inicio: ``, teste: `SELECT nome, preco FROM servicos ORDER BY id;`, saida: 'nome | preco\nCorte feminino | 65\nCorte masculino | 45\nEscova | 40\nColoração | 120\nProgressiva | 180\nManicure | 25', dicas: ["UPDATE servicos SET preco = preco + 5 WHERE categoria = 'Cabelo';", "DELETE FROM servicos WHERE nome = 'Pedicure';", 'Termine cada comando com ;'], sol: `UPDATE servicos SET preco = preco + 5 WHERE categoria = 'Cabelo';
DELETE FROM servicos WHERE nome = 'Pedicure';` }
            ]
          },
          {
            id: 'sql-19', titulo: 'Relacionamentos', icone: '🕸️', banco: '',
            licao: [
              { titulo: 'FOREIGN KEY: o banco cuidando de você', texto: `<p>Declarar a chave estrangeira com <code>REFERENCES</code> faz o banco <b>proteger</b> os dados: ele não deixa criar um pedido para um cliente que não existe.</p><pre>cliente_id INTEGER NOT NULL REFERENCES clientes(id)</pre><p>Tipos de relação:</p><ul><li><b>1 para N</b>: um cliente tem vários pedidos (a chave fica no lado N: pedidos.cliente_id)</li><li><b>N para N</b>: um pedido tem vários produtos e um produto está em vários pedidos. Aí precisa de uma <b>tabela de ligação</b> (pedido_itens) com as duas chaves</li></ul>`, codigo: `CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  data TEXT
);
INSERT INTO clientes (nome) VALUES ('Ana');
INSERT INTO pedidos (cliente_id, data) VALUES (1, '2026-11-01');
SELECT p.id, c.nome, p.data FROM pedidos p JOIN clientes c ON c.id = p.cliente_id;` },
              { titulo: 'Quando o banco diz não', texto: `<p>Tente rodar o exemplo: o pedido aponta para o cliente 99, que não existe. O banco recusa com <code>FOREIGN KEY constraint failed</code>. Isso evita "pedidos órfãos" que quebram relatórios.</p>`, codigo: `CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL REFERENCES clientes(id));
INSERT INTO pedidos (cliente_id) VALUES (99);`, erroEsperado: true }
            ],
            ex: [
              { tipo: 'quiz', p: 'Alunos e cursos: um aluno faz vários cursos e um curso tem vários alunos. Como modelar?', op: ['Uma coluna curso_id em alunos', 'Uma coluna aluno_id em cursos', 'Uma tabela de ligação matriculas (aluno_id, curso_id)', 'Uma tabela só'], c: 2, exp: 'Relação N para N precisa de uma tabela no meio, com as duas chaves estrangeiras.' },
              { tipo: 'quiz', p: 'Num relacionamento 1 para N (um cliente, vários pedidos), onde fica a chave estrangeira?', op: ['Em clientes: pedido_id', 'Em pedidos: cliente_id', 'Nas duas', 'Em nenhuma'], c: 1, exp: 'Ela fica do lado "muitos": cada pedido diz de qual cliente ele é.' },
              { tipo: 'codigo', p: 'Crie as tabelas de um pedido com vários produtos:<ul><li><code>produtos</code>: <code>id</code> (chave), <code>nome</code> (texto, obrigatório), <code>preco</code> (real)</li><li><code>pedidos</code>: <code>id</code> (chave), <code>data</code> (texto)</li><li><code>pedido_itens</code>: <code>pedido_id</code> e <code>produto_id</code> (inteiros, obrigatórios, cada um com REFERENCES para a sua tabela) e <code>quantidade</code> (inteiro, padrão 1)</li></ul>', inicio: ``, teste: `INSERT INTO produtos (nome, preco) VALUES ('Shampoo', 30), ('Máscara', 45);
INSERT INTO pedidos (data) VALUES ('2026-11-01');
INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES (1, 1, 2);
INSERT INTO pedido_itens (pedido_id, produto_id) VALUES (1, 2);
SELECT pr.nome, i.quantidade, pr.preco * i.quantidade AS subtotal
FROM pedido_itens i JOIN produtos pr ON pr.id = i.produto_id;
SELECT "table", "from", "to" FROM pragma_foreign_key_list('pedido_itens') ORDER BY "from";`, saida: 'nome | quantidade | subtotal\nShampoo | 2 | 60\nMáscara | 1 | 45\n\ntable | from | to\npedidos | pedido_id | id\nprodutos | produto_id | id', dicas: ['Crie primeiro produtos e pedidos (as tabelas "pai").', 'pedido_id INTEGER NOT NULL REFERENCES pedidos(id),', 'produto_id INTEGER NOT NULL REFERENCES produtos(id),\nquantidade INTEGER DEFAULT 1'], sol: `CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  preco REAL
);
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  data TEXT
);
CREATE TABLE pedido_itens (
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  quantidade INTEGER DEFAULT 1
);` }
            ]
          },
          {
            id: 'sql-20', titulo: 'Chefão: o sistema de entregas', icone: '👑', xp: 80, banco: '',
            licao: [
              { titulo: 'Modelando do zero', texto: `<p>Um entregador recebe dezenas de pacotes por dia, em vários bairros. Vamos criar o banco de um sistema de rotas: <b>entregadores</b>, <b>entregas</b> e as consultas que respondem "quanto falta?" e "quem entregou mais?".</p><p>Esse é o trabalho de um desenvolvedor back-end: desenhar as tabelas, criar, popular e consultar. Leia o enunciado com calma e faça em partes.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Parte 1 — crie e preencha:<ol><li><code>entregadores</code>: <code>id</code> (chave) e <code>nome</code> (texto, obrigatório)</li><li><code>entregas</code>: <code>id</code> (chave), <code>entregador_id</code> (inteiro, REFERENCES entregadores), <code>bairro</code> (texto, obrigatório), <code>status</code> (texto, padrão <code>\'pendente\'</code>)</li><li>insira os entregadores <b>Michael</b> e <b>Rafa</b> (nessa ordem)</li><li>insira 4 entregas do Michael (id 1): bairros <b>Centro</b>, <b>Centro</b>, <b>Jardim</b> e <b>Vila Nova</b>; e 2 da Rafa (id 2): <b>Jardim</b> e <b>Centro</b></li><li>marque como <code>entregue</code> as entregas do Michael no <b>Centro</b> (um UPDATE só)</li></ol>', inicio: ``, teste: `SELECT e.id, d.nome, e.bairro, e.status FROM entregas e JOIN entregadores d ON d.id = e.entregador_id ORDER BY e.id;`, saida: 'id | nome | bairro | status\n1 | Michael | Centro | entregue\n2 | Michael | Centro | entregue\n3 | Michael | Jardim | pendente\n4 | Michael | Vila Nova | pendente\n5 | Rafa | Jardim | pendente\n6 | Rafa | Centro | pendente', dicas: ["CREATE TABLE entregas (id INTEGER PRIMARY KEY, entregador_id INTEGER REFERENCES entregadores(id), bairro TEXT NOT NULL, status TEXT DEFAULT 'pendente');", "INSERT INTO entregas (entregador_id, bairro) VALUES (1, 'Centro'), (1, 'Centro'), (1, 'Jardim'), (1, 'Vila Nova'), (2, 'Jardim'), (2, 'Centro');", "UPDATE entregas SET status = 'entregue' WHERE entregador_id = 1 AND bairro = 'Centro';"], sol: `CREATE TABLE entregadores (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);
CREATE TABLE entregas (
  id INTEGER PRIMARY KEY,
  entregador_id INTEGER REFERENCES entregadores(id),
  bairro TEXT NOT NULL,
  status TEXT DEFAULT 'pendente'
);
INSERT INTO entregadores (nome) VALUES ('Michael'), ('Rafa');
INSERT INTO entregas (entregador_id, bairro) VALUES
  (1, 'Centro'), (1, 'Centro'), (1, 'Jardim'), (1, 'Vila Nova'),
  (2, 'Jardim'), (2, 'Centro');
UPDATE entregas SET status = 'entregue'
WHERE entregador_id = 1 AND bairro = 'Centro';` },
              { tipo: 'codigo', p: 'Parte 2 — com o banco já pronto, faça <b>uma</b> consulta que mostre, para cada entregador, o <code>nome</code>, o total de entregas (<code>total</code>) e quantas ainda estão pendentes (<code>pendentes</code>). Dica: <code>SUM(CASE WHEN ... THEN 1 ELSE 0 END)</code> conta só o que você quiser. Ordene pelo nome.', banco: `CREATE TABLE entregadores (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
CREATE TABLE entregas (id INTEGER PRIMARY KEY, entregador_id INTEGER REFERENCES entregadores(id), bairro TEXT NOT NULL, status TEXT DEFAULT 'pendente');
INSERT INTO entregadores (nome) VALUES ('Michael'), ('Rafa');
INSERT INTO entregas (entregador_id, bairro, status) VALUES
  (1, 'Centro', 'entregue'), (1, 'Centro', 'entregue'), (1, 'Jardim', 'pendente'), (1, 'Vila Nova', 'pendente'),
  (2, 'Jardim', 'pendente'), (2, 'Centro', 'pendente');`, inicio: `SELECT d.nome,
FROM entregadores d`, saida: 'nome | total | pendentes\nMichael | 4 | 2\nRafa | 2 | 2', dicas: ['JOIN entregas e ON e.entregador_id = d.id', "COUNT(*) AS total, SUM(CASE WHEN e.status = 'pendente' THEN 1 ELSE 0 END) AS pendentes", 'GROUP BY d.nome ORDER BY d.nome;'], sol: `SELECT d.nome,
  COUNT(*) AS total,
  SUM(CASE WHEN e.status = 'pendente' THEN 1 ELSE 0 END) AS pendentes
FROM entregadores d
JOIN entregas e ON e.entregador_id = d.id
GROUP BY d.nome
ORDER BY d.nome;` }
            ]
          }
        ]
      }
    ]
  };
})();
