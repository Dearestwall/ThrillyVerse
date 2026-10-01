import Link from 'next/link';
import type { Blog } from '@/types';
import { formatDate, truncate } from '@/utils';
import { EmptyState } from '@/components/common/EmptyState';
import {
  ArrowRight,
  BookOpen,
  Clock,
} from 'lucide-react';

type BlogsGridProps = {
  blogs: Blog[];
};

const FALLBACK_IMAGE =
  'https://thrillyverse.com/logo-192.png';

export function BlogsGrid({
  blogs,
}: BlogsGridProps) {
  if (!blogs.length) {
    return (
      <EmptyState
        title="No blogs yet"
        description="Published blog posts will appear here."
      />
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {blogs.map((blog, index) => {
        const hasImage =
          typeof blog.cover_image === 'string' &&
          blog.cover_image.trim().length > 0;

        const readingTime =
          Number(blog.read_time) > 0
            ? Number(blog.read_time)
            : 1;

        const publishedDate =
          blog.published_at
            ? formatDate(blog.published_at)
            : null;

        return (
          <article
            key={blog.id}
            className="
              section-reveal
              group
              flex
              h-full
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              shadow-lg
              shadow-black/5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
            style={{
              animationDelay: `${index * 60}ms`,
            }}
          >
            {/* IMAGE
                Completely separate from title/content.
                Nothing is positioned over it. */}
            {hasImage ? (
              <Link
                href={`/blogs/${blog.slug}`}
                aria-label={`Read ${blog.title}`}
                className="block shrink-0"
              >
                <div className="w-full overflow-hidden bg-muted">
                  <img
                    src={blog.cover_image!.trim()}
                    alt={blog.title}
                    width={800}
                    height={450}
                    loading={
                      index < 3
                        ? 'eager'
                        : 'lazy'
                    }
                    decoding="async"
                    className="
                      block
                      h-auto
                      max-h-[340px]
                      min-h-0
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-[1.025]
                    "
                    onError={(event) => {
                      const image =
                        event.currentTarget;

                      if (
                        image.dataset.fallbackApplied ===
                        'true'
                      ) {
                        return;
                      }

                      image.dataset.fallbackApplied =
                        'true';

                      image.src =
                        FALLBACK_IMAGE;
                    }}
                  />
                </div>
              </Link>
            ) : null}

            {/* CONTENT
                Always below the image in normal document flow. */}
            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
                p-5
                sm:p-6
              "
            >
              {/* Category */}
              {blog.category ? (
                <div className="mb-3">
                  <span
                    className="
                      inline-flex
                      max-w-full
                      rounded-full
                      border
                      border-border
                      bg-muted/60
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-text-muted
                    "
                  >
                    {blog.category}
                  </span>
                </div>
              ) : null}

              {/* Metadata */}
              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1
                  text-xs
                  text-text-faint
                "
              >
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={13} />
                  Article
                </span>

                <span
                  aria-hidden="true"
                >
                  •
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  {readingTime} min read
                </span>
              </div>

              {/* Title */}
              <h2
                className="
                  mb-3
                  text-xl
                  font-bold
                  leading-tight
                  tracking-tight
                  break-words
                "
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="
                    transition-colors
                    hover:text-violet-500
                    focus:outline-none
                    focus-visible:underline
                  "
                >
                  {blog.title}
                </Link>
              </h2>

              {/* Excerpt */}
              {blog.excerpt ? (
                <p
                  className="
                    mb-5
                    line-clamp-3
                    flex-1
                    break-words
                    text-sm
                    leading-6
                    text-text-muted
                  "
                >
                  {truncate(
                    blog.excerpt,
                    160
                  )}
                </p>
              ) : (
                <div className="flex-1" />
              )}

              {/* Footer */}
              <div
                className="
                  mt-auto
                  border-t
                  border-border
                  pt-4
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                    text-xs
                    text-text-faint
                  "
                >
                  <span>
                    By ThrillyVerse
                  </span>

                  {publishedDate ? (
                    <time>
                      {publishedDate}
                    </time>
                  ) : null}
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    transition-all
                    duration-200
                    hover:bg-foreground
                    hover:text-background
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-violet-500
                  "
                >
                  Read article
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
