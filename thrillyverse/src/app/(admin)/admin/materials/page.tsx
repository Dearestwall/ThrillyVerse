import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MaterialsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateMaterialForm } from '@/components/sections/admin/forms';

export default async function AdminMaterialsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Education"
        title="Study Materials"
        description="Upload notes, PDFs, links, and learning resources."
      />

      <div className="admin-card p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-semibold text-lg">Manage Materials</h2>
            <p className="text-sm text-text-muted">
              Add, edit, publish, and bulk-manage resources.
            </p>
          </div>
        </div>
        <CreateMaterialForm />
      </div>

      <div className="admin-card p-6">
        <MaterialsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}