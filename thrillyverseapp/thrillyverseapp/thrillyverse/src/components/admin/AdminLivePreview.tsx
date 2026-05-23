type AdminLivePreviewProps = {
  title?: string | null
  subtitle?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  secondaryCtaText?: string | null
  secondaryCtaUrl?: string | null
  announcement?: string | null
  badge?: string | null
  heroImageUrl?: string | null
  themeVariant?: string | null
}

export function AdminLivePreview({
  title,
  subtitle,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  announcement,
  badge,
  heroImageUrl,
  themeVariant
}: AdminLivePreviewProps) {
  return (
    <div className={`admin-live-preview theme-${themeVariant ?? 'default'}`}>
      <div className="admin-live-preview-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="admin-live-preview-label">Homepage live preview</span>
        <span className="admin-live-preview-status">Synced draft</span>
      </div>

      {announcement ? (
        <div className="admin-live-preview-banner">
          <span>Announcement</span>
          <strong>{announcement}</strong>
        </div>
      ) : null}

      <div className="admin-live-preview-hero">
        <div className="admin-live-preview-copy">
          <p className="eyebrow">{badge || 'ThrillyVerse'}</p>
          <h3>{title || 'Your homepage hero title will appear here.'}</h3>
          <p>
            {subtitle || 'Your supporting hero text will appear here as you type.'}
          </p>

          <div className="admin-live-preview-actions">
            <a
              href={ctaUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="button button-primary"
            >
              {ctaText || 'Primary action'}
            </a>

            <a
              href={secondaryCtaUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
            >
              {secondaryCtaText || 'Secondary action'}
            </a>
          </div>

          <div className="admin-live-preview-pills">
            <span>Projects</span>
            <span>Materials</span>
            <span>Movies</span>
            <span>Blogs</span>
          </div>
        </div>

        <div className="admin-live-preview-visual">
          {heroImageUrl ? (
            <img src={heroImageUrl} alt="Homepage preview visual" />
          ) : (
            <div className="admin-live-preview-placeholder">
              <div className="admin-live-preview-placeholder-card">
                <strong>Featured Story</strong>
                <span>Dynamic cards, banners, and content blocks show here.</span>
              </div>
              <div className="admin-live-preview-placeholder-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}