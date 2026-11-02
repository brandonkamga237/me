#!/usr/bin/env bash
# Dumps the production database to backups/ next to the compose file, keeping the last 14 dumps.
# Works from the repository (infra/) and from the deployment directory, which mirrors it.
# Run it daily from cron, for instance: 0 4 * * * /root/me/scripts/backup.sh
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p backups
file="backups/me-$(date -u +%Y%m%dT%H%M%SZ).archive.gz"

# shellcheck disable=SC2016 # expanded inside the container, where the variables live
docker compose -f docker-compose.prod.yml exec -T mongo sh -c \
  'mongodump --quiet --archive --gzip --db "$MONGO_DB" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin' \
  > "$file"

ls -1t backups/me-*.archive.gz | tail -n +15 | xargs -r rm --
echo "Saved $(pwd)/$file"
