// src/app/page.tsx - ENHANCED VERSION
'use client';

import Link from 'next/link';
import { 
  Sparkles, BookOpen, Trophy, Users, ArrowRight, 
  Star, Target, Zap, Award, CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Access comprehensive ICSE Class 10 study materials for all subjects',
      color: 'bg-blue-500',
    },
    {
      icon: Trophy,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with engaging quizzes and track your progress',
      color: 'bg-yellow-500',
    },
    {
      icon: Sparkles,
      title: 'Projects & Tools',
      description: 'Explore educational tools, calculators, and interactive projects',
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of students learning together',
      color: 'bg-green-500',
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Students' },
    { icon: BookOpen, value: '500+', label: 'Materials' },
    { icon: Trophy, value: '100+', label: 'Quizzes' },
    { icon: Star, value: '4.8/5', label: 'Rating' },
  ];

  const subjects = [
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 
    'English', 'History', 'Geography', 'Computer Science'
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-8">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                India&apos;s #1 ICSE Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ThrillyVerse
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your complete platform for ICSE Class 10 preparation with study materials, 
              interactive quizzes, and engaging projects.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                href="/materials"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Browse Materials
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quizzes"
                className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
              >
                Take a Quiz
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center">
                    <Icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A complete learning ecosystem designed specifically for ICSE students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All ICSE Subjects Covered
            </h2>
            <p className="text-gray-600">
              Comprehensive study materials and quizzes for every subject
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((subject, idx) => (
              <Link
                key={idx}
                href={`/materials?subject=${subject}`}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all text-center"
              >
                <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900">{subject}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students Love ThrillyVerse
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Free access to all materials',
              'Regular quiz updates',
              'Expert-curated content',
              'Interactive learning tools',
              'Community support',
              'Progress tracking',
              'Mobile-friendly platform',
              'Instant results & feedback',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Target className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are achieving their academic goals with ThrillyVerse
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}