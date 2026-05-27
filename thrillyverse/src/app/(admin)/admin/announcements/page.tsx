import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AnnouncementsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateAnnouncementForm } from '@/components/sections/admin/forms';

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('priority', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Platform"
        title="Announcements"
        description="Homepage banners, important notices, and CTA cards."
      />

      <div className="admin-card p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-semibold text-lg">Manage Announcements</h2>
            <p className="text-sm text-text-muted">
              Create, edit, activate, and bulk-manage announcements.
            </p>
          </div>
        </div>
        <CreateAnnouncementForm />
      </div>

      <div className="admin-card p-6">
        <AnnouncementsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}