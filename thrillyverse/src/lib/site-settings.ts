import { createClient } from '@/lib/supabase/server';

export type AboutHighlight = {
  value: string;
  label: string;
  icon?: 'layers' | 'shield' | 'sparkles' | 'rocket';
};

export type ContactItem = {
  icon: 'mail' | 'telegram' | 'map' | 'clock';
  label: string;
  value: string;
  href: string;
};

export type SocialItem = {
  label: string;
  sub: string;
  href: string;
  icon: 'youtube' | 'instagram' | 'telegram';
};

export type SiteSettings = {
  id: number;
  site_name?: string | null;
  site_tagline?: string | null;
  site_logo_url?: string | null;

  about_eyebrow?: string | null;
  about_title?: string | null;
  about_text_primary?: string | null;
  about_text_secondary?: string | null;
  about_primary_cta_label?: string | null;
  about_primary_cta_href?: string | null;
  about_secondary_cta_label?: string | null;
  about_secondary_cta_href?: string | null;
  about_highlights?: AboutHighlight[] | null;

  contact_eyebrow?: string | null;
  contact_title?: string | null;
  contact_description?: string | null;
  contact_panel_kicker?: string | null;
  contact_panel_title?: string | null;
  contact_panel_text?: string | null;
  contact_email?: string | null;
  contact_telegram?: string | null;
  contact_location?: string | null;
  contact_availability?: string | null;
  contact_info_items?: ContactItem[] | null;

  social_youtube?: string | null;
  social_instagram?: string | null;
  social_telegram?: string | null;
  social_items?: SocialItem[] | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select(`
      id,
      site_name,
      site_tagline,
      site_logo_url,
      about_eyebrow,
      about_title,
      about_text_primary,
      about_text_secondary,
      about_primary_cta_label,
      about_primary_cta_href,
      about_secondary_cta_label,
      about_secondary_cta_href,
      about_highlights,
      contact_eyebrow,
      contact_title,
      contact_description,
      contact_panel_kicker,
      contact_panel_title,
      contact_panel_text,
      contact_email,
      contact_telegram,
      contact_location,
      contact_availability,
      contact_info_items,
      social_youtube,
      social_instagram,
      social_telegram,
      social_items
    `)
    .eq('singleton', true)
    .single();

  if (error) {
    console.error('Failed to fetch site_settings:', error.message);
    return null;
  }

  return data as SiteSettings;
}