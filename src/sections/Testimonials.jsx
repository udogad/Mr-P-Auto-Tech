import { useSite } from '../context/SiteContext'
import SectionHeader from '../components/ui/SectionHeader'
import RevealOnScroll from '../components/ui/RevealOnScroll'

function Stars({ count = 5 }) {
  return (
    <div className="testi-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? 'var(--green-light)' : 'var(--border)' }}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { testimonials } = useSite()
  const visible = testimonials.filter(t => t.visible)

  return (
    <section className="section section--alt" id="testimonials">
      <SectionHeader
        label="Reviews"
        title="WHAT OUR CUSTOMERS SAY"
        subtitle="Real feedback from real people who trust MR P Auto Tech with their vehicles."
        center
      />

      <div className="grid-3">
        {visible.map((t, i) => (
          <RevealOnScroll key={t.id} delay={i * 80}>
            <div className="testi-card">
              <div className="testi-card__quote">"</div>
              <Stars count={t.stars} />
              <p className="testi-card__text">{t.text}</p>
              <div className="testi-card__footer">
                <div className="testi-card__avatar">
                  {t.avatarUrl
                    ? <img src={t.avatarUrl} alt={t.name} />
                    : t.name[0].toUpperCase()
                  }
                </div>
                <div>
                  <div className="testi-card__name">{t.name}</div>
                  <div className="testi-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
