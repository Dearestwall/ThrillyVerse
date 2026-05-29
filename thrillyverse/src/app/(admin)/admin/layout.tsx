import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/layout/AdminSidebar';
import {ThemeToggle} from '@/components/common/ThemeToggle';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active || !['super_admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell">
      <AdminSidebar role={profile.role} userName={profile.full_name} avatarUrl={profile.avatar_url} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-right">
            <ThemeToggle />
            <span className="admin-user-badge">{profile.role.replace('_', ' ')}</span>
          </div>
        </header>
        <main id="main-content" className="admin-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}