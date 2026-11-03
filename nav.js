(function () {
  'use strict';

  const navToggle = document.querySelector('.nav-mobile-toggle');
  const cfsNav = document.getElementById('cfs-nav');

  if (!navToggle || !cfsNav) return;

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

  // Condensed state after the hero scrolls off
  const SCROLL_THRESHOLD = 400;
  const onScroll = () => {
    cfsNav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
