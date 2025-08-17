// src/utils/validation.ts
import { z } from 'zod';

// Schémas de base
export const emailSchema = z
  .string()
  .min(1, 'Email requis')
  .email('Format email invalide');

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const phoneSchema = z
  .string()
  .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide')
  .optional();

export const urlSchema = z
  .string()
  .url('URL invalide')
  .optional()
  .or(z.literal(''));

export const requiredStringSchema = z
  .string()
  .min(1, 'Ce champ est requis')
  .trim();

export const optionalStringSchema = z
  .string()
  .trim()
  .optional();

// Authentification
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().optional()
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: requiredStringSchema.min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: requiredStringSchema.min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['company', 'candidate'], {
    required_error: 'Veuillez sélectionner un type de compte'
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions générales'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: requiredStringSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Profil utilisateur
export const userProfileSchema = z.object({
  firstName: requiredStringSchema.min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: requiredStringSchema.min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: emailSchema,
  phone: phoneSchema,
  avatar: optionalStringSchema
});

// Entreprise
export const addressSchema = z.object({
  street: requiredStringSchema,
  city: requiredStringSchema,
  zipCode: z.string().regex(/^[0-9]{5}$/, 'Code postal invalide'),
  country: requiredStringSchema
});

export const companySchema = z.object({
  name: requiredStringSchema.min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  description: optionalStringSchema,
  website: urlSchema,
  email: emailSchema.optional(),
  phone: phoneSchema,
  industry: requiredStringSchema,
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    required_error: 'Veuillez sélectionner la taille de l\'entreprise'
  }),
  foundedYear: z
    .number()
    .min(1800, 'Année de création invalide')
    .max(new Date().getFullYear(), 'L\'année ne peut pas être dans le futur')
    .optional(),
  address: addressSchema,
  values: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  accessibilityCommitment: optionalStringSchema,
  oethStatus: z.boolean(),
  oethRate: z.number().min(0).max(100)
});

// Offres d'emploi
export const jobSchema = z.object({
  title: requiredStringSchema.min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: requiredStringSchema.min(50, 'La description doit contenir au moins 50 caractères'),
  requirements: z.array(requiredStringSchema).min(1, 'Au moins un prérequis est requis'),
  benefits: z.array(z.string()).optional(),
  contractType: z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'], {
    required_error: 'Type de contrat requis'
  }),
  workMode: z.enum(['Présentiel', 'Télétravail', 'Hybride'], {
    required_error: 'Mode de travail requis'
  }),
  location: addressSchema,
  salaryMin: z.number().min(0, 'Salaire minimum invalide').optional(),
  salaryMax: z.number().min(0, 'Salaire maximum invalide').optional(),
  tags: z.array(z.string()).optional(),
  accessibilityFeatures: z.array(z.object({
    type: z.enum([
      'wheelchair_accessible',
      'hearing_impaired', 
      'visually_impaired',
      'cognitive_support',
      'flexible_schedule',
      'remote_work'
    ]),
    description: requiredStringSchema,
    available: z.boolean()
  })).optional(),
  expiresAt: z.string().datetime().optional()
}).refine(data => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: 'Le salaire maximum doit être supérieur au salaire minimum',
  path: ['salaryMax']
});

// Candidat
export const skillSchema = z.object({
  name: requiredStringSchema,
  level: z.number().min(0).max(100),
  category: z.enum(['technical', 'soft', 'language', 'tool']).optional(),
  verified: z.boolean().optional()
});

export const educationSchema = z.object({
  degree: requiredStringSchema,
  field: requiredStringSchema,
  institution: requiredStringSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional()
});

export const experienceSchema = z.object({
  title: requiredStringSchema,
  company: requiredStringSchema,
  location: requiredStringSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: optionalStringSchema
});

