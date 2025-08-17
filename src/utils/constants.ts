// src/utils/constants.ts

// Configuration de l'application
export const APP_CONFIG = {
  name: 'Handi.jobs',
  description: 'Recrutement inclusif nouvelle génération',
  version: '1.0.0',
  author: 'Handi.jobs Team',
  email: 'contact@handi-jobs.fr',
  website: 'https://handi-jobs.fr',
  repository: 'https://github.com/handi-jobs/app'
} as const;

// URLs de l'API
export const API_ENDPOINTS = {
  auth: '/api/auth',
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  refreshToken: '/api/auth/refresh',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  
  users: '/api/users',
  profile: '/api/users/profile',
  
  companies: '/api/companies',
  companyProfile: '/api/companies/profile',
  
  jobs: '/api/jobs',
  jobSearch: '/api/jobs/search',
  jobRecommendations: '/api/jobs/recommendations',
  
  candidates: '/api/candidates',
  candidateSearch: '/api/candidates/search',
  candidateProfile: '/api/candidates/profile',
  
  matching: '/api/matching',
  calculateMatch: '/api/matching/calculate',
  matchHistory: '/api/matching/history',
  softSkillsAnalysis: '/api/matching/soft-skills',
  
  analytics: '/api/analytics',
  kpiSummary: '/api/analytics/kpi',
  oethCompliance: '/api/analytics/oeth',
  benchmarks: '/api/analytics/benchmarks',
  
  messages: '/api/messages',
  conversations: '/api/conversations',
  
  notifications: '/api/notifications',
  settings: '/api/settings',
  
  upload: '/api/upload',
  export: '/api/export'
} as const;

// Clés de stockage local
export const LOCAL_STORAGE_KEYS = {
  authToken: 'handi-jobs-auth-token',
  refreshToken: 'handi-jobs-refresh-token',
  user: 'handi-jobs-user',
  company: 'handi-jobs-company',
  preferences: 'handi-jobs-preferences',
  
  // UI State
  darkMode: 'handi-jobs-dark-mode',
  fontSize: 'handi-jobs-font-size',
  accessibilityMode: 'handi-jobs-accessibility-mode',
  reducedMotion: 'handi-jobs-reduced-motion',
  sidebarCollapsed: 'handi-jobs-sidebar-collapsed',
  
  // Feature flags
  onboardingCompleted: 'handi-jobs-onboarding-completed',
  tourCompleted: 'handi-jobs-tour-completed',
  
  // Cache
  searchHistory: 'handi-jobs-search-history',
  recentJobs: 'handi-jobs-recent-jobs',
  recentCandidates: 'handi-jobs-recent-candidates'
} as const;

// Routes de l'application
export const ROUTES = {
  // Public
  home: '/',
  about: '/about',
  pricing: '/pricing',
  contact: '/contact',
  
  // Auth
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  
  // Dashboard
  dashboard: '/dashboard',
  
  // Jobs
  jobs: '/jobs',
  jobDetails: '/jobs/:id',
  createJob: '/jobs/create',
  editJob: '/jobs/:id/edit',
  
  // Candidates
  candidates: '/candidates',
  candidateDetails: '/candidates/:id',
  candidateProfile: '/candidates/profile',
  editProfile: '/candidates/profile/edit',
  
  // Matching
  matching: '/matching',
  matchResults: '/matching/results',
  
  // Analytics
  analytics: '/analytics',
  reports: '/analytics/reports',
  
  // Company
  company: '/company',
  companyProfile: '/company/profile',
  companySettings: '/company/settings',
  
  // Messages
  messages: '/messages',
  conversation: '/messages/:id',
  
  // Settings
  settings: '/settings',
  notifications: '/settings/notifications',
  privacy: '/settings/privacy',
  accessibility: '/settings/accessibility',
  
  // Legal
  terms: '/terms',
  privacy: '/privacy',
  cookies: '/cookies'
} as const;

// Types de contrat
export const CONTRACT_TYPES = [
  { value: 'CDI', label: 'CDI - Contrat à Durée Indéterminée' },
  { value: 'CDD', label: 'CDD - Contrat à Durée Déterminée' },
  { value: 'Stage', label: 'Stage' },
  { value: 'Freelance', label: 'Freelance / Indépendant' },
  { value: 'Alternance', label: 'Alternance / Apprentissage' }
] as const;

