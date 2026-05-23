import { createClient } from '@/lib/supabase/server';
import { CertificationsAdminTable } from '@/components/sections/admin/admin-tables';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CreateCertificationForm } from '@/components/sections/admin/forms';

export default async function AdminCertificationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order');

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Home Page"
        title="Certifications & Trust Badges"
        description="Manage security, compliance, and curriculum certifications shown on the homepage."
      />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Add New Certification</h2>
        <CreateCertificationForm />
      </div>
      <div className="card p-6 section-reveal">
        <CertificationsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}
