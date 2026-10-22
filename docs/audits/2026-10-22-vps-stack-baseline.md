# VPS stack baseline before image retention, limits and backups

| Field | Value |
| --- | --- |
| Date | 2026-10-22 (afternoon, UTC+2) |
| Host | Hetzner Cloud VPS `46.225.237.67`, 2 vCPU, 3 819 MB RAM, no swap, 38 GB disk |
| Method | read-only SSH as `karel` (no sudo): `df`, `free`, `docker stats --no-stream`, `docker images`, `docker inspect`, `docker exec … du`, `ls backups`, `crontab -l` |
| Running revision | `ee003d9829859e338111664f038907eba5c9469c` (release 2026-10-08, PR #78) |
| Docker / Compose on the host | 29.6.0 / 5.1.4 |
| Decision record | [`docs/decisions/production-operations.md`](../decisions/production-operations.md) |

This is the "before" state of the change that adds image retention to the deploy, resource
limits to `compose.yaml` and a nightly backup. The "after" numbers below were measured right
after the first deploy carrying the change.

## Before

| What | Measured |
| --- | --- |
| Disk `/` | 28 GB used of 38 GB (77 %), 8.3 GB free |
| RAM | 2 645 MB used, 1 174 MB available, no swap |
| `ghcr.io/santinni/cg-portfolio-web` tags on disk | 9 (2026-07-28 … 2026-10-08), 507–515 MB each by `docker images`; the tags share the `node:24-slim` base and dependency layers, so the reclaimable space is smaller than the sum (`docker system df` needs to be read before the cleanup; value pending) |
| `codeguy-app-1` | 387 MB RSS, limit 3.73 GiB (the whole host), 20 PIDs, healthy for 2 weeks; peak 618 MB RSS in the cztechjobs server inventory of the same day |
| `codeguy-database-1` (`postgres:15`) | 27 MB RSS, no limit, 7 PIDs |
| `codeguy-caddy-1` (`caddy:2.11.4-alpine`) | 18 MB RSS, no limit, 11 PIDs |
| cztechjobs for comparison | `api` 13 MB / limit 640 MiB, `db` 65 MB / limit 512 MiB |
| V8 `heap_size_limit` inside `app` | 2 102 MB (V8's 2 048 MB cap plus the young generation; no cgroup limit to derive from) |
| Container logs | `json-file` without `max-size`; file sizes under `/var/lib/docker` are readable only with sudo |
| Media volume `codeguy_media_data` | 516 kB, 12 files |
| `/opt/codeguy/backups` | 8 × `predeploy-<sha>.dump`, 100–124 kB each; no daily dump, no cron entry for the portfolio |
| Host crontab `karel` | `17 3 * * * /opt/cztechjobs/backup.sh` only |
| Deploy log | `##[warning]Unexpected input(s) 'script_stop'`: `appleboy/ssh-action@v1` has no such input, so the script's `set -eu` was the only stop-on-error in effect |

## Heap limit under a cgroup memory limit (local measurement)

Measured on 2026-10-22 with the exact runtime of the production image, Docker Desktop
28.1.1 on the operator machine:

```bash
docker run --rm -m 1g node:24.18.0-slim node -e "console.log(require('v8').getHeapStatistics().heap_size_limit/1048576)"
```

| cgroup `memory.max` | `heap_size_limit` |
| --- | --- |
| none (host 3 819 MB) | 2 102 MB |
| 1 GiB | 560 MB |
| 768 MiB | 432 MB |

Node 24 passes `uv_get_constrained_memory()` into V8's `ConfigureDefaults`, which sizes the
old generation at about half of the limit. Under the chosen `mem_limit: 1g` the heap stops at
560 MB and roughly 450 MB stay for native memory (sharp/libvips, buffers, code, the
healthcheck's own `node -e` process). This is why PO-03 sets no `NODE_OPTIONS`; the record's
reopen threshold is a heap limit under 400 MB.

## After

Measured on 2026-10-22 at about 19:25 (UTC+2), a minute after the deploy of revision
`ddc9aabba53532bec36f9ea06ae52d71fc1d55eb` (release PR #82, Actions run 39819260713, all five
jobs green). Same method as above.

| What | Measured |
| --- | --- |
| Public health | `/api/health?revision=ddc9aab…` returns that revision; `app`, `database`, `caddy` healthy, all three recreated |
| Deploy log | 8 × `removed old image tag …`, no `could not remove`; one `::warning::backup cron … is not installed`; no `Unexpected input(s) 'script_stop'`; the dangling-layer prune reclaimed 633.3 MB |
| `ghcr.io/santinni/cg-portfolio-web` tags on disk | 2: `ddc9aabb` (running) and `ee003d98` (rollback) |
| `docker system df` images | 10 images, 2.909 GB, 1.056 GB reclaimable (the rollback tags of both stacks plus leftovers listed below) |
| Disk `/` | 20 GB used of 38 GB (55 %), 17 GB free. Includes the owner's removal of `docling-service` the same day, so the delta is not attributable to retention alone |
| RAM | 932 MB used, 2 887 MB available, no swap |
| `codeguy-app-1` | 103 MB RSS / 1 GiB, `NanoCpus` 1.5e9, `PidsLimit` 256 (12 used), `StopTimeout` 30, logs `max-size:10m max-file:5` |
| `codeguy-database-1` | 21 MB RSS / 512 MiB, `ShmSize` 128 MB, `PidsLimit` 256, `StopTimeout` 60, logs `max-size:10m max-file:3` |
| `codeguy-caddy-1` | 13 MB RSS / 256 MiB, 8 PIDs |
| V8 `heap_size_limit` inside `app` | 560 MB, equal to the local measurement under 1 GiB |
| OOM events since the deploy | 0 (`docker events --filter event=oom`) |
| `/opt/codeguy/backup.sh` | installed, 0755, 3 167 bytes; cron line not yet installed |
| `/opt/codeguy/backups` | 9 pre-deploy dumps (the new one added, none rotated yet; rotation runs in `backup.sh`) |
| Caddyfile inode, host vs container | identical (1023330): the in-place write of #79 reaches the bind mount |

Still on the host and outside this project's retention: `alpine:3.20`, `curlimages/curl:8.10.1`
and an untagged `postgres:<none>` (420 MB). They belong to the cztechjobs housekeeping step
`images`, which the owner runs by hand.

First backup, run by hand by the owner at 17:25 UTC after installing the cron line
(`47 3 * * * /opt/codeguy/backup.sh >> /opt/codeguy/backups/backup.log 2>&1`, present in the
`karel` crontab):

| File | Size | Check |
| --- | --- | --- |
| `daily-20261022T172548Z.dump` | 124 019 B | `pg_restore --list` reads it, 23 `TABLE DATA` entries |
| `media-20261022T172548Z.tar.gz` | 434 333 B | `gzip -t` passes, 12 files, matching the volume |

`backups/backup.log` does not exist yet because the manual run wrote to the terminal; the first
cron run at 03:47 creates it.

Not measured: container log file sizes (need sudo) and the first scheduled run.
