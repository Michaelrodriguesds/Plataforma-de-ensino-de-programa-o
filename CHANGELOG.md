# Histórico de versões (CHANGELOG)

Registro de tudo o que mudou no CodeQuest. A versão mais nova fica em cima.
Ao fazer qualquer mudança, acrescente uma linha aqui e aumente a versão no `package.json`.

Formato: **MAIOR.MENOR.CORREÇÃO**
- **MAIOR:** mudou algo que quebra o que já existia (ex: formato do banco).
- **MENOR:** novidade (fases, telas, recursos).
- **CORREÇÃO:** conserto de bug.

---

## [1.4.2] — 2026-11-09 — Layout no PC e notebook

- **Corrigido:** no PC/notebook as telas do app ficavam esticadas de ponta a ponta. Uma regra de CSS da 1.3 (`max-width: 100vw`) apagava a largura máxima das telas. Agora o conteúdo fica centralizado como foi desenhado; no celular nada muda.
- **Tela inicial em telas grandes (1100px ou mais):** mais larga, com os cartões das trilhas em grade de 3 colunas.
- Service worker `cq-v8`, para os aparelhos baixarem o CSS novo.

---

## [1.4.1] — 2026-11-02 — Revisão geral, testes automáticos e correções

Tudo detalhado em `docs/REVISAO.md`.
- **Testes automáticos:** `npm test` (19 testes: regras, motores de código e a API inteira num servidor de teste) e `npm run testar:tudo` (testes + validador). GitHub Actions roda tudo a cada push (`.github/workflows/testes.yml`).
- **Segurança:** prova não pode ser reenviada; trocar senha (nova tela no perfil) e senha provisória derrubam logins antigos; bloqueio de `\uXXXX` no Java; avatar sem HTML; fim do XP infinito em fases repetidas e do bônus vazio da revisão; contas excluídas não geram erro 500; senha errada não desloga mais.
- **Desempenho:** respostas compactadas (gzip); service worker não baixa mais os arquivos grandes de cara.
- **MongoDB:** painel com consultas compatíveis, índice TTL opcional, limite de 2.000 mensagens; testado com servidor compatível com MongoDB.
- Conexão com o MongoDB: aspas e espaços colados por engano na `MONGODB_URI` são ignorados, e o log do Render explica a causa do erro (senha, `<db_password>`, Network Access).
- Limites de fases, Java e prova contados **por aluno** (não por IP: turma de escola usa o mesmo IP); aviso de "muitas execuções" explicado.
- `Referrer-Policy` ajustada para o AdSense/Analytics; `compression` 1.8.2; `ARQUIVO_DADOS` (arquivo de dados alternativo, usado nos testes).

---

## [1.4.0] — 2026-11-02 — Prova final e certificado

- **Prova final em cada trilha** (`#/prova/:trilha`), liberada ao concluir todas as fases:
  - 15 perguntas sorteadas das fases (perguntas e "prever"), sem dicas, diferentes a cada tentativa;
  - aprovação com **70%**; até **3 tentativas por dia**;
  - as perguntas vão "assinadas" (JWT) e a correção é feita no servidor;
  - no fim, a lista do que errou, com a resposta certa e o link para rever a fase.
- **Certificado de conclusão ilustrativo** (sem reconhecimento do MEC), emitido após passar:
  - nome completo escolhido pela pessoa, trilha, número de fases, **carga horária estimada**, **habilidades trabalhadas**, nota da prova, data e **código de verificação** (ex: `CQ-AS6R-MK68`);
  - página pública `/certificado/CÓDIGO` para conferir, **imprimir ou salvar em PDF** (A4 deitado), **adicionar ao LinkedIn** e compartilhar no WhatsApp (sem anúncios e fora do Google, com `noindex`).
- Carga horária calculada pelo conteúdo (`cargaHoraria` em `src/jogo.js`): Python 26 h, JavaScript 29 h, Java 23 h, HTML e CSS 16 h, React 10 h, Back-end 13 h, SQL 14 h, Git 10 h.
- Campo `habilidades` em cada trilha (usado no certificado).
- O certificado aparece na trilha, no cartão do início, no perfil ("Certificados") e no fim da última fase.
- Painel: certificados emitidos e quantas pessoas têm certificado.
- Textos atualizados: perguntas frequentes, Sobre e Termos de uso (certificado ilustrativo; pode ser cancelado se obtido com fraude).

---

## [1.3.1] — 2026-11-02 — Sugestões, "online agora" e Render sem Docker

- **Tela 💬 Sugestões** (`#/sugestao`), que funciona com ou sem conta: tipo (ideia, pedido de aula, problema, elogio), nota de 1 a 5 estrelas e contato opcional para resposta. Links no início do app, no perfil, no fim de cada fase e no rodapé do site. Rota `POST /api/sugestao`.
- **Painel:**
  - bloco **Agora** com **🟢 Online agora** (aparelhos com o site aberto nos últimos 5 minutos, com conta e visitantes) e onde eles estão. O app manda um sinal por minuto (`tipo: 'sinal'`, que não conta como visita);
  - **Mensagens dos alunos** junta as sugestões e os avisos ⚑, com filtro por tipo, nota média e contato;
  - o funil "Onde as pessoas param" agora mostra as 8 trilhas.
