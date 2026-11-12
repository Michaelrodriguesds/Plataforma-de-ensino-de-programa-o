// Service Worker: guarda os arquivos do site no aparelho para abrir
// mais rápido (e até sem internet nas telas que já foram abertas).
// Ao mudar arquivos do site, aumente a VERSAO para forçar atualização.
const VERSAO = 'cq-v9';
// Os arquivos grandes (sql-wasm.wasm, reactlib.js, linkedom.js) NÃO entram aqui:
// são guardados só quando a pessoa usa aquela trilha (economiza o plano de dados).
const ARQUIVOS = [
  '/app', '/css/estilo.css', '/manifest.webmanifest', '/icones/icone.svg',
  '/js/app.js', '/js/realce.js', '/js/consentimento.js', '/js/anuncios.js', '/js/rastreio.js', '/js/publico.js', '/js/editor.js', '/js/erros.js', '/js/executor.js', '/js/efeitos.js',
  '/js/runtime/montar.js', '/js/runtime/formatar.js', '/js/runtime/jsexec.js', '/js/runtime/pypre.js',
  '/js/runtime/worker-js.js', '/js/runtime/worker-py.js', '/js/runtime/worker-dom.js',
  '/js/runtime/worker-html.js', '/js/runtime/csshelp.js',
  '/js/runtime/worker-sql.js', '/js/runtime/sqlexec.js',
  '/js/runtime/worker-node.js', '/js/runtime/nodesim.js',
  '/js/runtime/worker-react.js', '/js/runtime/reactprep.js',
  '/js/runtime/worker-terminal.js', '/js/runtime/terminal.js',
  '/js/conteudo/javascript.js', '/js/conteudo/python.js', '/js/conteudo/java.js',
  '/js/conteudo/htmlcss-1.js', '/js/conteudo/htmlcss-2.js', '/js/conteudo/react.js',
  '/js/conteudo/backend-1.js', '/js/conteudo/backend-2.js', '/js/conteudo/sql.js', '/js/conteudo/git.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/')) return; // API sempre na rede
  if (url.origin !== location.origin) return; // fontes e Pyodide: cache do próprio navegador
  // Rede primeiro (para pegar atualizações); se falhar, usa o que está guardado
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSAO).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' && url.pathname.startsWith('/app') ? caches.match('/app') : undefined)))
  );
});
