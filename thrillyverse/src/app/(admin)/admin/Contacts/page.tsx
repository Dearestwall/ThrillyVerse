import { createClient } from '@/lib/supabase/server';
import { ContactsAdminTable } from '@/components/sections/admin/admin-tables';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminContactsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  const unread = (data ?? []).filter(r => !r.read).length;

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Inbox"
        title={`Contact Messages ${unread > 0 ? `(${unread} unread)` : ''}`}
        description="Messages submitted through the contact form on the website."
      />
      <div className="card p-6 section-reveal">
        <ContactsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}
