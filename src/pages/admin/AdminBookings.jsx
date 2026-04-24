import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { STATUS_LABELS } from '../../data/defaults'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/ui/Toast'

const STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

function BookingModal({ booking, onClose, onStatusChange }) {
  const { settings } = useSite()
  const waMsg = encodeURIComponent(
    `Hello ${booking.name}, this is MR P Auto Tech. Your booking (${booking.id}) for ${booking.service} on ${booking.preferredDate} has been confirmed. Please contact us for any questions.`
  )
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ paddingBottom: 16 }}>
          <div className="modal-title">BOOKING DETAILS</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              ['Reference', booking.id],
              ['Status', <span className={`badge ${STATUS_LABELS[booking.status]?.class}`}>{STATUS_LABELS[booking.status]?.label}</span>],
              ['Customer', booking.name],
              ['Phone', booking.phone],
              ['Email', booking.email || '—'],
              ['Service', booking.service],
              ['Vehicle', [booking.vehicleMake, booking.vehicleModel, booking.vehicleYear].filter(Boolean).join(' ') || '—'],
              ['Preferred Date', booking.preferredDate || '—'],
              ['Submitted', new Date(booking.createdAt).toLocaleString('en-NG')],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: 'var(--white)' }}>{value}</div>
              </div>
            ))}
          </div>
          {booking.notes && (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase', marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 14, color: 'var(--ash2)', lineHeight: 1.6 }}>{booking.notes}</div>
            </div>
          )}

          {/* Status changer */}
          <div className="form-group">
            <label>Update Status</label>
            <select
              value={booking.status}
              onChange={e => onStatusChange(booking.id, e.target.value)}
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]?.label || s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${booking.phone?.replace(/^0/, '234').replace(/\D/g, '')}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary btn--sm"
            >
              💬 WhatsApp Customer
            </a>
            {booking.phone && (
              <a href={`tel:${booking.phone}`} className="btn btn--ghost btn--sm">📞 Call Customer</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminBookings() {
  const { bookings, changeBookingStatus, removeBooking } = useSite()
  const { toast, showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.service?.toLowerCase().includes(search.toLowerCase()) ||
      b.id?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || b.status === filterStatus
    return matchSearch && matchStatus
  })

  function handleStatusChange(id, status) {
    changeBookingStatus(id, status)
    if (selected?.id === id) setSelected(p => ({ ...p, status }))
    showToast(`Booking status updated to ${STATUS_LABELS[status]?.label}`)
  }

  function handleDelete(id) {
    if (!confirm('Delete this booking? This cannot be undone.')) return
    removeBooking(id)
    if (selected?.id === id) setSelected(null)
    showToast('Booking deleted', 'error')
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <div className="admin-header__title">BOOKINGS</div>
          <div className="admin-header__subtitle">{bookings.length} total · {bookings.filter(b => b.status === 'pending').length} pending</div>
        </div>
        <a href="/#booking" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          🔗 View Booking Form
        </a>
      </div>

      <div className="admin-content">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="admin-table-search"
            placeholder="Search by name, phone, service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', ...STATUSES].map(s => (
              <button
                key={s}
                className={`btn btn--sm ${filterStatus === s ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setFilterStatus(s)}
                style={{ textTransform: 'capitalize' }}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s]?.label}
                {s !== 'all' && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>
                    ({bookings.filter(b => b.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3>{filtered.length} Booking{filtered.length !== 1 ? 's' : ''}</h3>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📭</div>
              <div className="empty-state__text">
                {bookings.length === 0
                  ? 'No bookings yet. They appear here when customers use the online form.'
                  : 'No bookings match your search or filter.'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const s = STATUS_LABELS[b.status] || STATUS_LABELS.pending
                    return (
                      <tr key={b.id}>
                        <td><code style={{ color: 'var(--green-light)', fontSize: 11 }}>{b.id}</code></td>
                        <td>
                          <strong>{b.name}</strong>
                          <div style={{ fontSize: 12, color: 'var(--ash)' }}>{b.phone}</div>
                        </td>
                        <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.service}</td>
                        <td>{[b.vehicleMake, b.vehicleModel].filter(Boolean).join(' ') || '—'}</td>
                        <td>{b.preferredDate || '—'}</td>
                        <td>
                          <select
                            className="status-select"
                            value={b.status}
                            onChange={e => handleStatusChange(b.id, e.target.value)}
                            style={{ color: s.class === 'badge--green' ? 'var(--green-light)' : s.class === 'badge--yellow' ? '#fbbf24' : s.class === 'badge--red' ? '#f87171' : 'var(--ash2)' }}
                          >
                            {STATUSES.map(st => (
                              <option key={st} value={st}>{STATUS_LABELS[st]?.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn action-btn--view" onClick={() => setSelected(b)} title="View details">👁</button>
                            <button className="action-btn action-btn--delete" onClick={() => handleDelete(b.id)} title="Delete">🗑</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      <Toast toast={toast} />
    </div>
  )
}
