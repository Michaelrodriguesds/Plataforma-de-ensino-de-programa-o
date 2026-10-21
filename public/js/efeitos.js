// =============================================================
// efeitos.js — sons curtinhos, chuva de estrelas e avisos (toasts).
// Os sons são gerados na hora pelo navegador (sem arquivos de áudio).
// =============================================================
(function () {
  var ctx = null;
  function somLigado() { try { return localStorage.getItem('cq_som') !== 'off'; } catch (e) { return true; } }
  function tocar(notas, tipo) {
    if (!somLigado()) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime;
      notas.forEach(function (n, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = tipo || 'triangle';
        o.frequency.value = n;
        g.gain.setValueAtTime(0.0001, t + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.09 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.25);
      });
    } catch (e) { /* sem som, tudo bem */ }
  }
  var sons = {
    certo: function () { tocar([660, 990]); },
    erro: function () { tocar([220, 180], 'sawtooth'); },
    fase: function () { tocar([523, 659, 784, 1046]); },
    clique: function () { tocar([440]); }
  };

  // Chuva de estrelas no fim da fase (respeita quem prefere menos movimento)
  function comemorar() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas');
    c.className = 'confete';
    document.body.appendChild(c);
    var w = c.width = innerWidth * devicePixelRatio, h = c.height = innerHeight * devicePixelRatio;
    var g = c.getContext('2d');
    var cores = ['#FFD447', '#3DDC97', '#5B9BFF', '#FF8A4C', '#F2C94C', '#ECEAFF'];
    var p = [];
    for (var i = 0; i < 90; i++) {
      p.push({ x: w / 2, y: h * 0.35, vx: (Math.random() - 0.5) * 22 * devicePixelRatio, vy: (-Math.random() * 18 - 6) * devicePixelRatio, r: (Math.random() * 5 + 3) * devicePixelRatio, c: cores[i % cores.length], a: Math.random() * 6 });
    }
    var inicio = performance.now();
    (function quadro(agora) {
      var dt = agora - inicio;
      g.clearRect(0, 0, w, h);
      p.forEach(function (q) {
        q.vy += 0.6 * devicePixelRatio; q.x += q.vx; q.y += q.vy; q.a += 0.2;
        g.save(); g.translate(q.x, q.y); g.rotate(q.a); g.fillStyle = q.c;
        estrela(g, q.r); g.restore();
      });
      if (dt < 2200) requestAnimationFrame(quadro); else c.remove();
    })(inicio);
  }
  function estrela(g, r) {
    g.beginPath();
    for (var i = 0; i < 10; i++) {
      var ang = i * Math.PI / 5, rr = i % 2 ? r / 2.2 : r;
      g.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    g.closePath(); g.fill();
  }

  function aviso(texto, tipo) {
    var box = document.getElementById('toasts');
    var d = document.createElement('div');
    d.className = 'toast ' + (tipo || '');
    d.innerHTML = texto;
    box.appendChild(d);
    setTimeout(function () { d.classList.add('sai'); }, 3200);
    setTimeout(function () { d.remove(); }, 3700);
  }

  window.cqEfeitos = { sons: sons, comemorar: comemorar, aviso: aviso, somLigado: somLigado };
})();
