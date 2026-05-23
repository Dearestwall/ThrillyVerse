// src/hooks/useQuizzes.ts
import { useState, useEffect } from 'react';

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  questions: QuizQuestion[];
  duration: number;
  totalPoints: number;
  passingScore: number;
  attempts: number;
  rating: number;
  createdAt: string;
  createdBy: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

interface UseQuizzesOptions {
  subject?: string;
  difficulty?: string;
}

export function useQuizzes(options: UseQuizzesOptions = {}) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.subject) params.append('subject', options.subject);
        if (options.difficulty) params.append('difficulty', options.difficulty);

        const response = await fetch(`/api/quizzes?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setQuizzes(data.data);
        } else {
          setError(data.error || 'Failed to fetch quizzes');
        }
      } catch (err) {
        setError('An error occurred while fetching quizzes');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [options.subject, options.difficulty]);

  return { quizzes, loading, error };
}