# CV And Booking Execution Worklist

## Goal

- Implement the approved localized Curriculum Vitae redesign and verify it against the five approved Figma frames and Download Action component.
- Immediately after CV completion, implement and verify the centralized localized consultation-booking flow.
- Commit, push and create a verified pull request targeting `dev` without merging it.
- Keep one controller-owned checklist for implementation, delegated work, validation evidence, blockers and handoff state.

## Status Legend

- `[ ]` pending
- `[-]` in progress
- `[x]` completed and controller-verified
- `[!]` blocked or requires an explicit decision

## Locked Decisions

- [x] Public email: `karel@codeguy.cz`.
- [x] Stable English PDF URL: `/curriculum-vitae/CV_Karel_Kutchan.pdf`.
- [x] Stable English URL will serve the 2026 English React profile.
- [x] Czech PDF URL: `/curriculum-vitae/CV_Karel_Kutchan_CS.pdf`.
- [x] Czech URL will serve the 2026 Czech general profile.
- [x] English route remains `/curriculum-vitae`.
- [x] Czech route remains `/cs/curriculum-vitae`.
- [x] HTML CV remains static localized `next-intl` content; Payload is out of scope.
- [x] Booking implementation follows CV completion in the same delivery branch and PR.

## Controller Work Queue

### Phase 0: Execution Surface And Orchestration

- [x] Confirm repository and clean starting state.
  - Workspace: `C:\web\CG\codeguy\cg-portfolio-web`
  - Starting commit: `2d5c55b`
- [x] Create implementation branch `feat/curriculum-vitae-redesign`.
- [x] Load repository instructions and the approved CV implementation plan.
- [x] Load execution, worktree, orchestration, PDF and Figma design-to-code workflows.
- [x] Create bounded read-only audit packets for source, tests and design system.
- [x] Record external-agent failures without trusting partial output.
- [x] Create this persistent worklist.

### Phase 1: Measured Baseline

- [x] Load Figma design context for:
  - desktop light `124:369`;
  - tablet light `132:399`;
  - mobile light `131:593`;
  - desktop dark `136:190`;
  - mobile dark `136:283`;
  - Download Action `122:181`;
  - canonical Button `21:110`.
- [x] Capture whole-frame Figma screenshots for the five CV frames and Download Action.
- [x] Record approved responsive measurements:
  - desktop page gutter `120px`, section block padding `96px`;
  - tablet page gutter `48px`, section block padding `72px`;
  - mobile page gutter `20px`, section block padding `64px`;
  - section heading gap `8px`, section content gap `32px`;
  - Download Action height `52px`, radius `4px`, gap `8px`, inline padding `20px`;
  - user-approved cloud-download icon `24px`, inline SVG with `currentColor`;
  - Download Action motion intent `200ms` expansion/collapse and `100ms` active transition;
  - dark mode uses the same semantic tokens with adaptive values.
- [x] Record Figma content conflicts that must not be copied:
  - Figma biography still says `8+ years`;
  - Figma contact row still uses the non-canonical email;
  - factual plan and confirmed public identity override those mockup strings.
- [x] Extract safe factual checks from the two source PDFs.
- [x] Capture current local-browser screenshots and computed values at 1440, 768 and 390 px.
- [x] Record the current public PDF response, MIME type, size and language before replacement.
- [x] Save a compact before-comparison matrix with route, locale, theme, viewport, selector, expected and actual values.
  - Evidence: `docs/audits/2026-07-30-cv-redesign-baseline.md`

### Phase 2: Public Facts And Assets

- [x] Create `src/content/curriculum-vitae.ts`.
- [x] Define stable IDs for employment, highlights, Core Skills rows, projects, education and languages.
- [x] Define locale-neutral periods and current-role identity.
- [x] Freeze chronology:
  - BlueGhost starts `2025-03` and is current;
  - Kontent.ai ends `2025-02`;
  - public positioning is Senior Frontend Engineer with more than ten years of web experience.
- [x] Derive public contact identity from the centralized site/contact source.
- [x] Omit phone and unnecessary personal fields unless an existing centralized public source explicitly owns them.
- [x] Replace the stable English public PDF with the 2026 English React profile.
- [x] Add the Czech public PDF at the confirmed Czech URL.
- [x] Verify both public assets with `pdftotext` without exposing private values in test output.
- [x] Verify English/Czech files are not swapped.

### Phase 3: Localized Content

