const REVIEWS = [
  { name: 'Priya S.', role: 'Class 12, CBSE', avatar: 'ðŸ‘©â€ðŸŽ“', rating: 5, text: 'ThrillyVerse materials helped me score 95+ in boards. The quizzes are spot-on!' },
  { name: 'Rohan M.', role: 'Movie Enthusiast', avatar: 'ðŸ‘¨â€ðŸ’»', rating: 5, text: 'Best place to find curated movies with working links. Clean and fast UI.' },
  { name: 'Ananya K.', role: 'Class 10, ICSE', avatar: 'ðŸ‘©â€ðŸ“š', rating: 5, text: 'The board-wise filtering is incredibly useful. Found all my study notes here.' },
  { name: 'Arjun T.', role: 'Developer', avatar: 'ðŸ§‘â€ðŸ’»', rating: 4, text: 'Love the blog section â€” insightful articles and clean reading experience.' },
  { name: 'Simran D.', role: 'Parent', avatar: 'ðŸ‘©', rating: 5, text: 'My kids use ThrillyVerse daily for study. Very safe and well organised platform.' },
  { name: 'Vikram P.', role: 'College Student', avatar: 'ðŸ‘¨â€ðŸŽ“', rating: 5, text: 'The notification system keeps me updated on new materials. Really handy.' },
];

export function ReviewsSection({ reviews }: { reviews: any[] }) {
  if (!reviews.length) return null;
  return (
    <section className="home-section">
      <div className="container">
        <div className="text-center mb-10 fade-up">
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-title">What People Say</h2>
          <p className="section-description">Thousands of students, viewers, and readers trust ThrillyVerse every day.</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={r.id} className="review-card card section-reveal" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="review-stars">{'â­'.repeat(r.rating ?? 5)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                {r.avatar_url
                  ? <img src={r.avatar_url} alt={r.name} className="review-avatar object-cover" />
                  : <div className="review-avatar">{r.emoji ?? 'ðŸ‘¤'}</div>
                }
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

