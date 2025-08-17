// src/components/crm/ExclusiveCandidatePool.tsx - US-037 POOL CANDIDATS EXCLUSIFS
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Clock, 
  Star,
  UserPlus,
  Filter,
  ArrowUpRight,
  Calendar,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Heart
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

interface ExclusiveCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileScore: number;
  handibienveillanceProfile: boolean;
  exclusivityPeriod: {
    startDate: string;
    endDate: string;
    remainingDays: number;
  };
  jobApplication: {
    jobId: string;
    jobTitle: string;
    appliedDate: string;
    currentStage: 'screening' | 'interview' | 'technical' | 'final' | 'decision';
    nextAction?: string;
    nextActionDate?: string;
  };
  profile: {
    skills: string[];
    experience: number;
    education: string;
    availability: 'immediate' | 'negotiable' | 'future';
    salary?: { min: number; max: number; currency: string };
  };
  matching: {
    compatibilityScore: number;
    strengths: string[];
    concerns: string[];
    recommendation: 'strong_recommend' | 'recommend' | 'consider' | 'not_suitable';
  };
  interactions: {
    lastContact: string;
    totalInteractions: number;
    responsiveness: 'high' | 'medium' | 'low';
    engagement: number; // 0-100
  };
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

interface ExclusiveJob {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  exclusivityPeriod: number; // jours
  maxCandidates: number;
  currentCandidates: number;
  status: 'active' | 'paused' | 'filled';
}

