import { createClient } from '@/lib/supabase/server';
import { MaterialsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateMaterialForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminMaterialsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Education" title="Study Materials" description="Upload and manage notes, PDFs, videos, and resources." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Material</h2>
        <CreateMaterialForm />
      </div>
      <div className="card p-6 section-reveal">
        <MaterialsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}


