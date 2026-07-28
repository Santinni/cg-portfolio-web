# Zadání projektu: Osobní portfolio a CV webu

## 1. Přehled projektu

**Název:** CodeGuy.cz — osobní portfoliový web  
**Vlastník:** Karel Kutchan, Frontend Developer  
**Doména:** codeguy.cz  
**Jazyk obsahu:** angličtina (UI), čeština (metadata, SEO)  
**Účel:** Prezentace profesního profilu, nabízených služeb, referencí a životopisu pro potenciální klienty a zaměstnavatele.

---

## 2. Cílová skupina

- Potenciální klienti hledající freelance frontend developera
- Recruiters a HR manažeři
- Technické vedení firem zvažujících spolupráci
- Kolegové z oboru

---

## 3. Struktura stránek

### 3.1 Hlavní stránka (`/`)

Jednostránkový layout (single-page scroll) se 4 sekcemi:

#### a) Hero sekce
- Full-viewport banner s pozadím (fotografie s color-dodge blend)
- Hlavní nadpis: „Crafting Reactive Web Solutions"
- Podnadpis: „Building modern and reliable web applications"
- CTA tlačítko „Get Started" → scroll ke kontaktu
- Panel „Cooperated with:" — loga/ikony firem (Eon, MNC Group, Skype, Notion, Ionte.val)
- Paralaxní efekt pozadí (`background-attachment: fixed`) na desktopu, scroll na mobilu

#### b) Služby (Services)
- Nadpis: „How may I help you?"
- Podnadpis: „Together, we can turn your visions into reality."
- Mřížka karet — každá karta: ikona + název + popis
- Obsah spravován přes CMS (kolekce Services)

#### c) O mně (About)
- Nadpis z CMS
- Rich-text obsah z CMS (Lexical editor)
- Volitelný obrázek vedle textu
- Obsah spravován přes CMS (kolekce About)

#### d) Kontakt (Contact)
- Nadpis + popis z CMS
- E-mail (mailto link)
- Telefon (tel link, volitelný)
- Ikony LinkedIn a GitHub s odkazy
- **Tlačítko pro rezervaci schůzky** → otevře modální okno s embeddovaným Google Calendar

### 3.2 Curriculum Vitae (`/curriculum-vitae`)

Statická stránka s kompletním životopisem, rozdělená do sekcí:

#### a) Hlavička
- Jméno: Karel Kutchan
- Profese: Frontend Developer
- Kontaktní údaje: telefon, e-mail, LinkedIn, lokace (Praha)

#### b) Who am I?
- Krátký biografický text (5 odstavců)
- Rozbalovací/sbalovací obsah (expandable text)

#### c) Technological Stack
- Dvě kategorie: „JS Frameworks, Libraries and tools" + „Styling & Design Systems"
- Seznamy technologií (React, Next.js, TypeScript, Storybook, Sass, MUI…)
- Rozbalovací/sbalovací obsah

#### d) Experience (Pracovní zkušenosti)
- Časová osa od nejnovější pozice (2024) po nejstarší (2014)
- 10 pozic: Kontent.ai, TLDR;IT, eMan, LMC, Amp X, Skype.com, Foxconn, Mountfield, BitWare
- Každá položka: období, pozice, firma, seznam bodů s popisem práce

#### e) Education
- Formální vzdělání (COPTH, 2002–2006)
- Kurzy a semináře (Codecademy, Free Code Camp, VzhuruDolu, Learn2code, Webrebel, S-COMP)

#### f) Plovoucí tlačítko
- Fixed pozice vpravo dole
- Ikona stažení + text „Download CV"
- Link na PDF soubor (`/curriculum-vitae/CV_Karel_Kutchan.pdf`)
- Tlačítko se rozšiřuje (expand) při hoveru — zobrazí text

---

## 4. Komponenty

### 4.1 Navigace
- **Desktop:** Horizontální menu s logem (SVG + jméno), položky: Home, Services, About, Contact, CV
- **Mobil:** Hamburger menu → nativní `<dialog>` element na celou obrazovku
- Fixed pozice nahoře s `z-index: 50`
- Anchor linky (smooth scroll) na sekce hlavní stránky

### 4.2 Button (primitiva)
- Varianty: primary, secondary, transparent, text, link
- Velikosti: small, medium, large
- Stavy: loading (spinner), disabled
- Může být `<button>` nebo `<a>` (prop `renders`)
- Plně zaoblený (rounded) mód

### 4.3 ExpandableText (primitiva)
- Sbalitelný obsah s animací `max-height`
- Šipka/trigger se otáčí o 180° při rozbalení
- Použit na CV stránce (Who am I, Tech Stack)

### 4.4 ExpandingButton (primitiva)
- Fixed plovoucí tlačítko (kruhové, 48×48px)
- Při hoveru se rozšíří na 176px a zobrazí text
- Může fungovat jako odkaz s atributem `download`

