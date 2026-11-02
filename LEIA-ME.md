# 🎮 CodeQuest — aprenda programação jogando

Plataforma gamificada para aprender programação em português, no celular ou no notebook: **Python, JavaScript e Java** do zero até Orientação a Objetos, e a **carreira Full Stack** completa (HTML e CSS, React, Back-end com Node.js, SQL, Git e deploy).

- **8 trilhas, 197 fases e 709 exercícios** de 5 tipos, todos com as respostas testadas automaticamente:

  | Trilha | Fases | O que roda |
  |---|---|---|
  | 🐍 Python | 33 | Python de verdade no navegador (Pyodide) |
  | 🟨 JavaScript (com páginas web/DOM) | 37 | no navegador |
  | ☕ Java | 33 | no servidor (javac) |
  | 🎨 HTML e CSS | 22 | a página do aluno, desenhada de verdade, e um verificador de CSS |
  | ⚛️ React | 16 | Preact + JSX num Web Worker |
  | 🟩 Back-end com Node.js | 20 | um Node "de treino" com Express, MongoDB, bcrypt e JWT |
  | 🗄️ SQL e Bancos de Dados | 20 | SQLite de verdade (sql.js) |
  | 🌿 Git, Terminal e Deploy | 16 | um terminal de treino com Git, npm e "GitHub" |

- A **Carreira Full Stack** tem um mapa na tela inicial: HTML e CSS → JavaScript → React → Back-end → SQL → Git e deploy
- Cadastro, XP, níveis, estrelas, ofensiva (dias seguidos), conquistas, **ranking semanal e geral**
- **Revisão espaçada**: o que você aprendeu volta em 1, 3, 7, 14, 30 e 60 dias
- Código roda de verdade: quase tudo **dentro do navegador** (nada sai do aparelho); só o Java roda **no servidor**
- Funciona como aplicativo no celular (dá para "Adicionar à tela inicial")
- **Grátis para quem estuda**, mantido por **anúncios do Google (AdSense)**
- **Prova final e certificado de conclusão** (ilustrativo, sem reconhecimento do MEC) em cada trilha: carga horária estimada, habilidades, nota e código de verificação em `/certificado/CÓDIGO`
- **Site público com todas as aulas abertas** (para o Google aprovar o AdSense e trazer visitas pela busca)
- **Painel do dono** com usuários, visitantes, quem usa de verdade, gráfico de 30 dias e onde as pessoas desistem

---

## Documentação do projeto

| Arquivo | Para quê |
|---|---|
| **`LEIA-ME.md`** (este) | Visão geral, rodar no PC, colocar online, criar fases |
| **`docs/GUIA-IMPLANTACAO-E-MONETIZACAO.md`** | Passo a passo completo: do zero até receber do AdSense |
| `docs/mapa-codequest.html` | Mapa visual: onde estamos, passo a passo no Windows e fluxogramas (abra no navegador) |
| `docs/CURRICULO.md` | Lista de todas as fases (gerada por `npm run curriculo`) |
| `docs/ARQUITETURA.md` | Como o código funciona por dentro |
| `docs/DECISOES.md` | Por que cada coisa foi feita do jeito que foi |
| `docs/ROTEIRO.md` | Ideias de melhorias futuras, por prioridade |
| `CHANGELOG.md` | Histórico de tudo que mudou em cada versão |

## Sumário

