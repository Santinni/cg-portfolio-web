# Redesign Parity Audit And Release Plan

## Goal

- Refresh the historical redesign audit against the current `dev` branch, the approved Figma file, and the locally rendered English and Czech website.
- Convert confirmed release-significant findings into small Git Flow work packages, verify them, and prepare—but do not merge—the release PR from `dev` to `main`.

## Scope

- In scope: audit recovery, current evidence collection, finding reclassification, desktop/mobile Home, navigation and CTA parity, English/Czech behavior, release validation, audit and release PR preparation.
- Out of scope: silently changing approved Figma, inventing missing editorial content, merging PRs, deploying production, or rewriting shared `dev`/`main` history without explicit authorization.

## Assumptions

- Figma file `cs38WzlXKY9xfDYBinoKel` remains the approved visual source of truth.
- `dev` is the integration branch and `main` is the production branch.
- The historical stash remains recoverable until the refreshed audit is committed, pushed, and represented by a verified PR.
- A full redesign backlog does not block release unless current evidence confirms a P0 or release-blocking P1 affecting the critical public routes.

## File Map

- `docs/redesign-parity-audit.md` - historical recovered source; temporary and never committed at this path.
- `docs/audits/2026-07-29-redesign-parity.md` - refreshed, dated audit and finding status ledger.
- `docs/plans/2026-07-29-redesign-parity-release-plan.md` - this execution and release plan.
- `AGENTS.md` - repository workflow and evidence requirements; read-only for this work unless a genuinely new permanent rule is discovered.
- `src/app/(frontend)/components/ui/navigation/*` - shared navigation and mobile-menu behavior.
- `src/app/(frontend)/components/primitives/button/*` - canonical CTA/button contract.
- `src/app/[locale]/(frontend)/(pages)/(home)/**/*` - localized Home structure and responsive styling.
- `messages/en.json`, `messages/cs.json` - localized copy parity.
- `src/__tests__/e2e/*` - critical-route, locale, interaction, status, and visual-contract evidence.
- `docs/content/copy-change-ledger.md` - append-only provenance for any changed public copy: original text, former location, purpose, replacement, rationale, locale, and associated commit.
- `docs/content/article-backlog.md` - proposed article briefs with audience, search intent, proof required, outline, CTA, localization scope, and publication priority.

## Execution Rules

- Treat every audit finding as a hypothesis to re-prove before changing code.
- Split implementation into the smallest coherent commits that independently compile and have a focused proving check.
- Do not combine copy changes, component-contract changes, layout tuning, tests, or documentation in one commit unless they are inseparable.
- Before every implementation commit, run a design/architecture/a11y/SEO/i18n risk review; after the commit, run an independent code review plus the strongest focused validation.
- Preserve semantic HTML, keyboard behavior, focus order, reduced-motion behavior, contrast, canonical metadata, locale routing, and server-rendered content while tuning visuals.
- Do not change approved copy merely to make layout easier. If copy changes are authorized, first record the exact original, location, and purpose in `docs/content/copy-change-ledger.md`.
- Keep the original-copy ledger append-only so removed or relocated content remains traceable.
- Article proposals are planning artifacts. Do not publish or invent claims without evidence supplied by the owner.
- Every implementation branch starts from the latest `dev`, targets `dev`, and is reviewed before merge. The release branch is `dev`; `main` remains production.

## Tasks

### Task 1: Recover And Preserve The Historical Audit

Objective:
- Restore only the historical audit from `stash@{0}` on a branch created from current `dev`.

Validation:
- `git status --short` lists only the audit and this plan.
- `git diff -- AGENTS.md` is empty.
- `git stash list` still contains `On dev: agents`.

### Task 2: Rebuild Current Figma Evidence

Objective:
- Inspect canonical components and representative Desktop, Tablet, Mobile, Responsive QA, Dark Mode, Prototype, and Accessibility frames.

Validation:
- Evidence records the Figma node ID, inspection date, viewport, theme, state, and exact expected properties.
- At minimum inspect Home `6:2`, `7:377`, `8:87`, responsive frames `8:140` and `8:193`, dark Home `8:246` and `8:325`, Button `21:110`, Navigation `21:357`, Nav Link `44:60`, and open menu `27:49`.

### Task 3: Rebuild Current Browser Evidence

Objective:
- Render current `dev` locally and inspect English and Czech critical flows at 1440, 768, and 390 CSS pixels.

