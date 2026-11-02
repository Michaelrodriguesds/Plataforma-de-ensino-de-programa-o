// =============================================================
// Trilha HTML e CSS — parte 1 (estrutura, formulários e semântica)
// A parte 2 (CSS e layout) está em htmlcss-2.js (os arquivos carregam em ordem alfabética).
//
// Como funcionam os exercícios desta trilha:
//   - o código do aluno É a página (HTML, com o CSS dentro de <style>)
//   - o "teste" é JavaScript que olha a página montada, usando:
//       texto("h1")  existe("nav a")  quantos("li")
//       atributo("img", "alt")  estilo("h1", "color")
//     e mostra o resultado com console.log
//   - a prévia mostra a página de verdade, desenhada pelo navegador
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});
  // Monta uma página completa (para não repetir o esqueleto em todo exercício)
  function pagina(corpo, css, titulo) {
    return '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>' + (titulo || 'Salão da Ana') + '</title>' +
      (css !== undefined ? '\n  <style>\n' + css + '\n  </style>' : '') +
      '\n</head>\n<body>\n' + corpo + '\n</body>\n</html>\n';
  }
  C.htmlcss = {
    id: 'htmlcss', nome: 'HTML e CSS', icone: '🎨', cor: '#F06292', ling: 'html',
    // usadas no certificado de conclusão
    habilidades: ['Estrutura de páginas com HTML semântico', 'Links, imagens, listas e tabelas', 'Formulários acessíveis', 'Acessibilidade e SEO básico', 'CSS: seletores, cores, fontes e modelo de caixa', 'Layout com Flexbox e CSS Grid', 'Sites responsivos (mobile first) e transições'],
    desc: 'O começo de todo site: HTML monta a estrutura e o CSS deixa bonito. Do primeiro título ao layout responsivo.',
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'A estrutura da página', desc: 'Etiquetas, títulos, links, imagens, listas e tabelas.',
        fases: [
          {
            id: 'hc-01', titulo: 'Sua primeira página', icone: '📄',
            licao: [
              { titulo: 'O que é HTML', texto: `<p>Todo site que você abre é, no fundo, um arquivo de texto escrito em <b>HTML</b>. O navegador lê esse texto e desenha a página.</p><p>O HTML usa <b>etiquetas</b> (as <i>tags</i>) para dizer o que cada pedaço é. Uma etiqueta abre com <code>&lt;nome&gt;</code> e fecha com <code>&lt;/nome&gt;</code>, como as duas pontas de um pacote:</p><ul><li><code>&lt;h1&gt;</code> = título principal</li><li><code>&lt;p&gt;</code> = parágrafo</li></ul><p>Toque em <b>Rodar exemplo</b> para ver a página desenhada.</p>`, codigo: `<h1>Salão da Ana</h1>
<p>Cortes, escovas e unhas no centro da cidade.</p>` },
              { titulo: 'O esqueleto completo', texto: `<p>Uma página de verdade tem um esqueleto fixo, que você vai repetir em todo projeto:</p><ul><li><code>&lt;!DOCTYPE html&gt;</code>: avisa que é HTML moderno</li><li><code>&lt;html lang="pt-BR"&gt;</code>: a página toda, em português</li><li><code>&lt;head&gt;</code>: a "cabeça", com informações que <b>não aparecem</b> na página (título da aba, acentos)</li><li><code>&lt;body&gt;</code>: o "corpo", tudo que <b>aparece</b></li></ul><p>No VS Code, num arquivo <code>index.html</code>, digite <code>!</code> e aperte Tab: ele escreve esse esqueleto para você.</p>`, codigo: pagina(`  <h1>Salão da Ana</h1>
  <p>Agende pelo WhatsApp.</p>`) }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual etiqueta cria o título principal da página?', op: ['<title>', '<h1>', '<head>', '<p>'], c: 1, exp: '<h1> é o título que aparece na página. <title> é o texto da aba do navegador (fica no head).' },
              { tipo: 'quiz', p: 'O que vai dentro do <code>&lt;body&gt;</code>?', op: ['Só o título da aba', 'Tudo que aparece na página', 'Só o CSS', 'Nada: ele é opcional'], c: 1, exp: 'O body guarda tudo que a pessoa vê. O head guarda informações sobre a página.' },
              { tipo: 'completar', p: 'Feche as etiquetas corretamente.', codigo: `<h1>Bem-vinda!___
<p>Hoje tem promoção.___`, resp: ['</h1>', '</p>'], op: ['</h1>', '</p>', '<h1>', '<p>'], exp: 'A etiqueta de fechar tem uma barra: </h1>, </p>.' },
              { tipo: 'montar', p: 'Monte o esqueleto na ordem certa.', linhas: ['<!DOCTYPE html>', '<html lang="pt-BR">', '<head>', '  <title>Salão</title>', '</head>', '<body>', '  <h1>Salão</h1>', '</body>', '</html>'], exp: 'Primeiro o DOCTYPE, depois html; dentro dele vem o head e, depois, o body.' },
              { tipo: 'codigo', p: 'Crie uma página com o título <code>&lt;h1&gt;</code> <b>Salão da Ana</b> e, embaixo, um parágrafo <b>Aberto de terça a sábado</b>.', inicio: pagina(`  <!-- escreva aqui -->`), teste: `console.log(texto("h1"));
console.log(texto("p"));`, saida: 'Salão da Ana\nAberto de terça a sábado', dicas: ['Dentro do body: <h1>Salão da Ana</h1>', 'Na linha de baixo: <p>Aberto de terça a sábado</p>', 'Confira os acentos e as letras maiúsculas.'], sol: pagina(`  <h1>Salão da Ana</h1>
  <p>Aberto de terça a sábado</p>`) }
            ]
          },
          {
            id: 'hc-02', titulo: 'Títulos e textos', icone: '🔠',
            licao: [
              { titulo: 'Títulos em níveis', texto: `<p>Existem seis níveis de título: <code>&lt;h1&gt;</code> até <code>&lt;h6&gt;</code>. Pense num livro: <b>h1</b> é o nome do livro, <b>h2</b> são os capítulos, <b>h3</b> as seções de cada capítulo.</p><p>Regra de ouro: <b>um h1 por página</b> e não pule níveis (depois de um h2 vem h3, não h5). O Google e os leitores de tela usam essa ordem para entender a página.</p>`, codigo: `<h1>Salão da Ana</h1>
<h2>Cabelo</h2>
<h3>Cortes</h3>
<p>Corte feminino e masculino.</p>
<h3>Química</h3>
<p>Progressiva e coloração.</p>
<h2>Unhas</h2>
<p>Pé e mão.</p>` },
              { titulo: 'Destaques e quebras', texto: `<ul><li><code>&lt;strong&gt;</code>: texto <b>importante</b> (aparece em negrito)</li><li><code>&lt;em&gt;</code>: <i>ênfase</i> (aparece em itálico)</li><li><code>&lt;br&gt;</code>: quebra a linha (não tem fechamento)</li><li><code>&lt;hr&gt;</code>: uma linha separadora</li></ul><p>Use <code>strong</code> e <code>em</code> pelo <b>significado</b>, não só pelo visual: o visual a gente resolve com CSS depois.</p>`, codigo: `<p>Atenção: <strong>fechamos às 18h</strong> no sábado.</p>
<p>Corte <em>sem</em> agendamento só pela manhã.</p>
<hr>
<p>Rua das Flores, 10<br>Centro</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Numa página bem organizada, quantos <code>&lt;h1&gt;</code> devem existir?', op: ['Nenhum', 'Um', 'Um por parágrafo', 'Seis'], c: 1, exp: 'O h1 é o assunto principal da página. As partes dela usam h2, h3...' },
              { tipo: 'quiz', p: 'Qual etiqueta marca um texto como <b>importante</b>?', op: ['<b>', '<strong>', '<big>', '<important>'], c: 1, exp: '<strong> diz que o texto é importante (e aparece em negrito). <b> só deixa negrito, sem significado.' },
              { tipo: 'completar', p: 'Complete: capítulo com h2 e seção com h3.', codigo: `<h1>Serviços</h1>
<___>Cabelo</___>
<___>Cortes</___>`, resp: ['h2', 'h2', 'h3', 'h3'], op: ['h2', 'h3', 'h5', 'p'], exp: 'Depois do h1 vem o h2, e dentro do h2 vem o h3.' },
              { tipo: 'codigo', p: 'Monte a página de promoções:<ul><li>um <code>h1</code> com <b>Promoções</b></li><li>um <code>h2</code> com <b>Cabelo</b></li><li>um parágrafo com o texto <b>Escova por R$ 35</b>, em que <b>R$ 35</b> fica dentro de um <code>&lt;strong&gt;</code></li></ul>', inicio: pagina(`  `), teste: `console.log(texto("h1"));
console.log(texto("h2"));
console.log(texto("p"));
console.log(texto("p strong"));`, saida: 'Promoções\nCabelo\nEscova por R$ 35\nR$ 35', dicas: ['Três etiquetas: <h1>, <h2> e <p>.', 'O strong vai DENTRO do parágrafo, só em volta do preço.', '<p>Escova por <strong>R$ 35</strong></p>'], sol: pagina(`  <h1>Promoções</h1>
  <h2>Cabelo</h2>
  <p>Escova por <strong>R$ 35</strong></p>`) }
            ]
          },
          {
            id: 'hc-03', titulo: 'Links e imagens', icone: '🔗',
            licao: [
              { titulo: 'Atributos: informações extras', texto: `<p>Algumas etiquetas precisam de informações extras, chamadas <b>atributos</b>. Eles vão dentro da etiqueta de abertura, no formato <code>nome="valor"</code>.</p><p>O link usa <code>&lt;a&gt;</code> (de <i>anchor</i>, âncora) com o atributo <code>href</code>, que diz para onde ir:</p><ul><li>outro site: <code>href="https://google.com"</code></li><li>outra página sua: <code>href="contato.html"</code></li><li>um pedaço da mesma página: <code>href="#precos"</code> (vai até o elemento com <code>id="precos"</code>)</li></ul><p><code>target="_blank"</code> abre numa aba nova.</p>`, codigo: `<p>Siga a gente no <a href="https://instagram.com" target="_blank">Instagram</a>.</p>
<p><a href="#precos">Ver preços</a></p>
<h2 id="precos">Preços</h2>
<p>Corte: R$ 40</p>` },
              { titulo: 'Imagens', texto: `<p>A imagem usa <code>&lt;img&gt;</code>, que <b>não tem fechamento</b>:</p><ul><li><code>src</code>: o endereço do arquivo da imagem</li><li><code>alt</code>: um texto que descreve a imagem</li></ul><p>O <code>alt</code> é obrigatório: ele aparece quando a imagem não carrega, é lido em voz alta para pessoas cegas e ajuda o Google. Descreva o que a imagem mostra: <code>alt="Fachada rosa do salão"</code>.</p><p>Um link pode ter uma imagem dentro: a imagem vira clicável.</p>`, codigo: `<img src="https://placehold.co/300x120/F06292/fff?text=Salão" alt="Logo do salão em rosa">
<p>A imagem acima é de um site externo. Se ela não aparecer, o navegador mostra o texto do alt.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual atributo diz para onde o link leva?', op: ['src', 'href', 'alt', 'link'], c: 1, exp: 'href (hypertext reference) é o destino do link. src é usado em imagens.' },
              { tipo: 'quiz', p: 'Para que serve o <code>alt</code> da imagem?', op: ['Deixar a imagem mais bonita', 'Descrever a imagem para quem não consegue vê-la', 'Dizer o tamanho', 'Abrir em nova aba'], c: 1, exp: 'O alt é lido por leitores de tela, aparece quando a imagem falha e ajuda na busca do Google.' },
              { tipo: 'completar', p: 'Complete o link para o WhatsApp, abrindo em nova aba.', codigo: `<a ___="https://wa.me/5511999999999" target="___">Chamar no WhatsApp</a>`, resp: ['href', '_blank'], op: ['href', '_blank', 'src', 'new'], exp: 'href leva o endereço; target="_blank" abre numa aba nova.' },
              { tipo: 'codigo', p: 'Crie:<ul><li>uma imagem com <code>src="logo.png"</code> e <code>alt="Logo do Salão da Ana"</code></li><li>um link com o texto <b>Agendar horário</b> que leva para <code>agenda.html</code></li></ul>', inicio: pagina(`  `), teste: `console.log(atributo("img", "src"));
console.log(atributo("img", "alt"));
console.log(texto("a"), "->", atributo("a", "href"));`, saida: 'logo.png\nLogo do Salão da Ana\nAgendar horário -> agenda.html', dicas: ['A imagem não fecha: <img src="..." alt="...">', 'O link: <a href="agenda.html">...</a>', '<a href="agenda.html">Agendar horário</a>'], sol: pagina(`  <img src="logo.png" alt="Logo do Salão da Ana">
  <a href="agenda.html">Agendar horário</a>`) }
            ]
          },
          {
            id: 'hc-04', titulo: 'Listas', icone: '📋',
            licao: [
              { titulo: 'Com bolinha ou com número', texto: `<ul><li><code>&lt;ul&gt;</code> (<i>unordered list</i>): lista <b>sem ordem</b>, com bolinhas. Ex: serviços.</li><li><code>&lt;ol&gt;</code> (<i>ordered list</i>): lista <b>numerada</b>, quando a ordem importa. Ex: passos de uma receita.</li></ul><p>Cada item, nas duas, é um <code>&lt;li&gt;</code> (<i>list item</i>).</p>`, codigo: `<h2>Serviços</h2>
<ul>
  <li>Corte</li>
  <li>Escova</li>
  <li>Manicure</li>
</ul>
<h2>Como agendar</h2>
<ol>
  <li>Escolha o serviço</li>
  <li>Escolha o horário</li>
  <li>Confirme pelo WhatsApp</li>
</ol>` },
              { titulo: 'Lista dentro de lista', texto: `<p>Um <code>li</code> pode ter outra lista dentro, para criar subitens. Os menus de quase todos os sites são feitos com listas de links!</p>`, codigo: `<ul>
  <li>Cabelo
    <ul>
      <li>Corte</li>
      <li>Coloração</li>
    </ul>
  </li>
  <li>Unhas</li>
</ul>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para os passos de "como chegar ao salão" (a ordem importa), qual lista usar?', op: ['<ul>', '<ol>', '<li>', '<list>'], c: 1, exp: 'ol = lista ordenada, numerada. Ideal para passos.' },
              { tipo: 'quiz', p: 'Qual estrutura está correta?', op: ['<ul><p>Corte</p></ul>', '<li><ul>Corte</ul></li>', '<ul><li>Corte</li></ul>', '<ul>Corte</ul>'], c: 2, exp: 'Dentro de ul/ol vão itens li. O texto fica dentro do li.' },
              { tipo: 'montar', p: 'Monte uma lista com Corte e Escova.', linhas: ['<ul>', '  <li>Corte</li>', '  <li>Escova</li>', '</ul>'], extras: ['  <ol>Escova</ol>'], exp: 'Abre o ul, um li por item, fecha o ul.' },
              { tipo: 'codigo', p: 'Crie uma lista <b>numerada</b> com os 3 passos do atendimento: <b>Lavar</b>, <b>Cortar</b>, <b>Finalizar</b>.', inicio: pagina(`  <h2>Atendimento</h2>
`), teste: `console.log("ol:", existe("ol"));
document.querySelectorAll("ol li").forEach((li, i) => console.log(i + 1, li.textContent.trim()));`, saida: 'ol: true\n1 Lavar\n2 Cortar\n3 Finalizar', dicas: ['Lista numerada é <ol>.', 'Cada passo é um <li>.', '<ol>\n  <li>Lavar</li>\n  <li>Cortar</li>\n  <li>Finalizar</li>\n</ol>'], sol: pagina(`  <h2>Atendimento</h2>
  <ol>
    <li>Lavar</li>
    <li>Cortar</li>
    <li>Finalizar</li>
  </ol>`) }
            ]
          },
          {
            id: 'hc-05', titulo: 'Tabelas', icone: '🧮',
            licao: [
              { titulo: 'Dados em linhas e colunas', texto: `<p>Tabelas servem para <b>dados</b> (preços, horários), não para montar o visual da página.</p><ul><li><code>&lt;table&gt;</code>: a tabela</li><li><code>&lt;tr&gt;</code> (<i>table row</i>): uma linha</li><li><code>&lt;th&gt;</code> (<i>table header</i>): célula de cabeçalho</li><li><code>&lt;td&gt;</code> (<i>table data</i>): célula comum</li></ul><p>Para organizar, o cabeçalho vai num <code>&lt;thead&gt;</code> e os dados num <code>&lt;tbody&gt;</code>.</p>`, codigo: `<table border="1">
  <thead>
    <tr><th>Serviço</th><th>Preço</th></tr>
  </thead>
  <tbody>
    <tr><td>Corte</td><td>R$ 40</td></tr>
    <tr><td>Escova</td><td>R$ 35</td></tr>
  </tbody>
</table>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual etiqueta cria uma <b>linha</b> da tabela?', op: ['<td>', '<tr>', '<th>', '<line>'], c: 1, exp: 'tr = table row (linha). td e th são as células dentro dela.' },
              { tipo: 'quiz', p: 'Quando usar tabela?', op: ['Para dividir a página em colunas', 'Para mostrar dados em linhas e colunas, como uma planilha', 'Para centralizar textos', 'Sempre que tiver imagem'], c: 1, exp: 'Tabela é para dados. Para o visual da página usamos CSS (flexbox e grid), que você vai aprender.' },
              { tipo: 'completar', p: 'Complete a linha de cabeçalho e uma linha de dados.', codigo: `<table>
  <tr><___>Dia</___><th>Horário</th></tr>
  <tr><___>Sábado</___><td>9h às 18h</td></tr>
</table>`, resp: ['th', 'th', 'td', 'td'], op: ['th', 'td', 'tr', 'table'], exp: 'Cabeçalho com th, dados com td.' },
              { tipo: 'codigo', p: 'Monte a tabela de horários com <code>thead</code> e <code>tbody</code>:<ul><li>cabeçalho: <b>Dia</b> e <b>Horário</b></li><li>linha 1: <b>Terça</b> e <b>9h às 19h</b></li><li>linha 2: <b>Sábado</b> e <b>8h às 14h</b></li></ul>', inicio: pagina(`  <table>

  </table>`), teste: `console.log("cabeçalho:", [...document.querySelectorAll("thead th")].map(c => c.textContent.trim()).join(" | "));
document.querySelectorAll("tbody tr").forEach(tr => console.log([...tr.querySelectorAll("td")].map(c => c.textContent.trim()).join(" | ")));`, saida: 'cabeçalho: Dia | Horário\nTerça | 9h às 19h\nSábado | 8h às 14h', dicas: ['<thead> com uma <tr> e duas <th>.', '<tbody> com duas <tr>, cada uma com duas <td>.', '<tbody>\n  <tr><td>Terça</td><td>9h às 19h</td></tr>\n  <tr><td>Sábado</td><td>8h às 14h</td></tr>\n</tbody>'], sol: pagina(`  <table>
    <thead>
      <tr><th>Dia</th><th>Horário</th></tr>
    </thead>
    <tbody>
      <tr><td>Terça</td><td>9h às 19h</td></tr>
      <tr><td>Sábado</td><td>8h às 14h</td></tr>
    </tbody>
  </table>`) }
            ]
          },
          {
            id: 'hc-06', titulo: 'Chefão: o site do salão', icone: '👑', xp: 60,
            licao: [
              { titulo: 'Juntando tudo', texto: `<p>Hora de montar a primeira versão do site do salão, só com HTML. Ainda vai ficar "sem graça" (o CSS vem depois), mas a <b>estrutura</b> é o que importa: um site bem estruturado fica fácil de deixar bonito.</p><p>Dica de profissional: escreva primeiro todo o conteúdo, de cima para baixo, como num documento. Depois cuide do visual.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Monte a página com:<ul><li>um <code>h1</code>: <b>Salão da Ana</b></li><li>uma imagem com <code>src="fachada.jpg"</code> e um <code>alt</code> (qualquer descrição, não pode ficar vazio)</li><li>um <code>h2</code>: <b>Serviços</b>, seguido de uma lista <code>ul</code> com <b>Corte</b>, <b>Escova</b> e <b>Manicure</b></li><li>um <code>h2</code>: <b>Contato</b>, seguido de um link com o texto <b>WhatsApp</b> para <code>https://wa.me/5511999999999</code></li></ul>', inicio: pagina(`  `), teste: `console.log(texto("h1"));
const alt = atributo("img", "alt");
console.log("imagem:", atributo("img", "src"), "| tem alt:", !!(alt && alt.trim()));
console.log("títulos:", [...document.querySelectorAll("h2")].map(h => h.textContent.trim()).join(", "));
console.log("serviços:", [...document.querySelectorAll("ul li")].map(li => li.textContent.trim()).join(", "));
console.log(texto("a"), "->", atributo("a", "href"));`, saida: 'Salão da Ana\nimagem: fachada.jpg | tem alt: true\ntítulos: Serviços, Contato\nserviços: Corte, Escova, Manicure\nWhatsApp -> https://wa.me/5511999999999', dicas: ['Vá de cima para baixo: h1, img, h2 + ul, h2 + a.', '<img src="fachada.jpg" alt="Fachada do salão">', '<ul>\n  <li>Corte</li>\n  <li>Escova</li>\n  <li>Manicure</li>\n</ul>', '<a href="https://wa.me/5511999999999">WhatsApp</a>'], sol: pagina(`  <h1>Salão da Ana</h1>
  <img src="fachada.jpg" alt="Fachada do salão, com porta rosa">
  <h2>Serviços</h2>
  <ul>
    <li>Corte</li>
    <li>Escova</li>
    <li>Manicure</li>
  </ul>
  <h2>Contato</h2>
  <a href="https://wa.me/5511999999999">WhatsApp</a>`) },
              { tipo: 'quiz', p: 'Seu site tem uma imagem com <code>alt=""</code>. Qual o problema?', op: ['Nenhum', 'Pessoas que usam leitor de tela não saberão o que a imagem mostra', 'A imagem não carrega', 'O link para de funcionar'], c: 1, exp: 'Um alt vazio diz "esta imagem é só enfeite". Se ela tem informação, descreva no alt.' }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'Formulários e significado', desc: 'Receber dados das pessoas e escrever HTML que o Google e todo mundo entendem.',
        fases: [
          {
            id: 'hc-07', titulo: 'Formulários', icone: '📝',
            licao: [
              { titulo: 'Campos para a pessoa preencher', texto: `<p>O <code>&lt;form&gt;</code> agrupa os campos de um formulário. Os principais:</p><ul><li><code>&lt;input&gt;</code>: um campo de uma linha (não tem fechamento)</li><li><code>&lt;label&gt;</code>: o nome do campo</li><li><code>&lt;button&gt;</code>: o botão de enviar</li></ul><p>O <code>type</code> do input muda o teclado e a validação: <code>text</code>, <code>email</code>, <code>tel</code>, <code>number</code>, <code>date</code>, <code>password</code>.</p>`, codigo: `<form>
  <label for="nome">Seu nome</label>
  <input type="text" id="nome" name="nome">

  <label for="tel">WhatsApp</label>
  <input type="tel" id="tel" name="telefone">

  <button type="submit">Agendar</button>
</form>` },
              { titulo: 'label + id: o par perfeito', texto: `<p>O <code>for</code> do label precisa ser igual ao <code>id</code> do campo. Assim:</p><ul><li>clicar no nome do campo coloca o cursor nele (ótimo no celular)</li><li>leitores de tela anunciam o nome certo</li></ul><p>O <code>name</code> é o nome com que o dado é enviado ao servidor (o back-end vai ler <code>telefone</code>, por exemplo).</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual <code>type</code> abre o teclado de números de telefone no celular?', op: ['text', 'number', 'tel', 'phone'], c: 2, exp: 'type="tel" mostra o teclado de discagem. "number" é para quantidades.' },
              { tipo: 'quiz', p: 'Para o <code>&lt;label for="email"&gt;</code> funcionar, o campo precisa ter...', op: ['name="email"', 'id="email"', 'type="email"', 'label="email"'], c: 1, exp: 'O for do label aponta para o id do campo.' },
              { tipo: 'completar', p: 'Ligue o label ao campo de e-mail.', codigo: `<label ___="email">E-mail</label>
<input type="___" id="email" name="email">`, resp: ['for', 'email'], op: ['for', 'email', 'id', 'text'], exp: 'label for="email" + input id="email". O type="email" confere se tem @.' },
              { tipo: 'codigo', p: 'Crie um formulário com:<ul><li>um campo de texto com <code>id="nome"</code> e o label <b>Nome</b></li><li>um campo de e-mail (<code>type="email"</code>) com <code>id="email"</code> e o label <b>E-mail</b></li><li>um botão <b>Cadastrar</b></li></ul>', inicio: pagina(`  <form>

  </form>`), teste: `document.querySelectorAll("form label").forEach(l => {
  const campo = document.getElementById(l.getAttribute("for"));
  console.log(l.textContent.trim(), "->", campo ? campo.getAttribute("type") : "campo não encontrado");
});
console.log("botão:", texto("form button"));`, saida: 'Nome -> text\nE-mail -> email\nbotão: Cadastrar', dicas: ['Cada campo tem um label antes, com o for igual ao id do campo.', '<label for="nome">Nome</label>\n<input type="text" id="nome">', '<label for="email">E-mail</label>\n<input type="email" id="email">\n<button>Cadastrar</button>'], sol: pagina(`  <form>
    <label for="nome">Nome</label>
    <input type="text" id="nome" name="nome">
    <label for="email">E-mail</label>
    <input type="email" id="email" name="email">
    <button type="submit">Cadastrar</button>
  </form>`) }
            ]
          },
          {
            id: 'hc-08', titulo: 'Mais campos', icone: '☑️',
            licao: [
              { titulo: 'Escolhas', texto: `<ul><li><code>&lt;select&gt;</code> com <code>&lt;option&gt;</code>: uma lista que abre (o famoso "dropdown")</li><li><code>type="radio"</code>: escolher <b>uma</b> opção. Os rádios do mesmo grupo têm o mesmo <code>name</code></li><li><code>type="checkbox"</code>: marcar <b>quantas quiser</b></li><li><code>&lt;textarea&gt;</code>: texto de várias linhas (tem fechamento)</li></ul>`, codigo: `<form>
  <label for="servico">Serviço</label>
  <select id="servico" name="servico">
    <option value="corte">Corte</option>
    <option value="escova">Escova</option>
  </select>

  <p>Período:</p>
  <label><input type="radio" name="periodo" value="manha"> Manhã</label>
  <label><input type="radio" name="periodo" value="tarde"> Tarde</label>

  <label><input type="checkbox" name="lembrete"> Quero lembrete</label>

  <label for="obs">Observações</label>
  <textarea id="obs" name="obs" rows="3"></textarea>
</form>` },
              { titulo: 'Validação sem programar', texto: `<p>O próprio navegador confere os campos antes de enviar:</p><ul><li><code>required</code>: obrigatório</li><li><code>placeholder="ex: Ana"</code>: texto de exemplo, cinza (não substitui o label!)</li><li><code>min</code> e <code>max</code>: limites para números e datas</li><li><code>minlength</code> e <code>maxlength</code>: tamanho do texto</li></ul><p>Atenção: isso ajuda a pessoa, mas o <b>servidor sempre precisa conferir de novo</b> — qualquer um pode burlar o HTML.</p>`, codigo: `<form>
  <label for="n">Nome</label>
  <input id="n" required placeholder="ex: Ana Souza" minlength="2">
  <label for="q">Quantas pessoas?</label>
  <input id="q" type="number" min="1" max="4" value="1">
  <button>Enviar</button>
</form>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para escolher <b>apenas um</b> período (manhã OU tarde), qual tipo usar?', op: ['checkbox', 'radio', 'text', 'textarea'], c: 1, exp: 'radio = uma escolha no grupo. checkbox = várias.' },
              { tipo: 'quiz', p: 'Dois botões <code>radio</code> só ficam no mesmo grupo (um desmarca o outro) se tiverem...', op: ['o mesmo id', 'o mesmo name', 'o mesmo value', 'o mesmo label'], c: 1, exp: 'O name define o grupo. O value diz qual opção foi escolhida.' },
              { tipo: 'quiz', p: 'Com <code>required</code> no HTML, o servidor ainda precisa validar os dados?', op: ['Não, o navegador já garante', 'Sim, porque dá para burlar o HTML', 'Só se for senha', 'Só no celular'], c: 1, exp: 'Qualquer pessoa pode mandar dados direto para o servidor. Validação no HTML é conforto; no servidor é segurança.' },
              { tipo: 'codigo', p: 'Crie um formulário de agendamento com:<ul><li>um <code>select</code> com <code>id="servico"</code> e três opções: <b>Corte</b>, <b>Escova</b> e <b>Unha</b></li><li>um campo de data (<code>type="date"</code>) com <code>id="dia"</code> e <code>required</code></li><li>um <code>textarea</code> com <code>id="obs"</code></li></ul>', inicio: pagina(`  <form>

  </form>`), teste: `console.log("opções:", [...document.querySelectorAll("#servico option")].map(o => o.textContent.trim()).join(", "));
const dia = document.querySelector("#dia");
console.log("dia:", dia && dia.getAttribute("type"), "| obrigatório:", !!dia && dia.hasAttribute("required"));
console.log("textarea:", existe("textarea#obs"));`, saida: 'opções: Corte, Escova, Unha\ndia: date | obrigatório: true\ntextarea: true', dicas: ['<select id="servico"> com três <option> dentro.', '<input type="date" id="dia" required>', '<textarea id="obs"></textarea> (o textarea fecha)'], sol: pagina(`  <form>
    <label for="servico">Serviço</label>
    <select id="servico" name="servico">
      <option>Corte</option>
      <option>Escova</option>
      <option>Unha</option>
    </select>
    <label for="dia">Dia</label>
    <input type="date" id="dia" name="dia" required>
    <label for="obs">Observações</label>
    <textarea id="obs" name="obs"></textarea>
    <button>Agendar</button>
  </form>`) }
            ]
          },
          {
            id: 'hc-09', titulo: 'HTML com significado', icone: '🧭',
            licao: [
              { titulo: 'Caixas com nome', texto: `<p>Antigamente tudo era <code>&lt;div&gt;</code>, uma caixa sem significado. Hoje usamos etiquetas que dizem <b>o que</b> cada parte é (HTML <b>semântico</b>):</p><ul><li><code>&lt;header&gt;</code>: o topo (logo, menu)</li><li><code>&lt;nav&gt;</code>: o menu de navegação</li><li><code>&lt;main&gt;</code>: o conteúdo principal (só um por página)</li><li><code>&lt;section&gt;</code>: uma seção com título</li><li><code>&lt;article&gt;</code>: algo que faz sentido sozinho (um post, um card de produto)</li><li><code>&lt;footer&gt;</code>: o rodapé</li></ul><p>Visualmente não muda nada. Mas o Google, os leitores de tela e quem for mexer no seu código entendem a página na hora.</p>`, codigo: `<header>
  <h1>Salão da Ana</h1>
  <nav>
    <a href="#servicos">Serviços</a> |
    <a href="#contato">Contato</a>
  </nav>
</header>
<main>
  <section id="servicos">
    <h2>Serviços</h2>
    <article><h3>Corte</h3><p>R$ 40</p></article>
  </section>
</main>
<footer>
  <p>© 2026 Salão da Ana</p>
</footer>` },
              { titulo: 'E a div?', texto: `<p>A <code>&lt;div&gt;</code> continua útil quando você só precisa de uma caixa para o <b>visual</b> (agrupar coisas para o CSS), sem significado. E a <code>&lt;span&gt;</code> é a mesma ideia, mas dentro de um texto.</p><p>Pergunte: "existe uma etiqueta que diz o que isto é?" Se sim, use ela. Se não, div.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual etiqueta marca o <b>menu</b> de navegação?', op: ['<menu>', '<nav>', '<header>', '<links>'], c: 1, exp: '<nav> agrupa os links principais de navegação. Ele costuma ficar dentro do header.' },
              { tipo: 'quiz', p: 'Quantos <code>&lt;main&gt;</code> uma página deve ter?', op: ['Nenhum', 'Um', 'Um por seção', 'Quantos quiser'], c: 1, exp: 'main é O conteúdo principal: só um por página.' },
              { tipo: 'montar', p: 'Monte a estrutura da página na ordem certa.', linhas: ['<header>', '  <h1>Salão</h1>', '</header>', '<main>', '  <h2>Serviços</h2>', '</main>', '<footer>', '  <p>Rua das Flores, 10</p>', '</footer>'], exp: 'Topo (header), conteúdo (main) e rodapé (footer).' },
              { tipo: 'codigo', p: 'Reescreva a página usando etiquetas semânticas. O resultado precisa ter:<ul><li>um <code>header</code> com o <code>h1</code> e um <code>nav</code> com 2 links</li><li>um <code>main</code> com uma <code>section</code></li><li>um <code>footer</code></li></ul>Não use nenhuma <code>div</code>.', inicio: pagina(`  <div class="topo">
    <h1>Salão da Ana</h1>
    <div class="menu">
      <a href="#servicos">Serviços</a>
      <a href="#contato">Contato</a>
    </div>
  </div>
  <div class="conteudo">
    <div id="servicos">
      <h2>Serviços</h2>
      <p>Corte, escova e unha.</p>
    </div>
  </div>
  <div class="rodape">
    <p>© 2026 Salão da Ana</p>
  </div>`), teste: `console.log("header > h1:", existe("header h1"));
console.log("links no nav:", quantos("header nav a"));
console.log("main > section:", existe("main section"));
console.log("footer:", existe("footer"));
console.log("divs:", quantos("div"));`, saida: 'header > h1: true\nlinks no nav: 2\nmain > section: true\nfooter: true\ndivs: 0', dicas: ['Troque a div "topo" por <header> e a div "menu" por <nav>.', 'A div "conteudo" vira <main> e a div "servicos" vira <section id="servicos">.', 'A div "rodape" vira <footer>. Lembre de trocar também as etiquetas de fechamento.'], sol: pagina(`  <header>
    <h1>Salão da Ana</h1>
    <nav>
      <a href="#servicos">Serviços</a>
      <a href="#contato">Contato</a>
    </nav>
  </header>
  <main>
    <section id="servicos">
      <h2>Serviços</h2>
      <p>Corte, escova e unha.</p>
    </section>
  </main>
  <footer>
    <p>© 2026 Salão da Ana</p>
  </footer>`) }
            ]
          },
          {
            id: 'hc-10', titulo: 'Acessível e encontrável', icone: '♿',
            licao: [
              { titulo: 'Para todo mundo usar', texto: `<p>Acessibilidade é fazer o site funcionar para todas as pessoas: quem não enxerga, quem usa só o teclado, quem tem a visão cansada. E o melhor: quase tudo que ajuda essas pessoas também ajuda o <b>Google</b> a entender seu site.</p><ul><li>Imagens com <code>alt</code></li><li>Campos com <code>label</code></li><li>Títulos em ordem (h1, h2, h3)</li><li>Links com texto claro: "Ver preços", e não "clique aqui"</li><li>Botão de verdade (<code>&lt;button&gt;</code>) para ações</li><li>Botão só com ícone? Dê um nome: <code>aria-label="Fechar"</code></li></ul>`, codigo: `<button aria-label="Fechar aviso">✕</button>
<a href="precos.html">Ver tabela de preços</a>` },
              { titulo: 'O head que o Google lê', texto: `<p>Dentro do <code>&lt;head&gt;</code>:</p><ul><li><code>&lt;title&gt;</code>: o título que aparece na aba e no resultado do Google</li><li><code>&lt;meta name="description" content="..."&gt;</code>: o resuminho que aparece embaixo do título no Google</li><li><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>: faz o site caber na tela do celular (sem ele, o celular mostra a página "de longe", minúscula)</li></ul><p>E na etiqueta html: <code>lang="pt-BR"</code>, para o leitor de tela falar com sotaque certo.</p>`, codigo: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Salão da Ana | Cortes e escovas no Centro</title>
  <meta name="description" content="Cortes, escovas e unhas no Centro. Agende pelo WhatsApp.">
</head>
<body>
  <h1>Salão da Ana</h1>
</body>
</html>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual texto de link é o melhor?', op: ['Clique aqui', 'Aqui', 'Ver tabela de preços', 'Link'], c: 2, exp: 'O texto do link deve dizer para onde ele leva. Quem usa leitor de tela costuma ouvir só a lista de links.' },
              { tipo: 'quiz', p: 'O que acontece num site SEM a meta viewport, aberto no celular?', op: ['Nada muda', 'A página aparece minúscula, como se fosse de computador', 'O site não abre', 'Fica sem cores'], c: 1, exp: 'Sem viewport o celular finge ter uma tela larga de computador e encolhe tudo.' },
              { tipo: 'quiz', p: 'Um botão mostra só o ícone 🔍. Como dizer a um leitor de tela o que ele faz?', op: ['title="lupa"', 'aria-label="Buscar"', 'alt="Buscar"', 'Não precisa'], c: 1, exp: 'aria-label dá um nome acessível a elementos sem texto. alt é só para imagens.' },
              { tipo: 'codigo', p: 'Arrume esta página para acessibilidade e Google:<ul><li>coloque <code>lang="pt-BR"</code> no html</li><li>adicione a meta <b>viewport</b> e a meta <b>description</b> (qualquer texto) no head</li><li>dê um <code>alt</code> para a imagem</li><li>dê o nome <b>Abrir menu</b> ao botão com <code>aria-label</code></li></ul>', inicio: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Salão da Ana</title>
</head>
<body>
  <button>☰</button>
  <h1>Salão da Ana</h1>
  <img src="equipe.jpg">
</body>
</html>
`, teste: `console.log("lang:", document.documentElement.getAttribute("lang"));
console.log("viewport:", existe('meta[name="viewport"]'));
const d = document.querySelector('meta[name="description"]');
console.log("description:", !!(d && d.getAttribute("content")));
const alt = atributo("img", "alt");
console.log("alt da imagem:", !!(alt && alt.trim()));
console.log("botão:", atributo("button", "aria-label"));`, saida: 'lang: pt-BR\nviewport: true\ndescription: true\nalt da imagem: true\nbotão: Abrir menu', dicas: ['<html lang="pt-BR">', '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="Salão no Centro">', '<img src="equipe.jpg" alt="Equipe do salão">\n<button aria-label="Abrir menu">☰</button>'], sol: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Cortes, escovas e unhas no Centro.">
  <title>Salão da Ana</title>
</head>
<body>
  <button aria-label="Abrir menu">☰</button>
  <h1>Salão da Ana</h1>
  <img src="equipe.jpg" alt="Equipe do salão sorrindo">
</body>
</html>
` }
            ]
          }
        ]
      }
    ]
  };

})();
