import { createClient } from '@/lib/supabase/server';
import ContactsAdminTable from '@/components/sections/admin/ContactsAdminTable';

export default async function AdminContactsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contacts</h1>
          <p className="admin-page-subtitle">
            Review, search, and manage contact submissions from your audience.
          </p>
        </div>
      </div>

      <ContactsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}