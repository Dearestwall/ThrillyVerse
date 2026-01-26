import Link from 'next/link';
import { Sparkles, BookOpen, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">ThrillyVerse</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your one-stop platform for ICSE Class 10 study materials, interactive
            projects, and educational tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/materials"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Materials
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Study Materials</h3>
            <p className="text-gray-600">
              Access comprehensive ICSE Class 10 study materials for all subjects
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Interactive Projects</h3>
            <p className="text-gray-600">
              Explore games, calculators, and educational tools
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Trophy className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Quizzes & Tests</h3>
            <p className="text-gray-600">
              Test your knowledge with interactive quizzes (coming soon)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
