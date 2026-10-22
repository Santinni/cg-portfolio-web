# Deploy, který po sobě uklízí: retence image, limity stacku, denní záloha

Status: `open` — v2 po revizi (Opus subagent: 2 blokující, 8 should-fix,
11 poznámek; Codex: 1 nález, pak vyčerpaná kvóta). Implementace není
autorizována do výslovného schválení Karlem.
Date: 2026-10-22

Branch: `fix/deploy-image-retention` (z `dev` 4efecc2). Po dodání se tento plán
maže; rozhodnutí přejdou do `docs/decisions/production-operations.md`, naměřený
stav „před" do `docs/audits/2026-10-22-vps-stack-baseline.md` v témže PR
(„move first, delete second"), stav „po" do navazujícího docs PR.

## Problém

Deploy v `.github/workflows/ci.yml` končí krokem
`docker image prune --force --filter "until=168h"`. Ten maže jen dangling
(netagované) vrstvy. Každý deploy stáhne nový tag
`ghcr.io/santinni/cg-portfolio-web:<sha>` (~515 MB) a žádný krok starý tag
neodstraní, takže otagované image na serveru zůstávají navždy. K tomu stack nemá
žádné provozní limity (paměť, procesy, velikost logů) a jedinou zálohou jsou
předdeploy dumpy databáze.

## Stav serveru (read-only SSH `codeguy-karel`, 2026-10-22 odpoledne)

Sdílený Hetzner VPS, 2 vCPU, 3 819 MB RAM, bez swapu, disk 38 GB / 77 % obsazeno
(8,3 GB volných). Na hostiteli běží kromě portfolia stack cztechjobs
(`/opt/cztechjobs`), zatím i `docling-service` a systemd služba OpenClaw; jejich
úklid je připravený v `deploy/server-housekeeping.sh` v repu cztechjobs a dělá ho
Karel sám.

| Co | Naměřeno |
|---|---|
| Tagy `cg-portfolio-web` na disku | 9 (28. 7. až 8. 10. 2026), 507–515 MB každý podle `docker images`; sdílejí base vrstvy, reálně uvolnitelný prostor určí až `docker system df` |
| Běžící tag | `ee003d98…` (`codeguy-app-1`, healthy 2 týdny) |
| `codeguy-app-1` | 387 MB RSS, limit 3,73 GiB (= celá RAM), 20 PID; špička z inventury 618 MB |
| `codeguy-database-1` | 27 MB RSS, bez limitu, 7 PID |
| `codeguy-caddy-1` | 18 MB RSS, bez limitu, 11 PID |
| cztechjobs | `api` 13 MB / limit 640 MiB, `db` 65 MB / limit 512 MiB |
| V8 heap limit v `app` | 2 102 MB (`v8.getHeapStatistics().heap_size_limit`; 2 048 MB strop V8 + young generation, žádný cgroup limit) |
| Logy kontejnerů | json-file bez `max-size`; velikost souborů pod `/var/lib/docker` bez sudo nejde přečíst |
| Média (`codeguy_media_data`) | 516 kB, 12 souborů |
| `/opt/codeguy/backups` | 8× `predeploy-<sha>.dump`, 100–124 kB každý, žádný denní dump |
| Crontab `karel` | jen `17 3 * * * /opt/cztechjobs/backup.sh` |
| Docker / Compose | 29.6.0 / 5.1.4 |

Tahle tabulka jde do `docs/audits/2026-10-22-vps-stack-baseline.md` jako
dokument „před" (spolu s `docker system df`, které Karel doplní, viz Ověření).

## Zjištění o deploy skriptu, na kterém plán stojí

`appleboy/ssh-action@v1` vstup `script_stop` **nemá**. Run z 8. 10. 2026 hlásí
`##[warning]Unexpected input(s) 'script_stop'`, `action.yml` v1 nastavuje jen
vyjmenované `INPUT_*` proměnné a `INPUT_SCRIPT_STOP` mezi nimi není, takže
drone-ssh 1.8.2 běží s `ScriptStop=false` a **nevkládá** za každý řádek kontrolu
`DRONE_SSH_PREV_COMMAND_EXIT_CODE`. Chování skriptu řídí výhradně jeho vlastní
`set -eu`. Důsledky:

- víceřádkové konstrukce (`case`, funkce, `if`) jsou bezpečné; kdyby
  `script_stop` fungoval, vložený řádek uprostřed `case` by byl syntaktická
  chyba (nález Opus B1) a `printf | grep` na konci `check_revision` by při
  neshodě revize ukončil skript místo návratu do `if ! …; then rollback`
  (nález B2);
- PR odstraní mrtvý `script_stop: true`, aby nikdo příště nestavěl na chování,
  které neexistuje; `set -eu` zůstává (README v1: „to mimic the removed
  script_stop option, add set -e");
- pod `set -e` má funkce volaná v podmínce `if !` vypnuté `-e`, takže neshoda
  `grep` správně vrací 1 a rollback běží.

## Rozsah

Jeden PR do `dev` (`fix/deploy-image-retention`) se čtyřmi částmi. Záloha
(část 3) přidává jeden skript, dva řádky v scp/preflight a jeden `install`
v deploy kroku; samostatný PR by nic nezjednodušil, takže zůstává v tomto.

Mimo rozsah, výslovně:

- jednorázový úklid 7 starých tagů, které na serveru už jsou (krok `images`
  housekeeping skriptu cztechjobs, spouští Karel);
- cokoliv mimo `/opt/codeguy` a image `ghcr.io/santinni/cg-portfolio-web`:
  nikdy `docker image prune -a`, nikdy `docker system prune`;
- záloha mimo hostitele (off-host); zůstává otevřená, viz PO-04;
- swap, journald, docling, OpenClaw (housekeeping cztechjobs);
- hardening rootfs `app` (`read_only`, `cap_drop`) jako u cztechjobs:
  samostatná práce s vlastním měřením;
- `docker logout ghcr.io` v deployi sahá na sdílený `~/.docker/config.json`
  (cztechjobs to obchází izolovaným `DOCKER_CONFIG`); jen poznámka pod PO-01,
  oprava je další PR.

## Část 1 — retence image v deploy kroku `ci.yml`

### Chráněná množina

Tři hodnoty, všechny přečtené **před** deployem:

- `APP_IMAGE` — nově nasazený tag;
- `previous_image` — image běžícího kontejneru `app` (stávající logika,
  `docker compose ps -q app`, tj. jen **běžící** kontejner);
- `persisted_image` — hodnota `APP_IMAGE=` z `/opt/codeguy/.env` před
  deployem. Nově: když `app` zrovna neběží (pád, ruční stop), je
  `previous_image` prázdný a bez téhle hodnoty by retence smazala poslední
  dobrý tag, na který `.env` ukazuje (nález Opus S3). Čte se stejně, jak to
  dělá `persist_image` v opačném směru:
  `persisted_image="$(sed -n 's/^APP_IMAGE=//p' .env | tail -n 1)"`.

Rollback logika se nemění (dál používá `previous_image`); `persisted_image` je
jen ochrana před smazáním.

### Umístění

V úspěšné větvi, až po `persist_image "$APP_IMAGE"` a po průchodu veřejné
kontroly `https://codeguy.cz/api/health?revision=…`, před sondou
`jobs.codeguy.cz/ready`. Obě rollback větve (`rollback` + `exit 1`) leží před
ním, takže se k němu nikdy nedostanou.

```sh
# Keep only this project's deployed tag and the rollback tags. Named `docker image rm`,
# never prune: the host is shared and cztechjobs keeps its own previous tag on disk.
image_repo="${{ needs.build.outputs.image_name }}"
if image_refs="$(docker image ls --format '{{.Repository}}:{{.Tag}}' "$image_repo")"; then
  printf '%s\n' "$image_refs" | while read -r ref; do
    [ -n "$ref" ] || continue
    case "$ref" in
      "$APP_IMAGE"|"$previous_image"|"$persisted_image"|*:"<none>") continue ;;
    esac
    if docker image rm "$ref" >/dev/null 2>&1; then
      echo "removed old image tag $ref"
    else
      echo "::warning::could not remove image tag $ref (still in use?); left on disk"
    fi
  done
else
  echo "::warning::could not list $image_repo images; retention skipped"
fi
```

Vlastnosti:

- `docker image ls <repo>` vypisuje jen tagy tohoto jednoho repozitáře.
- Selhání samotného `docker image ls` není tiché: warning a přeskočení
  (nález S8); bez toho by prázdná smyčka skončila 0 beze slova.
- Bez `-f`: Docker odmítne smazat tag, který ještě používá kontejner; takový
  případ skončí warningem, ne pádem (`rm` je uvnitř `if`, `set -e` se ho
  nedotkne).
- První deploy: `previous_image` i `persisted_image` prázdné; prázdný pattern
  v `case` nic neodchytí, smažou se všechny tagy kromě nasazeného.
- Opakovaný deploy téhož SHA: `previous_image == APP_IMAGE`, takže starší
  skutečný rollback tag se smaže a zůstane jeden tag. Přijatelné: GHCR ho drží,
  a rollback na „stejné SHA" je stejně no-op (nález N1, výslovně).
- Tag `latest` se na server nikdy nestahuje (`compose pull` bere jen
  `$APP_IMAGE`). Kdyby tam někdo ručně pullnul, krok ho odstraní.
- `*:"<none>"`: Docker 29 s containerd image store stále tiskne `<none>` pro
  netagované; na hostu neověřeno, pattern je neškodný i kdyby nikdy nepadl.
- Stávající `docker image prune --force --filter "until=168h"` zůstává jako
  poslední příkaz na dangling vrstvy. Rozhodnutí cztechjobs (plán 08, bod 4)
  s tím počítá: jeho rollback tag je otagovaný, a tedy v bezpečí.
- První běh po merge nechá na serveru přesně dva tagy (nový a `ee003d98…`) i
  bez ručního úklidu. Housekeeping krok `images` dává smysl spustit **před**
  merge, aby šlo „před/po" připsat čistě tomuto kroku.

## Část 2 — limity v `compose.yaml`

Rozpočet RAM (3 819 MB) po úklidu doclingu a OpenClaw, kde dockerd + containerd
+ shimy ~160 MB, fail2ban 60 MB, sshd/journald/jádro do ~150 MB:

| Služba | `mem_limit` | Proč |
|---|---|---|
| cztechjobs `api` | 640m (existuje) | |
| cztechjobs `db` | 512m (existuje) | |
| portfolio `app` | **1g** | špička 618 MB RSS, z toho část off-heap (sharp/libvips); 1 GB = 1,65× špička, 2,6× ustálený stav; healthcheck spouští každých 10 s další proces `node -e`, který se do cgroupu počítá také |
| portfolio `database` | **512m** | 27 MB dnes; shodné s cztechjobs `db`; Postgres 15 default `shared_buffers` 128 MB; `shm_size` tmpfs se do limitu počítá |
| portfolio `caddy` | **256m** | 18 MB dnes; Caddy je jediný vstup pro oba weby, limit je 14× rezerva |
| součet stropů | 2 944 MB | zbývá ~875 MB hostiteli; dnes (s doclingem) stropy přesahují, ale jsou to stropy, ne rezervace |

Další hodnoty:

| Služba | Klíč | Hodnota | Proč |
|---|---|---|---|
| `app` | `cpus` | `"1.5"` | 2 vCPU host; s `cpus: 1.0` cztechjobs `api` dávají stropy 2,5 na 2 jádra, což je v pořádku (stropy, ne rezervace); smysl je, aby build-time špička Nextu (ISR, sharp) nikdy nevzala obě jádra Caddy |
| `app` | `pids_limit` | `256` | dnes 20 PID; `init: true` (tini) + node + healthcheck |
| `app` | `stop_grace_period` | `30s` | Next zavírá spojení; default 10s |
| `app` | `logging` | json-file, `max-size: "10m"`, `max-file: "5"` | 50 MB strop |
| `database` | `pids_limit` | `256` | `max_connections` 100 + ~10 background procesů |
| `database` | `shm_size` | `128m` | Docker default `/dev/shm` 64 MB; paralelní dotazy Postgresu ho používají; stejné jako cztechjobs |
| `database` | `stop_grace_period` | `60s` | čistý shutdown Postgresu trvá déle než default 10s (stejné jako cztechjobs) |
| `database` | `logging` | json-file, `10m` × `3` | |
| `caddy` | `pids_limit` | `256` | |
| `caddy` | `logging` | json-file, `10m` × `5` | access log obou webů jde na stdout (`Caddyfile` řádky 48, 134) |

Co se **nenastavuje** a proč:

- `cpus` pro `database` a `caddy`: Caddy obsluhuje i `jobs.codeguy.cz`, strop by
  škrtil cztechjobs; Postgres při 27 MB a nulovém CPU nemá co omezovat.
- `memswap_limit`: swap dnes není. Až ho Karel přidá (housekeeping `swap`,
  2 GB), kontejner s `mem_limit` a bez `memswap_limit` smí použít swap až do
  výše `mem_limit` navíc; to je záměrná rezerva (zpomalení místo OOM kill).
- `NODE_OPTIONS=--max-old-space-size`: Node 24 předává
  `uv_get_constrained_memory()` (cgroup v2 `memory.max`) do
  `ResourceConstraints::ConfigureDefaults`; V8 z toho odvodí old generation
  ≈ polovina limitu, tedy pod `mem_limit: 1g` **očekávaně 530–560 MB**
  `heap_size_limit` a ~450 MB pro nativní paměť (sharp, buffery, kód,
  healthcheck proces). To je pro tuhle aplikaci lepší poměr než ruční hodnota.
  **Gate před merge** (nález S4): změřit s přesným runtimem
  `docker run --rm -m 1g node:24.18.0-slim node -e
  "console.log(require('v8').getHeapStatistics().heap_size_limit/1048576)"`
  (lokální Docker Desktop teď neběží; měření proběhne před otevřením PR a
  číslo se zapíše do baseline auditu a do PO-03). Pod 400 MB se do
  `compose.yaml` přidá `environment: NODE_OPTIONS: --max-old-space-size=640`
  rovnou v tomto PR, ne později.

Všechny klíče jsou standardní atributy Compose specifikace mimo swarm, které
cztechjobs používá na stejném hostiteli se stejným Compose 5.1.4 (`docker
stats` tam limity ukazuje). Lokální `docker compose up` s `compose.yaml` je
dostane také; na Docker Desktop jsou neškodné. `compose.e2e.yaml` se nemění.

Validace v CI zůstává: deploy krok `docker compose … config --quiet` i Caddy
validace běží proti nastaveném `compose.yaml` před výměnou aktivních souborů.
Lokálně před commitem: `docker compose --env-file .env.production.example
-f compose.yaml config --quiet` (s dočasnou `DB_PASSWORD`).

**Recreate všech tří kontejnerů** (nález S6): limity jsou vlastnost kontejneru,
ne image, takže tento deploy znovu vytvoří i `database` a `caddy`, ne jen
`app`. Výpadek `codeguy.cz` je tedy delší než obvyklé sekundy: zhruba start
Postgresu + `start_period` aplikace (20–40 s); `jobs.codeguy.cz` blikne jen
po dobu recreate Caddy. Totéž při případném rollbacku na starý `compose.yaml`.
Data kryje předdeploy dump. Deploy naplánovat mimo špičku.

## Část 3 — denní záloha

Nový soubor `deploy/backup.sh` (POSIX sh, vzor cztechjobs `deploy/backup.sh`):

- `cd "$(dirname "$0")"`, `umask 077`, `backups/` 0700.
- Databáze: `docker compose exec -T database sh -c 'PGPASSWORD=… pg_dump
  --username=… --dbname=… --format=custom'` → `backups/daily-<UTC ts>.dump`
  přes `.partial` a `mv`, prázdný výstup = chyba, předchozí zálohy nedotčené.
- Média: `docker compose exec -T app tar -C /app/public/media -czf - .`
  → `backups/media-<UTC ts>.tar.gz`. **Jediný příkaz, žádná roura přes
  `gzip` na hostu**: POSIX `sh` vrací exit kód posledního článku roury, takže
  `… | gzip` by selhání `exec`/`tar` zamaskovalo platným ~20bajtovým archivem,
  který projde i `test -s` (nálezy Codex a Opus S1). Kontrola: exit kód
  `exec`, `test -s`, `gzip -t "$partial"`, teprve pak `mv`. `tar` i `gzip`
  jsou v Debianu essential, `node:24-slim` je má; běží jako `node`, kterému
  `Dockerfile` adresář `/app/public/media` chownuje a Payload do něj píše.
  Skript nepotřebuje žádný další image a nesahá mimo projekt `codeguy`.
- Rotace: `find … -mtime +13` pro `daily-*.dump` a `media-*.tar.gz` (stejně
  jako cztechjobs; výsledek je 14 denních záloh); `predeploy-*.dump` jen 10
  nejnovějších (dnes 8, deploy je nikdy nemaže).
- Log řádky `<UTC ts> backup: …` do `backups/backup.log` (cron ho appenduje).
- Když stack neběží nebo zrovna probíhá deploy, `exec` selže, skript skončí 1
  s důvodem v logu; nic se nemaže.
- Compose kontext z cronu: `cd /opt/codeguy`, `.env` tam je projektový env
  (`COMPOSE_PROJECT_NAME=codeguy`, `APP_IMAGE=` zapsaný deployem),
  `env_file` v `compose.yaml` mají defaulty `./.env` a `./.env.caddy`, crontab
  má `PATH=/usr/local/bin:/usr/bin:/bin` (docker je `/usr/bin/docker`).
- Dumpy obsahují Payload účty (hash hesla) a redakční obsah: 0600, a kopie
  mimo hostitele se musí šifrovat (`age`/`gpg`) — do dokumentace.

Nasazení skriptu deployem:

- scp `source: compose.yaml,Caddyfile,deploy/backup.sh`; bez
  `strip_components` zůstává relativní cesta, tedy
  `$release_path/deploy/backup.sh` (cztechjobs preflight to potvrzuje).
- preflight `test -f "$release_path/deploy/backup.sh"`.
- `install -m 0755 "$release_path/deploy/backup.sh" backup.sh` **až po
  `persist_image` a veřejné kontrole, nefatálně** (`|| echo "::warning::…"`),
  nikoli vedle `install … compose.yaml` (nález S2): tam by chyba (třeba
  root-owned `backup.sh` po ručním sudo testu) shodila skript pod `set -e`
  s novým `compose.yaml` na disku, starými kontejnery a bez rollbacku. Bez
  `.rollback` kopie: skript nemá vliv na běžící stack a názvy služeb
  `app`/`database` jsou stabilní.
- Po instalaci warning (ne chyba), když `crontab -l` ani `/etc/crontab`,
  `/etc/cron.d` neobsahují **`/opt/codeguy/backup.sh`** (celá cesta,
  nález N5) — vzor cztechjobs krok 11. `mkdir -p backups` deploy už dělá, takže
  cron redirect do `backups/backup.log` má kam psát (N4).
- `quality` job v CI: krok `shellcheck deploy/backup.sh` (ubuntu-latest ho má).

Cron instaluje Karel ručně (přesné kroky v `docs/deployment.md`):

```bash
( crontab -l 2>/dev/null; echo '47 3 * * * /opt/codeguy/backup.sh >> /opt/codeguy/backups/backup.log 2>&1' ) | crontab -
```

Čas 03:47, půl hodiny po záloze cztechjobs (03:17), aby oba `pg_dump` neběžely
najednou na 2 vCPU. První ověření ručně: `/opt/codeguy/backup.sh && ls -la
/opt/codeguy/backups`.

Obnova (do dokumentace): `pg_restore --clean --if-exists` přes `docker compose
exec -T database` a `tar -xzf` do `/app/public/media` přes `app`; ručně,
nikdy automaticky z deploye (platí stávající rozhodnutí z `deployment.md`).

## Část 4 — dokumentace

- `docs/audits/2026-10-22-vps-stack-baseline.md` (nový, v tomto PR): tabulka
  „Stav serveru" výše + naměřený heap limit pod 1 GiB + `docker system df`
  před úklidem (nález S5). Hodnoty „po" doplní navazující docs PR.
- `docs/deployment.md`:
  - nová sekce **Shared host**: co dalšího na VPS běží, zákaz
    `docker image prune -a` / `docker system prune` / `compose down -v`, nic
    mimo `/opt/codeguy`; nahradí dnešní větu o `docling-service`, který Karel
    odstraňuje;
  - **Image retention**: běžící + předchozí + persistovaný tag, jmenovité
    `rmi`, warning místo pádu, prune jen dangling; poznámka, že `script_stop`
    neexistuje a platí `set -eu`;
  - **Resource limits**: tabulka hodnot s odkazem na rozhodnutí, recreate
    všech služeb při změně, poznámka o swapu a o V8 heapu;
  - **Backups**: co, kam, rotace, instalace cronu, první ověření, obnova,
    off-host stále otevřené;
  - **Operator verification after deployment**: přidat `docker stats
    --no-stream`, `docker images ghcr.io/santinni/cg-portfolio-web`,
    `docker system df` a ověření heap limitu.
- `docs/decisions/production-operations.md` (nový záznam, řádek v README),
  jen rozhodnutí a odkazy na audit, žádné RSS hodnoty:
  - PO-01 `locked` — sdílený hostitel: portfolio sahá jen na `/opt/codeguy`
    a vlastní image; nikdy prune -a/system prune; `edge` dle JE-03; poznámka
    o sdíleném `~/.docker/config.json` (`docker logout`), oprava otevřená.
  - PO-02 `locked` — retence image: běžící + předchozí + persistovaný tag,
    mazání jmenovitě, nikdy při rollbacku, selhání = warning. Reopen: druhý
    běžící tag (blue/green) nebo registry bez historie.
  - PO-03 `provisional` — limity (hodnoty z tabulky, odkaz na baseline
    audit). Reopen: OOM kill v `docker events`/`dmesg`, nová služba na hostu,
    změna velikosti VPS, naměřený heap limit pod 400 MB.
  - PO-04 `provisional` — záloha: denně na hostiteli, 14 dní, cron v crontabu
    `karel`; **off-host kopie open**.
- `AGENTS.md`: krátký blok „Production host" jen s pravidly (nikdy prune -a /
  system prune na VPS, retence je běžící + předchozí, změna limitů jde přes
  záznam rozhodnutí, cron se instaluje ručně); bez hodnot a bez odkazů (N10).
- `docs/changelog.md`: **nepsat** (doporučení, nález N9). Soubor je uzavřený
  záznam šestiiteračního code review (jediný commit 6ea4124) s vlastní
  strukturou; provozní změny by v něm míchaly účel. Pokrývá je rozhodnutí +
  `deployment.md` + audit. Otázka Q2, rozhodne Karel.

## Pořadí prací a gate

1. Plán → revize (hotovo, v2) → **schválení Karlem**.
2. Gate: změřit `heap_size_limit` pod `-m 1g` lokálně (Docker Desktop), zapsat.
3. Implementace v pořadí: `compose.yaml` → `deploy/backup.sh` → `ci.yml`
   (odstranit `script_stop`, shellcheck krok, scp, preflight,
   `persisted_image`, retence, nefatální install + cron warning) → audit
   baseline → dokumentace a rozhodnutí → smazání tohoto plánu v témže PR.
4. Lokální ověření: `docker compose config --quiet` (viz Část 2), `shellcheck`
   (v CI; lokálně `docker run --rm -v "$PWD:/mnt" koalaman/shellcheck:stable
   deploy/backup.sh`), `pnpm test`, `pnpm typecheck`, `pnpm lint`,
   `pnpm format:check`. `pnpm build` a Chromium smoke nejsou nutné (žádná
   změna aplikačního kódu ani rout), CI je stejně spustí na PR.
5. Push, `gh pr create --base dev` (gh 2.101 je přihlášen jako Santinni),
   ověřit číslo/URL/base/head/SHA. Merge do `dev` a release `dev → main` jen
   na výslovný pokyn Karla (release postup: squash, `-s ours` zpět na dev).
6. Před merge do `main` Karel spustí housekeeping `images` (volitelné, viz
   Část 1) a zapíše `docker system df`; po merge schválí production deployment.

## Ověření po deployi na `main` (Claude, read-only SSH + `gh run watch`)

| Kontrola | Před | Očekáváno po |
|---|---|---|
| `curl https://codeguy.cz/api/health?revision=<sha>` | ee003d98 | nové SHA |
| `docker compose ps` | 3× healthy | 3× healthy, všechny tři kontejnery nově vytvořené |
| `docker images ghcr.io/santinni/cg-portfolio-web` | 9 tagů | 2 tagy (nový + ee003d98) |
| `docker system df` (Karel před, Claude po) | doplnit | reclaimable image space klesne; „až o 3,6 GB" podle `docker images`, reálně méně kvůli sdíleným vrstvám (N/S7) |
| `df -h /` | 77 %, 8,3 GB volných | více volného; přesné číslo z měření, ne z odhadu |
| `docker stats --no-stream` | app/db/caddy limit 3,73 GiB | 1 GiB / 512 MiB / 256 MiB |
| `docker inspect --format '{{.HostConfig.LogConfig}}' codeguy-app-1` | `{json-file map[]}` | `max-size:10m max-file:5` |
| `docker inspect --format '{{.HostConfig.PidsLimit}}' codeguy-app-1` | 0 | 256 |
| heap: `docker exec codeguy-app-1 node -e "console.log(require('v8').getHeapStatistics().heap_size_limit/1048576)"` | 2 102 | hodnota z gate (očekávaně 530–560) |
| `ls -l /opt/codeguy/backup.sh`, warning o cronu v run logu | neexistuje | 0755; warning do instalace cronu |
| deploy run log | `Unexpected input(s) 'script_stop'` | bez toho warningu; řádky `removed old image tag …`, žádný `could not remove` |

Velikost log souborů kontejnerů jde přečíst jen s sudo; Karel:
`sudo du -sh /var/lib/docker/containers/*/*-json.log`.

Výsledek s čísly před/po jde Karlovi do chatu a do
`docs/audits/2026-10-22-vps-stack-baseline.md` (sekce „po") v navazujícím
docs PR.

## Rizika

| Riziko | Dopad | Ošetření |
|---|---|---|
| `mem_limit: 1g` je pro `app` málo při neznámé špičce | OOM kill kontejneru, `restart: unless-stopped` ho zvedne, výpadek sekundy | 1,65× naměřené špičky; sledovat `docker events --filter event=oom`; PO-03 je `provisional` |
| V8 heap z cgroup limitu vyjde příliš nízký | častější GC, krajně heap OOM místo cgroup OOM | změřit před merge (gate), fallback `--max-old-space-size=640` v tomto PR |
| Recreate `database` + `caddy` + `app` při tomto deployi | 20–40 s výpadek `codeguy.cz`, sekundy `jobs.codeguy.cz` | jednorázové; deploy mimo špičku; předdeploy dump |
| `rmi` smaže tag potřebný pro rollback | žádný: krok běží až po úspěchu; chráněné jsou `previous_image` i `persisted_image` z `.env`; GHCR tagy drží i tak | hodnoty se čtou před deployem a nemění se |
| Záloha selže potichu | žádná denní záloha | jediný `exec` bez roury, `gzip -t`, log s časem; warning v deployi, když cron chybí; off-host kopie stále open |
| Compose odmítne nový klíč | deploy padne v `config --quiet` před výměnou souborů | stejné klíče běží v cztechjobs na témže Compose 5.1.4; lokální `config` před commitem |
| Někdo znovu uvěří `script_stop` | kód psaný pro neexistující chování | vstup odstraněn, fakt zapsán v `deployment.md` |

## Co revize našla a jak je to vyřešeno

| Nález | Zdroj | Stav |
|---|---|---|
| B1 víceřádkový `case` pod `script_stop` | Opus | neplatí: `script_stop` v akci v1 neexistuje (ověřeno v `action.yml` a run logu); vstup se odstraní |
| B2 `check_revision` by pod `script_stop` neumožnil rollback | Opus | neplatí ze stejného důvodu; pod `set -e` funguje |
| S1 / Codex: roura `tar | gzip` maskuje selhání | Opus + Codex | `tar -czf` v kontejneru, `gzip -t` |
| S2 `install backup.sh` před `up` | Opus | přesunuto za úspěch, nefatálně |
| S3 prázdný `previous_image` při neběžícím `app` | Opus | `persisted_image` z `.env` v chráněné množině |
| S4 heap limit změřit před merge | Opus | gate krok 2, rozhodnutí o `NODE_OPTIONS` v tomto PR |
| S5 měření by zmizela s plánem | Opus | baseline audit v tomto PR |
| S6 recreate `database` nezmíněn | Opus | Část 2 + rizika |
| S7 „+3,6 GB" nadhodnoceno | Opus | „až o", měřit `docker system df` |
| S8 tiché selhání `docker image ls` | Opus | seznam se čte předem, warning |
| N1–N10 | Opus | zapracovány (same-SHA, cpus formulace, `-mtime +13`, mkdir, celá cesta v grepu, changelog nepsat, AGENTS jen pravidla) |
| N11 sdílený `~/.docker/config.json` | Opus | mimo rozsah, poznámka pod PO-01 |

Codex stihl jeden nález (roura `gzip`) a pak narazil na limit kvóty; úplná
Codex revize jde zopakovat po 20:23, pokud o ni Karel stojí.

## Otázky pro Karla

- **Q1** Limity: souhlas s `app` 1g / `database` 512m / `caddy` 256m a `cpus`
  jen pro `app`? Alternativa je `app` 768m (1,25× špička), těsnější.
- **Q2** `docs/changelog.md`: nechat jako archiv code review (doporučení), nebo
  přidat datovanou provozní sekci?
- **Q3** Čas zálohy 03:47 vyhovuje?
- **Q4** Souhlas s odstraněním mrtvého `script_stop: true` z `ci.yml`?
