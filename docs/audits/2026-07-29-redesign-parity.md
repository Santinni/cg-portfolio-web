# Redesign parity audit: Home parity feature branch against approved Figma

Audit date: 2026-07-29

Repository: `cg-portfolio-web`

Audited source: `fix/home-responsive-parity` at `2e484a7` (the audited code revision; subsequent commits in this closeout change documentation only)

Integration base: `dev` at `ceaeefb29ac4bc76402266e15b55bf0c63f1dfc7`

Verified pre-audit CI implementation source: branch `ae119a8e27017dd612313c4851c0e6505ecbaa6a`, tested as pull-request merge commit `77b12deae59bcec3e99145a34c00e798a0d9067c`

Figma file: `cs38WzlXKY9xfDYBinoKel`

Mode: post-implementation evidence record; this audit update does not change Figma or application code.

## Executive decision

The Home parity package on `fix/home-responsive-parity` now implements and verifies the approved responsive Home composition for English and Czech. English geometry is checked against Figma at 1440, 768, 430, 390, and 320 px; Czech preserves the same section, containment, and responsive contracts while allowing content-led wrapping. Light geometry is covered at every target width, the real theme control proves invariant light-to-dark geometry at 1440 and 390 px, and the Home accessibility and localized SEO contracts pass.

No P0 defect was found. RPA-005 is fixed on this feature branch. The broader redesign is not yet ready to be described as complete because release-blocking findings outside this package remain:

- the shared Button does not implement the canonical Figma size, radius, kind, and state matrix;
- Navigation omits approved variants and current-route semantics;
- an open mobile dialog can become invisible and keep the page scroll-locked after resizing to desktop;
- the open mobile menu omits the approved brand header, centered link composition, and profile footer.

The earlier unweighted overall parity estimate is obsolete. It was an expert estimate without a reproducible weighting and pixel-diff method. This audit uses finding status plus release impact instead.

## Status vocabulary

Every historical finding has exactly one current status:

- `still-valid` — current Figma and source/runtime evidence still demonstrate the defect;
- `fixed-by-i18n` — the localization implementation removed the original defect;
- `fixed-on-feature-branch` — the audited feature branch implements and verifies the scoped correction, pending integration into `dev`;
- `partially-fixed-on-feature-branch` — the audited feature branch verifies its scoped correction, while a broader recorded scope remains open;
- `needs-reverification` — current runtime data or a deterministic fixture is missing;
- `obsolete` — the original claim no longer maps to the current product or design.

Every finding also has exactly one release disposition:

- `release-blocking` — must be resolved before the requested redesign release from `dev` to `main`;
- `resolved-on-feature-branch` — the blocker is resolved in the audited branch and awaits integration into `dev`;
- `can-wait` — may be deferred with the finding recorded in the release PR.

## Current evidence

### Git and application state

- The audited code revision is `fix/home-responsive-parity` at `2e484a7`, based on `dev` at `ceaeefb29ac4bc76402266e15b55bf0c63f1dfc7`.
- The only code-revision difference from the verified implementation source `ae119a8e27017dd612313c4851c0e6505ecbaa6a` is formatter-only commit `2e484a7`; repository-wide `pnpm format:check` passes at the audited code revision.
- The authoritative pre-audit browser run checked out pull-request merge commit `77b12deae59bcec3e99145a34c00e798a0d9067c`.
- English remains unprefixed; Czech uses `/cs`.
- The language switch preserves the route, query, and hash by performing a full document navigation.
- Home compact copy is localized independently where the approved responsive composition requires shorter presentation copy; identifiers, routes, and structured work data remain locale-neutral.

### Current Figma inventory

The complete 11-page file was re-enumerated on 2026-07-29. Root metadata was not treated as a complete inventory.

| Surface | Node | Current reference |
|---|---|---|
| Components page | `4:3` | Canonical shared component contracts |
| Desktop Home | `6:2` | 1440 × 3725 |
| Tablet Home | `7:377` | 768 × 3090 |
| Mobile Home | `8:87` | 390 × 3532 |
| Responsive Home | `8:140` | 320 × 3484 |
| Responsive Home | `8:193` | 430 × 3486 |
| Dark desktop Home | `8:246` | 1440 × 3725 |
| Dark mobile Home | `8:325` | 390 × 3532 |
| Button component set | `21:110` | 54 normal-button variants |
| Navigation component set | `21:357` | 24 desktop/tablet/mobile variants |
| Nav Link component set | `44:60` | Default/Hover/Current/Focus × Default/Inverse |
| Open mobile menu | `27:49` | 390 × 844 |
| Editorial Empty/Loading/Error | `77:419`, `77:423`, `77:427` | 640 × 240 state panels |

