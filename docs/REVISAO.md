# Revisão geral do código — 02/11/2026 (versão 1.4.1)

Revisão completa feita antes do primeiro `git push` das versões 1.3 e 1.4.
Objetivo: achar problemas **antes** de ir para o ar e deixar testes prontos
para as próximas mudanças não quebrarem o que já funciona.

## Como testar (faça sempre antes de um `git push`)

| Comando | O que confere | Tempo |
|---|---|---|
| `npm test` | Regras do jogo, motores de código (JS, CSS, SQL, Node, terminal) e **a API inteira** (cadastro, login, progresso, senha, sugestões, painel, prova, certificado, site público) num servidor de teste separado | ~20 s |
| `npm run validar` | As 1.008 respostas de todas as fases (precisa de Python e Java no PC) | ~3 min |
| `npm run testar:tudo` | Os dois acima | ~3 min |

- Os testes usam um banco **separado** (arquivo temporário): não mexem nos seus dados.
- No GitHub, o arquivo `.github/workflows/testes.yml` roda os mesmos testes a cada `git push`. Se algo quebrar, aparece um ❌ vermelho ao lado do commit e chega um e-mail.
- Para testar também com MongoDB: `TESTE_MONGODB_URI=mongodb://... npm test` (no Windows PowerShell: `$env:TESTE_MONGODB_URI="..."; npm test`).

## O que foi encontrado e corrigido

### Segurança
| # | Problema | Risco | Correção |
|---|---|---|---|
| 1 | Na prova final, dava para **reenviar a mesma prova** depois de ver o gabarito | Certificado sem saber a matéria | Cada prova tem um id (`tid`) e só pode ser entregue uma vez |
| 2 | Depois de uma **senha provisória** (ou troca de senha), quem estava logado com a senha antiga continuava entrando por 60 dias | Conta invadida continuava invadida | Versão do token (`tv`): trocar a senha derruba os logins antigos |
| 3 | Não existia **trocar a própria senha** (quem recebia senha provisória ficava com ela) | Senha conhecida pelo dono do site | Perfil → "Trocar a senha" (`POST /api/eu/senha`) |
| 4 | No Java, dava para esconder palavras proibidas com **escapes `\uXXXX`** (o Java troca antes de compilar) | Driblar o bloqueio de arquivos/comandos | Código com `\uXXXX` é recusado; `javac -proc:none` |
| 5 | O **avatar** aceitava qualquer texto (até `<b>`) e aparecia no ranking | Bagunçar a tela dos outros | Avatar sem caracteres de HTML |
| 6 | Concluir a mesma fase em sequência dava **XP infinito** (3 por vez) | Ranking injusto | Repetir em menos de 1 minuto não vale XP + limite de 40 conclusões por minuto |
| 7 | A revisão dava **5 XP de bônus** mesmo sem nada para revisar, e aceitava dados quebrados | Ranking injusto / erro 500 | Bônus só com revisão de verdade; só aceita lista válida |
| 8 | Conta excluída com token ainda válido gerava **erro 500** em várias rotas | Erros no log | O porteiro (`exigirLogin`) confere se a conta existe e entrega `req.u` |
| 9 | Senha errada em "Excluir conta" **deslogava** a pessoa (o app trata 401 como "sessão acabou") | Experiência ruim | Senha errada responde 403 |
| 10 | Mensagens de sugestão sem limite no MongoDB | Encher os 512 MB do Atlas grátis | Guarda as 2.000 mais recentes |
| 11 | O cabeçalho `Referrer-Policy: no-referrer` (padrão do helmet) | O AdSense e o Analytics não sabiam de onde vinham as visitas | `strict-origin-when-cross-origin` (padrão dos navegadores) |

### Funcionamento e desempenho
| # | Problema | Correção |
|---|---|---|
| 12 | O app baixava ~750 KB **sem compactar** a cada visita | `compression` (gzip): ~5x menor no celular |
| 13 | O service worker baixava sql.js (650 KB), React e linkedom na instalação, mesmo para quem só estuda Python | Arquivos grandes só são guardados quando a trilha é usada |
| 14 | O painel usava `$cond`/`$max` em agregações do MongoDB (nunca tinha sido testado com MongoDB de verdade) | Consultas simples, testadas num servidor compatível com MongoDB (FerretDB) |
| 15 | O índice de limpeza automática (TTL) derrubava o servidor em bancos que não o suportam | Vira só um aviso; o site funciona |
| 16 | Prova/certificado devolviam o usuário sem o campo `admin`: o dono perdia o 📊 Painel até recarregar | Respostas usam o mesmo formato de usuário do resto da API |
| 17 | `compression` 1.8.1 tinha alerta de segurança | Versão 1.8.2 (`npm audit`: 0 vulnerabilidades) |
| 18 | Os limites de "fases por minuto", "Java por minuto" e da prova eram **por IP**: numa escola ou lan house a turma inteira sai pelo mesmo IP e todos seriam bloqueados juntos | Limites contados **por aluno**; o aviso "muitas execuções" agora aparece explicado em vez de "Erro ao rodar" |

### Testado nesta revisão
- `npm test`: 19 testes (regras, motores, API completa) — com arquivo local **e** com MongoDB.
- `npm run validar`: 1.008 verificações (todas as respostas das 8 trilhas).
- Navegador de verdade (Chromium, tela de celular): todas as fases de HTML e CSS, JavaScript, React, Back-end, SQL e Git jogadas do começo ao fim; Java (6 fases, respeitando o limite de 20 execuções por minuto); sugestão sem conta e com conta; painel do dono; prova final (reprovação, aprovação, limite diário), certificado e PDF.
- Restaurar backup no MongoDB e achar certificado pelo código.

## Recomendações para o futuro (ainda não feitas)
Também estão no `docs/ROTEIRO.md`.

1. **Recuperar senha por e-mail** (hoje é manual pelo painel). Precisa de um serviço de e-mail (Resend ou Brevo têm plano grátis).
2. **Content-Security-Policy**: está desligada porque o AdSense, o Analytics e o Pyodide usam scripts de vários domínios. Depois que o AdSense estiver aprovado, dá para ligar uma política que liste só esses domínios.
3. **Carregar o conteúdo sob demanda**: hoje o app baixa as 8 trilhas de uma vez (~150 KB compactados). Se passar de 15 trilhas, vale carregar só a trilha aberta.
4. **Java isolado**: se o número de alunos crescer muito, rodar o Java num serviço separado (Judge0, por exemplo).
5. **Backup automático do Atlas**: o plano grátis não faz. Lembrete semanal do botão "Baixar backup" ou um plano pago.
6. **Domínio próprio + HTTPS**: obrigatório na prática para o AdSense e para o certificado parecer confiável.
