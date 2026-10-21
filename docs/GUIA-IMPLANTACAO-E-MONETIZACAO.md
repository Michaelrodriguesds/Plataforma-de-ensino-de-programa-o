# Guia de implantação e monetização do CodeQuest

Do arquivo `.zip` no seu computador até o dinheiro do AdSense caindo na conta. Siga na ordem: cada etapa depende da anterior. Marque os ☐ conforme for fazendo.

> Tempo total estimado de trabalho: 1 a 2 dias, espalhados. O que demora de verdade é esperar: a aprovação do AdSense (dias a semanas) e a carta com o PIN (cerca de 3 semanas).

---

## Etapa 0 — O que você vai precisar

| O quê | Para quê | Custo |
|---|---|---|
| Conta Google (Gmail) | AdSense, Search Console | Grátis |
| Conta no GitHub | Guardar o código e o histórico | Grátis |
| Conta no MongoDB Atlas | Banco de dados online | Grátis (0,5 GB) |
| Conta no Render | Deixar o site no ar | Grátis |
| Domínio próprio (ex: `codequest.com.br`) | Endereço profissional, ajuda na aprovação do AdSense | ~R$ 40/ano no Registro.br (opcional, recomendado) |
| Ter 18 anos ou mais | Exigência do AdSense | — |

---

## Etapa 1 — Rodar no seu computador

