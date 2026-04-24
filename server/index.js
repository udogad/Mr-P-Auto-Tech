import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import {
  initStore,
  getPublicSnapshot,
  getAdminSnapshot,
  verifyAdminPassword,
  updateAdminPassword,
  updateSettings,
  updateServiceById,
  resetServicesToDefaults,
  addTestimonial,
  updateTestimonialById,
  deleteTestimonialById,
  addGalleryItem,
  updateGalleryItemById,
  deleteGalleryItemById,
  createBooking,
  updateBookingStatusById,
  deleteBookingById,
  createContactMessage,
} from './store.js'
import { requireAdminAuth, signAdminToken } from './auth.js'

const app = express()
const PORT = Number(process.env.PORT || 8787)
const DIST_PATH = path.resolve(process.cwd(), 'dist')
const CORS_ORIGIN = process.env.CORS_ORIGIN

initStore()

app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: CORS_ORIGIN ? CORS_ORIGIN.split(',').map((item) => item.trim()) : true,
  })
)

const bookingRateMap = new Map()
const BOOKING_LIMIT_WINDOW_MS = 5 * 60 * 1000
const BOOKING_LIMIT_COUNT = 5

function sanitizeText(value, max = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function getClientKey(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

function enforceBookingRateLimit(req, res, next) {
  const key = getClientKey(req)
  const now = Date.now()
  const history = bookingRateMap.get(key) || []
  const validHistory = history.filter((timestamp) => now - timestamp <= BOOKING_LIMIT_WINDOW_MS)

  if (validHistory.length >= BOOKING_LIMIT_COUNT) {
    return res.status(429).json({ error: 'Too many booking attempts. Try again in a few minutes.' })
  }

  validHistory.push(now)
  bookingRateMap.set(key, validHistory)
  return next()
}

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true, ts: new Date().toISOString() })
})

app.get('/api/public/content', (_req, res) => {
  return res.json(getPublicSnapshot())
})

app.post('/api/public/bookings', enforceBookingRateLimit, (req, res) => {
  const payload = req.body || {}
  const firstName = sanitizeText(payload.firstName, 80)
  const lastName = sanitizeText(payload.lastName, 80)
  const phone = sanitizeText(payload.phone, 40)
  const email = sanitizeText(payload.email, 120)
  const vehicleMake = sanitizeText(payload.vehicleMake, 80)
  const vehicleModel = sanitizeText(payload.vehicleModel, 80)
  const vehicleYear = sanitizeText(payload.vehicleYear, 12)
  const service = sanitizeText(payload.service, 120)
  const preferredDate = sanitizeText(payload.preferredDate, 20)
  const notes = sanitizeText(payload.notes, 2000)

  if (!firstName || !phone || !vehicleMake || !service || !preferredDate) {
    return res.status(400).json({ error: 'Missing required booking fields.' })
  }

  const booking = createBooking({
    firstName,
    lastName,
    phone,
    email,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    service,
    preferredDate,
    notes,
  })

  return res.status(201).json({ booking })
})

app.post('/api/public/contact', (req, res) => {
  const payload = req.body || {}
  const name = sanitizeText(payload.name, 120)
  const phone = sanitizeText(payload.phone, 40)
  const subject = sanitizeText(payload.subject, 200)
  const message = sanitizeText(payload.message, 2000)

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' })
  }

  const saved = createContactMessage({ name, phone, subject, message })
  return res.status(201).json({ message: saved })
})

app.post('/api/admin/login', (req, res) => {
  const password = sanitizeText(req.body?.password || '', 256)
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' })
  }

  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const token = signAdminToken()
  return res.json({ token })
})

app.get('/api/admin/me', requireAdminAuth, (_req, res) => {
  return res.json({ ok: true })
})

app.get('/api/admin/bootstrap', requireAdminAuth, (_req, res) => {
  return res.json(getAdminSnapshot())
})

app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
  const updates = req.body || {}
  const next = updateSettings(updates)
  return res.json({ settings: next })
})

app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  const currentPassword = sanitizeText(req.body?.currentPassword || '', 256)
  const newPassword = sanitizeText(req.body?.newPassword || '', 256)

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' })
  }
  if (!verifyAdminPassword(currentPassword)) {
    return res.status(401).json({ error: 'Current password is incorrect.' })
  }

  updateAdminPassword(newPassword)
  return res.json({ ok: true })
})

