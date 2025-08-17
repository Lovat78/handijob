// src/stores/uiStore.ts
import { create } from 'zustand';
import { ToastItem } from '@/types';

interface UIState {
  // Theme
  darkMode: boolean;
  fontSize: 'small' | 'normal' | 'large';
  accessibilityMode: boolean;
  
  // Layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Toasts
  toasts: ToastItem[];
  
  // Loading states
  globalLoading: boolean;
}

interface UIActions {
  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
  toggleAccessibilityMode: () => void;
  
  // Layout actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Toast actions
  addToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
}

// Helper to get initial dark mode preference
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    return JSON.parse(stored);
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Helper to get initial font size
const getInitialFontSize = (): 'small' | 'normal' | 'large' => {
  if (typeof window === 'undefined') return 'normal';
  
  const stored = localStorage.getItem('fontSize');
  if (stored && ['small', 'normal', 'large'].includes(stored)) {
    return stored as 'small' | 'normal' | 'large';
  }
  
  return 'normal';
};

// Helper to get initial accessibility mode
const getInitialAccessibilityMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem('accessibilityMode');
  if (stored !== null) {
    return JSON.parse(stored);
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // Initial state
  darkMode: getInitialDarkMode(),
  fontSize: getInitialFontSize(),
  accessibilityMode: getInitialAccessibilityMode(),
  sidebarOpen: true,
  mobileMenuOpen: false,
  toasts: [],
  globalLoading: false,

  // Theme actions
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    set({ darkMode: newDarkMode });
  },

  setDarkMode: (enabled) => {
    localStorage.setItem('darkMode', JSON.stringify(enabled));
    set({ darkMode: enabled });
  },

  setFontSize: (size) => {
    localStorage.setItem('fontSize', size);
    set({ fontSize: size });
  },

  toggleAccessibilityMode: () => {
    const newAccessibilityMode = !get().accessibilityMode;
    localStorage.setItem('accessibilityMode', JSON.stringify(newAccessibilityMode));
    set({ accessibilityMode: newAccessibilityMode });
  },

  // Layout actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleMobileMenu: () => set({ mobileMenuOpen: !get().mobileMenuOpen }),

  // Toast actions
  addToast: (toastData) => {
    const toast: ToastItem = {
      ...toastData,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      duration: toastData.duration || 5000
    };

    set({ toasts: [...get().toasts, toast] });

    // Auto remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(toast.id);
      }, toast.duration);
    }
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(toast => toast.id !== id) });
  },

  clearToasts: () => set({ toasts: [] }),

  // Loading actions
  setGlobalLoading: (loading) => set({ globalLoading: loading })
}));