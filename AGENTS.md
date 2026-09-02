# Codeguy Portfolio Agent Instructions

## Current Documentation With Context7

Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- training data may not reflect recent changes. Prefer Context7 over web search for library documentation.

Do not use Context7 for refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

When Context7 applies:

1. Start with `resolve-library-id` using the library name and the user's full question, unless the user provides an exact `/org/project` library ID.
2. Select the best exact and relevant match, preferring high-reputation sources, strong documentation coverage, and the highest benchmark score.
3. Call `query-docs` with the selected library ID and the user's full scoped question.
4. Base the answer or implementation decision on the retrieved current documentation.

## Scope And Source Of Truth

- These rules apply to the whole repository.
- Public application code lives primarily in `src/app/[locale]/(frontend)`, shared frontend components in `src/app/(frontend)/components` and `src/components`, and translation catalogs in `messages`.
- `docs/plans/` holds live plans only. The localization, Home-parity, CV and booking rollouts are delivered; their decisions live in `docs/decisions/` and their measured evidence in `docs/audits/`. See "Where Each Kind Of Knowledge Lives" below.

## External AI Agent Efficiency

- Treat long-context agent sessions as an expensive resource. Target less than 100k context; at 100k, write a compact handoff and start a clean session. Do not continue past 150k unless unreproducible state makes a clean handoff riskier.
- Separate discovery, mutation and verification when a task uses heavy MCP output. Reuse a factual handoff containing only constraints, measured findings, stable file or node IDs, completed work and remaining acceptance criteria.
- Use `/compact` after a discovery phase or a burst of large MCP responses. Use `/clear` or a new non-resumed CLI session when switching tasks or when the remaining work can be described from a handoff.
- Do not resume a large session merely to preserve conversation history. Resume only when the agent holds essential state that cannot be represented safely in the handoff.
- Enable only the MCP servers and tools needed for the current phase. Once browser evidence has been collected, exclude Playwright from Figma-only work. Once Figma node IDs are known, scope reads and writes to those nodes and avoid repeating file-wide discovery.
- Invoke heavy generative skills at most once per design phase. For targeted corrections to known Figma nodes, use the narrow `figma-use` workflow rather than rerunning `figma-generate-design`.
- Keep MCP returns compact: IDs, counts, small property summaries and errors. Capture representative screenshots only; do not retain redundant full-page screenshots or raw traversal output in the same session.
- For external agents, define an explicit output contract, forbidden operations, stop conditions and verification requirements. The controller must independently verify artifacts and repository state.
- Record material agent-efficiency incidents and corrective actions in `docs/agent-efficiency-log.md`.

## Git Flow And Pull Requests

- `dev` is the integration branch. Create feature, fix, and documentation branches from an up-to-date `dev` and return them through a PR targeting `dev`.
- `main` is the production branch. Promote accumulated, verified work through a release PR from `dev` to `main`; do not develop directly on `main`.
- Name a branch `<type>/<slug>`. `<type>` is the same set used for commit types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `build`. Use `fix`, never `bugfix`.
- When the work has a Linear issue, place its identifier in lower case directly after the type, for example `refactor/cod-77-cv-shared-primitives`. Work without an issue omits it, for example `chore/bump-playwright`.
- Keep the slug English, kebab-case and short — it names the change, not the issue title. Do not copy the branch name Linear proposes; its `<user>/<team-key>-<full-title>` shape is not used in this repository.
- Correct a name that breaks this rule only while the branch is unpushed. Branches that predate this rule, and any branch already pushed, keep the name they have.
- Do not rewrite shared `dev` or `main` history. Keep unrelated user changes out of task commits and verify the staged file list before every commit.
- Before creating a PR, push the branch, confirm its remote SHA, and check whether an open PR for the same head/base pair already exists.
- Preferred PR creation order:
  1. Use an authenticated GitHub connector when one is available.
  2. Otherwise use authenticated GitHub CLI, for example `gh pr create --base dev --head <branch>`.
  3. Otherwise use the GitHub PR form at `https://github.com/Santinni/cg-portfolio-web/pull/new/<branch>` when the available browser is authenticated.
  4. If Git push authentication works but neither CLI nor browser authentication is available, use the configured Git credential helper and GitHub REST API as the approved fallback.
