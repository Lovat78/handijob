// src/components/onboarding/GuidedTour.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, Sparkles, Users, BarChart3 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  action?: 'highlight' | 'click' | 'scroll';
}

interface GuidedTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  maxWidth: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Bienvenue sur Handi.jobs !',
    content: 'Découvrez votre nouvelle plateforme de recrutement inclusif. Ce tour guidé vous présentera les fonctionnalités principales.',
    icon: <Sparkles className="w-6 h-6 text-primary-600" />,
    position: 'auto'
  },
  {
    id: 'dashboard',
    target: '[data-tour="dashboard"]',
    title: 'Tableau de bord',
    content: 'Votre vue d\'ensemble : KPIs de recrutement, candidatures récentes et métriques OETH en temps réel.',
    icon: <BarChart3 className="w-6 h-6 text-primary-600" />,
    position: 'auto'
  },
  {
    id: 'jobs',
    target: '[data-tour="jobs"]',
    title: 'Gestion des offres',
    content: 'Créez et gérez vos offres d\'emploi avec l\'assistant IA pour un langage handibienveillant.',
    icon: <Target className="w-6 h-6 text-primary-600" />,
    position: 'auto'
  },
  {
    id: 'candidates',
    target: '[data-tour="candidates"]',
    title: 'Recherche de candidats',
    content: 'Trouvez les meilleurs profils grâce au matching IA et explorez notre vivier de talents inclusifs.',
    icon: <Users className="w-6 h-6 text-primary-600" />,
    position: 'auto'
  },
  {
    id: 'matching',
    target: '[data-tour="matching"]',
    title: 'Matching IA',
    content: 'Notre intelligence artificielle analyse la compatibilité entre vos offres et les candidats pour des recommandations personnalisées.',
    icon: <Target className="w-6 h-6 text-primary-600" />,
    position: 'auto'
  }
];

const calculateTooltipPosition = (
  targetElement: HTMLElement, 
  tooltipRef: HTMLDivElement,
  preferredPosition: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto'
): TooltipPosition => {
  const targetRect = targetElement.getBoundingClientRect();
  const tooltipRect = tooltipRef.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const margin = 16; // Marge de sécurité
  const arrowSize = 8; // Taille de la flèche
  
  // Largeur maximum adaptative
  const maxWidth = Math.min(400, viewportWidth - (margin * 2));
  
  // Positions possibles
  const positions = {
    top: {
      top: targetRect.top - tooltipRect.height - arrowSize - margin,
      left: targetRect.left + (targetRect.width / 2) - (maxWidth / 2),
      placement: 'top' as const
    },
    bottom: {
      top: targetRect.bottom + arrowSize + margin,
      left: targetRect.left + (targetRect.width / 2) - (maxWidth / 2),
      placement: 'bottom' as const
    },
    left: {
      top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
      left: targetRect.left - maxWidth - arrowSize - margin,
      placement: 'left' as const
    },
    right: {
      top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
      left: targetRect.right + arrowSize + margin,
      placement: 'right' as const
    }
  };
  
  // Fonction pour vérifier si une position est valide
  const isPositionValid = (pos: typeof positions.top) => {
    return pos.top >= margin && 
           pos.top + tooltipRect.height <= viewportHeight - margin &&
           pos.left >= margin && 
           pos.left + maxWidth <= viewportWidth - margin;
  };
  
  // Si position préférée spécifiée et valide
  if (preferredPosition !== 'auto' && isPositionValid(positions[preferredPosition])) {
    return { ...positions[preferredPosition], maxWidth };
  }
  
  // Sinon, chercher la meilleure position automatiquement
  const preferredOrder: Array<keyof typeof positions> = ['bottom', 'top', 'right', 'left'];
  
  for (const pos of preferredOrder) {
    if (isPositionValid(positions[pos])) {
      return { ...positions[pos], maxWidth };
    }
  }
  
  // Position de fallback (centrée sur l'écran)
  return {
    top: Math.max(margin, Math.min(viewportHeight / 2 - 100, targetRect.top)),
    left: Math.max(margin, Math.min(viewportWidth / 2 - maxWidth / 2, targetRect.left)),
    maxWidth,
    placement: 'bottom'
  };
};

