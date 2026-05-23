import { createClient } from '@/lib/supabase/server';
import { ReviewsAdminTable } from '@/components/sections/admin/admin-tables';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CreateReviewForm } from '@/components/sections/admin/forms';

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('sort_order');

  const published = (data ?? []).filter(r => r.published).length;
  const featured  = (data ?? []).filter(r => r.featured).length;

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading
        eyebrow="Home Page"
        title={`Reviews & Testimonials (${published} published Â· ${featured} featured)`}
        description="Manage student, viewer, and parent testimonials shown on the homepage."
      />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Add New Review</h2>
        <CreateReviewForm />
      </div>
      <div className="card p-6 section-reveal">
        <ReviewsAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

