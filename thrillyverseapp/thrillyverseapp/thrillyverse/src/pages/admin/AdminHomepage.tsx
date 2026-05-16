import { FormEvent, useEffect, useState } from 'react'
import { AdminShell } from '../../components/admin/AdminShell'
import { useHomepageSettings } from '../../hooks/useHomepageSettings'

export function AdminHomepage() {
  const { settings, save } = useHomepageSettings()
  const [values, setValues] = useState(settings)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setValues(settings)
  }, [settings])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await save(values)
    setStatus('Homepage settings saved.')
  }

  return (
    <AdminShell title="Homepage settings" text="Update hero copy, call-to-action text, and announcements without touching the codebase.">
      <section className="card admin-form-card">
        <form className="field-grid" onSubmit={handleSubmit}>
          <label>
            <span>Hero title</span>
            <textarea
              rows={3}
              value={values.hero_title}
              onChange={e => setValues(prev => ({ ...prev, hero_title: e.target.value }))}
            />
          </label>

          <label>
            <span>Hero subtitle</span>
            <textarea
              rows={4}
              value={values.hero_subtitle}
              onChange={e => setValues(prev => ({ ...prev, hero_subtitle: e.target.value }))}
            />
          </label>

          <label>
            <span>CTA text</span>
            <input
              value={values.hero_cta_text}
              onChange={e => setValues(prev => ({ ...prev, hero_cta_text: e.target.value }))}
            />
          </label>

          <label>
            <span>CTA URL</span>
            <input
              value={values.hero_cta_url}
              onChange={e => setValues(prev => ({ ...prev, hero_cta_url: e.target.value }))}
            />
          </label>

          <label>
            <span>Announcement</span>
            <textarea
              rows={3}
              value={values.announcement}
              onChange={e => setValues(prev => ({ ...prev, announcement: e.target.value }))}
            />
          </label>

          <div className="form-actions">
            <button className="button button-primary">Save settings</button>
            {status && <p className="status-text">{status}</p>}
          </div>
        </form>
      </section>
    </AdminShell>
  )
}