import { ArrowRight, Film, FolderKanban, LibraryBig, Newspaper } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/cards/ProjectCard'
import { MaterialCard } from '../components/cards/MaterialCard'
import { MovieCard } from '../components/cards/MovieCard'
import { BlogCard } from '../components/cards/BlogCard'
import { SectionTitle } from '../components/ui/SectionTitle'
import { ContactForm } from '../components/ContactForm'
import { useHomepageSettings } from '../hooks/useHomepageSettings'
import { useBlogs, useMaterials, useMovies, useProjects } from '../hooks/resources'

export function HomePage() {
  const { settings } = useHomepageSettings()
  const { items: projects } = useProjects()
  const { items: materials } = useMaterials()
  const { items: movies } = useMovies()
  const { items: blogs } = useBlogs()

  const featuredProjects = projects.filter(item => item.featured).slice(0, 3)
  const featuredMaterials = materials.filter(item => item.featured).slice(0, 3)
  const featuredMovies = movies.filter(item => item.featured).slice(0, 3)
  const publishedBlogs = blogs.filter(item => item.published).slice(0, 3)

  return (
    <>
      <Helmet>
        <title>ThrillyVerse | Think Beyond The Verse</title>
        <meta
          name="description"
          content="Explore ThrillyVerse materials, movies, blogs, projects, and admin-powered content updates."
        />
      </Helmet>

      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="eyebrow">ThrillyVerse digital ecosystem</p>
            <h1>{settings.hero_title}</h1>
            <p className="hero-text">{settings.hero_subtitle}</p>

            <div className="hero-actions">
  <Link to={settings.hero_cta_url || '/materials'} className="button button-primary">
    {settings.hero_cta_text || 'Explore now'}
  </Link>
  <Link to="/blogs" className="button button-ghost">
    Read blogs
  </Link>
</div>

            {settings.announcement && <div className="announcement-pill">{settings.announcement}</div>}
          </motion.div>

          <motion.div
            className="hero-panel card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <div className="hero-panel-top">
              <div className="signal">
                <span />
                <span />
                <span />
              </div>
              <strong>Live-ready content system</strong>
            </div>

            <div className="hero-mosaic">
              <article className="mini-showcase accent-a">
                <LibraryBig size={22} />
                <span>Materials</span>
              </article>
              <article className="mini-showcase accent-b">
                <Film size={22} />
                <span>Movies</span>
              </article>
              <article className="mini-showcase accent-c">
                <Newspaper size={22} />
                <span>Blogs</span>
              </article>
              <article className="mini-showcase accent-d">
                <FolderKanban size={22} />
                <span>Projects</span>
              </article>
            </div>

            <div className="hero-panel-note">
              Admin-managed sections, smart public pages, and future-ready Supabase storage.
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section stats-strip-section">
  <div className="container public-stats-grid">
    <article className="card public-stat-card">
      <strong>{projects.length}</strong>
      <span>Projects</span>
    </article>
    <article className="card public-stat-card">
      <strong>{materials.length}</strong>
      <span>Materials</span>
    </article>
    <article className="card public-stat-card">
      <strong>{movies.length}</strong>
      <span>Movies & series</span>
    </article>
    <article className="card public-stat-card">
      <strong>{blogs.filter(item => item.published).length}</strong>
      <span>Published blogs</span>
    </article>
  </div>
</section>

      <section className="section">
        <div className="container feature-strip">
          <div className="card feature-blurb">
            <strong>Professional layout</strong>
            <p>Balanced public pages and compact admin screens.</p>
          </div>
          <div className="card feature-blurb">
            <strong>Dynamic sections</strong>
            <p>Projects, materials, movies, and blogs can all be data-driven.</p>
          </div>
          <div className="card feature-blurb">
            <strong>Free stack</strong>
            <p>Supabase and EmailJS keep the first version affordable.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Featured projects"
            title="Interactive tools and utilities"
            text="Project cards can be created from the admin area and highlighted on the homepage."
          />
          <div className="card-grid three">
            {(featuredProjects.length ? featuredProjects : projects.slice(0, 3)).map(item => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <SectionTitle
            eyebrow="Materials"
            title="Study content that stays easy to browse"
            text="Organize folders by subject, class, and featured priority with a cleaner student-facing experience."
          />
          <div className="card-grid three">
            {(featuredMaterials.length ? featuredMaterials : materials.slice(0, 3)).map(item => (
              <MaterialCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Entertainment"
            title="Movie and series updates with cleaner discovery"
            text="Use featured cards, filters, posters, and release tags to turn quick updates into a richer page."
          />
          <div className="card-grid three">
            {(featuredMovies.length ? featuredMovies : movies.slice(0, 3)).map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <SectionTitle
            eyebrow="Blogs"
            title="Editorial publishing for long-form content"
            text="The blog section supports drafts, published articles, and slug-based detail pages."
          />
          <div className="card-grid three">
            {publishedBlogs.map(item => (
              <BlogCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-split">
          <div>
            <SectionTitle
              eyebrow="Contact"
              title="Reach ThrillyVerse from a polished contact flow"
              text="The form saves submissions and can also send them through EmailJS on the free tier."
            />
            <Link to="/contact" className="inline-link">
              Open full contact page <ArrowRight size={16} />
            </Link>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  )
}