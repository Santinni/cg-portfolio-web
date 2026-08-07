# CodeGuy portfolio web

Produkční osobní web CodeGuy nad Next.js App Router, TypeScriptem, Payload CMS
a PostgreSQL. Veřejná verze podle návrhu `Codeguy Portfolio - Final Design` je
nasazená na [https://codeguy.cz](https://codeguy.cz). HTTP provoz se automaticky
přesměruje na HTTPS a `www` na hlavní doménu.

## Požadavky

- Node.js 24 LTS (`>=24 <25`)
- pnpm 10.28
- PostgreSQL 15 pro stávající prostředí

Lokální Node 25 není podporovaný runtime projektu. Příkazy na něm mohou
fungovat, ale vypisují očekávané upozornění na nesplněný engine.

## Lokální spuštění

1. Vytvořte `.env` podle interního deployment kontraktu.
2. Nastavte minimálně `DATABASE_URI`, `PAYLOAD_SECRET` a `DB_PASSWORD`.
3. Nainstalujte závislosti: `pnpm install --frozen-lockfile`.
4. Spusťte vývojový server: `pnpm dev`.

Payload administrace je dostupná pod `/admin`.

## Docker

```bash
docker compose up --build
```

Aplikace je dostupná na `http://localhost:3000`. PostgreSQL není publikovaný
na host port; je dostupný pouze uvnitř Compose sítě. `DB_PASSWORD` je povinný
a aplikace čeká na úspěšný healthcheck databáze.

Produkční image používá Node 24 LTS, Next standalone výstup a neprivilegovaného
uživatele `node`. Lokální `.env`, klíče, certifikáty, runtime média a dokumentace
jsou vyloučené z build contextu.

## Kontroly

```bash
pnpm lint
pnpm test:unit
pnpm test
pnpm typecheck
pnpm generate:types
pnpm build
```

E2E testy se spouštějí přes `pnpm test:e2e`. Icon pipeline nabízí příkazy
`pnpm icons:scan`, `pnpm icons:convert` a `pnpm icons:generate`.

Rozhodnutí, slepé cesty, stav implementace a review jsou v:

- `IMPLEMENTATION_NOTES.md`
- `IMPLEMENTATION_REPORT.md`
- `CODE_REVIEW.md`

## Plánování a evidence práce

Práce na tomto repozitáři se eviduje ve dvou vrstvách, které se nesmí míchat:

- **Repozitář** vlastní proces — implementační plány, backlog, rozhodnutí,
  záznamy slepých cest a validační matice. Vše je v `docs/plans/`, releasový
  plán v `plans/portfolio-production-delivery.md`.
- **Figma** (`Codeguy Portfolio - Final Design`, klíč `cs38WzlXKY9xfDYBinoKel`)
  vlastní výsledný produktový design — obrazovky, komponenty, stavy, prototypy
  a handoff anotace. Implementační plány do Figmy nepatří; pravidlo je
  zapsané v `.agents/skills/figma-product-delivery/SKILL.md`.
- **Linear** vlastní stav a pořadí úkolů. Portfolio má vlastní workspace,
  oddělený od workspace `Codeguys`, kde běží nesouvisející produkt Revesto.

  > Workspace se zakládá; odkaz sem doplnit, jakmile bude vytvořený.

Konvence pro issues přebíráme z dosavadní praxe: české tituly s prefixem role
(`Frontend:`, `Design:`, `QA:`, `EPIC:`) a label `AI-Ready` pro izolované úkoly
s jednoznačnými vstupy, výstupy a validačními kroky versus `Lidská práce` tam,
kde je potřeba produktové, UX nebo architektonické rozhodnutí.

Každé issue odkazuje na svůj plán v `docs/plans/`. Plán je zdroj pravdy pro
zadání a akceptační kritéria, Linear pro stav.

## Produkční provoz

Větev `main` je zdroj produkce. Pull request musí projít kontrolou kvality,
testy a produkčním buildem s browser smoke testem. Po sloučení GitHub Actions
vytvoří neměnný GHCR image a po schválení prostředí `production` ho nasadí na
VPS.

Kompletní provisioning, GitHub nastavení, DNS, rollout, rollback, ověřovací
příkazy a řešení známých chyb jsou v [produkčním runbooku](docs/deployment.md).

Payload administrace a uživatelské API jsou z veřejného Caddy vstupu záměrně
blokované, dokud není přes privátní SSH tunel založen první vlastnický účet.

## Aktuální produkční baseline

První ověřený produkční rollout proběhl 28. července 2026. Veřejné HTTPS,
přesměrování z HTTP a `www`, přesná aplikační revize, databázová readiness a
zdraví všech Compose služeb byly po nasazení ověřeny. Ostatní VPS workloady,
zejména `docling-service`, nejsou součástí tohoto Compose projektu.
