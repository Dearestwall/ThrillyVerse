import { createClient } from '@/lib/supabase/server';
import { AnnouncementsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateAnnouncementForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('announcements').select('*').order('priority', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Platform" title="Announcements" description="Homepage banners, important notices, and CTAs." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Announcement</h2>
        <CreateAnnouncementForm />
      </div>
      <div className="card p-6 section-reveal">
        <AnnouncementsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

