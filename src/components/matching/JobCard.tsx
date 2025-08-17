// src/components/matching/JobCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Eye, 
  Send, 
  Bookmark,
  Building2,
  Users,
  DollarSign,
  Accessibility,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Job, Company, MatchResult } from '@/types';

interface JobCardProps {
  job: Job;
  company?: Company;
  matchResult?: MatchResult;
  onViewJob?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  company,
  matchResult,
  onViewJob,
  onApply,
  onBookmark,
  isBookmarked = false,
  showActions = true,
  variant = 'default',
  className = ''
}) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'closed': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Job['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'En pause';
      case 'closed': return 'Fermée';
      case 'expired': return 'Expirée';
      case 'draft': return 'Brouillon';
      default: return 'Inconnue';
    }
  };

  const getContractTypeColor = (type: Job['contractType']) => {
    switch (type) {
      case 'CDI': return 'success';
      case 'CDD': return 'warning';
      case 'Stage': return 'info';
      case 'Freelance': return 'default';
      case 'Alternance': return 'info';
      default: return 'default';
    }
  };

  const getWorkModeIcon = (mode: Job['workMode']) => {
    switch (mode) {
      case 'Télétravail': return '🏠';
      case 'Hybride': return '🔄';
      case 'Présentiel': return '🏢';
      default: return '📍';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salaire non spécifié';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} €`;
    if (min) return `À partir de ${min.toLocaleString()} €`;
    if (max) return `Jusqu'à ${max.toLocaleString()} €`;
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR');
  };

  const availableAccessibilityFeatures = job.accessibilityFeatures.filter(feature => feature.available);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, scale: 1.02 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        variant="default" 
        padding={variant === 'compact' ? 'sm' : 'md'}
        hoverable
        className="h-full"
      >
        {/* Header avec logo entreprise et badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {company?.name || 'Entreprise non spécifiée'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            {matchResult && (
              <Badge 
                variant={getScoreColor(matchResult.score)} 
                size="lg"
                className="flex items-center space-x-1"
              >
                <Star className="w-3 h-3" />
                <span>{matchResult.score}%</span>
              </Badge>
            )}
            
            <Badge variant={getStatusColor(job.status)} size="sm">
              {getStatusText(job.status)}
            </Badge>
          </div>
        </div>

        {/* Informations principales */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location.city}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg">{getWorkModeIcon(job.workMode)}</span>
              <span>{job.workMode}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Publié {formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={getContractTypeColor(job.contractType)} size="sm">
              {job.contractType}
            </Badge>
            
            {job.handibienveillant && (
              <Badge variant="info" size="sm" className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Handibienveillant</span>
              </Badge>
            )}
            
            {job.aiOptimized && (
              <Badge variant="default" size="sm" className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>IA Optimisé</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Salaire */}
        {(job.salaryMin || job.salaryMax) && variant !== 'compact' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-300">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
          </div>
        )}

        {/* Description (mode détaillé) */}
        {variant === 'detailed' && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {job.description}
            </p>
          </div>
        )}

        {/* Fonctionnalités d'accessibilité */}
        {availableAccessibilityFeatures.length > 0 && variant !== 'compact' && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Accessibility className="w-4 h-4 text-accessibility-600" />
              <span className="text-sm font-medium text-accessibility-800 dark:text-accessibility-300">
                Accessibilité
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableAccessibilityFeatures.slice(0, variant === 'detailed' ? 6 : 3).map((feature, index) => (
                <Badge key={index} variant="info" size="sm">
                  {feature.description}
                </Badge>
              ))}
              {availableAccessibilityFeatures.length > (variant === 'detailed' ? 6 : 3) && (
                <Badge variant="default" size="sm">
                  +{availableAccessibilityFeatures.length - (variant === 'detailed' ? 6 : 3)} autres
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags et compétences requises */}
        {job.tags.length > 0 && variant !== 'compact' && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Compétences recherchées
            </span>
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, variant === 'detailed' ? 8 : 4).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
              {job.tags.length > (variant === 'detailed' ? 8 : 4) && (
                <Badge variant="default" size="sm">
                  +{job.tags.length - (variant === 'detailed' ? 8 : 4)}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Statistiques */}
        {variant === 'detailed' && (
          <div className="mb-4 grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Vues</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {job.viewCount}
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Candidatures</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {job.applicationCount}
              </span>
            </div>
          </div>
        )}

        {/* Informations OETH entreprise */}
        {company?.oethStatus && variant === 'detailed' && (
          <div className="mb-4 p-3 bg-accessibility-50 dark:bg-accessibility-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-accessibility-600" />
                <span className="text-sm font-medium text-accessibility-800 dark:text-accessibility-300">
                  Entreprise OETH
                </span>
              </div>
              <Badge variant="success" size="sm">
                {company.oethRate}% d'emploi
              </Badge>
            </div>
          </div>
        )}

        {/* Expiration */}
        {job.expiresAt && variant !== 'compact' && (
          <div className="mb-4 flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
            <span>
              Expire le {new Date(job.expiresAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && job.status === 'active' && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => onApply?.(job.id)}
            >
              Postuler
            </Button>
            
            {variant !== 'compact' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye className="w-4 h-4" />}
                  onClick={() => onViewJob?.(job.id)}
                >
                  Détails
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Bookmark className="w-4 h-4" />}
                  onClick={() => onBookmark?.(job.id)}
                  className={isBookmarked ? 'text-yellow-600' : ''}
                >
                  {isBookmarked ? 'Sauvé' : 'Sauver'}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Message si offre fermée */}
        {job.status !== 'active' && showActions && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
              Cette offre n'est plus disponible pour candidater
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export { JobCard };