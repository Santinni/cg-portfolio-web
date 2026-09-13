# Page-hero Phase 1 inventory (COD-82)

Read-only audit that completes Phase 1 of `docs/plans/2026-08-06-page-hero-layout-consolidation.md`.
No code changed. Measured by a Claude subagent with the Playwright and Figma MCP tools from a
controller packet; the controller checked the report against the plan and the page sources.

## Reproduction

- Date 2026-09-11 · commit `e2384cc6de47122422fc60bfbd7a63a9c376608b` (`feat/contact-link-icon-density`; the five routes are identical to `dev`) · working tree clean.
- URL `http://localhost:3000` (Next dev server, Turbopack). Figma file `cs38WzlXKY9xfDYBinoKel`, section nodes 7:11 / 74:286 / 7:201 / 7:169 / 7:238 (read with `get_metadata` + `get_screenshot` only).
- Viewports (CSS px): 1440×1000, 1024×1000, 768×1000, 390×844, 320×844. Theme: light (`localStorage["codeguy-theme"]="light"`, which `ThemeScript.tsx` reads into `html[data-theme]`; verified `data-theme="light"` on every page). Locale: `en` at all widths, `cs` at 1440 and 390. Fonts awaited (`document.fonts.ready`). Insights rendered against the live CMS (5 topic filters, posts present).
- Playwright viewport includes a 15.2 px classic scrollbar, so `hero.width` = viewport − 15.2. Same-origin iframes are blocked by the app CSP (`frame-ancestors 'none'`), so every width was measured with a real viewport resize.
- Playwright MCP wrote its own snapshot/console files under `<repo>/.playwright-mcp/` (tool side effect, git-ignored); no repository file was edited.
- Controller note: while this audit ran, the same dev server was briefly pointed at the
  COD-78, COD-80 and COD-81 verification commits (`8488ef7`, `0d37878`, `a429159`). None of them
  touches hero DOM or CSS on the five routes (navigation item, Insights filter bar below the
  hero, 404 boundary), so the measurements above are unaffected; the Insights "gap to next
  section" value (20 px to the first filter link) was taken before that switch.

## Code inventory

| | Work | Insights | Experience / About / Contact |
|---|---|---|---|
| Page file | `src/app/[locale]/(frontend)/(pages)/work/page.tsx` | `.../insights/page.tsx` | `.../experience/page.tsx`, `.../about/page.tsx`, `.../contact/page.tsx` |
| Hero DOM (server-rendered) | `main > header.hero > div.container.heroInner > p.eyebrow + h1.title + p.intro` | identical shape | `main > header.header > div.container.inner > p.eyebrow + h1.title + p.intro` (rendered by `PageIntro`) |
| Landmarks / ARIA | `header` nested in `main` (not a banner per HTML-AAM); no `aria-*`, no `id`, no `role` on hero or inner | same | same |
| h1 count / header count | 1 / 1 (site nav is `nav`, not `header`) | 1 / 1 | 1 / 1 each |
| CSS module | `work/WorkPage.module.css` `.hero .heroInner .title .intro` + `.heroInner > p:first-child` | `insights/InsightsPage.module.css` `.hero .heroInner .title .intro` (+ `.ctaInner` shares rules) + `.heroInner > p:first-child` | `src/components/site/PageIntro.module.css` `.header .inner .title .intro`; route modules contain **no** hero rules |
| Shared primitives | `Container`, `Eyebrow` | `Container`, `Eyebrow` | `PageIntro` (→ `Container`, `Eyebrow`); `Section` only for content below |
| Padding tokens | `--space-64` → `--space-96` @768 → `--space-128` @1280 | same as Work | `--space-64` → `--space-80` @768 → `--space-96` @1280 |
| Gap tokens | `--space-20` (all widths) | `--space-20` (all widths), `justify-items:start` | `--space-20` → `--space-24` @768 |
| Eyebrow color | `--action-primary` (override on `> p:first-child`) | `--action-primary` | `--text-secondary` (Eyebrow default) |
| h1 | `--font-size-h1/--line-height-h1`, 700, `max-width:20ch`, no tracking | same, `max-width:18ch` | same tokens, `max-width:920px`, `letter-spacing:-0.025em` |
| Lead | `--font-size-body-lg/--line-height-body-lg`, `--text-secondary`, `max-width:62ch` | same, `max-width:66ch` | same, `max-width:720px` |
| Gutter / container | `Container`: `width:min(100% - 2*var(--container-gutter), var(--container-max))`; gutter 20/48/64/120 @ 0/768/1024/1280, max 1200 (variables.css) | same | same |
| Breakpoints in hero CSS | 768, 1280 | 768, 1280 | 768, 1280 |
| Next sibling | `section.work` (`--section-block`) | `div.filterBar` (no padding; `ul.filters` padding 16) | `Section tone="raised"` (`--section-block`) |
| Optional slot | none | topic filters live **outside** the hero (`div.filterBar > nav > ul`) | Contact row lives in the following `Section`, not in the hero |
| Tests touching the hero | `e2e/work-insights-hero-parity.spec.ts` (hero bg = `--surface-page`, h1 color, nav contrast; EN+CS, light+dark); `e2e/launch.spec.ts` (exactly one visible `main h1`) | same two | `launch.spec.ts` only. No unit/component test for `PageIntro`, `Eyebrow`, `Section` (`src/__tests__/components` has none). No test asserts any hero geometry on any route |

