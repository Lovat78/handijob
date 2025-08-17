// src/components/candidate/CandidateCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  Eye, 
  MessageCircle, 
  Bookmark,
  Award,
  User
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  onViewProfile: (candidateId: string) => void;
  onContact: (candidateId: string) => void;
  onSave: (candidateId: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onViewProfile,
  onContact,
  onSave
}) => {
  const getSkillColor = (level: number) => {
    if (level >= 80) return 'success';
    if (level >= 60) return 'warning';
    return 'info';
  };

  const topSkills = candidate.profile.skills
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="md" hoverable>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-start space-x-3 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            {/* Info principale */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {candidate.profile.firstName} {candidate.profile.lastName}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {candidate.accessibility.needsAccommodation && (
                    <Badge variant="success" size="sm" className="text-xs">
                      <span className="hidden sm:inline">♿ Accompagnement</span>
                      <span className="sm:hidden">♿</span>
                    </Badge>
                  )}
                  {candidate.availability && (
                    <Badge variant="info" size="sm" className="text-xs">
                      <span className="hidden sm:inline">Disponible</span>
                      <span className="sm:hidden">Dispo</span>
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2 text-sm sm:text-base truncate">
                {candidate.profile.title}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-0 sm:space-x-4 mb-3">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{candidate.profile.location.city}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>{candidate.profile.experience} ans d'exp.</span>
                </div>
                {candidate.profile.languages && candidate.profile.languages.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs">
                      {candidate.profile.languages.length} langue{candidate.profile.languages.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {candidate.profile.summary && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {candidate.profile.summary.length > 120 
                    ? candidate.profile.summary.substring(0, 120) + '...' 
                    : candidate.profile.summary}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:items-center space-x-2 self-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(candidate.id)}
              aria-label="Sauvegarder candidat"
              className="px-2 py-1"
            >
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Compétences principales */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning-600 mr-1" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Compétences principales
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill) => (
              <Badge
                key={skill.name}
                variant={getSkillColor(skill.level)}
                size="sm"
                className="text-xs"
              >
                <span className="hidden sm:inline">{skill.name} ({skill.level}%)</span>
                <span className="sm:hidden">
                  {skill.name.length > 6 ? skill.name.substring(0, 6) + '...' : skill.name} ({skill.level}%)
                </span>
                {skill.verified && (
                  <Award className="w-2 h-2 sm:w-3 sm:h-3 ml-1 inline" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Badges additionnels */}
        {candidate.badges && candidate.badges.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 mr-1" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Certifications
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {candidate.badges.slice(0, 2).map((badge) => (
                <Badge key={badge.id} variant="default" size="sm" className="text-xs">
                  <span className="hidden sm:inline">{badge.iconUrl} {badge.name}</span>
                  <span className="sm:hidden">
                    {badge.name.length > 8 ? badge.name.substring(0, 8) + '...' : badge.name}
                  </span>
                </Badge>
              ))}
              {candidate.badges.length > 2 && (
                <Badge variant="default" size="sm" className="text-xs">
                  +{candidate.badges.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Préférences de travail */}
        {candidate.preferences && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
              {candidate.preferences.contractTypes.length > 0 && (
                <span>
                  Contrat: {candidate.preferences.contractTypes.join(', ')}
                </span>
              )}
              {candidate.preferences.workModes.length > 0 && (
                <span>
                  Mode: {candidate.preferences.workModes.join(', ')}
                </span>
              )}
              {candidate.preferences.salaryMin && candidate.preferences.salaryMax && (
                <span>
                  Salaire: {candidate.preferences.salaryMin.toLocaleString()}€ - {candidate.preferences.salaryMax.toLocaleString()}€
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-0">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Actif {new Date(candidate.lastActive).toLocaleDateString('fr-FR')}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewProfile(candidate.id)}
              className="text-xs px-2 py-1"
            >
              <Eye className="w-3 h-3 sm:mr-2" />
              <span className="hidden sm:inline">Voir profil</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onContact(candidate.id)}
              className="text-xs px-3 py-1"
            >
              <MessageCircle className="w-3 h-3 sm:mr-2" />
              <span className="hidden sm:inline">Contacter</span>
              <span className="sm:hidden">Contact</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { CandidateCard };