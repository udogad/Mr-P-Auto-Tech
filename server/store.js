import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import {
  DEFAULT_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_GALLERY,
  VALID_BOOKING_STATUSES,
} from './defaults.js'

const DATA_FILE = process.env.DATA_FILE || path.resolve(process.cwd(), 'server/data/db.json')
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mrpauto2025'

const SETTINGS_FIELDS = [
  'businessName',
  'tagline',
  'phone',
  'whatsapp',
  'email',
  'address',
  'mapEmbedSrc',
  'hoursWeekday',
  'hoursSunday',
  'facebook',
  'instagram',
  'heroTitle',
  'heroSubtitle',
  'yearsExperience',
  'carsServiced',
  'satisfaction',
  'technicians',
]

let db = null

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function nowIso() {
  return new Date().toISOString()
}

function createId(prefix) {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${rand}`
}

function normalizeArray(value, fallback) {
  return Array.isArray(value) ? value : deepClone(fallback)
}

function persist() {
  if (!db) return
  db.meta.updatedAt = nowIso()
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
}

function createSeedData() {
  const ts = nowIso()
  return {
    meta: {
      createdAt: ts,
      updatedAt: ts,
    },
    admin: {
      passwordHash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
    },
    settings: deepClone(DEFAULT_SETTINGS),
    services: deepClone(DEFAULT_SERVICES),
    testimonials: deepClone(DEFAULT_TESTIMONIALS),
    gallery: deepClone(DEFAULT_GALLERY),
    bookings: [],
    messages: [],
  }
}

function normalizeLoadedData(input) {
  const seed = createSeedData()
  const normalized = {
    meta: {
      createdAt: input?.meta?.createdAt || seed.meta.createdAt,
      updatedAt: input?.meta?.updatedAt || seed.meta.updatedAt,
    },
    admin: {
      passwordHash: input?.admin?.passwordHash || seed.admin.passwordHash,
    },
    settings: { ...seed.settings, ...(input?.settings || {}) },
    services: normalizeArray(input?.services, seed.services),
    testimonials: normalizeArray(input?.testimonials, seed.testimonials),
    gallery: normalizeArray(input?.gallery, seed.gallery),
    bookings: normalizeArray(input?.bookings, seed.bookings),
    messages: normalizeArray(input?.messages, seed.messages),
  }
  return normalized
}

export function initStore() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })

  if (!fs.existsSync(DATA_FILE)) {
    db = createSeedData()
    persist()
    return
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    db = normalizeLoadedData(parsed)
    persist()
  } catch (error) {
    console.error('[store] Failed to read data file, reseeding:', error)
    db = createSeedData()
    persist()
  }
}

function ensureStore() {
  if (!db) initStore()
}

function publicSettings() {
  return deepClone(db.settings)
}

function sortBookingsNewestFirst(bookings) {
  return deepClone(bookings).sort((a, b) => {
    const aTs = new Date(a.createdAt || 0).getTime()
    const bTs = new Date(b.createdAt || 0).getTime()
    return bTs - aTs
  })
}

export function getPublicSnapshot() {
  ensureStore()
  return {
    settings: publicSettings(),
    services: deepClone(db.services.filter((item) => item.visible)),
    testimonials: deepClone(db.testimonials.filter((item) => item.visible)),
    gallery: deepClone(db.gallery.filter((item) => item.visible)),
  }
}

export function getAdminSnapshot() {
  ensureStore()
  return {
    settings: publicSettings(),
    services: deepClone(db.services),
    testimonials: deepClone(db.testimonials),
    gallery: deepClone(db.gallery),
    bookings: sortBookingsNewestFirst(db.bookings),
    messages: sortBookingsNewestFirst(db.messages),
  }
}

export function verifyAdminPassword(password) {
  ensureStore()
  return bcrypt.compareSync(password, db.admin.passwordHash)
}

export function updateAdminPassword(nextPassword) {
  ensureStore()
  db.admin.passwordHash = bcrypt.hashSync(nextPassword, 10)
  persist()
}

export function updateSettings(updates) {
  ensureStore()
  for (const field of SETTINGS_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      db.settings[field] = updates[field]
    }
  }
  persist()
  return publicSettings()
}

export function updateServiceById(id, updates) {
  ensureStore()
  const index = db.services.findIndex((item) => item.id === id)
  if (index === -1) return null
  const current = db.services[index]
  db.services[index] = {
    ...current,
    ...(Object.prototype.hasOwnProperty.call(updates, 'icon') ? { icon: updates.icon } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'title') ? { title: updates.title } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'description') ? { description: updates.description } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'visible') ? { visible: Boolean(updates.visible) } : {}),
  }
  persist()
  return deepClone(db.services[index])
}

export function resetServicesToDefaults() {
  ensureStore()
  db.services = deepClone(DEFAULT_SERVICES)
  persist()
  return deepClone(db.services)
}

export function addTestimonial(input) {
  ensureStore()
  const newItem = {
    id: createId('tst'),
    name: input.name,
    role: input.role || '',
    text: input.text,
    stars: Number(input.stars) || 5,
    visible: input.visible !== false,
  }
  db.testimonials.push(newItem)
  persist()
  return deepClone(newItem)
}

export function updateTestimonialById(id, updates) {
  ensureStore()
  const index = db.testimonials.findIndex((item) => item.id === id)
  if (index === -1) return null
  const current = db.testimonials[index]
  db.testimonials[index] = {
    ...current,
    ...(Object.prototype.hasOwnProperty.call(updates, 'name') ? { name: updates.name } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'role') ? { role: updates.role } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'text') ? { text: updates.text } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'stars') ? { stars: Number(updates.stars) || 5 } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'visible') ? { visible: Boolean(updates.visible) } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'avatarUrl') ? { avatarUrl: updates.avatarUrl } : {}),
  }
  persist()
  return deepClone(db.testimonials[index])
}

export function deleteTestimonialById(id) {
  ensureStore()
  const before = db.testimonials.length
  db.testimonials = db.testimonials.filter((item) => item.id !== id)
  const deleted = before !== db.testimonials.length
  if (deleted) persist()
  return deleted
}

export function addGalleryItem(input) {
  ensureStore()
  const newItem = {
    id: createId('gal'),
    url: input.url || '',
    title: input.title || '',
    category: input.category || 'Other',
    visible: input.visible !== false,
  }
  db.gallery.push(newItem)
  persist()
  return deepClone(newItem)
}

export function updateGalleryItemById(id, updates) {
  ensureStore()
  const index = db.gallery.findIndex((item) => item.id === id)
  if (index === -1) return null
  const current = db.gallery[index]
  db.gallery[index] = {
    ...current,
    ...(Object.prototype.hasOwnProperty.call(updates, 'url') ? { url: updates.url } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'title') ? { title: updates.title } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'category') ? { category: updates.category } : {}),
    ...(Object.prototype.hasOwnProperty.call(updates, 'visible') ? { visible: Boolean(updates.visible) } : {}),
  }
  persist()
  return deepClone(db.gallery[index])
}

export function deleteGalleryItemById(id) {
  ensureStore()
  const before = db.gallery.length
  db.gallery = db.gallery.filter((item) => item.id !== id)
  const deleted = before !== db.gallery.length
  if (deleted) persist()
  return deleted
}

export function createBooking(input) {
  ensureStore()
  const booking = {
    id: `BK-${Date.now()}`,
    firstName: input.firstName,
    lastName: input.lastName || '',
    name: `${input.firstName} ${input.lastName || ''}`.trim(),
    phone: input.phone,
    email: input.email || '',
    vehicleMake: input.vehicleMake,
    vehicleModel: input.vehicleModel || '',
    vehicleYear: input.vehicleYear || '',
    service: input.service,
    preferredDate: input.preferredDate,
    notes: input.notes || '',
    status: 'pending',
    createdAt: nowIso(),
  }
  db.bookings.unshift(booking)
  persist()
  return deepClone(booking)
}

export function updateBookingStatusById(id, status) {
  ensureStore()
  if (!VALID_BOOKING_STATUSES.has(status)) return null
  const index = db.bookings.findIndex((item) => item.id === id)
  if (index === -1) return null
  db.bookings[index] = {
    ...db.bookings[index],
    status,
    updatedAt: nowIso(),
  }
  persist()
  return deepClone(db.bookings[index])
}

export function deleteBookingById(id) {
  ensureStore()
  const before = db.bookings.length
  db.bookings = db.bookings.filter((item) => item.id !== id)
  const deleted = before !== db.bookings.length
  if (deleted) persist()
  return deleted
}

export function createContactMessage(input) {
  ensureStore()
  const message = {
    id: createId('msg'),
    name: input.name,
    phone: input.phone || '',
    subject: input.subject || '',
    message: input.message,
    createdAt: nowIso(),
  }
  db.messages.unshift(message)
  persist()
  return deepClone(message)
}
