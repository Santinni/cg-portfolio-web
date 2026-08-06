# Portfolio production delivery plan

## Goal

Publish a resilient personal portfolio at `https://codeguy.cz` that represents Karel as a senior frontend engineer and matches the approved Figma design across desktop, tablet, mobile, light, dark, keyboard and reduced-motion states.

The public profile must render without depending on seeded Payload singleton content. Insights remain Payload-backed and degrade to a designed empty state when no published posts exist.

## Sources of truth

- Figma file `cs38WzlXKY9xfDYBinoKel`.
- Desktop Home `6:2`, Tablet Home `7:377`, Mobile Home `8:87`.
- Desktop routes on page `4:4`; tablet routes on `4:5`; mobile routes on `4:6`.
- Figma semantic colors `29:167`, typography `29:280`, dimensions `29:317`, responsive layout `29:384`, runtime `29:442`.
- Current branch `dev` at `46039bd`.
- Production delivery workflow `.github/workflows/ci.yml`.

## Launch assumptions

- Public UI copy is English, matching the approved Figma screens.
- Use restrained, NDA-safe Figma copy; do not invent client names, metrics or outcomes.
- Use `karel@codeguy.cz`, Prague, LinkedIn `https://www.linkedin.com/in/karelkutchan/` and GitHub `https://github.com/Santinni`.
- Do not publish the phone number in the first cut.
- Publish three complete work details: energy customer portal, maintenance applications and distributed energy platform.
- Show Accessibility as a non-linked pending card because no complete production detail is designed.
- Keep `/curriculum-vitae` reachable until its disposition and PDF freshness are confirmed, but remove it from primary navigation.
- Do not use current AI/demo media placeholders.

## Agent ownership

### Claude Code — complex shared foundation

Owns only:

- `src/app/(frontend)/styles/*`
- `src/app/(frontend)/layout.tsx`
- `src/app/(frontend)/components/layout/*`
- `src/app/(frontend)/components/theme/*`
- `src/app/(frontend)/components/ui/navigation/*`
- `src/app/(frontend)/components/primitives/button/*`
- `src/components/site/*`
- `src/components/work/WorkCard*`
- `src/content/site.ts`
- `src/content/profile.ts`
- `src/content/work.ts`
- `src/app/(frontend)/(pages)/(home)/*`

Acceptance: semantic tokens, accessible responsive shell, persistent theme, exact Home content/layout at 1440/768/390, no CMS requirement, and scoped type/lint checks.

### Mistral Vibe — standard static route implementation

Starts only after Claude foundation review. Owns only:

- `src/content/contact.ts`
- `src/content/experience.ts`
- `src/components/site/ContactLink*`
- `src/components/site/Timeline*`
- `src/components/work/CaseStudyLayout*`
- `src/app/(frontend)/(pages)/work/**/*`
- `src/app/(frontend)/(pages)/about/**/*`
- `src/app/(frontend)/(pages)/experience/**/*`
- `src/app/(frontend)/(pages)/contact/**/*`
- `src/app/(frontend)/not-found.tsx`
- a colocated 404 CSS module if needed

Acceptance: four work cards, only three linked complete cases, NDA-safe content, static metadata, unknown slugs use `notFound()`, and all static routes render without Payload.

### Copilot CLI — tests, regression protection and release review

Starts after integrated routes exist. Owns only:

- `src/__tests__/e2e/*`
- new focused unit/component tests under `src/__tests__`
- test-only helpers/config when strictly required

It must not edit production components. It replaces stale homepage expectations and covers route availability, navigation, mobile dialog close/focus behavior, theme persistence, three valid work slugs, invalid slug 404, contact links and absence of horizontal overflow at representative widths.

### Controller

Owns architecture, task packets, diff review, integration corrections, Insights/Payload integration, environment/runtime fixes, sitemap/SEO, CI/CD safety changes, full verification, commits, push, deployment and rollback decisions.

## Ordered tasks

1. Establish the semantic token layer and accessible application shell.
2. Replace the legacy CMS homepage with the approved responsive Home vertical slice.
3. Add typed launch content that is independent of PostgreSQL/Payload availability.
4. Add Work index and three work details; keep Accessibility explicitly unavailable as a detail.
5. Add About, Experience, Contact and redesigned 404.
6. Wire Insights index/detail to published-only Payload DTOs with loading, empty, error and 404 behavior.
7. Correct global metadata, document language, sitemap, canonical routes and production env validation.
8. Replace stale E2E coverage and add accessibility/browser regression checks.
9. Run all release gates and visually compare 390/768/1440 screenshots with Figma.
10. Harden the deployment workflow to use an immutable image tag, prove VPS prerequisites, deploy through `main`, smoke-test public HTTPS routes and retain rollback evidence.

## Required validation

- `pnpm format:check`
- `pnpm generate:types` followed by a clean `src/payload-types.ts` diff check
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:unit`
- `pnpm test`
- `pnpm build`
- targeted Playwright Chromium checks, then configured browser matrix when the environment supports it
- keyboard/mobile menu/theme/route smoke checks
- screenshots at 390, 768 and 1440 px, plus 320 and 430 px overflow checks
- light and dark mode contrast/focus/reduced-motion review
- `docker compose config --quiet`
- release-candidate Docker build
- post-deploy `https://codeguy.cz`, `/api/health`, core routes and one 404 probe

## Post-launch backlog

Work requested after this launch plan was written is recorded in
`docs/plans/2026-08-06-post-launch-backlog.md`. It is planning only and does not
change the launch scope or the deployment gate below:

- BL-001 — a reset-tracker page providing the same information as
  `https://codex-resets.com/` (blocked on data-source and originality decisions).
- BL-002 — Curriculum Vitae component revision: apply DRY against the shared
  `src/components/site/*` primitives and unify contact-style links site-wide.
- BL-003 — state identity more clearly on the homepage and surface a direct
  contact affordance above the fold.

## Deployment gate

Do not push the release to `main` until all of the following are proven:

- GitHub production secrets and environment exist.
- `/opt/codeguy/compose.yaml` and production `.env` exist on the VPS.
- `DATABASE_URI` uses the Compose `database` hostname.
- database volume/service is healthy.
- Caddy/proxy owns both `codeguy.cz` and `www.codeguy.cz` as intended.
- the deploy uses an immutable commit SHA image and records the previous image for rollback.
- public HTTPS smoke tests succeed after deployment.

