# Arquitetura do CodeQuest

Documento técnico para quem for mexer no código (inclusive você daqui a 6 meses).

## Visão geral

```
Navegador (celular/PC)                         Servidor (Node + Express)                Banco
──────────────────────                         ─────────────────────────                ─────
/aprender/... (HTML pronto)  ◄──────────────── src/paginas.js
/app (SPA: public/index.html + js/app.js) ◄─── public/ (arquivos estáticos)
   │  JS     → Web Worker (runtime/worker-js.js)
   │  DOM    → Web Worker + linkedom (runtime/worker-dom.js)
   │  Python → Web Worker + Pyodide (runtime/worker-py.js, baixa da CDN jsDelivr)
   │  HTML/CSS → Web Worker + linkedom + csshelp.js (runtime/worker-html.js)
   │  SQL    → Web Worker + sql.js/SQLite (runtime/worker-sql.js, runtime/sql/)
   │  Node   → Web Worker + Node simulado (runtime/worker-node.js + nodesim.js)
   │  React  → Web Worker + Preact + sucrase (runtime/worker-react.js + reactlib.js)
   │  Terminal → Web Worker + bash/Git simulados (runtime/worker-terminal.js + terminal.js)
   │  Java   ─────── POST /api/executar/java ──► src/javaRunner.js (javac/java)
   │
   └── fetch /api/... ───────────────────────► server.js ─► src/jogo.js (regras)  ─► src/store.js ─► MongoDB
                                                           src/painel.js (números)              ou data/db.json
```

## Pastas e arquivos

| Caminho | Responsabilidade |
|---|---|
| `server.js` | Rotas HTTP, autenticação (JWT), limites de uso, configurações do `.env` |
| `src/jogo.js` | Regras: XP, níveis, estrelas, ofensiva/protetor, conquistas, revisão espaçada. **Todo ponto é calculado aqui**, nunca no navegador |
| `src/store.js` | Banco: `ArquivoStore` (arquivo JSON) e `MongoStore` com a mesma interface. Também guarda estatísticas, avisos e backup |
| `src/painel.js` | Monta os números do painel do dono |
| `src/paginas.js` | Site público renderizado no servidor (aulas, institucionais, sitemap) |
| `src/javaRunner.js` | Compila e executa Java com segurança |
| `public/js/conteudo/*.js` | **O conteúdo dos cursos.** Lido pelo navegador e pelo servidor |
| `public/js/app.js` | Todas as telas do app (roteador por `#`) |
| `public/js/runtime/` | Executores que rodam nos Web Workers e no validador |
| `public/js/runtime/csshelp.js` | Calcula o CSS de um elemento (cascata, herança, var(), @media) e as ferramentas `texto/existe/quantos/atributo/estilo` |
| `public/js/runtime/sqlexec.js` | Roda SQL e formata o resultado (`a \| b`); `sql/` tem o sql.js |
| `public/js/runtime/nodesim.js` | Node simulado: express, http, mongodb, bcryptjs, jsonwebtoken, cors, dotenv, crypto, path, fs e `fetch` |
| `public/js/runtime/reactprep.js` | Prepara o código React (tira imports, traduz JSX) e cria `renderizar`, `clicar`, `digitar`, `escolher`, `enviar`, `esperar` e um `fetch` falso |
| `public/js/runtime/reactlib.js` | Preact + preact/compat + test-utils + sucrase (gerado por `npm run build:react`) |
| `public/js/runtime/terminal.js` | Terminal simulado: pastas, Git, "GitHub", npm e node |
| `public/js/editor.js`, `realce.js` | Editor de código e cores |
| `public/js/erros.js` | Tradução das mensagens de erro |
| `public/js/anuncios.js`, `consentimento.js`, `rastreio.js` | AdSense, aviso de cookies e contagem de visitas |
| `scripts/validar-conteudo.js` | Roda todas as respostas de todas as fases |
| `scripts/gerar-curriculo.js` | Gera `docs/CURRICULO.md` |
| `scripts/restaurar-backup.js` | Restaura um backup baixado no painel |

