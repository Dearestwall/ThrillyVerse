import type { ReactNode } from 'react'

type AdminPageSectionProps = {
  title: string
  text?: string
  actions?: ReactNode
  children: ReactNode
  icon?: ReactNode
  eyebrow?: string
  tone?: 'default' | 'primary' | 'success' | 'warning'
}

export function AdminPageSection({
  title,
  text,
  actions,
  children,
  icon,
  eyebrow,
  tone = 'default'
}: AdminPageSectionProps) {
  return (
    <section className={`card admin-page-section is-${tone}`}>
      <header className="admin-page-section-head">
        <div className="admin-page-section-title-wrap">
          {icon ? <div className="admin-page-section-icon">{icon}</div> : null}

          <div>
            {eyebrow ? <span className="admin-section-eyebrow">{eyebrow}</span> : null}
            <h2>{title}</h2>
            {text ? <p>{text}</p> : null}
          </div>
        </div>

        {actions ? <div className="admin-page-section-actions">{actions}</div> : null}
      </header>

      <div className="admin-page-section-body">{children}</div>
    </section>
  )
}