import Image from 'next/image';
import Link from 'next/link';
import type { Blog } from '@/types';
import { formatDate, truncate } from '@/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { Clock, Tag } from 'lucide-react';

export function BlogsGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs.length) return <EmptyState title="No blogs yet" description="Add blog posts from admin." />;

  return (
    <div className="blogs-grid">
      {blogs.map((blog: Blog, i) => (
        <article
          key={blog.id}
          className="card blog-card section-reveal"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {blog.cover_image ? (
            <div className="blog-card-img">
              <Image src={blog.cover_image} alt={blog.title} fill className="object-cover" />
              {blog.category && (
                <span className="badge badge-primary absolute top-3 left-3">{blog.category}</span>
              )}
            </div>
          ) : (
            <div className="blog-img-placeholder h-48">✏️</div>
          )}

          <div className="blog-card-body">
            <h2 className="blog-card-title">{blog.title}</h2>
            {blog.excerpt && (
              <p className="text-sm text-text-muted mb-4 leading-relaxed flex-1">
                {truncate(blog.excerpt, 130)}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-text-faint mt-auto mb-4">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {blog.read_time} min read
              </span>
              <span>{blog.published_at ? formatDate(blog.published_at) : 'Draft'}</span>
            </div>
            <Link href={`/blogs/${blog.slug}`} className="btn btn-secondary btn-sm w-full justify-center">
              Read Post →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}