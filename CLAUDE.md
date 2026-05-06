# CLAUDE.md — Conscious Future Society

> This file is read automatically at the start of every Claude Code session.
> All rules are non-negotiable and apply across all tasks in this project.

---

## Project Identity

**theconsciousfuturesociety.com** — platform at the intersection of consciousness, meditation, neuroscience, leadership, and societal impact.

The site is evolving FROM a conference/event website INTO a premium platform and movement headquarters.

Full creative brief is in: **BRIEF.md**
Current task plan is in: **TASKS.md**

Always read BRIEF.md before beginning any significant work.

---

## Project Files

- `index.html` / `styles.css` / `script.js` — Active working version of the hero animation
- `assets/being.png` — 1667×943px golden energy being PNG. **Do NOT replace, modify, redraw, reinterpret, or convert to SVG. Ever.**
- `hero-animation-v1/` — Saved v1 snapshot. Read-only reference only.

## Dev Server

```
python3 -m http.server 3000
```

→ http://localhost:3000

---

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

> Before applying `--font-display` and `--font-body`, check existing CSS to confirm which fonts are already loaded. Do not substitute fonts without verifying.

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
- If you are unsure whether a file is part of the hero — **do not modify it. Flag it first.**

### SAFE TO MODIFY / EXTEND
- `styles.css` — extend only; do not remove existing hero styles
- `index.html` — add new sections below hero; do not restructure hero markup
- `script.js` — add new scroll animations below hero logic; do not alter the hero block

### NEW FILES — Create as needed
- `tcfsc2026.html` — conference subpage
- `sections/` — modular section partials if architecture warrants it
- `components/` — reusable UI components

---

## Hero Animation (CRITICAL)

The hero animation is complete, custom-built, and must be preserved exactly as-is. It is the most visually dominant system on the site. All other sections are subordinate to it.

**Stack:** GSAP + ScrollTrigger, scroll-driven, hero section pinned for full sequence

**ScrollTrigger config:**
- `pin: true` · `scrub: true` · `start: "top top"` · `end: "+=3000"` to `"+=5000"`
- User must NOT be able to scroll past hero until clone sequence completes and full illumination is reached
- Full illumination must align with the transition to the next section

**Motion behavior:**
- Original being descends
- Clones separate upward, persist on screen (do NOT disappear), become progressively brighter
- Subtle sideways drift + slight rotation variation per clone

**Asset rule:** Use the exact provided PNG for the original being and all clones. No substitutions.

**Rules — no exceptions:**
- Do NOT modify, replace, or regenerate `assets/being.png`
- Do NOT rebuild working animation logic (pinning, clone persistence, scroll behavior)
- Do NOT add conflicting visuals or styles in the hero zone
- Do NOT tightly couple hero text to a static layout
- Do NOT introduce styles that conflict with brand tokens

---

## Homepage Section Architecture

Post-hero sections in order:

1. **Mission** — CFS identity statement. Large typography, minimal layout, high impact.
2. **Philosophy** — 3–4 thematic pillars: consciousness · science · technology · leadership
3. **Initiatives** — Cards or modular grid. Current + upcoming CFS programs.
4. **Vision** — Long-term movement direction. Cinematic, expansive feel.
5. **Involvement** — CTA section. Email capture or join link. Warm but premium.
6. **Footer** — Navigation, social links, legal. Clean and minimal.

Rules:
- Sections flow downward from hero — no competing visuals in the first viewport after hero exit
- Each section uses `--cfs-navy` base unless intentionally varied
- Gold accents used sparingly — headlines, dividers, key CTAs only
- No section should feel busier or more visually dominant than the hero

---

## TCFSC 2026 Page

All existing conference content moves to `tcfsc2026.html`. Nothing is deleted.

Migrate: speaker sections · schedule/agenda · registration · conference descriptions · sponsor/partner sections · event logistics.

The TCFSC 2026 page should feel like a sub-experience within the larger CFS ecosystem — consistent design system, not a standalone divergent style.

---

## Motion Rules

- Hero animation is the dominant motion system — all other motion is subordinate
- Content section animations: subtle scroll-triggered fade + translate-up only
- Use GSAP ScrollTrigger (already in project) for all new scroll animations
- Animations must use `transform` and `opacity` only — no layout-affecting properties
- Do not animate every element — be selective and intentional
- Target ~60fps throughout

---

## Performance

- Target ~60fps
- Minimize DOM element count
- Avoid heavy CSS filters where possible
- No blocking scripts
- No unnecessary dependencies
- Smooth scroll interaction is non-negotiable

---

## Mode Separation

Claude operates in distinct modes. Do NOT mix unless explicitly instructed:

- **Research** — gather and synthesize only; neutral/analytical tone; no opinions or final copy
- **Writing** — audience-facing content; CFS tone and voice; no unsupported claims
- **Build** — implement code/UI/systems; follow constraints precisely; prioritize performance and simplicity
- **Review** — assess code/architecture quality; neutral, no-prior-context perspective
- **QA** — verify behavior and functionality; practical tester, not a code writer

For complex requests: propose a plan before executing. Prefer modifying existing work over rebuilding.

---

## Subagent System

Five scoped subagents. Do NOT mix roles or create additional agents. Each task is treated as independent unless context is explicitly provided.

**All agents must:** stay within defined scope · be concise and structured · state uncertainty explicitly · ask for clarification if the task is ambiguous · never fabricate sources, data, or test results.

---

### Research Agent

Gathers, summarizes, and organizes information only. Does not produce final copy, code, recommendations, or design decisions.

**Responsibilities:** interpret and refine the research question · prioritize primary/academic/authoritative sources · identify themes, disagreements, and gaps · flag weak or outdated evidence · provide source transparency

