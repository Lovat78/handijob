// src/services/mockData.ts
import { User, Company, Job, Candidate, MatchResult, Analytics } from '@/types';

// Fonction de simulation API
const API_DELAY = 500;

export const simulateApiCall = <T>(data: T, delay = API_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const simulateApiError = (message: string, delay = API_DELAY): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Utilisateurs mockés
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'marie.dubois@techcorp.fr',
    role: 'company',
    firstName: 'Marie',
    lastName: 'Dubois',
    avatar: 'https://i.pravatar.cc/150?u=marie',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-12-10T09:15:00Z'
  },
  {
    id: 'user-2',
    email: 'ahmed.benali@example.fr',
    role: 'candidate',
    firstName: 'Ahmed',
    lastName: 'Benali',
    avatar: 'https://i.pravatar.cc/150?u=ahmed',
    isActive: true,
    createdAt: '2024-02-01T14:20:00Z',
    lastLoginAt: '2024-12-09T16:45:00Z'
  },
  {
    id: 'user-3',
    email: 'sophie.martin@inclusive-corp.fr',
    role: 'company',
    firstName: 'Sophie',
    lastName: 'Martin',
    avatar: 'https://i.pravatar.cc/150?u=sophie',
    isActive: true,
    createdAt: '2024-01-20T11:15:00Z'
  }
];

// Entreprises mockées
export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    userId: 'user-1',
    name: 'TechCorp Innovation',
    description: 'Leader en solutions technologiques inclusives',
    website: 'https://techcorp.fr',
    email: 'contact@techcorp.fr',
    phone: '+33 1 23 45 67 89',
    logo: 'https://via.placeholder.com/100x100/2563eb/ffffff?text=TC',
    industry: 'Technologie',
    size: '201-500',
    foundedYear: 2010,
    address: {
      street: '123 Avenue de l\'Innovation',
      city: 'Paris',
      zipCode: '75001',
      country: 'France'
    },
    values: ['Innovation', 'Inclusion', 'Collaboration'],
    benefits: ['Télétravail', 'Formation continue', 'Accessibilité'],
    accessibilityCommitment: 'Engagement fort pour l\'inclusion des personnes en situation de handicap',
    oethStatus: true,
    oethRate: 4.2,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T15:20:00Z'
  },
  {
    id: 'comp-2',
    userId: 'user-3',
    name: 'Inclusive Corp',
    description: 'Spécialiste en recrutement inclusif',
    website: 'https://inclusive-corp.fr',
    industry: 'Ressources Humaines',
    size: '51-200',
    address: {
      street: '456 Rue de l\'Égalité',
      city: 'Lyon',
      zipCode: '69001',
      country: 'France'
    },
    oethStatus: true,
    oethRate: 6.1,
    createdAt: '2024-01-20T11:15:00Z'
  }
];

