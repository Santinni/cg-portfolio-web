# Code Review & Production Quality — Changelog

> Kompletní dokumentace všech změn provedených v rámci 6-iteračního code review projektu **cg-portfolio-web** (codeguy.cz).
> Referenční plán analýzy viz [plan-analyzy.md](./plan-analyzy.md).

---

## Přehled

| # | Iterace | Stav | Soubory |
|---|---------|------|---------|
| 1 | Kvalita kódu | ✅ Dokončeno | ~15 souborů |
| 2 | Accessibility & UX | ✅ Dokončeno | ~8 souborů |
| 3 | Bezpečnost & infrastruktura | ✅ Dokončeno | ~12 souborů |
| 4 | Testovací infrastruktura | ✅ Dokončeno | ~10 souborů |
| 5 | Dokumentace & konzistence | ✅ Dokončeno | ~30 souborů |
| 6 | Performance & finalizace | ✅ Dokončeno | ~35 souborů |

**Finální stav:** 0 TS errors · 0 ESLint errors · 44/44 testů · čistý build

---

## Iterace 1: Kvalita kódu — Critical Fixes & Dead Code Cleanup

### 1.1 Bezpečnostní oprava — veřejný endpoint s uživatelskými daty

**Problém:** `src/app/routes/route.ts` obsahoval GET endpoint, který vracel **všechna uživatelská data** (emaily, role) bez jakékoliv autentizace.

**Řešení:** Endpoint přesunut na `src/app/api/health/route.ts` jako bezpečný health check (vrací `{ status: 'ok', timestamp }` bez citlivých dat). Původní route smazán.

**Soubory:**
- `src/app/routes/route.ts` — **smazán**
- `src/app/api/health/route.ts` — **vytvořen** (health check endpoint)

### 1.2 Runtime validace environment proměnných

**Problém:** `payload.config.ts` používal fallback na prázdný string (`PAYLOAD_SECRET || ""`, `DATABASE_URI || ""`), což maskuje chybějící konfiguraci.

**Řešení:** Vytvořen `src/lib/env.ts` se Zod schématem pro validaci env proměnných při startu. Fail-fast přístup — aplikace nevystartuje bez správné konfigurace.

**Soubory:**
- `src/lib/env.ts` — **vytvořen**
  - `serverEnvSchema` — validuje `PAYLOAD_SECRET` (min 32 znaků), `DATABASE_URI`, `NODE_ENV`
  - `publicEnvSchema` — validuje `NEXT_PUBLIC_SERVER_URL`
  - `validateEnv()` — generuje srozumitelné chybové zprávy
- `src/payload.config.ts` — odstraněny fallbacky na prázdný string, napojeno na env validaci

### 1.3 Dead code cleanup

**Smazané soubory:**
- `src/app/(frontend)/404-temp.tsx` — nahrazen správným `not-found.tsx`
- `src/lib/api/getMediaData.ts` — nikde se nepoužíval
- `src/access/authenticatedOrPublished.ts` — nikde se nepoužíval

**Vyčištěný kód:**
- `src/app/(frontend)/(pages)/(home)/page.tsx` — odstraněn zakomentovaný import Projects a nepoužívaný Projects section
- `src/app/(frontend)/components/ui/navigation/index.tsx` — odstraněn zakomentovaný nav item
- `src/app/(frontend)/(pages)/(home)/sections/contact/index.tsx` — odstraněn starý formulářový kód
- `src/app/sitemap.ts` — odstraněna zakomentovaná dynamická generace
- `src/lib/api/getHomePageData.ts` — odstraněn nevyužívaný `projects` query
- `src/app/(frontend)/components/primitives/expandableText/ExpandableText.module.css` — odstraněny mrtvé CSS třídy (`.accordion*`, `.expandableTextTitle`)

### 1.4 Type safety

**Soubory:**
- `src/lib/api/getHomePageData.ts` — odstraněny unsafe type assertions (`as Service[]`, `as About`, `as Contact`), přidán null check pro `about.docs[0]`, přidán try/catch s kontextovou chybovou zprávou, wrappováno `React.cache()` pro request-level deduplikaci
- `src/app/(frontend)/(pages)/(home)/sections/about/index.tsx` — odstraněn manuální traversal `data.content.root.children`, nahrazen Payload `<RichText>` komponentou

### 1.5 Component fixes

