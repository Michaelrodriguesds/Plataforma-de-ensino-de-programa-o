# Roteiro de melhorias futuras

Ideias organizadas por prioridade. Ao começar uma, mova para "Em andamento". Ao terminar, registre no `CHANGELOG.md`.

**Legenda de esforço:** 🟢 pequeno (horas) · 🟡 médio (dias) · 🔴 grande (semanas)

## Prioridade alta (aumentam uso e ganho)

- 🟡 **Jogar sem conta (modo visitante):** começar a fase 1 sem cadastro, com o progresso guardado no aparelho e um pedido para criar conta ao terminar. Diminui quem desiste na tela de cadastro.
- 🟡 **Recuperar senha por e-mail:** usar um serviço de e-mail (Resend, Brevo...) para enviar um link de redefinição. Hoje é manual pelo painel (ver D11).
- 🟢 **Lembrete da ofensiva:** notificação do app (Web Push) à noite para quem ainda não estudou no dia. É a principal ferramenta de retorno do Duolingo.
- 🟢 **Compartilhar conquista:** botão para compartilhar no WhatsApp/Instagram a fase concluída ou a ofensiva, com link para a aula. Divulgação gratuita.
- 🟡 **Página pública de perfil/ranking:** `/ranking` aberto, para divulgar nas redes e motivar a competição.

- 🟢 **Content-Security-Policy** listando só os domínios do AdSense, Analytics, Pyodide e Google Fonts (ver `docs/REVISAO.md`).
- 🟡 **Carregar o conteúdo sob demanda** (só a trilha aberta), se o número de trilhas crescer.

## Prioridade média (qualidade do ensino)

- 🔴 **Mais trilhas:** TypeScript, Python para dados (pandas no Pyodide), testes automatizados (Jest/Vitest), Docker. (HTML e CSS, SQL, React, Back-end e Git: feitos na 1.3.0.)
- 🟡 **Projeto final full stack guiado:** juntar React + API + banco num app só, com deploy de verdade passo a passo.
- 🟢 **Mostrar as tabelas e a prévia nas aulas públicas** (hoje o site público mostra só o código).
- 🟡 **Projetos guiados maiores** no fim de cada trilha. Exemplos: agenda do salão completa, controle de entregas, jogo da forca.
- 🟡 **Desafio do dia:** um exercício sorteado por dia, igual para todos, com ranking próprio.
- 🟢 **Explicação do erro na revisão:** mostrar de novo o cartão da lição quando a pessoa erra uma pergunta da revisão.
- 🟡 **Editor de fases no painel:** criar e editar fases pelo navegador, com validação automática, sem mexer nos arquivos.
- 🟢 **Modo escuro/claro** e tamanho de fonte ajustável (acessibilidade).

## Prioridade baixa / quando crescer

- 🔴 **Java isolado:** rodar o Java num serviço separado e descartável (contêiner por execução, ou API como Judge0), se o número de usuários crescer muito.
- 🟡 **Ligas semanais por divisão** (Bronze, Prata, Ouro), como no Duolingo, em vez de um único ranking.
- 🟡 **Apoio voluntário:** página "Apoie com PIX" para quem quiser contribuir além dos anúncios.
- 🔴 **Aplicativo nas lojas:** empacotar o PWA para a Play Store (TWA) e usar AdMob.
- 🟢 **Testes automáticos da interface:** guardar no projeto os scripts de teste com navegador (puppeteer). Os testes de regras e da API já estão em `npm test` (1.4.1).

## Em andamento

(vazio)

## Feito

Ver `CHANGELOG.md`.
