# Implementační zpráva: nový Codeguy web

Datum auditu: 23.–24. 7. 2026
Repozitář: `D:\work\web\CG\codeguy\cg-portfolio-web`
Větev: `dev`
Výchozí commit: `39f366c`

## 1. Shrnutí výsledku

V repozitáři byl připraven technický základ pro kompletně nový Codeguy web:

- Next.js App Router a React byly aktualizované na aktuální podporovanou řadu.
- Payload CMS byl rozšířen o redakční model pro Insights.
- Vznikla typovaná veřejná content vrstva oddělená od interních CMS dat.
- Byly připravené bezpečnostní helpery pro preview a podepsanou revalidaci.
- Vznikly základní layout, theme a article komponenty.
- Docker runtime byl přesunut z EOL Node 20 na Node 24 LTS.
- Standardní lint, unit testy, Payload type generation a TypeScript kontrola procházejí.

Veřejný frontend není hotový. Po upřesnění zadání byla zastavena strategie
postupného upravování legacy UI. Celý veřejný route/component strom musí být
nahrazen podle souboru Figma `Codeguy Portfolio - Final Design`.

## 2. Zdroj pravdy a změna implementační strategie

Původní pracovní předpoklad počítal s postupnou modernizací existujících stránek.
Uživatel následně potvrdil, že jde o kompletně nový web a že staré UI není
vizuální source of truth.

Platná strategie:

1. zachovat použitelnou Next.js, Payload, PostgreSQL a deployment infrastrukturu,
2. zachovat nebo migrovat obsah,
3. postavit nový frontend podle finální Figmy,
4. nepřenášet legacy layout, barvy ani komponentové API pouze kvůli zpětné
   kompatibilitě,
5. ověřovat desktop, tablet 768 px, mobil 390 px, light/dark, a11y a systémové
   stavy.

Známý Figma file key: `cs38WzlXKY9xfDYBinoKel`.

Přímý Figma konektor nebyl v relaci dostupný. Přesné token values, assety a
pixelovou shodu proto nelze v tomto stavu potvrdit.

## 3. Delegované úkoly a externí CLI

### CMS foundation agent

Připravil:

- role a editorial access helpery,
- kolekce Posts, Topics a Authors,
- rozšíření Users a Media,
- publish validaci, stabilní slug a reading time,
- Payload type generation,
- základ public content vrstvy,
- preview a revalidation crypto helpery,
- unit testy.

Následný self-review odhalil a opravil:

- runtime únik interních polí přes objekty pouze typované pomocí `Pick<T>`,
- draft a unresolved related relationships,
- chybný cache tag `medi:<id>`,
- catch-all převádějící DB chybu na falešné 404,
- neomezený preview document ID.

### Design shell agent

Připravil technický základ:

- Container,
- SkipLink,
- ThemeScript,
- ThemeToggle,
- semantic theme wiring scaffold,
- vlastní GitHub a LinkedIn SVG ikony po změně API `lucide-react`.

Vizuální výstup není považovaný za finální design implementaci. Musí být
nahrazen nebo upraven podle skutečných Figma tokenů a obrazovek.

### Article components agent

Připravil behaviorální a typový základ:

- ArticleCard,
- ArticleMetadata,
- TableOfContents,
- Callout,
- ShareBar,
- CodeBlock,
- AuthorContext,
- RelatedArticle,
- Empty, Loading a Error editorial states.

Jejich chování lze znovu použít. CSS používající legacy aliases nebo odhadnuté
hodnoty není finální a musí být přestylované podle Figmy.

### Architecture/handoff agent

Provedl read-only audit a potvrdil cílovou route mapu:

- `/`
- `/work`
- `/work/[slug]`
- `/experience`
- `/about`
- `/contact`
- `/insights`
- `/insights/[slug]`

Audit potvrdil, že současný veřejný strom obsahuje pouze legacy homepage a
`/curriculum-vitae` a musí být nahrazen.

### GitHub Copilot CLI

GitHub Copilot CLI 1.0.73 byl spuštěn jako nezávislý read-only reviewer:

- bez tools a MCP,
- bez workspace attachments,
- bez secrets,
- nad sanitizovaným popisem architektury.

Použitelné závěry:

- foundation → content model → routes → preview/revalidation → QA,
- striktní oddělení public a preview reads,
- HMAC, timestamp a idempotency pro revalidation,
- průběžná responsive, a11y, SEO a publishing QA matice.

Nepřevzaté návrhy:

- nepodložená pixelová tolerance,
- nepodložené Lighthouse SLA,
- metadata před stabilním CMS modelem,
- obecný `fetch` místo Payload Local API.

Finální Copilot follow-up nad staged diffem chybně navrhl sbírat v
`readingTime.ts` všechny obecné stringy. Nezávislý arbiter však nález zpřesnil:
Lexical `text` nodes byly správně, ale raw text custom bloků byl vynechaný.
Implementace nyní používá explicitní allowlist `callout.title/body` a
`codeBlock.source`; regresní test používá reálně serializované Payload block
nodes. Copilot ani následný arbiter nenašli další access-control, Docker nebo
runtime problém.

