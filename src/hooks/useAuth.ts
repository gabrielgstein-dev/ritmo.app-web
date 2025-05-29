'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout, 
    initialize 
  } = useAuthStore();
  

  useEffect(() => {
    initialize();
  }, []);
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: async (email: string, password: string) => {
      await login(email, password);
      router.push('/dashboard');
    },
    register,
    logout: () => {
      logout();
      router.push('/login');
    }
  };
}
