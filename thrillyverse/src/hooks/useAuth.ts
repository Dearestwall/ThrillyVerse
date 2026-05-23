'use client';

export function useAuth() {
  return {
    user: null,
    profile: null,
    loading: false,
    isAdmin: false
  };
}