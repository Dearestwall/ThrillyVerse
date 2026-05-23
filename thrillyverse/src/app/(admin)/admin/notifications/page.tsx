import { createClient } from '@/lib/supabase/server';
import { NotificationsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateNotificationForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminNotificationsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Platform" title="Notifications" description="Push messages to students and viewers." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Notification</h2>
        <CreateNotificationForm />
      </div>
      <div className="card p-6 section-reveal">
        <NotificationsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

