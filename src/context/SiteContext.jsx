import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getItem, setItem, KEYS,
  getAdminAuth, setAdminAuth, clearAdminAuth,
  getBookings, saveBooking, updateBookingStatus, deleteBooking,
  addItem, updateItemById, deleteItemById,
} from '../utils/storage'
import {
  DEFAULT_SETTINGS, DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS, DEFAULT_GALLERY,
} from '../data/defaults'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  // ── Admin auth ────────────────────────────
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(getAdminAuth)

  const adminLogin = useCallback((password) => {
    const settings = getItem(KEYS.SETTINGS, DEFAULT_SETTINGS)
    const correctPassword = settings.adminPassword || DEFAULT_SETTINGS.adminPassword
    if (password === correctPassword) {
      setAdminAuth('mrp_session')
      setIsAdminLoggedIn(true)
      return true
    }
    return false
  }, [])

  const adminLogout = useCallback(() => {
    clearAdminAuth()
    setIsAdminLoggedIn(false)
  }, [])

  // ── Settings ──────────────────────────────
  const [settings, setSettingsState] = useState(() =>
    getItem(KEYS.SETTINGS, DEFAULT_SETTINGS)
  )
  const updateSettings = useCallback((updates) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates }
      setItem(KEYS.SETTINGS, next)
      return next
    })
  }, [])

  // ── Services ──────────────────────────────
  const [services, setServicesState] = useState(() =>
    getItem(KEYS.SERVICES, DEFAULT_SERVICES)
  )
  const updateService = useCallback((id, updates) => {
    setServicesState(updateItemById(KEYS.SERVICES, id, updates))
  }, [])
  const resetServices = useCallback(() => {
    setItem(KEYS.SERVICES, DEFAULT_SERVICES)
    setServicesState(DEFAULT_SERVICES)
  }, [])

  // ── Testimonials ──────────────────────────
  const [testimonials, setTestimonialsState] = useState(() =>
    getItem(KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS)
  )
  const addTestimonial = useCallback((item) => {
    const next = addItem(KEYS.TESTIMONIALS, { ...item, id: `tst-${Date.now()}` })
    setTestimonialsState(getItem(KEYS.TESTIMONIALS, []))
    return next
  }, [])
  const updateTestimonial = useCallback((id, updates) => {
    setTestimonialsState(updateItemById(KEYS.TESTIMONIALS, id, updates))
  }, [])
  const deleteTestimonial = useCallback((id) => {
    setTestimonialsState(deleteItemById(KEYS.TESTIMONIALS, id))
  }, [])

  // ── Gallery ───────────────────────────────
  const [gallery, setGalleryState] = useState(() =>
    getItem(KEYS.GALLERY, DEFAULT_GALLERY)
  )
  const addGalleryItem = useCallback((item) => {
    const newItem = { ...item, id: `gal-${Date.now()}`, visible: true }
    const next = [...getItem(KEYS.GALLERY, DEFAULT_GALLERY), newItem]
    setItem(KEYS.GALLERY, next)
    setGalleryState(next)
    return newItem
  }, [])
  const updateGalleryItem = useCallback((id, updates) => {
    setGalleryState(updateItemById(KEYS.GALLERY, id, updates))
  }, [])
  const deleteGalleryItem = useCallback((id) => {
    setGalleryState(deleteItemById(KEYS.GALLERY, id))
  }, [])

  // ── Bookings ──────────────────────────────
  const [bookings, setBookingsState] = useState(getBookings)

  const submitBooking = useCallback((formData) => {
    const booking = saveBooking(formData)
    setBookingsState(getBookings())
    return booking
  }, [])

  const changeBookingStatus = useCallback((id, status) => {
    setBookingsState(updateBookingStatus(id, status))
  }, [])

  const removeBooking = useCallback((id) => {
    setBookingsState(deleteBooking(id))
  }, [])

  const refreshBookings = useCallback(() => {
    setBookingsState(getBookings())
  }, [])

  return (
    <SiteContext.Provider value={{
      // Auth
      isAdminLoggedIn, adminLogin, adminLogout,
      // Settings
      settings, updateSettings,
      // Services
      services, updateService, resetServices,
      // Testimonials
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      // Gallery
      gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      // Bookings
      bookings, submitBooking, changeBookingStatus, removeBooking, refreshBookings,
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}

export function useAdmin() {
  const { isAdminLoggedIn, adminLogin, adminLogout } = useSite()
  return { isAdminLoggedIn, adminLogin, adminLogout }
}
