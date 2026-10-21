// Scripts das páginas públicas (aulas abertas)
(function () {
  // Endereços antigos do app (ex: /#/fase/py-01) vão para /app
  if (location.pathname === '/' && /^#\//.test(location.hash)) {
    location.replace('/app' + location.hash);
    return;
  }
  // Pinta os blocos de código
  document.querySelectorAll('pre.codigo[data-ling] code').forEach(function (c) {
    c.innerHTML = window.cqRealcar(c.textContent, c.parentNode.getAttribute('data-ling'));
  });
  // Quem já tem conta neste aparelho vê o atalho para continuar
  try {
    if (localStorage.getItem('cq_token')) {
      var cont = document.querySelector('.pub-continuar');
      if (cont) cont.hidden = false;
      var entrar = document.querySelector('.pub-entrar');
      if (entrar) { entrar.textContent = 'Meu progresso'; entrar.href = '/app#/'; }
    }
  } catch (e) {}
  window.cqAnuncios.colocar(document);
  window.cqRastrear(location.pathname === '/' ? 'site/inicio' : 'site' + location.pathname);
})();