The Button contract is unchanged: Primary/Secondary/Quiet × Default/Hover/Active/Focus/Disabled/Loading × SM/MD/LG. Heights are 36/44/52 px, corner radius is 4 px, and inline padding is 12/16/20 px.

The Navigation contract is unchanged: desktop is 1200 × 72; tablet and mobile are 768/390 × 64. It includes transparent, solid, and inverse themes plus default, scrolled, and compact menu-open states.

### CI standalone runtime and automated evidence

GitHub Actions run `30471772408` built and tested a standalone production runtime on localhost with PostgreSQL 15. All pull-request jobs passed:

| Gate | Result |
|---|---|
| Generated Payload types | PASS — `pnpm generate:types` produced no `src/payload-types.ts` diff |
| TypeScript and ESLint | PASS — Code quality job |
| Editorial/security and Vitest suites | PASS — Unit and integration job |
| Biome format check | PASS locally at audited code revision `2e484a7` — 146 files |
| Fresh production build | PASS — standalone artifact assembled from the checked-out PR merge SHA |
| Chromium production suite | PASS — 178/178 tests |
| Runtime revision/readiness | PASS — shallow and deep health returned the exact `APP_REVISION`; deep database check returned `ok` |
| Browser evidence retention | PASS — artifact `8732047424`, `playwright-evidence-30471772408-77b12deae59bcec3e99145a34c00e798a0d9067c`, retained until 2026-08-12 |

The browser report annotates the immutable checked-out revision and relevant Figma node. The workflow supplies `APP_REVISION: ${{ github.sha }}`, retains the report on success or failure, and names the artifact with both run and revision.

Verified Home evidence includes:

- English and Czech Home at 1440, 768, 430, 390, and 320 px in light mode;
- a real light-to-dark theme-control transition at 1440 and 390 px in both locales, with section geometry invariant;
- accessibility contracts at 1440 × 900 and 390 × 844, light and dark, in both locales;
- localized exact Home title, description, canonical, `en`/`cs`/`x-default`, Open Graph locale/URL/type, and indexability;
- visible-descendant and document overflow checks at all five target widths in both locales.

Known residual: the raw Next.js error document for a missing dynamic CMS article has no `html[lang]`. This is a new P2 follow-up and does not reopen RPA-013.

Current Home geometry contract:

| Viewport | Figma Home node | English Figma main height | Verified behavior |
|---:|---|---:|---|
| 1440 | `6:2` | 3725 px | Exact section geometry within rounding tolerance |
| 768 | `7:377` | 3090 px | Exact section geometry within 3 px |
| 430 | `8:193` | 3486 px | Exact geometry when no gutter; measured content-led Selected Work growth with a 15 px reserved scrollbar gutter |
| 390 | `8:87` | 3532 px | Exact geometry when no gutter; measured content-led Hero growth with a 15 px reserved scrollbar gutter |
| 320 | `8:140` | 3484 px | Exact geometry when no gutter; measured content-led Flagship and Principles growth with a 15 px reserved scrollbar gutter |

The 15 px cases model browser topology explicitly: the document viewport remains the requested width while the body reserves a vertical-scrollbar gutter. The tests require the measured wrap growth only in the affected content section, carry that delta through subsequent section positions and total height, and continue to require containment, adjacency, ordering, and zero visible-descendant overflow. Czech is not forced to an English fixed height; it must preserve the same responsive and semantic contract with natural localized wrapping.

## Finding ledger

