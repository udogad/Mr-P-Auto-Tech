import { useSite } from '../context/SiteContext'
import { useCounter } from '../hooks/useCounter'
import { useInView } from '../hooks/useInView'

function StatItem({ target, suffix = '+', label, delay = 0 }) {
  const { ref, isInView } = useInView({ threshold: 0.3 })
  const count = useCounter(parseInt(target) || 0, 1800, isInView)

  return (
    <div
      ref={ref}
      className="stats-strip__item"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="stats-strip__num">
        {count.toLocaleString()}
        <span style={{ color: 'var(--green)' }}>{suffix}</span>
      </span>
      <span className="stats-strip__label">{label}</span>
    </div>
  )
}

export default function StatsStrip() {
  const { settings } = useSite()

  return (
    <div className="stats-strip">
      <div className="stats-strip__grid">
        <StatItem target={settings.carsServiced} suffix="+" label="Vehicles Serviced" delay={0} />
        <StatItem target={settings.satisfaction} suffix="%" label="Customer Satisfaction" delay={100} />
        <StatItem target={settings.technicians} suffix="+" label="Certified Technicians" delay={200} />
        <StatItem target={settings.yearsExperience} suffix="+" label="Years of Excellence" delay={300} />
      </div>
    </div>
  )
}
