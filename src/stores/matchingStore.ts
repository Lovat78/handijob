// src/stores/matchingStore.ts
import { create } from 'zustand';
import { MatchResult, SoftSkillsAnalysis } from '@/types';
import { mockMatchResults, simulateApiCall } from '@/services/mockData';

interface MatchingState {
  matches: MatchResult[];
  currentMatch: MatchResult | null;
  softSkillsAnalysis: SoftSkillsAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

interface MatchingActions {
  calculateMatch: (candidateId: string, jobId: string) => Promise<void>;
  fetchMatches: (params: { candidateId?: string; jobId?: string }) => Promise<void>;
  analyzeSoftSkills: (candidateId: string) => Promise<void>;
  clearCurrentMatch: () => void;
  clearError: () => void;
}

export const useMatchingStore = create<MatchingState & MatchingActions>((set, get) => ({
  // État initial
  matches: [],
  currentMatch: null,
  softSkillsAnalysis: null,
  isLoading: false,
  error: null,

  // Actions
  calculateMatch: async (candidateId, jobId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulation calcul IA
      const matchResult: MatchResult = {
        candidateId,
        jobId,
        score: Math.floor(Math.random() * 40) + 60, // Score entre 60-100
        breakdown: {
          skillsMatch: Math.floor(Math.random() * 30) + 70,
          experienceMatch: Math.floor(Math.random() * 30) + 70,
          locationMatch: Math.floor(Math.random() * 40) + 60,
          accessibilityMatch: Math.floor(Math.random() * 20) + 80,
          cultureMatch: Math.floor(Math.random() * 30) + 70,
          salaryMatch: Math.floor(Math.random() * 40) + 60
        },
        confidence: Math.floor(Math.random() * 20) + 80,
        reasons: [
          {
            category: 'skillsMatch',
            positive: true,
            description: 'Compétences techniques alignées avec le poste',
            weight: 25
          }
        ],
        recommendations: [
          'Mettre en avant les compétences techniques',
          'Préparer des exemples concrets de réalisations'
        ],
        createdAt: new Date().toISOString()
      };

      const result = await simulateApiCall(matchResult);
      set({ currentMatch: result, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du calcul',
        isLoading: false
      });
    }
  },

  fetchMatches: async (params) => {
    set({ isLoading: true, error: null });
    try {
      let matches = mockMatchResults;
      if (params.candidateId) {
        matches = matches.filter(m => m.candidateId === params.candidateId);
      }
      if (params.jobId) {
        matches = matches.filter(m => m.jobId === params.jobId);
      }
      const result = await simulateApiCall(matches);
      set({ matches: result, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        isLoading: false
      });
    }
  },

  analyzeSoftSkills: async (candidateId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulation analyse soft skills
      const analysis: SoftSkillsAnalysis = {
        candidateId,
        scores: [
          { skill: 'communication', score: 85, confidence: 90, evidence: ['Formations en communication', 'Retours positifs équipe'] },
          { skill: 'teamwork', score: 78, confidence: 85, evidence: ['Travail en équipe agile', 'Leadership de projet'] },
          { skill: 'adaptability', score: 92, confidence: 88, evidence: ['Changement de technologie', 'Formation continue'] }
        ],
        overallScore: 85,
        strengths: ['Communication excellente', 'Adaptabilité remarquable'],
        areasForImprovement: ['Leadership à développer'],
        compatibility: [],
        analysisDate: new Date().toISOString()
      };
      
      const result = await simulateApiCall(analysis);
      set({ softSkillsAnalysis: result, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse',
        isLoading: false
      });
    }
  },

  clearCurrentMatch: () => set({ currentMatch: null }),
  clearError: () => set({ error: null })
}));