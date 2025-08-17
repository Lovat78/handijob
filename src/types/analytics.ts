// src/types/analytics.ts
export interface Analytics {
  period: AnalyticsPeriod;
  companyId?: string;
  data: AnalyticsData;
  generatedAt: string;
}

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface AnalyticsData {
  recruitment: RecruitmentMetrics;
  diversity: DiversityMetrics;
  performance: PerformanceMetrics;
  roi: ROIMetrics;
}

export interface RecruitmentMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  averageTimeToHire: number;
  hireRate: number;
  sourceBreakdown: SourceMetric[];
  costPerHire: number;
}

export interface SourceMetric {
  source: string;
  applications: number;
  hires: number;
  conversionRate: number;
}

export interface DiversityMetrics {
  oethRate: number;
  diversityBreakdown: DiversityBreakdown;
  inclusionScore: number;
  biasMetrics: BiasMetric[];
}

export interface DiversityBreakdown {
  disability: number;
  gender: GenderBreakdown;
  age: AgeBreakdown;
  ethnicity: EthnicityBreakdown;
}

export interface GenderBreakdown {
  male: number;
  female: number;
  other: number;
  notSpecified: number;
}

export interface AgeBreakdown {
  under25: number;
  age25to35: number;
  age35to45: number;
  age45to55: number;
  over55: number;
}

export interface EthnicityBreakdown {
  [key: string]: number;
}

export interface BiasMetric {
  type: BiasType;
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export type BiasType = 'age' | 'gender' | 'disability' | 'ethnicity' | 'location';

export interface PerformanceMetrics {
  candidateEngagement: EngagementMetric[];
  recruitementEfficiency: EfficiencyMetric[];
  systemPerformance: SystemMetric[];
}

export interface EngagementMetric {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EfficiencyMetric {
  process: string;
  averageTime: number;
  improvement: number;
  bottlenecks: string[];
}

export interface SystemMetric {
  component: string;
  responseTime: number;
  uptime: number;
  errors: number;
}

export interface ROIMetrics {
  totalInvestment: number;
  savings: ROISaving[];
  totalSavings: number;
  roi: number;
  paybackPeriod: number;
  oethContributionReduction: number;
}

export interface ROISaving {
  category: ROISavingCategory;
  amount: number;
  description: string;
}

export type ROISavingCategory = 
  | 'oeth_reduction' 
  | 'time_saved' 
  | 'process_efficiency' 
  | 'retention_improvement'
  | 'reduced_bias_costs';