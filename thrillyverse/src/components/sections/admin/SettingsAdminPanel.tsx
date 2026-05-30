'use client';

import { useMemo, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import {
  Users,
  Shield,
  User,
  Globe,
  Mail,
  Youtube,
  Instagram,
  SendHorizonal,
  Save,
  LayoutTemplate,
  Settings2,
} from 'lucide-react';
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
  id?: number;
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

export default function SettingsAdminPanel({
  profile,
  allUsers,
  settings,
}: {
  profile: Profile;
  allUsers: Profile[];
  settings?: SiteSettings | null;
}) {
  const supabase = createClient();

  const [users, setUsers] = useState<Profile[]>(allUsers);
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [isPending, startTransition] = useTransition();
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [siteForm, setSiteForm] = useState<SiteSettings>({
    id: settings?.id,
    site_name: settings?.site_name ?? 'ThrillyVerse',
    site_tagline: settings?.site_tagline ?? 'Think Beyond The Verse',
    site_logo_url:
      settings?.site_logo_url ?? 'https://i.ibb.co/0pjPXpZy/thrillyverse.png',

    about_eyebrow: settings?.about_eyebrow ?? 'About Us',
    about_title:
      settings?.about_title ?? 'A dynamic platform for students and creators',
    about_text_primary:
      settings?.about_text_primary ??
      'ThrillyVerse combines structured educational content, engaging media, publishing tools and creator-focused updates in one clean, fast platform.',
    about_text_secondary:
      settings?.about_text_secondary ??
      'Every major section is managed from the admin panel, keeping the platform scalable, low-cost and easy to maintain across Supabase, Cloudinary, EmailJS and Vercel.',
    about_primary_cta_label:
      settings?.about_primary_cta_label ?? 'Get In Touch',
    about_primary_cta_href: settings?.about_primary_cta_href ?? '/#contact',
    about_secondary_cta_label:
      settings?.about_secondary_cta_label ?? 'Explore Blogs',
    about_secondary_cta_href: settings?.about_secondary_cta_href ?? '/blogs',
    about_highlights:
      settings?.about_highlights ?? [
        { value: '4', label: 'Public Pages', icon: 'layers' },
        { value: '8+', label: 'Admin Modules', icon: 'shield' },
        { value: '100%', label: 'Admin Managed', icon: 'sparkles' },
        { value: '∞', label: 'Free Content', icon: 'rocket' },
      ],

    contact_eyebrow: settings?.contact_eyebrow ?? 'Get in Touch',
    contact_title: settings?.contact_title ?? 'Contact ThrillyVerse',
    contact_description:
      settings?.contact_description ??
      'Questions, ideas, feedback or collaboration — reach out through the form or our official social channels.',
    contact_panel_kicker:
      settings?.contact_panel_kicker ?? 'Official Contact',
    contact_panel_title:
      settings?.contact_panel_title ?? 'We would love to hear from you',
    contact_panel_text:
      settings?.contact_panel_text ??
      'Use your preferred channel and we will guide you to the right place quickly.',
    contact_email: settings?.contact_email ?? 'thrillyverse@gmail.com',
    contact_telegram:
      settings?.contact_telegram ?? 'https://t.me/+LniQHT_ltBsyNmE1',
    contact_location: settings?.contact_location ?? 'Punjab, India',
    contact_availability:
      settings?.contact_availability ?? 'Usually replies within 24 hours',
    contact_info_items:
      settings?.contact_info_items ?? [
        {
          icon: 'mail',
          label: 'Email',
          value: 'thrillyverse@gmail.com',
          href: 'mailto:thrillyverse@gmail.com',
        },
        {
          icon: 'telegram',
          label: 'Telegram',
          value: '@ThrillyVerse',
          href: 'https://t.me/+LniQHT_ltBsyNmE1',
        },
        {
          icon: 'map',
          label: 'Based in',
          value: 'Punjab, India',
          href: '#',
        },
        {
          icon: 'clock',
          label: 'Availability',
          value: 'Usually replies within 24 hours',
          href: '#',
        },
      ],

    social_youtube:
      settings?.social_youtube ?? 'https://www.youtube.com/@ThrillyVerse',
    social_instagram:
      settings?.social_instagram ??
      'https://www.instagram.com/thrillyverse/',
    social_telegram:
      settings?.social_telegram ?? 'https://t.me/thrillmoviesverse',
    social_items:
      settings?.social_items ?? [
        {
          label: 'YouTube',
          sub: 'Main channel',
          href: 'https://www.youtube.com/@ThrillyVerse',
          icon: 'youtube',
        },
        {
          label: 'Instagram',
          sub: 'Behind the scenes',
          href: 'https://www.instagram.com/thrillyverse/',
          icon: 'instagram',
        },
        {
          label: 'Telegram',
          sub: 'Fast updates',
          href: 'https://t.me/thrillmoviesverse',
          icon: 'telegram',
        },
      ],
  });

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (fullName.trim()) score += 1;
    if (profile.email) score += 1;
    if (profile.role) score += 1;
    return `${score}/3`;
  }, [fullName, profile.email, profile.role]);

  const updateName = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id);

    if (error) {
      toast.error(error.message || 'Failed to update profile');
      return;
    }

    toast.success('Profile updated');
  };

  const saveSiteSettings = async () => {
    setIsSavingSettings(true);

    try {
      const payload = {
        singleton: true,
        site_name: siteForm.site_name ?? null,
        site_tagline: siteForm.site_tagline ?? null,
        site_logo_url: siteForm.site_logo_url ?? null,

        about_eyebrow: siteForm.about_eyebrow ?? null,
        about_title: siteForm.about_title ?? null,
        about_text_primary: siteForm.about_text_primary ?? null,
        about_text_secondary: siteForm.about_text_secondary ?? null,
        about_primary_cta_label: siteForm.about_primary_cta_label ?? null,
        about_primary_cta_href: siteForm.about_primary_cta_href ?? null,
        about_secondary_cta_label: siteForm.about_secondary_cta_label ?? null,
        about_secondary_cta_href: siteForm.about_secondary_cta_href ?? null,
        about_highlights: siteForm.about_highlights ?? [],

        contact_eyebrow: siteForm.contact_eyebrow ?? null,
        contact_title: siteForm.contact_title ?? null,
        contact_description: siteForm.contact_description ?? null,
        contact_panel_kicker: siteForm.contact_panel_kicker ?? null,
        contact_panel_title: siteForm.contact_panel_title ?? null,
        contact_panel_text: siteForm.contact_panel_text ?? null,
        contact_email: siteForm.contact_email ?? null,
        contact_telegram: siteForm.contact_telegram ?? null,
        contact_location: siteForm.contact_location ?? null,
        contact_availability: siteForm.contact_availability ?? null,
        contact_info_items: siteForm.contact_info_items ?? [],

        social_youtube: siteForm.social_youtube ?? null,
        social_instagram: siteForm.social_instagram ?? null,
        social_telegram: siteForm.social_telegram ?? null,
        social_items: siteForm.social_items ?? [],
      };

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(payload, { onConflict: 'singleton' })
        .select('id')
        .single();

      if (error) {
        toast.error(error.message || 'Failed to save site settings');
        return;
      }

      setSiteForm((prev) => ({
        ...prev,
        id: data?.id ?? prev.id,
      }));

      toast.success('Site settings updated');
    } catch {
      toast.error('Failed to save site settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    startTransition(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) {
        toast.error(error.message || 'Failed to update user');
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                is_active: !isActive,
              }
            : u
        )
      );

      toast.success(isActive ? 'User deactivated' : 'User activated');
    });
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSiteForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHighlight = (
    index: number,
    key: keyof AboutHighlight,
    value: string
  ) => {
    const next = [...(siteForm.about_highlights ?? [])];
    next[index] = { ...next[index], [key]: value };
    setSiteForm((prev) => ({ ...prev, about_highlights: next }));
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          <Shield size={20} className="admin-page-title-icon" /> Settings
        </h1>
      </div>

      <div className="admin-stats-grid pro-stats-grid">
        <div className="admin-stat-card admin-stat-default">
          <span className="admin-stat-label">Profile Completion</span>
          <strong className="admin-stat-value">{profileCompletion}</strong>
        </div>
        <div className="admin-stat-card admin-stat-success">
          <span className="admin-stat-label">Total Users</span>
          <strong className="admin-stat-value">{users.length}</strong>
        </div>
        <div className="admin-stat-card admin-stat-warning">
          <span className="admin-stat-label">Active Users</span>
          <strong className="admin-stat-value">
            {users.filter((u) => u.is_active).length}
          </strong>
        </div>
      </div>

      <div className="admin-section-card">
        <h2 className="admin-section-title">
          <User size={16} className="inline mr-2" />
          Your Profile
        </h2>

        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={profile.email ?? ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-input"
              value={profile.role ?? ''}
              disabled
            />
          </div>
        </div>

        <button onClick={updateName} className="btn btn-primary btn-sm mt-2">
          <Save size={14} />
          Save Changes
        </button>
      </div>

      <div className="admin-section-card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="admin-section-title">
            <Globe size={16} className="inline mr-2" />
            Site Content Settings
          </h2>

          <button
            type="button"
            onClick={saveSiteSettings}
            disabled={isSavingSettings}
            className="btn btn-primary btn-sm"
          >
            <Save size={14} />
            {isSavingSettings ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>

        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Site Name</label>
            <input
              className="form-input"
              value={siteForm.site_name ?? ''}
              onChange={(e) => updateSetting('site_name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Site Tagline</label>
            <input
              className="form-input"
              value={siteForm.site_tagline ?? ''}
              onChange={(e) => updateSetting('site_tagline', e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Site Logo URL</label>
            <input
              className="form-input"
              value={siteForm.site_logo_url ?? ''}
              onChange={(e) => updateSetting('site_logo_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <h2 className="admin-section-title">
          <LayoutTemplate size={16} className="inline mr-2" />
          About Section
        </h2>

        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Eyebrow</label>
            <input
              className="form-input"
              value={siteForm.about_eyebrow ?? ''}
              onChange={(e) => updateSetting('about_eyebrow', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              value={siteForm.about_title ?? ''}
              onChange={(e) => updateSetting('about_title', e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Primary Text</label>
            <textarea
              className="form-input"
              rows={4}
              value={siteForm.about_text_primary ?? ''}
              onChange={(e) => updateSetting('about_text_primary', e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Secondary Text</label>
            <textarea
              className="form-input"
              rows={4}
              value={siteForm.about_text_secondary ?? ''}
              onChange={(e) => updateSetting('about_text_secondary', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary CTA Label</label>
            <input
              className="form-input"
              value={siteForm.about_primary_cta_label ?? ''}
              onChange={(e) =>
                updateSetting('about_primary_cta_label', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary CTA Link</label>
            <input
              className="form-input"
              value={siteForm.about_primary_cta_href ?? ''}
              onChange={(e) =>
                updateSetting('about_primary_cta_href', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secondary CTA Label</label>
            <input
              className="form-input"
              value={siteForm.about_secondary_cta_label ?? ''}
              onChange={(e) =>
                updateSetting('about_secondary_cta_label', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secondary CTA Link</label>
            <input
              className="form-input"
              value={siteForm.about_secondary_cta_href ?? ''}
              onChange={(e) =>
                updateSetting('about_secondary_cta_href', e.target.value)
              }
            />
          </div>
        </div>

        <div className="settings-subsection mt-6">
          <h3 className="admin-section-subtitle">About Analytics</h3>

          <div className="settings-analytics-grid">
            {(siteForm.about_highlights ?? []).map((item, index) => (
              <div key={`${item.label}-${index}`} className="settings-analytics-item">
                <div className="form-group">
                  <label className="form-label">Value</label>
                  <input
                    className="form-input"
                    value={item.value}
                    onChange={(e) => updateHighlight(index, 'value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Label</label>
                  <input
                    className="form-input"
                    value={item.label}
                    onChange={(e) => updateHighlight(index, 'label', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <select
                    className="form-input"
                    value={item.icon ?? 'sparkles'}
                    onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                  >
                    <option value="layers">Layers</option>
                    <option value="shield">Shield</option>
                    <option value="sparkles">Sparkles</option>
                    <option value="rocket">Rocket</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <h2 className="admin-section-title">
          <Mail size={16} className="inline mr-2" />
          Contact Section
        </h2>

        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Section Eyebrow</label>
            <input
              className="form-input"
              value={siteForm.contact_eyebrow ?? ''}
              onChange={(e) => updateSetting('contact_eyebrow', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input
              className="form-input"
              value={siteForm.contact_title ?? ''}
              onChange={(e) => updateSetting('contact_title', e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Section Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={siteForm.contact_description ?? ''}
              onChange={(e) =>
                updateSetting('contact_description', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Panel Kicker</label>
            <input
              className="form-input"
              value={siteForm.contact_panel_kicker ?? ''}
              onChange={(e) =>
                updateSetting('contact_panel_kicker', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Panel Title</label>
            <input
              className="form-input"
              value={siteForm.contact_panel_title ?? ''}
              onChange={(e) =>
                updateSetting('contact_panel_title', e.target.value)
              }
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Panel Text</label>
            <textarea
              className="form-input"
              rows={3}
              value={siteForm.contact_panel_text ?? ''}
              onChange={(e) =>
                updateSetting('contact_panel_text', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input
              className="form-input"
              value={siteForm.contact_email ?? ''}
              onChange={(e) => updateSetting('contact_email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telegram Link</label>
            <input
              className="form-input"
              value={siteForm.contact_telegram ?? ''}
              onChange={(e) => updateSetting('contact_telegram', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              className="form-input"
              value={siteForm.contact_location ?? ''}
              onChange={(e) => updateSetting('contact_location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Availability</label>
            <input
              className="form-input"
              value={siteForm.contact_availability ?? ''}
              onChange={(e) =>
                updateSetting('contact_availability', e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <h2 className="admin-section-title">
          <Settings2 size={16} className="inline mr-2" />
          Social Links
        </h2>

        <div className="settings-social-grid mt-4">
          <div className="settings-social-item">
            <div className="settings-social-head">
              <span className="settings-social-icon">
                <Youtube size={15} />
              </span>
              <span className="settings-social-name">YouTube</span>
            </div>
            <input
              className="form-input"
              value={siteForm.social_youtube ?? ''}
              onChange={(e) => updateSetting('social_youtube', e.target.value)}
              placeholder="https://www.youtube.com/@ThrillyVerse"
            />
          </div>

          <div className="settings-social-item">
            <div className="settings-social-head">
              <span className="settings-social-icon">
                <Instagram size={15} />
              </span>
              <span className="settings-social-name">Instagram</span>
            </div>
            <input
              className="form-input"
              value={siteForm.social_instagram ?? ''}
              onChange={(e) => updateSetting('social_instagram', e.target.value)}
              placeholder="https://www.instagram.com/thrillyverse/"
            />
          </div>

          <div className="settings-social-item">
            <div className="settings-social-head">
              <span className="settings-social-icon">
                <SendHorizonal size={15} />
              </span>
              <span className="settings-social-name">Telegram</span>
            </div>
            <input
              className="form-input"
              value={siteForm.social_telegram ?? ''}
              onChange={(e) => updateSetting('social_telegram', e.target.value)}
              placeholder="https://t.me/thrillmoviesverse"
            />
          </div>
        </div>
      </div>

      {profile.role === 'super_admin' && (
        <div className="admin-section-card">
          <h2 className="admin-section-title">
            <Users size={16} className="inline mr-2" />
            All Users
          </h2>

          <div className="table-wrapper mt-4">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.is_active ? 'badge-success' : 'badge-muted'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      {u.id !== profile.id && (
                        <button
                          type="button"
                          onClick={() => toggleUserActive(u.id, !!u.is_active)}
                          disabled={isPending}
                          className="btn btn-ghost btn-sm text-xs"
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
