import { createClient } from '@/lib/supabase/server';
import CertificationsAdminTable from '@/components/sections/admin/CertificationsAdminTable';

export default async function AdminCertificationsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certifications</h1>
          <p className="admin-page-subtitle">
            Manage trust badges, certificates, issuers, and showcase order.
          </p>
        </div>
      </div>

      <CertificationsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}