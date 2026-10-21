// =============================================================
// consentimento.js — aviso de cookies (LGPD).
// "Aceitar"         -> anúncios personalizados + Google Analytics (se configurado)
// "Só o essencial"  -> anúncios NÃO personalizados e sem Analytics
// Para visitantes da Europa, o próprio AdSense mostra a mensagem dele
// (ative em AdSense > Privacidade e mensagens).
// =============================================================
(function () {
  var CHAVE = 'cq_consentimento';
  var ouvintes = [];
  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} ouvintes.forEach(function (f) { f(v); }); }

  // Google Analytics só carrega com consentimento
  function carregarGA() {
    var cfg = window.CQ_CONFIG || {};
    if (!cfg.ga || window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga, { send_page_view: false });
  }

  function mostrarAviso() {
    if (ler() || document.querySelector('.aviso-cookies')) return;
    var cfg = window.CQ_CONFIG || {};
    if (!cfg.adsense && !cfg.ga && !cfg.demo) return; // nada para avisar
    var d = document.createElement('div');
    d.className = 'aviso-cookies';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>O CodeQuest é grátis e se mantém com anúncios. Usamos cookies para mostrar anúncios e medir visitas. ' +
      '<a href="/privacidade">Saiba mais</a></p>' +
      '<div><button type="button" class="btn btn-sec" data-v="essencial">Só o essencial</button>' +
      '<button type="button" class="btn" data-v="aceito">Aceitar</button></div>';
    d.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        gravar(b.dataset.v);
        if (b.dataset.v === 'aceito') carregarGA();
        d.remove();
        document.body.classList.remove('com-aviso');
      };
    });
    document.body.appendChild(d);
    document.body.classList.add('com-aviso'); // dá espaço para rolar o conteúdo acima do aviso
  }

  if (ler() === 'aceito') carregarGA();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrarAviso); else mostrarAviso();

  window.cqConsentimento = {
    estado: ler,
    aoMudar: function (f) { ouvintes.push(f); },
    reabrir: function () { try { localStorage.removeItem(CHAVE); } catch (e) {} mostrarAviso(); }
  };
})();
