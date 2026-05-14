import { useMemo, useState } from 'react'
import { MovieCard } from '../components/cards/MovieCard'
import { SectionTitle } from '../components/ui/SectionTitle'
import { useMovies } from '../hooks/resources'

export function MoviesPage() {
  const { items } = useMovies()
  const [tab, setTab] = useState('All')
  const tabs = ['All', ...Array.from(new Set(items.map(item => item.language)))]

  const filtered = useMemo(() => {
    return items.filter(item => tab === 'All' || item.language === tab)
  }, [items, tab])

  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Movies"
          title="Entertainment highlights with filters and poster cards"
          text="This page is ready for categories like Hindi, Punjabi, Hollywood, and web series with richer admin publishing later."
        />

        <div className="toolbar card">
          <div className="chip-row">
            {tabs.map(value => (
              <button
                key={value}
                className={value === tab ? 'chip active' : 'chip'}
                onClick={() => setTab(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="card-grid three">
          {filtered.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  )
}