- [x] Update `messages/en.json` `curriculumVitae` namespace.
- [x] Update `messages/cs.json` `curriculumVitae` namespace with natural professional Czech.
- [x] Preserve recursive catalog-key parity and non-empty values.
- [x] Update metadata, title, biography, capabilities, chronology, education and download disclosure.
- [x] Keep structured facts out of the message catalogs.
- [x] Update `src/__tests__/unit/curriculum-vitae-i18n.test.ts`.
- [x] Prove stable fact IDs, chronology, current role, experience positioning and locale-specific PDF mapping.
- [x] Prove no public-model keys expose birth date, birth place, citizenship or street address.
- [x] Run targeted unit tests before continuing.

### Phase 4: Download Action

- [x] Add `src/app/(frontend)/components/primitives/downloadAction/index.tsx`.
- [x] Add `src/app/(frontend)/components/primitives/downloadAction/DownloadAction.module.css`.
- [x] Render a native anchor with `download`, accessible name and decorative icon.
- [x] Implement semantic default, hover, active and focus-visible states.
- [x] Implement fine-pointer compact-to-expanded behavior.
- [x] Keep an understandable visible label on coarse pointers.
- [x] Disable width animation under `prefers-reduced-motion`.
- [x] Keep the action within viewport and safe-area bounds.
- [x] Add `src/__tests__/components/download-action.test.tsx`.
- [x] Prove anchor semantics, accessible name, `download`, icon decoration, keyboard reachability and both locale targets.
- [x] Replace the CV page's direct legacy stylesheet import and inline anchor.
- [x] Run a final repository-wide usage search.
- [x] Remove `src/app/(frontend)/components/primitives/expandingButton/**` only when no consumer remains.

### Phase 5: Responsive CV Page

- [x] Rebuild the page hierarchy from the approved Figma frames.
- [x] Preserve locale validation, `setRequestLocale` and localized metadata.
- [x] Use semantic surface, text, action, border, spacing, radius and typography tokens.
- [x] Reuse the shared `Container` and compatible shell primitives where measurements match.
- [x] Do not widen the shared Button or Timeline contracts for CV-specific behavior.
- [x] Render repeated rows from the structured fact model and translated message keys.
- [x] Remove CV usage of `ExpandableText` if the approved full-content frames require no disclosure interaction.
- [x] Use one `h1`, ordered section headings, list/time/address semantics and valid contact links.
- [x] Implement responsive gutters and section rhythm at 1440, 768 and 390 px.
- [x] Verify additional 430 and 320 px reflow layouts.
- [x] Complete the manual zoom-sensitive layout smoke.
  - Chromium 390px at 200% root text scale, EN/CS and light/dark: document width remained 390px with no visible descendant overflow.
- [x] Update the route-local loading style to semantic tokens and reduced-motion behavior.
- [x] Validate English and Czech wrapping in light and dark mode.

### Phase 6: Browser And Regression Coverage

- [x] Add `src/__tests__/e2e/curriculum-vitae.spec.ts`.
- [x] Cover both locale routes, `<html lang>`, one localized visible/accessibility string and semantic headings.
- [x] Cover real PDF HTTP status, MIME type and browser download behavior.
- [x] Cover 1440, 768 and 390 px in English/Czech and light/dark.
- [x] Cover 430 and 320 px overflow checks.
- [x] Reuse the visible-descendant overflow helper rather than document width alone.
- [x] Cover hover, active, keyboard focus, coarse pointer and reduced motion.
- [x] Assert exact Download Action height, radius, state geometry and viewport placement.
- [x] Extend `src/__tests__/e2e/i18n-seo.spec.ts` for both CV locales.
- [x] Extend `src/__tests__/e2e/i18n-switcher.spec.ts` for CV query/hash preservation.
- [x] Run focused Vitest and Chromium CV checks.

### Phase 7: Final Acceptance And Repository Gates

