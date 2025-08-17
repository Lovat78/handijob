// src/types/candidate.ts
export interface Candidate {
  id: string;
  userId: string;
  profile: CandidateProfile;
  disabilities?: DisabilityInfo[];
  preferences: JobPreferences;
  cv?: CVData;
  portfolio?: PortfolioItem[];
  badges: Badge[];
  gamificationScore: number;
  isAvailable: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface CandidateProfile {
  title: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
}

export interface DisabilityInfo {
  type: DisabilityType;
  level: 'mild' | 'moderate' | 'severe';
  accommodationsNeeded: string[];
  officialRecognition: boolean; // RQTH
}

export type DisabilityType = 
  | 'mobility' 
  | 'visual' 
  | 'hearing' 
  | 'cognitive' 
  | 'psychosocial' 
  | 'multiple';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  verified: boolean;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'tool';

export interface Language {
  name: string;
  level: LanguageLevel;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiresAt?: string;
  verificationUrl?: string;
  blockchainVerified: boolean;
}

export interface JobPreferences {
  contractTypes: ContractType[];
  workModes: WorkMode[];
  locations: string[];
  salaryMin?: number;
  requiredAccessibility: AccessibilityType[];
  willingToRelocate: boolean;
}

export interface CVData {
  versions: CVVersion[];
  currentVersion: string;
}

export interface CVVersion {
  id: string;
  jobId?: string;
  customizedFor?: string;
  content: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  description?: string;
  tags: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  earnedAt: string;
  rarity: BadgeRarity;
}

export type BadgeCategory = 'skill' | 'activity' | 'achievement' | 'special';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
