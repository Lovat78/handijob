// src/pages/analytics/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Briefcase, 
  Eye, 
  UserCheck,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  subtitle 
}) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-100 dark:bg-primary-900/20',
    success: 'text-success-600 bg-success-100 dark:bg-success-900/20',
    warning: 'text-warning-600 bg-warning-100 dark:bg-warning-900/20',
    error: 'text-error-600 bg-error-100 dark:bg-error-900/20'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-error-600';
    return 'text-gray-500';
  };

  return (
    <Card padding="md" hoverable>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium ml-1">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { company } = useAuth();
  const { toast } = useToast();
  const { analytics } = useAnalytics();

  // Données mockées pour la démonstration
  const mockData = {
    metrics: {
      totalJobs: 24,
      activeJobs: 15,
      totalApplications: 189,
      hiredCandidates: 12,
      averageTimeToHire: 18,
      retentionRate: 94,
      diversityScore: 8.2
    },
    oethCompliance: {
      currentRate: company?.oethRate || 4.2,
      targetRate: 6.0,
      gap: -1.8,
      projection: 5.1,
      savings: 24000
    },
    topJobs: [
      { title: 'Développeur Frontend Senior', applications: 45, views: 234 },
      { title: 'UX Designer Inclusif', applications: 32, views: 189 },
      { title: 'Data Analyst', applications: 28, views: 156 }
    ],
    demographics: [
      { category: 'Handicap moteur', percentage: 35, count: 42 },
      { category: 'Handicap sensoriel', percentage: 28, count: 34 },
      { category: 'Handicap psychique', percentage: 22, count: 26 },
      { category: 'Autres', percentage: 15, count: 18 }
    ],
    monthlyTrends: [
      { month: 'Jan', applications: 45, hires: 3 },
      { month: 'Fév', applications: 52, hires: 4 },
      { month: 'Mar', applications: 61, hires: 5 },
      { month: 'Avr', applications: 58, hires: 3 },
      { month: 'Mai', applications: 67, hires: 6 }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      toast.success('Données mises à jour', 'Les analytics ont été actualisées.');
    } catch (error) {
      toast.error('Erreur', 'Impossible de mettre à jour les données.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    toast.info('Export en cours', 'Génération du rapport PDF...');
    setTimeout(() => {
      toast.success('Rapport exporté', 'Le rapport a été téléchargé.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Reporting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Suivez vos performances de recrutement et votre conformité OETH
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          
          <Button
            variant="ghost"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          
          <Button variant="primary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Offres publiées"
          value={mockData.metrics.totalJobs}
          change={12}
          trend="up"
          icon={<Briefcase className="w-6 h-6" />}
          color="primary"
          subtitle={`${mockData.metrics.activeJobs} actives`}
        />
        
        <MetricCard
          title="Candidatures reçues"
          value={mockData.metrics.totalApplications}
          change={8}
          trend="up"
          icon={<Users className="w-6 h-6" />}
          color="success"
        />
        
        <MetricCard
          title="Embauches réalisées"
          value={mockData.metrics.hiredCandidates}
          change={-5}
          trend="down"
          icon={<UserCheck className="w-6 h-6" />}
          color="warning"
        />
        
        <MetricCard
          title="Délai moyen d'embauche"
          value={`${mockData.metrics.averageTimeToHire}j`}
          change={-15}
          trend="up"
          icon={<Calendar className="w-6 h-6" />}
          color="success"
          subtitle="Amélioration continue"
        />
      </div>

      {/* OETH Compliance */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conformité OETH
          </h2>
          <Badge 
            variant={mockData.oethCompliance.currentRate >= 6 ? "success" : "warning"} 
            size="sm"
          >
            {mockData.oethCompliance.currentRate >= 6 ? "Conforme" : "Non conforme"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Taux actuel
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockData.oethCompliance.currentRate}% / {mockData.oethCompliance.targetRate}% requis
                  </span>
                </div>
                <ProgressBar
                  value={mockData.oethCompliance.currentRate}
                  max={mockData.oethCompliance.targetRate}
                  color={mockData.oethCompliance.currentRate >= 6 ? "bg-green-600" : "bg-yellow-600"}
                  showPercentage
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Projection fin d'année
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockData.oethCompliance.projection}%
                  </span>
                </div>
                <ProgressBar
                  value={mockData.oethCompliance.projection}
                  max={mockData.oethCompliance.targetRate}
                  color="bg-blue-600"
                  showPercentage
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900 dark:text-green-200">
                  Économies réalisées
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {mockData.oethCompliance.savings.toLocaleString()}€
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Réduction contribution OETH
              </p>
            </div>

            {mockData.oethCompliance.currentRate < 6 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                    Action requise
                  </span>
                </div>
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  {Math.abs(mockData.oethCompliance.gap)} points manquants pour la conformité
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Performance des offres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top des offres
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockData.topJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {job.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    {job.applications} candidatures
                    <Eye className="w-3 h-3 ml-3 mr-1" />
                    {job.views} vues
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="info" size="sm">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Diversité des candidatures
          </h3>
          
          <div className="space-y-4">
            {mockData.demographics.map((demo, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {demo.category}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {demo.count} candidats ({demo.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={demo.percentage}
                  max={100}
                  color="bg-primary-600"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Conseil :</strong> Votre diversité de candidatures est excellente et contribue positivement à votre score OETH.
            </p>
          </div>
        </Card>
      </div>

      {/* Tendances mensuelles */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Évolution mensuelle
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Candidatures</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Embauches</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between space-x-2">
          {mockData.monthlyTrends.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                <div 
                  className="w-full bg-primary-600 rounded-t"
                  style={{ height: `${(data.applications / 70) * 100}%`, minHeight: '4px' }}
                ></div>
                <div 
                  className="w-full bg-green-600 rounded-t"
                  style={{ height: `${(data.hires / 10) * 50}%`, minHeight: '2px' }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommandations */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommandations IA
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-200 text-sm">
                Excellente diversité de candidatures
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Continuez à utiliser le matching IA pour maintenir cette performance
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Target className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-200 text-sm">
                Optimiser le délai d'embauche
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Utilisez les templates de message pour accélérer la communication
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">
                Améliorer la conformité OETH
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                3 embauches inclusives supplémentaires permettraient d'atteindre les 6%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { Analytics };