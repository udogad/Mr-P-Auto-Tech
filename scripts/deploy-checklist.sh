#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
DATA_DIR="${DATA_DIR:-$PROJECT_ROOT/server/data}"

echo "== MRP Autotech deployment checklist =="

echo "[1] Node and npm"
node -v
npm -v

echo "[2] Environment file"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env file at $ENV_FILE" >&2
  exit 1
fi

if grep -q "JWT_SECRET=replace-with-a-long-random-secret" "$ENV_FILE"; then
  echo "JWT_SECRET is still placeholder in .env" >&2
  exit 1
fi

echo "[3] Writable data directory"
mkdir -p "$DATA_DIR"
if [[ ! -w "$DATA_DIR" ]]; then
  echo "Data directory is not writable: $DATA_DIR" >&2
  exit 1
fi

echo "[4] Install and build"
npm ci
npm run build

echo "[5] Optional smoke check"
if [[ -n "${BASE_URL:-}" ]]; then
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-}" BASE_URL="$BASE_URL" "$PROJECT_ROOT/scripts/smoke-check.sh"
else
  echo "Skipped smoke check (set BASE_URL to run it)."
fi

echo "Checklist completed successfully."
