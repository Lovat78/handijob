// src/components/accessibility/AccessibilityManager.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  MousePointer,
  Keyboard,
  Settings,
  X,
  Check,
  Info
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  contrast: 'normal' | 'high' | 'maximum';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorblindFriendly: boolean;
  focusIndicator: 'default' | 'enhanced' | 'maximum';
  announcements: boolean;
  skipLinks: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  isToolbarOpen: boolean;
  toggleToolbar: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrast: 'normal',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  colorblindFriendly: false,
  focusIndicator: 'default',
  announcements: true,
  skipLinks: true
};

// Provider principal
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(defaultSettings));
  };

  const toggleToolbar = () => setIsToolbarOpen(!isToolbarOpen);

  // Appliquer les paramètres d'accessibilité
  useEffect(() => {
    const root = document.documentElement;
    
    // Taille de police
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Contraste
    root.setAttribute('data-contrast', settings.contrast);
    
    // Animations réduites
    if (settings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--motion-duration');
      root.classList.remove('reduce-motion');
    }
    
    // Mode lecteur d'écran
    if (settings.screenReader) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Indicateur de focus renforcé
    root.setAttribute('data-focus-indicator', settings.focusIndicator);
    
    // Mode daltonien
    if (settings.colorblindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }

    // Skip links
    if (settings.skipLinks) {
      addSkipLinks();
    }

  }, [settings]);

  const addSkipLinks = () => {
    // Supprimer les liens existants
    document.querySelectorAll('.skip-link').forEach(link => link.remove());
    
    // Ajouter les nouveaux liens
    const skipLinks = [
      { href: '#main-content', text: 'Aller au contenu principal' },
      { href: '#navigation', text: 'Aller à la navigation' },
      { href: '#search', text: 'Aller à la recherche' }
    ];

    skipLinks.forEach(({ href, text }) => {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 font-medium';
      link.textContent = text;
      document.body.insertBefore(link, document.body.firstChild);
    });
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      isToolbarOpen,
      toggleToolbar
    }}>
      {children}
      <AccessibilityToolbar />
      <AccessibilityAnnouncer />
      <FocusManager />
    </AccessibilityContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Barre d'outils d'accessibilité
