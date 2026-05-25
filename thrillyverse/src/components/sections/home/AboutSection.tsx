import Link from 'next/link';
import { ArrowRight, Layers3, ShieldCheck, Sparkles, Rocket } from 'lucide-react';

const HIGHLIGHTS = [
  { value: '4', label: 'Public Pages', icon: Layers3 },
  { value: '8+', label: 'Admin Modules', icon: ShieldCheck },
  { value: '100%', label: 'Admin Managed', icon: Sparkles },
  { value: '∞', label: 'Free Content', icon: Rocket },
];

export function AboutSection() {
  return (
    <section id="about" className="home-section home-section--alt about-section-pro">
      <div className="container-default">
        <div className="about-shell">
          <div className="about-copy slide-in-left">
            <p className="section-eyebrow">About Us</p>
            <h2 className="section-title about-title">A dynamic platform for students and creators</h2>
            <p className="about-text-primary">
              ThrillyVerse combines structured educational content, engaging media, publishing tools and creator-focused updates in one clean, fast platform.
            </p>
            <p className="about-text-secondary">
              Every major section is managed from the admin panel, keeping the platform scalable, low-cost and easy to maintain across Supabase, Cloudinary, EmailJS and Vercel.
            </p>
            <div className="about-actions">
              <Link href="/#contact" className="btn btn-primary btn-lg">
                Get In Touch <ArrowRight size={16} />
              </Link>
              <Link href="/blogs" className="btn btn-secondary btn-lg">Explore Blogs</Link>
            </div>
          </div>

          <div className="about-stats-wrap section-reveal">
            <div className="about-stats-head">
              <span className="about-stats-kicker">Platform Snapshot</span>
              <h3>Compact, scalable and fully admin-powered</h3>
            </div>
            <div className="about-stats-grid about-stats-grid--horizontal">
              {HIGHLIGHTS.map(({ value, label, icon: Icon }) => (
                <article key={label} className="about-stat-card about-stat-card--compact card">
                  <span className="about-stat-icon"><Icon size={16} /></span>
                  <div className="about-stat-content">
                    <div className="about-stat-value">{value}</div>
                    <div className="about-stat-label">{label}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}