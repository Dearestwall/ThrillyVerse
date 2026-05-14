import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useBlogs } from '../hooks/resources'

export function BlogDetailPage() {
  const { slug } = useParams()
  const { items } = useBlogs()

  const blog = items.find(item => item.slug === slug && item.published)

  if (!blog) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Blog</p>
            <h1>Article not found</h1>
            <p>This article is missing or not published yet.</p>
            <Link to="/blogs" className="button button-primary">
              Back to blogs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const paragraphs = blog.content
    ? blog.content.split('\n').map(part => part.trim()).filter(Boolean)
    : []

  return (
    <article className="section blog-detail-page">
      <Helmet>
        <title>{blog.title} | ThrillyVerse Blogs</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <div className="container narrow-container">
        <p className="eyebrow">{blog.category}</p>
        <h1 className="blog-detail-title">{blog.title}</h1>
        <p className="blog-detail-excerpt">{blog.excerpt}</p>

        <img src={blog.cover_url} alt={blog.title} className="blog-detail-cover card" />

        <div className="blog-rich-text card">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{blog.content}</p>
          )}
        </div>
      </div>
    </article>
  )
}