| ID | Current status | Priority | Release | Current conclusion |
|---|---|---:|---|---|
| RPA-001 | `still-valid` | P1 | `release-blocking` | Button geometry/API still conflicts with `21:110`. |
| RPA-002 | `still-valid` | P2 | `can-wait` | Disabled/loading styles are still not composed per kind. |
| RPA-003 | `still-valid` | P1 | `release-blocking` | Navigation still flattens `21:357` and lacks current-route semantics. |
| RPA-004 | `still-valid` | P1 | `release-blocking` | Resize can leave an invisible modal and body scroll lock. |
| RPA-005 | `fixed-on-feature-branch` | P1 | `resolved-on-feature-branch` | Home matches the approved responsive composition across the complete EN/CS target matrix; integration into `dev` remains pending. |
| RPA-006 | `still-valid` | P1 | `can-wait` | Work still implements a different layout/content revision. |
| RPA-007 | `still-valid` | P1 | `can-wait` | Case-study template still adds unapproved composition and rhythm. |
| RPA-008 | `still-valid` | P1 | `can-wait` | About/Experience/Contact still contain materially different sections. |
| RPA-009 | `needs-reverification` | P1 | `can-wait` | Current published CMS article data is not a stable audit fixture. |
| RPA-010 | `still-valid` | P1 | `release-blocking` | ShareBar foreground token still fails the light-theme contract. |
| RPA-011 | `still-valid` | P2 | `can-wait` | Article composition/tokens remain incomplete. |
| RPA-012 | `still-valid` | P2 | `can-wait` | Theme control and CV theme scope remain inconsistent. |
| RPA-013 | `fixed-by-i18n` | P2 | `can-wait` | Missing insight slugs now return a genuine branded noindex 404. |
| RPA-014 | `partially-fixed-on-feature-branch` | P2 | `can-wait` | Home descendant-overflow coverage is fixed and verified at all target widths/locales; global public-route scope remains open. |
| RPA-015 | `partially-fixed-on-feature-branch` | P2 | `can-wait` | Computed geometry, state, accessibility, SEO, and revision evidence is substantially expanded; a pinned screenshot baseline remains open. |
| RPA-016 | `still-valid` | P3 | `can-wait` | Portfolio and CV still expose different email addresses. |
| RPA-017 | `still-valid` | P1 | `release-blocking` | Mobile menu still diverges from prototype `27:49`. |
| RPA-018 | `still-valid` | P2 | `can-wait` | Editorial states remain centered/skeletal instead of the approved panels. |

## Reproducible evidence matrix

Feature-branch source paths refer to audited code revision `2e484a7`. Authoritative pre-audit runtime evidence refers to the same implementation before its formatter-only normalization, branch `ae119a8e27017dd612313c4851c0e6505ecbaa6a`, built at pull-request merge commit `77b12deae59bcec3e99145a34c00e798a0d9067c` in Actions run `30471772408`. Historical runtime is explicitly retained only as supporting evidence from the 2026-07-28 audit and is not represented as a new measurement.

