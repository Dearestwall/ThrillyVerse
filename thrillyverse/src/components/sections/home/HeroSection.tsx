import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="home-hero hero-safe-offset">
      <div className="hero-mesh" aria-hidden="true">
        <div className="hero-mesh-blob hero-mesh-blob--a" />
        <div className="hero-mesh-blob hero-mesh-blob--b" />
        <div className="hero-mesh-blob hero-mesh-blob--c" />
      </div>

      <div className="container home-hero-content page-enter">
        <div className="home-hero-tagline">✦Think Beyond The Verse✦</div>

        <h1 className="home-hero-title font-display">
          Entertainment, learning & <span className="gradient-word">publishing</span> in one evolving universe.
        </h1>

        <p className="home-hero-sub">
          ThrillyVerse combines movies, class resources, quizzes, blogs, projects, and announcements — all admin-powered and 100% free.
        </p>

        <div className="hero-cta-group">
          <Link href="/materials" className="btn btn-primary btn-lg">Explore Materials</Link>
          <Link href="/movies" className="btn btn-secondary btn-lg">Watch Movies</Link>
          <Link href="/blogs" className="btn btn-ghost btn-lg">Read Blogs</Link>
        </div>
      </div>
    </section>
  );
}