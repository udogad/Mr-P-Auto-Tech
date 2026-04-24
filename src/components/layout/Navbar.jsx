import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchorClick = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#home" className="navbar__logo" onClick={() => handleAnchorClick('#home')}>
          <div className="navbar__logo-icon">MP</div>
          <span className="navbar__logo-text">
            MR P <span>AUTO TECH</span>
          </span>
        </a>

        <div className="navbar__links">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); handleAnchorClick(link.href) }}>
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="btn btn--primary btn--sm"
            onClick={(e) => { e.preventDefault(); handleAnchorClick('#booking') }}
          >
            📅 Book Appointment
          </a>
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => { e.preventDefault(); handleAnchorClick(link.href) }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#booking"
          onClick={(e) => { e.preventDefault(); handleAnchorClick('#booking') }}
        >
          📅 Book Appointment
        </a>
      </div>
    </>
  )
}
