// src/pages/jobs/JobDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Edit2,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  Euro,
  Users,
  Calendar,
  Building,
  Brain,
  Eye,
  MessageCircle,
  MoreVertical,
  Copy,
  ExternalLink,
  Download,
  Flag
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useJobStore } from '@/stores/jobStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useMatching } from '@/hooks/useMatching';
import { Job } from '@/types';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { jobs, fetchJobById, deleteJob, isLoading } = useJobStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const { matches, fetchMatches } = useMatching();

  const job = jobs.find(j => j.id === jobId);
  const isCompanyOwner = user?.role === 'company' && job?.companyId === user?.company?.id;
  const candidateMatches = matches.filter(m => m.jobId === jobId);

  useEffect(() => {
    if (jobId && !job) {
      fetchJobById(jobId);
    }
  }, [jobId, job, fetchJobById]);

  useEffect(() => {
    if (jobId && isCompanyOwner) {
      fetchMatches({ jobId });
    }
  }, [jobId, isCompanyOwner, fetchMatches]);

  const handleEdit = () => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleDelete = async () => {
    if (!jobId || !job) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
      try {
        await deleteJob(jobId);
        toast.success('Offre supprimée avec succès');
        navigate('/jobs');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Offre retirée des favoris' : 'Offre ajoutée aux favoris');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papier');
    setShowShareModal(false);
  };

  const handleApply = () => {
    if (user?.role === 'candidate') {
      toast.success('Candidature envoyée !', 'Votre profil a été transmis au recruteur');
    } else {
      navigate('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'paused': return 'En pause';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Offre non trouvée
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          L'offre que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/jobs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/jobs')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>
        
        <div className="flex items-center space-x-2">
          {!isCompanyOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
          
          {isCompanyOwner && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEdit}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête de l'offre */}
          <Card padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {job.title}
                  </h1>
                  {job.aiOptimized && (
                    <Badge variant="info" size="sm">
                      <Brain className="w-3 h-3 mr-1" />
                      IA
                    </Badge>
                  )}
                  {job.handibienveillant && (
                    <Badge variant="success" size="sm">♿ Inclusif</Badge>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4 mb-4">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Entreprise
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location.city}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.contractType}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Publié il y a 2 jours
                  </div>
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <Euro className="w-5 h-5 mr-1" />
                    {job.salaryMin.toLocaleString()}€ - {job.salaryMax.toLocaleString()}€ / an
                  </div>
                )}
              </div>
              
              <Badge variant={getStatusColor(job.status)} size="md">
                {getStatusLabel(job.status)}
              </Badge>
            </div>

            {!isCompanyOwner && job.status === 'active' && (
              <Button
                size="lg"
                onClick={handleApply}
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Postuler à cette offre
              </Button>
            )}
          </Card>

          {/* Description */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Description du poste
            </h2>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className={showFullDescription ? '' : 'line-clamp-6'}>
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 text-gray-600 dark:text-gray-400">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {job.description.length > 300 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2"
                >
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </Button>
              )}
            </div>
          </Card>

          {/* Exigences */}
          {job.requirements && job.requirements.length > 0 && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Exigences du poste
              </h2>
              
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Avantages */}
          {job.benefits && job.benefits.length > 0 && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Avantages proposés
              </h2>
              
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Accessibilité */}
          {job.accessibilityFeatures && job.accessibilityFeatures.length > 0 && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Accessibilité et accompagnement
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.accessibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature.description}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations rapides */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Informations
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Type de contrat</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{job.contractType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mode de travail</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{job.workMode}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Localisation</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.location.city}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Publié le</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(job.createdAt || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Statistiques pour les entreprises */}
          {isCompanyOwner && (
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Statistiques
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {candidateMatches.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Candidats matchés
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {candidateMatches.filter(m => m.score >= 80).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Excellents profils
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">123</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Vues</div>
                </div>
              </div>
              
              <Link to={`/matching?jobId=${jobId}`}>
                <Button variant="secondary" size="sm" fullWidth className="mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir les matchs
                </Button>
              </Link>
            </Card>
          )}

          {/* Actions rapides */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>
            
            <div className="space-y-2">
              <Button variant="ghost" size="sm" fullWidth className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Télécharger en PDF
              </Button>
              
              <Button variant="ghost" size="sm" fullWidth className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir sur le site
              </Button>
              
              <Button variant="ghost" size="sm" fullWidth className="justify-start">
                <Flag className="w-4 h-4 mr-2" />
                Signaler
              </Button>
            </div>
          </Card>

          {/* Offres similaires */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Offres similaires
            </h3>
            
            <div className="space-y-3">
              {jobs.filter(j => j.id !== jobId).slice(0, 3).map((similarJob) => (
                <Link key={similarJob.id} to={`/jobs/${similarJob.id}`}>
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {similarJob.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {similarJob.location.city} • {similarJob.contractType}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Partager cette offre
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier le lien
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { JobDetail };