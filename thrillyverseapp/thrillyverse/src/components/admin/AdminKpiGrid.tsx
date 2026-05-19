import type { ReactNode } from 'react'
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'

type KpiTrend = {
  value: string
  direction?: 'up' | 'down' | 'neutral'
  label?: string
}

export type KpiItem = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning'
  trend?: KpiTrend
  actionLabel?: string
  onActionClick?: () => void
  loading?: boolean
}

export function AdminKpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="admin-kpi-grid">
      {items.map((item) => {
        const trendIcon =
          item.trend?.direction === 'up' ? (
            <TrendingUp size={14} />
          ) : item.trend?.direction === 'down' ? (
            <TrendingDown size={14} />
          ) : null

        return (
          <article
            key={item.label}
            className={`admin-kpi-card is-${item.tone ?? 'default'} ${item.loading ? 'is-loading' : ''}`}
          >
            <div className="admin-kpi-glow" />

            <div className="admin-kpi-top">
              <div className="admin-kpi-copy">
                <span className="admin-kpi-label">{item.label}</span>
                {item.icon ? <div className="admin-kpi-icon">{item.icon}</div> : null}
              </div>
            </div>

            <div className="admin-kpi-main">
              <strong>{item.loading ? '—' : item.value}</strong>

              {item.trend ? (
                <div className={`admin-kpi-trend is-${item.trend.direction ?? 'neutral'}`}>
                  {trendIcon}
                  <span>{item.trend.value}</span>
                  {item.trend.label ? <small>{item.trend.label}</small> : null}
                </div>
              ) : null}
            </div>

            {item.hint ? <p>{item.hint}</p> : null}

            {item.actionLabel && item.onActionClick ? (
              <button
                type="button"
                className="admin-kpi-action"
                onClick={item.onActionClick}
              >
                <span>{item.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}