Nav shell: `Navigation.module.css` is `position:fixed; top:0; height:var(--header-height)` (64 px, 72 px @≥1024), opaque `--surface-page`. `main` has `padding-top:0`; every page hero starts at document y=0, so the nav covers the top 64/72 px of the hero. The home hero compensates (`Hero.module.css: padding-top: calc(var(--header-height) + 104px)`); none of the five page heroes do.

## Rendered geometry (EN, light)

Columns: hero height · padding-top/bottom · gutter · gap (eyebrow→h1 = h1→lead) · h1 size/lh · h1 rendered w×h · lead size/lh · lead w×h · gap hero-bottom→next section's first leaf. `scrollWidth<=clientWidth` was true and `nextSection.top − hero.bottom = 0` in all 35 measurements.

| Route | 1440 | 1024 | 768 | 390 | 320 |
|---|---|---|---|---|---|
| Work | 480 · 128/128 · 120 · 20 · 48/56 · 647×112 · 18/28 · 704×56 · 121 | 390 · 96/96 · 64 · 20 · 36/44 · 486×88 · 17/27 · 665×54 · 113 | 390 · 96/96 · 48 · 20 · 486×88 · 657×54 · 97 | 397 · 64/64 · 20 · 20 · 335×132 · 335×81 · 89 | 512 · 64/64 · 20 · 20 · 265×220 · 265×108 · 89 |
| Insights | 480 · 128/128 · 120 · 20 · 48/56 · 583×112 · 18/28 · 749×56 · 20 (filter link) | 390 · 96/96 · 64 · 20 · 437×88 · 708×54 · 20 | 390 · 96/96 · 48 · 20 · 437×88 · 657×54 · 20 | 424 · 64/64 · 20 · 20 · 335×132 · 335×108 · 16 | 451 · 64/64 · 20 · 20 · 265×132 · 265×135 · 16 |
| Experience | 368 · 96/96 · 120 · 24 · 48/56 (ls −1.2px) · 920×56 · 18/28 · 720×56 · 96 | 322 · 80/80 · 64 · 24 · 881×44 · 720×54 · 88 | 366 · 80/80 · 48 · 24 · 657×88 · 657×54 · 72 | 424 · 64/64 · 20 · 20 · 335×132 · 335×108 · 64 | 451 · 64/64 · 20 · 20 · 265×132 · 265×135 · 64 |
| About | 452 · 96/96 · 120 · 24 · 920×112 · 720×84 · 96 | 349 · 80/80 · 64 · 24 · 881×44 · 720×81 · 88 | 393 · 80/80 · 48 · 24 · 657×88 · 657×81 · 72 | 451 · 64/64 · 20 · 20 · 335×132 · 335×135 · 64 | 505 · 64/64 · 20 · 20 · 265×132 · 265×189 · 64 |
| Contact | 424 · 96/96 · 120 · 24 · 920×112 · 720×56 · 96 | 366 · 80/80 · 64 · 24 · 881×88 · 720×54 · 88 | 366 · 80/80 · 48 · 24 · 657×88 · 657×54 · 72 | 512 · 64/64 · 20 · 20 · 335×220 · 335×108 · 64 | 583 · 64/64 · 20 · 20 · 265×264 · 265×135 · 64 |

