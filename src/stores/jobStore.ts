// src/stores/jobStore.ts
import { create } from 'zustand';
import { Job } from '@/types';
import { jobService } from '@/services/jobService';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
}

interface JobFilters {
  search: string;
  contractType: string;
  workMode: string;
  location: string;
  accessibilityRequired: boolean;
}

interface JobActions {
  fetchJobs: (companyId?: string) => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  clearCurrentJob: () => void;
  clearError: () => void;
}

export const useJobStore = create<JobState & JobActions>((set, get) => ({
  // État initial
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    contractType: '',
    workMode: '',
    location: '',
    accessibilityRequired: false
  },

  // Actions
  fetchJobs: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await jobService.getJobs(companyId);
      set({ jobs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  fetchJobById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobService.getJobById(id);
      set({ currentJob: job, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      const newJob = await jobService.createJob(jobData);
      set(state => ({
        jobs: [...state.jobs, newJob],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la création',
        isLoading: false
      });
      throw error;
    }
  },

  updateJob: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await jobService.updateJob(id, updates);
      set(state => ({
        jobs: state.jobs.map(job => job.id === id ? updatedJob : job),
        currentJob: state.currentJob?.id === id ? updatedJob : state.currentJob,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        isLoading: false
      });
      throw error;
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await jobService.deleteJob(id);
      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id),
        currentJob: state.currentJob?.id === id ? null : state.currentJob,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        isLoading: false
      });
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  clearCurrentJob: () => set({ currentJob: null }),
  clearError: () => set({ error: null })
}));
