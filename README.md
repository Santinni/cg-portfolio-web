# CG Portfolio Web

Personal portfolio & business website for [codeguy.cz](https://codeguy.cz) — built with **Next.js 15**, **Payload CMS 3** and **PostgreSQL**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1 (App Router, RSC, standalone output) |
| CMS | Payload CMS 3.15 (Lexical rich-text, Local API) |
| Database | PostgreSQL (via `@payloadcms/db-postgres`) |
| Language | TypeScript 5 (strict mode) |
| Runtime | Node.js ≥ 22 |
| Package manager | pnpm ≥ 9.12 |
| Styling | CSS Modules + CSS custom properties |
| Icons | Lucide React |
| Reverse proxy | Caddy (auto-HTTPS) |
| CI/CD | GitHub Actions → Docker → VPS |

## Prerequisites

- **Node.js** v22+
- **pnpm** v9.12+
- **PostgreSQL** 15+ (local or Docker)

## Getting Started

```bash
# 1. Clone & install
git clone https://github.com/Santinni/cg-portfolio-web.git
cd cg-portfolio-web
pnpm install

# 2. Configure environment
cp .env.example .env
# → edit .env with your database credentials and secrets

# 3. Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Next.js + Payload in development mode |
| `pnpm build` | Production build (standalone compile) |
| `pnpm start` | Start the production server |
| `pnpm dev:prod` | Clean build + start (simulates production locally) |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint errors |
| `pnpm typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `pnpm test` | Run unit / component tests (Vitest) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Tests with coverage report |
| `pnpm test:e2e` | End-to-end tests (Playwright) |
| `pnpm test:e2e:ui` | Playwright with interactive UI |
| `pnpm generate:types` | Regenerate `payload-types.ts` from collections |
| `pnpm generate:importmap` | Regenerate Payload admin import map |
| `pnpm clean` | Remove `.next` and `node_modules` |
| `pnpm reinstall` | Full clean reinstall |

## Project Structure

```
cg-portfolio-web/
├─ .github/workflows/     # CI/CD pipeline (quality → test → build → deploy)
├─ public/                 # Static assets (media uploads, CV PDF, icons)
├─ src/
│  ├─ access/              # Payload access-control functions (anyone, authenticated)
│  ├─ app/
│  │  ├─ (frontend)/       # Public-facing site
│  │  │  ├─ (pages)/
│  │  │  │  ├─ (home)/     # Home page — Hero, Services, About, Contact, Projects
│  │  │  │  └─ curriculum-vitae/  # CV page — WhoAmI, TechStack, Experience, Education
│  │  │  ├─ components/
│  │  │  │  ├─ primitives/ # Button, ExpandableText, ExpandingButton
│  │  │  │  └─ ui/         # Navigation, BookingModal
│  │  │  └─ styles/        # Global CSS, variables, page-level modules
│  │  ├─ (payload)/        # Payload admin panel (auto-generated routes)
│  │  ├─ routes/           # Custom API routes
│  │  ├─ robots.ts         # robots.txt generation
│  │  └─ sitemap.ts        # Sitemap generation
│  ├─ collections/         # Payload collection configs (About, Contact, Media, Projects, Services, Users)
│  ├─ lib/
│  │  ├─ api/              # Data-fetching helpers (getHomePageData)
│  │  └─ env.ts            # Zod-based runtime env validation
│  ├─ payload/
│  │  └─ payloadClient.ts  # Cached Payload Local API singleton
│  ├─ middleware.ts        # Rate-limiting middleware (60 req/min per IP)
│  ├─ payload.config.ts    # Main Payload configuration
│  └─ payload-types.ts     # Auto-generated TypeScript types
├─ Caddyfile               # Caddy reverse-proxy config (auto-HTTPS)
├─ docker-compose.yml      # PostgreSQL + App + Caddy orchestration
├─ Dockerfile              # Multi-stage production image
├─ eslint.config.mjs       # ESLint flat config
├─ next.config.ts          # Next.js configuration
├─ tsconfig.json           # TypeScript configuration
└─ vitest.config.ts        # Vitest test runner configuration
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Caddy (reverse proxy, auto-HTTPS, HTTP/2)              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Next.js 15 (standalone)                                │
│  ├─ App Router (RSC)  → Server Components fetch data    │
│  ├─ Payload Admin     → /admin CMS interface            │
│  ├─ Middleware         → Rate limiting, security headers │
│  └─ API Routes        → /api/health, custom endpoints   │
└──────────────────────┬──────────────────────────────────┘
                       │ Payload Local API
┌──────────────────────▼──────────────────────────────────┐
│  PostgreSQL                                             │
│  Collections: About, Contact, Media, Projects,          │
│               Services, Users                           │
└─────────────────────────────────────────────────────────┘
```

## Testing

The project uses a two-tier testing strategy:

- **Unit / Component tests** — [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro) with jsdom
- **End-to-end tests** — [Playwright](https://playwright.dev/)

```bash
pnpm test              # Run all unit & component tests
pnpm test:coverage     # Generate coverage report
pnpm test:e2e          # Run Playwright E2E suite
```

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. Key variables:

| Variable | Purpose |
|---|---|
| `DOMAIN` | Site domain (e.g. `localhost` or `codeguy.cz`) |
| `NEXT_PUBLIC_SERVER_URL` | Public URL for metadata / OG tags |
| `PAYLOAD_SECRET` | CMS encryption secret (min 32 chars) |
| `DATABASE_URI` | PostgreSQL connection string |
| `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` / `DB_NAME` | Individual DB params |
| `REGISTRY` / `GITHUB_REPOSITORY` / `IMAGE_TAG` | Docker image registry |
| `VPS_HOST` / `VPS_USER` | SSH deployment target (CI/CD) |

## Docker Deployment

```bash
# Build and start all services
docker compose up -d --build

# Services:
#   app      — Next.js + Payload (port 3000)
#   db       — PostgreSQL (port 5432)
#   caddy    — Reverse proxy (ports 80, 443)
```

The Dockerfile uses a **multi-stage build** for minimal image size (Node.js alpine base).

## Development Guidelines

This project follows conventions defined in [.cursorrules](.cursorrules):

- **Indentation**: Tabs
- **Quotes**: Single quotes
- **Semicolons**: None
- **Components**: PascalCase, function declarations for pages/sections
- **Functions/variables**: camelCase
- **Directories**: kebab-case
- **Exports**: Named exports preferred (`export const`)
- **State management**: URL state + server state via Payload

## License

MIT — see [LICENSE](LICENSE) for details.
