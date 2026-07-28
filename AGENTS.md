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
- Treat `docs/plans/2026-07-28-i18n-implementation-plan.md` as the implementation and validation source of truth for the initial Czech/English rollout.

## Figma Source Of Truth

The approved portfolio design is the Figma file:

- URL: https://www.figma.com/design/cs38WzlXKY9xfDYBinoKel/Codeguy-Portfolio---Final-Design
- File key: `cs38WzlXKY9xfDYBinoKel`
- Components page: `4:3`
- Desktop page: `4:4`; Home frame: `6:2`
- Tablet page: `4:5`; Home frame: `7:377`
- Mobile page: `4:6`; Home frame: `8:87`
- Responsive QA page: `4:7`
- Dark-mode page: `4:8`
- Button component set: `21:110`

Treat this file as the visual source of truth for redesign work. Do not claim that an implementation matches the redesign without comparing it with the relevant Figma nodes.

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

For buttons specifically, start from component set `21:110`. The approved large button instances in the current design are 52 px high with a 4 px corner radius; do not replace those properties with pill styling unless a newer approved Figma variant explicitly requires it.

## Figma Safety

- Default to read-only inspection for audits, reviews, explanations, and planning.
- Never edit the Figma file or repository merely because a mismatch was discovered; mutation requires an explicit implementation request.
- Before Figma writes, inspect existing conventions, work incrementally, and validate each change with metadata and screenshots.
- Preserve node IDs returned by write operations and return every created or mutated node ID.

## Internationalization Guardrails

- The public website uses `next-intl` with `en` and `cs`. English is the default locale.
- English URLs stay unprefixed. Czech URLs use `/cs`. Keep `localePrefix: "as-needed"` and `localeDetection: false` so existing URLs such as `https://codeguy.cz` always retain their English meaning.
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
- Preserve the production routing bridge: unprefixed English index routes use explicit `beforeFiles` rewrites, English dynamic Work/Insights routes use thin adapters under `src/app/(english)`, and Czech routes use the `[locale]` tree directly.
- For `/cs`, `src/proxy.ts` injects `X-NEXT-INTL-LOCALE` into request headers without invoking the `next-intl` URL-rewriting middleware. Do not replace this with `createMiddleware` without proving that standalone production routing has no redirect loop, soft 404, meta-refresh redirect, or false `Link` hreflang header.
- Keep the locale-wide route tree free of a root `loading.tsx`. A loading boundary can start streaming before `notFound()`, turning a required HTTP 404 into a soft 200. Put loading UI only at narrow routes where status decisions happen first and preserve real-status E2E coverage.
- Do not prefix or localize Payload `/admin`, Payload `/api/*`, or `/api/health`. Preserve the rate-limiting and security behavior in `src/proxy.ts`.
- Generate locale-specific canonical URLs and metadata. Fully translated static pages use `en`, `cs` and `x-default` alternates; English is the `x-default` URL.
- Do not claim a translated alternate for content that is not actually translated.

## Content And Payload Boundary

- Static portfolio copy, shared UI copy, HTML CV copy and Insights presentation chrome belong in the `next-intl` catalogs.
- Payload-authored article, topic, author and media content is currently English editorial content.
- Czech UI may clearly identify English-only editorial content, but it must not present that content as a Czech translation or publish a Czech article hreflang entry.
- `/cs/insights/:slug` must issue a real HTTP redirect to unprefixed English `/insights/:slug` before rendering. It must not return a 200 meta-refresh response or advertise Czech article hreflang.
- Do not enable Payload localization, mark fields `localized`, edit database migrations or regenerate localized Payload types as part of ordinary copy/component work. That requires a separate approved schema migration, backup, staging rehearsal and editorial workflow plan.
- The existing downloadable PDF CV is language-specific external content. Button copy must not imply that the file is Czech unless a Czech PDF exists.

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

- When a new language, routing rule, CMS localization boundary or translation architecture decision is introduced, update this file and the current i18n plan in the same change.
- Never place secrets, personal access tokens, private CMS content or production data in catalogs, tests or documentation.
