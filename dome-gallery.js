// dome-gallery.js — vanilla port of React Bits DomeGallery.
// Drag uses native pointer events instead of @use-gesture/react.
(function () {
  'use strict';

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const normalizeAngle = d => ((d % 360) + 360) % 360;
  const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
  };
  const getDataNumber = (el, name, fallback) => {
    const attr = el.dataset[name];
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
  };

  function buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];
    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });
    const total = coords.length;
    if (!pool.length) return coords.map(c => ({ ...c, src: '', alt: '' }));
    const normalized = pool.map(img =>
      typeof img === 'string'
        ? { src: img, alt: '' }
        : { src: img.src || '', alt: img.alt || '' }
    );
    const used = Array.from({ length: total }, (_, i) => normalized[i % normalized.length]);
    for (let i = 1; i < used.length; i++) {
      if (used[i].src === used[i - 1].src) {
        for (let j = i + 1; j < used.length; j++) {
          if (used[j].src !== used[i].src) {
            const t = used[i]; used[i] = used[j]; used[j] = t;
            break;
          }
        }
      }
    }
    return coords.map((c, i) => ({ ...c, src: used[i].src, alt: used[i].alt }));
  }

  function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    return {
      rotateY: unit * (offsetX + (sizeX - 1) / 2),
      rotateX: unit * (offsetY - (sizeY - 1) / 2),
    };
  }

  const DEFAULTS = {
    images: [],
    fit: 0.5,
    fitBasis: 'auto',
    minRadius: 600,
    maxRadius: Infinity,
    padFactor: 0.25,
    overlayBlurColor: '#120F17',
    maxVerticalRotationDeg: 5,
    dragSensitivity: 20,
    enlargeTransitionMs: 300,
    segments: 35,
    dragDampening: 2,
    openedImageWidth: '400px',
    openedImageHeight: '400px',
    imageBorderRadius: '30px',
    openedImageBorderRadius: '30px',
    grayscale: true,
  };

  function initDomeGallery(root, options) {
    const opts = Object.assign({}, DEFAULTS, options || {});

    root.classList.add('sphere-root');
    root.innerHTML = '';
    root.style.setProperty('--segments-x', opts.segments);
    root.style.setProperty('--segments-y', opts.segments);
    root.style.setProperty('--overlay-blur-color', opts.overlayBlurColor);
    root.style.setProperty('--tile-radius', opts.imageBorderRadius);
    root.style.setProperty('--enlarge-radius', opts.openedImageBorderRadius);
    root.style.setProperty('--image-filter', opts.grayscale ? 'grayscale(1)' : 'none');

    const main = document.createElement('main');
    main.className = 'sphere-main';
    const stage = document.createElement('div');
    stage.className = 'stage';
    const sphere = document.createElement('div');
    sphere.className = 'sphere';

    const items = buildItems(opts.images, opts.segments);
    items.forEach(it => {
      const tile = document.createElement('div');
      tile.className = 'item';
      tile.dataset.src = it.src;
      tile.dataset.offsetX = it.x;
      tile.dataset.offsetY = it.y;
      tile.dataset.sizeX = it.sizeX;
      tile.dataset.sizeY = it.sizeY;
      tile.style.setProperty('--offset-x', it.x);
      tile.style.setProperty('--offset-y', it.y);
      tile.style.setProperty('--item-size-x', it.sizeX);
      tile.style.setProperty('--item-size-y', it.sizeY);

      const btn = document.createElement('div');
      btn.className = 'item__image';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-label', it.alt || 'Open image');
      btn.addEventListener('click', onTileClick);
      btn.addEventListener('pointerup', onTilePointerUp);

      if (it.src) {
        const img = document.createElement('img');
        img.src = it.src;
        img.draggable = false;
        img.alt = it.alt || '';
        btn.appendChild(img);
      }
      tile.appendChild(btn);
      sphere.appendChild(tile);
    });

    stage.appendChild(sphere);
    main.appendChild(stage);
    main.appendChild(Object.assign(document.createElement('div'), { className: 'overlay' }));
    main.appendChild(Object.assign(document.createElement('div'), { className: 'overlay overlay--blur' }));
    main.appendChild(Object.assign(document.createElement('div'), { className: 'edge-fade edge-fade--top' }));
    main.appendChild(Object.assign(document.createElement('div'), { className: 'edge-fade edge-fade--bottom' }));

    const viewer = Object.assign(document.createElement('div'), { className: 'viewer' });
    const scrim = Object.assign(document.createElement('div'), { className: 'scrim' });
    const frame = Object.assign(document.createElement('div'), { className: 'frame' });
    viewer.appendChild(scrim);
    viewer.appendChild(frame);
    main.appendChild(viewer);
    root.appendChild(main);

    let rotation = { x: 0, y: 0 };
    let startRot = { x: 0, y: 0 };
    let startPos = null;
    let dragging = false;
    let moved = false;
    let lastDragEndAt = 0;
    let inertiaRAF = null;
    let opening = false;
    let openStartedAt = 0;
    let focusedEl = null;
    let originalTilePos = null;
    let moveBuf = [];
    let scrollLocked = false;

    const applyTransform = (x, y) => {
      sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${x}deg) rotateY(${y}deg)`;
    };
    const lockScroll = () => {
      if (scrollLocked) return;
      scrollLocked = true;
      document.body.classList.add('dg-scroll-lock');
    };
    const unlockScroll = () => {
      if (!scrollLocked) return;
      if (root.getAttribute('data-enlarging') === 'true') return;
      scrollLocked = false;
      document.body.classList.remove('dg-scroll-lock');
    };

    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;
      let basis;
      switch (opts.fitBasis) {
        case 'min': basis = minDim; break;
        case 'max': basis = maxDim; break;
        case 'width': basis = w; break;
        case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * opts.fit;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, opts.minRadius, opts.maxRadius);
      const viewerPad = Math.max(8, Math.round(minDim * opts.padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      applyTransform(rotation.x, rotation.y);

      const enlarged = viewer.querySelector('.enlarge');
      if (enlarged) {
        const fR = frame.getBoundingClientRect();
        const mR = main.getBoundingClientRect();
        if (opts.openedImageWidth && opts.openedImageHeight) {
          const t = document.createElement('div');
          t.style.cssText = `position:absolute;width:${opts.openedImageWidth};height:${opts.openedImageHeight};visibility:hidden;`;
          document.body.appendChild(t);
          const tR = t.getBoundingClientRect();
          document.body.removeChild(t);
          enlarged.style.left = `${fR.left - mR.left + (fR.width - tR.width) / 2}px`;
          enlarged.style.top = `${fR.top - mR.top + (fR.height - tR.height) / 2}px`;
        } else {
          enlarged.style.left = `${fR.left - mR.left}px`;
          enlarged.style.top = `${fR.top - mR.top}px`;
          enlarged.style.width = `${fR.width}px`;
          enlarged.style.height = `${fR.height}px`;
        }
      }
    });
    ro.observe(root);
    applyTransform(0, 0);

    function stopInertia() {
      if (inertiaRAF) { cancelAnimationFrame(inertiaRAF); inertiaRAF = null; }
    }
    function startInertia(vx, vy) {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(opts.dragDampening != null ? opts.dragDampening : 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul; vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF = null; return; }
        if (++frames > maxFrames) { inertiaRAF = null; return; }
        const nX = clamp(rotation.x - vY / 200, -opts.maxVerticalRotationDeg, opts.maxVerticalRotationDeg);
        const nY = wrapAngleSigned(rotation.y + vX / 200);
        rotation = { x: nX, y: nY };
        applyTransform(nX, nY);
        inertiaRAF = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF = requestAnimationFrame(step);
    }

    function onPointerDown(e) {
      if (focusedEl) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      stopInertia();
      dragging = true;
      moved = false;
      startPos = { x: e.clientX, y: e.clientY };
      startRot = { x: rotation.x, y: rotation.y };
      moveBuf = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }
    function onPointerMove(e) {
      if (!dragging || focusedEl || !startPos) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      if (!moved && dx * dx + dy * dy > 16) moved = true;
      const nX = clamp(startRot.x - dy / opts.dragSensitivity, -opts.maxVerticalRotationDeg, opts.maxVerticalRotationDeg);
      const nY = wrapAngleSigned(startRot.y + dx / opts.dragSensitivity);
      if (rotation.x !== nX || rotation.y !== nY) {
        rotation = { x: nX, y: nY };
        applyTransform(nX, nY);
      }
      moveBuf.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (moveBuf.length > 5) moveBuf.shift();
    }
    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Velocity: pick newest sample that's >= 40ms old, else oldest available.
      const now = performance.now();
      let sample = moveBuf[0];
      for (let i = moveBuf.length - 1; i >= 0; i--) {
        if (now - moveBuf[i].t >= 40) { sample = moveBuf[i]; break; }
      }
      const dt = Math.max(1, now - sample.t);
      let vx = (e.clientX - sample.x) / dt;
      let vy = (e.clientY - sample.y) / dt;
      if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && startPos) {
        const mx = e.clientX - startPos.x;
        const my = e.clientY - startPos.y;
        vx = clamp((mx / opts.dragSensitivity) * 0.02, -1.2, 1.2);
        vy = clamp((my / opts.dragSensitivity) * 0.02, -1.2, 1.2);
      }
      if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
      if (moved) lastDragEndAt = performance.now();
      moved = false;
    }
    main.addEventListener('pointerdown', onPointerDown);

    function openItemFromElement(el) {
      if (opening) return;
      opening = true;
      openStartedAt = performance.now();
      lockScroll();
      const parent = el.parentElement;
      focusedEl = el;
      el.setAttribute('data-focused', 'true');
      const offX = getDataNumber(parent, 'offsetX', 0);
      const offY = getDataNumber(parent, 'offsetY', 0);
      const sX = getDataNumber(parent, 'sizeX', 2);
      const sY = getDataNumber(parent, 'sizeY', 2);
      const pRot = computeItemBaseRotation(offX, offY, sX, sY, opts.segments);
      const parentY = normalizeAngle(pRot.rotateY);
      const globalY = normalizeAngle(rotation.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -pRot.rotateX - rotation.x;
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference';
      refDiv.style.opacity = '0';
      refDiv.style.transform = `rotateX(${-pRot.rotateX}deg) rotateY(${-pRot.rotateY}deg)`;
      parent.appendChild(refDiv);
      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = main.getBoundingClientRect();
      const frameR = frame.getBoundingClientRect();

      if (tileR.width <= 0 || tileR.height <= 0) {
        opening = false;
        focusedEl = null;
        parent.removeChild(refDiv);
        unlockScroll();
        return;
      }

      originalTilePos = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
      el.style.visibility = 'hidden';
      el.style.zIndex = 0;

      const enlarge = document.createElement('div');
      enlarge.className = 'enlarge';
      enlarge.style.position = 'absolute';
      enlarge.style.left = frameR.left - mainR.left + 'px';
      enlarge.style.top = frameR.top - mainR.top + 'px';
      enlarge.style.width = frameR.width + 'px';
      enlarge.style.height = frameR.height + 'px';
      enlarge.style.opacity = '0';
      enlarge.style.zIndex = '30';
      enlarge.style.willChange = 'transform, opacity';
      enlarge.style.transformOrigin = 'top left';
      enlarge.style.transition = `transform ${opts.enlargeTransitionMs}ms ease, opacity ${opts.enlargeTransitionMs}ms ease`;

      const rawSrc = parent.dataset.src || (el.querySelector('img') || {}).src || '';
      const img = document.createElement('img');
      img.src = rawSrc;
      enlarge.appendChild(img);
      viewer.appendChild(enlarge);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;
      const vsx = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const vsy = isFinite(sy0) && sy0 > 0 ? sy0 : 1;
      enlarge.style.transform = `translate(${tx0}px, ${ty0}px) scale(${vsx}, ${vsy})`;

      setTimeout(() => {
        if (!enlarge.parentElement) return;
        enlarge.style.opacity = '1';
        enlarge.style.transform = 'translate(0px, 0px) scale(1, 1)';
        root.setAttribute('data-enlarging', 'true');
      }, 16);

      if (opts.openedImageWidth || opts.openedImageHeight) {
        const onFirst = ev => {
          if (ev.propertyName !== 'transform') return;
          enlarge.removeEventListener('transitionend', onFirst);
          const prev = enlarge.style.transition;
          enlarge.style.transition = 'none';
          const tw = opts.openedImageWidth || `${frameR.width}px`;
          const th = opts.openedImageHeight || `${frameR.height}px`;
          enlarge.style.width = tw;
          enlarge.style.height = th;
          const nR = enlarge.getBoundingClientRect();
          enlarge.style.width = frameR.width + 'px';
          enlarge.style.height = frameR.height + 'px';
          void enlarge.offsetWidth;
          enlarge.style.transition = `left ${opts.enlargeTransitionMs}ms ease, top ${opts.enlargeTransitionMs}ms ease, width ${opts.enlargeTransitionMs}ms ease, height ${opts.enlargeTransitionMs}ms ease`;
          const cLeft = frameR.left - mainR.left + (frameR.width - nR.width) / 2;
          const cTop = frameR.top - mainR.top + (frameR.height - nR.height) / 2;
          requestAnimationFrame(() => {
            enlarge.style.left = `${cLeft}px`;
            enlarge.style.top = `${cTop}px`;
            enlarge.style.width = tw;
            enlarge.style.height = th;
          });
          const done2 = () => { enlarge.removeEventListener('transitionend', done2); enlarge.style.transition = prev; };
          enlarge.addEventListener('transitionend', done2, { once: true });
        };
        enlarge.addEventListener('transitionend', onFirst);
      }
    }

    function onTileClick(e) {
      if (dragging || moved || opening) return;
      if (performance.now() - lastDragEndAt < 80) return;
      openItemFromElement(e.currentTarget);
    }
    function onTilePointerUp(e) {
      if (e.pointerType !== 'touch') return;
      if (dragging || moved || opening) return;
      if (performance.now() - lastDragEndAt < 80) return;
      openItemFromElement(e.currentTarget);
    }

    function close() {
      if (performance.now() - openStartedAt < 250) return;
      const el = focusedEl;
      if (!el) return;
      const parent = el.parentElement;
      const enlarge = viewer.querySelector('.enlarge');
      if (!enlarge) return;
      const refDiv = parent.querySelector('.item__image--reference');
      const orig = originalTilePos;
      if (!orig) {
        enlarge.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = 0;
        focusedEl = null;
        root.removeAttribute('data-enlarging');
        opening = false;
        unlockScroll();
        return;
      }
      const curR = enlarge.getBoundingClientRect();
      const rR = root.getBoundingClientRect();
      const origRel = { left: orig.left - rR.left, top: orig.top - rR.top, width: orig.width, height: orig.height };
      const curRel = { left: curR.left - rR.left, top: curR.top - rR.top, width: curR.width, height: curR.height };

      const anim = document.createElement('div');
      anim.className = 'enlarge-closing';
      anim.style.cssText =
        `position:absolute;left:${curRel.left}px;top:${curRel.top}px;` +
        `width:${curRel.width}px;height:${curRel.height}px;` +
        `z-index:9999;border-radius:var(--enlarge-radius, 32px);` +
        `overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);` +
        `transition:all ${opts.enlargeTransitionMs}ms ease-out;` +
        `pointer-events:none;margin:0;transform:none;`;
      const origImg = enlarge.querySelector('img');
      if (origImg) {
        const img = origImg.cloneNode();
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        anim.appendChild(img);
      }
      enlarge.remove();
      root.appendChild(anim);
      void anim.getBoundingClientRect();
      requestAnimationFrame(() => {
        anim.style.left = origRel.left + 'px';
        anim.style.top = origRel.top + 'px';
        anim.style.width = origRel.width + 'px';
        anim.style.height = origRel.height + 'px';
        anim.style.opacity = '0';
      });
      const cleanup = () => {
        anim.remove();
        originalTilePos = null;
        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = 0;
          focusedEl = null;
          root.removeAttribute('data-enlarging');
          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                opening = false;
                if (!dragging && root.getAttribute('data-enlarging') !== 'true') {
                  document.body.classList.remove('dg-scroll-lock');
                  scrollLocked = false;
                }
              }, 300);
            });
          });
        });
      };
      anim.addEventListener('transitionend', cleanup, { once: true });
    }
    scrim.addEventListener('click', close);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  window.initDomeGallery = initDomeGallery;

  function autoInit() {
    document.querySelectorAll('[data-dome-gallery]').forEach(root => {
      if (root.__domeInit) return;
      root.__domeInit = true;
      let cfg = {};
      const raw = root.getAttribute('data-dome-config');
      if (raw) {
        try { cfg = JSON.parse(raw); }
        catch (e) { console.warn('[DomeGallery] bad JSON in data-dome-config', e); }
      }
      initDomeGallery(root, cfg);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
  else autoInit();
})();
