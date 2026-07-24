# Implementační záznam

Tento soubor průběžně zachycuje rozhodnutí, ověřené postupy, slepé cesty a
otevřené validační mezery při převodu finálního designového handoffu do
Next.js + Payload aplikace.

## Potvrzený směr

- Cílový projekt je `cg-portfolio-web`, nikoli paralelní historické varianty
  `cg-web` nebo `cg-web1`.
- Veřejný web a Payload 3 zůstávají v jedné Next.js App Router aplikaci.
- PostgreSQL je Payload databáze; produkční média patří do objektového úložiště.
- Server Components jsou výchozí. Client Components jsou pouze skutečně
  interaktivní prvky (theme, menu, share, copy, TOC disclosure).
- Články používají kolekce `posts`, `topics`, `authors`, `media` a
  autentizované `users`.
- Role jsou `admin`, `publisher`, `editor`, `author`; publish/unpublish
  je omezen na publisher/admin.
- Vzhled komponent se váže na semantic tokeny. Legacy tokeny zůstávají dočasně
  jako aliasy, aby migrace nerozbila existující portfolio stránky.

## Slepé cesty a čemu se vyhnout

### 1. Opakování běžných shellů při chybě helperu

**Slepá cesta:** opakované pokusy přes `pwsh`, Windows PowerShell, `cmd.exe`
a Node REPL. Všechny končily ještě před startem procesu:

```text
helper_unknown_error: setup refresh had errors
```

**Proč:** chyba je v Codex Windows sandbox helperu, ne v konkrétním shellu,
Node, Claude CLI ani Copilot CLI.

**Správně:** po prvním potvrzení stejné chyby nepřepínat další shelly.
Pro read-only a validační příkazy použít explicitní Windows PowerShell 5.1 s
řízeným `require_escalated`. Každou eskalaci držet úzce na konkrétní příkaz.

### 2. Předpoklad, že apply_patch aktualizuje existující soubory

**Slepá cesta:** opakované `apply_patch Update File` na existující i nově
vytvořené soubory. Helper nedokázal soubor načíst a patch odmítl.

**Proč:** stejný sandbox helper selhává při preflight čtení cílového souboru.
`Add File` fungoval, protože nevyžadoval načtení existujícího obsahu.

**Správně:** nové soubory zakládat přes `apply_patch Add File`. Změny
existujících souborů připravovat jako minimální unified diff, nejdříve spustit
`git apply --check` a až potom `git apply`. Hunk musí obsahovat kontext za
poslední změnou; bez trailing contextu se i jinak správný patch na Windows
nemusí aplikovat.

### 3. Posílání patchu interaktivně na stdin v PTY

**Slepá cesta:** spuštění `git apply -` v PTY a následné posílání diffu přes
stdin. Windows PTY nepředal běžné Unix EOF (`Ctrl-D`) a proces zůstal čekat.

**Správně:** nevytvářet interaktivní `git apply -` session. Použít předem
vytvořený patch soubor, `git apply --check` a neinteraktivní `git apply`.

### 4. Unified diff bez úplného kontextu

**Slepá cesta:** hunks s deklarovaným počtem více řádků, než patch skutečně
obsahoval, nebo hunks končící bez následného context řádku.

**Důsledek:** `corrupt patch` nebo `patch does not apply`, přestože měněný
řádek vizuálně souhlasil.

**Správně:** používat přesné hunk counts nebo `git apply --recount`, ale vždy
zahrnout alespoň jeden nezměněný řádek před a za změnou. Před zápisem vždy
`git apply --check`.

### 5. Důvěra v dílčí typecheck před Payload type generation

**Slepá cesta:** vyhodnocovat relationship slug chyby (`posts`, `topics`,
`authors`) dříve, než byly kolekce zapojené v `payload.config.ts` a
regenerované `payload-types.ts`.

**Správně:** pořadí pro schema změnu je:

1. kolekce a access helpery,
2. wiring v `payload.config.ts`,
3. `pnpm generate:types`,
4. úzké unit testy,
5. `pnpm typecheck`,
6. produkční build.

### 6. Extensionless importy v přímém Node TypeScript testu

**Slepá cesta:** odstranit `.ts` přípony kvůli TypeScript compileru, zatímco
test běží přímo přes Node ESM type stripping.

**Správně:** u přímého `node --test` zachovat explicitní `.ts` přípony a
testovací soubor vyjmout z běžné TS diagnostiky cíleným `@ts-nocheck`, dokud
projekt nezavede runner s TypeScript resolverem (např. Vitest).

### 7. Bezpečnostní mezera při přechodu publish stavu

**Slepá cesta:** kontrolovat změnu stavu výrazem, který vyžadoval existující
`previousStatus`. Autor by tím mohl vytvořit dokument rovnou jako published.

