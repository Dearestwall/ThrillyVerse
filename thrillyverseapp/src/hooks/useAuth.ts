// src/hooks/useAuth.ts
import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useAuthContext();

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}