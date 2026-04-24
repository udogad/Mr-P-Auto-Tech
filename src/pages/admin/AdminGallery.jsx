import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/ui/Toast'

const CATEGORIES = ['Repairs', 'Diagnostics', 'Tyres', 'Body Work', 'Fleet', 'Parts', 'Team', 'Workshop', 'Other']

export default function AdminGallery() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useSite()
  const { toast, showToast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ url: '', title: '', category: 'Repairs' })
  const [errors, setErrors] = useState({})

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.url.trim()) errs.url = 'Image URL is required'
    return errs
  }

  async function handleAdd(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      await addGalleryItem(form)
      setForm({ url: '', title: '', category: 'Repairs' })
      setErrors({})
      setShowAdd(false)
      showToast('Gallery photo added!')
    } catch (error) {
      showToast(error.message || 'Failed to add gallery photo.', 'error')
    }
  }

  async function handleToggle(id, visible) {
    try {
      await updateGalleryItem(id, { visible: !visible })
      showToast(`Photo ${!visible ? 'shown' : 'hidden'} on website`)
    } catch (error) {
      showToast(error.message || 'Failed to update photo visibility.', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this gallery photo?')) return
    try {
      await deleteGalleryItem(id)
      showToast('Photo deleted', 'error')
    } catch (error) {
      showToast(error.message || 'Failed to delete photo.', 'error')
    }
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <div className="admin-header__title">GALLERY</div>
          <div className="admin-header__subtitle">
            {gallery.filter(g => g.visible).length} visible · {gallery.filter(g => g.url).length} with real photos
          </div>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => setShowAdd(true)}>
          + Add Photo
        </button>
      </div>

      <div className="admin-content">
        {/* Tip */}
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(22,163,74,0.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>How to add photos</div>
              <div style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.6 }}>
                Upload your images to a free host like <strong style={{ color: 'var(--ash2)' }}>Cloudinary</strong>, <strong style={{ color: 'var(--ash2)' }}>ImgBB</strong>, or <strong style={{ color: 'var(--ash2)' }}>Google Drive (public link)</strong>, then paste the image URL below. For professional results, use real photos of your workshop and completed jobs.
              </div>
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        {gallery.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state__icon">🖼️</div>
              <div className="empty-state__text">No gallery items yet. Add your first photo above.</div>
              <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
                + Add First Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {gallery.map(item => (
              <div
                key={item.id}
                className="admin-gallery-item"
                style={{ opacity: item.visible ? 1 : 0.4 }}
              >
                {item.url ? (
                  <img src={item.url} alt={item.title} onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: 6,
                    background: 'var(--dark3)'
                  }}>
                    <span style={{ fontSize: 28, opacity: 0.15 }}>🖼️</span>
                    <span style={{ fontSize: 11, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.4 }}>
                      No Image
                    </span>
                  </div>
                )}
                <div className="admin-gallery-item__label">{item.title}</div>
                <div className="admin-gallery-item__overlay">
                  <span className="badge badge--ash" style={{ marginBottom: 8 }}>{item.category}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className={`btn btn--sm ${item.visible ? 'btn--ghost' : 'btn--primary'}`}
                      onClick={() => handleToggle(item.id, item.visible)}
                    >
                      {item.visible ? '🙈 Hide' : '👁 Show'}
                    </button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(item.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">ADD PHOTO</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Image URL *</label>
                  <input
                    value={form.url}
                    onChange={update('url')}
                    placeholder="https://i.imgur.com/yourimage.jpg"
                  />
                  {errors.url && <div className="form-error">{errors.url}</div>}
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    value={form.title}
                    onChange={update('title')}
                    placeholder="e.g. Engine Overhaul"
                  />
                  {errors.title && <div className="form-error">{errors.title}</div>}
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={update('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {form.url && (
                  <div style={{ marginBottom: 16, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '16/9', background: 'var(--dark3)' }}>
                    <img
                      src={form.url}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = ''; e.target.alt = 'Invalid URL' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn--primary btn--full">Add to Gallery</button>
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
