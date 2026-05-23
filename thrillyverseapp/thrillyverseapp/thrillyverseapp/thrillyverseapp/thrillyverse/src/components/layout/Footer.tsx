import { Link } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-brand-block">
          <div className="footer-brand">
            <img
              src={siteContent.brand.logo}
              alt={`${siteContent.brand.name} logo`}
              className="brand-mark"
            />
            <div>
              <h3>{siteContent.brand.name}</h3>
              <p>{siteContent.brand.tagline}</p>
            </div>
          </div>

          <p className="footer-copy">
            A cleaner digital hub for study materials, entertainment updates, projects, and publishing.
          </p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              {siteContent.footer.explore.map(link => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Projects</h4>
            <div className="footer-links">
              {siteContent.footer.projects.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Community</h4>
            <div className="footer-links">
              {siteContent.footer.socials.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Contact</h4>
            <div className="footer-links">
              <a href={`mailto:${siteContent.footer.contact.email}`}>
                {siteContent.footer.contact.email}
              </a>
              <a
                href={siteContent.footer.contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom-row">
        <p>© {year} {siteContent.brand.name}. All rights reserved.</p>
        <p>Built for ThrillyVerse.</p>
      </div>
    </footer>
  )
}