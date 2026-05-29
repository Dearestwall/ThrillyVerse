import { createClient } from '@/lib/supabase/server';
import AnnouncementsAdminTable from '@/components/sections/admin/AnnouncementsAdminTable';

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Announcements</h1>
          <p className="admin-page-subtitle">
            Create, prioritize, activate, and manage homepage announcements.
          </p>
        </div>
      </div>

      <AnnouncementsAdminTable initialAnnouncements={(data ?? []) as any} />
    </div>
  );
}