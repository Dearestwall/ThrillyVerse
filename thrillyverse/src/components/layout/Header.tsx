import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/materials', label: 'Materials' },
  { to: '/movies', label: 'Movies' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' }
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { signOut, role } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img
            src="https://i.ibb.co/0pjPXpZy/thrillyverse.png"
            alt="ThrillyVerse logo"
            className="brand-mark"
          />
          <div>
            <strong>ThrillyVerse</strong>
            <span>Think Beyond The Verse</span>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(link => (
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
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme" type="button">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {role === 'admin' ? (
            <Link to="/admin" className="button button-primary button-small">
              Admin
            </Link>
          ) : (
            <Link to="/login" className="button button-ghost button-small">
              Login
            </Link>
          )}

          {role === 'admin' && (
            <button
              className="icon-button desktop-only"
              onClick={() => signOut()}
              aria-label="Sign out"
              type="button"
            >
              <Sparkles size={18} />
            </button>
          )}

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
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link.to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="mobile-nav-link" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}