| ID | Figma node | Web target | Viewport / theme / locale | Evidence type |
|---|---|---|---|---|
| RPA-001 | `21:110` | shared `Button`; Home CTAs | 1440 and 390 / light / EN; 390 / light / CS | Current Figma screenshot/design context, current source, current computed browser geometry |
| RPA-002 | `21:110` | shared `Button` state selectors | component matrix / light and dark / locale-independent | Current Figma state matrix and current CSS/API inspection; no claim that a live route currently exercises loading/disabled |
| RPA-003 | `21:357`, `44:60` | shared Navigation and route links | 1440, 768, 390 / light; dark references inspected / EN and CS | Current Figma screenshots/inventory, current source, current navigation geometry |
| RPA-004 | `21:357`, `27:49` | open compact dialog resized from 390 to 1024 | 390→1024 / light / EN | Current state-ownership/CSS inspection plus historical runtime reproduction; fresh production-mode regression required after the fix |
| RPA-005 | `6:2`, `7:377`, `8:87`, `8:140`, `8:193`, `8:246`, `8:325` | `/`, `/cs` Home | 1440, 768, 430, 390, 320 / light; real light→dark toggle at 1440 and 390 / EN and CS | Current Figma screenshots/properties, feature source, exact English integrated geometry with measured 15 px scrollbar-topology allowances, content-led Czech wrapping, and retained CI report |
| RPA-006 | `7:2`, `7:262`, `7:430` | `/work`, `/cs/work` | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current source, historical runtime screenshots/measurements |
| RPA-007 | `7:48`, `7:94`, `7:127`, `7:292`, `8:2` | all `/work/[slug]` and localized equivalents | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current shared-template source, historical runtime screenshots/measurements |
| RPA-008 | `7:160`, `7:192`, `7:229`, `7:321`, `7:333`, `7:355`, `8:31`, `8:43`, `8:65` | About, Experience, Contact in EN/CS | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current localized source/content, historical runtime screenshots/measurements |
| RPA-009 | `74:264`, `74:342`, `76:2`, `76:95`, `76:203`, `76:304` | Insights and article routes | 1440, 768, 390 / light / EN canonical, CS redirect | Current Figma node inventory and current route/component source; runtime article parity intentionally pending a stable CMS fixture |
| RPA-010 | `71:183` | `.action` in ShareBar on `/insights/[slug]` | responsive / light and dark / EN canonical | Current Figma component inventory and current semantic-token/CSS inspection |
| RPA-011 | `71:136`, `72:156`, `72:166`, `72:182` | article composition | 1440, 768, 390 / light and dark / EN canonical | Current Figma component inventory and current route/export/token inspection |
| RPA-012 | `8:246`, `8:325`, `77:2`, `77:115`, `21:357` | ThemeToggle, Home, Insights, article, CV | 1440 and 390 / dark / EN and CS public routes | Current dark Figma screenshots/inventory and current theme/layout/CV source; Home uses the real toggle only to prove geometry and does not close the control-state finding |
| RPA-013 | `7:247`, `7:366`, `8:76` | missing `/insights/[slug]` | 1440 and 390 / light / EN canonical | Current route source, raw HTTP status, and current Chromium E2E for 404/branded/noindex behavior |
| RPA-014 | `8:140`, `8:193` | Home responsive surface and global public-route overflow guard | 320, 390, 430, 768, 1440 / light / EN and CS; dark Home at 1440 and 390 | Figma QA frames plus document and visible-descendant bounding-box scans across the complete Home matrix; non-Home public routes remain unverified by this descendant scan |
| RPA-015 | `4:3`–`4:8` | Playwright/Vitest/CI parity coverage | Home target matrix / light and dark / EN and CS | Computed geometry/state, a11y, localized SEO, health/revision, production-build, and retained-report evidence; no claim of an automated Figma screenshot baseline |
| RPA-016 | `7:229`, `7:355`, `8:65` | Contact and CV contact strip | 1440, 768, 390 / light / EN and CS | Current Figma node inventory and current public content/source comparison |
| RPA-017 | `27:49`, `21:357` | open mobile menu | 390 × 844 / light; inverse variants inventoried / EN and CS controls | Current Figma prototype/navigation screenshots and current dialog markup/CSS |
| RPA-018 | `77:419`, `77:423`, `77:427` | `EditorialState` on Insights | 640 × 240 reference; responsive web / light and dark / localized state copy | Current Figma state screenshots/inventory and current component/CSS/route source |

## Detailed current findings

### RPA-001 — Button contract and geometry

- **Expected:** Figma `21:110`; 36/44/52 px heights, 4 px radius, 12/16/20 px inline padding, and Primary/Secondary/Quiet variants.
- **Current:** `Button.module.css` retains a 44 px global minimum, 24 px base inline padding, pill radius, and size classes that alter padding without enforcing the canonical height/type contract. The component API still exposes `transparent`, `text`, `accent`, `rounded`, and independently selectable text sizes.
- **Evidence:** `src/app/(frontend)/components/primitives/button/index.tsx`; `Button.module.css`.
- **Smallest fix:** implement the canonical kind/size/state model, migrate public CTA call sites, and keep icon-only behavior separate.

### RPA-002 — Disabled and loading Button states

- **Expected:** visible, stable disabled/loading state for every kind.
- **Current:** the loader always uses the on-primary color; the label becomes transparent; generic disabled styling can lose to variant hover specificity.
- **Evidence:** `Button.module.css` loading, disabled, and hover rules.
- **Smallest fix:** use per-kind state properties, `currentColor` for the loader, and hover/active guards.

### RPA-003 — Navigation variant and route state

- **Expected:** Figma `21:357` and `44:60`, including 72 px desktop, 64 px compact, transparent/solid/inverse, scrolled/menu-open, and Current state.
- **Current:** one fixed, blurred, bordered 64 px shell; desktop begins at 1024 px; links do not read pathname or emit `aria-current`.
- **Evidence:** `src/app/(frontend)/components/ui/navigation/index.tsx`; `Navigation.module.css`.
- **Smallest fix:** derive current route, mode, theme, and scroll state explicitly and map the locale/theme controls into the approved responsive composition.

### RPA-004 — Invisible modal after responsive resize

