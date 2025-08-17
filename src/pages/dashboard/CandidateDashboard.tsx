// src/pages/dashboard/CandidateDashboard.tsx - VERSION CONNECTÉE
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  BookOpen, 
  Star,
  Briefcase,
  MessageCircle,
  TrendingUp,
  Search,
  Heart,
  MapPin,
  Clock,
  Euro
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { createAllHandlers } from '@/utils/actionHandlers';

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Créer les handlers
  const handlers = createAllHandlers({
    navigate,
    toast,
    openConfirmDialog: () => {}
  });

  const mockRecommendations = [
    {
      id: '1',
      title: 'Développeur React Senior',
      company: 'TechCorp Innovation',
      matchScore: 87,
      location: 'Paris',
      workMode: 'Hybride',
      salary: '45-65k€',
      posted: '2 jours'
    },
    {
      id: '2',
      title: 'UX Designer Inclusif',
      company: 'DesignLab',
      matchScore: 74,
      location: 'Lyon',
      workMode: 'Remote',
      salary: '40-55k€',
      posted: '1 semaine'
    }
  ];

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleSearchJobs = () => {
    navigate('/jobs');
  };

  const handleViewProfile = () => {
    handlers.navigation.handleGoToProfile();
  };

  const handleApplyToJob = (jobId: string, jobTitle: string) => {
    handlers.job.handleJobApply(jobId, jobTitle);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Bonjour {user?.firstName} ! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Découvrez vos nouvelles opportunités et gérez vos candidatures
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate('/cv-generator')}
          className="h-16 flex-col"
        >
          <BookOpen className="w-5 h-5 mb-1" />
          <span className="text-sm mt-1">CV IA</span>
          <Badge variant="success" size="xs" className="mt-1">Nouveau</Badge>
        </Button>
        
        <Button
          variant="secondary"
          fullWidth
          onClick={handleSearchJobs}
          className="h-16 flex-col"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-sm">Rechercher</span>
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={handleViewProfile}
          className="h-16 flex-col"
        >
          <Target className="w-5 h-5 mb-1" />
          <span className="text-sm">Mon profil</span>
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={() => navigate('/my/applications')}
          className="h-16 flex-col"
        >
          <Briefcase className="w-5 h-5 mb-1" />
          <span className="text-sm">Candidatures</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" hoverable onClick={() => navigate('/my/applications')}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Candidatures</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-gray-500">3 en cours</p>
            </div>
          </div>
        </Card>

        <Card padding="md" hoverable onClick={handleViewProfile}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-warning-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Score profil</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">85%</p>
              <p className="text-xs text-gray-500">Très bon</p>
            </div>
          </div>
        </Card>

        <Card padding="md" hoverable onClick={() => navigate('/my/matches')}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Matchs IA</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">28</p>
              <p className="text-xs text-gray-500">+5 cette semaine</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommandations IA */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Offres recommandées pour vous
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchJobs}
          >
            Voir toutes
          </Button>
        </div>
        
        <div className="space-y-4">
          {mockRecommendations.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.01 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer transition-colors"
              onClick={() => handleViewJob(job.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <Badge variant="success" size="sm">
                      {job.matchScore}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {job.company}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {job.workMode}
                    </div>
                    <div className="flex items-center">
                      <Euro className="w-3 h-3 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-2">Il y a {job.posted}</p>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyToJob(job.id, job.title);
                    }}
                  >
                    Postuler
                  </Button>
                </div>
              </div>
              
              <ProgressBar
                value={job.matchScore}
                color="bg-green-600"
                label="Compatibilité"
                showPercentage
              />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Conseils personnalisés */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conseils pour améliorer votre profil
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                Complétez votre profil de compétences
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Ajoutez 3-5 compétences supplémentaires pour augmenter vos chances de matching
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                Personnalisez vos lettres de motivation
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Utilisez notre assistant IA pour adapter vos candidatures à chaque offre
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { CandidateDashboard };