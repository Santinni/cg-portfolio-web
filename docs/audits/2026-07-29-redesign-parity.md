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
| Editorial Empty/Loading/Error | `77:378` (set), `77:419`, `77:423`, `77:427` (instances) | 640 × 240 state panels. The master set was unnamed and overlapped `77:365`; on 2026-07-31 it was named `Content State / Editorial` and moved to 7000,1350 on page `4:3`. |

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
| RPA-001 | `fixed-in-dev` | P1 | `resolved` | Geometry, colour and state model match `21:110` exactly across all 54 variants; the surplus API with no consumer was removed. |
| RPA-002 | `not-a-defect` | P2 | `resolved` | Per-kind state properties, hover guards and a `currentColor` loader are in place; Figma's own Loading variant hides the label and shows a 16px indicator, which is what the implementation does. |
| RPA-003 | `fixed-in-dev` | P1 | `resolved` | Measured geometry matches `21:357` at 1440/1024/768/390 in EN and CS and both themes; `aria-current="page"` is emitted. `Theme` is applied as Solid everywhere by decision. |
| RPA-004 | `fixed-in-dev` | P1 | `resolved` | Six consecutive browser runs of open, Escape, focus restoration and resize 390 to 1024 released the dialog and the scroll lock every time; the intermittent test assertion was the only instability. |
| RPA-005 | `fixed-in-dev` | P1 | `resolved` | Merged into `dev` through PR #36. |
| RPA-006 | `still-valid` | P1 | `can-wait` | Work still implements a different layout/content revision. |
| RPA-007 | `still-valid` | P1 | `can-wait` | Case-study template still adds unapproved composition and rhythm. |
| RPA-008 | `still-valid` | P1 | `can-wait` | About/Experience/Contact still contain materially different sections. |
| RPA-009 | `needs-reverification` | P1 | `can-wait` | Current published CMS article data is not a stable audit fixture. |
| RPA-010 | `fixed-in-dev` | P1 | `resolved` | `--action-primary-text` no longer exists anywhere in the repository; `.action` reads the canonical `--action-on-primary`. |
| RPA-011 | `still-valid` | P2 | `can-wait` | Article composition/tokens remain incomplete. |
| RPA-012 | `still-valid` | P2 | `can-wait` | Theme control and CV theme scope remain inconsistent. |
| RPA-013 | `fixed-by-i18n` | P2 | `can-wait` | Missing insight slugs now return a genuine branded noindex 404. |
| RPA-014 | `partially-fixed-on-feature-branch` | P2 | `can-wait` | Home descendant-overflow coverage is fixed and verified at all target widths/locales; global public-route scope remains open. |
| RPA-015 | `partially-fixed-on-feature-branch` | P2 | `can-wait` | Computed geometry, state, accessibility, SEO, and revision evidence is substantially expanded; a pinned screenshot baseline remains open. |
| RPA-016 | `fixed-in-dev` | P3 | `resolved` | PR #39 unified the public identity; `karel@codeguy.cz` is the only address in `src/content`. |
| RPA-017 | `fixed-in-dev` | P1 | `resolved` | The menu uses a native `<dialog>` with `showModal()`, Escape, focus restoration and scroll-lock release, all verified in repeated browser runs. |
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
- **Evidence:** `EditorialState.tsx`, `Article.module.css`, Figma master set `77:378` (`Content State / Editorial`) and its instances `77:419–427`.
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

## 2026-07-30 — Work and Insights hero surface

Branch `fix/work-insights-hero-figma-parity`.

- `/work` and `/insights` painted their heroes with `--surface-contrast`, placing a
  near-black band directly beneath the fixed navigation. Figma composes both pages
  on the page surface: `Desktop / Work` (`7:2`) puts the navigation in its own 72px
  `Header band` with `Work intro` (`7:11`) starting at `y=72`, and `Desktop /
  Insights` (`74:264`) mirrors that with `Insights hero` (`74:286`), which binds
  `--surface-page`. The closing `Insights CTA` (`74:335`) binds `--surface-subtle`,
  not the contrast surface.