const ExclusiveCandidatePool: React.FC = () => {
  const [candidates, setCandidates] = useState<ExclusiveCandidate[]>([]);
  const [jobs, setJobs] = useState<ExclusiveJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'priority' | 'remaining'>('score');
  const [showHandiFriendlyOnly, setShowHandiFriendlyOnly] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadExclusiveCandidates();
  }, []);

  const loadExclusiveCandidates = async () => {
    // Simulation data
    const mockJobs: ExclusiveJob[] = [
      {
        id: 'job-1',
        title: 'Développeur Full Stack Senior',
        department: 'Tech',
        hiringManager: 'Marie Dupont',
        exclusivityPeriod: 14,
        maxCandidates: 8,
        currentCandidates: 5,
        status: 'active'
      },
      {
        id: 'job-2',
        title: 'Chef de Projet Accessibilité',
        department: 'Produit',
        hiringManager: 'Pierre Martin',
        exclusivityPeriod: 21,
        maxCandidates: 6,
        currentCandidates: 3,
        status: 'active'
      }
    ];

    const mockCandidates: ExclusiveCandidate[] = [
      {
        id: 'exc-1',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@example.com',
        phone: '+33 6 12 34 56 78',
        profileScore: 92,
        handibienveillanceProfile: true,
        exclusivityPeriod: {
          startDate: '2025-08-14',
          endDate: '2025-08-28',
          remainingDays: 12
        },
        jobApplication: {
          jobId: 'job-1',
          jobTitle: 'Développeur Full Stack Senior',
          appliedDate: '2025-08-14',
          currentStage: 'interview',
          nextAction: 'Entretien technique',
          nextActionDate: '2025-08-18'
        },
        profile: {
          skills: ['React', 'Node.js', 'TypeScript', 'Accessibilité', 'RGAA'],
          experience: 5,
          education: 'Master Informatique',
          availability: 'immediate',
          salary: { min: 55000, max: 65000, currency: 'EUR' }
        },
        matching: {
          compatibilityScore: 96,
          strengths: ['Expertise technique excellente', 'Expérience accessibilité', 'Disponibilité immédiate'],
          concerns: ['Première expérience en équipe large'],
          recommendation: 'strong_recommend'
        },
        interactions: {
          lastContact: '2025-08-16',
          totalInteractions: 4,
          responsiveness: 'high',
          engagement: 95
        },
        priority: 'high',
        tags: ['tech-expert', 'accessibility', 'senior']
      },
      {
        id: 'exc-2',
        firstName: 'Julie',
        lastName: 'Moreau',
        email: 'julie.moreau@example.com',
        profileScore: 78,
        handibienveillanceProfile: false,
        exclusivityPeriod: {
          startDate: '2025-08-13',
          endDate: '2025-09-03',
          remainingDays: 18
        },
        jobApplication: {
          jobId: 'job-2',
          jobTitle: 'Chef de Projet Accessibilité',
          appliedDate: '2025-08-13',
          currentStage: 'screening',
          nextAction: 'Premier entretien RH',
          nextActionDate: '2025-08-17'
        },
        profile: {
          skills: ['Gestion projet', 'Agile', 'UX Design', 'Accessibilité web'],
          experience: 3,
          education: 'Master Management',
          availability: 'negotiable',
          salary: { min: 45000, max: 55000, currency: 'EUR' }
        },
        matching: {
          compatibilityScore: 82,
          strengths: ['Expérience gestion projet', 'Connaissance accessibilité'],
          concerns: ['Junior sur accessibilité technique', 'Disponibilité à négocier'],
          recommendation: 'recommend'
        },
        interactions: {
          lastContact: '2025-08-15',
          totalInteractions: 2,
          responsiveness: 'medium',
          engagement: 75
        },
        priority: 'medium',
        tags: ['project-management', 'junior', 'potential']
      },
      {
        id: 'exc-3',
        firstName: 'Thomas',
        lastName: 'Leroy',
        email: 'thomas.leroy@example.com',
        profileScore: 89,
        handibienveillanceProfile: true,
        exclusivityPeriod: {
          startDate: '2025-08-15',
          endDate: '2025-08-29',
          remainingDays: 13
        },
        jobApplication: {
          jobId: 'job-1',
          jobTitle: 'Développeur Full Stack Senior',
          appliedDate: '2025-08-15',
          currentStage: 'technical',
          nextAction: 'Test technique à domicile',
          nextActionDate: '2025-08-19'
        },
        profile: {
          skills: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'WCAG'],
          experience: 6,
          education: 'École Ingénieur',
          availability: 'immediate'
        },
        matching: {
          compatibilityScore: 88,
          strengths: ['Stack technique complémentaire', 'Expérience senior', 'Sensibilité handicap'],
          concerns: ['Moins d\'expérience React'],
          recommendation: 'recommend'
        },
        interactions: {
          lastContact: '2025-08-16',
          totalInteractions: 3,
          responsiveness: 'high',
          engagement: 87
        },
        priority: 'high',
        tags: ['backend-expert', 'accessibility', 'diverse-stack']
      }
    ];

    setJobs(mockJobs);
    setCandidates(mockCandidates);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesJob = selectedJob === 'all' || candidate.jobApplication.jobId === selectedJob;
    const matchesPriority = priorityFilter === 'all' || candidate.priority === priorityFilter;
    const matchesStage = stageFilter === 'all' || candidate.jobApplication.currentStage === stageFilter;
    const matchesSearch = !searchTerm || 
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesHandiFriendly = !showHandiFriendlyOnly || candidate.handibienveillanceProfile;

    return matchesJob && matchesPriority && matchesStage && matchesSearch && matchesHandiFriendly;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.matching.compatibilityScore - a.matching.compatibilityScore;
      case 'date':
        return new Date(b.jobApplication.appliedDate).getTime() - new Date(a.jobApplication.appliedDate).getTime();
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'remaining':
        return a.exclusivityPeriod.remainingDays - b.exclusivityPeriod.remainingDays;
      default:
        return 0;
    }
  });

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'screening': return <Filter className="w-4 h-4" />;
      case 'interview': return <MessageSquare className="w-4 h-4" />;
      case 'technical': return <FileText className="w-4 h-4" />;
      case 'final': return <Users className="w-4 h-4" />;
      case 'decision': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'screening': return 'text-blue-600 bg-blue-100';
      case 'interview': return 'text-green-600 bg-green-100';
      case 'technical': return 'text-orange-600 bg-orange-100';
      case 'final': return 'text-purple-600 bg-purple-100';
      case 'decision': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_recommend':
        return <Badge variant="success" className="flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>Fortement recommandé</span>
        </Badge>;
      case 'recommend':
        return <Badge variant="primary" className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span>Recommandé</span>
        </Badge>;
      case 'consider':
        return <Badge variant="warning" className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>À considérer</span>
        </Badge>;
      default:
        return <Badge variant="secondary">À évaluer</Badge>;
    }
  };

  const extendExclusivity = async (candidateId: string, days: number) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const newEndDate = new Date(candidate.exclusivityPeriod.endDate);
        newEndDate.setDate(newEndDate.getDate() + days);
        
        return {
          ...candidate,
          exclusivityPeriod: {
            ...candidate.exclusivityPeriod,
            endDate: newEndDate.toISOString().split('T')[0],
            remainingDays: candidate.exclusivityPeriod.remainingDays + days
          }
        };
      }
      return candidate;
    }));

    toast.success('Exclusivité prolongée', `Période d'exclusivité prolongée de ${days} jours.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Pool Candidats Exclusifs</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Candidats en exclusivité pour vos offres actives
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="primary" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{filteredCandidates.length} candidats</span>
          </Badge>
          <Badge variant="warning" className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{filteredCandidates.filter(c => c.exclusivityPeriod.remainingDays <= 5).length} urgent</span>
          </Badge>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {jobs.map(job => (
          <Card key={job.id} padding="md" className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {job.title}
            </h4>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {job.currentCandidates}/{job.maxCandidates}
            </div>
            <div className="text-xs text-gray-500">candidats exclusifs</div>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher candidats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Filter className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes les offres</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes étapes</option>
              <option value="screening">Screening</option>
              <option value="interview">Entretien</option>
              <option value="technical">Technique</option>
              <option value="final">Final</option>
              <option value="decision">Décision</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="score">Score matching</option>
              <option value="date">Date candidature</option>
              <option value="priority">Priorité</option>
              <option value="remaining">Temps restant</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <Toggle
                checked={showHandiFriendlyOnly}
                onChange={setShowHandiFriendlyOnly}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Handibienveillants uniquement
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Liste candidats */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card 
              padding="md" 
              className={`hover:shadow-lg transition-all ${
                candidate.exclusivityPeriod.remainingDays <= 5 ? 'ring-2 ring-red-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {candidate.firstName[0]}{candidate.lastName[0]}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* En-tête candidat */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {candidate.email}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(candidate.priority)} size="sm">
                          {candidate.priority === 'high' ? 'Haute' : 
                           candidate.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </Badge>
                        {candidate.handibienveillanceProfile && (
                        <Badge variant="success" size="sm" className="text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Handibienveillance</span>
                          <span className="sm:hidden">Handi+</span>
                          </Badge>
                      )}
                      </div>
                    </div>

                    {/* Métrics et statut */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Score Matching</p>
                        <div className="flex items-center space-x-2">
                          <div className="text-xl font-bold text-blue-600">
                            {candidate.matching.compatibilityScore}%
                          </div>
                          {getRecommendationBadge(candidate.matching.recommendation)}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Étape actuelle</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStageColor(candidate.jobApplication.currentStage)} size="sm">
                            {getStageIcon(candidate.jobApplication.currentStage)}
                            <span className="ml-1 capitalize">{candidate.jobApplication.currentStage}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Exclusivité</p>
                        <div className={`text-lg font-bold ${
                          candidate.exclusivityPeriod.remainingDays <= 5 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {candidate.exclusivityPeriod.remainingDays}j restants
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Engagement</p>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-purple-600">
                            {candidate.interactions.engagement}%
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            candidate.interactions.responsiveness === 'high' ? 'bg-green-500' :
                            candidate.interactions.responsiveness === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* Prochaine action */}
                    {candidate.jobApplication.nextAction && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                              {candidate.jobApplication.nextAction}
                            </span>
                          </div>
                          {candidate.jobApplication.nextActionDate && (
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                              {candidate.jobApplication.nextActionDate}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compétences */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Compétences</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.profile.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm" className="text-xs">
                            {skill.length > 10 ? skill.substring(0, 10) + '...' : skill}
                          </Badge>
                        ))}
                        {candidate.profile.skills.length > 3 && (
                          <Badge variant="secondary" size="sm" className="text-xs">
                            +{candidate.profile.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="primary" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contacter
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Dossier
                  </Button>
                  
                  {candidate.exclusivityPeriod.remainingDays <= 7 && (
                    <Button 
                      variant="warning" 
                      size="sm"
                      onClick={() => extendExclusivity(candidate.id, 7)}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Prolonger
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Aucun candidat exclusif trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajustez vos filtres ou attendez de nouvelles candidatures
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export { ExclusiveCandidatePool };