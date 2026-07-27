# Codeguy production delivery

## Production shape

The `main` branch is the production source of truth. Pull requests run generated-type checks,
TypeScript, ESLint, unit/integration tests, a production build and the Chromium launch suite. A
successful push to `main` builds one immutable GHCR image tagged with the full commit SHA, then
deploys that exact image to the VPS.

The VPS runs one Docker Compose project:

- Caddy terminates HTTPS on ports 80/443 and proxies to `app:3000`.
- The application is also bound to `127.0.0.1:3000` for private deploy health checks.
- PostgreSQL is reachable only on the Compose network and persists in `db_data`.
- Caddy certificates and runtime configuration persist in `caddy_data` and `caddy_config`.
- Payload uploads persist in `media_data` instead of the replaceable application container.

## One-time VPS provisioning

The production host is currently `46.225.237.67` and the SSH user is `karel`. Run these commands
interactively on the VPS with sudo access:

```bash
sudo usermod -aG docker karel
sudo install -d -o karel -g codeguys -m 0750 /opt/codeguy
```

Log out and reconnect so the Docker group membership is refreshed. Confirm that `docker ps` works
without sudo, and confirm that `curl` is installed for deploy revision checks.

Create `/opt/codeguy/.env` from `.env.production.example`. Generate independent hexadecimal values
for `PAYLOAD_SECRET` and `DB_PASSWORD`, use the same database password inside `DATABASE_URI`, and
set file permissions to `0600`. Do not commit the production file.

Ports 80 and 443 must be free. The repository runs Caddy inside Compose; a host-level Caddy, nginx
or Apache service is not required.

## GitHub production environment

Create or update the GitHub Environment named `production`:

Secrets:

- `VPS_HOST`: `46.225.237.67`
- `VPS_USER`: `karel`
- `VPS_KEY`: private SSH key used by Actions
- `VPS_FINGERPRINT`: SHA256 host-key fingerprint for `46.225.237.67`

Variable:

- `DEPLOY_PATH`: `/opt/codeguy`

Keep required-reviewer protection enabled for the first deployment. Repository `GITHUB_TOKEN` is
used only to push and pull the GHCR image during the workflow.

## DNS cutover

Before merging to `main`, change the apex `A` record from `46.28.105.3` to `46.225.237.67`. Point
`www` to the apex with a CNAME, or use the same `A` record. Remove conflicting AAAA records unless
IPv6 is configured on the VPS. Caddy will obtain certificates only after public DNS reaches the VPS.

## Claim the first Payload administrator

The production Caddyfile intentionally returns 404 for `/admin*` and `/api/users*` while the first
administrator is unclaimed. The application port itself is bound only to VPS loopback. After the
first healthy deployment, create an SSH tunnel from the operator machine:

```bash
ssh -L 3001:127.0.0.1:3000 codeguy-karel
```

Open `http://127.0.0.1:3001/admin`, create the owner account, and verify that it can sign in. Only
then remove the `cmsBootstrap` matcher from `Caddyfile` in a reviewed follow-up deployment. Keeping
the matcher is also safe if CMS administration should remain available only through the SSH tunnel.

## Deployment and rollback

The workflow uploads `compose.yaml` and `Caddyfile` into a commit-specific staging directory. It
validates both files before replacing the active copies. Compose and Caddy rollback copies are kept
next to the active files, and the previous application image is restored automatically if container
startup, Caddy reload, private database readiness or an update deployment's public HTTPS revision
check fails. The successful image reference is written atomically to `/opt/codeguy/.env`, so manual
`docker compose up -d` uses the last accepted image after a reboot or operator stop.

On the first deployment there is no previous image to restore. A failed application/database
readiness check tears the partial stack down. If only the public HTTPS check is still waiting for
DNS propagation or ACME issuance, the already healthy first stack remains running for diagnosis and
the workflow still reports failure. The public check allows roughly 100 seconds before taking this
path.

When PostgreSQL is already running, the workflow writes a custom-format pre-deploy dump into
`/opt/codeguy/backups`. Payload initializes lazily, so the deploy explicitly calls
`/api/health?deep=1` through the loopback-only application port. That request initializes Payload,
runs committed `prodMigrations`, and verifies a real database query before deployment can succeed.
The public Caddy route blocks the deep variant; ordinary container liveness remains shallow. Image
rollback does not reverse a database migration that already completed. If a migration must be
reversed, stop editorial writes and restore the matching custom-format dump deliberately; never
restore it automatically as part of a failed deploy. Database and media volumes still need an
off-host scheduled backup before the site carries irreplaceable editorial content.

The deployment is successful only when the private deep readiness check proves the database and the
public shallow health check returns the full expected commit SHA through `https://codeguy.cz`.
