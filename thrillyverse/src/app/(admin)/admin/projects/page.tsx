import { createClient } from '@/lib/supabase/server';
import { ProjectsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateProjectForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Portfolio" title="Projects" description="Add and manage ThrillyVerse projects." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Project</h2>
        <CreateProjectForm />
      </div>
      <div className="card p-6 section-reveal">
        <ProjectsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}
