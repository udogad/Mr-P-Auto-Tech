import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const STEPS = [
  { num: '1', title: 'Fill the form', desc: 'Tell us your vehicle details and preferred service date.' },
  { num: '2', title: 'Get confirmed', desc: 'We\'ll reach out via WhatsApp or call within 1 hour.' },
  { num: '3', title: 'Drop your car', desc: 'Bring your vehicle at the scheduled time. We handle the rest.' },
  { num: '4', title: 'Drive away happy', desc: 'Pick up your vehicle in top condition — on time, every time.' },
]

const INITIAL = {
  firstName: '', lastName: '', phone: '', email: '',
  vehicleMake: '', vehicleModel: '', vehicleYear: '',
  service: '', preferredDate: '', notes: '',
}

export default function Booking() {
  const { submitBooking, settings, services } = useSite()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const serviceOptions = Array.from(new Set([
    ...services.filter(s => s.visible).map(s => s.title),
    'Other',
  ]))

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    if (!form.vehicleMake.trim()) errs.vehicleMake = 'Required'
    if (!form.service) errs.service = 'Please select a service'
    if (!form.preferredDate) errs.preferredDate = 'Please choose a date'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      setSubmitting(true)
      const booking = await submitBooking({ ...form, name: `${form.firstName} ${form.lastName}` })
      setSubmittedData(booking)
      setSubmitted(true)
      setErrors({})
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit booking right now.')
    } finally {
      setSubmitting(false)
    }
  }

  function buildWAMessage() {
    const d = form
    return encodeURIComponent(
      `Hello MR P Auto Tech!\n\nI'd like to book an appointment.\n\nName: ${d.firstName} ${d.lastName}\nPhone: ${d.phone}\nService: ${d.service}\nVehicle: ${d.vehicleMake} ${d.vehicleModel} (${d.vehicleYear})\nDate: ${d.preferredDate}\n\nNotes: ${d.notes || 'None'}`
    )
  }

  return (
    <section className="section section--dark" id="booking">
      <div className="grid-2" style={{ alignItems: 'start', gap: 80 }}>

        {/* Left info */}
        <RevealOnScroll direction="left">
          <div className="label-text" style={{ marginBottom: 12 }}>Schedule</div>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            BOOK YOUR<br />APPOINTMENT
          </h2>
          <p className="body-md" style={{ marginBottom: 36 }}>
            Fill the form and we'll confirm your slot within 1 hour. No back-and-forth — just seamless service.
          </p>

          <div className="booking__steps">
            {STEPS.map(s => (
              <div key={s.num} className="booking__step">
                <div className="booking__step-num">{s.num}</div>
                <div>
                  <div className="booking__step-title">{s.title}</div>
                  <div className="booking__step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Right form */}
        <RevealOnScroll direction="right">
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input value={form.firstName} onChange={update('firstName')} placeholder="John" />
                    {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input value={form.lastName} onChange={update('lastName')} placeholder="Doe" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input value={form.phone} onChange={update('phone')} placeholder="080XXXXXXXX" type="tel" />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input value={form.email} onChange={update('email')} placeholder="you@example.com" type="email" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vehicle Make *</label>
                    <input value={form.vehicleMake} onChange={update('vehicleMake')} placeholder="Toyota, Honda…" />
                    {errors.vehicleMake && <div className="form-error">{errors.vehicleMake}</div>}
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input value={form.vehicleModel} onChange={update('vehicleModel')} placeholder="Camry, Corolla…" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input value={form.vehicleYear} onChange={update('vehicleYear')} placeholder="e.g. 2019" />
                  </div>
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input value={form.preferredDate} onChange={update('preferredDate')} type="date" min={today} />
                    {errors.preferredDate && <div className="form-error">{errors.preferredDate}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Service Required *</label>
                  <select value={form.service} onChange={update('service')}>
                    <option value="">Select a service…</option>
                    {serviceOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.service && <div className="form-error">{errors.service}</div>}
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea value={form.notes} onChange={update('notes')} placeholder="Describe the issue or anything we should know…" />
                </div>

                {submitError && <div className="form-error" style={{ marginBottom: 10 }}>{submitError}</div>}
                <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={submitting}>
                  {submitting ? 'Submitting…' : '📅 Confirm Booking →'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3 className="display-md" style={{ color: 'var(--green-light)', marginBottom: 8 }}>BOOKING RECEIVED!</h3>
                <p className="body-md" style={{ marginBottom: 8 }}>
                  Reference: <strong style={{ color: 'var(--white)' }}>{submittedData?.id}</strong>
                </p>
                <p className="body-md" style={{ marginBottom: 28 }}>
                  We'll call or WhatsApp you to confirm within 1 hour.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${buildWAMessage()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--primary"
                  >
                    💬 Also Send via WhatsApp
                  </a>
                  <button
                    className="btn btn--ghost"
                    onClick={() => { setSubmitted(false); setForm(INITIAL) }}
                  >
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
