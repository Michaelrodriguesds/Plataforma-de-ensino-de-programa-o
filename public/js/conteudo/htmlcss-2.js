// =============================================================
// Trilha HTML e CSS — parte 2 (CSS, layout e responsivo)
// Continua a trilha criada em htmlcss-1.js.
// No teste, estilo("seletor", "propriedade") devolve o valor do CSS que
// vale para o elemento (cores sempre em hexadecimal: red vira #ff0000).
// =============================================================
(function () {
  var C = window.CURSOS;
  function pagina(corpo, css, titulo) {
    return '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>' + (titulo || 'Salão da Ana') + '</title>' +
      (css !== undefined ? '\n  <style>\n' + css + '\n  </style>' : '') +
      '\n</head>\n<body>\n' + corpo + '\n</body>\n</html>\n';
  }
  var CARDS = `  <section class="servicos">
    <article class="card"><h3>Corte</h3><p>R$ 40</p></article>
    <article class="card"><h3>Escova</h3><p>R$ 35</p></article>
    <article class="card"><h3>Manicure</h3><p>R$ 25</p></article>
  </section>`;

  C.htmlcss.mundos.push(
    // ===================================================== MUNDO 3
    {
      titulo: 'CSS: cores, textos e caixas', desc: 'Dar cara ao site: cores, fontes, espaços e bordas.',
      fases: [
        {
          id: 'hc-11', titulo: 'Seu primeiro CSS', icone: '🖌️',
          licao: [
            { titulo: 'HTML é o esqueleto, CSS é a roupa', texto: `<p>O <b>CSS</b> diz como cada parte da página deve <b>parecer</b>. Uma regra de CSS tem três partes:</p><pre>h1 {\n  color: purple;\n}</pre><ul><li><b>seletor</b> (<code>h1</code>): em quem a regra vale</li><li><b>propriedade</b> (<code>color</code>): o que mudar</li><li><b>valor</b> (<code>purple</code>): como fica</li></ul><p>Cada linha termina com <code>;</code>. Por enquanto, o CSS fica dentro de <code>&lt;style&gt;</code> no head. Em projetos maiores ele vai num arquivo separado, ligado com <code>&lt;link rel="stylesheet" href="estilo.css"&gt;</code>.</p>`, codigo: pagina(`  <h1>Salão da Ana</h1>
  <p>Cortes e escovas.</p>`, `    h1 {
      color: purple;
      font-size: 40px;
    }
    p {
      color: gray;
    }
    body {
      background-color: lavenderblush;
    }`) },
            { titulo: 'As primeiras propriedades', texto: `<ul><li><code>color</code>: cor do texto</li><li><code>background-color</code>: cor do fundo</li><li><code>font-size</code>: tamanho da letra (ex: <code>18px</code>)</li></ul><p>As cores podem ser nomes em inglês (<code>red</code>, <code>pink</code>) ou códigos como <code>#E91E63</code> (você vai entender esses códigos daqui a pouco).</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Na regra <code>p { color: blue; }</code>, o que é o <code>p</code>?', op: ['A propriedade', 'O valor', 'O seletor', 'O comentário'], c: 2, exp: 'O seletor escolhe quem recebe o estilo: todos os parágrafos.' },
            { tipo: 'quiz', p: 'Qual propriedade muda a cor do <b>fundo</b>?', op: ['color', 'background-color', 'fill', 'font-color'], c: 1, exp: 'color é a cor do texto; background-color é a do fundo.' },
            { tipo: 'completar', p: 'Deixe o título rosa e com 32px.', codigo: `h1 {
  ___: pink;
  ___: 32px;
}`, resp: ['color', 'font-size'], op: ['color', 'font-size', 'size', 'text-color'], exp: 'color para a cor, font-size para o tamanho.' },
            { tipo: 'codigo', p: 'Escreva o CSS para:<ul><li>o <code>h1</code> ficar com a cor <code>#E91E63</code></li><li>os parágrafos com tamanho <code>18px</code></li><li>o fundo do <code>body</code> com a cor <code>#FFF0F5</code></li></ul>', inicio: pagina(`  <h1>Salão da Ana</h1>
  <p>Cortes e escovas.</p>`, `    /* escreva suas regras aqui */`), teste: `console.log("h1:", estilo("h1", "color"));
console.log("p:", estilo("p", "font-size"));
console.log("fundo:", estilo("body", "background-color"));`, saida: 'h1: #e91e63\np: 18px\nfundo: #fff0f5', dicas: ['Três regras: uma para h1, uma para p e uma para body.', 'h1 { color: #E91E63; }', 'p { font-size: 18px; }\nbody { background-color: #FFF0F5; }'], sol: pagina(`  <h1>Salão da Ana</h1>
  <p>Cortes e escovas.</p>`, `    h1 { color: #E91E63; }
    p { font-size: 18px; }
    body { background-color: #FFF0F5; }`) }
          ]
        },
        {
          id: 'hc-12', titulo: 'Seletores', icone: '🎯',
          licao: [
            { titulo: 'Escolhendo quem vai mudar', texto: `<ul><li><code>p</code>: todos os parágrafos (pela <b>etiqueta</b>)</li><li><code>.preco</code>: todos com <code>class="preco"</code> (pela <b>classe</b>, com ponto)</li><li><code>#topo</code>: o elemento com <code>id="topo"</code> (pelo <b>id</b>, com #)</li><li><code>nav a</code>: os links que estão <b>dentro</b> de um nav (espaço = "dentro de")</li><li><code>h1, h2</code>: os dois (vírgula = "e também")</li></ul><p>Use <b>classes</b> no dia a dia: elas podem se repetir e um elemento pode ter várias: <code>class="card destaque"</code>.</p>`, codigo: pagina(`  <h2>Serviços</h2>
  <p>Corte <span class="preco">R$ 40</span></p>
  <p class="promo">Escova <span class="preco">R$ 35</span></p>`, `    .preco { color: green; }
    .promo { background-color: yellow; }
    h2, p { font-family: sans-serif; }`) },
            { titulo: 'Quando duas regras brigam', texto: `<p>Se duas regras mudam a mesma coisa, ganha a mais <b>específica</b>:</p><p><b>id</b> &gt; <b>classe</b> &gt; <b>etiqueta</b></p><p>Empatou? Ganha a que vem <b>por último</b> no CSS. Por isso o nome é <b>Cascading</b> Style Sheets: as regras caem em cascata.</p><p>Evite usar id para estilo (ele ganha de quase tudo e fica difícil mudar depois). Prefira classes.</p>`, codigo: pagina(`  <p class="aviso" id="principal">Que cor eu fico?</p>`, `    #principal { color: blue; }
    .aviso { color: red; }
    p { color: green; }`) }
          ],
          ex: [
            { tipo: 'quiz', p: 'Qual seletor escolhe os elementos com <code>class="card"</code>?', op: ['card', '#card', '.card', '*card'], c: 2, exp: 'Ponto para classe, # para id, nome puro para etiqueta.' },
            { tipo: 'quiz', p: 'Com <code>.destaque { color: red; }</code> e <code>p { color: blue; }</code>, qual a cor de <code>&lt;p class="destaque"&gt;</code>?', op: ['Azul, porque p vem depois', 'Vermelho, porque classe é mais específica que etiqueta', 'Roxo (mistura)', 'Preto'], c: 1, exp: 'A especificidade vence a ordem: classe ganha de etiqueta, não importa a posição.' },
            { tipo: 'quiz', p: 'O que escolhe <code>footer a</code>?', op: ['O footer e todos os links', 'Os links que estão dentro do footer', 'Só o primeiro link', 'O footer que é um link'], c: 1, exp: 'O espaço significa "dentro de".' },
            { tipo: 'codigo', p: 'Sem mudar o HTML, escreva o CSS:<ul><li>os elementos com a classe <code>preco</code> ficam verdes: <code>#2E7D32</code></li><li>os links <b>dentro do nav</b> ficam com <code>font-size: 20px</code></li><li>o elemento com o id <code>aviso</code> fica com fundo <code>#FFF59D</code></li></ul>', inicio: pagina(`  <nav><a href="#">Início</a> <a href="#">Preços</a></nav>
  <p>Corte <span class="preco">R$ 40</span></p>
  <p id="aviso">Fechado na segunda.</p>
  <a href="#">Link fora do nav</a>`, `    `), teste: `console.log("preço:", estilo(".preco", "color"));
console.log("link do nav:", estilo("nav a", "font-size"));
console.log("link fora:", estilo("body > a", "font-size") || "(sem regra)");
console.log("aviso:", estilo("#aviso", "background-color"));`, saida: 'preço: #2e7d32\nlink do nav: 20px\nlink fora: (sem regra)\naviso: #fff59d', dicas: ['.preco { ... } com ponto, porque é classe.', 'nav a { font-size: 20px; } (com espaço, para pegar só os de dentro do nav)', '#aviso { background-color: #FFF59D; }'], sol: pagina(`  <nav><a href="#">Início</a> <a href="#">Preços</a></nav>
  <p>Corte <span class="preco">R$ 40</span></p>
  <p id="aviso">Fechado na segunda.</p>
  <a href="#">Link fora do nav</a>`, `    .preco { color: #2E7D32; }
    nav a { font-size: 20px; }
    #aviso { background-color: #FFF59D; }`) }
          ]
        },
        {
          id: 'hc-13', titulo: 'Textos e fontes', icone: '✒️',
          licao: [
            { titulo: 'Deixando o texto gostoso de ler', texto: `<ul><li><code>font-family</code>: a fonte. Sempre termine com uma família genérica de reserva: <code>font-family: "Poppins", Arial, sans-serif;</code></li><li><code>font-weight</code>: espessura (<code>400</code> normal, <code>700</code> negrito)</li><li><code>line-height</code>: altura da linha (<code>1.5</code> deixa o texto respirar)</li><li><code>text-align</code>: <code>left</code>, <code>center</code>, <code>right</code></li><li><code>text-transform: uppercase</code>: tudo maiúsculo</li><li><code>text-decoration: none</code>: tira o sublinhado dos links</li></ul>`, codigo: pagina(`  <h1>Salão da Ana</h1>
  <p>Há 10 anos cuidando do seu cabelo com carinho. Atendimento com hora marcada e café de cortesia.</p>
  <a href="#">Agendar</a>`, `    body { font-family: Georgia, serif; line-height: 1.6; }
    h1 { text-align: center; text-transform: uppercase; font-weight: 700; }
    a { text-decoration: none; font-weight: 700; }`) },
            { titulo: 'Unidades: px, rem e %', texto: `<ul><li><code>px</code>: pixels, um tamanho fixo</li><li><code>rem</code>: relativo ao tamanho de letra padrão do navegador (normalmente 16px). <code>1.5rem</code> = 24px. Se a pessoa aumentar a letra nas configurações, tudo cresce junto: <b>melhor para acessibilidade</b></li><li><code>%</code>: porcentagem do elemento pai</li></ul><p>Uma boa regra: <code>rem</code> para letras e espaços, <code>%</code> para larguras.</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Por que escrever <code>font-family: "Poppins", sans-serif;</code> com o <code>sans-serif</code> no fim?', op: ['Para misturar as duas', 'É uma reserva, caso a Poppins não carregue', 'Para ficar em negrito', 'É obrigatório ter duas fontes'], c: 1, exp: 'Se a primeira fonte não existir no aparelho, o navegador usa a próxima da lista.' },
            { tipo: 'quiz', p: 'Se a letra padrão é 16px, quanto vale <code>2rem</code>?', op: ['2px', '18px', '32px', '200%'], c: 2, exp: '2 × 16px = 32px.' },
            { tipo: 'completar', p: 'Tire o sublinhado dos links e centralize o título.', codigo: `a { ___: none; }
h1 { ___: center; }`, resp: ['text-decoration', 'text-align'], op: ['text-decoration', 'text-align', 'align', 'underline'], exp: 'text-decoration controla o sublinhado; text-align, o alinhamento.' },
            { tipo: 'codigo', p: 'Estilize o texto:<ul><li>no <code>body</code>: <code>font-family: Arial, sans-serif</code> e <code>line-height: 1.5</code></li><li>no <code>h1</code>: <code>text-align: center</code> e <code>font-size: 2rem</code></li><li>nos links: sem sublinhado e com <code>font-weight: 700</code></li></ul>', inicio: pagina(`  <h1>Salão da Ana</h1>
  <p>Agende seu horário. <a href="#">Ver horários</a></p>`, `    `), teste: `console.log(estilo("body", "font-family"), "|", estilo("body", "line-height"));
console.log(estilo("h1", "text-align"), "|", estilo("h1", "font-size"));
console.log(estilo("a", "text-decoration"), "|", estilo("a", "font-weight"));
console.log("o parágrafo herda a fonte:", estilo("p", "font-family"));`, saida: 'arial, sans-serif | 1.5\ncenter | 2rem\nnone | 700\no parágrafo herda a fonte: arial, sans-serif', dicas: ['body { font-family: Arial, sans-serif; line-height: 1.5; }', 'h1 { text-align: center; font-size: 2rem; }', 'a { text-decoration: none; font-weight: 700; }'], sol: pagina(`  <h1>Salão da Ana</h1>
  <p>Agende seu horário. <a href="#">Ver horários</a></p>`, `    body { font-family: Arial, sans-serif; line-height: 1.5; }
    h1 { text-align: center; font-size: 2rem; }
    a { text-decoration: none; font-weight: 700; }`) }
          ]
        },
        {
          id: 'hc-14', titulo: 'O modelo de caixa', icone: '📦',
          licao: [
            { titulo: 'Tudo é uma caixa', texto: `<p>Para o CSS, todo elemento é uma <b>caixa</b> com camadas, de dentro para fora:</p><ol><li><b>conteúdo</b> (o texto)</li><li><code>padding</code>: o enchimento <b>dentro</b> da caixa, entre o texto e a borda</li><li><code>border</code>: a borda</li><li><code>margin</code>: o espaço <b>fora</b> da caixa, afastando as vizinhas</li></ol><p>Pense num quadro na parede: a foto é o conteúdo, o passe-partout é o padding, a moldura é a border e o espaço até o próximo quadro é a margin.</p>`, codigo: pagina(CARDS, `    .card {
      padding: 16px;
      border: 2px solid #F06292;
      margin: 12px;
      border-radius: 12px;
      background-color: white;
    }`) },
            { titulo: 'Atalhos e box-sizing', texto: `<ul><li><code>padding: 10px</code>: igual nos 4 lados</li><li><code>padding: 10px 20px</code>: 10 em cima e embaixo, 20 nas laterais</li><li><code>padding: 1px 2px 3px 4px</code>: cima, direita, baixo, esquerda (sentido do relógio)</li><li><code>border: 2px solid red</code>: espessura, estilo e cor</li><li><code>border-radius</code>: arredonda os cantos</li></ul><p>Por padrão, <code>width</code> não conta o padding e a borda (a caixa fica maior que o width!). Quase todo projeto começa com esta regra, que faz a largura incluir tudo:</p><pre>* { box-sizing: border-box; }</pre>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Qual propriedade cria espaço <b>dentro</b> da caixa, entre o texto e a borda?', op: ['margin', 'padding', 'border', 'gap'], c: 1, exp: 'padding é o enchimento interno; margin afasta por fora.' },
            { tipo: 'quiz', p: '<code>margin: 8px 24px</code> significa...', op: ['8px em cima, 24px embaixo', '8px em cima e embaixo, 24px nos lados', '8px à esquerda, 24px à direita', '8px nos 4 lados'], c: 1, exp: 'Com dois valores: o primeiro é vertical (cima/baixo), o segundo horizontal (lados).' },
            { tipo: 'quiz', p: 'Com <code>width: 200px; padding: 20px;</code> e sem <code>box-sizing</code>, qual a largura real da caixa?', op: ['200px', '220px', '240px', '160px'], c: 2, exp: '200 + 20 de cada lado = 240px. Com box-sizing: border-box ela fica com 200px.' },
            { tipo: 'codigo', p: 'Transforme os artigos em cards. Na classe <code>card</code>:<ul><li><code>padding: 16px</code></li><li><code>border: 1px solid #DDDDDD</code></li><li><code>border-radius: 12px</code></li><li><code>margin-bottom: 12px</code></li></ul>E no topo do CSS coloque a regra de <code>box-sizing: border-box</code> para todos (<code>*</code>).', inicio: pagina(CARDS, `    `), teste: `console.log("box-sizing:", estilo("h3", "box-sizing"));
console.log("padding:", estilo(".card", "padding-left"), estilo(".card", "padding-top"));
console.log("borda:", estilo(".card", "border-width"), estilo(".card", "border-style"), estilo(".card", "border-color"));
console.log("cantos:", estilo(".card", "border-radius"));
console.log("margem de baixo:", estilo(".card", "margin-bottom"));`, saida: 'box-sizing: border-box\npadding: 16px 16px\nborda: 1px solid #dddddd\ncantos: 12px\nmargem de baixo: 12px', dicas: ['* { box-sizing: border-box; }', '.card { padding: 16px; border: 1px solid #DDDDDD; }', '.card { border-radius: 12px; margin-bottom: 12px; }'], sol: pagina(CARDS, `    * { box-sizing: border-box; }
    .card {
      padding: 16px;
      border: 1px solid #DDDDDD;
      border-radius: 12px;
      margin-bottom: 12px;
    }`) }
          ]
        },
        {
          id: 'hc-15', titulo: 'Cores e variáveis', icone: '🌈',
          licao: [
            { titulo: 'Como funcionam os códigos de cor', texto: `<p>Na tela, toda cor é uma mistura de <b>vermelho</b>, <b>verde</b> e <b>azul</b> (RGB), cada um de 0 a 255.</p><ul><li><code>rgb(233, 30, 99)</code>: muito vermelho, pouco verde, um pouco de azul = rosa</li><li><code>#E91E63</code>: a mesma cor em <b>hexadecimal</b>: E9 = 233, 1E = 30, 63 = 99</li><li><code>rgba(0, 0, 0, 0.5)</code>: o quarto número é a transparência (0 a 1)</li></ul><p>Você não precisa fazer conta: copie os códigos de um seletor de cores (o VS Code mostra um quadradinho clicável ao lado de cada cor).</p>`, codigo: pagina(`  <p class="a">rgb(233, 30, 99)</p>
  <p class="b">#E91E63 (a mesma)</p>
  <p class="c">rgba com transparência</p>`, `    .a { background-color: rgb(233, 30, 99); color: white; }
    .b { background-color: #E91E63; color: white; }
    .c { background-color: rgba(233, 30, 99, 0.3); }`) },
            { titulo: 'Variáveis: mude a cor do site inteiro de uma vez', texto: `<p>Em vez de repetir <code>#E91E63</code> em 20 lugares, guarde a cor numa <b>variável CSS</b>. Elas começam com <code>--</code> e costumam ficar em <code>:root</code> (a raiz da página):</p><pre>:root {\n  --rosa: #E91E63;\n}\nh1 { color: var(--rosa); }</pre><p>Para mudar a cor do site todo, você muda <b>uma</b> linha. É assim que se faz tema escuro, por exemplo.</p>`, codigo: pagina(`  <h1>Salão da Ana</h1>
  <button>Agendar</button>`, `    :root {
      --principal: #8E24AA;
      --claro: #F3E5F5;
    }
    body { background-color: var(--claro); }
    h1 { color: var(--principal); }
    button { background-color: var(--principal); color: white; border: 0; padding: 8px 16px; }`) }
          ],
          ex: [
            { tipo: 'quiz', p: '<code>#000000</code> é qual cor?', op: ['Branco', 'Preto', 'Vermelho', 'Transparente'], c: 1, exp: 'Zero de vermelho, verde e azul: nenhuma luz, preto. #FFFFFF é branco.' },
            { tipo: 'quiz', p: 'Como usar a variável <code>--fundo</code>?', op: ['background: --fundo;', 'background: var(--fundo);', 'background: $fundo;', 'background: {fundo};'], c: 1, exp: 'Variáveis CSS são lidas com var(--nome).' },
            { tipo: 'completar', p: 'Crie a variável e use no título.', codigo: `:root {
  ___: #E91E63;
}
h1 { color: ___(--rosa); }`, resp: ['--rosa', 'var'], op: ['--rosa', 'var', 'rosa', '$rosa'], exp: 'A variável é criada com -- e lida com var().' },
            { tipo: 'codigo', p: 'Crie em <code>:root</code> duas variáveis: <code>--principal</code> com <code>#00897B</code> e <code>--texto</code> com <code>#263238</code>. Depois use:<ul><li><code>var(--texto)</code> na cor do <code>body</code></li><li><code>var(--principal)</code> na cor do <code>h1</code> e no fundo do <code>button</code></li></ul>', inicio: pagina(`  <h1>Salão da Ana</h1>
  <p>Agende já.</p>
  <button>Agendar</button>`, `    `), teste: `console.log("h1:", estilo("h1", "color"));
console.log("p (herda do body):", estilo("p", "color"));
console.log("botão:", estilo("button", "background-color"));
console.log("usa variável no h1:", /var\\(--principal\\)/.test(document.querySelector("style").textContent));`, saida: 'h1: #00897b\np (herda do body): #263238\nbotão: #00897b\nusa variável no h1: true', dicas: [':root { --principal: #00897B; --texto: #263238; }', 'body { color: var(--texto); }', 'h1 { color: var(--principal); }\nbutton { background-color: var(--principal); }'], sol: pagina(`  <h1>Salão da Ana</h1>
  <p>Agende já.</p>
  <button>Agendar</button>`, `    :root {
      --principal: #00897B;
      --texto: #263238;
    }
    body { color: var(--texto); }
    h1 { color: var(--principal); }
    button { background-color: var(--principal); color: white; }`) }
          ]
        }
      ]
    },
    // ===================================================== MUNDO 4
    {
      titulo: 'Layout', desc: 'Colocar as coisas lado a lado, em grade, e fazer caber no celular.',
      fases: [
        {
          id: 'hc-16', titulo: 'display e position', icone: '🧱',
          licao: [
            { titulo: 'Bloco ou na linha?', texto: `<p>Cada elemento tem um jeito de ocupar espaço, o <code>display</code>:</p><ul><li><code>block</code>: ocupa a linha toda e empurra o próximo para baixo (h1, p, div, section)</li><li><code>inline</code>: fica no meio do texto, só do tamanho do conteúdo (a, span, strong). Ignora width e height</li><li><code>inline-block</code>: fica na linha, mas aceita width, height e padding (bom para botões)</li><li><code>none</code>: some da página</li></ul>`, codigo: pagina(`  <a href="#" class="botao">Agendar</a>
  <a href="#" class="botao">Ver preços</a>
  <p class="escondido">Você não me vê.</p>`, `    .botao {
      display: inline-block;
      padding: 10px 16px;
      background-color: #E91E63;
      color: white;
      border-radius: 8px;
      text-decoration: none;
    }
    .escondido { display: none; }`) },
            { titulo: 'position', texto: `<ul><li><code>static</code>: o normal</li><li><code>relative</code>: permite empurrar um pouco com <code>top</code>/<code>left</code>, e vira a "referência" para os filhos absolutos</li><li><code>absolute</code>: sai do fluxo e fica posicionado em relação ao pai <code>relative</code> mais próximo (ex: um selo "Novo" no canto do card)</li><li><code>fixed</code>: preso na tela, mesmo rolando (ex: botão do WhatsApp)</li><li><code>sticky</code>: rola normal até encostar no topo, e aí gruda (ex: menu)</li></ul>`, codigo: pagina(`  <article class="card">
    <span class="selo">Novo</span>
    <h3>Botox capilar</h3>
  </article>
  <a class="zap" href="#">💬</a>`, `    .card { position: relative; border: 1px solid #ddd; padding: 24px; border-radius: 12px; }
    .selo { position: absolute; top: 8px; right: 8px; background: gold; padding: 2px 8px; border-radius: 99px; }
    .zap { position: fixed; bottom: 16px; right: 16px; font-size: 32px; text-decoration: none; }`) }
          ],
          ex: [
            { tipo: 'quiz', p: 'Você colocou <code>width: 200px</code> num <code>&lt;a&gt;</code> e nada mudou. Por quê?', op: ['Links não aceitam CSS', 'O a é inline, que ignora width; use display: inline-block', 'Faltou !important', 'Precisa ser em rem'], c: 1, exp: 'Elementos inline não aceitam largura e altura. inline-block ou block resolvem.' },
            { tipo: 'quiz', p: 'O botão do WhatsApp deve ficar sempre no canto da tela, mesmo rolando a página. Qual position?', op: ['relative', 'absolute', 'fixed', 'static'], c: 2, exp: 'fixed prende o elemento na tela.' },
            { tipo: 'quiz', p: 'O selo <code>position: absolute; top: 0; right: 0</code> foi parar no canto da PÁGINA, e não do card. O que faltou?', op: ['position: relative no card', 'display: block no selo', 'z-index', 'margin: 0'], c: 0, exp: 'O absolute se posiciona em relação ao ancestral mais próximo que tem position (relative, por exemplo).' },
            { tipo: 'codigo', p: 'Faça:<ul><li>a classe <code>botao</code> com <code>display: inline-block</code> e <code>padding: 12px 20px</code></li><li>a classe <code>card</code> com <code>position: relative</code></li><li>a classe <code>selo</code> com <code>position: absolute</code>, <code>top: 8px</code> e <code>right: 8px</code></li><li>a classe <code>oculto</code> que esconde o elemento</li></ul>', inicio: pagina(`  <article class="card">
    <span class="selo">Promoção</span>
    <h3>Escova</h3>
    <a class="botao" href="#">Agendar</a>
    <p class="oculto">Detalhes</p>
  </article>`, `    `), teste: `console.log("botão:", estilo(".botao", "display"), "|", estilo(".botao", "padding-top"), estilo(".botao", "padding-left"));
console.log("card:", estilo(".card", "position"));
console.log("selo:", estilo(".selo", "position"), estilo(".selo", "top"), estilo(".selo", "right"));
console.log("oculto:", estilo(".oculto", "display"));`, saida: 'botão: inline-block | 12px 20px\ncard: relative\nselo: absolute 8px 8px\noculto: none', dicas: ['.botao { display: inline-block; padding: 12px 20px; }', '.card { position: relative; }\n.selo { position: absolute; top: 8px; right: 8px; }', '.oculto { display: none; }'], sol: pagina(`  <article class="card">
    <span class="selo">Promoção</span>
    <h3>Escova</h3>
    <a class="botao" href="#">Agendar</a>
    <p class="oculto">Detalhes</p>
  </article>`, `    .botao { display: inline-block; padding: 12px 20px; }
    .card { position: relative; }
    .selo { position: absolute; top: 8px; right: 8px; }
    .oculto { display: none; }`) }
          ]
        },
        {
          id: 'hc-17', titulo: 'Flexbox', icone: '↔️',
          licao: [
            { titulo: 'Lado a lado sem sofrimento', texto: `<p>O <b>Flexbox</b> organiza os filhos de uma caixa numa <b>fila</b>. Você coloca <code>display: flex</code> no <b>pai</b>, e os filhos se alinham:</p><ul><li><code>flex-direction</code>: <code>row</code> (em linha, o padrão) ou <code>column</code> (em coluna)</li><li><code>justify-content</code>: como distribuir na direção da fila: <code>flex-start</code>, <code>center</code>, <code>space-between</code> (afastados), <code>space-around</code></li><li><code>align-items</code>: como alinhar na outra direção: <code>center</code> centraliza na vertical</li><li><code>gap</code>: espaço entre os filhos</li></ul>`, codigo: pagina(`  <header class="topo">
    <strong>Salão da Ana</strong>
    <nav class="menu">
      <a href="#">Serviços</a>
      <a href="#">Preços</a>
      <a href="#">Contato</a>
    </nav>
  </header>`, `    .topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background-color: #FCE4EC;
    }
    .menu { display: flex; gap: 16px; }`) },
            { titulo: 'O truque de centralizar', texto: `<p>Centralizar algo no meio de uma caixa, na horizontal e na vertical, era um dos maiores sofrimentos da web. Com flexbox são três linhas:</p><pre>.caixa {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}</pre>`, codigo: pagina(`  <div class="caixa"><p>Bem no meio 🎯</p></div>`, `    .caixa {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      background-color: #EDE7F6;
    }`) }
          ],
          ex: [
            { tipo: 'quiz', p: 'Onde vai o <code>display: flex</code>?', op: ['Em cada filho', 'No pai, que contém os itens', 'No body sempre', 'No primeiro item'], c: 1, exp: 'O flex é ligado no container (pai) e organiza os filhos.' },
            { tipo: 'quiz', p: 'Logo à esquerda e menu à direita, no mesmo topo. Qual justify-content?', op: ['center', 'flex-start', 'space-between', 'stretch'], c: 2, exp: 'space-between empurra o primeiro para o começo e o último para o fim.' },
            { tipo: 'completar', p: 'Centralize o conteúdo da caixa nos dois sentidos.', codigo: `.caixa {
  display: ___;
  justify-content: ___;
  align-items: ___;
}`, resp: ['flex', 'center', 'center'], op: ['flex', 'center', 'block', 'middle'], exp: 'flex + center + center: o truque clássico.' },
            { tipo: 'codigo', p: 'Monte o topo do site:<ul><li><code>.topo</code>: <code>display: flex</code>, <code>justify-content: space-between</code> e <code>align-items: center</code></li><li><code>.menu</code>: também <code>display: flex</code>, com <code>gap: 16px</code></li></ul>', inicio: pagina(`  <header class="topo">
    <strong>Salão da Ana</strong>
    <nav class="menu">
      <a href="#">Serviços</a>
      <a href="#">Contato</a>
    </nav>
  </header>`, `    `), teste: `console.log("topo:", estilo(".topo", "display"), "|", estilo(".topo", "justify-content"), "|", estilo(".topo", "align-items"));
console.log("menu:", estilo(".menu", "display"), "| gap", estilo(".menu", "column-gap"));`, saida: 'topo: flex | space-between | center\nmenu: flex | gap 16px', dicas: ['.topo { display: flex; }', '.topo { justify-content: space-between; align-items: center; }', '.menu { display: flex; gap: 16px; }'], sol: pagina(`  <header class="topo">
    <strong>Salão da Ana</strong>
    <nav class="menu">
      <a href="#">Serviços</a>
      <a href="#">Contato</a>
    </nav>
  </header>`, `    .topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .menu {
      display: flex;
      gap: 16px;
    }`) }
          ]
        },
        {
          id: 'hc-18', titulo: 'Flexbox na prática', icone: '🃏',
          licao: [
            { titulo: 'Cards que se ajeitam', texto: `<ul><li><code>flex-wrap: wrap</code>: se não couber na linha, os itens <b>quebram</b> para a próxima (sem isso, eles espremem)</li><li><code>flex: 1</code> num filho: ele <b>cresce</b> para ocupar o espaço que sobrar. Se todos têm <code>flex: 1</code>, dividem igualmente</li><li><code>flex: 1 1 200px</code>: cresce, encolhe, e tenta ter 200px de base</li></ul><p>Com esses três, você monta uma fileira de cards que vira coluna sozinha no celular.</p>`, codigo: pagina(CARDS, `    .servicos { display: flex; flex-wrap: wrap; gap: 12px; }
    .card {
      flex: 1 1 160px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 12px;
    }`) }
          ],
          ex: [
            { tipo: 'quiz', p: 'Os cards ficaram espremidos no celular, todos numa linha só. O que falta no container?', op: ['flex-wrap: wrap', 'flex-direction: row', 'align-items: center', 'display: block'], c: 0, exp: 'Sem wrap, o flexbox tenta colocar tudo na mesma linha.' },
            { tipo: 'quiz', p: 'Três filhos com <code>flex: 1</code> numa linha de 600px (sem gap). Qual a largura de cada um?', op: ['600px', '300px', '200px', 'Depende do texto'], c: 2, exp: 'flex: 1 divide o espaço igualmente: 600 / 3 = 200px.' },
            { tipo: 'codigo', p: 'Faça os cards ficarem lado a lado e quebrarem de linha quando não couberem:<ul><li><code>.servicos</code>: <code>display: flex</code>, <code>flex-wrap: wrap</code> e <code>gap: 12px</code></li><li><code>.card</code>: <code>flex: 1 1 200px</code></li></ul>', inicio: pagina(CARDS, `    .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }`), teste: `console.log(estilo(".servicos", "display"), "|", estilo(".servicos", "flex-wrap"), "|", estilo(".servicos", "row-gap"));
console.log("cresce:", estilo(".card", "flex-grow"), "| base:", estilo(".card", "flex-basis"));`, saida: 'flex | wrap | 12px\ncresce: 1 | base: 200px', dicas: ['.servicos { display: flex; flex-wrap: wrap; gap: 12px; }', 'No .card, junto das outras propriedades: flex: 1 1 200px;'], sol: pagina(CARDS, `    .servicos { display: flex; flex-wrap: wrap; gap: 12px; }
    .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; flex: 1 1 200px; }`) }
          ]
        },
        {
          id: 'hc-19', titulo: 'CSS Grid', icone: '🔲',
          licao: [
            { titulo: 'Uma grade de verdade', texto: `<p>Flexbox pensa em <b>uma</b> direção (uma fila). O <b>Grid</b> pensa em <b>duas</b>: linhas e colunas, como uma planilha.</p><ul><li><code>display: grid</code> no pai</li><li><code>grid-template-columns: 1fr 1fr 1fr</code>: três colunas iguais. <code>fr</code> = uma <b>fração</b> do espaço livre</li><li><code>repeat(3, 1fr)</code>: o mesmo, mais curto</li><li><code>gap</code>: espaço entre as células</li><li><code>grid-column: span 2</code> num filho: ele ocupa 2 colunas</li></ul>`, codigo: pagina(`  <section class="galeria">
    <div class="foto destaque">Destaque</div>
    <div class="foto">1</div>
    <div class="foto">2</div>
    <div class="foto">3</div>
    <div class="foto">4</div>
  </section>`, `    .galeria { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .foto { background-color: #F8BBD0; padding: 24px; text-align: center; border-radius: 8px; }
    .destaque { grid-column: span 2; background-color: #EC407A; color: white; }`) },
            { titulo: 'Colunas que se adaptam sozinhas', texto: `<p>Uma linha famosa, que cria quantas colunas couberem, cada uma com no mínimo 200px:</p><pre>grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));</pre><p>No celular vira 1 coluna, no tablet 2, no computador 4 — sem nenhuma media query.</p><p><b>Flexbox ou Grid?</b> Uma fileira de itens (menu, botões) → flexbox. Uma grade de cards ou o layout da página → grid.</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: '<code>grid-template-columns: 2fr 1fr</code> cria...', op: ['Duas colunas iguais', 'Uma coluna com o dobro da largura da outra', 'Duas linhas', '3 colunas'], c: 1, exp: 'O espaço é dividido em 3 frações: a primeira coluna fica com 2, a segunda com 1.' },
            { tipo: 'quiz', p: 'Como fazer um item ocupar duas colunas da grade?', op: ['width: 200%', 'grid-column: span 2', 'colspan="2"', 'flex: 2'], c: 1, exp: 'grid-column: span 2 estica o item por duas colunas. (colspan é coisa de tabela HTML.)' },
            { tipo: 'completar', p: 'Crie uma grade de 4 colunas iguais com 10px de espaço.', codigo: `.grade {
  display: ___;
  grid-template-columns: repeat(___, 1fr);
  gap: 10px;
}`, resp: ['grid', '4'], op: ['grid', '4', 'flex', '1fr'], exp: 'display: grid + repeat(4, 1fr).' },
            { tipo: 'codigo', p: 'Monte a vitrine:<ul><li><code>.vitrine</code>: <code>display: grid</code>, três colunas iguais com <code>repeat(3, 1fr)</code> e <code>gap: 16px</code></li><li><code>.grande</code>: ocupa 2 colunas</li></ul>', inicio: pagina(`  <section class="vitrine">
    <article class="item grande">Kit verão</article>
    <article class="item">Shampoo</article>
    <article class="item">Máscara</article>
    <article class="item">Óleo</article>
  </section>`, `    .item { padding: 16px; background-color: #F3E5F5; border-radius: 8px; }`), teste: `console.log(estilo(".vitrine", "display"), "|", estilo(".vitrine", "grid-template-columns"), "|", estilo(".vitrine", "column-gap"));
console.log("grande:", estilo(".grande", "grid-column"));`, saida: 'grid | repeat(3, 1fr) | 16px\ngrande: span 2', dicas: ['.vitrine { display: grid; }', '.vitrine { grid-template-columns: repeat(3, 1fr); gap: 16px; }', '.grande { grid-column: span 2; }'], sol: pagina(`  <section class="vitrine">
    <article class="item grande">Kit verão</article>
    <article class="item">Shampoo</article>
    <article class="item">Máscara</article>
    <article class="item">Óleo</article>
  </section>`, `    .item { padding: 16px; background-color: #F3E5F5; border-radius: 8px; }
    .vitrine { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grande { grid-column: span 2; }`) }
          ]
        },
        {
          id: 'hc-20', titulo: 'Responsivo', icone: '📱',
          licao: [
            { titulo: 'Um site, todas as telas', texto: `<p>Mais da metade das pessoas vai abrir seu site no <b>celular</b>. Site <b>responsivo</b> é o que se adapta à tela.</p><p>A ferramenta é a <b>media query</b>: regras que só valem em certas larguras de tela.</p><pre>@media (min-width: 768px) {\n  .servicos { flex-direction: row; }\n}</pre><p>Lê-se: "quando a tela tiver <b>pelo menos</b> 768px de largura, aplique isto".</p><p>A boa prática é o <b>mobile first</b>: escreva o CSS normal pensando no celular, e use <code>min-width</code> para melhorar nas telas maiores. (E não esqueça a meta viewport no head!)</p>`, codigo: pagina(CARDS, `    .servicos { display: flex; flex-direction: column; gap: 8px; }
    .card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
    @media (min-width: 600px) {
      .servicos { flex-direction: row; }
      .card { flex: 1; }
    }`) },
            { titulo: 'Testando no computador', texto: `<p>No Chrome, aperte <b>F12</b> e clique no ícone de celular (ou Ctrl+Shift+M). Dá para escolher o tamanho de vários aparelhos e ver as media queries funcionando.</p><p>Larguras comuns de referência: <b>600px</b> (celular grande), <b>768px</b> (tablet), <b>1024px</b> (notebook).</p><p>Aqui no CodeQuest, os testes usam <code>estilo(el, prop, { largura: 400 })</code> para "fingir" uma tela de celular.</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'O que significa <code>@media (max-width: 600px)</code>?', op: ['Só em telas com pelo menos 600px', 'Só em telas com no máximo 600px', 'A página terá 600px', 'Só em impressoras'], c: 1, exp: 'max-width = até essa largura. min-width = a partir dela.' },
            { tipo: 'quiz', p: 'O que é "mobile first"?', op: ['Fazer só a versão de celular', 'Escrever o CSS base para o celular e usar min-width para telas maiores', 'Esconder o site no computador', 'Usar só fontes pequenas'], c: 1, exp: 'Começa pelo menor e vai acrescentando para os maiores.' },
            { tipo: 'codigo', p: 'Mobile first: no celular os cards ficam em coluna; em telas de <b>700px ou mais</b>, em linha.<ul><li><code>.servicos</code>: <code>display: flex</code> e <code>flex-direction: column</code></li><li>uma media query com <code>min-width: 700px</code> que muda o <code>flex-direction</code> de <code>.servicos</code> para <code>row</code></li></ul>', inicio: pagina(CARDS, `    .card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }`), teste: `console.log("celular (400px):", estilo(".servicos", "flex-direction", { largura: 400 }));
console.log("notebook (1024px):", estilo(".servicos", "flex-direction", { largura: 1024 }));
console.log("tela de 700px:", estilo(".servicos", "flex-direction", { largura: 700 }));`, saida: 'celular (400px): column\nnotebook (1024px): row\ntela de 700px: row', dicas: ['Primeiro a regra normal: .servicos { display: flex; flex-direction: column; }', 'Depois: @media (min-width: 700px) { ... }', '@media (min-width: 700px) {\n  .servicos { flex-direction: row; }\n}'], sol: pagina(CARDS, `    .card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
    .servicos { display: flex; flex-direction: column; }
    @media (min-width: 700px) {
      .servicos { flex-direction: row; }
    }`) }
          ]
        }
      ]
    },
    // ===================================================== MUNDO 5
    {
      titulo: 'Acabamento profissional', desc: 'Interação, transições e o projeto final.',
      fases: [
        {
          id: 'hc-21', titulo: 'Estados e transições', icone: '✨',
          licao: [
            { titulo: 'Quando o mouse passa', texto: `<p>As <b>pseudo-classes</b> aplicam estilo em certos <b>estados</b>:</p><ul><li><code>:hover</code>: mouse em cima</li><li><code>:focus</code>: o campo ou botão selecionado (com Tab ou toque). Nunca tire o contorno de foco sem colocar outro: quem usa teclado se perde!</li><li><code>:active</code>: no momento do clique</li><li><code>:first-child</code>, <code>:nth-child(2)</code>: pela posição</li></ul><p>E <code>cursor: pointer</code> mostra a mãozinha.</p>`, codigo: pagina(`  <button class="botao">Agendar</button>
  <ul><li>Corte</li><li>Escova</li><li>Unha</li></ul>`, `    .botao { background-color: #E91E63; color: white; border: 0; padding: 10px 18px; border-radius: 8px; cursor: pointer; }
    .botao:hover { background-color: #AD1457; }
    .botao:focus { outline: 3px solid #FFD54F; }
    li:nth-child(2) { font-weight: 700; }`) },
            { titulo: 'Mudanças suaves', texto: `<p>A <code>transition</code> faz a mudança acontecer aos poucos, em vez de pular:</p><pre>.botao { transition: background-color 0.3s; }</pre><p>Lê-se: "quando o background-color mudar, leve 0,3 segundo". Coloque a transition no estado <b>normal</b> (não no :hover), para ela valer na ida e na volta.</p><p><code>transform: scale(1.05)</code> aumenta um pouco o elemento, um efeito clássico em cards.</p>`, codigo: pagina(CARDS, `    .servicos { display: flex; gap: 8px; }
    .card { flex: 1; padding: 16px; border: 1px solid #ddd; border-radius: 12px; transition: transform 0.2s; }
    .card:hover { transform: scale(1.05); }`) }
          ],
          ex: [
            { tipo: 'quiz', p: 'Qual pseudo-classe aplica estilo quando o mouse está em cima?', op: [':over', ':hover', ':mouse', ':active'], c: 1, exp: ':hover é o estado de "mouse em cima".' },
            { tipo: 'quiz', p: 'Onde colocar o <code>transition</code> para a animação funcionar na ida e na volta?', op: ['No :hover', 'No estado normal do elemento', 'No body', 'No :focus'], c: 1, exp: 'No estado normal ele vale sempre, inclusive quando o mouse sai.' },
            { tipo: 'quiz', p: 'Alguém colocou <code>button:focus { outline: none; }</code>. Qual o problema?', op: ['Nenhum', 'Quem navega pelo teclado não vê onde está', 'O botão para de funcionar', 'Fica mais lento'], c: 1, exp: 'O contorno de foco mostra onde a pessoa está. Se tirar, coloque outro destaque no lugar.' },
            { tipo: 'codigo', p: 'Dê vida ao botão:<ul><li><code>.botao</code>: <code>cursor: pointer</code> e <code>transition: background-color 0.3s</code></li><li><code>.botao:hover</code>: <code>background-color: #AD1457</code></li><li><code>.botao:focus</code>: <code>outline: 3px solid #FFD54F</code></li></ul>', inicio: pagina(`  <button class="botao">Agendar</button>`, `    .botao { background-color: #E91E63; color: white; border: 0; padding: 10px 18px; }`), teste: `console.log("normal:", estilo(".botao", "background-color"), "|", estilo(".botao", "cursor"), "|", estilo(".botao", "transition"));
console.log("hover:", estilo(".botao", "background-color", { estado: "hover" }));
console.log("foco:", estilo(".botao", "outline", { estado: "focus" }));`, saida: 'normal: #e91e63 | pointer | background-color 0.3s\nhover: #ad1457\nfoco: 3px solid #ffd54f', dicas: ['No .botao, acrescente: cursor: pointer; transition: background-color 0.3s;', '.botao:hover { background-color: #AD1457; }', '.botao:focus { outline: 3px solid #FFD54F; }'], sol: pagina(`  <button class="botao">Agendar</button>`, `    .botao { background-color: #E91E63; color: white; border: 0; padding: 10px 18px; cursor: pointer; transition: background-color 0.3s; }
    .botao:hover { background-color: #AD1457; }
    .botao:focus { outline: 3px solid #FFD54F; }`) }
          ]
        },
        {
          id: 'hc-22', titulo: 'Chefão: a landing page', icone: '👑', xp: 80,
          licao: [
            { titulo: 'O projeto final', texto: `<p>Uma <b>landing page</b> é a página de "vitrine": apresenta o negócio e chama para uma ação (agendar). Ela junta tudo da trilha:</p><ul><li>HTML semântico (header, main, section, footer)</li><li>variáveis de cor</li><li>flexbox no topo, grid nos cards</li><li>responsivo (mobile first)</li><li>hover com transition</li></ul><p>Depois de passar, copie seu código para um arquivo <code>index.html</code> no VS Code, abra no navegador e mostre para alguém. É o seu primeiro site! 🎉 Na trilha <b>Git, Terminal e Deploy</b> você aprende a colocar no ar.</p>` }
          ],
          ex: [
            { tipo: 'codigo', p: 'Complete o CSS da landing page (o HTML já está pronto):<ol><li>em <code>:root</code>, a variável <code>--marca</code> com <code>#C2185B</code></li><li><code>.topo</code>: flexbox com <code>justify-content: space-between</code> e <code>align-items: center</code>; o fundo usa <code>var(--marca)</code></li><li><code>.cards</code>: <code>display: grid</code> com <b>1 coluna</b> (<code>1fr</code>) no celular, e <code>repeat(3, 1fr)</code> a partir de <code>768px</code> (media query com min-width)</li><li><code>.cta</code> (o botão): fundo <code>var(--marca)</code> e <code>transition: transform 0.2s</code>; no <code>:hover</code>, <code>transform: scale(1.05)</code></li></ol>', inicio: pagina(`  <header class="topo">
    <strong>Salão da Ana</strong>
    <nav><a href="#servicos">Serviços</a></nav>
  </header>
  <main>
    <section class="hero">
      <h1>Seu cabelo do jeito que você sonhou</h1>
      <a class="cta" href="#">Agendar pelo WhatsApp</a>
    </section>
    <section id="servicos" class="cards">
      <article><h2>Corte</h2><p>R$ 40</p></article>
      <article><h2>Escova</h2><p>R$ 35</p></article>
      <article><h2>Coloração</h2><p>R$ 120</p></article>
    </section>
  </main>
  <footer><p>Rua das Flores, 10 · Centro</p></footer>`, `    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; }
    .topo a { color: white; }
    .cta { display: inline-block; padding: 12px 20px; color: white; text-decoration: none; border-radius: 8px; }
    .cards { gap: 16px; padding: 16px; }`), teste: `console.log("topo:", estilo(".topo", "display"), estilo(".topo", "justify-content"), estilo(".topo", "align-items"), estilo(".topo", "background-color"));
console.log("celular:", estilo(".cards", "display"), estilo(".cards", "grid-template-columns", { largura: 400 }));
console.log("computador:", estilo(".cards", "grid-template-columns", { largura: 1024 }));
console.log("botão:", estilo(".cta", "background-color"), "|", estilo(".cta", "transition"));
console.log("hover:", estilo(".cta", "transform", { estado: "hover" }));
console.log("usa a variável:", (document.querySelector("style").textContent.match(/var\\(--marca\\)/g) || []).length >= 2);`, saida: 'topo: flex space-between center #c2185b\ncelular: grid 1fr\ncomputador: repeat(3, 1fr)\nbotão: #c2185b | transform 0.2s\nhover: scale(1.05)\nusa a variável: true', dicas: [':root { --marca: #C2185B; }\n.topo { display: flex; justify-content: space-between; align-items: center; background-color: var(--marca); }', '.cards { display: grid; grid-template-columns: 1fr; }', '@media (min-width: 768px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}', '.cta { background-color: var(--marca); transition: transform 0.2s; }\n.cta:hover { transform: scale(1.05); }'], sol: pagina(`  <header class="topo">
    <strong>Salão da Ana</strong>
    <nav><a href="#servicos">Serviços</a></nav>
  </header>
  <main>
    <section class="hero">
      <h1>Seu cabelo do jeito que você sonhou</h1>
      <a class="cta" href="#">Agendar pelo WhatsApp</a>
    </section>
    <section id="servicos" class="cards">
      <article><h2>Corte</h2><p>R$ 40</p></article>
      <article><h2>Escova</h2><p>R$ 35</p></article>
      <article><h2>Coloração</h2><p>R$ 120</p></article>
    </section>
  </main>
  <footer><p>Rua das Flores, 10 · Centro</p></footer>`, `    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; }
    .topo a { color: white; }
    .cta { display: inline-block; padding: 12px 20px; color: white; text-decoration: none; border-radius: 8px; }
    .cards { gap: 16px; padding: 16px; }

    :root { --marca: #C2185B; }
    .topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--marca);
      color: white;
    }
    .cards { display: grid; grid-template-columns: 1fr; }
    @media (min-width: 768px) {
      .cards { grid-template-columns: repeat(3, 1fr); }
    }
    .cta { background-color: var(--marca); transition: transform 0.2s; }
    .cta:hover { transform: scale(1.05); }`) },
            { tipo: 'quiz', p: 'Seu site está pronto no seu computador. Qual o próximo passo para outras pessoas acessarem?', op: ['Mandar o arquivo index.html por WhatsApp', 'Publicar numa hospedagem (como GitHub Pages, Netlify ou Render)', 'Imprimir', 'Nada, já está na internet'], c: 1, exp: 'Um site precisa estar num servidor na internet. Isso é o "deploy", assunto da trilha Git, Terminal e Deploy.' }
          ]
        }
      ]
    }
  );
})();