☐ Instale o **Node.js LTS** (<https://nodejs.org>) e o **JDK 21** (<https://adoptium.net>, marque "Add to PATH" e "Set JAVA_HOME").
☐ Descompacte o projeto, abra o Prompt de Comando na pasta e rode:

```
npm install
copy .env.example .env
```

☐ Abra o `.env` e preencha pelo menos:

```
ADMIN_USUARIOS=seu_usuario
CONTATO_EMAIL=seu-email@gmail.com
ANUNCIOS_DEMO=1
```

☐ Rode `npm start`, abra <http://localhost:3000>, crie a conta com o mesmo nome de usuário que você colocou em `ADMIN_USUARIOS` e confira:
- as aulas abertas em `/aprender`;
- uma fase no app;
- o painel em **📊 Painel**;
- as caixas tracejadas "Espaço do anúncio" (é o `ANUNCIOS_DEMO=1`).

☐ (Opcional) Rode `npm run validar` para testar todas as respostas das fases (precisa do Python instalado também).

---

## Etapa 2 — Guardar o código no GitHub

O projeto já vem com o histórico de versões (pasta `.git`). Jeito mais fácil para quem está começando:

☐ Instale o **GitHub Desktop** (<https://desktop.github.com>) e entre com sua conta.
☐ **File → Add local repository** → escolha a pasta do CodeQuest.
☐ Clique em **Publish repository**. Deixe **"Keep this code private"** marcado.

Pronto: o código e todo o histórico de mudanças estão guardados. Daqui para frente, toda alteração vira um "commit" (um registro com descrição), e você sempre consegue voltar atrás.

> ⚠️ O `.env` (com suas senhas) **não** vai para o GitHub: ele está no `.gitignore` de propósito.

---

## Etapa 3 — Banco de dados no MongoDB Atlas

☐ Entre em <https://cloud.mongodb.com> e crie um cluster **Free** (ou use o que você já tem).
☐ **Database Access** → crie um usuário e uma senha **só com letras e números**.
☐ **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
☐ **Connect → Drivers** → copie a string `mongodb+srv://...` e troque `<username>` e `<password>`.
☐ Teste no seu PC: cole em `MONGODB_URI=` no `.env`, rode `npm start` e veja aparecer `💾 Banco: MongoDB conectado`.

---

## Etapa 4 — Colocar o site no ar (Render)

☐ Entre em <https://render.com> com a conta do GitHub.
☐ **New → Web Service** → escolha o repositório do CodeQuest.
☐ **Language: Docker** · **Instance Type: Free**.
☐ Em **Environment Variables**, cadastre:

| Variável | Valor |
|---|---|
| `MONGODB_URI` | a string do Atlas |
| `JWT_SECRET` | uma frase longa e aleatória (nunca mude depois, senão todos são deslogados) |
| `ADMIN_USUARIOS` | seu nome de usuário |
| `CONTATO_EMAIL` | seu e-mail de contato |
| `ANUNCIOS_DEMO` | `0` |
| `FUSO_HORARIO` | `America/Sao_Paulo` |

☐ **Create Web Service** e espere aparecer **Live** (a primeira vez demora alguns minutos).
☐ Abra o endereço `https://SEU-SERVICO.onrender.com`, crie sua conta (com o usuário do `ADMIN_USUARIOS`) e confira o painel.

> Se o plano Free não aparecer para Docker na sua conta, use **Language: Node**, **Build:** `npm install`, **Start:** `npm start`. Tudo funciona, menos os exercícios de Java.

---

## Etapa 5 — Domínio próprio (recomendado)

☐ Registre o domínio em <https://registro.br> (ex: `codequest.com.br`; confira se está livre).
☐ No Render: **Settings → Custom Domains → Add** → digite o domínio (e também o `www.`). O Render mostra quais registros DNS criar.
☐ No Registro.br: **Domínio → DNS → Editar zona** e crie os registros exatamente como o Render mostrou.
☐ Espere o Render mostrar **Verified** (pode levar algumas horas). O HTTPS (cadeado) é automático.
☐ No Render, adicione a variável `SITE_URL` = `https://seudominio.com.br` (sem barra no final).

---

## Etapa 6 — Google Search Console (fazer o Google achar as aulas)

☐ Entre em <https://search.google.com/search-console> → **Adicionar propriedade** → **Prefixo do URL** → `https://seudominio.com.br`.
☐ Escolha a verificação por **Tag HTML**. Copie só o código de dentro de `content="..."`.
☐ No Render, crie a variável `GOOGLE_VERIFICACAO` com esse código e espere o site reiniciar.
☐ Volte ao Search Console e clique em **Verificar**.
☐ Menu **Sitemaps** → envie `sitemap.xml`. Ele lista todas as páginas de aula para o Google.

Em alguns dias as aulas começam a aparecer nas buscas (ex: "aula de python classes e objetos").

---

## Etapa 7 — Antes de pedir o AdSense (checklist)

O Google revisa o site inteiro. Confira tudo:

☐ O site abre pelo seu domínio, com cadeado (https).
☐ `/aprender` mostra as aulas **sem precisar de login**.
☐ `/sobre`, `/privacidade` e `/termos` estão no ar e mostram o seu `CONTATO_EMAIL`.
☐ Nenhuma página quebrada (clique em alguns links do rodapé e das aulas).
☐ `ANUNCIOS_DEMO=0` (sem caixas tracejadas).
☐ Você tem 18 anos ou mais e os dados (nome, endereço) que vai cadastrar são os mesmos dos seus documentos e da conta bancária.

---

## Etapa 8 — Pedir o AdSense

☐ Entre em <https://adsense.google.com> → **Começar** → informe o endereço do site e seu país (Brasil).
☐ Preencha nome e endereço **exatamente** como nos seus documentos (é para esse endereço que vai a carta com o PIN).
☐ O AdSense mostra o seu **código de editor**, no formato `ca-pub-1234567890123456`.
☐ No Render, crie `ADSENSE_CLIENTE` = esse código. Isso faz duas coisas sozinho:
  - coloca o código do AdSense nas páginas (o Google precisa ver isso para revisar);
  - publica o `https://seudominio.com.br/ads.txt` com a linha certa.
☐ Confira abrindo `https://seudominio.com.br/ads.txt`: deve aparecer `google.com, pub-..., DIRECT, f08c47fec0942fa0`.
☐ No AdSense, marque que o código foi colocado e clique em **Solicitar revisão**.
☐ **Não** ative os "Anúncios automáticos" (eles poderiam colocar anúncio dentro dos exercícios, o que é proibido e atrapalha os alunos).

Agora é esperar o e-mail do Google (de alguns dias a algumas semanas). Se for recusado, o e-mail diz o motivo: corrija e peça de novo.

---

## Etapa 9 — Ligar os anúncios (depois da aprovação)

☐ AdSense → **Anúncios → Por bloco de anúncios → Anúncios de display**.
☐ Nome: `CodeQuest responsivo` · formato **Responsivo** → **Criar**.
☐ No código que aparece, copie o número de `data-ad-slot="1234567890"`.
☐ No Render, crie `ADSENSE_SLOT` = esse número.
☐ AdSense → **Privacidade e mensagens → Regulamentos europeus** → crie e publique a mensagem de consentimento (para visitantes da Europa; os do Brasil veem o aviso do próprio CodeQuest).
☐ Abra o site e confira os anúncios nos lugares previstos:
  - início do app;
  - fim de fase;
  - fim da revisão;
  - ranking;
  - trilha;
  - páginas de aula.

  Pode levar algumas horas para começarem a aparecer.

---

## Etapa 10 — Receber o dinheiro

O AdSense funciona em etapas de saldo. Os valores exatos em reais aparecem na sua conta, em **Pagamentos → Configurações de pagamento**.

1. ☐ **Informações fiscais:** preencha quando o AdSense pedir (normalmente no primeiro acesso).
2. ☐ **Verificação de identidade:** quando o saldo chega ao limite de verificação, o Google pede seus documentos.
3. ☐ **PIN pelo correio:** em seguida, chega uma carta com um código de 6 dígitos no seu endereço.
   - Leva cerca de **3 semanas**. Se não chegar, peça outra pela própria conta.
   - Você tem **4 meses** para digitar o PIN.
   - Errar **3 vezes** suspende os anúncios.
4. ☐ **Forma de pagamento:** quando o saldo passa do limite mínimo, cadastre a conta bancária para **transferência**. Use uma conta no seu nome. Bancos tradicionais e serviços de câmbio (Remessa Online, Wise, Nomad e outros) recebem pagamentos do AdSense; compare as taxas.
5. ☐ **Limite de pagamento:** o Google só paga quando os ganhos acumulados chegam ao limite da sua moeda. O valor exato em reais aparece na sua conta. Os ganhos de um mês são fechados no início do mês seguinte, e o pagamento sai no fim desse mês, se o limite já foi atingido. Se não atingiu, o saldo acumula para o mês seguinte.

> 💡 **Impostos:** dinheiro recebido do exterior é renda e precisa ser declarado (no Brasil, em geral pelo carnê-leão e na declaração anual). Eu não sou contador: converse com um quando os pagamentos começarem.

---

## Etapa 11 — Fazer o site crescer (é aqui que o dinheiro aparece)

Com o AdSense, o ganho é aproximadamente:

> **ganho ≈ (visualizações ÷ 1.000) × RPM**

O RPM (quanto você ganha a cada mil visualizações) aparece no painel do AdSense e varia muito por país, assunto e época do ano.

*Exemplo apenas ilustrativo:* com um RPM hipotético de R$ 5, 100 mil visualizações por mês dariam uns R$ 500. Use o seu RPM real para fazer a conta.

Ou seja: **o que aumenta o ganho é ter mais gente voltando todo dia.** O projeto já ajuda com:
- aulas abertas no Google;
- ofensiva (dias seguidos);
- revisão diária;
- ranking semanal.

Ideias de divulgação gratuita:

- ☐ **Vídeos curtos** (Reels, TikTok, Shorts): "programando um código por dia", resolvendo uma fase do CodeQuest na tela do celular. Link na bio para a aula.
- ☐ **Grupos e comunidades:** grupos de estudo de programação no WhatsApp/Telegram, r/brdev, LinkedIn. Compartilhe aulas específicas (ex: "aula grátis de POO em Java"), não só o site.
- ☐ **Escolas, cursos técnicos e ONGs:** ofereça como material de apoio grátis para os alunos.
- ☐ **Desafios semanais:** anuncie nas redes quem ficou em 1º no ranking da semana.
- ☐ **Responda os avisos** que os alunos mandam pelo botão ⚑: aula melhor faz o aluno voltar.

---

## Etapa 12 — Rotina de manutenção

**Toda semana (15 minutos):**
- ☐ Painel → **💾 Baixar backup** e guarde no Google Drive (o Atlas grátis não faz backup).
- ☐ Painel → **Problemas reportados**: corrija o que fizer sentido e marque como resolvido.
- ☐ Painel → **Onde as pessoas param**: a fase com maior desistência é a próxima a melhorar.
- ☐ AdSense → **Central de políticas**: confira se não há avisos.

**Toda vez que mudar alguma coisa no projeto:**
1. Edite (por exemplo, uma fase em `public/js/conteudo/`).
2. `npm run validar` (testa as respostas) e `npm run curriculo` (atualiza o mapa).
3. Teste no PC com `npm start`.
4. Se mexeu em arquivos da pasta `public`, aumente a versão em `public/sw.js` (`VERSAO = 'cq-v4'`...) para os celulares baixarem a novidade.
5. Anote no `CHANGELOG.md` o que mudou.
6. GitHub Desktop → escreva o resumo → **Commit** → **Push**. O Render publica sozinho.

**Se alguém esquecer a senha:**
- A pessoa manda um e-mail com o nome de usuário.
- No painel: **Ferramentas → Gerar senha provisória**. Envie a senha para ela.

**Se aparecer um nome ofensivo no ranking:** Painel → **Ferramentas → Remover usuário**.

**Se precisar restaurar um backup:** coloque a `MONGODB_URI` no `.env` do seu PC e rode `npm run restaurar -- caminho/do/backup.json`.

---

## Regras de ouro do AdSense (para não perder a conta)

1. **Nunca clique nos seus próprios anúncios**, nem para testar.
2. **Nunca peça** para amigos, família ou alunos clicarem ("clique para ajudar o site" é proibido).
3. Não coloque anúncio em lugares novos sem conferir as regras: nada de anúncio colado em botões, dentro dos exercícios, no login ou em telas de erro.
4. Não compre tráfego de sites duvidosos (visitas falsas = conta banida).
5. Mantenha a política de privacidade no ar e atualizada.

---

## Problemas comuns na implantação

| Problema | Solução |
|---|---|
| AdSense recusou por "conteúdo de baixo valor" | Confira se `/aprender` abre sem login e se o sitemap foi enviado. Espere o Google indexar as aulas e peça de novo. |
| AdSense diz que não achou o código | Confira `ADSENSE_CLIENTE` no Render e se o site reiniciou. Abra uma aula e procure `adsbygoogle` no código-fonte (Ctrl+U). |
| `ads.txt` mostra "Defina ADSENSE_CLIENTE" | Falta a variável no Render. |
| Anúncios não aparecem depois de aprovado | Confira `ADSENSE_SLOT`. Desative bloqueador de anúncios para testar. Pode levar algumas horas. |
| Site demora 1 minuto para abrir | É o Render grátis "acordando" depois de 15 minutos parado. Um serviço de ping (UptimeRobot) chamando `/api/saude` a cada 10 minutos resolve. |
| Todo mundo foi deslogado | O `JWT_SECRET` mudou. Defina um fixo e não mude mais. |
