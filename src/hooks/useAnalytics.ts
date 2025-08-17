// src/hooks/useAnalytics.ts
import { useState, useEffect, useMemo } from 'react';
import { Analytics, AnalyticsPeriod, AnalyticsMetrics, DerivedMetrics } from '@/types';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

interface UseAnalyticsReturn {
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (period?: AnalyticsPeriod, companyId?: string) => Promise<void>;
  exportAnalytics: (format: 'pdf' | 'excel' | 'csv') => Promise<void>;
  getDerivedMetrics: () => DerivedMetrics | null;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
}

interface DerivedMetrics {
  efficiency: {
    applicationToHireRatio: number;
    timeToHireImprovement: number;
    costEfficiency: number;
  };
  diversity: {
    oethCompliance: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    diversityTrend: 'improving' | 'stable' | 'declining';
    inclusionGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  };
  performance: {
    overallScore: number;
    bestPerformingSource: string;
    recommendedActions: string[];
  };
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchParams, setLastFetchParams] = useState<{
    period?: AnalyticsPeriod;
    companyId?: string;
  }>({});

  const { company } = useAuth();
  const { toast } = useToast();

  // Calculs dérivés basés sur les analytics
  const getDerivedMetrics = useMemo((): DerivedMetrics | null => {
    if (!analytics) return null;

    const { recruitment, diversity, performance } = analytics.data;

    // Calculs d'efficacité
    const applicationToHireRatio = recruitment.totalApplications > 0 
      ? (recruitment.hireRate * 100) / recruitment.totalApplications 
      : 0;
    
    const timeToHireImprovement = recruitment.averageTimeToHire < 21 ? 
      ((21 - recruitment.averageTimeToHire) / 21) * 100 : 0;
    
    const costEfficiency = recruitment.costPerHire < 3000 ? 
      ((3000 - recruitment.costPerHire) / 3000) * 100 : 0;

    // Évaluation de la conformité OETH
    let oethCompliance: DerivedMetrics['diversity']['oethCompliance'];
    if (diversity.oethRate >= 6) oethCompliance = 'excellent';
    else if (diversity.oethRate >= 4) oethCompliance = 'good';
    else if (diversity.oethRate >= 2) oethCompliance = 'needs_improvement';
    else oethCompliance = 'poor';

    // Tendance diversité (simulée basée sur le score d'inclusion)
    const diversityTrend: DerivedMetrics['diversity']['diversityTrend'] = 
      diversity.inclusionScore >= 8 ? 'improving' : 
      diversity.inclusionScore >= 6 ? 'stable' : 'declining';

    // Grade d'inclusion
    const inclusionGrade: DerivedMetrics['diversity']['inclusionGrade'] = 
      diversity.inclusionScore >= 9 ? 'A+' :
      diversity.inclusionScore >= 8.5 ? 'A' :
      diversity.inclusionScore >= 8 ? 'B+' :
      diversity.inclusionScore >= 7 ? 'B' :
      diversity.inclusionScore >= 6 ? 'C+' :
      diversity.inclusionScore >= 5 ? 'C' : 'D';

    // Performance globale et recommandations
    const overallScore = Math.round(
      (recruitment.hireRate * 0.3) + 
      (diversity.inclusionScore * 0.4) + 
      ((100 - recruitment.averageTimeToHire) * 0.3)
    );

    const bestPerformingSource = recruitment.sourceBreakdown
      .sort((a, b) => b.conversionRate - a.conversionRate)[0]?.source || 'N/A';

    const recommendedActions: string[] = [];
    if (diversity.oethRate < 4) {
      recommendedActions.push('Intensifier le recrutement de personnes en situation de handicap');
    }
    if (recruitment.averageTimeToHire > 25) {
      recommendedActions.push('Optimiser le processus de recrutement pour réduire les délais');
    }
    if (recruitment.hireRate < 10) {
      recommendedActions.push('Améliorer la qualité du sourcing et l\'attractivité des offres');
    }
    if (diversity.inclusionScore < 7) {
      recommendedActions.push('Renforcer les initiatives d\'inclusion et de formation');
    }

    return {
      efficiency: {
        applicationToHireRatio: Math.round(applicationToHireRatio * 100) / 100,
        timeToHireImprovement: Math.round(timeToHireImprovement * 100) / 100,
        costEfficiency: Math.round(costEfficiency * 100) / 100
      },
      diversity: {
        oethCompliance,
        diversityTrend,
        inclusionGrade
      },
      performance: {
        overallScore,
        bestPerformingSource,
        recommendedActions
      }
    };
  }, [analytics]);

  const fetchAnalytics = async (
    period: AnalyticsPeriod = 'month', 
    companyId?: string
  ): Promise<void> => {
    const targetCompanyId = companyId || company?.id;
    
    if (!targetCompanyId) {
      setError('Aucune entreprise sélectionnée');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastFetchParams({ period, companyId: targetCompanyId });

    try {
      const data = await analyticsService.getAnalytics(period, targetCompanyId);
      setAnalytics(data);
      toast.success('Analytics mis à jour', 'Données chargées avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des analytics';
      setError(errorMessage);
      toast.error('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalytics = async (): Promise<void> => {
    if (lastFetchParams.period || lastFetchParams.companyId) {
      await fetchAnalytics(lastFetchParams.period, lastFetchParams.companyId);
    } else {
      await fetchAnalytics();
    }
  };

  const exportAnalytics = async (format: 'pdf' | 'excel' | 'csv'): Promise<void> => {
    if (!analytics) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    setIsLoading(true);
    try {
      await analyticsService.exportAnalytics(analytics, format);
      toast.success('Export réussi', `Fichier ${format.toUpperCase()} téléchargé`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      toast.error('Erreur d\'export', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // Chargement automatique au montage si une entreprise est connectée
  useEffect(() => {
    if (company?.id && !analytics) {
      fetchAnalytics();
    }
  }, [company?.id]);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    exportAnalytics,
    getDerivedMetrics: () => getDerivedMetrics,
    refreshAnalytics,
    clearError
  };
};

