# jobs.codeguy.cz edge decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | How this repository's Caddy serves `jobs.codeguy.cz` for the separate cztechjobs stack |
| Status vocabulary | See [`README.md`](README.md) |
| Created | 2026-09-24 |
| Runbook | [`docs/deployment.md`](../deployment.md#second-stack-jobscodeguycz) |

cztechjobs (Go API, Svelte SPA, PostgreSQL, scrapers) runs as its own Compose project in
`/opt/cztechjobs`, deployed from its own repository. This repository already terminates TLS on the
VPS, so it fronts the second site instead of the host running a second proxy. The records below
are what this repository must keep true for that to stay safe.

**Implementation status.** Delivered in the repository by the change that introduced this record;
not live until the portfolio release that carries it, which must follow DNS and a healthy jobs
stack on `edge`.

## JE-01 — Caddy `basic_auth` guards the whole subdomain · `provisional`

**Decision.** Every request to `jobs.codeguy.cz` requires HTTP Basic credentials checked by Caddy
against a bcrypt hash (realm `cztechjobs`, one user). The app itself has no authentication.
Payload accounts are not reused.

**Why.** The app stores personal job-search data and mail credentials and had no authentication.
Caddy covers the SPA and the API from the first byte with no application code. Payload login cannot
be shared: its cookie is host-only on `codeguy.cz`, `/api/users*` is publicly blocked, and its rate
limit is built for the CMS. Because browsers send Basic credentials on cross-site requests
regardless of SameSite, Caddy also refuses state-changing requests marked `Sec-Fetch-Site:
cross-site` or `same-site` or carrying a foreign `Origin`, and strips `Authorization` before
proxying. Repeated `401`s cost bcrypt CPU; fail2ban on Caddy's JSON log is a follow-up.

**What would reopen it.** An application session login in cztechjobs (planned separately), or a
second user.

## JE-02 — Only `GET`/`HEAD /health` is public · `locked`

**Decision.** The single path exempt from authentication is the exact, case-sensitive `/health`,
for `GET` and `HEAD` only, matched with `path_regexp ^/health$`. It returns `ok` and nothing else. Build revision and readiness are served on `/ready`,
behind authentication.

**Why.** An external uptime monitor needs one unauthenticated probe; exposing the revision or
dependency state publicly would leak more than liveness. The plain `path` matcher lowercases the
request path while the Go router does not, so with it `/HEALTH` would skip authentication and reach
the SPA fallback.

**What would reopen it.** A monitor that can authenticate, which would remove the exemption.

## JE-03 — The stacks meet only on the external network `edge` · `locked`

**Decision.** `edge` is created once by hand and is `external: true` in both projects. Caddy joins
`default` and `edge`; this project's `app` and `database` never join `edge`. Caddy reaches the jobs
API only through the alias `cztechjobs-api`. The names `app`, `database` and `caddy` are reserved
on `edge` for this project, and this project never adds a service named `api`.

**Why.** An external network has no owner, so `docker compose down` in either project cannot remove
it or fail on it. Caddy resolves upstreams across all its networks, so a colliding name on `edge`
would silently route `codeguy.cz` traffic to the wrong container.

**What would reopen it.** Moving either site off this VPS or out of Docker Compose.

## JE-04 — Secrets stay outside git and outside the app container · `locked`

**Decision.** The bcrypt hash lives in `/opt/codeguy/.env.caddy` (mode `0600`, single-quoted
value), which Compose passes only to Caddy through `CADDY_ENV_FILE`. The Caddyfile reads it as
`{$JOBS_BASIC_AUTH_HASH}`. Only `.env.caddy.example` with a placeholder is committed.

**Why.** `/opt/codeguy/.env` is the Next.js container's `env_file`; the hash does not belong there.
`{$VAR}` is substituted when the Caddyfile is adapted, so an empty or missing value fails
`caddy validate` in the deploy instead of starting a broken site. `caddy validate` does not parse a
value that starts with `$`, so the deploy also checks the bcrypt format before validating; a
well-formed but wrong hash can only show up as failed logins. The hash uses bcrypt cost 10 over a
random password of at least 32 characters: cost 14, Caddy's default, spends about a second of the
CPU shared with `codeguy.cz` on every failed attempt.

**Operating rule.** A hash rotation is validated by hand only with `docker compose run --rm
--no-deps --entrypoint caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile` in
the production project, which leaves nothing behind. `docker compose down -v` is never typed in
`/opt/codeguy`: it deletes the production database, media and certificate volumes. The isolated
validation project and its `down -v` cleanup exist only inside the CI deploy script.
