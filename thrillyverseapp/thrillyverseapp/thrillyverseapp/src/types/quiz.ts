// src/types/quiz.ts
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';
export type QuizStatus = 'draft' | 'published' | 'archived';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  explanation?: string;
  marks: number;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  questions: QuizQuestion[];
  createdBy: string;
  createdByName: string;
  status: QuizStatus;
  attempts: number;
  averageScore?: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface QuizResult {
  id: string;
  userId: string;
  userName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  answers: QuizAnswer[];
  completedAt: Date;
  timeTaken: number; // in seconds
  percentage: number;
  passed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  marksAwarded: number;
}

export interface CreateQuizData {
  title: string;
  description: string;
  subject: string;
  class: string;
  duration: number;
  passingMarks: number;
  questions: Omit<QuizQuestion, 'id'>[];
  tags?: string[];
}