import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !profile || !profile.is_active || !['super_admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}