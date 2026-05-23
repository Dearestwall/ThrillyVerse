import { isSupabaseConfigured, supabase } from './supabase'

export async function trackPageView(path: string) {
  if (!isSupabaseConfigured) return

  try {
    await (supabase.from('page_views') as any).insert({
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 200)
    })
  } catch {
    // silent fail — analytics should never break the app
  }
}