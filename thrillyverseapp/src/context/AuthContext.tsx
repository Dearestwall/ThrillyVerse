// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserData, isAdmin } from '@/lib/firebase/auth';
import { User } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user data
        const data = await getUserData(firebaseUser.uid);
        setUserData(data);

        // Check admin status
        const adminStatus = await isAdmin(firebaseUser);
        setIsAdminUser(adminStatus);
      } else {
        setUserData(null);
        setIsAdminUser(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userData, isAdmin: isAdminUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);