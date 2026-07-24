# Code review

Datum: 23.–24. 7. 2026
Větev: `dev`
Rozsah: staged scaffold nového Next.js + Payload webu

## Review proces

Změny prošly třemi nezávislými agentními pohledy (CMS/security,
infrastruktura/dependencies a finální arbitráž). GitHub Copilot CLI 1.0.73 a
Claude Code 2.1.218 byly použité read-only nad sanitizovaným popisem a diffem;
jejich výstup byl brán jako sekundární názor a každý převzatý nález byl lokálně
ověřen.

## Nálezy a vypořádání

| ID | Priorita | Nález | Rozhodnutí / změna | Stav |
|---|---:|---|---|---|
| CR-01 | P1 | Next nesl zranitelné transitive `sharp` a `postcss`; Payload tooling starý `esbuild`. | Přidány cílené pnpm overrides a regenerovaný lockfile. | Opraveno |
| CR-02 | P1 | Chybné backslash/wildcard vzory v `.dockerignore` mohly propustit `.env` a klíče. | Nahrazeno explicitními Docker patterny pro secrets a lokální data. | Opraveno |
| CR-03 | P1 | Plný build prerenderoval legacy `/` a vyžadoval nedostupný hostname `database`. | DB-backed legacy homepage je explicitně `force-dynamic`; plný build nyní prochází. | Opraveno |
| CR-04 | P1 | Media přijímala SVG/neurčené MIME bez pevného file/pixel limitu. | Raster allowlist, 10 MB multipart limit, 40 MP Sharp limit a no-enlarge pravidla. | Opraveno |
| CR-05 | P1 | Klient mohl v dvoukrokovém scénáři vynulovat `firstPublishedAt` a poté změnit slug. | Pole je server-owned, klientské zápisy se zahazují a původní hodnota se obnovuje. | Opraveno |
| CR-06 | P1 | Smazání používaného média mohlo rozbít publikovaný obsah. | `beforeDelete` kontroluje About, Projects, Authors, explicitní Post vztahy i přesné Lexical upload uzly. | Opraveno |
| CR-07 | P2 | Autor mohl podvrhnout vztah na jiný author profil. | Hook vždy vynutí profil spojený s přihlášeným author účtem. | Opraveno |
| CR-08 | P2 | Compose publikoval PostgreSQL port a měl slabý výchozí password. | Host port odstraněn, password povinný, přidán healthcheck a healthy dependency. | Opraveno |
| CR-09 | P2 | Node engine sliboval runtime, na kterém přímé TS testy nejsou spolehlivým kontraktem. | Projekt připnutý na Node 24 LTS; Docker i dokumentace kontrakt sjednocují. | Opraveno |
| CR-10 | P2 | README a implementační záznam obsahovaly zastaralý build stav; `README.md.bak` duplikoval legacy návod. | Dokumentace aktualizována, záloha odstraněna, review ledger přidán. | Opraveno |
| CR-11 | P3 | `CodeBlock` odkazoval na chybějící visually-hidden CSS utility. | Doplněn standardní screen-reader-only styl. | Opraveno |
| CR-12 | P2 (Copilot + follow-up arbiter) | Copilot chybně navrhl sbírat všechny stringy; arbiter nález zpřesnil na vynechaná textová pole custom Lexical bloků. | Přidán explicitní allowlist `callout.title/body` a `codeBlock.source` plus regresní test reálně serializovaných block nodes. | Opraveno |

## Důležitá review rozhodnutí

- `content contains "<id>"` nebylo přijato pro ochranu mazání médií: vytvářelo
  by false positives na obyčejný text. Použit je přesný průchod Lexical upload
  uzlů.
- Compile-only Next build nebyl přijat jako release gate. Ověřuje se plný
  `next build`.
- PostgreSQL 15 nebyl mechanicky změněn na major 18 nad existujícím volume.
  Taková změna vyžaduje samostatný migrační a rollback plán.
- TypeScript 7 a ESLint 10 nebyly přijaty pouze proto, že jsou registry latest;
  současné peer ranges Next tooling řetězce je ještě nepodporují.
- Přítomnost frontend scaffold komponent není vydávána za shodu s Figmou.
  Browser, a11y a visual regression jsou odložené, protože nové Figma routy
  zatím nejsou implementované.

## Externí CLI follow-up

- Copilot CLI provedl read-only průchod staged diffem s nástroji omezenými na
  příkazy `git`. Jeho široký návrh sbírat všechny stringy byl zamítnut, ale
  follow-up arbiter odhalil užší validní variantu pro custom Lexical bloky.
  CR-12 byl následně opraven explicitním allowlistem.
- Claude CLI byl spuštěný read-only bez možnosti editace a sítě. Ani po více
  než třech minutách nevydal výstup; ukončen byl pouze identifikovaný proces
  tohoto review. Claude proto není uváděný jako schvalující reviewer.
- Copilotova poznámka, že Node `--test` není dostupný, neodpovídá realitě:
  stejný unit suite prošel lokálně i přímo v Node 24.18.0 builder image.

## Ověření

Finální přesné výsledky jsou doplněné po posledním validačním běhu v
`IMPLEMENTATION_REPORT.md`. Review se považuje za uzavřené pouze tehdy, pokud
po opravách projdou lint, unit testy, typecheck, Payload type generation, plný
build, Docker/Compose statické kontroly a diff hygiene.
