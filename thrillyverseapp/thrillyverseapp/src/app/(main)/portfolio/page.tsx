// src/app/(main)/portfolio/page.tsx - PORTFOLIO PAGE
'use client';

import { useState } from 'react';
import { 
  Code, 
  Palette, 
  Video, 
  Globe,
  ExternalLink,
  Github,
  Filter,
  Star,
  Calendar,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web Development' | 'UI/UX Design' | 'Content Creation' | 'All';
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  client?: string;
  date: string;
  featured: boolean;
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { name: 'All', icon: Sparkles, count: 12 },
    { name: 'Web Development', icon: Code, count: 6 },
    { name: 'UI/UX Design', icon: Palette, count: 4 },
    { name: 'Content Creation', icon: Video, count: 2 },
  ];

  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack online shopping platform with admin panel, payment integration, and inventory management',
      category: 'Web Development',
      image: '🛍️',
      tags: ['Next.js', 'Firebase', 'Stripe', 'Tailwind'],
      link: 'https://example.com',
      github: 'https://github.com',
      client: 'Retail Store',
      date: 'Dec 2025',
      featured: true,
    },
    {
      id: '2',
      title: 'Brand Identity Design',
      description: 'Complete brand identity package including logo, color scheme, typography, and brand guidelines',
      category: 'UI/UX Design',
      image: '🎨',
      tags: ['Branding', 'Logo Design', 'UI Kit'],
      client: 'Tech Startup',
      date: 'Nov 2025',
      featured: true,
    },
    {
      id: '3',
      title: 'Marketing Campaign Video',
      description: 'Professional video editing and motion graphics for social media marketing campaign',
      category: 'Content Creation',
      image: '🎬',
      tags: ['Video Editing', 'Motion Graphics', 'After Effects'],
      link: 'https://youtube.com',
      client: 'Digital Agency',
      date: 'Oct 2025',
      featured: false,
    },
    {
      id: '4',
      title: 'SaaS Dashboard',
      description: 'Modern analytics dashboard with real-time data visualization and reporting features',
      category: 'Web Development',
      image: '📊',
      tags: ['React', 'TypeScript', 'Chart.js', 'API'],
      link: 'https://example.com',
      github: 'https://github.com',
      client: 'SaaS Company',
      date: 'Sep 2025',
      featured: true,
    },
    {
      id: '5',
      title: 'Mobile App UI',
      description: 'Clean and intuitive mobile app interface design with interactive prototypes',
      category: 'UI/UX Design',
      image: '📱',
      tags: ['Figma', 'Prototyping', 'Mobile Design'],
      client: 'FinTech Startup',
      date: 'Aug 2025',
      featured: false,
    },
    {
      id: '6',
      title: 'Corporate Website',
      description: 'Professional corporate website with CMS integration and SEO optimization',
      category: 'Web Development',
      image: '🏢',
      tags: ['Next.js', 'CMS', 'SEO', 'Responsive'],
      link: 'https://example.com',
      client: 'Corporate Client',
      date: 'Jul 2025',
      featured: false,
    },
    {
      id: '7',
      title: 'Product Demo Video',
      description: 'Engaging product demonstration video with voiceover and animations',
      category: 'Content Creation',
      image: '🎥',
      tags: ['Video Production', 'Animation', 'Voiceover'],
      link: 'https://youtube.com',
      client: 'Product Launch',
      date: 'Jun 2025',
      featured: false,
    },
    {
      id: '8',
      title: 'Landing Page Design',
      description: 'High-converting landing page design with A/B testing and analytics',
      category: 'UI/UX Design',
      image: '🚀',
      tags: ['Landing Page', 'Conversion', 'A/B Testing'],
      link: 'https://example.com',
      client: 'Marketing Agency',
      date: 'May 2025',
      featured: false,
    },
  ];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const stats = [
    { label: 'Projects Completed', value: '150+', icon: Award },
    { label: 'Happy Clients', value: '100+', icon: Users },
    { label: 'Years Experience', value: '5+', icon: Calendar },
    { label: 'Client Satisfaction', value: '98%', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">My Work</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 mt-2">
            Project <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of my recent projects showcasing web development, design, and content creation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`card-interactive p-6 text-center animate-scale-in animate-delay-${(index + 1) * 100}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filter by Category</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all animate-scale-in animate-delay-${(index + 1) * 50} ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === category.name
                    ? 'bg-white bg-opacity-20'
                    : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`card-interactive group relative overflow-hidden animate-scale-in animate-delay-${(index + 1) * 100}`}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="badge bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                </div>
              )}

              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-t-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {project.image}
              </div>

              <div className="p-6">
                {/* Category */}
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  {project.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-gradient-static transition-all">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.date}
                  </div>
                  {project.client && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.client}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge badge-secondary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex-1 text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      View Live
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary text-sm"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Like What You See?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Let&apos;s collaborate on your next project and create something amazing together
            </p>
            <a href="/contact" className="btn bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-4 shadow-2xl">
              Start a Project
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}