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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Notifications</h1>
          <p className="admin-page-subtitle">
            Broadcast updates, alerts, and audience-targeted messages.
          </p>
        </div>
      </div>

      <NotificationsAdminTable initialNotifications={(data ?? []) as any} />
    </div>
  );
}