- [x] Repeat the five-frame Figma-versus-web comparison.
- [x] Preserve before/after evidence and classify findings as fixed, accepted, deferred or blocked.
- [x] Verify English and Czech at 1440, 768 and 390 px in both themes.
- [x] Verify default, hover, active, focus, coarse-pointer and reduced-motion Download Action states.
- [x] Verify real PDF responses in a built standalone server.
- [x] Run `pnpm test` — 19 files, 134 tests passed.
- [x] Run `pnpm test:unit` — 17 tests passed.
- [x] Run `pnpm typecheck` — passed.
- [x] Run `pnpm lint` — 0 errors; 3 pre-existing warnings in `home-flagship-parity.spec.ts`.
- [x] Run `pnpm format:check` — resolved at the root cause. `biome.json` used `lineEnding: "auto"`, so the gate demanded CRLF on Windows and LF on Linux for the same working copy. Pinned to `lf` and added `.gitattributes`; no file content changed and the gate is now clean.
- [x] Run `pnpm build` — optimized Next.js 16 production build passed; both booking routes prerendered.
- [x] Run `pnpm exec playwright test --project=chromium --workers=1` against the standalone build — 233/237 passed, all 53 CV/booking tests green.
  - The earlier run reported 8 extra SEO failures only because the artifact was built with canonical origin `localhost:3000` and served on port `3100`. Re-running the standalone server on its build-time origin makes all 66 SEO/switcher/booking/CV tests pass.
  - Remaining 4 failures are branch-external:
    - `home-hero-anchoring:266` and `home-integrated-parity` at EN 390px assert `MOBILE_GUTTER_HERO_GROWTH` = 22.203125px within ±0.1px; this machine measures −2.453125px. The constant is coupled to the browser's reserved scrollbar gutter. The branch changes no Home block, no Home CSS and no `home` message key, so Home output is identical to `dev`.
    - `launch:27` readiness and `i18n-routing:119` CMS 404 require the Postgres container; Docker Desktop could not be started unattended in this session. The branch touches no health, readiness, insights or API file.
- [x] Run `git diff --check`.
- [x] Inspect `git status --short` and confirm only intended files changed.
- [x] Run controller-owned review and completion verification.
  - Reviewed `booking.ts`, `BookingScheduler`, `BookingCta`, the booking route, `DownloadAction` and the CV composition; no blocking finding.
  - Confirmed `Button renders="link"` uses the locale-aware `Link` from `@/i18n/navigation`, so every contextual CTA resolves per locale.
  - Dropped an out-of-scope `Navigation.module.css` change found in the working tree: it moved the scrolled desktop surface onto the nav element and broke the asserted contract at `launch.spec.ts:188`. Removing it restored that test.
  - `tmp/` and `.playwright-mcp/` were staged but never committed; both are now gitignored. `tmp/pdfs/cv-audit/*.txt` duplicated the CV phone number as plaintext in the repository.

### Phase 8: Booking Flow Implementation

- [x] Re-read the booking findings and repository state after CV completion.
- [x] Reconfirm the Google Appointment Schedule response and record the unverifiable ownership limitation.
  - `2026-07-30`: HTTP 200, `text/html`, title `Book a consultation`;
  - the public response does not prove which Google account owns the schedule.
- [x] Define localized routes `/contact/book` and `/cs/contact/book`.
- [x] Define the single neutral introductory-call offer and translated copy.
- [x] Map contextual CTA placement for Contact, CV/Experience and case-study detail.
- [x] Specify iframe lazy loading, consent/privacy behavior, accessibility and email/external-link fallback.
- [x] Specify responsive, dark-mode and failure states that need approved Figma nodes.
- [x] Map source files, translation keys, unit/component/E2E tests and production smoke.
- [x] Save a concise booking implementation record under `docs/plans/`.
  - Evidence: `docs/plans/2026-07-30-booking-flow-implementation-record.md`
- [x] Implement one locale-neutral booking configuration source.
- [x] Implement the localized booking route with deferred Google iframe loading.
- [x] Implement visible e-mail and external-calendar fallbacks.
- [x] Add contextual booking CTA to Contact, CV/Experience and case-study detail without a global modal.
- [x] Retire the legacy booking modal only after repository-wide usage confirms no consumer remains.
- [x] Add focused unit/component/E2E coverage for both locales, keyboard use, iframe loading, fallback links and responsive/theme behavior.
- [x] Run focused and full validation.

### Phase 9: Branch Delivery

- [x] Review the complete diff and exclude temporary/browser evidence from the commit.
- [x] Verify the branch still targets an up-to-date `dev` ancestry and resolve only in-scope conflicts.
  - `dev` already carried the brand-identity change as squash merge `7a732fb`; the local duplicate `2d5c55b` had an identical tree and was dropped by the rebase without conflicts.
