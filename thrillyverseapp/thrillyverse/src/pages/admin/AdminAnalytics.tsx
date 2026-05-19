import { useEffect, useMemo, useState } from 'react'
import { BarChart2, Eye, Globe, TrendingUp } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { AdminKpiGrid } from '../../components/admin/AdminKpiGrid'
import { AdminPageSection } from '../../components/admin/AdminPageSection'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

type PageView = {
  id: string
  path: string
  referrer: string | null
  user_agent: string | null
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  })
}

export function AdminAnalytics() {
  const [views, setViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      if (!isSupabaseConfigured) {
        setViews([])
        setLoading(false)
        return
      }

      const since = new Date()
      since.setDate(since.getDate() - range)

      const response = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(5000)

      setViews((response.data ?? []) as PageView[])
      setLoading(false)
    }

    void load()
  }, [range])

  const totalViews = views.length

  const topPages = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const v of views) counts[v.path] = (counts[v.path] ?? 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)
  }, [views])

  const dailyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const v of views) {
      const day = formatDate(v.created_at)
      counts[day] = (counts[day] ?? 0) + 1
    }
    return Object.entries(counts).slice(-14)
  }, [views])

  const maxDayCount = Math.max(...dailyBreakdown.map(([, count]) => count), 1)

  const topReferrers = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const v of views) {
      let ref = 'direct'
      if (v.referrer) {
        try {
          ref = new URL(v.referrer).hostname || 'direct'
        } catch {
          ref = 'direct'
        }
      }
      counts[ref] = (counts[ref] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [views])

  const uniquePaths = useMemo(() => new Set(views.map((v) => v.path)).size, [views])

  return (
    <AdminShell
      title="Analytics"
      text="Track public traffic using your own Supabase page view table."
      actions={
        <div className="range-tabs">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              type="button"
              className={range === r ? 'button button-primary button-small' : 'button button-ghost button-small'}
              onClick={() => setRange(r)}
            >
              {r}d
            </button>
          ))}
        </div>
      }
    >
      <AdminKpiGrid
        items={[
          {
            label: 'Total views',
            value: String(totalViews),
            hint: `Across last ${range} days`,
            icon: <Eye size={18} />
          },
          {
            label: 'Unique pages',
            value: String(uniquePaths),
            hint: 'Tracked routes',
            icon: <Globe size={18} />
          },
          {
            label: 'Top page views',
            value: String(topPages[0]?.[1] ?? 0),
            hint: topPages[0]?.[0] ?? 'No top page yet',
            icon: <TrendingUp size={18} />
          },
          {
            label: 'Tracking window',
            value: String(range),
            hint: 'Days selected',
            icon: <BarChart2 size={18} />
          }
        ]}
      />

      <div className="admin-analytics-grid">
        <AdminPageSection
          title="Daily views"
          text="Page views per day over the selected range."
        >
          {loading ? (
            <p className="muted-text">Loading...</p>
          ) : dailyBreakdown.length === 0 ? (
            <p className="muted-text">No data yet — tracking starts after users visit the site.</p>
          ) : (
            <div className="bar-chart">
              {dailyBreakdown.map(([day, count]) => (
                <div key={day} className="bar-row">
                  <span className="bar-label">{day}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(count / maxDayCount) * 100}%` }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPageSection>

        <AdminPageSection title="Top pages" text="Most visited public routes.">
          {loading ? (
            <p className="muted-text">Loading...</p>
          ) : topPages.length === 0 ? (
            <p className="muted-text">No data yet.</p>
          ) : (
            <div className="rank-list">
              {topPages.map(([path, count], index) => (
                <div key={path} className="rank-row">
                  <span className="rank-num">#{index + 1}</span>
                  <span className="rank-label">{path}</span>
                  <span className="rank-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPageSection>

        <AdminPageSection title="Referrers" text="Where visitors are arriving from.">
          {loading ? (
            <p className="muted-text">Loading...</p>
          ) : topReferrers.length === 0 ? (
            <p className="muted-text">No referrer data yet.</p>
          ) : (
            <div className="rank-list">
              {topReferrers.map(([ref, count]) => (
                <div key={ref} className="rank-row">
                  <span className="rank-label">{ref}</span>
                  <span className="rank-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPageSection>
      </div>
    </AdminShell>
  )
}