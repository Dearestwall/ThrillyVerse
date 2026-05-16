import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Eye, RefreshCcw, Save, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminShell } from '../../components/admin/AdminShell'
import { AdminLivePreview } from '../../components/admin/AdminLivePreview'
import { AdminPageSection } from '../../components/admin/AdminPageSection'
import { useHomepageSettings } from '../../hooks/useHomepageSettings'

export function AdminHomepage() {
  const { settings, save, saving, loading, error } = useHomepageSettings()
  const [values, setValues] = useState(settings)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setValues(settings)
  }, [settings])

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(settings),
    [values, settings]
  )

  const completionScore = useMemo(() => {
    const checks = [
      values.hero_title,
      values.hero_subtitle,
      values.hero_cta_text,
      values.hero_cta_url,
      values.announcement,
      values.hero_badge,
      values.hero_image_url,
      values.secondary_cta_text,
      values.secondary_cta_url
    ]
    const filled = checks.filter(Boolean).length
    return Math.round((filled / checks.length) * 100)
  }, [values])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('')

    try {
      await save(values)
      setStatus('Homepage settings saved.')
      toast.success('Homepage settings saved')
    } catch (err) {
      console.error(err)
      setStatus('Could not save homepage settings.')
      toast.error('Could not save homepage settings')
    }
  }

  function resetForm() {
    setValues(settings)
    setStatus('')
  }

  function fillDemoContent() {
    setValues((prev) => ({
      ...prev,
      hero_title: prev.hero_title || 'Think Beyond The Verse',
      hero_subtitle:
        prev.hero_subtitle ||
        'A smarter digital hub for study materials, movie updates, blogs, and creative tools.',
      hero_cta_text: prev.hero_cta_text || 'Explore materials',
      hero_cta_url: prev.hero_cta_url || '/materials',
      secondary_cta_text: prev.secondary_cta_text || 'See movies',
      secondary_cta_url: prev.secondary_cta_url || '/movies',
      announcement:
        prev.announcement || 'Now managing homepage sections with live admin preview.',
      hero_badge: prev.hero_badge || 'ThrillyVerse spotlight'
    }))
    toast.success('Demo content added to the editor')
  }

  return (
    <AdminShell
      title="Homepage settings"
      text="Update hero copy, CTA links, visuals, and announcement content while previewing the public-facing result live."
      actions={
        <div className="admin-header-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={fillDemoContent}
            disabled={saving || loading}
          >
            <Wand2 size={16} />
            Fill demo
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={resetForm}
            disabled={saving || !isDirty}
          >
            <RefreshCcw size={16} />
            Reset
          </button>

          <button
            type="submit"
            form="homepage-settings-form"
            className="button button-primary"
            disabled={saving || loading}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      }
    >
      <div className="admin-homepage-grid">
        <AdminPageSection
          title="Homepage editor"
          eyebrow="Content control"
          icon={<Sparkles size={18} />}
          text="Control hero messaging, action buttons, and highlighted announcement blocks without touching source files."
          actions={
            <span className="admin-preview-chip">
              Draft completeness: {completionScore}%
            </span>
          }
        >
          <form id="homepage-settings-form" className="admin-form-grid" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Hero badge</span>
              <input
                value={values.hero_badge ?? ''}
                onChange={(e) => {
                  setStatus('')
                  setValues((prev) => ({ ...prev, hero_badge: e.target.value }))
                }}
                placeholder="ThrillyVerse spotlight"
              />
            </label>

            <label className="admin-field">
              <span>Hero title</span>
              <textarea
                rows={3}
                value={values.hero_title ?? ''}
                onChange={(e) => {
                  setStatus('')
                  setValues((prev) => ({ ...prev, hero_title: e.target.value }))
                }}
                placeholder="A powerful public headline"
              />
            </label>

            <label className="admin-field">
              <span>Hero subtitle</span>
              <textarea
                rows={4}
                value={values.hero_subtitle ?? ''}
                onChange={(e) => {
                  setStatus('')
                  setValues((prev) => ({ ...prev, hero_subtitle: e.target.value }))
                }}
                placeholder="A short supporting description for the homepage"
              />
            </label>

            <div className="admin-form-two">
              <label className="admin-field">
                <span>Primary CTA text</span>
                <input
                  value={values.hero_cta_text ?? ''}
                  onChange={(e) => {
                    setStatus('')
                    setValues((prev) => ({ ...prev, hero_cta_text: e.target.value }))
                  }}
                  placeholder="Explore"
                />
              </label>

              <label className="admin-field">
                <span>Primary CTA URL</span>
                <input
                  value={values.hero_cta_url ?? ''}
                  onChange={(e) => {
                    setStatus('')
                    setValues((prev) => ({ ...prev, hero_cta_url: e.target.value }))
                  }}
                  placeholder="/materials"
                />
              </label>
            </div>

            <div className="admin-form-two">
              <label className="admin-field">
                <span>Secondary CTA text</span>
                <input
                  value={values.secondary_cta_text ?? ''}
                  onChange={(e) => {
                    setStatus('')
                    setValues((prev) => ({ ...prev, secondary_cta_text: e.target.value }))
                  }}
                  placeholder="See movies"
                />
              </label>

              <label className="admin-field">
                <span>Secondary CTA URL</span>
                <input
                  value={values.secondary_cta_url ?? ''}
                  onChange={(e) => {
                    setStatus('')
                    setValues((prev) => ({ ...prev, secondary_cta_url: e.target.value }))
                  }}
                  placeholder="/movies"
                />
              </label>
            </div>

            <label className="admin-field">
              <span>Hero image URL</span>
              <input
                value={values.hero_image_url ?? ''}
                onChange={(e) => {
                  setStatus('')
                  setValues((prev) => ({ ...prev, hero_image_url: e.target.value }))
                }}
                placeholder="https://..."
              />
            </label>

            <label className="admin-field">
              <span>Announcement</span>
              <textarea
                rows={3}
                value={values.announcement ?? ''}
                onChange={(e) => {
                  setStatus('')
                  setValues((prev) => ({ ...prev, announcement: e.target.value }))
                }}
                placeholder="Optional banner or highlighted message"
              />
            </label>

            {(status || error) && (
              <div className={error ? 'admin-inline-status error' : 'admin-inline-status success'}>
                {error || status}
              </div>
            )}
          </form>
        </AdminPageSection>

        <AdminPageSection
          title="Live preview"
          eyebrow="Realtime render"
          icon={<Eye size={18} />}
          text="This preview updates instantly as you edit the fields, so you can shape the homepage before publishing changes."
          actions={
            <span className="admin-preview-chip">
              <Eye size={16} />
              Live
            </span>
          }
        >
          <AdminLivePreview
            title={values.hero_title}
            subtitle={values.hero_subtitle}
            ctaText={values.hero_cta_text}
            ctaUrl={values.hero_cta_url}
            secondaryCtaText={values.secondary_cta_text}
            secondaryCtaUrl={values.secondary_cta_url}
            announcement={values.announcement}
            badge={values.hero_badge}
            heroImageUrl={values.hero_image_url}
          />
        </AdminPageSection>
      </div>
    </AdminShell>
  )
}