// src/context/AuthContext.tsx - COMPLETE & ERROR-FREE
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getDocument, updateDocument } from '@/lib/firebase/firestore';

// Define User type inline to avoid import errors
interface UserStats {
  materialsDownloaded: number;
  quizzesTaken: number;
  materialsUploaded: number;
  totalPoints: number;
  streak: number;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'moderator' | 'admin' | 'superadmin';
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

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userData = await getDocument<User>('users', uid);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser.uid);
      setUser(userData);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Update last login
        await updateDocument('users', firebaseUser.uid, {
          lastLogin: new Date(),
        });

        // Fetch full user data from Firestore
        const userData = await fetchUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        isSuperAdmin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}