'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Play, Download, Star, Search } from 'lucide-react';
import type { Movie } from '@/types';
import { EmptyState } from '@/components/common/EmptyState';

export function MoviesGrid({ movies }: { movies: Movie[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(movies.map(m => m.category).filter(Boolean)));
    return ['All', ...cats];
  }, [movies]);

  const filtered = useMemo(() =>
    movies.filter(m => {
      const matchCat = activeCategory === 'All' || m.category === activeCategory;
      const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    }),
  [movies, search, activeCategory]);

  if (!movies.length) return <EmptyState title="No movies found" description="Add movies from the admin panel." />;

  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={14} />
          <input
            className="form-input search-input"
            placeholder="Search movies…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat ?? 'Unknown'}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat ?? 'Unknown')}
            >
              {cat ?? 'Unknown'}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-faint mb-5">
        Showing <strong className="text-text">{filtered.length}</strong> {filtered.length === 1 ? 'movie' : 'movies'}
      </p>

      {filtered.length === 0
        ? <EmptyState title="No results" description="Try a different search or category." />
        : (
          <div className="movies-grid">
            {filtered.map((movie: Movie, i) => (
              <article
                key={movie.id}
                className="movie-poster-card section-reveal"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="movie-poster-img">
                  {movie.poster_url
                    ? <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                    : <div className="movie-poster-placeholder">🎬</div>
                  }
                  {movie.featured && <span className="badge badge-gold absolute top-2 left-2">⭐ Featured</span>}
                  {movie.rating && (
                    <div className="movie-poster-badge">
                      <Star size={10} className="inline" /> {movie.rating}
                    </div>
                  )}
                  <div className="movie-poster-overlay">
                    <span className="movie-poster-title">{movie.title}</span>
                    {movie.year && <span className="movie-poster-year">{movie.year}</span>}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-bold truncate">{movie.title}</h3>
                  <p className="text-xs text-text-faint">{movie.category}{movie.year ? ` · ${movie.year}` : ''}</p>
                  <div className="flex gap-2">
                    {movie.movie_link && (
                      <a href={movie.movie_link} className="btn btn-primary btn-sm flex-1" target="_blank" rel="noreferrer">
                        <Play size={11} /> Watch
                      </a>
                    )}
                    {movie.download_link && (
                      <a href={movie.download_link} className="btn btn-secondary btn-sm" target="_blank" rel="noreferrer" aria-label={`Download ${movie.title}`}>
                        <Download size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      }
    </div>
  );
}
