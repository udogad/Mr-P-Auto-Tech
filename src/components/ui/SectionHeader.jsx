import RevealOnScroll from './RevealOnScroll'

export default function SectionHeader({ label, title, subtitle, center = false, dark = false }) {
  return (
    <RevealOnScroll className={`section-head ${center ? 'text-center' : ''}`} style={{ marginBottom: 64 }}>
      <div className="label-text" style={{ marginBottom: 12 }}>{label}</div>
      <h2 className="display-lg" style={{ marginBottom: 14 }}>{title}</h2>
      {subtitle && (
        <p
          className="body-md"
          style={{ maxWidth: 520, ...(center ? { margin: '0 auto' } : {}) }}
        >
          {subtitle}
        </p>
      )}
    </RevealOnScroll>
  )
}
