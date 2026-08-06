# Page header and hero-layout consolidation

Status: Figma structure audited; production-code inventory blocked/pending  
Date: 2026-08-06

Related plan: `2026-08-06-insights-topic-filter-alignment.md`

## Problem

Work and Insights appear to use a different implementation structure from Experience, About and Contact even though all five pages share the same page-shell and hero design language. Different page content is expected; duplicated containers, gutters, typography, spacing rules and breakpoint logic are not.

The task is to audit the existing implementation and consolidate proven duplication without redesigning the pages or building a route-aware mega-component.

## Verified Figma baseline

Desktop references:

- Work intro: `7:11`, page `7:2`
- Insights hero: `74:286`, page `74:264`
- Experience hero: `7:201`, page `7:192`
- About hero: `7:169`, page `7:160`
- Contact hero/content: `7:238`, page `7:229`

Shared design facts:

- All five sections are full-width 1440 px frames.
- All five use 120 px left/right desktop gutters.
- All use a vertical content hierarchy: eyebrow → one H1 → lead → optional controls/actions.
- Work, Experience, About and Contact store the hierarchy directly in the section.
- Insights uses a nested 920 px `Content` frame because it also contains topic filters.
- Global navigation remains a separate 72 px page-shell region.

Intentional or content-driven differences that must not be flattened blindly:

- Work: 104/96 px vertical padding, 32 px gap.
- Insights: 104/104 px vertical padding, nested content, 20 px internal gap, optional filter slot.
- Experience: 104/80 px vertical padding, 28 px gap.
- About: 104/96 px vertical padding, 28 px gap and a longer lead.
- Contact: 112/112 px vertical padding, 28 px gap and a contact-action row.
- Heading and lead measures differ according to content length.

## Phase 1 — production-code inventory

Before refactoring, produce an evidence table for all five routes:

| Route | Page file | Hero component | DOM hierarchy | CSS module/classes | Container/gutters | Vertical spacing | Type rules | Breakpoints | Optional slots |
|---|---|---|---|---|---|---|---|---|---|
| Work | pending audit | pending | pending | pending | pending | pending | pending | pending | none |
| Insights | pending audit | pending | pending | pending | pending | pending | pending | pending | filters |
| Experience | pending audit | pending | pending | pending | pending | pending | pending | pending | possible actions |
| About | pending audit | pending | pending | pending | pending | pending | pending | pending | none |
| Contact | pending audit | pending | pending | pending | pending | pending | pending | pending | contact row |

Audit imports, DOM, component ownership, CSS declarations, tokens, media queries, theme selectors and test coverage. Different class names alone are not proof of a defect; record whether the rendered and semantic contracts actually diverge.

## Target architecture

1. Keep the global `SiteHeader`/navigation independent from the page hero.
2. Introduce or standardize one composable page-hero primitive only after the inventory proves duplication.
3. The primitive owns:
   - semantic wrapper and accessible naming;
   - shared content container/gutters;
   - eyebrow, H1 and lead typography;
   - responsive spacing/token application;
   - safe optional-slot spacing.
4. Pages own:
   - copy and localization keys;
   - width/measure values expressed through a small semantic API;
   - optional actions;
   - Contact row;
   - Insights filter component and its state/URL behaviour.
5. Prefer named composition slots such as `eyebrow`, `title`, `lead`, `controls` and `actions` over route checks or many boolean props.
6. Add a variant only for a design-backed structural difference, never for a page name.

## Migration order

1. Inventory and render comparisons for all five pages.
2. Select one low-risk baseline route and characterize it with tests.
3. Extract the shared primitive without changing its output.
4. Migrate Work and Experience first to prove normal content and spacing variants.
5. Migrate About and Contact, verifying long copy and action-row composition.
6. Migrate Insights last, composing the existing filter block through a named controls slot and preserving the separate topic-filter plan.
7. Delete legacy imports/selectors only after visual and semantic parity is proven.

## Acceptance criteria — architecture

- All five routes use one documented page-hero structural primitive, or the plan records a design-backed reason for any retained exception.
- No duplicated hero container, gutter, typography or breakpoint rules remain on migrated pages.
- The shared primitive contains no pathname checks, route-name switches or page-specific content imports.
- Optional slots do not create empty gaps when absent.
- Insights filter logic, Payload data and URL state remain outside the hero primitive.
- Content and sections below each hero remain functionally unchanged.

## Acceptance criteria — semantics and accessibility

- The global site navigation remains the sole page-level banner/header landmark.
- Every route contains exactly one intended H1 with the same server-rendered text as before.
- DOM and focus order match the visual order at all breakpoints; CSS ordering does not alter reading order.
- All hero actions retain accessible names, keyboard operation, visible focus and at least a 44×44 px effective target.
- At 200% and 400% zoom, text reflows without clipping, overlap or horizontal page scrolling.
- Insights topic filters remain filtering buttons with `aria-pressed`, not ARIA tabs, as defined in the related filter plan.

## Acceptance criteria — responsive and visual parity

- Verify all five routes in EN and CS at 320, 390, 430, 768, 1024 and 1440 px.
- Verify light, dark and forced-colors/high-contrast behaviour where supported.
- Container edges, gutters, title measures, vertical rhythm and the transition into the first content section match the approved Figma frames.
- Long localized headings and leads grow naturally; no fixed-height clipping.
- Header height, sticky behaviour and anchor offsets remain unchanged.
- No layout shift is introduced by the extraction.

## Regression evidence

- Component tests for required and optional slots and semantic output.
- Route smoke tests for Work, Insights, Experience, About and Contact in both locales.
- Visual regression at the repository-native breakpoints, including long-copy, light/dark and focus states.
- Keyboard/focus verification, automated accessibility scan and manual zoom/reflow check.
- Format, typecheck, lint, unit tests, E2E and production build pass.
- A final code search confirms migrated pages no longer import or define the legacy hero selectors.

## Explicit non-goals

- Do not redesign Figma or choose new typography/spacing tokens.
- Do not change global navigation behaviour.
- Do not rewrite copy, translations, metadata, routes, Payload fetching or article/card content.
- Do not change sections below the hero.
- Do not fold Insights filtering logic into the hero component.
- Do not create a universal layout framework or refactor unrelated page sections.
- Do not add motion, illustration or new media.

## Risks and dead ends

- A one-size component can become a boolean-prop mega-component; use composition and minimal semantic variants.
- Treating different class names as the defect can trigger unnecessary churn; compare rendered/semantic contracts first.
- Moving the hero into another `header` can duplicate banner landmarks.
- Shared and page-level spacing can be double-applied at the hero/first-section boundary.
- CSS specificity changes can silently alter theme, focus and responsive states.
- Fixed heights can pass English screenshots while clipping Czech copy or zoomed text.
- Do not weaken visual baselines merely to accept the refactor.
- During this audit, every process-backed workspace read failed before startup with `helper_unknown_error: setup refresh had errors`. Exact production paths, classes and duplication claims therefore remain deliberately unfilled until the environment is restored.
