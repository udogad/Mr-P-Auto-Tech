// ─────────────────────────────────────────────
//  localStorage helpers
// ─────────────────────────────────────────────

const KEYS = {
  SETTINGS: 'mrp_settings',
  SERVICES: 'mrp_services',
  TESTIMONIALS: 'mrp_testimonials',
  GALLERY: 'mrp_gallery',
  BOOKINGS: 'mrp_bookings',
  ADMIN_AUTH: 'mrp_admin_auth',
}

export { KEYS }

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

// ── Booking helpers ──────────────────────────
export function getBookings() {
  return getItem(KEYS.BOOKINGS, [])
}

export function saveBooking(booking) {
  const bookings = getBookings()
  const newBooking = {
    ...booking,
    id: `BK-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  setItem(KEYS.BOOKINGS, [newBooking, ...bookings])
  return newBooking
}

export function updateBookingStatus(id, status) {
  const bookings = getBookings()
  const updated = bookings.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b)
  setItem(KEYS.BOOKINGS, updated)
  return updated
}

export function deleteBooking(id) {
  const bookings = getBookings().filter(b => b.id !== id)
  setItem(KEYS.BOOKINGS, bookings)
  return bookings
}

// ── Auth helpers ─────────────────────────────
export function setAdminAuth(token) {
  setItem(KEYS.ADMIN_AUTH, { token, ts: Date.now() })
}

export function getAdminAuth() {
  const auth = getItem(KEYS.ADMIN_AUTH, null)
  if (!auth) return false
  // Session valid for 8 hours
  const eightHours = 8 * 60 * 60 * 1000
  return Date.now() - auth.ts < eightHours
}

export function clearAdminAuth() {
  removeItem(KEYS.ADMIN_AUTH)
}

// ── Generic CRUD helpers ─────────────────────
export function addItem(key, item) {
  const list = getItem(key, [])
  const newItem = { ...item, id: item.id || `${key}-${Date.now()}` }
  setItem(key, [...list, newItem])
  return newItem
}

export function updateItemById(key, id, updates) {
  const list = getItem(key, [])
  const updated = list.map(i => i.id === id ? { ...i, ...updates } : i)
  setItem(key, updated)
  return updated
}

export function deleteItemById(key, id) {
  const filtered = getItem(key, []).filter(i => i.id !== id)
  setItem(key, filtered)
  return filtered
}
