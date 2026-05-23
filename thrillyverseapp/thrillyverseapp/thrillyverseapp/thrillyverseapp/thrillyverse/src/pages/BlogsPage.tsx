import { useMemo, useState } from 'react'
import { BlogCard } from '../components/cards/BlogCard'
import { SectionTitle } from '../components/ui/SectionTitle'
import { useBlogs } from '../hooks/resources'

export function BlogsPage() {
  const { items } = useBlogs()
  const [search, setSearch] = useState('')
  const publishedOnly = items.filter(item => item.published)

  const filtered = useMemo(() => {
    return publishedOnly.filter(item =>
      [item.title, item.excerpt, item.category].join(' ').toLowerCase().includes(search.toLowerCase())
    )
  }, [publishedOnly, search])

  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Blogs"
          title="A more editorial, professional content section"
          text="Published articles are surfaced cleanly, while draft control stays inside the admin area."
        />

        <div className="toolbar card">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs" />
        </div>

        <div className="card-grid three">
          {filtered.map(item => <BlogCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  )
}