const Tooltip: React.FC<{
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onSkip: () => void;
}> = ({ step, currentStep, totalSteps, onNext, onPrevious, onClose, onSkip }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    maxWidth: 400,
    placement: 'bottom'
  });

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.querySelector(step.target) as HTMLElement;
      
      if (targetElement && tooltipRef.current) {
        const newPosition = calculateTooltipPosition(
          targetElement, 
          tooltipRef.current, 
          step.position
        );
        setPosition(newPosition);
      }
    };

    // Délai pour laisser le DOM se stabiliser
    const timer = setTimeout(updatePosition, 100);
    
    // Recalculer sur resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step.target, step.position]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed z-[9999] pointer-events-auto"
      style={{
        top: position.top,
        left: position.left,
        maxWidth: position.maxWidth,
        minWidth: Math.min(320, position.maxWidth)
      }}
    >
      <Card 
        padding="lg" 
        className={`relative shadow-xl border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-800 ${
          position.placement === 'top' ? 'mb-2' : 
          position.placement === 'bottom' ? 'mt-2' :
          position.placement === 'left' ? 'mr-2' : 'ml-2'
        }`}
      >
        {/* Flèche */}
        <div
          className={`absolute w-0 h-0 border-8 ${
            position.placement === 'top' 
              ? 'bottom-[-16px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white dark:border-t-gray-800'
            : position.placement === 'bottom'
              ? 'top-[-16px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white dark:border-b-gray-800'
            : position.placement === 'left'
              ? 'right-[-16px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-white dark:border-l-gray-800'
              : 'left-[-16px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-white dark:border-r-gray-800'
          }`}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {step.icon}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {step.content}
        </p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Passer le tour
            </Button>
            
            {isLastStep ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-1"
              >
                Terminer
                <Target className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onNext}
                className="flex items-center gap-1"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Overlay: React.FC<{ targetSelector: string }> = ({ targetSelector }) => {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateHighlight = () => {
      const targetElement = document.querySelector(targetSelector) as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightRect(rect);
      }
    };

    updateHighlight();
    
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);
    
    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [targetSelector]);

  if (!highlightRect) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{
        background: `
          radial-gradient(
            ellipse ${highlightRect.width + 20}px ${highlightRect.height + 20}px at ${highlightRect.left + highlightRect.width / 2}px ${highlightRect.top + highlightRect.height / 2}px,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.7) 70%
          )
        `
      }}
    />
  );
};

const GuidedTour: React.FC<GuidedTourProps> = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (isVisible) {
      // Désactiver le scroll du body
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    onComplete();
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip();
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay avec highlight */}
          <Overlay targetSelector={currentTourStep.target} />
          
          {/* Tooltip */}
          <Tooltip
            step={currentTourStep}
            currentStep={currentStep}
            totalSteps={tourSteps.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onClose={handleComplete}
            onSkip={handleSkip}
          />
        </>
      )}
    </AnimatePresence>
  );
};

// Hook pour gérer l'état de l'onboarding
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Simuler la vérification si l'utilisateur a déjà vu le tour
    const hasSeenTour = localStorage.getItem(`onboarding-completed-${user?.id}`);
    
    if (user && !hasSeenTour) {
      // Délai pour laisser l'interface se charger
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000); // Augmenté à 2s pour stabilité
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    if (user?.id) {
      localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
    }
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    if (user?.id) {
      localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
    }
  };

  const resetOnboarding = () => {
    if (user?.id) {
      localStorage.removeItem(`onboarding-completed-${user.id}`);
      setShowOnboarding(true);
    }
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    startOnboarding
  };
};

export { GuidedTour };