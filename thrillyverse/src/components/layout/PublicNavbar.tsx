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
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className={`public-navbar sticky top-0 z-50 ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar-inner">
          <Link href="/" className="navbar-brand" aria-label="ThrillyVerse home">
            <span className="navbar-logo-wrap">
              <Image
                src="/logo-192.png"
                alt="ThrillyVerse"
                fill
                sizes="44px"
                className="navbar-logo-img"
                priority
              />
            </span>
            <span className="navbar-wordmark hidden sm:inline-block">
              <span className="brand-part brand-primary">Thrilly</span>
              <span className="brand-part brand-gold">Verse</span>
            </span>
          </Link>

          <div className="navbar-links" aria-label="Main navigation">
            {LINKS.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`navbar-link ${active ? 'navbar-link-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="navbar-actions">
            <NotificationBell />
            <ThemeToggle />
            <button
              className="md:hidden navbar-menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div className="mobile-nav-panel">
          <div className="mobile-nav-top">
            <Link href="/" className="navbar-brand" aria-label="ThrillyVerse home">
              <span className="navbar-logo-wrap navbar-logo-wrap-sm">
                <Image src="/logo-192.png" alt="ThrillyVerse" fill sizes="40px" className="navbar-logo-img" />
              </span>
              <span className="navbar-wordmark">
                <span className="brand-part brand-primary">Thrilly</span>
                <span className="brand-part brand-gold">Verse</span>
              </span>
            </Link>
            <button className="navbar-menu-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <nav className="mobile-links">
            {LINKS.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-link ${active ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mobile-actions">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}