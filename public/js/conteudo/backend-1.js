// =============================================================
// Trilha Back-end com Node.js — parte 1 (HTTP, Express e API REST)
// A parte 2 (middlewares, MongoDB, senhas e login) está em backend-2.js.
//
// O código roda num "Node.js de mentirinha" dentro do navegador
// (public/js/runtime/nodesim.js): require("express"), app.listen(3000)
// e fetch("http://localhost:3000/...") funcionam como no Node de
// verdade, mas tudo fica na memória do aparelho.
// O "teste" de cada exercício faz pedidos com fetch e mostra as respostas.
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});
  var BASE = `const express = require("express");
const app = express();
app.use(express.json());
`;
  C.backend = {
    id: 'backend', nome: 'Back-end com Node.js', icone: '🟩', cor: '#7BC86C', ling: 'node',
    desc: 'O lado do servidor: APIs com Express, rotas, banco MongoDB, senhas e login com JWT.',
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'Como a web conversa', desc: 'Cliente, servidor, HTTP e o seu primeiro servidor.',
        fases: [
          {
            id: 'be-01', titulo: 'Cliente e servidor', icone: '🛰️',
            licao: [
              { titulo: 'Pedido e resposta', texto: `<p>Quando você abre um app, acontece uma conversa:</p><ol><li>o <b>cliente</b> (o navegador, o app do celular) faz um <b>pedido</b> (<i>request</i>)</li><li>o <b>servidor</b> (um computador ligado o tempo todo) processa e devolve uma <b>resposta</b> (<i>response</i>)</li></ol><p>É como um restaurante: você (cliente) faz o pedido ao garçom; a cozinha (servidor) prepara e devolve o prato. O <b>back-end</b> é a cozinha: ela guarda os dados, confere senhas, calcula preços.</p><p>A língua dessa conversa é o <b>HTTP</b>.</p>` },
              { titulo: 'O que vai num pedido HTTP', texto: `<ul><li><b>método</b>: o que você quer fazer. <code>GET</code> = buscar, <code>POST</code> = criar, <code>PUT</code>/<code>PATCH</code> = alterar, <code>DELETE</code> = apagar</li><li><b>endereço</b> (URL): <code>https://salao.com/servicos?categoria=unhas</code> = protocolo + domínio + <b>caminho</b> (<code>/servicos</code>) + <b>query</b> (<code>?categoria=unhas</code>)</li><li><b>cabeçalhos</b> (<i>headers</i>): informações extras, como o tipo do conteúdo e o "crachá" de login</li><li><b>corpo</b> (<i>body</i>): os dados enviados (num POST, por exemplo)</li></ul><p>A resposta volta com um <b>código de status</b>: <code>200</code> OK, <code>201</code> criado, <code>400</code> pedido errado, <code>401</code> não autenticado, <code>404</code> não encontrado, <code>500</code> erro no servidor.</p>` },
              { titulo: 'Um servidor de verdade', texto: `<p>O Node.js já vem com o módulo <code>http</code>. Este é o servidor mais simples possível: para todo pedido, ele responde um texto.</p><p>Aqui no CodeQuest o servidor roda no seu navegador, e o <code>fetch</code> no fim faz o papel do cliente.</p>`, codigo: `const http = require("http");

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Olá! Você pediu " + req.method + " " + req.url);
});

servidor.listen(3000, () => console.log("Servidor ligado na porta 3000"));

// o "cliente":
const resposta = await fetch("http://localhost:3000/servicos");
console.log(resposta.status, await resposta.text());` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual método HTTP se usa para <b>buscar</b> uma lista de serviços?', op: ['POST', 'GET', 'DELETE', 'PUT'], c: 1, exp: 'GET busca. POST cria, PUT/PATCH alteram, DELETE apaga.' },
              { tipo: 'quiz', p: 'O servidor respondeu <code>404</code>. O que significa?', op: ['Deu tudo certo', 'Não encontrado', 'Erro no servidor', 'Precisa fazer login'], c: 1, exp: '4xx são erros de quem pediu (404 = não existe). 5xx são erros do servidor.' },
              { tipo: 'quiz', p: 'Em <code>https://salao.com/agenda?dia=2026-11-05</code>, o que é <code>dia=2026-11-05</code>?', op: ['O caminho', 'A query (parâmetros da busca)', 'O domínio', 'O corpo'], c: 1, exp: 'Tudo depois do ? é a query string: pares nome=valor.' },
              { tipo: 'codigo', p: 'Crie um servidor com o módulo <code>http</code> que, para qualquer pedido, responde com status <code>200</code> e o texto <code>Salão aberto!</code>. Ligue na porta <code>3000</code>.', inicio: `const http = require("http");

`, teste: `const r = await fetch("http://localhost:3000/");
console.log(r.status, await r.text());`, saida: '200 Salão aberto!', dicas: ['http.createServer((req, res) => { ... })', 'Dentro: res.writeHead(200, { "Content-Type": "text/plain" }); res.end("Salão aberto!");', 'Guarde o servidor numa variável e chame .listen(3000).'], sol: `const http = require("http");

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Salão aberto!");
});
servidor.listen(3000);` }
            ]
          },
          {
            id: 'be-02', titulo: 'Node.js e módulos', icone: '📦',
            licao: [
              { titulo: 'JavaScript fora do navegador', texto: `<p>O <b>Node.js</b> é o JavaScript rodando no computador (ou no servidor), sem navegador. Ele não tem <code>document</code> nem botões, mas pode ler arquivos, falar com bancos de dados e atender milhares de pedidos.</p><p>No seu PC: instale o Node, crie um arquivo <code>index.js</code> e rode no terminal <code>node index.js</code>.</p>` },
              { titulo: 'require e module.exports', texto: `<p>Um projeto real tem vários arquivos (<b>módulos</b>). Cada arquivo escolhe o que <b>exporta</b>, e os outros <b>importam</b> com <code>require</code>:</p><pre>// precos.js\nfunction comDesconto(v, p) { return v - v * p / 100; }\nmodule.exports = { comDesconto };\n\n// index.js\nconst { comDesconto } = require("./precos");</pre><p>Os módulos de outras pessoas vêm do <b>npm</b>: <code>npm install express</code> baixa o Express para a pasta <code>node_modules</code> e anota no <code>package.json</code>. (Aqui no CodeQuest tudo fica num arquivo só, e o express já está "instalado".)</p>`, codigo: `function comDesconto(valor, porcentagem) {
  return valor - valor * porcentagem / 100;
}
module.exports = { comDesconto };

// quem fizer require deste arquivo recebe o module.exports:
console.log(module.exports);
console.log(module.exports.comDesconto(80, 25));` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para que serve o arquivo <code>package.json</code>?', op: ['Guardar as senhas', 'Descrever o projeto e as dependências (pacotes do npm) que ele usa', 'É o servidor', 'Guarda o banco de dados'], c: 1, exp: 'Ele lista nome, versão, scripts e dependências. Com ele, outra pessoa roda npm install e recebe tudo.' },
              { tipo: 'quiz', p: 'A pasta <code>node_modules</code> deve ir para o GitHub?', op: ['Sim, sempre', 'Não: ela é recriada com npm install, e é enorme', 'Só no deploy', 'Só se for pequena'], c: 1, exp: 'Ela vai no .gitignore. O package.json basta para reinstalar.' },
              { tipo: 'completar', p: 'Exporte a função para outros arquivos usarem.', codigo: `function saudacao(nome) { return "Olá, " + nome; }
___.___ = { saudacao };
console.log(module.exports.saudacao("Bia"));`, resp: ['module', 'exports'], op: ['module', 'exports', 'export', 'require'], saida: 'Olá, Bia', exp: 'module.exports é o que o arquivo entrega para quem fizer require.' },
              { tipo: 'codigo', p: 'Crie o "módulo de preços" do salão: duas funções, <code>comTaxa(valor)</code> (soma 5% de taxa do cartão) e <code>parcela(valor, vezes)</code> (divide em parcelas, arredondando com <code>Math.round(x * 100) / 100</code>). Exporte as duas em <code>module.exports</code>.', inicio: `function comTaxa(valor) {

}

function parcela(valor, vezes) {

}
`, teste: `const precos = module.exports;
console.log(Object.keys(precos));
console.log(precos.comTaxa(100));
console.log(precos.parcela(100, 3));`, saida: "[ 'comTaxa', 'parcela' ]\n105\n33.33", dicas: ['comTaxa: return valor * 1.05;', 'parcela: return Math.round(valor / vezes * 100) / 100;', 'No fim: module.exports = { comTaxa, parcela };'], sol: `function comTaxa(valor) {
  return valor * 1.05;
}

function parcela(valor, vezes) {
  return Math.round(valor / vezes * 100) / 100;
}

module.exports = { comTaxa, parcela };` }
            ]
          },
          {
            id: 'be-03', titulo: 'Primeiro servidor Express', icone: '🚂',
            licao: [
              { titulo: 'Express: o garçom organizado', texto: `<p>Com o <code>http</code> puro, você teria que olhar a URL e o método na mão para decidir o que responder. O <b>Express</b>, o pacote mais usado do Node, organiza isso em <b>rotas</b>:</p><pre>app.get("/servicos", (req, res) => {\n  res.send("lista de serviços");\n});</pre><p>Lê-se: "quando chegar um <b>GET</b> em <b>/servicos</b>, rode esta função". A função recebe:</p><ul><li><code>req</code> (<i>request</i>): o pedido, com tudo que o cliente mandou</li><li><code>res</code> (<i>response</i>): a resposta, que você preenche e envia</li></ul>`, codigo: `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bem-vinda ao Salão da Ana!");
});

app.get("/horario", (req, res) => {
  res.send("Terça a sábado, das 9h às 19h");
});

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));

let r = await fetch("http://localhost:3000/horario");
console.log(r.status, await r.text());
r = await fetch("http://localhost:3000/nao-existe");
console.log(r.status, await r.text());` },
              { titulo: 'No seu computador', texto: `<pre>mkdir meu-servidor\ncd meu-servidor\nnpm init -y\nnpm install express\nnode index.js</pre><p>Depois abra <code>http://localhost:3000</code> no navegador. <code>localhost</code> é "este computador"; <code>3000</code> é a <b>porta</b>, como o número de um apartamento no prédio.</p><p>Toda vez que mudar o código, pare (Ctrl+C) e rode de novo, ou use <code>node --watch index.js</code>, que reinicia sozinho.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Em <code>app.get("/precos", (req, res) => ...)</code>, quando a função roda?', op: ['Assim que o servidor liga', 'Quando chega um pedido GET em /precos', 'Em qualquer pedido', 'Quando alguém faz POST'], c: 1, exp: 'A rota liga um método + caminho a uma função.' },
              { tipo: 'quiz', p: 'O que o Express responde para uma rota que não existe?', op: ['200 vazio', '404 "Cannot GET /caminho"', '500', 'Nada, o pedido fica esperando'], c: 1, exp: 'Ele responde 404 automaticamente.' },
              { tipo: 'montar', p: 'Monte um servidor com a rota GET /ping que responde "pong".', linhas: ['const express = require("express");', 'const app = express();', 'app.get("/ping", (req, res) => {', '  res.send("pong");', '});', 'app.listen(3000);'], extras: ['app.post("/ping", (req, res) => {'], teste: `const r = await fetch("http://localhost:3000/ping");
console.log(await r.text());`, saida: 'pong', exp: 'Importa, cria o app, registra a rota e liga.' },
              { tipo: 'codigo', p: 'Crie um servidor Express com duas rotas GET:<ul><li><code>/</code> responde <code>Salão da Ana</code></li><li><code>/contato</code> responde <code>WhatsApp: 11 99999-0000</code></li></ul>Ligue na porta <code>3000</code>.', inicio: `const express = require("express");
const app = express();

`, teste: `for (const caminho of ["/", "/contato", "/precos"]) {
  const r = await fetch("http://localhost:3000" + caminho);
  console.log(caminho, r.status, await r.text());
}`, saida: '/ 200 Salão da Ana\n/contato 200 WhatsApp: 11 99999-0000\n/precos 404 Cannot GET /precos', dicas: ['app.get("/", (req, res) => { res.send("Salão da Ana"); });', 'Mesma coisa para "/contato".', 'No fim: app.listen(3000);'], sol: `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Salão da Ana");
});

app.get("/contato", (req, res) => {
  res.send("WhatsApp: 11 99999-0000");
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-04', titulo: 'Respondendo com JSON', icone: '🧩',
            licao: [
              { titulo: 'A língua das APIs', texto: `<p>Um site devolve HTML para pessoas lerem. Uma <b>API</b> devolve <b>dados</b> para outros programas (o app do celular, o React, outro servidor). O formato quase universal é o <b>JSON</b>: parece um objeto do JavaScript, mas é texto.</p><p>No Express, <code>res.json(objeto)</code> transforma o objeto em JSON e avisa o cliente com o cabeçalho <code>Content-Type: application/json</code>.</p><p>Do lado do cliente, <code>await resposta.json()</code> transforma de volta em objeto.</p>`, codigo: `const express = require("express");
const app = express();

const servicos = [
  { id: 1, nome: "Corte", preco: 40 },
  { id: 2, nome: "Escova", preco: 35 }
];

app.get("/servicos", (req, res) => {
  res.json(servicos);
});

app.listen(3000);

const r = await fetch("http://localhost:3000/servicos");
console.log(r.headers.get("content-type"));
const dados = await r.json();
console.log(dados.length, dados[0].nome);` },
              { titulo: 'Escolhendo o status', texto: `<p><code>res.status(201).json(...)</code> muda o código de status antes de responder. As duas funções se encaixam em cadeia porque <code>status()</code> devolve o próprio <code>res</code>.</p><p>Regra importante: <b>cada pedido recebe uma única resposta</b>. Depois de <code>res.json</code> ou <code>res.send</code>, não dá para responder de novo.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual a diferença entre <code>res.send("...")</code> e <code>res.json({...})</code>?', op: ['Nenhuma', 'res.json envia o objeto como JSON, com o tipo application/json', 'res.json é mais lento', 'res.send só funciona com números'], c: 1, exp: 'Para APIs, use res.json: o cliente sabe que recebeu dados.' },
              { tipo: 'prever', codigo: `const express = require("express");
const app = express();
app.get("/info", (req, res) => res.status(202).json({ ok: true, fila: 3 }));
app.listen(3000);
const r = await fetch("http://localhost:3000/info");
const d = await r.json();
console.log(r.status, d.fila + 1);`, op: ['202 4', '200 4', '202 31', '202 { ok: true, fila: 3 }'], c: 0, exp: 'O status foi trocado para 202, e d.fila é o número 3 (o JSON preserva os tipos).' },
              { tipo: 'codigo', p: 'Crie a rota <code>GET /profissionais</code>, que responde em JSON a lista de profissionais abaixo, e a rota <code>GET /resumo</code>, que responde <code>{ total: 3, aberto: true }</code>. Use <code>profissionais.length</code> para o total.', inicio: BASE + `
const profissionais = [
  { nome: "Marta", area: "Cabelo" },
  { nome: "Júlia", area: "Química" },
  { nome: "Rita", area: "Unhas" }
];

`, teste: `let r = await fetch("http://localhost:3000/profissionais");
const lista = await r.json();
console.log(r.status, lista.map(p => p.nome).join(", "));
r = await fetch("http://localhost:3000/resumo");
console.log(r.status, await r.json());`, saida: '200 Marta, Júlia, Rita\n200 { total: 3, aberto: true }', dicas: ['app.get("/profissionais", (req, res) => res.json(profissionais));', 'app.get("/resumo", (req, res) => res.json({ total: profissionais.length, aberto: true }));', 'Não esqueça do app.listen(3000);'], sol: BASE + `
const profissionais = [
  { nome: "Marta", area: "Cabelo" },
  { nome: "Júlia", area: "Química" },
  { nome: "Rita", area: "Unhas" }
];

app.get("/profissionais", (req, res) => {
  res.json(profissionais);
});

app.get("/resumo", (req, res) => {
  res.json({ total: profissionais.length, aberto: true });
});

app.listen(3000);` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'API REST', desc: 'Criar, ler, alterar e apagar: o CRUD que todo sistema tem.',
        fases: [
          {
            id: 'be-05', titulo: 'Rotas com parâmetros', icone: '🆔',
            licao: [
              { titulo: 'Um pedaço da URL que muda', texto: `<p>Para buscar <b>um</b> serviço, a URL leva o id: <code>/servicos/2</code>. Em vez de criar uma rota para cada id, usamos um <b>parâmetro</b>, com dois pontos:</p><pre>app.get("/servicos/:id", (req, res) => {\n  req.params.id // "2"\n});</pre><p>⚠️ Tudo que vem da URL é <b>texto</b>. Para comparar com um número, converta: <code>Number(req.params.id)</code>.</p><p>Se não achar, responda <code>404</code> com uma mensagem clara.</p>`, codigo: `const express = require("express");
const app = express();
const servicos = [
  { id: 1, nome: "Corte", preco: 40 },
  { id: 2, nome: "Escova", preco: 35 }
];

app.get("/servicos/:id", (req, res) => {
  const id = Number(req.params.id);
  const servico = servicos.find(s => s.id === id);
  if (!servico) {
    return res.status(404).json({ erro: "Serviço não encontrado" });
  }
  res.json(servico);
});

app.listen(3000);

for (const id of [2, 9]) {
  const r = await fetch("http://localhost:3000/servicos/" + id);
  console.log(r.status, await r.json());
}` },
              { titulo: 'Por que o return?', texto: `<p>No exemplo, <code>return res.status(404)...</code> faz duas coisas: responde e <b>sai da função</b>. Sem o <code>return</code>, o código continuaria e chegaria no <code>res.json(servico)</code>, tentando responder duas vezes (erro <code>ERR_HTTP_HEADERS_SENT</code>).</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Na rota <code>/clientes/:id</code>, com o pedido <code>/clientes/15</code>, quanto vale <code>req.params.id</code>?', op: ['15 (número)', '"15" (texto)', '"/clientes/15"', 'undefined'], c: 1, exp: 'Parâmetros de URL chegam sempre como texto.' },
              { tipo: 'prever', codigo: `const express = require("express");
const app = express();
const ids = [1, 2, 3];
app.get("/x/:id", (req, res) => res.json({ achou: ids.includes(req.params.id) }));
app.listen(3000);
const r = await fetch("http://localhost:3000/x/2");
console.log(await r.json());`, op: ['{ achou: false }', '{ achou: true }', '{ achou: 2 }', 'Erro'], c: 0, exp: 'req.params.id é o texto "2", e o array tem o número 2. Para includes achar, use Number(req.params.id).' },
              { tipo: 'codigo', p: 'Crie <code>GET /clientes/:id</code>: devolve o cliente com aquele id em JSON, ou <code>404</code> com <code>{ erro: "Cliente não encontrado" }</code>.', inicio: BASE + `
const clientes = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bia" },
  { id: 3, nome: "Caio" }
];

app.listen(3000);
`, teste: `for (const id of ["3", "7", "abc"]) {
  const r = await fetch("http://localhost:3000/clientes/" + id);
  console.log(id, r.status, await r.json());
}`, saida: "3 200 { id: 3, nome: 'Caio' }\n7 404 { erro: 'Cliente não encontrado' }\nabc 404 { erro: 'Cliente não encontrado' }", dicas: ['app.get("/clientes/:id", (req, res) => { ... });', 'const cliente = clientes.find(c => c.id === Number(req.params.id));', 'if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });\nres.json(cliente);'], sol: BASE + `
const clientes = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bia" },
  { id: 3, nome: "Caio" }
];

app.get("/clientes/:id", (req, res) => {
  const cliente = clientes.find(c => c.id === Number(req.params.id));
  if (!cliente) {
    return res.status(404).json({ erro: "Cliente não encontrado" });
  }
  res.json(cliente);
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-06', titulo: 'Filtros com query', icone: '🔎',
            licao: [
              { titulo: 'req.query', texto: `<p>A parte depois do <code>?</code> chega pronta em <code>req.query</code>, como objeto:</p><p><code>/servicos?categoria=Cabelo&max=50</code> → <code>{ categoria: "Cabelo", max: "50" }</code></p><p>Use para <b>filtros</b>, <b>busca</b> e <b>paginação</b>. Os valores também são texto, e podem não vir: sempre trate o caso de não existir.</p>`, codigo: `const express = require("express");
const app = express();
const servicos = [
  { nome: "Corte", categoria: "Cabelo", preco: 40 },
  { nome: "Coloração", categoria: "Cabelo", preco: 120 },
  { nome: "Manicure", categoria: "Unhas", preco: 25 }
];

app.get("/servicos", (req, res) => {
  let lista = servicos;
  if (req.query.categoria) {
    lista = lista.filter(s => s.categoria === req.query.categoria);
  }
  if (req.query.max) {
    lista = lista.filter(s => s.preco <= Number(req.query.max));
  }
  res.json(lista.map(s => s.nome));
});

app.listen(3000);

for (const url of ["/servicos", "/servicos?categoria=Cabelo", "/servicos?categoria=Cabelo&max=50"]) {
  const r = await fetch("http://localhost:3000" + url);
  console.log(url, await r.json());
}` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para o pedido <code>/agenda?dia=2026-11-05&pro=Rita</code>, quanto vale <code>req.query.pro</code>?', op: ['"Rita"', '"dia=2026-11-05&pro=Rita"', 'undefined', '["Rita"]'], c: 0, exp: 'O Express separa cada nome=valor da query.' },
              { tipo: 'quiz', p: 'Quando usar <code>/clientes/:id</code> e quando usar <code>/clientes?cidade=Santos</code>?', op: ['Tanto faz', 'Parâmetro para identificar UM recurso; query para filtrar, buscar e paginar listas', 'Query para um recurso; parâmetro para listas', 'Parâmetro só para POST'], c: 1, exp: 'Essa é a convenção das APIs REST.' },
              { tipo: 'codigo', p: 'Crie <code>GET /clientes</code>:<ul><li>sem query, devolve todos os nomes</li><li>com <code>?cidade=...</code>, só os daquela cidade</li><li>com <code>?busca=...</code>, só os nomes que contêm o texto (sem diferenciar maiúsculas: use <code>toLowerCase()</code>)</li></ul>A resposta é um array com os <b>nomes</b>.', inicio: BASE + `
const clientes = [
  { nome: "Ana Souza", cidade: "Campinas" },
  { nome: "Bia Lima", cidade: "Santos" },
  { nome: "Caio Rocha", cidade: "Campinas" },
  { nome: "Duda Lima", cidade: "Santos" }
];

app.listen(3000);
`, teste: `for (const q of ["", "?cidade=Santos", "?busca=lima", "?cidade=Campinas&busca=SOUZA"]) {
  const r = await fetch("http://localhost:3000/clientes" + q);
  console.log(q || "(sem filtro)", await r.json());
}`, saida: "(sem filtro) [ 'Ana Souza', 'Bia Lima', 'Caio Rocha', 'Duda Lima' ]\n?cidade=Santos [ 'Bia Lima', 'Duda Lima' ]\n?busca=lima [ 'Bia Lima', 'Duda Lima' ]\n?cidade=Campinas&busca=SOUZA [ 'Ana Souza' ]", dicas: ['let lista = clientes; e vá filtrando com if (req.query.cidade) { ... }', 'Busca: lista = lista.filter(c => c.nome.toLowerCase().includes(req.query.busca.toLowerCase()));', 'No fim: res.json(lista.map(c => c.nome));'], sol: BASE + `
const clientes = [
  { nome: "Ana Souza", cidade: "Campinas" },
  { nome: "Bia Lima", cidade: "Santos" },
  { nome: "Caio Rocha", cidade: "Campinas" },
  { nome: "Duda Lima", cidade: "Santos" }
];

app.get("/clientes", (req, res) => {
  let lista = clientes;
  if (req.query.cidade) {
    lista = lista.filter(c => c.cidade === req.query.cidade);
  }
  if (req.query.busca) {
    const termo = req.query.busca.toLowerCase();
    lista = lista.filter(c => c.nome.toLowerCase().includes(termo));
  }
  res.json(lista.map(c => c.nome));
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-07', titulo: 'POST e req.body', icone: '📮',
            licao: [
              { titulo: 'Recebendo dados', texto: `<p>Para <b>criar</b> algo, o cliente faz um <code>POST</code> e manda os dados no <b>corpo</b> do pedido, em JSON. No servidor:</p><ol><li><code>app.use(express.json())</code> ensina o Express a ler corpos JSON (sem isso, <code>req.body</code> fica <code>undefined</code>!)</li><li>os dados chegam em <code>req.body</code></li><li>responda <code>201 Created</code> com o item criado (incluindo o id novo)</li></ol>`, codigo: `const express = require("express");
const app = express();
app.use(express.json());

const agendamentos = [];
let proximoId = 1;

app.post("/agendamentos", (req, res) => {
  const novo = { id: proximoId++, cliente: req.body.cliente, servico: req.body.servico };
  agendamentos.push(novo);
  res.status(201).json(novo);
});

app.listen(3000);

const r = await fetch("http://localhost:3000/agendamentos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cliente: "Ana", servico: "Escova" })
});
console.log(r.status, await r.json());` },
              { titulo: 'O fetch com POST', texto: `<p>Do lado do cliente (no navegador ou no React), o <code>fetch</code> de um POST precisa de três coisas: <code>method: "POST"</code>, o cabeçalho <code>Content-Type: application/json</code> e o <code>body</code> com <code>JSON.stringify(objeto)</code>.</p><p>Esqueceu o cabeçalho? O servidor não sabe que é JSON e o <code>req.body</code> chega vazio.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O <code>req.body</code> está sempre <code>undefined</code>. O que provavelmente falta no servidor?', op: ['app.use(express.json())', 'app.listen()', 'res.json()', 'return'], c: 0, exp: 'É o express.json() que lê o corpo do pedido e preenche req.body.' },
              { tipo: 'quiz', p: 'Qual status responder quando algo foi <b>criado</b> com sucesso?', op: ['200', '201', '204', '302'], c: 1, exp: '201 Created é o status certo para criação.' },
              { tipo: 'completar', p: 'Complete o fetch do cliente.', codigo: `const r = await fetch("http://localhost:3000/clientes", {
  method: "___",
  headers: { "Content-Type": "application/json" },
  body: JSON.___({ nome: "Bia" })
});`, resp: ['POST', 'stringify'], op: ['POST', 'stringify', 'GET', 'parse'], exp: 'POST para criar, e JSON.stringify transforma o objeto em texto JSON.' },
              { tipo: 'codigo', p: 'Crie <code>POST /clientes</code>: pega <code>nome</code> e <code>telefone</code> do corpo, cria <code>{ id, nome, telefone }</code> com id sequencial (começando em 1), guarda no array e responde <code>201</code> com o cliente criado. Crie também <code>GET /clientes</code> que devolve o array.', inicio: BASE + `
const clientes = [];
let proximoId = 1;

app.listen(3000);
`, teste: `async function criar(dados) {
  const r = await fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  console.log(r.status, await r.json());
}
await criar({ nome: "Ana", telefone: "1111" });
await criar({ nome: "Bia", telefone: "2222" });
const lista = await (await fetch("http://localhost:3000/clientes")).json();
console.log(lista.length, lista[1].nome);`, saida: "201 { id: 1, nome: 'Ana', telefone: '1111' }\n201 { id: 2, nome: 'Bia', telefone: '2222' }\n2 Bia", dicas: ['app.post("/clientes", (req, res) => { ... });', 'const novo = { id: proximoId++, nome: req.body.nome, telefone: req.body.telefone }; clientes.push(novo);', 'res.status(201).json(novo); e não esqueça do app.get("/clientes", ...)'], sol: BASE + `
const clientes = [];
let proximoId = 1;

app.post("/clientes", (req, res) => {
  const novo = { id: proximoId++, nome: req.body.nome, telefone: req.body.telefone };
  clientes.push(novo);
  res.status(201).json(novo);
});

app.get("/clientes", (req, res) => {
  res.json(clientes);
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-08', titulo: 'PUT, PATCH e DELETE', icone: '♻️',
            licao: [
              { titulo: 'O CRUD completo', texto: `<p>Quase todo sistema é um <b>CRUD</b>: <b>C</b>reate, <b>R</b>ead, <b>U</b>pdate, <b>D</b>elete. Numa API REST, cada um tem seu método:</p><table border="1" cellpadding="4"><tr><th>Ação</th><th>Método e rota</th><th>Responde</th></tr><tr><td>Listar</td><td>GET /servicos</td><td>200 + lista</td></tr><tr><td>Ver um</td><td>GET /servicos/:id</td><td>200 ou 404</td></tr><tr><td>Criar</td><td>POST /servicos</td><td>201 + criado</td></tr><tr><td>Alterar</td><td>PUT ou PATCH /servicos/:id</td><td>200 + alterado</td></tr><tr><td>Apagar</td><td>DELETE /servicos/:id</td><td>204 (sem corpo)</td></tr></table><p><code>PUT</code> troca o recurso inteiro; <code>PATCH</code> muda só os campos enviados (o mais comum no dia a dia).</p>` },
              { titulo: 'Na prática', texto: `<p>Para alterar: ache o item, aplique os campos com <code>Object.assign(item, req.body)</code> e devolva. Para apagar: ache a posição com <code>findIndex</code> e use <code>splice</code>. O <code>204</code> é respondido com <code>res.status(204).end()</code> ou <code>res.sendStatus(204)</code>.</p>`, codigo: `const express = require("express");
const app = express();
app.use(express.json());
const servicos = [{ id: 1, nome: "Corte", preco: 40 }, { id: 2, nome: "Escova", preco: 35 }];

app.patch("/servicos/:id", (req, res) => {
  const s = servicos.find(x => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ erro: "Não encontrado" });
  Object.assign(s, req.body);
  res.json(s);
});

app.delete("/servicos/:id", (req, res) => {
  const i = servicos.findIndex(x => x.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ erro: "Não encontrado" });
  servicos.splice(i, 1);
  res.sendStatus(204);
});

app.listen(3000);

let r = await fetch("http://localhost:3000/servicos/1", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ preco: 45 }) });
console.log(r.status, await r.json());
r = await fetch("http://localhost:3000/servicos/2", { method: "DELETE" });
console.log(r.status, servicos.length);` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para mudar <b>só o preço</b> de um serviço, qual método é o mais adequado?', op: ['GET', 'POST', 'PATCH', 'DELETE'], c: 2, exp: 'PATCH = alteração parcial. PUT costuma substituir o recurso inteiro.' },
              { tipo: 'quiz', p: 'O que o status <code>204</code> significa?', op: ['Criado', 'Deu certo, e não há conteúdo na resposta', 'Não encontrado', 'Erro'], c: 1, exp: '204 No Content: comum depois de um DELETE.' },
              { tipo: 'codigo', p: 'Complete a API de agendamentos:<ul><li><code>PATCH /agendamentos/:id</code>: altera os campos enviados e devolve o agendamento (ou 404 com <code>{ erro: "Não encontrado" }</code>)</li><li><code>DELETE /agendamentos/:id</code>: remove e responde <code>204</code> (ou 404 igual)</li></ul>', inicio: BASE + `
const agendamentos = [
  { id: 1, cliente: "Ana", horario: "10:00", status: "agendado" },
  { id: 2, cliente: "Bia", horario: "11:00", status: "agendado" }
];

app.get("/agendamentos", (req, res) => res.json(agendamentos));

app.listen(3000);
`, teste: `const url = "http://localhost:3000/agendamentos";
let r = await fetch(url + "/2", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ horario: "15:00" }) });
console.log(r.status, await r.json());
r = await fetch(url + "/1", { method: "DELETE" });
console.log(r.status);
r = await fetch(url + "/1", { method: "DELETE" });
console.log(r.status, await r.json());
console.log(await (await fetch(url)).json());`, saida: "200 { id: 2, cliente: 'Bia', horario: '15:00', status: 'agendado' }\n204\n404 { erro: 'Não encontrado' }\n[ { id: 2, cliente: 'Bia', horario: '15:00', status: 'agendado' } ]", dicas: ['app.patch("/agendamentos/:id", ...) com find + Object.assign(ag, req.body) + res.json(ag)', 'app.delete("/agendamentos/:id", ...) com findIndex e splice(i, 1)', 'Nos dois, se não achar: return res.status(404).json({ erro: "Não encontrado" });'], sol: BASE + `
const agendamentos = [
  { id: 1, cliente: "Ana", horario: "10:00", status: "agendado" },
  { id: 2, cliente: "Bia", horario: "11:00", status: "agendado" }
];

app.get("/agendamentos", (req, res) => res.json(agendamentos));

app.patch("/agendamentos/:id", (req, res) => {
  const ag = agendamentos.find(a => a.id === Number(req.params.id));
  if (!ag) return res.status(404).json({ erro: "Não encontrado" });
  Object.assign(ag, req.body);
  res.json(ag);
});

app.delete("/agendamentos/:id", (req, res) => {
  const i = agendamentos.findIndex(a => a.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ erro: "Não encontrado" });
  agendamentos.splice(i, 1);
  res.sendStatus(204);
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-09', titulo: 'Validação e erros', icone: '🛡️',
            licao: [
              { titulo: 'Nunca confie no cliente', texto: `<p>Qualquer pessoa pode mandar qualquer coisa para a sua API (até sem usar o seu site). Por isso o servidor <b>sempre</b> confere os dados antes de salvar:</p><ul><li>campos obrigatórios presentes?</li><li>tipos certos (número é número)?</li><li>valores que fazem sentido (preço maior que zero)?</li><li>não está repetido (e-mail já cadastrado)?</li></ul><p>Se algo estiver errado, responda <code>400 Bad Request</code> (ou <code>409 Conflict</code> para repetido) com uma mensagem que ajude a corrigir. E <b>não salve nada</b>.</p>`, codigo: `const express = require("express");
const app = express();
app.use(express.json());
const servicos = [];

app.post("/servicos", (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || typeof nome !== "string") {
    return res.status(400).json({ erro: "Informe o nome" });
  }
  if (typeof preco !== "number" || preco <= 0) {
    return res.status(400).json({ erro: "O preço precisa ser um número maior que zero" });
  }
  const novo = { id: servicos.length + 1, nome: nome.trim(), preco };
  servicos.push(novo);
  res.status(201).json(novo);
});
app.listen(3000);

for (const corpo of [{ preco: 10 }, { nome: "Corte", preco: "40" }, { nome: " Corte ", preco: 40 }]) {
  const r = await fetch("http://localhost:3000/servicos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
  console.log(r.status, await r.json());
}` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Alguém tenta cadastrar um e-mail que já existe. Qual status é o mais adequado?', op: ['200', '201', '409 Conflict', '500'], c: 2, exp: '409 indica conflito com o estado atual (já existe). 400 também é aceitável; 500 nunca: não é erro do servidor.' },
              { tipo: 'quiz', p: 'O formulário do site já tem <code>required</code>. Ainda precisa validar no servidor?', op: ['Não', 'Sim: dá para chamar a API sem o site, ou burlar o HTML', 'Só em produção', 'Só para senhas'], c: 1, exp: 'Validação no navegador é conforto; no servidor é segurança.' },
              { tipo: 'codigo', p: 'Valide o cadastro em <code>POST /clientes</code>:<ul><li>sem <code>nome</code> (ou só espaços) → <code>400</code> <code>{ erro: "Nome é obrigatório" }</code></li><li><code>email</code> sem <code>@</code> → <code>400</code> <code>{ erro: "E-mail inválido" }</code></li><li>e-mail já cadastrado → <code>409</code> <code>{ erro: "E-mail já cadastrado" }</code></li><li>tudo certo → salva <code>{ id, nome, email }</code> (nome sem espaços nas pontas) e responde <code>201</code></li></ul>', inicio: BASE + `
const clientes = [{ id: 1, nome: "Ana", email: "ana@email.com" }];

app.post("/clientes", (req, res) => {

});

app.listen(3000);
`, teste: `const casos = [
  { email: "x@x.com" },
  { nome: "   ", email: "x@x.com" },
  { nome: "Bia", email: "bia.email.com" },
  { nome: "Bia", email: "ana@email.com" },
  { nome: "  Bia ", email: "bia@email.com" }
];
for (const c of casos) {
  const r = await fetch("http://localhost:3000/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
  console.log(r.status, await r.json());
}`, saida: "400 { erro: 'Nome é obrigatório' }\n400 { erro: 'Nome é obrigatório' }\n400 { erro: 'E-mail inválido' }\n409 { erro: 'E-mail já cadastrado' }\n201 { id: 2, nome: 'Bia', email: 'bia@email.com' }", dicas: ['const { nome, email } = req.body; e confira na ordem pedida, com return em cada erro.', 'if (!nome || !nome.trim()) return res.status(400).json({ erro: "Nome é obrigatório" });\nif (!email || !email.includes("@")) return ...', 'if (clientes.some(c => c.email === email)) return res.status(409).json(...);\nconst novo = { id: clientes.length + 1, nome: nome.trim(), email };'], sol: BASE + `
const clientes = [{ id: 1, nome: "Ana", email: "ana@email.com" }];

app.post("/clientes", (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }
  if (!email || !email.includes("@")) {
    return res.status(400).json({ erro: "E-mail inválido" });
  }
  if (clientes.some(c => c.email === email)) {
    return res.status(409).json({ erro: "E-mail já cadastrado" });
  }
  const novo = { id: clientes.length + 1, nome: nome.trim(), email };
  clientes.push(novo);
  res.status(201).json(novo);
});

app.listen(3000);` }
            ]
          },
          {
            id: 'be-10', titulo: 'Chefão: API de agendamentos', icone: '👑', xp: 60,
            licao: [
              { titulo: 'Uma API inteira', texto: `<p>Agora você monta a API que um app de agendamento usaria: listar com filtro, criar com validação, alterar o status e cancelar. É exatamente o tipo de código que roda por trás de apps como o do salão.</p><p>Faça uma rota por vez e use o botão <b>Executar</b> para ver o que o teste mostra antes de verificar.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Crie a API com o array <code>agenda</code>:<ol><li><code>GET /agenda</code>: lista tudo; com <code>?dia=AAAA-MM-DD</code>, só aquele dia</li><li><code>POST /agenda</code>: recebe <code>cliente</code>, <code>dia</code> e <code>hora</code>. Se faltar algum → <code>400</code> <code>{ erro: "Preencha cliente, dia e hora" }</code>. Se já existe agendamento no mesmo dia e hora → <code>409</code> <code>{ erro: "Horário ocupado" }</code>. Senão cria <code>{ id, cliente, dia, hora, status: "agendado" }</code> (id sequencial a partir de 1) e responde <code>201</code></li><li><code>PATCH /agenda/:id/cancelar</code>: muda o status para <code>"cancelado"</code> e devolve o agendamento (ou <code>404</code> <code>{ erro: "Não encontrado" }</code>). Um horário cancelado fica livre de novo</li></ol>', inicio: BASE + `
const agenda = [];
let proximoId = 1;

app.listen(3000);
`, teste: `const url = "http://localhost:3000/agenda";
const json = { "Content-Type": "application/json" };
const post = async d => { const r = await fetch(url, { method: "POST", headers: json, body: JSON.stringify(d) }); console.log(r.status, await r.json()); };
await post({ cliente: "Ana", dia: "2026-11-05", hora: "10:00" });
await post({ cliente: "Bia", dia: "2026-11-05" });
await post({ cliente: "Bia", dia: "2026-11-05", hora: "10:00" });
await post({ cliente: "Caio", dia: "2026-11-06", hora: "10:00" });
let r = await fetch(url + "/1/cancelar", { method: "PATCH" });
console.log(r.status, (await r.json()).status);
await post({ cliente: "Bia", dia: "2026-11-05", hora: "10:00" });
r = await fetch(url + "?dia=2026-11-05");
console.log((await r.json()).map(a => a.cliente + " " + a.status));
r = await fetch(url + "/99/cancelar", { method: "PATCH" });
console.log(r.status);`, saida: "201 { id: 1, cliente: 'Ana', dia: '2026-11-05', hora: '10:00', status: 'agendado' }\n400 { erro: 'Preencha cliente, dia e hora' }\n409 { erro: 'Horário ocupado' }\n201 { id: 2, cliente: 'Caio', dia: '2026-11-06', hora: '10:00', status: 'agendado' }\n200 cancelado\n201 { id: 3, cliente: 'Bia', dia: '2026-11-05', hora: '10:00', status: 'agendado' }\n[ 'Ana cancelado', 'Bia agendado' ]\n404", dicas: ['GET: let lista = agenda; if (req.query.dia) lista = lista.filter(a => a.dia === req.query.dia); res.json(lista);', 'POST: const ocupado = agenda.some(a => a.dia === dia && a.hora === hora && a.status !== "cancelado");', 'A rota de cancelar: app.patch("/agenda/:id/cancelar", (req, res) => { ... ag.status = "cancelado"; res.json(ag); });'], sol: BASE + `
const agenda = [];
let proximoId = 1;

app.get("/agenda", (req, res) => {
  let lista = agenda;
  if (req.query.dia) lista = lista.filter(a => a.dia === req.query.dia);
  res.json(lista);
});

app.post("/agenda", (req, res) => {
  const { cliente, dia, hora } = req.body;
  if (!cliente || !dia || !hora) {
    return res.status(400).json({ erro: "Preencha cliente, dia e hora" });
  }
  const ocupado = agenda.some(a => a.dia === dia && a.hora === hora && a.status !== "cancelado");
  if (ocupado) {
    return res.status(409).json({ erro: "Horário ocupado" });
  }
  const novo = { id: proximoId++, cliente, dia, hora, status: "agendado" };
  agenda.push(novo);
  res.status(201).json(novo);
});

app.patch("/agenda/:id/cancelar", (req, res) => {
  const ag = agenda.find(a => a.id === Number(req.params.id));
  if (!ag) return res.status(404).json({ erro: "Não encontrado" });
  ag.status = "cancelado";
  res.json(ag);
});

app.listen(3000);` }
            ]
          }
        ]
      }
    ]
  };
})();