**Správně:** změnu posuzovat jako
`nextStatus !== undefined && previousStatus !== nextStatus` a publish pole
hlídat serverovým hookem, ne pouze viditelností v admin UI.

### 8. Stabilní slug jen během aktuálního published stavu

**Slepá cesta:** blokovat změnu slugu pouze tehdy, když je dokument právě
published. Po unpublish by šel slug změnit bez redirect kontraktu.

**Správně:** při prvním publikování uložit `firstPublishedAt` a stabilitu
slugu odvozovat z této trvalé stopy, nikoli pouze z aktuálního `_status`.

### 9. Nekritické přijetí pořadí z externího CLI

**Slepá cesta:** Copilot navrhl metadata před Payload datovým modelem a veškeré
QA až na konec.

**Správně:** externí CLI používat jako druhý názor, ne jako source of truth.
Dynamická metadata, preview a revalidace musí navazovat na stabilní schema a
content reads. Testy a accessibility checks vznikají průběžně.

### 10. Odesílání lokálních handoff dokumentů externímu CLI

**Slepá cesta:** pokus nechat Claude CLI načíst celé lokální handoff dokumenty
byl správně zastaven bezpečnostní vrstvou kvůli externímu přenosu obsahu.

**Správně:** externím modelům posílat pouze uživatelem poskytnuté nebo výslovně
schválené shrnutí, bez secrets a bez přístupu k nástrojům. Claude a Copilot
prompty zde běžely read-only, bez persistence a bez zápisu do workspace.

### 11. Postupná oprava legacy UI místo nového frontendu

**Slepá cesta:** původní strategie počítala s postupnou migrací stávajících
portfolio obrazovek a zachováním jejich vzhledu přes legacy token aliases.

**Proč je to špatně:** uživatel potvrdil, že `Codeguy Portfolio - Final
Design` je kompletní nový návrh celého webu. Staré UI není visual source of
truth a jeho lokální opravy by vytvářely přechodný systém, který se následně
stejně zahodí.

**Správně:** v `cg-portfolio-web` zachovat technickou infrastrukturu,
deployment a Payload základ, ale frontend postavit jako nový route/component
strom podle finální Figmy. Legacy routy jsou pouze zdroj obsahu nebo dočasná
fallback implementace, nikoli designový základ.

### 12. Bezhlavé `pnpm up --latest` bez peer compatibility gate

**Slepá cesta:** registry `latest` přineslo TypeScript 7.0.2 a ESLint 10.7.0,
které aktuální `typescript-eslint` a pluginy v `eslint-config-next` ještě
nepodporují.

**Správně:** framework a CMS aktualizovat na nejnovější vzájemně podporovaný
stack (Next 16.2.11, Payload 3.86.0, React 19.2.8). Tooling držet na nejnovější
kompatibilní řadě (TypeScript 6.0.3, ESLint 9.39.5), dokud peer ranges
nepotvrdí podporu nového majoru.

### 13. Legacy FlatCompat s Next 16 flat configem

**Slepá cesta:** starý `FlatCompat.extends("next/core-web-vitals")` načítal
nový flat config jako legacy config a ESLint skončil chybou circular JSON.

**Správně:** importovat `eslint-config-next/core-web-vitals` a
`eslint-config-next/typescript` přímo a jejich pole rozbalit do
`defineConfig`.

### 14. Compile-only build vydávaný za produkční build

**Slepá cesta:** script `next build --experimental-build-mode compile`
ověřil pouze kompilaci a skryl chyby při prerenderu.

**Správně:** `pnpm build` musí spouštět plný `next build`. Compile-only
může existovat jen jako explicitně pojmenovaný diagnostický script.

### 15. Build závislý na Docker hostname bez spuštěné databáze

**Pozorování:** plný Next 16 build prošel kompilací i TypeScriptem, ale
prerender `/` selhal na `getaddrinfo ENOTFOUND database`, protože lokální
`.env` používá hostname dostupný pouze uvnitř Compose sítě.

**Správně:** CI/build gate musí mít explicitní test Postgres, nebo nové routy
musí mít vědomě zvolený dynamický/ISR režim, který nevyžaduje nedostupnou DB
během build fáze. Compile-only režim není náhrada.

### 16. Secrets vložené přes `next.config env`

**Slepá cesta:** `PAYLOAD_SECRET` a `DATABASE_URI` byly uvedené v
`next.config.ts -> env`, což může hodnoty vložit do bundle.

**Správně:** serverové secrets číst pouze z `process.env` v server-only
modulech. Do klienta patří jen výslovně veřejné `NEXT_PUBLIC_*` hodnoty.
Wildcard CORS na celém Payload API byl také odstraněn; výchozí je same-origin.

### 17. EOL lokální runtime a zastaralý Docker toolchain