## Formato de uma fase

```js
{
  id: 'py-01',                 // NUNCA mude depois de publicado (o progresso usa o id)
  titulo: 'Olá, mundo!', icone: '👋',
  xp: 60,                      // opcional (padrão: 15 + 5 × número do mundo)
  licao: [ { titulo, texto (HTML), codigo?, entrada?, dom? } ],
  ex: [ /* quiz | prever | completar | montar | codigo */ ]
}
```

Campos de exercício:

| Campo | Tipos | Uso |
|---|---|---|
| `p` | todos | Enunciado (HTML permitido) |
| `op`, `c`, `exp` | quiz, prever | Alternativas, índice da certa, explicação |
| `codigo` | prever, completar | Código mostrado (`___` marca lacunas no completar) |
| `resp` | completar | Respostas aceitas por lacuna (texto ou lista de textos) |
| `linhas`, `extras` | montar | Ordem certa e linhas "pegadinha" |
| `inicio`, `saida`, `sol`, `dicas` | codigo | Código inicial, saída esperada, solução e dicas |
| `teste` | codigo (e completar, montar, prever, lição) | Código acrescentado ao do aluno (Java: vira o `main`; HTML: JavaScript que olha a página; terminal: comandos cuja saída é conferida) |
| `testes` | codigo | Vários `{ entrada, saida }` |
| `usar` | codigo | `[regex, mensagem]`: obriga a usar algo (ex: `for`) |
| `entrada` | vários | O que seria "digitado" (`input`, `prompt`, `Scanner`) |
| `dom` | JS, React | HTML da página para exercícios de DOM (no React, o padrão é `<div id="root">`) |
| `banco` | SQL | SQL que cria as tabelas antes do código do aluno. Pode ficar no exercício, na fase ou na trilha |
| `pasta` | terminal | Comandos rodados antes, em silêncio (o cenário). Exercício ou fase |
| `api` | React | O que o `fetch` responde: `{ "/api/servicos": [...] }`. Exercício ou fase |
| `previa` | HTML (quiz) | Mostrar a página desenhada junto da pergunta |
| `erroEsperado` | lição | O exemplo da lição deve dar erro de propósito |
| `saidaReal`, `erro` | prever | Saída real quando difere da alternativa, ou "deve dar erro" |

Depois de editar: `npm run validar` e `npm run curriculo`.

### Trilhas e arquivos de conteúdo

| Trilha (`id`) | `ling` | Arquivos |
|---|---|---|
| `python` | python | `python.js` |
| `javascript` | javascript | `javascript.js` |
| `java` | java | `java.js` |
| `htmlcss` | html | `htmlcss-1.js`, `htmlcss-2.js` |
| `react` | react | `react.js` |
| `backend` | node | `backend-1.js`, `backend-2.js` |
| `sql` | sql | `sql.js` |
| `git` | terminal | `git.js` |

Os arquivos são lidos em **ordem alfabética** (por isso as partes têm `-1` e `-2`). O servidor coloca um `<script>` para cada um no app. A ordem das trilhas na tela fica em `ORDEM` (`app.js` e `src/paginas.js`) e a Carreira Full Stack em `FULLSTACK` (`app.js`, `paginas.js` e `src/jogo.js`).

## Como o código do aluno é comparado

A saída do programa é comparada com `saida` depois de remover espaços no fim das linhas e linhas vazias no final. Funções que fazem isso:
- `normalizar` em `executor.js`;
- `normalizar` em `validar-conteudo.js`.

Elas precisam ficar iguais.

O JavaScript usa um formatador próprio (`runtime/formatar.js`), igual ao do Node (`[ 1, 2 ]`, `{ a: 1 }`). O mesmo arquivo roda no navegador e no validador.

