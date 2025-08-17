// src/components/modals/JobDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Clock, 
  Euro, 
  Users, 
  Eye,
  Briefcase,
  CheckCircle,
  Calendar,
  Building,
  Globe,
  Accessibility
} from 'lucide-react';
import { Button, Card, Badge, Spinner, Modal } from '@/components/ui';
import { useJobStore } from '@/stores/jobStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Job } from '@/types';

interface JobDetailModalProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  onContact?: (companyId: string) => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  isOpen,
  jobId,
  onClose,
  onApply,
  onContact
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const { jobs } = useJobStore();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && jobId) {
      setLoading(true);
      // Simuler un appel API pour récupérer les détails
      const foundJob = jobs.find(j => j.id === jobId);
      setTimeout(() => {
        setJob(foundJob || null);
        setLoading(false);
      }, 300);
    } else {
      setJob(null);
    }
  }, [isOpen, jobId, jobs]);

  const handleApply = () => {
    if (!job) return;
    
    if (onApply) {
      onApply(job.id);
    } else {
      toast.success('Candidature envoyée !', 'Votre candidature a été transmise au recruteur.');
    }
  };

  const handleContactCompany = () => {
    if (!job) return;
    
    if (onContact) {
      onContact(job.companyId);
    } else {
      toast.info('Contact', 'Fonctionnalité de contact en cours d\'implémentation.');
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'paused': return 'En pause';
      case 'closed': return 'Fermé';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={job ? job.title : 'Détails de l\'offre'}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : !job ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Offre non trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Cette offre d'emploi n'existe plus ou n'est pas accessible.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {job.title}
                </h2>
                <Badge variant={getStatusColor(job.status)} size="sm">
                  {getStatusText(job.status)}
                </Badge>
                {job.aiOptimized && (
                  <Badge variant="info" size="sm">
                    IA Optimisé
                  </Badge>
                )}
                {job.handibienveillant && (
                  <Badge variant="success" size="sm">
                    ♿ Handibienveillant
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4 text-sm">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  <span>TechCorp Innovation</span> {/* TODO: Récupérer nom entreprise */}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location.city}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Informations clés */}
          <Card padding="md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.contractType}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Type de contrat
                </p>
              </div>
              
              <div className="text-center">
                <Globe className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.workMode}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Mode de travail
                </p>
              </div>
              
              {job.salaryMin && job.salaryMax && (
                <div className="text-center">
                  <Euro className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {job.salaryMin.toLocaleString()}€ - {job.salaryMax.toLocaleString()}€
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Salaire annuel
                  </p>
                </div>
              )}
              
              <div className="text-center">
                <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.applicationCount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Candidatures
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description du poste
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          {/* Exigences */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Exigences du poste
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avantages */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Avantages proposés
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Accessibilité */}
          {job.accessibilityFeatures && job.accessibilityFeatures.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Accessibility className="w-5 h-5 mr-2" />
                Accessibilité
              </h3>
              <div className="space-y-2">
                {job.accessibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {feature.description}
                      </p>
                      {!feature.available && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Non disponible actuellement
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Compétences recherchées
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Eye className="w-4 h-4 mr-1" />
              {job.viewCount} vues
            </div>
            
            <div className="flex items-center space-x-3">
              {user?.role === 'candidate' ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleContactCompany}
                  >
                    Contacter l'entreprise
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApply}
                    disabled={job.status !== 'active'}
                  >
                    {job.status === 'active' ? 'Postuler' : 'Offre fermée'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleContactCompany}
                >
                  Voir l'entreprise
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export { JobDetailModal };