// Offres d'emploi mockées
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    title: 'Développeur Frontend Senior',
    description: 'Nous recherchons un développeur frontend expérimenté pour rejoindre notre équipe inclusive. Poste adapté aux personnes en situation de handicap.',
    requirements: [
      '5+ années d\'expérience en React/TypeScript',
      'Connaissance des bonnes pratiques d\'accessibilité web',
      'Maîtrise des outils de design inclusif'
    ],
    benefits: [
      'Télétravail à 100%',
      'Matériel adapté fourni',
      'Accompagnement personnalisé',
      'Horaires flexibles'
    ],
    contractType: 'CDI',
    workMode: 'Télétravail',
    location: {
      street: '123 Avenue de l\'Innovation',
      city: 'Paris',
      zipCode: '75001',
      country: 'France'
    },
    salaryMin: 45000,
    salaryMax: 65000,
    accessibilityFeatures: [
      {
        type: 'wheelchair_accessible',
        description: 'Locaux entièrement accessibles PMR',
        available: true
      },
      {
        type: 'remote_work',
        description: 'Télétravail à 100% possible',
        available: true
      },
      {
        type: 'flexible_schedule',
        description: 'Horaires flexibles et aménageables',
        available: true
      }
    ],
    tags: ['React', 'TypeScript', 'Accessibilité', 'Remote'],
    status: 'active',
    aiOptimized: true,
    handibienveillant: true,
    viewCount: 156,
    applicationCount: 23,
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    expiresAt: '2025-01-15T23:59:59Z'
  },
  {
    id: 'job-2',
    companyId: 'comp-1',
    title: 'UX Designer Inclusif',
    description: 'Conception d\'interfaces utilisateur accessibles et inclusives pour nos applications.',
    requirements: [
      'Expérience en design d\'accessibilité',
      'Maîtrise Figma et outils de prototypage',
      'Connaissance WCAG 2.1'
    ],
    benefits: [
      'Formation continue',
      'Budget matériel adaptatif',
      'Équipe bienveillante'
    ],
    contractType: 'CDI',
    workMode: 'Hybride',
    location: {
      street: '123 Avenue de l\'Innovation',
      city: 'Paris',
      zipCode: '75001',
      country: 'France'
    },
    salaryMin: 40000,
    salaryMax: 55000,
    accessibilityFeatures: [
      {
        type: 'visually_impaired',
        description: 'Outils adaptés pour déficience visuelle',
        available: true
      }
    ],
    tags: ['UX', 'Design', 'Accessibilité', 'WCAG'],
    status: 'active',
    aiOptimized: false,
    handibienveillant: true,
    viewCount: 89,
    applicationCount: 12,
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-25T16:45:00Z'
  }
];

// Candidats mockés
export const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    userId: 'user-2',
    profile: {
      firstName: 'Ahmed',
      lastName: 'Benali',
      title: 'Développeur Frontend',
      summary: 'Développeur passionné avec 6 ans d\'expérience en React et accessibilité web.',
      location: { city: 'Paris' },
      email: 'ahmed.benali@example.fr',
      phone: '+33 6 12 34 56 78',
      experience: 6,
      skills: [
        { name: 'React', level: 90, category: 'technical', verified: true },
        { name: 'TypeScript', level: 85, category: 'technical', verified: true },
        { name: 'Accessibilité Web', level: 80, category: 'technical', verified: false },
        { name: 'Communication', level: 85, category: 'soft', verified: false },
        { name: 'Travail en équipe', level: 90, category: 'soft', verified: false }
      ],
      education: [
        {
          degree: 'Master Informatique',
          school: 'Université Paris-Saclay',
          year: 2018,
          field: 'Développement Web'
        }
      ],
      languages: [
        { name: 'Français', level: 'Natif' },
        { name: 'Anglais', level: 'Courant' },
        { name: 'Arabe', level: 'Natif' }
      ]
    },
    accessibility: {
      needsAccommodation: true,
      accommodationTypes: ['Matériel adapté', 'Horaires flexibles']
    },
    preferences: {
      contractTypes: ['CDI'],
      workModes: ['Télétravail', 'Hybride'],
      locations: ['Paris', 'Île-de-France'],
      salaryMin: 40000,
      salaryMax: 60000,
      benefits: ['Télétravail', 'Formation']
    },
    badges: [
      {
        id: 'badge-1',
        name: 'Expert React',
        description: 'Maîtrise avancée de React',
        iconUrl: '🏆',
        earnedAt: '2024-10-15T00:00:00Z'
      }
    ],
    availability: true,
    lastActive: '2024-12-09T16:45:00Z',
    createdAt: '2024-02-01T14:20:00Z'
  },
  {
    id: 'cand-2',
    userId: 'user-4',
    profile: {
      firstName: 'Sarah',
      lastName: 'Dubois',
      title: 'UX Designer',
      summary: 'Designer UX spécialisée en accessibilité numérique.',
      location: { city: 'Lyon' },
      experience: 4,
      skills: [
        { name: 'Figma', level: 95, category: 'tool', verified: true },
        { name: 'Design System', level: 88, category: 'technical', verified: true },
        { name: 'WCAG', level: 85, category: 'technical', verified: false },
        { name: 'Empathie', level: 92, category: 'soft', verified: false }
      ]
    },
    accessibility: {
      needsAccommodation: false,
      accommodationTypes: []
    },
    preferences: {
      contractTypes: ['CDI', 'Freelance'],
      workModes: ['Hybride'],
      locations: ['Lyon', 'Paris'],
      salaryMin: 35000,
      salaryMax: 50000
    },
    availability: true,
    lastActive: '2024-12-08T12:20:00Z',
    createdAt: '2024-03-10T09:15:00Z'
  }
];