Constant across all routes/widths: eyebrow `p` 11/16 px (12/16 @1280), 16 px tall; hero background `rgb(255,255,255)`; h1 color `--text-primary`; lead color `rgb(74,89,99)`; eyebrow color `rgb(10,110,128)` on Work/Insights vs `rgb(74,89,99)` on the PageIntro routes.

Czech (light): hero height · h1 w×h (lines) · lead h. 1440 → 390.

| Route | cs 1440 | cs 390 |
|---|---|---|
| /cs/work | 536 · 647×168 (3) · 56 | 468 · 335×176 (4) · 108 |
| /cs/insights | 480 · 583×112 (2) · 56 | 397 · 335×132 (3) · 81 |
| /cs/experience | 368 · 920×56 (1) · 56 | 380 · 335×88 (2) · 108 |
| /cs/about | 396 · 920×56 (1) · 84 | 451 · 335×132 (3) · 135 |
| /cs/contact | 480 · 920×168 (3) · 56 | 512 · 335×220 (5) · 108 |

Padding, gutter, gap and gaps-to-next were identical to EN at the same width; no clipping, no horizontal overflow, exactly one h1 on every Czech page.

## Figma geometry (1440, from `get_metadata`)

| Node | Frame h | Eyebrow y/h | H1 y / w×h | Lead y / w×h | Extra | Derived: top · eb→h1 · h1→lead · bottom |
|---|---|---|---|---|---|---|
| Work 7:11 | 519 | 104/17 | 153 / 1000×186 | 371 / 760×52 | — | 104 · 32 · 32 · 96 |
| Insights 74:286 | 512 | 104/16 (in 920 Content frame) | 140 / 920×136 | 296 / 920×56 | filters 372 / 920×36 | 104 · 20 · 20 (· 20 to filters) · 104 |
| Experience 7:201 | 495 | 104/17 | 149 / 1000×186 | 363 / 800×52 | — | 104 · 28 · 28 · 80 |
| About 7:169 | 537 | 104/17 | 149 / 980×186 | 363 / 800×78 | — | 104 · 28 · 28 · 96 |
| Contact 7:238 | 664 | 112/17 | 157 / 1050×243 | 428 / 800×52 | Contact row 45:576 at 508 / 700×44 | 112 · 28 · 28 (· 28 to row) · 112 |

All five frames sit at page y=72, i.e. below the 72 px nav band, so the Figma top padding is clearance *below* the nav. Screenshots (scratchpad `figma/*.png`): eyebrow is teal on all five; H1 glyphs are visibly larger than the web 48 px (Insights title box = 2 lines × 68 px, matching the `--font-size-display: 64px/68px` token; Work/Experience/About boxes are 186 px for 2 lines and Contact 243 px for 3 lines, so those text boxes are not auto-height and the exact size cannot be read from metadata).

## Figma vs web at 1440 (EN, light)

| Route | Gutter F/W | Clearance below nav F/W (web pt − 72) | Bottom pad F/W | eb→h1 F/W | h1→lead F/W | H1 measure F/W | Lead measure F/W |
|---|---|---|---|---|---|---|---|
| Work | 120/120 ✓ | 104 / **56** | 96 / **128** | 32 / **20** | 32 / **20** | 1000 box / 647 (20ch) | 760 / 704 (62ch) |
| Insights | 120/120 ✓ | 104 / **56** | 104 / **128** | 20/20 ✓ | 20/20 ✓ | 920 / 583 (18ch) | 920 / 749 (66ch) |
| Experience | 120/120 ✓ | 104 / **24** | 80 / **96** | 28 / **24** | 28 / **24** | 1000 / 920 | 800 / 720 |
| About | 120/120 ✓ | 104 / **24** | 96/96 ✓ | 28 / **24** | 28 / **24** | 980 / 920 | 800 / 720 |
| Contact | 120/120 ✓ | 112 / **24** | 112 / **96** | 28 / **24** | 28 / **24** | 1050 / 920 | 800 / 720 |

H1/lead measures: Figma boxes are wider than the rendered text on every route (Figma text wraps by content inside the box), so the web `max-width` values are narrower than the design boxes but the visible line breaks are content-driven; treated as design ambiguity, not a measured mismatch, until typography size is settled.