### Claude CLI

Claude Code 2.1.218 byl delegovaný v bezpečném read-only režimu bez nástrojů,
MCP, persistence a lokálních secrets.

Výsledek:

- první běh skončil timeoutem bez výstupu,
- opakovaný běh skončil limitem rozpočtu.

Claude proto neposkytl použitelný code-review výstup a není uváděný jako
schvalující reviewer.

## 4. Aktualizace technologického stacku

Aktuální hlavní verze:

- Next.js `16.2.11`
- React a React DOM `19.2.8`
- Payload a `@payloadcms/*` `3.86.0`
- TypeScript `6.0.3`
- ESLint `9.39.5`
- `eslint-config-next` `16.2.11`
- `lucide-react` `1.26.0`
- `sharp` `0.35.3`
- `cross-env` `10.1.0`

Nebyla použita slepá strategie „všechno na registry latest“:

- TypeScript 7 nebyl použit kvůli peer incompatibilitě tooling řetězce.
- ESLint 10 nebyl použit, protože aktuální Next pluginy jej nepodporují.

ESLint byl migrovaný z legacy `FlatCompat` na přímé Next flat-config importy.

## 5. Payload CMS a redakční model

### Posts

Model článku zahrnuje:

- title a stabilní slug,
- excerpt a Lexical content,
- featured a social image,
- topics a author relationship,
- publish metadata,
- canonical URL a no-index,
- curated related posts,
- computed reading time,
- drafts, publish status a plánování.

Publikační guardy:

- autor nemůže vytvořit dokument přímo jako published,
- první publish ukládá `firstPublishedAt`,
- slug po prvním publikování nelze libovolně měnit,
- publikace vyžaduje minimální editorial kontrakt.

### Topics a Authors

Vznikly samostatné kolekce pro:

- témata, jejich pořadí a popis,
- autory, roli, biografii, expertizu, portrét a veřejné sociální odkazy.

### Users a role

Role:

- admin,
- publisher,
- editor,
- author.

První vytvořený uživatel může získat admin roli, následné změny jsou řízené
access pravidly.

### Media

Media obsahuje:

- decorative flag,
- alt text validovaný pro nedekorativní obsah,
- caption,
- credit,
- vztah na uživatele, který soubor nahrál.

Interní `uploadedBy` není součástí public DTO.

## 6. Veřejná content vrstva

`src/lib/content/posts.server.ts` používá Payload Local API.

Bezpečnostní kontrakt:

- každý veřejný read používá `overrideAccess: false`,
- Posts používají `draft: false`,
- query vždy omezuje `_status` na `published`,
- stránkování je bounded,
- public DTO jsou sestavované explicitním runtime mapperem,
- interní CMS fields nejsou vracená pouhým TypeScript castem,
- related post je přijatý pouze jako populated published dokument.

Topics a Authors jsou rovněž mapované na explicitní public DTO.

## 7. Preview a revalidace

Připravené helpery:

- krátkodobý audience-bound HMAC preview token,
- bounded document ID a slug,
- timing-safe signature verification,
- maximální TTL,
- HMAC podpis raw revalidation body a timestampu,
- freshness kontrola,
- delivery ID,
- striktní allowlist collection a operation,
- server-side odvození cache paths a tags.

Záměrně chybí end-to-end zapojení:

- `/preview` route,
- disable-preview route,
- ověření Payload editor session před `draftMode`,
- `/api/revalidate` handler,
- lifecycle hooks po publish/unpublish/delete,
- idempotency store a retry mechanism.

Helper není totéž co hotový produkční workflow.

## 8. Frontend foundation

Připravené technické komponenty:

- hydration-safe early theme script,
- persistent theme toggle,
- skip link,
- responsive Container,
- základ light/dark data-theme strategie,
- GitHub a LinkedIn brand icons bez závislosti na odstraněných Lucide exports.

Layout obsahuje theme bootstrap a skip link, ale stále renderuje legacy
navigaci. Theme toggle navíc zatím není zapojený do finálního nového headeru.

Nové Figma obrazovky, route pages, navigation, footer a semantic tokens ještě
nejsou implementované.

## 9. Docker a runtime

Dockerfile byl aktualizovaný:

- Node `20.9.0` → Node `24.18.0` LTS,
- pnpm `9.12.0` → pnpm `10.28.0`.

Lokální terminál používá Node 25.3.0, což je EOL řada. Produkční image proto
nesmí odvozovat podporu z lokálního runtime.

PostgreSQL 15 nebyl automaticky změněn na PostgreSQL 18:

- PostgreSQL 15 je stále podporovaný,
- major upgrade existujícího volume vyžaduje `pg_upgrade` nebo export/import,
- slepé přepsání image nad existujícím volume by bylo rizikové.

Compose syntax byla ověřená příkazem `docker compose config --quiet`.

