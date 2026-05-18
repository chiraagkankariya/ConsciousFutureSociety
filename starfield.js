(function () {
  'use strict';

  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, raf;
  let mx = 0, my = 0, tmx = 0, tmy = 0;

  // ── Layer config — 0 = deep/slow, 2 = near/fast ──
  const DRIFT    = [0.04, 0.10, 0.20];   // px per frame (left → right drift)
  const PAR      = [6,    16,   28];      // max mouse parallax px

  const N_STARS   = 440;
  const GOLD_FRAC = 0.06;

  // ── Canvas resize — hero is always 100vh × 100vw ──
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize(); // must run before makeStar() so W/H are set

  // ── Mouse tracking ──
  document.addEventListener('mousemove', e => {
    tmx = e.clientX / W - 0.5;
    tmy = e.clientY / H - 0.5;
  });

  // ── Star factory ──
  function makeStar(forceX) {
    const layer  = Math.floor(Math.random() * 3);
    const isGold = Math.random() < GOLD_FRAC;
    const rBase  = [0.5, 0.85, 1.35][layer];
    return {
      x:      forceX !== undefined ? forceX : Math.random() * W,
      y:      Math.random() * H,
      layer,
      r:      rBase + Math.random() * rBase * 0.9,
      isGold,
      phase:  Math.random() * Math.PI * 2,
      tSpeed: 0.007 + Math.random() * 0.013,
      bOp:    isGold ? 0.5  + Math.random() * 0.4
                     : 0.25 + Math.random() * 0.5,
      swing:  0.12 + Math.random() * 0.22,
    };
  }

  const stars = Array.from({ length: N_STARS }, () => makeStar());

  // ── Nebulae — 2 deep-blue, 2 warm-amber ──
  const NEBULAE = [
    { fx: 0.22, fy: 0.38, frx: 0.30, fry: 0.20, c: [28,  52, 112], a: 0.20 },
    { fx: 0.74, fy: 0.62, frx: 0.25, fry: 0.16, c: [18,  38,  92], a: 0.16 },
    { fx: 0.52, fy: 0.17, frx: 0.20, fry: 0.13, c: [155, 115,  28], a: 0.07 },
    { fx: 0.31, fy: 0.80, frx: 0.22, fry: 0.14, c: [135,  95,  18], a: 0.06 },
  ];

  function drawNebula({ fx, fy, frx, fry, c, a }) {
    const cx = fx * W, cy = fy * H;
    const rx = frx * W, ry = fry * H;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0,    `rgba(${c[0]},${c[1]},${c[2]},${a})`);
    g.addColorStop(0.45, `rgba(${c[0]},${c[1]},${c[2]},${(a * 0.35).toFixed(3)})`);
    g.addColorStop(1,    `rgba(${c[0]},${c[1]},${c[2]},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let t = 0;

  function draw() {
    t++;

    // Smooth mouse lerp
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#08101e');
    bg.addColorStop(1, '#050a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Nebulae
    for (const n of NEBULAE) drawNebula(n);

    // White/blue stars — no shadow
    ctx.shadowBlur = 0;
    for (const s of stars) {
      if (s.isGold) continue;
      s.x += DRIFT[s.layer];
      if (s.x > W + 2) s.x = -2;

      const op = Math.max(0, s.bOp + Math.sin(t * s.tSpeed + s.phase) * s.swing);
      ctx.fillStyle = `rgba(200,215,245,${op.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(
        s.x + mx * PAR[s.layer],
        s.y + my * PAR[s.layer],
        s.r, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Gold stars — shadowBlur creates the soft glow
    for (const s of stars) {
      if (!s.isGold) continue;
      s.x += DRIFT[s.layer];
      if (s.x > W + 2) s.x = -2;

      const op = Math.max(0, s.bOp + Math.sin(t * s.tSpeed + s.phase) * s.swing);
      const dx = s.x + mx * PAR[s.layer];
      const dy = s.y + my * PAR[s.layer];

      ctx.shadowBlur  = s.r * 10;
      ctx.shadowColor = `rgba(232,201,122,${(op * 0.5).toFixed(3)})`;
      ctx.fillStyle   = `rgba(232,201,122,${op.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(dx, dy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    raf = requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('unload', () => cancelAnimationFrame(raf));
})();
