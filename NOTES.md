# cg-portfolio-web — poznámky k vývoji

## Architektura projektu

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3 přes Local API (žádné REST/GraphQL volání)
- **DB**: PostgreSQL
- **Styly**: CSS Modules — žádný Tailwind, žádný Shadcn, žádný Radix
- **Testy**: Vitest (ne Jest)
- **Skripty**: `.cjs` extension — projekt má `"type": "module"` v package.json
- **Reverse proxy**: Caddy → Next.js → Payload Local API → PostgreSQL
- **Fonty**: Inter z `next/font/google`, subsets `latin` + `latin-ext`
- **Internationalizace**: i18next (plánováno)

## Pracovní adresář

```
C:\web\CG\
├── cg-portfolio-web\   ← náš projekt
└── v0\                 ← prototyp s designem (Tailwind, Next.js)
```

---

## Kritické pravidlo: CSS proměnné ≠ Tailwind třídy

**Naming je systematicky posunutý — vždy ověřuj hodnotu, ne jméno!**

| Naše proměnná | Naše hodnota | Tailwind třída | Tailwind hodnota |
|---|---|---|---|
| `--font-size-sm` | 0.875rem | `text-sm` | 0.875rem ✓ |
| `--font-size-md` | 1rem | `text-base` | 1rem ✓ |
| `--font-size-lg` | **1.25rem** | `text-xl` | 1.25rem ← pozor! |
| `--font-size-xl` | **1.5rem** | `text-2xl` | 1.5rem ← pozor! |
| `--font-size-2xl` | **1.875rem** | `text-3xl` | 1.875rem ← pozor! |
| `--font-size-3xl` | 2.25rem | `text-4xl` | 2.25rem |
| `--font-size-4xl` | 3rem | `text-5xl` | 3rem |
| `--font-size-5xl` | 3.75rem | `text-6xl` | 3.75rem |

**Chybějící hodnoty (žádná proměnná → hardcode):**
- `1.125rem` = Tailwind `text-lg`
- `4.5rem` = Tailwind `text-7xl`
- `line-height: 1.625` = Tailwind `leading-relaxed`

### Postup migrace z v0

1. Najdi Tailwind třídy na elementu v `C:\web\CG\v0\`
2. Dohledej jejich skutečné rem hodnoty
3. Najdi CSS proměnnou **podle hodnoty**, ne podle jména
4. Pokud proměnná neexistuje → hardcoded hodnota

---

## Pravidla stylu

- Vždy řeš **desktop i mobile** — v navigaci jsou separátní třídy `.navLink` a `.mobileNavLink`
- Breakpointy v CSS Modules: nested `@media screen and (min-width: Xpx)` uvnitř třídy
- Projekt nepoužívá žádné inline styly

---

## Icon pipeline

```bash
pnpm icons:generate   # scan + convert + index (vše najednou)
```

| Krok | Script |
|---|---|
| `pnpm icons:scan` | scan SVG souborů, generuje report |
| `pnpm icons:convert` | SVG → React komponenty |
| `pnpm icons:index` | generuje index.ts |
| `pnpm icons:generate` | všechno najednou |
| `pnpm icons:clean` | smaže vygenerované soubory |

- **SVG zdroje**: `src/assets/icons/` — zde editovat
- **Vygenerované komponenty**: `src/components/icons/` — **NEUPRAVOVAT RUČNĚ**
- Adapter z `e4-component-library` (`scripts/iconConverter/*.cjs`)
- Na Windows s pnpm: `pnpm exec svgr` (ne `npx @svgr/cli`), flag `--icon` musí být **za** cestou k souboru

---

## Co je hotovo

### Navigace
- Logo nahrazeno SVG komponentou `CodeguyLogoIconSvg` + text "CodeGuy.cz" (`.cz` v accent barvě)
- Desktop nav links: `font-size: var(--font-size-sm)` + `font-weight: var(--font-weight-medium)`
- Mobile nav links: `font-size: var(--font-size-xl)` + `font-weight: var(--font-weight-medium)`

### Hero sekce
- **h1**: bold (700), `letter-spacing: -0.025em`, `text-wrap: balance`
  - base: `--font-size-3xl` (2.25rem) | 640px: `--font-size-4xl` (3rem) | 1024px: `4.5rem`
  - `line-height: var(--line-height-sm)` (1.25)
  - "Reactive" obaleno `<span className={styles.heroTitleAccent}>` → `color: var(--accent)`
- **subtitle p**: `text-wrap: pretty`, `line-height: 1.625`
  - base: `1.125rem` | 640px: `var(--font-size-lg)` (1.25rem)

### Infrastruktura
- `.cursorrules` — přepsán na správný stack (odstraněn Tailwind/Shadcn/Radix/Redux/Jest/DOMPurify/Sentry/RHF)
- `.github/copilot-instructions.md` — vytvořen (commands, architektura, konvence)

---

## Kandidáti na přidání do variables.css

```css
--font-size-6xl: 4.5rem;        /* Tailwind text-7xl */
--line-height-relaxed: 1.625;   /* Tailwind leading-relaxed */
```

---

## Další kroky

- Migrace sekcí ze v0: Services, About, Contact
- i18next integrace
