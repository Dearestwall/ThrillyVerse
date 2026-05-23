import { createClient } from '@/lib/supabase/server';
import { BlogsAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateBlogForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminBlogsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Content" title="Blogs" description="Create, publish, and manage blog articles." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Blog</h2>
        <CreateBlogForm />
      </div>
      <div className="card p-6 section-reveal">
        <BlogsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

