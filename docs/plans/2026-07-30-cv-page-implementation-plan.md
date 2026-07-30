# Curriculum Vitae Page Implementation Plan

## Goal

- Replace the legacy `/curriculum-vitae` presentation with the approved responsive and dark-mode Figma design while preserving the direct route, localized HTML content and the recognizable expanding PDF download action.
- Bring the public HTML CV and downloadable files up to the factual level of the two 2026 PDF inputs without inventing claims or exposing unnecessary personal data.

## Scope

- In scope: English and Czech CV routes, current CV sections, factual content reconciliation, locale-specific PDF downloads, Download Action states, responsive layout, dark mode, metadata, accessibility and regression coverage.
- Out of scope: editing or regenerating the source PDFs, Payload localization/schema changes, a new Figma file, a new logo, unrelated page redesigns, or broad changes to the shared Button contract.

## Sources Of Truth

- Visual layout and interaction:
  - desktop light `124:369`;
  - tablet light `132:399`;
  - mobile light `131:593`;
  - desktop dark `136:190`;
  - mobile dark `136:283`;
  - Download Action component set `122:181`;
  - canonical Button component set `21:110` for shared control properties.
- Brand behavior: `docs/brand/brand-guidelines.md` and `docs/brand/brand-decision-log.md`.
- Factual PDF inputs:
  - `docs/Karel_Kutchan_CV.pdf` - current general Czech Senior Frontend Engineer profile, including BlueGhost from 03/2025;
  - `docs/Karel_Kutchan_CV_Frontend_React_Engineer_2026.pdf` - current English React/CMS-targeted profile.
- Current implementation: `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/**` and `messages/{en,cs}.json`.

## Confirmed Baseline

- The route and localized metadata already exist for unprefixed English and `/cs` Czech URLs.
- Current HTML copy is stale: it describes a mid-level engineer with eight years of experience and treats the Kontent.ai contract as current; neither matches the general 2026 PDF.
- Current public PDF `public/curriculum-vitae/CV_Karel_Kutchan.pdf` is the older English CV and includes outdated content and unnecessary personal fields.
- The current floating action imports legacy `ExpandingButton.module.css` directly, uses pill radius and legacy color tokens, expands only on hover, and has no explicit reduced-motion or touch treatment.
- The CV styles use legacy aliases such as `--background`, `--accent`, `--text-color-*`, `--spacing-*` and `--border-color` instead of the current semantic design-system tokens.
- Existing automated CV coverage verifies catalog parity, metadata and locale switching, but does not verify layout, dark mode, download assets, interaction states or content freshness.

## Assumptions And Content Rules

- The two PDFs are related variants, not literal translations. Shared factual claims must be reconciled deliberately; target-specific wording from the English React profile must not silently become a universal claim.
- The general 2026 CV is authoritative for employment chronology and current role. Claims that conflict across the PDFs require owner confirmation before publication.
- English keeps the existing stable PDF URL for backward compatibility, with its contents replaced by the current English PDF. Czech receives a distinct Czech PDF URL and an accurately localized download label.
- HTML CV content remains fully localized static portfolio content in `next-intl`; Payload remains out of scope.
- Dates, company IDs, URLs and technology identifiers are locale-neutral structured facts. Descriptive prose and accessible labels remain in both message catalogs.
- Public HTML and PDFs may differ in editorial depth, but must not contradict each other about current role, seniority, chronology or contact identity.

## File Map

- `AGENTS.md` - permanent brand and CV design-source rules.
- `docs/Karel_Kutchan_CV.pdf` - Czech factual/source PDF; read-only input.
- `docs/Karel_Kutchan_CV_Frontend_React_Engineer_2026.pdf` - English factual/source PDF; read-only input.
- `public/curriculum-vitae/CV_Karel_Kutchan.pdf` - stable English public download; replace contents without changing the URL.
- `public/curriculum-vitae/CV_Karel_Kutchan_CS.pdf` - new Czech public download.
- `src/content/curriculum-vitae.ts` - create locale-neutral CV facts, stable entry IDs and per-locale PDF targets.
- `messages/en.json`, `messages/cs.json` - revise the matching `curriculumVitae` namespaces with current, equivalent presentation copy.
- `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx` - compose the redesigned semantic page and select the locale-correct PDF.
- `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.module.css` - implement the responsive page shell from semantic tokens.
- `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/sections/**` - adapt or consolidate the biography, capabilities, experience, education and contact sections to the approved composition.
- `src/app/(frontend)/components/primitives/downloadAction/index.tsx` - create the accessible Download Action matching Figma `122:181`.
- `src/app/(frontend)/components/primitives/downloadAction/DownloadAction.module.css` - implement token-bound states, expansion, responsive behavior and reduced motion.
- `src/app/(frontend)/components/primitives/expandingButton/**` - remove only after repository-wide usage confirms the legacy primitive is unused.
- `src/__tests__/unit/curriculum-vitae-i18n.test.ts` - update factual/catalog/PDF-language assertions.
- `src/__tests__/components/download-action.test.tsx` - add semantic and state coverage for the download control.
- `src/__tests__/e2e/curriculum-vitae.spec.ts` - add route, asset, interaction, responsive, theme and visual-contract checks.

