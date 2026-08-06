# BL-002, BL-003 and CV navigation delivery plan

Date: 2026-08-06  
Branch: `feat/cv` (based on `dev`)  
Status: Figma solution updated; application implementation and repository validation pending

## Objective

Deliver the minimal BL-002 contact/CV consistency slice, complete BL-003 homepage identity and direct-contact work, and make Curriculum Vitae a first-class localized destination in desktop and mobile navigation.

This delivery slice does not include the broader Experience timeline, card-system refactoring, portrait work, PDF generation, or a language-selection dialog.

## Locked product decisions

1. Curriculum Vitae is present in the shared primary navigation.
   - English label: `Curriculum vitae`
   - Czech label: `Životopis`
   - Order: immediately after Experience/Zkušenosti and before About/O mně.
   - The navigation item opens the page; it never downloads the PDF.
2. CV downloads are locale-first.
   - English UI downloads the configured English PDF.
   - Czech UI downloads the configured Czech PDF.
   - No language-selection dialog is shown during the normal download flow.
3. The English React-focused CV and Czech general-profile CV are distinct profile versions, not equivalent translations. UI copy must not claim language-only equivalence.
4. Experience keeps two separate actions because they represent different intents:
   - view the localized CV page;
   - download the PDF configured for the current locale.
5. `ContactLink` and `DownloadAction` remain semantically separate.
   - `ContactLink`: e-mail or external profile navigation; location remains non-interactive.
   - `DownloadAction`: native file download with the approved cloud-download icon.
6. Homepage identity uses `Karel Kutchan` in the existing eyebrow/identity row.
   - The locked brand headline remains the only `h1`.
   - The flagship CTA remains primary.
   - The previous Experience hero action becomes a visible direct e-mail action.
   - No portrait, second headline, or third hero CTA is added.

## Figma source of truth

File: `Codeguy Portfolio - Final Design`  
File key: `cs38WzlXKY9xfDYBinoKel`

Implemented design delta:

- `Navigation` component variants contain `Curriculum vitae` after Experience.
- Desktop CV navigation uses the `Current` state.
- Mobile prototype menu contains `Curriculum vitae` and links to a scrollable CV destination.
- Experience has a responsive CV action section using Button and `CV Download Action` instances.
- CV contact rows use shared Contact Link instances for e-mail, LinkedIn and GitHub; Prague remains non-interactive metadata.
- Obsolete phone and `karel.kutchan@email.cz` content were removed from CV designs.
- PDF guidance states locale-first behavior and distinct profile versions.
- Homepage identity and direct e-mail action are represented at desktop, tablet, mobile, 320 px, 430 px, prototype and dark-mode checkpoints.

Relevant Figma evidence:

- Navigation component set: `21:357`
- Desktop CV frame: `124:369`
- Tablet CV frame: `132:399`
- Mobile CV frame: `131:593`
- Mobile menu prototype: `27:49`
- Scrollable CV prototype: `180:228`
- Desktop Experience CV actions: `181:492`
- Tablet Experience CV actions: `181:1914`
- Mobile Experience CV actions: `181:1925`

## Implementation sequence

### 1. Repository preflight

- Verify branch, base, staged diff and unstaged diff.
- Preserve the already staged backlog and production-delivery documents.
- Confirm the process helper can run `git status --short` and `rg` before dispatching CLI work.
- Do not use `git add -A`; stage explicit reviewed paths only.

### 2. BL-002 shared behavior

- Extend the existing `ContactLink` API only as far as required by CV and homepage usage.
- Preserve real anchor semantics for e-mail, LinkedIn and GitHub.
- Preserve a non-interactive element for location without a destination.
- Keep a minimum 44 by 44 px target, visible focus, and safe external-link behavior.
- Do not open `mailto:` in a new tab.
- Keep `DownloadAction` as the only CV download primitive.

### 3. Experience integration

