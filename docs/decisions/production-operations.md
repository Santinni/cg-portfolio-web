# Production operations decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | What the deploy and the operator may do on the shared VPS: image retention, resource limits, backups |
| Status vocabulary | See [`README.md`](README.md) |
| Created | 2026-10-22 |
| Runbook | [`docs/deployment.md`](../deployment.md) |
| Baseline audit | [`docs/audits/2026-10-22-vps-stack-baseline.md`](../audits/2026-10-22-vps-stack-baseline.md) |

The portfolio runs as Compose project `codeguy` in `/opt/codeguy` on a Hetzner VPS it shares
with the cztechjobs stack (`/opt/cztechjobs`, see [`jobs-subdomain-edge.md`](jobs-subdomain-edge.md))
and with whatever else the owner keeps there. The records below are what this repository must
keep true so that a portfolio deploy can never damage its neighbours, the host, or its own
rollback.

**Implementation status.** Delivered in the repository by the change that introduced this
record; live from the first `main` release that carries it. The "after" measurements are a
documented follow-up in the baseline audit.

## PO-01 — The host is shared: touch only this project · `locked`

**Decision.** The deploy and every documented operator procedure act only on `/opt/codeguy`,
the Compose project `codeguy`, its volumes, and the image repository
`ghcr.io/santinni/cg-portfolio-web`. Nothing in this repository runs `docker image prune -a`,
`docker system prune`, `docker volume prune` or `docker compose down -v` against the host. The
existing `docker image prune --force --filter "until=168h"` at the end of the deploy stays: it
removes dangling layers only, which cztechjobs explicitly tolerates because its rollback tag is a
tagged image.

**Why.** cztechjobs deliberately keeps its previous image tag on disk for rollback and runs its
own backups; a host-wide prune would delete that tag, and `down -v` deletes production data. The
`edge` network contract in JE-03 is the other half of the same boundary.

**Known gap.** The deploy's `docker login` / `docker logout ghcr.io` act on the shared
`~/.docker/config.json` of the deploy user, which cztechjobs avoids with an isolated
`DOCKER_CONFIG`. Harmless today (both stacks pull from the same registry with short-lived
tokens), recorded here so the next deploy change fixes it rather than rediscovers it.

**What would reopen it.** The portfolio moving to its own host, or a host-level housekeeping
job owned outside this repository that takes over image cleanup for every stack.

## PO-02 — Image retention keeps the running tag and the rollback tags · `locked`

**Decision.** After a release is accepted (image reference persisted to `.env`, public HTTPS
revision check passed), the deploy removes every tag of `ghcr.io/santinni/cg-portfolio-web` on
the host except three values read before the deploy started: the tag just deployed, the image of
the `app` container that was running (`previous_image`, which the rollback uses), and the
`APP_IMAGE` recorded in `.env` by the last accepted release. Removal is by name with
`docker image rm` without `-f`. A tag that cannot be removed, or a failure to list the images,
produces a workflow warning and never fails the deploy. The rollback paths run before this step,
so a rolled-back deploy removes nothing.

**Why.** Each deployed tag is about 515 MB and nothing removed them, so nine releases had
accumulated on a 38 GB disk. The registry keeps every tag, so on-disk history has no value beyond
the one rollback the workflow can actually perform. The third protected value covers the case
where `app` is not running at deploy time: `docker compose ps -q` lists running containers only,
`previous_image` is then empty, and without the `.env` value the last good tag would be deleted.
A redeploy of the same SHA leaves a single tag on disk; that is accepted, because the registry
still holds the older one and a rollback to the same SHA is a no-op anyway.

**What would reopen it.** Two tags running at once (blue/green), a registry that does not keep
history, or a rollback procedure that needs more than one previous release on disk.

## PO-03 — Resource limits on the three services · `provisional`

**Decision.** `compose.yaml` sets, for this host of 2 vCPU and 3.8 GB RAM without swap:

| Service | `mem_limit` | `cpus` | `pids_limit` | `stop_grace_period` | `shm_size` | Log cap (`json-file`) |
| --- | --- | --- | --- | --- | --- | --- |
| `app` | 1 GiB | 1.5 | 256 | 30 s | — | 10 MB × 5 |
| `database` | 512 MiB | — | 256 | 60 s | 128 MB | 10 MB × 3 |
| `caddy` | 256 MiB | — | 256 | — | — | 10 MB × 5 |

No `NODE_OPTIONS`: Node derives the V8 heap from the cgroup limit (560 MB under 1 GiB, measured
in the baseline audit). No `cpus` on `caddy`, which also fronts `jobs.codeguy.cz`, nor on
`database`, which is idle. No `memswap_limit`: once the host gains swap, a container may spill up
to its `mem_limit` into it, which is the intended safety net.

**Why.** Without limits the application container was the first candidate to take the whole host
down on a memory spike (peak 618 MB RSS, no swap, two stacks). The values are ceilings sized
against the measured peaks with the cztechjobs ceilings (640 + 512 MiB) on the same host, leaving
about 875 MB for the host itself once the unrelated services the owner is retiring are gone.
Changing any limit means recreating that container, which this deploy does for all three at once
(tens of seconds of downtime, instead of the usual seconds for Caddy alone).

**What would reopen it.** An OOM kill in `docker events --filter event=oom` or `dmesg`, a new
service on the host, a different VPS size, a measured `heap_size_limit` under 400 MB, or
hardening of the `app` rootfs (`read_only`, `cap_drop`), which is separate work with its own
measurement.

## PO-04 — Nightly backup on the host; off-host copy still open · `provisional`

**Decision.** `deploy/backup.sh`, installed by the deploy as `/opt/codeguy/backup.sh`, dumps the
database (`pg_dump --format=custom`) and archives the media volume (taken from the running `app`
container with a single `tar -czf`) into `/opt/codeguy/backups`, mode 0700/0600, every night at
03:47 from the host crontab of the deploy user, half an hour after the cztechjobs backup. Daily
files are kept for 14 days; the deploy's `predeploy-*.dump` files are kept to the newest ten. The
cron line is installed by hand (the deploy only warns when it is missing). Restore is a manual,
deliberate operation; the deploy never restores automatically.

**Why.** Until now the only backup was the pre-deploy dump, which exists only when a release
happens and which nothing rotated. The media volume is tiny today (516 kB), so a daily full
archive costs nothing. Installing the cron line by hand keeps the deploy from editing the owner's
crontab.

**Open.** The backups live on the same disk as the data. A copy that leaves the host must be
encrypted (`age` or `gpg`) because the dumps contain the Payload accounts. Where it goes and how
often is not decided.

**What would reopen it.** Editorial content the owner cannot recreate, a media volume that makes
a daily full archive expensive, or the off-host decision above.
