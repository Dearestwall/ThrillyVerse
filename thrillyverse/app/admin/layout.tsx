import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()   // ← await here
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1">
        <div className="mb-6">
          <p className="text-white font-bold text-lg">ThrillyVerse</p>
          <p className="text-gray-500 text-xs">Admin Panel</p>
        </div>

        {[
          { href: '/admin', label: '📊 Dashboard' },
          { href: '/admin/movies', label: '🎬 Movies' },
          { href: '/admin/materials', label: '📚 Materials' },
          { href: '/admin/push', label: '🔔 Push Notify' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {label}
          </a>
        ))}

        <div className="mt-auto">
          <p className="text-xs text-gray-600 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}