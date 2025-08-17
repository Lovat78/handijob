// src/components/recruitment/PrequalificationEngine.tsx
import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  Clock,
  Eye,
  Filter,
  Download,
  Settings,
  BarChart3,
  Users,
  Lightbulb,
  TrendingUp,
  FileText,
  MessageCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, Job, Application } from '@/types';

interface PrequalificationCriteria {
  id: string;
  name: string;
  type: 'required' | 'preferred' | 'bonus';
  weight: number;
  category: 'skills' | 'experience' | 'education' | 'location' | 'accessibility' | 'soft_skills';
  condition: string;
  description: string;
}

interface PrequalificationResult {
  candidateId: string;
  candidate: Candidate;
  jobId: string;
  job: Job;
  overallScore: number;
  status: 'qualified' | 'partially_qualified' | 'not_qualified' | 'under_review';
  categoryScores: {
    skills: number;
    experience: number;
    education: number;
    location: number;
    accessibility: number;
    soft_skills: number;
  };
  criteriaResults: {
    [criteriaId: string]: {
      met: boolean;
      score: number;
      confidence: number;
      reasoning: string;
    };
  };
  recommendations: string[];
  redFlags: string[];
  strengths: string[];
  nextSteps: string[];
  aiInsights: string;
  processedAt: string;
  reviewRequired: boolean;
}

interface PrequalificationTemplate {
  id: string;
  name: string;
  description: string;
  jobType: string;
  criteria: PrequalificationCriteria[];
  isDefault: boolean;
}

// Templates de préqualification
const prequalificationTemplates: PrequalificationTemplate[] = [
  {
    id: 'dev-fullstack',
    name: 'Développeur Full Stack',
    description: 'Critères pour postes de développement web complet',
    jobType: 'tech',
    isDefault: false,
    criteria: [
      {
        id: 'exp-required',
        name: 'Expérience minimum',
        type: 'required',
        weight: 20,
        category: 'experience',
        condition: 'experience >= 3',
        description: 'Au moins 3 ans d\'expérience en développement'
      },
      {
        id: 'skills-react',
        name: 'Compétences React',
        type: 'required',
        weight: 25,
        category: 'skills',
        condition: 'skills.includes("React") && skillLevel("React") >= 70',
        description: 'Maîtrise de React (niveau 70% minimum)'
      },
      {
        id: 'skills-node',
        name: 'Backend Node.js',
        type: 'preferred',
        weight: 15,
        category: 'skills',
        condition: 'skills.includes("Node.js")',
        description: 'Expérience en Node.js appréciée'
      },
      {
        id: 'edu-tech',
        name: 'Formation technique',
        type: 'preferred',
        weight: 10,
        category: 'education',
        condition: 'education.includes("Informatique") || education.includes("Ingénieur")',
        description: 'Formation en informatique ou ingénierie'
      },
      {
        id: 'location-paris',
        name: 'Localisation Paris',
        type: 'preferred',
        weight: 10,
        category: 'location',
        condition: 'location.includes("Paris") || location.includes("Ile-de-France")',
        description: 'Basé en région parisienne'
      },
      {
        id: 'accessibility-friendly',
        name: 'Sensibilité accessibilité',
        type: 'bonus',
        weight: 10,
        category: 'accessibility',
        condition: 'skills.includes("Accessibilité") || profile.mentions("a11y")',
        description: 'Expérience en accessibilité web'
      },
      {
        id: 'soft-teamwork',
        name: 'Esprit d\'équipe',
        type: 'preferred',
        weight: 10,
        category: 'soft_skills',
        condition: 'softSkills.teamwork >= 80',
        description: 'Capacité à travailler en équipe'
      }
    ]
  },
  {
    id: 'marketing-digital',
    name: 'Marketing Digital',
    description: 'Critères pour postes marketing et communication',
    jobType: 'marketing',
    isDefault: false,
    criteria: [
      {
        id: 'exp-marketing',
        name: 'Expérience marketing',
        type: 'required',
        weight: 25,
        category: 'experience',
        condition: 'experience >= 2 && experienceIn("Marketing")',
        description: 'Au moins 2 ans en marketing digital'
      },
      {
        id: 'skills-social',
        name: 'Réseaux sociaux',
        type: 'required',
        weight: 20,
        category: 'skills',
        condition: 'skills.includes("Social Media") || skills.includes("LinkedIn")',
        description: 'Gestion des réseaux sociaux'
      },
      {
        id: 'skills-analytics',
        name: 'Web Analytics',
        type: 'preferred',
        weight: 15,
        category: 'skills',
        condition: 'skills.includes("Google Analytics") || skills.includes("Analytics")',
        description: 'Maîtrise des outils d\'analyse web'
      }
    ]
  }
];

