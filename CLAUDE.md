# CLAUDE.md — Conscious Future Society

## Brand & Design

**Colors:** deep navy/dark blue base · gold accents · subtle blue highlights
**Feel:** elegant, minimal, premium · spiritual + scientific balance
**Tone:** intellectually grounded, depth over surface-level insight, clarity over noise

Avoid: neon/sci-fi aesthetics, oversaturated color, cluttered layouts, generic self-help phrasing, exaggerated claims, heavy glassmorphism, Web3/crypto aesthetics.

---

## Design Tokens (Source of Truth)

Always use these tokens. Never use raw hex values or hardcoded sizes when a token exists.

```css
/* Colors */
--cfs-navy:           #0a0e1a;
--cfs-navy-mid:       #0d1526;
--cfs-navy-light:     #111d35;
--cfs-gold:           #c9a84c;
--cfs-gold-muted:     rgba(201, 168, 76, 0.4);
--cfs-blue-glow:      rgba(80, 140, 255, 0.15);
--cfs-white:          #ffffff;
--cfs-text-primary:   rgba(255, 255, 255, 0.92);
--cfs-text-secondary: rgba(255, 255, 255, 0.55);

/* Typography */
--font-display: [confirm from existing CSS before applying];
--font-body:    [confirm from existing CSS before applying];

--font-size-hero:  clamp(3rem, 8vw, 7rem);
--font-size-h1:    clamp(2.2rem, 5vw, 4rem);
--font-size-h2:    clamp(1.6rem, 3vw, 2.5rem);
--font-size-h3:    clamp(1.2rem, 2vw, 1.6rem);
--font-size-body:  clamp(1rem, 1.2vw, 1.125rem);
--font-size-small: 0.875rem;

--font-weight-light:   300;
--font-weight-regular: 400;
--font-weight-medium:  500;
--font-weight-bold:    700;

--letter-spacing-wide:  0.08em;
--letter-spacing-wider: 0.15em;
--line-height-tight:    1.1;
--line-height-base:     1.6;
--line-height-loose:    1.85;

/* Spacing */
--space-xs:  0.5rem;
--space-sm:  1rem;
--space-md:  2rem;
--space-lg:  4rem;
--space-xl:  7rem;
--space-2xl: 10rem;
--space-3xl: 14rem;

/* Motion */
--ease-cinematic:     cubic-bezier(0.16, 1, 0.3, 1);
--ease-smooth:        cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:           cubic-bezier(0, 0, 0.2, 1);
--duration-fast:      300ms;
--duration-base:      600ms;
--duration-slow:      1000ms;
--duration-cinematic: 1400ms;
```

Before applying `--font-display` and `--font-body`, check existing CSS to confirm which fonts are already loaded. Do not substitute fonts without verifying.

---

## File Protection Map

### DO NOT MODIFY — Ever
- `assets/being.png` — master asset, no exceptions
- `hero-animation-v1/` — saved snapshot, read-only reference only
- Any file inside `hero-animation-v1/`

### HERO FILES — Modify only if explicitly instructed
- `index.html` hero section markup
- `script.js` GSAP / ScrollTrigger hero logic
- Any CSS targeting the hero canvas, hero section, or clone elements
- If you are unsure whether a file is part of the hero — do not modify it. Flag it first.

### SAFE TO MODIFY / EXTEND
- `styles.css` — extend only; do not remove existing hero styles
- `index.html` — add new sections below hero; do not restructure hero markup
- `script.js` — add new scroll animations below hero logic; do not alter the hero block
