export function PartnersSection({ partners }: { partners: any[] }) {
  if (!partners.length) return null;
  return (
    <section className="home-section home-section--muted">
      <div className="container">
        <div className="text-center mb-10 fade-up">
          <div className="section-eyebrow">Trusted By</div>
          <h2 className="section-title">Our Partners</h2>
        </div>
        <div className="partners-marquee-wrap">
          <div className="partners-marquee">
            {[...partners, ...partners].map((p, i) => (
              <a
                key={i}
                href={p.website_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card"
              >
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="h-8 object-contain" loading="lazy" />
                ) : (
                  <div className="partner-logo">{p.emoji ?? '🤝'}</div>
                )}
                <div className="partner-name">{p.name}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}