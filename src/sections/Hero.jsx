import { useSite } from '../context/SiteContext'
import { useCounter } from '../hooks/useCounter'
import { useInView } from '../hooks/useInView'
import RevealOnScroll from '../components/ui/RevealOnScroll'

function StatCounter({ target, label }) {
  const { ref, isInView } = useInView({ threshold: 0.4 })
  const count = useCounter(parseInt(target) || 0, 1800, isInView)
  return (
    <div ref={ref}>
      <span className="hero__stat-num">{count.toLocaleString()}+</span>
      <span className="hero__stat-label">{label}</span>
    </div>
  )
}

export default function Hero() {
  const { settings } = useSite()

  const scroll = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">
      <div className="hero__bg" />
      <div className="hero__grid" />
      <div className="hero__glow" />
      <div className="hero__glow2" />
      <div className="hero__orbit">
        <div className="hero__orbit-ring" />
      </div>

      <div className="hero__content">
        <RevealOnScroll delay={0}>
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Now Accepting Bookings · Owerri, Imo State
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="hero__title display-xl">
            PRECISION<br />
            <span className="text-green">AUTO</span><br />
            <span className="line-stroke">ENGINEERING</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <p className="hero__sub body-md">
            {settings.heroSubtitle}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <div className="hero__btns">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => scroll('#booking')}
            >
              📅 Book a Service
            </button>
            <button
              className="btn btn--outline btn--lg"
              onClick={() => scroll('#services')}
            >
              View Services →
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <div className="hero__stats">
            <StatCounter target={settings.yearsExperience} label="Years Experience" />
            <StatCounter target={settings.carsServiced} label="Cars Serviced" />
            <StatCounter target={settings.satisfaction} label="% Satisfaction" />
            <StatCounter target={settings.technicians} label="Certified Technicians" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
