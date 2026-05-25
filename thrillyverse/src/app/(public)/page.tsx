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

export default async function HomePage() {
  const supabase = createClient();

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
  ] = await Promise.all([
    supabase.from('announcements').select('*').eq('active', true).order('priority', { ascending: false }).limit(5),
    supabase.from('projects').select('*').order('sort_order').limit(6),
    supabase.from('movies').select('id,title,slug,poster_url,category,rating,year').eq('featured', true).eq('published', true).limit(8),
    supabase.from('blogs').select('id,title,slug,cover_image,excerpt,category,read_time,published_at').eq('published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('partners').select('*').eq('active', true).order('sort_order'),
    supabase.from('reviews').select('*').eq('published', true).order('sort_order').limit(8),
    supabase.from('certifications').select('*').eq('active', true).order('sort_order'),
    supabase.from('movies').select('id', { count: 'exact', head: true }),
    supabase.from('materials').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }),
    supabase.from('quizzes').select('id', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Movies', value: moviesCount ?? 0, icon: '🎬', suffix: '+' },
    { label: 'Study Resources', value: materialsCount ?? 0, icon: '📚', suffix: '+' },
    { label: 'Blog Articles', value: blogsCount ?? 0, icon: '✍️', suffix: '+' },
    { label: 'Quizzes', value: quizzesCount ?? 0, icon: '🧠', suffix: '+' },
  ];

  return (
    <>
      <AnnouncementsSection announcements={announcements ?? []} />
      <HeroSection />
      <StatsStrip stats={stats} />
      <FeaturedMoviesStrip movies={movies ?? []} />
      <ProjectsSection projects={projects ?? []} />
      <FeaturedBlogsStrip blogs={blogs ?? []} />
      <PartnersSection partners={partners ?? []} />
      <ReviewsSection reviews={reviews ?? []} />
      <CertificationsSection certifications={certifications ?? []} />
      <AboutSection />
      <ContactSection />
    </>
  );
}