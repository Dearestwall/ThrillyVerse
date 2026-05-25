'use client';
import { useRef } from 'react';

export function ReviewsSection({ reviews }: { reviews: any[] }) {
  if (!reviews.length) return null;
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="home-section home-section--alt">
      <div className="container">
        <div className="text-center mb-10 fade-up">
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-title">What People Say</h2>
          <p className="section-description">Thousands of students and viewers trust ThrillyVerse every day.</p>
        </div>
      </div>

      <div
        className="reviews-marquee-wrap"
        onMouseEnter={() => trackRef.current?.style.setProperty('animation-play-state', 'paused')}
        onMouseLeave={() => trackRef.current?.style.setProperty('animation-play-state', 'running')}
      >
        <div className="reviews-marquee" ref={trackRef}>
          {[...reviews, ...reviews].map((r, i) => (
            <div key={i} className="review-card card">
              <div className="review-stars">
                {Array.from({ length: r.rating ?? 5 }).map((_, k) => (
                  <svg key={k} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.name} className="review-avatar object-cover" loading="lazy" />
                ) : (
                  <div className="review-avatar review-avatar--placeholder">{r.emoji ?? '👤'}</div>
                )}
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}