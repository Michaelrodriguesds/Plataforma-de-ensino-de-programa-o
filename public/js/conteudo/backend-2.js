// =============================================================
// Trilha Back-end com Node.js — parte 2
// (middlewares, organização, MongoDB, senhas com bcrypt e login com JWT)
// Continua a trilha criada em backend-1.js.
// =============================================================
(function () {
  var C = window.CURSOS;
  var BASE = `const express = require("express");
const app = express();
app.use(express.json());
`;
  var MONGO = `const { MongoClient, ObjectId } = require("mongodb");
const cliente = new MongoClient("mongodb://localhost:27017");
await cliente.connect();
const db = cliente.db("salao");
`;
  var JSONH = '{ "Content-Type": "application/json" }';

  C.backend.mundos.push(
    // ===================================================== MUNDO 3
    {
      titulo: 'Organizando o servidor', desc: 'Middlewares, rotas separadas, erros e configurações.',
      fases: [
        {
          id: 'be-11', titulo: 'Middlewares', icone: '🧅',
          licao: [
            { titulo: 'O caminho do pedido', texto: `<p>Um <b>middleware</b> é uma função que roda <b>no meio do caminho</b>, antes da rota. Ele recebe <code>(req, res, next)</code> e pode:</p><ul><li>olhar ou mudar o pedido (anotar a hora, ler o login)</li><li>responder e parar ali (bloquear quem não tem permissão)</li><li>chamar <code>next()</code> para passar para o próximo</li></ul><p>É como a recepção do salão: confere o nome, anota a chegada e só então manda para a cadeira. O <code>express.json()</code> que você já usa é um middleware!</p><p>A <b>ordem</b> importa: eles rodam na ordem em que foram registrados com <code>app.use</code>.</p>`, codigo: BASE + `
// registra cada pedido que chega
app.use((req, res, next) => {
  console.log("Chegou:", req.method, req.url);
  next(); // sem isso, o pedido fica parado aqui para sempre
});

app.get("/servicos", (req, res) => res.json(["Corte", "Escova"]));
app.listen(3000);

await fetch("http://localhost:3000/servicos");
await fetch("http://localhost:3000/agenda");` },
            { titulo: 'Middleware só em algumas rotas', texto: `<p>Um middleware pode ser passado direto na rota, antes da função final. Assim ele vale só ali:</p><pre>app.delete("/servicos/:id", soAdmin, (req, res) => { ... });</pre><p>É exatamente assim que funciona a proteção de rotas com login, que você vai fazer no fim da trilha.</p>`, codigo: BASE + `
function soAdmin(req, res, next) {
  if (req.headers["x-chave"] !== "segredo123") {
    return res.status(403).json({ erro: "Só a administração pode fazer isso" });
  }
  next();
}

app.get("/relatorio", soAdmin, (req, res) => res.json({ faturamento: 12500 }));
app.listen(3000);

let r = await fetch("http://localhost:3000/relatorio");
console.log(r.status, await r.json());
r = await fetch("http://localhost:3000/relatorio", { headers: { "x-chave": "segredo123" } });
console.log(r.status, await r.json());` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Um middleware não chamou <code>next()</code> nem respondeu. O que acontece com o pedido?', op: ['Segue normal', 'Fica esperando para sempre (até dar tempo esgotado)', 'Volta 404', 'Volta 200 vazio'], c: 1, exp: 'Quem não chama next() precisa responder; senão o pedido fica pendurado.' },
            { tipo: 'quiz', p: 'Em que ordem os middlewares rodam?', op: ['Em ordem alfabética', 'Na ordem em que foram registrados', 'Do último para o primeiro', 'Ao mesmo tempo'], c: 1, exp: 'Por isso o express.json() costuma ser um dos primeiros app.use.' },
            { tipo: 'prever', codigo: BASE + `app.use((req, res, next) => { req.inicio = "A"; next(); });
app.use((req, res, next) => { req.inicio += "B"; next(); });
app.get("/", (req, res) => res.send(req.inicio + "C"));
app.listen(3000);
const r = await fetch("http://localhost:3000/");
console.log(await r.text());`, op: ['ABC', 'C', 'AC', 'BAC'], c: 0, exp: 'O pedido passa pelos dois middlewares, na ordem, antes de chegar na rota.' },
            { tipo: 'codigo', p: 'Crie o middleware <code>exigirChave</code>: se o cabeçalho <code>x-api-key</code> não for <code>salao2026</code>, responde <code>401</code> com <code>{ erro: "Chave inválida" }</code>; senão chama <code>next()</code>. Use ele <b>só</b> na rota <code>GET /clientes</code> (a rota <code>GET /servicos</code> continua aberta).', inicio: BASE + `
app.get("/servicos", (req, res) => res.json(["Corte", "Escova"]));

app.get("/clientes", (req, res) => res.json(["Ana", "Bia"]));

app.listen(3000);
`, teste: `const url = "http://localhost:3000";
let r = await fetch(url + "/servicos");
console.log("servicos:", r.status);
r = await fetch(url + "/clientes");
console.log("sem chave:", r.status, await r.json());
r = await fetch(url + "/clientes", { headers: { "x-api-key": "errada" } });
console.log("chave errada:", r.status);
r = await fetch(url + "/clientes", { headers: { "x-api-key": "salao2026" } });
console.log("chave certa:", r.status, await r.json());`, saida: "servicos: 200\nsem chave: 401 { erro: 'Chave inválida' }\nchave errada: 401\nchave certa: 200 [ 'Ana', 'Bia' ]", dicas: ['function exigirChave(req, res, next) { ... }', 'if (req.headers["x-api-key"] !== "salao2026") return res.status(401).json({ erro: "Chave inválida" });\nnext();', 'app.get("/clientes", exigirChave, (req, res) => ...)'], sol: BASE + `
function exigirChave(req, res, next) {
  if (req.headers["x-api-key"] !== "salao2026") {
    return res.status(401).json({ erro: "Chave inválida" });
  }
  next();
}

app.get("/servicos", (req, res) => res.json(["Corte", "Escova"]));

app.get("/clientes", exigirChave, (req, res) => res.json(["Ana", "Bia"]));

app.listen(3000);` }
          ]
        },
        {
          id: 'be-12', titulo: 'Rotas organizadas', icone: '🗃️',
          licao: [
            { titulo: 'express.Router', texto: `<p>Com 40 rotas num arquivo só, ninguém acha nada. O <code>express.Router()</code> cria um "mini app" só com as rotas de um assunto:</p><pre>const rotasClientes = express.Router();\nrotasClientes.get("/", ...);     // GET /clientes\nrotasClientes.get("/:id", ...);  // GET /clientes/5\n\napp.use("/clientes", rotasClientes);</pre><p>As rotas do router são escritas <b>sem o prefixo</b>: o <code>app.use("/clientes", ...)</code> é que coloca. Num projeto real, cada router fica no seu arquivo (<code>rotas/clientes.js</code>) e é exportado com <code>module.exports</code>.</p>`, codigo: BASE + `
const rotasServicos = express.Router();
rotasServicos.get("/", (req, res) => res.json(["Corte", "Escova"]));
rotasServicos.get("/:id", (req, res) => res.json({ id: req.params.id }));

app.use("/api/servicos", rotasServicos);
app.listen(3000);

for (const u of ["/api/servicos", "/api/servicos/7", "/servicos"]) {
  const r = await fetch("http://localhost:3000" + u);
  console.log(u, r.status);
}` },
            { titulo: 'Uma estrutura de pastas comum', texto: `<pre>meu-projeto/\n  server.js          (cria o app e liga)\n  rotas/\n    clientes.js      (express.Router)\n    agenda.js\n  middlewares/\n    login.js\n  .env               (segredos, fora do Git)\n  package.json</pre><p>O CodeQuest, por exemplo, tem <code>server.js</code> com as rotas e uma pasta <code>src</code> com as regras do jogo e o acesso ao banco.</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Com <code>app.use("/api/agenda", router)</code> e <code>router.get("/hoje", ...)</code>, qual URL chega nessa rota?', op: ['/hoje', '/api/agenda/hoje', '/api/hoje', '/agenda/hoje'], c: 1, exp: 'O prefixo do app.use soma com o caminho do router.' },
            { tipo: 'completar', p: 'Monte o router de profissionais.', codigo: BASE + `const rotas = express.___();
rotas.get("/", (req, res) => res.json(["Marta", "Rita"]));
app.___("/profissionais", rotas);
app.listen(3000);
const r = await fetch("http://localhost:3000/profissionais");
console.log(await r.json());`, resp: ['Router', 'use'], op: ['Router', 'use', 'route', 'get'], saida: "[ 'Marta', 'Rita' ]", exp: 'express.Router() cria; app.use(prefixo, router) monta.' },
            { tipo: 'codigo', p: 'Organize em dois routers:<ul><li><code>rotasClientes</code>, montado em <code>/api/clientes</code>, com <code>GET /</code> (lista de nomes) e <code>GET /:id</code> (o nome do cliente na posição <code>id - 1</code>, em <code>{ nome }</code>)</li><li><code>rotasServicos</code>, montado em <code>/api/servicos</code>, com <code>GET /</code> (lista de serviços)</li></ul>', inicio: BASE + `
const clientes = ["Ana", "Bia", "Caio"];
const servicos = ["Corte", "Escova"];

app.listen(3000);
`, teste: `for (const u of ["/api/clientes", "/api/clientes/2", "/api/servicos", "/clientes"]) {
  const r = await fetch("http://localhost:3000" + u);
  console.log(u, r.status, r.status === 200 ? await r.json() : "");
}`, saida: "/api/clientes 200 [ 'Ana', 'Bia', 'Caio' ]\n/api/clientes/2 200 { nome: 'Bia' }\n/api/servicos 200 [ 'Corte', 'Escova' ]\n/clientes 404", dicas: ['const rotasClientes = express.Router();', 'rotasClientes.get("/:id", (req, res) => res.json({ nome: clientes[Number(req.params.id) - 1] }));', 'app.use("/api/clientes", rotasClientes);\napp.use("/api/servicos", rotasServicos);'], sol: BASE + `
const clientes = ["Ana", "Bia", "Caio"];
const servicos = ["Corte", "Escova"];

const rotasClientes = express.Router();
rotasClientes.get("/", (req, res) => res.json(clientes));
rotasClientes.get("/:id", (req, res) => res.json({ nome: clientes[Number(req.params.id) - 1] }));

const rotasServicos = express.Router();
rotasServicos.get("/", (req, res) => res.json(servicos));

app.use("/api/clientes", rotasClientes);
app.use("/api/servicos", rotasServicos);

app.listen(3000);` }
          ]
        },
        {
          id: 'be-13', titulo: 'Tratando erros', icone: '🧯',
          licao: [
            { titulo: 'O middleware de erro', texto: `<p>Se algo explodir dentro de uma rota (um <code>throw</code>, um banco fora do ar), o Express procura um <b>middleware de erro</b>: ele é igual aos outros, mas com <b>4 parâmetros</b>, começando pelo erro:</p><pre>app.use((err, req, res, next) => {\n  console.log(err.message);\n  res.status(500).json({ erro: "Algo deu errado" });\n});</pre><p>Ele fica <b>depois</b> de todas as rotas. Assim o cliente recebe uma resposta educada, e o detalhe técnico fica só no log do servidor (nunca mostre o erro interno para o usuário: ele pode revelar segredos).</p>`, codigo: BASE + `
app.get("/estoque", (req, res) => {
  throw new Error("planilha de estoque corrompida");
});

app.use((err, req, res, next) => {
  console.log("LOG:", err.message);
  res.status(500).json({ erro: "Erro interno. Tente de novo mais tarde." });
});
app.listen(3000);

const r = await fetch("http://localhost:3000/estoque");
console.log(r.status, await r.json());` },
            { titulo: 'Erros com status', texto: `<p>Um truque comum: criar erros que já sabem seu status, e deixar o middleware de erro decidir a resposta.</p><pre>const e = new Error("Cliente não encontrado");\ne.status = 404;\nthrow e;</pre><p>No middleware: <code>res.status(err.status || 500)</code>. Assim as rotas ficam curtinhas.</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Como o Express sabe que um middleware é de <b>erro</b>?', op: ['Pelo nome erro', 'Ele tem 4 parâmetros: (err, req, res, next)', 'Ele fica no começo', 'Ele usa res.error'], c: 1, exp: 'O Express conta os parâmetros: 4 = middleware de erro.' },
            { tipo: 'quiz', p: 'Por que não responder <code>res.json({ erro: err.stack })</code> para o cliente?', op: ['É mais lento', 'Detalhes internos podem revelar caminhos, senhas e falhas para atacantes', 'O JSON não aceita', 'O cliente não sabe ler'], c: 1, exp: 'Mostre uma mensagem amigável ao cliente e guarde o detalhe no log.' },
            { tipo: 'codigo', p: 'Faça a rota <code>GET /servicos/:id</code> <b>lançar</b> um erro com <code>status = 404</code> e mensagem <code>Serviço não encontrado</code> quando não achar. Depois crie o middleware de erro: responde <code>err.status</code> (ou <code>500</code> se não tiver) com <code>{ erro: mensagem }</code>, mas, quando for 500, a mensagem é sempre <code>Erro interno</code>.', inicio: BASE + `
const servicos = [{ id: 1, nome: "Corte" }];

app.get("/servicos/:id", (req, res) => {
  const s = servicos.find(x => x.id === Number(req.params.id));
  // se não achar, lance o erro aqui
  res.json(s);
});

app.get("/quebrado", (req, res) => {
  throw new Error("senha do banco: 1234");
});

// middleware de erro aqui

app.listen(3000);
`, teste: `for (const u of ["/servicos/1", "/servicos/5", "/quebrado"]) {
  const r = await fetch("http://localhost:3000" + u);
  console.log(u, r.status, await r.json());
}`, saida: "/servicos/1 200 { id: 1, nome: 'Corte' }\n/servicos/5 404 { erro: 'Serviço não encontrado' }\nError: senha do banco: 1234\n/quebrado 500 { erro: 'Erro interno' }", dicas: ['if (!s) { const e = new Error("Serviço não encontrado"); e.status = 404; throw e; }', 'app.use((err, req, res, next) => { const status = err.status || 500; ... });', 'if (status === 500) console.log(String(err)); res.status(status).json({ erro: status === 500 ? "Erro interno" : err.message });'], sol: BASE + `
const servicos = [{ id: 1, nome: "Corte" }];

app.get("/servicos/:id", (req, res) => {
  const s = servicos.find(x => x.id === Number(req.params.id));
  if (!s) {
    const e = new Error("Serviço não encontrado");
    e.status = 404;
    throw e;
  }
  res.json(s);
});

app.get("/quebrado", (req, res) => {
  throw new Error("senha do banco: 1234");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.log(String(err));
  res.status(status).json({ erro: status === 500 ? "Erro interno" : err.message });
});

app.listen(3000);` }
          ]
        },
        {
          id: 'be-14', titulo: 'Configurações e CORS', icone: '⚙️',
          licao: [
            { titulo: 'Variáveis de ambiente', texto: `<p>Senhas, chaves e endereços de banco <b>não</b> ficam escritos no código (ele vai para o GitHub!). Eles ficam em <b>variáveis de ambiente</b>, lidas com <code>process.env</code>:</p><pre>const porta = process.env.PORT || 3000;\nconst segredo = process.env.JWT_SECRET;</pre><p>No seu PC, elas ficam num arquivo <code>.env</code> (que vai no <code>.gitignore</code>), lido pelo pacote <code>dotenv</code>:</p><pre>// .env\nPORT=3000\nJWT_SECRET=uma-frase-bem-longa</pre><pre>require("dotenv").config();</pre><p>No servidor de produção (Render, Railway...), você cadastra as mesmas variáveis no painel.</p>`, codigo: `require("dotenv").config();
console.log("porta:", process.env.PORT || 3000);
console.log("tem segredo?", Boolean(process.env.JWT_SECRET));` },
            { titulo: 'CORS', texto: `<p>Por segurança, o navegador bloqueia um site de chamar a API de <b>outro endereço</b> (o React em <code>localhost:5173</code> chamando a API em <code>localhost:3000</code>, por exemplo). Para liberar, a API precisa dizer quem pode, com os cabeçalhos <b>CORS</b>. O pacote <code>cors</code> faz isso:</p><pre>const cors = require("cors");\napp.use(cors()); // libera para todos</pre><p>Em produção, o ideal é liberar só o seu site: <code>cors({ origin: "https://meusalao.com" })</code>.</p>`, codigo: BASE + `const cors = require("cors");
app.use(cors());
app.get("/servicos", (req, res) => res.json(["Corte"]));
app.listen(3000);
const r = await fetch("http://localhost:3000/servicos");
console.log(r.headers.get("access-control-allow-origin"));` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Onde guardar a senha do banco de dados?', op: ['No código, numa constante', 'Numa variável de ambiente (arquivo .env fora do Git)', 'No package.json', 'No README'], c: 1, exp: 'Tudo que é segredo vai em variável de ambiente. O .env nunca vai para o GitHub.' },
            { tipo: 'quiz', p: 'O React (em outro endereço) recebe erro de CORS ao chamar sua API. O que resolver no servidor?', op: ['Mudar a porta', 'Liberar a origem com o middleware cors', 'Usar POST', 'Desligar o JSON'], c: 1, exp: 'Quem libera o acesso é a API, com os cabeçalhos CORS.' },
            { tipo: 'codigo', p: 'Deixe o servidor configurável:<ul><li>a porta vem de <code>process.env.PORT</code>, ou <code>3000</code> se não existir</li><li>a rota <code>GET /config</code> responde <code>{ ambiente, temSegredo }</code>: <code>ambiente</code> é <code>process.env.NODE_ENV</code> ou <code>"desenvolvimento"</code>, e <code>temSegredo</code> é <code>true</code> se <code>process.env.JWT_SECRET</code> existir (nunca devolva o segredo!)</li><li>use o middleware <code>cors()</code></li></ul>', inicio: BASE + `
`, teste: `const r = await fetch("http://localhost:3000/config");
console.log(r.status, await r.json());
console.log("cors:", r.headers.get("access-control-allow-origin"));`, saida: "200 { ambiente: 'desenvolvimento', temSegredo: false }\ncors: *", dicas: ['const cors = require("cors"); app.use(cors());', 'const porta = process.env.PORT || 3000; app.listen(porta);', 'res.json({ ambiente: process.env.NODE_ENV || "desenvolvimento", temSegredo: Boolean(process.env.JWT_SECRET) });'], sol: BASE + `const cors = require("cors");
app.use(cors());

app.get("/config", (req, res) => {
  res.json({
    ambiente: process.env.NODE_ENV || "desenvolvimento",
    temSegredo: Boolean(process.env.JWT_SECRET)
  });
});

const porta = process.env.PORT || 3000;
app.listen(porta);` }
          ]
        }
      ]
    },
    // ===================================================== MUNDO 4
    {
      titulo: 'Banco de dados e segurança', desc: 'Guardar de verdade no MongoDB, proteger senhas e fazer login.',
      fases: [
        {
          id: 'be-15', titulo: 'MongoDB: guardando dados', icone: '🍃',
          licao: [
            { titulo: 'Por que um banco?', texto: `<p>Até agora os dados ficavam num array. Se o servidor reinicia, <b>tudo some</b>. Um <b>banco de dados</b> guarda de forma permanente.</p><p>O <b>MongoDB</b> guarda <b>documentos</b> (objetos parecidos com JSON) dentro de <b>coleções</b>. É o banco que o CodeQuest usa, e tem plano grátis no MongoDB Atlas.</p><table border="1" cellpadding="4"><tr><th>SQL</th><th>MongoDB</th></tr><tr><td>tabela</td><td>coleção</td></tr><tr><td>linha</td><td>documento</td></tr><tr><td>coluna</td><td>campo</td></tr></table><p>Cada documento ganha um <code>_id</code> único automaticamente (um <code>ObjectId</code>).</p>` },
            { titulo: 'Conectar e inserir', texto: `<p>Com o pacote oficial <code>mongodb</code>:</p><ol><li>crie o cliente com a <b>string de conexão</b> (no mundo real, ela vem de <code>process.env.MONGODB_URI</code>)</li><li><code>await cliente.connect()</code></li><li>escolha o banco e a coleção</li><li><code>insertOne</code> / <code>insertMany</code> para guardar</li></ol><p>Tudo no banco é <b>assíncrono</b> (leva tempo), por isso o <code>await</code>. Aqui no CodeQuest o MongoDB roda na memória do navegador, mas os comandos são os mesmos do de verdade. (No Node de verdade, o <code>await</code> fica dentro de uma função <code>async</code>.)</p>`, codigo: MONGO + `const clientes = db.collection("clientes");

const r = await clientes.insertOne({ nome: "Ana", cidade: "Campinas" });
console.log("id criado:", r.insertedId);

await clientes.insertMany([
  { nome: "Bia", cidade: "Santos" },
  { nome: "Caio", cidade: "Campinas" }
]);

const todos = await clientes.find().toArray();
console.log(todos.length, todos.map(c => c.nome));` }
          ],
          ex: [
            { tipo: 'quiz', p: 'No MongoDB, o equivalente a uma "linha" de tabela é...', op: ['uma coleção', 'um documento', 'um banco', 'um campo'], c: 1, exp: 'Coleção ~ tabela, documento ~ linha, campo ~ coluna.' },
            { tipo: 'quiz', p: 'Por que guardar num banco e não num array?', op: ['O array é mais lento para ler', 'O array some quando o servidor reinicia; o banco guarda para sempre', 'Array não aceita objetos', 'Não há diferença'], c: 1, exp: 'A memória do servidor é temporária. O banco é permanente e pode ser usado por vários servidores.' },
            { tipo: 'completar', p: 'Conecte e insira um serviço.', codigo: `const { MongoClient } = require("mongodb");
const cliente = new MongoClient("mongodb://localhost:27017");
await cliente.___();
const servicos = cliente.db("salao").___("servicos");
await servicos.___({ nome: "Corte", preco: 40 });
console.log(await servicos.countDocuments());`, resp: ['connect', 'collection', 'insertOne'], op: ['connect', 'collection', 'insertOne', 'save'], saida: '1', exp: 'connect, db().collection(), insertOne.' },
            { tipo: 'codigo', p: 'Na coleção <code>servicos</code> do banco <code>salao</code>, insira de uma vez (<code>insertMany</code>) três serviços: <b>Corte</b> (40), <b>Escova</b> (35) e <b>Coloração</b> (120), com os campos <code>nome</code> e <code>preco</code>. Depois mostre quantos documentos há (<code>countDocuments</code>).', inicio: MONGO + `const servicos = db.collection("servicos");

`, teste: `const lista = await db.collection("servicos").find({}, { projection: { _id: 0 } }).toArray();
console.log(lista);`, saida: "3\n[ { nome: 'Corte', preco: 40 }, { nome: 'Escova', preco: 35 }, { nome: 'Coloração', preco: 120 } ]", dicas: ['await servicos.insertMany([ { nome: "Corte", preco: 40 }, ... ]);', 'Os três objetos dentro de um array.', 'console.log(await servicos.countDocuments());'], sol: MONGO + `const servicos = db.collection("servicos");

await servicos.insertMany([
  { nome: "Corte", preco: 40 },
  { nome: "Escova", preco: 35 },
  { nome: "Coloração", preco: 120 }
]);
console.log(await servicos.countDocuments());` }
          ]
        },
        {
          id: 'be-16', titulo: 'MongoDB: buscar e alterar', icone: '🔁',
          licao: [
            { titulo: 'Buscando com filtros', texto: `<ul><li><code>find({ cidade: "Santos" })</code>: todos que combinam (depois <code>.toArray()</code>)</li><li><code>findOne({ nome: "Ana" })</code>: só o primeiro (ou <code>null</code>)</li><li>operadores: <code>{ preco: { $gt: 50 } }</code> (maior que), <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$ne</code> (diferente), <code>$in: [...]</code></li><li><code>.sort({ preco: -1 })</code> ordena (-1 = decrescente), <code>.limit(5)</code> limita</li></ul><p>Para buscar pelo <code>_id</code> que veio na URL (texto), converta: <code>{ _id: new ObjectId(req.params.id) }</code>.</p>`, codigo: MONGO + `const s = db.collection("servicos");
await s.insertMany([
  { nome: "Corte", preco: 40, categoria: "Cabelo" },
  { nome: "Coloração", preco: 120, categoria: "Química" },
  { nome: "Manicure", preco: 25, categoria: "Unhas" }
]);
const caros = await s.find({ preco: { $gt: 30 } }).sort({ preco: -1 }).toArray();
console.log(caros.map(x => x.nome));
console.log(await s.findOne({ categoria: "Unhas" }, { projection: { _id: 0 } }));` },
            { titulo: 'Alterando e apagando', texto: `<ul><li><code>updateOne(filtro, { $set: { preco: 45 } })</code>: muda campos (sem o <code>$set</code>, dá erro)</li><li><code>{ $inc: { visitas: 1 } }</code>: soma</li><li><code>{ $push: { tags: "vip" } }</code>: acrescenta num array</li><li><code>deleteOne(filtro)</code> / <code>deleteMany(filtro)</code>: apaga</li></ul><p>As respostas dizem quantos foram atingidos: <code>matchedCount</code>, <code>modifiedCount</code>, <code>deletedCount</code>. Use isso para responder 404 quando nada foi encontrado.</p>`, codigo: MONGO + `const c = db.collection("clientes");
await c.insertOne({ nome: "Ana", visitas: 1 });
await c.updateOne({ nome: "Ana" }, { $inc: { visitas: 1 }, $set: { vip: true } });
console.log(await c.findOne({ nome: "Ana" }, { projection: { _id: 0 } }));
const r = await c.deleteOne({ nome: "Zé" });
console.log("apagados:", r.deletedCount);` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Qual filtro busca serviços com preço <b>até</b> 50?', op: ['{ preco: 50 }', '{ preco: { $lte: 50 } }', '{ preco: { $lt: 50 } }', '{ preco < 50 }'], c: 1, exp: '$lte = menor ou igual (less than or equal).' },
            { tipo: 'prever', codigo: MONGO + `const c = db.collection("clientes");
await c.insertMany([{ nome: "Ana", pontos: 10 }, { nome: "Bia", pontos: 3 }]);
await c.updateOne({ nome: "Bia" }, { $inc: { pontos: 5 } });
const r = await c.updateOne({ nome: "Caio" }, { $inc: { pontos: 5 } });
const bia = await c.findOne({ nome: "Bia" });
console.log(bia.pontos, r.matchedCount);`, op: ['8 0', '5 1', '8 1', '3 0'], c: 0, exp: 'A Bia tinha 3 e ganhou 5. O Caio não existe: matchedCount 0 (nada foi alterado).' },
            { tipo: 'codigo', p: 'Com a coleção já preenchida:<ol><li>mostre os <b>nomes</b> dos clientes de <code>Campinas</code> com <b>5 ou mais</b> visitas, do que tem mais visitas para o que tem menos</li><li>dê <code>$set: { vip: true }</code> em todos eles com <code>updateMany</code> e mostre o <code>modifiedCount</code></li><li>apague quem tem <code>0</code> visitas e mostre o <code>deletedCount</code></li></ol>', inicio: MONGO + `const clientes = db.collection("clientes");
await clientes.insertMany([
  { nome: "Ana", cidade: "Campinas", visitas: 8 },
  { nome: "Bia", cidade: "Santos", visitas: 12 },
  { nome: "Caio", cidade: "Campinas", visitas: 5 },
  { nome: "Duda", cidade: "Campinas", visitas: 2 },
  { nome: "Edu", cidade: "Santos", visitas: 0 }
]);

`, teste: `console.log(await clientes.countDocuments({ vip: true }), await clientes.countDocuments());`, saida: "[ 'Ana', 'Caio' ]\n2\n1\n2 4", dicas: ['const filtro = { cidade: "Campinas", visitas: { $gte: 5 } };', 'const lista = await clientes.find(filtro).sort({ visitas: -1 }).toArray(); console.log(lista.map(c => c.nome));', 'const r1 = await clientes.updateMany(filtro, { $set: { vip: true } }); console.log(r1.modifiedCount);\nconst r2 = await clientes.deleteMany({ visitas: 0 }); console.log(r2.deletedCount);'], sol: MONGO + `const clientes = db.collection("clientes");
await clientes.insertMany([
  { nome: "Ana", cidade: "Campinas", visitas: 8 },
  { nome: "Bia", cidade: "Santos", visitas: 12 },
  { nome: "Caio", cidade: "Campinas", visitas: 5 },
  { nome: "Duda", cidade: "Campinas", visitas: 2 },
  { nome: "Edu", cidade: "Santos", visitas: 0 }
]);

const filtro = { cidade: "Campinas", visitas: { $gte: 5 } };
const lista = await clientes.find(filtro).sort({ visitas: -1 }).toArray();
console.log(lista.map(c => c.nome));

const r1 = await clientes.updateMany(filtro, { $set: { vip: true } });
console.log(r1.modifiedCount);

const r2 = await clientes.deleteMany({ visitas: 0 });
console.log(r2.deletedCount);` }
          ]
        },
        {
          id: 'be-17', titulo: 'API com MongoDB', icone: '🔌',
          licao: [
            { titulo: 'Juntando Express e banco', texto: `<p>Agora as rotas usam o banco em vez do array. Como as funções do banco são assíncronas, a função da rota vira <code>async</code>:</p><pre>app.get("/servicos", async (req, res) => {\n  const lista = await servicos.find().toArray();\n  res.json(lista);\n});</pre><p>Ao buscar pelo <code>_id</code>, confira antes se o texto é um id válido com <code>ObjectId.isValid(id)</code>; senão o <code>new ObjectId</code> dá erro.</p><p>O <code>_id</code> vira texto automaticamente quando a resposta é transformada em JSON.</p>`, codigo: BASE + MONGO + `const servicos = db.collection("servicos");

app.post("/servicos", async (req, res) => {
  const r = await servicos.insertOne({ nome: req.body.nome, preco: req.body.preco });
  res.status(201).json({ _id: r.insertedId, nome: req.body.nome });
});
app.get("/servicos/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ erro: "id inválido" });
  const s = await servicos.findOne({ _id: new ObjectId(req.params.id) });
  if (!s) return res.status(404).json({ erro: "Não encontrado" });
  res.json(s);
});
app.listen(3000);

let r = await fetch("http://localhost:3000/servicos", { method: "POST", headers: ${JSONH}, body: JSON.stringify({ nome: "Corte", preco: 40 }) });
const criado = await r.json();
console.log(r.status, criado);
r = await fetch("http://localhost:3000/servicos/" + criado._id);
console.log(r.status, await r.json());
r = await fetch("http://localhost:3000/servicos/123");
console.log(r.status, await r.json());` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Por que a função da rota precisa de <code>async</code>?', op: ['Para ficar mais rápida', 'Para poder usar await com as funções do banco', 'O Express exige', 'Para usar res.json'], c: 1, exp: 'await só funciona dentro de funções async.' },
            { tipo: 'quiz', p: 'O que fazer antes de <code>new ObjectId(req.params.id)</code>?', op: ['Nada', 'Conferir com ObjectId.isValid, para responder 400 se o id for inválido', 'Converter com Number()', 'Usar toUpperCase'], c: 1, exp: 'Um id malformado faz o new ObjectId lançar erro. Confira e responda 400.' },
            { tipo: 'codigo', p: 'Crie a API de clientes no MongoDB:<ul><li><code>POST /clientes</code>: insere <code>{ nome, telefone }</code> e responde <code>201</code> com <code>{ id }</code> (o <code>insertedId</code>)</li><li><code>GET /clientes</code>: lista todos, só com <code>nome</code> e <code>telefone</code> (use <code>projection: { _id: 0 }</code>), em ordem de nome</li><li><code>DELETE /clientes/:id</code>: apaga pelo <code>_id</code>; responde <code>204</code>, ou <code>404</code> (<code>{ erro: "Não encontrado" }</code>) se nada foi apagado, ou <code>400</code> (<code>{ erro: "id inválido" }</code>) se o id for inválido</li></ul>', inicio: BASE + MONGO + `const clientes = db.collection("clientes");

app.listen(3000);
`, teste: `const url = "http://localhost:3000/clientes";
const criar = async d => (await (await fetch(url, { method: "POST", headers: ${JSONH}, body: JSON.stringify(d) })).json()).id;
const idBia = await criar({ nome: "Bia", telefone: "2222" });
await criar({ nome: "Ana", telefone: "1111" });
console.log(await (await fetch(url)).json());
let r = await fetch(url + "/" + idBia, { method: "DELETE" });
console.log(r.status);
r = await fetch(url + "/" + idBia, { method: "DELETE" });
console.log(r.status, await r.json());
r = await fetch(url + "/abc", { method: "DELETE" });
console.log(r.status, await r.json());
console.log(await (await fetch(url)).json());`, saida: "[ { nome: 'Ana', telefone: '1111' }, { nome: 'Bia', telefone: '2222' } ]\n204\n404 { erro: 'Não encontrado' }\n400 { erro: 'id inválido' }\n[ { nome: 'Ana', telefone: '1111' } ]", dicas: ['app.post("/clientes", async (req, res) => { const r = await clientes.insertOne({ nome: req.body.nome, telefone: req.body.telefone }); res.status(201).json({ id: r.insertedId }); });', 'GET: await clientes.find({}, { projection: { _id: 0 } }).sort({ nome: 1 }).toArray()', 'DELETE: if (!ObjectId.isValid(id)) ... ; const r = await clientes.deleteOne({ _id: new ObjectId(id) }); if (r.deletedCount === 0) ...; res.sendStatus(204);'], sol: BASE + MONGO + `const clientes = db.collection("clientes");

app.post("/clientes", async (req, res) => {
  const r = await clientes.insertOne({ nome: req.body.nome, telefone: req.body.telefone });
  res.status(201).json({ id: r.insertedId });
});

app.get("/clientes", async (req, res) => {
  const lista = await clientes.find({}, { projection: { _id: 0 } }).sort({ nome: 1 }).toArray();
  res.json(lista);
});

app.delete("/clientes/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ erro: "id inválido" });
  const r = await clientes.deleteOne({ _id: new ObjectId(id) });
  if (r.deletedCount === 0) return res.status(404).json({ erro: "Não encontrado" });
  res.sendStatus(204);
});

app.listen(3000);` }
          ]
        },
        {
          id: 'be-18', titulo: 'Senhas com bcrypt', icone: '🔐',
          licao: [
            { titulo: 'Nunca guarde a senha', texto: `<p>Se o banco vazar (acontece com empresas grandes!), as senhas não podem estar lá. Guardamos um <b>hash</b>: o resultado de embaralhar a senha de um jeito que <b>não tem volta</b>.</p><p>O <b>bcrypt</b> é feito para isso: ele é de propósito <b>lento</b> (para dificultar quem tenta adivinhar milhões de senhas) e coloca um <b>sal</b> aleatório (a mesma senha gera hashes diferentes).</p><ul><li>no cadastro: <code>const hash = await bcrypt.hash(senha, 10)</code> e guarda o hash</li><li>no login: <code>await bcrypt.compare(senhaDigitada, hashGuardado)</code> → <code>true</code> ou <code>false</code></li></ul><p>O <code>10</code> é o "custo": quanto maior, mais lento e seguro.</p>`, codigo: `const bcrypt = require("bcryptjs");
const hash1 = await bcrypt.hash("minhaSenha123", 10);
const hash2 = await bcrypt.hash("minhaSenha123", 10);
console.log(hash1);
console.log("mesma senha, hashes iguais?", hash1 === hash2);
console.log("senha certa:", await bcrypt.compare("minhaSenha123", hash1));
console.log("senha errada:", await bcrypt.compare("minhasenha123", hash1));` }
          ],
          ex: [
            { tipo: 'quiz', p: 'Por que o mesmo texto gera hashes diferentes no bcrypt?', op: ['É um erro', 'Por causa do sal aleatório que vai junto', 'Porque depende do dia', 'Porque usa criptografia reversível'], c: 1, exp: 'O sal aleatório evita que duas pessoas com a mesma senha tenham o mesmo hash.' },
            { tipo: 'quiz', p: 'Como saber se a senha digitada no login está certa?', op: ['Desfazer o hash e comparar', 'bcrypt.compare(senhaDigitada, hashGuardado)', 'Comparar hash === senha', 'Gerar um novo hash e comparar com ==='], c: 1, exp: 'O compare pega o sal que está dentro do hash guardado e refaz a conta.' },
            { tipo: 'codigo', p: 'Crie:<ul><li><code>POST /cadastro</code>: recebe <code>email</code> e <code>senha</code>; se a senha tiver menos de 6 caracteres, <code>400</code> <code>{ erro: "Senha muito curta" }</code>; senão guarda <code>{ email, senhaHash }</code> no array <code>usuarios</code> (com <code>bcrypt.hash</code>) e responde <code>201</code> com <code>{ email }</code> (nunca devolva a senha nem o hash)</li><li><code>POST /login</code>: acha o usuário pelo e-mail e confere com <code>bcrypt.compare</code>; responde <code>{ ok: true }</code>, ou <code>401</code> <code>{ erro: "E-mail ou senha incorretos" }</code> (a mesma mensagem para e-mail inexistente e senha errada)</li></ul>', inicio: BASE + `const bcrypt = require("bcryptjs");
const usuarios = [];

app.listen(3000);
`, teste: `const post = async (rota, d) => { const r = await fetch("http://localhost:3000" + rota, { method: "POST", headers: ${JSONH}, body: JSON.stringify(d) }); console.log(rota, r.status, await r.json()); };
await post("/cadastro", { email: "ana@x.com", senha: "123" });
await post("/cadastro", { email: "ana@x.com", senha: "segura123" });
console.log("hash guardado:", usuarios[0].senhaHash.startsWith("$2"), "| senha em texto?", JSON.stringify(usuarios).includes("segura123"));
await post("/login", { email: "ana@x.com", senha: "segura123" });
await post("/login", { email: "ana@x.com", senha: "errada" });
await post("/login", { email: "ze@x.com", senha: "segura123" });`, saida: "/cadastro 400 { erro: 'Senha muito curta' }\n/cadastro 201 { email: 'ana@x.com' }\nhash guardado: true | senha em texto? false\n/login 200 { ok: true }\n/login 401 { erro: 'E-mail ou senha incorretos' }\n/login 401 { erro: 'E-mail ou senha incorretos' }", dicas: ['app.post("/cadastro", async (req, res) => { const { email, senha } = req.body; ... });', 'const senhaHash = await bcrypt.hash(senha, 10); usuarios.push({ email, senhaHash });', 'No login: const u = usuarios.find(x => x.email === req.body.email); if (!u || !(await bcrypt.compare(req.body.senha, u.senhaHash))) return res.status(401).json(...);'], sol: BASE + `const bcrypt = require("bcryptjs");
const usuarios = [];

app.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;
  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: "Senha muito curta" });
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  usuarios.push({ email, senhaHash });
  res.status(201).json({ email });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const u = usuarios.find(x => x.email === email);
  if (!u || !(await bcrypt.compare(senha, u.senhaHash))) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }
  res.json({ ok: true });
});

app.listen(3000);` }
          ]
        },
        {
          id: 'be-19', titulo: 'Login com JWT', icone: '🎫',
          licao: [
            { titulo: 'O crachá digital', texto: `<p>O HTTP não tem memória: cada pedido chega sozinho. Como o servidor sabe que é a Ana pedindo? Com um <b>token</b>, um crachá que o servidor entrega no login.</p><p>O <b>JWT</b> (<i>JSON Web Token</i>) é um texto em 3 partes separadas por ponto: cabeçalho, <b>dados</b> (ex: o id da pessoa) e <b>assinatura</b>. A assinatura é feita com um <b>segredo</b> que só o servidor conhece: se alguém mudar os dados, a assinatura não confere.</p><ul><li>login: <code>jwt.sign({ id: 7 }, SEGREDO, { expiresIn: "7d" })</code></li><li>cada pedido: o cliente manda o cabeçalho <code>Authorization: Bearer TOKEN</code></li><li>o servidor confere: <code>jwt.verify(token, SEGREDO)</code> devolve os dados ou lança erro</li></ul><p>⚠️ Os dados do JWT <b>não são secretos</b> (qualquer um decodifica). Nunca coloque senha neles.</p>`, codigo: `const jwt = require("jsonwebtoken");
const SEGREDO = "troque-por-algo-longo";
const token = jwt.sign({ id: 7, nome: "Ana" }, SEGREDO, { expiresIn: "1h" });
console.log(token.split(".").length, "partes");
console.log(jwt.verify(token, SEGREDO).nome);
try {
  jwt.verify(token, "outro-segredo");
} catch (e) {
  console.log("recusado:", e.message);
}` },
            { titulo: 'O porteiro', texto: `<p>Um middleware confere o token antes das rotas protegidas e guarda quem é a pessoa em <code>req.usuario</code>:</p><pre>function exigirLogin(req, res, next) {\n  const h = req.headers.authorization || "";\n  try {\n    req.usuario = jwt.verify(h.replace("Bearer ", ""), SEGREDO);\n    next();\n  } catch {\n    res.status(401).json({ erro: "Faça login" });\n  }\n}</pre><p>O CodeQuest usa exatamente isso (procure <code>exigirLogin</code> no <code>server.js</code>).</p>` }
          ],
          ex: [
            { tipo: 'quiz', p: 'O que impede alguém de editar o JWT e trocar o id para o de outra pessoa?', op: ['Os dados são criptografados', 'A assinatura: sem o segredo do servidor, não dá para gerar uma assinatura válida', 'O navegador bloqueia', 'Nada impede'], c: 1, exp: 'Mudou os dados, a assinatura deixa de conferir e o verify recusa.' },
            { tipo: 'quiz', p: 'Em que cabeçalho o cliente costuma mandar o token?', op: ['Content-Type', 'Authorization: Bearer TOKEN', 'Cookie-Token', 'X-Senha'], c: 1, exp: 'O padrão é Authorization com o esquema Bearer.' },
            { tipo: 'codigo', p: 'Complete a API:<ul><li><code>POST /login</code>: se <code>email</code> e <code>senha</code> conferem com o usuário fixo abaixo (use <code>bcrypt.compare</code>), responde <code>{ token }</code> com <code>jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: "1h" })</code>; senão <code>401</code> <code>{ erro: "Login inválido" }</code></li><li>middleware <code>exigirLogin</code>: lê o <code>Authorization: Bearer ...</code>, verifica o token e coloca os dados em <code>req.usuario</code>; se falhar, <code>401</code> <code>{ erro: "Faça login" }</code></li><li><code>GET /perfil</code> (protegida): responde <code>{ id: req.usuario.id, nome: usuario.nome }</code></li></ul>', inicio: BASE + `const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SEGREDO = process.env.JWT_SECRET || "segredo-de-teste";
const usuario = { id: 42, nome: "Ana", email: "ana@x.com", senhaHash: bcrypt.hashSync("segura123", 10) };

app.listen(3000);
`, teste: `const url = "http://localhost:3000";
let r = await fetch(url + "/login", { method: "POST", headers: ${JSONH}, body: JSON.stringify({ email: "ana@x.com", senha: "errada" }) });
console.log("login errado:", r.status, await r.json());
r = await fetch(url + "/login", { method: "POST", headers: ${JSONH}, body: JSON.stringify({ email: "ana@x.com", senha: "segura123" }) });
const { token } = await r.json();
console.log("login certo:", r.status, typeof token);
r = await fetch(url + "/perfil");
console.log("sem token:", r.status, await r.json());
r = await fetch(url + "/perfil", { headers: { Authorization: "Bearer " + token + "x" } });
console.log("token adulterado:", r.status);
r = await fetch(url + "/perfil", { headers: { Authorization: "Bearer " + token } });
console.log("com token:", r.status, await r.json());`, saida: "login errado: 401 { erro: 'Login inválido' }\nlogin certo: 200 string\nsem token: 401 { erro: 'Faça login' }\ntoken adulterado: 401\ncom token: 200 { id: 42, nome: 'Ana' }", dicas: ['Login: const ok = req.body.email === usuario.email && await bcrypt.compare(req.body.senha, usuario.senhaHash);', 'function exigirLogin(req, res, next) { const h = req.headers.authorization || ""; try { req.usuario = jwt.verify(h.replace("Bearer ", ""), SEGREDO); next(); } catch (e) { res.status(401).json({ erro: "Faça login" }); } }', 'app.get("/perfil", exigirLogin, (req, res) => res.json({ id: req.usuario.id, nome: usuario.nome }));'], sol: BASE + `const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SEGREDO = process.env.JWT_SECRET || "segredo-de-teste";
const usuario = { id: 42, nome: "Ana", email: "ana@x.com", senhaHash: bcrypt.hashSync("segura123", 10) };

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const ok = email === usuario.email && await bcrypt.compare(senha, usuario.senhaHash);
  if (!ok) return res.status(401).json({ erro: "Login inválido" });
  const token = jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: "1h" });
  res.json({ token });
});

function exigirLogin(req, res, next) {
  const h = req.headers.authorization || "";
  try {
    req.usuario = jwt.verify(h.replace("Bearer ", ""), SEGREDO);
    next();
  } catch (e) {
    res.status(401).json({ erro: "Faça login" });
  }
}

app.get("/perfil", exigirLogin, (req, res) => {
  res.json({ id: req.usuario.id, nome: usuario.nome });
});

app.listen(3000);` }
          ]
        },
        {
          id: 'be-20', titulo: 'Chefão: API com login', icone: '👑', xp: 80,
          licao: [
            { titulo: 'Tudo junto', texto: `<p>Este é o coração de quase todo sistema web: <b>cadastro, login e dados que só o dono vê</b>. Cada pessoa vê só os <b>próprios</b> agendamentos, e ninguém mexe no de ninguém.</p><p>Você vai usar: Express, MongoDB, bcrypt, JWT, middleware e validação. Quando terminar, você sabe fazer o back-end de um app de verdade. 🚀</p>` }
          ],
          ex: [
            { tipo: 'codigo', p: 'Complete a API (as coleções <code>usuarios</code> e <code>agendamentos</code> já existem):<ol><li><code>POST /cadastro</code> (<code>nome</code>, <code>email</code>, <code>senha</code>): e-mail já usado → <code>409</code> <code>{ erro: "E-mail já cadastrado" }</code>; senão salva com <code>senhaHash</code> e responde <code>201</code> <code>{ nome }</code></li><li><code>POST /login</code>: confere e responde <code>{ token }</code> com <code>jwt.sign({ id: String(usuario._id) }, SEGREDO)</code>; falhou → <code>401</code> <code>{ erro: "Login inválido" }</code></li><li><code>exigirLogin</code>: como na fase anterior (<code>401</code> <code>{ erro: "Faça login" }</code>)</li><li><code>POST /agendamentos</code> (protegida): salva <code>{ usuarioId: req.usuario.id, servico, dia }</code> e responde <code>201</code> <code>{ servico, dia }</code></li><li><code>GET /agendamentos</code> (protegida): só os do usuário logado, sem <code>_id</code> e sem <code>usuarioId</code> (projection), em ordem de <code>dia</code></li></ol>', inicio: BASE + `const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
` + MONGO + `const usuarios = db.collection("usuarios");
const agendamentos = db.collection("agendamentos");
const SEGREDO = process.env.JWT_SECRET || "segredo-de-teste";

app.listen(3000);
`, teste: `const url = "http://localhost:3000";
const req = async (metodo, rota, corpo, token) => {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = "Bearer " + token;
  const r = await fetch(url + rota, { method: metodo, headers: h, body: corpo ? JSON.stringify(corpo) : undefined });
  return { status: r.status, dados: await r.json() };
};
console.log(await req("POST", "/cadastro", { nome: "Ana", email: "ana@x.com", senha: "123456" }));
console.log(await req("POST", "/cadastro", { nome: "Ana 2", email: "ana@x.com", senha: "abcdef" }));
await req("POST", "/cadastro", { nome: "Bia", email: "bia@x.com", senha: "bia12345" });
console.log((await req("POST", "/login", { email: "ana@x.com", senha: "000000" })).status);
const tAna = (await req("POST", "/login", { email: "ana@x.com", senha: "123456" })).dados.token;
const tBia = (await req("POST", "/login", { email: "bia@x.com", senha: "bia12345" })).dados.token;
console.log(await req("POST", "/agendamentos", { servico: "Escova", dia: "2026-11-10" }));
console.log(await req("POST", "/agendamentos", { servico: "Corte", dia: "2026-11-09" }, tAna));
await req("POST", "/agendamentos", { servico: "Escova", dia: "2026-11-12" }, tAna);
await req("POST", "/agendamentos", { servico: "Unha", dia: "2026-11-09" }, tBia);
console.log("Ana:", (await req("GET", "/agendamentos", null, tAna)).dados);
console.log("Bia:", (await req("GET", "/agendamentos", null, tBia)).dados);
console.log("senhas em texto no banco?", JSON.stringify(await usuarios.find().toArray()).includes("123456"));`, saida: "{ status: 201, dados: { nome: 'Ana' } }\n{ status: 409, dados: { erro: 'E-mail já cadastrado' } }\n401\n{ status: 401, dados: { erro: 'Faça login' } }\n{ status: 201, dados: { servico: 'Corte', dia: '2026-11-09' } }\nAna: [ { servico: 'Corte', dia: '2026-11-09' }, { servico: 'Escova', dia: '2026-11-12' } ]\nBia: [ { servico: 'Unha', dia: '2026-11-09' } ]\nsenhas em texto no banco? false", dicas: ['Cadastro: if (await usuarios.findOne({ email })) return res.status(409)...; await usuarios.insertOne({ nome, email, senhaHash: await bcrypt.hash(senha, 10) });', 'Login: const u = await usuarios.findOne({ email }); if (!u || !(await bcrypt.compare(senha, u.senhaHash))) ...; res.json({ token: jwt.sign({ id: String(u._id) }, SEGREDO) });', 'POST /agendamentos: await agendamentos.insertOne({ usuarioId: req.usuario.id, servico, dia }); res.status(201).json({ servico, dia });', 'GET: await agendamentos.find({ usuarioId: req.usuario.id }, { projection: { _id: 0, usuarioId: 0 } }).sort({ dia: 1 }).toArray()'], sol: BASE + `const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
` + MONGO + `const usuarios = db.collection("usuarios");
const agendamentos = db.collection("agendamentos");
const SEGREDO = process.env.JWT_SECRET || "segredo-de-teste";

app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (await usuarios.findOne({ email })) {
    return res.status(409).json({ erro: "E-mail já cadastrado" });
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  await usuarios.insertOne({ nome, email, senhaHash });
  res.status(201).json({ nome });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const u = await usuarios.findOne({ email });
  if (!u || !(await bcrypt.compare(senha, u.senhaHash))) {
    return res.status(401).json({ erro: "Login inválido" });
  }
  res.json({ token: jwt.sign({ id: String(u._id) }, SEGREDO) });
});

function exigirLogin(req, res, next) {
  const h = req.headers.authorization || "";
  try {
    req.usuario = jwt.verify(h.replace("Bearer ", ""), SEGREDO);
    next();
  } catch (e) {
    res.status(401).json({ erro: "Faça login" });
  }
}

app.post("/agendamentos", exigirLogin, async (req, res) => {
  const { servico, dia } = req.body;
  await agendamentos.insertOne({ usuarioId: req.usuario.id, servico, dia });
  res.status(201).json({ servico, dia });
});

app.get("/agendamentos", exigirLogin, async (req, res) => {
  const lista = await agendamentos
    .find({ usuarioId: req.usuario.id }, { projection: { _id: 0, usuarioId: 0 } })
    .sort({ dia: 1 })
    .toArray();
  res.json(lista);
});

app.listen(3000);` }
          ]
        }
      ]
    }
  );
})();
