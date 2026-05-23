import Link from 'next/link';
import Image from 'next/image';

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 no-underline group" aria-label="ThrillyVerse home">
      <span className="logo-orb relative grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg pulse-glow">
        <Image src="/logo-192.png" alt="ThrillyVerse" fill className="object-cover" priority />
      </span>
      <span className="font-display text-lg font-black tracking-tight leading-none hidden sm:inline-block">
        <span style={{ color: 'var(--color-primary)' }}>Thrilly</span>
        <span style={{ color: 'var(--color-gold)' }}>Verse</span>
      </span>
    </Link>
  );
}