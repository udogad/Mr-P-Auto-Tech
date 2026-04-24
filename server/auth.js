import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-jwt-secret-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyAdminToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token.' })
  }

  try {
    req.admin = verifyAdminToken(token)
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