- `src/app/(frontend)/components/ui/bookingModal/index.tsx` — ověřen `'use client'` (potřebný — `useState`, `useEffect`)
- `src/app/(frontend)/(pages)/(home)/sections/hero/index.tsx` — odstraněn zbytečný `"use client"` (čistě statický markup bez hooks)
- `src/app/(frontend)/(pages)/(home)/sections/projects/index.tsx` — `index` keys nahrazeny za `project.id`
- `src/app/(frontend)/(pages)/(home)/sections/services/index.tsx` — `index` keys nahrazeny za `service.id`
- `src/app/(frontend)/(pages)/curriculum-vitae/sections/experience/index.tsx` — `index` keys nahrazeny za stabilní ID

### 1.6 Custom Not Found page

- `src/app/(frontend)/not-found.tsx` — **vytvořen** dle Next.js konvence (nahradil `404-temp.tsx`)

---

## Iterace 2: Accessibility & UX

### 2.1 BookingModal — kompletní a11y rewrite

**Soubor:** `src/app/(frontend)/components/ui/bookingModal/index.tsx`

Implementované funkce:
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` na modal kontejneru
- **Focus trapping** — focus zůstává uvnitř modalu (Tab + Shift+Tab)
- **Escape key handler** — zavření modalu klávesou Escape
- **Focus restoration** — po zavření se focus vrátí na trigger element
- **Body scroll lock** — `overflow: hidden` při otevřeném modalu
- `<iframe title="...">` pro screen readery
- Close button `aria-label="Close booking modal"`
- Odstraněn deprecated `frameBorder="0"`, nahrazen CSS `border: 0`
- Přidán `ref` na trigger (`triggerRef`) a close button (`closeButtonRef`)

### 2.2 ExpandableText — ARIA atributy

**Soubor:** `src/app/(frontend)/components/primitives/expandableText/index.tsx`

- `aria-expanded` na toggle button
- `aria-controls` propojení button → content (přes `useId()`)
- `aria-label` dynamicky: "Show more" / "Show less"
- `role="region"` + `aria-hidden` na content kontejneru

### 2.3 Sémantický HTML — section headings

Přidáno `id` na section headings a `aria-labelledby` na odpovídající `<section>` elementy:
- `src/app/(frontend)/(pages)/(home)/sections/services/index.tsx`
- `src/app/(frontend)/(pages)/(home)/sections/about/index.tsx`
- `src/app/(frontend)/(pages)/(home)/sections/contact/index.tsx`
- `src/app/(frontend)/(pages)/(home)/sections/projects/index.tsx`

### 2.4 Navigation — ARIA

**Soubor:** `src/app/(frontend)/components/ui/navigation/index.tsx`

- `aria-expanded` + `aria-controls` na hamburger menu button
- `aria-label="Toggle mobile menu"` na open button
- `aria-label="Close mobile menu"` na close button
- Dialog `id` generováno přes `useId()` a propojeno s `aria-controls`

---

## Iterace 3: Bezpečnost & Infrastruktura

### 3.1 CORS hardening

**Soubor:** `next.config.ts`

- `Access-Control-Allow-Origin: *` nahrazeno za `process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'`
- CORS hlavičky aplikovány pouze na `/api/:path*`

### 3.2 Security headers

**Soubor:** `next.config.ts`

