import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

type AdminEmptyStateProps = {
  title: string
  text: string
  action?: ReactNode
  icon?: ReactNode
  eyebrow?: string
  note?: string
}

export function AdminEmptyState({
  title,
  text,
  action,
  icon,
  eyebrow = 'Nothing here yet',
  note
}: AdminEmptyStateProps) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-state-orb" />
      <div className="admin-empty-state-mark">
        {icon ?? <Sparkles size={20} />}
      </div>

      <div className="admin-empty-state-copy">
        <span className="admin-empty-state-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        {note ? <small>{note}</small> : null}
      </div>

      {action ? <div className="admin-empty-state-action">{action}</div> : null}
    </div>
  )
}