- Measured consequence before the fix, light theme at 1440px: navigation links
  resolve to `--text-primary` `#08090c` and the surface behind them was `#08090c`,
  giving **1.00:1** on `/work` and `/insights`. Every other public route measured
  19.91:1. After the fix all seven public routes measure 19.91:1 in both themes.
- Fixed by moving both heroes to `--surface-page` / `--text-primary` /
  `--text-secondary` / `--action-primary` and the Insights CTA to `--surface-subtle`.
  Covered by `src/__tests__/e2e/work-insights-hero-parity.spec.ts` (16 tests, both
  locales and themes) which asserts the surface token and a >=4.5:1 navigation
  contrast. This closes the hero-surface portion of RPA-006 and RPA-009; their
  remaining layout, rhythm and content findings are untouched.

### Accepted deviation — navigation always uses `Theme=Solid`

The page frames instance the Navigation `Theme=Transparent` variant (`46:117` on
Work, `74:266` on Insights; both bind `--text-primary` and `--action-primary` and
no surface). We deliberately apply the approved `Theme=Solid` variant (`21:318`,
scrolled `21:321`) on every route instead, so the bar owns its surface and cannot
inherit an unreadable background from a section that scrolls beneath it. The
scrolled separator also spans the full bar rather than the inner 1200px container.
`launch.spec.ts` now encodes this contract; RPA-003 stays open for the full
three-variant `Theme` model.

### Known non-issue — React DevTools console noise

The dev overlay message "We are cleaning up async info that was not on the parent
Suspense boundary. This is a bug in React." originates entirely inside the React
DevTools extension frame. Loading `/insights`, `/` and `/work` in clean headless
Chromium with no extensions produces zero console errors or warnings. It is
development-only instrumentation and never reaches production. Do not spend time
on it; check the stack for `chrome-extension://` before investigating.

## 2026-07-30 — Shared UI re-measurement

Branch `test/shared-ui-redesign-parity`, measured against `dev` at `7220472`.
The ledger above was stale: PR #35 implemented most of the Button and Navigation
findings and the audit was never re-measured against it. Every row changed below
is backed by a measurement recorded here, not by reading source.

### Button — `21:110`

The component set has 54 variants: `Kind` Primary/Secondary/Quiet × `State`
Default/Hover/Active/Focus/Disabled/Loading × `Size` SM/MD/LG. Extracted every
variant's geometry, fills, strokes and label programmatically and compared with
`Button.module.css`:

- SM/MD/LG heights 36/44/52px, radius 4px, inline padding 12/16/20px, gap 8px,
  labels 14/16/16px Medium — all match.
- Primary `#0a6e80` / hover `#085a6a` / active `#064854`, white label; disabled
  `#f1f4f8` with `#4a5963` label — all match their tokens.
- Secondary: transparent with a 1px `#7c8d99` border, hover `#f1f4f8`, active
  `#f8faff`, disabled border `#d8dee8` — all match.
- Quiet: transparent with `#0a6e80` label, hover `#f1f4f8`, active `#f8faff` — match.
- Focus binds `--focus-ring` `#0a6e80` at `--focus-ring-width` 2 — the
  implementation uses `--action-focus` `#0a6e80` at 2px. The raw stroke reads as
  black only because that is the unresolved base paint under the variable.
- Loading sets the label to opacity 0 and shows a 16×16 indicator — exactly what
  `.loadingContent` and `.loadingIcon` do. RPA-002 described approved behaviour
  as a defect.

The only real divergence was surplus API. `accent`, `textSize`, `textWeight` and
`variant="text"` had zero consumers in source and in tests and were removed.
`transparent` and `rounded` remain for `ExpandableText`, which itself now has no
runtime consumer — a candidate for removal in a later pass.

**Expression difference, not a defect:** Figma draws focus as a 2px stroke on the
control because it cannot express `outline-offset`. The implementation uses an
offset outline, which keeps the ring clear of the control.

### Navigation — `21:357`

24 variants: `Mode` Desktop/Tablet/Mobile × `Theme` Transparent/Solid/Inverse ×
`State` Default/Scrolled/Menu Open. Desktop is 1200×72 with no inline padding,
Tablet 768×64 with 48px, Mobile 390×64 with 20px. Solid fills `--surface-page`;
Scrolled adds a 1px `--border-default` bottom border.

