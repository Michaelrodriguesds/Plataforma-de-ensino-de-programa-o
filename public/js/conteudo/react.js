// =============================================================
// Trilha React
// O código roda num Web Worker com Preact (a "versão leve" do React,
// com a mesma forma de escrever) e o JSX é traduzido pelo sucrase.
//
// Nos testes e exemplos existem ferramentas prontas:
//   renderizar(<App />)        desenha o componente na página (#root)
//   clicar("button")           clica e espera a tela atualizar
//   digitar("input", "Ana")    digita num campo
//   enviar("form")             envia um formulário
//   await esperar(100)         espera (útil com fetch e useEffect)
// Os hooks (useState, useEffect...) já vêm prontos: não precisa de import.
// O campo "api" do exercício define o que o fetch responde.
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});
  C.react = {
    id: 'react', nome: 'React', icone: '⚛️', cor: '#61DAFB', ling: 'react',
    // usadas no certificado de conclusão
    habilidades: ['Componentes e JSX', 'Props, listas e renderização condicional', 'Estado com useState e eventos', 'Formulários controlados', 'Estado imutável com arrays e objetos', 'Efeitos (useEffect) e consumo de APIs', 'useRef, valores calculados e Context'],
    desc: 'A biblioteca mais usada para criar interfaces: componentes, estado, eventos e dados vindos da API.',
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'Componentes', desc: 'Montar telas com peças reutilizáveis.',
        fases: [
          {
            id: 're-01', titulo: 'O que é React', icone: '⚛️',
            licao: [
              { titulo: 'Telas feitas de peças', texto: `<p>Na trilha de JavaScript você mexeu na página com <code>document.querySelector</code> e <code>createElement</code>. Funciona, mas num app grande vira uma bagunça: é difícil saber o que muda e quando.</p><p>O <b>React</b> resolve com duas ideias:</p><ol><li>a tela é montada com <b>componentes</b>: peças como <code>&lt;Cabecalho /&gt;</code>, <code>&lt;CardServico /&gt;</code>, reutilizáveis como blocos de LEGO</li><li>você diz <b>como a tela deve ficar</b> para cada situação, e o React cuida de atualizar a página quando os dados mudam</li></ol><p>Instagram, Netflix, Airbnb e o painel de muitos bancos usam React.</p>` },
              { titulo: 'Um componente é uma função', texto: `<p>Um componente é uma <b>função</b> com nome começando em <b>maiúscula</b>, que devolve o que aparece na tela, escrito em <b>JSX</b> (um HTML dentro do JavaScript).</p><p>Para desenhar na página, aqui no CodeQuest usamos <code>renderizar(&lt;Componente /&gt;)</code>. Num projeto real é <code>createRoot(document.getElementById("root")).render(&lt;App /&gt;)</code>.</p>`, codigo: `function Boas() {
  return <h1>Bem-vinda ao Salão da Ana!</h1>;
}

renderizar(<Boas />);
console.log(document.querySelector("h1").textContent);` },
              { titulo: 'No seu computador', texto: `<p>Para criar um projeto React de verdade, com o Node instalado:</p><pre>npm create vite@latest meu-app -- --template react\ncd meu-app\nnpm install\nnpm run dev</pre><p>O <b>Vite</b> cria o projeto e abre em <code>http://localhost:5173</code>. Os componentes ficam em <code>src/</code>, cada um no seu arquivo (<code>App.jsx</code>), com <code>import</code> e <code>export</code>.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que é um componente React?', op: ['Um arquivo CSS', 'Uma função que devolve o que aparece na tela', 'Uma tabela do banco', 'Um tipo de botão'], c: 1, exp: 'Componentes são funções que devolvem JSX.' },
              { tipo: 'quiz', p: 'Qual nome de componente está certo?', op: ['cardServico', 'Card-Servico', 'CardServico', 'card_servico'], c: 2, exp: 'Componentes começam com letra MAIÚSCULA. Com minúscula, o React acha que é uma etiqueta HTML.' },
              { tipo: 'codigo', p: 'Crie o componente <code>Logo</code> que devolve um <code>&lt;h1&gt;</code> com <b>Salão da Ana</b>, e desenhe ele com <code>renderizar</code>.', inicio: `function Logo() {

}

`, teste: `console.log(document.querySelector("#root").innerHTML);`, saida: '<h1>Salão da Ana</h1>', dicas: ['A função precisa de return.', 'return <h1>Salão da Ana</h1>;', 'Depois da função: renderizar(<Logo />);'], sol: `function Logo() {
  return <h1>Salão da Ana</h1>;
}

renderizar(<Logo />);` }
            ]
          },
          {
            id: 're-02', titulo: 'JSX por dentro', icone: '🧬',
            licao: [
              { titulo: 'JavaScript entre chaves', texto: `<p>Dentro do JSX, as <b>chaves</b> <code>{ }</code> abrem uma janela para o JavaScript: qualquer valor ou conta aparece na tela.</p><pre>const nome = "Ana";\nreturn &lt;p&gt;Olá, {nome}! Hoje é dia {10 + 5}.&lt;/p&gt;;</pre><p>Regras do JSX que pegam todo iniciante:</p><ul><li><code>className</code> no lugar de <code>class</code> (class é palavra reservada do JS)</li><li>toda etiqueta fecha, inclusive as vazias: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>, <code>&lt;input /&gt;</code></li><li>o componente devolve <b>um</b> elemento por fora. Para não criar uma div à toa, use o fragmento <code>&lt;&gt;...&lt;/&gt;</code></li></ul>`, codigo: `function Cartao() {
  const servico = "Escova";
  const preco = 35;
  return (
    <>
      <h2 className="titulo">{servico.toUpperCase()}</h2>
      <p>De R$ {preco + 10} por R$ {preco}</p>
      <img src="escova.jpg" alt="Escova" />
    </>
  );
}
renderizar(<Cartao />);
console.log(document.querySelector("#root").innerHTML);` },
              { titulo: 'Estilo no JSX', texto: `<p>O atributo <code>style</code> recebe um <b>objeto</b> (por isso as chaves duplas), com os nomes em <i>camelCase</i>: <code>background-color</code> vira <code>backgroundColor</code>.</p><pre>&lt;p style={{ color: "white", backgroundColor: "#E91E63" }}&gt;Promo&lt;/p&gt;</pre><p>No dia a dia, prefira <code>className</code> e um arquivo CSS.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Como dar uma classe CSS a um elemento no JSX?', op: ['class="card"', 'className="card"', 'css="card"', 'style="card"'], c: 1, exp: 'No JSX é className.' },
              { tipo: 'quiz', p: 'O que está errado em <code>return &lt;h1&gt;Oi&lt;/h1&gt;&lt;p&gt;Tudo bem?&lt;/p&gt;;</code>?', op: ['Nada', 'Dois elementos soltos: precisa de um só por fora (div ou fragmento)', 'Falta className', 'h1 não existe no JSX'], c: 1, exp: 'Embrulhe em <>...</> ou numa <div>.' },
              { tipo: 'prever', codigo: `function Info() {
  const qtd = 3;
  return <p>{qtd > 1 ? "Clientes" : "Cliente"}: {qtd * 2}</p>;
}
renderizar(<Info />);
console.log(document.querySelector("p").textContent);`, op: ['Clientes: 6', 'Cliente: 6', 'Clientes: qtd * 2', '{qtd > 1 ? "Clientes" : "Cliente"}: 6'], c: 0, exp: 'Tudo entre chaves é calculado pelo JavaScript.' },
              { tipo: 'codigo', p: 'Crie o componente <code>Promo</code> que mostra, usando as variáveis:<ul><li>um <code>h2</code> com a classe <code>titulo</code> e o texto do <code>servico</code></li><li>um <code>p</code> com <code>Só R$ X</code>, em que X é o <code>preco</code> com 20% de desconto (<code>preco * 0.8</code>)</li></ul>Os dois dentro de um fragmento.', inicio: `function Promo() {
  const servico = "Hidratação";
  const preco = 80;

}

renderizar(<Promo />);`, teste: `console.log(document.querySelector("#root").innerHTML);`, saida: '<h2 class="titulo">Hidratação</h2><p>Só R$ 64</p>', dicas: ['return (\n  <>\n    ...\n  </>\n);', '<h2 className="titulo">{servico}</h2>', '<p>Só R$ {preco * 0.8}</p>'], sol: `function Promo() {
  const servico = "Hidratação";
  const preco = 80;
  return (
    <>
      <h2 className="titulo">{servico}</h2>
      <p>Só R$ {preco * 0.8}</p>
    </>
  );
}

renderizar(<Promo />);` }
            ]
          },
          {
            id: 're-03', titulo: 'Props', icone: '🎁',
            licao: [
              { titulo: 'Passando informações para o componente', texto: `<p>Um componente fica muito mais útil quando recebe <b>informações de fora</b>, as <b>props</b> (propriedades). Elas são passadas como atributos e chegam num objeto:</p><pre>function Card(props) {\n  return &lt;h3&gt;{props.nome}&lt;/h3&gt;;\n}\n\n&lt;Card nome="Corte" /&gt;</pre><p>O jeito mais comum é <b>desestruturar</b> já nos parênteses: <code>function Card({ nome, preco })</code>.</p><p>Textos vão entre aspas; números e outros valores, entre chaves: <code>preco={40}</code>.</p>`, codigo: `function CardServico({ nome, preco }) {
  return (
    <div className="card">
      <h3>{nome}</h3>
      <p>R$ {preco}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <CardServico nome="Corte" preco={40} />
      <CardServico nome="Escova" preco={35} />
    </div>
  );
}
renderizar(<App />);
document.querySelectorAll(".card").forEach(c => console.log(c.textContent));` },
              { titulo: 'children e valores padrão', texto: `<p>O que vai <b>entre</b> as etiquetas do componente chega na prop especial <code>children</code>. Ótimo para "caixas" reutilizáveis.</p><p>E dá para ter valor padrão: <code>function Botao({ cor = "rosa" })</code>.</p><p>Importante: props são só para <b>ler</b>. Um componente nunca muda as próprias props.</p>`, codigo: `function Caixa({ titulo, children }) {
  return <section><h2>{titulo}</h2>{children}</section>;
}
function Selo({ texto = "Novo" }) {
  return <span>[{texto}]</span>;
}
renderizar(<Caixa titulo="Avisos"><p>Fechado na segunda.</p><Selo /><Selo texto="Promo" /></Caixa>);
console.log(document.querySelector("section").textContent);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Como passar o número 40 como prop?', op: ['preco="40"', 'preco={40}', 'preco=40', 'preco:{40}'], c: 1, exp: 'Com aspas é texto; com chaves é o valor JavaScript (número).' },
              { tipo: 'quiz', p: 'Um componente pode mudar as próprias props (<code>props.nome = "x"</code>)?', op: ['Pode, é normal', 'Não: props são só para leitura; quem muda é quem passou', 'Só se for número', 'Só com useState'], c: 1, exp: 'Props vêm do pai. Para algo que muda, o React tem o estado (useState).' },
              { tipo: 'completar', p: 'Receba as props desestruturadas e mostre.', codigo: `function Cliente({ ___, cidade }) {
  return <li>{nome} ({___})</li>;
}
renderizar(<ul><Cliente nome="Bia" cidade="Santos" /></ul>);
console.log(document.querySelector("li").textContent);`, resp: ['nome', 'cidade'], op: ['nome', 'cidade', 'props', 'children'], saida: 'Bia (Santos)', exp: 'As props desestruturadas viram variáveis.' },
              { tipo: 'codigo', p: 'Crie <code>CardProfissional</code> com as props <code>nome</code>, <code>area</code> e <code>nota</code>. Ele mostra uma <code>div</code> com a classe <code>card</code> contendo um <code>h3</code> com o nome e um <code>p</code> com <code>AREA · ★ NOTA</code>. Depois, em <code>App</code>, use o card para a <b>Marta</b> (Cabelo, 4.9) e a <b>Rita</b> (Unhas, 4.7).', inicio: `function CardProfissional() {

}

function App() {
  return (
    <div>

    </div>
  );
}

renderizar(<App />);`, teste: `document.querySelectorAll(".card").forEach(c => console.log(c.querySelector("h3").textContent, "|", c.querySelector("p").textContent));`, saida: 'Marta | Cabelo · ★ 4.9\nRita | Unhas · ★ 4.7', dicas: ['function CardProfissional({ nome, area, nota }) { return (...); }', '<div className="card"><h3>{nome}</h3><p>{area} · ★ {nota}</p></div>', '<CardProfissional nome="Marta" area="Cabelo" nota={4.9} />'], sol: `function CardProfissional({ nome, area, nota }) {
  return (
    <div className="card">
      <h3>{nome}</h3>
      <p>{area} · ★ {nota}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <CardProfissional nome="Marta" area="Cabelo" nota={4.9} />
      <CardProfissional nome="Rita" area="Unhas" nota={4.7} />
    </div>
  );
}

renderizar(<App />);` }
            ]
          },
          {
            id: 're-04', titulo: 'Listas e keys', icone: '📜',
            licao: [
              { titulo: 'map: um elemento para cada item', texto: `<p>Os dados quase sempre vêm em <b>arrays</b> (da API, do banco). Para mostrar uma lista, use o <code>map</code> do JavaScript, devolvendo JSX para cada item:</p><pre>{servicos.map(s =&gt; &lt;li key={s.id}&gt;{s.nome}&lt;/li&gt;)}</pre><p>A prop <code>key</code> é obrigatória: um valor <b>único e estável</b> (o id) que ajuda o React a saber qual item é qual quando a lista muda. Evite usar a posição (<code>index</code>) quando a lista pode mudar de ordem.</p>`, codigo: `const servicos = [
  { id: 1, nome: "Corte", preco: 40 },
  { id: 2, nome: "Escova", preco: 35 },
  { id: 3, nome: "Manicure", preco: 25 }
];

function Lista() {
  return (
    <ul>
      {servicos.map(s => (
        <li key={s.id}>{s.nome}: R$ {s.preco}</li>
      ))}
    </ul>
  );
}
renderizar(<Lista />);
console.log(document.querySelectorAll("li").length);` },
              { titulo: 'filter + map', texto: `<p>Quer mostrar só alguns? Filtre antes de mapear: <code>servicos.filter(s =&gt; s.preco &lt; 40).map(...)</code>. E <code>sort</code> para ordenar (numa cópia: <code>[...lista].sort(...)</code>).</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para que serve a prop <code>key</code> nas listas?', op: ['Estilizar', 'Identificar cada item para o React atualizar a lista certo', 'Ordenar a lista', 'É opcional e não faz nada'], c: 1, exp: 'Com keys estáveis, o React sabe qual item mudou, entrou ou saiu.' },
              { tipo: 'prever', codigo: `const nomes = ["Ana", "Bia", "Caio"];
function L() {
  return <p>{nomes.filter(n => n !== "Bia").map(n => <b key={n}>{n}</b>)}</p>;
}
renderizar(<L />);
console.log(document.querySelector("p").innerHTML);`, op: ['<b>Ana</b><b>Caio</b>', '<b>Bia</b>', 'Ana,Caio', '<b>Ana</b><b>Bia</b><b>Caio</b>'], c: 0, exp: 'O filter tira a Bia e o map cria um <b> para cada nome restante.' },
              { tipo: 'codigo', p: 'Mostre a agenda numa <code>ul</code>: um <code>li</code> para cada agendamento <b>não cancelado</b>, no formato <code>10:00 - Ana (Corte)</code>, usando o <code>id</code> como key.', inicio: `const agenda = [
  { id: 1, hora: "09:00", cliente: "Bia", servico: "Escova", cancelado: true },
  { id: 2, hora: "10:00", cliente: "Ana", servico: "Corte", cancelado: false },
  { id: 3, hora: "11:30", cliente: "Caio", servico: "Barba", cancelado: false }
];

function Agenda() {

}

renderizar(<Agenda />);`, teste: `document.querySelectorAll("ul li").forEach(li => console.log(li.textContent));`, usar: [['\\.map\\(', 'Use map para criar os itens'], ['key=', 'Coloque a key em cada item']], saida: '10:00 - Ana (Corte)\n11:30 - Caio (Barba)', dicas: ['return <ul>{ ... }</ul>;', 'agenda.filter(a => !a.cancelado).map(a => ...)', '<li key={a.id}>{a.hora} - {a.cliente} ({a.servico})</li>'], sol: `const agenda = [
  { id: 1, hora: "09:00", cliente: "Bia", servico: "Escova", cancelado: true },
  { id: 2, hora: "10:00", cliente: "Ana", servico: "Corte", cancelado: false },
  { id: 3, hora: "11:30", cliente: "Caio", servico: "Barba", cancelado: false }
];

function Agenda() {
  return (
    <ul>
      {agenda.filter(a => !a.cancelado).map(a => (
        <li key={a.id}>{a.hora} - {a.cliente} ({a.servico})</li>
      ))}
    </ul>
  );
}

renderizar(<Agenda />);` }
            ]
          },
          {
            id: 're-05', titulo: 'Mostrar ou esconder', icone: '🎭',
            licao: [
              { titulo: 'Renderização condicional', texto: `<p>Três jeitos de mostrar algo só às vezes:</p><ul><li><code>{logado && &lt;p&gt;Olá!&lt;/p&gt;}</code>: mostra se for verdadeiro</li><li><code>{estoque &gt; 0 ? &lt;Comprar /&gt; : &lt;Esgotado /&gt;}</code>: um ou outro</li><li><code>if (carregando) return &lt;p&gt;Carregando...&lt;/p&gt;;</code>: sair antes, com outro conteúdo</li></ul><p>Cuidado com o <code>&&</code> com números: <code>{qtd && ...}</code> com qtd 0 mostra um <b>0</b> na tela. Use <code>{qtd &gt; 0 && ...}</code>.</p>`, codigo: `function Status({ vagas }) {
  if (vagas === undefined) return <p>Carregando...</p>;
  return (
    <div>
      {vagas > 0 ? <p>{vagas} horários livres</p> : <p>Agenda lotada</p>}
      {vagas > 0 && vagas <= 2 && <strong>Últimas vagas!</strong>}
    </div>
  );
}
renderizar(<div><Status /><Status vagas={2} /><Status vagas={0} /></div>);
console.log(document.querySelector("#root").textContent);` }
            ],
            ex: [
              { tipo: 'prever', codigo: `function Aviso({ qtd }) {
  return <p>{qtd && "Tem mensagens"}</p>;
}
renderizar(<Aviso qtd={0} />);
console.log(document.querySelector("p").textContent);`, op: ['0', '(vazio)', 'Tem mensagens', 'false'], c: 0, exp: 'Com 0, o && devolve o próprio 0, e o React mostra números. Use qtd > 0 && ...' },
              { tipo: 'quiz', p: 'Qual mostra <b>Aberto</b> ou <b>Fechado</b> conforme <code>aberto</code>?', op: ['{aberto && "Aberto" && "Fechado"}', '{aberto ? "Aberto" : "Fechado"}', '{if (aberto) "Aberto"}', '{aberto || "Aberto"}'], c: 1, exp: 'O ternário escolhe entre duas opções. if não funciona dentro das chaves do JSX.' },
              { tipo: 'codigo', p: 'Crie <code>Cartao</code> com as props <code>nome</code>, <code>preco</code> e <code>promo</code> (verdadeiro/falso):<ul><li>sempre mostra um <code>h3</code> com o nome</li><li>se <code>promo</code> for verdadeiro, mostra <code>&lt;p className="promo"&gt;De R$ PRECO por R$ PRECO_COM_10%_OFF&lt;/p&gt;</code>; senão <code>&lt;p&gt;R$ PRECO&lt;/p&gt;</code></li><li>se o preço for maior que 100, mostra também <code>&lt;small&gt;Parcele em 3x&lt;/small&gt;</code></li></ul>Tudo dentro de uma <code>div</code>.', inicio: `function Cartao({ nome, preco, promo }) {

}

renderizar(
  <section>
    <Cartao nome="Corte" preco={40} promo={false} />
    <Cartao nome="Coloração" preco={120} promo={true} />
  </section>
);`, teste: `document.querySelectorAll("section > div").forEach(d => console.log(d.innerHTML));`, saida: '<h3>Corte</h3><p>R$ 40</p>\n<h3>Coloração</h3><p class="promo">De R$ 120 por R$ 108</p><small>Parcele em 3x</small>', dicas: ['Use o ternário para escolher entre os dois <p>.', '{promo ? <p className="promo">De R$ {preco} por R$ {preco * 0.9}</p> : <p>R$ {preco}</p>}', '{preco > 100 && <small>Parcele em 3x</small>}'], sol: `function Cartao({ nome, preco, promo }) {
  return (
    <div>
      <h3>{nome}</h3>
      {promo ? <p className="promo">De R$ {preco} por R$ {preco * 0.9}</p> : <p>R$ {preco}</p>}
      {preco > 100 && <small>Parcele em 3x</small>}
    </div>
  );
}

renderizar(
  <section>
    <Cartao nome="Corte" preco={40} promo={false} />
    <Cartao nome="Coloração" preco={120} promo={true} />
  </section>
);` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'Estado e eventos', desc: 'Telas que reagem: cliques, formulários e listas que mudam.',
        fases: [
          {
            id: 're-06', titulo: 'useState', icone: '🔄',
            licao: [
              { titulo: 'A memória do componente', texto: `<p>Uma variável comum dentro do componente <b>não serve</b> para coisas que mudam: o React não percebe a mudança e não redesenha a tela.</p><p>Para isso existe o <b>estado</b>, com o hook <code>useState</code>:</p><pre>const [contador, setContador] = useState(0);</pre><ul><li><code>contador</code>: o valor atual</li><li><code>setContador</code>: a função para trocar o valor. Quando você chama, o React <b>redesenha</b> o componente</li><li><code>0</code>: o valor inicial</li></ul><p>É o coração do React: <b>mudou o estado → a tela se atualiza sozinha</b>.</p>`, codigo: `function Contador() {
  const [qtd, setQtd] = useState(0);
  return (
    <div>
      <p>Clientes atendidos hoje: {qtd}</p>
      <button onClick={() => setQtd(qtd + 1)}>+1</button>
    </div>
  );
}
renderizar(<Contador />);
clicar("button");
clicar("button");
console.log(document.querySelector("p").textContent);` },
              { titulo: 'Regras dos hooks', texto: `<ul><li>hooks (as funções <code>use...</code>) só são chamados <b>no topo</b> do componente, nunca dentro de if ou for</li><li>nunca mude o estado direto (<code>qtd = 5</code>): sempre use a função <code>setQtd(5)</code></li><li>se o novo valor depende do anterior, a forma mais segura é passar uma função: <code>setQtd(q =&gt; q + 1)</code></li></ul>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Em <code>const [cor, setCor] = useState("rosa")</code>, como trocar a cor para azul?', op: ['cor = "azul"', 'setCor("azul")', 'useState("azul")', 'cor.set("azul")'], c: 1, exp: 'Só a função set avisa o React para redesenhar.' },
              { tipo: 'prever', codigo: `function C() {
  const [n, setN] = useState(10);
  return <button onClick={() => setN(n - 3)}>{n}</button>;
}
renderizar(<C />);
clicar("button");
clicar("button");
console.log(document.querySelector("button").textContent);`, op: ['4', '7', '10', '-6'], c: 0, exp: '10 → 7 → 4. A cada clique o estado muda e a tela acompanha.' },
              { tipo: 'codigo', p: 'Crie <code>Curtir</code>: um botão que mostra <code>❤️ N</code> (N começa em 0) e soma 1 a cada clique. Quando chegar a 3 ou mais, aparece também um <code>&lt;p&gt;Popular!&lt;/p&gt;</code> embaixo do botão (os dois dentro de uma <code>div</code>).', inicio: `function Curtir() {

}

renderizar(<Curtir />);`, teste: `const b = () => document.querySelector("button").textContent;
clicar("button"); clicar("button");
console.log(b(), "|", document.querySelector("p") ? "popular" : "normal");
clicar("button");
console.log(b(), "|", document.querySelector("p") ? document.querySelector("p").textContent : "normal");`, usar: [['useState', 'Use useState']], saida: '❤️ 2 | normal\n❤️ 3 | Popular!', dicas: ['const [curtidas, setCurtidas] = useState(0);', '<button onClick={() => setCurtidas(curtidas + 1)}>❤️ {curtidas}</button>', '{curtidas >= 3 && <p>Popular!</p>}'], sol: `function Curtir() {
  const [curtidas, setCurtidas] = useState(0);
  return (
    <div>
      <button onClick={() => setCurtidas(curtidas + 1)}>❤️ {curtidas}</button>
      {curtidas >= 3 && <p>Popular!</p>}
    </div>
  );
}

renderizar(<Curtir />);` }
            ]
          },
          {
            id: 're-07', titulo: 'Eventos', icone: '👆',
            licao: [
              { titulo: 'onClick, onChange e companhia', texto: `<p>Os eventos são props com nome em camelCase: <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>, <code>onMouseEnter</code>. Elas recebem uma <b>função</b>:</p><ul><li><code>onClick={salvar}</code>: passa a função (certo)</li><li><code>onClick={salvar()}</code>: <b>chama</b> na hora em que desenha (errado!)</li><li><code>onClick={() =&gt; escolher("Corte")}</code>: para passar um valor, use uma setinha</li></ul>`, codigo: `function Escolha() {
  const [servico, setServico] = useState("nenhum");
  function limpar() {
    setServico("nenhum");
  }
  return (
    <div>
      <p>Escolhido: {servico}</p>
      <button onClick={() => setServico("Corte")}>Corte</button>
      <button onClick={() => setServico("Escova")}>Escova</button>
      <button onClick={limpar}>Limpar</button>
    </div>
  );
}
renderizar(<Escolha />);
clicar("button:nth-of-type(2)");
console.log(document.querySelector("p").textContent);
clicar("button:nth-of-type(3)");
console.log(document.querySelector("p").textContent);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual está certo para chamar <code>apagar(5)</code> no clique?', op: ['onClick={apagar(5)}', 'onClick={() => apagar(5)}', 'onClick="apagar(5)"', 'onclick={apagar, 5}'], c: 1, exp: 'Com apagar(5) direto, a função roda na hora de desenhar. A setinha cria uma função que só roda no clique.' },
              { tipo: 'codigo', p: 'Crie <code>Abas</code> com três botões: <b>Cabelo</b>, <b>Unhas</b> e <b>Química</b>. A aba escolhida (começa em Cabelo) aparece num <code>&lt;h2&gt;</code>, e o botão dela ganha a classe <code>ativo</code> (os outros ficam sem classe: <code>className={... ? "ativo" : ""}</code>).', inicio: `const ABAS = ["Cabelo", "Unhas", "Química"];

function Abas() {

}

renderizar(<Abas />);`, teste: `const mostrar = () => console.log(document.querySelector("h2").textContent, "|", [...document.querySelectorAll("button")].map(b => b.className || "-").join(" "));
mostrar();
clicar("button:nth-of-type(3)");
mostrar();`, saida: 'Cabelo | ativo - -\nQuímica | - - ativo', dicas: ['const [aba, setAba] = useState("Cabelo");', '{ABAS.map(a => <button key={a} className={a === aba ? "ativo" : ""} onClick={() => setAba(a)}>{a}</button>)}', 'Embaixo dos botões: <h2>{aba}</h2>, tudo dentro de uma <div>.'], sol: `const ABAS = ["Cabelo", "Unhas", "Química"];

function Abas() {
  const [aba, setAba] = useState("Cabelo");
  return (
    <div>
      {ABAS.map(a => (
        <button key={a} className={a === aba ? "ativo" : ""} onClick={() => setAba(a)}>{a}</button>
      ))}
      <h2>{aba}</h2>
    </div>
  );
}

renderizar(<Abas />);` }
            ]
          },
          {
            id: 're-08', titulo: 'Formulários controlados', icone: '📝',
            licao: [
              { titulo: 'O campo e o estado andam juntos', texto: `<p>No React, o valor de um campo fica no <b>estado</b>. O campo mostra o estado (<code>value</code>) e, a cada tecla, o <code>onChange</code> atualiza o estado:</p><pre>const [nome, setNome] = useState("");\n&lt;input value={nome} onChange={e =&gt; setNome(e.target.value)} /&gt;</pre><p>Isso se chama <b>componente controlado</b>: o React sabe sempre o que está digitado, e você pode validar, limpar ou formatar na hora.</p>`, codigo: `function Saudacao() {
  const [nome, setNome] = useState("");
  return (
    <div>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
      <p>{nome ? "Olá, " + nome + "!" : "Digite seu nome"}</p>
      <small>{nome.length}/30</small>
    </div>
  );
}
renderizar(<Saudacao />);
digitar("input", "Ana");
console.log(document.querySelector("p").textContent, document.querySelector("small").textContent);` },
              { titulo: 'Enviando', texto: `<p>No <code>&lt;form onSubmit={enviar}&gt;</code>, a função recebe o evento: chame <code>e.preventDefault()</code> para a página não recarregar. Depois de usar os dados, limpe os campos com o set.</p>`, codigo: `function Recado() {
  const [texto, setTexto] = useState("");
  const [enviados, setEnviados] = useState([]);
  function enviar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviados([...enviados, texto.trim()]);
    setTexto("");
  }
  return (
    <form onSubmit={enviar}>
      <input value={texto} onChange={e => setTexto(e.target.value)} />
      <button>Enviar</button>
      <p>{enviados.join(", ")}</p>
    </form>
  );
}
renderizar(<Recado />);
digitar("input", "Oi!"); enviar("form");
digitar("input", "Tudo bem?"); enviar("form");
console.log(document.querySelector("p").textContent, "| campo:", JSON.stringify(document.querySelector("input").value));` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que acontece com <code>&lt;input value={nome} /&gt;</code> sem <code>onChange</code>?', op: ['Funciona normal', 'O campo fica travado: o que você digita some, porque o estado nunca muda', 'Dá erro de sintaxe', 'O valor vira undefined'], c: 1, exp: 'O value manda no campo. Sem onChange para atualizar o estado, ele volta sempre ao mesmo valor.' },
              { tipo: 'completar', p: 'Ligue o campo ao estado.', codigo: `function Busca() {
  const [termo, setTermo] = useState("");
  return <input value={___} onChange={e => setTermo(e.target.___)} />;
}
renderizar(<Busca />);
digitar("input", "escova");
console.log(document.querySelector("input").value);`, resp: ['termo', 'value'], op: ['termo', 'value', 'setTermo', 'text'], saida: 'escova', exp: 'value={termo} e e.target.value no onChange.' },
              { tipo: 'codigo', p: 'Crie <code>Cadastro</code>: um <code>form</code> com dois campos (<code>input#nome</code> e <code>input#tel</code>) e um botão. Ao enviar:<ul><li>se o nome estiver vazio, mostra <code>&lt;p className="erro"&gt;Preencha o nome&lt;/p&gt;</code></li><li>senão mostra <code>&lt;p className="ok"&gt;Cadastrado: NOME (TEL)&lt;/p&gt;</code> e limpa os dois campos</li></ul>', inicio: `function Cadastro() {

}

renderizar(<Cadastro />);`, teste: `const msg = () => { const p = document.querySelector("p"); return p ? p.className + ": " + p.textContent : "(sem mensagem)"; };
enviar("form");
console.log(msg());
digitar("#nome", "Bia"); digitar("#tel", "9999");
enviar("form");
console.log(msg());
console.log("campos:", JSON.stringify(document.querySelector("#nome").value), JSON.stringify(document.querySelector("#tel").value));`, saida: 'erro: Preencha o nome\nok: Cadastrado: Bia (9999)\ncampos: "" ""', dicas: ['Três estados: nome, tel e mensagem (pode ser um objeto { tipo, texto } ou null).', 'function enviar(e) { e.preventDefault(); if (!nome.trim()) { setMsg({ tipo: "erro", texto: "Preencha o nome" }); return; } ... }', '{msg && <p className={msg.tipo}>{msg.texto}</p>}'], sol: `function Cadastro() {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [msg, setMsg] = useState(null);

  function enviar(e) {
    e.preventDefault();
    if (!nome.trim()) {
      setMsg({ tipo: "erro", texto: "Preencha o nome" });
      return;
    }
    setMsg({ tipo: "ok", texto: "Cadastrado: " + nome + " (" + tel + ")" });
    setNome("");
    setTel("");
  }

  return (
    <form onSubmit={enviar}>
      <input id="nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input id="tel" value={tel} onChange={e => setTel(e.target.value)} />
      <button>Cadastrar</button>
      {msg && <p className={msg.tipo}>{msg.texto}</p>}
    </form>
  );
}

renderizar(<Cadastro />);` }
            ]
          },
          {
            id: 're-09', titulo: 'Arrays e objetos no estado', icone: '🧺',
            licao: [
              { titulo: 'Nunca mude, sempre crie um novo', texto: `<p>O React percebe a mudança comparando o valor antigo com o novo. Se você der <code>push</code> no mesmo array, para ele "é o mesmo array" e a tela <b>não atualiza</b>. A regra: crie sempre uma <b>cópia nova</b>.</p><table border="1" cellpadding="4"><tr><th>Quero</th><th>Faça</th></tr><tr><td>adicionar</td><td><code>setLista([...lista, novo])</code></td></tr><tr><td>remover</td><td><code>setLista(lista.filter(x =&gt; x.id !== id))</code></td></tr><tr><td>alterar um</td><td><code>setLista(lista.map(x =&gt; x.id === id ? { ...x, feito: true } : x))</code></td></tr><tr><td>mudar campo de objeto</td><td><code>setForm({ ...form, nome: "Ana" })</code></td></tr></table><p>Os <code>...</code> (spread) copiam tudo e você muda só o que precisa.</p>`, codigo: `function Fila() {
  const [fila, setFila] = useState([{ id: 1, nome: "Ana", chamada: false }]);
  const proximoId = fila.length ? Math.max(...fila.map(c => c.id)) + 1 : 1;
  return (
    <div>
      <button id="add" onClick={() => setFila([...fila, { id: proximoId, nome: "Cliente " + proximoId, chamada: false }])}>Chegou</button>
      <ul>
        {fila.map(c => (
          <li key={c.id} className={c.chamada ? "chamada" : ""}>
            {c.nome}
            <button onClick={() => setFila(fila.map(x => x.id === c.id ? { ...x, chamada: true } : x))}>Chamar</button>
            <button onClick={() => setFila(fila.filter(x => x.id !== c.id))}>Saiu</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
renderizar(<Fila />);
clicar("#add"); clicar("#add");
clicar("li:nth-child(1) button:nth-of-type(1)");
clicar("li:nth-child(2) button:nth-of-type(2)");
document.querySelectorAll("li").forEach(li => console.log(li.firstChild.textContent, li.className || "-"));` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Por que <code>lista.push(novo); setLista(lista);</code> não atualiza a tela?', op: ['push não existe', 'É o mesmo array: o React compara e acha que nada mudou', 'Precisa de await', 'Falta key'], c: 1, exp: 'Crie um array novo: setLista([...lista, novo]).' },
              { tipo: 'quiz', p: 'Como remover o item de id 3?', op: ['lista.splice(3, 1)', 'setLista(lista.filter(x => x.id !== 3))', 'delete lista[3]', 'setLista(lista.pop())'], c: 1, exp: 'filter cria um array novo sem o item.' },
              { tipo: 'codigo', p: 'Crie <code>Carrinho</code> com o estado <code>itens</code> (começa vazio):<ul><li>cada botão da lista <code>PRODUTOS</code> (classe <code>add</code>) adiciona o produto no carrinho; se ele já estiver lá, soma 1 na <code>qtd</code> (use <code>map</code> com spread)</li><li>mostra um <code>li</code> por item com um <code>&lt;span&gt;NOME x QTD&lt;/span&gt;</code> e um botão <code>Remover</code> (classe <code>rem</code>) que tira o item</li><li>um <code>&lt;p id="total"&gt;Total: R$ X&lt;/p&gt;</code> com a soma de preço × qtd</li></ul>', inicio: `const PRODUTOS = [
  { id: 1, nome: "Shampoo", preco: 30 },
  { id: 2, nome: "Máscara", preco: 45 }
];

function Carrinho() {
  const [itens, setItens] = useState([]);

}

renderizar(<Carrinho />);`, teste: `clicar(".add:nth-of-type(1)"); clicar(".add:nth-of-type(2)"); clicar(".add:nth-of-type(1)");
document.querySelectorAll("li span").forEach(s => console.log(s.textContent));
console.log(document.querySelector("#total").textContent);
clicar("li:nth-child(2) .rem");
console.log(document.querySelectorAll("li").length, document.querySelector("#total").textContent);`, saida: 'Shampoo x 2\nMáscara x 1\nTotal: R$ 105\n1 Total: R$ 60', dicas: ['function adicionar(p) { const existe = itens.find(i => i.id === p.id); if (existe) setItens(itens.map(i => i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i)); else setItens([...itens, { ...p, qtd: 1 }]); }', 'const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);', '<li key={i.id}><span>{i.nome} x {i.qtd}</span><button className="rem" onClick={() => setItens(itens.filter(x => x.id !== i.id))}>Remover</button></li>'], sol: `const PRODUTOS = [
  { id: 1, nome: "Shampoo", preco: 30 },
  { id: 2, nome: "Máscara", preco: 45 }
];

function Carrinho() {
  const [itens, setItens] = useState([]);

  function adicionar(p) {
    const existe = itens.find(i => i.id === p.id);
    if (existe) {
      setItens(itens.map(i => i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i));
    } else {
      setItens([...itens, { ...p, qtd: 1 }]);
    }
  }

  const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);

  return (
    <div>
      {PRODUTOS.map(p => (
        <button key={p.id} className="add" onClick={() => adicionar(p)}>{p.nome}</button>
      ))}
      <ul>
        {itens.map(i => (
          <li key={i.id}>
            <span>{i.nome} x {i.qtd}</span>
            <button className="rem" onClick={() => setItens(itens.filter(x => x.id !== i.id))}>Remover</button>
          </li>
        ))}
      </ul>
      <p id="total">Total: R$ {total}</p>
    </div>
  );
}

renderizar(<Carrinho />);` }
            ]
          },
          {
            id: 're-10', titulo: 'Chefão: lista de tarefas', icone: '👑', xp: 60,
            licao: [
              { titulo: 'O clássico, agora em React', texto: `<p>Lembra da lista de tarefas que você fez com <code>createElement</code> na trilha de JavaScript? Compare como fica em React: você só descreve a tela a partir do array, e nunca mais precisa "limpar e redesenhar" na mão.</p><p>Esse é o exercício mais famoso de React. Se você fizer sozinho, já entende o essencial! 💪</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Crie o app <code>Tarefas</code>:<ul><li>um <code>form</code> com um <code>input</code>: ao enviar, adiciona <code>{ id, texto, feita: false }</code> (ignore texto vazio) e limpa o campo</li><li>uma <code>ul</code> com um <code>li</code> por tarefa: o texto dentro de um <code>&lt;span&gt;</code> que, ao ser clicado, inverte o <code>feita</code>; o <code>li</code> ganha a classe <code>feita</code> quando estiver feita; e um botão <code>✕</code> que apaga</li><li>um <code>&lt;p id="resumo"&gt;</code> com <code>N de M feitas</code></li><li>um botão <code>#limpar</code>, que só aparece se tiver alguma feita, e apaga todas as feitas</li></ul>', inicio: `function Tarefas() {

}

renderizar(<Tarefas />);`, teste: `for (const t of ["Comprar gel", "  ", "Ligar para Bia", "Pagar luz"]) { digitar("input", t); enviar("form"); }
console.log(document.querySelector("#resumo").textContent, "| botão limpar:", !!document.querySelector("#limpar"));
clicar("li:nth-child(2) span");
clicar("li:nth-child(3) span");
document.querySelectorAll("li").forEach(li => console.log(li.querySelector("span").textContent, li.className || "-"));
console.log(document.querySelector("#resumo").textContent);
clicar("li:nth-child(1) button");
clicar("#limpar");
console.log([...document.querySelectorAll("li span")].map(s => s.textContent), document.querySelector("#resumo").textContent, !!document.querySelector("#limpar"));`, saida: "0 de 3 feitas | botão limpar: false\nComprar gel -\nLigar para Bia feita\nPagar luz feita\n2 de 3 feitas\n[] 0 de 0 feitas false", dicas: ['Estados: tarefas (array) e texto (o campo).', 'Alternar: setTarefas(tarefas.map(t => t.id === id ? { ...t, feita: !t.feita } : t))', 'const feitas = tarefas.filter(t => t.feita).length; e {feitas > 0 && <button id="limpar" onClick={() => setTarefas(tarefas.filter(t => !t.feita))}>Limpar feitas</button>}', 'Para o id use um contador: Date.now() pode repetir se for muito rápido; use tarefas.length ? Math.max(...tarefas.map(t => t.id)) + 1 : 1'], sol: `function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState("");

  function adicionar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    const id = tarefas.length ? Math.max(...tarefas.map(t => t.id)) + 1 : 1;
    setTarefas([...tarefas, { id, texto: texto.trim(), feita: false }]);
    setTexto("");
  }

  function alternar(id) {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, feita: !t.feita } : t));
  }

  function apagar(id) {
    setTarefas(tarefas.filter(t => t.id !== id));
  }

  const feitas = tarefas.filter(t => t.feita).length;

  return (
    <div>
      <form onSubmit={adicionar}>
        <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Nova tarefa" />
        <button>Adicionar</button>
      </form>
      <ul>
        {tarefas.map(t => (
          <li key={t.id} className={t.feita ? "feita" : ""}>
            <span onClick={() => alternar(t.id)}>{t.texto}</span>
            <button onClick={() => apagar(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p id="resumo">{feitas} de {tarefas.length} feitas</p>
      {feitas > 0 && <button id="limpar" onClick={() => setTarefas(tarefas.filter(t => !t.feita))}>Limpar feitas</button>}
    </div>
  );
}

renderizar(<Tarefas />);` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 3
      {
        titulo: 'Apps de verdade', desc: 'Componentes conversando, efeitos, dados da API e contexto.',
        fases: [
          {
            id: 're-11', titulo: 'Elevando o estado', icone: '⬆️',
            licao: [
              { titulo: 'Dois componentes, um dado', texto: `<p>Quando dois componentes precisam do <b>mesmo</b> dado (a lista e o contador do carrinho, por exemplo), o estado sobe para o <b>pai mais próximo</b> dos dois. O pai:</p><ul><li>passa o <b>valor</b> para baixo, por props</li><li>passa uma <b>função</b> para os filhos avisarem que algo mudou</li></ul><p>Os dados descem pelas props; os avisos sobem pelas funções. Esse "fluxo de mão única" é o que deixa apps React previsíveis.</p>`, codigo: `function Seletor({ valor, aoMudar }) {
  return (
    <div>
      {["P", "M", "G"].map(t => (
        <button key={t} onClick={() => aoMudar(t)} className={t === valor ? "ativo" : ""}>{t}</button>
      ))}
    </div>
  );
}
function Resumo({ tamanho }) {
  const preco = { P: 30, M: 45, G: 60 }[tamanho];
  return <p>Corte tamanho {tamanho}: R$ {preco}</p>;
}
function App() {
  const [tamanho, setTamanho] = useState("M");
  return (
    <>
      <Seletor valor={tamanho} aoMudar={setTamanho} />
      <Resumo tamanho={tamanho} />
    </>
  );
}
renderizar(<App />);
clicar("button:nth-of-type(3)");
console.log(document.querySelector("p").textContent);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Um filho precisa avisar o pai que algo mudou. Como?', op: ['Mudando as props', 'Chamando uma função que o pai passou por props', 'Com document.querySelector', 'Não é possível'], c: 1, exp: 'O pai passa uma função (ex: aoMudar) e o filho chama.' },
              { tipo: 'codigo', p: 'O app tem dois filhos que precisam do mesmo dado. Faça o <code>App</code> guardar o estado <code>busca</code> e passar:<ul><li>para <code>CampoBusca</code>: <code>valor</code> e <code>aoDigitar</code></li><li>para <code>ListaClientes</code>: <code>filtro</code></li></ul>E complete os filhos: o campo é controlado pelas props, e a lista mostra só os nomes que contêm o filtro (sem diferenciar maiúsculas).', inicio: `const CLIENTES = ["Ana Souza", "Bia Lima", "Caio Rocha", "Duda Lima"];

function CampoBusca({ valor, aoDigitar }) {
  return <input />;
}

function ListaClientes({ filtro }) {
  return <ul>{CLIENTES.map(c => <li key={c}>{c}</li>)}</ul>;
}

function App() {
  return (
    <div>
      <CampoBusca />
      <ListaClientes />
    </div>
  );
}

renderizar(<App />);`, teste: `const nomes = () => [...document.querySelectorAll("li")].map(li => li.textContent);
console.log(nomes());
digitar("input", "LIMA");
console.log(nomes());
digitar("input", "ro");
console.log(nomes(), document.querySelector("input").value);`, saida: "[ 'Ana Souza', 'Bia Lima', 'Caio Rocha', 'Duda Lima' ]\n[ 'Bia Lima', 'Duda Lima' ]\n[ 'Caio Rocha' ] ro", dicas: ['No App: const [busca, setBusca] = useState("");', '<CampoBusca valor={busca} aoDigitar={setBusca} /> e <ListaClientes filtro={busca} />', 'No campo: <input value={valor} onChange={e => aoDigitar(e.target.value)} />. Na lista: CLIENTES.filter(c => c.toLowerCase().includes(filtro.toLowerCase()))'], sol: `const CLIENTES = ["Ana Souza", "Bia Lima", "Caio Rocha", "Duda Lima"];

function CampoBusca({ valor, aoDigitar }) {
  return <input value={valor} onChange={e => aoDigitar(e.target.value)} />;
}

function ListaClientes({ filtro }) {
  const lista = CLIENTES.filter(c => c.toLowerCase().includes(filtro.toLowerCase()));
  return <ul>{lista.map(c => <li key={c}>{c}</li>)}</ul>;
}

function App() {
  const [busca, setBusca] = useState("");
  return (
    <div>
      <CampoBusca valor={busca} aoDigitar={setBusca} />
      <ListaClientes filtro={busca} />
    </div>
  );
}

renderizar(<App />);` }
            ]
          },
          {
            id: 're-12', titulo: 'useEffect', icone: '🪝',
            licao: [
              { titulo: 'Efeitos colaterais', texto: `<p>Desenhar a tela deve ser só desenhar. Coisas que acontecem <b>"ao lado"</b> (buscar dados, mudar o título da aba, ligar um cronômetro, salvar no localStorage) vão num <code>useEffect</code>, que roda <b>depois</b> que a tela é desenhada:</p><pre>useEffect(() =&gt; {\n  document.title = "Carrinho (" + qtd + ")";\n}, [qtd]);</pre><p>A lista no final são as <b>dependências</b>:</p><ul><li><code>[qtd]</code>: roda na primeira vez e sempre que <code>qtd</code> mudar</li><li><code>[]</code>: roda só uma vez, quando o componente aparece</li><li>sem lista: roda depois de <b>todo</b> desenho (cuidado!)</li></ul>`, codigo: `function Contador() {
  const [n, setN] = useState(0);
  useEffect(() => {
    console.log("efeito rodou com n =", n);
    document.title = "Atendidos: " + n;
  }, [n]);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
renderizar(<Contador />);
clicar("button");
console.log("título:", document.title);` },
              { titulo: 'Limpando', texto: `<p>Se o efeito liga algo que continua rodando (um <code>setInterval</code>, um "ouvinte"), devolva uma função de <b>limpeza</b>. O React chama quando o componente sai da tela ou antes de rodar o efeito de novo:</p><pre>useEffect(() =&gt; {\n  const id = setInterval(tique, 1000);\n  return () =&gt; clearInterval(id);\n}, []);</pre>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Com <code>useEffect(() =&gt; {...}, [])</code>, quando o efeito roda?', op: ['A cada clique', 'Uma vez, quando o componente aparece', 'Nunca', 'A cada segundo'], c: 1, exp: 'Lista vazia = sem dependências para observar: roda só na montagem.' },
              { tipo: 'prever', codigo: `function C() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  useEffect(() => { console.log("efeito", a); }, [a]);
  return <div><button id="a" onClick={() => setA(a + 1)}>a</button><button id="b" onClick={() => setB(b + 1)}>b</button></div>;
}
renderizar(<C />);
clicar("#b");
clicar("#a");`, op: ['efeito 0\nefeito 1', 'efeito 0', 'efeito 0\nefeito 0\nefeito 1', 'efeito 1'], c: 0, exp: 'Roda na montagem (a = 0). Mudar b não dispara; mudar a dispara (a = 1).' },
              { tipo: 'codigo', p: 'Crie <code>Rascunho</code>: um <code>textarea</code> controlado. Use <code>useEffect</code> com a dependência certa para, a cada mudança do texto, mostrar no console <code>salvando: TEXTO</code> (é o que faria um "salvar rascunho automático"). E um <code>&lt;small&gt;</code> com <code>N caracteres</code>.', inicio: `function Rascunho() {
  const [texto, setTexto] = useState("");

}

renderizar(<Rascunho />);`, teste: `digitar("textarea", "Oi");
digitar("textarea", "Oi, Ana");
console.log(document.querySelector("small").textContent);`, usar: [['useEffect', 'Use useEffect']], saida: 'salvando: \nsalvando: Oi\nsalvando: Oi, Ana\n7 caracteres', dicas: ['useEffect(() => { console.log("salvando: " + texto); }, [texto]);', '<textarea value={texto} onChange={e => setTexto(e.target.value)} />', '<small>{texto.length} caracteres</small> (os dois dentro de uma div)'], sol: `function Rascunho() {
  const [texto, setTexto] = useState("");
  useEffect(() => {
    console.log("salvando: " + texto);
  }, [texto]);
  return (
    <div>
      <textarea value={texto} onChange={e => setTexto(e.target.value)} />
      <small>{texto.length} caracteres</small>
    </div>
  );
}

renderizar(<Rascunho />);` }
            ]
          },
          {
            id: 're-13', titulo: 'Buscando dados da API', icone: '📡',
            api: { '/api/servicos': [{ id: 1, nome: 'Corte', preco: 40 }, { id: 2, nome: 'Escova', preco: 35 }, { id: 3, nome: 'Coloração', preco: 120 }] },
            licao: [
              { titulo: 'O front conversando com o back', texto: `<p>Aqui as trilhas se encontram: o React (front-end) busca os dados na API que você aprende a fazer na trilha de Back-end.</p><p>O padrão de sempre:</p><ol><li>estados para os <b>dados</b>, o <b>carregando</b> e o <b>erro</b></li><li>um <code>useEffect</code> com <code>[]</code> que faz o <code>fetch</code> quando o componente aparece</li><li>a tela mostra uma coisa para cada situação</li></ol><p>O <code>useEffect</code> não pode ser <code>async</code> direto: crie uma função async dentro dele e chame.</p><p>Aqui no CodeQuest o <code>fetch</code> responde com dados de exemplo (como uma API de verdade), e o teste usa <code>await esperar()</code> para dar tempo da resposta chegar.</p>`, codigo: `function Servicos() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const r = await fetch("/api/servicos");
        if (!r.ok) throw new Error("Falha " + r.status);
        setLista(await r.json());
      } catch (e) {
        setErro("Não foi possível carregar");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  return <ul>{lista.map(s => <li key={s.id}>{s.nome}</li>)}</ul>;
}

renderizar(<Servicos />);
console.log(document.querySelector("#root").textContent);
await esperar(100);
console.log(document.querySelector("#root").textContent);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Por que buscar dados dentro de <code>useEffect(..., [])</code> e não direto no corpo do componente?', op: ['É mais bonito', 'No corpo, o fetch rodaria a cada desenho, e cada resposta causaria outro desenho: um laço sem fim', 'O fetch não funciona fora', 'Para ficar mais rápido'], c: 1, exp: 'Com [] o fetch acontece uma vez, quando o componente aparece.' },
              { tipo: 'quiz', p: 'Qual destes está certo?', op: ['useEffect(async () => { await fetch(...) }, [])', 'useEffect(() => { async function f() { ... } f(); }, [])', 'await useEffect(fetch(...))', 'useEffect(fetch, [])'], c: 1, exp: 'A função do efeito não pode ser async (ela deve devolver nada ou a limpeza). Crie a async dentro e chame.' },
              { tipo: 'codigo', p: 'Crie <code>Profissionais</code>: busca <code>/api/profissionais</code> e mostra <code>&lt;p&gt;Carregando...&lt;/p&gt;</code> enquanto espera. Depois, uma <code>ul</code> com <code>NOME (AREA)</code> em cada <code>li</code>. Se a resposta não for <code>ok</code>, mostra <code>&lt;p className="erro"&gt;Erro ao carregar&lt;/p&gt;</code>. O componente recebe a prop <code>url</code> (use ela no fetch).', api: { '/api/profissionais': [{ id: 1, nome: 'Marta', area: 'Cabelo' }, { id: 2, nome: 'Rita', area: 'Unhas' }] }, inicio: `function Profissionais({ url }) {

}

renderizar(
  <div>
    <section id="a"><Profissionais url="/api/profissionais" /></section>
    <section id="b"><Profissionais url="/api/nao-existe" /></section>
  </div>
);`, teste: `console.log(document.querySelector("#a").textContent);
await esperar(100);
document.querySelectorAll("#a li").forEach(li => console.log(li.textContent));
console.log(document.querySelector("#b").innerHTML);`, saida: 'Carregando...\nMarta (Cabelo)\nRita (Unhas)\n<p class="erro">Erro ao carregar</p>', dicas: ['Três estados: lista, carregando (true) e erro (false).', 'useEffect(() => { async function carregar() { const r = await fetch(url); if (!r.ok) { setErro(true); } else { setLista(await r.json()); } setCarregando(false); } carregar(); }, [url]);', 'if (carregando) return <p>Carregando...</p>; if (erro) return <p className="erro">Erro ao carregar</p>;'], sol: `function Profissionais({ url }) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      const r = await fetch(url);
      if (!r.ok) {
        setErro(true);
      } else {
        setLista(await r.json());
      }
      setCarregando(false);
    }
    carregar();
  }, [url]);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p className="erro">Erro ao carregar</p>;
  return <ul>{lista.map(p => <li key={p.id}>{p.nome} ({p.area})</li>)}</ul>;
}

renderizar(
  <div>
    <section id="a"><Profissionais url="/api/profissionais" /></section>
    <section id="b"><Profissionais url="/api/nao-existe" /></section>
  </div>
);` }
            ]
          },
          {
            id: 're-14', titulo: 'Valores calculados e useRef', icone: '🧮',
            licao: [
              { titulo: 'Nem tudo precisa ser estado', texto: `<p>Um erro comum é criar estado para coisas que dá para <b>calcular</b> a partir de outro estado. Se você tem a lista do carrinho, o total <b>não</b> é um estado: é uma conta.</p><pre>const total = itens.reduce((s, i) =&gt; s + i.preco, 0);</pre><p>Menos estado = menos chance de ficar dessincronizado. Se a conta for pesada, <code>useMemo(() =&gt; conta, [dependências])</code> guarda o resultado até as dependências mudarem.</p>`, codigo: `function Notas() {
  const [notas, setNotas] = useState([5, 4]);
  const media = notas.reduce((s, n) => s + n, 0) / notas.length;
  return (
    <div>
      <button onClick={() => setNotas([...notas, 3])}>Avaliar com 3</button>
      <p>{notas.length} avaliações · média {media.toFixed(1)}</p>
    </div>
  );
}
renderizar(<Notas />);
clicar("button");
console.log(document.querySelector("p").textContent);` },
              { titulo: 'useRef', texto: `<p>O <code>useRef</code> guarda algo que <b>não deve redesenhar a tela</b> quando muda. Dois usos principais:</p><ul><li>apontar para um elemento da página: <code>&lt;input ref={campo} /&gt;</code> e depois <code>campo.current.focus()</code></li><li>guardar um valor entre desenhos sem causar atualização (o id de um setInterval, por exemplo)</li></ul>`, codigo: `function Busca() {
  const campo = useRef(null);
  const cliques = useRef(0);
  return (
    <div>
      <input ref={campo} />
      <button onClick={() => { cliques.current++; campo.current.value = "focado " + cliques.current + "x"; }}>Ir para a busca</button>
    </div>
  );
}
renderizar(<Busca />);
clicar("button");
clicar("button");
console.log(document.querySelector("input").value);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Você tem o estado <code>itens</code>. O total do carrinho deve ser...', op: ['Outro useState, atualizado junto', 'Uma conta feita a partir de itens a cada desenho', 'Um useEffect', 'Uma variável global'], c: 1, exp: 'Valores que derivam de outro estado são calculados, não guardados.' },
              { tipo: 'quiz', p: 'Mudar <code>ref.current</code> redesenha o componente?', op: ['Sim', 'Não: é justamente para guardar coisas sem redesenhar', 'Só se for número', 'Só com await'], c: 1, exp: 'Para algo que aparece na tela e muda, use useState.' },
              { tipo: 'codigo', p: 'Crie <code>Comanda</code> com o estado <code>servicos</code> (array de preços) e a gorjeta em porcentagem (<code>gorjeta</code>, começa em 10). Mostre:<ul><li>botões <code>.add</code> que adicionam o preço do serviço (<code>data-preco</code> não existe no React: use <code>onClick={() =&gt; ...(p.preco)}</code>)</li><li>um <code>select</code> com as opções 0, 10 e 15 ligado à gorjeta (use <code>Number(e.target.value)</code>)</li><li><code>&lt;p id="sub"&gt;Subtotal: X&lt;/p&gt;</code> e <code>&lt;p id="tot"&gt;Total: Y&lt;/p&gt;</code>, <b>calculados</b> (sem estado para eles), com o total arredondado em 2 casas com <code>toFixed(2)</code></li></ul>', inicio: `const OPCOES = [{ nome: "Corte", preco: 40 }, { nome: "Escova", preco: 35 }];

function Comanda() {

}

renderizar(<Comanda />);`, teste: `clicar(".add:nth-of-type(1)"); clicar(".add:nth-of-type(2)");
console.log(document.querySelector("#sub").textContent, "|", document.querySelector("#tot").textContent);
escolher("select", "15");
console.log(document.querySelector("#tot").textContent);`, saida: 'Subtotal: 75 | Total: 82.50\nTotal: 86.25', dicas: ['const [servicos, setServicos] = useState([]); const [gorjeta, setGorjeta] = useState(10);', 'const sub = servicos.reduce((s, p) => s + p, 0); const total = sub * (1 + gorjeta / 100);', '<select value={gorjeta} onChange={e => setGorjeta(Number(e.target.value))}>{[0, 10, 15].map(g => <option key={g} value={g}>{g}%</option>)}</select>'], sol: `const OPCOES = [{ nome: "Corte", preco: 40 }, { nome: "Escova", preco: 35 }];

function Comanda() {
  const [servicos, setServicos] = useState([]);
  const [gorjeta, setGorjeta] = useState(10);
  const sub = servicos.reduce((s, p) => s + p, 0);
  const total = sub * (1 + gorjeta / 100);
  return (
    <div>
      {OPCOES.map(o => (
        <button key={o.nome} className="add" onClick={() => setServicos([...servicos, o.preco])}>{o.nome}</button>
      ))}
      <select value={gorjeta} onChange={e => setGorjeta(Number(e.target.value))}>
        {[0, 10, 15].map(g => <option key={g} value={g}>{g}%</option>)}
      </select>
      <p id="sub">Subtotal: {sub}</p>
      <p id="tot">Total: {total.toFixed(2)}</p>
    </div>
  );
}

renderizar(<Comanda />);` }
            ]
          },
          {
            id: 're-15', titulo: 'Context', icone: '🌐',
            licao: [
              { titulo: 'Dados para o app inteiro', texto: `<p>Algumas informações são usadas em todo canto: o usuário logado, o tema escuro, o idioma. Passar por props de pai para filho, para neto, para bisneto... cansa (o famoso <i>prop drilling</i>).</p><p>O <b>Context</b> cria um "canal" que qualquer componente lá embaixo pode ler:</p><ol><li><code>const TemaContext = createContext("claro");</code></li><li>em volta do app: <code>&lt;TemaContext.Provider value={tema}&gt;...&lt;/TemaContext.Provider&gt;</code></li><li>em qualquer componente dentro: <code>const tema = useContext(TemaContext);</code></li></ol>`, codigo: `const UsuarioContext = createContext(null);

function Topo() {
  const usuario = useContext(UsuarioContext);
  return <header>{usuario ? "Olá, " + usuario.nome : "Entrar"}</header>;
}
function Pagina() {
  return <main><Topo /></main>; // Pagina não precisa saber de usuário
}
function App() {
  const [usuario, setUsuario] = useState(null);
  return (
    <UsuarioContext.Provider value={usuario}>
      <button onClick={() => setUsuario({ nome: "Ana" })}>Login</button>
      <Pagina />
    </UsuarioContext.Provider>
  );
}
renderizar(<App />);
console.log(document.querySelector("header").textContent);
clicar("button");
console.log(document.querySelector("header").textContent);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Quando o Context é uma boa ideia?', op: ['Para todo estado do app', 'Para dados usados em muitos lugares distantes (usuário logado, tema)', 'Para substituir props sempre', 'Para buscar dados'], c: 1, exp: 'Para dados locais, props e estado bastam. Context é para o que é "global".' },
              { tipo: 'codigo', p: 'Crie o tema do salão com Context:<ul><li><code>TemaContext</code> com padrão <code>"claro"</code></li><li><code>App</code> guarda o tema no estado e envolve tudo no Provider; tem um botão <code>#trocar</code> que alterna entre <code>"claro"</code> e <code>"escuro"</code></li><li><code>Cartao</code> (que fica dentro de <code>Lista</code>, sem receber props) lê o tema com <code>useContext</code> e usa como <code>className</code> do seu <code>div</code></li></ul>', inicio: `function Cartao({ nome }) {
  return <div>{nome}</div>;
}

function Lista() {
  return <section><Cartao nome="Corte" /><Cartao nome="Escova" /></section>;
}

function App() {
  return (
    <div>
      <button id="trocar">Trocar tema</button>
      <Lista />
    </div>
  );
}

renderizar(<App />);`, teste: `const classes = () => [...document.querySelectorAll("section div")].map(d => d.className).join(" ");
console.log(classes());
clicar("#trocar");
console.log(classes());
clicar("#trocar");
console.log(classes());`, saida: 'claro claro\nescuro escuro\nclaro claro', dicas: ['const TemaContext = createContext("claro"); (fora dos componentes)', 'No App: const [tema, setTema] = useState("claro"); e <TemaContext.Provider value={tema}> em volta.', 'No Cartao: const tema = useContext(TemaContext); return <div className={tema}>{nome}</div>;'], sol: `const TemaContext = createContext("claro");

function Cartao({ nome }) {
  const tema = useContext(TemaContext);
  return <div className={tema}>{nome}</div>;
}

function Lista() {
  return <section><Cartao nome="Corte" /><Cartao nome="Escova" /></section>;
}

function App() {
  const [tema, setTema] = useState("claro");
  return (
    <TemaContext.Provider value={tema}>
      <div>
        <button id="trocar" onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>Trocar tema</button>
        <Lista />
      </div>
    </TemaContext.Provider>
  );
}

renderizar(<App />);` }
            ]
          },
          {
            id: 're-16', titulo: 'Chefão: agenda do salão', icone: '👑', xp: 80,
            api: { '/api/agenda': [{ id: 1, hora: '09:00', cliente: 'Ana', servico: 'Corte', pro: 'Marta' }, { id: 2, hora: '10:00', cliente: 'Bia', servico: 'Unha', pro: 'Rita' }, { id: 3, hora: '11:00', cliente: 'Caio', servico: 'Corte', pro: 'Marta' }, { id: 4, hora: '14:00', cliente: 'Duda', servico: 'Coloração', pro: 'Júlia' }] },
            licao: [
              { titulo: 'Um app de verdade', texto: `<p>O painel que a recepção do salão usaria: busca a agenda na API, filtra por profissional, mostra o resumo e permite marcar quem já foi atendido. Junta <b>tudo</b>: componentes, props, estado, eventos, efeitos e fetch.</p><p>Quebre em partes: primeiro carregar e listar; depois o filtro; por último o "atendido". Use o botão Executar entre uma parte e outra.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Crie o <code>Painel</code>:<ol><li>busca <code>/api/agenda</code> ao aparecer (mostra <code>&lt;p&gt;Carregando...&lt;/p&gt;</code> enquanto isso)</li><li>um <code>select</code> com a opção <code>Todas</code> (valor vazio) e uma opção para cada profissional (<b>sem repetir</b>, em ordem alfabética: <code>[...new Set(...)].sort()</code>)</li><li>uma <code>ul</code> com um componente <code>Item</code> para cada agendamento do filtro: <code>&lt;li&gt;</code> com um <code>&lt;span&gt;HORA CLIENTE - SERVICO&lt;/span&gt;</code> e, se ainda não foi atendido, um botão <code>Atendido</code> que marca. O <code>li</code> atendido ganha a classe <code>ok</code> e não tem botão</li><li>um <code>&lt;p id="resumo"&gt;</code> com <code>X de Y atendidos</code>, contando só os da lista filtrada</li></ol>', inicio: `function Item({ ag, aoAtender }) {

}

function Painel() {

}

renderizar(<Painel />);`, teste: `console.log(document.querySelector("#root").textContent);
await esperar(100);
console.log([...document.querySelectorAll("option")].map(o => o.textContent).join(", "));
clicar("li:nth-child(1) button");
console.log(document.querySelector("#resumo").textContent);
escolher("select", "Marta");
document.querySelectorAll("li").forEach(li => console.log(li.querySelector("span").textContent, li.className || "-", li.querySelector("button") ? "[Atendido]" : ""));
console.log(document.querySelector("#resumo").textContent);
escolher("select", "");
console.log(document.querySelectorAll("li").length, document.querySelector("#resumo").textContent);`, saida: 'Carregando...\nTodas, Júlia, Marta, Rita\n1 de 4 atendidos\n09:00 Ana - Corte ok \n11:00 Caio - Corte - [Atendido]\n1 de 2 atendidos\n4 1 de 4 atendidos', dicas: ['Estados no Painel: agenda ([]), carregando (true), filtro ("") e atendidos (um array de ids).', 'const pros = [...new Set(agenda.map(a => a.pro))].sort(); const lista = filtro ? agenda.filter(a => a.pro === filtro) : agenda;', 'Item: <li className={ag.atendido ? "ok" : ""}><span>{ag.hora} {ag.cliente} - {ag.servico}</span>{!ag.atendido && <button onClick={() => aoAtender(ag.id)}>Atendido</button>}</li>', 'Para marcar: setAtendidos([...atendidos, id]); e na hora de passar o item: <Item key={a.id} ag={{ ...a, atendido: atendidos.includes(a.id) }} aoAtender={...} />'], sol: `function Item({ ag, aoAtender }) {
  return (
    <li className={ag.atendido ? "ok" : ""}>
      <span>{ag.hora} {ag.cliente} - {ag.servico}</span>
      {!ag.atendido && <button onClick={() => aoAtender(ag.id)}>Atendido</button>}
    </li>
  );
}

function Painel() {
  const [agenda, setAgenda] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [atendidos, setAtendidos] = useState([]);

  useEffect(() => {
    async function carregar() {
      const r = await fetch("/api/agenda");
      setAgenda(await r.json());
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;

  const pros = [...new Set(agenda.map(a => a.pro))].sort();
  const lista = filtro ? agenda.filter(a => a.pro === filtro) : agenda;
  const feitos = lista.filter(a => atendidos.includes(a.id)).length;

  return (
    <div>
      <select value={filtro} onChange={e => setFiltro(e.target.value)}>
        <option value="">Todas</option>
        {pros.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <ul>
        {lista.map(a => (
          <Item key={a.id} ag={{ ...a, atendido: atendidos.includes(a.id) }} aoAtender={id => setAtendidos([...atendidos, id])} />
        ))}
      </ul>
      <p id="resumo">{feitos} de {lista.length} atendidos</p>
    </div>
  );
}

renderizar(<Painel />);` },
              { tipo: 'quiz', p: 'Seu app React está pronto. Como colocar no ar?', op: ['Mandar a pasta src por e-mail', 'Rodar npm run build e publicar a pasta gerada (dist) numa hospedagem como Vercel, Netlify ou Render', 'Subir o node_modules', 'Não dá para publicar React'], c: 1, exp: 'O build transforma o projeto em arquivos HTML, CSS e JS prontos para qualquer hospedagem. Veja a trilha Git, Terminal e Deploy.' }
            ]
          }
        ]
      }
    ]
  };
})();