// Résultats de matching mockés
export const mockMatchResults: MatchResult[] = [
  {
    candidateId: 'cand-1',
    jobId: 'job-1',
    score: 92,
    breakdown: {
      skillsMatch: 95,
      experienceMatch: 90,
      locationMatch: 100,
      accessibilityMatch: 85,
      cultureMatch: 88,
      salaryMatch: 95
    },
    confidence: 88,
    reasons: [
      {
        category: 'skillsMatch',
        positive: true,
        description: 'Excellente maîtrise de React et TypeScript',
        weight: 0.3
      },
      {
        category: 'experienceMatch',
        positive: true,
        description: '6 ans d\'expérience correspondent aux attentes',
        weight: 0.25
      },
      {
        category: 'accessibilityMatch',
        positive: true,
        description: 'Besoins d\'accommodation compatibles',
        weight: 0.2
      }
    ],
    recommendations: [
      'Mettre en avant l\'expérience en accessibilité web',
      'Préparer des exemples de projets React complexes',
      'Discuter des aménagements de poste souhaités'
    ],
    createdAt: '2024-12-10T10:30:00Z'
  },
  {
    candidateId: 'cand-2',
    jobId: 'job-2',
    score: 87,
    breakdown: {
      skillsMatch: 90,
      experienceMatch: 80,
      locationMatch: 85,
      accessibilityMatch: 95,
      cultureMatch: 92,
      salaryMatch: 88
    },
    confidence: 82,
    reasons: [
      {
        category: 'skillsMatch',
        positive: true,
        description: 'Expertise en design d\'accessibilité',
        weight: 0.35
      },
      {
        category: 'cultureMatch',
        positive: true,
        description: 'Valeurs d\'inclusion alignées',
        weight: 0.25
      }
    ],
    recommendations: [
      'Présenter le portfolio d\'accessibilité',
      'Échanger sur la vision du design inclusif'
    ],
    createdAt: '2024-12-10T11:00:00Z'
  }
];

// Analytics mockées
export const mockAnalytics: Analytics = {
  period: 'monthly',
  companyId: 'comp-1',
  metrics: {
    totalJobs: 15,
    activeJobs: 8,
    totalApplications: 127,
    hiredCandidates: 12,
    averageTimeToHire: 18,
    retentionRate: 94,
    diversityScore: 8.2
  },
  trends: [
    {
      metric: 'Applications',
      current: 127,
      previous: 98,
      change: 29.6,
      trend: 'up'
    },
    {
      metric: 'Taux de conversion',
      current: 9.4,
      previous: 12.2,
      change: -2.8,
      trend: 'down'
    }
  ],
  oethCompliance: {
    currentRate: 4.2,
    targetRate: 6.0,
    gap: -1.8,
    projection: 5.1,
    recommendations: [
      'Augmenter le sourcing de candidats en situation de handicap',
      'Optimiser les annonces pour l\'accessibilité'
    ]
  }
};

// Types additionnels nécessaires
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
}

export interface Education {
  degree: string;
  school: string;
  year: number;
  field?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface JobPreferences {
  contractTypes: string[];
  workModes: string[];
  locations: string[];
  salaryMin?: number;
  salaryMax?: number;
  benefits?: string[];
}