// src/components/common/ConfirmDialog.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button, Modal } from '@/components/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  type?: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  type = 'warning',
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6" />,
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          confirmVariant: 'primary' as const, // Utiliser primary avec style rouge via className
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          confirmVariant: 'primary' as const,
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6" />,
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          confirmVariant: 'primary' as const,
          confirmClass: ''
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          iconBg: 'bg-green-100 dark:bg-green-900/20',
          iconColor: 'text-green-600 dark:text-green-400',
          confirmVariant: 'primary' as const,
          confirmClass: 'bg-green-600 hover:bg-green-700 text-white'
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          iconBg: 'bg-gray-100 dark:bg-gray-900/20',
          iconColor: 'text-gray-600 dark:text-gray-400',
          confirmVariant: 'primary' as const,
          confirmClass: ''
        };
    }
  };

  const { icon, iconBg, iconColor, confirmVariant, confirmClass } = getIconAndColors();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="text-center">
        {/* Icône */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <div className={iconColor}>
            {icon}
          </div>
        </motion.div>

        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className={`min-w-[100px] ${confirmClass}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Hook utilitaire pour simplifier l'utilisation
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    type: 'danger' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    isLoading: boolean;
  }>({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: () => {},
    isLoading: false
  });

  const openConfirmDialog = (config: {
    type?: 'danger' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setDialogState({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'Confirmer',
      cancelText: config.cancelText || 'Annuler',
      onConfirm: config.onConfirm,
      isLoading: false
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  };

  const handleConfirm = async () => {
    setDialogState(prev => ({ ...prev, isLoading: true }));
    try {
      await dialogState.onConfirm();
      closeDialog();
    } catch (error) {
      setDialogState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      type={dialogState.type}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      isLoading={dialogState.isLoading}
      onConfirm={handleConfirm}
      onCancel={closeDialog}
    />
  );

  return {
    openConfirmDialog,
    closeDialog,
    ConfirmDialogComponent
  };
};

export { ConfirmDialog };