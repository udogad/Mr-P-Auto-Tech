# MR P Auto Tech Ltd — Website

Production-ready React + Node.js website for MR P Auto Tech Ltd.

Core capabilities:
- Public marketing site
- Admin dashboard
- Persistent server-side storage
- JWT-based admin authentication

## Documentation Map
If you need full technical coverage, use these docs:
- [Documentation Index](./docs/README.md)
- [Feature Flows](./docs/FEATURE_FLOWS.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Build, Deploy, and Operations Runbook](./docs/BUILD_DEPLOY_RUNBOOK.md)

## Stack
- Frontend: React + Vite
- Backend: Express
- Persistence: JSON file database (`server/data/db.json`)
- Auth: bcrypt + JWT

## Requirements
- Node.js v18+
- npm v9+

## Setup
```bash
npm install
cp .env.example .env
```

Before production, set secure values in `.env`:
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `CORS_ORIGIN`

Note:
- `ADMIN_PASSWORD` is only used when the data file is first created.
- After first boot, use Admin Settings to rotate password.

## Scripts
- `npm run dev`: frontend (Vite)
- `npm run dev:api`: backend API
- `npm run dev:full`: frontend + backend concurrently
- `npm run build`: frontend build to `dist/`
- `npm start`: backend server (serves `dist/` if present)

## Development URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787`

## Feature Coverage
Documented end-to-end feature flows include:
- Public content load
- Booking submission
- Contact message submission
- Admin login/session validation
- Admin dashboard bootstrap
- Admin CRUD for bookings, services, gallery, testimonials, settings
- Admin password rotation

See full details in [Feature Flows](./docs/FEATURE_FLOWS.md).

## API
Endpoint contracts, validation, statuses, and response shapes are in:
- [API Reference](./docs/API_REFERENCE.md)

## Build and Deployment
Production build, process manager setup, reverse proxy guidance, backup/restore, and runbook:
- [Build, Deploy, and Operations Runbook](./docs/BUILD_DEPLOY_RUNBOOK.md)

## Data and Persistence
Server-side persisted data:
- Settings
- Services
- Testimonials
- Gallery
- Bookings
- Contact messages
- Admin password hash

Storage location (default):
- `server/data/db.json`

## Security Notes
- Change default admin password immediately.
- Use strong `JWT_SECRET` in production.
- Run behind HTTPS reverse proxy.
- Backup `db.json` regularly.
