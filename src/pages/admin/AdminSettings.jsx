import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/ui/Toast'

export default function AdminSettings() {
  const { settings, updateSettings } = useSite()
  const { toast, showToast } = useToast()
  const [form, setForm] = useState({ ...settings })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  function saveSection(fields, label) {
    const partial = {}
    fields.forEach(f => { partial[f] = form[f] })
    updateSettings(partial)
    showToast(`${label} saved!`)
  }

  function savePassword(e) {
    e.preventDefault()
    setPwError('')
    if (pwForm.current !== settings.adminPassword) {
      setPwError('Current password is incorrect.')
      return
    }
    if (pwForm.newPw.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New passwords do not match.')
      return
    }
    updateSettings({ adminPassword: pwForm.newPw })
    setPwForm({ current: '', newPw: '', confirm: '' })
    showToast('Password updated successfully!')
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <div className="admin-header__title">SETTINGS</div>
          <div className="admin-header__subtitle">Configure all website content and information</div>
        </div>
      </div>

      <div className="admin-content">

        {/* Business Info */}
        <div className="settings-section">
          <h3>Business Information</h3>
          <p>Core details that appear throughout the website.</p>
          <div className="form-row">
            <div className="form-group">
              <label>Business Name</label>
              <input value={form.businessName} onChange={update('businessName')} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input value={form.tagline} onChange={update('tagline')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input value={form.phone} onChange={update('phone')} placeholder="08138412608" />
            </div>
            <div className="form-group">
              <label>WhatsApp Number (with country code, no +)</label>
              <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="2348138412608" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input value={form.email} onChange={update('email')} type="email" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={form.address} onChange={update('address')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Weekday Hours</label>
              <input value={form.hoursWeekday} onChange={update('hoursWeekday')} placeholder="Monday – Saturday: 8:00 AM – 6:00 PM" />
            </div>
            <div className="form-group">
              <label>Sunday Hours</label>
              <input value={form.hoursSunday} onChange={update('hoursSunday')} placeholder="Sunday: Closed" />
            </div>
          </div>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => saveSection(['businessName','tagline','phone','whatsapp','email','address','hoursWeekday','hoursSunday'], 'Business info')}
          >
            Save Business Info
          </button>
        </div>

        {/* Hero section */}
        <div className="settings-section">
          <h3>Hero / Homepage</h3>
          <p>Controls the headline text and subtitle on the homepage hero.</p>
          <div className="form-group">
            <label>Hero Subtitle</label>
            <textarea value={form.heroSubtitle} onChange={update('heroSubtitle')} style={{ minHeight: 80 }} />
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => saveSection(['heroSubtitle'], 'Hero')}>
            Save Hero Text
          </button>
        </div>

        {/* Stats */}
        <div className="settings-section">
          <h3>Statistics</h3>
          <p>Numbers displayed in the hero and stats strip. Update as your business grows.</p>
          <div className="form-row">
            <div className="form-group">
              <label>Years of Experience</label>
              <input value={form.yearsExperience} onChange={update('yearsExperience')} type="number" min="0" />
            </div>
            <div className="form-group">
              <label>Cars Serviced</label>
              <input value={form.carsServiced} onChange={update('carsServiced')} type="number" min="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Satisfaction %</label>
              <input value={form.satisfaction} onChange={update('satisfaction')} type="number" min="0" max="100" />
            </div>
            <div className="form-group">
              <label>Number of Technicians</label>
              <input value={form.technicians} onChange={update('technicians')} type="number" min="0" />
            </div>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => saveSection(['yearsExperience','carsServiced','satisfaction','technicians'], 'Stats')}>
            Save Stats
          </button>
        </div>

        {/* Social links */}
        <div className="settings-section">
          <h3>Social Media Links</h3>
          <p>Links used in the footer. Replace # with your actual profile URLs.</p>
          <div className="form-row">
            <div className="form-group">
              <label>Facebook URL</label>
              <input value={form.facebook} onChange={update('facebook')} placeholder="https://facebook.com/yourpage" />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/yourhandle" />
            </div>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => saveSection(['facebook','instagram'], 'Social links')}>
            Save Social Links
          </button>
        </div>

        {/* Map embed */}
        <div className="settings-section">
          <h3>Google Maps Embed</h3>
          <p>Paste a new embed src URL from Google Maps to update the contact section map.</p>
          <div className="form-group">
            <label>Google Maps Embed URL (src)</label>
            <textarea
              value={form.mapEmbedSrc}
              onChange={update('mapEmbedSrc')}
              style={{ minHeight: 80, fontSize: 12 }}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => saveSection(['mapEmbedSrc'], 'Map embed')}>
            Save Map
          </button>
        </div>

        {/* Password */}
        <div className="settings-section">
          <h3>Admin Password</h3>
          <p>Change your dashboard login password. Make it strong and memorable.</p>
          {pwError && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 16
            }}>
              ⚠️ {pwError}
            </div>
          )}
          <form onSubmit={savePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={pwForm.current}
                onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={pwForm.newPw}
                  onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--sm">🔐 Update Password</button>
          </form>
        </div>

      </div>

      <Toast toast={toast} />
    </div>
  )
}
