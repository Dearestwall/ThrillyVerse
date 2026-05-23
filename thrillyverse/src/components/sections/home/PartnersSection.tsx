const PARTNERS = [
  { name: 'Google for Education', logo: 'ðŸŽ“', url: '#' },
  { name: 'Microsoft Learn', logo: 'ðŸªŸ', url: '#' },
  { name: 'AWS Educate', logo: 'â˜ï¸', url: '#' },
  { name: 'NCERT', logo: 'ðŸ“˜', url: '#' },
  { name: 'Khan Academy', logo: 'ðŸ§®', url: '#' },
  { name: 'Coursera', logo: 'ðŸ«', url: '#' },
];

export function PartnersSection({ partners }: { partners: any[] }) {
  if (!partners.length) return null;
  return (
    <section className="home-section home-section--muted">
      <div className="container">
        <div className="text-center mb-10 fade-up">
          <div className="section-eyebrow">Trusted By</div>
          <h2 className="section-title">Our Partners</h2>
          <p className="section-description">ThrillyVerse works with leading education and technology partners.</p>
        </div>
        <div className="partners-grid">
          {partners.map((p, i) => (
            <a key={p.id} href={p.website_url ?? '#'} target="_blank" rel="noopener noreferrer"
              className="partner-card section-reveal" style={{ animationDelay: `${i * 60}ms` }}>
              {p.logo_url
                ? <img src={p.logo_url} alt={p.name} className="h-10 object-contain" />
                : <div className="partner-logo">{p.emoji ?? 'ðŸ¤'}</div>
              }
              <div className="partner-name">{p.name}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

