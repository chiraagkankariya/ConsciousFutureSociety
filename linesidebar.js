// Vanilla port of the React Bits <LineSidebar /> component.
// Usage:
//   import { createLineSidebar } from './linesidebar.js';
//   const sidebar = createLineSidebar(container, {
//     items: ['Overview', 'Components', ...],
//     accentColor: '#A855F7',
//     onItemClick: (i, label) => console.log(i, label),
//   });
//   sidebar.setActive(2);
//   sidebar.destroy();

const FALLOFF_CURVES = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

const DEFAULT_ITEMS = [
  'Overview', 'Components', 'Animations', 'Backgrounds', 'Showcase',
  'Playground', 'Templates', 'Changelog', 'Community', 'Resources',
  'Documentation', 'Support',
];

export function createLineSidebar(container, opts = {}) {
  if (!container) throw new Error('createLineSidebar: container is required');

  const {
    items = DEFAULT_ITEMS,
    accentColor = '#A855F7',
    textColor = '#c4c4c4',
    markerColor = '#6c6c6c',
    showIndex = true,
    showMarker = true,
    proximityRadius = 100,
    maxShift = 30,
    falloff = 'smooth',
    markerLength = 60,
    markerGap = 0,
    tickScale = 0.5,
    scaleTick = true,
    itemGap = 20,
    fontSize = 1.1,
    smoothing = 100,
    defaultActive = null,
    onItemClick,
    className = '',
  } = opts;

  const nav = document.createElement('nav');
  nav.className =
    'line-sidebar' +
    (showMarker ? ' line-sidebar--markers' : '') +
    (scaleTick ? ' line-sidebar--scale-tick' : '') +
    (className ? ' ' + className : '');
  Object.assign(nav.style, {
    '--accent-color': accentColor,
    '--text-color': textColor,
    '--marker-color': markerColor,
    '--marker-length': `${markerLength}px`,
    '--marker-gap': `${markerGap}px`,
    '--tick-scale': String(tickScale),
    '--max-shift': `${maxShift}px`,
    '--item-gap': `${itemGap}px`,
    '--font-size': `${fontSize}rem`,
    '--smoothing': `${smoothing}ms`,
  });
  // Object.assign with CSS custom properties on style doesn't always stick — set them explicitly too.
  const cssVars = {
    '--accent-color': accentColor,
    '--text-color': textColor,
    '--marker-color': markerColor,
    '--marker-length': `${markerLength}px`,
    '--marker-gap': `${markerGap}px`,
    '--tick-scale': String(tickScale),
    '--max-shift': `${maxShift}px`,
    '--item-gap': `${itemGap}px`,
    '--font-size': `${fontSize}rem`,
    '--smoothing': `${smoothing}ms`,
  };
  for (const [k, v] of Object.entries(cssVars)) nav.style.setProperty(k, v);

  const list = document.createElement('ul');
  list.className = 'line-sidebar__list';
  nav.appendChild(list);

  const itemEls = items.map((label, index) => {
    const li = document.createElement('li');
    li.className = 'line-sidebar__item';

    if (showMarker) {
      const marker = document.createElement('span');
      marker.className = 'line-sidebar__marker';
      marker.setAttribute('aria-hidden', 'true');
      li.appendChild(marker);
    }

    const labelEl = document.createElement('span');
    labelEl.className = 'line-sidebar__label';

    if (showIndex) {
      const idx = document.createElement('span');
      idx.className = 'line-sidebar__index';
      idx.textContent = String(index + 1).padStart(2, '0');
      labelEl.appendChild(idx);
    }

    const text = document.createElement('span');
    text.className = 'line-sidebar__text';
    text.textContent = label;
    labelEl.appendChild(text);
    li.appendChild(labelEl);

    li.addEventListener('click', () => {
      setActive(index);
      onItemClick?.(index, label);
    });

    list.appendChild(li);
    return li;
  });

  let activeIndex = defaultActive;
  const targets = new Array(items.length).fill(0);
  const current = new Array(items.length).fill(0);
  let raf = 0;
  let last = 0;

  const setActiveAttr = () => {
    itemEls.forEach((el, i) => {
      if (i === activeIndex) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  };

  function runFrame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const tau = Math.max(smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    for (let i = 0; i < itemEls.length; i++) {
      const el = itemEls[i];
      const target = Math.max(targets[i] || 0, activeIndex === i ? 1 : 0);
      const cur = current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    raf = moving ? requestAnimationFrame(runFrame) : 0;
  }

  function startLoop() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(runFrame);
  }

  function onPointerMove(e) {
    const rect = list.getBoundingClientRect();
    const pointerY = e.clientY - rect.top;
    const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
    for (let i = 0; i < itemEls.length; i++) {
      const el = itemEls[i];
      const center = el.offsetTop + el.offsetHeight / 2;
      const distance = Math.abs(pointerY - center);
      targets[i] = ease(Math.max(0, 1 - distance / proximityRadius));
    }
    startLoop();
  }

  function onPointerLeave() {
    for (let i = 0; i < targets.length; i++) targets[i] = 0;
    startLoop();
  }

  list.addEventListener('pointermove', onPointerMove);
  list.addEventListener('pointerleave', onPointerLeave);

  function setActive(index) {
    activeIndex = index;
    setActiveAttr();
    startLoop();
  }

  setActiveAttr();
  container.appendChild(nav);
  startLoop();

  function destroy() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    list.removeEventListener('pointermove', onPointerMove);
    list.removeEventListener('pointerleave', onPointerLeave);
    if (nav.parentElement === container) container.removeChild(nav);
  }

  return { destroy, setActive, element: nav };
}
