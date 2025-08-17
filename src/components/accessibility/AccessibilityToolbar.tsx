// src/components/accessibility/AccessibilityToolbar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Contrast, 
  Volume2, 
  MousePointer,
  Settings,
  X
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  isOpen,
  onClose
}) => {
  const {
    fontSize,
    setFontSize,
    accessibilityMode,
    toggleAccessibilityMode,
    darkMode,
    toggleDarkMode
  } = useUIStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 top-20 z-50 w-80"
        >
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Accessibilité
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Type className="w-4 h-4 inline mr-2" />
                  Taille du texte
                </label>
                <div className="flex space-x-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setFontSize(size)}
                      className="flex-1"
                    >
                      {size === 'small' && 'Petit'}
                      {size === 'medium' && 'Normal'}
                      {size === 'large' && 'Grand'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div>
                <Button
                  variant={darkMode ? 'primary' : 'secondary'}
                  onClick={toggleDarkMode}
                  fullWidth
                  className="justify-start"
                >
                  <Contrast className="w-4 h-4 mr-2" />
                  Mode sombre
                </Button>
              </div>

              {/* Accessibility Mode */}
              <div>
                <Button
                  variant={accessibilityMode ? 'primary' : 'secondary'}
                  onClick={toggleAccessibilityMode}
                  fullWidth
                  className="justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Mode accessibilité
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Désactive les animations et améliore les contrastes
                </p>
              </div>

              {/* Keyboard Navigation Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Navigation clavier
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Tab</kbd> Navigation</p>
                  <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Entrée</kbd> Activer</p>
                  <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Échap</kbd> Fermer</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AccessibilityToolbar };