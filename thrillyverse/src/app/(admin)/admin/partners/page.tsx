import { createClient } from '@/lib/supabase/server';
import { PartnersAdminTable } from '@/components/sections/admin/admin-tables';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CreatePartnerForm } from '@/components/sections/admin/forms';

export default async function AdminPartnersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order');

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Home Page"
        title="Partners"
        description="Manage partner logos and links shown on the homepage."
      />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Add New Partner</h2>
        <CreatePartnerForm />
      </div>
      <div className="card p-6 section-reveal">
        <PartnersAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

