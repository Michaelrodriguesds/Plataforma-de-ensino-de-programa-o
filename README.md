# 🎮 CodeQuest — aprenda programação jogando

[![Testes](https://github.com/Michaelrodriguesds/Plataforma-de-ensino-de-programa-o/actions/workflows/testes.yml/badge.svg)](https://github.com/Michaelrodriguesds/Plataforma-de-ensino-de-programa-o/actions/workflows/testes.yml)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.4.1-7c4dff)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

**▶️ No ar:** <https://codequest-yk2k.onrender.com> · **App:** <https://codequest-yk2k.onrender.com/app>

> No plano grátis do Render o site "dorme" sem visitas: a primeira abertura pode levar cerca de 1 minuto.

Plataforma **gratuita** e gamificada para aprender programação **em português**, no celular ou no notebook. São lições curtas, exercícios em que o aluno escreve **código de verdade** e mecânicas de jogo (XP, ofensiva, ranking, revisão espaçada) para criar o hábito de estudar um pouco todo dia.

## O que tem

| Trilha | Fases | Onde o código roda |
|---|---|---|
| 🐍 Python | 33 | no navegador (Pyodide) |
| 🟨 JavaScript (com DOM) | 37 | no navegador (Web Worker) |
| ☕ Java | 33 | no servidor (`javac`, com limites e bloqueios) |
| 🎨 HTML e CSS | 22 | a página do aluno, desenhada de verdade |
| ⚛️ React | 16 | Preact + JSX num Web Worker |
| 🟩 Back-end com Node.js | 20 | Node "de treino" com Express, MongoDB, bcrypt e JWT |
| 🗄️ SQL e Bancos de Dados | 20 | SQLite de verdade (sql.js) |
| 🌿 Git, Terminal e Deploy | 16 | terminal de treino com Git, npm e "GitHub" |

**8 trilhas, 197 fases e 709 exercícios**, todos com as respostas testadas automaticamente.

- **5 tipos de exercício:** quiz, prever a saída, completar, montar o código e desafio de código. Inspirados no método PRIMM, nos problemas de Parsons e nos exemplos resolvidos.
- **Carreira Full Stack:** HTML e CSS → JavaScript → React → Back-end → SQL → Git e deploy.
- **Jogo:** XP, níveis, estrelas, ofensiva com protetor, conquistas e ranking semanal e geral.
- **Revisão espaçada:** o conteúdo volta em 1, 3, 7, 14, 30 e 60 dias.
- **Prova final e certificado ilustrativo** em cada trilha, com carga horária, habilidades e código de verificação. O certificado não tem reconhecimento do MEC.
- **Erros traduzidos** para o português, com dica.
- **Site público** com as aulas abertas, pensado para SEO e para a aprovação no AdSense.
- **Painel do dono:** visitantes, cadastros, quem está online, onde os alunos desistem e as sugestões recebidas.
- **App instalável** no celular (PWA).

## Tecnologias

**Back-end:** Node.js e Express · MongoDB (Atlas), com opção de usar um arquivo local · JWT e bcrypt · helmet, rate limit e compressão
**Front-end:** HTML, CSS e JavaScript puro, sem framework · Web Workers · Pyodide · sql.js · Preact e sucrase
**Infraestrutura:** Docker (com Java) · Render Blueprint · GitHub Actions

## Rodar no seu computador

Pré-requisitos: **Node.js 18+**. O **JDK 17+** só é necessário para os exercícios de Java.

```bash
npm install
cp .env.example .env      # no Windows: copy .env.example .env
npm start                 # http://localhost:3000
```

Sem `MONGODB_URI` no `.env`, os dados ficam no arquivo `data/db.json`.

## Testes

```bash
npm test              # regras do jogo, motores de código e a API completa (~20 s)
npm run validar       # roda as respostas de todas as fases (precisa de Python e Java)
```

O GitHub Actions roda os dois a cada `git push`.

## Documentação

| Arquivo | Para quê |
|---|---|
| [`LEIA-ME.md`](LEIA-ME.md) | Guia completo: rodar no PC, colocar online, criar fases, AdSense e painel |
| [`docs/mapa-codequest.html`](docs/mapa-codequest.html) | Mapa visual com o passo a passo no Windows e fluxogramas |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | Como o código funciona por dentro |
| [`docs/DECISOES.md`](docs/DECISOES.md) | Por que cada coisa foi feita assim |
| [`docs/REVISAO.md`](docs/REVISAO.md) | Revisão de segurança e qualidade, e recomendações |
| [`docs/ROTEIRO.md`](docs/ROTEIRO.md) | Próximas melhorias |
| [`docs/CURRICULO.md`](docs/CURRICULO.md) | Lista de todas as fases |
| [`CHANGELOG.md`](CHANGELOG.md) | Histórico de versões |

## Sugestões

Use o botão **💬 Sugestões** no site ou abra uma *issue* aqui no GitHub.

---

Feito por **Michael Rodrigues dos Santos**. © 2026 — todos os direitos reservados.