// Modes de travail
export const WORK_MODES = [
  { value: 'Présentiel', label: 'Présentiel', icon: 'Building' },
  { value: 'Télétravail', label: 'Télétravail', icon: 'Home' },
  { value: 'Hybride', label: 'Hybride', icon: 'Laptop' }
] as const;

// Tailles d'entreprise
export const COMPANY_SIZES = [
  { value: '1-10', label: 'Startup (1-10 employés)' },
  { value: '11-50', label: 'Petite entreprise (11-50 employés)' },
  { value: '51-200', label: 'Entreprise moyenne (51-200 employés)' },
  { value: '201-500', label: 'Grande entreprise (201-500 employés)' },
  { value: '500+', label: 'Très grande entreprise (500+ employés)' }
] as const;

// Secteurs d'activité
export const INDUSTRIES = [
  'Informatique et Technologies',
  'Finance et Banque',
  'Santé et Médical',
  'Éducation et Formation',
  'Commerce et Vente',
  'Marketing et Communication',
  'Industrie et Manufacturing',
  'Transport et Logistique',
  'Tourisme et Hôtellerie',
  'Conseil et Services',
  'Construction et BTP',
  'Agriculture et Agroalimentaire',
  'Énergie et Environnement',
  'Arts et Culture',
  'Sport et Loisirs',
  'Administration Publique',
  'Associatif et ONG',
  'Autre'
] as const;

// Types d'accessibilité
export const ACCESSIBILITY_TYPES = [
  {
    value: 'wheelchair_accessible',
    label: 'Accessible en fauteuil roulant',
    icon: 'Accessibility',
    description: 'Locaux et postes de travail accessibles aux personnes en fauteuil roulant'
  },
  {
    value: 'hearing_impaired',
    label: 'Adapté aux déficiences auditives',
    icon: 'Ear',
    description: 'Équipements et aménagements pour personnes sourdes ou malentendantes'
  },
  {
    value: 'visually_impaired',
    label: 'Adapté aux déficiences visuelles',
    icon: 'Eye',
    description: 'Aménagements pour personnes aveugles ou malvoyantes'
  },
  {
    value: 'cognitive_support',
    label: 'Support pour difficultés cognitives',
    icon: 'Brain',
    description: 'Accompagnement et adaptations pour troubles cognitifs'
  },
  {
    value: 'flexible_schedule',
    label: 'Horaires flexibles',
    icon: 'Clock',
    description: 'Possibilité d\'aménager les horaires de travail'
  },
  {
    value: 'remote_work',
    label: 'Télétravail possible',
    icon: 'Home',
    description: 'Possibilité de travailler à distance'
  }
] as const;

// Catégories de compétences
export const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Techniques', color: 'primary' },
  { value: 'soft', label: 'Savoir-être', color: 'success' },
  { value: 'language', label: 'Langues', color: 'warning' },
  { value: 'tool', label: 'Outils', color: 'info' }
] as const;

// Niveaux de compétence
export const SKILL_LEVELS = [
  { value: 0, label: 'Débutant', color: 'gray' },
  { value: 25, label: 'Notions', color: 'warning' },
  { value: 50, label: 'Intermédiaire', color: 'info' },
  { value: 75, label: 'Avancé', color: 'primary' },
  { value: 100, label: 'Expert', color: 'success' }
] as const;

// Niveaux de langue
export const LANGUAGE_LEVELS = [
  { value: 'Débutant', label: 'A1-A2 - Débutant' },
  { value: 'Intermédiaire', label: 'B1-B2 - Intermédiaire' },
  { value: 'Avancé', label: 'C1 - Avancé' },
  { value: 'Courant', label: 'C2 - Courant' },
  { value: 'Natif', label: 'Natif' }
] as const;

// Périodes d'analytics
export const ANALYTICS_PERIODS = [
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette année' },
  { value: 'custom', label: 'Période personnalisée' }
] as const;

// Statuts de conformité OETH
export const OETH_STATUS = [
  {
    value: 'compliant',
    label: 'Conforme',
    color: 'success',
    threshold: 6,
    description: 'Taux OETH supérieur à 6%'
  },
  {
    value: 'warning',
    label: 'Attention',
    color: 'warning',
    threshold: 4,
    description: 'Taux OETH entre 4% et 6%'
  },
  {
    value: 'non_compliant',
    label: 'Non conforme',
    color: 'error',
    threshold: 0,
    description: 'Taux OETH inférieur à 4%'
  }
] as const;

