// Testes dos "motores" que rodam o código do aluno (os mesmos do navegador).
// Rode com: npm test   (precisa das ferramentas de desenvolvimento: npm install)
const test = require('node:test');
const assert = require('node:assert/strict');
const { executarJs } = require('../public/js/runtime/jsexec.js');
const { montarCodigo } = require('../public/js/runtime/montar.js');
const { criarAjudantes } = require('../public/js/runtime/csshelp.js');
const { rodarSql } = require('../public/js/runtime/sqlexec.js');
const { criarAmbiente } = require('../public/js/runtime/nodesim.js');
const { criarTerminal } = require('../public/js/runtime/terminal.js');

let parseHTML = null;
try { ({ parseHTML } = require('linkedom')); } catch { /* sem dependências de desenvolvimento */ }

async function js(codigo, extras) {
  const linhas = [];
  const r = await executarJs(codigo, '', l => linhas.push(l), 4000, extras || {});
  return { saida: linhas.join('\n'), erro: r.erro };
}

test('JavaScript: console, await e laço infinito com tempo esgotado', async () => {
  assert.equal((await js('console.log([1, 2], { a: "x" })')).saida, "[ 1, 2 ] { a: 'x' }");
  assert.equal((await js('await new Promise(r => setTimeout(r, 10)); console.log("ok")')).saida, 'ok');
  assert.match((await js('null.x')).erro, /TypeError/);
});

test('montar código: teste em bloco próprio (JS) e separado (HTML, terminal)', () => {
  assert.equal(montarCodigo('javascript', 'let a = 1;', 'let a = 2;').codigo, 'let a = 1;\n{\nlet a = 2;\n}');
  assert.deepEqual(montarCodigo('html', '<h1>x</h1>', 'console.log(1)'), { codigo: '<h1>x</h1>', teste: 'console.log(1)', deslocamento: 0 });
  assert.match(montarCodigo('terminal', 'ls', 'pwd').codigo, /#__TESTE__/);
});

test('CSS: cascata, herança, variáveis, @media e :hover', { skip: !parseHTML && 'linkedom não instalado' }, () => {
  const { document } = parseHTML(`<!doctype html><html><head><style>
    :root { --rosa: #E91E63 } body { color: red } h1 { color: var(--rosa); margin: 4px 8px }
    .a { display: flex } @media (max-width: 600px) { .a { flex-direction: column } } a:hover { color: blue }
  </style></head><body><h1 class="a">x</h1><p>y</p><a href="#">z</a></body></html>`);
  const { estilo, texto, quantos } = criarAjudantes(document);
  assert.equal(estilo('h1', 'color'), '#e91e63');
  assert.equal(estilo('p', 'color'), '#ff0000');
  assert.equal(estilo('h1', 'margin-left'), '8px');
  assert.equal(estilo('.a', 'flex-direction', { largura: 400 }), 'column');
  assert.equal(estilo('.a', 'flex-direction'), '');
  assert.equal(estilo('a', 'color', { estado: 'hover' }), '#0000ff');
  assert.equal(texto('h1'), 'x');
  assert.equal(quantos('p'), 1);
});

test('SQL: SELECT vira quadro, erro traz a linha', { skip: (() => { try { require.resolve('sql.js'); return false; } catch { return 'sql.js não instalado'; } })() }, async () => {
  const SQL = await require('sql.js')();
  const linhas = [];
  const banco = "CREATE TABLE t (nome TEXT, preco REAL); INSERT INTO t VALUES ('A', 10), ('B', 2.5);";
  assert.deepEqual(rodarSql(SQL, banco, 'SELECT nome, preco FROM t ORDER BY preco;', l => linhas.push(l)), {});
  assert.equal(linhas.join('\n'), 'nome | preco\nB | 2.5\nA | 10');
  const r = rodarSql(SQL, banco, 'SELECT 1;\nSELECT x FROM nada;', () => {});
  assert.match(r.erro, /no such table[\s\S]*linha 2/);
});

test('Node de treino: Express, JSON, JWT, bcrypt e MongoDB', async () => {
  const linhas = [];
  const amb = criarAmbiente(l => linhas.push(l));
  const r = await executarJs(`
    const express = require("express"); const app = express(); app.use(express.json());
    const jwt = require("jsonwebtoken"); const bcrypt = require("bcryptjs");
    const { MongoClient } = require("mongodb");
    const db = (await new MongoClient("mongodb://x").connect()).db("t");
    app.post("/x", async (req, res) => { await db.collection("c").insertOne(req.body); res.status(201).json({ n: await db.collection("c").countDocuments() }); });
    app.listen(3000);
    const r = await fetch("http://localhost:3000/x", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ a: 1 }) });
    console.log(r.status, await r.json());
    const t = jwt.sign({ id: 1 }, "s"); console.log(jwt.verify(t, "s").id);
    console.log(await bcrypt.compare("123456", await bcrypt.hash("123456", 10)));
    console.log((await fetch("http://localhost:3000/nada")).status);
  `, '', l => linhas.push(l), 5000, amb);
  assert.equal(r.erro, undefined);
  assert.equal(linhas.join('\n'), '201 { n: 1 }\n1\ntrue\n404');
});

test('Terminal de treino: Git, conflito e GitHub', async () => {
  const t = criarTerminal();
  const r = await t.rodar(`mkdir s && cd s
echo "a" > x.txt
git init
git add . && git commit -m "um"
git switch -c b
echo "b" > x.txt && git commit -am "dois"
git switch main
echo "c" > x.txt && git commit -am "tres"
git merge b
#__TESTE__
git status -s
cat x.txt`);
  assert.equal(r.saida, 'UU x.txt\n<<<<<<< HEAD\nc\n=======\nb\n>>>>>>> b');
  const r2 = await criarTerminal().rodar('gh repo create r\nmkdir p && cd p && git init && touch a && git add . && git commit -m "x"\ngit remote add origin https://github.com/aluno/r.git\ngit push -u origin main\n#__TESTE__\ngit status');
  assert.match(r2.saida, /up to date with 'origin\/main'/);
});