- For the REST fallback:
  - call `git credential fill` for `protocol=https` and `host=github.com` inside the short-lived process;
  - capture the credential in memory and never print, log, persist, interpolate into a command line, or place it in a file;
  - first query open pulls for the exact `owner:head` and `base` pair to avoid duplicates;
  - if no PR exists, send only the intended title, body, head, and base to `POST /repos/Santinni/cg-portfolio-web/pulls`;
  - clear credential variables after the request and report only non-sensitive response fields such as PR number, URL, state, base, head, and head SHA.
- A missing `gh` executable or signed-out browser is not by itself a blocker when the configured Git credential helper can authenticate the approved GitHub API operation.
- After creation, independently verify the PR number, URL, base, head, and head SHA against the local branch. Never claim that a PR exists solely because `git push` printed a `/pull/new/` suggestion.
- When the user explicitly asks to add a change to an already published commit, amend that exact commit and update only its branch with `git push --force-with-lease`; then verify that the existing PR points to the amended SHA. Otherwise prefer an additional commit.
- Never merge a PR, enable auto-merge, delete a branch, or trigger deployment unless the user explicitly requests that action.

## Figma Source Of Truth

The approved design file, its file key and the approved node inventory are recorded in `docs/decisions/design-sources.md`. Route-specific frames live with their own decision record.

Do not claim that an implementation matches the redesign without comparing it against the relevant approved nodes. Verify a node still matches the shipped view before implementing against it.

## Brand Identity

The brand system is governed by `docs/brand/`:

- `brand-guidelines.md` defines intent, naming, voice, permitted usage, accessibility expectations and application guidance.
- `brand-decision-log.md` records each identity decision as `locked`, `provisional`, `open` or `deprecated`, and what is required to change it. Where the two appear to disagree about status, the log governs.

Read the log before applying identity in new work — several decisions are deliberately still open, and treating an open one as settled is the failure mode this repository has actually hit.

Working rules:

- Consume semantic tokens in product code. Do not hardcode brand colour values at call sites, in either mode.
- Reuse the existing design system before creating any new colour, type style, effect, component or layout primitive. A brand application must not become a parallel component library.
- When a change affects naming, voice, colour, typography, logo status or brand governance, update the applicable guideline and decision-log entry in the same change.

## Curriculum Vitae

Routes, approved frames, the locale-first PDF contract, the phone-number boundary and the contact/download primitive split are recorded in `docs/decisions/curriculum-vitae.md`. Measured geometry, including an approved icon-size deviation from the Figma glyph, is in `docs/audits/2026-07-30-cv-redesign-baseline.md`.

For CV implementation:

- Compare the route against every relevant light/dark and responsive node listed in the CV decision record; passing one frame does not establish CV parity.
- Do not expose private or unnecessary personal data merely because it appears in an older PDF. Resolve the public email identity centrally and keep contact facts consistent with the rest of the portfolio.
- Validate English and Czech at 1440, 768 and 390 px in light and dark mode, including text wrapping, download behavior, focus, hover, reduced motion, real PDF responses, metadata and locale switching.

### CV PDFs Are Generated, Not Authored

`tools/cv-pdf/` generates the CV as a tagged A4 PDF from `src/content/curriculum-vitae.ts`, the message catalogs and the semantic tokens in `variables.css`. See `tools/cv-pdf/README.md`.

- Do not hand-author a CV PDF and do not reintroduce a Google Docs workflow. A CV that is not generated cannot stay in sync with the site.
- The generator defines no colours of its own and fails the build if `--action-primary` stops resolving to `#0A6E80`. `src/__tests__/unit/cv-pdf-tokens.test.ts` guards that binding — treat a failure there as a brand defect, not a flaky test.
- Company-specific variants are overlays that may reorder and re-emphasise but never restate hard facts. They live outside this repository, in `new_job/cv/variants/`.
- Changing how the CV looks means changing tokens, or the print type scale in `tools/cv-pdf/cv-print.css`. Do not put values in the template.

## Available Ways To Work With Figma

Use the smallest suitable surface, but do not rely on only one surface when its result is incomplete.

1. `get_metadata`
   - Use for a cheap structural overview: page/node IDs, names, hierarchy, positions, and dimensions.
   - Omit `nodeId` to enumerate top-level pages, then inspect the relevant page or frame explicitly.
   - Metadata is not sufficient for visual conclusions or implementation.
   - Do not conclude that nodes or pages are absent from a root metadata response. In this file, querying `0:1` returned only the cover while `use_figma` exposed all 11 pages.
