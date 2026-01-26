// src/app/(public)/quizzes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Star, Play } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  duration: number;
  attempts: number;
  rating: number;
  description: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    // Fetch quizzes from Firestore
    const mockQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'Biology Chapter 1 - Cell Structure',
        subject: 'Biology',
        difficulty: 'Easy',
        questions: 20,
        duration: 30,
        attempts: 450,
        rating: 4.5,
        description: 'Test your knowledge of cell structure and functions',
      },
      {
        id: '2',
        title: 'Chemistry Periodic Table',
        subject: 'Chemistry',
        difficulty: 'Medium',
        questions: 25,
        duration: 40,
        attempts: 380,
        rating: 4.7,
        description: 'Master the periodic table and element properties',
      },
      {
        id: '3',
        title: 'Physics Motion & Force',
        subject: 'Physics',
        difficulty: 'Hard',
        questions: 30,
        duration: 50,
        attempts: 290,
        rating: 4.3,
        description: 'Advanced questions on motion, force, and energy',
      },
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuizzes(mockQuizzes);
  }, []);

  const subjects = ['All', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSubject = selectedSubject === 'All' || quiz.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || quiz.difficulty === selectedDifficulty;
    return matchesSubject && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quiz Zone
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with interactive quizzes designed for ICSE Class 10
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSubject === subject
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Header */}
              <div className={`p-6 ${
                quiz.difficulty === 'Easy' 
                  ? 'bg-green-500' 
                  : quiz.difficulty === 'Medium' 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{quiz.subject}</span>
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">{quiz.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{quiz.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{quiz.questions} questions</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= quiz.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {quiz.rating} ({quiz.attempts} attempts)
                  </span>
                </div>

                {/* Difficulty Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    quiz.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : quiz.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {quiz.difficulty}
                </span>

                {/* Start Button */}
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}