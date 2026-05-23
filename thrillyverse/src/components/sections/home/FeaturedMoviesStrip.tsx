import Link from 'next/link';
import Image from 'next/image';

export function FeaturedMoviesStrip({ movies }: { movies: any[] }) {
  if (!movies.length) return null;
  return (
    <section className="home-section">
      <div className="container">
        <div className="section-header fade-up">
          <div>
            <div className="section-eyebrow">Streaming Now</div>
            <h2 className="section-title">Featured Movies</h2>
          </div>
          <Link href="/movies" className="btn btn-secondary">See All â†’</Link>
        </div>
        <div className="featured-movies-grid">
          {movies.map((m, i) => (
            <Link href={`/movies/${m.slug}`} key={m.id} className="movie-poster-card section-reveal" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="movie-poster-img">
                {m.poster_url
                  ? <Image src={m.poster_url} alt={m.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="movie-poster-placeholder">ðŸŽ¬</div>
                }
                <div className="movie-poster-overlay">
                  <span className="movie-poster-title">{m.title}</span>
                  {m.year && <span className="movie-poster-year">{m.year}</span>}
                </div>
                {m.rating && <div className="movie-poster-badge">â­ {m.rating}</div>}
              </div>
              <div className="movie-poster-meta">{m.category ?? ''}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