## Tasks

### Task 1: Capture The Implementation Baseline

Objective:
- Produce reproducible before evidence and exact Figma implementation context before changing code.

Implementation notes:
- Record the starting Git SHA, local URL, locale, theme and viewport.
- Load design context for `124:369`, `132:399`, `131:593`, `136:190`, `136:283` and component set `122:181`; inspect the canonical Button `21:110` only for shared properties.
- Capture current browser screenshots and computed layout/control values at 1440, 768 and 390 px for English and Czech, with representative light and dark states.
- Record existing download response headers, file size and PDF language at the stable public URL.

Validation:
- A Figma-versus-web baseline lists exact nodes, selectors, expected/actual values and unverified combinations.
- No repository or Figma mutation occurs during baseline collection.

### Task 2: Freeze Public Facts And Download Mapping

Objective:
- Reconcile chronology, seniority, current role, contact identity and PDF language before layout implementation.

Implementation notes:
- Use the general 2026 PDF as the chronology baseline: BlueGhost from 03/2025, Kontent.ai ending 02/2025, and more than ten years of web experience.
- Compare every shared claim with the English targeted PDF. Keep React/CMS-targeted framing limited to the English PDF unless it is approved as general portfolio copy.
- Confirm the public email against the portfolio contact source and remove birth date, birth place, citizenship and street address from the web experience; do not reproduce those legacy fields.
- Define stable employment and skill IDs plus locale-specific PDF URLs in `src/content/curriculum-vitae.ts`.
- Replace the existing English public PDF contents at its stable URL and add the Czech public file without modifying either source PDF under `docs`.

Validation:
- The chronology table has no conflicting current roles or overlapping periods left unexplained.
- `pdftotext` confirms the public English and Czech assets contain the expected title/current role and no accidental file swap.
- Both PDF URLs return HTTP 200 with `application/pdf` in the production smoke environment.

### Task 3: Update Localized CV Content

Objective:
- Replace stale HTML CV text with current, professionally written English and Czech copy aligned with the approved page structure.

Files:
- Modify `messages/en.json` and `messages/cs.json`.
- Modify `src/__tests__/unit/curriculum-vitae-i18n.test.ts`.

Implementation notes:
- Preserve identical recursive key structure in both catalogs.
- Update metadata, seniority, experience duration, current role, biography, capabilities, experience and education from the frozen fact set.
- Give each download label its true language/profile meaning; Czech must no longer claim that its linked file is English.
- Keep claims evidence-led and avoid fabricated metrics or mechanical Czech translation.

Validation:
- Catalog parity and non-empty-value tests pass.
- Unit assertions prove the current role, more-than-ten-year positioning, matching entry IDs and correct PDF-language labels.

### Task 4: Implement The Download Action Contract

Objective:
- Replace the legacy hover-only pill with a reusable, accessible control matching Figma component set `122:181`.

Files:
- Create `src/app/(frontend)/components/primitives/downloadAction/index.tsx`.
- Create `src/app/(frontend)/components/primitives/downloadAction/DownloadAction.module.css`.
- Delete `src/app/(frontend)/components/primitives/expandingButton/**` only after confirming no remaining consumers.

Implementation notes:
- Render a real anchor with `download`, an accessible name and decorative download icon.
- Map default, hover, active and focus-visible behavior to the Figma variants and prototype reactions; do not fake browser focus with hover.
- Use semantic action/surface/text/focus tokens, system spacing, 52 px large-control geometry and 4 px radius.
- Keep the label available to assistive technology in every state. On touch/coarse-pointer layouts, show a stable understandable label rather than requiring hover expansion.
- Respect `prefers-reduced-motion`; eliminate width animation while preserving state clarity.
- Keep the floating placement clear of content, mobile safe areas, navigation/footer controls and browser zoom.

