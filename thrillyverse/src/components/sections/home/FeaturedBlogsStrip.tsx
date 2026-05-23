import Link from 'next/link';
import Image from 'next/image';

export function FeaturedBlogsStrip({ blogs }: { blogs: any[] }) {
  if (!blogs.length) return null;
  const [hero, ...rest] = blogs;
  return (
    <section className="home-section home-section--alt">
      <div className="container">
        <div className="section-header fade-up">
          <div>
            <div className="section-eyebrow">Latest Articles</div>
            <h2 className="section-title">From the Blog</h2>
          </div>
          <Link href="/blogs" className="btn btn-secondary">All Articles â†’</Link>
        </div>
        <div className="featured-blogs-layout">
          {hero && (
            <Link href={`/blogs/${hero.slug}`} className="featured-blog-hero card group overflow-hidden section-reveal">
              <div className="featured-blog-hero-img">
                {hero.cover_image
                  ? <Image src={hero.cover_image} alt={hero.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="blog-img-placeholder">âœï¸</div>
                }
                {hero.category && <span className="badge badge-primary absolute top-4 left-4">{hero.category}</span>}
              </div>
              <div className="featured-blog-hero-body">
                <h3 className="featured-blog-title group-hover:text-primary transition-colors">{hero.title}</h3>
                {hero.excerpt && <p className="featured-blog-excerpt">{hero.excerpt}</p>}
                <span className="text-xs text-text-muted">{hero.read_time} min read</span>
              </div>
            </Link>
          )}
          <div className="featured-blogs-side">
            {rest.map((b, i) => (
              <Link href={`/blogs/${b.slug}`} key={b.id} className="featured-blog-side-card card group overflow-hidden section-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                {b.cover_image && (
                  <div className="featured-blog-side-img">
                    <Image src={b.cover_image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4">
                  {b.category && <span className="badge badge-muted text-[10px] mb-2 inline-block">{b.category}</span>}
                  <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{b.title}</p>
                  <p className="text-xs text-text-muted mt-1">{b.read_time} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
