(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // Mobile nav toggle (mirrors script.js behavior for the TCFSC page,
  // which doesn't load script.js)
  // ─────────────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const cfsNav = document.getElementById('cfs-nav');

  if (navToggle && cfsNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = cfsNav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        cfsNav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ─────────────────────────────────────────────────────────────
  // Speaker flip cards — click/tap toggle
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-flip-card]').forEach((card) => {
    card.addEventListener('click', (e) => {
      // Allow links inside cards to behave normally
      if (e.target.closest('a')) return;
      card.classList.toggle('is-flipped');
    });
  });


  // ─────────────────────────────────────────────────────────────
  // Speakers carousel — scroll-snap with arrow & dot controls
  // ─────────────────────────────────────────────────────────────
  const carousel = document.querySelector('[data-speakers-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-speakers-track]');
    const prevBtn = carousel.querySelector('[data-speakers-prev]');
    const nextBtn = carousel.querySelector('[data-speakers-next]');
    const dotsHost = carousel.querySelector('[data-speakers-dots]');
    const cards = Array.from(track.querySelectorAll('.speaker-card'));

    const getStep = () => {
      // Step = visible width minus a small slack so we don't overshoot
      return Math.max(track.clientWidth - 16, 1);
    };

    const getPageCount = () => {
      if (!cards.length) return 0;
      const first = cards[0];
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      const cardW = first.getBoundingClientRect().width + gap;
      const perPage = Math.max(1, Math.round(track.clientWidth / cardW));
      return Math.max(1, Math.ceil(cards.length / perPage));
    };

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll;

      const pageCount = getPageCount();
      const dots = dotsHost.querySelectorAll('button');
      if (dots.length !== pageCount) {
        renderDots(pageCount);
        return;
      }
      // Highlight active dot
      const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      const activeIdx = Math.round(ratio * (pageCount - 1));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIdx));
    };

    const renderDots = (pageCount) => {
      dotsHost.innerHTML = '';
      if (pageCount <= 1) return;
      for (let i = 0; i < pageCount; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `Go to slide group ${i + 1}`);
        btn.addEventListener('click', () => {
          const maxScroll = track.scrollWidth - track.clientWidth;
          const target = pageCount > 1 ? (maxScroll * i) / (pageCount - 1) : 0;
          track.scrollTo({ left: target, behavior: 'smooth' });
        });
        dotsHost.appendChild(btn);
      }
      updateControls();
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    let scrollRaf = null;
    track.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        updateControls();
      });
    });

    let resizeRaf = null;
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        renderDots(getPageCount());
      });
    });

    renderDots(getPageCount());
    updateControls();
  }


  // ─────────────────────────────────────────────────────────────
  // Floating sponsor logos — gentle sine drift, paused on reduced motion
  // ─────────────────────────────────────────────────────────────
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const logos = document.querySelectorAll('[data-float-logo]');

  if (logos.length && !reducedMotion) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const start = performance.now();

    const animate = (now) => {
      const t = (now - start) / 1000;
      logos.forEach((el, i) => {
        const speed = isMobile ? 0.25 + (i % 3) * 0.08 : 0.3 + (i % 5) * 0.1;
        const xAmp = isMobile ? 6 + (i % 3) * 3 : 8 + (i % 3) * 4;
        const yAmp = isMobile ? 4 + (i % 4) * 2 : 6 + (i % 4) * 3;
        const phaseX = (i * 1.3) % (Math.PI * 2);
        const phaseY = (i * 0.9) % (Math.PI * 2);
        const x = Math.sin(t * speed + phaseX) * xAmp;
        const y = Math.cos(t * speed * 0.7 + phaseY) * yAmp;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
})();