1. [Por que ensinar desse jeito](#1-por-que-ensinar-desse-jeito)
2. [Como o projeto está organizado](#2-como-o-projeto-está-organizado)
3. [Rodar no seu computador (Windows)](#3-rodar-no-seu-computador-windows)
4. [Abrir no celular](#4-abrir-no-celular)
5. [Deixar sempre ligado no seu PC](#5-deixar-sempre-ligado-no-seu-pc)
6. [Colocar online de graça (Atlas + Render)](#6-colocar-online-de-graça-atlas--render)
7. [Criar suas próprias fases](#7-criar-suas-próprias-fases)
8. [Problemas comuns](#8-problemas-comuns)
9. [Segurança](#9-segurança)
10. [Ganhar com anúncios (Google AdSense)](#10-ganhar-com-anúncios-google-adsense)
11. [Painel do dono: usuários, visitas e quem usa](#11-painel-do-dono-usuários-visitas-e-quem-usa)

---

## 1. Por que ensinar desse jeito

Cada parte do jogo foi escolhida com base em pesquisas sobre ensino de programação e em plataformas que deram certo:

| O que você vê no jogo | De onde veio a ideia |
|---|---|
| **"Preveja a saída"** antes de rodar, depois **rodar**, depois **modificar/escrever** | Método **PRIMM** (Prever, Rodar, Investigar, Modificar, Criar). Num estudo com 493 alunos em 13 escolas, quem aprendeu com PRIMM foi melhor no teste final. |
| **"Monte o código"** (colocar linhas na ordem certa, com linhas "pegadinha") | **Problemas de Parsons**: estudos mostram aprendizado parecido com escrever do zero, só que mais rápido e com menos frustração. |
| **"Complete o código"** e dicas que vão do leve ao detalhado | **Exemplos resolvidos com "apagamento" gradual** (*faded worked examples*): a ajuda vai sumindo aos poucos até você fazer sozinho. |
| **Revisão do dia** (perguntas antigas voltam em intervalos) | **Prática de recuperação espaçada**: uma meta-análise de 29 estudos achou um efeito forte (g = 0,74) de espaçar as revisões em vez de estudar tudo de uma vez. |
| Revisão **mistura** Python, JS e Java | **Prática intercalada**: alternar assuntos ajuda a fixar. |
| Pergunta errada **volta no fim** da fase | Erro vira nova chance, sem punição. |
| XP, **ofensiva**, **protetor de ofensiva**, ranking que zera toda semana | Mecânicas do **Duolingo** (o protetor evita a frustração de perder a ofensiva num dia ruim). |
| Lições curtinhas, de poucos minutos | Formato "pílula" do **Mimo**, feito para encaixar no dia corrido. |
| Escrever e rodar código de verdade (não só tocar em botões) | Crítica comum ao Mimo: só tocar em respostas não forma programador. Por isso toda fase termina com código digitado por você. |
| Fases que vão desbloqueando, chefão no fim | **CodeCombat** e o **Exercism** (trilhas com progressão clara). |
| Erros traduzidos para português com dica | Mensagem de erro em inglês é a maior barreira de quem está começando. |

Fontes: PRIMM — Sentance, Waite e Kallia (2019), *Computer Science Education*; Parsons — tese de Barbara Ericson (Georgia Tech) e revisão sistemática do ITiCSE 2022; Revisão espaçada — meta-análise de Latimier, Peyre e Ramus (2021); Duolingo, Mimo, CodeCombat e Exercism — sites oficiais e análises públicas.

### Como estudar com o CodeQuest

1. **Uma fase por dia já é ótimo.** A ofensiva premia constância, não maratona.
2. **Antes de rodar o exemplo, tente adivinhar** o que vai aparecer.
3. **Digite o código** nos desafios. Copiar não fixa.
4. **Use as dicas sem culpa**, mas tente pelo menos uma vez antes.
5. **Faça a Revisão do dia** sempre que o 🧠 aparecer com número.
6. **Use o Laboratório** (🧪 Lab) para brincar: mude os exemplos e veja o que acontece.

---

## 2. Como o projeto está organizado

Pense num restaurante:

- **`public/`** é o **salão**: tudo que o cliente (o navegador) vê. HTML, CSS e JavaScript da tela.
- **`server.js`** é o **balcão**: recebe os pedidos ("me cadastra", "terminei a fase", "me mostra o ranking") e responde.
- **`src/`** é a **cozinha**: as regras do jogo (`jogo.js`), o armário do banco de dados (`store.js`) e o forno do Java (`javaRunner.js`).
- **`public/js/conteudo/`** é o **cardápio**: as lições e exercícios de cada linguagem.
- **`src/paginas.js`** é a **vitrine**: monta o site público (aulas abertas, privacidade, termos) que o Google consegue ler.

**Endereços do site:**

| Endereço | O que é |
|---|---|
| `/` | Página inicial pública |
| `/aprender`, `/aprender/python`, `/aprender/python/py-01` | Aulas abertas (sem login) |
| `/app` | O aplicativo de exercícios (com conta) |
| `/app#/admin` | Seu painel de estatísticas |
| `/sobre`, `/privacidade`, `/termos` | Páginas institucionais (exigidas pelo AdSense e pela LGPD) |
| `/ads.txt`, `/sitemap.xml`, `/robots.txt` | Arquivos para o Google |

```
codequest/
├── server.js                  ← servidor (Express): login, progresso, ranking, rodar Java
├── src/
│   ├── jogo.js                ← regras: XP, estrelas, ofensiva, conquistas, revisão
│   ├── store.js               ← banco: MongoDB OU arquivo data/db.json (+ estatísticas)
│   ├── paginas.js             ← site público: aulas abertas, privacidade, termos, sitemap
│   ├── painel.js              ← números do painel do dono
│   └── javaRunner.js          ← compila e roda Java com limite de tempo e bloqueios
├── public/                    ← o site
│   ├── index.html
│   ├── css/estilo.css
│   ├── js/
│   │   ├── app.js             ← todas as telas (trilha, fases, revisão, ranking, perfil, lab)
│   │   ├── editor.js          ← editor de código com cores e barra de símbolos p/ celular
│   │   ├── executor.js        ← roda JS/Python no navegador e Java no servidor
│   │   ├── erros.js           ← traduz mensagens de erro para português
│   │   ├── anuncios.js        ← coloca os anúncios do AdSense nos lugares permitidos
│   │   ├── consentimento.js   ← aviso de cookies (LGPD)
│   │   ├── rastreio.js        ← conta visitas para o painel
│   │   ├── conteudo/          ← AS LIÇÕES (python.js, javascript.js, java.js)
│   │   └── runtime/           ← "salas isoladas" (Web Workers) que executam o código
│   ├── manifest.webmanifest   ← faz virar "app" no celular
│   └── sw.js                  ← guarda o site no aparelho para abrir mais rápido
├── scripts/validar-conteudo.js ← testa TODAS as respostas das fases
├── Dockerfile / render.yaml   ← para hospedar online com Java
└── .env.example               ← modelo das configurações
```

**Onde cada linguagem roda:**

- **JavaScript** → no próprio navegador, num *Web Worker* (uma "sala separada": se o código travar num laço infinito, a sala é fechada e o site continua funcionando).
- **Python** → também no navegador, com o **Pyodide** (o Python de verdade, convertido para WebAssembly). Na primeira vez baixa cerca de 10 MB; depois fica guardado.
- **Java** → no servidor, porque precisa do `javac`. O código vai para uma pasta temporária, compila, roda com tempo máximo de 5 segundos e a pasta é apagada.

---

## 3. Rodar no seu computador (Windows)

### 3.1 Instalar o que precisa (uma vez só)

1. **Node.js** (versão LTS): baixe em <https://nodejs.org> e instale com "Next, Next, Finish".
2. **Java JDK 17 ou mais novo** (para os exercícios de Java): baixe o **Temurin JDK 21** em <https://adoptium.net>. Na instalação, **marque a opção "Set JAVA_HOME" e "Add to PATH"**.
3. *(Opcional)* **Python 3**, só se quiser rodar o validador de conteúdo: <https://python.org> (marque "Add python.exe to PATH").

Para conferir, abra o **Prompt de Comando** (tecla Windows, digite `cmd`) e rode:

```
node -v
javac -version
```

Os dois precisam mostrar um número de versão.

### 3.2 Preparar o projeto

1. Descompacte o `codequest.zip` numa pasta, por exemplo `C:\projetos\codequest`.
2. No Prompt de Comando:

```
cd C:\projetos\codequest
npm install
copy .env.example .env
```

O `npm install` baixa as bibliotecas (cria a pasta `node_modules`). O `copy` cria seu arquivo de configuração.

### 3.3 Escolher o banco de dados

Abra o `.env` no Bloco de Notas (ou VS Code):

- **Para testar rápido:** deixe `MONGODB_URI=` vazio. Tudo fica salvo no arquivo `data/db.json`.
- **Para usar seu banco online (Atlas):** cole a sua string de conexão em `MONGODB_URI=` (veja a seção 6.1 de como pegar). O CodeQuest cria sozinho a coleção `usuarios` no banco `codequest`.

### 3.4 Ligar

```
npm start
```

Vai aparecer:

```
🎮 CodeQuest rodando!
   Site público: http://localhost:3000
   Aplicativo:   http://localhost:3000/app
☕ Java no servidor: disponível
```

Abra **<http://localhost:3000>**, clique em "Começar grátis", crie sua conta e jogue! Para desligar: `Ctrl + C` no Prompt.

> 📊 Para ver o painel, coloque seu usuário em `ADMIN_USUARIOS=` no `.env` (ex: `ADMIN_USUARIOS=michael`), reinicie e entre no app: aparece o item **📊 Painel**.

> 💡 Enquanto estiver mexendo no código, use `npm run dev`: o servidor reinicia sozinho a cada alteração salva.

---

## 4. Abrir no celular

### No mesmo Wi-Fi do PC

1. No PC, rode `ipconfig` e anote o **Endereço IPv4** (algo como `192.168.0.15`).
2. No celular (mesmo Wi-Fi), abra `http://192.168.0.15:3000`.
3. Se não abrir, o Firewall do Windows está bloqueando: na primeira vez que rodar o `npm start`, clique **"Permitir acesso"** quando o Windows perguntar. (Ou: Painel de Controle → Firewall → Permitir um aplicativo → marque "Node.js" em rede **Privada**.)

> Pelo IP da rede local (http) o site funciona normalmente, mas o celular **não oferece "instalar como app"** — isso só acontece com endereço `https://` (como no Render) ou `localhost`.

### Pela internet

Depois de colocar online (seção 6), abra o endereço `https://...onrender.com` no celular, toque no menu do navegador → **"Adicionar à tela inicial"**. Pronto: vira um ícone de app.

---

## 5. Deixar sempre ligado no seu PC

Use o **PM2**, um "zelador" que mantém o servidor ligado e o religa se cair:

```
npm install -g pm2
cd C:\projetos\codequest
pm2 start server.js --name codequest
pm2 save
```

Comandos úteis:

| Comando | O que faz |
|---|---|
| `pm2 status` | Mostra se está rodando |
| `pm2 logs codequest` | Mostra as mensagens do servidor |
| `pm2 restart codequest` | Reinicia (depois de mudar o código) |
| `pm2 stop codequest` | Desliga |

**Ligar junto com o Windows:**

```
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

**Acessar de fora de casa sem hospedagem:** o jeito mais simples é o **Cloudflare Tunnel** (gratuito). Instale o `cloudflared` (<https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/>) e rode:

```
cloudflared tunnel --url http://localhost:3000
```

Ele mostra um endereço `https://alguma-coisa.trycloudflare.com` que funciona de qualquer lugar enquanto o PC estiver ligado. (Esse endereço muda toda vez; para um fixo, é preciso criar uma conta e um túnel nomeado.)

---

## 6. Colocar online de graça (Atlas + Render)

Combinação recomendada: **banco no MongoDB Atlas** (grátis, 0,5 GB — dá para milhares de jogadores) + **site no Render** (grátis).

⚠️ No Render grátis os arquivos locais **são apagados** a cada reinício. Por isso, online, **use obrigatoriamente o Atlas** (`MONGODB_URI`), senão o progresso de todo mundo some.

### 6.1 MongoDB Atlas (o banco)

Se você já tem um cluster no Atlas (como no Organiza+), pode usar o mesmo: o CodeQuest usa um banco separado chamado `codequest`.

1. Entre em <https://cloud.mongodb.com>.
2. **Database Access** → crie um usuário e senha (anote).
3. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`). Necessário porque o Render não tem IP fixo.
4. **Database** → **Connect** → **Drivers** → copie a string, parecida com:
   `mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Troque `USUARIO` e `SENHA` pelos seus. Se a senha tiver caracteres especiais (`@`, `#`, `/`...), troque por letras e números para evitar dor de cabeça.

### 6.2 GitHub (onde o código fica guardado)

1. Crie uma conta em <https://github.com> e um repositório novo (pode ser privado), ex: `codequest`.
2. Envie os arquivos. O jeito mais fácil sem comandos: no repositório vazio, clique **"uploading an existing file"** e arraste o conteúdo da pasta (**menos** `node_modules`, `data` e `.env`).

### 6.3 Render (o site)

1. Entre em <https://render.com> com sua conta do GitHub.
2. **New** → **Web Service** → escolha o repositório `codequest`.
3. Configure:
   - **Language / Runtime:** `Docker` (assim vem com Java instalado, pelo `Dockerfile`)
   - **Instance Type:** `Free`
4. Em **Environment Variables**, adicione:
   - `MONGODB_URI` = sua string do Atlas
   - `JWT_SECRET` = uma frase longa e aleatória (ex: `minha-frase-secreta-gigante-8273648273`)
   - `ADMIN_USUARIOS` = seu nome de usuário no CodeQuest
   - `CONTATO_EMAIL` = o e-mail que vai aparecer nas páginas Sobre/Privacidade
   - `SITE_URL` = o endereço do site (ex: `https://codequest-xxxx.onrender.com`), depois que o Render mostrar
5. **Create Web Service**. O primeiro deploy demora alguns minutos (está instalando Node e Java).
6. Quando aparecer **Live**, abra o endereço `https://codequest-xxxx.onrender.com`.

**Alternativa sem Docker:** se o Render não oferecer o plano Free para Docker na sua conta, escolha **Language: Node**, **Build Command:** `npm install`, **Start Command:** `npm start`. Tudo funciona, **exceto os exercícios de Java** (o servidor avisa "Java não está instalado").

**Sobre o plano grátis do Render:**
- O site **"dorme" depois de 15 minutos sem visitas**. A próxima visita demora cerca de **1 minuto** para acordar (depois fica rápido).
- São 750 horas grátis por mês (suficiente para um serviço ligado o mês todo).
- Para evitar a soneca, alguns usam um serviço de "ping" gratuito (ex.: UptimeRobot) chamando `https://seu-site.onrender.com/api/saude` a cada 10 minutos.

**Atualizar o site depois:** envie os arquivos alterados para o GitHub; o Render publica sozinho.

---

## 7. Criar suas próprias fases

As fases ficam em `public/js/conteudo/`. Cada fase tem **lições** (cartões de leitura) e **exercícios**. Exemplo mínimo:

```js
{
  id: 'py-26', titulo: 'Minha fase', icone: '🎯',
  licao: [
    { titulo: 'Título do cartão', texto: `<p>Explicação com <b>analogia</b>.</p>`, codigo: `print("exemplo")` }
  ],
  ex: [
    // Pergunta de múltipla escolha (c = índice da resposta certa, começando em 0)
    { tipo: 'quiz', p: 'Pergunta?', op: ['A', 'B', 'C'], c: 1, exp: 'Explicação' },

    // Prever a saída (o validador roda o código e confere a resposta marcada)
    { tipo: 'prever', codigo: `print(1 + 1)`, op: ['2', '11'], c: 0, exp: '...' },

    // Completar lacunas ___ (resp = respostas certas; op = fichas de sugestão)
    { tipo: 'completar', p: 'Complete', codigo: `___("oi")`, resp: ['print'], op: ['print', 'echo'], saida: 'oi' },

    // Montar: linhas na ordem certa + linhas "pegadinha" em extras
    { tipo: 'montar', p: 'Monte', linhas: ['x = 1', 'print(x)'], extras: ['print("x")'], saida: '1' },

    // Desafio de código: saída esperada + dicas (da mais leve à mais detalhada) + solução
    { tipo: 'codigo', p: 'Mostre o dobro de 21', inicio: `n = 21\n`, saida: '42',
      usar: [['\\*', 'Use multiplicação']],           // opcional: obriga a usar algo
      teste: `print(dobro(5))`,                        // opcional: código de teste rodado junto
      testes: [{ entrada: '5', saida: '10' }],         // opcional: várias entradas diferentes
      dicas: ['Dica leve', 'Dica mais forte'], sol: `n = 21\nprint(n * 2)` }
  ]
}
```

**Exercícios de página (só JavaScript):** acrescente `dom: '<button id="b">OK</button>'` na lição ou no exercício. O código do aluno passa a ter `document` e o aluno vê a página antes e depois. No `teste`, simule a pessoa com `document.querySelector('#b').click()` ou `form.dispatchEvent(new Event('submit'))`.

Depois de criar fases, rode também `npm run curriculo` (atualiza `docs/CURRICULO.md`) e anote no `CHANGELOG.md`.

Depois de editar, **teste tudo**:

```
npm run validar
```

Ele roda todas as soluções, exemplos e respostas de "prever" e avisa qualquer erro (precisa de Python e Java instalados). Para testar uma linguagem só: `node scripts/validar-conteudo.js python`.

> Regras importantes: o `id` de uma fase **nunca deve mudar** depois que alguém jogou (o progresso está ligado a ele). Para adicionar fases no meio, crie ids novos — a ordem na trilha é a ordem no arquivo.

---

## 8. Problemas comuns

| Problema | Solução |
|---|---|
| `'node' não é reconhecido...` | Node não instalado ou o Prompt foi aberto antes da instalação. Feche e abra o Prompt de novo. |
| "Java NÃO encontrado" ao ligar | Instale o JDK (seção 3.1) marcando "Add to PATH" e abra um Prompt novo. Teste com `javac -version`. |
| "Não consegui conectar no banco de dados" | Confira a `MONGODB_URI` no `.env`, o usuário/senha e se liberou o IP `0.0.0.0/0` no Atlas. |
| Python demora na primeira fase | Normal: está baixando o Python para o navegador (~10 MB). Nas próximas vezes é rápido. Precisa de internet. |
| `Error: listen EADDRINUSE :::3000` | Já tem algo usando a porta 3000 (talvez outro CodeQuest aberto). Feche, ou mude `PORT=3001` no `.env`. |
| O site online demora 1 minuto para abrir | O Render grátis "dormiu". Veja a dica do ping na seção 6.3. |
| Mudei o site mas o celular mostra o antigo | Feche e abra o app/aba de novo. Se persistir, no `public/sw.js` aumente o número em `VERSAO = 'cq-v2'` (ex: `'cq-v3'`). |
| Todo mundo foi deslogado | A `JWT_SECRET` mudou. Defina uma fixa nas variáveis de ambiente. |

---

## 9. Segurança

- **Senhas** são guardadas com *bcrypt* (embaralhadas; nem você consegue ler).
- **Login** usa token JWT válido por 60 dias. Defina uma `JWT_SECRET` forte em produção.
- **XP e estrelas são calculados no servidor**, não no celular, para ninguém trapacear no ranking.
- **Código JavaScript e Python** dos alunos roda no navegador de cada um, isolado em Web Workers.
- **Código Java** roda no servidor com: tempo máximo de 5 s, memória limitada, no máximo 2 ao mesmo tempo, limite de 20 execuções por minuto por pessoa, bloqueio de acesso a arquivos/rede/comandos do sistema, pasta temporária apagada depois, e (no Docker) usuário sem permissão de administrador. É uma proteção boa para um projeto de estudo; para uma escola grande, o ideal é rodar o Java num serviço separado e descartável.
- Tentativas de login são limitadas (30 a cada 15 minutos) contra robôs.

---

Feito para estudar um pouquinho todo dia. Bons estudos! 🚀

---

## 10. Ganhar com anúncios (Google AdSense)

### Como o projeto já está preparado

- **Aulas abertas em `/aprender`**: o AdSense **não aprova** site em que o conteúdo fica atrás de login (o robô do Google não cria conta). São 76 páginas de aula com texto original, perfeitas para isso, e que também aparecem nas buscas do Google.
- **Anúncios só em pontos de pausa**: página de aula, início do app, fim de fase, fim da revisão, ranking e trilha. **Nunca** dentro dos exercícios, no login ou em telas de erro, porque as regras do Google proíbem anúncio em tela sem conteúdo e perto de botões (clique sem querer dá bloqueio de conta).
- **Política de privacidade** com o texto que o Google exige sobre cookies de terceiros, **termos de uso**, **sobre/contato**, **`ads.txt`** gerado sozinho e **`sitemap.xml`** para o Google achar todas as páginas.
- **Aviso de cookies (LGPD)**: quem escolhe "Só o essencial" recebe anúncios não personalizados.

### Passo a passo

1. **Coloque o site online primeiro** (seção 6), de preferência com um **domínio próprio** (ex: `codequest.com.br`, uns R$ 40 por ano no Registro.br). O AdSense aceita sites no endereço do Render, mas um domínio próprio passa mais confiança e é mais fácil de aprovar.
2. Preencha `CONTATO_EMAIL` e `SITE_URL` nas variáveis do Render.
3. Cadastre o site no **Google Search Console** (<https://search.google.com/search-console>) e envie o endereço `https://SEU-SITE/sitemap.xml`. Isso faz o Google indexar as aulas.
4. Crie a conta em <https://adsense.google.com> (precisa ter **18 anos ou mais**) e adicione o site.
5. O AdSense mostra seu **código de editor** (`ca-pub-1234567890123456`). Coloque em `ADSENSE_CLIENTE` no Render e salve. Isso já:
   - coloca o código do AdSense nas páginas (o Google precisa ver isso para revisar);
   - libera o `https://SEU-SITE/ads.txt` com a linha certa.
6. Peça a revisão no AdSense. Costuma levar de alguns dias a algumas semanas.
7. **Depois de aprovado**: em AdSense → **Anúncios** → **Por bloco de anúncios** → **Anúncios de display** → crie um bloco **responsivo**. Copie o número `data-ad-slot` e coloque em `ADSENSE_SLOT`. Pronto: os anúncios aparecem nos lugares reservados.
8. Em AdSense → **Privacidade e mensagens**, ative a mensagem de consentimento para **Europa (GDPR)**. O Google mostra ela sozinho para visitantes de lá.

> ⚠️ **Regras de ouro do AdSense:** nunca clique nos seus próprios anúncios, nunca peça para amigos clicarem e não ligue os "Anúncios automáticos" do AdSense (eles podem colocar anúncio dentro dos exercícios). O projeto já usa blocos manuais nos lugares certos.

**Quer ver onde os anúncios vão aparecer antes da aprovação?** Coloque `ANUNCIOS_DEMO=1` no `.env`: aparecem caixas tracejadas "Espaço do anúncio" (tire antes de colocar o AdSense de verdade).

**Expectativa realista:** o AdSense paga por visualização e clique, e o valor por mil visualizações no Brasil costuma ser baixo. O dinheiro vem de **volume**: por isso as aulas abertas para o Google (visitas que chegam pela busca) e a ofensiva/revisão (gente que volta todo dia) são tão importantes. Acompanhe isso no painel.

---

## 11. Painel do dono: usuários, visitas e quem usa

Coloque seu usuário em `ADMIN_USUARIOS` e entre em **`/app#/admin`** (ou toque em **📊 Painel** no menu). Só quem está nessa lista vê; para os outros, o servidor responde "acesso negado".

| Número | O que significa |
|---|---|
| **Usuários cadastrados** | Total de contas criadas (e quantas hoje / nos últimos 7 dias) |
| **Visitantes únicos** | Aparelhos diferentes que abriram o site ou o app, **com ou sem conta** |
| **Usuários ativos** | Pessoas **com conta** que abriram o app |
| **Estudaram** | Pessoas que **concluíram fase ou revisão** (quem usa de verdade) |
| **Visualizações** | Telas e páginas abertas. Cada uma pode mostrar anúncio, então é o número que mais se relaciona com o ganho |
| **Conversão em cadastro** | Dos visitantes novos, quantos % criaram conta |
| **Retorno em 7 dias** | Dos que entraram há 8–30 dias, quantos voltaram esta semana (mede se o hábito pegou) |
| **Com ofensiva viva** | Quem estudou hoje ou ontem |
| **Nunca jogaram** | Criaram conta e não fizeram nenhuma fase |

Também tem:

- **Problemas reportados:** o que os alunos avisaram pelo botão ⚑ dentro das fases, com o botão "Resolvido".
- **Ferramentas:** gerar **senha provisória** para quem esqueceu, **remover usuário** (ex: nome ofensivo) e **baixar backup** (faça toda semana: o Atlas grátis não tem backup). Para restaurar: `npm run restaurar -- arquivo.json`.
- **Gráfico dos últimos 30 dias**: visitantes, ativos e quem estudou. Toque ou passe o mouse para ver os números de cada dia; também dá para ver tudo como tabela.
- **Onde as pessoas param**: quantas pessoas concluíram cada fase de cada trilha, e qual a **maior desistência** (a aula que talvez precise ficar mais fácil).
- **Páginas mais vistas** e **fases concluídas por linguagem**.
- **Cadastros recentes**.

**Como a contagem funciona (e por que é segura para a LGPD):** cada navegador recebe um código aleatório (sem nome, e-mail ou IP) só para saber "é o mesmo aparelho de ontem". Robôs de busca não entram na conta. As estatísticas diárias com mais de 400 dias são apagadas sozinhas.

> Se quiser números ainda mais detalhados (cidade, de onde as pessoas vieram, tempo na página), coloque o ID do **Google Analytics 4** em `GA_ID`. Ele só é carregado para quem aceitar os cookies.
