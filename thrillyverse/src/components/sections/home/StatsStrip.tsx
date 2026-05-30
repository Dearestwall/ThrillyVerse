import { AnimatedCounter } from '@/components/common/AnimatedCounter';

interface Stat {
  label: string;
  value: number;
  icon: string;
  suffix?: string;
}

export function StatsStrip({ stats }: { stats: Stat[] }) {
  if (!stats?.length) return null;

  return (
    <section className="stats-strip-section">
      <div className="container">
        <div className="stats-strip-shell">
          <div className="stats-strip-grid">
            {stats.map((s, i) => (
              <article
                key={s.label}
                className="stats-strip-card fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="stats-strip-card-top">
                  <div className="stats-strip-icon" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div className="stats-strip-value">
                    <AnimatedCounter value={s.value} />
                    {s.suffix}
                  </div>
                </div>

                <div className="stats-strip-label">{s.label}</div>
                <div className="stats-strip-bar" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}