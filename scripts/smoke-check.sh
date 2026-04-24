#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8787}"

check_json_has_keys() {
  local json="$1"
  shift
  printf '%s' "$json" | node -e '
    let input = "";
    process.stdin.on("data", (c) => (input += c));
    process.stdin.on("end", () => {
      const data = JSON.parse(input);
      const keys = process.argv.slice(1);
      for (const key of keys) {
        if (!(key in data)) {
          console.error(`Missing key: ${key}`);
          process.exit(1);
        }
      }
    });
  ' "$@"
}

echo "[1/4] Checking health endpoint..."
HEALTH_JSON="$(curl -fsS "$BASE_URL/api/health")"
check_json_has_keys "$HEALTH_JSON" ok ts

echo "[2/4] Checking public content endpoint..."
PUBLIC_JSON="$(curl -fsS "$BASE_URL/api/public/content")"
check_json_has_keys "$PUBLIC_JSON" settings services testimonials gallery

if [[ -n "${ADMIN_PASSWORD:-}" ]]; then
  echo "[3/4] Checking admin login endpoint..."
  LOGIN_JSON="$(curl -fsS -X POST "$BASE_URL/api/admin/login" \
    -H 'Content-Type: application/json' \
    --data "{\"password\":\"$ADMIN_PASSWORD\"}")"

  TOKEN="$(printf '%s' "$LOGIN_JSON" | node -e '
    let input = "";
    process.stdin.on("data", (c) => (input += c));
    process.stdin.on("end", () => {
      const data = JSON.parse(input);
      if (!data.token) process.exit(1);
      process.stdout.write(data.token);
    });
  ' 2>/dev/null || true)"

  if [[ -z "$TOKEN" ]]; then
    echo "Error: admin login failed. Set ADMIN_PASSWORD env correctly." >&2
    exit 1
  fi

  echo "[4/4] Checking admin bootstrap endpoint..."
  BOOTSTRAP_JSON="$(curl -fsS "$BASE_URL/api/admin/bootstrap" -H "Authorization: Bearer $TOKEN")"
  check_json_has_keys "$BOOTSTRAP_JSON" settings services testimonials gallery bookings messages
else
  echo "[3/4] Skipping admin checks (ADMIN_PASSWORD is not set)."
  echo "[4/4] Skipping admin checks (ADMIN_PASSWORD is not set)."
fi

echo "Smoke check passed for $BASE_URL"
