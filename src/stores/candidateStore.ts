// src/stores/candidateStore.ts
import { create } from 'zustand';
import { Candidate, MatchResult } from '@/types';
import { mockCandidates, mockMatchResults, simulateApiCall } from '@/services/mockData';

interface CandidateState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  matchResults: MatchResult[];
  isLoading: boolean;
  error: string | null;
  searchFilters: CandidateFilters;
}

interface CandidateFilters {
  search: string;
  skills: string[];
  location: string;
  availability: boolean;
  disabilityTypes: string[];
  experienceLevel: string;
}

interface CandidateActions {
  fetchCandidates: () => Promise<void>;
  fetchCandidateById: (id: string) => Promise<void>;
  searchCandidates: (query: string) => Promise<void>;
  fetchMatchResults: (jobId: string) => Promise<void>;
  setSearchFilters: (filters: Partial<CandidateFilters>) => void;
  clearError: () => void;
}

export const useCandidateStore = create<CandidateState & CandidateActions>((set, get) => ({
  // État initial
  candidates: [],
  currentCandidate: null,
  matchResults: [],
  isLoading: false,
  error: null,
  searchFilters: {
    search: '',
    skills: [],
    location: '',
    availability: true,
    disabilityTypes: [],
    experienceLevel: ''
  },

  // Actions
  fetchCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const candidates = await simulateApiCall(mockCandidates);
      set({ candidates, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  fetchCandidateById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const candidate = mockCandidates.find(c => c.id === id);
      set({ currentCandidate: candidate || null, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  searchCandidates: async (query) => {
    set({ isLoading: true, error: null });
    try {
      // Simulation recherche avec filtrage
      const filteredCandidates = mockCandidates.filter(candidate =>
        candidate.profile.title.toLowerCase().includes(query.toLowerCase()) ||
        candidate.profile.skills.some(skill => 
          skill.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      set({ candidates: filteredCandidates, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la recherche',
        isLoading: false
      });
    }
  },

  fetchMatchResults: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const results = mockMatchResults.filter(match => match.jobId === jobId);
      set({ matchResults: results, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  setSearchFilters: (newFilters) => {
    set(state => ({
      searchFilters: { ...state.searchFilters, ...newFilters }
    }));
  },

  clearError: () => set({ error: null })
}));