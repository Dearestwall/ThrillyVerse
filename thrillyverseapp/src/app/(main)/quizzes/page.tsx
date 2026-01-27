// src/app/(main)/quizzes/page.tsx - QUIZZES
'use client';

import { useAuth } from '@/context/AuthContext';
import { Award, BookOpen, Clock, TrendingUp, Play } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  const { user } = useAuth();

  // Sample quizzes data
  const quizzes = [
    {
      id: 1,
      title: 'Mathematics - Polynomials',
      subject: 'Mathematics',
      class: '10',
      questions: 20,
      duration: 30,
      difficulty: 'Medium',
      totalAttempts: 1250,
    },
    {
      id: 2,
      title: 'Physics - Motion and Force',
      subject: 'Physics',
      class: '11',
      questions: 15,
      duration: 25,
      difficulty: 'Hard',
      totalAttempts: 890,
    },
    {
      id: 3,
      title: 'Chemistry - Periodic Table',
      subject: 'Chemistry',
      class: '10',
      questions: 25,
      duration: 35,
      difficulty: 'Easy',
      totalAttempts: 1560,
    },
    {
      id: 4,
      title: 'English - Grammar Basics',
      subject: 'English',
      class: '9',
      questions: 30,
      duration: 40,
      difficulty: 'Easy',
      totalAttempts: 2100,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Hard': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Quizzes</h1>
          </div>
          <p className="text-indigo-100">
            Test your knowledge and track your progress
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Quizzes Taken</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3h 45m</p>
            <p className="text-sm text-gray-600">Time Spent</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            <p className="text-sm text-gray-600">Available Quizzes</p>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">Class {quiz.class}</span>
                    <span className="badge badge-info">{quiz.subject}</span>
                    <span className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{quiz.totalAttempts} attempts</span>
                </div>
              </div>

              {user ? (
                <button className="btn btn-primary w-full">
                  <Play className="w-4 h-4" />
                  Start Quiz
                </button>
              ) : (
                <Link href="/login" className="btn btn-primary w-full">
                  Login to Start
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 text-center">
          <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            More Quizzes Coming Soon!
          </h3>
          <p className="text-gray-600">
            We&apos;re working on adding more quizzes for all subjects and classes.
          </p>
        </div>
      </div>
    </div>
  );
}