2. `get_screenshot`
   - Use for visual inspection of a specific node or frame.
   - Request sufficient resolution for typography, spacing, borders, icons, and states.
   - Pair screenshots with metadata or design context; screenshots alone do not expose exact properties.
3. `get_design_context`
   - Prefer for design-to-code work on a known node. It returns implementation context, visual reference, and relevant metadata.
   - Load and follow the `figma-design-to-code` skill before calling it.
   - Adapt generated guidance to this repository; do not paste generated code blindly.
4. `use_figma`
   - Use for programmatic inspection that ordinary metadata cannot answer, including complete page inventory, component/instance discovery, variants, variables, bindings, layout properties, and exact node properties.
   - Use it for Figma writes only when the user explicitly asks to modify Figma.
   - Load and follow the `figma-use` skill and its required references before every call.
   - Audits must use read-only scripts. Return structured data; do not mutate the document.
   - Pages load dynamically. Switch with `await figma.setCurrentPageAsync(page)` at most once per call. Fan multi-page work out into parallel calls.
   - Scope traversal to the smallest known page/frame and prefer indexed lookups (`getNodeByIdAsync`, `findAllWithCriteria`, `node.query`).
5. Design-system and token discovery
   - Use `search_design_system`, `get_libraries`, and `get_variable_defs` when the task concerns published components, libraries, variables, or tokens.
   - Inspect the local Components and Foundations pages as well; published-library discovery does not replace on-canvas inspection.
6. Code Connect
   - Use the Code Connect tools to inspect or maintain mappings between Figma components and repository components when component parity or mapping is part of the task.
   - Do not assume a visual match merely because a mapping exists.
7. Browser-based Figma inspection
   - Use the authenticated in-app Browser or Chrome integration when the task requires seeing or interacting with the Figma UI exactly as the user does, including selection, panels, prototype behavior, or version history.
   - Standalone Playwright may receive a Figma `403` because it does not share the authenticated session. Treat it as a fallback, not the primary Figma inspection surface.
   - Playwright remains the preferred surface for inspecting the rendered website and collecting computed browser styles.
8. Creation and asset tools
   - `generate_figma_design` is for capturing or generating a design from a web view; it is not a substitute for reading an existing approved design.
   - `create_new_file`, `upload_assets`, and `download_assets` are specialized mutation/asset operations. Use them only when the requested task requires them and after loading their applicable skills.

## Figma-To-Web Comparison Workflow

For redesign audits or implementation work:

1. Enumerate the actual Figma pages and locate the relevant component set and screen instances with `use_figma` or explicit metadata node IDs.
2. Inspect the canonical component and all required variants/states, not only one screen instance.
3. Capture Figma screenshots for the canonical component and representative desktop, tablet, mobile, and dark-mode screens.
4. Inspect the live or local website with Playwright at the corresponding widths (at minimum 1440, 768, and 390 CSS pixels).
5. Collect computed browser values for dimensions, padding, gap, radius, border, colors, typography, focus, hover, active, disabled, and responsive behavior.
6. Report exact differences in a Figma-versus-web table. Separate confirmed mismatches from subjective visual judgments.
7. After implementation, repeat the comparison and run repository-native validation. Never mark parity complete from code review alone.

## Figma Audit Evidence And Reporting

- Record the inspected Git commit, website URL or local build, Figma file and node IDs, inspection date, viewport, theme, locale, and any CMS or fixture state needed to reproduce the result.
- Every parity finding must identify:
  - the affected route, component, or selector;
  - the corresponding Figma node;
  - the tested viewport, theme, locale, and interaction state;
  - the expected and actual values or behavior;
  - whether the evidence is a measured mismatch, missing implementation, unavailable content/data, design ambiguity, or subjective visual concern;
  - severity, user impact, and the smallest appropriate fix location.
- Use screenshots to establish visual context and measured/computed values to support exact claims. Do not infer spacing, typography, color, or component state from a screenshot when the value can be inspected directly.
- Label untested combinations as unverified. Passing one breakpoint, theme, locale, or component instance does not establish parity for the others.
- Do not publish an overall parity percentage unless the audit defines its coverage, weighting, and calculation. Prefer a coverage matrix and a severity-ordered finding list.
- Preserve before-and-after evidence for changed findings and distinguish fixed, accepted, deferred, and blocked items. A code change alone does not close a visual finding.

## Figma-To-Web Implementation Rules

