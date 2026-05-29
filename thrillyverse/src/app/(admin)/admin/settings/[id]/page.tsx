import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CreateProjectForm } from '@/components/sections/admin/forms';

export default async function AdminProjectEditPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', params.id).single();

  if (error || !data) notFound();

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Portfolio"
        title={`Edit Project: ${data.title}`}
        description="Update project details, links, stack, and publish state."
      />
      <div className="admin-card p-6">
        <CreateProjectForm />
      </div>
    </div>
  );
}