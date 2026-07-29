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

### 5. Align Principles, Experience, And Final CTA Contracts

Objective:
- Complete the remaining Home-local typography and vertical rhythm without changing shared global primitives.

Implementation:
- Add EN/CS compact Principle descriptions while preserving desktop descriptions and ledgering their presentation use.
- Match Principles 48/32 heading and 20/19 item typography.
- Match Experience desktop 32 px rhythm, 104 px section padding, 48 px heading, and 18 px body; retain desktop-only visibility.
- Match Final CTA 32/24 px rhythm, 42/30/24 responsive heading, and desktop 18 px supporting text; retain compact supporting-copy visibility rule and existing tones.

Validation:
- Computed type, padding, gaps, visibility, and semantic heading order at all target widths and both locales.
- Light/dark semantic colors retain required contrast.

Commit:
- `fix(home): complete Home typography and rhythm`

### 6. Add Complete Localized Parity Evidence

Objective:
- Prove the integrated Home rather than relying on isolated component checks.

Implementation:
- Add full-page order and non-overlap checks.
- Scan visible descendants at 1440/768/430/390/320 for EN/CS; do not treat global `overflow-x:hidden` as proof.
- Cover Home metadata/canonical/alternates/OG for `/` and `/cs`.
- Cover skip link, CTA names/focus, heading/`aria-labelledby` integrity, reduced motion, and key contrast pairs.
- Add a stable Chromium visual matrix for EN/CS × 1440/390 × light/dark. Generate committed baselines in the same Linux/Chromium environment used by CI; Windows screenshots are diagnostic only.

Validation:
- Focused Home Chromium suite passes against a production build.
- No serious/critical accessibility failure from the repo-supported test surface; if axe is not already installed, do not add it without a separate dependency decision—use semantic/browser assertions and document the remaining automated-scan gap.
- Screenshot and computed evidence identifies its Figma node and target SHA.

Commit:
- `test(home): prove localized responsive parity`

### 7. Refresh Audit Evidence

Objective:
- Reclassify RPA-005, RPA-014, and RPA-015 using the final branch SHA and fresh browser/Figma evidence.

Implementation:
- Replace stale pre-PR #35 runtime measurements with current values.
- Mark each finding fixed, partial, deferred, or still-valid according to actual evidence.
- Preserve limitations: Czech has no exact design-height reference; CMS-independent Home proof does not establish secondary-route parity.

Validation:
- Audit records SHA, routes, viewports, themes, locales, node IDs, expected/actual values, and artifact locations.
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