const AccessibilityToolbar: React.FC = () => {
  const { settings, updateSetting, resetSettings, isToolbarOpen, toggleToolbar } = useAccessibility();
  const { toast } = useToast();

  const fontSizes = [
    { value: 'small', label: 'Petit', size: '14px' },
    { value: 'medium', label: 'Normal', size: '16px' },
    { value: 'large', label: 'Grand', size: '18px' },
    { value: 'xl', label: 'Très grand', size: '20px' }
  ];

  const contrastModes = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Élevé' },
    { value: 'maximum', label: 'Maximum' }
  ];

  const focusIndicators = [
    { value: 'default', label: 'Par défaut' },
    { value: 'enhanced', label: 'Renforcé' },
    { value: 'maximum', label: 'Maximum' }
  ];

  const handleReset = () => {
    resetSettings();
    toast.success('Paramètres réinitialisés', 'Les paramètres d\'accessibilité ont été remis par défaut.');
  };

  return (
    <>
      {/* Bouton d'ouverture - REMONTÉ PLUS HAUT */}
      <motion.button
        onClick={toggleToolbar}
        className="fixed bottom-24 right-6 z-50 bg-primary-600 text-white p-4 rounded-full shadow-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 border-2 border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Ouvrir les options d'accessibilité"
        style={{
          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
        }}
      >
        <Accessibility className="w-7 h-7" />
      </motion.button>

      {/* Toolbar */}
      <AnimatePresence>
        {isToolbarOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-20 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto"
          >
            <Card padding="md" className="bg-white shadow-2xl border-2 border-primary-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Accessibility className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Options d'accessibilité
                  </h2>
                </div>
                <button
                  onClick={toggleToolbar}
                  className="text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-primary-500 rounded p-1"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Paramètres */}
              <div className="space-y-6">
                {/* Taille de police */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Type className="w-4 h-4 inline mr-2" />
                    Taille du texte
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => updateSetting('fontSize', size.value)}
                        className={`p-3 text-left rounded-lg border transition-all focus:ring-2 focus:ring-primary-500 ${
                          settings.fontSize === size.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ fontSize: size.size }}
                      >
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs opacity-75">{size.size}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contraste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Contrast className="w-4 h-4 inline mr-2" />
                    Contraste
                  </label>
                  <div className="space-y-2">
                    {contrastModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => updateSetting('contrast', mode.value)}
                        className={`w-full p-3 text-left rounded-lg border transition-all focus:ring-2 focus:ring-primary-500 ${
                          settings.contrast === mode.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{mode.label}</span>
                          {settings.contrast === mode.value && (
                            <Check className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options booléennes */}
                <div className="space-y-3">
                  {[
                    { key: 'reducedMotion', label: 'Réduire les animations', icon: <MousePointer className="w-4 h-4" /> },
                    { key: 'screenReader', label: 'Mode lecteur d\'écran', icon: <Volume2 className="w-4 h-4" /> },
                    { key: 'keyboardNavigation', label: 'Navigation clavier renforcée', icon: <Keyboard className="w-4 h-4" /> },
                    { key: 'colorblindFriendly', label: 'Mode daltonien', icon: <Eye className="w-4 h-4" /> },
                    { key: 'announcements', label: 'Annonces vocales', icon: <Volume2 className="w-4 h-4" /> }
                  ].map((option) => (
                    <label key={option.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">{option.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[option.key as keyof AccessibilitySettings] as boolean}
                        onChange={(e) => updateSetting(option.key as keyof AccessibilitySettings, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  ))}
                </div>

                {/* Indicateur de focus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Indicateur de focus
                  </label>
                  <select
                    value={settings.focusIndicator}
                    onChange={(e) => updateSetting('focusIndicator', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {focusIndicators.map((indicator) => (
                      <option key={indicator.value} value={indicator.value}>
                        {indicator.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button variant="ghost" onClick={handleReset} className="flex-1">
                    Réinitialiser
                  </Button>
                  <Button variant="primary" onClick={toggleToolbar} className="flex-1">
                    Appliquer
                  </Button>
                </div>

                {/* Info WCAG */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Conformité WCAG 2.1 AA</p>
                      <p>Cette interface respecte les standards d'accessibilité web internationaux.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Gestionnaire d'annonces pour les lecteurs d'écran
const AccessibilityAnnouncer: React.FC = () => {
  const { settings } = useAccessibility();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (!settings.announcements) return;

    const announcer = (message: string) => {
      setAnnouncements(prev => [...prev, message]);
      setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 3000);
    };

    // Écouter les événements personnalisés pour les annonces
    window.addEventListener('accessibility-announce', (e: any) => {
      announcer(e.detail.message);
    });

    return () => {
      window.removeEventListener('accessibility-announce', announcer);
    };
  }, [settings.announcements]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcements.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

// Gestionnaire de focus
const FocusManager: React.FC = () => {
  const { settings } = useAccessibility();

  useEffect(() => {
    let focusTracker: HTMLElement | null = null;

    const handleFocus = (e: FocusEvent) => {
      if (!settings.keyboardNavigation) return;

      const target = e.target as HTMLElement;
      
      // Créer un indicateur de focus visible
      if (settings.focusIndicator !== 'default') {
        if (focusTracker) {
          focusTracker.remove();
        }

        focusTracker = document.createElement('div');
        const rect = target.getBoundingClientRect();
        
        const thickness = settings.focusIndicator === 'maximum' ? '4px' : '2px';
        const color = settings.focusIndicator === 'maximum' ? '#dc2626' : '#3b82f6';
        
        focusTracker.style.cssText = `
          position: fixed;
          top: ${rect.top - 2}px;
          left: ${rect.left - 2}px;
          width: ${rect.width + 4}px;
          height: ${rect.height + 4}px;
          border: ${thickness} solid ${color};
          border-radius: 6px;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.15s ease;
        `;
        
        document.body.appendChild(focusTracker);
      }
    };

    const handleBlur = () => {
      if (focusTracker) {
        focusTracker.remove();
        focusTracker = null;
      }
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      if (focusTracker) {
        focusTracker.remove();
      }
    };
  }, [settings.keyboardNavigation, settings.focusIndicator]);

  // Gestion de la navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échapper pour fermer les modales
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        const openModal = Array.from(modals).find(modal => 
          window.getComputedStyle(modal).display !== 'none'
        );
        if (openModal) {
          const closeButton = openModal.querySelector('[aria-label*="fermer"], [aria-label*="Fermer"]') as HTMLElement;
          closeButton?.click();
        }
      }

      // Navigation dans les listes avec flèches
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        const focused = document.activeElement;
        if (focused?.getAttribute('role') === 'option' || focused?.tagName === 'LI') {
          e.preventDefault();
          const items = Array.from(focused.parentElement?.children || []) as HTMLElement[];
          const currentIndex = items.indexOf(focused as HTMLElement);
          
          if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            items[currentIndex + 1].focus();
          } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            items[currentIndex - 1].focus();
          }
        }
      }
    };

    if (settings.keyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings.keyboardNavigation]);

  return null;
};

// Fonction utilitaire pour annoncer des messages
export const announce = (message: string) => {
  window.dispatchEvent(new CustomEvent('accessibility-announce', {
    detail: { message }
  }));
};

export { AccessibilityToolbar };