app.put('/api/admin/services/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const updates = {
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'icon') ? { icon: sanitizeText(req.body.icon, 8) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'title') ? { title: sanitizeText(req.body.title, 120) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'description')
      ? { description: sanitizeText(req.body.description, 1200) }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'visible') ? { visible: Boolean(req.body.visible) } : {}),
  }

  const updated = updateServiceById(id, updates)
  if (!updated) return res.status(404).json({ error: 'Service not found.' })
  return res.json({ service: updated })
})

app.post('/api/admin/services/reset', requireAdminAuth, (_req, res) => {
  const services = resetServicesToDefaults()
  return res.json({ services })
})

app.post('/api/admin/testimonials', requireAdminAuth, (req, res) => {
  const name = sanitizeText(req.body?.name, 120)
  const text = sanitizeText(req.body?.text, 2000)

  if (!name || !text) {
    return res.status(400).json({ error: 'Name and review text are required.' })
  }

  const testimonial = addTestimonial({
    name,
    role: sanitizeText(req.body?.role, 120),
    text,
    stars: Math.max(1, Math.min(5, Number(req.body?.stars) || 5)),
    visible: req.body?.visible !== false,
  })

  return res.status(201).json({ testimonial })
})

app.put('/api/admin/testimonials/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const updated = updateTestimonialById(id, {
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'name') ? { name: sanitizeText(req.body.name, 120) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'role') ? { role: sanitizeText(req.body.role, 120) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'text') ? { text: sanitizeText(req.body.text, 2000) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'stars')
      ? { stars: Math.max(1, Math.min(5, Number(req.body.stars) || 5)) }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'visible') ? { visible: Boolean(req.body.visible) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'avatarUrl')
      ? { avatarUrl: sanitizeText(req.body.avatarUrl, 2000) }
      : {}),
  })
  if (!updated) return res.status(404).json({ error: 'Testimonial not found.' })
  return res.json({ testimonial: updated })
})

app.delete('/api/admin/testimonials/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const deleted = deleteTestimonialById(id)
  if (!deleted) return res.status(404).json({ error: 'Testimonial not found.' })
  return res.json({ ok: true })
})

app.post('/api/admin/gallery', requireAdminAuth, (req, res) => {
  const url = sanitizeText(req.body?.url, 2000)
  const title = sanitizeText(req.body?.title, 120)
  const category = sanitizeText(req.body?.category, 80) || 'Other'

  if (!url || !title) {
    return res.status(400).json({ error: 'Image URL and title are required.' })
  }

  const item = addGalleryItem({
    url,
    title,
    category,
    visible: req.body?.visible !== false,
  })
  return res.status(201).json({ item })
})

app.put('/api/admin/gallery/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const updated = updateGalleryItemById(id, {
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'url') ? { url: sanitizeText(req.body.url, 2000) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'title') ? { title: sanitizeText(req.body.title, 120) } : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'category')
      ? { category: sanitizeText(req.body.category, 80) || 'Other' }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'visible') ? { visible: Boolean(req.body.visible) } : {}),
  })
  if (!updated) return res.status(404).json({ error: 'Gallery item not found.' })
  return res.json({ item: updated })
})

app.delete('/api/admin/gallery/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const deleted = deleteGalleryItemById(id)
  if (!deleted) return res.status(404).json({ error: 'Gallery item not found.' })
  return res.json({ ok: true })
})

app.put('/api/admin/bookings/:id/status', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const status = sanitizeText(req.body?.status, 40)
  const booking = updateBookingStatusById(id, status)

  if (!booking) return res.status(404).json({ error: 'Booking not found or invalid status.' })
  return res.json({ booking })
})

app.delete('/api/admin/bookings/:id', requireAdminAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80)
  const deleted = deleteBookingById(id)
  if (!deleted) return res.status(404).json({ error: 'Booking not found.' })
  return res.json({ ok: true })
})

app.get('/api/admin/messages', requireAdminAuth, (_req, res) => {
  const { messages } = getAdminSnapshot()
  return res.json({ messages })
})

app.use('/api', (_req, res) => {
  return res.status(404).json({ error: 'API endpoint not found.' })
})

if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    return res.sendFile(path.join(DIST_PATH, 'index.html'))
  })
}

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled error:', error)
  return res.status(500).json({ error: 'Internal server error.' })
})

app.listen(PORT, () => {
  console.log(`[server] API running on http://localhost:${PORT}`)
})
