import { AdminShell } from '../../components/admin/AdminShell'
import { useContacts } from '../../hooks/resources'

export function AdminContacts() {
  const { items } = useContacts()

  return (
    <AdminShell title="Contact inbox" text="Review submissions coming from the public contact form.">
      <section className="card admin-list-card">
        <div className="admin-section-head">
          <div>
            <h2>Messages</h2>
            <p>These entries can be stored in Supabase even if EmailJS delivery fails.</p>
          </div>
          <span className="badge">{items.length} total</span>
        </div>

        <div className="admin-grid-cards">
          {items.length === 0 ? (
            <p className="muted-text">No contact messages yet in demo mode.</p>
          ) : (
            items.map(item => (
              <article key={item.id} className="mini-card">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                  <p><strong>{item.subject}</strong></p>
                  <p>{item.message}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  )
}