## Coverage matrix (route × width × locale; light theme only)

| Route | 1440 en/cs | 1024 en/cs | 768 en/cs | 390 en/cs | 320 en/cs |
|---|---|---|---|---|---|
| Work | measured / measured | measured / unverified | measured / unverified | measured / measured | measured / unverified |
| Insights | measured / measured | measured / unverified | measured / unverified | measured / measured | measured / unverified |
| Experience | measured / measured | measured / unverified | measured / unverified | measured / measured | measured / unverified |
| About | measured / measured | measured / unverified | measured / unverified | measured / measured | measured / unverified |
| Contact | measured / measured | measured / unverified | measured / unverified | measured / measured | measured / unverified |

Dark theme, forced-colors, 430 px, zoom 200/400 %, keyboard/focus: unverified on all routes. Figma geometry: measured at 1440 only (no tablet/mobile frames were requested).

## Findings (severity-ordered)

1. **Measured mismatch — high — all five routes.** Hero content sits 48–80 px too close under the fixed nav. Selector: `main > header` (`WorkPage.module.css .hero`, `InsightsPage.module.css .hero`, `PageIntro.module.css .header`). Figma 7:11/74:286/7:201/7:169: 104 px clearance, 7:238: 112 px. Actual at 1440: 56 px (Work, Insights), 24 px (Experience, About, Contact); at 1024: 24 / 8 px; at 768 (nav 64): 32 / 16 px; at 390/320: 0 / 0 px (hero `padding-top` 64 = nav height, eyebrow touches the nav edge). Cause: `main{padding-top:0}` and no `--header-height` term in any page hero, while the home hero uses `calc(var(--header-height) + 104px)`. Smallest fix: one `padding-block-start: calc(var(--header-height) + <token>)` rule in whatever owns the hero band (today: three places; after Phase 2: the primitive). Not fixable in `main` without re-checking the home hero and CV page which already compensate.
2. **Measured mismatch — medium — Experience, About, Contact.** Eyebrow color is `--text-secondary` (rgb 74,89,99); Figma 7:202/7:170/7:239 render teal (`--action-primary`, rgb 10,110,128), the same as Work/Insights, which match. Selector `PageIntro.module.css .inner > p.eyebrow`. Smallest fix: the same `> p:first-child { color: var(--action-primary) }` override Work/Insights carry, moved into the shared component (or an `Eyebrow tone="accent"` prop).
3. **Measured mismatch — medium — Work, Experience, About, Contact.** Eyebrow→H1 and H1→lead gaps: Figma 32 (Work) / 28 (Experience, About, Contact); actual 20 (Work) / 24 (PageIntro routes). Insights (20) matches. Selectors `.heroInner{gap}` / `PageIntro .inner{gap}`. Smallest fix: gap expressed per route through the primitive's semantic API (see Phase 2); tokens `--space-32`/`--space-24`+4 are missing a 28 step (`--space-28` does not exist in `variables.css`).
4. **Measured mismatch — medium — Work, Insights, Experience, Contact.** Hero bottom padding at 1440: Figma 96/104/80/112, actual 128/128/96/96 (About 96 ✓). Selectors as in finding 1. Note the bottom edge also forms the transition into the first section, whose own `--section-block` (96) adds on top; Figma frames for the following sections were not audited, so the *combined* rhythm is unverified.
5. **Design ambiguity / possible measured mismatch — medium — all five routes.** Figma H1 is visibly larger than the web 48/56 px; Insights title metadata (920×136 = 2×68) matches `--font-size-display 64/68`. Web uses `--font-size-h1`. Must be confirmed with a token/variable read before treating as a defect; if confirmed it is a single-rule change per hero owner (`.title{font-size:var(--font-size-display)}`).
6. **Missing implementation / design ambiguity — low — Contact.** Figma 7:238 places the contact row (45:576, 28 px under the lead) inside the hero frame; the web renders the contact methods in the next `Section` (heading + `ContactLink` list) and the hero has only three children. The plan's target architecture already lists the Contact row as a page-owned optional `actions` slot, so this is a slot-placement decision to record, not a bug to fix now.
7. **Subjective — low — Insights.** The filter bar's first link starts 20 px below the hero bottom (16 px `ul` padding); Figma 74:291 puts the filters 20 px under the intro *inside* the hero. Visually close at 1440; the 0.8 px `border-bottom` band and separate scroll container are not in Figma. Owned by `2026-08-06-insights-topic-filter-alignment.md`.
8. **Measured — informational.** Rendered H1 tracking differs by group (`-1.2px` on PageIntro routes, `normal` on Work/Insights). No Figma evidence either way from metadata; flag for the typography check in finding 5.

