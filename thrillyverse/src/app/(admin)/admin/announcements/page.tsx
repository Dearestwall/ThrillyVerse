import { createClient } from '@/lib/supabase/server';
import AnnouncementsAdminTable from '@/components/sections/admin/AnnouncementsAdminTable';
import type { Announcement } from '@/types';

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <AnnouncementsAdminTable initialData={(data ?? []) as Announcement[]} />
    </div>
  );
}