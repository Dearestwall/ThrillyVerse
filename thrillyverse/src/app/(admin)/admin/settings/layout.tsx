import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['super_admin', 'editor'].includes(profile.role)) redirect('/');

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b flex items-center justify-end px-6 bg-surface" style={{ borderColor: 'var(--color-divider)' }}>
          <ThemeToggle />
        </header>
        <main id="main-content" className="p-6">{children}</main>
      </div>
    </div>
  );
}