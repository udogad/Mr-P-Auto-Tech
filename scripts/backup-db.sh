#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_FILE="${DATA_FILE:-$PROJECT_ROOT/server/data/db.json}"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/server/data/backups}"
KEEP_COUNT="${KEEP_COUNT:-30}"

if [[ ! -f "$DATA_FILE" ]]; then
  echo "Error: data file not found at $DATA_FILE" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_JSON="$BACKUP_DIR/db-$STAMP.json"
BACKUP_GZ="$BACKUP_JSON.gz"

cp "$DATA_FILE" "$BACKUP_JSON"
gzip -f "$BACKUP_JSON"

# Keep only the newest KEEP_COUNT backups.
# shellcheck disable=SC2012
ls -1t "$BACKUP_DIR"/db-*.json.gz 2>/dev/null | tail -n +$((KEEP_COUNT + 1)) | xargs -r rm -f

echo "Backup created: $BACKUP_GZ"