- [x] Create scoped commits after checking the staged file list.
- [x] Push `feat/curriculum-vitae-redesign` and confirm its remote SHA.
- [!] Create a PR targeting `dev` — `gh` is not installed in this environment, so the PR must be opened from the compare URL. Body prepared by the controller.
- [ ] Independently verify PR number, URL, base, head and head SHA.
- [x] Do not merge, enable auto-merge, delete the branch or trigger deployment.

## Agent Orchestration Ledger

### Controller

- Status: `in progress`
- Ownership:
  - architecture and scope decisions;
  - Figma/PDF evidence;
  - shared files and integration;
  - all mutations until implementation packets are explicitly assigned;
  - final validation and user-facing claims.

### Native Agent: Source Audit

- Status: `completed`
- Mode: read-only
- Result accepted:
  - confirmed stale mid-level/eight-year/Kontent-current content;
  - confirmed conflicting hardcoded CV email;
  - confirmed missing structured fact model and Czech PDF;
  - confirmed legacy ExpandingButton stylesheet is the only runtime consumer;
  - identified `ExpandableText` accessibility mismatch.
- Mutations: none.

### Native Agent: Test And Routing Audit

- Status: `completed`
- Mode: read-only
- Result accepted:
  - defined unit/component/Chromium proof split;
  - identified production-rewrite and standalone-PDF smoke requirement;
  - identified stronger visible-descendant overflow helper;
  - identified `pnpm test:unit` does not run Vitest CV tests.
- Mutations: none.

### Native Agent: Design-System Audit

- Status: `completed`
- Mode: read-only
- Result accepted:
  - confirmed CV currently has no semantic-token usage;
  - identified undefined `--border-color` and `--font-size-base`;
  - mapped legacy aliases to semantic tokens;
  - confirmed shared Container and Button geometry can be reused without widening shared contracts;
  - identified route-local loading and reduced-motion gaps.
- Mutations: none.

### Native Agent: Booking Integration Audit

- Status: `completed; controller-accepted`
- Mode: read-only
- Ownership:
  - inspect the surviving booking modal, Contact, Experience and case-study composition;
  - identify the narrowest route/config/CTA/test file map;
  - record privacy, iframe, locale and production-routing risks.
- Forbidden scope:
  - no repository writes;
  - no browser mutation, Figma writes, credentials, Git history or external service changes.
- Result accepted:
  - identified dormant legacy modal and dead Home consumer;
  - confirmed existing CSP already permits `calendar.google.com`;
  - mapped the required English rewrite, localized route, deferred scheduler, fallback links, shared CTA and test surfaces;
  - documented the external facts that cannot be proved from repository state.

### Native Agent: Booking Config And Localized Copy

- Status: `completed; controller-reviewed`
- Mode: test-first implementation
- Write ownership:
  - `src/content/booking.ts`;
  - `messages/en.json`;
  - `messages/cs.json`;
  - `src/__tests__/unit/booking-config.test.ts`.
- Forbidden scope:
  - pages, components, CSS, routing, sitemap and E2E;
  - CV fact model and tests;
  - Git history, Figma and external services.
- Required proof:
  - a missing-config red test;
  - targeted unit and global catalog-parity green tests;
  - no unverified duration, price, timezone, availability or owner claims.
- Controller verification:
  - config, messages, test and `git diff --check` inspected;
  - targeted booking-config plus global catalog-parity Vitest run passes: 2 files, 8 tests;
  - config derives the central e-mail and contains no unverified scheduling claims.

### Native Agent: Deferred Booking Scheduler

- Status: `completed; controller-reviewed`
- Mode: test-first implementation
- Write ownership:
  - `src/components/booking/BookingScheduler.tsx`;
  - `src/components/booking/BookingScheduler.module.css`;
  - `src/__tests__/components/booking-scheduler.test.tsx`.
- Forbidden scope:
  - catalogs, config, pages, routing, sitemap, shared controls, CV files and E2E;
  - Git history, Figma and external services.
- Required proof:
  - no iframe on initial render;
  - keyboard activation creates exactly one iframe;
  - direct calendar and e-mail fallbacks remain visible before and after load;
  - targeted component test passes after a missing-component red.
- Controller verification:
  - component, CSS, test and `git diff --check` inspected;
  - targeted component Vitest passes: 1 file, 3 tests;
  - primary load action corrected to the approved 52px large-control geometry.

### Native Agent: Booking Route And Shared CTA

- Status: `completed; controller-reviewed`
- Mode: test-first integration
- Write ownership:
  - localized booking route and styles;
  - shared `BookingCta`;
  - English rewrite;
  - sitemap and its unit test.
