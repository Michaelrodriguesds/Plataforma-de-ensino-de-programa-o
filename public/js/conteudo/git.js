// =============================================================
// Trilha Git, Terminal e Deploy
// Os comandos rodam num terminal simulado (public/js/runtime/terminal.js),
// com pastas, arquivos, Git, npm, node e até um "GitHub" de treino.
// Cada execução começa do zero na pasta ~/projeto.
//
// Campos especiais:
//   pasta: comandos rodados ANTES do aluno, em silêncio (o cenário)
//   teste: comandos rodados DEPOIS do aluno; só a saída deles é conferida
// As mensagens do Git são em inglês, como no seu computador.
// =============================================================
(function () {
  var C = (window.CURSOS = window.CURSOS || {});
  var SITE = `mkdir site
cd site
echo "<h1>Salão da Ana</h1>" > index.html
echo "body { color: #333; }" > estilo.css`;
  var REPO = SITE + `
git init
git add .
git commit -m "Primeira versão"`;

  C.git = {
    id: 'git', nome: 'Git, Terminal e Deploy', icone: '🌿', cor: '#F4645F', ling: 'terminal',
    // usadas no certificado de conclusão
    habilidades: ['Uso do terminal: pastas, arquivos e caminhos', 'Controle de versão com Git: add, commit, log, diff e restore', '.gitignore e proteção de segredos', 'Branches, merge e resolução de conflitos', 'GitHub: remote, push, pull, clone e trabalho em equipe', 'npm, package.json e scripts', 'Variáveis de ambiente e deploy de aplicações'],
    desc: 'As ferramentas de todo dia de quem programa: terminal, Git, GitHub, npm e colocar o projeto no ar.',
    mundos: [
      // ===================================================== MUNDO 1
      {
        titulo: 'O terminal', desc: 'Conversar com o computador por texto.',
        fases: [
          {
            id: 'git-01', titulo: 'Abrindo o terminal', icone: '🖥️',
            licao: [
              { titulo: 'Por que usar texto?', texto: `<p>O <b>terminal</b> (ou linha de comando) é um jeito de mandar ordens ao computador digitando, em vez de clicar. Parece antigo, mas é a ferramenta mais usada por quem programa: Git, npm, Node, deploy... tudo começa nele.</p><p>No Windows você pode usar o terminal do <b>VS Code</b> (menu Terminal → Novo Terminal), o <b>PowerShell</b> ou o <b>Git Bash</b> (vem junto com o Git). Aqui no CodeQuest o terminal imita o Git Bash e o Linux, que é o que roda nos servidores.</p><p>Cada linha é um comando. O texto antes do <code>$</code> (<code>~/projeto $</code>) mostra <b>em que pasta você está</b>.</p>` },
              { titulo: 'Onde estou? O que tem aqui?', texto: `<ul><li><code>pwd</code> (<i>print working directory</i>): mostra a pasta atual</li><li><code>ls</code> (<i>list</i>): lista o que tem nela (no PowerShell também funciona; no cmd antigo é <code>dir</code>)</li><li><code>cd nome</code> (<i>change directory</i>): entra numa pasta</li><li><code>cd ..</code>: volta uma pasta (sobe para a pasta "mãe")</li></ul><p>Toque em <b>Rodar exemplo</b> para ver.</p>`, codigo: `pwd
mkdir fotos
ls
cd fotos
pwd
cd ..
pwd` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual comando mostra <b>em que pasta</b> você está?', op: ['ls', 'pwd', 'cd', 'where'], c: 1, exp: 'pwd = print working directory.' },
              { tipo: 'quiz', p: 'O que faz <code>cd ..</code>?', op: ['Apaga a pasta', 'Volta para a pasta de cima (a "mãe")', 'Lista as pastas', 'Entra numa pasta chamada ..'], c: 1, exp: 'Os dois pontos significam "a pasta acima desta".' },
              { tipo: 'prever', codigo: `pwd
cd ..
pwd`, op: ['/home/aluno/projeto\n/home/aluno', '/home/aluno\n/home/aluno/projeto', '/home/aluno/projeto\n/home/aluno/projeto', '~/projeto\n~'], c: 0, exp: 'Começamos em /home/aluno/projeto. O cd .. sobe para /home/aluno.' },
              { tipo: 'codigo', p: 'A pasta <code>clientes</code> já existe. Entre nela e mostre onde você está com <code>pwd</code>.', pasta: `mkdir clientes`, inicio: `# um comando por linha
`, teste: `pwd`, saida: '/home/aluno/projeto/clientes', dicas: ['Use cd para entrar.', 'cd clientes', 'Na linha de baixo: pwd'], sol: `cd clientes
pwd` }
            ]
          },
          {
            id: 'git-02', titulo: 'Pastas e arquivos', icone: '🗂️',
            licao: [
              { titulo: 'Criar, ver, mover, apagar', texto: `<ul><li><code>mkdir nome</code>: cria uma pasta (<i>make directory</i>)</li><li><code>touch arquivo.txt</code>: cria um arquivo vazio (no PowerShell: <code>ni arquivo.txt</code>)</li><li><code>echo "texto" &gt; arquivo.txt</code>: escreve no arquivo (apaga o que tinha)</li><li><code>echo "mais" &gt;&gt; arquivo.txt</code>: acrescenta no fim</li><li><code>cat arquivo.txt</code>: mostra o conteúdo</li><li><code>mv a.txt b.txt</code>: renomeia ou move; <code>cp</code> copia</li><li><code>rm arquivo.txt</code>: apaga (<b>sem lixeira!</b>); <code>rm -r pasta</code> apaga uma pasta inteira</li></ul>`, codigo: `mkdir anotacoes
cd anotacoes
echo "Comprar shampoo" > lista.txt
echo "Ligar para a Bia" >> lista.txt
cat lista.txt
cp lista.txt copia.txt
mv copia.txt backup.txt
ls
rm backup.txt
ls` },
              { titulo: 'Atalhos que salvam tempo', texto: `<ul><li><b>Tab</b>: completa o nome do arquivo ou pasta (digite <code>cd ano</code> + Tab)</li><li><b>Seta para cima</b>: repete os comandos anteriores</li><li><b>Ctrl + C</b>: interrompe um programa que está rodando (como o servidor)</li><li><code>clear</code>: limpa a tela</li></ul>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual a diferença entre <code>&gt;</code> e <code>&gt;&gt;</code>?', op: ['Nenhuma', '> substitui o conteúdo do arquivo; >> acrescenta no fim', '>> apaga o arquivo', '> só funciona com números'], c: 1, exp: 'Cuidado com o > : ele apaga o que tinha antes.' },
              { tipo: 'prever', codigo: `echo "A" > nota.txt
echo "B" > nota.txt
echo "C" >> nota.txt
cat nota.txt`, op: ['B\nC', 'A\nB\nC', 'C', 'A\nC'], c: 0, exp: 'O segundo > trocou A por B, e o >> acrescentou C.' },
              { tipo: 'montar', p: 'Crie a pasta <code>site</code>, entre nela e crie o arquivo <code>index.html</code>.', linhas: ['mkdir site', 'cd site', 'touch index.html'], extras: ['cd index.html'], teste: `ls`, saida: 'index.html', exp: 'Primeiro cria a pasta, depois entra, depois cria o arquivo lá dentro.' },
              { tipo: 'codigo', p: 'Organize a pasta do salão:<ol><li>crie a pasta <code>fotos</code></li><li>mova o arquivo <code>fachada.jpg</code> para dentro dela</li><li>renomeie <code>precos-velho.txt</code> para <code>precos.txt</code></li><li>apague <code>lixo.tmp</code></li></ol>', pasta: `touch fachada.jpg precos-velho.txt lixo.tmp
echo "Corte: 40" > precos-velho.txt`, inicio: `ls
`, teste: `ls
ls fotos
cat precos.txt`, saida: 'fotos  precos.txt\nfachada.jpg\nCorte: 40', dicas: ['mkdir fotos', 'mv fachada.jpg fotos (mover para dentro da pasta) e mv precos-velho.txt precos.txt (renomear)', 'rm lixo.tmp'], sol: `mkdir fotos
mv fachada.jpg fotos
mv precos-velho.txt precos.txt
rm lixo.tmp` }
            ]
          },
          {
            id: 'git-03', titulo: 'Caminhos', icone: '🧭',
            licao: [
              { titulo: 'Endereços de arquivos', texto: `<p>Todo arquivo tem um <b>caminho</b>, como um endereço:</p><ul><li><b>absoluto</b>: começa na raiz <code>/</code> (no Windows, em <code>C:\\</code>). Ex: <code>/home/aluno/projeto/site/index.html</code>. Funciona de qualquer lugar</li><li><b>relativo</b>: a partir de onde você está. Ex: <code>site/index.html</code></li></ul><p>Símbolos especiais:</p><ul><li><code>.</code> = esta pasta</li><li><code>..</code> = a pasta de cima</li><li><code>~</code> = sua pasta pessoal (<code>/home/aluno</code>)</li></ul><p>No HTML é igual: <code>&lt;img src="../fotos/logo.png"&gt;</code> sobe uma pasta e entra em fotos.</p>`, codigo: `mkdir -p site/css
cd site/css
pwd
cd ../..
pwd
cd ~
pwd` },
              { titulo: 'Arquivos escondidos', texto: `<p>Arquivos e pastas que começam com ponto (<code>.gitignore</code>, <code>.env</code>, <code>.git</code>) ficam <b>ocultos</b>. O <code>ls -a</code> mostra todos (o <code>-a</code> é uma <b>opção</b>, de <i>all</i>). O <code>ls -F</code> marca as pastas com <code>/</code>.</p>`, codigo: `touch .env index.html
mkdir css
ls
ls -a
ls -F` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Você está em <code>/home/aluno/projeto/site</code>. Para onde leva <code>cd ../fotos</code>?', op: ['/home/aluno/projeto/site/fotos', '/home/aluno/projeto/fotos', '/home/aluno/fotos', '/fotos'], c: 1, exp: '.. sobe para /home/aluno/projeto e depois entra em fotos.' },
              { tipo: 'quiz', p: 'Por que <code>ls</code> não mostrou o arquivo <code>.env</code>?', op: ['Ele não existe', 'Arquivos que começam com ponto são ocultos; use ls -a', 'O ls só mostra pastas', '.env é proibido'], c: 1, exp: 'Ponto no começo do nome = oculto.' },
              { tipo: 'codigo', p: 'Você está em <code>~/projeto/site/css</code>. Usando caminhos relativos, sem sair dessa pasta com <code>cd</code>:<ol><li>crie o arquivo <code>../js/app.js</code> (a pasta js já existe)</li><li>crie o arquivo <code>.env</code> na pasta <code>site</code> (a de cima)</li></ol>', pasta: `mkdir -p site/css site/js
cd site/css`, inicio: ``, teste: `cd ~/projeto/site
ls -a
ls js`, saida: '.  ..  css  .env  js\napp.js', dicas: ['Para chegar na pasta js a partir de css: ../js', 'touch ../js/app.js', 'touch ../.env'], sol: `touch ../js/app.js
touch ../.env` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 2
      {
        titulo: 'Git: salvando versões', desc: 'Nunca mais perder código nem ter "site-final-agora-vai.zip".',
        fases: [
          {
            id: 'git-04', titulo: 'O que é Git', icone: '🌱',
            licao: [
              { titulo: 'Uma máquina do tempo para o código', texto: `<p>Sabe quando você salva <code>trabalho.docx</code>, <code>trabalho-final.docx</code>, <code>trabalho-final-2.docx</code>? O <b>Git</b> resolve isso: ele guarda <b>fotos</b> (os <b>commits</b>) do seu projeto ao longo do tempo. Você pode ver o que mudou, voltar atrás e trabalhar em equipe sem um apagar o trabalho do outro.</p><p>Um <b>repositório</b> é uma pasta que o Git está acompanhando. Para começar:</p><pre>git init</pre><p>Ele cria a pasta oculta <code>.git</code>, onde fica todo o histórico. Não mexa nela!</p>`, codigo: SITE + `
git init
ls -a` },
              { titulo: 'git status: o comando mais usado', texto: `<p><code>git status</code> diz a situação de cada arquivo. No começo, todos aparecem como <b>untracked</b> (não rastreados): o Git está vendo, mas ainda não guarda versões deles.</p><p>Na primeira vez no seu computador, diga quem você é (vai aparecer nos commits):</p><pre>git config --global user.name "Seu Nome"\ngit config --global user.email "voce@email.com"</pre>`, codigo: SITE + `
git init
git status` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que o <code>git init</code> faz?', op: ['Baixa o Git', 'Transforma a pasta atual num repositório (cria a pasta .git)', 'Envia para o GitHub', 'Apaga o histórico'], c: 1, exp: 'Ele começa o acompanhamento da pasta.' },
              { tipo: 'quiz', p: 'O que é um <b>commit</b>?', op: ['Um arquivo', 'Uma "foto" do projeto, com uma mensagem, guardada no histórico', 'Um erro', 'Uma pasta'], c: 1, exp: 'Cada commit registra o estado dos arquivos naquele momento.' },
              { tipo: 'codigo', p: 'Dentro da pasta <code>loja</code> (que já existe, com arquivos), crie um repositório Git e veja o status curto com <code>git status -s</code>.', pasta: `mkdir loja
cd loja
touch index.html produtos.json`, inicio: ``, teste: `ls -a`, saida: '.  ..  .git  index.html  produtos.json', dicas: ['Você já está dentro da pasta loja.', 'git init', 'git status -s (?? significa "não rastreado")'], sol: `git init
git status -s` }
            ]
          },
          {
            id: 'git-05', titulo: 'add e commit', icone: '📸',
            licao: [
              { titulo: 'As três áreas', texto: `<p>Pense numa sessão de fotos:</p><ol><li><b>pasta de trabalho</b>: onde você mexe nos arquivos</li><li><b>área de preparação</b> (<i>staging</i>): quem vai sair na foto. Você escolhe com <code>git add</code></li><li><b>histórico</b>: a foto tirada, com <code>git commit -m "mensagem"</code></li></ol><p><code>git add arquivo</code> prepara um arquivo; <code>git add .</code> prepara tudo da pasta.</p>`, codigo: SITE + `
git init
git add index.html
git status -s
git commit -m "Página inicial"
git status -s` },
              { titulo: 'Boas mensagens', texto: `<p>A mensagem do commit explica <b>o que</b> mudou, para você daqui a 6 meses: <code>"Adiciona tabela de preços"</code>, <code>"Corrige menu no celular"</code>. Evite <code>"mudanças"</code>, <code>"ajustes"</code>, <code>"asdf"</code>.</p><p>Faça commits pequenos e frequentes: cada um com uma ideia só.</p><p>No <code>git status -s</code>: <code>??</code> não rastreado, <code>A</code> adicionado, <code>M</code> modificado. A primeira coluna é a área de preparação; a segunda, a pasta de trabalho.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Qual a ordem certa?', op: ['git commit e depois git add', 'git add e depois git commit -m "..."', 'git push e depois git add', 'git init a cada commit'], c: 1, exp: 'Primeiro você escolhe o que vai no commit (add), depois registra (commit).' },
              { tipo: 'prever', p: 'O repositório acabou de ser criado. Depois do comando abaixo, o que o <code>git status -s</code> mostra?', pasta: SITE + `
git init`, codigo: `git add index.html`, teste: `git status -s`, op: ['A  index.html\n?? estilo.css', '?? estilo.css\n?? index.html', 'A  estilo.css\nA  index.html', 'nada'], c: 0, exp: 'Só o index.html foi adicionado (A). O estilo.css continua não rastreado (??).' },
              { tipo: 'completar', p: 'Prepare tudo e faça o commit.', codigo: `git ___ .
git ___ -m "Adiciona página de contato"`, resp: ['add', 'commit'], op: ['add', 'commit', 'push', 'save'], exp: 'add prepara, commit registra.' },
              { tipo: 'codigo', p: 'O repositório já existe. Faça <b>dois commits</b>, nesta ordem:<ol><li>só o <code>index.html</code>, com a mensagem <code>Cria página inicial</code></li><li>o <code>estilo.css</code>, com a mensagem <code>Adiciona estilo</code></li></ol>', pasta: SITE + `
git init`, inicio: ``, teste: `git log --format=%s
git status -s`, saida: 'Adiciona estilo\nCria página inicial', dicas: ['git add index.html e depois git commit -m "Cria página inicial"', 'Depois a mesma coisa com o estilo.css.', 'O log mostra do mais novo para o mais antigo.'], sol: `git add index.html
git commit -m "Cria página inicial"
git add estilo.css
git commit -m "Adiciona estilo"` }
            ]
          },
          {
            id: 'git-06', titulo: 'Histórico e diferenças', icone: '🕰️',
            licao: [
              { titulo: 'git log', texto: `<p><code>git log</code> mostra os commits, do mais novo para o mais antigo. Cada um tem um <b>hash</b>: um código único como <code>a1b2c3d</code>.</p><ul><li><code>git log --oneline</code>: uma linha por commit</li><li><code>git log -3</code>: só os 3 últimos</li></ul><p>O <code>(HEAD -&gt; main)</code> mostra onde você está: no último commit da branch main.</p>`, codigo: REPO + `
echo "<p>Agende já</p>" >> index.html
git commit -am "Chamada para agendar"
git log --oneline
git log -1` },
              { titulo: 'O que mudou? E como desfazer?', texto: `<ul><li><code>git diff</code>: mostra as mudanças ainda <b>não preparadas</b>. Linhas com <code>-</code> saíram, com <code>+</code> entraram</li><li><code>git diff --staged</code>: as mudanças já preparadas (com add)</li><li><code>git restore arquivo</code>: <b>descarta</b> as mudanças do arquivo e volta para a última versão salva (cuidado: não tem volta)</li><li><code>git restore --staged arquivo</code>: tira da preparação (desfaz o add), sem perder a mudança</li></ul><p><code>git commit -am "..."</code> é um atalho: faz o add de todos os arquivos <b>já rastreados</b> e o commit de uma vez.</p>`, codigo: REPO + `
echo "body { color: red; }" > estilo.css
git diff
git restore estilo.css
cat estilo.css
git status` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Você estragou o <code>index.html</code> e quer voltar para a versão do último commit. Qual comando?', op: ['git log', 'git restore index.html', 'git add index.html', 'git init'], c: 1, exp: 'restore descarta as mudanças não salvas do arquivo.' },
              { tipo: 'quiz', p: 'No <code>git diff</code>, uma linha que começa com <code>+</code> significa...', op: ['Uma linha que foi apagada', 'Uma linha que foi adicionada', 'Um erro', 'Um comentário'], c: 1, exp: '+ entrou, - saiu.' },
              { tipo: 'codigo', p: 'Alguém mexeu em dois arquivos. O <code>index.html</code> ficou bom: faça commit dele com a mensagem <code>Atualiza título</code>. O <code>estilo.css</code> ficou estragado: descarte as mudanças dele.', pasta: REPO + `
echo "<h1>Salão da Ana - Desde 2015</h1>" > index.html
echo "ESTRAGADO" > estilo.css`, inicio: `git status -s
`, teste: `git log --format=%s
cat estilo.css
git status`, saida: 'Atualiza título\nPrimeira versão\nbody { color: #333; }\nOn branch main\n\nnothing to commit, working tree clean', dicas: ['git add index.html e git commit -m "Atualiza título"', 'git restore estilo.css', 'Ou, ao contrário: primeiro o restore, depois git commit -am "Atualiza título".'], sol: `git add index.html
git commit -m "Atualiza título"
git restore estilo.css` }
            ]
          },
          {
            id: 'git-07', titulo: '.gitignore', icone: '🙈',
            licao: [
              { titulo: 'O que NÃO vai para o Git', texto: `<p>Alguns arquivos nunca devem entrar no repositório:</p><ul><li><code>node_modules/</code>: pacotes do npm (enormes; recriados com <code>npm install</code>)</li><li><code>.env</code>: senhas e chaves. ⚠️ Se uma senha for para o GitHub, considere que vazou: troque ela</li><li>arquivos gerados (<code>dist/</code>, <code>*.log</code>) e lixo do sistema (<code>.DS_Store</code>, <code>Thumbs.db</code>)</li></ul><p>Liste eles no arquivo <code>.gitignore</code>, um por linha. <code>*</code> vale "qualquer coisa": <code>*.log</code> ignora todos os .log.</p>`, codigo: `mkdir app
cd app
git init
touch index.js .env erro.log
mkdir node_modules
touch node_modules/express.js
git status -s
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
git status -s` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Por que o <code>.env</code> vai no .gitignore?', op: ['É muito grande', 'Ele guarda senhas e chaves, que não podem ir para o GitHub', 'O Git não lê arquivos com ponto', 'Para o site ficar mais rápido'], c: 1, exp: 'Segredos nunca vão para o repositório. No servidor, eles são cadastrados no painel da hospedagem.' },
              { tipo: 'quiz', p: 'Qual linha do .gitignore ignora todos os arquivos terminados em <code>.log</code>?', op: ['.log', '*.log', 'log/', '%.log'], c: 1, exp: '* = qualquer nome.' },
              { tipo: 'codigo', p: 'Crie o <code>.gitignore</code> para ignorar a pasta <code>node_modules/</code>, o arquivo <code>.env</code> e a pasta <code>dist/</code>. Depois faça o commit de tudo que sobrou com a mensagem <code>Projeto inicial</code>.', pasta: `mkdir api
cd api
git init
echo "PORT=3000" > .env
touch server.js package.json
mkdir node_modules dist
touch node_modules/express.js dist/app.min.js`, inicio: ``, teste: `git status -s
git log --format=%s

cat .gitignore`, saida: 'Projeto inicial\nnode_modules/\n.env\ndist/', dicas: ['echo "node_modules/" > .gitignore (o primeiro com >, os outros com >>)', 'echo ".env" >> .gitignore e echo "dist/" >> .gitignore', 'git add . e git commit -m "Projeto inicial"'], sol: `echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
git add .
git commit -m "Projeto inicial"` }
            ]
          },
          {
            id: 'git-08', titulo: 'Chefão: projeto versionado', icone: '👑', xp: 60,
            licao: [
              { titulo: 'Do zero ao histórico', texto: `<p>O fluxo que você vai repetir em todo projeto:</p><ol><li>criar a pasta e os arquivos</li><li><code>git init</code></li><li>criar o <code>.gitignore</code></li><li><code>git add .</code> e <code>git commit -m "..."</code></li><li>a cada melhoria: editar → <code>git status</code> → <code>add</code> → <code>commit</code></li></ol>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'Faça tudo, começando da pasta <code>~/projeto</code> vazia:<ol><li>crie a pasta <code>portfolio</code> e entre nela</li><li>crie o <code>index.html</code> com o texto <code>&lt;h1&gt;Michael&lt;/h1&gt;</code> e um <code>.env</code> vazio</li><li>inicie o Git e crie um <code>.gitignore</code> que ignora o <code>.env</code></li><li>commit com a mensagem <code>Primeira versão</code></li><li>acrescente <code>&lt;p&gt;Desenvolvedor Full Stack&lt;/p&gt;</code> no fim do <code>index.html</code> e faça outro commit: <code>Adiciona profissão</code></li></ol>', inicio: ``, teste: `cd ~/projeto/portfolio
git log --format=%s
cat index.html
git status -s
cat .gitignore`, saida: 'Adiciona profissão\nPrimeira versão\n<h1>Michael</h1>\n<p>Desenvolvedor Full Stack</p>\n.env', dicas: ['mkdir portfolio, cd portfolio, echo "<h1>Michael</h1>" > index.html, touch .env', 'git init e echo ".env" > .gitignore, depois git add . e git commit -m "Primeira versão"', 'echo "<p>Desenvolvedor Full Stack</p>" >> index.html e git commit -am "Adiciona profissão"'], sol: `mkdir portfolio
cd portfolio
echo "<h1>Michael</h1>" > index.html
touch .env
git init
echo ".env" > .gitignore
git add .
git commit -m "Primeira versão"
echo "<p>Desenvolvedor Full Stack</p>" >> index.html
git commit -am "Adiciona profissão"` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 3
      {
        titulo: 'Branches e GitHub', desc: 'Trabalhar em paralelo, juntar e compartilhar o código.',
        fases: [
          {
            id: 'git-09', titulo: 'Branches', icone: '🌿',
            licao: [
              { titulo: 'Linhas paralelas', texto: `<p>Uma <b>branch</b> (ramo) é uma linha do tempo paralela. Você cria uma para fazer uma novidade sem mexer na versão principal (<code>main</code>), que continua funcionando. Ficou boa? Junta de volta.</p><ul><li><code>git branch</code>: lista (o <code>*</code> marca onde você está)</li><li><code>git switch -c nome</code>: cria e entra (no Git antigo: <code>git checkout -b nome</code>)</li><li><code>git switch main</code>: volta para a main</li></ul><p>Ao trocar de branch, os <b>arquivos da pasta mudam</b> para a versão daquela branch.</p>`, codigo: REPO + `
git switch -c contato
echo "<p>WhatsApp: 11 99999-0000</p>" >> index.html
git commit -am "Adiciona contato"
cat index.html
git switch main
cat index.html
git branch` },
              { titulo: 'Juntando: merge', texto: `<p>Na <code>main</code>, <code>git merge contato</code> traz os commits da branch. Se a main não mudou enquanto isso, o Git só "avança o ponteiro": é o <b>fast-forward</b>. Depois, a branch pode ser apagada com <code>git branch -d contato</code>.</p>`, codigo: REPO + `
git switch -c contato
echo "<p>WhatsApp</p>" >> index.html
git commit -am "Adiciona contato"
git switch main
git merge contato
git branch -d contato
git log --oneline` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Para que servem as branches?', op: ['Para apagar o histórico', 'Para trabalhar numa novidade sem mexer na versão principal', 'Para enviar ao GitHub', 'Para guardar senhas'], c: 1, exp: 'A main fica estável enquanto você experimenta na branch.' },
              { tipo: 'prever', p: 'Depois destes comandos, o que o <code>ls</code> mostra?', pasta: REPO, codigo: `git switch -c teste
echo "novo" > novo.txt
git add .
git commit -m "Cria novo"
git switch main`, teste: `ls`, op: ['estilo.css  index.html', 'estilo.css  index.html  novo.txt', 'novo.txt', 'Erro'], c: 0, exp: 'O novo.txt só existe na branch teste. Ao voltar para a main, ele some da pasta (mas continua guardado na branch).' },
              { tipo: 'codigo', p: 'Crie a branch <code>precos</code>, crie nela o arquivo <code>precos.html</code> com o texto <code>Corte: R$ 40</code>, faça o commit <code>Adiciona preços</code>, volte para a <code>main</code> e junte a branch com <code>merge</code>.', pasta: REPO, inicio: ``, teste: `git branch
git log --format=%s
cat precos.html`, saida: '* main\n  precos\nAdiciona preços\nPrimeira versão\nCorte: R$ 40', dicas: ['git switch -c precos', 'echo "Corte: R$ 40" > precos.html, git add . e git commit -m "Adiciona preços"', 'git switch main e git merge precos'], sol: `git switch -c precos
echo "Corte: R$ 40" > precos.html
git add .
git commit -m "Adiciona preços"
git switch main
git merge precos` }
            ]
          },
          {
            id: 'git-10', titulo: 'Conflitos', icone: '⚔️',
            licao: [
              { titulo: 'Quando dois mexem no mesmo lugar', texto: `<p>Se a <code>main</code> e a branch mudaram <b>o mesmo arquivo</b> de jeitos diferentes, o Git não sabe qual escolher: é um <b>conflito</b>. Ele para o merge e marca o arquivo assim:</p><pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD\no que está na main\n=======\no que veio da branch\n&gt;&gt;&gt;&gt;&gt;&gt;&gt; nome-da-branch</pre><p>Calma, nada se perdeu! Para resolver:</p><ol><li>abra o arquivo e deixe ele como deve ficar (apague as marcas <code>&lt;&lt;&lt;</code>, <code>===</code>, <code>&gt;&gt;&gt;</code>)</li><li><code>git add arquivo</code></li><li><code>git commit -m "Resolve conflito"</code></li></ol><p>O VS Code mostra botões para escolher "Accept Current", "Accept Incoming" ou os dois. Desistiu? <code>git merge --abort</code> volta tudo.</p>`, codigo: REPO + `
git switch -c titulo-novo
echo "<h1>Studio Ana</h1>" > index.html
git commit -am "Muda título"
git switch main
echo "<h1>Salão da Ana Souza</h1>" > index.html
git commit -am "Nome completo"
git merge titulo-novo
cat index.html
git status -s` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Deu conflito no merge. O que o Git fez?', op: ['Apagou um dos lados', 'Parou e marcou as duas versões no arquivo para você escolher', 'Desfez todos os commits', 'Enviou para o GitHub'], c: 1, exp: 'Você decide como fica, depois faz add e commit.' },
              { tipo: 'quiz', p: 'Depois de editar o arquivo com conflito, qual o próximo passo?', op: ['git init', 'git add arquivo e git commit', 'git restore arquivo', 'Apagar a pasta .git'], c: 1, exp: 'O add marca o conflito como resolvido; o commit fecha o merge.' },
              { tipo: 'codigo', p: 'O merge já deu conflito no <code>index.html</code>. Resolva deixando o arquivo com <b>uma linha só</b>: <code>&lt;h1&gt;Studio Ana Souza&lt;/h1&gt;</code>. Depois finalize o merge com a mensagem <code>Resolve conflito do título</code>.', pasta: REPO + `
git switch -c titulo-novo
echo "<h1>Studio Ana</h1>" > index.html
git commit -am "Muda título"
git switch main
echo "<h1>Salão da Ana Souza</h1>" > index.html
git commit -am "Nome completo"
git merge titulo-novo`, inicio: `cat index.html
`, teste: `git status
cat index.html
git log --format=%s -1`, saida: 'On branch main\n\nnothing to commit, working tree clean\n<h1>Studio Ana Souza</h1>\nResolve conflito do título', dicas: ['Reescreva o arquivo inteiro: echo "<h1>Studio Ana Souza</h1>" > index.html', 'git add index.html', 'git commit -m "Resolve conflito do título"'], sol: `echo "<h1>Studio Ana Souza</h1>" > index.html
git add index.html
git commit -m "Resolve conflito do título"` }
            ]
          },
          {
            id: 'git-11', titulo: 'GitHub e push', icone: '🐙',
            licao: [
              { titulo: 'Seu código na nuvem', texto: `<p>O Git guarda o histórico no seu computador. O <b>GitHub</b> é um site que guarda uma cópia na nuvem (o <b>repositório remoto</b>): serve de backup, para trabalhar em equipe, mostrar seu portfólio e fazer deploy.</p><p>O caminho:</p><ol><li>criar o repositório no GitHub (pelo site, ou com o GitHub CLI: <code>gh repo create nome</code>)</li><li>ligar o seu repositório ao remoto: <code>git remote add origin URL</code> (<code>origin</code> é o apelido padrão)</li><li>enviar: <code>git push -u origin main</code>. O <code>-u</code> lembra o destino; nas próximas vezes, basta <code>git push</code></li></ol><p>Na primeira vez no seu PC, o Windows abre uma janela para entrar no GitHub.</p>`, codigo: REPO + `
gh repo create site
git remote add origin https://github.com/aluno/site.git
git remote -v
git push -u origin main
git status` },
              { titulo: 'O dia a dia', texto: `<pre>git add .\ngit commit -m "O que mudou"\ngit push</pre><p>Esses três comandos você vai digitar milhares de vezes. E sempre que trocar de computador: <code>git clone URL</code> baixa tudo, com o histórico.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que é <code>origin</code>?', op: ['A primeira versão do código', 'O apelido do repositório remoto (o endereço no GitHub)', 'A branch principal', 'Um comando'], c: 1, exp: 'git remote add origin URL dá o apelido origin para aquele endereço.' },
              { tipo: 'quiz', p: 'Para que serve o <code>-u</code> em <code>git push -u origin main</code>?', op: ['Enviar mais rápido', 'Lembrar o destino, para depois usar só git push', 'Apagar o remoto', 'Atualizar o Git'], c: 1, exp: 'Ele liga a branch local à remota (upstream).' },
              { tipo: 'montar', p: 'Coloque na ordem para publicar um projeto novo no GitHub.', linhas: ['git init', 'git add .', 'git commit -m "Primeira versão"', 'git remote add origin https://github.com/aluno/site.git', 'git push -u origin main'], pasta: `gh repo create site
` + SITE, teste: `git log --format=%s
git status`, saida: "Primeira versão\nOn branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean", exp: 'Primeiro o histórico local (init, add, commit); depois liga ao remoto e envia.' },
              { tipo: 'codigo', p: 'O repositório local já tem commits. Crie o repositório <code>agenda</code> no GitHub (com <code>gh repo create agenda</code>), ligue como <code>origin</code> (o endereço é <code>https://github.com/aluno/agenda.git</code>) e envie a <code>main</code> com <code>-u</code>.', pasta: REPO, inicio: ``, teste: `git remote -v
git status`, saida: "origin\thttps://github.com/aluno/agenda.git (fetch)\norigin\thttps://github.com/aluno/agenda.git (push)\nOn branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean", dicas: ['gh repo create agenda', 'git remote add origin https://github.com/aluno/agenda.git', 'git push -u origin main'], sol: `gh repo create agenda
git remote add origin https://github.com/aluno/agenda.git
git push -u origin main` }
            ]
          },
          {
            id: 'git-12', titulo: 'Trabalho em equipe', icone: '🤝',
            licao: [
              { titulo: 'clone, pull e push', texto: `<ul><li><code>git clone URL</code>: baixa um repositório inteiro (cria a pasta, com o histórico e o <code>origin</code> já configurado)</li><li><code>git pull</code>: traz as novidades que outras pessoas enviaram</li><li><code>git push</code>: envia as suas</li></ul><p>Se alguém enviou algo antes de você, o seu push é <b>recusado</b> (<i>rejected</i>): o GitHub não deixa você apagar o trabalho do colega. Solução: <code>git pull</code> (junta as mudanças) e depois <code>git push</code>.</p><p>Regra de ouro da equipe: <b>pull antes de começar, push quando terminar</b>.</p>`, codigo: `# a colega Bia criou o projeto e enviou
gh repo create bia/salao
mkdir /tmp/bia && cd /tmp/bia
git clone https://github.com/bia/salao.git .
echo "Salão" > index.html
git add . && git commit -m "Início" && git push -u origin main
# agora você baixa o projeto
cd ~/projeto
git clone https://github.com/bia/salao.git
cd salao
ls
git log --oneline` },
              { titulo: 'Pull requests', texto: `<p>Em equipes (e em projetos abertos), ninguém envia direto na <code>main</code>. O fluxo é:</p><ol><li>criar uma branch: <code>git switch -c melhora-menu</code></li><li>commits e <code>git push -u origin melhora-menu</code></li><li>no GitHub, abrir um <b>Pull Request</b> (PR): um pedido para juntar a branch na main</li><li>alguém revisa, comenta, aprova, e o merge é feito pelo site</li></ol><p>É assim que funcionam as empresas e os projetos de código aberto.</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Seu <code>git push</code> foi <b>rejected (fetch first)</b>. O que fazer?', op: ['git push --force sem pensar', 'git pull para trazer o que o colega enviou, e depois git push', 'Apagar o repositório', 'Criar outro repositório'], c: 1, exp: 'O remoto tem commits que você não tem. Puxe, junte e envie de novo. O --force apagaria o trabalho do colega!' },
              { tipo: 'quiz', p: 'O que é um Pull Request?', op: ['Um comando do terminal', 'Um pedido, no GitHub, para juntar uma branch na main, com revisão', 'Baixar um repositório', 'Um tipo de erro'], c: 1, exp: 'É o centro do trabalho em equipe no GitHub.' },
              { tipo: 'codigo', p: 'Enquanto você trabalhava, a Bia enviou um commit. Você fez o seu commit <code>Adiciona preços</code>, mas o push foi recusado. Resolva: traga as mudanças dela e envie as suas.', pasta: `gh repo create bia/salao
mkdir /tmp/bia && cd /tmp/bia
git clone https://github.com/bia/salao.git .
echo "<h1>Salão</h1>" > index.html
git add . && git commit -m "Início" && git push -u origin main
cd ~/projeto
git clone https://github.com/bia/salao.git
cd /tmp/bia
echo "WhatsApp" > contato.html
git add . && git commit -m "Adiciona contato" && git push
cd ~/projeto/salao
echo "Corte: 40" > precos.html
git add . && git commit -m "Adiciona preços"`, inicio: `git push
`, teste: `ls
git status`, saida: "contato.html  index.html  precos.html\nOn branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean", dicas: ['O push foi recusado porque o GitHub tem um commit que você não tem.', 'git pull', 'Depois do pull: git push'], sol: `git pull
git push` }
            ]
          }
        ]
      },
      // ===================================================== MUNDO 4
      {
        titulo: 'npm e deploy', desc: 'Pacotes, configurações e colocar o projeto no ar.',
        fases: [
          {
            id: 'git-13', titulo: 'npm e package.json', icone: '📦',
            licao: [
              { titulo: 'O "mercado" de pacotes', texto: `<p>O <b>npm</b> vem junto com o Node e baixa pacotes que outras pessoas fizeram (o Express, o React...).</p><ul><li><code>npm init -y</code>: cria o <code>package.json</code>, a "ficha" do projeto</li><li><code>npm install express</code> (ou <code>npm i express</code>): baixa para a pasta <code>node_modules</code> e anota nas <b>dependências</b></li><li><code>npm install -D nodemon</code>: dependência só de desenvolvimento</li><li><code>npm install</code> (sem nome): instala tudo que está no package.json. É o que outra pessoa (ou o servidor) roda depois de clonar</li></ul>`, codigo: `mkdir api && cd api
npm init -y
npm install express
cat package.json
ls` },
              { titulo: 'Scripts', texto: `<p>No <code>package.json</code>, a parte <code>scripts</code> guarda atalhos:</p><pre>"scripts": {\n  "start": "node server.js",\n  "dev": "node --watch server.js"\n}</pre><p><code>npm start</code> roda o start; outros scripts com <code>npm run nome</code> (<code>npm run dev</code>). Os servidores de hospedagem rodam <code>npm install</code> e depois <code>npm start</code>: por isso esse script é importante.</p>`, codigo: `mkdir app && cd app
npm init -y > /dev/null
echo 'console.log("Servidor do salão ligado!")' > server.js
echo '{ "name": "app", "version": "1.0.0", "scripts": { "start": "node server.js" } }' > package.json
npm start` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Você clonou um projeto Node do GitHub. Qual o primeiro comando?', op: ['npm start', 'npm install', 'npm init', 'node_modules'], c: 1, exp: 'npm install baixa as dependências listadas no package.json (a pasta node_modules não vem pelo Git).' },
              { tipo: 'quiz', p: 'Como rodar o script <code>"dev": "node --watch server.js"</code>?', op: ['npm dev', 'npm run dev', 'node dev', 'npm start dev'], c: 1, exp: 'Scripts comuns usam npm run nome. Só start e test têm atalho (npm start, npm test).' },
              { tipo: 'codigo', p: 'Comece um projeto Node na pasta <code>api</code> (já existe e você já está nela): crie o <code>package.json</code> com <code>npm init -y</code> e instale os pacotes <code>express</code> e <code>cors</code>.', pasta: `mkdir api
cd api`, inicio: ``, teste: `ls
ls node_modules
cat package.json`, saida: 'node_modules  package-lock.json  package.json\ncors  express\n{\n  "name": "api",\n  "version": "1.0.0",\n  "description": "",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "ISC",\n  "dependencies": {\n    "cors": "^2.8.5",\n    "express": "^4.21.2"\n  }\n}', dicas: ['npm init -y', 'npm install express cors (dá para instalar vários de uma vez)'], sol: `npm init -y
npm install express cors` }
            ]
          },
          {
            id: 'git-14', titulo: 'Variáveis de ambiente', icone: '🔑',
            licao: [
              { titulo: 'Configuração fora do código', texto: `<p>O mesmo código roda no seu PC e no servidor, mas com configurações diferentes (porta, endereço do banco, segredos). Elas ficam em <b>variáveis de ambiente</b>:</p><ul><li>no seu PC: um arquivo <code>.env</code> lido pelo pacote <code>dotenv</code></li><li>no servidor: cadastradas no painel da hospedagem (Render, Railway, Vercel...)</li></ul><p>E o <code>.env</code> vai no <code>.gitignore</code>. Uma boa prática é ter um <code>.env.example</code> no Git, com os nomes das variáveis mas <b>sem os valores</b>, para quem clonar saber o que preencher.</p>`, codigo: `mkdir app && cd app
echo "PORT=4000" > .env
echo "SEGREDO=abc123" >> .env
echo 'require("dotenv").config(); console.log("porta", process.env.PORT); console.log("tem segredo?", Boolean(process.env.SEGREDO));' > server.js
node server.js` }
            ],
            ex: [
              { tipo: 'quiz', p: 'O que deve ir para o GitHub?', op: ['.env', '.env.example (só os nomes das variáveis)', 'node_modules', 'As senhas, num arquivo zip'], c: 1, exp: 'O exemplo ajuda quem clona; os valores reais ficam só no .env local e no painel da hospedagem.' },
              { tipo: 'codigo', p: 'Prepare as configurações do projeto:<ol><li>crie o <code>.env</code> com duas linhas: <code>PORT=3000</code> e <code>MONGODB_URI=mongodb://localhost/salao</code></li><li>crie o <code>.env.example</code> com os mesmos nomes, mas vazios: <code>PORT=</code> e <code>MONGODB_URI=</code></li><li>coloque o <code>.env</code> no <code>.gitignore</code></li><li>rode <code>node server.js</code> para conferir</li></ol>', pasta: `mkdir api && cd api
git init
echo 'require("dotenv").config(); console.log("Porta:", process.env.PORT); console.log("Banco configurado:", Boolean(process.env.MONGODB_URI));' > server.js`, inicio: ``, teste: `node server.js
cat .env.example
git status -s`, saida: 'Porta: 3000\nBanco configurado: true\nPORT=\nMONGODB_URI=\n?? .env.example\n?? .gitignore\n?? server.js', dicas: ['echo "PORT=3000" > .env e echo "MONGODB_URI=mongodb://localhost/salao" >> .env', 'echo "PORT=" > .env.example e echo "MONGODB_URI=" >> .env.example', 'echo ".env" > .gitignore e node server.js'], sol: `echo "PORT=3000" > .env
echo "MONGODB_URI=mongodb://localhost/salao" >> .env
echo "PORT=" > .env.example
echo "MONGODB_URI=" >> .env.example
echo ".env" > .gitignore
node server.js` }
            ]
          },
          {
            id: 'git-15', titulo: 'Colocando no ar', icone: '🚀',
            licao: [
              { titulo: 'O que é deploy', texto: `<p><b>Deploy</b> é colocar o projeto num computador que fica ligado o tempo todo, com um endereço na internet. Os tipos mais comuns:</p><ul><li><b>Site estático</b> (HTML, CSS, JS, React depois do build): GitHub Pages, Netlify, Vercel. Grátis e simples</li><li><b>Servidor</b> (Node/Express, com banco): Render, Railway, Fly.io. Eles rodam <code>npm install</code> e <code>npm start</code></li><li><b>Banco de dados</b>: MongoDB Atlas, Supabase, Neon (todos com plano grátis)</li></ul><p>O jeito moderno: você liga a hospedagem ao repositório do GitHub. A cada <code>git push</code>, ela publica a versão nova sozinha (<b>deploy automático</b>).</p>` },
              { titulo: 'O checklist do deploy', texto: `<ol><li>o projeto roda no seu PC com <code>npm install</code> + <code>npm start</code></li><li>a porta vem de <code>process.env.PORT</code> (a hospedagem escolhe a porta)</li><li>os segredos estão em variáveis de ambiente (não no código)</li><li><code>.env</code> e <code>node_modules</code> no <code>.gitignore</code></li><li>o código está no GitHub</li><li>na hospedagem: conectar o repositório, informar o comando de start e cadastrar as variáveis</li><li>para React: o comando de build é <code>npm run build</code> e a pasta publicada é <code>dist</code></li></ol><p>Foi exatamente esse o caminho para colocar o CodeQuest no ar! 😉</p>` }
            ],
            ex: [
              { tipo: 'quiz', p: 'Seu servidor funciona no PC, mas no Render dá erro de porta. O que provavelmente falta?', op: ['Usar a porta 80 fixa', 'Usar process.env.PORT || 3000', 'Apagar o package.json', 'Usar outra versão do Git'], c: 1, exp: 'A hospedagem define a porta numa variável de ambiente.' },
              { tipo: 'quiz', p: 'Onde publicar um site feito só com HTML, CSS e JavaScript?', op: ['Só num servidor pago', 'Numa hospedagem de sites estáticos, como GitHub Pages, Netlify ou Vercel', 'No MongoDB Atlas', 'Não dá para publicar'], c: 1, exp: 'Sites estáticos são simples de publicar e costumam ser grátis.' },
              { tipo: 'quiz', p: 'O que é "deploy automático"?', op: ['O site se programa sozinho', 'A hospedagem publica a versão nova sempre que você faz git push', 'Backup diário', 'Um tipo de banco'], c: 1, exp: 'A hospedagem fica "ouvindo" o repositório do GitHub.' },
              { tipo: 'montar', p: 'Coloque em ordem o caminho de uma melhoria, do seu PC até o site no ar.', linhas: ['editar o código no VS Code', 'testar no PC com npm start', 'git add .', 'git commit -m "Melhora a agenda"', 'git push', 'a hospedagem publica sozinha'], exp: 'Editar, testar, registrar (add/commit), enviar (push) e o deploy automático faz o resto.' }
            ]
          },
          {
            id: 'git-16', titulo: 'Chefão: do zero ao GitHub', icone: '👑', xp: 80,
            licao: [
              { titulo: 'O ciclo completo', texto: `<p>Você vai fazer o caminho inteiro de um projeto Node: criar, configurar o npm, proteger os segredos, versionar com Git, trabalhar numa branch e publicar no GitHub. Depois disso, é só ligar o repositório numa hospedagem e o projeto está no ar.</p><p>Dica: escreva os comandos aos poucos e use o botão <b>Executar</b> para ver o terminal.</p>` }
            ],
            ex: [
              { tipo: 'codigo', p: 'A partir da pasta <code>~/projeto</code> vazia:<ol><li>crie a pasta <code>agenda-api</code> e entre</li><li><code>npm init -y</code> e instale o <code>express</code></li><li>crie o <code>server.js</code> com: <code>console.log("API no ar")</code></li><li>crie o <code>.env</code> com <code>PORT=3000</code> e um <code>.gitignore</code> com <code>node_modules/</code> e <code>.env</code></li><li><code>git init</code>, adicione tudo e faça o commit <code>Projeto inicial</code></li><li>crie a branch <code>rotas</code>, acrescente no <code>server.js</code> a linha <code>console.log("Rotas prontas")</code>, commit <code>Adiciona rotas</code>, volte para a main e faça o merge</li><li>crie o repositório <code>agenda-api</code> no GitHub (<code>gh repo create</code>), ligue como origin (<code>https://github.com/aluno/agenda-api.git</code>) e envie a main com <code>-u</code></li></ol>', inicio: ``, teste: `cd ~/projeto/agenda-api
node server.js
git log --format=%s
git status
cd ~/projeto
git clone https://github.com/aluno/agenda-api.git conferindo
ls -a conferindo`, saida: "API no ar\nRotas prontas\nAdiciona rotas\nProjeto inicial\nOn branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean\nCloning into 'conferindo'...\n.  ..  .git  .gitignore  package-lock.json  package.json  server.js", dicas: ['mkdir agenda-api, cd agenda-api, npm init -y, npm install express', 'echo \'console.log("API no ar")\' > server.js (aspas simples por fora, duplas por dentro); echo "PORT=3000" > .env; echo "node_modules/" > .gitignore; echo ".env" >> .gitignore', 'git init, git add ., git commit -m "Projeto inicial"; git switch -c rotas; echo \'console.log("Rotas prontas")\' >> server.js; git commit -am "Adiciona rotas"; git switch main; git merge rotas', 'gh repo create agenda-api; git remote add origin https://github.com/aluno/agenda-api.git; git push -u origin main'], sol: `mkdir agenda-api
cd agenda-api
npm init -y
npm install express
echo 'console.log("API no ar")' > server.js
echo "PORT=3000" > .env
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
git init
git add .
git commit -m "Projeto inicial"
git switch -c rotas
echo 'console.log("Rotas prontas")' >> server.js
git commit -am "Adiciona rotas"
git switch main
git merge rotas
gh repo create agenda-api
git remote add origin https://github.com/aluno/agenda-api.git
git push -u origin main` }
            ]
          }
        ]
      }
    ]
  };
})();