- Keep the localized link to `/curriculum-vitae`.
- Replace the bespoke hardcoded English PDF anchor and `ArrowDownToLine` treatment.
- Resolve URL, filename and metadata from `curriculumVitae.pdfByLocale[locale]`.
- Render the existing cloud-icon `DownloadAction` with locale-neutral copy.
- Do not introduce timeline or card refactors in this step.

### 4. Curriculum Vitae integration

- Replace raw e-mail, LinkedIn and GitHub anchors with the approved contact contract.
- Read contact values from the central contact model.
- Keep location non-interactive.
- Preserve the existing three CV download placements and their test hooks.
- Replace English-only download guidance with locale-first/profile-aware copy.
- Do not add an alternate-language selector until the PDF profile model is explicitly redesigned.

### 5. Navigation

- Add one route-key entry to the shared navigation source used by desktop and mobile.
- Generate locale-aware URLs through the existing localized-link helper; do not hardcode `/cs`.
- Provide exact-route active state with one `aria-current="page"`.
- Ensure the locale switch preserves the CV route.
- Mobile menu activation must navigate and close the drawer; Escape and focus restoration remain intact.
- Keep PDF download actions out of the primary navigation.

### 6. BL-003 homepage

- Add `Karel Kutchan` to the existing identity/eyebrow content in both locales.
- Preserve the locked headline and single-`h1` contract.
- Replace the secondary Experience hero action with a compact visible e-mail ContactLink.
- Keep the flagship case action primary.
- Do not add a portrait or a third action.

### 7. Tests and validation

Component and integration coverage:

- ContactLink row/compact rendering and e-mail/external/location semantics.
- Experience view versus download intents.
- Correct locale PDF URL and filename.
- EN/CS navigation labels, order, href and exact active state.
- Desktop and mobile navigation use the same route-key source.
- Homepage identity, one unchanged `h1`, flagship CTA and direct e-mail.

Playwright and accessibility matrix:

- English and Czech.
- Desktop 1440 px, boundary 1024 px, tablet 768 px, mobile 390 px, QA 430 px and 320 px.
- Mobile menu open, keyboard activation, Escape, focus restoration and drawer close after navigation.
- Locale switch on the CV route.
- Browser back restores the previous active navigation state.
- Visible focus in light, dark and forced-colors modes.
- Minimum 44 px targets and no horizontal overflow or clipping.
- Real PDF response, configured filename and correct locale asset.

Repository gates:

- formatting check;
- generated-type sanity where applicable;
- typecheck;
- lint;
- unit/integration tests;
- targeted Playwright Chromium tests;
- broader test suite;
- production build and smoke verification.

## Review orchestration

- Main agent owns production integration, conflict resolution, staging, commit and push.
- Focused subagents review navigation/localization, BL-002 semantics and accessibility without overlapping writes.
- Vibe CLI performs a read-only architecture and UX diff review.
- Copilot CLI performs a read-only test-gap and regression review.
- External CLI findings are advisory; only evidence-backed findings are accepted.
- External CLI tools and subagents do not stage, commit or push.

## Dead ends and avoid-list

- Do not put delivery plans or internal process notes into Figma. Figma contains the resulting product design; plans belong in the repository.
- Do not model distinct EN React and CS general CVs as a simple language picker.
- Do not show a download-language dialog on every download.
- Do not hardcode the English PDF on Czech Experience.
- Do not duplicate PDF paths in individual pages.
- Do not merge contact navigation, non-interactive location and file download into one universal action component.
- Do not duplicate the CV item separately in desktop and mobile JSX.
- Do not hardcode `/cs` or derive active state with a broad pathname substring.
- Do not add a second `h1`, portrait, third hero CTA or Timeline refactor in this slice.
- Do not weaken existing geometry tests merely because the intended design changed; update them to assert the new contract.
- When Codex reports `setup refresh had errors`, distinguish the broken automated process launcher from a working interactive Vibe/Copilot terminal. Run one preflight and avoid repeated equivalent retries.

## Completion criteria

The work is complete only when code matches the Figma delta, all required tests and repository gates pass, independent reviews are resolved, documentation and dead-end records are updated, and the final explicit diff is committed and pushed from `feat/cv`.
