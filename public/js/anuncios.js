// =============================================================
// anuncios.js — coloca os anúncios do Google AdSense.
//
// Onde aparecem: só em lugares marcados com <div class="anuncio-slot">,
// que ficam em pontos de PAUSA (página de aula, início, fim de fase,
// ranking). NUNCA dentro dos exercícios, do login ou de telas de erro:
// as regras do AdSense proíbem anúncio em tela sem conteúdo e perto de
// botões que possam causar clique sem querer.
//
// Configuração (no .env do servidor):
//   ADSENSE_CLIENTE=ca-pub-1234567890123456
//   ADSENSE_SLOT=1234567890   (bloco de anúncio "Display" responsivo)
//   ANUNCIOS_DEMO=1           (só para ver os lugares, sem AdSense)
// =============================================================
(function () {
  var scriptPedido = false;

  function carregarScript(cliente) {
    if (scriptPedido) return;
    scriptPedido = true;
    window.adsbygoogle = window.adsbygoogle || [];
    // Sem consentimento para personalização: anúncios não personalizados
    var c = window.cqConsentimento && window.cqConsentimento.estado();
    window.adsbygoogle.requestNonPersonalizedAds = c === 'aceito' ? 0 : 1;
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cliente);
    document.head.appendChild(s);
  }

  // Procura espaços vazios dentro de "raiz" e coloca um anúncio em cada um
  function colocar(raiz) {
    var cfg = window.CQ_CONFIG || {};
    var slots = (raiz || document).querySelectorAll('.anuncio-slot:not([data-pronto])');
    slots.forEach(function (el) {
      el.setAttribute('data-pronto', '1');
      if (cfg.adsense && cfg.adsense.cliente && cfg.adsense.slot) {
        carregarScript(cfg.adsense.cliente);
        el.classList.add('anuncio');
        el.innerHTML = '<span class="anuncio-rotulo">Publicidade</span>' +
          '<ins class="adsbygoogle" style="display:block" data-ad-client="' + cfg.adsense.cliente + '" data-ad-slot="' + cfg.adsense.slot + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* bloqueador de anúncio, tudo bem */ }
      } else if (cfg.adsense && cfg.adsense.cliente) {
        // Só o código do cliente (sem bloco): o AdSense decide sozinho (Anúncios automáticos)
        carregarScript(cfg.adsense.cliente);
        el.remove();
      } else if (cfg.demo) {
        el.classList.add('anuncio', 'anuncio-demo');
        el.innerHTML = '<span class="anuncio-rotulo">Publicidade</span><div>Espaço do anúncio do Google</div>';
      } else {
        el.remove();
      }
    });
  }

  window.cqAnuncios = { colocar: colocar };
})();