// Types de notification
export const NOTIFICATION_TYPES = [
  { value: 'new_match', label: 'Nouveaux matchs', icon: 'Heart' },
  { value: 'application_received', label: 'Candidature reçue', icon: 'FileText' },
  { value: 'application_update', label: 'Mise à jour candidature', icon: 'Bell' },
  { value: 'message_received', label: 'Nouveau message', icon: 'MessageCircle' },
  { value: 'job_expired', label: 'Offre expirée', icon: 'Clock' },
  { value: 'profile_viewed', label: 'Profil consulté', icon: 'Eye' },
  { value: 'system_update', label: 'Mise à jour système', icon: 'Info' }
] as const;

// Préférences d'accessibilité
export const ACCESSIBILITY_PREFERENCES = {
  fontSize: [
    { value: 'small', label: 'Petit', scale: '0.875' },
    { value: 'normal', label: 'Normal', scale: '1' },
    { value: 'large', label: 'Grand', scale: '1.125' }
  ],
  theme: [
    { value: 'light', label: 'Clair' },
    { value: 'dark', label: 'Sombre' },
    { value: 'auto', label: 'Automatique' }
  ]
} as const;

// Limites de fichiers
export const FILE_LIMITS = {
  avatar: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  cv: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  portfolio: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ]
  },
  logo: {
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  }
} as const;

// Configuration des toasts
export const TOAST_CONFIG = {
  duration: {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000
  },
  position: 'top-right',
  maxToasts: 5
} as const;

// Configuration de la pagination
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPagesShown: 5
} as const;

// Breakpoints responsive (correspondant à Tailwind)
export const BREAKPOINTS = {
  sm: 640,   // Tablet
  md: 768,   // Tablet large
  lg: 1024,  // Desktop
  xl: 1280,  // Desktop large
  '2xl': 1536 // Desktop XL
} as const;

// Configuration des animations
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300
  },
  easing: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Messages d'erreur courants
export const ERROR_MESSAGES = {
  network: 'Erreur de connexion. Vérifiez votre connexion internet.',
  unauthorized: 'Session expirée. Veuillez vous reconnecter.',
  forbidden: 'Vous n\'avez pas les droits pour effectuer cette action.',
  notFound: 'Ressource non trouvée.',
  serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
  validation: 'Données invalides. Vérifiez les informations saisies.',
  fileSize: 'Le fichier est trop volumineux.',
  fileType: 'Type de fichier non autorisé.',
  required: 'Ce champ est requis.',
  email: 'Adresse email invalide.',
  password: 'Le mot de passe doit contenir au moins 8 caractères.',
  phone: 'Numéro de téléphone invalide.',
  url: 'URL invalide.'
} as const;

// Messages de succès courants
export const SUCCESS_MESSAGES = {
  saved: 'Enregistré avec succès',
  updated: 'Mis à jour avec succès',
  deleted: 'Supprimé avec succès',
  sent: 'Envoyé avec succès',
  uploaded: 'Fichier téléchargé avec succès',
  copied: 'Copié dans le presse-papiers',
  profileCompleted: 'Profil complété avec succès',
  applicationSent: 'Candidature envoyée avec succès'
} as const;

// Configuration des recherches
export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minQueryLength: 2,
  maxResults: 100,
  maxSuggestions: 5,
  recentSearchesLimit: 10
} as const;

// Configuration des exports
export const EXPORT_CONFIG = {
  formats: [
    { value: 'csv', label: 'CSV', icon: 'FileText' },
    { value: 'excel', label: 'Excel', icon: 'Sheet' },
    { value: 'pdf', label: 'PDF', icon: 'File' }
  ],
  maxRecords: 10000
} as const;

// Valeurs par défaut
export const DEFAULTS = {
  avatar: '/images/default-avatar.png',
  logo: '/images/default-logo.png',
  jobImage: '/images/default-job.png',
  pageSize: 10,
  language: 'fr',
  currency: 'EUR',
  country: 'France',
  timezone: 'Europe/Paris'
} as const;