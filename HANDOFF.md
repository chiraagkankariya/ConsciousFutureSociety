# CFS Website — Handoff Document

**Project:** theconsciousfuturesociety.com  
**Status:** Development-complete. Ready for content population and deployment.  
**Completed:** May 2026

---

## What Was Built

### Phase 1 — Audit & Plan
Documented the full project stack, mapped all files, and produced PLAN.md with token migration notes and risk flags.

### Phase 2 — Navigation & TCFSC 2026 Page
- Added `<nav id="cfs-nav">` as a fixed overlay on both pages
- Created `tcfsc2026.html` — full conference subpage with sections: Hero, About, Speakers, Schedule, Registration, Sponsors, Logistics, Footer
- All conference-specific content lives exclusively on `tcfsc2026.html`
- Homepage contains zero conference-specific sections

### Phase 3 — Design System
- All `--cfs-*` CSS custom properties added to `:root` in `styles.css`
- Google Fonts loaded: **Cormorant Garamond** (display) + **Inter** (body)
- `--font-display` and `--font-body` tokens set and used throughout
- Legacy `--navy`/`--gold` tokens retained alongside `--cfs-*` (hero CSS depends on them)

### Phase 4 — Homepage Sections
Five post-hero sections built in `index.html`:

| Section | ID | Description |
|---|---|---|
| Mission | `#mission` | Full-width statement heading, white-to-navy gradient transition from hero |
| Philosophy | `#philosophy` | Four Roman-numeral pillars: Consciousness · Science · Technology · Leadership |
| Initiatives | `#initiatives` | Three initiative cards: TCFSC 2026 (featured), Consciousness Index, The Society |
| Vision | `#vision` | Centered italic blockquote + supporting paragraphs |
| Involvement | `#involvement` | Dual CTAs + email link |
| Footer | `#cfs-footer` | Three-column layout: brand / navigate / connect |

### Phase 5 — Motion & Polish
- GSAP ScrollTrigger fade+translateY entrance animations on all homepage sections
- Mobile hamburger nav (both pages) — animates bars → X, dropdown with backdrop blur
- Responsiveness: pillars and initiatives collapse to single column on mobile
- TCFSC logistics grid: extracted from inline styles to `.logistics-grid` class, responsive
- Section padding reduced on mobile viewports

---

## File Map

```
index.html          ← Homepage (hero + 5 sections + footer)
tcfsc2026.html      ← Conference subpage
styles.css          ← All styles (v=10). Hero block: lines 75–237. Do not edit.
script.js           ← Hero animation (lines 1–122) + section animations (lines 124–204)
assets/being.png    ← Master PNG. Absolute protection — never replace or modify.
assets/space-bg.png ← Hero background. Replace with updated image if needed.
CLAUDE.md           ← Session rules and design token source of truth
BRIEF.md            ← Creative brief
PLAN.md             ← Phase 1 audit output
TASKS.md            ← Phase task list
```

---

## What Still Needs Real Content

### Homepage
| Element | Status |
|---|---|
| Mission body copy | Placeholder — replace with final organisational statement |
| Consciousness Index initiative | Placeholder — replace when programme is defined |
| The Society initiative | Placeholder — replace when membership is defined |
| Vision body paragraphs | Draft copy — review and finalise |
| Social media links (LinkedIn, Instagram) | `href="#"` — add real URLs |

### TCFSC 2026 Page
| Element | Status |
|---|---|
| About section description | Placeholder |
| Speaker names + photos | 4 placeholder cards — replace with confirmed lineup |
| Schedule agenda | Placeholder times/descriptions — replace when confirmed |
| Registration system | `mailto:` link — connect to Eventbrite / ticketing system |
| Sponsor logos | 8 placeholder boxes — replace with real partners |
| Venue | `[Venue — TBC]` — update when confirmed |
| Travel/logistics notes | Placeholder paragraph |

---

## Hero Animation — Important Notes

The hero is a custom GSAP ScrollTrigger system. **Do not rebuild or reconfigure it.**

- **Asset:** `assets/being.png` — 1667×943px PNG. The animation requires this exact file. Do not rename, resize, or convert.
- **Scroll distance:** 5000px pinned. The hero unpins after the full sequence completes.
- **Exit state:** The `#light-veil` fades to white/gold. The `#mission` section begins with a white-to-navy gradient that creates visual continuity from this exit.
- **Idle float:** Two GSAP loops on `#float-anchor` create organic drift before scrolling begins. These run independently from the ScrollTrigger timeline.

If the hero animation ever stops working, check: (1) GSAP CDN loaded, (2) `assets/being.png` path intact, (3) `#float-anchor` wrapper present inside `#stage`.

---

## Key Decisions Made

**Legacy CSS tokens retained** — `--navy`, `--navy-deep`, `--navy-lift`, `--gold`, `--gold-lt`, `--gold-dk` remain in `:root`. The hero CSS block references them. Do not remove until the hero is explicitly migrated to `--cfs-*` tokens.

**`#next-section` removed** — The placeholder div was replaced by `#mission`. The white-to-navy gradient logic was preserved in the Mission section's background.

**Mobile nav is CSS-only toggle** (no animation on open/close). This is intentional — the priority was correctness and simplicity. A transition could be added later with `max-height` animation.

**Initiatives are placeholder programmes** — "The Consciousness Index" and "The Society" are representative placeholders matching the CFS brand. They should be replaced with real initiatives when defined.

**Font loading** — Google Fonts uses `display=swap`. There will be a brief FOUT (flash of unstyled text) on first load. This is acceptable for the current stage; a self-hosted font setup would eliminate it.

**Section scroll animations use `gsap.from()`** — elements are initialised at `opacity: 0` on page load. Users navigating directly to an anchor (e.g. `/#mission`) may see a brief invisible state before the animation fires. This can be fixed with `immediateRender: false` if it becomes a reported issue.

---

## Deployment Checklist

Before going live:

- [ ] Replace all `[PLACEHOLDER]` content with real copy
- [ ] Add real speaker photos and names to `tcfsc2026.html`
- [ ] Connect registration form (Eventbrite or equivalent)
- [ ] Add LinkedIn and Instagram URLs to footer on both pages
- [ ] Add a `favicon.ico` to eliminate the harmless 404 console error
- [ ] Consider self-hosting Cormorant Garamond + Inter for FOUT elimination
- [ ] Add SRI integrity attributes to GSAP CDN `<script>` tags for production hardening
- [ ] Set up proper hosting (Netlify / Vercel / custom) with HTTPS
- [ ] Update meta descriptions and OG tags on both pages

---

## Dev Server

```bash
cd "ConsciousFuture VS-CODE"
python3 -m http.server 3000
# → http://localhost:3000
```