### 4.5 BookingModal
- Full-screen modal overlay
- Embedduje Google Calendar Appointments iframe
- Accessibility: focus trapping, Escape zavírá, obnovení fokusu při zavření
- Body scroll lock při otevření

---

## 5. Design systém

### 5.1 Barevné schéma

Tmavý (dark) design s akcentní žlutou:

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--background` | `#0a0f1c` (midnight blue) | Hlavní pozadí |
| `--background-secondary` | `#0d1225` (navy) | Sekundární pozadí |
| `--card-background` | `#1a1f2c` (slate) | Pozadí karet |
| `--card-background-hover` | `#252a37` (slate dark) | Hover stav karet |
| `--text-color-primary` | `#ffffff` | Hlavní text |
| `--text-color-secondary` | `#9ca3af` (gray) | Sekundární text |
| `--accent` | `#facc15` (yellow) | Akcentní barva, linky, CTA |
| `--accent-hover` | `#fbbf24` (yellow dark) | Hover stav akcentu |

Dark mode override: `--background: #0a0a0a`, `--foreground: #ededed`

### 5.2 Typografie

- Font: **Inter** (Google Fonts, subsety: latin, latin-ext)
- Velikosti: 0.875rem – 3.75rem (8 stupňů)
- Váhy: light (300), normal (400), medium (500), bold (700)
- Nadpisy: `clamp()` pro fluid typography
- Antialiasing: webkit + moz font smoothing

### 5.3 Spacing

8px Grid systém:
- `xs: 4px`, `sm: 8px`, `md: 12px`, `base: 16px`, `lg: 24px`, `xl: 32px`, `2xl: 48px`, `3xl: 64px`

### 5.4 Border radius

Od `0.25rem` (sm) po `9999px` (rounded/pill)

### 5.5 Stínování

- Box shadow: `0 0 10px 0 rgba(0, 0, 0, 0.5)`
- Shadow color: blue-gray (`#1e293b`)

---

## 6. Datový model (CMS)

Headless CMS (Payload CMS) se 6 kolekcemi:

### 6.1 Users
- Autentizace: e-mail + heslo
- Role: `admin` (plný přístup), `editor` (editace obsahu)
- Role uloženy v JWT

### 6.2 Services
| Pole | Typ | Povinné | Omezení |
|------|-----|---------|---------|
| title | text | ano | 3–100 znaků |
| description | textarea | ano | max 500 znaků |
| icon | text | ne | max 50 znaků (emoji/text) |

### 6.3 About
| Pole | Typ | Povinné | Omezení |
|------|-----|---------|---------|
| title | text | ano | 3–100 znaků |
| content | richText (Lexical) | ano | — |
| image | upload (→ Media) | ne | — |

### 6.4 Projects
| Pole | Typ | Povinné | Omezení |
|------|-----|---------|---------|
| title | text | ano | 3–100 znaků |
| slug | text | auto | generován z title (unique) |
| description | textarea | ne | max 500 znaků |
| image | upload (→ Media) | ano | — |
| link | text | ne | validace URL |
| technologies | array of text | ne | max 20 položek, každá max 50 znaků |

### 6.5 Contact
| Pole | Typ | Povinné | Omezení |
|------|-----|---------|---------|
| title | text | ano | 3–100 znaků |
| description | textarea | ano | max 500 znaků |
| email | email | ano | — |
| phone | text | ne | regex validace tel. čísla |
| linkedin | text | ne | validace LinkedIn URL |
| github | text | ne | validace GitHub URL |

### 6.6 Media
- Upload obrázků do `public/media`
- Automatické responsive varianty: thumbnail (300), square (500×500), small (600), medium (900), large (1400), xlarge (1920)
- Focal point podpora
- Povinný alt text

### 6.7 Přístupová práva
- **Čtení:** veřejné (kdokoli)
- **Zápis/editace/mazání:** vyžaduje autentizaci
- **Správa uživatelů:** pouze admin role

---

## 7. Responzivní design

### Breakpointy
- **Mobil:** < 768px — jednoduchý layout, hamburger menu, vertikální karty
- **Tablet:** 768–1024px — přechodový layout
- **Desktop:** > 1024px — plný layout s mřížkou, desktopové menu

### Klíčové responsivní úpravy
- Hero: background-attachment: scroll na mobilu/touch zařízeních
- Navigace: desktop menu (inline linky) ↔ mobilní dialog (fullscreen)
- Service/Project karty: single column → grid
- Reference panel: row → column na mobilu
- Floating button: vždy fixed, vpravo dole

---

## 8. SEO a metadata

- **Jazyk stránky:** `<html lang="cs">`
- **Open Graph:** type website, locale cs_CZ, obrázek 512×512
- **Twitter Card:** summary_large_image
- **Canonical URL:** codeguy.cz
- **robots.txt:** povolí vše kromě `/api/`, `/admin/`, `/_next/`, `/static/`
- **sitemap.xml:** 2 URL — homepage (priority 1, weekly) + CV (priority 0.8, monthly)
- **Meta description:** „Profesionální webová řešení a vývoj moderních webových aplikací"
- **Keywords:** web development, React, Next.js, TypeScript, webové aplikace, Codeguy, frontend, fullstack

