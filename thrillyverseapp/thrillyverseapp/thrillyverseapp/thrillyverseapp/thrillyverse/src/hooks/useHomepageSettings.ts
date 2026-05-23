import { useEffect, useState } from 'react'
import { demoHomepageSettings } from '../data/demo'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { HomepageSettings } from '../types'

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSettings>(demoHomepageSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const { data } = await supabase.from('homepage_settings').select('*').limit(1).maybeSingle()
      if (data) setSettings(data as HomepageSettings)
      setLoading(false)
    }

    load()
  }, [])

  const save = async (payload: HomepageSettings) => {
    setSettings(payload)
    if (!isSupabaseConfigured) return

    const { error } = await supabase.from('homepage_settings').upsert(payload)
    if (error) throw new Error(error.message)
  }

  return { settings, loading, save }
}