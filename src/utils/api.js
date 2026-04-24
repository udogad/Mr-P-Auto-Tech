const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const ADMIN_TOKEN_KEY = 'mrp_admin_token'

function buildUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return null
}

export function getAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  } catch {
    // no-op
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch {
    // no-op
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false } = options
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (auth) {
    const token = getAdminToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await parseResponse(res)

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}
