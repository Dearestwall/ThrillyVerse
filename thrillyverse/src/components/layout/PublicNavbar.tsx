'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/materials', label: 'Study' },
  { href: '/blogs', label: 'Blog' },
  { href: '/#about', label: 'About' },
  { href: '/#contact-form', label: 'Contact' },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  /*
   * Navbar shadow / compact state.
   */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 6);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /*
   * Keep track of the current URL hash.
   */
  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();

    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  /*
   * Close mobile menu whenever the pathname changes.
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /*
   * Prevent background scrolling while mobile menu is open.
   */
  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /*
   * Handle hash navigation.
   *
   * Examples:
   * /#about
   * /#contact
   * /#contact-form
   */
  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith('/#')) {
      setMobileOpen(false);
      return;
    }

    const hash = href.substring(2);

    setMobileOpen(false);

    /*
     * Already on homepage:
     * smoothly scroll instead of performing navigation.
     */
    if (pathname === '/') {
      event.preventDefault();

      const target = document.getElementById(hash);

      if (target) {
        window.history.pushState(
          null,
          '',
          `/#${hash}`
        );

        setCurrentHash(`#${hash}`);

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        /*
         * Target may not have rendered yet.
         */
        router.push(`/#${hash}`);
      }

      return;
    }

    /*
     * On another page, allow Next.js to navigate
     * to the homepage with the hash.
     */
    setMobileOpen(false);
  };

  /*
   * Active navigation state.
   *
   * Only the currently selected homepage hash is active.
   * This prevents Home + About + Contact all appearing
   * active at the same time.
   */
  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return (
        pathname === '/' &&
        currentHash === href.substring(1)
      );
    }

    if (href === '/') {
      return (
        pathname === '/' &&
        currentHash === ''
      );
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* =========================
          DESKTOP / MAIN NAVBAR
          ========================= */}
      <header
        className={`public-navbar public-navbar--compact ${
          scrolled ? 'is-scrolled' : ''
        }`}
      >
        <nav
          className="navbar-inner"
          aria-label="Main navigation"
        >
          {/* BRAND */}
          <Link
            href="/"
            className="navbar-brand"
            aria-label="ThrillyVerse home"
          >
            <span className="navbar-logo-wrap">
              <Image
                src="/logo-192.png"
                alt="ThrillyVerse logo"
                fill
                sizes="40px"
                className="navbar-logo-img"
                priority
              />
            </span>

            <span className="navbar-wordmark">
              <span className="navbar-brand-line">
                <span className="brand-thrilly">
                  Thrilly
                </span>

                <span className="brand-verse">
                  Verse
                </span>
              </span>

              <span className="navbar-tagline">
                ✦Think Beyond The Verse✦
              </span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul
            className="navbar-links"
            role="list"
          >
            {LINKS.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`navbar-link ${
                      active ? 'is-active' : ''
                    }`}
                    aria-current={
                      active ? 'page' : undefined
                    }
                    onClick={(event) =>
                      handleNavClick(
                        event,
                        link.href
                      )
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* NAVBAR ACTIONS */}
          <div className="navbar-actions">
            <NotificationBell />

            <ThemeToggle />

            <button
              type="button"
              className="navbar-burger"
              onClick={() =>
                setMobileOpen((prev) => !prev)
              }
              aria-label={
                mobileOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* =========================
          MOBILE OVERLAY
          ========================= */}
      {mobileOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* =========================
          MOBILE DRAWER
          ========================= */}
      <aside
        id="mobile-nav-panel"
        className={`mobile-nav-drawer ${
          mobileOpen ? 'is-open' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* MOBILE HEADER */}
        <div className="mobile-nav-head">
          <Link
            href="/"
            className="navbar-brand"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <span className="navbar-logo-wrap navbar-logo-wrap-sm">
              <Image
                src="/logo-192.png"
                alt="ThrillyVerse logo"
                fill
                sizes="36px"
                className="navbar-logo-img"
              />
            </span>

            <span className="navbar-wordmark mobile-wordmark">
              <span className="navbar-brand-line">
                <span className="brand-thrilly">
                  Thrilly
                </span>

                <span className="brand-verse">
                  Verse
                </span>
              </span>

              <span className="navbar-tagline">
                ✦Think Beyond The Verse✦
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="navbar-burger mobile-close-btn"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* MOBILE LINKS */}
        <ul
          className="mobile-links"
          role="list"
        >
          {LINKS.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-nav-link ${
                    active ? 'is-active' : ''
                  }`}
                  onClick={(event) =>
                    handleNavClick(
                      event,
                      link.href
                    )
                  }
                >
                  <span>
                    {link.label}
                  </span>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* MOBILE FOOTER */}
        <div className="mobile-nav-foot">
          <NotificationBell />

          <ThemeToggle />

          <span className="mobile-foot-copy">
            Think Beyond The Verse
          </span>
        </div>
      </aside>
    </>
  );
}
