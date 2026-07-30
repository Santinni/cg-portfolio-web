# Home Responsive Parity Implementation Plan

## Goal

- Close release-blocking finding RPA-005 against the approved Figma Home frames without regressing navigation, i18n, accessibility, SEO, or route behavior delivered by PR #35.
- Preserve desktop copy, introduce only design-backed compact presentation copy, and produce reproducible browser evidence before reclassifying the audit.

## Scope

- In scope: Home typography, vertical rhythm, Flagship composition, Selected Work introduction, responsive card density, compact presentation copy, English/Czech wrapping, light/dark surfaces, overflow diagnostics, and stable browser evidence.
- Out of scope: Work/detail-page redesign findings RPA-006–009, article-system findings RPA-011/RPA-018, production release, deployment, or Figma mutations.

## Assumptions And Evidence

- Base branch and SHA: `dev` at `ceaeefb29ac4bc76402266e15b55bf0c63f1dfc7`.
- Implementation branch: `fix/home-responsive-parity` in `C:\tmp\cg-portfolio-home-parity`.
- Figma file: `cs38WzlXKY9xfDYBinoKel`.
- Re-inspected nodes: desktop `6:2`, tablet `7:377`, mobile `8:87`, responsive QA `8:140` and `8:193`, dark desktop `8:246`, dark mobile `8:325`.
- English Figma copy is the exact visual reference. Czech has no canonical frame, so it must preserve meaning, hierarchy, containment, and natural wrapping rather than matching English element heights.
- Page and section heights are evidence targets, not fixed CSS heights. Content must determine height.
- Shared `Section`, global typography tokens, and generic `Eyebrow` remain unchanged unless a separate cross-route proof justifies changing them.

## Confirmed Figma Contracts

- Desktop: header 72 px; Hero content begins at page y=176; Home frame is 1440×3725; section headings use 48 px/145% except Final CTA at 42 px/145%; desktop body copy is 18 px/145%.
- Tablet/mobile: header 64 px; Hero content begins at page y=120; section padding is 64 px block with 24 px content rhythm; headings are 32 px/145%, Final CTA is 30 px/145%, body copy is 17 px/145%.
- 320 px exception: Hero is 36 px/112%, Final CTA is 24 px/112%, and Selected Work cards use the compact 16 px padding/HUG-height contract.
- Desktop Flagship: eyebrow and 48 px heading precede a 1196 px summary row; row gap 56 px; copy width 580 px; system map width 560 px, padding 32 px, gap 16 px, radius 8 px, and `--action-primary` surface.
- Selected Work: eyebrow plus headline `Complex products. Clear frontend decisions.`; desktop three-column 3×368 px grid; single column at compact widths.
- Experience is desktop-only. Final supporting paragraph is desktop-only.
- Dark geometry equals light geometry and uses the existing semantic surface/action tokens.

## File Map

- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/hero/*` — Hero rhythm, typography, and responsive copy.
- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/flagship-case/*` — canonical Flagship summary and system-map composition.
- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/selected-work/*` — semantic eyebrow/headline and grid/card consumption.
- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/principles/*` — responsive typography and compact descriptions.
- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/experience-snapshot/*` — desktop vertical/type contract.
- `src/app/[locale]/(frontend)/(pages)/(home)/blocks/final-cta/*` — desktop/compact vertical/type contract.
- `src/components/work/WorkCard.tsx` and `WorkCard.module.css` — explicit responsive density without changing default consumers.
- `messages/en.json`, `messages/cs.json` — matching semantic desktop/compact keys.
- `docs/content/copy-change-ledger.md` — append-only provenance for presentation-copy additions and relocations.
- `src/__tests__/e2e/support/home-parity.ts` — centralized Figma provenance, viewport contracts, pixel tolerance, and overflow helpers.
- `src/__tests__/e2e/home-*.spec.ts` — focused computed, behavior, accessibility, locale, and visual evidence.
- `docs/audits/2026-07-29-redesign-parity.md` — post-implementation evidence and RPA status only after fresh verification.

## Tasks And Commit Sequence

### 1. Centralize The Home Parity Test Contract

Objective:
- Replace scattered undocumented geometry assumptions with a node-backed helper and correct pixel-tolerance semantics.

Implementation:
- Add viewport/Figma-node constants for 1440, 768, 430, 390, and 320.
- Add `expectPx(actual, expected, tolerance)` using absolute difference; do not misuse the decimal-precision argument of `toBeCloseTo`.
- Add helpers for font/theme stabilization and visible-descendant overflow detection with a narrow documented allowlist.
- Refactor only touched Home tests to use stable IDs/roles rather than incidental `firstElementChild` topology.

Validation:
- Existing Home E2E remains green before product changes.
- New contract tests fail only on the confirmed RPA-005 gaps.

Commit:
- `test(home): centralize Figma parity contracts`

### 2. Align Hero Responsive Rhythm, Typography, And Copy

Objective:
- Match Figma Hero vertical start, gaps, type, and approved compact presentation copy at every target width.

Implementation:
- Keep desktop messages unchanged.
- Add matching EN/CS compact paragraph keys and render desktop/compact spans without client viewport logic.
- Use Home-local typography and padding rules: 1440 desktop, shared compact, and explicit 320 exception.
- Append original strings, locations, purpose, new compact alternatives, and rationale to the copy ledger.

Validation:
- EN exact computed geometry/type at 1440/768/430/390/320.
- CS natural wrapping, no clipping/overlap, and CTA containment at all five widths.
- CTA destinations and heading semantics remain unchanged.

Commit:
- `fix(home): align Hero responsive contract`

### 3. Rebuild The Flagship Composition

Objective:
- Replace the neutral two-node grid with the approved desktop summary row and single semantic system-map panel while preserving compact behavior.

Implementation:
- Place eyebrow and heading before the desktop summary row.
- Build the single teal system map from existing translated facts; keep it `aria-hidden` only if equivalent information remains available in nearby readable copy.
- Hide both system map and stack on tablet/mobile.
- Add matching EN/CS compact summary keys and ledger provenance; preserve desktop summary.

Validation:
- Desktop widths, gap, padding, radius, colors, and text hierarchy match node `6:2`/dark `8:246`.
- Tablet/mobile hide map and stack and match compact type/rhythm.
- CTA stays localized and keyboard reachable.

Commit:
- `fix(home): rebuild Flagship case composition`

### 4. Restore Selected Work Introduction And Responsive Cards

Objective:
- Restore the approved eyebrow/headline hierarchy and implement the 320 px compact WorkCard without changing pending-route truth.

Implementation:
- Reclassify existing `Selected work` copy as the eyebrow and add the approved headline in both catalogs.
- Add compact summaries as Home presentation keys/props rather than overwriting shared Work-page facts.
- Introduce an explicit responsive WorkCard density consumed only by Home: standard at 390/430/768/1440 and compact at 320.
- Do not invent a link for a pending case study.
- Record all copy provenance.

Validation:
- Heading hierarchy is eyebrow + H2 + card H3.
- Grid/card width, padding, minimum/HUG height, gap, content wrapping, and pending semantics match the relevant Figma frame.

Commit:
- `fix(home): restore Selected Work responsive composition`

### 5a. Align The Principles Contract

Objective:
- Match the responsive Principles typography, rhythm, and presentation copy without changing shared global primitives.

Implementation:
- Add EN/CS compact Principle descriptions while preserving desktop descriptions and ledgering their presentation use.
- Match Principles 48/32 heading and 20/19 item typography.
- Preserve the accessible `--accent-on-contrast` eyebrow color where the literal light-desktop Figma color would fail text contrast.

Validation:
- Computed type, padding, gaps, visibility, natural growth, and containment at all target widths and both locales.
- Light/dark semantic colors retain required contrast.
- Treat a desktop browser's reserved scrollbar gutter as test-environment topology: never use `100vw` or hidden overflow to fake the mobile Figma content width.

Commit:
- `fix(home): align Principles responsive contract`

### 5b. Align The Experience Contract

Objective:
- Match the desktop-only Experience block without leaking hidden content into compact visual or accessibility flows.

Implementation:
- Match the 104 px section padding, 32 px rhythm, 48 px heading, 18 px body, and text-only secondary CTA.
- Retain desktop-only visibility and remove the non-design CTA icon.

Validation:
- Compare desktop light/dark against nodes `6:70` and `8:314`.
- Prove the 1023 px hidden / 1024 px visible boundary, locale-aware CTA name and destination, focus behavior, and absence from the compact accessibility tree and tab order.

Commit:
- `fix(home): align Experience desktop contract`

### 5c. Align The Final CTA Contract

Objective:
- Match the final conversion block at all approved widths while preserving localized destinations and semantic tones.

Implementation:
- Match 32/24 px rhythm, 42/30/24 responsive heading, and desktop 18 px supporting text.
- Retain the compact supporting-copy visibility rule and existing semantic colors.

Validation:
- Test 1440/768/430/390/320 in EN/CS plus representative light/dark contrast and CTA focus/name/destination.
- Use Figma nodes `6:76`, `7:426`, `8:242`, `8:136`, `8:189`, `8:320`, and `8:374`.

Commit:
- `fix(home): align Final CTA responsive contract`

### 6a. Add Integrated Localized Geometry Evidence

Objective:
- Prove the integrated Home rather than relying on isolated component checks.

Implementation:
- Add full-page order and non-overlap checks.
- Scan visible descendants at 1440/768/430/390/320 for EN/CS; do not treat global `overflow-x:hidden` as proof.
- Compare light and dark geometry for the same locale and viewport.
- Assert exact Figma section/page geometry for English where the browser topology is equivalent; use HUG containment, monotonic order, and non-overlap for Czech.

Validation:
- Focused integrated Home Chromium geometry suite passes.
- Computed evidence identifies its Figma node and target SHA.

Commit:
- `test(home): prove integrated responsive geometry`

### 6b. Add Home Accessibility And SEO Evidence

Objective:
- Prove the visitor-facing semantic, keyboard, reduced-motion, and locale metadata contracts independently of visual geometry.

Implementation:
- Extend the existing SEO suite for `/` and `/cs`; do not duplicate its helpers in a new suite.
- Cover exactly one H1, section H2 and item H3 order, resolved `aria-labelledby`, localized skip link, visible CTA names/focus, compact Experience absence, and reduced-motion computed behavior.
- Cover locale-specific canonical, `en`/`cs`/`x-default` alternates, `og:url`, and `og:locale`.

Validation:
- Covered semantic, focus, contrast, reduced-motion, and SEO contracts pass in Chromium for EN/CS.
- Do not claim a complete WCAG or serious/critical issue scan unless an approved automated scanner actually ran; document that limitation instead of adding a dependency implicitly.

Commit:
- `test(home): prove accessibility and SEO contracts`

### 6c. Prove Production Runtime And Visual Evidence

Objective:
- Distinguish production behavior from dev/Turbopack behavior and avoid non-portable visual baselines.

Implementation:
- Build first, start `.next/standalone/server.js` on a dedicated port, run focused Chromium with `PLAYWRIGHT_EXTERNAL_SERVER=true`, and tear the server down.
- Create committed screenshot baselines only in the pinned Linux/Chromium/font environment used by CI. Windows screenshots remain diagnostic.
- If no reproducible Linux baseline workflow exists in scope, defer the baseline explicitly and keep RPA-015 partial.

Validation:
- Production Home smoke passes for both locales and the critical responsive routes.
- Any committed visual artifact records browser, OS, font, device scale factor, theme, locale, viewport, Figma node, and implementation SHA.

Commit:
- `test(home): prove production Home runtime`
- Optional separate baseline commit: `test(home): add pinned visual baselines`

### 7. Refresh Audit Evidence

Objective:
- Reclassify RPA-005, RPA-014, and RPA-015 using the tested implementation SHA and fresh browser/Figma evidence.

Implementation:
- Replace stale pre-PR #35 runtime measurements with current values.
- Mark each finding fixed, partial, deferred, or still-valid according to actual evidence.
- Preserve limitations: Czech has no exact design-height reference; CMS-independent Home proof does not establish secondary-route parity.
- Keep repo-wide RPA-014 and RPA-015 partial unless their non-Home routes and states are also freshly verified.

Validation:
- Audit records the tested implementation SHA separately from the later docs-only audit commit, plus routes, viewports, themes, locales, node IDs, expected/actual values, and artifact locations.
- No release-readiness claim is made while a release-blocking P1 remains.

Commit:
- `docs(audit): refresh Home parity evidence`

## Validation Gates

- Per packet: the narrowest relevant Vitest/Playwright check, `pnpm typecheck`, and `git diff --check`.
- Integrated branch: `pnpm test`, `pnpm test:unit`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build`, targeted Chromium production smoke, and `git status --short`.
- Catalog parity and non-empty-value tests must remain green after every message change.
- Final review must compare the actual browser against all seven inspected Figma frames; code review alone cannot close RPA-005.

## Execution Notes

- One implementation packet and one review loop at a time; parallel agents may perform read-only design, quality, or code-review passes but must not edit overlapping files.
- Every public-copy change is additive and traceable. Existing desktop text is never deleted merely to fit a breakpoint.
- Each task is one commit unless a red test and the smallest green implementation cannot form a coherent intermediate state; any exception is explained in the commit body.
- Push/PR creation is a later explicit handoff. Do not merge or deploy.