- Controller verification:
  - owned diff and routing/configuration inspected;
  - targeted booking config, scheduler and sitemap run passes: 3 files, 11 tests;
  - dev HTTP checks: English/Czech routes `200`, `/en/contact/book` normalizes with `307`;
  - browser interception proves zero Google requests initially and exactly one after activation.

### Native Agent: Booking Entry-Point Integration

- Status: `completed; controller-reviewed`
- Mode: scoped implementation
- Write ownership:
  - Contact, Experience, Curriculum Vitae and shared case-study composition;
  - dormant Home Contact section import cleanup.
- Required proof:
  - all four contextual routes point to locale-aware `/contact/book`;
  - no legacy modal consumer remains;
  - CV uses the approved secondary hero placement rather than an unapproved full booking band.
- Controller verification:
  - exact placements inspected in all five affected compositions;
  - repository search reports no remaining legacy booking/download component consumer or stale runtime contact value;
  - legacy modal, legacy ExpandingButton and superseded CV section modules were removed.

### Native Agent: CV Chromium Regression

- Status: `completed; controller-reviewed`
- Write ownership:
  - `src/__tests__/e2e/curriculum-vitae.spec.ts`.
- Controller verification:
  - independent targeted Chromium run passes 28/28;
  - covers both locales, both themes, responsive/overflow widths, PDFs, download behavior, hover, real Tab focus, reduced motion and coarse pointer.

### Native Agent: Fact Model And Localized Content

- Status: `completed; controller-reviewed`
- Mode: test-first implementation
- Write ownership:
  - `src/content/curriculum-vitae.ts`;
  - `messages/en.json`;
  - `messages/cs.json`;
  - `src/__tests__/unit/curriculum-vitae-i18n.test.ts`.
- Forbidden scope:
  - page and section components;
  - CSS modules;
  - public PDF assets;
  - shared contact sources;
  - Git history and external services.
- Required proof:
  - targeted CV Vitest test fails first for missing fact/PDF behavior;
  - the same targeted test passes after the smallest content-model/catalog change;
  - English/Czech recursive key structure remains identical.
- Controller verification:
  - owned-file diff and `git diff --check` inspected;
  - targeted CV fact/localization plus global catalog-parity Vitest run passes: 2 files, 9 tests;
  - 4 highlight and 7 Core Skills row structures match the approved page hierarchy.

### Native Agent: Download Action

- Status: `completed; controller-reviewed`
- Mode: test-first implementation
- Write ownership:
  - `src/app/(frontend)/components/primitives/downloadAction/index.tsx`;
  - `src/app/(frontend)/components/primitives/downloadAction/DownloadAction.module.css`;
  - `src/__tests__/components/download-action.test.tsx`.
- Controller-owned dependency:
  - user-approved cloud-download asset `public/icons/download.svg`;
  - the component renders the same SVG inline so `currentColor` is inherited correctly.
- Forbidden scope:
  - CV page and sections;
  - message catalogs and fact model;
  - shared Button contract and global tokens;
  - Git history and external services.
- Required proof:
  - component test fails first because the component does not exist;
  - component test passes after the smallest semantic anchor implementation;
  - CSS contract is later proven in Chromium by the controller.
- Controller verification:
  - owned-file diff and `git diff --check` inspected;
  - `pnpm exec vitest run src/__tests__/components/download-action.test.tsx` passes: 1 file, 2 tests;
  - pseudo-class, media-query and placement behavior remains open for Chromium.

### Claude Code

- Status: `blocked`
- Intended role: independent read-only implementation review.
- Attempt evidence:
  - first bounded call timed out;
  - second call exhausted its explicit `$0.50` call budget before returning a usable result;
  - user-reported current session usage is 91%.
- Next action:
  - reserve at most one short Haiku review for a small post-implementation diff if quota permits;
  - do not use Opus or a broad repository audit.

### GitHub Copilot CLI

- Status: `blocked`
- Intended role: independent read-only test/routing review.
- Blocker:
  - CLI reports no authentication information;
  - `gh` is not installed in this environment.
- Next action:
  - do not alter credentials or start login without explicit authorization;
  - native test audit is the current fallback.

### Mistral Vibe

- Status: `blocked`
- Intended role: independent read-only design-system review.
- Blocker:
  - local Vibe configuration merge fails with `CONCAT requires list operands, got list and dict`.