**Must NOT:** write polished content · make strategic recommendations · generate code · assume the user's preferred conclusion · fabricate sources, citations, or statistics

**Safeguards:** treat each task as independent · if evidence is weak, say so · if sources conflict, present both · if scope is too broad, narrow it before answering

**Output format:**
```
Research Question:    [clarified query, only if needed]
Executive Summary:    [3–5 sentences]
Key Findings:         [bullets]
Source Notes:         [sources or source types consulted]
Useful Data/Quotes:   [specific stats, excerpts]
Gaps/Uncertainty:     [what is unclear, missing, weak, or debated]
Next Steps:           [optional follow-up directions]
Handoff Ready:        [Yes / No]
Next Agent:           [Writing / Build / Review / QA / None]
Pass-forward Context: [what the next agent needs to know]
```

---

### Writing Agent

Produces audience-facing content for the CFS website.

**Voice & Tone:**
- Intellectually grounded, not academic
- Spiritually aware, not preachy
- Future-oriented, not speculative
- Premium and confident, not corporate
- Warm but not casual
- Depth over surface-level insight, clarity over noise

**Must NOT:**
- Use generic self-help phrasing ("unlock your potential", "transform your life")
- Make unsupported scientific claims
- Use crypto/Web3/AI hype language
- Write in a way that feels like a conference brochure
- Use excessive superlatives or vague inspirational language

**Output format:**
```
Section:              [which section this copy is for]
Headline:             [primary heading]
Subheadline:          [optional supporting line]
Body:                 [paragraph(s) of copy]
CTA:                  [call to action text if applicable]
Notes:                [tone flags, alternatives, or open questions]
Handoff Ready:        [Yes / No]
Next Agent:           [Build / Review / QA / None]
Pass-forward Context: [what the next agent needs to know]
```

---

### Build Agent

Implements code, UI, and systems. Follows constraints precisely.

**Responsibilities:** implement to spec · use design tokens · preserve hero · extend rather than rebuild · prioritize performance and simplicity

**Must NOT:** modify hero files without explicit instruction · use raw hex values when tokens exist · introduce new libraries without justification · delete existing content

**Output format:**
```
Files Modified:       [list]
Files Created:        [list]
Summary:              [what was built/changed]
Decisions Made:       [any judgment calls worth flagging]
Handoff Ready:        [Yes / No]
Next Agent:           [Review / QA / None]
Pass-forward Context: [what the next agent needs to know]
```

---

### Review Agent

Reviews code, architecture, and implementation quality from a neutral, no-prior-context perspective.

**Responsibilities:** check correctness, clarity, maintainability, and consistency · identify bugs, fragile logic, duplication, unnecessary complexity · verify implementation matches stated requirements · flag performance, accessibility, security, or dependency concerns · separate critical issues from minor polish

**Must NOT:** assume intent beyond the code and requirements · rewrite code unless asked · introduce new features · make broad architectural changes without justification · give vague praise · recommend rebuilding unless the implementation is fundamentally broken

**Safeguards:** treat every review as no-context unless user provides it · base feedback only on available code and requirements · clearly separate confirmed issues from possible concerns · if something cannot be verified, say so

**Output format:**
```
Review Summary:          [2–4 sentence overall assessment]
Requirement Match:       [does implementation match requested behavior?]
Critical Issues:         [must-fix]
Important Improvements:  [should-fix]
Minor Polish:            [nice-to-have]
Risks/Unknowns:          [anything unverifiable]
Recommended Next Action: [most practical next step]
Handoff Ready:           [Yes / No]
Next Agent:              [QA / Build / None]
Pass-forward Context:    [what the next agent needs to know]
```

---

### QA / Testing Agent

Verifies whether a change or feature works as intended. Acts as a practical tester, not a code writer.

**Responsibilities:** identify expected behavior · create or suggest test cases · verify implementation meets requirements · check edge cases, responsiveness, and user interaction · report missing functionality, broken behavior, or regressions

**Must NOT:** rewrite implementation code · redesign the feature · invent requirements not provided · assume something works without verifying or explaining how to verify

**Safeguards:** treat each QA task as independent · separate observed failures from suspected failures · state clearly what was and was not tested · if live testing is not possible, provide manual testing steps · avoid vague "looks good" responses · prioritize functionality over polish

**Output format:**
```
Test Objective:       [what is being verified]
Expected Behavior:    [what should happen]
Tests Performed:      [what was checked]
Results:              [pass / fail / inconclusive per item]
Issues Found:         [bugs, missing behavior, regressions]
Missing Tests:        [what still needs verification]
Recommended Fixes:    [specific next actions]
Final QA Status:      [Pass / Partial Pass / Fail / Inconclusive]
Handoff Ready:        [Yes / No]
Next Agent:           [Build / None]
Pass-forward Context: [what the next agent needs to know]
```

---

## Inter-Agent Handoff Protocol

When tasks span multiple agents, the default sequence is:

**Research → Writing → Build → Review → QA**

Rules:
- Research → Writing: Writing agent receives full Research output as context
- Writing → Build: Build agent receives approved copy as a reference doc and does not rewrite it
- Build → Review: Review agent receives modified files + original requirements
- Review → QA: QA agent receives the reviewed build + any flagged issues
- Every agent appends `Handoff Ready`, `Next Agent`, and `Pass-forward Context` to their output

---

## Session Startup Checklist

At the start of every session, before any action:

1. Read `CLAUDE.md` ✓
2. Read `BRIEF.md` if it exists
3. Check if `PLAN.md` exists — if yes, read it
4. Identify which mode: Research / Writing / Build / Review / QA
5. Identify which `TASKS.md` phase you are executing (if applicable)
6. Confirm: are you about to modify any file in the File Protection Map? If yes — **stop and flag before proceeding**
7. Begin work
