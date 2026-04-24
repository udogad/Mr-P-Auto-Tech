import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/ui/Toast'

const ICONS = ['🔧', '🔬', '🛞', '🏎️', '🚛', '🎨', '⚡', '🔩', '🛻', '🔑', '🧰', '💡']

export default function AdminServices() {
  const { services, updateService, resetServices } = useSite()
  const { toast, showToast } = useToast()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  function openEdit(s) {
    setEditing(s.id)
    setForm({ icon: s.icon, title: s.title, description: s.description })
  }

  function saveEdit(id) {
    if (!form.title?.trim()) return
    updateService(id, form)
    setEditing(null)
    showToast('Service updated!')
  }

  function toggleVisible(id, visible) {
    updateService(id, { visible: !visible })
    showToast(`Service ${!visible ? 'shown' : 'hidden'} on website`)
  }

  function handleReset() {
    if (!confirm('Reset all services to defaults? Your changes will be lost.')) return
    resetServices()
    showToast('Services reset to defaults')
  }

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <div className="admin-header">
        <div>
          <div className="admin-header__title">SERVICES</div>
          <div className="admin-header__subtitle">
            {services.filter(s => s.visible).length} of {services.length} visible on website
          </div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={handleReset}>↺ Reset to Defaults</button>
      </div>

      <div className="admin-content">
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(22,163,74,0.2)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <div style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.6 }}>
              Edit each service's icon, title, and description. Toggle visibility to show or hide them on the public website. Changes are applied instantly.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {services.map((s, i) => (
            <div
              key={s.id}
              className="card"
              style={{ opacity: s.visible ? 1 : 0.5 }}
            >
              {editing === s.id ? (
                /* Edit form */
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Icon</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {ICONS.map(ic => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setForm(p => ({ ...p, icon: ic }))}
                          style={{
                            width: 40, height: 40, fontSize: 20, border: `1px solid ${form.icon === ic ? 'var(--green)' : 'var(--border)'}`,
                            borderRadius: 6, background: form.icon === ic ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.04)',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Service Title</label>
                    <input value={form.title} onChange={update('title')} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Description</label>
                    <textarea value={form.description} onChange={update('description')} style={{ minHeight: 80 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn--primary btn--sm" onClick={() => saveEdit(s.id)}>✓ Save</button>
                    <button className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* Display row */
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, background: 'rgba(22,163,74,0.1)',
                    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 18, fontWeight: 700 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.5, marginTop: 2 }}>{s.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                    <button
                      className={`btn btn--sm ${s.visible ? 'btn--ghost' : 'btn--primary'}`}
                      onClick={() => toggleVisible(s.id, s.visible)}
                    >
                      {s.visible ? '🙈 Hide' : '👁 Show'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
