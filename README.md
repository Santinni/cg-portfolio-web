# CodeGuy portfolio web

Produkční osobní web CodeGuy nad Next.js App Router, TypeScriptem, Payload CMS
a PostgreSQL. Veřejná verze podle návrhu `Codeguy Portfolio - Final Design` je
nasazená na [https://codeguy.cz](https://codeguy.cz). HTTP provoz se automaticky
přesměruje na HTTPS a `www` na hlavní doménu.

## Požadavky

- Node.js 24 LTS (`>=24 <25`)
- pnpm 10.28
- PostgreSQL 15 pro stávající prostředí
- Docker (Docker Desktop) pro lokální databázi
- SSH přístup na VPS, jen pro `pnpm db:pull`

Lokální Node 25 není podporovaný runtime projektu. Příkazy na něm mohou
fungovat, ale vypisují očekávané upozornění na nesplněný engine.

## Lokální spuštění

Lokální vývoj běží proti vlastní databázi v Dockeru (`compose.dev.yaml`), nikdy
proti produkční databázi.

1. Vytvořte `.env` podle šablony `.env.example` a interního deployment
   kontraktu (pro `pnpm dev` stačí `PAYLOAD_SECRET`).
2. Vytvořte `.env.local` (je v `.gitignore`). Next.js ho načte po `.env`,
   takže jeho hodnoty mají přednost:

   ```bash
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=codeguy
   DATABASE_URI=postgres://postgres:postgres@localhost:5432/codeguy

   # pro pnpm db:pull
   DB_PULL_SSH_HOST=<SSH alias VPS z ~/.ssh/config>
   DB_PULL_REMOTE_DIR=/opt/codeguy
   ```

3. Nainstalujte závislosti: `pnpm install --frozen-lockfile`.
4. Naplňte lokální databázi kopií produkce: `pnpm db:pull` (databázi
   v Dockeru sám spustí).
5. Spusťte vývojový server: `pnpm dev`.

Payload administrace je dostupná pod `/admin`. Po `pnpm db:pull` se přihlásíte
stejným účtem jako v produkci. Ukázková data bez přístupu na server popisuje
[docs/seed.md](docs/seed.md). Pozor: `seed.ts` zatím načítá jen `.env`, ne
`.env.local`, takže se s tímto nastavením k lokální databázi nepřipojí.

### Data z produkce (`pnpm db:pull`)

Skript `scripts/database/pull.mjs` zkopíruje produkční databázi a média do
lokálního prostředí. Funguje jen jedním směrem: v produkci přes SSH spouští
pouze čtecí `pg_dump` a `tar`, zapisuje jen do lokální databáze
z `compose.dev.yaml` a do `public/media`.

1. spustí lokální databázi a počká na healthcheck,
2. stáhne dump databáze do `tmp/db-dump/codeguy.dump`,
3. stáhne média do `tmp/db-dump/codeguy-media.tar.gz`,
4. nahraje dump do lokální databáze (`pg_restore --clean`, stará data nahradí),
5. nahradí obsah `public/media` médii z produkce (kromě `img.webp`).

- **Lokální data se přepíšou.** Co vzniklo jen lokálně v adminu, zmizí.
- Soubory v `tmp/db-dump` obsahují celou databázi včetně uživatelů. Jsou
  v `.gitignore` a nikam se nesdílejí.
- Potřebujete SSH přístup na VPS s právem spouštět `docker`.

### Lokální databáze

```bash
docker compose -f compose.dev.yaml up -d      # spuštění
docker compose -f compose.dev.yaml down       # zastavení, data zůstanou
docker compose -f compose.dev.yaml down -v    # smazání lokálních dat
```

Databáze je dostupná jen z tohoto počítače na `127.0.0.1:5432` a používá stejnou
hlavní verzi PostgreSQL (15) jako produkce, aby šly produkční dumpy obnovit.

## Média (uploady Payload CMS)

Složka `public/media` patří výhradně Payloadu: je to `staticDir` kolekce
`Media` (`src/collections/Media.ts`), kam CMS ukládá nahrané obrázky včetně
automaticky generovaných velikostí. Odpovídá to oficiální šabloně Payloadu
`website`.

- Obsah `public/media` je runtime obsah, ne kód, a do gitu se necommituje
  (`.gitignore`). Výjimkou je `img.webp`, zástupný obrázek pro `seed.ts`.
- V produkci je složka Docker volume `media_data`; soubory z gitu se v ní
  neuplatní.
- Statické soubory webu sem nepatří: ikony a loga se generují z
  `src/assets` (viz [Ikony a loga](#ikony-a-loga-svg--react-komponenty)),
  favicony, manifest a CV leží přímo v `public/`.

## Docker

Celý produkční stack (aplikace, PostgreSQL, Caddy) podle `compose.yaml`. Pro
běžný vývoj stačí lokální databáze výše; tento stack slouží k ověření
produkčního image. Používá `.env` s `DB_HOST=database` (název služby v Compose
síti) a obsazuje port 3000 stejně jako `pnpm dev`.

```bash
docker network create edge          # jednou; sdílená síť Caddy a stacku jobs.codeguy.cz
cp .env.caddy.example .env.caddy    # jen pro Caddy; lokálně stačí hash z `caddy hash-password`
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
pnpm format:check
pnpm test:unit
pnpm test
pnpm typecheck
pnpm generate:types
pnpm build
```

E2E testy se spouštějí přes `pnpm test:e2e`. Generování ikon a log popisuje
sekce [Ikony a loga](#ikony-a-loga-svg--react-komponenty).

Rozhodnutí, slepé cesty, stav implementace a review jsou v:

- `IMPLEMENTATION_NOTES.md`
- `IMPLEMENTATION_REPORT.md`
- `CODE_REVIEW.md`

## Ikony a loga (SVG → React komponenty)

SVG soubory se nevkládají do `public/`, ale generují se z nich React komponenty.
O tom, jak se SVG zpracuje, rozhoduje složka, ve které leží:

| Rodina | Zdroj | Výstup | Komponenta | Rozměry |
| --- | --- | --- | --- | --- |
| ikony | `src/assets/icons` | `src/components/icons` | `DownloadIconSvg` | `1em × 1em`, roste s písmem |
| loga | `src/assets/logos` | `src/components/logos` | `EonLogoSvg` | jen `viewBox`, poměr stran zůstane |

Ikony jsou čtvercové a mají sedět k textu. Loga jsou často široká, proto nesmí
dostat čtvercový rámeček a jejich velikost určuje CSS.

### Přidání ikony nebo loga

1. Uložte SVG do `src/assets/icons` nebo `src/assets/logos` (název v kebab-case,
   např. `arrow-right.svg` → `ArrowRightIconSvg`).
2. Spusťte `pnpm icons:generate`.
3. Importujte komponentu z `@/components/icons` nebo `@/components/logos`.

### Co generátor dělá

`pnpm icons:generate` (skript `scripts/iconConverter/icon-converter.cjs`) pro
každou rodinu:

- smaže dříve vygenerované komponenty, takže po přejmenovaném nebo smazaném SVG
  nic nezůstane,
- převede SVG přes SVGR a SVGO:
  - odstraní editorské atributy a metadata (`image-rendering`, `version`, …),
  - odstraní přístupnostní atributy ze zdroje (`role`, `aria-*`, `<title>`),
  - převede všechny barvy na `currentColor`; tvarům bez barvy doplní
    `fill="currentColor"` na kořenovém `<svg>` (ikony s `fill="none"` zůstanou
    obrysové),
  - přidá k `id` předponu podle souboru, aby se `clip-path` dvou SVG na stránce
    nepletly,
  - u log odstraní `width`/`height` a chybějící `viewBox` dopočítá,
- vygeneruje komponentu bez `import * as React` a s `displayName`,
- přepíše `index.ts` rodiny a vše naformátuje Biomem.

### Použití

**Barva** se nastavuje přes CSS `color`, takže funguje ve světlém i tmavém
režimu i v režimu vysokého kontrastu.

**Velikost**: ikona má `1em`, lze ji přebít CSS třídou. Logu nastavte jen výšku,
šířka se dopočítá z `viewBox`. Výšku zadávejte pevně (`rem`, token), ne
procentem obalu, který je široký jako jeho obsah — šířka by vyšla 0.

**Přístupnost**: komponenta je ve výchozím stavu dekorativní (`aria-hidden`),
což je správně u ikony vedle textu. Pokud má grafika nést význam, dejte jí název
až na místě použití (lze ho přeložit):

```tsx
// 1) title → <svg role="img"> s <title>
<EonLogoSvg title="E.ON" />

// 2) obal s názvem, SVG uvnitř zůstane skryté (sekce Worked with)
<span role="img" aria-label="E.ON">
	<EonLogoSvg className={styles.logo} />
</span>
```

### Konfigurace

- `scripts/iconConverter/profiles.cjs` — rodiny a jejich pravidla. Novou rodinu
  (např. ilustrace) přidáte jedním záznamem: zdroj, výstup, přípona, volby SVGR
  a SVGO.
- `scripts/iconConverter/svgr.config.cjs` — nastavení společné pro všechny
  rodiny (šablona komponenty, přístupnost, formátování). Profil vybírá proměnná
  `ICON_PROFILE`, kterou nastavuje generátor.

Konfigurace záměrně neleží v kořeni projektu: kořenový `svgr.config.*` by načetl
i `@svgr/webpack` v `next.config.ts` a změnil SVG importovaná přímo v kódu.

### Pravidla

- Složky `src/components/icons` a `src/components/logos` se ručně neupravují;
  mění se zdrojové SVG a generuje se znovu.
- Zdrojové SVG má být jednobarevné. Vícebarevné logo by převodem na
  `currentColor` přišlo o barvy — pro takové by vznikla samostatná rodina bez
  převodu barev.
- Kontrakt vygenerovaných komponent (výchozí `aria-hidden`, název přes `title`,
  jen `currentColor`, rozměry podle rodiny) hlídá
  `src/__tests__/unit/generated-svg-components.test.tsx`.

## Plánování a evidence práce

Práce na tomto repozitáři se eviduje ve dvou vrstvách, které se nesmí míchat:

- **Repozitář** vlastní proces — živé plány a backlog v `docs/plans/`,
  produktová rozhodnutí v `docs/decisions/`, naměřené audity v `docs/audits/`.
  Doručený plán se maže, ne archivuje (pravidlo v `AGENTS.md`).
- **Figma** (`Codeguy Portfolio - Final Design`, klíč `cs38WzlXKY9xfDYBinoKel`)
  vlastní výsledný produktový design — obrazovky, komponenty, stavy, prototypy
  a handoff anotace. Implementační plány do Figmy nepatří; pravidlo je
  zapsané v `.agents/skills/figma-product-delivery/SKILL.md`.
- **Linear** vlastní stav a pořadí úkolů. Práce na tomto repozitáři žije
  v projektu [Codeguy portfolio web](https://linear.app/codeguys/project/codeguy-portfolio-web-8c2db25da850)
  v týmu `Codeguys`, odděleně od nesouvisejícího produktu Revesto ve stejném
  týmu. Zastřešuje ji
  [COD-75 — EPIC: Post-Launch Portfolio Delivery](https://linear.app/codeguys/issue/COD-75/epic-post-launch-portfolio-delivery).

Konvence pro issues přebíráme z dosavadní praxe: české tituly s prefixem role
(`Frontend:`, `Design:`, `QA:`, `Product:`, `EPIC:`) a label `AI-Ready` pro
izolované úkoly s jednoznačnými vstupy, výstupy a validačními kroky versus
`Lidská práce` tam, kde je potřeba produktové, UX nebo architektonické
rozhodnutí.

Každé issue odkazuje na svůj plán v `docs/plans/`. Plán je zdroj pravdy pro
zadání a akceptační kritéria, Linear pro stav. Issue nese ověřený baseline
včetně konkrétních `soubor:řádek`, aby se zadání nemuselo znovu dohledávat.

Plány je nutné před spuštěním ověřit proti kódu. Část z nich vznikla na stroji,
kde agentovi selhávalo čtení workspace, takže popisovaly kód jen podle Figmy —
jeden plán byl tím pádem už hotový a jiný předepisoval změnu, která by rozbila
funkční chování. Oba nesou opravné hlášení.

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
