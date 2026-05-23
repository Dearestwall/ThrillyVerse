import { useMemo, useState } from 'react'
import { MaterialCard } from '../components/cards/MaterialCard'
import { SectionTitle } from '../components/ui/SectionTitle'
import { useMaterials } from '../hooks/resources'

export function MaterialsPage() {
  const { items } = useMaterials()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))]

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = [item.subject, item.title, item.description]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = category === 'All' || item.category === category
      return matchesSearch && matchesCategory
    })
  }, [items, search, category])

  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Materials"
          title="Organized study material with quick discovery"
          text="Use filters, search, and featured blocks to make large study collections feel much easier to browse."
        />

        <div className="toolbar card">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subject, title, or keyword"
          />

          <div className="chip-row">
            {categories.map(value => (
              <button
                key={value}
                className={value === category ? 'chip active' : 'chip'}
                onClick={() => setCategory(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="card-grid three">
          {filtered.map(item => <MaterialCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  )
}