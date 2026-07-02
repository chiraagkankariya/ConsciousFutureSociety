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
})();
