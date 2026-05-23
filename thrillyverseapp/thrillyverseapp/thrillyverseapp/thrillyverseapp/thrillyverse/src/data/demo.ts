import type { Blog, ContactSubmission, HomepageSettings, Material, Movie, Project } from '../types'

export const demoProjects: Project[] = [
  {
    id: 'p1',
    title: 'Percentage Calculator',
    description: 'Fast percentage calculations with a clean interface.',
    url: 'https://dearestwall.github.io/Percentage-Calculator/',
    logo_url: 'https://i.ibb.co/933MqfVN/image.png',
    category: 'Tools',
    featured: true
  },
  {
    id: 'p2',
    title: 'Tic Tac Toe',
    description: 'A polished browser game for casual play.',
    url: 'https://dearestwall.github.io/tictactoe/',
    logo_url: 'https://i.ibb.co/nsFHZWWr/image.png',
    category: 'Games',
    featured: true
  },
  {
    id: 'p3',
    title: 'Chess',
    description: 'Strategy-led web chess built for quick sessions.',
    url: 'https://dearestwall.github.io/CHESS/',
    logo_url: 'https://urls.thrillyverse.workers.dev/uHXdIdF',
    category: 'Games',
    featured: true
  },
  {
    id: 'p4',
    title: 'URL Shortener',
    description: 'Shorten and share links from a branded utility.',
    url: 'https://urls.thrillyverse.workers.dev/',
    logo_url: 'https://i.ibb.co/5X5tjwjv/image.png',
    category: 'Utilities',
    featured: false
  }
]

export const demoMaterials: Material[] = [
  {
    id: 'm1',
    subject: 'Literature',
    title: 'ICSE Literature Folder',
    description: 'Poetry, prose, and revision resources in one folder.',
    drive_url: 'https://drive.google.com/drive/folders/1yjrJs_qPHIVOkP7My2VdU53b-aUVkffO',
    category: 'ICSE 10',
    featured: true
  },
  {
    id: 'm2',
    subject: 'Maths',
    title: 'ICSE Maths Folder',
    description: 'Practice material, formulas, and exam support.',
    drive_url: 'https://drive.google.com/drive/folders/14HGjT1rLKQCvZMNgJVBDFR2BmtrRJnl2',
    category: 'ICSE 10',
    featured: true
  },
  {
    id: 'm3',
    subject: 'Biology',
    title: 'ICSE Biology Folder',
    description: 'Chapter-wise notes and quick revision sheets.',
    drive_url: 'https://drive.google.com/drive/folders/1xy3Hv0CZj_XtYAVS_q_pBG24LvqUwfVy',
    category: 'ICSE 10',
    featured: false
  },
  {
    id: 'm4',
    subject: 'Class 11 NCERT',
    title: 'NCERT Collection',
    description: 'Starter library for Class 11 students.',
    drive_url: 'https://drive.google.com/drive/folders/12oWWwVO8fKvVleFTuhAlP4Ni1GnmFbcZ',
    category: 'Class 11',
    featured: true
  }
]

export const demoMovies: Movie[] = [
  {
    id: 'mv1',
    title: 'Sitaare Zameen Par',
    language: 'Hindi',
    type: 'Movie',
    poster_url: 'https://picsum.photos/seed/sitaare/800/600',
    status: 'Featured',
    description: 'A highlight card for the Hindi movies section.',
    release_year: 2025,
    featured: true
  },
  {
    id: 'mv2',
    title: 'Panchayat S04',
    language: 'Hindi',
    type: 'Web Series',
    poster_url: 'https://picsum.photos/seed/panchayat/800/600',
    status: 'Trending',
    description: 'Series coverage in the streaming category.',
    release_year: 2025,
    featured: true
  },
  {
    id: 'mv3',
    title: 'Captain America Brave New World',
    language: 'Hollywood',
    type: 'Movie',
    poster_url: 'https://picsum.photos/seed/captain/800/600',
    status: 'Featured',
    description: 'Hollywood highlight with room for posters and details.',
    release_year: 2025,
    featured: true
  },
  {
    id: 'mv4',
    title: 'Pind Peya Saara Jombieland Bniya',
    language: 'Punjabi',
    type: 'Movie',
    poster_url: 'https://picsum.photos/seed/punjabi/800/600',
    status: 'New',
    description: 'Punjabi section spotlight entry.',
    release_year: 2025,
    featured: false
  }
]

export const demoBlogs: Blog[] = [
  {
    id: 'b1',
    title: 'How ThrillyVerse Can Blend Materials and Entertainment',
    slug: 'blend-materials-and-entertainment',
    excerpt: 'A sharper content model for study, movies, and projects.',
    content: 'This starter shows how one admin panel can power multiple public sections without changing code for every update.',
    cover_url: 'https://picsum.photos/seed/blogone/1200/800',
    category: 'Platform',
    published: true
  },
  {
    id: 'b2',
    title: 'A Better Structure for ICSE Resource Publishing',
    slug: 'better-icse-resource-publishing',
    excerpt: 'Folders, featured resources, and category-led discovery.',
    content: 'Organized filters and featured blocks make large subject libraries easier to scan on both mobile and desktop.',
    cover_url: 'https://picsum.photos/seed/blogtwo/1200/800',
    category: 'Education',
    published: true
  },
  {
    id: 'b3',
    title: 'Why an Admin-first Layout Saves Time',
    slug: 'why-admin-first-layout-saves-time',
    excerpt: 'Use one dashboard for banners, blogs, movies, and projects.',
    content: 'A strong admin layer helps ThrillyVerse stay current without manual code edits.',
    cover_url: 'https://picsum.photos/seed/blogthree/1200/800',
    category: 'Product',
    published: false
  }
]

export const demoContacts: ContactSubmission[] = []

export const demoHomepageSettings: HomepageSettings = {
  id: 'hs1',
  hero_title: 'Think beyond the verse with a smarter ThrillyVerse platform.',
  hero_subtitle: 'A polished digital home for materials, movie updates, blogs, projects, and admin-managed publishing.',
  hero_cta_text: 'Explore the platform',
  hero_cta_url: '/materials',
  announcement: 'Now building a Supabase-powered all-in-one ThrillyVerse web app.'
}