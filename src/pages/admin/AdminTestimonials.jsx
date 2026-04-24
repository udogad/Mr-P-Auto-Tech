import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/ui/Toast'

const INITIAL = { name: '', role: '', text: '', stars: 5, visible: true }

export default function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useSite()
  const { toast, showToast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'number' ? +e.target.value : e.target.value }))

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.text.trim()) errs.text = 'Required'
    return errs
  }

  function openAdd() { setForm(INITIAL); setEditing(null); setErrors({}); setShowAdd(true) }

  function openEdit(t) {
    setForm({ name: t.name, role: t.role, text: t.text, stars: t.stars, visible: t.visible })
    setEditing(t.id)
    setShowAdd(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (editing) {
      updateTestimonial(editing, form)
      showToast('Review updated!')
    } else {
      addTestimonial(form)
      showToast('Review added to website!')
    }
    setShowAdd(false)
    setEditing(null)
  }

  function handleToggle(id, visible) {
    updateTestimonial(id, { visible: !visible })
    showToast(`Review ${!visible ? 'published' : 'hidden'}`)
  }

  function handleDelete(id) {
    if (!confirm('Delete this review?')) return
    deleteTestimonial(id)
    showToast('Review deleted', 'error')
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <div className="admin-header__title">TESTIMONIALS</div>
          <div className="admin-header__subtitle">
            {testimonials.filter(t => t.visible).length} published · {testimonials.length} total
          </div>
        </div>
        <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Review</button>
      </div>

      <div className="admin-content">
        {testimonials.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state__icon">⭐</div>
              <div className="empty-state__text">No reviews yet. Add customer testimonials to build trust.</div>
              <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={openAdd}>+ Add First Review</button>
            </div>
          </div>
        ) : (
          <div className="grid-3">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="testi-card"
                style={{ opacity: t.visible ? 1 : 0.45, position: 'relative' }}
              >
                {!t.visible && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 12, padding: '2px 10px', fontSize: 11, fontWeight: 700, color: '#f87171'
                  }}>
                    Hidden
                  </div>
                )}
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < t.stars ? 'var(--green-light)' : 'var(--border)', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--ash2)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 16 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div className="testi-card__avatar">{t.name[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ash)' }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => openEdit(t)}>✏️ Edit</button>
                  <button
                    className={`btn btn--sm ${t.visible ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={() => handleToggle(t.id, t.visible)}
                  >
                    {t.visible ? '🙈 Hide' : '👁 Show'}
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(t.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-box" style={{ overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'EDIT REVIEW' : 'ADD REVIEW'}</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input value={form.name} onChange={update('name')} placeholder="Chukwuemeka O." />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label>Role / Vehicle</label>
                    <input value={form.role} onChange={update('role')} placeholder="Toyota Camry Owner" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Star Rating</label>
                  <select value={form.stars} onChange={update('stars')}>
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''} {'★'.repeat(n)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Review Text *</label>
                  <textarea
                    value={form.text}
                    onChange={update('text')}
                    placeholder="Write what the customer said about the service…"
                    style={{ minHeight: 110 }}
                  />
                  {errors.text && <div className="form-error">{errors.text}</div>}
                </div>
                <div className="toggle-wrap" style={{ marginBottom: 20 }}>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={form.visible}
                      onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span className="toggle-label">Publish on website immediately</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn--primary btn--full">
                    {editing ? 'Save Changes' : 'Add Review'}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  )
}
