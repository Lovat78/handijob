// src/types/matching.ts
export interface MatchResult {
  candidateId: string;
  jobId: string;
  score: number;
  breakdown: MatchBreakdown;
  confidence: number;
  reasons: MatchReason[];
  recommendations: string[];
  createdAt: string;
}

export interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  locationMatch: number;
  accessibilityMatch: number;
  cultureMatch: number;
  salaryMatch: number;
}

export interface MatchReason {
  category: keyof MatchBreakdown;
  positive: boolean;
  description: string;
  weight: number;
}

export interface MatchPreferences {
  candidateId?: string;
  jobId?: string;
  filters: MatchFilters;
}

export interface MatchFilters {
  minScore?: number;
  location?: string;
  contractTypes?: ContractType[];
  accessibilityRequired?: AccessibilityType[];
  salaryRange?: [number, number];
}

export interface SoftSkillsAnalysis {
  candidateId: string;
  scores: SoftSkillScore[];
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  compatibility: CompanyCompatibility[];
  analysisDate: string;
}

export interface SoftSkillScore {
  skill: SoftSkillType;
  score: number;
  confidence: number;
  evidence: string[];
}

export type SoftSkillType = 
  | 'communication' 
  | 'teamwork' 
  | 'leadership' 
  | 'adaptability' 
  | 'problem_solving'
  | 'creativity'
  | 'resilience'
  | 'empathy';

export interface CompanyCompatibility {
  companyId: string;
  compatibilityScore: number;
  culturalFit: number;
  reasons: string[];
}