Přidány hlavičky na všechny routy `/(.*)*`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Permissions-Policy` — zakázány senzory, kamera, mikrofon, platby
- `Content-Security-Policy` — `default-src 'self'`, povolení pro Google Calendar (`connect-src`, `frame-src`), `frame-ancestors 'none'`

### 3.3 Rate limiting (middleware)

**Soubor:** `src/middleware.ts` — **vytvořen**

- In-memory rate limiter pro `/api/*` a `/admin/*` routy
- Sliding window: 60 požadavků / 60 sekund per IP
- Automatický cleanup expirovaných entries (každých 5 minut)
- Extrakce IP z `x-forwarded-for` / `x-real-ip` headerů
- HTTP 429 odpověď s `Retry-After` a `X-RateLimit-*` headers
- JSDoc dokumentace s upozorněním na omezení per-instance (vs. Redis)

### 3.4 CI/CD Pipeline

**Soubor:** `.github/workflows/ci.yml` — **vytvořen**

4-fázový pipeline:
1. **quality** — checkout → pnpm → Node.js → install → `typecheck` + `lint`
2. **test** — `pnpm test` (závisí na quality)
3. **build** — Docker build & push na GHCR (pouze `main` branch, push event)
   - Multi-platform build s BuildKit cache
   - Docker metadata (SHA tag + `latest`)
   - Build arg `NEXT_PUBLIC_SERVER_URL`
4. **deploy** — SSH deploy na VPS (závisí na build)
   - `docker compose pull web && docker compose up -d`
   - Health check (`/api/health`)
   - Image pruning

Konfigurace:
- `concurrency` — cancel-in-progress pro duplicitní runs
- `NODE_VERSION: 22`, `PNPM_VERSION: 9`
- `environment: production` na deploy jobu

### 3.5 Docker infrastruktura

**Soubor:** `Dockerfile` — upravena existující konfigurace

3-stage multi-stage build:
1. **deps** — `node:22-alpine`, `pnpm@9.12.0`, `--frozen-lockfile --ignore-scripts`
2. **builder** — kopíruje `node_modules` z deps, `pnpm build`
3. **runner** — `node:22-alpine`, non-root user (`nextjs:nodejs`), standalone output

**Soubor:** `docker-compose.yml` — potvrzen existující setup

3 služby: `db` (PostgreSQL), `web` (Next.js), `caddy` (reverse proxy), healthcheck konfigurace.

---

## Iterace 4: Testovací infrastruktura

### 4.1 Vitest setup

**Soubor:** `vitest.config.ts` — **vytvořen**

- `@vitejs/plugin-react` plugin
- `jsdom` environment
- Path alias `@` → `./src`
- CSS Modules mock (`classNameStrategy: 'non-scoped'`)
- Setup file `src/__tests__/setup.ts`
- V8 coverage provider
- Excludes: `node_modules`, `.next`, E2E testy, `payload-types.ts`, `payload.config.ts`, admin UI

**Soubor:** `src/__tests__/setup.ts` — **vytvořen**
- Import `@testing-library/jest-dom` pro DOM matchers (`toBeInTheDocument`, `toHaveAttribute` atd.)

### 4.2 Playwright E2E setup

**Soubor:** `playwright.config.ts` — **vytvořen**
- Chromium, Firefox, WebKit prohlížeče
- Base URL `http://localhost:3000`
- Retry 2× v CI, 0× lokálně
- Screenshot on failure

**Soubor:** `src/__tests__/e2e/home.spec.ts` — **vytvořen**
- Základní E2E test: navigace na home page, ověření load

### 4.3 Unit testy — 44 testů

**`src/__tests__/unit/access.test.ts`** (4 testy)
- `anyone()` — vždy vrací `true`
- `authenticated()` — vrací `true` s uživatelem, `false` bez

**`src/__tests__/unit/env.test.ts`** (11 testů)
- Validní env proměnné projdou validací
- Chybějící/nevalidní `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SERVER_URL`
- Krátký `PAYLOAD_SECRET` (< 32 znaků)
- Default `NODE_ENV` fallback
- `validateEnv()` error formátování

**`src/__tests__/unit/middleware.test.ts`** (7 testů)
- Propouští non-API routy
- Rate limiting: povoluje v rámci limitu
- Rate limiting: blokuje po překročení
- Správné `X-RateLimit-*` a `Retry-After` headers
- Reset po vypršení window

**`src/__tests__/components/button.test.tsx`** (14 testů)
- Renderování jako `<button>` (default)
- Renderování jako `<a>` (link mód)
- Varianty: `primary`, `outlined`, `transparent`
- `rounded` prop
- `disabled` stav
- Click handler
- Správné CSS třídy

**`src/__tests__/components/expandable-text.test.tsx`** (8 testů)
- Výchozí stav: collapsed
- Expand/collapse toggle
- `aria-expanded`, `aria-hidden`, `aria-controls` atributy
- `aria-label` dynamicky: "Show more" ↔ "Show less"

### 4.4 Package.json scripty

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

### 4.5 Nové devDependencies

- `vitest` ^4.0.18
- `@testing-library/react` ^16.3.2
- `@testing-library/jest-dom` ^6.9.1
- `@testing-library/user-event` ^14.6.1
- `@vitejs/plugin-react` ^5.1.4
- `jsdom` ^28.1.0
- `@playwright/test` ^1.58.2

---

## Iterace 5: Dokumentace & Konzistence

### 5.1 JSDoc dokumentace

Přidány JSDoc komentáře na **~27 souborů**:

**Kolekce:** `About.ts`, `Contact.ts`, `Media.ts`, `Projects.ts`, `Services.ts`, `Users.ts`
**Access control:** `anyone.ts`, `authenticated.ts`
**API:** `getHomePageData.ts`
**Env:** `env.ts`
**Komponenty:**
- `Button` — prop interface, render mód discriminated union
- `ExpandableText` — animovaný toggle, ARIA atributy
- `ExpandingButton` — floating CTA, download mode
- `BookingModal` — a11y features, focus trapping
- `Navigation` — desktop/mobile dialog
**Sekce:** Hero, Services, About, Contact, Projects (home), WhoAmI, Experience, Education, TechnologicalStack, Contact (CV)
**Pages:** HomePage, CurriculumPage, NotFound, Error, Loading
**Layouts:** RootLayout
**Config:** robots.ts, sitemap.ts, middleware.ts

### 5.2 README.md — kompletní přepis

- Aktuální tech stack s verzemi
- Reálné scripty (test, lint, build, format)
- Popis architektury (App Router, Payload CMS, collections)
- Deployment flow (GitHub Actions → GHCR → Docker → VPS)
- Správná licence (MIT), repozitář URL
- Odstraněny placeholder `[repository-url]` a `[License Type]`

### 5.3 Kódová konzistence

- `src/collections/Media.ts` — sjednocen `access` pattern na `anyone` helper (místo inline funkce)
- `src/app/(frontend)/components/ui/navigation/index.tsx` — sjednoceny uvozovky (single quotes)
- `src/app/robots.ts` — opraven import na `import type` (type-only)

---

## Iterace 6: Performance & Finalizace

### 6.1 Image optimization (kritické pro LCP)

**About section** — `src/app/(frontend)/(pages)/(home)/sections/about/index.tsx`
- Přidán `sizes="(max-width: 768px) 100vw, 50vw"` na `<Image fill>`
- Přidán `className={styles.image}` místo inline `style={{ objectFit: 'cover' }}`

**About CSS** — `src/app/(frontend)/(pages)/(home)/sections/about/About.module.css`
- Přidána `.image { object-fit: cover }` třída

**Projects section** — `src/app/(frontend)/(pages)/(home)/sections/projects/index.tsx`
- Přidán `sizes="(max-width: 768px) 100vw, 50vw"` na `<Image fill>`
- Přidán `className={styles.image}` místo inline `style`

**Projects CSS** — `src/app/(frontend)/(pages)/(home)/sections/projects/Projects.module.css`
- Přidána `.image { object-fit: cover }` třída

**Navigation logo** — `src/app/(frontend)/components/ui/navigation/index.tsx`
- Přidán `priority` (above-the-fold obrázek)
- `alt="Logo"` → `alt=""` (dekorativní — text "Karel Kutchan" následuje)

### 6.2 Metadata & SEO

**Layout** — `src/app/(frontend)/layout.tsx`
- Přidán `export const viewport: Viewport` s `themeColor`, `width`, `initialScale`
- Import rozšířen o `Viewport` type

**CV page** — `src/app/(frontend)/(pages)/curriculum-vitae/page.tsx`
- Přidán `export const metadata: Metadata` s title "Curriculum Vitae" a popisem
- Opraveno pořadí importů (section importy přesunuty nad metadata export)

**robots.ts** — `src/app/robots.ts`
- Hardcoded sitemap URL nahrazen dynamickým: `` `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'}/sitemap.xml` ``

**manifest.json** — `src/app/manifest.json`
- Přidán `"lang": "cs"`
- `"purpose": "maskable any"` rozdělen na dva separátní záznamy (`"maskable"` + `"any"`) dle W3C specifikace

### 6.3 Bundle optimization

- `src/app/(frontend)/(pages)/(home)/sections/contact/index.tsx` — odstraněn zbytečný `'use client'` (BookingModal má vlastní client boundary)
- `src/app/(frontend)/(pages)/curriculum-vitae/sections/who-am-i/index.tsx` — odstraněn zbytečný `"use client"` (ExpandableText má vlastní client boundary)
- `src/app/(frontend)/(pages)/(home)/page.module.css` — **smazán** (prázdný soubor)
- `src/app/(frontend)/(pages)/curriculum-vitae/loading.tsx` — **vytvořen** (loading spinner pro CV route segment)

### 6.4 A11y doplnění

- Navigation close button — `aria-label="Close mobile menu"`
- Navigation logo — `alt=""` (dekorativní obrázek)

### 6.5 Docker hardening

- `Dockerfile` — `pnpm@latest` → `pnpm@9.12.0` (obě stage — deps i builder)

### 6.6 Biome formatter

**Soubor:** `biome.json` — **vytvořen**

Konfigurace:
- `indentStyle: "tab"` (dle .cursorrules)
- `quoteStyle: "single"` (dle .cursorrules)
- `semicolons: "asNeeded"` (dle .cursorrules — no semicolons)
- `lineWidth: 100`
- Scope: `src/app/(frontend)/**`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/collections/**`, `src/access/**`, `src/lib/**`
- Linter: disabled (ESLint je primární)

**Výsledek:** 33 souborů automaticky naformátováno.

**Package.json scripty:**
```json
"format": "biome format --write src",
"format:check": "biome format src"
```

**Nová devDependency:** `@biomejs/biome` ^2.4.4

### 6.7 Build warnings — cleanup

- `caniuse-lite` (browserslist) aktualizován na nejnovější verzi → odstranění "12 months old" warningu
- `next.config.ts` — přidáno `config.module.exprContextCritical = false` → potlačení Prettier "critical dependency" warningu (pochází z interních Payload CMS závislostí, nemá vliv na runtime)

---

## Souhrn nových souborů

| Soubor | Účel |
|--------|------|
| `src/lib/env.ts` | Zod runtime validace env proměnných |
| `src/middleware.ts` | Rate limiting pro API/admin routy |
| `src/app/api/health/route.ts` | Health check endpoint |
| `src/app/(frontend)/not-found.tsx` | Custom 404 stránka |
| `src/app/(frontend)/(pages)/curriculum-vitae/loading.tsx` | CV loading spinner |
| `.github/workflows/ci.yml` | CI/CD pipeline |
| `vitest.config.ts` | Vitest konfigurace |
| `playwright.config.ts` | Playwright E2E konfigurace |
| `biome.json` | Biome formatter konfigurace |
| `src/__tests__/setup.ts` | Test setup (jest-dom matchers) |
| `src/__tests__/unit/access.test.ts` | Access control unit testy |
| `src/__tests__/unit/env.test.ts` | Env validace unit testy |
| `src/__tests__/unit/middleware.test.ts` | Middleware unit testy |
| `src/__tests__/components/button.test.tsx` | Button component testy |
| `src/__tests__/components/expandable-text.test.tsx` | ExpandableText component testy |
| `src/__tests__/e2e/home.spec.ts` | E2E smoke test |

## Smazané soubory

| Soubor | Důvod |
|--------|-------|
| `src/app/(frontend)/404-temp.tsx` | Nahrazen `not-found.tsx` |
| `src/lib/api/getMediaData.ts` | Nepoužívaný kód |
| `src/access/authenticatedOrPublished.ts` | Nepoužívaný kód |
| `src/app/routes/route.ts` | Bezpečnostní riziko — nahrazen `/api/health` |
| `src/app/(frontend)/(pages)/(home)/page.module.css` | Prázdný soubor |

---

## Technologické závislosti přidané během review

### Produkční
- `zod` ^4.3.6 — runtime validace

### Vývojové
- `vitest` ^4.0.18 — test runner
- `@testing-library/react` ^16.3.2 — React testing utilities
- `@testing-library/jest-dom` ^6.9.1 — DOM matchers
- `@testing-library/user-event` ^14.6.1 — user interaction simulation
- `@vitejs/plugin-react` ^5.1.4 — React plugin pro Vitest
- `jsdom` ^28.1.0 — DOM environment pro testy
- `@playwright/test` ^1.58.2 — E2E testing framework
- `@biomejs/biome` ^2.4.4 — code formatter

---

## Validace

Finální stav po dokončení všech 6 iterací:

```
TypeScript:  0 errors
ESLint:      0 errors, 0 warnings
Tests:       44/44 passing (5 test files)
Build:       ✅ compiled successfully, 0 warnings
```

## Známé limitace a budoucí práce

1. **CSP `unsafe-eval`** — stále přítomen v `next.config.ts`, požadován Payload CMS admin panelem. Zvážit oddělení CSP pro admin vs frontend routy.
2. **Rate limiting** — in-memory, per-instance. Pro multi-instance deployment nahradit za Redis-based řešení.
3. **CV sekce** — obsah je stále hardcoded (Experience, Education, TechStack, WhoAmI). Zvážit napojení na Payload CMS Globals.
4. **BookingModal** — používá `<div role="dialog">` místo nativního `<dialog>`. Zvážit refaktor na nativní element.
5. **Google Calendar URL** — hardcoded konstanta v `BookingModal`. Zvážit přesun do env proměnné nebo CMS.
6. **E2E testy** — pouze základní smoke test. Rozšířit o kompletní user flow testy.
7. **`--experimental-build-mode compile`** — experimentální Next.js flag v build scriptu. Sledovat stabilitu v novějších verzích.
