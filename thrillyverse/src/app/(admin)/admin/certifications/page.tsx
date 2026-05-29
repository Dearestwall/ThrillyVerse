import { createClient } from '@/lib/supabase/server';
import CertificationsAdminTable from '@/components/sections/admin/CertificationsAdminTable';

export default async function AdminCertificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certifications</h1>
          <p className="admin-page-subtitle">
            Manage homepage trust badges, highlights, and quality markers.
          </p>
        </div>
      </div>

      <CertificationsAdminTable initialCertifications={(data ?? []) as any} />
    </div>
  );
}