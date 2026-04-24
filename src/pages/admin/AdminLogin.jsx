import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/SiteContext'

export default function AdminLogin() {
  const { adminLogin, isAdminLoggedIn, isReady, bootError } = useAdmin()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdminLoggedIn) navigate('/admin', { replace: true })
  }, [isAdminLoggedIn, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isReady) return
    setLoading(true)
    setError('')
    try {
      const ok = await adminLogin(password)
      if (ok) {
        navigate('/admin', { replace: true })
      } else {
        setError('Incorrect password. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Unable to login right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        {/* Logo */}
        <div className="admin-login__logo">
          <div className="navbar__logo-icon" style={{ width: 44, height: 44, fontSize: 20 }}>MP</div>
          <span className="navbar__logo-text" style={{ fontSize: 22 }}>
            MR P <span style={{ color: 'var(--green-light)' }}>AUTO TECH</span>
          </span>
        </div>

        <h2 className="admin-login__title">ADMIN PANEL</h2>
        <p className="admin-login__subtitle">Enter your password to access the dashboard</p>

        {bootError && <div className="admin-login__error">⚠️ {bootError}</div>}
        {error && <div className="admin-login__error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading || !password || !isReady}
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating…' : '🔐 Login to Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--ash)' }}>
          Default password: <code style={{ color: 'var(--green-light)', background: 'rgba(22,163,74,0.1)', padding: '2px 8px', borderRadius: 4 }}>ADMIN_PASSWORD</code> (fallback: <code style={{ color: 'var(--green-light)', background: 'rgba(22,163,74,0.1)', padding: '2px 8px', borderRadius: 4 }}>mrpauto2025</code>)
          <br />
          <span style={{ marginTop: 4, display: 'block' }}>Change it in Settings after first login.</span>
        </p>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: 'var(--ash)', transition: 'color 0.3s' }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}
