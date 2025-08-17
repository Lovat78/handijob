// src/components/ui/Toast.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success-600" />,
    error: <AlertCircle className="w-5 h-5 text-error-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-600" />,
    info: <Info className="w-5 h-5 text-primary-600" />
  };

  const colors = {
    success: 'border-success-200 bg-success-50 dark:bg-success-900/20',
    error: 'border-error-200 bg-error-50 dark:bg-error-900/20',
    warning: 'border-warning-200 bg-warning-50 dark:bg-warning-900/20',
    info: 'border-primary-200 bg-primary-50 dark:bg-primary-900/20'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${colors[type]}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
          {message && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 min-h-touch min-w-touch"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, toast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            id={toastItem.id}
            type={toastItem.type}
            title={toastItem.title}
            message={toastItem.message}
            onClose={toast.remove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};