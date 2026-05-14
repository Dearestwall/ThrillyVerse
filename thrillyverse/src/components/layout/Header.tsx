import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { siteContent } from '../../data/siteContent'

export function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img
            src={siteContent.brand.logo}
            alt={`${siteContent.brand.name} logo`}
            className="brand-mark"
          />
          <div>
            <strong>{siteContent.brand.name}</strong>
            <span>{siteContent.brand.tagline}</span>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteContent.nav.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={isActive(link.to) ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/contact" className="button button-primary button-small desktop-contact-button">
            Contact
          </Link>

          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme" type="button">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="icon-button mobile-only"
            onClick={() => setOpen(v => !v)}
            aria-label="Open menu"
            type="button"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer">
          <div className="container mobile-nav">
            {siteContent.nav.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link.to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}