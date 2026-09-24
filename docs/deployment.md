# Codeguy production delivery

## Production shape

The `main` branch is the production source of truth. Pull requests run generated-type checks,
TypeScript, ESLint, unit/integration tests, a production build and the Chromium launch suite. A
successful push to `main` builds one immutable GHCR image tagged with the full commit SHA, then
deploys that exact image to the VPS.

The VPS runs two Docker Compose projects. This repository owns the first one, `codeguy` in
`/opt/codeguy`:

- Caddy terminates HTTPS on ports 80/443 for both sites. It proxies `codeguy.cz` to `app:3000` and
  `jobs.codeguy.cz` to `cztechjobs-api:8080`. Caddy joins the project network `default` and the
  shared external network `edge`; `app` and `database` stay on `default` only.
- The application is also bound to `127.0.0.1:3000` for private deploy health checks.
- PostgreSQL is reachable only on the Compose network and persists in `db_data`.
- Caddy certificates and runtime configuration persist in `caddy_data` and `caddy_config`.
- Payload uploads persist in `media_data` instead of the replaceable application container.

The second project, `cztechjobs` in `/opt/cztechjobs`, is deployed from its own repository and
only attaches its API to `edge`. See [Second stack: jobs.codeguy.cz](#second-stack-jobscodeguycz).

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

Create the shared network once. No Compose project owns it, so `docker compose down` in either
project neither removes it nor fails on it:

```bash
docker network create --driver bridge edge
```

Create `/opt/codeguy/.env.caddy` from `.env.caddy.example` with mode `0600`. It holds only
`JOBS_BASIC_AUTH_HASH`, the bcrypt hash of the `jobs.codeguy.cz` password, and is passed to the
Caddy container alone. Never put that hash into `/opt/codeguy/.env`: that file is the `env_file` of
the Next.js container.

Use a random password of at least 32 characters from the password manager and hash it at bcrypt
cost 10. Caddy's own `caddy hash-password` uses cost 14, roughly one second of CPU per failed login
on the CPU that `codeguy.cz` shares; with a long random password cost 10 loses no practical
strength. Generate the hash interactively so the password stays out of shell history:

```bash
docker run --rm -it httpd:2.4-alpine htpasswd -nBC 10 karel
install -m 0600 /dev/null /opt/codeguy/.env.caddy
# htpasswd prints karel:$2y$10$...; keep only the hash, in single quotes:
# JOBS_BASIC_AUTH_HASH='$2y$10$...'
```

Caddy's bcrypt accepts the `$2y$` prefix. The deploy fails before touching the running stack when
`.env.caddy` or `edge` is missing, or when the value is not a well-formed bcrypt hash.

Ports 80 and 443 must be free. The repository runs Caddy inside Compose; a host-level Caddy, nginx
or Apache service is not required.

Keep the host firewall enabled. The current UFW ingress contract is:

- `22/tcp` for SSH
- `80/tcp` for HTTP redirects and ACME
- `443/tcp` for HTTPS
- `443/udp` for HTTP/3

Apply the rules for both IPv4 and IPv6. A Hetzner Cloud Firewall is a separate layer: if one is
attached to the server, it must allow the same public web ports and a safe SSH source. If no Hetzner
firewall is attached, UFW remains the active ingress filter. Never modify or stop the unrelated
`docling-service` container while operating the portfolio stack.

## GitHub production environment

Create or update the GitHub Environment named `production` in
[the repository environment settings](https://github.com/Santinni/cg-portfolio-web/settings/environments/production):

Secrets:

- `VPS_HOST`: `46.225.237.67`
- `VPS_USER`: `karel`
- `VPS_KEY`: private SSH key used by Actions
- `VPS_FINGERPRINT`: SHA256 fingerprint of the ECDSA host key currently negotiated by the deploy
  actions; the 2026-07-28 baseline is
  `SHA256:9Bseg0r+qKNl/rAI2WdOZ1D5m7bgFOeI54u+s//iJz4`

Variable:

- `DEPLOY_PATH`: `/opt/codeguy`

Keep required-reviewer protection enabled for the first deployment. Repository `GITHUB_TOKEN` is
used only to push and pull the GHCR image during the workflow.

Derive the fingerprint on the authenticated VPS instead of trusting an unverified network scan:

```bash
ssh-keygen -l -E sha256 -f /etc/ssh/ssh_host_ecdsa_key.pub | awk '{print $2}'
```

Paste only the resulting `SHA256:...` value into the secret: no key size, comment, quotes or
whitespace. `appleboy/scp-action@v1` currently downloads `drone-scp 1.8.0`, whose Go SSH dependency
prefers the server's ECDSA key before ED25519. Therefore a valid ED25519 fingerprint still produces
`ssh: host key fingerprint mismatch` in this workflow. Reverify this assumption whenever the action
version or the VPS host keys change; do not disable fingerprint verification to bypass a mismatch.

## Main branch protection

Protect `main` in
[the classic branch protection settings](https://github.com/Santinni/cg-portfolio-web/settings/branches)
with pull requests and these exact required job names:

- `Code quality`
- `Unit and integration tests`
- `Production build and browser smoke`

Do not require `Build and publish immutable image` or `Deploy immutable image to production` on a
pull request. Those jobs intentionally run only on a push to `main`, so they are correctly skipped
on pull requests. Remove obsolete required contexts such as `code-check` or `docker-build`; an
expected check that no workflow reports waits forever.

Keep `Lock branch` off, otherwise even a passing pull request cannot update `main`. Keep pull
requests required and force pushes/deletions disabled. For the current single-maintainer repository,
required human PR approval must remain off because the author cannot approve their own pull request.
Do not require the `production` deployment before merge: production starts only after the merge and
that setting would create a circular gate.

## DNS cutover

Before merging to `main`, ensure the apex and `www` resolve to the production VPS:

- `A`: `46.225.237.67`
- `AAAA`: `2a01:4f8:1c1c:7675::1`

Point `www` to the apex with a CNAME or use the same A/AAAA values. Check more than one public
resolver because cached records may briefly disagree. Caddy obtains certificates only after both
public DNS and the relevant IPv4/IPv6 firewall paths reach the VPS.

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
first requires `/opt/codeguy/.env.caddy` and the `edge` network to exist and checks that
`JOBS_BASIC_AUTH_HASH` is a well-formed bcrypt hash, then validates both files before replacing the
active copies. Caddy is validated with `docker compose run --no-deps` against the staged
`compose.yaml` in the throw-away project `codeguy-caddy-validate`, which is removed with
`down -v` right after, so the staged `Caddyfile` sees exactly the runtime environment without
touching production volumes. `caddy validate` itself reliably rejects only an empty or missing hash; a
malformed value starting with `$` passes it and would fail only on the first login, which is why
the format check runs first. A well-formed but wrong hash shows up only as failed logins. After the
public `codeguy.cz` check, the deploy probes `https://jobs.codeguy.cz/ready` and warns, without
failing, unless it answers `401`. Compose and Caddy rollback copies are kept
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

## Operator verification after deployment

Do not conclude from the green Actions badge alone. Verify the public routing, exact revision,
database readiness and running containers:

```bash
curl -I http://codeguy.cz/
curl -I https://codeguy.cz/
curl -I https://www.codeguy.cz/
curl --fail --silent "https://codeguy.cz/api/health?revision=<full-commit-sha>"
```

Expected public behavior is HTTP `308` to HTTPS, HTTPS `200`, and `www` `301` to the apex. On the
VPS, run:

```bash
cd /opt/codeguy
docker compose ps
curl --fail --silent "http://127.0.0.1:3000/api/health?deep=1&revision=<full-commit-sha>"
docker ps
```

The app, Caddy and database must be healthy; deep health must return `database: ok`; and unrelated
containers such as `docling-service` must still be running.

Check which containers share `edge`. Expect only this project's Caddy and the jobs API:

```bash
docker network inspect edge --format '{{range .Containers}}{{.Name}} {{end}}'
```

## Second stack: jobs.codeguy.cz

`jobs.codeguy.cz` serves cztechjobs, a separate Compose project in `/opt/cztechjobs` with its own
repository, image, PostgreSQL and deploy. This repository contributes only the Caddy site block,
the `edge` network attachment and the Caddy secret. The decision is recorded in
[`docs/decisions/jobs-subdomain-edge.md`](decisions/jobs-subdomain-edge.md).

### Network contract

- `edge` is external in both projects and created once by hand.
- Caddy reaches the jobs API only through the alias `cztechjobs-api` on `edge`. The jobs database
  never joins `edge`, and the jobs stack publishes no host ports.
- Caddy resolves upstream names across all of its networks. The jobs stack must therefore never use
  `app`, `database` or `caddy` as a service name, alias or `container_name`, otherwise
  `codeguy.cz` traffic could reach the wrong container.
- This project must never add a service named `api`: the jobs service `api` is visible on `edge`
  under that name as well as under its alias.

### Authentication scope

Caddy `basic_auth` (realm `cztechjobs`, user `karel`) covers every request to `jobs.codeguy.cz`
except `GET` or `HEAD` on the exact, case-sensitive path `/health` (`path_regexp ^/health$`; the
plain `path` matcher lowercases, so `/HEALTH` would slip past it). It stays public for an external uptime
monitor and returns only `ok`. Build revision and readiness live on `/ready`, behind
authentication. Caddy strips the `Authorization` header before proxying and answers `403` to
state-changing requests that a browser marks as `Sec-Fetch-Site: cross-site` or `same-site`, or
that carry an `Origin` other than `https://jobs.codeguy.cz`, because browsers send Basic
credentials on cross-site requests regardless of SameSite. Writes without an `Origin` header, such
as `curl`, pass, matching the API's own origin check.

Every failed login costs a bcrypt comparison. Banning repeated `401` responses from Caddy's JSON
log with fail2ban is a planned follow-up.

### Password rotation

Environment variables are fixed when a container is created, so `caddy reload` does not pick up a
new hash. Replace the value in `/opt/codeguy/.env.caddy`, validate, then recreate Caddy only:

```bash
cd /opt/codeguy
docker run --rm -it httpd:2.4-alpine htpasswd -nBC 10 karel
# edit .env.caddy: keep only the hash, in single quotes
docker compose -p codeguy-caddy-validate run --rm --no-deps --entrypoint caddy caddy \
  validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose -p codeguy-caddy-validate down -v --remove-orphans
docker compose up -d --no-deps --wait caddy
```

Never run the `down -v` line without `-p codeguy-caddy-validate`: in `/opt/codeguy` it would
delete the production database, media and certificate volumes. `caddy validate` does not parse the
hash, so after recreating Caddy log in once to prove the new password. Recreating Caddy interrupts
both sites for a few seconds.

### Ordering and blast radius

- Order of the first rollout: DNS for `jobs.codeguy.cz` (A and AAAA) → the jobs stack running and
  healthy on `edge` → the portfolio release carrying the Caddy block. Caddy requests the certificate
  as soon as it loads the configuration, so DNS must already be correct.
- Without a healthy upstream the Caddy configuration still loads; `jobs.codeguy.cz` answers `502`
  or `503` and `codeguy.cz` is unaffected. Caddy fails to start only when the Caddyfile does not
  adapt, which the deploy validation prevents.
- A portfolio deploy that changes the Caddy service recreates Caddy: seconds of downtime for both
  sites.
- Emergency stop for the jobs site: `cd /opt/cztechjobs && docker compose stop api`.
- The jobs stack must never run `docker image prune` or `docker system prune`, never
  `docker compose down -v`, never touch `docling-service` or anything in `/opt/codeguy`, and never
  publish host ports.

## Troubleshooting and recovery lessons

### Pull request waits for checks that never start

Compare the required branch-protection contexts with the `name` of each job in
`.github/workflows/ci.yml`. Remove stale contexts and require only the three pull-request jobs named
above. Skipped image/deploy jobs on a pull request are expected.

### `Cannot change this locked branch`

Disable only `Lock branch` in the classic protection rule. Do not remove the pull-request, status
check, force-push or deletion protections.

### `ssh: host key fingerprint mismatch`

This failure happens before files are copied or containers are changed. Verify all public host keys
from an already authenticated VPS session:

```bash
ssh-keygen -l -E sha256 -f /etc/ssh/ssh_host_ed25519_key.pub
ssh-keygen -l -E sha256 -f /etc/ssh/ssh_host_ecdsa_key.pub
ssh-keygen -l -E sha256 -f /etc/ssh/ssh_host_rsa_key.pub
```

For the current action runtime behavior, store only the ECDSA SHA256 value in
`VPS_FINGERPRINT`. Also keep `VPS_HOST` as the literal production IP to avoid DNS ambiguity during
SSH deployment. Never work around this error by removing the `fingerprint` input.

### Approval popup reports a gate problem

Check the actual deployment job before clicking again. If `Deploy immutable image to production` is
already `in_progress`, the approval succeeded and the popup was a UI race. Do not start a second
rerun while a deployment is active; the production concurrency group intentionally serializes it.

### A secret was corrected after a failed deploy

Use **Re-run failed jobs**. Environment secrets are read again for the rerun, and the already built
immutable GHCR image can be reused. This avoids rebuilding successful jobs and preserves the exact
revision being diagnosed.

### GitHub warns about longer App installation tokens

Treat `GITHUB_TOKEN` as an opaque string. This workflow neither validates its length or shape nor
stores it in a fixed-size field; it passes the value directly to `docker/login-action` and to
`docker login --password-stdin`. No secret rotation is needed solely for the longer stateless token
format.

## First production cutover record

The first successful production cutover completed on 2026-07-28 in
[Actions run 30366376901](https://github.com/Santinni/cg-portfolio-web/actions/runs/30366376901),
attempt 3, for revision `6ce5c1b384c645391c2c882d6f26e875289a54ed`. The first two deploy attempts
stopped safely before file transfer because the configured ED25519 fingerprint did not match the
ECDSA host key negotiated by the action. After correcting the environment secret, the same immutable
image deployed successfully.

Post-deploy evidence for that baseline:

- public HTTP redirected to HTTPS
- apex HTTPS returned `200`
- `www` redirected to the apex
- public health returned the exact deployed revision
- private deep health returned `database: ok`
- app, Caddy and PostgreSQL were healthy
- the pre-existing `docling-service` container remained running
