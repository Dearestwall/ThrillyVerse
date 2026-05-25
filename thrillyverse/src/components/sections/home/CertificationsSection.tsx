export function CertificationsSection({ certifications }: { certifications: any[] }) {
  if (!certifications.length) return null;
  return (
    <section className="home-section">
      <div className="container">
        <div className="text-center mb-10 fade-up">
          <div className="section-eyebrow">Trust & Quality</div>
          <h2 className="section-title">Our Certifications</h2>
          <p className="section-description">We maintain the highest standards in security, privacy, and education quality.</p>
        </div>
        <div className="certs-grid">
          {certifications.map((c, i) => (
            <div key={c.id} className="cert-card card section-reveal" style={{ animationDelay: `${i * 70}ms` }}>
              <div
                className="cert-icon"
                style={{ background: `linear-gradient(135deg, ${c.color_from ?? 'var(--color-primary)'}, ${c.color_to ?? 'var(--color-gold)'})` }}
              >
                {c.emoji}
              </div>
              <div className="cert-title">{c.title}</div>
              <div className="cert-subtitle">{c.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}