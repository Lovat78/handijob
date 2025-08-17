// src/pages/analytics/AnalyticsComplete.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Target, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Shield
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface AnalyticsData {
  recruitment: {
    totalApplications: number;
    activeJobs: number;
    hireRate: number;
    averageTimeToHire: number;
    costPerHire: number;
    qualityOfHire: number;
    monthlyTrend: Array<{ month: string; applications: number; hires: number }>;
  };
  diversity: {
    oethRate: number;
    oethTarget: number;
    diversityBreakdown: {
      gender: { male: number; female: number; other: number };
      age: { under30: number; between30and50: number; over50: number };
      disability: number;
    };
    inclusionScore: number;
    handibienveillantJobs: number;
  };
  performance: {
    candidateNps: number;
    employerBrand: number;
    retentionRate: number;
    satisfactionScore: number;
    timeToProductivity: number;
  };
  roi: {
    totalInvestment: number;
    totalSavings: number;
    roi: number;
    oethPenaltyAvoided: number;
  };
}

const AnalyticsComplete: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  // Simulation de données analytics
  useEffect(() => {
    loadAnalytics();
    
    if (autoRefresh) {
      const interval = setInterval(loadAnalytics, 30000); // Refresh toutes les 30s
      return () => clearInterval(interval);
    }
  }, [selectedPeriod, autoRefresh]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    
    // Simulation API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: AnalyticsData = {
      recruitment: {
        totalApplications: 1247,
        activeJobs: 23,
        hireRate: 12.3,
        averageTimeToHire: 28,
        costPerHire: 3400,
        qualityOfHire: 87,
        monthlyTrend: [
          { month: 'Jan', applications: 98, hires: 12 },
          { month: 'Fév', applications: 134, hires: 18 },
          { month: 'Mar', applications: 156, hires: 22 },
          { month: 'Avr', applications: 178, hires: 19 },
          { month: 'Mai', applications: 203, hires: 26 },
          { month: 'Jun', applications: 189, hires: 21 }
        ]
      },
      diversity: {
        oethRate: 5.8,
        oethTarget: 6.0,
        diversityBreakdown: {
          gender: { male: 58, female: 39, other: 3 },
          age: { under30: 32, between30and50: 51, over50: 17 },
          disability: 5.8
        },
        inclusionScore: 82,
        handibienveillantJobs: 89
      },
      performance: {
        candidateNps: 76,
        employerBrand: 8.4,
        retentionRate: 92,
        satisfactionScore: 4.3,
        timeToProductivity: 45
      },
      roi: {
        totalInvestment: 125000,
        totalSavings: 187000,
        roi: 49.6,
        oethPenaltyAvoided: 45000
      }
    };

    setAnalytics(mockData);
    setIsLoading(false);
  };

  const exportAnalytics = () => {
    if (!analytics) return;
    
    const data = {
      ...analytics,
      exportDate: new Date().toISOString(),
      period: selectedPeriod,
      company: user?.email?.split('@')[1]
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-handi-jobs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Export terminé', 'Les données analytics ont été téléchargées.');
  };

  const KPICard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    icon: React.ReactNode;
    color?: string;
    subtitle?: string;
  }> = ({ title, value, change, trend, icon, color = 'primary', subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card padding="md" hoverable>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-success-600 mr-1" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-error-600 mr-1" />}
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-success-600' : 
                  trend === 'down' ? 'text-error-600' : 'text-gray-500'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs mois dernier</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
            <div className={`text-${color}-600 dark:text-${color}-400`}>
              {icon}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Reporting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tableau de bord OETH et métriques de diversité
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="1month">1 mois</option>
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="1year">1 an</option>
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'text-primary-600' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </Button>
          
          <Button variant="secondary" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Alerte OETH */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card padding="md" className={`border-l-4 ${
          analytics.diversity.oethRate >= analytics.diversity.oethTarget 
            ? 'border-l-success-500 bg-success-50 dark:bg-success-900/20' 
            : 'border-l-warning-500 bg-warning-50 dark:bg-warning-900/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {analytics.diversity.oethRate >= analytics.diversity.oethTarget ? (
                <CheckCircle className="w-6 h-6 text-success-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Conformité OETH
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Taux actuel : {analytics.diversity.oethRate}% / Objectif : {analytics.diversity.oethTarget}%
                  {analytics.diversity.oethRate >= analytics.diversity.oethTarget 
                    ? ' ✅ Objectif atteint' 
                    : ` (${(analytics.diversity.oethTarget - analytics.diversity.oethRate).toFixed(1)}% manquant)`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.roi.oethPenaltyAvoided.toLocaleString('fr-FR')}€
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pénalités évitées
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Candidatures totales"
          value={analytics.recruitment.totalApplications}
          change={18.2}
          trend="up"
          icon={<Users className="w-6 h-6" />}
          subtitle="Ce mois"
        />
        <KPICard
          title="Offres actives"
          value={analytics.recruitment.activeJobs}
          change={-5.1}
          trend="down"
          icon={<Briefcase className="w-6 h-6" />}
          color="warning"
        />
        <KPICard
          title="Taux d'embauche"
          value={`${analytics.recruitment.hireRate}%`}
          change={2.4}
          trend="up"
          icon={<Target className="w-6 h-6" />}
          color="success"
        />
        <KPICard
          title="Temps moyen d'embauche"
          value={`${analytics.recruitment.averageTimeToHire}j`}
          change={-12.8}
          trend="up"
          icon={<Clock className="w-6 h-6" />}
          color="info"
          subtitle="Objectif : <30j"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendance des candidatures */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Évolution des candidatures
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.recruitment.monthlyTrend}>
                <defs>
                  <linearGradient id="candidatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#candidatureGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Diversité par âge */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par âge
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Moins de 30 ans', value: analytics.diversity.diversityBreakdown.age.under30, color: '#3b82f6' },
                    { name: '30-50 ans', value: analytics.diversity.diversityBreakdown.age.between30and50, color: '#10b981' },
                    { name: 'Plus de 50 ans', value: analytics.diversity.diversityBreakdown.age.over50, color: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[
                    { name: 'Moins de 30 ans', value: analytics.diversity.diversityBreakdown.age.under30, color: '#3b82f6' },
                    { name: '30-50 ans', value: analytics.diversity.diversityBreakdown.age.between30and50, color: '#10b981' },
                    { name: 'Plus de 50 ans', value: analytics.diversity.diversityBreakdown.age.over50, color: '#f59e0b' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance financière */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Euro className="w-5 h-5 mr-2" />
            Performance financière
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Coût par embauche</span>
              <span className="font-semibold">{analytics.recruitment.costPerHire.toLocaleString('fr-FR')}€</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">ROI global</span>
              <span className="font-semibold text-success-600">+{analytics.roi.roi}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Économies totales</span>
              <span className="font-semibold">{analytics.roi.totalSavings.toLocaleString('fr-FR')}€</span>
            </div>
            <div className="pt-3 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {analytics.roi.oethPenaltyAvoided.toLocaleString('fr-FR')}€
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pénalités OETH évitées
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Score d'inclusion */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Inclusion & Diversité
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Score d'inclusion</span>
                <span className="font-semibold">{analytics.diversity.inclusionScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${analytics.diversity.inclusionScore}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Offres handibienveillantes</span>
              <span className="font-semibold">{analytics.diversity.handibienveillantJobs}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Candidats RQTH</span>
              <span className="font-semibold">{analytics.diversity.diversityBreakdown.disability}%</span>
            </div>

            <div className="pt-3 border-t">
              <Badge 
                variant={analytics.diversity.oethRate >= 6 ? 'success' : 'warning'} 
                className="w-full justify-center"
              >
                {analytics.diversity.oethRate >= 6 ? '✅ Conforme OETH' : '⚠️ Sous l\'objectif OETH'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Performance RH */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Performance RH
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">NPS Candidats</span>
              <span className="font-semibold text-success-600">{analytics.performance.candidateNps}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Marque employeur</span>
              <span className="font-semibold">{analytics.performance.employerBrand}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Taux de rétention</span>
              <span className="font-semibold">{analytics.performance.retentionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
              <span className="font-semibold">{analytics.performance.satisfactionScore}/5</span>
            </div>
            <div className="pt-3 border-t text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Temps de productivité
              </div>
              <div className="text-xl font-bold text-primary-600">
                {analytics.performance.timeToProductivity}j
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions recommandées
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.diversity.oethRate < 6 && (
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                <span className="font-medium text-warning-800 dark:text-warning-200">
                  Améliorer le taux OETH
                </span>
              </div>
              <p className="text-sm text-warning-700 dark:text-warning-300 mb-3">
                Il manque {(6 - analytics.diversity.oethRate).toFixed(1)}% pour atteindre l'objectif légal.
              </p>
              <Button variant="primary" size="sm" className="bg-warning-600 hover:bg-warning-700">
                Plan d'action OETH
              </Button>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Optimiser le recrutement
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Réduire le temps d'embauche de {analytics.recruitment.averageTimeToHire - 25}j supplémentaires.
            </p>
            <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Voir recommandations
            </Button>
          </div>
          
          <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-success-600" />
              <span className="font-medium text-success-800 dark:text-success-200">
                Rapport de conformité
              </span>
            </div>
            <p className="text-sm text-success-700 dark:text-success-300 mb-3">
              Générer le rapport OETH automatique pour les autorités.
            </p>
            <Button variant="primary" size="sm" className="bg-success-600 hover:bg-success-700">
              Générer rapport
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { AnalyticsComplete };