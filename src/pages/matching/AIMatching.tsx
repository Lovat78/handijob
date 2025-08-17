// src/pages/matching/AIMatching.tsx - VERSION CONNECTÉE
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Briefcase,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Star,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Lightbulb,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar, Spinner } from '@/components/ui';
import { JobDetailModal } from '@/components/modals/JobDetailModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useMatching } from '@/hooks/useMatching';
import { useJobStore } from '@/stores/jobStore';
import { useCandidateStore } from '@/stores/candidateStore';
import { useToast } from '@/hooks/useToast';
import { createAllHandlers } from '@/utils/actionHandlers';
import { MatchResult } from '@/types';

// Composant MatchCard amélioré
interface MatchCardProps {
  match: MatchResult;
  onViewDetails: (candidateId: string) => void;
  onContact: (candidateId: string, jobId: string) => void;
  onViewJob: (jobId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  onViewDetails, 
  onContact,
  onViewJob 
}) => {
  const { candidates } = useCandidateStore();
  const { jobs } = useJobStore();
  
  const candidate = candidates.find(c => c.id === match.candidateId);
  const job = jobs.find(j => j.id === match.jobId);
  
  if (!candidate || !job) return null;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="md" hoverable>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getScoreColor(match.score)}`}>
                {match.score}%
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {candidate.profile.firstName} {candidate.profile.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {candidate.profile.title}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {candidate.profile.location.city}
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  {candidate.profile.experience} ans d'exp.
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <ProgressBar
                value={match.breakdown.skillsMatch}
                color={getScoreBg(match.breakdown.skillsMatch)}
                label="Compétences"
                showPercentage
              />
              <ProgressBar
                value={match.breakdown.experienceMatch}
                color={getScoreBg(match.breakdown.experienceMatch)}
                label="Expérience"
                showPercentage
              />
              <ProgressBar
                value={match.breakdown.accessibilityMatch}
                color={getScoreBg(match.breakdown.accessibilityMatch)}
                label="Accessibilité"
                showPercentage
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.profile.skills.slice(0, 3).map((skill) => (
                <Badge key={skill.name} variant="info" size="sm">
                  {skill.name} ({skill.level}%)
                </Badge>
              ))}
              {candidate.accessibility.needsAccommodation && (
                <Badge variant="success" size="sm">
                  ♿ Accompagnement
                </Badge>
              )}
            </div>

            {/* Recommandations */}
            {match.recommendations && match.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Recommandations IA
                  </span>
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  {match.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4" />
            <span>Confiance: {match.confidence}%</span>
            <button 
              onClick={() => onViewJob(match.jobId)}
              className="text-primary-600 hover:text-primary-700 ml-2"
            >
              Voir l'offre
            </button>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(match.candidateId)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Détails
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onContact(match.candidateId, match.jobId)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contacter
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Composant principal AIMatching
const AIMatching: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactConfig, setContactConfig] = useState<{
    type: 'candidate' | 'company';
    targetId: string;
    jobId: string | null;
  } | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  
  const { 
    matches, 
    isLoading, 
    calculateMatch,
    fetchMatches,
    getMatchingStats 
  } = useMatching();
  
  const { jobs } = useJobStore();
  const { candidates } = useCandidateStore();

  // Créer les handlers
  const handlers = createAllHandlers({
    navigate,
    toast,
    openConfirmDialog
  });

  const handleCalculateMatches = async () => {
    if (!selectedJob) return;
    
    setIsCalculating(true);
    try {
      toast.info('Matching en cours', 'L\'IA analyse les profils compatibles...');
      
      // Simuler le calcul de matching pour tous les candidats
      for (const candidate of candidates.slice(0, 5)) {
        await calculateMatch(candidate.id, selectedJob);
      }
      await fetchMatches({ jobId: selectedJob });
      
      toast.success('Matching terminé !', `${matches.length} candidats analysés avec succès.`);
    } catch (error) {
      toast.error('Erreur', 'Problème lors du calcul du matching. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleViewCandidateDetails = (candidateId: string) => {
    handlers.candidate.handleViewCandidateProfile(candidateId);
  };

  const handleContactFromMatch = (candidateId: string, jobId: string) => {
    handlers.matching.handleContactFromMatch(
      candidateId,
      jobId,
      setContactConfig,
      setShowContactModal
    );
  };

  const handleViewJobDetails = (jobId: string) => {
    handlers.job.handleViewJobDetails(jobId, setSelectedJobId, setShowJobModal);
  };

  const handleSendMessage = async (message: string, targetId: string) => {
    await handlers.modal.handleSendMessage(message, targetId, { navigate, toast, openConfirmDialog });
    setShowContactModal(false);
  };

  const stats = getMatchingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          animate={{ rotate: isCalculating ? 360 : 0 }}
          transition={{ 
            duration: 2, 
            repeat: isCalculating ? Infinity : 0, 
            ease: "linear" 
          }}
        >
          <Brain className="w-8 h-8 text-primary-600" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Matching IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Notre intelligence artificielle analyse automatiquement la compatibilité entre vos offres 
          et les candidats pour vous proposer les meilleurs profils.
        </p>
      </div>

      {/* Job Selection */}
      <Card padding="md">
        <div className="flex items-center mb-4">
          <Briefcase className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sélectionner une offre d'emploi
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {jobs.filter(job => job.status === 'active').map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedJob === job.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex space-x-1">
                    {job.aiOptimized && (
                      <Badge variant="info" size="sm">
                        <Brain className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                    {job.handibienveillant && (
                      <Badge variant="success" size="sm">♿</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location.city}
                  </div>
                  <div>{job.contractType}</div>
                  <div>{job.workMode}</div>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {job.salaryMin.toLocaleString()}€ - {job.salaryMax.toLocaleString()}€
                  </p>
                )}
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-1" />
                  {job.applicationCount} candidatures
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedJob || isCalculating}
          onClick={handleCalculateMatches}
        >
          {isCalculating ? (
            <>
              <Spinner size="sm" />
              <span className="ml-2">Calcul en cours...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Lancer le matching IA
            </>
          )}
        </Button>
      </Card>

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card padding="md">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Statistiques du matching
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Candidats analysés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.highMatches}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Excellents matchs (80%+)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.mediumMatches}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bons matchs (60-80%)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.avgScore}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Score moyen</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Analyse des profils en cours...
              </p>
            </div>
          </motion.div>
        ) : matches.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Résultats du matching
              </h2>
              <div className="flex items-center space-x-3">
                <Badge variant="info" size="sm">
                  {matches.length} résultat{matches.length > 1 ? 's' : ''}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlers.navigation.handleGoToCandidateSearch()}
                >
                  Voir tous les candidats
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {matches
                .sort((a, b) => b.score - a.score)
                .map((match) => (
                  <MatchCard
                    key={`${match.candidateId}-${match.jobId}`}
                    match={match}
                    onViewDetails={handleViewCandidateDetails}
                    onContact={handleContactFromMatch}
                    onViewJob={handleViewJobDetails}
                  />
                ))}
            </div>

            {/* Actions après résultats */}
            <Card padding="md" className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Prochaines étapes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contactez les meilleurs candidats ou affinez votre recherche
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedJob('')}
                  >
                    Nouvelle analyse
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handlers.navigation.handleGoToCandidateSearch()}
                  >
                    Recherche avancée
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : selectedJob ? (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg">
              <div className="text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Prêt pour le matching !
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Cliquez sur "Lancer le matching" pour analyser les candidats compatibles avec l'offre sélectionnée.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 L'IA analysera automatiquement les compétences, l'expérience et les critères d'accessibilité pour vous proposer les meilleurs profils.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg">
              <div className="text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Comment fonctionne notre IA ?
                </h3>
                <div className="max-w-2xl mx-auto text-left space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Analyse sémantique
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Compréhension fine des compétences et expériences requises dans votre offre
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Scoring multi-critères
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Évaluation sur compétences, expérience, localisation et besoins d'accessibilité
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Recommandations personnalisées
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suggestions d'optimisation et points d'accroche pour améliorer vos approches
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    onClick={() => handlers.navigation.handleGoToCandidateSearch()}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Rechercher des candidats
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={showJobModal}
        jobId={selectedJobId}
        onClose={() => setShowJobModal(false)}
        onApply={(jobId) => {
          const job = jobs.find(j => j.id === jobId);
          if (job) handlers.job.handleJobApply(jobId, job.title);
        }}
        onContact={(companyId) => 
          handlers.company.handleContactCompany(companyId, setContactConfig, setShowContactModal)
        }
      />

      {/* Contact Modal */}
      {showContactModal && contactConfig && (
        <ContactModal
          isOpen={showContactModal}
          type={contactConfig.type}
          targetId={contactConfig.targetId}
          jobId={contactConfig.jobId}
          onClose={() => setShowContactModal(false)}
          onSend={handleSendMessage}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialogComponent />
    </div>
  );
};

export { AIMatching };