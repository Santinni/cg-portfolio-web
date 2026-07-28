User: naplanuj provedeni analyzy a codereview nad celou aplikaci pro exekuci planu pak pouzij  i mpc server context7, chceme dodrzovat best practices, chceme mit aktualni a presnou a dobre dokumentujici dokumentaci, kvalitni kod a postupnyma iteracema chceme docilit produkcni kvallity. Je dulezite abysme  ze muzeme pouzivat agenty a subagenty

GitHub Copilot:

## Plan: Code Review & Production Quality Roadmap — cg-portfolio-web

Kompletní analýza a code review Next.js 15.1 + Payload CMS 3.15 + React 19 portfolio aplikace `codeguy.cz`. Cílem je iterativně dosáhnout produkční kvality s důrazem na kvalitu kódu, bezpečnost, a11y, výkon, testy, dokumentaci a infrastrukturu. Plán počítá s využitím agentů a subagentů pro paralelní exekuci jednotlivých iterací. Context7 MCP server bude použit jako zdroj aktuální dokumentace pro Next.js, Payload CMS a React při implementaci jednotlivých kroků.

---

### Iterace 1: Kvalita kódu — Critical Fixes & Dead Code Cleanup

**1.1 Odstranění kritické bezpečnostní zranitelnosti**
- route.ts — **smazat nebo zabezpečit**. Veřejný GET endpoint vrací **všechna uživatelská data** (emaily, role) bez autentizace. Buď smazat, nebo přidat `authenticated` access kontrolu.

**1.2 Oprava fallbacků na prázdný string**
- payload.config.ts — `PAYLOAD_SECRET || ""` a `DATABASE_URI || ""` nahradit runtime validací (throw pokud chybí). Použít Zod schema pro env validaci.
- Vytvořit soubor `src/lib/env.ts` se Zod schématem pro všechny povinné env proměnné.

**1.3 Dead code cleanup** (subagent může zpracovat paralelně)
- Smazat src/app/(frontend)/404-temp.tsx/404-temp.tsx) a vytvořit správný `not-found.tsx`
- Smazat getMediaData.ts — nikde se nepoužívá
- Smazat authenticatedOrPublished.ts — nikde se nepoužívá
- Vyčistit komentovaný kód: Projects import/section v page.tsx/(pages)/(home)/page.tsx), nav item v navigation/index.tsx/components/ui/navigation/index.tsx), starý form kód v contact/index.tsx/(pages)/(home)/sections/contact/index.tsx), sitemap dynamická generace v sitemap.ts
- Odstranit nevyužívaný `projects` query z getHomePageData.ts
- Vyčistit mrtvé CSS třídy v ExpandableText.module.css/components/primitives/expandableText/ExpandableText.module.css) (`.accordion*`, `.expandableTextTitle`)

**1.4 Type safety opravy**
- getHomePageData.ts — odstranit unsafe type assertions (`as Service[]`, `as About`, `as Contact`). Payload `find()` vrací `PaginatedDocs<T>` — nechat TS inferovat.
- Přidat null check pro `about.docs[0]` (může být `undefined`)
- src/app/(frontend)/(pages)/(home)/sections/about/index.tsx/(pages)/(home)/sections/about/index.tsx) — nahradit manuální traversal `data.content.root.children` za Payload rich text serializer

**1.5 Error handling v data fetching**
- getHomePageData.ts — obalit `Promise.all()` do try/catch, vrátit fallback data nebo přehodit s kontextovou chybovou zprávou
- Zvážit per-section `Suspense` boundaries v page.tsx/(pages)/(home)/page.tsx) pro graceful degradation

**1.6 Component fixes**
- BookingModal/index.tsx/components/ui/bookingModal/index.tsx) — přidat `"use client"` direktivu (používá `useState`)
- Hero/index.tsx/(pages)/(home)/sections/hero/index.tsx) — odstranit zbytečný `"use client"` (je to čistě statický markup)
- BookingModal/components/ui/bookingModal/index.tsx) — extrahovat hardcoded Google Calendar URL do env/config
- Nahradit `index` keys za stabilní ID (`service.id`, `project.id`) v Projects/(pages)/(home)/sections/projects/index.tsx), Services/(pages)/(home)/sections/services/index.tsx), Experience/(pages)/curriculum-vitae/sections/experience/index.tsx)

