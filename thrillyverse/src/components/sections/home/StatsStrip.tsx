import { AnimatedCounter } from '@/components/common/AnimatedCounter';

interface Stat { label: string; value: number; icon: string; suffix?: string; }

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats-strip-section">
      <div className="container">
        <div className="stats-strip-grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stats-strip-card fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="stats-strip-icon">{s.icon}</div>
              <div className="stats-strip-value">
                <AnimatedCounter value={s.value} />{s.suffix}
              </div>
              <div className="stats-strip-label">{s.label}</div>
              <div className="stats-strip-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

