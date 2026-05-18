(function () {
  'use strict';

  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, raf;
  let mx = 0, my = 0, tmx = 0, tmy = 0;

  // ── Photo background ──
  const img = new Image();
  let imgLoaded = false;
  img.onload = () => { imgLoaded = true; };
  img.src = 'assets/space-bg.webp';

  // ── Layer config — 0 = deep/slow, 2 = near/fast ──
  const DRIFT    = [0.04, 0.10, 0.20];   // px per frame drift (left → right)
  const PAR      = [6,    16,   28];      // max mouse parallax px per layer

  const N_STARS   = 220;
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
    // Layer 2 (near) stars are larger to read as foreground against the photo
    const rBase  = [0.5, 0.85, 1.35][layer];
    const rRange = [0.45, 0.75, 1.35][layer];
    return {
      x:      forceX !== undefined ? forceX : Math.random() * W,
      y:      Math.random() * H,
      layer,
      r:      rBase + Math.random() * rRange,
      isGold,
      phase:  Math.random() * Math.PI * 2,
      tSpeed: 0.007 + Math.random() * 0.013,
      // Lower base opacity so canvas stars blend with photo rather than competing
      bOp:    isGold ? 0.5  + Math.random() * 0.4
                     : 0.2  + Math.random() * 0.35,
      swing:  0.12 + Math.random() * 0.22,
    };
  }

  const stars = Array.from({ length: N_STARS }, () => makeStar());

  // ── Draw photo base with slow sinusoidal pan ──
  function drawBackground() {
    if (!imgLoaded) {
      // Sub-second fallback while WebP loads
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#08101e');
      bg.addColorStop(1, '#050a14');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      return;
    }

    // Show 92% of image at any moment — 8% margin gives pan travel room
    const iW = img.naturalWidth, iH = img.naturalHeight;
    const srcW = Math.round(iW * 0.92);
    const srcH = Math.round(iH * 0.92);
    const maxOffX = iW - srcW;   // ~154px horizontal travel
    const maxOffY = iH - srcH;   //  ~86px vertical travel

    // Two independent sine periods — x: ~8.7 min, y: ~13.4 min at 60fps
    // Different periods prevent path repetition, feel organic
    const offX = maxOffX * 0.5 * (1 + Math.sin(t * 0.0002));
    const offY = maxOffY * 0.5 * (1 + Math.sin(t * 0.00013 + 0.7));

    ctx.drawImage(img, offX, offY, srcW, srcH, 0, 0, W, H);
  }

  let t = 0;

  function draw() {
    t++;

    // Smooth mouse lerp
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    // 1 — Photo base with slow drift
    drawBackground();

    // 2 — White/blue animated stars (twinkling + drift + parallax)
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

    // 3 — Gold stars with soft shadowBlur glow
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
