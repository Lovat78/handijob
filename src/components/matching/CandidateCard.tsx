// src/components/matching/CandidateCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Eye, 
  Mail, 
  Phone, 
  ExternalLink,
  Accessibility,
  Clock
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { Candidate, MatchResult } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  matchResult?: MatchResult;
  onViewProfile?: (candidateId: string) => void;
  onContact?: (candidateId: string) => void;
  onBookmark?: (candidateId: string) => void;
  isBookmarked?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  matchResult,
  onViewProfile,
  onContact,
  onBookmark,
  isBookmarked = false,
  showActions = true,
  variant = 'default',
  className = ''
}) => {
  const { profile, accessibility, badges, availability, lastActive } = candidate;
  
  const getAvailabilityColor = () => {
    if (!availability) return 'error';
    const lastActiveDate = new Date(lastActive);
    const daysSinceActive = Math.floor((Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActive <= 7) return 'success';
    if (daysSinceActive <= 30) return 'warning';
    return 'error';
  };

  const getAvailabilityText = () => {
    if (!availability) return 'Non disponible';
    const lastActiveDate = new Date(lastActive);
    const daysSinceActive = Math.floor((Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActive === 0) return 'Actif aujourd\'hui';
    if (daysSinceActive <= 7) return `Actif il y a ${daysSinceActive} jour${daysSinceActive > 1 ? 's' : ''}`;
    if (daysSinceActive <= 30) return `Actif il y a ${daysSinceActive} jours`;
    return 'Inactif depuis longtemps';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const topSkills = profile.skills
    .sort((a, b) => b.level - a.level)
    .slice(0, variant === 'compact' ? 3 : 5);

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
        {/* Header avec photo et infos principales */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            {availability && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                getAvailabilityColor() === 'success' ? 'bg-green-500' : 
                getAvailabilityColor() === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium truncate">
                  {profile.title}
                </p>
              </div>
              
              {matchResult && (
                <div className="flex-shrink-0 ml-2">
                  <Badge 
                    variant={getScoreColor(matchResult.score)} 
                    size="lg"
                    className="flex items-center space-x-1"
                  >
                    <Star className="w-3 h-3" />
                    <span>{matchResult.score}%</span>
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location.city}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{profile.experience} an{profile.experience > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé (uniquement en mode detailed) */}
        {variant === 'detailed' && profile.summary && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {profile.summary}
            </p>
          </div>
        )}

        {/* Score de matching détaillé */}
        {matchResult && variant !== 'compact' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Compatibilité globale
              </span>
              <span className="text-sm text-gray-500">
                {matchResult.confidence}% de confiance
              </span>
            </div>
            <ProgressBar 
              value={matchResult.score} 
              color={getScoreColor(matchResult.score)} 
              size="md"
              className="mb-3"
            />
            
            {variant === 'detailed' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Compétences:</span>
                  <span className="font-medium">{matchResult.breakdown.skillsMatch}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expérience:</span>
                  <span className="font-medium">{matchResult.breakdown.experienceMatch}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Localisation:</span>
                  <span className="font-medium">{matchResult.breakdown.locationMatch}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Accessibilité:</span>
                  <span className="font-medium">{matchResult.breakdown.accessibilityMatch}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compétences principales */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compétences principales
            </span>
            {profile.skills.length > topSkills.length && (
              <span className="text-xs text-gray-500">
                +{profile.skills.length - topSkills.length} autres
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill, index) => (
              <div key={index} className="relative">
                <Badge 
                  variant="default" 
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span>{skill.name}</span>
                  {skill.verified && <Award className="w-3 h-3 text-yellow-500" />}
                </Badge>
                {variant === 'detailed' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Niveau: {skill.level}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Badges et certifications */}
        {badges && badges.length > 0 && variant !== 'compact' && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Badges obtenus
            </span>
            <div className="flex flex-wrap gap-1">
              {badges.slice(0, 3).map((badge) => (
                <div 
                  key={badge.id}
                  className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
              {badges.length > 3 && (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                  +{badges.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informations d'accessibilité */}
        {accessibility.needsAccommodation && variant === 'detailed' && (
          <div className="mb-4 p-3 bg-accessibility-50 dark:bg-accessibility-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Accessibility className="w-4 h-4 text-accessibility-600" />
              <span className="text-sm font-medium text-accessibility-800 dark:text-accessibility-300">
                Besoins d'aménagement
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {accessibility.accommodationTypes.map((type, index) => (
                <Badge key={index} variant="info" size="sm">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Statut de disponibilité */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getAvailabilityText()}
            </span>
          </div>
          <Badge variant={getAvailabilityColor()} size="sm">
            {availability ? 'Disponible' : 'Non disponible'}
          </Badge>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={() => onViewProfile?.(candidate.id)}
            >
              Voir le profil
            </Button>
            
            {variant !== 'compact' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => onContact?.(candidate.id)}
                >
                  Contacter
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => onBookmark?.(candidate.id)}
                  className={isBookmarked ? 'text-yellow-600' : ''}
                >
                  {isBookmarked ? 'Sauvé' : 'Sauver'}
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export { CandidateCard };