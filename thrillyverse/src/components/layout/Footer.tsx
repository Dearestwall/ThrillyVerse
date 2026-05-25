import Link from 'next/link';
import Image from 'next/image';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/materials', label: 'Study' },
  { href: '/blogs', label: 'Blog' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

const SOCIALS = [
  {
    label: 'YouTube', short: 'YT Main', href: 'https://www.youtube.com/@ThrillyVerse', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/></svg>
    )
  },
  {
    label: 'YT Gaming', short: 'Gaming', href: 'https://youtube.com/channel/UCGSsWtRJ5ciemRsuFfixmvQ', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/></svg>
    )
  },
  {
    label: 'Instagram', short: 'Instagram', href: 'https://www.instagram.com/thrillyverse/', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
    )
  },
  {
    label: 'Telegram Movies', short: 'TG Movies', href: 'https://t.me/thrillmoviesverse', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    )
  },
  {
    label: 'Telegram Study', short: 'TG Study', href: 'https://t.me/icseverse', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    )
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="public-footer public-footer--pro" aria-label="Site footer">
      <div className="footer-inner">
        <div className="footer-top footer-top--pro">
          <div className="footer-brand-col footer-brand-col--pro">
            <Link href="/" className="footer-brand-link" aria-label="ThrillyVerse home">
              <span className="footer-logo-wrap">
                <Image src="/logo-192.png" alt="ThrillyVerse logo" fill sizes="44px" className="object-cover" priority={false} />
              </span>
              <span className="footer-wordmark">
                <span className="brand-thrilly">Thrilly</span><span className="brand-verse">Verse</span>
              </span>
            </Link>
            <p className="footer-tagline">✦Think Beyond The Verse✦</p>
            <p className="footer-desc footer-desc--wide">
              Entertainment, learning and publishing in one evolving universe. Movies, study materials, quizzes, blogs and projects — all in one admin-powered ecosystem.
            </p>

            <div className="footer-socials footer-socials--pro" role="list" aria-label="Social media links">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-pill footer-social-pill--pro"
                  aria-label={s.label}
                  role="listitem"
                >
                  {s.icon}
                  <span className="footer-social-label">{s.short}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links-col">
            <h3 className="footer-col-heading">Quick Links</h3>
            <ul className="footer-link-list footer-link-list--pro" role="list">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link footer-link--pro">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h3 className="footer-col-heading">Connect</h3>
            <ul className="footer-link-list footer-link-list--pro" role="list">
              <li>
                <a href="mailto:thrillyverse@gmail.com" className="footer-link footer-link--pro">thrillyverse@gmail.com</a>
              </li>
              <li>
                <a href="https://t.me/+LniQHT_ltBsyNmE1" target="_blank" rel="noopener noreferrer" className="footer-link footer-link--pro">Telegram Support</a>
              </li>
              <li>
                <span className="footer-link footer-link--plain">Punjab, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} ThrillyVerse. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}