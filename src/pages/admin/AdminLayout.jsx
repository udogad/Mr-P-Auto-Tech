import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/SiteContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { to: '/admin/services', label: 'Services', icon: '🔧' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

function Sidebar() {
  const { adminLogout } = useAdmin()
  const navigate = useNavigate()

  async function handleLogout() {
    await adminLogout()
    navigate('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      {/* Header */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo-icon">MP</div>
        <div>
          <div className="admin-sidebar__logo-text">
            MR P <span>AUTO</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__section-label">Main Menu</div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="admin-sidebar__section-label" style={{ marginTop: 16 }}>Site</div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-sidebar__link"
        >
          <span>🌐</span>
          <span>View Website</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">A</div>
          <div>
            <div className="admin-sidebar__user-name">Admin</div>
            <div className="admin-sidebar__user-role">MR P Auto Tech</div>
          </div>
        </div>
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout() {
  return (
    <div className="admin-layout admin-body">
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
