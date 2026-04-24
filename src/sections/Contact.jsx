import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import SectionHeader from '../components/ui/SectionHeader'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const INITIAL = { name: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { settings, submitContactMessage } = useSite()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.message.trim()) errs.message = 'Required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      setSending(true)
      await submitContactMessage(form)
      setSent(true)
      setErrors({})
    } catch (error) {
      setSubmitError(error.message || 'Unable to send message right now.')
    } finally {
      setSending(false)
    }
  }

  const waMsg = encodeURIComponent(
    `Hello MR P Auto Tech!\n\nName: ${form.name}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\n${form.message}`
  )

  return (
    <section className="section section--dark" id="contact">
      <SectionHeader
        label="Get In Touch"
        title="VISIT OR REACH OUT"
        subtitle="We're open Monday to Saturday. Drop in, call, or message us on WhatsApp."
      />

      <div className="grid-2" style={{ alignItems: 'start', gap: 60 }}>
        {/* Contact info */}
        <RevealOnScroll direction="left">
          <div>
            <div className="contact-item">
              <div className="contact-item__icon">📍</div>
              <div className="contact-item__detail">
                <strong>Location</strong>
                <a href={`https://maps.app.goo.gl/vwuxVQHXM53RG8Vt8`} target="_blank" rel="noreferrer">
                  {settings.address}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item__icon">📞</div>
              <div className="contact-item__detail">
                <strong>Phone / WhatsApp</strong>
                <a href={`tel:+${settings.whatsapp}`}>{settings.phone}</a>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#25d366' }}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {settings.email && (
              <div className="contact-item">
                <div className="contact-item__icon">✉️</div>
                <div className="contact-item__detail">
                  <strong>Email</strong>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
              </div>
            )}

            <div className="contact-item">
              <div className="contact-item__icon">🕐</div>
              <div className="contact-item__detail">
                <strong>Working Hours</strong>
                <span>{settings.hoursWeekday}</span>
                <span>{settings.hoursSunday}</span>
              </div>
            </div>

            {/* Map embed */}
            <div className="map-embed">
              <iframe
                src={settings.mapEmbedSrc}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MR P Auto Tech Location"
              />
            </div>
          </div>
        </RevealOnScroll>

        {/* Contact form */}
        <RevealOnScroll direction="right">
          <div className="form-card">
            <div style={{ marginBottom: 28 }}>
              <div className="label-text" style={{ marginBottom: 8 }}>Send a Message</div>
              <h3 className="display-sm">SEND US A MESSAGE</h3>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input value={form.name} onChange={update('name')} placeholder="Full Name" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={form.phone} onChange={update('phone')} placeholder="080XXXXXXXX" type="tel" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input value={form.subject} onChange={update('subject')} placeholder="What is this about?" />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea value={form.message} onChange={update('message')} placeholder="How can we help you?" style={{ minHeight: 130 }} />
                  {errors.message && <div className="form-error">{errors.message}</div>}
                </div>
                {submitError && <div className="form-error" style={{ marginBottom: 10 }}>{submitError}</div>}
                <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                <h3 className="display-sm" style={{ color: 'var(--green-light)', marginBottom: 8 }}>MESSAGE SENT!</h3>
                <p className="body-md" style={{ marginBottom: 24 }}>
                  We've received your message and will get back to you shortly.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${waMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--primary"
                >
                  💬 Continue on WhatsApp
                </a>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
