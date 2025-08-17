// src/types/index.ts
export type UserRole = 'company' | 'candidate' | 'admin' | 'association';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  industry: string;
  size: CompanySize;
  foundedYear?: number;
  address: Address;
  values?: string[];
  benefits?: string[];
  accessibilityCommitment?: string;
  oethStatus: boolean;
  oethRate: number;
  createdAt: string;
  updatedAt?: string;
}

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

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
  companySize?: CompanySize;
}

export interface AuthResponse {
  user: User;
  company?: Company;
  token: string;
}

// Toast types
export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: number;
}

// Export all from other type files
export * from './auth';
export * from './job';
export * from './candidate';
export * from './matching';
export * from './analytics';