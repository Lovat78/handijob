// src/hooks/index.ts
// Export centralisé de tous les hooks personnalisés

// Hooks d'authentification et autorisation
export { useAuth } from './useAuth';

// Hooks de gestion des données
export { useJobStore } from '../stores/jobStore';
export { useCandidateStore } from '../stores/candidateStore';
export { useMatching } from './useMatching';
export { useAnalytics } from './useAnalytics';

// Hooks UI et interactions
export { useToast } from './useToast';
export { useMobile } from './useMobile';
export { useKeyboard } from './useKeyboard';
export { useClickOutside } from './useClickOutside';
export { useDebounce } from './useDebounce';

// Hooks de formulaires
export { useForm } from 'react-hook-form';

// Types pour les hooks UI
export interface UseKeyboardOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface UseClickOutsideOptions {
  enabled?: boolean;
}