> **Agentní strategie:** Spustit 3 paralelní subagenty: (A) bezpečnost + env validace, (B) dead code cleanup, (C) type safety + error handling. Context7 použít pro ověření Payload CMS rich text serializer API a Next.js `not-found.tsx` konvence.

---

### Iterace 2: Accessibility & UX

**2.1 BookingModal — kompletní a11y rewrite**
- Přidat `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Implementovat focus trapping (focus uvnitř modalu při otevření)
- Přidat Escape key handler pro zavření
- Focus restoration po zavření
- `<iframe title="...">` pro screen readery
- Close button `aria-label="Zavřít"`
- Nahradit deprecated `frameBorder="0"` za CSS `border: 0`

**2.2 ExpandableText**
- Přidat `aria-expanded` na toggle button
- Přidat `aria-controls` propojení button→content
- Přidat `aria-label` pro chevron-only button

**2.3 Hero section SVGs**
- Přidat `aria-label` nebo `<title>` elementy na reference company SVGs
- Nebo `role="img"` + `aria-label`

**2.4 Sémantický HTML**
- Přidat `aria-labelledby` na všechny `<section>` elementy odkazující na jejich heading
- Přidat ID na všechny section headings

**2.5 Jazyková konzistence**
- Rozhodnout: je web v češtině nebo angličtině?
- layout.tsx/layout.tsx) nastavuje `lang="cs"` ale většina obsahu je anglicky
- Sjednotit — buď vše CZ nebo vše EN

> **Agentní strategie:** Jeden subagent na a11y audit všech komponent + implementaci. Context7 pro WAI-ARIA best practices a Next.js a11y doporučení.

---

### Iterace 3: Bezpečnost & Infrastruktura

**3.1 CORS**
- next.config.ts — omezit `Access-Control-Allow-Origin: *` na `https://codeguy.cz` (+ localhost pro dev)
- Caddyfile — sjednotit s Next.js konfigurací, odstranit duplicitní CORS

**3.2 Security headers**
- Řešit duplicitní security headers — definovat JEN v jedné vrstvě (Caddy NEBO Next.js)
- Odstranit `'unsafe-eval'` z CSP v Caddyfile (nebo zdůvodnit proč je nutný)

**3.3 Env validace**
- Implementovat `src/lib/env.ts` se Zod runtime validací všech env vars
- Validace při startu aplikace — fail-fast pokud chybí kritické proměnné

**3.4 CI/CD Pipeline**
- Vytvořit `.github/workflows/ci.yml`: lint, typecheck, test, build
- Vytvořit `.github/workflows/deploy.yml`: build Docker image → push GHCR → deploy na VPS
- Přidat `Dockerfile` (multi-stage: deps → build → standalone runner)
- Přidat `docker-compose.yml` (web + postgres + caddy)

**3.5 Access control**
- Rozlišit oprávnění `editor` vs `admin` na content kolekcích (Services, Projects, About, Contact)
- `editor` by neměl moci mazat obsah

> **Agentní strategie:** Dva paralelní subagenty: (A) security hardening (CORS, CSP, env), (B) CI/CD + Docker setup. Context7 pro Next.js security best practices a Docker standalone output doporučení.

---

### Iterace 4: Testovací infrastruktura

**4.1 Setup Vitest**
- Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- Vytvořit `vitest.config.ts` s path aliases, CSS modules mock, jsdom environment
- Přidat `pnpm test` a `pnpm test:watch` scripty do package.json

**4.2 Setup Testing Library**
- Vytvořit `src/test/setup.ts` pro global test setup
- Konfigurovat custom render s případnými providery

**4.3 Setup Playwright**
- Install: `@playwright/test`
- Vytvořit `playwright.config.ts` pro E2E testy
- Přidat `pnpm test:e2e` script
- Vytvořit základní E2E testy: navigace, home page load, CV page load, 404 page

**4.4 Psaní unit testů** (prioritní)
- `Button` component — discriminated union props, render modes
- `ExpandableText` — expand/collapse behavior
- `getHomePageData` — úspěšný fetch, error handling, empty data
- Access control funkce — `anyone`, `authenticated`
- Env validace (Zod schema)
- Payload collection validators (`Contact` phone/URL validators)

