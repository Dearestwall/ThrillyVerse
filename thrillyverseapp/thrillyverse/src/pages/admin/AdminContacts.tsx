import { Inbox, RefreshCcw } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { AdminEmptyState } from '../../components/admin/AdminEmptyState'
import { AdminPageSection } from '../../components/admin/AdminPageSection'
import { useContacts } from '../../hooks/resources'

export function AdminContacts() {
  const { filteredItems, items, query, setQuery, refresh, loading } = useContacts()

  return (
    <AdminShell
      title="Contact inbox"
      text="Review submissions from the public contact form and monitor incoming leads."
      actions={
        <button type="button" className="button button-secondary" onClick={() => void refresh()}>
          <RefreshCcw size={16} />
          Refresh inbox
        </button>
      }
    >
      <AdminPageSection
        title="Messages"
        text="These entries remain stored even if external email delivery fails."
        actions={<span className="badge">{items.length} total</span>}
      >
        <div className="admin-toolbar-row">
          <div className="admin-search-wrap">
            <Inbox size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, subject, email, or message"
            />
          </div>
        </div>

        {loading ? (
          <p className="muted-text">Loading messages...</p>
        ) : filteredItems.length === 0 ? (
          <AdminEmptyState
            title="No matching messages"
            text="Try a different search or wait for new public submissions."
          />
        ) : (
          <div className="admin-mini-card-grid">
            {filteredItems.map((item: any) => (
              <article key={item.id} className="mini-card">
                <div className="mini-card-top">
                  <h3>{item.name}</h3>
                  <span className="badge">{item.subject}</span>
                </div>
                <p className="mini-card-meta">{item.email}</p>
                <p>{item.message}</p>
              </article>
            ))}
          </div>
        )}
      </AdminPageSection>
    </AdminShell>
  )
}