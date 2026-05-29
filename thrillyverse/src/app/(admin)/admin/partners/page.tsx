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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Partners</h1>
          <p className="admin-page-subtitle">
            Control logos, links, ordering, and active homepage partner listings.
          </p>
        </div>
      </div>

      <PartnersAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}