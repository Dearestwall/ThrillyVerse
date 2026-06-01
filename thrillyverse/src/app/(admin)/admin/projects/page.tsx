import { createClient } from '@/lib/supabase/server';
import ProjectsAdminTable from '@/components/sections/admin/ProjectsAdminTable';

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <ProjectsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}