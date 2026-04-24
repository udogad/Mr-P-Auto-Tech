import { useSite } from '../context/SiteContext'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const checks = [
  'Certified and experienced auto engineers on every job',
  'Genuine parts and transparent pricing — no hidden costs',
  'State-of-the-art diagnostic equipment',
  'Convenient WhatsApp booking and status updates',
  'Fleet and corporate vehicle clients welcome',
]

export default function About() {
  const { settings } = useSite()

  const scroll = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="section section--dark" id="about">
      <div className="grid-2">
        {/* Image column */}
        <RevealOnScroll direction="left">
          <div style={{ position: 'relative', paddingBottom: 24, paddingRight: 24 }}>
            <div className="about__img-box">
              <div className="about__img-placeholder">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.12 }}>
                  <circle cx="50" cy="50" r="42" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 4"/>
                  <circle cx="50" cy="50" r="22" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5"/>
                  <circle cx="50" cy="50" r="6" fill="#22c55e"/>
                  <line x1="50" y1="8" x2="50" y2="28" stroke="#22c55e" strokeWidth="2"/>
                  <line x1="50" y1="72" x2="50" y2="92" stroke="#22c55e" strokeWidth="2"/>
                  <line x1="8" y1="50" x2="28" y2="50" stroke="#22c55e" strokeWidth="2"/>
                  <line x1="72" y1="50" x2="92" y2="50" stroke="#22c55e" strokeWidth="2"/>
                </svg>
                <span>Workshop Photo</span>
              </div>
            </div>
            <div className="about__badge">
              <span className="about__badge-num">{settings.yearsExperience}+</span>
              <span className="about__badge-text">Years in<br/>Business</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Text column */}
        <RevealOnScroll direction="right">
          <div className="label-text" style={{ marginBottom: 12 }}>Our Story</div>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            BUILT ON<br/>EXPERTISE &amp; TRUST
          </h2>
          <p className="body-md" style={{ marginBottom: 14 }}>
            MR P Auto Tech Ltd was founded on a simple principle: every vehicle deserves expert care,
            and every customer deserves transparency. Based in Owerri, Imo State, we have grown into
            one of the region's most trusted automobile engineering outfits.
          </p>
          <p className="body-md" style={{ marginBottom: 28 }}>
            From routine servicing to complex engine overhauls, our certified technicians bring
            precision and professionalism to every job. We don't just fix cars — we build lasting
            relationships with the people who drive them.
          </p>

          <div className="about__checklist">
            {checks.map(c => (
              <div key={c} className="about__check">
                <div className="about__check-icon">✓</div>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-gap-md" style={{ marginTop: 36, flexWrap: 'wrap' }}>
            <button className="btn btn--primary btn--lg" onClick={() => scroll('#booking')}>
              Book a Service
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline btn--lg"
              style={{ color: '#25d366', borderColor: 'rgba(37,211,102,0.3)' }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