---

## 9. Výkonové požadavky

- **LCP:** < 500ms (cíl: < 200ms)
- **CLS:** 0 (žádný posuv)
- **Revalidace:** ISR — data z CMS se revalidují každých 60 sekund
- **Obrázky:** Next.js Image optimization, AVIF/WebP formáty, responsive sizes
- **Hero pozadí:** 4 varianty podle šířky viewportu (600, 900, 1200, 1400px)

---

## 10. Bezpečnost

### HTTP hlavičky
- `X-Frame-Options: DENY` — ochrana před clickjackingem
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` — HSTS s preload
- `Content-Security-Policy` — whitelist pro skripty, styly, obrázky, iframe (Google Calendar)
- `Permissions-Policy` — zákaz senzorů, kamery, mikrofonu, plateb
- `Referrer-Policy: strict-origin-when-cross-origin`

### Rate limiting
- In-memory rate limiter na `/api` a `/admin` routy
- 60 requestů / minuta / IP
- Automatický cleanup expirovaných záznamů

### Autentizace
- Payload CMS autentizace (session + JWT)
- Role-based access control (admin vs editor)

---

## 11. Infrastruktura

### Produkční stack
```
[Caddy] → HTTPS (auto TLS) → [Next.js standalone] → [PostgreSQL 16]
```

### Docker Compose (3 služby)
1. **db** — PostgreSQL 16 Alpine, persistent volume, healthcheck
2. **web** — Next.js standalone build (multi-stage Dockerfile), port 3000
3. **caddy** — Caddy 2 Alpine, reverse proxy, auto HTTPS, gzip/zstd komprese

### Caddy konfigurace
- Automatický HTTPS s Let's Encrypt
- TLS 1.2+ s x25519 kurvy
- CORS hlavičky
- Komprese (gzip + zstd, min 1000B)
- Statické soubory: `Cache-Control: public, max-age=31536000, immutable`
- API: `Cache-Control: public, max-age=60, stale-while-revalidate=30`
- JSON logy s rotací (10MB, 10 souborů, 30 dní)

### Health check
- Endpoint: `GET /api/health` → `{ status: "ok", timestamp: "..." }`
- Využíván Docker healthcheck i Caddy health_uri

### PWA manifest
- Název: CodeGuy.cz (zkratka: CG)
- Ikony: 192×192 a 512×512 (maskable + any)
- Theme: `#0a0f1c`, display: standalone

---

## 12. Accessibility (A11y)

- Sémantické HTML `<section>`, `<nav>`, `<main>`, `<dialog>`
- `aria-labelledby` na všech sekcích s vazbou na heading ID
- `aria-expanded` + `aria-controls` na hamburger menu
- `aria-label` na ikonových SVG a odkazech bez textu
- Focus trapping v BookingModal
- Keyboard navigace: Escape zavírá modal/dialog
- `role="img"` + `aria-label` na inline SVG logech
- Alt texty na všech obrázcích (povinné v CMS)

---

## 13. Shrnutí klíčových rozhodnutí pro designéra

1. **Tmavý design** s akcentní žlutou — profesionální, technický dojem
2. **Single-page scroll** hlavní stránky — hero → služby → about → kontakt
3. **Samostatná CV stránka** — detailní profesní profil s možností stáhnout PDF
4. **Minimalistické UI** — málo dekoračních prvků, důraz na typografii a whitespace
5. **Fixní navigace** nahoře + plovoucí CTA tlačítko (booking / CV download)
6. **Reference panel** v hero — sociální důkaz spolupráce s firmami
7. **Modální booking** — přímá možnost rezervace schůzky bez opuštění webu
8. **Expandable sekce** na CV — obsah je dostupný, ale nezahlcuje na první pohled

---

## 14. Shrnutí klíčových rozhodnutí pro architekta

1. **Next.js App Router** se Server Components — data fetching na serveru, minimální JS na klientu
2. **Payload CMS** integrovaný do stejné Next.js aplikace — shared process, Local API (žádné HTTP volání pro data)
3. **PostgreSQL** jako databáze — spolehlivost, relační model pro CMS
4. **ISR (revalidate: 60)** — stale-while-revalidate pattern, automatická aktualizace obsahu
5. **CSS Modules** bez utility frameworku — maximální kontrola, žádná runtime knihovna
6. **Docker multi-stage build** — minimální produkční image (standalone output)
7. **Caddy** jako reverse proxy — automatický HTTPS, zero-config TLS
8. **In-memory rate limiter** — jednoduchý, dostatečný pro single-instance deployment
9. **Zod validace env proměnných** — fail-fast při startu, pokud chybí config
