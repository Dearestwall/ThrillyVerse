export function CertificationsSection({ certifications }: { certifications: any[] }) {
  if (!certifications.length) return null;

  const items = [...certifications, ...certifications];

  return (
    <section className="home-section certifications-strip-section">
      <div className="container">
        <div className="section-header fade-up certifications-section-head">
          <div>
            <div className="section-eyebrow">Trust & Quality</div>
            <h2 className="section-title">Our Certifications</h2>
            <p className="section-description certifications-section-description">
              Compact trust signals that stay visible, responsive, and easy to scan across devices.
            </p>
          </div>
        </div>

        <div className="certs-marquee-shell section-reveal" aria-label="Certifications">
          <div className="certs-marquee-track">
            {items.map((c, i) => (
              <article
                key={`${c.id ?? c.title}-${i}`}
                className="cert-marquee-card card"
              >
                <div
                  className="cert-marquee-icon"
                  style={{
                    background: `linear-gradient(135deg, ${c.color_from ?? 'var(--color-primary)'}, ${c.color_to ?? 'var(--color-gold)'})`,
                  }}
                  aria-hidden="true"
                >
                  <span>{c.emoji ?? '🏆'}</span>
                </div>

                <div className="cert-marquee-copy">
                  <div className="cert-marquee-title">{c.title}</div>
                  {c.subtitle ? (
                    <div className="cert-marquee-subtitle">{c.subtitle}</div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}