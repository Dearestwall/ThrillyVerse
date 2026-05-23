import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  icon
}: {
  label: string
  value: string
  icon: ReactNode
}) {
  return (
    <article className="stat-card card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  )
}