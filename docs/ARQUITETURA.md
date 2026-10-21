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
| `teste` | codigo | Código acrescentado ao do aluno (Java: vira o `main`) |
| `testes` | codigo | Vários `{ entrada, saida }` |
| `usar` | codigo | `[regex, mensagem]`: obriga a usar algo (ex: `for`) |
| `entrada` | vários | O que seria "digitado" (`input`, `prompt`, `Scanner`) |
| `dom` | JS | HTML da página para exercícios de DOM |
| `saidaReal`, `erro` | prever | Saída real quando difere da alternativa, ou "deve dar erro" |

Depois de editar: `npm run validar` e `npm run curriculo`.

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
conquistas [ids]
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

## Variáveis de ambiente

Ver `.env.example` (todas comentadas).
