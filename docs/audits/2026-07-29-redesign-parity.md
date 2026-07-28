# Redesign parity audit: current `dev` against approved Figma

Audit date: 2026-07-29

Repository: `cg-portfolio-web`

Audited source: `dev` at `46de374a5b8dda437cc44712afcec8b8a5a1c7d4`

Audit branch: `docs/refresh-redesign-parity-audit`

Figma file: `cs38WzlXKY9xfDYBinoKel`

Mode: read-only evidence collection; this document does not change Figma or application code.

## Executive decision

The i18n implementation materially improved routing, metadata, error handling, content localization, and automated coverage. It did not change the core visual contracts identified by the 2026-07-28 audit.

No P0 defect was found. The current release is not yet ready to be described as the approved redesign because the primary Home/navigation/CTA surface still has release-blocking P1 defects:

- the shared Button does not implement the canonical Figma size, radius, kind, and state matrix;
- Navigation omits approved variants and current-route semantics;
- an open mobile dialog can become invisible and keep the page scroll-locked after resizing to desktop;
- Home remains structurally recognizable but materially different from the approved desktop and compact frames;
- the open mobile menu omits the approved brand header, centered link composition, and profile footer.

The earlier estimated “55% parity” is obsolete and is intentionally not repeated. It was an expert estimate without a reproducible weighting and pixel-diff method. This audit uses finding status plus release impact instead.

## Status vocabulary

Every historical finding has exactly one current status:

- `still-valid` — current Figma and source/runtime evidence still demonstrate the defect;
- `fixed-by-i18n` — the localization implementation removed the original defect;
- `needs-reverification` — current runtime data or a deterministic fixture is missing;
- `obsolete` — the original claim no longer maps to the current product or design.

Every finding also has exactly one release disposition:

- `release-blocking` — must be resolved before the requested redesign release from `dev` to `main`;
- `can-wait` — may be deferred with the finding recorded in the release PR.

## Current evidence

### Git and application state

- `dev` includes localization PR #32 and repository-methodology PR #33.
- English remains unprefixed; Czech uses `/cs`.
- The language switch preserves the route, query, and hash by performing a full document navigation.
- The historical claim that current `dev` and production differ only in documentation is obsolete.
- The recovered stash was used only as a historical source. Its old `AGENTS.md` was not restored.

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

### Local runtime and automated evidence

The refreshed release packet must be executed on the exact `dev` target SHA. Current independent evidence establishes:

| Gate | Result |
|---|---|
| Vitest | PASS — 14 files, 76 tests |
| Node editorial/security tests | PASS — 17 tests |
| TypeScript | PASS |
| ESLint | PASS |
| Chromium production smoke | PASS — 27 tests |
| Targeted i18n/SEO/switcher Chromium | PASS — 17 tests |
| `git diff --check` | PASS |
| Biome format check | Known baseline failure in 25 unchanged files; not introduced by i18n |
| Fresh production build on final target SHA | Required before release PR |

Verified routing behavior includes:

- `/` → 200 with `lang="en"`;
- `/cs` → 200 with `lang="cs"`;
- `/en` → 307 to `/`, and `/en/contact?x=1` → 307 to `/contact?x=1` with the query preserved;
- localized and unprefixed finite 404 routes → real 404, branded copy, and `noindex`;
- `/cs/insights/<slug>` → redirects to the English canonical article route;
- missing dynamic English article → real 404 and `noindex`.

Known residual: the raw Next.js error document for a missing dynamic CMS article has no `html[lang]`. This is a new P2 follow-up and does not reopen RPA-013.

Current local Home measurements:

| Viewport | Figma height | Web height | Figma navigation | Web navigation |
|---:|---:|---:|---:|---:|
| 1440 | 3725 px | 3030 px | 72 px | 65 px rendered / 64 px inner |
| 768 | 3090 px | 2411 px | 64 px | 65 px rendered / 64 px inner |
| 390 | 3532 px | 3237 px | 64 px | 65 px rendered / 64 px inner |

At 390 px the web hero is 797 px tall; the primary hero CTA is 217 × 48 px, the secondary CTA is 177 × 50 px, and the flagship CTA is 335 × 48 px. The reference large Button is 52 px tall with a 4 px radius, while the web CTAs compute to a 9999 px radius.

The Czech Home at 390 px is 3501 px tall versus 3237 px in English and 3532 px in the reference. The longer localized copy does not create document-level horizontal overflow in the sampled page. Czech navigation links retain the `/cs` prefix.

The local development server rendered valid server-side HTML but its HMR transport repeatedly failed, leaving client interactions unhydrated in that one audit process. Menu/theme/locale click behavior from that process is therefore excluded from product conclusions. Interaction conclusions use the green production-mode Chromium suite plus static state ownership; the final fix and release gates require a fresh production build/start rather than relying on this dev process.

## Finding ledger

