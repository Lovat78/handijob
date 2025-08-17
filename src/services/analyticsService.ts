// src/services/analyticsService.ts
import { 
  Analytics, 
  AnalyticsPeriod, 
  AnalyticsData,
  RecruitmentMetrics,
  DiversityMetrics,
  PerformanceMetrics,
  ROIMetrics 
} from '@/types';
import { simulateApiCall, simulateApiError } from './mockData';

// Données mockées enrichies pour différentes périodes
const generateMockAnalytics = (period: AnalyticsPeriod, companyId: string): Analytics => {
  // Facteurs de variation selon la période
  const periodMultipliers = {
    week: { jobs: 0.25, applications: 0.2, time: 1.2 },
    month: { jobs: 1, applications: 1, time: 1 },
    quarter: { jobs: 3.2, applications: 3.5, time: 0.9 },
    year: { jobs: 12.8, applications: 15, time: 0.8 },
    custom: { jobs: 1, applications: 1, time: 1 }
  };

  const multiplier = periodMultipliers[period];
  const baseDate = new Date();

  // Génération des métriques de recrutement
  const recruitment: RecruitmentMetrics = {
    totalJobs: Math.round(12 * multiplier.jobs),
    activeJobs: Math.round(8 * multiplier.jobs),
    totalApplications: Math.round(156 * multiplier.applications),
    averageTimeToHire: Math.round(18 / multiplier.time),
    hireRate: 12.8 + (Math.random() - 0.5) * 2,
    sourceBreakdown: [
      { 
        source: 'Handi.jobs', 
        applications: Math.round(89 * multiplier.applications), 
        hires: Math.round(12 * multiplier.applications), 
        conversionRate: 13.5 + (Math.random() - 0.5) * 2 
      },
      { 
        source: 'LinkedIn', 
        applications: Math.round(34 * multiplier.applications), 
        hires: Math.round(3 * multiplier.applications), 
        conversionRate: 8.8 + (Math.random() - 0.5) * 2 
      },
      { 
        source: 'Indeed', 
        applications: Math.round(23 * multiplier.applications), 
        hires: Math.round(2 * multiplier.applications), 
        conversionRate: 8.7 + (Math.random() - 0.5) * 1.5 
      },
      { 
        source: 'Cooptation', 
        applications: Math.round(10 * multiplier.applications), 
        hires: Math.round(3 * multiplier.applications), 
        conversionRate: 30.0 + (Math.random() - 0.5) * 5 
      }
    ],
    costPerHire: 2400 + Math.round((Math.random() - 0.5) * 600)
  };

  // Génération des métriques de diversité
  const diversity: DiversityMetrics = {
    oethRate: 4.2 + (Math.random() - 0.5) * 1.5,
    diversityBreakdown: {
      disability: 4.2 + (Math.random() - 0.5) * 1.5,
      gender: {
        male: 52 + Math.round((Math.random() - 0.5) * 10),
        female: 46 + Math.round((Math.random() - 0.5) * 10),
        other: 1 + Math.round(Math.random()),
        notSpecified: 1 + Math.round(Math.random())
      },
      age: {
        under25: 15 + Math.round((Math.random() - 0.5) * 6),
        age25to35: 35 + Math.round((Math.random() - 0.5) * 8),
        age35to45: 30 + Math.round((Math.random() - 0.5) * 6),
        age45to55: 15 + Math.round((Math.random() - 0.5) * 4),
        over55: 5 + Math.round((Math.random() - 0.5) * 3)
      },
      ethnicity: {
        'Non spécifié': 60 + Math.round((Math.random() - 0.5) * 10),
        'Diversité': 40 + Math.round((Math.random() - 0.5) * 10)
      }
    },
    inclusionScore: 8.4 + (Math.random() - 0.5) * 1.2,
    biasMetrics: [
      {
        type: 'age',
        detected: Math.random() > 0.8,
        severity: 'low' as const,
        recommendations: ['Continuer les bonnes pratiques de recrutement']
      },
      {
        type: 'gender',
        detected: Math.random() > 0.9,
        severity: 'low' as const,
        recommendations: ['Surveiller l\'équilibre des candidatures']
      },
      {
        type: 'disability',
        detected: false,
        severity: 'low' as const,
        recommendations: ['Excellente approche inclusive']
      }
    ]
  };

  // Génération des métriques de performance
  const performance: PerformanceMetrics = {
    candidateEngagement: [
      { 
        metric: 'Temps moyen sur profil', 
        value: 3.2 + (Math.random() - 0.5) * 0.8, 
        change: Math.round((Math.random() - 0.3) * 30), 
        trend: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down'
      },
      { 
        metric: 'Taux de complétion profil', 
        value: 87 + Math.round((Math.random() - 0.5) * 10), 
        change: Math.round((Math.random() - 0.2) * 15), 
        trend: Math.random() > 0.4 ? 'up' : 'stable'
      },
      { 
        metric: 'Taux de réponse aux messages', 
        value: 72 + Math.round((Math.random() - 0.5) * 15), 
        change: Math.round((Math.random() - 0.5) * 20), 
        trend: Math.random() > 0.4 ? 'up' : Math.random() > 0.6 ? 'stable' : 'down'
      }
    ],
    recruitementEfficiency: [
      {
        process: 'Tri des candidatures',
        averageTime: 2.1 - Math.random() * 0.8,
        improvement: 40 + Math.round((Math.random() - 0.5) * 20),
        bottlenecks: Math.random() > 0.7 ? ['Volume élevé de candidatures'] : []
      },
      {
        process: 'Entretiens initiaux',
        averageTime: 4.5 + (Math.random() - 0.5) * 1.2,
        improvement: 25 + Math.round((Math.random() - 0.5) * 15),
        bottlenecks: Math.random() > 0.8 ? ['Disponibilité des managers'] : []
      }
    ],
    systemPerformance: [
      { 
        component: 'API Matching', 
        responseTime: 850 + Math.round((Math.random() - 0.5) * 200), 
        uptime: 99.9 - Math.random() * 0.2, 
        errors: Math.round(Math.random() * 5) 
      },
      { 
        component: 'Base de données', 
        responseTime: 120 + Math.round((Math.random() - 0.5) * 40), 
        uptime: 99.95 - Math.random() * 0.1, 
        errors: Math.round(Math.random() * 2) 
      }
    ]
  };

  // Génération des métriques ROI
  const roi: ROIMetrics = {
    totalInvestment: 36000 + Math.round((Math.random() - 0.5) * 10000),
    savings: [
      {
        category: 'oeth_reduction',
        amount: 24000 + Math.round((Math.random() - 0.5) * 8000),
        description: 'Réduction contribution OETH grâce aux embauches'
      },
      {
        category: 'time_saved',
        amount: 15000 + Math.round((Math.random() - 0.5) * 5000),
        description: 'Temps RH économisé par l\'automatisation'
      },
      {
        category: 'process_efficiency',
        amount: 8000 + Math.round((Math.random() - 0.5) * 3000),
        description: 'Optimisation des processus de recrutement'
      },
      {
        category: 'retention_improvement',
        amount: 12000 + Math.round((Math.random() - 0.5) * 4000),
        description: 'Réduction du turnover grâce au meilleur matching'
      }
    ],
    totalSavings: 0, // Calculé ci-dessous
    roi: 0, // Calculé ci-dessous
    paybackPeriod: 11 + Math.round((Math.random() - 0.5) * 4),
    oethContributionReduction: 24000 + Math.round((Math.random() - 0.5) * 8000)
  };

  // Calculs finaux ROI
  roi.totalSavings = roi.savings.reduce((sum, saving) => sum + saving.amount, 0);
  roi.roi = ((roi.totalSavings - roi.totalInvestment) / roi.totalInvestment) * 100;

  const data: AnalyticsData = {
    recruitment,
    diversity,
    performance,
    roi
  };

  return {
    period,
    companyId,
    data,
    generatedAt: baseDate.toISOString()
  };
};

