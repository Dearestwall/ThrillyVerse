import { createClient } from '@/lib/supabase/server'

export type SiteSettings = {
  site_name: string
  site_tagline: string
  site_logo_url: string
  contact_email: string
  contact_telegram: string
  social_telegram_movies: string
  social_telegram_material: string
  social_youtube_gaming: string
  social_youtube_main: string
  social_instagram: string
  privacy_policy: string
  terms_of_service: string
  adsense_id: string
  gtm_id: string
}

const DEFAULTS: SiteSettings = {
  site_name: 'ThrillyVerse',
  site_tagline: 'Think Beyond The Verse',
  site_logo_url: 'https://i.ibb.co/0pjPXpZy/thrillyverse.png',
  contact_email: 'thrillyverse@gmail.com',
  contact_telegram: 'https://t.me/+LniQHT_ltBsyNmE1',
  social_telegram_movies: 'https://t.me/thrillmoviesverse',
  social_telegram_material: 'https://t.me/icseverse',
  social_youtube_gaming: 'https://youtube.com/channel/UCGSsWtRJ5ciemRsuFfixmvQ',
  social_youtube_main: 'https://www.youtube.com/@ThrillyVerse',
  social_instagram: 'https://www.instagram.com/thrillyverse/',
  privacy_policy: '',
  terms_of_service: '',
  adsense_id: 'ca-pub-5755659850244383',
  gtm_id: 'G-DR54STFG33',
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error || !data || data.length === 0) return DEFAULTS

    const map: Record<string, string> = {}
    data.forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value
    })

    return {
      site_name: map['site_name'] ?? DEFAULTS.site_name,
      site_tagline: map['site_tagline'] ?? DEFAULTS.site_tagline,
      site_logo_url: map['site_logo_url'] ?? DEFAULTS.site_logo_url,
      contact_email: map['contact_email'] ?? DEFAULTS.contact_email,
      contact_telegram: map['contact_telegram'] ?? DEFAULTS.contact_telegram,
      social_telegram_movies: map['social_telegram_movies'] ?? DEFAULTS.social_telegram_movies,
      social_telegram_material: map['social_telegram_material'] ?? DEFAULTS.social_telegram_material,
      social_youtube_gaming: map['social_youtube_gaming'] ?? DEFAULTS.social_youtube_gaming,
      social_youtube_main: map['social_youtube_main'] ?? DEFAULTS.social_youtube_main,
      social_instagram: map['social_instagram'] ?? DEFAULTS.social_instagram,
      privacy_policy: map['privacy_policy'] ?? DEFAULTS.privacy_policy,
      terms_of_service: map['terms_of_service'] ?? DEFAULTS.terms_of_service,
      adsense_id: map['adsense_id'] ?? DEFAULTS.adsense_id,
      gtm_id: map['gtm_id'] ?? DEFAULTS.gtm_id,
    }
  } catch {
    return DEFAULTS
  }
}