| ID | Current status | Priority | Release | Current conclusion |
|---|---|---:|---|---|
| RPA-001 | `still-valid` | P1 | `release-blocking` | Button geometry/API still conflicts with `21:110`. |
| RPA-002 | `still-valid` | P2 | `can-wait` | Disabled/loading styles are still not composed per kind. |
| RPA-003 | `still-valid` | P1 | `release-blocking` | Navigation still flattens `21:357` and lacks current-route semantics. |
| RPA-004 | `still-valid` | P1 | `release-blocking` | Resize can leave an invisible modal and body scroll lock. |
| RPA-005 | `still-valid` | P1 | `release-blocking` | Home still differs materially at desktop and compact breakpoints. |
| RPA-006 | `still-valid` | P1 | `can-wait` | Work still implements a different layout/content revision. |
| RPA-007 | `still-valid` | P1 | `can-wait` | Case-study template still adds unapproved composition and rhythm. |
| RPA-008 | `still-valid` | P1 | `can-wait` | About/Experience/Contact still contain materially different sections. |
| RPA-009 | `needs-reverification` | P1 | `can-wait` | Current published CMS article data is not a stable audit fixture. |
| RPA-010 | `still-valid` | P1 | `release-blocking` | ShareBar foreground token still fails the light-theme contract. |
| RPA-011 | `still-valid` | P2 | `can-wait` | Article composition/tokens remain incomplete. |
| RPA-012 | `still-valid` | P2 | `can-wait` | Theme control and CV theme scope remain inconsistent. |
| RPA-013 | `fixed-by-i18n` | P2 | `can-wait` | Missing insight slugs now return a genuine branded noindex 404. |
| RPA-014 | `still-valid` | P2 | `can-wait` | Global clipping can still hide descendant overflow. |
| RPA-015 | `still-valid` | P2 | `can-wait` | Routing coverage improved; visual/state regression coverage did not. |
| RPA-016 | `still-valid` | P3 | `can-wait` | Portfolio and CV still expose different email addresses. |
| RPA-017 | `still-valid` | P1 | `release-blocking` | Mobile menu still diverges from prototype `27:49`. |
| RPA-018 | `still-valid` | P2 | `can-wait` | Editorial states remain centered/skeletal instead of the approved panels. |

## Reproducible evidence matrix

All source paths refer to audited commit `46de374a5b8dda437cc44712afcec8b8a5a1c7d4`. “Current source” means the implementation was re-read at that commit. “Current runtime” means the 2026-07-29 local browser pass. “Historical runtime” is explicitly retained only as supporting evidence from the 2026-07-28 audit and is not represented as a new measurement.

| ID | Figma node | Web target | Viewport / theme / locale | Evidence type |
|---|---|---|---|---|
| RPA-001 | `21:110` | shared `Button`; Home CTAs | 1440 and 390 / light / EN; 390 / light / CS | Current Figma screenshot/design context, current source, current computed browser geometry |
| RPA-002 | `21:110` | shared `Button` state selectors | component matrix / light and dark / locale-independent | Current Figma state matrix and current CSS/API inspection; no claim that a live route currently exercises loading/disabled |
| RPA-003 | `21:357`, `44:60` | shared Navigation and route links | 1440, 768, 390 / light; dark references inspected / EN and CS | Current Figma screenshots/inventory, current source, current navigation geometry |
| RPA-004 | `21:357`, `27:49` | open compact dialog resized from 390 to 1024 | 390→1024 / light / EN | Current state-ownership/CSS inspection plus historical runtime reproduction; fresh production-mode regression required after the fix |
| RPA-005 | `6:2`, `7:377`, `8:87`, `8:140`, `8:193`, `8:246`, `8:325` | `/`, `/cs` Home | 1440, 768, 430, 390, 320 / light and dark / EN and CS | Current Figma screenshots, current source, current Home heights and CTA geometry |
| RPA-006 | `7:2`, `7:262`, `7:430` | `/work`, `/cs/work` | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current source, historical runtime screenshots/measurements |
| RPA-007 | `7:48`, `7:94`, `7:127`, `7:292`, `8:2` | all `/work/[slug]` and localized equivalents | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current shared-template source, historical runtime screenshots/measurements |
| RPA-008 | `7:160`, `7:192`, `7:229`, `7:321`, `7:333`, `7:355`, `8:31`, `8:43`, `8:65` | About, Experience, Contact in EN/CS | 1440, 768, 390 / light / EN and CS | Current Figma node inventory, current localized source/content, historical runtime screenshots/measurements |
| RPA-009 | `74:264`, `74:342`, `76:2`, `76:95`, `76:203`, `76:304` | Insights and article routes | 1440, 768, 390 / light / EN canonical, CS redirect | Current Figma node inventory and current route/component source; runtime article parity intentionally pending a stable CMS fixture |
| RPA-010 | `71:183` | `.action` in ShareBar on `/insights/[slug]` | responsive / light and dark / EN canonical | Current Figma component inventory and current semantic-token/CSS inspection |
| RPA-011 | `71:136`, `72:156`, `72:166`, `72:182` | article composition | 1440, 768, 390 / light and dark / EN canonical | Current Figma component inventory and current route/export/token inspection |
| RPA-012 | `8:246`, `8:325`, `77:2`, `77:115`, `21:357` | ThemeToggle, Home, Insights, article, CV | 1440 and 390 / dark / EN and CS public routes | Current dark Figma screenshots/inventory and current theme/layout/CV source |
| RPA-013 | `7:247`, `7:366`, `8:76` | missing `/insights/[slug]` | 1440 and 390 / light / EN canonical | Current route source, raw HTTP status, and current Chromium E2E for 404/branded/noindex behavior |
| RPA-014 | `8:140`, `8:193` | public responsive pages and overflow guard | 320, 390, 430, 768, 1440 / light / EN; sampled CS at 390 | Current Figma QA frames, current global CSS/tests, current 390 EN/CS document-width measurement |
| RPA-015 | `4:3`–`4:8` | Playwright/Vitest/CI parity coverage | configured projects and tested route matrix / light and dark / EN and CS | Current test/config/workflow inventory plus fresh test results; no visual-baseline claim |
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
- **Current:** the same approximate block implementation remains. Shared Button and Navigation defects propagate into Home, and the flagship visual/system map, selected-work cards, section rhythm, and compact content treatment still differ. Current web/Figma heights are 3030/3725 px at 1440, 2411/3090 px at 768, and 3237/3532 px at 390.
- **Evidence:** current Figma screenshots and the localized Home block sources under `src/app/[locale]/(frontend)/(pages)/(home)`.
- **Smallest fix:** repair shared contracts first, then tune 1440 and 390 before 768, 320, and 430; verify both locales at every target width.

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
- **Evidence:** `ThemeToggle.tsx`, localized layout viewport config, CV CSS, and dark Figma frames.
- **Smallest fix:** make `data-theme` authoritative, expose current state/action, and use media-aware theme color.

