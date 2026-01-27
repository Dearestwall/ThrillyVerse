// src/types/user.ts
export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';

export interface UserStats {
  materialsDownloaded: number;
  quizzesTaken: number;
  materialsUploaded: number;
  totalPoints: number;
  streak: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  class?: string;
  subjects?: string[];
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  isBanned: boolean;
  stats: UserStats;
  phoneNumber?: string;
  school?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  class?: string;
}

export interface UpdateUserData {
  displayName?: string;
  bio?: string;
  class?: string;
  subjects?: string[];
  avatar?: string;
  phoneNumber?: string;
  school?: string;
}