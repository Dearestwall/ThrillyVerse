import { createClient } from '@/lib/supabase/server';
import MaterialsAdminTable from '@/components/sections/admin/MaterialsAdminTable';

export default async function AdminMaterialsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('materials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <MaterialsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}