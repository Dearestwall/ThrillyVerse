import { useEffect, useState } from 'react'
import { demoHomepageSettings } from '../data/demo'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { HomepageSettings } from '../types'

const SETTINGS_ID = 'home-default'

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSettings>({
    ...demoHomepageSettings,
    id: SETTINGS_ID
  } as HomepageSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const response = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .maybeSingle()

      if (response.error) {
        setError(response.error.message)
      } else if (response.data) {
        setSettings(response.data as HomepageSettings)
      }

      setLoading(false)
    }

    void load()
  }, [])

  const save = async (payload: HomepageSettings) => {
    const normalized = { ...payload, id: SETTINGS_ID } as HomepageSettings

    setSaving(true)
    setError(null)
    setSettings(normalized)

    try {
      if (!isSupabaseConfigured) return

      const response = await supabase
        .from('homepage_settings')
        .upsert(normalized, { onConflict: 'id' })
        .select()
        .single()

      if (response.error) throw new Error(response.error.message)

      if (response.data) {
        setSettings(response.data as HomepageSettings)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save homepage settings.'
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  return { settings, loading, saving, error, save }
}