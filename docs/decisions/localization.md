# Localization and content boundary decisions

| Field | Value |
| --- | --- |
| Scope | Locale strategy, public URL shape, routing bridge, Payload content boundary |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-01 |

The day-to-day rules for writing translatable code — catalogs, namespaces, ICU,
locale-aware navigation and formatters — are working instructions and live in
`AGENTS.md`. This record holds the decisions those rules rest on.

## L-01 — Two locales, English default, English URLs unprefixed · `locked`

**Decision.** The public site uses `next-intl` with `en` and `cs`. English is the default
locale and its URLs stay unprefixed. Czech uses `/cs`. `localePrefix` is `as-needed` and
`localeDetection` is `false`.

**Why.** `https://codeguy.cz` and every English URL already published must keep their
English meaning permanently. Locale detection would let a Czech browser silently change
what a shared link resolves to.

**What would reopen it.** Adding a third locale, or a decision that the site's canonical
identity is Czech rather than English.

## L-02 — Production routing bridge · `locked`

**Decision.** Unprefixed English index routes use explicit `beforeFiles` rewrites.
English dynamic Work and Insights routes use thin adapters under `src/app/(english)`.
Czech routes use the `[locale]` tree directly. For `/cs`, `src/proxy.ts` injects
`X-NEXT-INTL-LOCALE` into request headers rather than invoking the `next-intl`
URL-rewriting middleware.

**Why.** This shape was arrived at because the obvious alternative broke in production.

**What would reopen it.** Replacing it with `createMiddleware` requires proving that
standalone production routing has no redirect loop, soft 404, meta-refresh redirect or
false `Link` hreflang header. Do not swap it on the strength of it looking simpler.

## L-03 — No root `loading.tsx` in the locale route tree · `locked`

**Decision.** The locale-wide route tree stays free of a root `loading.tsx`. Loading UI
belongs only at narrow routes where the status decision happens first.

**Why.** A loading boundary can start streaming before `notFound()` runs, which turns a
required HTTP 404 into a soft 200. That is invisible in a browser and visible to search
engines.

**What would reopen it.** A framework change that resolves status before streaming.

## L-04 — Payload editorial content is English-only · `provisional`

**Decision.** Payload-authored article, topic, author and media content is English
editorial content. Czech UI may clearly identify English-only editorial content, but must
not present it as a Czech translation or publish a Czech article hreflang entry.
`/cs/insights/:slug` issues a real HTTP redirect to the unprefixed English route before
rendering — never a 200 meta-refresh.

**Why.** Translating the editorial content is a separate project with an editorial cost,
not a technical toggle. Claiming a Czech alternate that does not exist would be a false
SEO signal.

**What would reopen it.** An approved Payload localization migration — which requires its
own schema migration, backup, staging rehearsal and editorial workflow plan. Do not mark
fields `localized` or regenerate localized Payload types as part of ordinary work.

## L-05 — Locale-specific web app manifests are deferred · `provisional`

**Decision.** The global web app manifest remains the English/default manifest. Do not
introduce a locale-specific manifest as part of ordinary localization work.

**Why.** Deferred deliberately at launch; nothing depends on it yet.

**What would reopen it.** PWA work that makes the Czech install experience matter.

## L-06 — Known limitation: runtime CMS 404 document language · `open`

**Decision.** Not resolved. Runtime CMS article slugs intentionally stay dynamic so new
articles do not require a rebuild. In Next.js 16 a missing runtime article handled by a
nested `notFound()` returns a real branded `noindex` 404, but its raw framework error
document omits `<html lang>`.

**How to treat it.** Preserve the regression test. Treat this one route class as a
documented upstream/topology follow-up. **Do not weaken any static or finite-route 404
contract to make it consistent with this one.**

**Forbidden closures.** These look like fixes and are not:

- Do not set `dynamicParams = false` on the CMS article route. Published articles must
  stay available without a rebuild and deploy.
- Do not replace the response with middleware-generated HTML, and do not patch the
  attribute client-side, then claim server-rendered parity. Neither is server-rendered.
- Keep the exception narrow. Generic, locale-shaped, Czech and finite Work 404 routes
  already use the localized full-document boundary and must retain raw `<html lang>`.

**What would close it.** An upstream fix, or a topology change that makes the slug finite
while preserving runtime CMS publication.