- `render.yaml` pergunta `ADMIN_USUARIOS` e `CONTATO_EMAIL` e já define `ANUNCIOS_DEMO=0`: publicar pelo **Blueprint** do Render não exige saber Docker. Mapa visual atualizado com esse caminho.

---

## [1.3.0] — 2026-11-02 — Carreira Full Stack

### 5 trilhas novas: de 103 para 197 fases (de 409 para 709 exercícios)
| Trilha | Fases | Ids | Como roda |
|---|---|---|---|
| 🎨 HTML e CSS | 22 | `hc-01` a `hc-22` | a página do aluno vira prévia de verdade (iframe sem scripts) e um teste em JS confere a página com `texto()`, `existe()`, `quantos()`, `atributo()` e `estilo()` |
| ⚛️ React | 16 | `re-01` a `re-16` | Preact + preact/compat (mesma forma de escrever do React) e JSX traduzido pelo sucrase, num Web Worker |
| 🟩 Back-end com Node.js | 20 | `be-01` a `be-20` | um "Node de treino" com Express, http, MongoDB (na memória), bcryptjs, jsonwebtoken (HMAC-SHA256 de verdade), cors, dotenv, crypto, path e fs |
| 🗄️ SQL e Bancos de Dados | 20 | `sql-01` a `sql-20` | SQLite de verdade (sql.js/WebAssembly, arquivos em `public/js/runtime/sql/`) |
| 🌿 Git, Terminal e Deploy | 16 | `git-01` a `git-16` | um terminal de treino com pastas, Git (branches, merge, conflitos), "GitHub" (`gh repo create`, push, pull, clone), npm e node |

- **Mapa da Carreira Full Stack** na tela inicial e no site público: HTML e CSS → JavaScript → React → Back-end → SQL → Git.
- **Conquistas novas:** uma por trilha (`formado-htmlcss`, `formado-react`, `formado-backend`, `formado-sql`, `formado-git`) e **Desenvolvedor Full Stack** (`fullstack`). "Poliglota" agora vale só para Python, JavaScript e Java.
- **Laboratório** para todas as trilhas (com exemplos prontos para cada uma).
- **Campos novos nas fases** (ver `docs/ARQUITETURA.md`): `banco` (SQL), `pasta` (terminal), `api` (React), `teste` também em completar/montar/prever e na lição.
- Tabelas do banco mostradas ao aluno em cada exercício de SQL, e o resultado de SELECT aparece como tabela.
- Realce de código para SQL, terminal e CSS dentro do HTML; barras de símbolos para cada trilha.
- Mensagens de erro traduzidas para SQL, back-end e React.
- O servidor coloca automaticamente um `<script>` para cada arquivo de `public/js/conteudo` no app (criar trilha = criar arquivo).
- Validador: roda as 5 trilhas novas, confere se o código inicial não passa sozinho e exige explicação nas perguntas.
- Novos scripts: `npm run build:react` (gera `reactlib.js`) e `npm run copiar:sql` (copia o sql.js).
- `.gitattributes` (fim de linha LF) para acabar com os avisos "LF will be replaced by CRLF" no Windows.

### Correções
- `body-parser` atualizado (alerta de segurança de negação de serviço) — versão do `package-lock.json`.

---

## [1.2.1] — 2026-10-21 — Mapa visual do projeto

- **`docs/mapa-codequest.html`**: guia visual (abra no navegador) com:
  - **Onde estamos:** trilha das 12 etapas (construir → rodar no PC → GitHub → Atlas → Render → domínio → Search Console → AdSense → anúncios → pagamento → crescer), com tarefas para marcar;
  - **Passo a passo** para Windows 11, com comandos para copiar, "deu certo se…" e erros comuns (Java pelo `jbr` do Android Studio);
  - **Como funciona:** 5 fluxogramas (peças do sistema, jornada do aluno, botão Verificar, caminho do dinheiro, como atualizar).

---

## [1.2.0] — 2026-10-21 — Curso completo e ferramentas do dono

### Curso: de 76 para 103 fases (de 319 para 409 exercícios)

**JavaScript (+11 fases, agora 37):**
- `js-27` Map, Set e JSON
- `js-28` Closures
- `js-29` Verdadeiro, falso e `?.`
- **Mundo novo "JavaScript na página (DOM)":**
  - `js-30` Mexendo na página
  - `js-31` Eventos e cliques
  - `js-32` Criando elementos
  - `js-33` Formulários
  - `js-34` Projeto: lista de tarefas
- `js-35` Composição e protótipos
- `js-36` Iteradores e geradores
- `js-37` Módulos e organização

**Python (+8 fases, agora 33):**
- `py-26` Tuplas, conjuntos e fatias
- `py-27` Módulos e bibliotecas
- `py-28` Arquivos e JSON
- `py-29` Métodos especiais
- `py-30` Composição
- `py-31` classmethod e dataclass
- `py-32` Exceções personalizadas
- `py-33` Type hints e testes

