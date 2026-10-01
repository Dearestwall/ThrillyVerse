import Link from 'next/link';
import type { Blog } from '@/types';
import { formatDate, truncate } from '@/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

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
        const image =
          blog.cover_image ||
          FALLBACK_IMAGE;

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
            {/* Cover image */}
            <Link
              href={`/blogs/${blog.slug}`}
              aria-label={`Read ${blog.title}`}
              className="block"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={image}
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
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                  onError={(event) => {
                    const target =
                      event.currentTarget;

                    if (
                      target.src !==
                      FALLBACK_IMAGE
                    ) {
                      target.src =
                        FALLBACK_IMAGE;
                    }
                  }}
                />

                {/* Image overlay */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/45
                    via-transparent
                    to-transparent
                    opacity-60
                  "
                />

                {/* Category */}
                {blog.category ? (
                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-full
                      border
                      border-white/20
                      bg-black/50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {blog.category}
                  </span>
                ) : null}
              </div>
            </Link>

            {/* Content */}
            <div
              className="
                flex
                flex-1
                flex-col
                p-5
                sm:p-6
              "
            >
              {/* Metadata */}
              <div className="mb-3 flex items-center gap-3 text-xs text-text-faint">
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
              <h2 className="
                mb-3
                text-xl
                font-bold
                leading-tight
                tracking-tight
                transition-colors
                group-hover:text-violet-500
              ">
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="focus:outline-none"
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
                <p
                  className="
                    mb-5
                    flex-1
                    text-sm
                    leading-6
                    text-text-muted
                  "
                >
                  Explore this article on
                  ThrillyVerse.
                </p>
              )}

              {/* Bottom information */}
              <div
                className="
                  mt-auto
                  border-t
                  border-border
                  pt-4
                "
              >
                <div className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-xs
                  text-text-faint
                ">
                  <span>
                    By ThrillyVerse
                  </span>

                  {publishedDate ? (
                    <time>
                      {publishedDate}
                    </time>
                  ) : (
                    <span>
                      Published
                    </span>
                  )}
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
                  "
                >
                  Read article
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
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
