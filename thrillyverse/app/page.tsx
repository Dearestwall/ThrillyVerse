import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()   // ← await here

  const [{ data: featured }, { data: announcements }] = await Promise.all([
    supabase.from('movies').select('*').eq('is_featured', true).limit(6),
    supabase.from('announcements').select('*').eq('is_active', true).limit(1),
  ])

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {announcements?.[0] && (
          <div className="bg-purple-900/30 border border-purple-800 rounded-xl px-4 py-3 mb-8 text-purple-300 text-sm">
            📢 {announcements[0].text}
          </div>
        )}
        <h1 className="text-4xl font-bold text-white mb-2">ThrillyVerse</h1>
        <p className="text-gray-400 mb-8">Think Beyond The Verse</p>

        {featured && featured.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">⭐ Featured</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featured.map((movie) => (
                <a
                  key={movie.id}
                  href="/movies"
                  className="block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition-colors"
                >
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      width={200}
                      height={300}
                      className="w-full aspect-[2/3] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-3xl">
                      🎬
                    </div>
                  )}
                  <p className="px-2 py-2 text-xs text-white font-medium line-clamp-2">
                    {movie.title}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}