Measured on `/work` and `/cs/work` at 1440, 1024, 768 and 390px in both themes —
16 combinations, all identical to the spec: 72/72/64/64px bar height, 1200/896/
672/350px content row, 120/64/48/20px gutter, 0px border at rest and 1px in
`--border-default` when scrolled.

### Mobile menu — `27:49`, RPA-004 and RPA-017

Six consecutive direct browser runs of open → Escape → focus restoration →
reopen → resize 390 to 1024: **0 failures**. The scroll lock is applied on open
and released on both close paths, and the resize closes the dialog and releases
the lock.

`launch:218` was failing intermittently because it sampled `body.style.overflow`
once, immediately after the dialog stopped being visible, while the lock is
released by a React effect that runs after the close event. Converted to
`expect.poll`; three consecutive runs pass.

### Still open

- RPA-001 residue: `ExpandableText` and the `transparent`/`rounded` pair it keeps alive.
- RPA-003 residue: the three-variant `Theme` model is not implemented — Solid is
  applied everywhere by decision, and the Figma instances were updated to match.
- The full-bleed scrolled divider is implemented in code but the Figma component
  is still 1200px wide.
- RPA-006/007/008/009/011/012/018 are untouched by this pass.

### Review limitation

The brief asked for independent read-only review by Mistral Vibe, Copilot CLI and
Claude. Vibe fails on a local configuration merge, Copilot CLI has no
authentication and `gh` is not installed in this environment. This pass was
reviewed by the controller only and must not be described as independently
reviewed. The document also lives at `docs/audits/2026-07-29-redesign-parity.md`
rather than the `docs/redesign-parity-audit.md` path the brief named; renaming it
would break existing references in commits and plans.

## 2026-08-01 — The Home geometry contract was locked to one machine

Branch `test/shared-ui-redesign-parity`. The first attempt to re-run the release
gate off CI, on Windows 11 against a standalone production build, exposed a defect
in the parity method itself rather than in the product.

### What failed

`home-hero-anchoring.spec.ts` and `home-integrated-parity.spec.ts` both failed at
390px with an identical message:

```
Expected -2.453125px to be within ±0.1px of 22.203125px (difference: 24.65625px)
```

`MOBILE_GUTTER_HERO_GROWTH = 22.203125` was a bare constant. It recorded how much
the Home Hero grew, on the CI Linux image, when Chromium reserved a 15px
scrollbar gutter and the body copy wrapped onto one more line. The difference
between the two runs is `24.65625px` — exactly one body line box at the mobile
type scale (17px × 1.45). On Linux the copy takes one extra line; on Windows it
does not. Both are correct renders of the same layout.

The residual `-2.453125px` is identical in both environments, so the section
geometry itself never diverged. Only the line count did.

### The second-order finding

Removing the constant let the 390px integrated test run past the Hero for the
first time, and it failed again further down: section index 3 measured
`702.046875px` against an approved `656px`. The `expectedGrowthByIndex` map that
listed *which* sections were allowed to grow was itself derived from Linux-only
observation. Under a reserved gutter the Hero rewraps on Linux and Principles
rewraps on Windows — the enumeration encoded one machine just as much as the
constant did.

This is the more important half of the finding: the first failure was one magic
number, the second showed the whole growth model was machine-shaped.

### What changed

`expectLineWrapGrowth` in `src/__tests__/e2e/support/home-parity.ts` replaces both.
A section under a reserved gutter must measure its approved Figma height plus a
whole number of line boxes it actually renders, and nothing else. Line heights are
read from the DOM per section by `readHomeGeometry`, so no pixel amount is pinned.
Without a gutter the exact Figma height still applies unchanged.

This is not a loosened contract. The previous version accepted any 22.203125px
growth for any reason; this one rejects growth that no line wrap explains, and
still carries every measured delta through subsequent section positions and total
main height. What it stops asserting is *which* machine rendered the page.

The residual budget is deliberately tied to the per-viewport rounding tolerance
(0.5px at 1440, 1.5px at 768, 2.5px below) rather than to a single looser number.
Windows reserves a 15px gutter at *every* width, 1440px included — measured
`document-client=1440, body-client=1425` — so a blanket allowance would have
silently relaxed the 1440px contract from ±0.5px to ±3px on the platform where
nothing rewraps at all.

