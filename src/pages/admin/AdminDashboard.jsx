import { useSite } from '../../context/SiteContext'
import { STATUS_LABELS } from '../../data/defaults'
import { Link } from 'react-router-dom'

function StatCard({ icon, iconBg, num, label, trend, trendUp }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__icon" style={{ background: iconBg }}>{icon}</div>
      <div className="admin-stat-card__num">{num}</div>
      <div className="admin-stat-card__label">{label}</div>
      {trend && (
        <div className={`admin-stat-card__trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { bookings, gallery, testimonials, services } = useSite()

  const pending = bookings.filter(b => b.status === 'pending').length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const completed = bookings.filter(b => b.status === 'completed').length
  const recent = [...bookings].slice(0, 5)

  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="admin-header__title">DASHBOARD</div>
          <div className="admin-header__subtitle">{today}</div>
        </div>
        <Link to="/admin/bookings" className="btn btn--primary btn--sm">
          📅 View All Bookings
        </Link>
      </div>

      <div className="admin-content">
        {/* Stat cards */}
        <div className="admin-stats-grid">
          <StatCard
            icon="📅" iconBg="rgba(22,163,74,0.12)"
            num={bookings.length} label="Total Bookings"
            trend={`${pending} pending`} trendUp
          />
          <StatCard
            icon="⏳" iconBg="rgba(245,158,11,0.12)"
            num={pending} label="Pending Review"
            trend="Needs attention" trendUp={false}
          />
          <StatCard
            icon="✅" iconBg="rgba(59,130,246,0.12)"
            num={completed} label="Completed Jobs"
            trend="All time" trendUp
          />
          <StatCard
            icon="🖼️" iconBg="rgba(139,92,246,0.12)"
            num={gallery.filter(g => g.visible).length} label="Gallery Photos"
          />
        </div>

        {/* Quick actions */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16, letterSpacing: 0.5 }}>
            QUICK ACTIONS
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/admin/bookings" className="btn btn--ghost">📅 Manage Bookings ({pending} new)</Link>
            <Link to="/admin/gallery" className="btn btn--ghost">🖼️ Upload Photos</Link>
            <Link to="/admin/testimonials" className="btn btn--ghost">⭐ Add Review</Link>
            <Link to="/admin/services" className="btn btn--ghost">🔧 Edit Services</Link>
            <Link to="/admin/settings" className="btn btn--ghost">⚙️ Site Settings</Link>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3>Recent Bookings</h3>
            <Link to="/admin/bookings" className="btn btn--ghost btn--sm">View All →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📭</div>
              <div className="empty-state__text">No bookings yet. They'll appear here when customers book online.</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(b => {
                  const s = STATUS_LABELS[b.status] || STATUS_LABELS.pending
                  return (
                    <tr key={b.id}>
                      <td><code style={{ color: 'var(--green-light)', fontSize: 12 }}>{b.id}</code></td>
                      <td>
                        <strong>{b.name}</strong>
                        <div style={{ fontSize: 12, color: 'var(--ash)' }}>{b.phone}</div>
                      </td>
                      <td>{b.service}</td>
                      <td>{[b.vehicleMake, b.vehicleModel, b.vehicleYear].filter(Boolean).join(' ') || '—'}</td>
                      <td>{b.preferredDate || '—'}</td>
                      <td><span className={`badge ${s.class}`}>{s.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary row */}
        <div className="grid-3" style={{ marginTop: 20 }}>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 10 }}>SERVICES</div>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: 'var(--green-light)' }}>
              {services.filter(s => s.visible).length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 1 }}>Active services</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 10 }}>REVIEWS</div>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: 'var(--green-light)' }}>
              {testimonials.filter(t => t.visible).length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 1 }}>Published reviews</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 10 }}>GALLERY</div>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: 'var(--green-light)' }}>
              {gallery.filter(g => g.visible && g.url).length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 1 }}>Real photos uploaded</div>
          </div>
        </div>
      </div>
    </div>
  )
}
