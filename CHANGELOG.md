# Histórico de versões (CHANGELOG)

Registro de tudo o que mudou no CodeQuest. A versão mais nova fica em cima.
Ao fazer qualquer mudança, acrescente uma linha aqui e aumente a versão no `package.json`.

Formato: **MAIOR.MENOR.CORREÇÃO**
- **MAIOR:** mudou algo que quebra o que já existia (ex: formato do banco).
- **MENOR:** novidade (fases, telas, recursos).
- **CORREÇÃO:** conserto de bug.

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