- **Expected:** resizing an open compact menu to desktop closes the dialog and releases body scroll lock.
- **Current:** React owns dialog/open/scroll-lock state while CSS alone hides the dialog from 1024 px. No `matchMedia` or resize cleanup exists.
- **Evidence:** Navigation effects and the `min-width: 1024px` `.mobileMenu { display:none }` rule.
- **Smallest fix:** close the native dialog when the desktop media query begins and add a resize/orientation E2E test.

### RPA-005 — Home parity

- **Expected:** frames `6:2`, `7:377`, `8:87`, `8:140`, and `8:193`, including exact section order, typography, spacing, cards, and CTA treatment in English; Czech must preserve the same layout contract while wrapping naturally.
- **Current:** fixed on `fix/home-responsive-parity`. Hero, Flagship, Selected Work, Principles, desktop Experience, and Final CTA now implement the approved responsive section order, visibility, geometry, containment, and compact treatment. English is checked against Figma at all five target widths; Czech preserves the same semantic/responsive contract with localized compact copy and natural content-led height. Real theme toggling leaves the Home and section rectangles invariant at 1440 and 390 px.
- **Evidence:** Figma nodes `6:2`, `7:377`, `8:193`, `8:87`, `8:140`, `8:246`, and `8:325`; localized Home sources; `home-hero-anchoring`, `home-flagship-parity`, `home-selected-work-parity`, `home-principles-parity`, `home-experience-anchoring`, `home-final-cta-anchoring`, and `home-integrated-parity`; Actions run `30471772408`.
- **Verification detail:** English exact Figma dimensions use narrow rounding tolerances. When Chromium reserves a measured 15 px vertical-scrollbar gutter, the contract permits only the measured content-led line-wrap growth at 430, 390, and 320 px; section adjacency, cumulative positions, containment, and total height remain asserted. Accessibility, localized links/CTA destinations, reduced motion, and exact Home SEO metadata are independently covered.
- **Disposition:** close after this feature branch is integrated into `dev`; do not reopen it solely because Czech text has a different content-led height from English.

### RPA-006 — Work page revision mismatch

- **Expected:** final Work frames `7:2`, `7:262`, and `7:430`.
- **Current:** contrast hero and desktop grid remain; approved light intro and vertically stacked composition are not implemented.
- **Evidence:** localized Work page and `WorkPage.module.css`.
- **Smallest fix:** confirm final copy, then implement the approved frame without changing pending-card semantics.

### RPA-007 — Case-study composition

- **Expected:** route-specific desktop narratives and approved generic tablet/mobile structure.
- **Current:** the shared template still adds “All work”, a facts card, section dividers, and two-sided case navigation across cases.
- **Evidence:** `src/components/work/CaseStudyLayout.tsx` and module CSS.
- **Smallest fix:** keep the semantic template but add only design-approved per-case/per-breakpoint composition.

### RPA-008 — Secondary-page content and rhythm

- **Expected:** final About, Experience, and Contact section counts and responsive composition.
- **Current:** About retains extra Values/CTA content; Experience lacks approved date data and adds CV actions; Contact retains Expectations and has no GitLab contact model.
- **Evidence:** localized page sources and content modules.
- **Smallest fix:** make a content-source decision before spacing changes.

### RPA-009 — Insights and article completeness

- **Expected:** populated Insights and a representative article at every approved breakpoint.
- **Current:** route code exists, but the available published CMS state is not a stable acceptance fixture. TOC and Related components remain absent from route composition.
- **Evidence:** localized Insights/article routes and article component exports.
- **Smallest fix:** create a controlled representative published fixture before visual acceptance.

### RPA-010 — ShareBar foreground contrast

- **Expected:** canonical on-primary foreground with WCAG AA contrast.
- **Current:** `.action` still reads undefined `--action-primary-text` and falls back to `#111827`; the design token is `--action-on-primary`.
- **Evidence:** `src/components/article/Article.module.css`; `src/app/(frontend)/styles/variables.css`.
- **Smallest fix:** use the canonical semantic token and add light/dark contrast assertions before CMS articles can be published.

### RPA-011 — Article-system integration

- **Expected:** approved metadata, code, callout, TOC, related, and responsive composition.
- **Current:** TOC/Related remain exported but not rendered, and article CSS still relies on fallback aliases outside the redesign vocabulary.
- **Evidence:** article route, exports, and `Article.module.css`.
- **Smallest fix:** define a complete article composition and migrate its tokens against a stable fixture.

