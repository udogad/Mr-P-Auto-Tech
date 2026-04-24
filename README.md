# MR P Auto Tech Ltd — Website

Production-ready React + Node.js website for MR P Auto Tech Ltd, with:
- Public marketing site
- Admin dashboard
- Persistent server-side data storage
- Token-based admin authentication

## Tech Stack
- Frontend: React + Vite
- Backend API: Express
- Persistence: File-backed JSON database (`server/data/db.json`)
- Auth: JWT + bcrypt password hashing

## Requirements
- Node.js v18+
- npm v9+

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update secure values in `.env` before production:
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `CORS_ORIGIN`

## Run (Development)
- Frontend only:
```bash
npm run dev
```

- Backend API only:
```bash
npm run dev:api
```

- Frontend + backend together:
```bash
npm run dev:full
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8787`

## Build Frontend
```bash
npm run build
```

## Run Backend (Production)
```bash
npm start
```

If `dist/` exists, the backend also serves the built frontend.

## Admin Access
- URL: `/admin`
- Default password (if unchanged): `mrpauto2025`

Change the password immediately in `Admin -> Settings -> Admin Password`.

## What Is Persisted
Server-side data is persisted in `server/data/db.json`:
- Bookings
- Contact messages
- Services
- Gallery items
- Testimonials
- Site settings
- Admin password hash

## API Overview
- Public:
  - `GET /api/public/content`
  - `POST /api/public/bookings`
  - `POST /api/public/contact`
- Admin:
  - `POST /api/admin/login`
  - `GET /api/admin/me`
  - `GET /api/admin/bootstrap`
  - CRUD endpoints for settings, services, testimonials, gallery, bookings
  - `POST /api/admin/change-password`

## Deployment Notes
- For production, run the backend (`npm start`) behind a process manager (PM2/systemd).
- Use HTTPS and a reverse proxy (Nginx/Caddy).
- Set a strong `JWT_SECRET` and `ADMIN_PASSWORD`.
- Backup `server/data/db.json` regularly.

