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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Materials</h1>
          <p className="admin-page-subtitle">
            Manage notes, PDFs, videos, links, premium resources, and featured study materials.
          </p>
        </div>
      </div>

      <MaterialsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}