- Before changing a screen, locate the shared component, token, variable, or layout primitive responsible for the mismatch. Prefer the narrowest shared correction that matches every approved instance over a one-page override.
- Check canonical Figma components and representative instances together. A component-level fix must not improve one screen while breaking another variant or breakpoint.
- Treat text wrapping and content height as part of responsive behavior. Validate both English and Czech where translated text is rendered, even when Figma contains only one language.
- Verify real interaction and accessibility behavior in the browser, including keyboard focus, hover, active, disabled, reduced-motion behavior where relevant, and sufficient contrast. Static Figma frames do not prove runtime behavior.
- Separate visual parity work from content/data availability. When CMS content, media, fonts, or external assets are missing, document the precondition instead of compensating with unrelated layout changes.
- If the approved Figma design changes, record the newer inspected node or version and update any repository-specific measurements in this file in the same change. Do not silently reinterpret an existing specification.

For buttons specifically, the approved component set is recorded in `docs/decisions/design-sources.md` and the geometry itself is BD-17 in `docs/brand/brand-decision-log.md`. Do not substitute pill styling for the approved properties.

## Figma Safety

- Default to read-only inspection for audits, reviews, explanations, and planning.
- Never edit the Figma file or repository merely because a mismatch was discovered; mutation requires an explicit implementation request.
- Before Figma writes, inspect existing conventions, work incrementally, and validate each change with metadata and screenshots.
- Preserve node IDs returned by write operations and return every created or mutated node ID.

## Internationalization Guardrails

- The public website uses `next-intl` with `en` and `cs`. The locale strategy, public URL shape, routing bridge and known limitations are decisions recorded in `docs/decisions/localization.md` — read it before changing routing or locale behaviour.
- Never hardcode new user-facing text in a live component, page, layout, helper, or content module. This includes:
  - headings, paragraphs, links, buttons, labels, placeholders and captions;
  - navigation, dialogs and language controls;
  - `aria-label`, `alt`, visually hidden text and live-region announcements;
  - loading, empty, unavailable, error and 404 states;
  - metadata titles/descriptions, Open Graph copy and image alt text;
  - validation messages, notices and other visitor-visible feedback.
- Add every new translatable message to both `messages/en.json` and `messages/cs.json` in the same change. Their recursive key structure must remain identical.
- Organize messages by stable semantic namespaces such as `navigation`, `home`, `work`, `article` and `errors`. Do not use complete English sentences as key names and do not put unrelated copy into a catch-all namespace.
- Czech copy must use correct diacritics and natural professional Czech. Preserve meaning and facts; do not translate mechanically or invent claims.
- Brand names, personal names, technology names, URLs, route slugs, IDs and code stay locale-neutral unless an explicit product decision says otherwise.
- Keep structured facts and identifiers separate from translated presentation copy. Do not duplicate URLs, slugs or technical data in both catalogs merely to translate adjacent labels.
- Use ICU interpolation and plural rules for count-bearing messages. Never concatenate translated sentence fragments.
- Use `next-intl` formatters or explicitly locale-aware `Intl` APIs for dates, times, numbers and relative values. Do not hardcode `en`, `cs`, decimal separators, date order or plural suffixes inside shared formatting code.
- Use locale-aware `Link`, `redirect`, `useRouter`, `usePathname` and `getPathname` exports from `src/i18n/navigation.ts` for public internal navigation. A Czech route must not silently return visitors to English.
- Public pages belong under the validated `[locale]` route tree. Server layouts/pages that use translations must validate the locale and call `setRequestLocale` where static rendering requires it.
- Do not prefix or localize Payload `/admin`, Payload `/api/*`, or `/api/health`. Preserve the rate-limiting and security behavior in `src/proxy.ts`.
- Generate locale-specific canonical URLs and metadata. Fully translated static pages use `en`, `cs` and `x-default` alternates; English is the `x-default` URL.
- Do not claim a translated alternate for content that is not actually translated.

## Content And Payload Boundary

- The Payload content boundary is a decision recorded in `docs/decisions/localization.md`.
- Static portfolio copy, shared UI copy, HTML CV copy and Insights presentation chrome belong in the `next-intl` catalogs.

## Booking Route

All booking constraints are recorded in `docs/decisions/booking.md`. Read it before touching `/contact/book`.

## Required Workflow For Any Text Change

