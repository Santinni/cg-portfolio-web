# CodeGuy portfolio web

Technický základ nového webu CodeGuy nad Next.js App Router, TypeScriptem,
Payload CMS a PostgreSQL. Veřejný frontend je rozpracovaný scaffold; finální
vizuální implementace musí navázat na Figma soubor
`Codeguy Portfolio - Final Design`.

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

## Rozsah této změny

Hotový je modernizovaný runtime, redakční základ Insights, public content DTO,
bezpečnostní helpery, základ theme/layout/article komponent a bezpečnější Docker
kontrakt. Nové Figma routy, finální design tokeny, preview/revalidation endpointy
a browser/visual/a11y QA zůstávají navazující prací.
