# Build, Deploy, and Operations Runbook

## 1. Environment Variables
Copy `.env.example` to `.env` and set values.

Required to secure production:
- `JWT_SECRET`: long random string
- `ADMIN_PASSWORD`: initial admin password
- `CORS_ORIGIN`: your frontend origin(s)

Defaults:
- `PORT=8787`
- `JWT_EXPIRES_IN=8h`
- `DATA_FILE=server/data/db.json`

## 2. Local Development
### Frontend only
```bash
npm run dev
```

### Backend only
```bash
npm run dev:api
```

### Full stack
```bash
npm run dev:full
```

URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787`

## 3. Build Process
### Build frontend assets
```bash
npm run build
```

Output:
- `dist/index.html`
- `dist/assets/*`

Backend behavior:
- If `dist/` exists, backend serves it and handles SPA fallback.

## 4. Production Deployment (Single Node Process)
### Step 1: Install dependencies (including dev dependencies for build)
```bash
npm ci
```

### Step 2: Build frontend
```bash
npm run build
```

### Step 3: Start backend
```bash
npm start
```

### Step 4: Put behind reverse proxy
Use Nginx/Caddy for:
- HTTPS
- domain routing
- request buffering/timeouts

Optional optimization:
- Build in CI/CD, deploy only `dist/` + runtime files + production dependencies.

## 5. PM2 Example
Use committed config file:
- `ecosystem.config.cjs`

```bash
npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Useful commands:
```bash
pm2 status
pm2 logs mrp-autotech
pm2 restart mrp-autotech
```

## 6. Nginx Reverse Proxy Example
```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then add TLS via Certbot/Caddy.

## 7. Data Backup and Recovery
Data file:
- `server/data/db.json`

Backup script:
- `scripts/backup-db.sh`

### Backup
- Copy this file regularly (hourly/daily based on traffic).
- Keep at least off-server backups.

Manual backup command:
```bash
./scripts/backup-db.sh
```

Cron backup example (daily at 02:10):
```bash
10 2 * * * cd /path/to/mrp-autotech && ./scripts/backup-db.sh >> /var/log/mrp-autotech-backup.log 2>&1
```

### Restore
1. Stop app process.
2. Replace `server/data/db.json` with backup file.
3. Start app process.
4. Verify with `GET /api/health` and admin login.

## 8. Security Checklist (Production)
- Use strong `JWT_SECRET`.
- Rotate default `ADMIN_PASSWORD` immediately.
- Run behind HTTPS only.
- Restrict CORS to known origins.
- Restrict server access and keep host patched.
- Protect backups (they include business/customer data).

## 9. Release Checklist
Before each release:
1. Run pre-deploy checklist:
```bash
./scripts/deploy-checklist.sh
```
2. Backup current data:
```bash
./scripts/backup-db.sh
```
3. Deploy and restart process.
4. Run live smoke check:
```bash
BASE_URL=https://example.com ADMIN_PASSWORD='your-password' ./scripts/smoke-check.sh
```
5. Verify live site and admin path manually.

## 10. Troubleshooting
### API returns 401 on admin requests
- Token missing/expired.
- Re-login at `/admin/login`.

### CORS errors in browser
- Ensure `CORS_ORIGIN` includes exact frontend origin.

### Changes not persisting
- Check write permissions for `server/data/`.
- Confirm correct `DATA_FILE` path.

### Server starts but UI is blank
- Ensure `dist/` exists when serving frontend from backend.
- If frontend hosted separately, set `VITE_API_BASE_URL` correctly.

### Password no longer works
- `ADMIN_PASSWORD` is used only when `db.json` is first created.
- On an existing database, rotate password through admin settings UI.
- If locked out and UI reset is impossible, restore from backup or manually update `admin.passwordHash` in `db.json`.
