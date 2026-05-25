'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/materials', label: 'Study' },
  { href: '/blogs', label: 'Blog' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === '/';
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  return (
    <>
      <header className={`public-navbar public-navbar--compact ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar-inner" aria-label="Main navigation">
          <Link href="/" className="navbar-brand" aria-label="ThrillyVerse home">
            <span className="navbar-logo-wrap">
              <Image src="/logo-192.png" alt="ThrillyVerse logo" fill sizes="40px" className="navbar-logo-img" priority />
            </span>
            <span className="navbar-wordmark">
              <span className="navbar-brand-line"><span className="brand-thrilly">Thrilly</span><span className="brand-verse">Verse</span></span>
              <span className="navbar-tagline">✦Think Beyond The Verse✦</span>
            </span>
          </Link>

          <ul className="navbar-links" role="list">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`navbar-link ${isActive(link.href) ? 'is-active' : ''}`} aria-current={isActive(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <NotificationBell />
            <ThemeToggle />
            <button
              type="button"
              className="navbar-burger"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <aside id="mobile-nav-panel" className={`mobile-nav-drawer ${mobileOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div className="mobile-nav-head">
          <Link href="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <span className="navbar-logo-wrap navbar-logo-wrap-sm">
              <Image src="/logo-192.png" alt="ThrillyVerse logo" fill sizes="36px" className="navbar-logo-img" />
            </span>
            <span className="navbar-wordmark mobile-wordmark">
              <span className="navbar-brand-line"><span className="brand-thrilly">Thrilly</span><span className="brand-verse">Verse</span></span>
              <span className="navbar-tagline">✦Think Beyond The Verse✦</span>
            </span>
          </Link>
          <button type="button" className="navbar-burger mobile-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <ul className="mobile-links" role="list">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`mobile-nav-link ${isActive(link.href) ? 'is-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{link.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-foot">
          <NotificationBell />
          <ThemeToggle />
          <span className="mobile-foot-copy">Think Beyond The Verse</span>
        </div>
      </aside>
    </>
  );
}