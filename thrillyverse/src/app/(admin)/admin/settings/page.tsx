import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsAdminPanel from '@/components/sections/admin/SettingsAdminPanel';
import type { Profile } from '@/types';

type AboutHighlight = {
  value: string;
  label: string;
  icon?: 'layers' | 'shield' | 'sparkles' | 'rocket';
};

type ContactItem = {
  icon: 'mail' | 'telegram' | 'map' | 'clock';
  label: string;
  value: string;
  href: string;
};

type SocialItem = {
  label: string;
  sub: string;
  href: string;
  icon: 'youtube' | 'instagram' | 'telegram';
};

type SiteSettings = {
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

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const [{ data: profile }, { data: users }, { data: siteSettings }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,email,full_name,avatar_url,role,is_active,created_at,updated_at')
      .eq('id', user.id)
      .single(),

    supabase
      .from('profiles')
      .select('id,email,full_name,avatar_url,role,is_active,created_at,updated_at')
      .order('created_at', { ascending: false }),

    supabase
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
      .single(),
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">
            Account, roles, and platform preferences.
          </p>
        </div>
      </div>

      <SettingsAdminPanel
        profile={(profile ?? null) as Profile}
        allUsers={((users ?? []).map((u) => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          avatar_url: u.avatar_url ?? null,
          role: u.role,
          is_active: u.is_active,
          created_at: u.created_at,
          updated_at: u.updated_at ?? null,
        })) ?? []) as Profile[]}
        settings={(siteSettings ?? null) as SiteSettings | null}
      />
    </div>
  );
}