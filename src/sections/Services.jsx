import { useSite } from '../context/SiteContext'
import SectionHeader from '../components/ui/SectionHeader'
import RevealOnScroll from '../components/ui/RevealOnScroll'

export default function Services() {
  const { services } = useSite()
  const visible = services.filter(s => s.visible)

  const scroll = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="section section--alt" id="services">
      <SectionHeader
        label="What We Do"
        title="OUR SERVICES"
        subtitle="Comprehensive automobile engineering solutions delivered by skilled technicians with modern tools and equipment."
      />

      <div className="services-grid">
        {visible.map((service, i) => (
          <RevealOnScroll key={service.id} delay={i * 60}>
            <div className="service-card" style={{ height: '100%' }}>
              <div className="service-card__icon">{service.icon}</div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.description}</p>
              <button
                className="service-card__cta"
                onClick={() => scroll('#booking')}
              >
                → Book This Service
              </button>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
