import { createClient } from '@/lib/supabase/server';
import NotificationsAdminTable from '@/components/sections/admin/NotificationsAdminTable';

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <NotificationsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}