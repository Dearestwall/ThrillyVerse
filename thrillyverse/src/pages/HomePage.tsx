// src/pages/HomePage.tsx
import {
  ArrowRight,
  Film,
  FolderKanban,
  LibraryBig,
  Newspaper,
  Sparkles,
  TableProperties,
  MessageSquareText
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import './HomePage.css'

import { ProjectCard } from '../components/cards/ProjectCard'
import { MaterialCard } from '../components/cards/MaterialCard'
import { MovieCard } from '../components/cards/MovieCard'
import { BlogCard } from '../components/cards/BlogCard'
import { SectionTitle } from '../components/ui/SectionTitle'
import { StatCard } from '../components/ui/StatCard'
import { ContactForm } from '../components/ContactForm'

import { useHomepageSettings } from '../hooks/useHomepageSettings'
import { useBlogs, useMaterials, useMovies, useProjects } from '../hooks/resources'

export function HomePage() {
  const { settings } = useHomepageSettings()
  const { items: projects } = useProjects()
  const { items: materials } = useMaterials()
  const { items: movies } = useMovies()
  const { items: blogs } = useBlogs()

  const featuredProjects = projects.filter((item) => item.featured).slice(0, 3)
  const featuredMaterials = materials.filter((item) => item.featured).slice(0, 3)
  const featuredMovies = movies.filter((item) => item.featured).slice(0, 3)
  const publishedBlogs = blogs.filter((item) => item.published)
  const latestBlogs = publishedBlogs.slice(0, 3)

  const heroTitle = settings?.hero_title || 'Think Beyond The Verse'
  const heroSubtitle =
    settings?.hero_subtitle ||
    'Explore projects, study materials, entertainment updates, and editorial content inside a smarter ThrillyVerse experience.'
  const primaryCtaText = settings?.hero_cta_text || 'Explore materials'
  const primaryCtaUrl = settings?.hero_cta_url || '/materials'
  const secondaryCtaText = settings?.secondary_cta_text || 'Browse projects'
  const secondaryCtaUrl = settings?.secondary_cta_url || '/projects'
  const announcementEnabled =
    settings?.announcement_enabled === undefined ? true : settings.announcement_enabled

  const projectItems = featuredProjects.length ? featuredProjects : projects.slice(0, 3)
  const materialItems = featuredMaterials.length ? featuredMaterials : materials.slice(0, 3)
  const movieItems = featuredMovies.length ? featuredMovies : movies.slice(0, 3)

  const latestProjectRows = projects.slice(0, 4)
  const latestMaterialRows = materials.slice(0, 4)
  const latestMovieRows = movies.slice(0, 4)
  const latestBlogRows = publishedBlogs.slice(0, 4)

  return (
    <>
      <Helmet>
        <title>{settings?.seo_title || 'ThrillyVerse | Think Beyond The Verse'}</title>
        <meta
          name="description"
          content={
            settings?.seo_description ||
            'Explore ThrillyVerse materials, projects, movies, blogs, and contact tools through a polished dynamic homepage.'
          }
        />
        {settings?.seo_keywords && <meta name="keywords" content={settings.seo_keywords} />}
      </Helmet>

      <section className="homepage-hero hero-section">
        <div className="container homepage-hero-grid">
          <motion.div
            className="homepage-hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="eyebrow">{settings?.hero_badge || 'ThrillyVerse digital ecosystem'}</p>
            <h1>{heroTitle}</h1>
            <p className="homepage-hero-text">{heroSubtitle}</p>

            <div className="homepage-hero-actions">
              <Link to={primaryCtaUrl} className="button button-primary">
                {primaryCtaText} <ArrowRight size={18} />
              </Link>

              <Link to={secondaryCtaUrl} className="button button-ghost">
                {secondaryCtaText}
              </Link>
            </div>

            {announcementEnabled && settings?.announcement && (
              <div className="homepage-announcement">
                <Sparkles size={16} />
                <span>{settings.announcement}</span>
              </div>
            )}

            <div className="homepage-hero-mini-stats">
              <div>
                <strong>{projects.length}</strong>
                <span>Projects live</span>
              </div>
              <div>
                <strong>{materials.length}</strong>
                <span>Study folders</span>
              </div>
              <div>
                <strong>{publishedBlogs.length}</strong>
                <span>Published blogs</span>
              </div>
            </div>
          </motion.div>

          <motion.aside
            className="homepage-hero-panel card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <div className="homepage-hero-panel-top">
              <div className="signal">
                <span />
                <span />
                <span />
              </div>
              <strong>Live-ready content system</strong>
            </div>

            <div className="homepage-hero-mosaic">
              <article className="homepage-mini-showcase accent-a">
                <LibraryBig size={22} />
                <div>
                  <strong>Materials</strong>
                  <span>Student-first folders</span>
                </div>
              </article>

              <article className="homepage-mini-showcase accent-b">
                <Film size={22} />
                <div>
                  <strong>Movies</strong>
                  <span>Clean discovery blocks</span>
                </div>
              </article>

              <article className="homepage-mini-showcase accent-c">
                <Newspaper size={22} />
                <div>
                  <strong>Blogs</strong>
                  <span>Editorial publishing</span>
                </div>
              </article>

              <article className="homepage-mini-showcase accent-d">
                <FolderKanban size={22} />
                <div>
                  <strong>Projects</strong>
                  <span>Interactive tools & apps</span>
                </div>
              </article>
            </div>

            <div className="homepage-hero-note">
              Admin-managed sections, scalable page blocks, and future-ready Supabase content
              architecture.
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="section homepage-stats-section">
        <div className="container homepage-stat-grid">
          <StatCard label="Projects" value={String(projects.length)} icon={<FolderKanban size={22} />} />
          <StatCard label="Materials" value={String(materials.length)} icon={<LibraryBig size={22} />} />
          <StatCard label="Movies & series" value={String(movies.length)} icon={<Film size={22} />} />
          <StatCard label="Published blogs" value={String(publishedBlogs.length)} icon={<Newspaper size={22} />} />
        </div>
      </section>

      <section className="section homepage-feature-section">
        <div className="container homepage-feature-grid">
          <article className="card homepage-feature-card">
            <strong>Professional homepage flow</strong>
            <p>Balanced hero, showcase sections, summary tables, and a stronger CTA journey.</p>
          </article>

          <article className="card homepage-feature-card">
            <strong>Scalable component styling</strong>
            <p>Each component gets its own CSS file for easier edits, extension, and debugging.</p>
          </article>

          <article className="card homepage-feature-card">
            <strong>Dynamic content ready</strong>
            <p>Homepage blocks stay connected to admin-controlled resources and featured states.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Featured projects"
            title={settings?.featured_projects_title || 'Interactive tools and utilities'}
            text="Featured project cards help ThrillyVerse highlight calculators, games, and utilities in a cleaner product-style layout."
          />

          <div className="card-grid three">
            {projectItems.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <SectionTitle
            eyebrow="Materials"
            title={settings?.featured_materials_title || 'Study content that stays easy to browse'}
            text="Subject folders, board resources, and organized material categories can stay simple for students while remaining scalable behind the scenes."
          />

          <div className="card-grid three">
            {materialItems.map((item) => (
              <MaterialCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Entertainment"
            title={settings?.featured_movies_title || 'Movie and series updates with better discovery'}
            text="Use language tags, posters, release details, and featured status to make quick updates feel like a proper content hub."
          />

          <div className="card-grid three">
            {movieItems.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <SectionTitle
            eyebrow="Blogs"
            title={settings?.featured_blogs_title || 'Editorial publishing for long-form content'}
            text="Blog cards support categories, cover images, excerpts, slugs, and published states for a polished editorial surface."
          />

          <div className="card-grid three">
            {latestBlogs.map((item) => (
              <BlogCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section homepage-tables-section">
        <div className="container">
          <SectionTitle
            eyebrow="Overview tables"
            title="Quick content status across ThrillyVerse"
            text="These tables make the homepage more informative and help visitors understand the breadth of projects, materials, movies, and blog publishing."
          />

          <div className="homepage-table-grid">
            <div className="card homepage-table-card">
              <div className="homepage-table-head">
                <div className="homepage-table-title">
                  <TableProperties size={18} />
                  <strong>Projects</strong>
                </div>
                <Link to="/projects" className="inline-link">
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="homepage-table-wrap">
                <table className="homepage-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestProjectRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.category || 'General'}</td>
                        <td>{item.featured ? 'Featured' : 'Live'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card homepage-table-card">
              <div className="homepage-table-head">
                <div className="homepage-table-title">
                  <LibraryBig size={18} />
                  <strong>Materials</strong>
                </div>
                <Link to="/materials" className="inline-link">
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="homepage-table-wrap">
                <table className="homepage-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestMaterialRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.subject}</td>
                        <td>{item.category || 'Study'}</td>
                        <td>{item.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card homepage-table-card">
              <div className="homepage-table-head">
                <div className="homepage-table-title">
                  <Film size={18} />
                  <strong>Movies</strong>
                </div>
                <Link to="/movies" className="inline-link">
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="homepage-table-wrap">
                <table className="homepage-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Language</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestMovieRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.language}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card homepage-table-card">
              <div className="homepage-table-head">
                <div className="homepage-table-title">
                  <Newspaper size={18} />
                  <strong>Blogs</strong>
                </div>
                <Link to="/blogs" className="inline-link">
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="homepage-table-wrap">
                <table className="homepage-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Slug</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestBlogRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>/{item.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section homepage-contact-section">
        <div className="container homepage-contact-grid">
          <div className="homepage-contact-copy">
            <SectionTitle
              eyebrow="Contact"
              title="Reach ThrillyVerse through a cleaner public contact flow"
              text="The contact form can save submissions to Supabase and optionally send email notifications through EmailJS while keeping the UI simple for visitors."
            />

            <div className="homepage-contact-points">
              <article className="card homepage-contact-point">
                <MessageSquareText size={18} />
                <div>
                  <strong>Public-friendly messaging</strong>
                  <p>Clear fields, strong feedback states, and simple submission flow.</p>
                </div>
              </article>

              <article className="card homepage-contact-point">
                <Sparkles size={18} />
                <div>
                  <strong>Admin-ready pipeline</strong>
                  <p>Messages can be stored, reviewed, and expanded into future workflows.</p>
                </div>
              </article>
            </div>

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