Java:
- roda com `-Duser.language=pt -Duser.country=BR`: `String.format("%.2f")` usa vírgula;
- código sem classe é "embrulhado" num `main`;
- com `teste`, o aluno escreve só métodos ou classes (`runtime/montar.js`).

## Banco de dados

**Coleção `usuarios`** (um documento por pessoa):

```
_id, usuario, nome, senhaHash (bcrypt), avatar, criadoEm,
xp, semana {key, xp}, hoje {dia, xp}, metaDiaria,
ofensiva, maxOfensiva, ultimoDia, protetores,
fases { 'py-01': {estrelas, melhorXp, vezes, em} },
revisao { 'py-01:0': {caixa, proxima} }, revisoesCertas,
conquistas [ids],
provas { 'git': {tentativas: [{dia, em, nota}], melhor, aprovado: {nota, em}} },
certificados { 'git': {codigo, curso, nome, nota, horas, em} }, codigosCert [códigos]
```

**Coleções de estatística** (Mongo; no modo arquivo ficam dentro de `metricas`):

| Coleção | Conteúdo |
|---|---|
| `estatisticas` | 1 por dia: visualizações, fases, revisões, cadastros, páginas, cursos |
| `visitantes_dia` | 1 por aparelho por dia (TTL 400 dias) |
| `visitantes` | 1 por aparelho (dia em que apareceu) |
| `usuarios_dia` | 1 por usuário logado por dia, com `estudou` (TTL 400 dias) |
| `feedback` | Avisos de problema enviados pelo botão ⚑ |

## Rotas da API

| Método e rota | Login | O quê |
|---|---|---|
| `POST /api/auth/cadastro`, `/login` | — | Conta |
| `GET/PATCH /api/eu`, `POST /api/eu/excluir` | ✔ | Dados e exclusão da conta |
| `POST /api/progresso/fase`, `/revisao` | ✔ | Conclui fase ou revisão (servidor calcula XP) |
| `GET /api/ranking?periodo=semana\|geral` | ✔ | Ranking |
| `POST /api/executar/java` | ✔ | Roda Java |
| `POST /api/evento` | opcional | Conta visita |
| `POST /api/feedback` | ✔ | Reportar problema |
| `GET /api/admin/painel`, `/feedback`, `/backup` | admin | Painel, avisos, backup |
| `POST /api/admin/usuarios/:u/senha`, `DELETE /api/admin/usuarios/:u` | admin | Senha provisória, remover |
| `GET /api/saude`, `/api/meta` | — | Verificação e conquistas |
| `POST /api/sugestao` | opcional | Sugestões, pedidos, problemas e elogios |
| `GET /api/prova/:trilha` | ✔ | Situação da prova final (liberada, tentativas, melhor nota, certificado) |
| `POST /api/prova/:trilha/iniciar`, `/enviar` | ✔ | Sorteia as perguntas (token assinado) e corrige |
| `POST /api/certificados/:trilha` | ✔ | Emite ou atualiza o certificado (nome completo) |
| `GET /certificado/:codigo` | — | Página pública do certificado (imprimir, PDF, LinkedIn) |

## Variáveis de ambiente

Ver `.env.example` (todas comentadas).

## Testes

| Arquivo | O que testa |
|---|---|
| `tests/jogo.test.js` | Regras (XP, estrelas, revisão, prova) e integridade do conteúdo (ids, habilidades, perguntas da prova) |
| `tests/runtime.test.js` | Motores: JavaScript, CSS, SQL, Node de treino e terminal/Git |
| `tests/api.test.js` | Liga o servidor numa porta livre com um banco temporário e testa a API e o site público |
| `scripts/validar-conteudo.js` | Roda todas as respostas de todas as fases |

`npm test` roda os três primeiros; `npm run testar:tudo` roda tudo. O GitHub Actions (`.github/workflows/testes.yml`) roda a cada push.