Validation:
- Component tests prove anchor semantics, `download`, accessible name and locale-specific href.
- Keyboard focus is visible; hover and active do not alter geometry outside the approved component contract.
- Reduced-motion and coarse-pointer checks remain usable without hover.

### Task 5: Rebuild The CV Page From The Approved Frames

Objective:
- Implement the Figma hierarchy and layout across desktop, tablet, mobile and dark mode without one-off hardcoded palettes.

Files:
- Modify `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx`.
- Modify `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.module.css`.
- Modify the section components and CSS modules under `sections/**`.

Implementation notes:
- Preserve semantic heading order and meaningful section landmarks.
- Drive repeated experience/capability rows from stable structured facts and translated message keys rather than duplicated component-local arrays.
- Replace legacy visual aliases with the approved semantic color, spacing, radius, typography and responsive tokens.
- Let the shared `data-theme` contract select light/dark values; do not build separate hardcoded palettes.
- Match 1440 and 390 first, then 768; validate Czech wrapping as a layout input rather than shrinking text or deleting copy.
- Keep contact links accessible and consistent with the centralized public identity.

Validation:
- DOM has one `h1`, ordered section headings, valid links and no duplicated IDs.
- No visible descendant overflows at 1440, 768, 430, 390 and 320 px.
- English and Czech render without clipping in both themes.

### Task 6: Preserve Routing, Metadata And Loading Behavior

Objective:
- Keep the CV as a direct, indexable, localized static route while introducing the new composition.

Implementation notes:
- Preserve `setRequestLocale`, locale validation and `createLocalizedMetadata`.
- Keep English unprefixed and Czech under `/cs`; retain correct canonical, language alternates and Open Graph locale.
- Keep the route-local loading boundary narrow. Do not introduce a locale-wide loading file.
- Ensure navigation and locale switching stay on the corresponding CV route.

Validation:
- `/curriculum-vitae` renders English with `lang="en"` and `/cs/curriculum-vitae` renders Czech with `lang="cs"`.
- Canonical and hreflang assertions remain correct and both routes return HTTP 200.
- Switching language preserves the CV pathname and query/hash behavior already covered by the i18n suite.

### Task 7: Add CV Regression Coverage

Objective:
- Protect the new content, interaction and visual contracts at the narrowest useful levels.

Implementation notes:
- Extend unit coverage for shared fact IDs, catalog parity, metadata and language-correct PDF links.
- Add component coverage for the Download Action's semantics and non-pointer usability.
- Add Chromium E2E coverage for both locales, PDF responses, focus, hover, reduced motion, light/dark surfaces and responsive overflow.
- Use computed-style assertions for exact control height, radius, key spacing and theme tokens. Add screenshots only for stable whole-page states.

Validation:
- Targeted Vitest and Chromium CV tests pass before the full suite.
- Test failures identify locale, viewport, theme and state rather than relying on one undifferentiated screenshot.

### Task 8: Perform Final Figma-To-Web Acceptance

Objective:
- Close the implementation only after measured parity and repository-native validation.

Implementation notes:
- Repeat the baseline comparison for all five screen nodes and the Download Action variants.
- Preserve before-and-after screenshots and classify each finding as fixed, accepted, deferred or blocked.
- Record any factual/design ambiguity instead of compensating with unrelated CSS.

Validation:
- Required focused checks pass, followed by:

```powershell
pnpm test
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
pnpm exec playwright test --project=chromium
git diff --check
git status --short
```

- Final browser evidence covers 1440, 768 and 390 px, English and Czech, light and dark, default/hover/active/focus download states, reduced motion and real PDF downloads.
- No overall parity claim is made unless every required matrix cell is measured; remaining gaps are listed explicitly.

## Execution Order And Handoff

1. Complete Tasks 1-3 as the content/baseline phase and obtain owner approval for conflicting facts before rendering them publicly.
2. Start a clean implementation session for Tasks 4-6 using only the approved fact model, message keys and known Figma node IDs.
3. Run Task 7 in the implementation branch, then use a separate clean verification pass for Task 8.
4. Keep Playwright evidence out of Figma-only inspection sessions and hand off only stable node IDs, measured differences and remaining acceptance criteria.

The plan is ready for implementation once the owner confirms the shared public email and accepts the proposed PDF mapping: stable English URL for the English 2026 React profile plus a separate Czech PDF URL for the Czech 2026 general profile.
