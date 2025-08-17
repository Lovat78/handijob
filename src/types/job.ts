// src/types/job.ts
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contractType: ContractType;
  workMode: WorkMode;
  location: Address;
  salaryMin?: number;
  salaryMax?: number;
  accessibilityFeatures: AccessibilityFeature[];
  tags: string[];
  status: JobStatus;
  aiOptimized: boolean;
  handibienveillant: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Alternance';
export type WorkMode = 'Présentiel' | 'Télétravail' | 'Hybride';
export type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'expired';

export interface AccessibilityFeature {
  type: AccessibilityType;
  description: string;
  available: boolean;
}

export type AccessibilityType = 
  | 'mobility_access' 
  | 'visual_aids' 
  | 'hearing_aids' 
  | 'cognitive_support' 
  | 'flexible_hours'
  | 'remote_work';
