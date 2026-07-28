# Czech And English Portfolio Localization Plan

Status: implemented and fully browser-verified in the isolated worktree. One Next.js runtime-CMS 404 document-language limitation remains documented below.

## Goal

- Add production-ready Czech and English localization to the public Codeguy portfolio.
- Keep every existing English URL, especially `https://codeguy.cz`, stable and canonical.
- Publish Czech equivalents under `/cs` without changing Payload admin/API routes or deploying automatically.

## Scope

- In scope: live public routes, shared navigation and accessibility copy, static portfolio content, HTML CV, Insights UI chrome, errors/loading states, locale-aware formatting, language switcher, metadata, canonical/hreflang, sitemap, routing tests, and production-build browser smoke.
- Out of scope: Payload Admin localization, localized Payload fields, production database migration, Czech translations of CMS-authored articles, translating legacy homepage sections that are not imported by the live page, translating the existing PDF CV, production deployment.

## Locked Decisions

- Library: `next-intl` 4.x on the existing Next.js 16 App Router.
- Locales: `en` and `cs`; `en` is the default.
- URL policy: `localePrefix: "as-needed"`; English has no `/en`, Czech uses `/cs`.
- Detection policy: `localeDetection: false`. A Czech browser or stale locale cookie must not redirect the LinkedIn root URL away from English.
- Path slugs remain stable in English for both locales in this release, e.g. `/work` and `/cs/work`.
- Payload `/admin`, Payload `/api/*`, and `/api/health` remain unprefixed and retain the current rate limiter.
- Static product/portfolio copy is translated in this branch. CMS-authored Insights content remains English until a separate Payload localization migration is approved.
- Czech article-detail URLs redirect with HTTP 307 to the unprefixed English article. No Czech article alternate is published.
- The existing global manifest remains the English/default manifest for this release; locale-specific manifests are deferred.
- No commit, push, PR, merge, or deployment is part of this execution without separate authorization.

## File Map

- `AGENTS.md` - repository-wide rules that make i18n mandatory for future content and component work.
- `package.json`, `pnpm-lock.yaml` - add the localization runtime.
- `next.config.ts` - compose `next-intl` with `withPayload`, canonicalize `/en`, redirect Czech article details to English, and bridge unprefixed English index URLs with explicit `beforeFiles` rewrites.
- `src/i18n/routing.ts` - locales, default locale, prefix and detection contract.
- `src/i18n/request.ts` - validated locale and catalog loading.
- `src/i18n/navigation.ts` - locale-aware Link/router helpers.
- `src/i18n/metadata.ts` - canonical, hreflang, Open Graph locale, and pathname helpers.
- `src/global.d.ts` - strict Locale and Messages augmentation.
- `messages/en.json`, `messages/cs.json` - matching semantic namespaces.
- `src/proxy.ts` - preserve API/admin rate limiting and inject Czech request locale context without URL rewriting.
- `src/app/(english)/(frontend)/**` - thin English adapters for dynamic Work and Insights detail URLs that cannot be covered by fixed index rewrites.
- `src/app/[locale]/(frontend)/**` - localized public route tree and root document language/provider.
- `src/app/(frontend)/components/**` - localized shared client components, navigation, and switcher.
- `src/components/{site,work,article}/**` - localized public shared components.
- `src/content/**` - retain locale-neutral facts, IDs, links and structures; remove user-visible strings that move to catalogs.
- `src/lib/content/articlePresentation.ts` - locale-aware dates, reading-time plurals, and locale-aware article links.
- `src/app/sitemap.ts` - localized static/case-study entries and valid editorial behavior.
- `src/__tests__/**` - routing, catalog, proxy, component, SEO, sitemap, formatting, and browser contracts.

## Message Namespaces

- `site`, `navigation`, `accessibility`, `home`, `work`, `about`, `experience`, `contact`, `insights`, `article`, `curriculumVitae`, `errors`.
- Keys are semantic and feature-scoped. Both catalogs must have exact recursive leaf-key parity.
- Count-bearing copy uses ICU plural rules. Czech text keeps correct diacritics.

## Tasks

### Task 1: Routing Foundation And Red-First Contracts

Objective:
- Establish the locale contract before moving public routes.

