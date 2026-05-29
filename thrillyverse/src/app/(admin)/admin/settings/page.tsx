// src/app/(admin)/admin/settings/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsAdminPanel from '@/components/sections/admin/SettingsAdminPanel';
import type { Profile } from '@/types';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const [{ data: profile }, { data: users }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,email,full_name,avatar_url,role,is_active,created_at,updated_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('id,email,full_name,avatar_url,role,is_active,created_at,updated_at')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Account, roles, and platform preferences.</p>
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
      />
    </div>
  );
}