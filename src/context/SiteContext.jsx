import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiRequest, clearAdminToken, getAdminToken, setAdminToken } from '../utils/api'
import {
  DEFAULT_SETTINGS, DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS, DEFAULT_GALLERY,
} from '../data/defaults'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [bootError, setBootError] = useState('')

  const [settings, setSettingsState] = useState(DEFAULT_SETTINGS)
  const [services, setServicesState] = useState(DEFAULT_SERVICES)
  const [testimonials, setTestimonialsState] = useState(DEFAULT_TESTIMONIALS)
  const [gallery, setGalleryState] = useState(DEFAULT_GALLERY)
  const [bookings, setBookingsState] = useState([])

  const applyPublicSnapshot = useCallback((payload) => {
    setSettingsState(payload?.settings || DEFAULT_SETTINGS)
    setServicesState(payload?.services || DEFAULT_SERVICES)
    setTestimonialsState(payload?.testimonials || DEFAULT_TESTIMONIALS)
    setGalleryState(payload?.gallery || DEFAULT_GALLERY)
  }, [])

  const applyAdminSnapshot = useCallback((payload) => {
    applyPublicSnapshot(payload)
    setBookingsState(payload?.bookings || [])
  }, [applyPublicSnapshot])

  const refreshPublicContent = useCallback(async () => {
    const payload = await apiRequest('/api/public/content')
    applyPublicSnapshot(payload)
    return payload
  }, [applyPublicSnapshot])

  const refreshAdminData = useCallback(async () => {
    const payload = await apiRequest('/api/admin/bootstrap', { auth: true })
    applyAdminSnapshot(payload)
    return payload
  }, [applyAdminSnapshot])

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        await refreshPublicContent()
        const token = getAdminToken()
        if (token) {
          try {
            await apiRequest('/api/admin/me', { auth: true })
            if (!mounted) return
            setIsAdminLoggedIn(true)
            await refreshAdminData()
          } catch {
            clearAdminToken()
            if (mounted) setIsAdminLoggedIn(false)
          }
        }
      } catch (error) {
        if (mounted) setBootError(error.message || 'Failed to load initial data.')
      } finally {
        if (mounted) setIsReady(true)
      }
    }

    boot()
    return () => {
      mounted = false
    }
  }, [refreshAdminData, refreshPublicContent])

  const adminLogin = useCallback(async (password) => {
    const payload = await apiRequest('/api/admin/login', {
      method: 'POST',
      body: { password },
    })
    if (!payload?.token) return false
    setAdminToken(payload.token)
    setIsAdminLoggedIn(true)
    await refreshAdminData()
    return true
  }, [refreshAdminData])

  const adminLogout = useCallback(async () => {
    clearAdminToken()
    setIsAdminLoggedIn(false)
    setBookingsState([])
    await refreshPublicContent()
  }, [refreshPublicContent])

  const updateSettings = useCallback(async (updates) => {
    const payload = await apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: updates,
      auth: true,
    })
    const next = payload?.settings || DEFAULT_SETTINGS
    setSettingsState(next)
    return next
  }, [])

  const changeAdminPassword = useCallback(async (currentPassword, newPassword) => {
    await apiRequest('/api/admin/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
      auth: true,
    })
  }, [])

  const updateService = useCallback(async (id, updates) => {
    const payload = await apiRequest(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: updates,
      auth: true,
    })
    if (payload?.service) {
      setServicesState((prev) => prev.map((item) => (item.id === id ? payload.service : item)))
      return payload.service
    }
    return null
  }, [])

  const resetServices = useCallback(async () => {
    const payload = await apiRequest('/api/admin/services/reset', {
      method: 'POST',
      auth: true,
    })
    const next = payload?.services || DEFAULT_SERVICES
    setServicesState(next)
    return next
  }, [])

  const addTestimonial = useCallback(async (item) => {
    const payload = await apiRequest('/api/admin/testimonials', {
      method: 'POST',
      body: item,
      auth: true,
    })
    if (payload?.testimonial) {
      setTestimonialsState((prev) => [...prev, payload.testimonial])
      return payload.testimonial
    }
    return null
  }, [])

  const updateTestimonial = useCallback(async (id, updates) => {
    const payload = await apiRequest(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: updates,
      auth: true,
    })
    if (payload?.testimonial) {
      setTestimonialsState((prev) => prev.map((item) => (item.id === id ? payload.testimonial : item)))
      return payload.testimonial
    }
    return null
  }, [])

  const deleteTestimonial = useCallback(async (id) => {
    await apiRequest(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      auth: true,
    })
    setTestimonialsState((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addGalleryItem = useCallback(async (item) => {
    const payload = await apiRequest('/api/admin/gallery', {
      method: 'POST',
      body: item,
      auth: true,
    })
    if (payload?.item) {
      setGalleryState((prev) => [...prev, payload.item])
      return payload.item
    }
    return null
  }, [])

  const updateGalleryItem = useCallback(async (id, updates) => {
    const payload = await apiRequest(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: updates,
      auth: true,
    })
    if (payload?.item) {
      setGalleryState((prev) => prev.map((item) => (item.id === id ? payload.item : item)))
      return payload.item
    }
    return null
  }, [])

  const deleteGalleryItem = useCallback(async (id) => {
    await apiRequest(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      auth: true,
    })
    setGalleryState((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const submitBooking = useCallback(async (formData) => {
    const payload = await apiRequest('/api/public/bookings', {
      method: 'POST',
      body: formData,
    })
    const booking = payload?.booking
    if (booking && isAdminLoggedIn) {
      setBookingsState((prev) => [booking, ...prev])
    }
    return booking
  }, [isAdminLoggedIn])

  const submitContactMessage = useCallback(async (formData) => {
    const payload = await apiRequest('/api/public/contact', {
      method: 'POST',
      body: formData,
    })
    return payload?.message
  }, [])

  const changeBookingStatus = useCallback(async (id, status) => {
    const payload = await apiRequest(`/api/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: { status },
      auth: true,
    })
    const nextBooking = payload?.booking
    if (nextBooking) {
      setBookingsState((prev) => prev.map((item) => (item.id === id ? nextBooking : item)))
      return nextBooking
    }
    return null
  }, [])

  const removeBooking = useCallback(async (id) => {
    await apiRequest(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      auth: true,
    })
    setBookingsState((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const refreshBookings = useCallback(async () => {
    if (!isAdminLoggedIn) return []
    const payload = await refreshAdminData()
    return payload?.bookings || []
  }, [isAdminLoggedIn, refreshAdminData])

  return (
    <SiteContext.Provider value={{
      // Auth
      isAdminLoggedIn, isReady, bootError, adminLogin, adminLogout,
      // Settings
      settings, updateSettings, changeAdminPassword,
      // Services
      services, updateService, resetServices,
      // Testimonials
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      // Gallery
      gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      // Bookings
      bookings, submitBooking, changeBookingStatus, removeBooking, refreshBookings,
      // Contact
      submitContactMessage,
      // Data reloads
      refreshPublicContent, refreshAdminData,
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
  const { isAdminLoggedIn, isReady, bootError, adminLogin, adminLogout } = useSite()
  return { isAdminLoggedIn, isReady, bootError, adminLogin, adminLogout }
}