Files:
- Create `AGENTS.md` with permanent translation/content/component guardrails.
- Create `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/global.d.ts`.
- Create minimal `messages/en.json`, `messages/cs.json`.
- Modify `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `src/proxy.ts`.
- Create `src/__tests__/unit/i18n-routing.test.ts`, `src/__tests__/unit/i18n-messages.test.ts`.
- Replace the old proxy-only assumptions in `src/__tests__/unit/middleware.test.ts` with the composed routing/rate-limit contract.

Implementation notes:
- Write failing routing/catalog tests first and record the red result.
- `withPayload` wraps the config already processed by `next-intl`.
- The proxy rate-limits `/api` and `/admin`. For `/cs`, it injects the standard `X-NEXT-INTL-LOCALE` request header without invoking the `next-intl` rewrite middleware.
- Explicit Next redirects normalize `/en` and redirect `/cs/insights/:slug` to the English-only article before rendering.
- Fixed English index pages are internally rewritten to `/en`; direct English dynamic route adapters preserve genuine 404 statuses.
- The locale root and finite Work slugs use `generateStaticParams` with `dynamicParams = false`. Invalid locale-shaped paths and unknown finite slugs therefore bypass nested segment rendering and reach the full-document global 404.
- `global-not-found.tsx` reads the Czech request-locale header injected by `src/proxy.ts`, imports the matching catalog directly, and server-renders a localized full HTML document. Generic English, invalid-locale, Czech unknown-route, and Work 404 responses therefore retain a genuine status, branded copy, `noindex`, and the correct raw `<html lang>`.
- Do not add a locale-root `loading.tsx`: Next returns HTTP 200 for a streamed `notFound()` response. Narrow loading states remain on CV and Insights index routes.

Validation:
- `pnpm test -- src/__tests__/unit/i18n-routing.test.ts src/__tests__/unit/i18n-messages.test.ts src/__tests__/unit/middleware.test.ts`
- `pnpm typecheck`

### Task 2: Locale Route Tree, Provider, Navigation And Shared UI

Objective:
- Render the public app under a validated `[locale]` segment while preserving external English paths.

Files:
- Move live route files from `src/app/(frontend)` into `src/app/[locale]/(frontend)`; keep reusable component/style directories at stable import paths where useful.
- Modify the localized frontend layout, route errors/loading/404, and `src/app/global-not-found.tsx`.
- Create `src/app/(frontend)/components/ui/languageSwitcher/**`.
- Modify navigation, skip link, theme toggle, expandable text, buttons/links, and shared site/work/article components.
- Create/update component tests and `src/__tests__/e2e/i18n-routing.spec.ts`.

Implementation notes:
- Validate `params.locale`, call `setRequestLocale`, set `<html lang>`, and supply `NextIntlClientProvider`.
- Use navigation helpers for every internal link so `/cs` is not lost.
- Language switching preserves pathname, query parameters, and fragments.
- Never expose raw runtime `error.message` to visitors.

Validation:
- Locale/shared component tests.
- Browser assertions for `/`, `/cs`, `/work`, `/cs/work`, `/api/health`, and app-level `/admin` behavior.

### Task 3: Live Static Pages And Portfolio Content

Objective:
- Translate the live homepage, Work/case studies, About, Experience, and Contact without changing professional facts.

Files:
- Modify live route pages and home blocks.
- Modify `src/content/site.ts`, `profile.ts`, `work.ts`, `experience.ts`, and `contact.ts` so structures remain locale-neutral and visible strings come from catalogs.
- Extend both message catalogs under `home`, `work`, `about`, `experience`, and `contact`.
- Convert static page metadata to locale-aware `generateMetadata`.

Implementation notes:
- Do not translate brand names, technology names, URLs, slugs, employer-neutral facts, or identifiers.
- Preserve the English copy exactly where practical; Czech copy should be natural professional Czech, not a word-for-word machine translation.
- Add `en`, `cs`, and `x-default` alternates on indexable localized static pages.

Validation:
- Exact catalog parity.
- Known English/Czech copy assertions for each live route.
- Both locales for every published case study.

### Task 4: HTML CV And Insights Presentation

Objective:
- Translate the entire HTML CV and all Insights presentation chrome while keeping CMS editorial content explicitly English-only.

Files:
- Modify `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/**`.
- Modify Insights list/detail routes and `src/components/article/**`.
- Modify `src/lib/content/articlePresentation.ts` and related tests.
- Extend `curriculumVitae`, `insights`, and `article` catalog namespaces.

Implementation notes:
- Preserve CV facts and dates; do not silently resolve old content inconsistencies.
- The Czech PDF button must not claim that the existing PDF itself is Czech.
- Use locale-aware date formatting and ICU reading-time pluralization.
- Redirect Czech article details to their unprefixed English URL with HTTP 307. Do not emit Czech hreflang for an untranslated article.

Validation:
- Unit tests for en/cs dates, deterministic timezone, and reading-time plural cases `1`, `2`, and `5`.
- Browser checks for localized CV and Insights UI.

### Task 5: SEO, Sitemap And Full Regression

Objective:
- Prove the URL/SEO contract and prevent false-positive localization smoke tests.

Files:
- Modify `src/app/sitemap.ts`, localized metadata helpers, and route metadata.
- Create `src/__tests__/unit/sitemap.test.ts`.
- Create `src/__tests__/e2e/i18n-seo.spec.ts`, `i18n-switcher.spec.ts`; extend `launch.spec.ts` with the HTML CV and Czech route matrix.

Implementation notes:
- English canonical URLs are unprefixed; Czech static/case-study canonical URLs use `/cs`.
- Static and case-study entries expose `en`, `cs`, and `x-default` alternates.
- CMS article sitemap entries stay English-only until localized editorial content exists.
- A locale test must assert `<html lang>` and known translated visible/accessibility copy, not only HTTP 200 and an `h1`.

Validation:
- `pnpm test:unit`
- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm format:check`
- `pnpm build`
- `pnpm exec playwright test --project=chromium`

### Task 6: Independent Review And Handoff

Objective:
- Review the complete diff for routing, translation, accessibility, SEO, security, and regression defects.

Implementation notes:
- Reviewer is read-only and must cite severity plus path/line evidence.
- Controller resolves supported findings and reruns the smallest affected gate, then the full release gate.
- Compare final workspace state against the clean `6ce5c1b` base and reject unrelated changes.

Validation:
- Clean review or documented residual findings.
- No Payload schema/migration, CI deployment, secret, Caddy, Compose, or production changes.

## Required Release Gates

- Exact `en`/`cs` catalog parity with non-empty values.
- `/` remains English, unprefixed, and does not redirect for Czech `Accept-Language` or locale cookies.
- `/cs` renders Czech copy and `<html lang="cs">`.
- `/en` canonicalizes to the unprefixed English URL.
- `/api`, `/api/health`, and `/admin` never enter the locale namespace; current rate limiting still works.
- Locale switcher preserves the current route and query.
- English and Czech static pages have correct canonical/hreflang/OG locale.
- CMS-authored article URLs remain English-only in sitemap/hreflang until Payload localization exists.
- Unknown Czech portfolio URLs, unknown English Work case URLs, completely generic unprefixed English URLs, and invalid locale-shaped URLs return a genuine HTTP 404 with branded localized UI, `noindex`, and the correct document language; they must not become streamed soft 404 responses.
- A missing runtime CMS article remains a genuine branded English `noindex` 404. Because the slug must stay runtime-dynamic, Next.js 16 currently renders that nested `notFound()` response in its framework error document without a raw `<html lang>`; this single route class is the documented follow-up below.
- `/cs/insights/:slug` returns an HTTP redirect to `/insights/:slug` and no response `Link` header advertising `hreflang="cs"`.
- Unit, component, type, lint, format, production build, and Chromium smoke gates pass.

## Deferred Follow-Up: Payload Editorial Localization

- Add Payload localization config and mark selected fields localized.
- Generate and review a PostgreSQL migration.
- Back up production, rehearse on staging, and define fallback/default-locale behavior.
- Translate/publish post, topic, author, and media metadata per locale.
- Only then publish Czech article hreflang and localized editorial sitemap entries.

## Known Follow-Up: Runtime CMS Missing-Article Document Language

- Reproduce with `/insights/not-a-real-article`: HTTP status, branded English copy, and `noindex` are correct, but the raw document root is Next.js `<html id="__next_error__">` without `lang`.
- Do not set `dynamicParams = false` on the CMS article route: published articles must remain available without a rebuild/deploy.
- Resolve through a proven Next.js upstream fix or a future route topology that preserves runtime CMS publication. Do not replace the response with middleware-generated HTML or a client-side attribute patch and claim server-rendered parity.
- Keep this exception narrow. Generic, locale-shaped, Czech, and finite Work 404 routes already use the localized full-document global boundary and must retain raw `<html lang>`.

## Verification Record

- `pnpm test`: 14 files, 76 tests passed.
- `pnpm test:unit`: 17 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed with static generation retained for localized static pages and known Work cases.
- Production Chromium: 27/27 tests passed against the final production build, including the full localized 404 matrix and the explicit runtime-CMS residual regression.
- Focused proxy test: 10/10 assertions passed, including direct proof that `/cs` and `/cs/work` inject `X-NEXT-INTL-LOCALE: cs`.
- `git diff --check`: passed.
- `pnpm format:check`: passed across all 128 configured files after the pre-existing 25-file formatting baseline was normalized with explicit authorization.

## Execution Notes

- Worktree: `C:\tmp\cg-portfolio-i18n`.
- Branch: `feat/i18n-cs-en`, based on production commit `6ce5c1b`.
- Packet order is sequential where catalogs or route files overlap. Parallel work is allowed only for read-only review or disjoint test surfaces.
