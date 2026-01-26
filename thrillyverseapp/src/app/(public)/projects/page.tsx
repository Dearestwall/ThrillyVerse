// src/app/(public)/projects/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Code2, Gamepad2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  status: 'active' | 'coming-soon';
  tags: string[];
}

const projects: Project[] = [
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A simple and elegant calculator with basic arithmetic operations.',
    icon: '🧮',
    link: '/projects/calculator',
    status: 'active',
    tags: ['React', 'Arithmetic', 'Tool'],
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe game with AI opponent. Challenge yourself!',
    icon: '🎮',
    link: '/projects/tic-tac-toe',
    status: 'active',
    tags: ['Game', 'AI', 'Fun'],
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, discounts, and profit/loss easily.',
    icon: '📊',
    link: '/projects/percentage-calculator',
    status: 'active',
    tags: ['Math', 'Utility', 'Education'],
  },
  {
    id: 'quiz-app',
    title: 'Quiz Application',
    description: 'Interactive quiz app for ICSE Class 10 subjects.',
    icon: '❓',
    link: '/projects/quiz-app',
    status: 'coming-soon',
    tags: ['Education', 'Quiz', 'Learning'],
  },
  {
    id: 'notes-app',
    title: 'Notes Application',
    description: 'Create, edit, and manage your study notes online.',
    icon: '📝',
    link: '/projects/notes-app',
    status: 'coming-soon',
    tags: ['Productivity', 'Notes', 'Cloud'],
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Create and study with interactive flashcards for exams.',
    icon: '📚',
    link: '/projects/flashcards',
    status: 'coming-soon',
    tags: ['Learning', 'Study', 'Memory'],
  },
];

export default function ProjectsPage() {
  const activeProjects = projects.filter((p) => p.status === 'active');
  const comingSoonProjects = projects.filter((p) => p.status === 'coming-soon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of educational tools and interactive projects designed to
            enhance your learning experience.
          </p>
        </div>

        {/* Active Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-600" />
            Active Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6 py-8 text-center">
                  <span className="text-5xl">{project.icon}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <Link
                    href={project.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Launch
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden opacity-75"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 px-6 py-8 text-center">
                  <span className="text-5xl">{project.icon}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold cursor-not-allowed">
                    🚀 Coming Soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Have an idea for a project?</h3>
          <p className="text-lg mb-6 opacity-90">
            We&apos;re always looking for new and exciting projects to build. Share your ideas with us!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}