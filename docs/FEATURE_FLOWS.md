# Feature Flows

This document describes how each user-facing and admin feature works end-to-end.

## 1. Public Site Content Load
1. Browser loads React app.
2. `SiteContext` requests `GET /api/public/content`.
3. Backend returns:
   - `settings`
   - `services` filtered to `visible=true`
   - `testimonials` filtered to `visible=true`
   - `gallery` filtered to `visible=true`
4. Public pages render from this payload.

Operational result: all visitors see the same server-backed content.

## 2. Booking Submission Flow
1. User fills booking form in `Booking` section.
2. Frontend validates required fields:
   - `firstName`
   - `phone`
   - `vehicleMake`
   - `service`
   - `preferredDate`
3. Frontend sends `POST /api/public/bookings`.
4. Backend sanitizes fields and enforces booking rate-limit:
   - max 5 requests per IP per 5 minutes.
5. Backend creates booking with:
   - `id` like `BK-<timestamp>`
   - `status: pending`
   - `createdAt`
6. Booking is saved to `server/data/db.json`.
7. Frontend shows booking success with reference ID.

Operational result: booking is durable and visible in admin panel from any device.

## 3. Contact Message Flow
1. User submits contact form.
2. Frontend validates required fields:
   - `name`
   - `message`
3. Frontend calls `POST /api/public/contact`.
4. Backend sanitizes values, assigns message ID (`msg-*`), timestamps it, and stores it in `db.json`.
5. Frontend shows success state.

Operational result: messages are persisted server-side and can be accessed via admin API.

## 4. Admin Authentication Flow
1. Admin opens `/admin/login`.
2. Frontend submits `POST /api/admin/login` with password.
3. Backend verifies password hash (bcrypt).
4. On success backend returns JWT token.
5. Frontend stores token in localStorage (`mrp_admin_token`).
6. Frontend validates token with `GET /api/admin/me` and considers session active if valid.
7. Protected routes are unlocked only when boot is complete and auth is valid.

Session model:
- Stateless JWT, default expiry from `JWT_EXPIRES_IN` (default `8h`).

## 5. Admin Bootstrap Flow
1. After login, frontend requests `GET /api/admin/bootstrap` with Bearer token.
2. Backend returns full admin snapshot:
   - `settings`
   - all `services`
   - all `testimonials`
   - all `gallery`
   - all `bookings`
   - all `messages`
3. Admin pages render from this snapshot.

Operational result: dashboard state is synchronized to server truth.

## 6. Admin Feature Flows

### 6.1 Dashboard
- Shows counts and recent bookings from admin snapshot.
- No direct write operations.

### 6.2 Bookings Management
Actions:
- Update booking status via `PUT /api/admin/bookings/:id/status`.
- Delete booking via `DELETE /api/admin/bookings/:id`.

Effects:
- Server updates `db.json`.
- UI updates in-place and shows toast.

### 6.3 Gallery Management
Actions:
- Add image via `POST /api/admin/gallery`.
- Edit/toggle visibility via `PUT /api/admin/gallery/:id`.
- Delete via `DELETE /api/admin/gallery/:id`.

Effects:
- `visible` controls public visibility.
- Public gallery updates on next public content refresh.

### 6.4 Testimonials Management
Actions:
- Add via `POST /api/admin/testimonials`.
- Edit/toggle visibility via `PUT /api/admin/testimonials/:id`.
- Delete via `DELETE /api/admin/testimonials/:id`.

Effects:
- Public testimonials only include `visible=true`.

### 6.5 Services Management
Actions:
- Edit one service via `PUT /api/admin/services/:id`.
- Reset all services to defaults via `POST /api/admin/services/reset`.

Effects:
- Public services list is driven from these records.
- Booking service options are generated from visible services.

### 6.6 Settings Management
Actions:
- Save business/home/stats/social/map settings via `PUT /api/admin/settings`.
- Change admin password via `POST /api/admin/change-password`.

Effects:
- Public content reflects updated settings.
- Password change updates bcrypt hash in server storage.

## 7. Persistence Model
Single source of truth is `server/data/db.json`.

Persisted sections:
- `admin.passwordHash`
- `settings`
- `services`
- `testimonials`
- `gallery`
- `bookings`
- `messages`
- `meta.createdAt` / `meta.updatedAt`

## 8. Public vs Admin Visibility Rules
- Public content endpoint excludes hidden items.
- Admin bootstrap endpoint returns all items, visible or hidden.

## 9. Error Handling UX
- Frontend surfaces backend validation/auth errors as toast or inline error text.
- Auth failures clear invalid token and force re-login.
- API returns structured `{ error: string }` responses for client display.

