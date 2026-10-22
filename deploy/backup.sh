#!/bin/sh
# Nightly backup of the codeguy.cz stack: the Payload database and the uploaded media.
#
# The deploy installs this file as /opt/codeguy/backup.sh next to compose.yaml and .env.
# It runs from the host crontab of the deploy user, half an hour after the cztechjobs
# backup so the two pg_dump runs never share the 2 vCPU host:
#
#   47 3 * * * /opt/codeguy/backup.sh >> /opt/codeguy/backups/backup.log 2>&1
#
# Writes backups/daily-<UTC timestamp>.dump (pg_dump custom format; restore with
# pg_restore) and backups/media-<UTC timestamp>.tar.gz (the media_data volume, taken
# from the running app container). Keeps both for 14 days and keeps the 10 newest
# predeploy-*.dump files that the CI deploy writes before each release.
#
# The dumps hold the Payload accounts (password hashes) and the editorial content:
# the directory is 0700, the files 0600, and any copy that leaves this host must be
# encrypted first (age or gpg). See docs/deployment.md, "Backups".
#
# Everything here stays inside the Compose project in this directory. It never
# touches /opt/cztechjobs, other containers or Docker images.

set -eu

cd "$(dirname "$0")"
umask 077

mkdir -p backups
chmod 700 backups

log() {
	printf '%s backup: %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"
}

ts=$(date -u +%Y%m%dT%H%M%SZ)
db_partial="backups/.daily-$ts.partial"
db_final="backups/daily-$ts.dump"
media_partial="backups/.media-$ts.partial"
media_final="backups/media-$ts.tar.gz"

# A failed or interrupted backup must never look like a finished one.
trap 'rm -f "$db_partial" "$media_partial"' EXIT
trap 'exit 1' HUP INT TERM

log "dumping database to $db_final"
docker compose exec -T database sh -c \
	'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=custom' \
	>"$db_partial"

if ! test -s "$db_partial"; then
	log "database dump is empty, keeping previous backups untouched"
	exit 1
fi
mv "$db_partial" "$db_final"
log "wrote $db_final ($(wc -c <"$db_final" | tr -d ' ') bytes)"

# One command, no pipe: POSIX sh reports the exit status of the last command of a
# pipeline, so `tar ... | gzip` would turn a failed exec or tar into a valid, almost
# empty archive. tar and gzip are essential packages in the Debian-based app image.
log "archiving media to $media_final"
docker compose exec -T app tar -C /app/public/media -czf - . >"$media_partial"

if ! test -s "$media_partial" || ! gzip -t "$media_partial" 2>/dev/null; then
	log "media archive is empty or corrupt, keeping previous backups untouched"
	exit 1
fi
mv "$media_partial" "$media_final"
log "wrote $media_final ($(wc -c <"$media_final" | tr -d ' ') bytes)"

# Retention: daily dumps and media archives older than 14 days.
find backups -maxdepth 1 -type f \( -name 'daily-*.dump' -o -name 'media-*.tar.gz' \) -mtime +13 -exec rm -f {} +

# Retention: the 10 newest pre-deploy dumps. Names are predeploy-<git sha>.dump (no
# whitespace), so ls -t is safe here and sorts by age, which the name does not.
# shellcheck disable=SC2012
ls -1t backups/predeploy-*.dump 2>/dev/null | tail -n +11 | while IFS= read -r old; do
	rm -f -- "$old"
	log "removed $old"
done

log "done"
