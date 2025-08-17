// src/types/auth.ts
import { User, Company } from './index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'company' | 'candidate';
  companyName?: string;
  companyIndustry?: string;
  companySize?: string;
  acceptsTerms: boolean;
  acceptsNewsletter?: boolean;
}

export interface AuthResponse {
  user: User;
  company?: Company;
  token: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface OnboardingData {
  step: number;
  completed: boolean;
  data: Record<string, any>;
}