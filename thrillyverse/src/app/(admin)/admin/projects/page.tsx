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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">
            Manage tools, apps, featured work, links, and publishing status.
          </p>
        </div>
      </div>

      <ProjectsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}