- Next action:
  - do not modify global Vibe configuration within this task;
  - native design-system audit is the current fallback.

## Delegation Rules For Implementation

- One implementation packet at a time unless write scopes are provably disjoint.
- Every packet must name exact owned files and forbidden shared files.
- Agents may not commit, push, switch branches, stash, install, publish or deploy.
- The controller reviews every diff and runs the stated validation before advancing.
- External-model output is advisory until independently checked against code, tests, Figma and runtime behavior.
- Shared catalogs, page composition and global configuration remain controller-owned unless reassigned explicitly.

## Current Risks And Decisions

- [x] Figma text is visually authoritative but factually stale; confirmed facts override mockup copy.
- [x] Public email is `karel@codeguy.cz`.
- [-] Phone is omitted from the new public HTML model unless a centralized public source and owner approval justify it.
- [x] Biography and CV skills should render fully; the approved frames do not rely on the legacy disclosure interaction.
- [x] Download Action is a native anchor that shares Button geometry/tokens but remains a narrow CV component.
- [x] User-supplied cloud-download SVG overrides the earlier 20px Figma glyph: `24px`, `currentColor`, decorative and inline in the component.
- [!] External Claude, Copilot and Vibe reviews are currently unavailable for the recorded provider-specific reasons.
- [x] User explicitly expanded delivery to the implemented booking flow and a verified PR targeting `dev`.
- [!] Booking has no approved Figma screen nodes; implementation must reuse the existing design system and cannot be claimed as measured Figma parity.

## Progress Log

### 2026-07-30 — Setup And Baseline

- Created `feat/curriculum-vitae-redesign` from the clean documentation-plan commit, which is a descendant of `dev`.
- Completed critical review of the implementation plan.
- Loaded all required Figma contexts and recorded responsive/token geometry.
- Completed safe factual extraction from both source PDFs.
- Completed three independent native read-only audits.
- Recorded failed external-agent attempts and applied safe fallbacks.
- Captured English-light and Czech-dark browser screenshots at 1440, 768 and 390 px.
- Recorded measured current/Figma mismatches and legacy PDF response headers in `docs/audits/2026-07-30-cv-redesign-baseline.md`.
- Replaced the stable English public PDF and added the Czech public PDF; source/target SHA-256 hashes match exactly.
- Verified both PDF URLs return HTTP 200 with `application/pdf` and the expected file sizes.
- Product source code is still unchanged; only the approved public PDF assets and execution evidence have changed.

### 2026-07-30 — Implementation Started

- Assigned disjoint test-first implementation packets for the fact model/localized content and Download Action.
- Updated `public/icons/download.svg` to the user-approved 24px cloud-download icon and propagated the same inline-SVG contract to the Download Action implementer.
- Accepted the Download Action implementation after controller diff review and an independent passing targeted Vitest run.
- Accepted the centralized CV fact model and localized content after controller review and an independent 9/9 targeted test run.
- Accepted the read-only booking integration audit and assigned a disjoint test-first config/catalog packet.
- Accepted the booking config/localized-copy packet after controller review and an independent 8/8 targeted test run.
- Accepted the deferred scheduler after controller review, 3/3 tests and correction to 52px large-action geometry.
- Accepted the CV source composition after exact token/geometry corrections; browser and Figma acceptance remain open.
- Accepted the booking route/shared CTA after 11/11 focused tests and browser proof of deferred third-party loading.
- Accepted the booking entry-point integration and removed all zero-consumer legacy booking/CV download code.
- Accepted the CV browser regression suite after an independent 28/28 Chromium run.
- Accepted the shared booking/SEO/locale-switching packet after controller diff review and an independent 38/38 Chromium run with one worker.
- Production acceptance passed all 53 CV and booking tests against the standalone build, including real PDF responses.
- Captured and visually inspected five production screenshots corresponding to Figma nodes `124:369`, `132:399`, `131:593`, `136:190` and `136:283`.
- Full Chromium regression completed 233/237; the four failures are outside this branch's changed surfaces and are recorded as baseline/environment limitations rather than silently ignored.

### 2026-07-30 — Scope Expanded

- User requested the booking flow be implemented, not only planned, and requested a PR targeting `dev`.
- Expanded the controller queue with localized booking routes, deferred iframe, fallbacks, contextual CTAs, tests and verified PR delivery.
- Reconfirmed the exact public Google Appointment Schedule returns HTTP 200 and the title `Book a consultation`; ownership remains unverified from public evidence.
