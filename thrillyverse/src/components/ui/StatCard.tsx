// src/components/ui/StatCard.tsx
import type { ReactNode } from 'react'
import './StatCard.css'

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
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <strong className="stat-card__value">{value}</strong>
      </div>
    </article>
  )
}