### RPA-012 — Theme scope and control state

- **Expected:** one public theme contract, stateful accessible toggle, correct browser chrome, and approved dark surfaces.
- **Current:** toggle label is static with no `aria-pressed`; theme color remains white; CV retains legacy tokens; approved teal dark-mode bands remain flattened.
- **Evidence:** `ThemeToggle.tsx`, localized layout viewport config, CV CSS, and dark Figma frames. The Home suite invokes the real control only to prove light/dark section geometry and does not assert or repair the missing toggle state semantics.
- **Smallest fix:** make `data-theme` authoritative, expose current state/action, and use media-aware theme color.

### RPA-013 — Missing insight slug soft 200

- **Expected:** real 404, branded error UI, and `noindex`.
- **Current:** fixed. The route calls `notFound()` and an E2E assertion verifies the actual status and metadata.
- **Evidence:** localized article route and `src/__tests__/e2e/i18n-routing.spec.ts`.
- **Follow-up:** track the missing raw `html[lang]` on the dynamic Next.js error document as a separate P2 issue.

### RPA-014 — Hidden overflow diagnostics

- **Expected:** no clipped or document-level overflow at 320/390/430/768/1440.
- **Current:** partially fixed. Home now passes both document-width checks and a visible-descendant bounding-box scan at 320, 390, 430, 768, and 1440 px in English and Czech. The scanner deliberately ignores `html`/`body` clipping as proof and respects legitimate local clipping containers, so global overflow suppression cannot hide a failing Home descendant. This package does not establish the same coverage for every public route.
- **Evidence:** `src/__tests__/e2e/support/home-parity.ts`, `home-integrated-parity.spec.ts`, and Actions run `30471772408`.
- **Smallest follow-up:** reuse the same visible-descendant scan across representative non-Home public routes before changing the global clipping guard.

### RPA-015 — Visual and state regression coverage

- **Expected:** stable proof for exact geometry, dark mode, responsive variants, Button states, and navigation interactions.
- **Current:** partially fixed. Home now has exact/computed geometry contracts across five widths and two locales, real light-to-dark state transitions at the representative desktop/mobile widths, accessibility checks in both themes, exact localized SEO, no-overflow scanning, immutable revision annotations, exact shallow/deep health revision checks, and retained Playwright evidence from a standalone production runtime. CI still executes Chromium only, and the repository does not yet provide a reproducible pinned Linux/Chromium/font screenshot baseline against Figma.
- **Evidence:** Home parity and accessibility specs, `i18n-seo.spec.ts`, `launch.spec.ts`, Playwright configuration, `.github/workflows/ci.yml`, and retained artifact `8732047424`.
- **Smallest follow-up:** define and pin the browser, OS, and font inputs before adding approved screenshot baselines; expand that stable visual/state method to canonical shared components and other public routes.

### RPA-016 — Contact identity

- **Expected:** one confirmed public identity.
- **Current:** portfolio uses `karel@codeguy.cz`; CV uses `karel.kutchan@email.cz`.
- **Evidence:** `src/content/contact.ts`; CV Contact section.
- **Smallest fix:** confirm the intended address and centralize it.

### RPA-017 — Mobile-menu composition

- **Expected:** prototype `27:49`: brand left, close right, five centered/distributed links, and role/location/skills footer.
- **Current:** dialog header contains only the right-aligned close button; links remain left-aligned with a small gap; profile footer is absent; language/theme controls have not been reconciled with the design.
- **Evidence:** Navigation component/CSS and current Figma prototype screenshot.
- **Smallest fix:** reproduce the approved composition while preserving native-dialog Escape and focus restoration.

### RPA-018 — Editorial states

- **Expected:** left-aligned raised Empty/Loading/Error panels with visible eyebrow, exact title, description, and stable dimensions.
- **Current:** loading is two skeleton bars; empty/error omit the state eyebrow and remain centered.
- **Evidence:** `EditorialState.tsx`, `Article.module.css`, Figma `77:419–427`.
- **Smallest fix:** retain live/busy semantics while implementing the approved visible structure.

## Work packages

Every package starts from the latest `dev` and returns through a separate PR to `dev`.

### Package A — Navigation and CTA contract