// Données mockées de résultats
const mockPrequalificationResults: PrequalificationResult[] = [
  {
    candidateId: 'c1',
    candidate: {
      id: 'c1',
      userId: 'u1',
      profile: {
        firstName: 'Ahmed',
        lastName: 'Benali',
        title: 'Développeur Full Stack',
        summary: 'Développeur passionné avec 5 ans d\'expérience en React et Node.js',
        location: { city: 'Paris' },
        email: 'ahmed.benali@example.fr',
        experience: 5,
        skills: [
          { name: 'React', level: 90, category: 'technical' },
          { name: 'Node.js', level: 85, category: 'technical' },
          { name: 'TypeScript', level: 80, category: 'technical' },
          { name: 'Accessibilité', level: 75, category: 'technical' }
        ]
      },
      accessibility: {
        needsAccommodation: true,
        accommodationTypes: ['Adaptation poste de travail']
      },
      preferences: {
        contractTypes: ['CDI'],
        workModes: ['Hybride'],
        salaryRange: { min: 45000, max: 55000 },
        locations: ['Paris', 'Ile-de-France']
      },
      availability: true,
      lastActive: '2024-08-10',
      createdAt: '2024-01-15'
    },
    jobId: 'j1',
    job: {
      id: 'j1',
      companyId: 'comp1',
      title: 'Développeur Full Stack Senior',
      description: 'Poste de développeur senior dans équipe agile',
      requirements: ['React', 'Node.js', '5+ ans exp'],
      benefits: ['Télétravail', 'Formation'],
      contractType: 'CDI',
      workMode: 'Hybride',
      location: { street: '123 rue Tech', city: 'Paris', zipCode: '75001', country: 'France' },
      salaryMin: 50000,
      salaryMax: 60000,
      accessibilityFeatures: [],
      tags: ['React', 'Senior'],
      status: 'active',
      aiOptimized: true,
      handibienveillant: true,
      viewCount: 156,
      applicationCount: 23,
      createdAt: '2024-07-15',
      updatedAt: '2024-08-01'
    },
    overallScore: 92,
    status: 'qualified',
    categoryScores: {
      skills: 95,
      experience: 90,
      education: 80,
      location: 100,
      accessibility: 85,
      soft_skills: 88
    },
    criteriaResults: {
      'exp-required': {
        met: true,
        score: 100,
        confidence: 95,
        reasoning: '5 ans d\'expérience dépassent largement le minimum requis de 3 ans'
      },
      'skills-react': {
        met: true,
        score: 90,
        confidence: 90,
        reasoning: 'Excellent niveau React (90%) confirmé par projets portfolio'
      },
      'skills-node': {
        met: true,
        score: 85,
        confidence: 85,
        reasoning: 'Solide expérience Node.js démontrée'
      },
      'accessibility-friendly': {
        met: true,
        score: 75,
        confidence: 80,
        reasoning: 'Compétences en accessibilité web, bonus apprécié'
      }
    },
    recommendations: [
      'Candidat excellent, à contacter en priorité',
      'Profil senior confirmé avec expertise technique solide',
      'Sensibilité accessibilité alignée avec nos valeurs inclusives'
    ],
    redFlags: [],
    strengths: [
      'Très forte expertise React et Node.js',
      'Expérience senior confirmée',
      'Localisation idéale',
      'Compétences en accessibilité'
    ],
    nextSteps: [
      'Programmer entretien technique',
      'Préparer questions sur projets React complexes',
      'Valider motivations pour poste senior'
    ],
    aiInsights: 'Candidat exceptionnel avec un profil parfaitement aligné. Ses 5 ans d\'expérience, sa maîtrise technique et sa sensibilité à l\'accessibilité en font un candidat prioritaire.',
    processedAt: '2024-08-10T14:30:00Z',
    reviewRequired: false
  },
  {
    candidateId: 'c2',
    candidate: {
      id: 'c2',
      userId: 'u2',
      profile: {
        firstName: 'Sophie',
        lastName: 'Martin',
        title: 'Développeur Junior',
        summary: 'Développeur junior motivé, 1 an d\'expérience en React',
        location: { city: 'Lyon' },
        email: 'sophie.martin@example.fr',
        experience: 1,
        skills: [
          { name: 'React', level: 60, category: 'technical' },
          { name: 'JavaScript', level: 70, category: 'technical' },
          { name: 'HTML/CSS', level: 80, category: 'technical' }
        ]
      },
      accessibility: {
        needsAccommodation: false,
        accommodationTypes: []
      },
      preferences: {
        contractTypes: ['CDI', 'CDD'],
        workModes: ['Télétravail', 'Hybride'],
        salaryRange: { min: 35000, max: 45000 },
        locations: ['Lyon', 'Remote']
      },
      availability: true,
      lastActive: '2024-08-09',
      createdAt: '2024-02-01'
    },
    jobId: 'j1',
    job: {
      id: 'j1',
      companyId: 'comp1',
      title: 'Développeur Full Stack Senior',
      description: 'Poste de développeur senior dans équipe agile',
      requirements: ['React', 'Node.js', '5+ ans exp'],
      benefits: ['Télétravail', 'Formation'],
      contractType: 'CDI',
      workMode: 'Hybride',
      location: { street: '123 rue Tech', city: 'Paris', zipCode: '75001', country: 'France' },
      salaryMin: 50000,
      salaryMax: 60000,
      accessibilityFeatures: [],
      tags: ['React', 'Senior'],
      status: 'active',
      aiOptimized: true,
      handibienveillant: true,
      viewCount: 156,
      applicationCount: 23,
      createdAt: '2024-07-15',
      updatedAt: '2024-08-01'
    },
    overallScore: 45,
    status: 'not_qualified',
    categoryScores: {
      skills: 60,
      experience: 20,
      education: 70,
      location: 50,
      accessibility: 60,
      soft_skills: 75
    },
    criteriaResults: {
      'exp-required': {
        met: false,
        score: 20,
        confidence: 95,
        reasoning: '1 an d\'expérience insuffisant pour le minimum requis de 3 ans'
      },
      'skills-react': {
        met: false,
        score: 60,
        confidence: 80,
        reasoning: 'Niveau React (60%) en dessous du minimum requis (70%)'
      },
      'skills-node': {
        met: false,
        score: 0,
        confidence: 90,
        reasoning: 'Aucune expérience Node.js mentionnée'
      }
    },
    recommendations: [
      'Profil prometteur mais trop junior pour ce poste',
      'Considérer pour un poste junior ou stage',
      'Potentiel d\'évolution intéressant'
    ],
    redFlags: [
      'Expérience insuffisante pour poste senior',
      'Compétences techniques à développer',
      'Écart géographique (Lyon vs Paris)'
    ],
    strengths: [
      'Motivation et potentiel d\'apprentissage',
      'Bases React solides pour niveau junior',
      'Ouverture au télétravail'
    ],
    nextSteps: [
      'Proposer un poste junior alternatif',
      'Évaluer potentiel de formation interne',
      'Garder contact pour opportunités futures'
    ],
    aiInsights: 'Candidat junior avec potentiel mais inadéquat pour ce poste senior. Niveau d\'expérience et compétences techniques insuffisants. À considérer pour positions junior.',
    processedAt: '2024-08-10T14:25:00Z',
    reviewRequired: true
  }
];