## 10. Bezpečnostní opravy konfigurace

Z `next.config.ts` byly odstraněné:

- `PAYLOAD_SECRET` vložený přes `next.config env`,
- `DATABASE_URI` vložený přes `next.config env`,
- wildcard CORS headers pro celé Payload API.

Serverové secrets musí zůstat pouze v serverových `process.env` čteních.

## 11. Validace

Čerstvě ověřené:

- `pnpm lint` — PASS
- `pnpm test:unit` — PASS, 17/17
- `pnpm typecheck` — PASS
- `pnpm generate:types` — PASS
- `git diff --check` — PASS
- `docker compose config --quiet` — PASS
- `docker build --check .` a celý Node 24 image build — PASS

Unit testy pokrývají:

- Lexical reading time,
- publish kontrakt,
- stabilní slug,
- media alt text,
- published-only query,
- bounded pagination,
- runtime public DTO redakci,
- preview token expiraci a tampering,
- signed revalidation freshness a body integrity,
- allowlisted cache targets,
- nepravidelný `media:<id>` cache tag.

Plný `next build` nyní prochází bez build-time přístupu k databázi:

- legacy homepage je explicitně dynamická,
- route `/` je v build výstupu označená jako dynamic,
- produkční image sestaví standalone server bez běžícího PostgreSQL.

Runtime smoke image potvrdil HTTP 200 na `/curriculum-vitae`, UID 1000,
přítomný standalone `server.js` a nulový počet `.env*` souborů. Compile-only
build zůstává odstraněný jako falešně slabý release gate.

## 12. Známé slepé cesty

Podrobný průběžný záznam je v `IMPLEMENTATION_NOTES.md`.

Nejdůležitější body:

- neopravovat legacy UI jako finální frontend,
- nepoužívat registry latest bez peer compatibility gate,
- nepoužívat legacy FlatCompat s Next 16 flat configem,
- nevydávat compile-only build za produkční build,
- nevkládat secrets přes `next.config env`,
- nepovažovat `Pick<T>` za runtime redakci dat,
- neodvozovat cache tags ořezáním názvu kolekce,
- nemaskovat DB outage jako 404,
- neposílat lokální handoff dokumenty externím CLI bez schválení.

## 13. Nehotové části a rizika

### Blokující pro vizuální implementaci

- není dostupný Figma connector ani export semantic variables a assets,
- přesnou shodu nelze dokazovat ze starého CSS.

### Chybějící produktové routy

- `/work`
- `/work/[slug]`
- `/experience`
- `/about`
- `/contact`
- `/insights`
- `/insights/[slug]`

### Chybějící publishing integrace

- preview route a ověření editor identity,
- Next cache wrappers a tag registry,
- signed revalidation endpoint,
- Payload lifecycle wiring,
- RSS, dynamická sitemap, JSON-LD a OG ImageResponse.

### Chybějící QA

- Playwright,
- axe,
- responsive matrix 320/390/768/1024/1440,
- light/dark visual regression,
- keyboard a touch smoke test,
- 200% zoom,
- reduced motion,
- performance budgets.

### Worktree rizika

- změna je široká a kombinuje stack upgrade, CMS scaffold, frontend foundation,
  Docker a dokumentaci,
- frontend soubory jsou deklarovaný WIP a nejsou merge-ready jako nový design.

## 14. Doporučené pokračování

1. Připojit Figma soubor nebo dodat export finálních nodes, variables a assets.
2. Založit nový veřejný route tree bez legacy hash navigace.
3. Dokončit jeden vertical slice `/` ve všech viewports a light/dark.
4. Postavit `/work` a `/work/[slug]`.
5. Zapojit Insights listing/detail přes public content vrstvu.
6. Dokončit preview, cache, revalidation, metadata, JSON-LD, RSS, sitemap a OG.
7. Přidat Playwright, axe, visual regression a performance gate.
8. Ověřit nové routy v browseru proti Figma desktop/tablet/mobile prototypům.

## 15. Navržená commit message

```text
feat: scaffold Next 16 and Payload editorial foundation

- upgrade Next, React, Payload and compatible tooling
- add editorial roles, posts, topics, authors and media rules
- add public content DTOs and CMS security helpers
- add theme, layout and article component foundations
- update Docker runtime to Node 24 LTS
- document implementation decisions, blind alleys and remaining work
```

Tato commit message popisuje scaffold, nikoli dokončený nový web.
## 16. Finální review opravy

Po prvním code review byly navíc uzavřené všechny P1/P2 nálezy:

- transitive security overrides pro Sharp, PostCSS a esbuild,
- bezpečný Docker context, standalone/non-root image a zdravý Compose startup,
- server-owned `firstPublishedAt` a vynucené author ownership,
- raster MIME allowlist, file/pixel limity a ochrana používaných médií,
- odstranění zastaralého `README.md.bak`,
- doplnění chybějící screen-reader utility.

Úplný ledger nálezů, rozhodnutí a jejich vypořádání je v `CODE_REVIEW.md`.