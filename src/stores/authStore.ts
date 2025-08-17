// src/stores/authStore.ts
import { create } from 'zustand';
import { User, Company } from '@/types';
import { authService } from '@/services/authService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'company' | 'candidate';
  companyName?: string;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // État initial sécurisé
  user: null,
  company: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,

  // Initialisation simplifiée
  initialize: async () => {
    const state = get();
    if (state.isInitialized) return;

    console.log('🔧 AuthStore.initialize called');
    
    try {
      const token = localStorage.getItem('auth-token');
      
      if (token) {
        set({ token, isLoading: true });
        await get().checkAuth();
      } else {
        set({ isAuthenticated: false, isInitialized: true, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      localStorage.removeItem('auth-token');
      set({ 
        token: null,
        isAuthenticated: false, 
        isInitialized: true, 
        isLoading: false 
      });
    }
  },

  // Actions
  login: async (credentials) => {
    console.log('🔐 AuthStore.login called');
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      
      console.log('✅ AuthService returned:', response.user.role, response.user.email);
      
      localStorage.setItem('auth-token', response.token);
      
      set({
        user: response.user,
        company: response.company,
        token: response.token,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
        error: null
      });
      
      console.log('✅ AuthStore updated - user authenticated as:', response.user.role);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      console.error('❌ Login failed:', errorMessage);
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      
      localStorage.setItem('auth-token', response.token);
      
      set({
        user: response.user,
        company: response.company,
        token: response.token,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      set({
        user: null,
        company: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
        // Keep isInitialized: true
      });
    }
  },

  checkAuth: async () => {
    const token = get().token || localStorage.getItem('auth-token');
    
    console.log('🔍 AuthStore.checkAuth - token exists:', !!token);
    
    if (!token) {
      console.log('⭕ No token - setting unauthenticated');
      set({ 
        isAuthenticated: false, 
        isInitialized: true,
        isLoading: false 
      });
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      if (user) {
        console.log('✅ Auth check success:', user.role, user.email);
        set({ 
          user, 
          isAuthenticated: true, 
          isInitialized: true,
          isLoading: false,
          error: null
        });
      } else {
        console.log('❌ Auth check failed - invalid token');
        localStorage.removeItem('auth-token');
        set({ 
          token: null,
          isAuthenticated: false, 
          isInitialized: true,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('auth-token');
      set({ 
        token: null,
        user: null,
        company: null,
        isAuthenticated: false, 
        isInitialized: true,
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));