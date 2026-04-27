'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const SETTING_FIELDS = [
  { key:'site_name', label:'Site Name' },
  { key:'site_tagline', label:'Tagline' },
  { key:'site_logo_url', label:'Logo URL' },
  { key:'contact_email', label:'Contact Email' },
  { key:'contact_telegram', label:'Contact Telegram URL' },
  { key:'social_telegram_movies', label:'Telegram Movies URL' },
  { key:'social_telegram_material', label:'Telegram Material URL' },
  { key:'social_youtube_gaming', label:'YouTube Gaming URL' },
  { key:'social_youtube_main', label:'YouTube Main URL' },
  { key:'social_instagram', label:'Instagram URL' },
  { key:'adsense_id', label:'AdSense ID' },
  { key:'gtm_id', label:'GTM/Analytics ID' },
]

export default function AdminSettings() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string,string>>({})
  const [privacy, setPrivacy] = useState('')
  const [terms, setTerms] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (!data) return
      const map: Record<string,string> = {}
      data.forEach(({ key, value }) => { map[key] = value })
      setValues(map)
      setPrivacy(map.privacy_policy || '')
      setTerms(map.terms_of_service || '')
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const allValues = { ...values, privacy_policy: privacy, terms_of_service: terms }
    const upserts = Object.entries(allValues).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    setMsg(error ? '❌ ' + error.message : '✅ Settings saved!')
    setSaving(false)
  }

  const inp = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">⚙️ Site Settings</h1>
      {msg && <div className="mb-4 bg-gray-800 rounded-xl px-4 py-3 text-sm text-white">{msg}</div>}
      <form onSubmit={save} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        {SETTING_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-gray-400 text-xs block mb-1">{label}</label>
            <input value={values[key] || ''} onChange={e => setValues({ ...values, [key]: e.target.value })} className={inp} />
          </div>
        ))}
        <div>
          <label className="text-gray-400 text-xs block mb-1">Privacy Policy</label>
          <textarea value={privacy} onChange={e => setPrivacy(e.target.value)} rows={6} className={inp} />
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Terms of Service</label>
          <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={6} className={inp} />
        </div>
        <button type="submit" disabled={saving}
          className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  )
}