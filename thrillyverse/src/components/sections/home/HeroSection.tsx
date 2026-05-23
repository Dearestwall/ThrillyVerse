import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="home-hero">
      <div className="container home-hero-content page-enter">
        {/* Tagline pill */}
        <div className="home-hero-tagline">
          <span>✦</span>
          <span>Think Beyond The Verse</span>
          <span>✦</span>
        </div>

        {/* Headline */}
        <h1 className="home-hero-title font-display">
          Entertainment, learning &{' '}
          <span className="gradient-word">publishing</span>{' '}
          in one evolving universe.
        </h1>

        {/* Sub */}
        <p className="home-hero-sub">
          ThrillyVerse combines movies, class resources, quizzes, blogs,
          projects, and announcements in a professional admin-powered platform.
        </p>

        {/* CTAs */}
        <div className="hero-cta-group">
          <Link href="/materials" className="btn btn-primary btn-lg">
            📚 Explore Materials
          </Link>
          <Link href="/movies" className="btn btn-secondary btn-lg">
            🎬 Watch Movies
          </Link>
          <Link href="/blogs" className="btn btn-ghost btn-lg">
            ✏️ Read Blogs
          </Link>
        </div>

        {/* Floating badges */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap fade-up" style={{ animationDelay: '300ms' }}>
          {['100% Free', 'Admin-Managed', 'ICSE / CBSE', 'No Ads*'].map(tag => (
            <span key={tag} className="badge badge-muted text-xs">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}