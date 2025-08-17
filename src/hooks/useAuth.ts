// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { User, Company, LoginCredentials, RegisterData } from '@/types';

interface UseAuthReturn {
  user: User | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const {
    user,
    company,
    token,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout,
    clearError,
    initialize
  } = useAuthStore();

  // Debug pour Pierre
  useEffect(() => {
    console.log('👤 useAuth state change:', {
      isAuthenticated,
      isInitialized,
      isLoading,
      userRole: user?.role,
      userEmail: user?.email
    });
  }, [isAuthenticated, isInitialized, isLoading, user]);

  // Initialize auth store on first use
  useEffect(() => {
    console.log('🚀 useAuth hook mounted - isInitialized:', isInitialized);
    if (!isInitialized) {
      console.log('🔧 Calling initialize...');
      initialize();
    }
  }, [isInitialized, initialize]);

  return {
    user,
    company,
    token,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout,
    clearError
  };
};