1. Identify whether the text is visitor-visible, accessibility-only, metadata, formatted data, or CMS editorial content.
2. Reuse an existing semantic key or add matching `en` and `cs` keys.
3. Consume the key through the correct server/client `next-intl` API.
4. Check internal links for locale preservation and formatted values for locale awareness.
5. Add or update the narrowest relevant unit/component test.
6. For route-level copy, verify both the English unprefixed URL and the Czech `/cs` URL.

## Validation Expectations

- Catalog parity tests must pass and catalog values must be non-empty.
- Tests must prove language with `<html lang>` plus at least one known visible or accessibility translation. HTTP 200 and a heading alone are not sufficient.
- Routing tests must prove:
  - `/` stays English and unprefixed even with Czech request preferences;
  - `/cs` renders Czech;
  - `/en/*` normalizes to the unprefixed English URL;
  - query parameters survive locale switching;
  - `/api` and `/admin` never enter the locale namespace.
- Routing tests must prove localized custom HTTP 404 UI for unknown Czech routes, unknown English case-study routes, completely generic unprefixed English unknown URLs, and invalid locale-shaped URLs such as `/xx/work`. Every static/finite-route case must return a genuine HTTP 404, include `noindex`, render the branded localized boundary, and set the correct server-rendered `<html lang>`.
- Keep the finite locale and Work parameters strict with `generateStaticParams` plus `dynamicParams = false`, and leave unmatched requests to `global-not-found.tsx`. The global boundary reads the Czech locale header injected by `src/proxy.ts`; do not remove that header contract without replacing and re-proving localized full-document 404s.
- Runtime CMS article slugs intentionally remain dynamic so newly published articles do not require a rebuild. In Next.js 16, a missing runtime article handled by nested `notFound()` currently returns a real branded `noindex` 404 but its raw framework error document omits `<html lang>`. Preserve the regression test and treat server-rendered document language for this one route class as a documented upstream/topology follow-up; do not weaken any static/finite-route 404 contract to match it.
- Routing tests must also prove that Czech CMS article URLs return an HTTP redirect with no Czech hreflang response header.
- SEO tests must cover locale-specific canonical URLs, language alternates and Open Graph locale.
- Before claiming completion, run the relevant narrow tests followed by `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build` and the required Chromium production smoke when route behavior changed.

## Documentation Discipline

- When a new language, routing rule, CMS localization boundary or translation architecture decision is introduced, record the decision in `docs/decisions/localization.md` and any resulting working rule in this file, in the same change.
- Never place secrets, personal access tokens, private CMS content or production data in catalogs, tests or documentation.
- Never expose a raw runtime `error.message` to visitors. Error and 404 surfaces show localized copy from the catalogs; the underlying message stays in logs.

### Where Each Kind Of Knowledge Lives

Four homes, one question each. Put knowledge where its question is answered, not where it is convenient.

| Home | Holds | Answers |
|---|---|---|
| `AGENTS.md` | how to work here — commands, gates, conventions, workflow | "how do I do things in this repo?" |
| `docs/decisions/` | what was decided and must hold, with status | "what am I allowed to change?" |
| `docs/audits/` | what was measured, with date and evidence | "what was actually true when checked?" |
| `docs/plans/` | live plans only | "what work is still outstanding?" |

Linear holds task state and order. Figma holds the resulting product design.

- **Before changing a route, a component contract or a content boundary, read the relevant record in `docs/decisions/`.** A settled product decision is not yours to reverse in passing.
- This file holds **rules**, not product specification and not an index of documents. If you are about to write what the product must be, it belongs in a decision record. If you are about to add a pointer to one specific document, write the rule instead.
- Every document in `docs/plans/` carries a `Status:` line directly under its title. A plan takes only two states, because a delivered plan is deleted rather than archived:

| Status | Meaning |
|---|---|
| `open` | still authorizes outstanding work |
| `provisional` | partially done, or blocked on a decision |

- The four-state vocabulary in `docs/brand/brand-decision-log.md` — `locked`, `provisional`, `open`, `deprecated` — governs **decisions**, not plans. Do not mark a plan `locked`: a plan that is complete no longer belongs in `docs/plans/`.
- Delete a plan once its work is delivered. Before deleting, move any product decision it is the sole record of into `docs/decisions/`, any working rule into this file, and any measured geometry or parity evidence into `docs/audits/`. Move first, delete second. A finished plan left in `docs/plans/` invites someone to rebuild shipped work.
