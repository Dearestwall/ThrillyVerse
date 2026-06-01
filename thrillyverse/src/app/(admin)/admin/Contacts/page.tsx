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
      <ContactsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}