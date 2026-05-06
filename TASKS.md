# CFS Rebuild — Task Phases

> Always read BRIEF.md before starting any phase.
> Execute one phase at a time. Do not proceed to the next phase unless instructed.
> Be concise in reasoning. Minimize commentary. Prioritize file output over explanation.

---

## PHASE 1 — Audit & Plan (READ ONLY — no file writes except PLAN.md)

1. Detect and document the tech stack (framework, bundler, CSS approach, JS libraries)
2. Map the full project file structure (components, pages, assets, styles)
3. Identify and document:
   - Hero animation files and their entry point
   - GSAP / ScrollTrigger usage and dependencies
   - Existing CSS variables / design tokens / color system
   - All conference-specific content that needs to move to TCFSC 2026
   - Current navigation structure
4. Note any fragile or complex areas that need care during rebuild
5. Output a single file: **PLAN.md**

PLAN.md must include:
- Stack summary
- File map (key files only, not exhaustive)
- Hero file(s) — flagged as DO NOT MODIFY
- List of conference content to migrate
- Proposed new file/component structure
- Any risks or dependencies to flag

**Stop after writing PLAN.md. Do not modify any other files.**

---

## PHASE 2 — Navigation & TCFSC 2026 Page

> Read BRIEF.md and PLAN.md before starting.

1. Add "TCFSC 2026" to the navigation (consistent with existing nav style)
2. Create the TCFSC 2026 page/route
3. Move ALL conference-specific content from homepage into TCFSC 2026:
   - Speaker sections
   - Schedule / agenda
   - Registration / event content
   - Conference descriptions
   - Sponsor / partner sections
   - Event logistics
4. Preserve all content exactly — reorganize only, do not delete or rewrite
5. Apply consistent CFS design system to the TCFSC 2026 page
6. Verify homepage no longer contains conference-specific sections
7. Verify navigation links correctly to both homepage and TCFSC 2026

**Do not modify the hero animation. Do not rebuild homepage sections yet.**

---

## PHASE 3 — Design System

> Read BRIEF.md and PLAN.md before starting.

Implement or consolidate the CFS design system as CSS custom properties (or equivalent for the detected stack):

```
Color tokens:
  --cfs-navy: (deep navy base)
  --cfs-navy-light: (slightly lighter navy)
  --cfs-gold: (primary gold accent)
  --cfs-gold-muted: (secondary gold, lower opacity)
  --cfs-blue-glow: (subtle blue illumination)
  --cfs-white: #ffffff
  --cfs-text-primary: (near-white)
  --cfs-text-secondary: (muted/grey tone)

Typography tokens:
  --font-display: (primary elegant serif or display font)
  --font-body: (clean readable sans-serif)
  --font-size-hero: 
  --font-size-h1 through --font-size-body

Spacing tokens:
  --space-xs through --space-3xl

Motion tokens:
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
  --duration-slow: 1000ms
  --duration-base: 600ms
  --duration-fast: 300ms
```

Apply design tokens across all existing and new components.
Ensure TCFSC 2026 page uses the same system.

---

## PHASE 4 — Homepage Sections (Post-Hero)

> Read BRIEF.md and PLAN.md before starting.
> Reference vividand.co structure for section pacing and layout rhythm.

Build the following homepage sections after the hero:

### 4.1 — Mission Section
- What CFS is and why it exists
- Refined typography, large statement text
- Minimal, high-impact layout
- Subtle entrance animation on scroll

### 4.2 — Philosophy Section
- The relationship between consciousness, science, technology, leadership, society
- Modular layout (e.g. 3–4 thematic pillars or a narrative block)
- Premium spacing, elegant typography hierarchy

### 4.3 — Initiatives Section
- Current and upcoming CFS programs/projects
- Card or grid layout, modular
- Each initiative: title, short description, optional CTA

### 4.4 — Vision Section
- Long-term direction of the movement
- Cinematic feel — large type, atmospheric layout
- Should evoke forward momentum and scale

### 4.5 — Involvement / Community Section
- How to engage, join, get involved
- CTA-forward: email capture, join link, or inquiry
- Warm but premium tone

**Design rules for all sections:**
- Feel like a natural continuation of the hero animation
- Deep navy base, gold accents, subtle blue highlights
- Use --cfs-* tokens throughout
- Generous whitespace — do not crowd sections
- Sections support the hero, they do not compete with it
- Content is placeholder/sample — do not invent detailed copy, use meaningful placeholders

---

## PHASE 5 — Motion & Polish

> Read BRIEF.md before starting.

1. Add scroll-triggered entrance animations to Phase 4 sections:
   - Fade + translate-up on section entry
   - Stagger children elements where appropriate
   - Use GSAP ScrollTrigger (already in project)
   - Keep animations subtle — not every element needs to animate

2. Ensure smooth visual handoff from hero into Mission section:
   - Review the hero's exit state
   - First content section should feel like it emerges from the hero
   - Avoid visual jarring or abrupt color/tone shifts

3. Responsiveness pass:
   - All Phase 4 sections mobile-responsive
   - Typography scales correctly
   - Navigation works on mobile
   - TCFSC 2026 page responsive

4. Performance check:
   - No unnecessary repaints or layout thrash
   - Animations use transform/opacity only
   - No blocking scripts introduced

5. Final consistency pass:
   - Design tokens used consistently throughout
   - No inline styles that contradict the design system
   - Navigation correct and functional

---

## PHASE 6 — QA & Handoff

1. Full page review checklist:
   - [ ] Hero animation intact and untouched
   - [ ] Homepage has no conference-specific content
   - [ ] TCFSC 2026 page has all conference content
   - [ ] Navigation includes TCFSC 2026 and routes correctly
   - [ ] All design tokens applied consistently
   - [ ] Scroll animations working
   - [ ] Hero-to-content transition smooth
   - [ ] Mobile responsive across all pages
   - [ ] No console errors
   - [ ] No placeholder assets missing

2. Output a brief **HANDOFF.md** noting:
   - What was built
   - What still needs real copy/content
   - Any manual integration notes for the hero animation
   - Any decisions made that the owner should know about
