
import { createClient } from '@/lib/supabase/server';
import { MoviesAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateMovieForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminMoviesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Content" title="Movies" description="Add and manage movie listings with watch and download links." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Movie</h2>
        <CreateMovieForm />
      </div>
      <div className="card p-6 section-reveal">
        <MoviesAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}