**Java (+8 fases, agora 33):**
- `java-26` char e StringBuilder
- `java-27` Matrizes
- `java-28` Set, fila e pilha
- `java-29` Exceções verificadas
- `java-30` equals, hashCode e composição
- `java-31` enum
- `java-32` Comparator e interfaces modernas
- `java-33` Optional e datas

### Recursos novos
- **Modo página (DOM):** exercícios de JavaScript com uma página HTML.
  - O código roda num Web Worker com a biblioteca `linkedom`.
  - O aluno vê o HTML, a página desenhada antes e como ela ficou depois.
  - Arquivos: `public/js/runtime/worker-dom.js` e `linkedom.js` (gerado por `npm run build:dom`).
- **Botão ⚑ "Reportar problema"** dentro das fases. Os avisos aparecem no painel, com o botão "Resolvido".
- **Ferramentas do painel:**
  - gerar senha provisória (para quem esqueceu a senha);
  - remover usuário;
  - **baixar backup** em JSON.
- **Restaurar backup:** `npm run restaurar -- arquivo.json`.
- **"Esqueci minha senha"** no login, com o e-mail de contato.
- **Filtro de nomes ofensivos** no cadastro (os nomes aparecem no ranking).
- **Verificação do Google Search Console** pela variável `GOOGLE_VERIFICACAO`.
- **Mapa do currículo** gerado automaticamente: `npm run curriculo` → `docs/CURRICULO.md`.
- **Documentação:**
  - `docs/GUIA-IMPLANTACAO-E-MONETIZACAO.md`
  - `docs/ARQUITETURA.md`
  - `docs/DECISOES.md`
  - `docs/ROTEIRO.md`
  - este CHANGELOG
- **Histórico no Git** (pasta `.git`).

### Correções
- Enunciados de "completar" e "montar" mostravam as marcações `<code>` como texto.
- No celular, um código longo dentro da pergunta estourava a largura da tela.
- No JavaScript, o código de teste agora roda num bloco `{ }` próprio, para não colidir com as variáveis do aluno.
- No Python, o validador agora roda numa pasta temporária, por causa dos exercícios de arquivo.

---

## [1.1.0] — 2026-10-21 — Monetização com AdSense e painel do dono

- **Site público** (renderizado no servidor), com as aulas abertas sem login, que é exigência do AdSense e ajuda na busca do Google:
  - `/`, `/aprender`, `/aprender/:curso`, `/aprender/:curso/:fase`;
  - `/sobre`, `/privacidade` (LGPD + texto exigido pelo AdSense), `/termos`;
  - `/ads.txt`, `/sitemap.xml`, `/robots.txt`.
- O aplicativo passou a morar em **`/app`**. Endereços antigos `/#/...` são redirecionados.
- **Anúncios AdSense** só em pontos de pausa, configurados por `ADSENSE_CLIENTE` e `ADSENSE_SLOT`, com o modo `ANUNCIOS_DEMO=1` para ver os lugares.
- **Aviso de cookies** (LGPD). Quem escolhe "Só o essencial" recebe anúncios não personalizados. Google Analytics opcional (`GA_ID`), carregado só com consentimento.
- **Estatísticas por dia:**
  - visualizações, visitantes únicos e novos;
  - usuários ativos e quem estudou;
  - cadastros, fases, revisões, páginas e linguagens.

  Cada aparelho recebe um id aleatório, sem dados pessoais. Os registros são apagados depois de 400 dias.
- **Painel do dono** (`/app#/admin`, liberado por `ADMIN_USUARIOS`):
  - números de hoje, 7 e 30 dias;
  - conversão em cadastro e retorno em 7 dias;
  - gráfico de 30 dias;
  - funil "onde as pessoas param";
  - páginas mais vistas e cadastros recentes.
- **Excluir minha conta** no perfil (LGPD).
- Ao entrar ou se cadastrar, o aluno volta para a fase que tinha aberto pelo site.

---

## [1.0.0] — 2026-10-21 — Primeira versão

- 76 fases (Python 25, JavaScript 26, Java 25) em 5 mundos, do básico à POO e ao avançado. 319 exercícios de 5 tipos: pergunta, prever saída, completar, montar e código.
- **Execução de código:**
  - JavaScript num Web Worker;
  - Python com Pyodide no navegador;
  - Java no servidor, com tempo máximo, limite de memória e bloqueio de arquivos, rede e processos.
- **Gamificação:**
  - XP, níveis e estrelas;
  - ofensiva com protetor;
  - conquistas;
  - ranking semanal e geral.
- **Revisão espaçada** (1, 3, 7, 14, 30 e 60 dias) misturando as linguagens.
- Mensagens de erro traduzidas, dicas graduais e solução opcional.
- Laboratório livre por linguagem.
- Aplicativo instalável no celular (PWA).
- Banco MongoDB ou arquivo local.
- Validador de conteúdo: `npm run validar`.
