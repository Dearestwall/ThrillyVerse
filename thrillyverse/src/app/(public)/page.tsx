import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/sections/home/HeroSection';
import { AnnouncementsSection } from '@/components/sections/home/AnnouncementsSection';
import { StatsStrip } from '@/components/sections/home/StatsStrip';
import { ProjectsSection } from '@/components/sections/home/ProjectsSection';
import { FeaturedMoviesStrip } from '@/components/sections/home/FeaturedMoviesStrip';
import { FeaturedBlogsStrip } from '@/components/sections/home/FeaturedBlogsStrip';
import { PartnersSection } from '@/components/sections/home/PartnersSection';
import { ReviewsSection } from '@/components/sections/home/ReviewsSection';
import { CertificationsSection } from '@/components/sections/home/CertificationsSection';
import { AboutSection } from '@/components/sections/home/AboutSection';
import { ContactSection } from '@/components/sections/home/ContactSection';
import type {
  Announcement,
  Blog,
  Certification,
  Movie,
  Partner,
  Project,
  Review,
} from '@/types';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'ThrillyVerse brings together movies, study materials, blogs, projects, quizzes, and announcements in one platform.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Movies, study materials, blogs, projects, quizzes, and announcements in one platform.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Movies, study materials, blogs, projects, quizzes, and announcements in one platform.',
  },
};

type AboutHighlight = {
  value: string;
  label: string;
  icon?: 'layers' | 'shield' | 'sparkles' | 'rocket';
};

type ContactItem = {
  icon: 'mail' | 'telegram' | 'map' | 'clock';
  label: string;
  value: string;
  href: string;
};

type SocialItem = {
  label: string;
  sub: string;
  href: string;
  icon: 'youtube' | 'instagram' | 'telegram';
};

type SiteSettings = {
  id: number;
  site_name?: string | null;
  site_tagline?: string | null;
  site_logo_url?: string | null;

  about_eyebrow?: string | null;
  about_title?: string | null;
  about_text_primary?: string | null;
  about_text_secondary?: string | null;
  about_primary_cta_label?: string | null;
  about_primary_cta_href?: string | null;
  about_secondary_cta_label?: string | null;
  about_secondary_cta_href?: string | null;
  about_highlights?: AboutHighlight[] | null;

  contact_eyebrow?: string | null;
  contact_title?: string | null;
  contact_description?: string | null;
  contact_panel_kicker?: string | null;
  contact_panel_title?: string | null;
  contact_panel_text?: string | null;
  contact_email?: string | null;
  contact_telegram?: string | null;
  contact_location?: string | null;
  contact_availability?: string | null;
  contact_info_items?: ContactItem[] | null;

  social_youtube?: string | null;
  social_instagram?: string | null;
  social_telegram?: string | null;
  social_items?: SocialItem[] | null;
};

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: announcements },
    { data: projects },
    { data: movies },
    { data: blogs },
    { data: partners },
    { data: reviews },
    { data: certifications },
    { count: moviesCount },
    { count: materialsCount },
    { count: blogsCount },
    { count: quizzesCount },
    { data: siteSettings },
  ] = await Promise.all([
    supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .limit(5),

    supabase
      .from('projects')
      .select(
        'id,title,slug,summary,description,image_url,link,github_url,tech_stack,status,sort_order,featured'
      )
      .order('sort_order', { ascending: true })
      .limit(6),

    supabase
      .from('movies')
      .select('id,title,slug,poster_url,category,rating,year')
      .eq('featured', true)
      .eq('published', true)
      .limit(8),

    supabase
      .from('blogs')
      .select('id,title,slug,cover_image,excerpt,category,read_time,published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3),

    supabase
      .from('partners')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),

    supabase
      .from('reviews')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(8),

    supabase
      .from('certifications')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),

    supabase.from('movies').select('id', { count: 'exact', head: true }),
    supabase.from('materials').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }),
    supabase.from('quizzes').select('id', { count: 'exact', head: true }),

    supabase
      .from('site_settings')
      .select(`
        id,
        site_name,
        site_tagline,
        site_logo_url,
        about_eyebrow,
        about_title,
        about_text_primary,
        about_text_secondary,
        about_primary_cta_label,
        about_primary_cta_href,
        about_secondary_cta_label,
        about_secondary_cta_href,
        about_highlights,
        contact_eyebrow,
        contact_title,
        contact_description,
        contact_panel_kicker,
        contact_panel_title,
        contact_panel_text,
        contact_email,
        contact_telegram,
        contact_location,
        contact_availability,
        contact_info_items,
        social_youtube,
        social_instagram,
        social_telegram,
        social_items
      `)
      .eq('singleton', true)
      .single(),
  ]);

  const settings = (siteSettings ?? null) as SiteSettings | null;

  const stats = [
    { label: 'Movies', value: moviesCount ?? 0, icon: '🎬', suffix: '+' },
    { label: 'Study Resources', value: materialsCount ?? 0, icon: '📚', suffix: '+' },
    { label: 'Blog Articles', value: blogsCount ?? 0, icon: '✍️', suffix: '+' },
    { label: 'Quizzes', value: quizzesCount ?? 0, icon: '🧠', suffix: '+' },
  ];

  return (
    <>
      <AnnouncementsSection announcements={(announcements ?? []) as Announcement[]} />
      <HeroSection />
      <PartnersSection partners={(partners ?? []) as Partner[]} />
      <ProjectsSection projects={(projects ?? []) as Project[]} />
      <FeaturedBlogsStrip blogs={(blogs ?? []) as Blog[]} />
      <ReviewsSection reviews={(reviews ?? []) as Review[]} />
      <CertificationsSection certifications={(certifications ?? []) as Certification[]} />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
      <FeaturedMoviesStrip movies={(movies ?? []) as Movie[]} />
    </>
  );
}