gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// STAR FIELD  — rAF loop, independent of scroll
// Colors: white (majority), soft blue (15%), gold accent (8%)
// ─────────────────────────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars() {
    stars = [];
    const n = Math.floor(W * H / 3600);
    for (let i = 0; i < n; i++) {
      const roll = Math.random();
      stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     roll < 0.1 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.7 + 0.15,
        base:  Math.random() * 0.55 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.007 + 0.002,
        // 8% gold, 15% soft blue, rest white
        tone:  roll < 0.08 ? 'gold' : roll < 0.23 ? 'blue' : 'white',
      });
    }
  }

  const COLORS = {
    gold:  (a) => `rgba(201,168,76,${a})`,
    blue:  (a) => `rgba(160,205,255,${a})`,
    white: (a) => `rgba(255,255,255,${a})`,
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.phase += s.speed;
      const a = (s.base * (0.55 + 0.45 * Math.sin(s.phase))).toFixed(2);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[s.tone](a);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize(); makeStars(); draw();
  window.addEventListener('resize', () => { resize(); makeStars(); }, { passive: true });
})();


// ─────────────────────────────────────────────────────────────
// BEING ANIMATION  — scroll-driven, pinned
//
// PNG: 1667×943 (1.768:1). At 42vw → ≈42.2vh tall → half ≈21.1vh.
// All clone centers land in [3vh, 60vh] → fully on screen.
//
// Scroll distance: 5000px  |  Timeline: 0–10 units + 1-unit buffer
// Each unit ≈ 454px of scroll.
//
// Clone FROM positions match where the previous clone is
// at the moment each new one separates (easing-approximated):
//   t=2:   original  y ≈ +1vh
//   t=3.8: clone-1   y ≈ -1vh
//   t=5.5: clone-2   y ≈ -5vh
//   t=7:   clone-3   y ≈ -11vh
//   t=8:   clone-4   y ≈ -19vh
// ─────────────────────────────────────────────────────────────

// Center all beings; clones start invisible
gsap.set('.being', { xPercent: -50, yPercent: -50 });
gsap.set(['#clone-1', '#clone-2', '#clone-3', '#clone-4', '#clone-5'], { opacity: 0 });

const master = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start:   'top top',
    end:     '+=5000',   // longer scroll = full anim completes before pin releases
    pin:     true,
    scrub:   0.8,        // smooth but low enough lag to settle before end
    anticipatePin: 1,
  },
});

// ── Stars: subtle parallax upward as beings ascend ──
master.to('#stars', {
  y: '-4%',
  ease: 'none',
  duration: 10,
}, 0);

// ── Ambient glow: gold halo grows from center ──
master.to('#ambient-glow', {
  opacity: 0.9,
  width:   '120vw',
  height:  '60vw',
  ease:    'power2.in',
  duration: 10,
}, 0);

// ── Original: descends smoothly, slight rightward drift ──
master.to('#original', {
  y:    '10vh',
  x:    '1vw',
  ease: 'power2.inOut',
  duration: 10,
}, 0);


// ── Helper: adds a clone's fade-in + movement as two non-conflicting tweens ──
// opacityDuration: how quickly the clone becomes fully visible
// moveDuration:    how long it continues rising
// start:           timeline position where clone separates
function addClone(id, from, to, opacityDuration, moveDuration, start) {
  // Quick, clean fade-in
  master.fromTo(id,
    { opacity: 0 },
    { opacity: 1, ease: 'power2.out', duration: opacityDuration },
    start
  );
  // Continuous upward movement for full duration
  master.fromTo(id,
    { y: from.y, x: from.x, rotation: from.r },
    { y: to.y,   x: to.x,   rotation: to.r, ease: 'power3.out', duration: moveDuration },
    start
  );
}

// Clone 1 — separates at t=2 from original's position
addClone('#clone-1',
  { y: '1vh',   x: '0vw',    r: 0    },
  { y: '-4vh',  x: '-2vw',   r: -1.5 },
  1.5, 8, 2
);

// Clone 2 — separates at t=3.8 from clone-1's position
addClone('#clone-2',
  { y: '-1vh',  x: '-0.8vw', r: -0.6 },
  { y: '-10vh', x: '2.5vw',  r: 2.2  },
  1.5, 6.2, 3.8
);

// Clone 3 — separates at t=5.5 from clone-2's position
addClone('#clone-3',
  { y: '-5vh',  x: '0.8vw',  r: 0.7  },
  { y: '-16vh', x: '-1.5vw', r: -2.8 },
  1.2, 4.5, 5.5
);

// Clone 4 — separates at t=7 from clone-3's position
addClone('#clone-4',
  { y: '-11vh', x: '-0.5vw', r: -1.2 },
  { y: '-22vh', x: '1.8vw',  r: 1.8  },
  1.0, 3, 7
);

// Clone 5 — separates at t=8 from clone-4's position
addClone('#clone-5',
  { y: '-19vh', x: '1.1vw',  r: 0.9  },
  { y: '-26vh', x: '-1.2vw', r: -3.2 },
  0.8, 2, 8
);

// ── Clone 5 radiant ramp: extreme brightness at full illumination ──
master.to('#clone-5', {
  filter: [
    'brightness(6)',
    'drop-shadow(0 0 90px rgba(226,194,112,1))',
    'drop-shadow(0 0 160px rgba(255,245,200,0.9))',
  ].join(' '),
  ease:     'power2.in',
  duration: 1,
}, 9);

// ── Light veil: gold-to-white sweep, becomes transition point ──
master.to('#light-veil', {
  opacity:  1,
  ease:     'power2.in',
  duration: 1,
}, 9);

// ── Buffer: 1-unit empty hold at full illumination ──
// Ensures scrub (0.8s lag) fully settles before pin releases.
// At end=+=5000 with total duration 11: buffer = ~454px of extra scroll.
master.to({}, { duration: 1 });