export const candidateProfileSchema = z.object({
  title: requiredStringSchema.min(5, 'Le titre doit contenir au moins 5 caractères'),
  summary: optionalStringSchema,
  location: z.object({
    city: requiredStringSchema
  }),
  experience: z.number().min(0, 'L\'expérience ne peut pas être négative'),
  skills: z.array(skillSchema).min(1, 'Au moins une compétence est requise'),
  education: z.array(educationSchema).optional(),
  languages: z.array(z.object({
    name: requiredStringSchema,
    level: z.enum(['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif'])
  })).optional(),
  certifications: z.array(z.object({
    name: requiredStringSchema,
    issuer: requiredStringSchema,
    date: z.string(),
    expiryDate: z.string().optional()
  })).optional(),
  accessibility: z.object({
    needsAccommodation: z.boolean(),
    accommodationTypes: z.array(z.string()).optional()
  }).optional(),
  availability: z.boolean()
});

// Recherche et filtres
export const jobSearchSchema = z.object({
  query: optionalStringSchema,
  location: optionalStringSchema,
  contractTypes: z.array(z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'])).optional(),
  workModes: z.array(z.enum(['Présentiel', 'Télétravail', 'Hybride'])).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  accessibilityRequired: z.boolean().optional(),
  handibienveillant: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

export const candidateSearchSchema = z.object({
  query: optionalStringSchema,
  location: optionalStringSchema,
  skills: z.array(z.string()).optional(),
  experienceMin: z.number().min(0).optional(),
  experienceMax: z.number().min(0).optional(),
  availability: z.boolean().optional(),
  accessibility: z.boolean().optional()
});

// Messages et contact
export const contactSchema = z.object({
  name: requiredStringSchema.min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: emailSchema,
  subject: requiredStringSchema.min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: requiredStringSchema.min(20, 'Le message doit contenir au moins 20 caractères')
});

export const messageSchema = z.object({
  recipientId: requiredStringSchema,
  subject: requiredStringSchema.min(3, 'Le sujet doit contenir au moins 3 caractères'),
  content: requiredStringSchema.min(10, 'Le message doit contenir au moins 10 caractères'),
  attachments: z.array(z.string()).optional()
});

// Analytics et rapports
export const analyticsFilterSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year', 'custom']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  companyId: optionalStringSchema
});

// Paramètres
export const settingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    browser: z.boolean(),
    sms: z.boolean(),
    newMatches: z.boolean(),
    messages: z.boolean(),
    applicationUpdates: z.boolean()
  }),
  privacy: z.object({
    profileVisible: z.boolean(),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    allowDirectContact: z.boolean()
  }),
  accessibility: z.object({
    fontSize: z.enum(['small', 'normal', 'large']),
    highContrast: z.boolean(),
    reducedMotion: z.boolean(),
    screenReader: z.boolean()
  })
});

// Types dérivés des schémas
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type CompanyForm = z.infer<typeof companySchema>;
export type JobForm = z.infer<typeof jobSchema>;
export type CandidateProfileForm = z.infer<typeof candidateProfileSchema>;
export type JobSearchForm = z.infer<typeof jobSearchSchema>;
export type CandidateSearchForm = z.infer<typeof candidateSearchSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type MessageForm = z.infer<typeof messageSchema>;
export type AnalyticsFilterForm = z.infer<typeof analyticsFilterSchema>;
export type SettingsForm = z.infer<typeof settingsSchema>;

// Validateurs utilitaires
export const validateFile = (file: File, maxSize = 5 * 1024 * 1024, allowedTypes: string[] = []) => {
  const errors: string[] = [];
  
  if (file.size > maxSize) {
    errors.push(`Le fichier ne peut pas dépasser ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateImageFile = (file: File) => {
  return validateFile(file, 2 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/webp']);
};

export const validateDocumentFile = (file: File) => {
  return validateFile(file, 10 * 1024 * 1024, [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]);
};

export type {
  LoginForm,
  RegisterForm,
  UserProfileForm,
  CompanyForm,
  JobForm,
  CandidateProfileForm,
  JobSearchForm,
  CandidateSearchForm,
  ContactForm,
  MessageForm,
  AnalyticsFilterForm,
  SettingsForm
};