Validation:
- Verify `/`, `/cs`, navigation, language switch, primary CTA destinations, mobile-menu open/close/resize, light/dark state, and relevant 404/status behavior.
- Record screenshots plus computed geometry, typography, color, state, and responsive values for confirmed findings.

### Task 4: Refresh And Classify The Audit

Objective:
- Move the recovered document to `docs/audits/2026-07-29-redesign-parity.md` and update every `RPA-*` finding.

Required status values:
- `still-valid`
- `fixed-by-i18n`
- `needs-reverification`
- `obsolete`

Required release values:
- `release-blocking`
- `can-wait`

Validation:
- Every finding identifies current Git SHA, Figma node, route/component, viewport/theme/locale, expected/actual evidence, status, release impact, and smallest fix location.
- Historical measurements remain explicitly labeled instead of being presented as current evidence.
- No overall parity percentage is retained without a reproducible coverage and weighting calculation.

### Task 5: Publish The Audit Documentation

Objective:
- Commit only the plan and refreshed audit on `docs/refresh-redesign-parity-audit`, push it, and create a PR to `dev`.

Validation:
- Commit file list contains only the two documentation files.
- PR base is `dev`, head is the audit branch, and PR head SHA matches local/remote.
- Only after this proof, delete the `agents` stash and verify that the older unrelated stash remains.

### Task 6: Execute Confirmed Release-Blocking Fix Packages

Objective:
- Implement only confirmed P0/release-blocking P1 findings, each from a fresh updated `dev`.

Packages:
1. `fix/navigation-cta-parity`
   - shared Button/CTA geometry and states;
   - current-route semantics;
   - mobile-menu composition and resize cleanup;
   - theme/language controls within navigation.
2. `fix/home-responsive-parity`
   - Home at 1440 and 390 first, then 768, 320, and 430;
   - shared section rhythm, layout, typography, card geometry, and dark-mode treatment.
3. `test/localized-parity-regressions`
   - English/Czech wrapping and route preservation;
   - critical CTA destinations;
   - navigation interaction/state and computed-style assertions;
   - targeted visual baselines where stable fixtures exist.
4. `docs/content-strategy`
   - create the append-only copy provenance ledger before any public copy edit;
   - propose evidence-backed article briefs without publishing them;
   - identify which article fixture is suitable for deterministic Insights/article acceptance tests.

Validation per package:
- Relevant focused tests, `pnpm test`, `pnpm test:unit`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build`, and required Chromium production smoke.
- Repeat the Figma-versus-web comparison before closing a finding.
- Push each branch and create a separate PR targeting `dev`; do not merge without explicit authorization.

Commit sequence inside the fix packages:

1. tests that expose the current shared-contract defect;
2. Button kind/size/state contract;
3. navigation current-route and variant semantics;
4. mobile-dialog resize cleanup;
5. mobile-menu approved composition;
6. ShareBar token/contrast correction;
7. Home desktop geometry;
8. Home compact geometry;
9. Czech wrapping and overflow tuning without copy loss;
10. stable visual/computed-style regression coverage;
11. content provenance and article backlog documentation.

Each item is one commit unless a pre-implementation review proves that splitting it would leave an invalid intermediate state. Any exception must be explained in the commit body and PR.

### Task 7: Prepare The Release PR

Objective:
- After all release-blocking fixes are present in `dev`, prove release readiness and create a PR from `dev` to `main`.

Validation:
- Production build succeeds.
- Routing/i18n smoke proves English unprefixed URLs, Czech `/cs`, language switching, canonical metadata, genuine 404 status, and protected `/api`/`admin` routing.
- Browser smoke covers the critical Home, navigation, CTA, Work, Contact, and error flows at 1440 and 390 in English and Czech.
- The release PR records deferred `can-wait` findings and rollback/deployment expectations.
- Do not merge or deploy the release PR without explicit authorization.

## Validation

- Documentation gate: `git diff --check`.
- Static gates: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`.
- Test gates: `pnpm test`, `pnpm test:unit`, targeted and critical Chromium E2E.
- Runtime gate: local production build plus Figma/browser evidence at the required widths, themes, locales, and interaction states.
- Delivery gate: exact local, remote, and PR head SHA equality.

## Execution Notes

- Execute Tasks 1–5 on the audit documentation branch.
- Rebase work packages conceptually on the latest `dev`, but never rewrite shared `dev`; create new branches after audit classification.
- If no P0 or release-blocking P1 is confirmed, skip Task 6 and proceed directly to the release gate.
- If required Figma or runtime evidence is inaccessible, mark findings `needs-reverification`; do not guess or silently downgrade the release standard.
