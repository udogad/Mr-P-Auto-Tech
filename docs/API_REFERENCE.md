# API Reference

Base URL:
- Development with Vite proxy: use relative `/api/...`
- Direct backend URL (optional): `http://localhost:8787`

Content type:
- Request: `application/json`
- Response: `application/json`

Error format:
```json
{ "error": "Human-readable message" }
```

Auth:
- Admin endpoints require `Authorization: Bearer <jwt>`.

## Health
### `GET /api/health`
Response:
```json
{ "ok": true, "ts": "2026-04-24T13:18:23.976Z" }
```

## Public Endpoints

### `GET /api/public/content`
Returns public-facing content snapshot.

Response shape:
```json
{
  "settings": { "businessName": "..." },
  "services": [{ "id": "svc-1", "visible": true }],
  "testimonials": [{ "id": "tst-1", "visible": true }],
  "gallery": [{ "id": "gal-1", "visible": true }]
}
```

### `POST /api/public/bookings`
Creates a booking.

Required fields:
- `firstName`
- `phone`
- `vehicleMake`
- `service`
- `preferredDate`

Optional fields:
- `lastName`, `email`, `vehicleModel`, `vehicleYear`, `notes`

Example request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "08000000000",
  "email": "john@example.com",
  "vehicleMake": "Toyota",
  "vehicleModel": "Corolla",
  "vehicleYear": "2018",
  "service": "Advanced Diagnostics",
  "preferredDate": "2026-05-01",
  "notes": "Engine light is on"
}
```

Success response (`201`):
```json
{
  "booking": {
    "id": "BK-1777036732575",
    "status": "pending",
    "createdAt": "2026-04-24T13:00:00.000Z"
  }
}
```

Possible errors:
- `400` missing required fields
- `429` booking rate limit hit

Rate limit:
- 5 booking requests per IP per 5 minutes.

### `POST /api/public/contact`
Creates a contact message.

Required fields:
- `name`
- `message`

Optional fields:
- `phone`, `subject`

Success response (`201`):
```json
{
  "message": {
    "id": "msg-...",
    "name": "Jane",
    "message": "...",
    "createdAt": "2026-04-24T13:00:00.000Z"
  }
}
```

Possible errors:
- `400` if `name` or `message` is missing

## Admin Auth Endpoints

### `POST /api/admin/login`
Authenticates admin and returns JWT.

Request:
```json
{ "password": "your-password" }
```

Success response:
```json
{ "token": "<jwt>" }
```

Possible errors:
- `400` missing password
- `401` incorrect password

### `GET /api/admin/me`
Validates token.

Success response:
```json
{ "ok": true }
```

Possible errors:
- `401` missing/invalid/expired token

### `GET /api/admin/bootstrap`
Returns full admin data snapshot.

Response:
```json
{
  "settings": {},
  "services": [],
  "testimonials": [],
  "gallery": [],
  "bookings": [],
  "messages": []
}
```

## Admin Content Endpoints

### `PUT /api/admin/settings`
Updates allowed settings fields.

Response:
```json
{ "settings": { "businessName": "..." } }
```

### `POST /api/admin/change-password`
Changes admin password.

Request:
```json
{
  "currentPassword": "old-pass",
  "newPassword": "new-pass"
}
```

Rules:
- `newPassword` minimum 6 chars

Responses:
- `200` `{ "ok": true }`
- `400` validation errors
- `401` current password invalid

### `PUT /api/admin/services/:id`
Updates one service.

Allowed fields:
- `icon`, `title`, `description`, `visible`

Response:
```json
{ "service": { "id": "svc-1", "title": "..." } }
```

Errors:
- `404` service not found

### `POST /api/admin/services/reset`
Resets services to defaults.

Response:
```json
{ "services": [ ... ] }
```

### `POST /api/admin/testimonials`
Creates testimonial.

Required:
- `name`, `text`

Optional:
- `role`, `stars`, `visible`

Response:
```json
{ "testimonial": { "id": "tst-..." } }
```

### `PUT /api/admin/testimonials/:id`
Updates testimonial.

Allowed fields:
- `name`, `role`, `text`, `stars`, `visible`, `avatarUrl`

Response:
```json
{ "testimonial": { "id": "tst-..." } }
```

Errors:
- `404` testimonial not found

### `DELETE /api/admin/testimonials/:id`
Deletes testimonial.

Response:
```json
{ "ok": true }
```

Errors:
- `404` testimonial not found

### `POST /api/admin/gallery`
Creates gallery item.

Required:
- `url`, `title`

Optional:
- `category`, `visible`

Response:
```json
{ "item": { "id": "gal-..." } }
```

### `PUT /api/admin/gallery/:id`
Updates gallery item.

Allowed fields:
- `url`, `title`, `category`, `visible`

Response:
```json
{ "item": { "id": "gal-..." } }
```

Errors:
- `404` gallery item not found

### `DELETE /api/admin/gallery/:id`
Deletes gallery item.

Response:
```json
{ "ok": true }
```

Errors:
- `404` gallery item not found

### `PUT /api/admin/bookings/:id/status`
Updates booking status.

Allowed statuses:
- `pending`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`

Request:
```json
{ "status": "confirmed" }
```

Response:
```json
{ "booking": { "id": "BK-...", "status": "confirmed" } }
```

Errors:
- `404` booking not found or status invalid

### `DELETE /api/admin/bookings/:id`
Deletes booking.

Response:
```json
{ "ok": true }
```

Errors:
- `404` booking not found

### `GET /api/admin/messages`
Returns contact messages for admin.

Response:
```json
{ "messages": [ ... ] }
```

## Not Found
### `ANY /api/*` (unmatched)
Response:
```json
{ "error": "API endpoint not found." }
```

