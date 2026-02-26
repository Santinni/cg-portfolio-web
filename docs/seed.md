# Naplnění databáze daty (seed skript)

> Návod, jak a proč používáme soubor `seed.ts` k naplnění databáze portfolia obsahem.

---

## Co je to „seedování" databáze?

Představ si databázi jako prázdný šanon. Máš všechny přihrádky (kolekce — About, Projects, Services, Contact…), ale žádné papíry uvnitř. **Seed skript** je automatický postup, který do těch přihrádek vloží předpřipravená data — texty, obrázky, kontakty — jedním příkazem.

Bez seedu bys musel všechna data ručně vyplňovat v admin panelu (na `/admin`). Seed ti to udělá za pár sekund.

---

## Kdy seed spustit?

- **Poprvé** po naklonování projektu a spuštění databáze
- **Po smazání databáze** (např. při přechodu na čistou instalaci)
- **Při změně struktury dat**, kdy chceš začít s čerstvými testovacími daty

⚠️ **Pozor:** Seed skript **přidává** data. Pokud ho spustíš dvakrát, budou v databázi duplicity. Před opětovným spuštěním nejdřív smaž stávající data (viz sekce „Reset databáze" níže).

---

## Předpoklady

1. **Node.js** (v20 nebo novější) — ověříš příkazem:
   ```bash
   node --version
   ```

2. **PostgreSQL** běží a databáze `codeguy` existuje — pokud používáš Docker:
   ```bash
   docker compose up -d
   ```

3. **Soubor `.env`** je vyplněný — obsahuje přístupové údaje k databázi (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`) a `PAYLOAD_SECRET`.

4. **Závislosti** jsou nainstalované:
   ```bash
   pnpm install
   ```

5. **Obrázek** `public/media/img.webp` existuje — seed ho nahraje jako placeholder pro projekty a About sekci.

---

## Jak seed spustit

Jeden příkaz v terminálu z kořenového adresáře projektu:

```bash
pnpm dlx tsx seed.ts
```

### Co to udělá?

1. Načte proměnné prostředí z `.env` souboru
2. Sestaví připojovací řetězec k databázi z jednotlivých `DB_*` proměnných
3. Připojí se k Payload CMS
4. Postupně vytvoří:
   - **1× Media** — nahraje obrázek `img.webp`
   - **1× About** — profil s popisem kariéry (rich text)
   - **4× Services** — karty služeb (Frontend Development, Design Systems, Performance, Consulting)
   - **7× Projects** — reference z CV (BlueGhost, Kontent.ai, eMan, Skype, LMC, Amp X, Foxconn)
   - **1× Contact** — kontaktní údaje (email, telefon, LinkedIn, GitHub)
5. Vypíše `Seeding complete!` a ukončí se

### Očekávaný výstup

```
[✓] Pulling schema from database...
Seeding database...
Creating media...
Creating About section...
Creating Services...
Creating Projects...
Creating Contact...
Seeding complete!
```

---

## Technické detaily (pro zvědavé)

### Proč `pnpm dlx tsx`?

- `tsx` je nástroj, který umožňuje spouštět TypeScript soubory přímo — bez nutnosti je nejdřív kompilovat do JavaScriptu
- `pnpm dlx` ho stáhne a spustí jednorázově, aniž by ho trvale instaloval do projektu

### Proč se `DATABASE_URI` sestavuje ručně?

Soubor `.env` obsahuje připojovací řetězec ve tvaru:

```
DATABASE_URI=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

Node.js funkce `process.loadEnvFile()` ale **nepodporuje interpolaci proměnných** (tedy `${…}`). Načte to doslova jako text `${DB_USER}`, ne jako skutečnou hodnotu. Proto seed skript sestaví URL ručně z jednotlivých proměnných, které se načtou bez problémů:

```typescript
process.loadEnvFile()

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env
process.env.DATABASE_URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
```

### Proč dynamický import?

```typescript
const { default: payloadConfig } = await import('./src/payload.config')
```

V JavaScriptu se `import` příkazy vykonají **jako první** — ještě předtím, než se spustí jakýkoli jiný kód. Kdybychom použili normální `import payloadConfig from '...'`, Payload by se pokusil načíst konfiguraci **dříve**, než `process.loadEnvFile()` stihl nastavit proměnné prostředí. Dynamický `import()` zajistí, že se konfigurace načte až **po** nastavení env proměnných.

### Lexical rich text formát

About sekce používá rich text editor Lexical. Data pro něj mají specifickou strukturu — strom uzlů. Seed skript obsahuje helper funkce `paragraph()` a `richText()`, které z prostého textu vytvoří správný formát:

```typescript
richText([
  'První odstavec textu.',
  'Druhý odstavec textu.',
])
// → { root: { type: 'root', children: [{ type: 'paragraph', children: [...] }, ...] } }
```

---

## Reset databáze

Pokud chceš data smazat a spustit seed znovu:

### Varianta 1 — Smazat přes admin panel

1. Spusť dev server: `pnpm dev`
2. Jdi na `http://localhost:3000/admin`
3. Ručně smaž záznamy v kolekcích

### Varianta 2 — Smazat celou databázi (Docker)

```bash
docker compose down -v    # smaže i data
docker compose up -d      # spustí znovu
pnpm dlx tsx seed.ts      # naplní čerstvými daty
```

---

## Úprava dat

Chceš změnit texty, přidat projekt nebo upravit kontakt? Máš dvě možnosti:

1. **Admin panel** (`/admin`) — pro jednorázové úpravy bez kódu
2. **Upravit `seed.ts`** — pro trvalé změny, které přežijí reset databáze. Uprav texty přímo v souboru a spusť seed znovu.

---

## Časté problémy

| Problém | Řešení |
|---------|--------|
| `PAYLOAD_SECRET: undefined` | Zkontroluj, že `.env` soubor existuje a obsahuje `PAYLOAD_SECRET` |
| `Invalid URL` u DATABASE_URI | Ověř, že `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` jsou v `.env` vyplněné |
| `ECONNREFUSED` | PostgreSQL neběží — spusť `docker compose up -d` |
| Duplicitní data | Smaž stávající data před opětovným spuštěním seedu |
| `Cannot find module 'img.webp'` | Ověř, že soubor `public/media/img.webp` existuje |
