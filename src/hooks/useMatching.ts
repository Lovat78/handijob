// src/hooks/useMatching.ts
import { useMatchingStore } from '@/stores/matchingStore';
import { useCandidateStore } from '@/stores/candidateStore';
import { useToast } from './useToast';

export const useMatching = () => {
  const {
    matches,
    currentMatch,
    softSkillsAnalysis,
    isLoading,
    error,
    calculateMatch,
    fetchMatches,
    analyzeSoftSkills,
    clearCurrentMatch,
    clearError
  } = useMatchingStore();

  const { candidates } = useCandidateStore();
  const { toast } = useToast();

  const handleCalculateMatch = async (candidateId: string, jobId: string) => {
    try {
      await calculateMatch(candidateId, jobId);
      toast.success('Matching calculé avec succès');
    } catch (error) {
      toast.error('Erreur lors du calcul du matching');
    }
  };

  const handleAnalyzeSoftSkills = async (candidateId: string) => {
    try {
      await analyzeSoftSkills(candidateId);
      toast.success('Analyse des soft skills terminée');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse des soft skills');
    }
  };

  // Calculer les statistiques de matching
  const getMatchingStats = () => {
    if (matches.length === 0) return null;

    const scores = matches.map(m => m.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highMatches = matches.filter(m => m.score >= 80).length;
    const mediumMatches = matches.filter(m => m.score >= 60 && m.score < 80).length;
    const lowMatches = matches.filter(m => m.score < 60).length;

    return {
      total: matches.length,
      avgScore: Math.round(avgScore),
      highMatches,
      mediumMatches,
      lowMatches
    };
  };

  return {
    matches,
    currentMatch,
    softSkillsAnalysis,
    isLoading,
    error,
    candidates,
    calculateMatch: handleCalculateMatch,
    fetchMatches,
    analyzeSoftSkills: handleAnalyzeSoftSkills,
    clearCurrentMatch,
    clearError,
    getMatchingStats
  };
};
