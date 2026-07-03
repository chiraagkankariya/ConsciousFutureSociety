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

// ── Original: descends smoothly, vertical only ──
master.to('#original', {
  y:    '2vh',
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

// ── Buffer: 1-unit empty hold at animation end ──
// Ensures scrub (0.8s lag) fully settles before pin releases.
// At end=+=5000 with total duration 11: buffer = ~454px of extra scroll.
master.to({}, { duration: 1 });


// ═════════════════════════════════════════════════════════════
// SECTION SCROLL ANIMATIONS — Phase 5
// opacity + translateY only — never layout-affecting props
// ═════════════════════════════════════════════════════════════

const ST = (trigger, startOffset = '80%') => ({
  trigger,
  start: `top ${startOffset}`,
  toggleActions: 'play none none none',
});

// ── Mission ──
gsap.from('.mission-heading', {
  opacity: 0, y: 40, duration: 1.25, ease: 'power3.out',
  scrollTrigger: ST('.mission-heading'),
});
gsap.from('.mission-divider > *', {
  opacity: 0, y: 32, duration: 1.1, ease: 'power3.out',
  stagger: 0.16, delay: 0.15,
  scrollTrigger: ST('.mission-divider'),
});

// ── Philosophy ──
gsap.from('#philosophy .section-eyebrow, #philosophy .section-heading', {
  opacity: 0, y: 28, duration: 1.05, ease: 'power3.out', stagger: 0.12,
  scrollTrigger: ST('#philosophy'),
});
gsap.from('.pillar', {
  opacity: 0, y: 44, duration: 1.2, ease: 'power3.out', stagger: 0.13,
  scrollTrigger: ST('.pillars-grid'),
});

// ── Initiatives ──
gsap.from('#initiatives .gold-rule, #initiatives .section-eyebrow, #initiatives .section-heading', {
  opacity: 0, y: 28, duration: 1.05, ease: 'power3.out', stagger: 0.12,
  scrollTrigger: ST('#initiatives'),
});
gsap.from('.initiative-card', {
  opacity: 0, y: 48, duration: 1.25, ease: 'power3.out', stagger: 0.15,
  scrollTrigger: ST('.initiatives-grid'),
});

// ── Vision ──
gsap.from('#vision .section-eyebrow', {
  opacity: 0, y: 20, duration: 0.9, ease: 'power3.out',
  scrollTrigger: ST('#vision'),
});
gsap.from('.vision-statement', {
  opacity: 0, y: 52, duration: 1.4, ease: 'power3.out', delay: 0.12,
  scrollTrigger: ST('#vision'),
});
gsap.from('.vision-body .section-body', {
  opacity: 0, y: 28, duration: 1.1, ease: 'power3.out',
  stagger: 0.18, delay: 0.3,
  scrollTrigger: ST('.vision-statement', '75%'),
});

// ── Involvement ──
gsap.from('#involvement .section-eyebrow, #involvement .section-heading, #involvement .section-body', {
  opacity: 0, y: 32, duration: 1.1, ease: 'power3.out', stagger: 0.14,
  scrollTrigger: ST('#involvement'),
});
gsap.from('.involvement-ctas', {
  opacity: 0, y: 24, duration: 1.0, ease: 'power3.out', delay: 0.35,
  scrollTrigger: ST('#involvement', '70%'),
});
gsap.from('.involvement-note', {
  opacity: 0, y: 16, duration: 0.9, ease: 'power3.out', delay: 0.5,
  scrollTrigger: ST('#involvement', '70%'),
});


// ═════════════════════════════════════════════════════════════
// MOBILE NAV TOGGLE
// ═════════════════════════════════════════════════════════════

const navToggle = document.querySelector('.nav-mobile-toggle');
const cfsNav    = document.getElementById('cfs-nav');

if (navToggle && cfsNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = cfsNav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link tap
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      cfsNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


// ─────────────────────────────────────────────────────────────
// SCROLL PROMPT — hide once past ~30% of first viewport
// ─────────────────────────────────────────────────────────────
const scrollPrompt = document.getElementById('scroll-prompt');
if (scrollPrompt) {
  const update = () => {
    const past = window.scrollY > window.innerHeight * 0.3;
    scrollPrompt.classList.toggle('is-hidden', past);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

const loadingScreen = document.getElementById('loading-screen');
const video = document.getElementById('space-video');
let videoReady = false;
let minTimePassed = false;

// Lock scroll while overlay is up so the pinned hero can't be advanced early
const prevHtmlOverflow = document.documentElement.style.overflow;
const prevBodyOverflow = document.body.style.overflow;
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';
function unlockScroll() {
  document.documentElement.style.overflow = prevHtmlOverflow;
  document.body.style.overflow = prevBodyOverflow;
}

function tryDismiss() {
  if (videoReady && minTimePassed) {
    video.play();
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      unlockScroll();
      setTimeout(() => loadingScreen.remove(), 2600);
    }, 300);
  }
}

setTimeout(() => { minTimePassed = true; tryDismiss(); }, 1500);

// Guard against the canplaythrough race: if the video is already buffered
// enough by the time this script runs (warm cache), the event may have
// already fired. HAVE_ENOUGH_DATA === 4.
if (video.readyState >= 4) {
  videoReady = true;
  tryDismiss();
} else {
  video.addEventListener('canplaythrough', () => {
    videoReady = true;
    tryDismiss();
  }, { once: true });
}

// Fallback: force dismiss after 5s regardless
setTimeout(() => {
  loadingScreen.classList.add('fade-out');
  unlockScroll();
  setTimeout(() => loadingScreen.remove(), 2600);
}, 5000);