const StatusBadge: React.FC<{ status: PrequalificationResult['status'] }> = ({ status }) => {
  const variants = {
    qualified: { variant: 'success' as const, label: 'Qualifié', icon: CheckCircle },
    partially_qualified: { variant: 'warning' as const, label: 'Partiellement qualifié', icon: AlertCircle },
    not_qualified: { variant: 'error' as const, label: 'Non qualifié', icon: XCircle },
    under_review: { variant: 'info' as const, label: 'En révision', icon: Clock }
  };

  const config = variants[status];
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} size="md" className="flex items-center gap-1">
      <IconComponent className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

const ScoreCard: React.FC<{
  title: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, score, icon, color }) => (
  <Card padding="md">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      <span className="text-lg font-bold text-gray-900 dark:text-white">{score}%</span>
    </div>
    <ProgressBar
      value={score}
      max={100}
      color={score >= 80 ? 'bg-success-600' : score >= 60 ? 'bg-warning-600' : 'bg-error-600'}
      showPercentage={false}
    />
  </Card>
);

const PrequalificationCard: React.FC<{
  result: PrequalificationResult;
  onViewDetails: (result: PrequalificationResult) => void;
  onApprove: (resultId: string) => void;
  onReject: (resultId: string) => void;
}> = ({ result, onViewDetails, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const candidate = result.candidate;

  return (
    <Card padding="lg" hoverable>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
              {candidate.profile.firstName[0]}{candidate.profile.lastName[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {candidate.profile.firstName} {candidate.profile.lastName}
                </h3>
                <StatusBadge status={result.status} />
                {result.reviewRequired && (
                  <Badge variant="warning" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    Révision requise
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {candidate.profile.title}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning-500" />
                  <span>Score: {result.overallScore}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  <span>IA: {result.categoryScores.skills}% compétences</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Analysé le {new Date(result.processedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Score global */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Score de préqualification
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.overallScore}%
            </span>
          </div>
          <ProgressBar
            value={result.overallScore}
            max={100}
            color={
              result.overallScore >= 80 ? 'bg-success-600' :
              result.overallScore >= 60 ? 'bg-warning-600' : 'bg-error-600'
            }
            showPercentage={false}
          />
        </div>

        {/* Insights IA */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Analyse IA
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {result.aiInsights}
              </p>
            </div>
          </div>
        </div>

        {/* Points forts et alertes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.strengths.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-success-600" />
                Points forts
              </h4>
              <ul className="space-y-1">
                {result.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-success-600 mt-0.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.redFlags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-error-600" />
                Points d'attention
              </h4>
              <ul className="space-y-1">
                {result.redFlags.slice(0, 3).map((flag, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <XCircle className="w-3 h-3 text-error-600 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Détails étendus */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {/* Scores par catégorie */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <ScoreCard
                  title="Compétences"
                  score={result.categoryScores.skills}
                  icon={<Target className="w-4 h-4" />}
                  color="bg-blue-100 text-blue-600"
                />
                <ScoreCard
                  title="Expérience"
                  score={result.categoryScores.experience}
                  icon={<Award className="w-4 h-4" />}
                  color="bg-green-100 text-green-600"
                />
                <ScoreCard
                  title="Localisation"
                  score={result.categoryScores.location}
                  icon={<Target className="w-4 h-4" />}
                  color="bg-purple-100 text-purple-600"
                />
              </div>

              {/* Recommandations */}
              {result.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning-600" />
                    Recommandations IA
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-warning-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prochaines étapes */}
              {result.nextSteps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-info-600" />
                    Prochaines étapes suggérées
                  </h4>
                  <ul className="space-y-1">
                    {result.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-info-600 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(result)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Voir détails
          </Button>

          {result.status === 'qualified' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApprove(result.candidateId)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approuver
            </Button>
          )}

          {result.status !== 'qualified' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(result.candidateId)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rejeter
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            Contacter
          </Button>

          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Rapport détaillé
          </Button>
        </div>
      </div>
    </Card>
  );
};

const PrequalificationEngine: React.FC = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<PrequalificationResult[]>(mockPrequalificationResults);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<PrequalificationResult['status'] | 'all'>('all');
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredResults = results.filter(result => {
    const matchesJob = selectedJob === 'all' || result.jobId === selectedJob;
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  const handleRunPrequalification = async () => {
    setIsRunning(true);
    
    // Simulation de l'exécution de la préqualification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Préqualification terminée', `${results.length} candidatures analysées`);
    setIsRunning(false);
  };

  const handleViewDetails = (result: PrequalificationResult) => {
    console.log('View details:', result);
    toast.info('Fonctionnalité en cours', 'La vue détaillée sera bientôt disponible');
  };

  const handleApprove = (candidateId: string) => {
    setResults(prev => prev.map(result => 
      result.candidateId === candidateId 
        ? { ...result, status: 'qualified' as const }
        : result
    ));
    toast.success('Candidature approuvée', 'Le candidat a été marqué comme qualifié');
  };

  const handleReject = (candidateId: string) => {
    setResults(prev => prev.map(result => 
      result.candidateId === candidateId 
        ? { ...result, status: 'not_qualified' as const }
        : result
    ));
    toast.success('Candidature rejetée', 'Le candidat a été marqué comme non qualifié');
  };

  const statusCounts = {
    qualified: results.filter(r => r.status === 'qualified').length,
    partially_qualified: results.filter(r => r.status === 'partially_qualified').length,
    not_qualified: results.filter(r => r.status === 'not_qualified').length,
    under_review: results.filter(r => r.status === 'under_review').length
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Préqualification automatique
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            L'IA analyse et évalue automatiquement vos candidatures selon vos critères
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurer critères
          </Button>
          
          <Button
            variant="primary"
            size="md"
            onClick={handleRunPrequalification}
            isLoading={isRunning}
            disabled={isRunning}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isRunning ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
          </Button>
        </div>
      </div>

      {/* Stats de préqualification */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qualifiés</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.qualified}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Partiellement</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.partially_qualified}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error-100 text-error-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Non qualifiés</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.not_qualified}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info-100 text-info-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En révision</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.under_review}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Toutes les offres</option>
              <option value="j1">Développeur Full Stack Senior</option>
              <option value="j2">Designer UX/UI</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="qualified">Qualifiés</option>
            <option value="partially_qualified">Partiellement qualifiés</option>
            <option value="not_qualified">Non qualifiés</option>
            <option value="under_review">En révision</option>
          </select>

          <Button variant="outline" size="sm" className="ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Exporter résultats
          </Button>
        </div>
      </Card>

      {/* Résultats de préqualification */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredResults.map((result) => (
            <motion.div
              key={result.candidateId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PrequalificationCard
                result={result}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredResults.length === 0 && (
          <Card padding="lg">
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedJob !== 'all' || statusFilter !== 'all'
                  ? 'Aucun résultat ne correspond à vos filtres'
                  : 'Aucune analyse de préqualification pour le moment'
                }
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={handleRunPrequalification}
                disabled={isRunning}
              >
                Lancer la première analyse
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Modal de configuration (placeholder) */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configuration des critères">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            La configuration avancée des critères de préqualification sera bientôt disponible.
          </p>
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setShowSettings(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export { PrequalificationEngine };