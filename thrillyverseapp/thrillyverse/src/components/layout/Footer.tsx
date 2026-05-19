import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { siteContent } from '../../data/siteContent'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-cta-strip">
        <div>
          <span className="footer-chip">ThrillyVerse network</span>
          <h2>Study smarter, explore more, and publish faster.</h2>
          <p>
            ThrillyVerse brings together materials, movies, blogs, and creative tools in one cleaner platform.
          </p>
        </div>

        <div className="footer-cta-actions">
          <Link to="/materials" className="button button-primary">
            Explore materials
          </Link>
          <Link to="/blogs" className="button button-secondary">
            Read blogs
          </Link>
        </div>
      </div>

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

          <div className="footer-contact-pills">
            <a href={`mailto:${siteContent.footer.contact.email}`}>
              <Mail size={14} />
              <span>{siteContent.footer.contact.email}</span>
            </a>

            <a
              href={siteContent.footer.contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send size={14} />
              <span>Telegram contact</span>
            </a>
          </div>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              {siteContent.footer.explore.map((link) => (
                <Link key={link.to} to={link.to}>
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Projects</h4>
            <div className="footer-links">
              {siteContent.footer.projects.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Community</h4>
            <div className="footer-links">
              {siteContent.footer.socials.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Reach out</h4>
            <div className="footer-links">
              <a href={`mailto:${siteContent.footer.contact.email}`}>
                <span>{siteContent.footer.contact.email}</span>
                <ArrowUpRight size={14} />
              </a>

              <a
                href={siteContent.footer.contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Telegram contact</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom-row">
        <p>© {year} {siteContent.brand.name}. All rights reserved.</p>
        <p>Think Beyond The Verse.</p>
      </div>
    </footer>
  )
}