import Link from 'next/link';
import Image from 'next/image';

const socials = [
  { label: 'Telegram Movies', href: 'https://t.me/thrillmoviesverse' },
  { label: 'Telegram Materials', href: 'https://t.me/icseverse' },
  { label: 'YouTube Gaming', href: 'https://youtube.com/channel/UCGSsWtRJ5ciemRsuFfixmvQ' },
  { label: 'YouTube Main', href: 'https://www.youtube.com/@ThrillyVerse' },
  { label: 'Instagram', href: 'https://www.instagram.com/thrillyverse/' },
];

export function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-inner">
        <div className="grid gap-8 md:grid-cols-3 items-start">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <span className="logo-orb relative grid place-items-center w-11 h-11 rounded-full overflow-hidden shadow-lg pulse-glow">
                <Image src="/logo-192.png" alt="ThrillyVerse" fill className="object-cover" />
              </span>
              <span className="font-display font-black text-lg tracking-tight leading-none">
                <span style={{ color: 'var(--color-primary)' }}>Thrilly</span>
                <span style={{ color: 'var(--color-gold)' }}>Verse</span>
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Think Beyond The Verse — movies, study materials, quizzes, blogs, and projects in one modern platform.
            </p>
            <p className="text-xs text-text-faint">
              Updated by Admin. © {new Date().getFullYear()} ThrillyVerse. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-text-faint mb-4">Quick Links</h3>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/movies">Movies</Link>
              <Link href="/materials">Study</Link>
              <Link href="/blogs">Blogs</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-text-faint mb-4">Social</h3>
            <div className="footer-links">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 