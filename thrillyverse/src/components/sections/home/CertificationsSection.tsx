const CERTS = [
  { title: 'ISO 27001', subtitle: 'Information Security', icon: 'ðŸ”’', color: 'from-blue-500 to-cyan-500' },
  { title: 'GDPR Compliant', subtitle: 'Data Privacy', icon: 'ðŸ›¡ï¸', color: 'from-green-500 to-emerald-500' },
  { title: 'SSL Secured', subtitle: 'Encrypted Traffic', icon: 'ðŸ”', color: 'from-violet-500 to-purple-500' },
  { title: 'NCERT Aligned', subtitle: 'Curriculum Match', icon: 'ðŸ“˜', color: 'from-orange-500 to-amber-500' },
];

export function CertificationsSection({ certifications }: { certifications: any[] }) {
  if (!certifications.length) return null;
  return (
    <section className="home-section home-section--alt">
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
                style={{ background: `linear-gradient(135deg, ${c.color_from}, ${c.color_to})` }}
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
