import { createClient } from '@/lib/supabase/server';
import PartnersAdminTable from '@/components/sections/admin/PartnersAdminTable';

export default async function AdminPartnersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <PartnersAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}