**4.5 Integrace do CI**
- Přidat test step do GitHub Actions workflow

> **Agentní strategie:** Subagent pro setup (Vitest + Playwright config), pak paralelní subagenty pro psaní testů po skupinách (komponenty, API, access control). Context7 pro Vitest + Next.js testing doporučení.

---

### Iterace 5: Dokumentace & Konzistence

**5.1 README přepis**
- Opravit falešné tvrzení o `pnpm test` / `pnpm test:e2e` (po iteraci 4 budou reálné)
- Nahradit placeholder `[repository-url]` a `[License Type]`
- Přidat sekci Architecture Decision Records (ADR)
- Aktualizovat project structure diagram
- Přidat sekci o deployment flow

**5.2 JSDoc dokumentace**
- Dokumentovat všechny public funkce: `getHomePageData`, access control funkce, validators
- Dokumentovat component props s `@param` a `@example`
- Dokumentovat collection schemas

**5.3 Kódová konzistence**
- Přidat Prettier konfiguraci (tabs, single quotes, no semicolons — dle .cursorrules)
- Přidat `eslint-plugin-jsx-a11y` pro accessibility linting
- Přidat `eslint-plugin-import` pro import ordering
- Aktualizovat eslint.config.mjs s novými pravidly

**5.4 CV sekce — CMS integrace**
- CV Contact/(pages)/curriculum-vitae/sections/contact/index.tsx) — napojit na Payload CMS místo hardcoded dat
- Zvážit vytvoření Payload kolekcí pro Experience, Education, TechStack
- Alternativa: vytvořit Payload Globals pro statický CV obsah

**5.5 Reusable patterns**
- Extrahovat opakující se `<section>` wrapper do `SectionWrapper` komponenty
- Sjednotit CSS variabily — nahradit hardcoded `#ffffff` v BookingModal.module.css/components/ui/bookingModal/BookingModal.module.css) za CSS variable

> **Agentní strategie:** Paralelní subagenty: (A) README + JSDoc, (B) ESLint + Prettier setup, (C) CV CMS integrace. Context7 pro Payload CMS Globals API a ESLint flat config dokumentaci.

---

### Iterace 6: Performance & Finalizace

**6.1 Performance audit**
- Ověřit Next.js Image component využití (remote images, `sizes` prop)
- Zkontrolovat bundle size — `@svgr/webpack` inline SVGs v Hero mohou být velké
- ISR strategie — `revalidate: 60` na home page, zvážit on-demand revalidation přes Payload hooks
- Odstranit `--experimental-build-mode compile` z build scriptu (nebo zdůvodnit)
- Odstranit `--no-deprecation` — chceme vidět deprecation varování

**6.2 Monitoring**
- Integrace Sentry pro error tracking (nahradit `console.error`)
- Přidat health check endpoint (pro Caddy `/api/health`)

**6.3 Finální review**
- Spustit `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- Lighthouse audit (Performance, A11y, SEO, Best Practices)
- Manuální test všech stránek

---

### Verification

Pro každou iteraci:
1. `pnpm typecheck` — žádné TypeScript chyby
2. `pnpm lint` — žádné ESLint chyby
3. `pnpm test` — všechny testy procházejí (od iterace 4)
4. `pnpm build` — úspěšný build bez warningů
5. Manuální smoke test na `localhost:3000`
6. Po iteraci 6: Lighthouse score > 90 ve všech kategoriích

### Decisions
- **Kód first:** Bezpečnost je kritická (data leak endpoint), ale uživatel preferuje kvalitu kódu jako první prioritu — bezpečnostní fix v 1.1 je přesto na prvním místě kvůli závažnosti
- **Testovací stack:** Vitest + Testing Library + Playwright — kompletní pokrytí unit/integration/E2E
- **Scope:** Osobní portfolio s plánovaným rozšířením na firemní — řešíme security, performance, a11y na komerční úrovni
- **Context7:** Bude použit při exekuci pro získání aktuální dokumentace technologií (Next.js 15, Payload CMS 3, React 19, Vitest, Playwright) — zahrnut do agentních strategií každé iterace
- **Agentní architektura:** Každá iterace definuje paralelní subagenty pro nezávislé work-streamy. Hlavní agent koordinuje a validuje výstupy.