Branch: `fix/navigation-cta-parity`

Scope:

- RPA-001 canonical Button geometry and API;
- RPA-003 Navigation variants and current-route semantics;
- RPA-004 dialog resize cleanup;
- RPA-010 ShareBar foreground token;
- RPA-017 approved mobile-menu composition;
- English/Czech labels, controls, and wrap behavior.

Required proof:

- Button SM/MD/LG dimensions and all six states;
- desktop/compact navigation dimensions and current-route `aria-current`;
- 390 → 1024 resize closes the dialog and restores scrolling;
- menu Escape/focus behavior remains green;
- light/dark and English/Czech screenshots at 1440 and 390.

### Package B — Home responsive parity

Branch: `fix/home-responsive-parity`

Status: implemented and verified on the audited feature branch.

Delivered scope:

- RPA-005 section layout, spacing, typography, cards, dark treatment, and CTA placement;
- English and Czech at 1440, 768, 430, 390, and 320 px;
- Home-specific RPA-014 visible-descendant overflow coverage;
- the Home portion of RPA-015 computed geometry, state, accessibility, SEO, and immutable revision evidence.

Verified proof:

- Figma-node and revision annotations in the retained browser report;
- exact English Figma geometry with explicitly measured scrollbar-topology allowances;
- content-led Czech wrapping with identical semantic/responsive structure;
- no visible-descendant or document overflow across the complete five-width/two-locale matrix;
- locale-safe CTA destinations, pending-card semantics, keyboard focus, reduced motion, and localized Home SEO;
- real light-to-dark geometry invariance at 1440 and 390 px.

An automated screenshot baseline is intentionally not claimed by this package; that remains the open portion of RPA-015 until Linux, Chromium, and font inputs are pinned reproducibly.

### Package C — Localized parity regression

Branch: `test/localized-parity-regressions`

Current state:

- this Home branch already supplies English/Czech wrap, geometry, descendant-overflow, accessibility, localized SEO, and theme-state contracts;
- route/query/hash preservation and navigation interactions remain covered by the existing production browser suite;
- canonical Button computed-style/state coverage and pinned screenshot baselines remain follow-up work outside this Home package.

Any follow-up package should extend the verified contracts instead of duplicating the Home matrix or preserving earlier known mismatches.

## Deferred backlog

The following findings do not block the Home/navigation/CTA redesign release when explicitly listed in the release PR:

- RPA-002, RPA-006–009, RPA-011–012, the remaining global scope of RPA-014, the remaining screenshot-baseline scope of RPA-015, RPA-016, and RPA-018;
- the dynamic article raw-`lang` residual;
- cross-browser and full-route visual expansion beyond the critical Chromium matrix;

## Release gate: `dev` to `main`

Do not create the release PR until all release-blocking fixes are present in `dev`.

Required final proof on the exact `dev` SHA:

```powershell
pnpm install --frozen-lockfile
pnpm generate:types
git diff --exit-code -- src/payload-types.ts
pnpm test:unit
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
pnpm exec playwright test --project=chromium
git diff --check
git status --short
```

The release smoke must cover `/`, `/cs`, Work, Contact, valid and invalid detail routes, language switching, theme persistence, navigation/menu/CTA behavior, canonical metadata, genuine 404 status, and protected `/api`/admin routing at 1440 and 390. The release PR must list every accepted `can-wait` finding and the existing rollback/deployment procedure.

## Audit limitations

- Current Figma and computed browser evidence is complete for the scoped Home package, but this refresh did not reverify the separate Navigation/Button/mobile-menu findings or recapture every secondary route frame from the 2026-07-28 audit.
- CMS-dependent article parity remains `needs-reverification` until a stable representative article fixture exists.
- The Home implementation was compared against the named Figma nodes through measured geometry and representative screenshots. Figma screenshots are visual references, not automated pixel baselines.
- The green Chromium result is authoritative for the recorded standalone Linux/Chromium run, but it is not a cross-browser result.
- The final documentation commit still requires the planned exact-head production gate; the cited run is the successful pre-audit implementation gate, and the only subsequent code commit is formatter-only.
- RPA-015 remains partial because Linux, Chromium, and font inputs are not yet pinned as a reproducible screenshot-baseline environment.
- ThemeToggle state semantics in RPA-012 remain deferred; a successful real toggle used for Home geometry does not close that control-level finding.
