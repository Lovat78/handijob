// src/pages/dashboard/CompanyDashboard.tsx - VERSION CONNECTÉE
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Brain, 
  Eye,
  UserCheck,
  Clock,
  Euro,
  Plus,
  Search,
  BarChart3,
  Settings
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useJobStore } from '@/stores/jobStore';
import { useToast } from '@/hooks/useToast';
import { createAllHandlers } from '@/utils/actionHandlers';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  onClick 
}) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-100 dark:bg-primary-900/20',
    success: 'text-success-600 bg-success-100 dark:bg-success-900/20',
    warning: 'text-warning-600 bg-warning-100 dark:bg-warning-900/20',
    error: 'text-error-600 bg-error-100 dark:bg-error-900/20'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        padding="md" 
        hoverable={!!onClick}
        className={onClick ? 'cursor-pointer' : ''}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                <span className="text-sm text-success-600 font-medium">+{change}%</span>
                <span className="text-sm text-gray-500 ml-1">ce mois</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const CompanyDashboard: React.FC = () => {
  const { company, user } = useAuth();
  const { jobs, fetchJobs } = useJobStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Créer les handlers
  const handlers = createAllHandlers({
    navigate,
    toast,
    openConfirmDialog: () => {} // Pas besoin sur dashboard
  });

  useEffect(() => {
    if (company) {
      fetchJobs(company.id);
    }
  }, [company, fetchJobs]);

  const activeJobs = jobs.filter(job => job.status === 'active');
  const totalApplications = jobs.reduce((sum, job) => sum + job.applicationCount, 0);
  const totalViews = jobs.reduce((sum, job) => sum + job.viewCount, 0);

  // Actions rapides
  const handleCreateJob = () => {
    handlers.navigation.handleGoToJobCreate();
  };

  const handleViewCandidates = () => {
    handlers.navigation.handleGoToCandidateSearch();
  };

  const handleViewAnalytics = () => {
    handlers.navigation.handleGoToAnalytics();
  };

  const handleViewSettings = () => {
    handlers.navigation.handleGoToSettings();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenue {user?.firstName}, voici un aperçu de votre activité de recrutement
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="primary"
          fullWidth
          onClick={handleCreateJob}
          className="h-16 flex-col"
        >
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-sm">Créer une offre</span>
        </Button>
        
        <Button
          variant="secondary"
          fullWidth
          onClick={handleViewCandidates}
          className="h-16 flex-col"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-sm">Rechercher</span>
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={() => handlers.navigation.handleGoToMatching()}
          className="h-16 flex-col"
        >
          <Brain className="w-5 h-5 mb-1" />
          <span className="text-sm">Matching IA</span>
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={handleViewAnalytics}
          className="h-16 flex-col"
        >
          <BarChart3 className="w-5 h-5 mb-1" />
          <span className="text-sm">Analytics</span>
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Offres actives"
          value={activeJobs.length}
          change={12}
          icon={<Briefcase className="w-6 h-6" />}
          color="primary"
          onClick={() => navigate('/jobs')}
        />
        
        <StatCard
          title="Candidatures reçues"
          value={totalApplications}
          change={8}
          icon={<Users className="w-6 h-6" />}
          color="success"
          onClick={handleViewCandidates}
        />
        
        <StatCard
          title="Vues totales"
          value={totalViews}
          change={15}
          icon={<Eye className="w-6 h-6" />}
          color="warning"
        />
        
        <StatCard
          title="Taux OETH"
          value={`${company?.oethRate || 0}%`}
          icon={<UserCheck className="w-6 h-6" />}
          color={company?.oethRate && company.oethRate >= 6 ? "success" : "warning"}
          onClick={handleViewAnalytics}
        />
      </div>

      {/* Offres récentes */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Offres récentes
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/jobs')}
          >
            Voir toutes
          </Button>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune offre d'emploi
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Commencez par créer votre première offre d'emploi
            </p>
            <Button onClick={handleCreateJob}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une offre
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate('/jobs')}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>{job.location.city}</span>
                    <span className="mx-2">•</span>
                    <span>{job.contractType}</span>
                    <span className="mx-2">•</span>
                    <span>{job.applicationCount} candidatures</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={job.status === 'active' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {job.status === 'active' ? 'Actif' : 'En pause'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Compliance OETH */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Obligation d'Emploi des Travailleurs Handicapés (OETH)
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAnalytics}
          >
            <Settings className="w-4 h-4 mr-2" />
            Gérer
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Taux actuel
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {company?.oethRate || 0}% / 6% requis
              </span>
            </div>
            <ProgressBar
              value={company?.oethRate || 0}
              max={6}
              color={company?.oethRate && company.oethRate >= 6 ? "bg-green-600" : "bg-yellow-600"}
              showPercentage
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Conseil :</strong> Utilisez notre matching IA pour identifier les candidats 
              en situation de handicap qui correspondent à vos besoins et améliorer votre taux OETH.
            </p>
          </div>
        </div>
      </Card>

      {/* Actions suggérées */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions recommandées
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="flex items-center">
              <Brain className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Optimiser vos offres avec l'IA
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Améliorez l'accessibilité et l'attractivité de vos annonces
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleCreateJob}>
              Commencer
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Explorer les profils inclusifs
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Découvrez des talents diversifiés et qualifiés
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleViewCandidates}>
              Explorer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { CompanyDashboard };