import Link from 'next/link';
import { ArrowRight, Layers3, ShieldCheck, Sparkles, Rocket } from 'lucide-react';

type AboutHighlight = {
  value: string;
  label: string;
  icon?: 'layers' | 'shield' | 'sparkles' | 'rocket';
};

type SiteSettings = {
  about_eyebrow?: string | null;
  about_title?: string | null;
  about_text_primary?: string | null;
  about_text_secondary?: string | null;
  about_primary_cta_label?: string | null;
  about_primary_cta_href?: string | null;
  about_secondary_cta_label?: string | null;
  about_secondary_cta_href?: string | null;
  about_highlights?: AboutHighlight[] | null;
};

const iconMap = {
  layers: Layers3,
  shield: ShieldCheck,
  sparkles: Sparkles,
  rocket: Rocket,
};

const DEFAULT_HIGHLIGHTS: AboutHighlight[] = [
  { value: '4', label: 'Public Pages', icon: 'layers' },
  { value: '8+', label: 'Admin Modules', icon: 'shield' },
  { value: '100%', label: 'Admin Managed', icon: 'sparkles' },
  { value: '∞', label: 'Free Content', icon: 'rocket' },
];

export function AboutSection({ settings }: { settings?: SiteSettings | null }) {
  const highlights =
    settings?.about_highlights && settings.about_highlights.length > 0
      ? settings.about_highlights
      : DEFAULT_HIGHLIGHTS;

  return (
    <section id="about" className="home-section home-section--alt about-section-pro">
      <div className="container-default">
        <div className="about-shell about-shell--compact">
          <div className="about-copy slide-in-left">
            <p className="section-eyebrow">
              {settings?.about_eyebrow?.trim() || 'About Us'}
            </p>

            <h2 className="section-title about-title">
              {settings?.about_title?.trim() ||
                'A dynamic platform for students and creators'}
            </h2>

            <p className="about-text-primary">
              {settings?.about_text_primary?.trim() ||
                'ThrillyVerse combines structured educational content, engaging media, publishing tools and creator-focused updates in one clean, fast platform.'}
            </p>

            <p className="about-text-secondary">
              {settings?.about_text_secondary?.trim() ||
                'Every major section is managed from the admin panel, keeping the platform scalable, low-cost and easy to maintain across Supabase, Cloudinary, EmailJS and Vercel.'}
            </p>

            <div className="about-actions about-actions--compact">
              <Link
                href={settings?.about_primary_cta_href?.trim() || '/#contact'}
                className="btn btn-primary btn-lg"
              >
                {settings?.about_primary_cta_label?.trim() || 'Get In Touch'}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={settings?.about_secondary_cta_href?.trim() || '/blogs'}
                className="btn btn-secondary btn-lg"
              >
                {settings?.about_secondary_cta_label?.trim() || 'Explore Blogs'}
              </Link>
            </div>
          </div>

          <div className="about-stats-wrap section-reveal">
            <div className="about-stats-row" role="list" aria-label="Platform highlights">
              {highlights.map((item, index) => {
                const Icon = iconMap[item.icon ?? 'sparkles'] ?? Sparkles;

                return (
                  <article
                    key={`${item.label}-${index}`}
                    className="about-stat-card about-stat-card--horizontal"
                    role="listitem"
                  >
                    <div className="about-stat-icon">
                      <Icon size={18} />
                    </div>

                    <div className="about-stat-copy">
                      <strong className="about-stat-value">{item.value}</strong>
                      <span className="about-stat-label">{item.label}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}