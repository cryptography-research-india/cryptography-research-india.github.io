(function () {
  'use strict';

  var canvas = document.getElementById('crypto-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;
  var particles = [];
  var hexStrings = [];
  var animId;

  var PARTICLE_COUNT = 60;
  var MAX_DIST = 160;
  var HEX_CHARS = '0123456789abcdef';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomHex(len) {
    var s = '0x';
    for (var i = 0; i < len; i++) {
      s += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    }
    return s;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.2
    };
  }

  function createHexString() {
    return {
      x: Math.random() * W,
      y: H + 20,
      text: randomHex(Math.floor(Math.random() * 6) + 4),
      vy: -(Math.random() * 0.6 + 0.3),
      alpha: 0.7,
      size: Math.random() * 3 + 9
    };
  }

  function init() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
    hexStrings = [];
  }

  var frameCount = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    frameCount++;

    // Spawn a new hex string occasionally
    if (frameCount % 140 === 0 && hexStrings.length < 12) {
      hexStrings.push(createHexString());
    }

    // Draw connections between nearby particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          var opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,255,136,' + opacity + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // Draw and update particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Draw node dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      // Alternate between green and cyan for variety
      var col = i % 3 === 0 ? '6,182,212' : '0,255,136';
      ctx.fillStyle = 'rgba(' + col + ',' + (p.alpha * 0.9) + ')';
      ctx.fill();

      // Draw a subtle glow ring on larger particles
      if (p.r > 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + col + ',' + (p.alpha * 0.15) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10)  p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }

    // Draw and update hex strings
    for (var k = hexStrings.length - 1; k >= 0; k--) {
      var h = hexStrings[k];

      ctx.font = 'bold ' + h.size + 'px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0,255,136,' + h.alpha + ')';
      ctx.fillText(h.text, h.x, h.y);

      h.y += h.vy;
      h.alpha -= 0.003;

      if (h.alpha <= 0 || h.y < -30) {
        hexStrings.splice(k, 1);
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    init();
    draw();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      init();
    }, 200);
  });

  // Pause when tab is hidden to save resources
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  start();
})();
