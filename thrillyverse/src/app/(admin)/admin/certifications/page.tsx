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
      <CertificationsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}