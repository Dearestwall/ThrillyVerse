export function AboutSection() {
  return (
    <section id="about" className="py-16">
      <div className="container-default grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>About Us</p>
          <h2 className="font-display text-xl font-bold mb-4">A dynamic platform for students and creators</h2>
          <p className="text-text-muted mb-4">
            ThrillyVerse is designed to combine structured educational content with engaging media and publishing tools.
          </p>
          <p className="text-text-muted">
            Every section is editable from the admin panel, keeping the platform scalable, low-cost, and easy to maintain on Supabase, Cloudinary, EmailJS, and Vercel.
          </p>
        </div>
        <div className="card p-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-2xl font-bold text-primary">4</div><div className="text-xs text-text-muted">Main public pages</div></div>
            <div><div className="text-2xl font-bold text-primary">8+</div><div className="text-xs text-text-muted">Admin modules</div></div>
            <div><div className="text-2xl font-bold text-primary">100%</div><div className="text-xs text-text-muted">Admin-managed content</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}