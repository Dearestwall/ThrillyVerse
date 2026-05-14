// src/app/projects/page.tsx - PUBLIC PROJECTS PAGE
'use client';

import Link from 'next/link';
import { ExternalLink, Github, Sparkles } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    {
      title: 'ThrillyVerse',
      description: 'A comprehensive learning platform for ICSE/ISC students with study materials, quizzes, and progress tracking.',
      tech: ['Next.js', 'Firebase', 'Tailwind CSS', 'TypeScript'],
      link: 'https://thrillyverse.com',
      github: 'https://github.com/yourusername/thrillyverse',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Pattibytes',
      description: 'Local news and community platform connecting Patti, Punjab residents.',
      tech: ['Next.js', 'Firebase', 'React'],
      link: 'https://pattibytes.com',
      github: 'https://github.com/yourusername/pattibytes',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Nestsweetbakers',
      description: 'E-commerce platform for cake ordering and delivery.',
      tech: ['Next.js', 'Firebase', 'Razorpay'],
      link: 'https://nestsweetbakers.com',
      github: null,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Buy24hstore',
      description: 'Multi-category retail e-commerce platform.',
      tech: ['Next.js', 'Firestore', 'Payment Gateway'],
      link: 'https://buy24hstore.com',
      github: null,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">ThrillyVerse</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600">
                Contact
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Projects
            </h1>
            <p className="text-xl text-gray-600">
              Building digital solutions for local businesses and communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`h-2 bg-gradient-to-r ${project.color}`} />

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </a>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}