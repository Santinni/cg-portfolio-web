# Copilot Instructions

Personal portfolio site for [codeguy.cz](https://codeguy.cz). **Next.js 15** (App Router, RSC) + **Payload CMS 3** running in the same process, backed by **PostgreSQL**.

## Commands

```bash
pnpm dev               # Start dev server (Next.js + Payload)
pnpm build             # Production build
pnpm lint              # ESLint
pnpm typecheck         # tsc --noEmit
pnpm format            # Biome formatter (src only)

pnpm test              # Run all Vitest unit/component tests
pnpm test -- src/path/to/file.test.ts   # Run a single test file
pnpm test:watch        # Vitest in watch mode
pnpm test:e2e          # Playwright end-to-end tests

pnpm generate:types    # Regenerate payload-types.ts after changing collections
pnpm generate:importmap  # Regenerate Payload admin import map
```

## Architecture

```
Caddy (reverse proxy, auto-HTTPS)
  └─ Next.js 15 standalone
       ├─ App Router (RSC) — server components call Payload Local API directly
       ├─ /admin          — Payload CMS admin panel (auto-generated routes)
       ├─ /api/*          — custom API routes + Payload REST API
       └─ middleware.ts   — in-memory rate limiter (60 req/min) on /api + /admin
            └─ PostgreSQL via Payload's postgres adapter
```

**Payload Local API** is the only data layer — never use `fetch` to call the Payload REST API from server code. Use the cached singleton:

```ts
import { getPayloadClient } from '@/payload/payloadClient'
const payload = await getPayloadClient()
const result = await payload.find({ collection: 'projects', depth: 1 })
```

Data fetching functions live in `src/lib/api/` and are wrapped with React's `cache()` for request-level deduplication. Revalidation is set at the page/segment level (`export const revalidate = 60`).

## Key Conventions

### Code Style (enforced by Biome)
- **Tabs** for indentation, single quotes, **no semicolons**
- Line width 100 (Biome), 80 (preference from .cursorrules)
- Named exports preferred: `export const Foo = ...`, `export function foo() {}`
- `function` keyword for page/section components; arrow functions for utilities

### Naming
- Directories and files: **kebab-case** (`auth-wizard/`, `user-profile.tsx`)
- Components, types, interfaces: **PascalCase**
- Variables, functions, hooks, props: **camelCase**
- Event handlers prefixed with `handle`: `handleClick`, `handleSubmit`
- Booleans prefixed with verbs: `isLoading`, `hasError`, `canSubmit`
- Custom hooks prefixed with `use`

### React / Next.js
- Default to **Server Components**; use `'use client'` only for event listeners, browser APIs, or state
- URL query params + server state (Payload) are preferred over client-side global state
- `@` alias maps to `src/` (configured in both `tsconfig.json` and `vitest.config.ts`)

### Styling
- **CSS Modules** (`.module.css` co-located with components) + **CSS custom properties** defined in `src/app/(frontend)/styles/variables.css`
- No Tailwind CSS — use CSS Modules and variables for all styling
- `clsx` for conditional class merging

### Payload CMS
- Collections live in `src/collections/` — each exports a `CollectionConfig`
- Access control: import `anyone` / `authenticated` from `src/access/`; pattern is read=anyone, mutations=authenticated
- `src/payload-types.ts` is **auto-generated** — never edit by hand; run `pnpm generate:types` after changing collections
- Rich-text fields use Lexical editor (`@payloadcms/richtext-lexical`)

### Environment Variables
All env vars are validated at startup via Zod in `src/lib/env.ts`. Import `serverEnv` (server-only) or `publicEnv` (safe for client) — never access `process.env` directly in app code.

### Testing
- Unit/component tests: Vitest + Testing Library, jsdom environment, files matching `src/**/*.{test,spec}.{ts,tsx}`
- Setup file: `src/__tests__/setup.ts`
- E2E: Playwright (`src/__tests__/e2e/`)
- CSS Modules class names are non-scoped in the test environment
- `src/payload-types.ts` and `src/app/(payload)/` are excluded from coverage