Nothing failed on the responsive side: no horizontal overflow at 320 px in either locale, Czech headings grow to 3–5 lines without clipping, exactly one H1 everywhere, `nextSection.top − hero.bottom = 0` everywhere (no double spacing at the hero/first-section boundary).

## Answer to the Phase 1 question

**Semantic output: identical.** Both groups server-render `main > header > div.container > p + h1 + p`, with no ARIA, no ids, no landmark roles, the same heading level, the same `Container` gutters (20/48/64/120) and the same breakpoint set (768, 1280). Different class names (`hero/heroInner/title/intro` vs `header/inner/title/intro`) are the only structural difference and are not a defect.

**Rendered output: differs, in four measurable properties, all group-level (not route-level):**

| Property | Work + Insights (local CSS) | Experience + About + Contact (`PageIntro`) | Figma |
|---|---|---|---|
| padding-block (0 / 768 / 1280) | 64 / 96 / 128 | 64 / 80 / 96 | 104-112 top, 80-112 bottom |
| grid gap (0 / 768) | 20 / 20 | 20 / 24 | 32 / 20 / 28 / 28 / 28 |
| eyebrow color | `--action-primary` | `--text-secondary` | `--action-primary` |
| h1 tracking / measures | normal; 20ch·18ch / 62ch·66ch | −0.025em; 920px / 720px | wider boxes, content-driven |

So the split is real duplication *and* both copies have drifted from Figma in different directions: Work/Insights got the eyebrow color right and the padding scale wrong; PageIntro got the padding scale closer and the eyebrow wrong; neither carries the nav-height compensation the home hero already has. Within the Work/Insights pair the only difference is the `ch` measures; Insights' `justify-items:start` has no visible effect on block children.

## Recommendation for Phase 2

Extract one primitive (evolve `PageIntro` rather than adding a fourth copy): it already owns the correct DOM contract and has three consumers. Slots and API, matching the plan's constraints:

- `eyebrow`, `title`, `lead` — required (`title` text stays the server-rendered H1).
- `controls` — optional, rendered after the lead inside the container, for the Insights filter `nav` (keeps URL state/`aria-current` outside the primitive; Figma nests it in the hero, so the slot belongs here even if the current filter bar stays where it is until the filter plan lands).
- `actions` — optional, for the Contact row (finding 6) and any future action row; both optional slots must render nothing when absent (no empty grid track).
- `spacing` (semantic, design-backed): `compact` = 20 (Insights), `default` = 28 (Experience, About, Contact), `relaxed` = 32 (Work) — needs a `--space-28` token or a `calc`.
- `titleMeasure` / `leadMeasure` — small enumerated set, not free px; today's five values collapse to two or three.
- Owned inside the primitive, applied once: `padding-block-start: calc(var(--header-height) + …)` (finding 1), eyebrow accent color (finding 2), h1 typography incl. tracking, bottom padding tokens, breakpoints.

Baseline for migration order step 2: **About** — its bottom padding already matches Figma (96), it has no optional slot, and its long lead exercises the measure at 320 px (189 px tall lead, no clipping). Characterize it with a component test for slot presence/absence and an E2E geometry probe (the measurement function used here: hero rect, computed paddings, gap, eyebrow color, one H1) before touching CSS.

## Untested combinations

- Dark theme and forced-colors on all routes (only `work-insights-hero-parity.spec.ts` covers dark, and only for colors on two routes).
- Czech at 1024, 768 and 320; 430 px in any locale.
- 200 % / 400 % zoom, keyboard focus order, hover/active states (no interactive element lives in any hero today).
- Figma tablet/mobile frames (none requested); exact Figma typography values (`get_design_context`/variables deliberately not called).
- Combined hero + first-section rhythm against the Figma section frames below each hero.
- Production build (`next build`) rendering; only the dev server was inspected.
