// src/services/dataService.ts - Interface pour future intégration Supabase
import { Job, Candidate, User, Company } from '@/types';

/**
 * Interface abstraite pour la couche de données
 * Permet la transition mock → Supabase sans changer les composants
 */
export interface IDataService {
  // === JOBS ===
  getJobs(filters?: JobFilters): Promise<Job[]>;
  getJobById(id: string): Promise<Job | null>;
  createJob(jobData: Partial<Job>): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job>;
  deleteJob(id: string): Promise<void>;
  searchJobs(query: string, filters?: JobFilters): Promise<Job[]>;

  // === CANDIDATES ===
  getCandidates(filters?: CandidateFilters): Promise<Candidate[]>;
  getCandidateById(id: string): Promise<Candidate | null>;
  createCandidate(data: Partial<Candidate>): Promise<Candidate>;
  updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate>;
  
  // === MATCHING ===
  getMatchingJobs(candidateId: string): Promise<JobMatch[]>;
  getMatchingCandidates(jobId: string): Promise<CandidateMatch[]>;
  
  // === AUTH (Supabase Auth) ===
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(userData: SignUpData): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  
  // === REAL-TIME (Supabase Subscriptions) ===
  subscribeToJobs(callback: (jobs: Job[]) => void): () => void;
  subscribeToMatches(userId: string, callback: (matches: Match[]) => void): () => void;
  
  // === STORAGE (Supabase Storage) ===
  uploadCV(file: File, candidateId: string): Promise<string>;
  uploadCompanyLogo(file: File, companyId: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

// Types pour filtres
export interface JobFilters {
  search?: string;
  contractType?: string;
  workMode?: string;
  location?: string;
  accessibilityRequired?: boolean;
  handibienveillant?: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

export interface CandidateFilters {
  skills?: string[];
  experience?: string;
  location?: string;
  availability?: string;
  hasRQTH?: boolean;
}

// Types pour matching IA
export interface JobMatch {
  job: Job;
  score: number;
  reasons: string[];
  accessibility: {
    compatible: boolean;
    adaptations: string[];
  };
}

export interface CandidateMatch {
  candidate: Candidate;
  score: number;
  strengths: string[];
  concerns: string[];
  accessibilityFit: number;
}

// Types Auth
export interface AuthResult {
  user: User | null;
  session: any | null; // Supabase session
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'company';
  companyData?: Partial<Company>;
}

/**
 * Implémentation Mock (actuelle)
 * Sera remplacée par SupabaseDataService
 */
export class MockDataService implements IDataService {
  // Current mock implementation
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    // TODO: Implement with mock data
    throw new Error('Not implemented');
  }
  
  // ... autres méthodes mock
  
  // Méthodes Supabase à implémenter
  async signIn(email: string, password: string): Promise<AuthResult> {
    // TODO: supabase.auth.signInWithPassword()
    throw new Error('Supabase not connected');
  }
  
  subscribeToJobs(callback: (jobs: Job[]) => void): () => void {
    // TODO: supabase.from('jobs').on('*', callback)
    return () => {};
  }
  
  async uploadCV(file: File, candidateId: string): Promise<string> {
    // TODO: supabase.storage.from('cvs').upload()
    throw new Error('Storage not connected');
  }
}

/**
 * Future: SupabaseDataService
 * 
 * export class SupabaseDataService implements IDataService {
 *   constructor(private supabase: SupabaseClient) {}
 *   
 *   async getJobs(filters?: JobFilters): Promise<Job[]> {
 *     const query = this.supabase.from('jobs').select('*');
 *     
 *     if (filters?.handibienveillant) {
 *       query.eq('handibienveillant', true);
 *     }
 *     
 *     if (filters?.accessibilityRequired) {
 *       query.not('accessibility_features', 'is', null);
 *     }
 *     
 *     const { data, error } = await query;
 *     if (error) throw error;
 *     return data;
 *   }
 *   
 *   subscribeToJobs(callback: (jobs: Job[]) => void): () => void {
 *     const subscription = this.supabase
 *       .from('jobs')
 *       .on('*', (payload) => {
 *         // Refresh jobs and call callback
 *       })
 *       .subscribe();
 *       
 *     return () => subscription.unsubscribe();
 *   }
 * }
 */

// Export default service (actuellement Mock, future Supabase)
export const dataService = new MockDataService();
