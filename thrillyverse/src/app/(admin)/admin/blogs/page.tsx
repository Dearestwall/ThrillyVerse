// src/app/(admin)/admin/blogs/page.tsx
import { createClient } from '@/lib/supabase/server';
import BlogsAdminTable from '@/components/sections/admin/BlogsAdminTable';

export default async function AdminBlogsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p className="admin-page-subtitle">Manage posts, drafts, categories, and publishing.</p>
        </div>
      </div>

      <BlogsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}