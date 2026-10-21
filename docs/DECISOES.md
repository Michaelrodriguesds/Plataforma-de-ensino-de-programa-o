# Registro de decisões

Por que o CodeQuest é do jeito que é. Antes de mudar algo grande, leia o motivo aqui. Ao tomar uma decisão nova, acrescente no fim.

---

### D1 — Ensino baseado em evidências (PRIMM, Parsons, revisão espaçada)
Cada fase segue: ler → prever → rodar → completar/montar → escrever.
- **PRIMM** (Prever, Rodar, Investigar, Modificar, Criar) melhorou o desempenho num estudo com 493 alunos.
- **Problemas de Parsons** (montar código) ensinam tanto quanto escrever do zero, só que mais rápido e com menos frustração.
- **Revisão espaçada** tem efeito forte na memória (meta-análise com 29 estudos).

Fontes no LEIA-ME.

### D2 — Gamificação no estilo Duolingo, com protetor de ofensiva
XP, ofensiva, ranking semanal e conquistas mantêm o hábito. O protetor evita a frustração de perder a ofensiva por um dia ruim. O ranking zera toda semana para os novatos terem chance.

### D3 — Todo código executado de verdade
Só tocar em respostas não forma programador (crítica comum ao Mimo). Toda fase termina com código digitado e executado.
- JavaScript e Python rodam no navegador: grátis e escala sem custo de servidor.
- Java precisa do `javac`, por isso roda no servidor com bloqueios.

### D4 — Web Workers para executar código
Laço infinito não trava o app: o worker é encerrado após alguns segundos.

O DOM usa `linkedom` dentro do worker em vez de um `iframe`. No iframe, um laço infinito congelaria a aba inteira.

### D5 — Pontos calculados no servidor
O navegador só informa erros, dicas e soluções vistas; o servidor calcula estrelas e XP. Assim ninguém sobe no ranking editando o JavaScript.

### D6 — Banco duplo (arquivo ou MongoDB) com a mesma interface
Permite testar no PC sem configurar nada e usar o Atlas em produção. O Render grátis apaga arquivos, então em produção o banco **tem que ser** o MongoDB.

### D7 — Conteúdo em arquivos JS lidos pelo navegador e pelo servidor
Uma única fonte de verdade. O servidor lê os mesmos arquivos para saber quais fases existem, qual a ordem e quanto XP cada uma vale. O validador também lê esses arquivos e roda todas as respostas.

### D8 — Monetização só com AdSense, grátis para o aluno e sem certificado
Pedido do dono do projeto.
- Os anúncios ficam **só em pontos de pausa**: aulas abertas, início, fim de fase, fim da revisão, ranking e trilha.
- **Nunca** dentro dos exercícios, no login ou em telas de erro, porque as políticas do Google proíbem anúncio em tela sem conteúdo e perto de botões.
- "Anúncios automáticos" do AdSense devem ficar **desligados**.

### D9 — Aulas abertas, renderizadas no servidor
O robô do AdSense e do Google não cria conta. Se as aulas ficassem atrás do login, o AdSense recusaria o site e as aulas não apareceriam nas buscas. Por isso o app foi para `/app` e o site público ficou na raiz.

### D10 — Estatísticas próprias, sem dados pessoais
- Contamos aparelhos com um id aleatório do navegador, sem nome, IP ou e-mail.
- Os registros diários são apagados após 400 dias.
- Robôs são ignorados.
- O Google Analytics é opcional e só carrega com consentimento.

Isso atende à LGPD e dá ao dono os números que importam: visitantes, ativos, quem estudou, retorno e funil.

### D11 — Sem envio de e-mail (por enquanto)
Mandar e-mail exige um serviço externo (e geralmente pago). A recuperação de senha é manual: a pessoa escreve para o `CONTATO_EMAIL` e o dono gera uma senha provisória no painel. Ver o roteiro para a versão automática.

### D12 — Java com bloqueios por texto
O executor de Java bloqueia por padrão de texto: arquivos, rede, processos, reflexão e threads. Também limita tempo, memória e concorrência, e roda como usuário comum no Docker. É suficiente para um projeto de estudo. Para escala grande, rodar o Java num serviço isolado e descartável (ver roteiro).

### D13 — Idioma e exemplos do dia a dia
Tudo em português, sem jargão, com analogias físicas (caixa com etiqueta, forma de bolo, campainha) e exemplos do cotidiano (salão, entregas, estoque). Os chefões usam o caixa de um salão: um problema real e próximo.
