import { useSite } from '../context/SiteContext'
import SectionHeader from '../components/ui/SectionHeader'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const PLACEHOLDER_ICONS = ['🔧', '🔬', '🛞', '🎨', '🚛', '🏎️']
const PLACEHOLDER_BG = [
  'linear-gradient(135deg,#0d1a10,#0a130c)',
  'linear-gradient(135deg,#111,#1a1a10)',
  'linear-gradient(135deg,#0a0a0a,#0d120a)',
  'linear-gradient(135deg,#101610,#0a0a0a)',
  'linear-gradient(135deg,#0c1a0e,#0a0a0a)',
  'linear-gradient(135deg,#0a0f0a,#111)',
]

export default function Gallery() {
  const { gallery } = useSite()
  const visible = gallery.filter(g => g.visible).slice(0, 6)

  return (
    <section className="section section--alt" id="gallery">
      <SectionHeader
        label="Our Work"
        title="GALLERY"
        subtitle="A visual journey through our workshop, jobs, and the quality we deliver on every vehicle."
        center
      />

      <RevealOnScroll>
        <div className="gallery-grid">
          {visible.map((item, i) => (
            <div
              key={item.id}
              className="gallery-item"
              style={{ background: PLACEHOLDER_BG[i % PLACEHOLDER_BG.length] }}
            >
              {item.url ? (
                <img src={item.url} alt={item.title} />
              ) : (
                <div className="gallery-item__placeholder">
                  <div className="gallery-item__placeholder-icon">{PLACEHOLDER_ICONS[i % PLACEHOLDER_ICONS.length]}</div>
                  <div className="gallery-item__placeholder-text">{item.category}</div>
                </div>
              )}
              <div className="gallery-item__overlay">
                <span className="gallery-item__label">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <div style={{
          marginTop: 20,
          textAlign: 'center',
          padding: '14px 20px',
          background: 'rgba(22,163,74,0.05)',
          border: '1px dashed rgba(22,163,74,0.2)',
          borderRadius: 8,
          fontSize: 13,
          color: 'var(--ash)',
        }}>
          📸 <strong style={{ color: 'var(--ash2)' }}>Owner tip:</strong> Upload real photos from your Admin Dashboard → Gallery to replace these placeholders and instantly boost credibility.
        </div>
      </RevealOnScroll>
    </section>
  )
}
