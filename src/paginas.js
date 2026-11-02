// =============================================================
// paginas.js — o "site público" do CodeQuest (sem login).
//
// Por que existe: o Google (e o AdSense) só enxerga o que está aberto.
// Se todas as aulas ficassem atrás do cadastro, o robô do Google veria
// uma tela de login vazia, o AdSense recusaria o site e ninguém acharia
// as aulas pela busca. Aqui cada lição vira uma página de verdade:
//   /                       página inicial
//   /aprender               todas as trilhas
//   /aprender/python        trilha com todas as fases
//   /aprender/python/py-01  a lição completa (texto + exemplos + teste rápido)
//   /sobre /privacidade /termos
// Os exercícios interativos continuam no app (/app).
// =============================================================

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tirarTags = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function criarPaginas({ cursos, config }) {
  const ORDEM = ['python', 'javascript', 'java', 'htmlcss', 'react', 'backend', 'sql', 'git'].filter(id => cursos[id]);
  const FULLSTACK = ['htmlcss', 'javascript', 'react', 'backend', 'sql', 'git'].filter(id => cursos[id]);
  const listaFases = id => cursos[id].mundos.flatMap(m => m.fases);
  const totalFases = ORDEM.reduce((t, id) => t + listaFases(id).length, 0);
  const totalEx = ORDEM.reduce((t, id) => t + listaFases(id).reduce((s, f) => s + (f.ex || []).length, 0), 0);
  const ano = new Date().getFullYear();

  // Bloco de anúncio: um espaço reservado; o JavaScript da página coloca o anúncio do Google
  const anuncio = () => '<div class="anuncio-slot" aria-hidden="true"></div>';

  function layout(req, { titulo, descricao, corpo, caminho, jsonLd, semAnuncio, semIndice, classe }) {
    const base = config.siteUrl(req);
    const tituloCompleto = titulo ? `${titulo} | CodeQuest` : 'CodeQuest — aprenda programação de graça, jogando';
    return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(tituloCompleto)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${esc(base + caminho)}">
${semIndice ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(tituloCompleto)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${esc(base + caminho)}">
<meta property="og:image" content="${esc(base)}/icones/icone-512.png">
<meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="#17153B">
${config.verificacaoGoogle ? `<meta name="google-site-verification" content="${esc(config.verificacaoGoogle)}">` : ''}
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icones/icone.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icones/icone-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Baloo+2:wght@500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/estilo.css">
${config.scriptConfig(semAnuncio)}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body class="pub${classe ? ' ' + classe : ''}">
<header class="pub-topo">
  <a href="/" class="marca">Code<span>Quest</span></a>
  <nav aria-label="Site">
    <a href="/aprender">Aulas</a>
    <a href="/app#/entrar" class="pub-entrar">Entrar</a>
    <a href="/app#/cadastro" class="btn">Praticar grátis</a>
  </nav>
</header>
<main class="pub-main">
${corpo}
</main>
<footer class="pub-rodape">
  <nav aria-label="Institucional"><a href="/sobre">Sobre e contato</a><a href="/privacidade">Privacidade</a><a href="/termos">Termos de uso</a><a href="/aprender">Todas as aulas</a><a href="/app#/sugestao">💬 Sugestões</a></nav>
  <p>CodeQuest © ${ano}. Gratuito para sempre: o site é mantido por anúncios.</p>
</footer>
<div id="toasts" aria-live="assertive"></div>
<script src="/js/realce.js"></script>
<script src="/js/consentimento.js"></script>
<script src="/js/anuncios.js"></script>
<script src="/js/rastreio.js"></script>
<script src="/js/publico.js"></script>
</body>
</html>`;
  }

  const blocoCodigo = (codigo, ling) => `<pre class="codigo" data-ling="${esc(ling)}"><code>${esc(codigo)}</code></pre>`;

  // ---------- Página inicial ----------
  function inicio(req) {
    const corpo = `
<section class="pub-capa">
  <h1>Aprenda a programar de graça, jogando.</h1>
  <p class="pub-sub">Python, JavaScript e Java do primeiro <code>print</code> até Orientação a Objetos, e a <b>carreira Full Stack</b> completa: HTML, CSS, React, Node.js, SQL, Git e deploy. Em português, com lições curtas, exercícios de verdade e uma fase por dia no celular ou no computador.</p>
  <div class="pub-cta">
    <a class="btn btn-grande" href="/app#/cadastro">Começar grátis</a>
    <a class="btn btn-sec btn-grande" href="/aprender">Ver as aulas</a>
  </div>
  <p class="pub-continuar" hidden><a href="/app#/">Você já tem conta neste aparelho: continuar de onde parou ›</a></p>
  <ul class="pub-numeros">
    <li><b>${ORDEM.length}</b> trilhas</li><li><b>${totalFases}</b> fases</li><li><b>${totalEx}</b> exercícios</li><li><b>R$ 0</b> para sempre</li>
  </ul>
</section>

${FULLSTACK.length > 1 ? `<section class="pub-secao">
  <h2>🚀 Carreira Full Stack</h2>
  <p class="pub-sub">O caminho completo para criar sites e sistemas: a tela, o servidor, o banco de dados e a publicação. Siga nesta ordem:</p>
  <ol class="pub-fs">${FULLSTACK.map(id => `<li style="--cor:${cursos[id].cor}"><a href="/aprender/${id}">${cursos[id].icone} ${esc(cursos[id].nome)}</a><small>${listaFases(id).length} aulas</small></li>`).join('')}</ol>
</section>` : ''}

<section class="pub-secao">
  <h2>Escolha sua trilha</h2>
  <div class="cursos pub-cursos">
  ${ORDEM.map(id => {
    const c = cursos[id];
    return `<article class="cartao-curso" style="--cor:${c.cor}">
      <div class="cc-topo"><span class="cc-icone">${c.icone}</span><div><h3>${esc(c.nome)}</h3><p>${esc(c.desc)}</p></div></div>
      <ul class="pub-mundos">${c.mundos.map(m => `<li>${esc(m.titulo)}</li>`).join('')}</ul>
      <div class="cc-acoes"><a class="btn" href="/aprender/${id}">Ver aulas de ${esc(c.nome)}</a></div>
    </article>`;
  }).join('')}
  </div>
</section>

${anuncio()}

<section class="pub-secao pub-como">
  <h2>Como funciona</h2>
  <ol>
    <li><b>Leia uma lição curta</b>, com exemplos do dia a dia (caixas com etiqueta, receitas, forma de bolo).</li>
    <li><b>Adivinhe o que o código faz</b> antes de rodar. Prever e conferir é um dos jeitos mais eficientes de aprender a ler código.</li>
    <li><b>Monte, complete e escreva</b> programas que rodam de verdade no seu navegador, com dicas que vão do leve ao detalhado.</li>
    <li><b>Volte amanhã.</b> A revisão traz de volta o que você estudou no momento em que você estaria esquecendo.</li>
  </ol>
</section>

<section class="pub-secao pub-faq">
  <h2>Perguntas frequentes</h2>
  <details><summary>É grátis mesmo?</summary><p>Sim. Todas as fases, exercícios e o ranking são gratuitos. O site se mantém com anúncios exibidos fora dos exercícios.</p></details>
  <details><summary>Tem certificado?</summary><p>Sim. Ao concluir todas as fases de uma trilha e passar na prova final (70% de acertos), você recebe um certificado de conclusão com a carga horária estimada, as habilidades trabalhadas e um código para qualquer pessoa conferir. Ele é ilustrativo: o CodeQuest não é reconhecido pelo MEC, então o certificado não vale como diploma. Mas mostra o que você estudou, e o seu código no GitHub mostra o que você sabe fazer.</p></details>
  <details><summary>Preciso instalar alguma coisa?</summary><p>Não. Tudo roda no navegador: o Python, o banco de dados SQL, o servidor Node, o React e até um terminal com Git de treino. No celular você pode tocar em "Adicionar à tela inicial" para usar como aplicativo.</p></details>
  <details><summary>Nunca programei. Consigo?</summary><p>Consegue. A primeira fase começa do zero absoluto: mostrar uma mensagem na tela.</p></details>
  <details><summary>Por que criar conta?</summary><p>Para salvar seu progresso, suas estrelas e sua ofensiva, receber a revisão do dia e aparecer no ranking. As aulas para leitura são abertas para todos.</p></details>
</section>`;
    return layout(req, {
      caminho: '/', corpo,
      descricao: `Aprenda programação de graça, em português: Python, JavaScript, Java e a carreira Full Stack (HTML, CSS, React, Node.js, SQL e Git), com ${totalFases} fases gamificadas e exercícios de código.`,
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'CodeQuest', inLanguage: 'pt-BR', url: config.siteUrl(req) + '/' }
    });
  }

  // ---------- Lista de trilhas ----------
  function aprender(req) {
    const corpo = `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> › Aulas</nav>
<h1>Aulas de programação grátis</h1>
<p class="pub-sub">Todas as lições abertas para ler. Para fazer os exercícios interativos e salvar seu progresso, <a href="/app#/cadastro">crie sua conta grátis</a>.</p>
${ORDEM.map(id => {
  const c = cursos[id];
  let n = 0;
  return `<section class="pub-trilha" style="--cor:${c.cor}"><h2><a href="/aprender/${id}">${c.icone} ${esc(c.nome)}</a></h2>
  ${c.mundos.map(m => `<h3>${esc(m.titulo)}</h3><ol class="pub-lista-fases" start="${n + 1}">${m.fases.map(f => { n++; return `<li><a href="/aprender/${id}/${f.id}">${esc(f.titulo)}</a></li>`; }).join('')}</ol>`).join('')}
  </section>`;
}).join(anuncio())}`;
    return layout(req, { caminho: '/aprender', titulo: 'Aulas de programação grátis', descricao: `Lista completa de ${totalFases} aulas gratuitas de programação em português: Python, JavaScript, Java, HTML e CSS, React, Node.js, SQL e Git, do básico à Orientação a Objetos.`, corpo });
  }

  // ---------- Uma trilha ----------
  function trilha(req, id) {
    const c = cursos[id];
    if (!c) return null;
    let n = 0;
    const corpo = `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> › <a href="/aprender">Aulas</a> › ${esc(c.nome)}</nav>
<section class="pub-trilha-cab" style="--cor:${c.cor}"><span class="cc-icone">${c.icone}</span><div><h1>Curso de ${esc(c.nome)} grátis</h1><p>${esc(c.desc)}</p></div></section>
<p class="pub-sub">${listaFases(id).length} fases em ${c.mundos.length} mundos. Leia aqui e pratique no app.</p>
<div class="pub-cta"><a class="btn" href="/app#/fase/${listaFases(id)[0].id}">Começar a praticar ${esc(c.nome)}</a></div>
${c.mundos.map((m, mi) => `
<section class="mundo-cab pub-mundo" style="--cor:${c.cor}">
  <span class="mundo-num">Mundo ${mi + 1}${m.poo ? ' · Orientação a Objetos' : ''}</span>
  <h2>${esc(m.titulo)}</h2><p>${esc(m.desc)}</p>
  <ol class="pub-lista-fases" start="${n + 1}">${m.fases.map(f => { n++; const resumo = f.licao && f.licao[0] ? tirarTags(f.licao[0].texto).slice(0, 110) + '…' : ''; return `<li><a href="/aprender/${id}/${f.id}"><b>${f.icone} ${esc(f.titulo)}</b><span>${esc(resumo)}</span></a></li>`; }).join('')}</ol>
</section>${mi === 1 ? anuncio() : ''}`).join('')}`;
    return layout(req, {
      caminho: '/aprender/' + id, titulo: `Curso de ${c.nome} grátis em português`, corpo,
      descricao: `Curso gratuito de ${c.nome} em português: ${listaFases(id).length} aulas com exemplos e exercícios práticos, do zero ao avançado.`,
      jsonLd: { '@context': 'https://schema.org', '@type': 'Course', name: `Curso de ${c.nome}`, description: c.desc, inLanguage: 'pt-BR', isAccessibleForFree: true, provider: { '@type': 'Organization', name: 'CodeQuest' } }
    });
  }

  // ---------- Uma lição ----------
  function licao(req, cursoId, faseId) {
    const c = cursos[cursoId];
    if (!c) return null;
    const fases = listaFases(cursoId);
    const i = fases.findIndex(f => f.id === faseId);
    if (i < 0) return null;
    const f = fases[i], ant = fases[i - 1], prox = fases[i + 1];
    const ling = c.ling;
    const cartoes = (f.licao || []).map((card, k) => `
<section class="pub-cartao">
  <h2>${esc(card.titulo)}</h2>
  <div class="texto">${card.texto}</div>
  ${card.codigo ? blocoCodigo(card.codigo, ling) : ''}
  ${card.entrada ? `<p class="entrada-info">Se a pessoa digitar: <code>${esc(card.entrada).replace(/\n/g, ' ⏎ ')}</code></p>` : ''}
</section>${k === 0 && (f.licao || []).length > 1 ? anuncio() : ''}`).join('');

    const perguntas = (f.ex || []).filter(e => e.tipo === 'quiz' || e.tipo === 'prever');
    const teste = perguntas.length ? `
<section class="pub-cartao pub-teste">
  <h2>Teste rápido</h2>
  <p>Tente responder antes de abrir a resposta.</p>
  ${perguntas.map((e, k) => `<div class="pub-pergunta">
    <p><b>${k + 1}.</b> ${e.tipo === 'prever' ? (e.p ? e.p : 'O que este código mostra na tela?') : e.p}</p>
    ${e.codigo ? blocoCodigo(e.codigo, ling) : ''}
    ${e.entrada ? `<p class="entrada-info">Entrada digitada: <code>${esc(e.entrada).replace(/\n/g, ' ⏎ ')}</code></p>` : ''}
    <ul>${e.op.map(o => `<li><code>${esc(o).replace(/\n/g, '<br>')}</code></li>`).join('')}</ul>
    <details><summary>Ver resposta</summary><p><b>Resposta:</b> <code>${esc(e.op[e.c]).replace(/\n/g, '<br>')}</code></p><p>${esc(e.exp || '')}</p></details>
  </div>`).join('')}
</section>` : '';

    const desafios = (f.ex || []).filter(e => e.tipo === 'codigo');
    const praticar = `
<section class="pub-praticar" style="--cor:${c.cor}">
  <h2>Agora é com você</h2>
  ${desafios.length ? `<p>Esta fase tem ${desafios.length} desafio${desafios.length > 1 ? 's' : ''} de código, como:</p><div class="pub-desafio">${desafios[0].p}</div>` : ''}
  <p>No app você escreve e roda o código, recebe dicas quando trava, ganha estrelas e a revisão traz esta aula de volta na hora certa.</p>
  <a class="btn btn-grande" href="/app#/fase/${f.id}">Praticar esta fase grátis</a>
</section>`;

    const corpo = `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> › <a href="/aprender">Aulas</a> › <a href="/aprender/${cursoId}">${esc(c.nome)}</a> › Fase ${i + 1}</nav>
<article class="pub-licao" style="--cor:${c.cor}">
  <p class="selo">${c.icone} ${esc(c.nome)} · Fase ${i + 1} de ${fases.length}</p>
  <h1>${esc(f.titulo)}</h1>
  ${cartoes}
  ${teste}
  ${praticar}
</article>
${anuncio()}
<nav class="pub-navfases" aria-label="Outras fases">
  ${ant ? `<a href="/aprender/${cursoId}/${ant.id}">‹ ${esc(ant.titulo)}</a>` : '<span></span>'}
  ${prox ? `<a href="/aprender/${cursoId}/${prox.id}">${esc(prox.titulo)} ›</a>` : '<span></span>'}
</nav>`;
    const desc = tirarTags((f.licao && f.licao[0] && f.licao[0].texto) || '').slice(0, 150);
    return layout(req, { caminho: `/aprender/${cursoId}/${f.id}`, titulo: `${f.titulo} — aula de ${c.nome}`, descricao: `Aula grátis de ${c.nome}: ${f.titulo}. ${desc}`, corpo });
  }

  // ---------- Institucionais ----------
  const contato = () => config.contato ? `<a href="mailto:${esc(config.contato)}">${esc(config.contato)}</a>` : '<i>(defina CONTATO_EMAIL no .env)</i>';

  function sobre(req) {
    return layout(req, {
      caminho: '/sobre', titulo: 'Sobre e contato', descricao: 'O que é o CodeQuest, quem mantém e como falar com a gente.', corpo: `
<article class="pub-texto">
<h1>Sobre o CodeQuest</h1>
<p>O CodeQuest é uma plataforma <b>gratuita</b> para aprender e praticar programação em português. Nasceu da vontade de estudar Python, JavaScript e Java de um jeito que coubesse na rotina de quem trabalha: lições curtas, exercícios de verdade e um pouquinho todo dia.</p>
<p>Não vendemos cursos. Quem conclui uma trilha e passa na prova final recebe um certificado de conclusão ilustrativo, grátis, com a carga horária estimada e um código de verificação. Ele não é reconhecido pelo MEC. O site é mantido por anúncios do Google exibidos fora dos exercícios.</p>
<h2>Como as aulas foram pensadas</h2>
<ul>
<li><b>Prever, rodar, modificar e criar</b>: você lê o código, tenta adivinhar o resultado, roda para conferir e depois escreve o seu.</li>
<li><b>Montar código</b> com linhas embaralhadas, que ensina estrutura com menos frustração do que começar do zero.</li>
<li><b>Dicas graduais</b>: da mais leve à mais detalhada, para você travar o mínimo possível.</li>
<li><b>Revisão espaçada</b>: o que você estudou volta depois de 1, 3, 7, 14, 30 e 60 dias.</li>
</ul>
<h2>Contato</h2>
<p>Dúvidas, sugestões, erros nas aulas ou pedidos sobre seus dados: ${contato()}.</p>
</article>` });
  }

  function privacidade(req) {
    return layout(req, {
      caminho: '/privacidade', titulo: 'Política de privacidade', descricao: 'Quais dados o CodeQuest coleta, como usa, cookies, anúncios do Google e seus direitos pela LGPD.', semAnuncio: true, corpo: `
<article class="pub-texto">
<h1>Política de privacidade</h1>
<p><i>Última atualização: ${esc(config.dataPolitica)}</i></p>
<p>Esta política explica quais dados o CodeQuest coleta, para que usa e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

<h2>1. Dados que coletamos</h2>
<ul>
<li><b>Conta:</b> nome, nome de usuário, avatar e senha. A senha é guardada de forma criptografada (nem nós conseguimos ler).</li>
<li><b>Progresso de estudo:</b> fases concluídas, estrelas, pontos (XP), ofensiva, respostas da revisão e data de cadastro.</li>
<li><b>Estatísticas de uso:</b> quais páginas foram abertas e em que dia, ligadas a um código aleatório guardado no seu navegador. Esse código não contém seu nome, e-mail ou endereço IP; serve só para contar visitantes únicos.</li>
<li><b>Código enviado:</b> os programas em Java que você executa são enviados ao servidor apenas para serem compilados e rodados, e apagados logo em seguida. Todo o resto (Python, JavaScript, HTML e CSS, SQL, React, o Node.js de treino e o terminal com Git) roda no seu próprio aparelho e não é enviado a ninguém.</li>
</ul>
<p>Não pedimos CPF, endereço, telefone ou dados de pagamento.</p>

<h2>2. Para que usamos</h2>
<ul><li>Salvar seu progresso e mostrar o ranking (nome, usuário, avatar e XP aparecem para outros usuários no ranking).</li><li>Medir quantas pessoas usam a plataforma e melhorar as aulas.</li><li>Exibir anúncios que mantêm o site gratuito.</li></ul>

<h2>3. Cookies e armazenamento local</h2>
<p>Usamos o armazenamento do navegador para manter você conectado, guardar rascunhos de código, suas preferências e o código aleatório de estatísticas.</p>

<h2>4. Anúncios do Google (AdSense)</h2>
<p>Este site exibe anúncios do Google AdSense. Fornecedores terceiros, incluindo o Google, usam cookies para exibir anúncios com base em visitas anteriores do usuário a este e a outros sites. O uso de cookies de publicidade permite que o Google e seus parceiros exibam anúncios com base nas visitas a este site e/ou a outros sites na Internet.</p>
<p>Você pode desativar a publicidade personalizada nas <a href="https://www.google.com/settings/ads" rel="noopener">Configurações de anúncios do Google</a> e saber mais em <a href="https://policies.google.com/technologies/ads" rel="noopener">Como o Google usa cookies em publicidade</a>. Se você escolher "Só o essencial" no aviso de cookies deste site, pedimos ao Google anúncios não personalizados.</p>
${config.ga ? '<p>Também usamos o Google Analytics para estatísticas de visitas, apenas se você aceitar os cookies.</p>' : ''}

<h2>5. Compartilhamento</h2>
<p>Não vendemos seus dados. Eles ficam armazenados nos serviços de hospedagem e banco de dados usados pelo site, e as informações de anúncios são tratadas pelo Google conforme a política dele.</p>

<h2>6. Seus direitos</h2>
<p>Você pode, a qualquer momento: ver seus dados no seu perfil, corrigir nome e avatar, e <b>excluir sua conta</b> pelo botão "Excluir minha conta" no perfil, o que apaga seu cadastro e progresso. Para outros pedidos, fale com a gente: ${contato()}.</p>

<h2>7. Crianças e adolescentes</h2>
<p>Menores de 18 anos devem usar o CodeQuest com conhecimento e autorização dos pais ou responsáveis.</p>

<h2>8. Mudanças</h2>
<p>Se esta política mudar, a data no topo será atualizada.</p>
</article>` });
  }

  function termos(req) {
    return layout(req, {
      caminho: '/termos', titulo: 'Termos de uso', descricao: 'Regras de uso do CodeQuest.', semAnuncio: true, corpo: `
<article class="pub-texto">
<h1>Termos de uso</h1>
<p><i>Última atualização: ${esc(config.dataPolitica)}</i></p>
<ol>
<li><b>Serviço gratuito.</b> O CodeQuest é oferecido de graça, "como está", para fins de estudo. Os certificados de conclusão são ilustrativos: não têm reconhecimento do MEC nem valor de diploma, e a carga horária é uma estimativa. Um certificado pode ser cancelado se for obtido de forma fraudulenta. O serviço pode mudar, ficar fora do ar ou ser encerrado.</li>
<li><b>Sua conta.</b> Você é responsável pela sua senha. Escolha um nome e um nome de usuário respeitosos: eles aparecem no ranking.</li>
<li><b>Uso correto.</b> É proibido tentar invadir, sobrecarregar ou burlar o sistema (inclusive o ranking), enviar código malicioso para o executor de Java ou usar a plataforma para qualquer atividade ilegal. Contas que fizerem isso podem ser removidas.</li>
<li><b>Conteúdo.</b> As aulas e exercícios são do CodeQuest. Você pode usá-los para estudar; para republicar, peça autorização.</li>
<li><b>Anúncios.</b> O site exibe anúncios de terceiros. Não somos responsáveis pelos produtos anunciados.</li>
<li><b>Privacidade.</b> O tratamento dos seus dados está descrito na <a href="/privacidade">Política de privacidade</a>.</li>
<li><b>Contato:</b> ${contato()}.</li>
</ol>
</article>` });
  }

  function naoEncontrada(req) {
    return layout(req, { caminho: req.path, titulo: 'Página não encontrada', descricao: 'Página não encontrada.', semAnuncio: true, corpo: `
<section class="vazio-grande"><span class="ico-grande">🔭</span><h1>Essa página não existe</h1><p>Talvez o endereço tenha mudado.</p><a class="btn btn-grande" href="/aprender">Ver todas as aulas</a></section>` });
  }

  function sitemap(req) {
    const base = config.siteUrl(req);
    const urls = ['/', '/aprender', '/sobre', '/privacidade', '/termos'];
    ORDEM.forEach(id => { urls.push('/aprender/' + id); listaFases(id).forEach(f => urls.push(`/aprender/${id}/${f.id}`)); });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${esc(base + u)}</loc></url>`).join('\n')}\n</urlset>\n`;
  }

  // ---------- Certificado de conclusão (ilustrativo) ----------
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function certificado(req, cert, curso) {
    const base = config.siteUrl(req);
    const d = new Date(cert.em);
    const dataExtenso = `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
    const url = `${base}/certificado/${cert.codigo}`;
    const linkedin = 'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&' + new URLSearchParams({
      name: `${curso.nome} (CodeQuest)`, organizationName: 'CodeQuest', issueYear: String(d.getFullYear()), issueMonth: String(d.getMonth() + 1), certUrl: url, certId: cert.codigo
    }).toString();
    const whatsapp = 'https://wa.me/?text=' + encodeURIComponent(`Concluí a trilha ${curso.nome} no CodeQuest! 🎓 ${url}`);
    const fases = curso.mundos.reduce((t, m) => t + m.fases.length, 0);
    const corpo = `
<div class="cert-acoes nao-imprimir">
  <button class="btn" type="button" onclick="window.print()">🖨️ Imprimir ou salvar em PDF</button>
  <a class="btn btn-sec" href="${esc(linkedin)}" target="_blank" rel="noopener">Adicionar ao LinkedIn</a>
  <a class="btn btn-sec" href="${esc(whatsapp)}" target="_blank" rel="noopener">Compartilhar no WhatsApp</a>
</div>
<article class="certificado" style="--cor:${esc(curso.cor)}">
  <div class="cert-moldura">
    <header class="cert-topo">
      <span class="cert-marca">Code<b>Quest</b></span>
      <span class="cert-selo" aria-hidden="true">${curso.icone}</span>
    </header>
    <p class="cert-rotulo">Certificado de conclusão</p>
    <p class="cert-texto">Certificamos que</p>
    <h1 class="cert-nome">${esc(cert.nome)}</h1>
    <p class="cert-texto">concluiu a trilha <b>${esc(curso.nome)}</b> na plataforma CodeQuest, com <b>${fases} fases</b> de lições e exercícios práticos, carga horária estimada de <b>${cert.horas} horas</b>, e foi aprovado(a) na prova final com <b>${cert.nota}% de acertos</b>.</p>
    <div class="cert-habilidades">
      <p class="cert-subtitulo">Habilidades trabalhadas</p>
      <ul>${(curso.habilidades || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>
    <footer class="cert-rodape">
      <div><span class="cert-linha"></span><b>CodeQuest</b><small>${esc(dataExtenso)}</small></div>
      <div class="cert-codigo"><small>Código de verificação</small><b>${esc(cert.codigo)}</b><small>${esc(base.replace(/^https?:\/\//, ''))}/certificado/${esc(cert.codigo)}</small></div>
    </footer>
    <p class="cert-aviso">Certificado livre, de caráter ilustrativo, emitido por plataforma de ensino gratuita. Não é reconhecido pelo MEC e não substitui diploma de curso técnico ou superior.</p>
  </div>
</article>
<p class="cert-verificado nao-imprimir">✔ Este certificado é verdadeiro: ele foi emitido pelo CodeQuest para ${esc(cert.nome)} em ${esc(dataExtenso)}. <a href="/aprender/${esc(curso.id)}">Conheça a trilha ${esc(curso.nome)}</a> ou <a href="/app#/cadastro">comece a sua grátis</a>.</p>`;
    return layout(req, {
      caminho: '/certificado/' + cert.codigo, titulo: `Certificado: ${curso.nome} — ${cert.nome}`, corpo, semAnuncio: true, semIndice: true, classe: 'pub-cert',
      descricao: `${cert.nome} concluiu a trilha ${curso.nome} no CodeQuest (${cert.horas} horas, nota ${cert.nota}%).`
    });
  }

  return { inicio, aprender, trilha, licao, sobre, privacidade, termos, naoEncontrada, sitemap, certificado };
}

module.exports = { criarPaginas };
