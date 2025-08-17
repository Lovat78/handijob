// src/pages/candidates/CandidateProfile.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Star,
  MessageCircle,
  Download,
  Brain,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useCandidateStore } from '@/stores/candidateStore';
import { useMatching } from '@/hooks/useMatching';
import { Candidate, Skill } from '@/types';

const SkillBadge: React.FC<{ skill: Skill }> = ({ skill }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'success';
      case 'advanced': return 'primary';
      case 'intermediate': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Badge variant={getLevelColor(skill.level)} size="sm" className="flex items-center">
      {skill.name}
      {skill.verified && <Award className="w-3 h-3 ml-1" />}
    </Badge>
  );
};

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { candidates } = useCandidateStore();
  const { calculateMatch } = useMatching();

  const candidate = candidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Candidat non trouvé
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Ce profil n'existe pas ou n'est plus disponible
        </p>
      </div>
    );
  }

  const getDisabilityIcon = (type: string) => {
    const icons = {
      visual: '👁️',
      hearing: '👂',
      mobility: '♿',
      cognitive: '🧠',
      psychosocial: '💚',
      multiple: '🔗'
    };
    return icons[type as keyof typeof icons] || '♿';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`}
              alt={candidate.profile.title}
              className="w-20 h-20 rounded-full"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {candidate.profile.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {candidate.profile.experience[0]?.company || 'En recherche d\'emploi'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-warning-500 mr-1" />
                  <span className="font-medium">{candidate.gamificationScore}</span>
                </div>
                {candidate.isAvailable && (
                  <Badge variant="success">Disponible</Badge>
                )}
              </div>
            </div>

            {/* Contact & Location */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 space-x-4 mb-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                contact@example.com
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {candidate.preferences.locations[0] || 'France'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Dernière activité: {new Date(candidate.lastActiveAt).toLocaleDateString()}
              </div>
            </div>

            {/* Disabilities */}
            {candidate.disabilities && candidate.disabilities.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {candidate.disabilities.map((disability, index) => (
                    <Badge key={index} variant="info" size="sm">
                      <span className="mr-1">
                        {getDisabilityIcon(disability.type)}
                      </span>
                      RQTH - {disability.type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger CV
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => calculateMatch(candidate.id, 'job-1')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Calculer matching
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Présentation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {candidate.profile.summary}
            </p>
          </Card>

          {/* Experience */}
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Briefcase className="w-5 h-5 inline mr-2" />
              Expérience professionnelle
            </h2>
            
            <div className="space-y-4">
              {candidate.profile.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-primary-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(exp.startDate).toLocaleDateString()} - 
                      {exp.current ? ' Présent' : new Date(exp.endDate!).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <GraduationCap className="w-5 h-5 inline mr-2" />
              Formation
            </h2>
            
            <div className="space-y-4">
              {candidate.profile.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-success-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.school} • {edu.field}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(edu.startDate).getFullYear()} - 
                      {edu.current ? ' En cours' : new Date(edu.endDate!).getFullYear()}
                    </div>
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Compétences
            </h3>
            
            <div className="space-y-4">
              {['technical', 'soft', 'language'].map((category) => {
                const categorySkills = candidate.profile.skills.filter(
                  skill => skill.category === category
                );
                
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {category === 'technical' ? 'Techniques' : 
                       category === 'soft' ? 'Savoir-être' : 'Langues'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <SkillBadge key={skill.name} skill={skill} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Languages */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Langues
            </h3>
            
            <div className="space-y-3">
              {candidate.profile.languages.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {lang.name}
                  </span>
                  <Badge variant="default" size="sm">
                    {lang.level}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications */}
          {candidate.profile.certifications.length > 0 && (
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Certifications
              </h3>
              
              <div className="space-y-3">
                {candidate.profile.certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {cert.name}
                      </h4>
                      {cert.blockchainVerified && (
                        <Badge variant="success" size="sm">
                          <Award className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {cert.issuer} • {new Date(cert.dateObtained).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Preferences */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Préférences
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Contrats souhaités:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.preferences.contractTypes.map((type) => (
                    <Badge key={type} variant="default" size="sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Modes de travail:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.preferences.workModes.map((mode) => (
                    <Badge key={mode} variant="default" size="sm">
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>

              {candidate.preferences.salaryMin && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Salaire minimum:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {candidate.preferences.salaryMin.toLocaleString()}€/an
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Badges */}
          {candidate.badges.length > 0 && (
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Badges obtenus
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {candidate.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export { CandidateProfile };