### RPA-013 — Missing insight slug soft 200

- **Expected:** real 404, branded error UI, and `noindex`.
- **Current:** fixed. The route calls `notFound()` and an E2E assertion verifies the actual status and metadata.
- **Evidence:** localized article route and `src/__tests__/e2e/i18n-routing.spec.ts`.
- **Follow-up:** track the missing raw `html[lang]` on the dynamic Next.js error document as a separate P2 issue.

### RPA-014 — Hidden overflow diagnostics

- **Expected:** no clipped or document-level overflow at 320/390/430/768/1440.
- **Current:** `body` still combines `max-width:100vw` with `overflow-x:hidden`; tests inspect document width rather than descendant bounds and do not cover all target widths.
- **Evidence:** global CSS and launch/i18n browser tests.
- **Smallest fix:** add visible-descendant bounding-box scanning before considering removal of the clipping guard.

### RPA-015 — Visual and state regression coverage

- **Expected:** stable proof for exact geometry, dark mode, responsive variants, Button states, and navigation interactions.
- **Current:** i18n added strong routing/SEO/switcher coverage, but no screenshot/computed-style contract, 768 project, canonical Button matrix, or dark visual assertion exists. CI executes Chromium only.
- **Evidence:** Playwright config, launch and i18n tests, and CI workflow.
- **Smallest fix:** add targeted computed-style/visual baselines after the shared component fixes.

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

Scope:

- RPA-005 section layout, spacing, typography, cards, dark treatment, and CTA placement;
- English at 1440 and 390 first;
- Czech at 1440 and 390;
- then 768, 320, and 430 for both locales.

Required proof:

- Figma-versus-browser table with computed values;
- no visible descendant overflow;
- CTA destinations and language switching remain correct;
- light/dark screenshot baselines for the stable Home fixture.

### Package C — Localized parity regression

Branch: `test/localized-parity-regressions`

Scope:

- route/query/hash preservation;
- English/Czech wrap and overflow cases;
- navigation current state and resize behavior;
- canonical Button computed-style contract;
- critical Home screenshots at stable viewport/theme/locale combinations.

This package follows A and B so it records the corrected contracts instead of preserving known mismatches.

## Deferred backlog

The following findings do not block the Home/navigation/CTA redesign release when explicitly listed in the release PR:

- RPA-002, RPA-006–009, RPA-011–012, RPA-014–016, and RPA-018;
- the dynamic article raw-`lang` residual;
- cross-browser and full-route visual expansion beyond the critical Chromium matrix;
- the pre-existing 25-file formatting baseline, provided the release diff introduces no new formatting diagnostics.

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

- Current Figma component and representative screen evidence is complete for the priority Home/navigation/CTA package, but this refresh did not recapture every secondary route frame from the 2026-07-28 audit.
- CMS-dependent article parity remains `needs-reverification` until a stable representative article fixture exists.
- Passing static, unit, routing, and smoke tests establishes functional health; it does not establish visual parity.
- A finding can be closed only after implementation is compared again against its exact Figma node and the corrected browser state.
