gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// IDLE FLOAT — two offset loops create organic drift
// Animates #float-anchor (wrapper), leaving scroll props on
// #original conflict-free. Max travel: ±10px y, ±5px x, ±0.6°
// ─────────────────────────────────────────────────────────────
gsap.to('#float-anchor', {
  y: 10,
  duration: 4,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});
gsap.to('#float-anchor', {
  x: 5,
  rotation: 0.6,
  duration: 6.5,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  delay: 1.4,
});


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

// ── Ambient glow: gold halo grows from center ──
master.to('#ambient-glow', {
  opacity: 0.9,
  width:   '120vw',
  height:  '60vw',
  ease:    'power2.in',
  duration: 10,
}, 0);

// ── Original: descends smoothly, vertical only ──
master.to('#original', {
  y:    '10vh',
  ease: 'power2.inOut',
  duration: 10,
}, 0);


// ── Helper: fade-in + vertical movement only ──
function addClone(id, fromY, toY, opacityDuration, moveDuration, start) {
  master.fromTo(id,
    { opacity: 0 },
    { opacity: 1, ease: 'power2.out', duration: opacityDuration },
    start
  );
  master.fromTo(id,
    { y: fromY },
    { y: toY, ease: 'power3.out', duration: moveDuration },
    start
  );
}

// Clone 1 — separates at t=2
addClone('#clone-1', '1vh',   '-4vh',  1.5, 8,   2);

// Clone 2 — separates at t=3.8
addClone('#clone-2', '-1vh',  '-10vh', 1.5, 6.2, 3.8);

// Clone 3 — separates at t=5.5
addClone('#clone-3', '-5vh',  '-16vh', 1.2, 4.5, 5.5);

// Clone 4 — separates at t=7
addClone('#clone-4', '-11vh', '-22vh', 1.0, 3,   7);

// Clone 5 — separates at t=8
addClone('#clone-5', '-19vh', '-26vh', 0.8, 2,   8);

// ── Clone 5 radiant ramp: extreme brightness at full illumination ──
master.to('#clone-5', {
  filter: 'brightness(6) drop-shadow(0 0 90px rgba(226,194,112,1)) drop-shadow(0 0 160px rgba(255,245,200,0.9))',
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