**Pozorování:** lokální terminál používá Node 25.3.0, jehož řada je již EOL,
zatímco původní Dockerfile používal ještě starší Node 20.9.0 a pnpm 9.12.0.
Samotný úspěšný lokální typecheck tedy nepotvrzuje podporovaný produkční runtime.

**Správně:** produkční image je připnutý na aktuální LTS Node 24.18.0 a pnpm
10.28.0. Lokální Node je vhodné přepnout na řadu 24 LTS; změna globálního
runtime ale není součástí repozitářového zásahu a nesmí se dělat skrytě.

PostgreSQL 15 zůstává dočasně zachovaný: je stále podporovaný a major upgrade
existujícího volume na PostgreSQL 18 není běžná aktualizace knihovny. Vyžaduje
samostatný export/import nebo `pg_upgrade`, ověření rozšíření a rollback plán.
Pro nový prázdný deployment lze PostgreSQL 18 zvolit před prvním produkčním
nasazením, ale image se nesmí jen přepsat nad existujícím `db_data` volume.

### 18. Compile-time typ není runtime redakce dat

**Slepá cesta:** považovat `Pick<Media, ...>` za odstranění neveřejných polí.
TypeScript mění pouze statický kontrakt; původní objekt stále obsahuje například
`uploadedBy`, timestamps a další interní data.

**Správně:** veřejné DTO sestavovat explicitními runtime mappery včetně nested
media, autora a meta image. Unresolved relationship ID ani draft objekt se nesmí
automaticky považovat za veřejný related článek.

**Slepá cesta:** odvozovat singular cache tag odebráním posledního znaku názvu
kolekce. Pro `media` tak vzniklo chybné `medi:<id>`.

**Správně:** používat explicitní allowlist mapu `authors -> author`, `media ->
media`, `posts -> post`, `topics -> topic` a testovat každou nepravidelnost.

**Slepá cesta:** catch-all kolem CMS readu, který převádí výpadek DB či chybu
oprávnění na zdánlivé 404.

**Správně:** pro veřejný lookup použít bounded `find`, vracet `null` pouze při
skutečné absenci dokumentu a provozní nebo oprávňovací chyby nechat propagovat.

### 19. Textové hledání ID při ochraně mediálních referencí

**Slepá cesta:** hledat media ID přes obecné `content contains "17"`. Stejné
číslo se může objevit v běžném textu a zablokovat legitimní smazání.

**Správně:** explicitní relationship fields porovnat jako ID a Lexical strom
rekurzivně projít pouze pro uzly `type=upload`, `relationTo=media`.

### 20. Pouhý MIME allowlist bez resource limitů

**Slepá cesta:** povolit raster formáty, ale neomezit multipart velikost ani
počet vstupních pixelů. Komprimovaný obrázek může stále vyčerpat paměť.

**Správně:** kombinovat MIME allowlist, časný 10 MB multipart limit, 40 MP
Sharp limit a `withoutEnlargement`.

### 21. Runtime Docker image jako kopie celého builderu

**Slepá cesta:** kopírovat celé `.next`, `node_modules` a spouštět proces jako
root přes package manager.

**Správně:** použít Next standalone výstup, kopírovat jen standalone/static/
public, nastavit vlastnictví souborů a spouštět `node server.js` jako `node`.

## Ověřené CLI prostředí

- Claude Code: `2.1.218`, autentizace přes `claude.ai`; použit jen bezpečný
  read-only prompt nad uživatelským shrnutím.
- GitHub Copilot CLI: `1.0.73`; `gh` CLI není nainstalované. Read-only prompt
  proběhl bez tools/MCP a bez změn workspace.

## Průběžný validační stav

- `pnpm install --frozen-lockfile`, lint, typecheck a Payload type generation:
  prošly po finálních review opravách.
- Unit testy: 17/17 prošlo.
- Plný `pnpm build`: prošel; legacy DB homepage je vědomě dynamická.
- Dockerfile a Compose statické kontroly i Node 24 image build prošly.
- Playwright, axe a visual regression nebyly spouštěné, protože nový Figma
  frontend a cílové routy nejsou v tomto scaffoldu implementované.
- Přesná Figma visual shoda je neověřitelná bez konkrétního node URL/exportu;
  v repozitáři žádný odkaz nalezen nebyl.

## Další správný postup

1. Dokončit theme/navigation wiring a spustit fresh typecheck.
2. Dokončit Insights listing/detail nad typovanou serverovou content vrstvou.
3. Přidat metadata/JSON-LD/OG, secure preview a allowlist revalidation tags.
4. Zavést repo-native test runner a Playwright/axe/visual matrix.
5. Ověřit 320, 390, 768, 1024 a 1440 px, light/dark, keyboard, reduced motion
   a dlouhý český obsah.