class AnalyticsService {
  private analyticsCache = new Map<string, { data: Analytics; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getAnalytics(period: AnalyticsPeriod = 'month', companyId: string): Promise<Analytics> {
    if (!companyId) {
      throw new Error('ID entreprise requis');
    }

    const cacheKey = `${companyId}-${period}`;
    const cached = this.analyticsCache.get(cacheKey);
    
    // Vérifier le cache
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return simulateApiCall(cached.data, 200);
    }

    // Générer nouvelles données
    const analytics = generateMockAnalytics(period, companyId);
    
    // Mettre en cache
    this.analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now()
    });

    return simulateApiCall(analytics, 800);
  }

  async getKPISummary(companyId: string): Promise<{
    oethRate: number;
    averageTimeToHire: number;
    hireRate: number;
    inclusionScore: number;
    roi: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    const analytics = await this.getAnalytics('month', companyId);
    
    return simulateApiCall({
      oethRate: analytics.data.diversity.oethRate,
      averageTimeToHire: analytics.data.recruitment.averageTimeToHire,
      hireRate: analytics.data.recruitment.hireRate,
      inclusionScore: analytics.data.diversity.inclusionScore,
      roi: analytics.data.roi.roi,
      trend: Math.random() > 0.3 ? 'up' : Math.random() > 0.6 ? 'stable' : 'down'
    }, 300);
  }

  async getOETHCompliance(companyId: string): Promise<{
    currentRate: number;
    target: number;
    status: 'compliant' | 'warning' | 'non_compliant';
    projectedRate: number;
    recommendations: string[];
    nextReviewDate: string;
  }> {
    const analytics = await this.getAnalytics('month', companyId);
    const currentRate = analytics.data.diversity.oethRate;
    
    let status: 'compliant' | 'warning' | 'non_compliant';
    if (currentRate >= 6) status = 'compliant';
    else if (currentRate >= 4) status = 'warning';
    else status = 'non_compliant';

    const recommendations: string[] = [];
    if (currentRate < 6) {
      recommendations.push('Intensifier le recrutement de personnes en situation de handicap');
    }
    if (currentRate < 4) {
      recommendations.push('Mettre en place un plan d\'action d\'urgence');
      recommendations.push('Considérer les prestations de sous-traitance');
    }
    if (currentRate >= 4) {
      recommendations.push('Maintenir les efforts de recrutement inclusif');
    }

    return simulateApiCall({
      currentRate,
      target: 6,
      status,
      projectedRate: currentRate + (Math.random() - 0.3) * 1.5,
      recommendations,
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    }, 400);
  }

  async exportAnalytics(analytics: Analytics, format: 'pdf' | 'excel' | 'csv'): Promise<void> {
    // Simulation de l'export
    await simulateApiCall(null, 1500);

    // Génération du nom de fichier
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `analytics-${analytics.period}-${timestamp}.${format}`;

    // Simulation du téléchargement
    const mockData = this.generateExportData(analytics, format);
    this.downloadFile(mockData, filename, format);
  }

  private generateExportData(analytics: Analytics, format: 'pdf' | 'excel' | 'csv'): string {
    const { data } = analytics;
    
    switch (format) {
      case 'csv':
        return [
          'Métrique,Valeur,Période',
          `Offres totales,${data.recruitment.totalJobs},${analytics.period}`,
          `Offres actives,${data.recruitment.activeJobs},${analytics.period}`,
          `Candidatures totales,${data.recruitment.totalApplications},${analytics.period}`,
          `Taux d'embauche,${data.recruitment.hireRate}%,${analytics.period}`,
          `Temps moyen d'embauche,${data.recruitment.averageTimeToHire} jours,${analytics.period}`,
          `Taux OETH,${data.diversity.oethRate}%,${analytics.period}`,
          `Score d'inclusion,${data.diversity.inclusionScore}/10,${analytics.period}`,
          `ROI,${data.roi.roi}%,${analytics.period}`
        ].join('\n');
      
      case 'excel':
        return 'Excel format - données structurées pour import';
      
      case 'pdf':
        return 'PDF format - rapport complet avec graphiques';
      
      default:
        return '';
    }
  }

  private downloadFile(data: string, filename: string, format: string): void {
    const mimeTypes = {
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf'
    };

    const blob = new Blob([data], { type: mimeTypes[format as keyof typeof mimeTypes] });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async compareWithBenchmarks(companyId: string): Promise<{
    industry: string;
    benchmarks: {
      oethRate: { company: number; industry: number; percentile: number };
      timeToHire: { company: number; industry: number; percentile: number };
      hireRate: { company: number; industry: number; percentile: number };
      inclusionScore: { company: number; industry: number; percentile: number };
    };
    ranking: {
      overall: number;
      totalCompanies: number;
      category: 'leader' | 'above_average' | 'average' | 'below_average';
    };
  }> {
    const analytics = await this.getAnalytics('month', companyId);
    
    // Benchmarks simulés pour l'industrie tech
    const industryBenchmarks = {
      oethRate: 3.8,
      timeToHire: 22,
      hireRate: 8.5,
      inclusionScore: 7.2
    };

    const company = analytics.data;
    
    return simulateApiCall({
      industry: 'Informatique et Technologies',
      benchmarks: {
        oethRate: {
          company: company.diversity.oethRate,
          industry: industryBenchmarks.oethRate,
          percentile: Math.min(95, Math.max(5, 50 + (company.diversity.oethRate - industryBenchmarks.oethRate) * 10))
        },
        timeToHire: {
          company: company.recruitment.averageTimeToHire,
          industry: industryBenchmarks.timeToHire,
          percentile: Math.min(95, Math.max(5, 50 + (industryBenchmarks.timeToHire - company.recruitment.averageTimeToHire) * 2))
        },
        hireRate: {
          company: company.recruitment.hireRate,
          industry: industryBenchmarks.hireRate,
          percentile: Math.min(95, Math.max(5, 50 + (company.recruitment.hireRate - industryBenchmarks.hireRate) * 5))
        },
        inclusionScore: {
          company: company.diversity.inclusionScore,
          industry: industryBenchmarks.inclusionScore,
          percentile: Math.min(95, Math.max(5, 50 + (company.diversity.inclusionScore - industryBenchmarks.inclusionScore) * 8))
        }
      },
      ranking: {
        overall: Math.floor(Math.random() * 50) + 1,
        totalCompanies: 247,
        category: company.diversity.oethRate > 5 ? 'leader' : 
                 company.diversity.oethRate > 4 ? 'above_average' : 
                 company.diversity.oethRate > 2 ? 'average' : 'below_average'
      }
    }, 600);
  }

  clearCache(): void {
    this.analyticsCache.clear();
  }
}

export const analyticsService = new AnalyticsService();