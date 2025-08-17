// src/components/pipeline/PipelineManager.tsx - US-038 PIPELINE AUTOMATISÉ
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Workflow, 
  Users, 
  Clock, 
  Bell,
  Calendar,
  Settings,
  BarChart3,
  Filter,
  Plus,
  Search,
  Download,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle, ProgressBar } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Types Pipeline
interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  icon: React.ReactNode;
  automations: Automation[];
  requirements: string[];
  averageDuration: number; // en jours
  conversionRate: number; // pourcentage
  candidateCount: number;
}

interface Automation {
  id: string;
  type: 'email' | 'notification' | 'schedule' | 'assignment' | 'scoring';
  trigger: 'stage_enter' | 'stage_exit' | 'time_delay' | 'manual' | 'condition';
  action: string;
  delay?: number; // en heures
  conditions?: AutomationCondition[];
  active: boolean;
}

interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

interface CandidateJourney {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  currentStage: string;
  startDate: string;
  lastActivity: string;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  stageHistory: StageHistory[];
  nextActions: NextAction[];
  automatedTriggers: ScheduledTrigger[];
  documents: CandidateDocument[];
  notes: CandidateNote[];
}

interface StageHistory {
  stageId: string;
  stageName: string;
  entryDate: string;
  exitDate?: string;
  duration?: number; // en heures
  result: 'passed' | 'failed' | 'pending' | 'skipped';
  automationsTriggered: string[];
  assignedTo?: string;
  feedback?: string;
}

interface NextAction {
  id: string;
  type: 'interview' | 'review' | 'contact' | 'document' | 'decision';
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  automated: boolean;
}

interface ScheduledTrigger {
  id: string;
  automationId: string;
  scheduledDate: string;
  status: 'pending' | 'executed' | 'cancelled' | 'failed';
  lastAttempt?: string;
  error?: string;
}

interface CandidateDocument {
  id: string;
  name: string;
  type: 'cv' | 'cover_letter' | 'portfolio' | 'certificate' | 'test_result';
  url: string;
  uploadDate: string;
  verified: boolean;
}

interface CandidateNote {
  id: string;
  content: string;
  author: string;
  date: string;
  stage: string;
  type: 'general' | 'interview' | 'technical' | 'hr' | 'decision';
  important: boolean;
}

interface PipelineMetrics {
  totalCandidates: number;
  activeCandidates: number;
  completedThisWeek: number;
  averageCompletionTime: number; // en jours
  conversionRate: number;
  bottleneckStage: string;
  automationSuccess: number;
  upcomingActions: number;
}

const PipelineManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'candidates' | 'automations' | 'analytics'>('overview');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [journeys, setJourneys] = useState<CandidateJourney[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [automationsPaused, setAutomationsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    setIsLoading(true);
    
    // Simulation données pipeline
    const mockStages: PipelineStage[] = [
      {
        id: 'application',
        name: 'Candidature reçue',
        order: 1,
        color: 'bg-blue-100 text-blue-800',
        icon: <Users className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-1',
            type: 'email',
            trigger: 'stage_enter',
            action: 'Envoyer accusé réception',
            active: true
          }
        ],
        requirements: ['CV complet', 'Lettre motivation'],
        averageDuration: 0.5,
        conversionRate: 85,
        candidateCount: 12
      },
      {
        id: 'screening',
        name: 'Pré-qualification',
        order: 2,
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Search className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-2',
            type: 'scoring',
            trigger: 'stage_enter',
            action: 'Score automatique IA',
            active: true
          },
          {
            id: 'auto-3',
            type: 'assignment',
            trigger: 'time_delay',
            action: 'Assigner au RH',
            delay: 24,
            active: true
          }
        ],
        requirements: ['Score IA > 70%', 'Validation RH'],
        averageDuration: 2,
        conversionRate: 65,
        candidateCount: 8
      },
      {
        id: 'interview',
        name: 'Entretien',
        order: 3,
        color: 'bg-purple-100 text-purple-800',
        icon: <Calendar className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-4',
            type: 'schedule',
            trigger: 'stage_enter',
            action: 'Proposer créneaux entretien',
            delay: 2,
            active: true
          },
          {
            id: 'auto-5',
            type: 'notification',
            trigger: 'time_delay',
            action: 'Rappel entretien candidat',
            delay: 48,
            active: true
          }
        ],
        requirements: ['Entretien planifié', 'Grille évaluation'],
        averageDuration: 5,
        conversionRate: 80,
        candidateCount: 5
      },
      {
        id: 'technical',
        name: 'Test technique',
        order: 4,
        color: 'bg-green-100 text-green-800',
        icon: <Target className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-6',
            type: 'email',
            trigger: 'stage_enter',
            action: 'Envoyer test technique',
            active: true
          }
        ],
        requirements: ['Test complété', 'Évaluation technique'],
        averageDuration: 3,
        conversionRate: 70,
        candidateCount: 4
      },
      {
        id: 'decision',
        name: 'Décision finale',
        order: 5,
        color: 'bg-red-100 text-red-800',
        icon: <CheckCircle className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-7',
            type: 'notification',
            trigger: 'manual',
            action: 'Notifier décision',
            active: true
          }
        ],
        requirements: ['Validation manager', 'Décision prise'],
        averageDuration: 2,
        conversionRate: 50,
        candidateCount: 2
      },
      {
        id: 'offer',
        name: 'Proposition',
        order: 6,
        color: 'bg-emerald-100 text-emerald-800',
        icon: <Zap className="w-4 h-4" />,
        automations: [
          {
            id: 'auto-8',
            type: 'email',
            trigger: 'stage_enter',
            action: 'Envoyer offre emploi',
            active: true
          }
        ],
        requirements: ['Offre préparée', 'Validation légale'],
        averageDuration: 1,
        conversionRate: 90,
        candidateCount: 1
      }
    ];

    const mockJourneys: CandidateJourney[] = [
      {
        id: 'journey-1',
        candidateId: 'cand-1',
        candidateName: 'Sarah Martinez',
        candidateEmail: 'sarah.martinez@example.com',
        jobId: 'job-1',
        jobTitle: 'Développeur Full Stack Senior',
        currentStage: 'interview',
        startDate: '2025-08-10',
        lastActivity: '2025-08-15',
        score: 87,
        priority: 'high',
        tags: ['handibienveillance', 'senior', 'react'],
        stageHistory: [
          {
            stageId: 'application',
            stageName: 'Candidature reçue',
            entryDate: '2025-08-10T09:00:00Z',
            exitDate: '2025-08-10T10:30:00Z',
            duration: 1.5,
            result: 'passed',
            automationsTriggered: ['auto-1']
          },
          {
            stageId: 'screening',
            stageName: 'Pré-qualification',
            entryDate: '2025-08-10T10:30:00Z',
            exitDate: '2025-08-12T16:00:00Z',
            duration: 53.5,
            result: 'passed',
            automationsTriggered: ['auto-2', 'auto-3'],
            assignedTo: 'Marie Dupont'
          }
        ],
        nextActions: [
          {
            id: 'action-1',
            type: 'interview',
            title: 'Entretien technique',
            description: 'Entretien avec l\'équipe technique',
            dueDate: '2025-08-17T14:00:00Z',
            assignedTo: 'Pierre Martin',
            priority: 'high',
            automated: true
          }
        ],
        automatedTriggers: [
          {
            id: 'trigger-1',
            automationId: 'auto-4',
            scheduledDate: '2025-08-16T09:00:00Z',
            status: 'pending'
          }
        ],
        documents: [
          {
            id: 'doc-1',
            name: 'CV_Sarah_Martinez.pdf',
            type: 'cv',
            url: '/documents/cv-sarah.pdf',
            uploadDate: '2025-08-10',
            verified: true
          }
        ],
        notes: [
          {
            id: 'note-1',
            content: 'Excellent profil technique, très motivée',
            author: 'Marie Dupont',
            date: '2025-08-12',
            stage: 'screening',
            type: 'hr',
            important: true
          }
        ]
      },
      {
        id: 'journey-2',
        candidateId: 'cand-2',
        candidateName: 'Ahmed Benali',
        candidateEmail: 'ahmed.benali@example.com',
        jobId: 'job-1',
        jobTitle: 'Développeur Full Stack Senior',
        currentStage: 'technical',
        startDate: '2025-08-08',
        lastActivity: '2025-08-16',
        score: 92,
        priority: 'urgent',
        tags: ['handibienveillance', 'accessibility', 'expert'],
        stageHistory: [
          {
            stageId: 'application',
            stageName: 'Candidature reçue',
            entryDate: '2025-08-08T14:00:00Z',
            exitDate: '2025-08-08T14:15:00Z',
            duration: 0.25,
            result: 'passed',
            automationsTriggered: ['auto-1']
          },
          {
            stageId: 'screening',
            stageName: 'Pré-qualification',
            entryDate: '2025-08-08T14:15:00Z',
            exitDate: '2025-08-09T11:00:00Z',
            duration: 20.75,
            result: 'passed',
            automationsTriggered: ['auto-2', 'auto-3'],
            assignedTo: 'Marie Dupont'
          },
          {
            stageId: 'interview',
            stageName: 'Entretien',
            entryDate: '2025-08-09T11:00:00Z',
            exitDate: '2025-08-14T17:00:00Z',
            duration: 126,
            result: 'passed',
            automationsTriggered: ['auto-4', 'auto-5'],
            assignedTo: 'Pierre Martin',
            feedback: 'Excellent entretien, très bon fit culturel'
          }
        ],
        nextActions: [
          {
            id: 'action-2',
            type: 'review',
            title: 'Évaluation test technique',
            description: 'Revoir et noter le test technique',
            dueDate: '2025-08-18T12:00:00Z',
            assignedTo: 'Tech Team',
            priority: 'high',
            automated: false
          }
        ],
        automatedTriggers: [],
        documents: [
          {
            id: 'doc-2',
            name: 'CV_Ahmed_Benali.pdf',
            type: 'cv',
            url: '/documents/cv-ahmed.pdf',
            uploadDate: '2025-08-08',
            verified: true
          },
          {
            id: 'doc-3',
            name: 'Test_Technique_Ahmed.zip',
            type: 'test_result',
            url: '/documents/test-ahmed.zip',
            uploadDate: '2025-08-16',
            verified: false
          }
        ],
        notes: [
          {
            id: 'note-2',
            content: 'Profil exceptionnel, expertise accessibilité rare',
            author: 'Pierre Martin',
            date: '2025-08-14',
            stage: 'interview',
            type: 'technical',
            important: true
          }
        ]
      },
      {
        id: 'journey-3',
        candidateId: 'cand-3',
        candidateName: 'Julie Moreau',
        candidateEmail: 'julie.moreau@example.com',
        jobId: 'job-2',
        jobTitle: 'UX Designer Inclusif',
        currentStage: 'screening',
        startDate: '2025-08-14',
        lastActivity: '2025-08-16',
        score: 74,
        priority: 'medium',
        tags: ['design', 'ux', 'junior'],
        stageHistory: [
          {
            stageId: 'application',
            stageName: 'Candidature reçue',
            entryDate: '2025-08-14T16:30:00Z',
            exitDate: '2025-08-14T16:45:00Z',
            duration: 0.25,
            result: 'passed',
            automationsTriggered: ['auto-1']
          }
        ],
        nextActions: [
          {
            id: 'action-3',
            type: 'review',
            title: 'Validation portfolio',
            description: 'Évaluer le portfolio design',
            dueDate: '2025-08-17T10:00:00Z',
            assignedTo: 'Sophie Laurent',
            priority: 'medium',
            automated: false
          }
        ],
        automatedTriggers: [
          {
            id: 'trigger-2',
            automationId: 'auto-3',
            scheduledDate: '2025-08-15T16:30:00Z',
            status: 'executed'
          }
        ],
        documents: [
          {
            id: 'doc-4',
            name: 'Portfolio_Julie_Moreau.pdf',
            type: 'portfolio',
            url: '/documents/portfolio-julie.pdf',
            uploadDate: '2025-08-14',
            verified: false
          }
        ],
        notes: []
      }
    ];

    const mockMetrics: PipelineMetrics = {
      totalCandidates: mockJourneys.length,
      activeCandidates: mockJourneys.filter(j => j.currentStage !== 'offer').length,
      completedThisWeek: 2,
      averageCompletionTime: 12.5,
      conversionRate: 68,
      bottleneckStage: 'screening',
      automationSuccess: 94,
      upcomingActions: mockJourneys.reduce((acc, j) => acc + j.nextActions.length, 0)
    };

    setStages(mockStages);
    setJourneys(mockJourneys);
    setMetrics(mockMetrics);
    setIsLoading(false);
  };

  const toggleAutomations = () => {
    setAutomationsPaused(!automationsPaused);
    toast[automationsPaused ? 'success' : 'warning'](
      automationsPaused ? 'Automatisations réactivées' : 'Automatisations mises en pause',
      automationsPaused ? 'Le pipeline automatique fonctionne normalement' : 'Les automatisations sont temporairement suspendues'
    );
  };

  const moveCandidateToStage = async (journeyId: string, stageId: string) => {
    setJourneys(prev => prev.map(journey => {
      if (journey.id === journeyId) {
        const newHistory = [
          ...journey.stageHistory,
          {
            stageId: journey.currentStage,
            stageName: stages.find(s => s.id === journey.currentStage)?.name || '',
            entryDate: journey.stageHistory[journey.stageHistory.length - 1]?.entryDate || new Date().toISOString(),
            exitDate: new Date().toISOString(),
            duration: 24, // Simulation
            result: 'passed' as const,
            automationsTriggered: []
          }
        ];

        return {
          ...journey,
          currentStage: stageId,
          lastActivity: new Date().toISOString().split('T')[0],
          stageHistory: newHistory
        };
      }
      return journey;
    }));

    toast.success('Candidat déplacé', 'Le candidat a été déplacé vers la nouvelle étape');
  };

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = !searchTerm || 
      journey.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || journey.currentStage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || journey.priority === priorityFilter;

    return matchesSearch && matchesStage && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Workflow className="w-8 h-8 mx-auto mb-4 animate-pulse text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Pipeline Automatisé
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Workflow intelligent de recrutement avec automatisations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={automationsPaused ? "warning" : "success"}
              size="sm"
              onClick={toggleAutomations}
            >
              {automationsPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
              {automationsPaused ? 'Réactiver' : 'Pause'} auto
            </Button>
          </div>
          
          {metrics && (
            <>
              <Badge variant="primary" className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{metrics.activeCandidates} actifs</span>
              </Badge>
              <Badge variant="success" className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>{metrics.automationSuccess}% auto</span>
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveView('overview')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveView('candidates')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'candidates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Candidats ({filteredJourneys.length})
          </button>
          <button
            onClick={() => setActiveView('automations')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'automations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Automatisations
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Vue d'ensemble */}
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Métriques générales */}
            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card padding="md" className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.totalCandidates}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total candidats</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.averageCompletionTime}j
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Temps moyen</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.conversionRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <Bell className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.upcomingActions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Actions en attente</div>
                </Card>
              </div>
            )}

            {/* Pipeline visualization */}
            <Card padding="lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Pipeline de recrutement
              </h3>
              
              <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between overflow-x-auto pb-4">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    <div className="text-center min-w-[120px] lg:min-w-[140px]">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${stage.color} flex items-center justify-center mx-auto mb-2`}>
                        {stage.icon}
                      </div>
                      <div className="font-medium text-xs lg:text-sm text-gray-900 dark:text-white">
                        {stage.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stage.candidateCount} candidats
                      </div>
                      <div className="text-xs text-gray-500">
                        {stage.conversionRate}% conversion
                      </div>
                    </div>
                    
                    {index < stages.length - 1 && (
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mx-2 lg:mx-4 hidden lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions récentes et à venir */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card padding="md">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Actions en attente
                </h4>
                <div className="space-y-2">
                  {filteredJourneys.slice(0, 5).map((journey) => (
                    journey.nextActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-gray-500">{journey.candidateName}</div>
                        </div>
                        <Badge variant={action.priority === 'high' ? 'warning' : 'secondary'} size="sm">
                          {action.priority}
                        </Badge>
                      </div>
                    ))
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Automatisations actives
                </h4>
                <div className="space-y-2">
                  {stages.slice(0, 3).map((stage) => (
                    stage.automations.filter(a => a.active).map((automation) => (
                      <div key={automation.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <div className="font-medium text-sm">{automation.action}</div>
                          <div className="text-xs text-gray-500">{stage.name}</div>
                        </div>
                        <Badge variant="success" size="sm">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto
                        </Badge>
                      </div>
                    ))
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Vue candidats */}
        {activeView === 'candidates' && (
          <motion.div
            key="candidates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtres */}
            <Card padding="md">
              <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Rechercher candidats, postes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>
                
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-3">
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-0"
                  >
                    <option value="all">Toutes étapes</option>
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-0"
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                  
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Liste candidats */}
            <div className="space-y-4">
              {filteredJourneys.map((journey) => (
                <Card key={journey.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary-700 font-medium text-sm md:text-base">
                          {journey.candidateName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {journey.candidateName}
                          </h3>
                          
                          <div className="flex flex-wrap gap-1">
                            <Badge 
                              variant={
                                journey.priority === 'urgent' ? 'error' :
                                journey.priority === 'high' ? 'warning' :
                                journey.priority === 'medium' ? 'info' : 'secondary'
                              }
                              size="sm"
                            >
                              {journey.priority}
                            </Badge>
                            
                            {journey.tags.includes('handibienveillance') && (
                              <Badge variant="success" size="sm">
                                ♿ Handibienveillance
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="truncate">{journey.jobTitle}</div>
                          <div>Score: {journey.score}/100</div>
                        </div>
                        
                        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-center md:space-x-4 text-xs text-gray-500">
                          <span>Début: {journey.startDate}</span>
                          <span>Activité: {journey.lastActivity}</span>
                          <span className="truncate">Étape: {stages.find(s => s.id === journey.currentStage)?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-2 shrink-0">
                      <select
                        value={journey.currentStage}
                        onChange={(e) => moveCandidateToStage(journey.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 min-w-0"
                      >
                        {stages.map(stage => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                      
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Actions en attente */}
                  {journey.nextActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Prochaines actions:
                        </span>
                        <Badge variant="info" size="sm">
                          {journey.nextActions.length}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        {journey.nextActions.slice(0, 2).map((action) => (
                          <div key={action.id} className="flex items-center justify-between text-sm">
                            <span>{action.title}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredJourneys.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucun candidat trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ajustez vos filtres de recherche
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { PipelineManager };