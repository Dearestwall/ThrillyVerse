import { adminClient } from '@/lib/supabase/admin'

export default async function AdminDashboard() {
  const [movies, materials, news, subs] = await Promise.all([
    adminClient.from('movies').select('id', { count: 'exact', head: true }),
    adminClient.from('materials').select('id', { count: 'exact', head: true }),
    adminClient.from('news').select('id', { count: 'exact', head: true }),
    adminClient.from('push_subscriptions').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Movies', value: movies.count ?? 0, icon: '🎬' },
    { label: 'Materials', value: materials.count ?? 0, icon: '📚' },
    { label: 'News Posts', value: news.count ?? 0, icon: '📰' },
    { label: 'Push Subscribers', value: subs.count ?? 0, icon: '🔔' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-brand-light">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}