Worth recording: at 390px the Hero's residual is `-2.453125px` against a 2.5px
budget. It passes, with 0.047px to spare, and it is the same value on both
platforms. That is a real 2.45px gap between the implementation and the approved
`831px` frame height which the old constant absorbed invisibly. It is not a new
defect, but it is now the tightest margin in the suite and should be resolved
against Figma rather than left to sit on the tolerance boundary.

### Coverage this did not have

The suite had never been run outside CI. Both defects were latent from the day the
constants were written and would have surfaced the first time any contributor ran
the browser gate locally. `pnpm test:e2e:pinned` (`compose.e2e.yaml`) now runs the
suite inside `mcr.microsoft.com/playwright:v1.62.0-noble` against an ephemeral
database, so the geometry contracts are reproducible off CI.

Result: **253/253 Chromium tests pass in the pinned Linux container, and 253/253
pass on Windows**, from the same working tree. The geometry contracts now hold in
both, which is the property the old constants made impossible.

Three things had to be true for that container to work, and all are recorded in
`compose.e2e.yaml` because none is obvious. The runner shares the app's network
namespace and addresses it as `localhost`: the app sends HSTS and a CSP carrying
`upgrade-insecure-requests` (`next.config.ts:55`, `next.config.ts:76`), so reaching
it under any other hostname makes Chromium rewrite `http://` to `https://` and every
navigation dies with `ERR_SSL_PROTOCOL_ERROR`. CI never met this because it serves
on `localhost`, which is exempt from the upgrade. The pnpm store is also a named
volume: with the repository bind-mounted, the default store path resolves inside the
mount and drops a 1.4GB `.pnpm-store/` into the host working tree. And
`NEXT_PUBLIC_SERVER_URL` is passed as a Docker *build* argument, because Next inlines
`NEXT_PUBLIC_*` at build time — supplied only at run time the image keeps the
`https://codeguy.cz` fallback and the five localized-SEO canonical assertions fail.
`Dockerfile` gained an `ARG`/`ENV` pair for it in the builder stage; unset, the build
behaves exactly as before.

The pinned image is *a* fixed environment, not byte-identical to CI: the workflow
still runs `playwright install --with-deps chromium` on `ubuntu-latest`, whose font
packages are not guaranteed to match the image. Pointing the CI browser job at the
same image would make the two identical. That change is not made here because an
Actions edit cannot be verified locally; it belongs in its own PR where a CI run
proves it.

### Also fixed

`work-insights-hero-parity.spec.ts` read `document.querySelector('main header')!`
with no wait. On a cold database `/insights` can still be streaming when the
navigation promise resolves, and the missing element surfaced as an opaque
`getComputedStyle` TypeError. It now waits for the element the contract is about
and reports what was absent. This flaked only under local parallelism; CI runs
`workers: 1`.

### Running the browser gate locally

The production server cannot use the development database. Payload detects the
dev-mode pushed schema, blocks on an interactive "data loss will occur" prompt and
never serves a request. Use an empty database — which is what `compose.e2e.yaml`
does — and note that the standalone server reads `HOSTNAME`, not `HOST`.

### Independent review — still not achieved

The 2026-07-30 pass recorded that independent review was unavailable. Mistral Vibe
is now installed and working (v2.23.2), and its programmatic mode was pointed at an
isolated `git worktree` of the branch head so it could not observe uncommitted work.
Both attempts stalled on the first tool call: in `-p` mode Vibe waits for tool
approval, which cannot be answered non-interactively. `--auto-approve` is the
documented answer, and selecting the installed `lean` agent did not change the
behaviour. Neither run produced output; both were stopped after ~10 minutes of zero
CPU movement.

This pass therefore remains controller-reviewed only and must not be described as
independently reviewed. Unblocking it is a permission decision, not a technical one.

### RPA-015 impact

The open scope of RPA-015 was recorded as a missing pinned screenshot baseline.
That understated it: an existing *geometry* contract was already environment-locked,
and nobody knew because the gate only ever ran in one place. The screenshot-baseline
scope remains open; the geometry scope is now reproducible.
