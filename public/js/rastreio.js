// =============================================================
// rastreio.js — conta visitas para o painel do dono.
// Cada aparelho ganha um código aleatório (ex: "a1b2c3...") guardado
// no navegador. Não tem nome, e-mail nem IP: só serve para saber que
// "o mesmo aparelho voltou" e contar visitantes únicos.
// =============================================================
(function () {
  function idVisitante() {
    try {
      var v = localStorage.getItem('cq_vid');
      if (!v) {
        v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
        localStorage.setItem('cq_vid', v);
      }
      return v;
    } catch (e) { return 'sem-armazenamento'; }
  }
  var ultima = null;
  function rastrear(pagina) {
    if (pagina === ultima) return; // evita contar duas vezes a mesma tela seguida
    ultima = pagina;
    var token = null;
    try { token = localStorage.getItem('cq_token'); } catch (e) {}
    var cab = { 'Content-Type': 'application/json' };
    if (token) cab.Authorization = 'Bearer ' + token;
    try {
      fetch('/api/evento', { method: 'POST', headers: cab, body: JSON.stringify({ vid: idVisitante(), pagina: pagina }), keepalive: true }).catch(function () {});
    } catch (e) {}
    if (window.gtag) window.gtag('event', 'page_view', { page_title: pagina, page_location: location.href });
  }
  window.cqRastrear = rastrear;
})();
