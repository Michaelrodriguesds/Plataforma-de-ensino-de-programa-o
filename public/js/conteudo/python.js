// =============================================================
// Curso de PYTHON — do zero ao avançado (incluindo POO)
//
// Como as fases são montadas (você pode criar as suas!):
//   licao: cartões de leitura (texto + exemplo de código)
//   ex:    exercícios. Tipos:
//     quiz      -> pergunta com alternativas
//     prever    -> mostra um código e você adivinha o que aparece
//     completar -> preencha as lacunas ___ do código
//     montar    -> coloque as linhas na ordem certa
//     codigo    -> escreva o programa; conferimos a saída
// Depois de editar, rode "npm run validar" para testar tudo.
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});
  C.python = {
    id: 'python', nome: 'Python', icone: '🐍', cor: '#5B9BFF', ling: 'python',
    // usadas no certificado de conclusão
    habilidades: ['Variáveis, tipos e operações', 'Decisões (if) e repetições (for, while)', 'Funções e organização do código', 'Listas, dicionários, tuplas e conjuntos', 'Arquivos, JSON e tratamento de erros', 'Orientação a Objetos: classes, herança, polimorfismo e métodos especiais', 'Testes e boas práticas'],
    desc: 'A linguagem mais amigável para começar. Usada em automação, dados, IA e sites.',
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'Primeiros passos', desc: 'Fazer o computador falar, guardar coisas e fazer contas.',
        fases: [
          {
            id: 'py-01', titulo: 'Olá, mundo!', icone: '👋',
            licao: [
              { titulo: 'O computador obedece ordens', texto: `<p>Programar é escrever uma <b>lista de ordens</b> para o computador, como uma receita de bolo. Ele lê de cima para baixo, uma linha por vez, e faz exatamente o que está escrito — nem mais, nem menos.</p><p>A primeira ordem que todo mundo aprende é <code>print()</code>: ela <b>mostra algo na tela</b>.</p>`, codigo: `print("Olá, mundo!")\nprint("Estou aprendendo Python")` },
              { titulo: 'Aspas e comentários', texto: `<p>Texto sempre vai entre <b>aspas</b> (simples <code>'</code> ou duplas <code>"</code>). Sem aspas, o Python acha que é um nome de alguma coisa e dá erro.</p><p>Tudo depois de <code>#</code> é um <b>comentário</b>: um bilhete para humanos. O computador ignora.</p>`, codigo: `# Isto é um comentário\nprint("Bom dia!")  # o Python ignora esta parte\nprint(10)` }
            ],
            ex: [
              { tipo: 'prever', codigo: `print("Oi")\nprint("Tchau")`, op: ['Oi\nTchau', 'Oi Tchau', 'Tchau\nOi'], c: 0, exp: 'Cada print() mostra uma linha, na ordem em que aparece no código.' },
              { tipo: 'quiz', p: 'Qual linha está CORRETA?', op: ['print(Olá)', 'print("Olá")', 'Print("Olá")', 'print "Olá"'], c: 1, exp: 'Texto precisa de aspas, o print é minúsculo (Python diferencia maiúsculas) e precisa de parênteses.' },
              { tipo: 'prever', codigo: `# print("A")\nprint("B")`, op: ['A\nB', 'B', 'A', 'Nada'], c: 1, exp: 'A primeira linha é um comentário (começa com #), então só o B aparece.' },
              { tipo: 'completar', p: 'Complete para mostrar Python é legal', codigo: `___("Python é legal")`, resp: ['print'], op: ['print', 'mostrar', 'echo'], saida: 'Python é legal', exp: 'print é a ordem que mostra na tela.' },
              { tipo: 'codigo', p: 'Escreva um programa que mostre exatamente estas duas linhas:<pre>Olá, mundo!\nMeu primeiro programa</pre>', inicio: `# Escreva seu código abaixo\n`, saida: 'Olá, mundo!\nMeu primeiro programa', dicas: ['Você vai precisar de dois print(), um para cada linha.', 'O texto vai entre aspas: print("Olá, mundo!")', 'Confira a vírgula e o ponto de exclamação: precisa ser idêntico.'], sol: `print("Olá, mundo!")\nprint("Meu primeiro programa")` }
            ]
          },
          {
            id: 'py-02', titulo: 'Variáveis', icone: '📦',
            licao: [
              { titulo: 'Caixas com etiqueta', texto: `<p>Uma <b>variável</b> é como uma <b>caixa com uma etiqueta</b>. Você guarda algo dentro e depois pega de volta usando o nome da etiqueta.</p><p>O sinal <code>=</code> significa <b>"guarde em"</b> (não é "igual" da matemática!).</p>`, codigo: `nome = "Ana"\nidade = 25\nprint(nome)\nprint(idade)` },
              { titulo: 'Trocar o conteúdo da caixa', texto: `<p>Você pode colocar outra coisa na mesma caixa. O valor antigo é jogado fora.</p><p>Regras dos nomes: sem espaços, sem acentos, não começar com número. Use <code>_</code> para juntar palavras: <code>preco_total</code>.</p>`, codigo: `pontos = 10\npontos = 50\nprint(pontos)  # 50` }
            ],
            ex: [
              { tipo: 'prever', codigo: `fruta = "maçã"\nfruta = "uva"\nprint(fruta)`, op: ['maçã', 'uva', 'maçã uva', 'fruta'], c: 1, exp: 'A caixa "fruta" recebeu "uva" por último, então é isso que ela guarda.' },
              { tipo: 'prever', codigo: `cidade = "Rio"\nprint("cidade")\nprint(cidade)`, op: ['cidade\nRio', 'Rio\nRio', 'cidade\ncidade', 'Rio\ncidade'], c: 0, exp: 'Com aspas é o TEXTO "cidade". Sem aspas, é a CAIXA cidade, que guarda "Rio".' },
              { tipo: 'quiz', p: 'Qual é um nome de variável VÁLIDO?', op: ['2nome', 'meu nome', 'meu_nome', 'preço'], c: 2, exp: 'Nomes não podem começar com número, nem ter espaço. Acento até funciona no Python 3, mas evite: use só letras sem acento, números e _.' },
              { tipo: 'montar', p: 'Monte o programa que guarda o nome "Leo" e depois mostra.', linhas: ['nome = "Leo"', 'print(nome)'], extras: ['print("nome")'], saida: 'Leo', exp: 'Primeiro guardamos na caixa, depois mostramos o conteúdo dela.' },
              { tipo: 'codigo', p: 'Crie uma variável <code>cliente</code> com o texto <code>Marta</code> e uma variável <code>servico</code> com <code>Escova</code>. Depois mostre as duas, uma em cada linha.', inicio: `cliente = \nservico = \n`, saida: 'Marta\nEscova', usar: [['cliente\\s*=', 'Crie a variável cliente'], ['print\\(\\s*cliente\\s*\\)', 'Mostre a variável cliente com print(cliente)']], dicas: ['Texto vai entre aspas: cliente = "Marta"', 'Para mostrar a variável, NÃO use aspas: print(cliente)'], sol: `cliente = "Marta"\nservico = "Escova"\nprint(cliente)\nprint(servico)` }
            ]
          },
          {
            id: 'py-03', titulo: 'Tipos de dados', icone: '🔤',
            licao: [
              { titulo: 'Cada coisa tem um tipo', texto: `<p>Assim como numa casa existem caixas de sapato, potes e garrafas, no Python cada valor tem um <b>tipo</b>:</p><ul><li><code>str</code> — texto: <code>"Olá"</code></li><li><code>int</code> — número inteiro: <code>42</code></li><li><code>float</code> — número com vírgula (usa <b>ponto</b>!): <code>3.5</code></li><li><code>bool</code> — verdadeiro ou falso: <code>True</code> / <code>False</code></li></ul>`, codigo: `print(type("Olá"))\nprint(type(42))\nprint(type(3.5))\nprint(type(True))` },
              { titulo: '"5" não é 5', texto: `<p>O texto <code>"5"</code> e o número <code>5</code> são coisas diferentes. Somar textos <b>gruda</b> um no outro; somar números faz a conta.</p><p>Para converter: <code>int("5")</code> vira número, <code>str(5)</code> vira texto, <code>float("2.5")</code> vira número com vírgula.</p>`, codigo: `print("5" + "5")   # 55 (grudou)\nprint(5 + 5)       # 10 (somou)\nprint(int("5") + 1)  # 6` }
            ],
            ex: [
              { tipo: 'prever', codigo: `print("2" + "3")`, op: ['5', '23', 'Erro', '"2""3"'], c: 1, exp: 'São textos, então o + gruda um no outro: "23".' },
              { tipo: 'quiz', p: 'Qual o tipo de 9.99?', op: ['int', 'str', 'float', 'bool'], c: 2, exp: 'Número com casas decimais é float. No Python usamos ponto, não vírgula.' },
              { tipo: 'prever', codigo: `x = "10"\ny = int(x) * 2\nprint(y)`, op: ['1010', '20', '"20"', 'Erro'], c: 1, exp: 'int("10") transforma o texto no número 10, e 10 * 2 = 20.' },
              { tipo: 'completar', p: 'Complete para transformar o texto em número e somar.', codigo: `idade_texto = "30"\nidade = ___(idade_texto)\nprint(idade + 1)`, resp: ['int'], op: ['int', 'str', 'text', 'bool'], saida: '31', exp: 'int() converte texto em número inteiro.' },
              { tipo: 'codigo', p: 'A variável <code>preco</code> está como texto. Converta para <code>float</code>, some <code>5.5</code> e mostre o resultado.', inicio: `preco = "20.0"\n# converta e some 5.5\n`, saida: '25.5', usar: [['float\\(', 'Use float() para converter']], dicas: ['float(preco) transforma "20.0" em 20.0', 'print(float(preco) + 5.5)'], sol: `preco = "20.0"\nprint(float(preco) + 5.5)` }
            ]
          },
          {
            id: 'py-04', titulo: 'A calculadora', icone: '🧮',
            licao: [
              { titulo: 'Operadores matemáticos', texto: `<p>O Python é uma calculadora poderosa:</p><ul><li><code>+</code> soma, <code>-</code> subtração</li><li><code>*</code> multiplicação, <code>/</code> divisão (sempre dá float)</li><li><code>//</code> divisão inteira (joga fora o resto)</li><li><code>%</code> <b>resto</b> da divisão</li><li><code>**</code> potência</li></ul><p>A ordem é a da escola: primeiro <code>**</code>, depois <code>* / // %</code>, depois <code>+ -</code>. Parênteses mandam em tudo.</p>`, codigo: `print(7 / 2)   # 3.5\nprint(7 // 2)  # 3\nprint(7 % 2)   # 1 (resto)\nprint(2 ** 3)  # 8\nprint((2 + 3) * 4)  # 20` },
              { titulo: 'Atualizando valores', texto: `<p>É muito comum pegar o valor de uma caixa, mudar e guardar de volta. Existe um atalho:</p><p><code>saldo += 10</code> é o mesmo que <code>saldo = saldo + 10</code>. Também existem <code>-=</code>, <code>*=</code>, <code>/=</code>.</p><p>Para arredondar dinheiro: <code>round(valor, 2)</code>.</p>`, codigo: `saldo = 100\nsaldo += 50\nsaldo -= 30\nprint(saldo)  # 120\nprint(round(10 / 3, 2))  # 3.33` }
            ],
            ex: [
              { tipo: 'prever', codigo: `print(2 + 3 * 4)`, op: ['20', '14', '24', '9'], c: 1, exp: 'Multiplicação vem antes: 3 * 4 = 12, depois 2 + 12 = 14.' },
              { tipo: 'prever', codigo: `print(17 % 5)`, op: ['3', '3.4', '2', '5'], c: 2, exp: '17 dividido por 5 dá 3 e sobra 2. O % mostra o que sobra.' },
              { tipo: 'quiz', p: 'Como saber se um número n é PAR?', op: ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 1', 'n ** 2 == 0'], c: 1, exp: 'Número par dividido por 2 não deixa resto: n % 2 == 0.' },
              { tipo: 'prever', codigo: `x = 10\nx *= 3\nx -= 5\nprint(x)`, op: ['25', '35', '15', '30'], c: 0, exp: '10 * 3 = 30, menos 5 = 25.' },
              { tipo: 'codigo', p: 'Uma cliente comprou 3 produtos de R$ 12.50. Calcule o total em <code>total</code> e mostre. Depois aplique 10% de desconto e mostre o valor final.<br>Saída esperada:<pre>37.5\n33.75</pre>', inicio: `preco = 12.50\nquantidade = 3\n`, saida: '37.5\n33.75', dicas: ['total = preco * quantidade', '10% de desconto = pagar 90%: total * 0.9', 'Use round(total * 0.9, 2) para evitar números estranhos como 33.750000001'], sol: `preco = 12.50\nquantidade = 3\ntotal = preco * quantidade\nprint(total)\nprint(round(total * 0.9, 2))` }
            ]
          },
          {
            id: 'py-05', titulo: 'Brincando com textos', icone: '✂️',
            licao: [
              { titulo: 'f-strings: texto com buracos', texto: `<p>Para misturar texto e variáveis, coloque um <code>f</code> antes das aspas e as variáveis entre <code>{ }</code>. É como um <b>formulário com espaços em branco</b> que o Python preenche.</p>`, codigo: `nome = "Bia"\nidade = 22\nprint(f"{nome} tem {idade} anos")\nprint(f"Ano que vem: {idade + 1}")\nprint(f"Preço: R$ {9.5:.2f}")  # 2 casas` },
              { titulo: 'Ferramentas do texto', texto: `<p>Textos têm "ferramentas" (métodos) que você chama com um ponto:</p><ul><li><code>.upper()</code> MAIÚSCULAS, <code>.lower()</code> minúsculas</li><li><code>.strip()</code> tira espaços das pontas</li><li><code>.replace("a", "b")</code> troca</li><li><code>len(texto)</code> conta letras</li><li><code>texto[0]</code> pega a primeira letra (a contagem começa no <b>zero</b>!)</li><li><code>texto[-1]</code> pega a última</li></ul>`, codigo: `palavra = "Python"\nprint(palavra.upper())\nprint(len(palavra))\nprint(palavra[0])\nprint(palavra[-1])\nprint(palavra[0:3])  # do 0 até antes do 3` }
            ],
            ex: [
              { tipo: 'prever', codigo: `nome = "ana"\nprint(nome.upper())`, op: ['ana', 'ANA', 'Ana', 'upper'], c: 1, exp: '.upper() deixa tudo maiúsculo.' },
              { tipo: 'prever', codigo: `t = "salão"\nprint(t[1])`, op: ['s', 'a', 'l', 'Erro'], c: 1, exp: 'A contagem começa em 0: s=0, a=1, l=2...' },
              { tipo: 'prever', codigo: `print(len("oi tudo"))`, op: ['6', '7', '2', '5'], c: 1, exp: 'O espaço também conta: o, i, espaço, t, u, d, o = 7.' },
              { tipo: 'completar', p: 'Complete a f-string.', codigo: `produto = "Shampoo"\nprint(___"Produto: {produto}")`, resp: ['f'], op: ['f', 's', '$', '%'], saida: 'Produto: Shampoo', exp: 'O f antes das aspas liga o preenchimento das chaves.' },
              { tipo: 'codigo', p: 'O texto em <code>entrada</code> veio bagunçado. Tire os espaços das pontas, deixe em MAIÚSCULAS e mostre junto com o tamanho, assim:<pre>CORTE E ESCOVA tem 14 letras</pre>', inicio: `entrada = "   corte e escova  "\n`, saida: 'CORTE E ESCOVA tem 14 letras', dicas: ['Limpe primeiro: limpo = entrada.strip()', 'Depois: grande = limpo.upper()', 'print(f"{grande} tem {len(grande)} letras")'], sol: `entrada = "   corte e escova  "\nlimpo = entrada.strip().upper()\nprint(f"{limpo} tem {len(limpo)} letras")` }
            ]
          },
          {
            id: 'py-06', titulo: 'Conversando com o usuário', icone: '💬',
            licao: [
              { titulo: 'input(): perguntar algo', texto: `<p><code>input()</code> faz o programa <b>parar e esperar</b> a pessoa digitar. O que ela digitar vem sempre como <b>texto</b>.</p><p>Aqui no jogo, quando um exercício usa input(), as respostas já vêm prontas (você verá na caixa "Entrada").</p>`, codigo: `nome = input("Qual seu nome? ")\nprint(f"Prazer, {nome}!")`, entrada: 'Carla' },
              { titulo: 'Cuidado: input sempre é texto', texto: `<p>Se você pedir um número, precisa converter com <code>int()</code> ou <code>float()</code>, senão a conta vira "grude" de texto.</p>`, codigo: `idade = int(input("Idade: "))\nprint(f"Em 10 anos: {idade + 10}")`, entrada: '20' }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que input() devolve quando a pessoa digita 42?', op: ['O número 42', 'O texto "42"', 'True', 'Nada'], c: 1, exp: 'input() SEMPRE devolve texto. Use int() para virar número.' },
              { tipo: 'prever', codigo: `n = input()\nprint(n * 2)`, entrada: '5', op: ['10', '55', '5', 'Erro'], c: 1, exp: 'n é o texto "5". Texto vezes 2 repete: "55".', saidaReal: '5\n55' },
              { tipo: 'montar', p: 'Monte o programa que pede um número e mostra o dobro.', linhas: ['n = int(input("Número: "))', 'dobro = n * 2', 'print(dobro)'], extras: ['n = input("Número: ")'], entrada: '7', saida: 'Número: 7\n14', exp: 'Primeiro lê e converte, depois calcula, depois mostra.' },
              { tipo: 'codigo', p: 'Leia o <b>nome</b> e o <b>ano de nascimento</b> da pessoa (nessa ordem, com <code>input()</code>) e mostre quantos anos ela faz em 2026:<pre>Nome: Rafa\nAno: 2000\nRafa faz 26 anos em 2026</pre><small>As linhas "Nome:" e "Ano:" aparecem porque são o texto do input().</small>', inicio: `nome = input("Nome: ")\n`, entrada: 'Rafa\n2000', saida: 'Nome: Rafa\nAno: 2000\nRafa faz 26 anos em 2026', dicas: ['ano = int(input("Ano: "))', 'idade = 2026 - ano', 'print(f"{nome} faz {idade} anos em 2026")'], sol: `nome = input("Nome: ")\nano = int(input("Ano: "))\nprint(f"{nome} faz {2026 - ano} anos em 2026")` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'Decisões e repetições', desc: 'Fazer o programa escolher caminhos e repetir tarefas.',
        fases: [
          {
            id: 'py-07', titulo: 'Se... senão', icone: '🔀',
            licao: [
              { titulo: 'Comparando coisas', texto: `<p>Comparações respondem <code>True</code> ou <code>False</code>:</p><ul><li><code>==</code> igual (dois iguais! um só é "guardar")</li><li><code>!=</code> diferente</li><li><code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></li></ul>`, codigo: `print(5 > 3)\nprint(2 == 3)\nprint("a" != "b")` },
              { titulo: 'if / else: a encruzilhada', texto: `<p>O <code>if</code> é uma <b>encruzilhada</b>: se a condição for verdadeira, vai por um caminho; senão (<code>else</code>), pelo outro.</p><p>⚠️ Repare nos <b>dois pontos</b> <code>:</code> e no <b>recuo</b> (4 espaços). O recuo diz quais linhas pertencem ao if. É obrigatório no Python!</p>`, codigo: `idade = 17\nif idade >= 18:\n    print("Pode dirigir")\nelse:\n    print("Ainda não")\nprint("Fim")  # fora do if: sempre roda` }
            ],
            ex: [
              { tipo: 'prever', codigo: `x = 10\nif x > 5:\n    print("grande")\nelse:\n    print("pequeno")`, op: ['grande', 'pequeno', 'grande\npequeno', 'Nada'], c: 0, exp: '10 > 5 é verdade, então entra no if.' },
              { tipo: 'quiz', p: 'O que está ERRADO aqui?<pre>if nota > 6\n    print("passou")</pre>', op: ['Falta : depois da condição', 'print não pode ficar dentro do if', 'Deveria ser >=', 'Nada'], c: 0, exp: 'Toda linha de if/else/for/while/def termina com dois pontos.' },
              { tipo: 'prever', codigo: `a = 3\nif a == 3:\n    print("A")\nprint("B")`, op: ['A', 'B', 'A\nB', 'Erro'], c: 2, exp: 'O "A" aparece porque a condição é verdadeira, e o "B" está fora do if, então sempre aparece.' },
              { tipo: 'completar', p: 'Complete a comparação de igualdade.', codigo: `senha = "1234"\nif senha ___ "1234":\n    print("Entrou")`, resp: ['=='], op: ['==', '=', '!=', '==='], saida: 'Entrou', exp: '== compara. Um = só serve para guardar valor.' },
              { tipo: 'codigo', p: 'Leia um número inteiro. Se ele for par, mostre <code>par</code>; senão, mostre <code>ímpar</code>.', inicio: `n = int(input())\n`, entrada: '7', saida: '7\nímpar', testes: [{ entrada: '7', saida: '7\nímpar' }, { entrada: '10', saida: '10\npar' }], dicas: ['Lembra do %? Par é quando n % 2 == 0', 'if n % 2 == 0:\n    print("par")', 'Não esqueça o else: e o recuo de 4 espaços'], sol: `n = int(input())\nif n % 2 == 0:\n    print("par")\nelse:\n    print("ímpar")` }
            ]
          },
          {
            id: 'py-08', titulo: 'Vários caminhos', icone: '🚦',
            licao: [
              { titulo: 'elif: senão, se...', texto: `<p>Quando há mais de dois caminhos, use <code>elif</code>. O Python testa de cima para baixo e entra <b>só no primeiro</b> que for verdadeiro.</p>`, codigo: `nota = 7\nif nota >= 9:\n    print("Ótimo")\nelif nota >= 6:\n    print("Bom")\nelse:\n    print("Estude mais")` },
              { titulo: 'and, or, not', texto: `<p>Para juntar condições:</p><ul><li><code>and</code> — as duas precisam ser verdadeiras (como "tenho dinheiro <b>e</b> a loja está aberta")</li><li><code>or</code> — basta uma ser verdadeira</li><li><code>not</code> — inverte</li></ul>`, codigo: `idade = 20\ntem_carteira = True\nif idade >= 18 and tem_carteira:\n    print("Pode dirigir")\nif not tem_carteira:\n    print("Tire a carteira")` }
            ],
            ex: [
              { tipo: 'prever', codigo: `t = 25\nif t > 30:\n    print("quente")\nelif t > 20:\n    print("agradável")\nelif t > 10:\n    print("fresco")\nelse:\n    print("frio")`, op: ['quente', 'agradável', 'agradável\nfresco', 'frio'], c: 1, exp: '25 não é > 30, mas é > 20. Entra no primeiro verdadeiro e PARA.' },
              { tipo: 'prever', codigo: `print(True and False)\nprint(True or False)`, op: ['False\nTrue', 'True\nTrue', 'False\nFalse', 'True\nFalse'], c: 0, exp: 'and precisa das duas verdadeiras; or precisa de só uma.' },
              { tipo: 'quiz', p: 'Qual condição verifica se x está entre 1 e 10 (incluindo)?', op: ['x >= 1 or x <= 10', 'x >= 1 and x <= 10', 'x > 1 and x < 10', 'not x'], c: 1, exp: 'As duas coisas precisam ser verdade ao mesmo tempo: and. No Python também vale 1 <= x <= 10.' },
              { tipo: 'montar', p: 'Monte a classificação de idade (menor de 13: criança; menor de 18: adolescente; resto: adulto).', linhas: ['idade = 15', 'if idade < 13:', '    print("criança")', 'elif idade < 18:', '    print("adolescente")', 'else:', '    print("adulto")'], saida: 'adolescente', exp: 'if, depois elif, por último else. Os prints ficam recuados.' },
              { tipo: 'codigo', p: 'Leia o valor da compra (float). Regras de frete:<ul><li>200 ou mais: <code>Frete grátis</code></li><li>100 ou mais: <code>Frete R$ 10</code></li><li>abaixo de 100: <code>Frete R$ 20</code></li></ul>', inicio: `valor = float(input())\n`, entrada: '150', saida: '150\nFrete R$ 10', testes: [{ entrada: '150', saida: '150\nFrete R$ 10' }, { entrada: '250', saida: '250\nFrete grátis' }, { entrada: '50', saida: '50\nFrete R$ 20' }, { entrada: '200', saida: '200\nFrete grátis' }], dicas: ['Comece pelo maior valor: if valor >= 200:', 'Depois elif valor >= 100:', 'E por fim else:'], sol: `valor = float(input())\nif valor >= 200:\n    print("Frete grátis")\nelif valor >= 100:\n    print("Frete R$ 10")\nelse:\n    print("Frete R$ 20")` }
            ]
          },
          {
            id: 'py-09', titulo: 'Repetindo com while', icone: '🔁',
            licao: [
              { titulo: 'Enquanto for verdade, repita', texto: `<p>O <code>while</code> (enquanto) repete um bloco <b>enquanto</b> a condição for verdadeira. Como "enquanto tiver louça na pia, lave um prato".</p><p>⚠️ Algo dentro do laço precisa mudar, senão ele roda para sempre (<b>laço infinito</b>).</p>`, codigo: `contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador += 1\nprint("Acabou")` },
              { titulo: 'break: sair no meio', texto: `<p><code>break</code> sai do laço na hora. <code>continue</code> pula para a próxima volta.</p>`, codigo: `n = 0\nwhile True:\n    n += 1\n    if n == 2:\n        continue  # pula o 2\n    if n > 4:\n        break     # sai\n    print(n)` }
            ],
            ex: [
              { tipo: 'prever', codigo: `i = 3\nwhile i > 0:\n    print(i)\n    i -= 1`, op: ['3\n2\n1', '3\n2\n1\n0', '1\n2\n3', '3'], c: 0, exp: 'Começa em 3 e diminui. Quando i chega a 0, a condição i > 0 fica falsa e para.' },
              { tipo: 'quiz', p: 'Por que este código nunca termina?<pre>x = 1\nwhile x < 5:\n    print(x)</pre>', op: ['Falta o break', 'x nunca muda, então x < 5 é sempre verdade', 'while não aceita <', 'Falta else'], c: 1, exp: 'Nada altera x dentro do laço. Faltou um x += 1.' },
              { tipo: 'prever', codigo: `total = 0\nn = 1\nwhile n <= 4:\n    total += n\n    n += 1\nprint(total)`, op: ['4', '10', '6', '15'], c: 1, exp: '1 + 2 + 3 + 4 = 10.' },
              { tipo: 'codigo', p: 'Faça uma contagem regressiva de 5 até 1 com <code>while</code> e depois mostre <code>Fogo!</code>', inicio: ``, saida: '5\n4\n3\n2\n1\nFogo!', usar: [['while', 'Use um laço while']], dicas: ['Comece com n = 5', 'while n >= 1: mostre n e diminua: n -= 1', 'O print("Fogo!") fica FORA do laço (sem recuo).'], sol: `n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("Fogo!")` },
              { tipo: 'codigo', p: 'Leia números (um por linha) e vá somando, até a pessoa digitar <code>0</code>. Então mostre <code>Soma: X</code>.', inicio: `soma = 0\n`, entrada: '5\n3\n2\n0', saida: '5\n3\n2\n0\nSoma: 10', testes: [{ entrada: '5\n3\n2\n0', saida: '5\n3\n2\n0\nSoma: 10' }, { entrada: '0', saida: '0\nSoma: 0' }], dicas: ['Use while True: e leia n = int(input()) dentro', 'Se n == 0: break', 'Senão: soma += n. No final, print(f"Soma: {soma}")'], sol: `soma = 0\nwhile True:\n    n = int(input())\n    if n == 0:\n        break\n    soma += n\nprint(f"Soma: {soma}")` }
            ]
          },
          {
            id: 'py-10', titulo: 'O laço for', icone: '🎡',
            licao: [
              { titulo: 'for: para cada um', texto: `<p>O <code>for</code> passa por <b>cada item</b> de uma sequência, como pegar cada roupa de um varal.</p><p><code>range(5)</code> gera 0, 1, 2, 3, 4 (para antes do 5!).<br><code>range(1, 6)</code> gera 1 a 5.<br><code>range(0, 10, 2)</code> pula de 2 em 2.</p>`, codigo: `for i in range(1, 4):\n    print(f"Volta {i}")\n\nfor letra in "oi":\n    print(letra)` },
              { titulo: 'Acumuladores', texto: `<p>Um padrão muito usado: uma caixa que começa vazia (ou zero) e vai <b>juntando</b> coisas a cada volta.</p>`, codigo: `soma = 0\nfor n in range(1, 11):\n    soma += n\nprint(soma)  # 55` }
            ],
            ex: [
              { tipo: 'prever', codigo: `for i in range(3):\n    print(i)`, op: ['1\n2\n3', '0\n1\n2', '0\n1\n2\n3', '3'], c: 1, exp: 'range(3) começa no 0 e para ANTES do 3.' },
              { tipo: 'prever', codigo: `for i in range(10, 0, -3):\n    print(i)`, op: ['10\n7\n4\n1', '10\n7\n4', '10\n9\n8', '1\n4\n7\n10'], c: 0, exp: 'Começa em 10 e vai diminuindo de 3 em 3: 10, 7, 4, 1. O próximo seria -2, que passa do 0.' },
              { tipo: 'completar', p: 'Mostre os números de 1 a 5.', codigo: `for n in ___(1, ___):\n    print(n)`, resp: ['range', '6'], saida: '1\n2\n3\n4\n5', exp: 'range(1, 6): o fim não entra, então use 6.' },
              { tipo: 'codigo', p: 'Mostre a tabuada do 7, de 1 a 10, no formato <code>7 x 1 = 7</code>.', inicio: ``, saida: [1,2,3,4,5,6,7,8,9,10].map(function(i){return '7 x '+i+' = '+(7*i);}).join('\n'), usar: [['for', 'Use um laço for']], dicas: ['for i in range(1, 11):', 'Dentro do laço: print(f"7 x {i} = {7 * i}")'], sol: `for i in range(1, 11):\n    print(f"7 x {i} = {7 * i}")` },
              { tipo: 'codigo', p: 'Leia um número N e mostre a soma de todos os números <b>pares</b> de 1 até N.', inicio: `n = int(input())\n`, entrada: '10', saida: '10\n30', testes: [{ entrada: '10', saida: '10\n30' }, { entrada: '7', saida: '7\n12' }], dicas: ['Crie soma = 0 antes do laço', 'for i in range(1, n + 1): e teste if i % 2 == 0', 'Ou mais esperto: range(2, n + 1, 2) já pula de 2 em 2!'], sol: `n = int(input())\nsoma = 0\nfor i in range(2, n + 1, 2):\n    soma += i\nprint(soma)` }
            ]
          },
          {
            id: 'py-11', titulo: 'Listas', icone: '📋',
            licao: [
              { titulo: 'Uma lista de compras', texto: `<p>Uma <b>lista</b> guarda vários valores em ordem, entre colchetes <code>[ ]</code>. Como uma fila numerada, que começa na posição <b>0</b>.</p>`, codigo: `clientes = ["Ana", "Bia", "Cris"]\nprint(clientes[0])\nprint(len(clientes))\nclientes.append("Duda")  # adiciona no fim\nprint(clientes)` },
              { titulo: 'Mexendo na lista', texto: `<ul><li><code>lista.append(x)</code> adiciona no fim</li><li><code>lista.remove(x)</code> remove pelo valor</li><li><code>lista.pop()</code> tira o último (e devolve)</li><li><code>x in lista</code> verifica se existe</li><li><code>sorted(lista)</code>, <code>sum(lista)</code>, <code>max()</code>, <code>min()</code></li></ul>`, codigo: `notas = [7, 9, 5]\nfor nota in notas:\n    print(nota)\nprint(sum(notas) / len(notas))  # média\nprint(9 in notas)` }
            ],
            ex: [
              { tipo: 'prever', codigo: `cores = ["azul", "verde", "rosa"]\nprint(cores[2])`, op: ['verde', 'rosa', 'azul', 'Erro'], c: 1, exp: 'Posições: 0=azul, 1=verde, 2=rosa.' },
              { tipo: 'prever', codigo: `n = [1, 2]\nn.append(3)\nn.append(4)\nprint(len(n))`, op: ['2', '3', '4', '[1, 2, 3, 4]'], c: 2, exp: 'Começou com 2 itens e ganhou mais 2.' },
              { tipo: 'prever', codigo: `x = [10, 20, 30]\nprint(x[-1])`, op: ['10', '30', '-1', 'Erro'], c: 1, exp: 'Índice negativo conta do fim: -1 é o último.' },
              { tipo: 'completar', p: 'Adicione "Escova" à lista.', codigo: `servicos = ["Corte"]\nservicos.___("Escova")\nprint(servicos)`, resp: ['append'], op: ['append', 'add', 'push', 'insert'], saida: "['Corte', 'Escova']", exp: 'append adiciona no fim da lista.' },
              { tipo: 'codigo', p: 'Dada a lista de valores de atendimentos do dia, mostre:<pre>Total: 245\nMaior: 120\nAtendimentos: 4</pre>', inicio: `valores = [45, 30, 120, 50]\n`, saida: 'Total: 245\nMaior: 120\nAtendimentos: 4', dicas: ['sum(valores) soma tudo', 'max(valores) acha o maior; len(valores) conta', 'print(f"Total: {sum(valores)}")'], sol: `valores = [45, 30, 120, 50]\nprint(f"Total: {sum(valores)}")\nprint(f"Maior: {max(valores)}")\nprint(f"Atendimentos: {len(valores)}")` },
              { tipo: 'codigo', p: 'Crie uma nova lista <code>aprovados</code> só com as notas maiores ou iguais a 6 e mostre ela.', inicio: `notas = [5, 8, 6, 3, 10]\naprovados = []\n`, saida: '[8, 6, 10]', usar: [['for', 'Use um laço for para percorrer as notas']], dicas: ['for nota in notas:', 'if nota >= 6: aprovados.append(nota)', 'No final (sem recuo): print(aprovados)'], sol: `notas = [5, 8, 6, 3, 10]\naprovados = []\nfor nota in notas:\n    if nota >= 6:\n        aprovados.append(nota)\nprint(aprovados)` }
            ]
          },
          {
            id: 'py-12', titulo: 'Dicionários', icone: '📒',
            licao: [
              { titulo: 'Uma agenda de contatos', texto: `<p>Um <b>dicionário</b> guarda pares <b>chave: valor</b>, como uma agenda: você procura pelo nome (chave) e acha o telefone (valor). Usa chaves <code>{ }</code>.</p>`, codigo: `precos = {"corte": 40, "escova": 35}\nprint(precos["corte"])\nprecos["unha"] = 25    # adiciona\nprecos["corte"] = 45   # altera\nprint(precos)` },
              { titulo: 'Percorrendo e buscando', texto: `<ul><li><code>.get(chave, padrao)</code> busca sem dar erro se não existir</li><li><code>chave in dic</code> verifica</li><li><code>for chave, valor in dic.items():</code> percorre tudo</li></ul><p>Bônus: <b>tupla</b> <code>(1, 2)</code> é uma lista que não muda; <b>set</b> <code>{1, 2}</code> é um conjunto sem repetidos.</p>`, codigo: `estoque = {"shampoo": 3, "creme": 0}\nfor item, qtd in estoque.items():\n    print(f"{item}: {qtd}")\nprint(estoque.get("gel", 0))\nprint(set([1, 1, 2, 2, 3]))` }
            ],
            ex: [
              { tipo: 'prever', codigo: `d = {"a": 1, "b": 2}\nd["a"] = 10\nprint(d["a"] + d["b"])`, op: ['3', '12', '11', 'Erro'], c: 1, exp: 'd["a"] foi trocado para 10. 10 + 2 = 12.' },
              { tipo: 'prever', codigo: `idades = {"Ana": 30}\nprint(idades.get("Leo", "não achei"))`, op: ['Erro', 'None', 'não achei', '30'], c: 2, exp: '.get devolve o valor padrão quando a chave não existe.' },
              { tipo: 'quiz', p: 'O que acontece com idades["Leo"] se "Leo" não existir?', op: ['Devolve None', 'Devolve 0', 'Dá erro KeyError', 'Cria a chave'], c: 2, exp: 'Com colchetes dá KeyError. Por isso o .get() é útil.' },
              { tipo: 'codigo', p: 'Conte quantas vezes cada palavra aparece na lista e mostre o dicionário.', inicio: `palavras = ["corte", "escova", "corte", "unha", "corte"]\ncontagem = {}\n`, saida: "{'corte': 3, 'escova': 1, 'unha': 1}", dicas: ['for p in palavras:', 'contagem[p] = contagem.get(p, 0) + 1', 'print(contagem) no final'], sol: `palavras = ["corte", "escova", "corte", "unha", "corte"]\ncontagem = {}\nfor p in palavras:\n    contagem[p] = contagem.get(p, 0) + 1\nprint(contagem)` },
              { tipo: 'codigo', p: 'Mostre cada serviço com o preço formatado e, no final, o mais caro:<pre>corte: R$ 40.00\nescova: R$ 35.00\nprogressiva: R$ 180.00\nMais caro: progressiva</pre>', inicio: `precos = {"corte": 40, "escova": 35, "progressiva": 180}\n`, saida: 'corte: R$ 40.00\nescova: R$ 35.00\nprogressiva: R$ 180.00\nMais caro: progressiva', dicas: ['for nome, valor in precos.items():', 'Formatar com 2 casas: f"{valor:.2f}"', 'Para achar o mais caro: max(precos, key=precos.get)'], sol: `precos = {"corte": 40, "escova": 35, "progressiva": 180}\nfor nome, valor in precos.items():\n    print(f"{nome}: R$ {valor:.2f}")\nprint(f"Mais caro: {max(precos, key=precos.get)}")` }
            ]
          },
          {
            id: 'py-26', titulo: 'Tuplas, conjuntos e fatias', icone: '🍕',
            licao: [
              { titulo: 'Fatiamento: pegando um pedaço', texto: `<p>Com <code>lista[início:fim]</code> você corta um pedaço, como fatias de pizza. O <b>fim não entra</b>. Funciona em listas e em textos.</p><ul><li><code>x[:3]</code> os 3 primeiros</li><li><code>x[-2:]</code> os 2 últimos</li><li><code>x[::2]</code> de 2 em 2</li><li><code>x[::-1]</code> ao contrário</li></ul>`, codigo: `nums = [10, 20, 30, 40, 50]\nprint(nums[1:3])\nprint(nums[:2])\nprint(nums[-2:])\nprint("Python"[::-1])` },
              { titulo: 'Tuplas e conjuntos', texto: `<p>Uma <b>tupla</b> <code>(1, 2)</code> é uma lista <b>lacrada</b>: não muda depois de criada. Ótima para coisas fixas, como coordenadas ou "nome e idade". Dá para "desempacotar": <code>nome, idade = pessoa</code>.</p><p>Um <b>conjunto</b> (<code>set</code>) não tem repetidos nem ordem. Faz contas de conjuntos: <code>|</code> união, <code>&amp;</code> o que tem nos dois, <code>-</code> diferença.</p>`, codigo: `ponto = (3, 7)\nx, y = ponto\nprint(x + y)\n\nsegunda = {"Ana", "Bia", "Caio"}\nterca = {"Bia", "Duda"}\nprint(sorted(segunda & terca))   # vieram nos dois dias\nprint(sorted(segunda | terca))   # vieram em algum dia\nprint(sorted(segunda - terca))   # só na segunda` }
            ],
            ex: [
              { tipo: 'prever', codigo: `letras = ["a", "b", "c", "d", "e"]\nprint(letras[1:4])`, op: ["['b', 'c', 'd']", "['a', 'b', 'c', 'd']", "['b', 'c', 'd', 'e']", "['b', 'd']"], c: 0, exp: 'Começa no índice 1 e para ANTES do 4.' },
              { tipo: 'prever', codigo: `t = (1, 2, 3)\nt[0] = 9\nprint(t)`, op: ['(9, 2, 3)', '(1, 2, 3)', 'Erro', '[9, 2, 3]'], c: 2, erro: true, exp: 'Tupla é lacrada: tentar mudar dá TypeError.' },
              { tipo: 'prever', codigo: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b))`, op: ['[2, 3]', '[1, 2, 3, 4]', '[1]', '[1, 4]'], c: 0, exp: '& é o que está nos dois conjuntos.' },
              { tipo: 'completar', p: 'Pegue os 3 primeiros clientes da fila.', codigo: `fila = ["Ana", "Bia", "Caio", "Duda", "Eli"]\nprimeiros = fila[___]\nprint(primeiros)`, resp: [[':3', '0:3']], saida: "['Ana', 'Bia', 'Caio']", exp: 'fila[:3] pega do começo até antes do índice 3.' },
              { tipo: 'codigo', p: `Dadas as listas de clientes de dois meses, mostre (em ordem alfabética):<pre>Voltaram: ['Ana', 'Bia']\nNovos: ['Duda', 'Eli']\nSumiram: ['Caio']</pre>`, inicio: `setembro = ["Ana", "Bia", "Caio", "Ana"]\noutubro = ["Bia", "Duda", "Ana", "Eli"]\n`, saida: "Voltaram: ['Ana', 'Bia']\nNovos: ['Duda', 'Eli']\nSumiram: ['Caio']", usar: [['set\\(|\\{', 'Use conjuntos (set)']], dicas: ['Transforme em conjuntos: s = set(setembro); o = set(outubro)', 'Voltaram: s & o; Novos: o - s; Sumiram: s - o', 'sorted(...) devolve uma lista em ordem: print(f"Voltaram: {sorted(s & o)}")'], sol: `setembro = ["Ana", "Bia", "Caio", "Ana"]\noutubro = ["Bia", "Duda", "Ana", "Eli"]\ns, o = set(setembro), set(outubro)\nprint(f"Voltaram: {sorted(s & o)}")\nprint(f"Novos: {sorted(o - s)}")\nprint(f"Sumiram: {sorted(s - o)}")` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 3
      {
        titulo: 'Funções e erros', desc: 'Organizar o código em peças reutilizáveis e lidar com problemas.',
        fases: [
          {
            id: 'py-13', titulo: 'Funções', icone: '⚙️',
            licao: [
              { titulo: 'Uma máquina que você mesmo constrói', texto: `<p>Uma <b>função</b> é como um <b>liquidificador</b>: você coloca ingredientes (<b>parâmetros</b>), ela faz o trabalho e devolve um resultado (<b>return</b>).</p><p>Cria com <code>def</code>, usa chamando o nome com parênteses.</p>`, codigo: `def dobro(numero):\n    return numero * 2\n\nprint(dobro(5))\nprint(dobro(21))` },
              { titulo: 'print vs return', texto: `<p><code>print</code> só <b>mostra</b> na tela. <code>return</code> <b>devolve</b> o valor para quem chamou, que pode guardar e usar depois. Funções boas geralmente usam return.</p><p>Depois do <code>return</code>, a função termina.</p>`, codigo: `def soma(a, b):\n    return a + b\n\nresultado = soma(2, 3) + soma(10, 10)\nprint(resultado)  # 25` }
            ],
            ex: [
              { tipo: 'prever', codigo: `def f(x):\n    return x + 1\n\nprint(f(f(1)))`, op: ['2', '3', '1', 'Erro'], c: 1, exp: 'f(1) = 2, depois f(2) = 3. A de dentro roda primeiro.' },
              { tipo: 'prever', codigo: `def oi():\n    print("oi")\n\nprint("a")`, op: ['oi\na', 'a', 'a\noi', 'oi'], c: 1, exp: 'Criar a função não executa ela. Ela só roda quando alguém chama oi().' },
              { tipo: 'completar', p: 'Complete a função que calcula a área de um retângulo.', codigo: `___ area(largura, altura):\n    ___ largura * altura\n\nprint(area(3, 4))`, resp: ['def', 'return'], op: ['def', 'return', 'function', 'print'], saida: '12', exp: 'def cria a função; return devolve o resultado.' },
              { tipo: 'codigo', p: 'Crie a função <code>eh_par(n)</code> que devolve <code>True</code> se n for par e <code>False</code> se for ímpar.', inicio: `def eh_par(n):\n    # seu código aqui\n    pass\n`, teste: `print(eh_par(4))\nprint(eh_par(7))\nprint(eh_par(0))`, saida: 'True\nFalse\nTrue', dicas: ['Use o resto da divisão: n % 2', 'return n % 2 == 0  (a comparação já é True ou False!)'], sol: `def eh_par(n):\n    return n % 2 == 0` },
              { tipo: 'codigo', p: 'Crie <code>media(notas)</code> que recebe uma lista e devolve a média arredondada com 1 casa (<code>round(x, 1)</code>).', inicio: `def media(notas):\n    pass\n`, teste: `print(media([7, 8, 9]))\nprint(media([5, 6]))\nprint(media([10, 3, 4]))`, saida: '8.0\n5.5\n5.7', dicas: ['Média = soma / quantidade', 'return round(sum(notas) / len(notas), 1)'], sol: `def media(notas):\n    return round(sum(notas) / len(notas), 1)` }
            ]
          },
          {
            id: 'py-14', titulo: 'Parâmetros e escopo', icone: '🎛️',
            licao: [
              { titulo: 'Valores padrão e nomes', texto: `<p>Parâmetros podem ter <b>valor padrão</b> (usado se ninguém informar). Você também pode passar argumentos pelo <b>nome</b>, em qualquer ordem.</p><p>Uma função pode devolver vários valores separados por vírgula (vira uma tupla).</p>`, codigo: `def saudar(nome, saudacao="Olá"):\n    return f"{saudacao}, {nome}!"\n\nprint(saudar("Ana"))\nprint(saudar("Leo", saudacao="Oi"))\n\ndef min_max(lista):\n    return min(lista), max(lista)\n\nmenor, maior = min_max([4, 9, 1])\nprint(menor, maior)` },
              { titulo: 'Escopo: o que acontece na função, fica na função', texto: `<p>Variáveis criadas dentro de uma função são <b>locais</b>: só existem lá dentro, como o que acontece dentro de um quarto fechado. Para levar algo para fora, use <code>return</code>.</p>`, codigo: `def calcular():\n    resultado = 42  # variável local\n    return resultado\n\nx = calcular()\nprint(x)\n# print(resultado) daria erro: não existe aqui fora` }
            ],
            ex: [
              { tipo: 'prever', codigo: `def pot(base, exp=2):\n    return base ** exp\n\nprint(pot(3))\nprint(pot(2, 5))`, op: ['9\n32', '6\n10', '9\n10', '3\n32'], c: 0, exp: 'pot(3) usa exp=2: 3² = 9. pot(2, 5): 2⁵ = 32.' },
              { tipo: 'prever', codigo: `x = 1\ndef muda():\n    x = 99\nmuda()\nprint(x)`, op: ['99', '1', 'Erro', 'None'], c: 1, exp: 'O x de dentro da função é outro x (local). O x de fora continua 1.' },
              { tipo: 'prever', codigo: `def f():\n    print("oi")\n\nr = f()\nprint(r)`, op: ['oi\nNone', 'oi\noi', 'None', 'oi'], c: 0, exp: 'A função mostra "oi" mas não tem return, então devolve None.' },
              { tipo: 'codigo', p: 'Crie <code>preco_final(valor, desconto=0)</code> que devolve o valor com o desconto em % aplicado, arredondado com 2 casas.', inicio: `def preco_final(valor, desconto=0):\n    pass\n`, teste: `print(preco_final(100))\nprint(preco_final(100, 15))\nprint(preco_final(desconto=50, valor=30))`, saida: '100\n85.0\n15.0', dicas: ['Desconto de 15% = valor * (1 - 15 / 100)', 'return round(valor * (1 - desconto / 100), 2)', 'Hmm, com desconto 0 a conta dá 100.0, mas o esperado é 100. Teste: if desconto == 0: return valor'], sol: `def preco_final(valor, desconto=0):\n    if desconto == 0:\n        return valor\n    return round(valor * (1 - desconto / 100), 2)` },
              { tipo: 'codigo', p: 'Crie <code>estatisticas(lista)</code> que devolve três valores: menor, maior e soma.', inicio: `def estatisticas(lista):\n    pass\n`, teste: `mn, mx, s = estatisticas([3, 8, 1, 6])\nprint(mn, mx, s)`, saida: '1 8 18', dicas: ['Você pode devolver vários valores com vírgulas', 'return min(lista), max(lista), sum(lista)'], sol: `def estatisticas(lista):\n    return min(lista), max(lista), sum(lista)` }
            ]
          },
          {
            id: 'py-15', titulo: 'Quando dá errado', icone: '🧯',
            licao: [
              { titulo: 'Ler a mensagem de erro', texto: `<p>Erros são normais — programadores veem erros o dia todo! A mensagem diz <b>o tipo</b> e <b>a linha</b>:</p><ul><li><code>SyntaxError</code>: escrita errada (faltou : ou parênteses)</li><li><code>NameError</code>: nome que não existe (erro de digitação?)</li><li><code>TypeError</code>: misturou tipos (texto + número)</li><li><code>ValueError</code>: valor inválido, ex: <code>int("abc")</code></li><li><code>ZeroDivisionError</code>: dividiu por zero</li></ul>` },
              { titulo: 'try / except: a rede de segurança', texto: `<p><code>try</code> tenta fazer algo. Se der erro, em vez de o programa quebrar, ele cai no <code>except</code>, como uma <b>rede de segurança do trapezista</b>.</p>`, codigo: `try:\n    n = int("abc")\n    print("não chega aqui")\nexcept ValueError:\n    print("Isso não é um número!")\nfinally:\n    print("finally sempre roda")` },
              { titulo: 'Gerando seus próprios erros', texto: `<p>Use <code>raise</code> para avisar que algo está errado na sua função.</p>`, codigo: `def sacar(saldo, valor):\n    if valor > saldo:\n        raise ValueError("Saldo insuficiente")\n    return saldo - valor\n\ntry:\n    sacar(50, 100)\nexcept ValueError as e:\n    print(f"Erro: {e}")` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual erro aparece em <code>print(idade)</code> se a variável idade nunca foi criada?', op: ['TypeError', 'NameError', 'ValueError', 'SyntaxError'], c: 1, exp: 'NameError: o nome não existe. Muitas vezes é só erro de digitação.' },
              { tipo: 'prever', codigo: `try:\n    x = 10 / 0\nexcept ZeroDivisionError:\n    print("ops")\nprint("fim")`, op: ['ops\nfim', 'Erro', 'fim', 'ops'], c: 0, exp: 'A divisão por zero foi capturada, mostrou "ops" e o programa continuou.' },
              { tipo: 'quiz', p: 'Que erro dá <code>"Idade: " + 30</code>?', op: ['TypeError', 'NameError', 'ValueError', 'Nenhum'], c: 0, exp: 'Não dá para somar texto com número. Use f"Idade: {30}" ou str(30).' },
              { tipo: 'codigo', p: 'Crie <code>converter(texto)</code> que tenta transformar o texto em int. Se não conseguir, devolve <code>0</code>.', inicio: `def converter(texto):\n    pass\n`, teste: `print(converter("42"))\nprint(converter("abc"))\nprint(converter("7") + converter("x"))`, saida: '42\n0\n7', usar: [['try', 'Use try/except']], dicas: ['try:\n    return int(texto)', 'except ValueError:\n    return 0'], sol: `def converter(texto):\n    try:\n        return int(texto)\n    except ValueError:\n        return 0` },
              { tipo: 'codigo', p: 'Crie <code>dividir(a, b)</code> que devolve a / b. Se b for zero, deve <b>gerar</b> um <code>ValueError("Não dá para dividir por zero")</code>.', inicio: `def dividir(a, b):\n    pass\n`, teste: `print(dividir(10, 4))\ntry:\n    dividir(1, 0)\nexcept ValueError as e:\n    print(e)`, saida: '2.5\nNão dá para dividir por zero', usar: [['raise', 'Use raise para gerar o erro']], dicas: ['if b == 0:', '    raise ValueError("Não dá para dividir por zero")', 'Fora do if: return a / b'], sol: `def dividir(a, b):\n    if b == 0:\n        raise ValueError("Não dá para dividir por zero")\n    return a / b` }
            ]
          },
          {
            id: 'py-16', titulo: 'Atalhos poderosos', icone: '⚡',
            licao: [
              { titulo: 'List comprehension', texto: `<p>Um jeito curto de criar listas a partir de outras. Leia assim: <b>"[faça isso PARA cada item EM lista SE condição]"</b>.</p>`, codigo: `nums = [1, 2, 3, 4, 5]\nquadrados = [n ** 2 for n in nums]\npares = [n for n in nums if n % 2 == 0]\nprint(quadrados)\nprint(pares)` },
              { titulo: 'lambda, sorted e enumerate', texto: `<p><code>lambda</code> cria uma função pequenininha numa linha só. Muito útil para dizer <b>como ordenar</b>.</p><p><code>enumerate</code> dá o número da posição junto com o item.</p>`, codigo: `clientes = [("Ana", 30), ("Bia", 22), ("Caio", 41)]\npor_idade = sorted(clientes, key=lambda c: c[1])\nprint(por_idade)\n\nfor i, (nome, idade) in enumerate(clientes, start=1):\n    print(i, nome)` }
            ],
            ex: [
              { tipo: 'prever', codigo: `print([x * 10 for x in range(4)])`, op: ['[0, 10, 20, 30]', '[10, 20, 30, 40]', '[0, 1, 2, 3]', '40'], c: 0, exp: 'range(4) = 0,1,2,3. Cada um vezes 10.' },
              { tipo: 'prever', codigo: `palavras = ["sol", "lua", "estrela"]\nprint([p for p in palavras if len(p) > 3])`, op: ["['estrela']", "['sol', 'lua']", '[7]', '[]'], c: 0, exp: 'Só "estrela" tem mais de 3 letras.' },
              { tipo: 'prever', codigo: `dobro = lambda x: x * 2\nprint(dobro(8))`, op: ['16', '8', 'lambda', 'Erro'], c: 0, exp: 'A lambda funciona igual a uma função: recebe 8, devolve 16.' },
              { tipo: 'completar', p: 'Crie a lista com o tamanho de cada nome.', codigo: `nomes = ["Ana", "Joana", "Li"]\ntamanhos = [___(n) ___ n in nomes]\nprint(tamanhos)`, resp: ['len', 'for'], op: ['len', 'for', 'in', 'if'], saida: '[3, 5, 2]', exp: '[len(n) for n in nomes]' },
              { tipo: 'codigo', p: 'Use uma <b>list comprehension</b> para criar a lista <code>com_desconto</code> com 10% de desconto em cada preço acima de 50 (ignore os outros), arredondando com 2 casas.', inicio: `precos = [30, 80, 55.5, 20, 100]\n`, saida: '[72.0, 49.95, 90.0]', usar: [['\\[.*for.*in.*\\]', 'Use uma list comprehension: [... for ... in ... if ...]']], dicas: ['Formato: [EXPRESSÃO for p in precos if CONDIÇÃO]', 'EXPRESSÃO: round(p * 0.9, 2)', 'CONDIÇÃO: p > 50'], sol: `precos = [30, 80, 55.5, 20, 100]\ncom_desconto = [round(p * 0.9, 2) for p in precos if p > 50]\nprint(com_desconto)` }
            ]
          },
          {
            id: 'py-27', titulo: 'Módulos e bibliotecas', icone: '📚',
            licao: [
              { titulo: 'import: pegando ferramentas prontas', texto: `<p>O Python vem com uma <b>caixa de ferramentas</b> enorme (a biblioteca padrão). Você pega o que precisa com <code>import</code>:</p><ul><li><code>math</code>: raiz, arredondamentos, pi</li><li><code>random</code>: sorteios</li><li><code>datetime</code>: datas e horas</li></ul><p><code>import math</code> e use <code>math.sqrt(9)</code>, ou <code>from math import sqrt</code> e use só <code>sqrt(9)</code>.</p>`, codigo: `import math\nfrom datetime import date\n\nprint(math.sqrt(81))\nprint(math.ceil(4.1))   # arredonda para cima\nprint(round(math.pi, 2))\n\nnatal = date(2026, 12, 25)\nhoje = date(2026, 10, 21)\nprint((natal - hoje).days, "dias para o Natal")` },
              { titulo: 'random e seus próprios módulos', texto: `<p><code>random.choice(lista)</code> sorteia um item, <code>random.randint(1, 6)</code> sorteia um número. O <code>random.seed(n)</code> faz o sorteio ser sempre igual (útil para testes).</p><p>Todo arquivo <code>.py</code> é um módulo: se você criar <code>precos.py</code> com uma função, outro arquivo pode fazer <code>from precos import calcular</code>. Para bibliotecas de fora, use <code>pip install nome</code>.</p>`, codigo: `import random\nrandom.seed(42)\nprint(random.randint(1, 6))\nprint(random.choice(["corte", "escova", "unha"]))` }
            ],
            ex: [
              { tipo: 'prever', codigo: `import math\nprint(math.floor(7.9), math.ceil(7.1))`, op: ['7 8', '8 8', '7 7', '8 7'], c: 0, exp: 'floor arredonda para baixo; ceil para cima.' },
              { tipo: 'quiz', p: 'Depois de <code>from math import sqrt</code>, como se usa a raiz quadrada?', op: ['math.sqrt(16)', 'sqrt(16)', 'math(16).sqrt', 'import sqrt(16)'], c: 1, exp: 'Com "from ... import", o nome entra direto no seu código.' },
              { tipo: 'completar', p: 'Calcule a idade em dias de quem nasceu em 01/01/2000, contando até 21/10/2026.', codigo: `from datetime import ___\nnasc = date(2000, 1, 1)\nhoje = date(2026, 10, 21)\nprint((hoje - nasc).___)`, resp: ['date', 'days'], op: ['date', 'days', 'time', 'year'], saida: '9790', exp: 'Subtrair datas dá um intervalo; .days diz quantos dias são.' },
              { tipo: 'codigo', p: 'Escreva <code>dias_ate(data_texto)</code> que recebe uma data como <code>"25/12/2026"</code> e devolve quantos dias faltam a partir de <code>HOJE = date(2026, 10, 21)</code>.', inicio: `from datetime import date\nHOJE = date(2026, 10, 21)\n\ndef dias_ate(data_texto):\n    pass\n`, teste: `print(dias_ate("25/12/2026"))\nprint(dias_ate("22/10/2026"))\nprint(dias_ate("01/01/2027"))`, saida: '65\n1\n72', dicas: ['Quebre o texto: dia, mes, ano = data_texto.split("/")', 'Monte a data: alvo = date(int(ano), int(mes), int(dia))', 'return (alvo - HOJE).days'], sol: `from datetime import date\nHOJE = date(2026, 10, 21)\n\ndef dias_ate(data_texto):\n    dia, mes, ano = data_texto.split("/")\n    alvo = date(int(ano), int(mes), int(dia))\n    return (alvo - HOJE).days` }
            ]
          },
          {
            id: 'py-28', titulo: 'Arquivos e JSON', icone: '💾',
            licao: [
              { titulo: 'Escrevendo e lendo arquivos', texto: `<p>Variáveis somem quando o programa termina. Para guardar de verdade, use <b>arquivos</b>. O <code>with open(...)</code> abre e <b>fecha sozinho</b> no final, como uma porta com mola.</p><ul><li><code>"w"</code> escreve (apaga o que tinha)</li><li><code>"a"</code> acrescenta no fim</li><li><code>"r"</code> lê</li></ul><p>Aqui no jogo os arquivos ficam num disco virtual dentro do navegador: nada é gravado no seu aparelho.</p>`, codigo: `with open("clientes.txt", "w", encoding="utf-8") as f:\n    f.write("Ana\\n")\n    f.write("Bia\\n")\n\nwith open("clientes.txt", "a", encoding="utf-8") as f:\n    f.write("Caio\\n")\n\nwith open("clientes.txt", encoding="utf-8") as f:\n    for linha in f:\n        print(linha.strip())` },
              { titulo: 'JSON: guardando estruturas', texto: `<p>Para guardar listas e dicionários, use <b>JSON</b>, o formato de texto que todo sistema entende. <code>json.dump(obj, arquivo)</code> grava; <code>json.load(arquivo)</code> lê. Para trabalhar com texto direto: <code>json.dumps</code> e <code>json.loads</code>.</p>`, codigo: `import json\nagenda = [{"cliente": "Ana", "hora": "14:00"}]\nwith open("agenda.json", "w", encoding="utf-8") as f:\n    json.dump(agenda, f, ensure_ascii=False)\n\nwith open("agenda.json", encoding="utf-8") as f:\n    dados = json.load(f)\nprint(dados[0]["cliente"], dados[0]["hora"])\nprint(json.dumps({"ok": True}))` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual modo de abertura acrescenta texto no fim do arquivo, sem apagar?', op: ['"w"', '"r"', '"a"', '"x"'], c: 2, exp: '"a" de append (acrescentar). "w" apaga tudo antes de escrever.' },
              { tipo: 'prever', codigo: `import json\nprint(json.loads('{"n": 5}')["n"] * 2)`, op: ['10', '55', '"n"', 'Erro'], c: 0, exp: 'loads transforma o texto num dicionário; n vale o número 5.' },
              { tipo: 'codigo', p: 'Grave as vendas no arquivo <code>vendas.txt</code>, uma por linha (só o valor). Depois <b>leia o arquivo</b>, some tudo e mostre <code>Total: 135.0</code>.', inicio: `vendas = [40, 35, 60]\n`, saida: 'Total: 135.0', usar: [['open\\(', 'Use open() para gravar e ler'], ['"r"|open\\("vendas.txt"(,\\s*encoding[^)]*)?\\)', 'Leia o arquivo de volta']], dicas: ['with open("vendas.txt", "w") as f: e dentro f.write(f"{v}\\n") para cada venda', 'with open("vendas.txt") as f: total = sum(float(linha) for linha in f)', 'print(f"Total: {total}")'], sol: `vendas = [40, 35, 60]\nwith open("vendas.txt", "w") as f:\n    for v in vendas:\n        f.write(f"{v}\\n")\n\nwith open("vendas.txt") as f:\n    total = sum(float(linha) for linha in f)\nprint(f"Total: {total}")` },
              { tipo: 'codigo', p: 'Crie <code>salvar(clientes, nome_arquivo)</code> e <code>carregar(nome_arquivo)</code> usando JSON. Se o arquivo não existir, <code>carregar</code> devolve lista vazia.', inicio: `import json\n\ndef salvar(clientes, nome_arquivo):\n    pass\n\ndef carregar(nome_arquivo):\n    pass\n`, teste: `print(carregar("nao_existe.json"))\nsalvar([{"nome": "Ana", "pontos": 120}], "clientes.json")\ndados = carregar("clientes.json")\nprint(dados[0]["nome"], dados[0]["pontos"] + 1)`, saida: '[]\nAna 121', usar: [['json\\.dump', 'Use json.dump'], ['json\\.load', 'Use json.load']], dicas: ['salvar: with open(nome_arquivo, "w") as f: json.dump(clientes, f)', 'carregar: try: with open(nome_arquivo) as f: return json.load(f)', 'except FileNotFoundError: return []'], sol: `import json\n\ndef salvar(clientes, nome_arquivo):\n    with open(nome_arquivo, "w") as f:\n        json.dump(clientes, f)\n\ndef carregar(nome_arquivo):\n    try:\n        with open(nome_arquivo) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return []` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 4 — POO
      {
        titulo: 'Orientação a Objetos', desc: 'Criar seus próprios tipos: classes, objetos, herança e polimorfismo.', poo: true,
        fases: [
          {
            id: 'py-17', titulo: 'Classes e objetos', icone: '🏭',
            licao: [
              { titulo: 'Forma de bolo e bolos', texto: `<p>Uma <b>classe</b> é uma <b>forma de bolo</b>: o molde. Cada <b>objeto</b> é um bolo feito com essa forma. Todos têm o mesmo formato, mas cada um pode ter sabor diferente.</p><p>Os dados de cada objeto são os <b>atributos</b>. O <code>__init__</code> é o "montador": roda automaticamente quando o objeto nasce. O <code>self</code> significa <b>"este objeto aqui"</b>.</p>`, codigo: `class Cliente:\n    def __init__(self, nome, telefone):\n        self.nome = nome\n        self.telefone = telefone\n\nana = Cliente("Ana", "9999-1111")\nbia = Cliente("Bia", "9999-2222")\nprint(ana.nome)\nprint(bia.telefone)` },
              { titulo: 'Métodos: o que o objeto sabe fazer', texto: `<p><b>Métodos</b> são funções que moram dentro da classe. Eles recebem <code>self</code> para mexer nos atributos do próprio objeto.</p>`, codigo: `class Contador:\n    def __init__(self):\n        self.valor = 0\n\n    def somar(self):\n        self.valor += 1\n\nc = Contador()\nc.somar()\nc.somar()\nprint(c.valor)  # 2` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Na analogia da forma de bolo, o que é o OBJETO?', op: ['A forma', 'Cada bolo feito com a forma', 'A receita escrita', 'O forno'], c: 1, exp: 'A classe é a forma (molde); cada objeto é um bolo criado a partir dela.' },
              { tipo: 'prever', codigo: `class Gato:\n    def __init__(self, nome):\n        self.nome = nome\n\ng1 = Gato("Mimi")\ng2 = Gato("Tom")\nprint(g2.nome)`, op: ['Mimi', 'Tom', 'nome', 'Gato'], c: 1, exp: 'Cada objeto tem seus próprios atributos. g2 é o Tom.' },
              { tipo: 'prever', codigo: `class Caixa:\n    def __init__(self):\n        self.itens = 0\n    def guardar(self, n):\n        self.itens += n\n\nc = Caixa()\nc.guardar(3)\nc.guardar(4)\nprint(c.itens)`, op: ['3', '4', '7', '0'], c: 2, exp: 'Começa com 0, guarda 3, depois 4: total 7.' },
              { tipo: 'completar', p: 'Complete o montador da classe.', codigo: `class Produto:\n    def ___(self, nome):\n        ___.nome = nome\n\np = Produto("Gel")\nprint(p.nome)`, resp: ['__init__', 'self'], op: ['__init__', 'self', 'init', 'this'], saida: 'Gel', exp: '__init__ (dois sublinhados de cada lado) e self.' },
              { tipo: 'codigo', p: 'Crie a classe <code>ContaBancaria</code> com:<ul><li>atributos <code>titular</code> e <code>saldo</code> (começa em 0)</li><li>método <code>depositar(valor)</code> que soma ao saldo</li><li>método <code>sacar(valor)</code> que só tira se tiver saldo suficiente; senão mostra <code>Saldo insuficiente</code></li></ul>', inicio: `class ContaBancaria:\n    def __init__(self, titular):\n        pass\n`, teste: `c = ContaBancaria("Michael")\nc.depositar(100)\nc.sacar(30)\nc.sacar(500)\nprint(c.titular, c.saldo)`, saida: 'Saldo insuficiente\nMichael 70', dicas: ['No __init__: self.titular = titular e self.saldo = 0', 'def depositar(self, valor):\n    self.saldo += valor', 'No sacar: if valor > self.saldo: print("Saldo insuficiente") else: self.saldo -= valor'], sol: `class ContaBancaria:\n    def __init__(self, titular):\n        self.titular = titular\n        self.saldo = 0\n\n    def depositar(self, valor):\n        self.saldo += valor\n\n    def sacar(self, valor):\n        if valor > self.saldo:\n            print("Saldo insuficiente")\n        else:\n            self.saldo -= valor` }
            ]
          },
          {
            id: 'py-18', titulo: 'Objetos que se apresentam', icone: '🪪',
            licao: [
              { titulo: '__str__: o crachá do objeto', texto: `<p>Se você der <code>print</code> num objeto, aparece algo feio como <code>&lt;Cliente object at 0x...&gt;</code>. O método especial <code>__str__</code> define o <b>"crachá"</b>: o texto que aparece quando o objeto é mostrado.</p>`, codigo: `class Cliente:\n    def __init__(self, nome, pontos):\n        self.nome = nome\n        self.pontos = pontos\n\n    def __str__(self):\n        return f"{self.nome} ({self.pontos} pts)"\n\nprint(Cliente("Ana", 120))` },
              { titulo: 'Atributos da classe e listas de objetos', texto: `<p>Um atributo escrito direto na classe é <b>compartilhado</b> por todos os objetos (como uma regra da loja). E podemos guardar objetos em listas e percorrer como qualquer outra coisa.</p>`, codigo: `class Servico:\n    taxa = 0.05  # vale para todos\n\n    def __init__(self, nome, preco):\n        self.nome = nome\n        self.preco = preco\n\n    def preco_com_taxa(self):\n        return self.preco * (1 + Servico.taxa)\n\nlista = [Servico("Corte", 40), Servico("Unha", 20)]\nfor s in lista:\n    print(s.nome, s.preco_com_taxa())` }
            ],
            ex: [
              { tipo: 'prever', codigo: `class P:\n    def __init__(self, n):\n        self.n = n\n    def __str__(self):\n        return f"P{self.n}"\n\nprint(P(7))`, op: ['P7', '7', 'P', '<P object>'], c: 0, exp: 'O print usa o __str__, que devolve "P" + 7.' },
              { tipo: 'prever', codigo: `class A:\n    total = 0\n    def __init__(self):\n        A.total += 1\n\nA(); A(); A()\nprint(A.total)`, op: ['0', '1', '3', 'Erro'], c: 2, exp: 'total é da classe (compartilhado). Cada objeto criado soma 1.' },
              { tipo: 'quiz', p: 'O que o método __str__ deve fazer?', op: ['Mostrar com print', 'Devolver (return) um texto', 'Apagar o objeto', 'Criar o objeto'], c: 1, exp: '__str__ deve RETORNAR um texto. Quem mostra é o print.' },
              { tipo: 'codigo', p: 'Crie a classe <code>Agendamento</code> com <code>cliente</code>, <code>servico</code> e <code>hora</code>, e um <code>__str__</code> que devolva assim:<pre>14:00 - Ana (Corte)</pre>', inicio: `class Agendamento:\n    pass\n`, teste: `agenda = [Agendamento("Ana", "Corte", "14:00"), Agendamento("Rui", "Barba", "15:30")]\nfor a in agenda:\n    print(a)`, saida: '14:00 - Ana (Corte)\n15:30 - Rui (Barba)', dicas: ['def __init__(self, cliente, servico, hora): e guarde os três em self', 'def __str__(self):\n    return f"{self.hora} - {self.cliente} ({self.servico})"'], sol: `class Agendamento:\n    def __init__(self, cliente, servico, hora):\n        self.cliente = cliente\n        self.servico = servico\n        self.hora = hora\n\n    def __str__(self):\n        return f"{self.hora} - {self.cliente} ({self.servico})"` }
            ]
          },
          {
            id: 'py-19', titulo: 'Encapsulamento', icone: '🔒',
            licao: [
              { titulo: 'Proteger o que é importante', texto: `<p><b>Encapsular</b> é como o caixa eletrônico: você não mexe direto no dinheiro guardado, usa os botões (métodos) que conferem as regras.</p><p>No Python, um <code>_</code> antes do nome avisa "isto é interno, não mexa". Dois <code>__</code> dificultam ainda mais o acesso de fora.</p>`, codigo: `class Conta:\n    def __init__(self):\n        self.__saldo = 0  # protegido\n\n    def depositar(self, v):\n        if v > 0:\n            self.__saldo += v\n\n    def ver_saldo(self):\n        return self.__saldo\n\nc = Conta()\nc.depositar(50)\nc.depositar(-999)  # ignorado pela regra\nprint(c.ver_saldo())` },
              { titulo: '@property: atributo com porteiro', texto: `<p>Com <code>@property</code> você lê como se fosse atributo, mas por trás passa por um método. O <code>@nome.setter</code> é o <b>porteiro</b> que confere o valor antes de guardar.</p>`, codigo: `class Produto:\n    def __init__(self, preco):\n        self.preco = preco  # já passa pelo setter\n\n    @property\n    def preco(self):\n        return self._preco\n\n    @preco.setter\n    def preco(self, valor):\n        if valor < 0:\n            raise ValueError("Preço negativo!")\n        self._preco = valor\n\np = Produto(10)\np.preco = 25\nprint(p.preco)` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual a principal vantagem do encapsulamento?', op: ['O código fica mais rápido', 'Garantir que os dados só mudem seguindo as regras', 'Não precisar de métodos', 'Usar menos memória'], c: 1, exp: 'Os métodos funcionam como porteiros que impedem valores inválidos.' },
              { tipo: 'prever', codigo: `class T:\n    def __init__(self):\n        self._v = 1\n    @property\n    def v(self):\n        return self._v * 10\n\nprint(T().v)`, op: ['1', '10', 'Erro', 'None'], c: 1, exp: 'v é uma property: ao ler t.v, o método roda e devolve 1 * 10.' },
              { tipo: 'codigo', p: 'Crie a classe <code>Estoque</code> com quantidade protegida (<code>_qtd</code>, começa em 0), uma <b>property</b> <code>qtd</code> só de leitura, e os métodos <code>entrada(n)</code> e <code>saida(n)</code>. A saída não pode deixar o estoque negativo: nesse caso, gere <code>ValueError("Estoque insuficiente")</code>.', inicio: `class Estoque:\n    def __init__(self):\n        self._qtd = 0\n`, teste: `e = Estoque()\ne.entrada(10)\ne.saida(4)\nprint(e.qtd)\ntry:\n    e.saida(100)\nexcept ValueError as erro:\n    print(erro)\nprint(e.qtd)`, saida: '6\nEstoque insuficiente\n6', dicas: ['@property\ndef qtd(self):\n    return self._qtd', 'def saida(self, n):\n    if n > self._qtd:\n        raise ValueError("Estoque insuficiente")', 'Senão: self._qtd -= n'], sol: `class Estoque:\n    def __init__(self):\n        self._qtd = 0\n\n    @property\n    def qtd(self):\n        return self._qtd\n\n    def entrada(self, n):\n        self._qtd += n\n\n    def saida(self, n):\n        if n > self._qtd:\n            raise ValueError("Estoque insuficiente")\n        self._qtd -= n` }
            ]
          },
          {
            id: 'py-20', titulo: 'Herança', icone: '🧬',
            licao: [
              { titulo: 'Filho herda do pai', texto: `<p><b>Herança</b>: uma classe nova aproveita tudo de outra e adiciona ou muda o que quiser. Como um <b>carro elétrico</b>: é um carro (tem rodas, volante), mas com coisas a mais (bateria).</p><p>Escreve-se <code>class Filha(Mae):</code>. O <code>super()</code> chama o método da classe mãe.</p>`, codigo: `class Funcionario:\n    def __init__(self, nome, salario):\n        self.nome = nome\n        self.salario = salario\n\n    def apresentar(self):\n        return f"Sou {self.nome}"\n\nclass Cabeleireiro(Funcionario):\n    def __init__(self, nome, salario, especialidade):\n        super().__init__(nome, salario)\n        self.especialidade = especialidade\n\nc = Cabeleireiro("Duda", 2500, "cachos")\nprint(c.apresentar())     # herdou!\nprint(c.especialidade)` },
              { titulo: 'Sobrescrever (override)', texto: `<p>A classe filha pode <b>reescrever</b> um método da mãe para fazer do seu jeito. E pode até usar o da mãe com <code>super()</code> e acrescentar algo.</p>`, codigo: `class Animal:\n    def som(self):\n        return "..."\n\nclass Cachorro(Animal):\n    def som(self):\n        return "Au au"\n\nprint(Cachorro().som())\nprint(isinstance(Cachorro(), Animal))  # True: cachorro É um animal` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Herança representa qual tipo de relação?', op: ['"tem um" (carro tem motor)', '"é um" (cachorro é um animal)', '"usa um"', '"parece um"'], c: 1, exp: 'Herança = "é um". Se a frase "X é um Y" não faz sentido, provavelmente não é herança.' },
              { tipo: 'prever', codigo: `class A:\n    def f(self):\n        return "A"\nclass B(A):\n    pass\n\nprint(B().f())`, op: ['A', 'B', 'Erro', 'None'], c: 0, exp: 'B não tem f(), então usa o herdado de A.' },
              { tipo: 'prever', codigo: `class A:\n    def f(self):\n        return "A"\nclass B(A):\n    def f(self):\n        return super().f() + "B"\n\nprint(B().f())`, op: ['A', 'B', 'AB', 'BA'], c: 2, exp: 'super().f() devolve "A", e B acrescenta "B".' },
              { tipo: 'codigo', p: 'Crie <code>Veiculo</code> (com <code>modelo</code> e método <code>descricao()</code> que devolve o modelo) e <code>Moto(Veiculo)</code> que recebe também <code>cilindradas</code> e sobrescreve <code>descricao()</code> para devolver <code>"CG 160 (160cc)"</code>.', inicio: `class Veiculo:\n    pass\n\nclass Moto(Veiculo):\n    pass\n`, teste: `v = Veiculo("Fiorino")\nm = Moto("CG 160", 160)\nprint(v.descricao())\nprint(m.descricao())\nprint(isinstance(m, Veiculo))`, saida: 'Fiorino\nCG 160 (160cc)\nTrue', usar: [['super\\(\\)', 'Use super() na classe Moto']], dicas: ['Em Veiculo: __init__(self, modelo) e descricao(self) que retorna self.modelo', 'Em Moto: def __init__(self, modelo, cilindradas): super().__init__(modelo); self.cilindradas = cilindradas', 'def descricao(self): return f"{super().descricao()} ({self.cilindradas}cc)"'], sol: `class Veiculo:\n    def __init__(self, modelo):\n        self.modelo = modelo\n\n    def descricao(self):\n        return self.modelo\n\nclass Moto(Veiculo):\n    def __init__(self, modelo, cilindradas):\n        super().__init__(modelo)\n        self.cilindradas = cilindradas\n\n    def descricao(self):\n        return f"{super().descricao()} ({self.cilindradas}cc)"` }
            ]
          },
          {
            id: 'py-21', titulo: 'Polimorfismo', icone: '🎭',
            licao: [
              { titulo: 'Mesma ordem, respostas diferentes', texto: `<p><b>Polimorfismo</b> = "muitas formas". Você dá a <b>mesma ordem</b> para objetos diferentes e cada um responde do seu jeito. Como o botão "ligar": na TV, liga a tela; no ventilador, gira as pás.</p><p>Isso deixa o código simples: um laço só trata todos.</p>`, codigo: `class Pix:\n    def pagar(self, v):\n        return f"Pix de R$ {v} enviado"\n\nclass Cartao:\n    def pagar(self, v):\n        return f"R$ {v} no cartão"\n\nfor forma in [Pix(), Cartao()]:\n    print(forma.pagar(50))` },
              { titulo: 'Classes abstratas: um contrato', texto: `<p>Uma <b>classe abstrata</b> é um <b>contrato</b>: diz quais métodos as filhas <b>são obrigadas</b> a ter, mas não pode virar objeto sozinha. Usa o módulo <code>abc</code>.</p>`, codigo: `from abc import ABC, abstractmethod\n\nclass Forma(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Quadrado(Forma):\n    def __init__(self, lado):\n        self.lado = lado\n    def area(self):\n        return self.lado ** 2\n\nprint(Quadrado(3).area())\n# Forma() daria erro: é só um contrato` }
            ],
            ex: [
              { tipo: 'prever', codigo: `class A:\n    def falar(self): return "miau"\nclass B:\n    def falar(self): return "piu"\n\nfor x in [B(), A(), B()]:\n    print(x.falar())`, op: ['piu\nmiau\npiu', 'miau\npiu\nmiau', 'piu\npiu\npiu', 'Erro'], c: 0, exp: 'Cada objeto responde com o seu próprio falar(), na ordem da lista.' },
              { tipo: 'quiz', p: 'O que acontece ao tentar criar um objeto de uma classe abstrata com método abstrato?', op: ['Funciona normalmente', 'Dá erro (TypeError)', 'Cria um objeto vazio', 'Vira uma função'], c: 1, exp: 'Classe abstrata é só um contrato; não dá para instanciar.' },
              { tipo: 'codigo', p: 'Crie a classe abstrata <code>Funcionario</code> com <code>nome</code> e o método abstrato <code>salario()</code>. Depois crie:<ul><li><code>Fixo(nome, valor)</code>: salário = valor</li><li><code>Comissionado(nome, vendas)</code>: salário = 1500 + 10% das vendas</li></ul>', inicio: `from abc import ABC, abstractmethod\n\nclass Funcionario(ABC):\n    pass\n`, teste: `equipe = [Fixo("Ana", 3000), Comissionado("Leo", 8000)]\nfor f in equipe:\n    print(f"{f.nome}: {f.salario()}")\ntry:\n    Funcionario("x")\n    print("criou")\nexcept TypeError:\n    print("abstrata!")`, saida: 'Ana: 3000\nLeo: 2300.0\nabstrata!', usar: [['@abstractmethod', 'Use @abstractmethod']], dicas: ['Funcionario(ABC) com __init__(self, nome) e o método salario decorado com @abstractmethod', 'class Fixo(Funcionario): __init__ chama super().__init__(nome) e guarda self.valor', 'Comissionado.salario retorna 1500 + self.vendas * 0.1'], sol: `from abc import ABC, abstractmethod\n\nclass Funcionario(ABC):\n    def __init__(self, nome):\n        self.nome = nome\n\n    @abstractmethod\n    def salario(self):\n        pass\n\nclass Fixo(Funcionario):\n    def __init__(self, nome, valor):\n        super().__init__(nome)\n        self.valor = valor\n\n    def salario(self):\n        return self.valor\n\nclass Comissionado(Funcionario):\n    def __init__(self, nome, vendas):\n        super().__init__(nome)\n        self.vendas = vendas\n\n    def salario(self):\n        return 1500 + self.vendas * 0.1` }
            ]
          },
          {
            id: 'py-29', titulo: 'Métodos especiais', icone: '✨',
            licao: [
              { titulo: 'Ensinando o Python a lidar com seus objetos', texto: `<p>Métodos com dois sublinhados dos dois lados (os "dunder") são <b>ganchos</b>: o Python os chama sozinho em certas situações.</p><ul><li><code>__str__</code>: texto para pessoas (print)</li><li><code>__repr__</code>: texto para programadores (aparece em listas e no console)</li><li><code>__eq__</code>: o que significa <code>a == b</code></li><li><code>__lt__</code>: o que significa <code>a &lt; b</code> (e aí <code>sorted()</code> funciona!)</li><li><code>__len__</code>: o que <code>len(obj)</code> devolve</li></ul>`, codigo: `class Produto:\n    def __init__(self, nome, preco):\n        self.nome = nome\n        self.preco = preco\n    def __repr__(self):\n        return f"Produto({self.nome!r}, {self.preco})"\n    def __eq__(self, outro):\n        return self.nome == outro.nome\n    def __lt__(self, outro):\n        return self.preco < outro.preco\n\nitens = [Produto("Gel", 15), Produto("Shampoo", 25), Produto("Creme", 10)]\nprint(sorted(itens))\nprint(Produto("Gel", 15) == Produto("Gel", 99))` }
            ],
            ex: [
              { tipo: 'prever', codigo: `class Caixa:\n    def __init__(self, itens):\n        self.itens = itens\n    def __len__(self):\n        return len(self.itens)\n\nprint(len(Caixa([1, 2, 3])))`, op: ['3', '1', 'Erro', '[1, 2, 3]'], c: 0, exp: 'len(obj) chama obj.__len__(), que devolve o tamanho da lista.' },
              { tipo: 'quiz', p: 'Sem <code>__eq__</code>, o que <code>Ponto(1, 2) == Ponto(1, 2)</code> compara?', op: ['Os atributos', 'Se são o MESMO objeto na memória (dá False)', 'Sempre True', 'Dá erro'], c: 1, exp: 'Por padrão, == compara a identidade. Para comparar o conteúdo, crie __eq__.' },
              { tipo: 'codigo', p: 'Crie a classe <code>Dinheiro(centavos)</code> com:<ul><li><code>__str__</code> no formato <code>R$ 12,50</code></li><li><code>__add__</code> para somar dois Dinheiro (devolve um novo Dinheiro)</li><li><code>__eq__</code> comparando os centavos</li></ul>', inicio: `class Dinheiro:\n    def __init__(self, centavos):\n        self.centavos = centavos\n`, teste: `a = Dinheiro(1250)\nb = Dinheiro(399)\nprint(a)\nprint(a + b)\nprint(Dinheiro(100) == Dinheiro(100), a == b)`, saida: 'R$ 12,50\nR$ 16,49\nTrue False', dicas: ['__str__: reais = self.centavos // 100; cent = self.centavos % 100', 'return f"R$ {reais},{cent:02d}"  (o :02d coloca zero à esquerda)', '__add__(self, outro): return Dinheiro(self.centavos + outro.centavos)'], sol: `class Dinheiro:\n    def __init__(self, centavos):\n        self.centavos = centavos\n\n    def __str__(self):\n        return f"R$ {self.centavos // 100},{self.centavos % 100:02d}"\n\n    def __add__(self, outro):\n        return Dinheiro(self.centavos + outro.centavos)\n\n    def __eq__(self, outro):\n        return self.centavos == outro.centavos` }
            ]
          },
          {
            id: 'py-30', titulo: 'Composição', icone: '🧩',
            licao: [
              { titulo: '"Tem um" em vez de "é um"', texto: `<p>Herança é "é um" (moto <b>é um</b> veículo). <b>Composição</b> é "tem um": o pedido <b>tem</b> itens, o salão <b>tem</b> funcionários. A classe guarda outros objetos e pede ajuda a eles.</p><p>Na dúvida entre herança e composição, prefira composição: as peças ficam independentes, como um carro em que dá para trocar o motor sem trocar o carro.</p>`, codigo: `class Motor:\n    def ligar(self):\n        return "vrum"\n\nclass Carro:\n    def __init__(self):\n        self.motor = Motor()   # o carro TEM um motor\n    def partir(self):\n        return "Carro: " + self.motor.ligar()\n\nprint(Carro().partir())` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual relação é de composição?', op: ['Gato é um animal', 'Playlist tem músicas', 'Gerente é um funcionário', 'Círculo é uma forma'], c: 1, exp: 'Playlist TEM músicas. As outras são "é um".' },
              { tipo: 'codigo', p: 'Monte o <code>Pedido</code> por composição:<ul><li><code>Item(nome, preco, qtd)</code> com <code>subtotal()</code></li><li><code>Pedido</code> com a lista <code>itens</code>, <code>adicionar(item)</code>, <code>total()</code> e <code>__len__</code> (quantidade de itens)</li></ul>', inicio: `class Item:\n    pass\n\nclass Pedido:\n    pass\n`, teste: `p = Pedido()\np.adicionar(Item("Shampoo", 25, 2))\np.adicionar(Item("Gel", 15, 1))\nprint(len(p), p.total())`, saida: '2 65', dicas: ['Item: __init__(self, nome, preco, qtd) e subtotal(self): return self.preco * self.qtd', 'Pedido: __init__(self): self.itens = []; adicionar: self.itens.append(item)', 'total: return sum(i.subtotal() for i in self.itens); __len__: return len(self.itens)'], sol: `class Item:\n    def __init__(self, nome, preco, qtd):\n        self.nome = nome\n        self.preco = preco\n        self.qtd = qtd\n\n    def subtotal(self):\n        return self.preco * self.qtd\n\nclass Pedido:\n    def __init__(self):\n        self.itens = []\n\n    def adicionar(self, item):\n        self.itens.append(item)\n\n    def total(self):\n        return sum(i.subtotal() for i in self.itens)\n\n    def __len__(self):\n        return len(self.itens)` }
            ]
          },
          {
            id: 'py-31', titulo: 'classmethod e dataclass', icone: '🏷️',
            licao: [
              { titulo: '@staticmethod e @classmethod', texto: `<ul><li><code>@staticmethod</code>: uma função que mora dentro da classe por organização, mas não usa <code>self</code></li><li><code>@classmethod</code>: recebe a própria classe (<code>cls</code>) em vez do objeto. Muito usado como <b>"fábrica"</b>: outro jeito de criar objetos</li></ul>`, codigo: `class Cliente:\n    def __init__(self, nome, telefone):\n        self.nome = nome\n        self.telefone = telefone\n\n    @classmethod\n    def de_texto(cls, texto):          # fábrica\n        nome, tel = texto.split(";")\n        return cls(nome, tel)\n\n    @staticmethod\n    def telefone_valido(tel):\n        return len(tel) >= 8\n\nc = Cliente.de_texto("Ana;99991111")\nprint(c.nome, Cliente.telefone_valido(c.telefone))` },
              { titulo: '@dataclass: classe de dados sem trabalho', texto: `<p>Para classes que só guardam dados, o <code>@dataclass</code> cria sozinho o <code>__init__</code>, o <code>__repr__</code> e o <code>__eq__</code>. Você só lista os campos com seus tipos.</p>`, codigo: `from dataclasses import dataclass\n\n@dataclass\nclass Produto:\n    nome: str\n    preco: float\n    estoque: int = 0      # valor padrão\n\np = Produto("Gel", 19.9)\nprint(p)\nprint(p == Produto("Gel", 19.9))` }
            ],
            ex: [
              { tipo: 'prever', codigo: `from dataclasses import dataclass\n\n@dataclass\nclass Ponto:\n    x: int\n    y: int\n\nprint(Ponto(1, 2))`, op: ['Ponto(x=1, y=2)', '<Ponto object>', '(1, 2)', 'Erro'], c: 0, exp: 'O dataclass cria um __repr__ bonito automaticamente.' },
              { tipo: 'quiz', p: 'O que um método @classmethod recebe como primeiro parâmetro?', op: ['self (o objeto)', 'cls (a própria classe)', 'Nada', 'O módulo'], c: 1, exp: 'Por isso ele consegue criar objetos: return cls(...).' },
              { tipo: 'codigo', p: 'Crie o dataclass <code>Agendamento</code> com <code>cliente</code> (str), <code>servico</code> (str) e <code>preco</code> (float, padrão 0.0). Adicione o classmethod <code>de_texto(texto)</code> que recebe <code>"Ana;Corte;40"</code>.', inicio: `from dataclasses import dataclass\n`, teste: `a = Agendamento.de_texto("Ana;Corte;40")\nprint(a)\nprint(Agendamento("Rui", "Barba"))\nprint(a == Agendamento("Ana", "Corte", 40.0))`, saida: "Agendamento(cliente='Ana', servico='Corte', preco=40.0)\nAgendamento(cliente='Rui', servico='Barba', preco=0.0)\nTrue", usar: [['@dataclass', 'Use @dataclass'], ['@classmethod', 'Use @classmethod']], dicas: ['@dataclass em cima de class Agendamento: com os três campos e seus tipos', '@classmethod\ndef de_texto(cls, texto):', 'c, s, p = texto.split(";"); return cls(c, s, float(p))'], sol: `from dataclasses import dataclass\n\n@dataclass\nclass Agendamento:\n    cliente: str\n    servico: str\n    preco: float = 0.0\n\n    @classmethod\n    def de_texto(cls, texto):\n        c, s, p = texto.split(";")\n        return cls(c, s, float(p))` }
            ]
          },
          {
            id: 'py-32', titulo: 'Exceções personalizadas', icone: '🚨',
            licao: [
              { titulo: 'Seus próprios tipos de erro', texto: `<p>Você pode criar erros com nomes do seu negócio, como <code>SaldoInsuficiente</code> ou <code>HorarioOcupado</code>. É só criar uma classe que herda de <code>Exception</code>. Assim, quem usa seu código consegue tratar cada problema de um jeito.</p>`, codigo: `class HorarioOcupado(Exception):\n    pass\n\nagenda = {"14:00": "Ana"}\n\ndef marcar(hora, cliente):\n    if hora in agenda:\n        raise HorarioOcupado(f"{hora} já é da {agenda[hora]}")\n    agenda[hora] = cliente\n\ntry:\n    marcar("14:00", "Bia")\nexcept HorarioOcupado as e:\n    print("Não deu:", e)` },
              { titulo: 'else e finally', texto: `<p>O <code>try</code> completo tem quatro partes: <code>try</code> (tenta), <code>except</code> (se der erro), <code>else</code> (se <b>não</b> der erro) e <code>finally</code> (sempre, no fim).</p>`, codigo: `def dividir(a, b):\n    try:\n        r = a / b\n    except ZeroDivisionError:\n        print("divisão por zero")\n    else:\n        print("resultado", r)\n    finally:\n        print("fim")\n\ndividir(10, 2)\ndividir(1, 0)` }
            ],
            ex: [
              { tipo: 'prever', codigo: `try:\n    x = int("5")\nexcept ValueError:\n    print("erro")\nelse:\n    print("ok", x)\nfinally:\n    print("fim")`, op: ['ok 5\nfim', 'erro\nfim', 'ok 5', 'fim'], c: 0, exp: 'Não deu erro: roda o else e depois o finally.' },
              { tipo: 'quiz', p: 'De qual classe uma exceção personalizada deve herdar?', op: ['object', 'Exception', 'Error', 'str'], c: 1, exp: 'class MeuErro(Exception): pass' },
              { tipo: 'codigo', p: 'Crie a exceção <code>SaldoInsuficiente</code> e a classe <code>Conta(saldo)</code> com <code>sacar(valor)</code>: se o valor for maior que o saldo, gere <code>SaldoInsuficiente(f"Faltam R$ {falta}")</code>; se o valor for zero ou negativo, gere <code>ValueError("Valor inválido")</code>.', inicio: `class SaldoInsuficiente(Exception):\n    pass\n\nclass Conta:\n    def __init__(self, saldo):\n        self.saldo = saldo\n`, teste: `c = Conta(100)\nfor v in [30, 200, -5]:\n    try:\n        c.sacar(v)\n        print("sacou", v, "sobra", c.saldo)\n    except SaldoInsuficiente as e:\n        print("saldo:", e)\n    except ValueError as e:\n        print("valor:", e)`, saida: 'sacou 30 sobra 70\nsaldo: Faltam R$ 130\nvalor: Valor inválido', usar: [['raise SaldoInsuficiente', 'Use raise SaldoInsuficiente(...)']], dicas: ['def sacar(self, valor): primeiro confira if valor <= 0: raise ValueError("Valor inválido")', 'Depois: if valor > self.saldo: raise SaldoInsuficiente(f"Faltam R$ {valor - self.saldo}")', 'Se passou pelos dois: self.saldo -= valor'], sol: `class SaldoInsuficiente(Exception):\n    pass\n\nclass Conta:\n    def __init__(self, saldo):\n        self.saldo = saldo\n\n    def sacar(self, valor):\n        if valor <= 0:\n            raise ValueError("Valor inválido")\n        if valor > self.saldo:\n            raise SaldoInsuficiente(f"Faltam R$ {valor - self.saldo}")\n        self.saldo -= valor` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 5
      {
        titulo: 'Nível avançado', desc: 'Recursão, algoritmos, geradores, decoradores e o chefão final.',
        fases: [
          {
            id: 'py-22', titulo: 'Recursão', icone: '🪆',
            licao: [
              { titulo: 'A boneca russa', texto: `<p><b>Recursão</b> é uma função que chama <b>ela mesma</b> com um problema menor, como abrir bonecas russas: dentro de cada uma tem uma menor, até chegar na última (o <b>caso base</b>), que não abre mais.</p><p>Sem caso base, a função nunca para (dá <code>RecursionError</code>).</p>`, codigo: `def fatorial(n):\n    if n <= 1:        # caso base\n        return 1\n    return n * fatorial(n - 1)\n\nprint(fatorial(5))  # 5*4*3*2*1 = 120` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que é o "caso base" na recursão?', op: ['A primeira chamada', 'A condição em que a função para de se chamar', 'Um erro', 'O maior valor'], c: 1, exp: 'O caso base é a boneca menor, que não abre mais: ali a recursão para.' },
              { tipo: 'prever', codigo: `def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)\n\nprint(f(4))`, op: ['4', '10', '24', 'Erro'], c: 1, exp: '4 + 3 + 2 + 1 + 0 = 10.' },
              { tipo: 'codigo', p: 'Crie <code>fib(n)</code> que devolve o n-ésimo número de Fibonacci (fib(0)=0, fib(1)=1, e cada um é a soma dos dois anteriores) usando recursão.', inicio: `def fib(n):\n    pass\n`, teste: `print([fib(i) for i in range(10)])`, saida: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]', dicas: ['Caso base: if n < 2: return n', 'Senão: return fib(n - 1) + fib(n - 2)'], sol: `def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)` },
              { tipo: 'codigo', p: 'Crie <code>inverter(texto)</code> que devolve o texto ao contrário <b>usando recursão</b> (sem <code>[::-1]</code>).', inicio: `def inverter(texto):\n    pass\n`, teste: `print(inverter("python"))\nprint(inverter("a"))\nprint(inverter(""))`, saida: 'nohtyp\na\n', usar: [['inverter\\s*\\(.*\\[', 'Chame inverter() dentro dela mesma'], ['^(?![\\s\\S]*\\[::-1\\])', 'Não vale usar [::-1] 😉']], dicas: ['Caso base: texto vazio devolve ""', 'Pegue a última letra + inverter do resto: texto[-1] + inverter(texto[:-1])'], sol: `def inverter(texto):\n    if texto == "":\n        return ""\n    return texto[-1] + inverter(texto[:-1])` }
            ]
          },
          {
            id: 'py-23', titulo: 'Algoritmos clássicos', icone: '🔍',
            licao: [
              { titulo: 'Busca binária: o jogo do "maior ou menor"', texto: `<p>Para achar um número numa lista <b>ordenada</b>, olhe o do meio: se o procurado é maior, descarte a metade de baixo; se menor, a de cima. Como procurar uma palavra no dicionário de papel. Em 1 milhão de itens, acha em ~20 passos!</p>`, codigo: `def busca_binaria(lista, alvo):\n    ini, fim = 0, len(lista) - 1\n    while ini <= fim:\n        meio = (ini + fim) // 2\n        if lista[meio] == alvo:\n            return meio\n        elif lista[meio] < alvo:\n            ini = meio + 1\n        else:\n            fim = meio - 1\n    return -1\n\nprint(busca_binaria([2, 5, 8, 12, 20], 12))` },
              { titulo: 'Ordenação: bubble sort', texto: `<p>Ordenar é organizar. O <b>bubble sort</b> compara vizinhos e troca se estiverem fora de ordem; os maiores "sobem" como bolhas. Não é o mais rápido (o <code>sorted()</code> do Python é muito melhor), mas ensina a pensar.</p>`, codigo: `def bubble(lista):\n    n = len(lista)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if lista[j] > lista[j + 1]:\n                lista[j], lista[j + 1] = lista[j + 1], lista[j]\n    return lista\n\nprint(bubble([5, 2, 9, 1]))` }
            ],
            ex: [
              { tipo: 'quiz', p: 'A busca binária só funciona se a lista estiver...', op: ['Vazia', 'Ordenada', 'Com números pares', 'Sem repetidos'], c: 1, exp: 'Ela depende da ordem para saber qual metade descartar.' },
              { tipo: 'prever', codigo: `a, b = 1, 2\na, b = b, a\nprint(a, b)`, op: ['1 2', '2 1', '2 2', 'Erro'], c: 1, exp: 'Esse é o truque do Python para trocar valores em uma linha.' },
              { tipo: 'codigo', p: 'Crie <code>maior(lista)</code> que encontra o maior número <b>sem usar max()</b>.', inicio: `def maior(lista):\n    pass\n`, teste: `print(maior([3, 9, 2, 7]))\nprint(maior([-5, -1, -9]))`, saida: '9\n-1', usar: [['^(?![\\s\\S]*max\\()', 'Não vale usar max() 😉']], dicas: ['Comece supondo que o primeiro é o maior: m = lista[0]', 'Percorra a lista: se algum for maior que m, troque m'], sol: `def maior(lista):\n    m = lista[0]\n    for x in lista:\n        if x > m:\n            m = x\n    return m` },
              { tipo: 'codigo', p: 'Crie <code>ordenar(lista)</code> usando o <b>selection sort</b>: para cada posição i, ache o menor item do resto da lista e troque com a posição i. Não use sort/sorted.', inicio: `def ordenar(lista):\n    pass\n`, teste: `print(ordenar([64, 25, 12, 22, 11]))\nprint(ordenar([3, 1, 2]))`, saida: '[11, 12, 22, 25, 64]\n[1, 2, 3]', usar: [['^(?![\\s\\S]*sort)', 'Não vale usar sort/sorted 😉']], dicas: ['for i in range(len(lista)):', '    menor = i; depois for j in range(i + 1, len(lista)): se lista[j] < lista[menor]: menor = j', '    lista[i], lista[menor] = lista[menor], lista[i] — e return lista no final'], sol: `def ordenar(lista):\n    for i in range(len(lista)):\n        menor = i\n        for j in range(i + 1, len(lista)):\n            if lista[j] < lista[menor]:\n                menor = j\n        lista[i], lista[menor] = lista[menor], lista[i]\n    return lista` }
            ]
          },
          {
            id: 'py-24', titulo: 'Geradores e decoradores', icone: '🎩',
            licao: [
              { titulo: 'yield: a torneira', texto: `<p>Um <b>gerador</b> entrega valores um de cada vez, sob demanda, como uma <b>torneira</b> (em vez de encher um balde enorme). Use <code>yield</code> no lugar de return. Economiza memória com muitos dados.</p>`, codigo: `def contar_ate(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nfor x in contar_ate(3):\n    print(x)\nprint(sum(contar_ate(100)))` },
              { titulo: 'Decoradores: embrulho de presente', texto: `<p>Um <b>decorador</b> é uma função que <b>embrulha</b> outra função, adicionando algo antes ou depois sem mexer nela. Usa <code>@</code>.</p>`, codigo: `def anunciar(func):\n    def embrulho(*args):\n        print(f"Chamando {func.__name__}...")\n        return func(*args)\n    return embrulho\n\n@anunciar\ndef soma(a, b):\n    return a + b\n\nprint(soma(2, 3))` }
            ],
            ex: [
              { tipo: 'prever', codigo: `def g():\n    yield "a"\n    yield "b"\n\nprint(list(g()))`, op: ["['a', 'b']", "a", "['a']", 'Erro'], c: 0, exp: 'list() pede todos os valores ao gerador: a e b.' },
              { tipo: 'prever', codigo: `def dobrar(f):\n    def w(x):\n        return f(x) * 2\n    return w\n\n@dobrar\ndef mais1(x):\n    return x + 1\n\nprint(mais1(4))`, op: ['5', '10', '9', '8'], c: 1, exp: 'mais1(4) = 5, e o decorador dobra: 10.' },
              { tipo: 'codigo', p: 'Crie o gerador <code>pares(limite)</code> que produz (yield) os números pares de 0 até o limite (incluindo).', inicio: `def pares(limite):\n    pass\n`, teste: `print(list(pares(10)))\nprint(sum(pares(100)))`, saida: '[0, 2, 4, 6, 8, 10]\n2550', usar: [['yield', 'Use yield']], dicas: ['for n in range(0, limite + 1, 2):', '    yield n'], sol: `def pares(limite):\n    for n in range(0, limite + 1, 2):\n        yield n` }
            ]
          },
          {
            id: 'py-33', titulo: 'Type hints e testes', icone: '🧪',
            licao: [
              { titulo: 'Dicas de tipo', texto: `<p>O Python não obriga, mas você pode <b>anotar</b> os tipos: <code>def total(precos: list[float]) -&gt; float:</code>. É como etiquetar as gavetas: o Python não confere, mas o editor (VS Code) avisa quando você erra, e quem lê entende na hora.</p>`, codigo: `def preco_final(valor: float, desconto: float = 0) -> float:\n    return valor * (1 - desconto / 100)\n\nnomes: list[str] = ["Ana", "Bia"]\nprint(preco_final(100, 10), nomes)` },
              { titulo: 'Testes automáticos com assert', texto: `<p>Programadores profissionais escrevem código que <b>testa o próprio código</b>. O <code>assert condição</code> não faz nada se a condição for verdadeira, e gera <code>AssertionError</code> se for falsa. Assim, quando você muda algo e quebra outra coisa, o teste avisa na hora.</p><p>(É exatamente assim que o CodeQuest confere seus exercícios!)</p>`, codigo: `def eh_par(n: int) -> bool:\n    return n % 2 == 0\n\nassert eh_par(4)\nassert not eh_par(7)\nassert eh_par(0)\nprint("todos os testes passaram ✅")` }
            ],
            ex: [
              { tipo: 'prever', codigo: `assert 2 + 2 == 4\nprint("ok")\nassert 2 + 2 == 5, "matemática quebrou"\nprint("fim")`, op: ['ok\nfim', 'ok', 'fim', 'Nada'], c: 1, saidaReal: 'ok', erro: true, exp: 'O primeiro assert passa e mostra "ok". O segundo falha e para o programa com AssertionError: matemática quebrou.' },
              { tipo: 'quiz', p: 'O que acontece se você chamar <code>preco_final("100")</code> numa função anotada com <code>valor: float</code>?', op: ['O Python bloqueia antes de rodar', 'O Python roda mesmo assim; a anotação é só uma dica (o editor é que avisa)', 'Converte para float', 'Apaga a anotação'], c: 1, exp: 'Type hints não são conferidos pelo Python ao rodar. Ferramentas como o VS Code e o mypy é que usam.' },
              { tipo: 'codigo', p: 'Escreva a função <code>validar_telefone(tel: str) -&gt; bool</code> (válido se, tirando espaços, traços e parênteses, sobrarem 10 ou 11 dígitos) e depois escreva <b>pelo menos 4 asserts</b> testando casos válidos e inválidos. No fim mostre <code>testes ok</code>.', inicio: `def validar_telefone(tel: str) -> bool:\n    pass\n\n# seus testes aqui\n`, teste: `print(validar_telefone("(21) 99999-1111"), validar_telefone("123"), validar_telefone("2199999111a"))`, saida: 'testes ok\nTrue False False', usar: [['(?:[\\s\\S]*?\\bassert\\b){4}', 'Escreva pelo menos 4 asserts']], dicas: ['Limpe o texto: so_numeros = tel.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")', 'return so_numeros.isdigit() and len(so_numeros) in (10, 11)', 'Testes: assert validar_telefone("(21) 99999-1111"); assert not validar_telefone("123"); ... e print("testes ok")'], sol: `def validar_telefone(tel: str) -> bool:\n    so_numeros = tel.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")\n    return so_numeros.isdigit() and len(so_numeros) in (10, 11)\n\nassert validar_telefone("(21) 99999-1111")\nassert validar_telefone("2133334444")\nassert not validar_telefone("123")\nassert not validar_telefone("21 9999-111a")\nprint("testes ok")` }
            ]
          },
          {
            id: 'py-25', titulo: 'Chefão: Sistema do salão', icone: '👑', xp: 60,
            licao: [
              { titulo: 'Juntando tudo', texto: `<p>Hora do <b>chefão final</b>! Você vai usar classes, listas, dicionários, laços, funções e tratamento de erros num mini-sistema de verdade: o caixa de um salão de beleza.</p><p>Dica de programador: resolva <b>por partes</b>. Faça uma coisa, teste, depois a próxima.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Num sistema de salão, qual destes faz mais sentido ser uma CLASSE?', op: ['O número 40', 'Atendimento (com cliente, serviço e valor)', 'A palavra "corte"', 'O símbolo +'], c: 1, exp: 'Classes representam "coisas" com dados e comportamentos. Um atendimento tem vários dados juntos.' },
              { tipo: 'codigo', p: 'Crie a classe <code>Caixa</code>:<ul><li><code>__init__</code>: recebe um dicionário <code>tabela</code> (serviço → preço) e começa com uma lista vazia <code>atendimentos</code></li><li><code>registrar(cliente, servico)</code>: se o serviço não existir na tabela, gere <code>ValueError(f"Serviço desconhecido: {servico}")</code>; senão guarde <code>(cliente, servico, preco)</code> na lista</li><li><code>total()</code>: soma dos preços</li><li><code>por_servico()</code>: dicionário serviço → quantidade de vezes</li><li><code>melhor_cliente()</code>: nome de quem gastou mais</li></ul>', inicio: `class Caixa:\n    def __init__(self, tabela):\n        self.tabela = tabela\n        self.atendimentos = []\n`, teste: `cx = Caixa({"corte": 40, "escova": 35, "progressiva": 180})\ncx.registrar("Ana", "corte")\ncx.registrar("Bia", "progressiva")\ncx.registrar("Ana", "escova")\ncx.registrar("Caio", "corte")\ntry:\n    cx.registrar("Duda", "tatuagem")\nexcept ValueError as e:\n    print(e)\nprint(f"Total: R$ {cx.total()}")\nprint(cx.por_servico())\nprint(f"Melhor cliente: {cx.melhor_cliente()}")`, saida: "Serviço desconhecido: tatuagem\nTotal: R$ 295\n{'corte': 2, 'progressiva': 1, 'escova': 1}\nMelhor cliente: Bia", dicas: ['registrar: if servico not in self.tabela: raise ValueError(...); senão self.atendimentos.append((cliente, servico, self.tabela[servico]))', 'total: return sum(a[2] for a in self.atendimentos)', 'por_servico: conte com um dicionário e .get(servico, 0) + 1', 'melhor_cliente: some o gasto por cliente num dicionário e use max(gastos, key=gastos.get)'], sol: `class Caixa:\n    def __init__(self, tabela):\n        self.tabela = tabela\n        self.atendimentos = []\n\n    def registrar(self, cliente, servico):\n        if servico not in self.tabela:\n            raise ValueError(f"Serviço desconhecido: {servico}")\n        self.atendimentos.append((cliente, servico, self.tabela[servico]))\n\n    def total(self):\n        return sum(a[2] for a in self.atendimentos)\n\n    def por_servico(self):\n        cont = {}\n        for _, s, _ in self.atendimentos:\n            cont[s] = cont.get(s, 0) + 1\n        return cont\n\n    def melhor_cliente(self):\n        gastos = {}\n        for c, _, p in self.atendimentos:\n            gastos[c] = gastos.get(c, 0) + p\n        return max(gastos, key=gastos.get)` }
            ]
          }
        ]
      }
    ]
  };
})();
