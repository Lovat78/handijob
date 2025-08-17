// src/hooks/useToast.ts
import { useUIStore } from '@/stores/uiStore';
import { ToastItem } from '@/types';

interface UseToastReturn {
  toast: {
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
  };
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToast = (): UseToastReturn => {
  const { toasts, addToast, removeToast, clearToasts } = useUIStore();

  const toast = {
    success: (title: string, message?: string, duration = 5000) => {
      addToast({
        type: 'success',
        title,
        message,
        duration
      });
    },

    error: (title: string, message?: string, duration = 7000) => {
      addToast({
        type: 'error',
        title,
        message,
        duration
      });
    },

    warning: (title: string, message?: string, duration = 6000) => {
      addToast({
        type: 'warning',
        title,
        message,
        duration
      });
    },

    info: (title: string, message?: string, duration = 5000) => {
      addToast({
        type: 'info',
        title,
        message,
        duration
      });
    }
  };

  return {
    toast,
    toasts,
    removeToast,
    clearToasts
  };
};