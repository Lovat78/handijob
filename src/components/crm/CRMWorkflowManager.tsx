// src/components/crm/CRMWorkflowManager.tsx - US-037 CRM EXCLUSIF → MUTUALISÉ
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  ArrowRight, 
  Database,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Filter,
  Search,
  Download,
  Share2,
  Bell,
  Target,
  Zap,
  Heart,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle, ProgressBar } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Types CRM Workflow
interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  profileScore: number;
  handibienveillanceProfile: boolean;
  skills: string[];
  experience: number;
  education: string;
  availability: 'immediate' | 'negotiable' | 'future';
  status: CandidateStatus;
  exclusiveJobId?: string;
  applicationDate: string;
  lastContact?: string;
  matchingScore?: number;
  interviewStages: InterviewStage[];
  notes: CandidateNote[];
  documents: CandidateDocument[];
}

interface InterviewStage {
  id: string;
  stage: 'application' | 'screening' | 'interview' | 'technical' | 'final' | 'offer' | 'decision';
  status: 'pending' | 'completed' | 'passed' | 'failed' | 'scheduled';
  scheduledDate?: string;
  feedback?: string;
  interviewer?: string;
  score?: number;
}

interface CandidateNote {
  id: string;
  content: string;
  author: string;
  date: string;
  type: 'general' | 'interview' | 'technical' | 'hr';
  important: boolean;
}

interface CandidateDocument {
  id: string;
  name: string;
  type: 'cv' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  url: string;
  uploadDate: string;
  size: number;
}

type CandidateStatus = 
  | 'exclusive_pending'    // En cours évaluation pour poste exclusif
  | 'exclusive_interview'  // En entretien pour poste exclusif
  | 'exclusive_offer'      // Offre faite pour poste exclusif
  | 'exclusive_accepted'   // Offre acceptée (poste pourvu)
  | 'exclusive_rejected'   // Candidature rejetée
  | 'exclusive_withdrawn'  // Candidat s'est désisté
  | 'shared_available'     // Disponible dans CRM mutualisé
  | 'shared_matched'       // Matché pour autre offre
  | 'shared_hired';        // Recruté par autre entreprise

interface JobOffer {
  id: string;
  title: string;
  company: string;
  department?: string;
  status: 'active' | 'paused' | 'filled' | 'cancelled';
  exclusiveCandidates: Candidate[];
  createdDate: string;
  targetHireDate?: string;
  hiringManager: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface CRMAnalytics {
  exclusiveCandidates: number;
  sharedCandidates: number;
  avgTimeToHire: number;
  conversionRate: number;
  candidatesTransferred: number;
  activeOffers: number;
  filledPositions: number;
}

const CRMWorkflowManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exclusive' | 'shared' | 'analytics'>('exclusive');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [transferInProgress, setTransferInProgress] = useState<string[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();

  // Simulation données CRM
  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    setIsLoading(true);
    
    // Simulation jobs avec candidats exclusifs
    const mockJobs: JobOffer[] = [
      {
        id: 'job-1',
        title: 'Développeur Full Stack Senior',
        company: 'TechCorp',
        department: 'Développement',
        status: 'active',
        exclusiveCandidates: [],
        createdDate: '2025-08-10',
        targetHireDate: '2025-09-15',
        hiringManager: 'Marie Dupont',
        priority: 'high'
      },
      {
        id: 'job-2', 
        title: 'Chef de Projet Accessibilité',
        company: 'InclusiveTech',
        department: 'Produit',
        status: 'active',
        exclusiveCandidates: [],
        createdDate: '2025-08-12',
        targetHireDate: '2025-09-30',
        hiringManager: 'Pierre Martin',
        priority: 'medium'
      },
      {
        id: 'job-3',
        title: 'UX Designer Inclusif',
        company: 'DesignForAll',
        department: 'Design',
        status: 'filled',
        exclusiveCandidates: [],
        createdDate: '2025-07-20',
        hiringManager: 'Sophie Laurent',
        priority: 'low'
      }
    ];

    // Simulation candidats avec différents statuts
    const mockCandidates: Candidate[] = [
      {
        id: 'cand-1',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@example.com',
        phone: '+33 6 12 34 56 78',
        profileScore: 87,
        handibienveillanceProfile: true,
        skills: ['React', 'Node.js', 'Accessibilité', 'RGAA'],
        experience: 5,
        education: 'Master Informatique',
        availability: 'immediate',
        status: 'exclusive_pending',
        exclusiveJobId: 'job-1',
        applicationDate: '2025-08-14',
        matchingScore: 92,
        interviewStages: [
          { id: 'stage-1', stage: 'application', status: 'completed', feedback: 'Profil excellent' },
          { id: 'stage-2', stage: 'screening', status: 'scheduled', scheduledDate: '2025-08-17' }
        ],
        notes: [
          { id: 'note-1', content: 'Candidat très motivé, expertise accessibilité remarquable', author: 'Marie Dupont', date: '2025-08-14', type: 'general', important: true }
        ],
        documents: [
          { id: 'doc-1', name: 'CV_Ahmed_Benali.pdf', type: 'cv', url: '/documents/cv-ahmed.pdf', uploadDate: '2025-08-14', size: 245678 }
        ]
      },
      {
        id: 'cand-2',
        firstName: 'Julie',
        lastName: 'Moreau',
        email: 'julie.moreau@example.com',
        profileScore: 78,
        handibienveillanceProfile: false,
        skills: ['UX Design', 'Figma', 'User Research'],
        experience: 3,
        education: 'Master Design',
        availability: 'negotiable',
        status: 'exclusive_interview',
        exclusiveJobId: 'job-2',
        applicationDate: '2025-08-13',
        matchingScore: 85,
        interviewStages: [
          { id: 'stage-3', stage: 'application', status: 'passed' },
          { id: 'stage-4', stage: 'interview', status: 'pending', scheduledDate: '2025-08-18' }
        ],
        notes: [],
        documents: []
      },
      {
        id: 'cand-3',
        firstName: 'Thomas',
        lastName: 'Leroy',
        email: 'thomas.leroy@example.com',
        profileScore: 95,
        handibienveillanceProfile: true,
        skills: ['Project Management', 'Agile', 'Accessibility', 'WCAG'],
        experience: 8,
        education: 'MBA + Certification Accessibilité',
        availability: 'immediate',
        status: 'shared_available',
        applicationDate: '2025-08-01',
        matchingScore: 96,
        interviewStages: [
          { id: 'stage-5', stage: 'application', status: 'passed' },
          { id: 'stage-6', stage: 'interview', status: 'passed' },
          { id: 'stage-7', stage: 'offer', status: 'failed', feedback: 'Candidat a décliné offre' }
        ],
        notes: [
          { id: 'note-2', content: 'Excellent profil, peut être recontacté pour futures opportunités', author: 'RH Manager', date: '2025-08-05', type: 'hr', important: true }
        ],
        documents: []
      },
      {
        id: 'cand-4',
        firstName: 'Sarah',
        lastName: 'Cohen',
        email: 'sarah.cohen@example.com',
        profileScore: 88,
        handibienveillanceProfile: true,
        skills: ['Full Stack', 'Python', 'Django', 'Accessibility'],
        experience: 6,
        education: 'École Ingénieur',
        availability: 'immediate',
        status: 'shared_matched',
        applicationDate: '2025-07-28',
        matchingScore: 89,
        interviewStages: [],
        notes: [
          { id: 'note-3', content: 'Matchée pour offre similaire chez concurrent', author: 'IA Matching', date: '2025-08-15', type: 'general', important: false }
        ],
        documents: []
      }
    ];

    setCandidates(mockCandidates);
    setJobs(mockJobs);

    // Analytics simulation
    setAnalytics({
      exclusiveCandidates: mockCandidates.filter(c => c.status.startsWith('exclusive')).length,
      sharedCandidates: mockCandidates.filter(c => c.status.startsWith('shared')).length,
      avgTimeToHire: 23,
      conversionRate: 68,
      candidatesTransferred: 12,
      activeOffers: mockJobs.filter(j => j.status === 'active').length,
      filledPositions: mockJobs.filter(j => j.status === 'filled').length
    });

    setIsLoading(false);
  };

  // Transfert automatique candidat vers CRM mutualisé
  const transferToSharedCRM = async (candidateId: string, reason: 'position_filled' | 'rejected' | 'withdrawn') => {
    setTransferInProgress(prev => [...prev, candidateId]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation API

      setCandidates(prev => prev.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            status: 'shared_available',
            exclusiveJobId: undefined,
            notes: [
              ...candidate.notes,
              {
                id: `transfer-${Date.now()}`,
                content: `Transféré vers CRM mutualisé - Raison: ${reason}`,
                author: 'Système',
                date: new Date().toISOString().split('T')[0],
                type: 'general',
                important: true
              }
            ]
          };
        }
        return candidate;
      }));

      toast.success(
        'Transfert réussi',
        `Le candidat a été transféré vers le CRM mutualisé et est maintenant disponible pour tous les clients.`
      );

      // Simulation suggestions IA
      setTimeout(() => {
        toast.info(
          'IA Suggestion',
          `3 offres similaires identifiées pour ce profil. Notification envoyée aux entreprises concernées.`
        );
      }, 2000);

    } catch (error) {
      toast.error('Erreur transfert', 'Impossible de transférer le candidat vers le CRM mutualisé.');
    } finally {
      setTransferInProgress(prev => prev.filter(id => id !== candidateId));
    }
  };

  // Marquer poste comme pourvu et transférer tous candidats
  const markPositionFilled = async (jobId: string, hiredCandidateId: string) => {
    setIsLoading(true);

    try {
      // Marquer job comme rempli
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'filled' as const } : job
      ));

      // Marquer candidat recruté
      setCandidates(prev => prev.map(candidate => {
        if (candidate.id === hiredCandidateId) {
          return { ...candidate, status: 'exclusive_accepted' };
        }
        // Transférer tous les autres candidats exclusifs de cette offre
        if (candidate.exclusiveJobId === jobId && candidate.id !== hiredCandidateId) {
          return {
            ...candidate,
            status: 'shared_available',
            exclusiveJobId: undefined,
            notes: [
              ...candidate.notes,
              {
                id: `auto-transfer-${Date.now()}`,
                content: 'Transféré automatiquement - Poste pourvu',
                author: 'Système CRM',
                date: new Date().toISOString().split('T')[0],
                type: 'general',
                important: true
              }
            ]
          };
        }
        return candidate;
      }));

      toast.success(
        'Poste pourvu !',
        'Tous les candidats non retenus ont été automatiquement transférés vers le CRM mutualisé.'
      );

    } catch (error) {
      toast.error('Erreur', 'Impossible de marquer le poste comme pourvu.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: CandidateStatus) => {
    const statusConfig = {
      exclusive_pending: { label: 'En évaluation', variant: 'warning' as const, icon: <Clock className="w-3 h-3" /> },
      exclusive_interview: { label: 'En entretien', variant: 'info' as const, icon: <Users className="w-3 h-3" /> },
      exclusive_offer: { label: 'Offre faite', variant: 'success' as const, icon: <Target className="w-3 h-3" /> },
      exclusive_accepted: { label: 'Recruté', variant: 'success' as const, icon: <CheckCircle className="w-3 h-3" /> },
      exclusive_rejected: { label: 'Rejeté', variant: 'error' as const, icon: <AlertTriangle className="w-3 h-3" /> },
      exclusive_withdrawn: { label: 'Désisté', variant: 'secondary' as const, icon: <ArrowRight className="w-3 h-3" /> },
      shared_available: { label: 'CRM Mutualisé', variant: 'primary' as const, icon: <Database className="w-3 h-3" /> },
      shared_matched: { label: 'Matché ailleurs', variant: 'info' as const, icon: <Zap className="w-3 h-3" /> },
      shared_hired: { label: 'Recruté ailleurs', variant: 'success' as const, icon: <UserCheck className="w-3 h-3" /> }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        {config.icon}
        <span>{config.label}</span>
      </Badge>
    );
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    const matchesTab = 
      (activeTab === 'exclusive' && candidate.status.startsWith('exclusive')) ||
      (activeTab === 'shared' && candidate.status.startsWith('shared')) ||
      activeTab === 'analytics';

    return matchesSearch && matchesStatus && matchesTab;
  });

  if (isLoading && !candidates.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-8 h-8 mx-auto mb-4 animate-pulse text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du CRM...</p>
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
            CRM Workflow Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestion intelligente candidats exclusifs → mutualisés
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {analytics && (
            <>
              <Badge variant="primary" className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>{analytics.exclusiveCandidates} Exclusifs</span>
              </Badge>
              <Badge variant="success" className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>{analytics.sharedCandidates} Mutualisés</span>
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('exclusive')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'exclusive'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Candidats Exclusifs
          {analytics && (
            <Badge variant="primary" size="sm" className="ml-2">
              {analytics.exclusiveCandidates}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'shared'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 inline mr-2" />
          CRM Mutualisé
          {analytics && (
            <Badge variant="success" size="sm" className="ml-2">
              {analytics.sharedCandidates}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Filters */}
      {(activeTab === 'exclusive' || activeTab === 'shared') && (
        <Card padding="md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou compétences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                {activeTab === 'exclusive' && (
                  <>
                    <option value="exclusive_pending">En évaluation</option>
                    <option value="exclusive_interview">En entretien</option>
                    <option value="exclusive_offer">Offre faite</option>
                    <option value="exclusive_accepted">Recruté</option>
                    <option value="exclusive_rejected">Rejeté</option>
                  </>
                )}
                {activeTab === 'shared' && (
                  <>
                    <option value="shared_available">Disponible</option>
                    <option value="shared_matched">Matché</option>
                    <option value="shared_hired">Recruté</option>
                  </>
                )}
              </select>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Tab Candidats Exclusifs */}
        {activeTab === 'exclusive' && (
          <motion.div
            key="exclusive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {candidate.firstName[0]}{candidate.lastName[0]}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          {getStatusBadge(candidate.status)}
                          {candidate.handibienveillanceProfile && (
                            <Badge variant="success" size="sm" className="text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Handibienveillance</span>
                              <span className="sm:hidden">Handi+</span>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Contact</p>
                            <p className="font-medium text-sm break-all">{candidate.email}</p>
                            {candidate.phone && <p className="text-gray-500 text-xs">{candidate.phone}</p>}
                          </div>
                          
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Profil</p>
                            <p className="font-medium text-sm">Score: {candidate.profileScore}/100</p>
                            <p className="text-gray-500 text-xs">{candidate.experience} ans d'exp.</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Compétences</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.slice(0, 2).map((skill) => (
                                <Badge key={skill} variant="secondary" size="sm" className="text-xs">
                                  {skill.length > 8 ? skill.substring(0, 8) + '...' : skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 2 && (
                                <Badge variant="secondary" size="sm" className="text-xs">
                                  +{candidate.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {candidate.exclusiveJobId && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <Target className="w-4 h-4 inline mr-1" />
                              Candidature exclusive pour: {jobs.find(j => j.id === candidate.exclusiveJobId)?.title}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {candidate.status.startsWith('exclusive') && candidate.status !== 'exclusive_accepted' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => transferToSharedCRM(candidate.id, 'rejected')}
                            isLoading={transferInProgress.includes(candidate.id)}
                            className="text-xs px-2 py-1"
                          >
                            <ArrowRight className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Transférer</span>
                          </Button>
                          
                          {candidate.status === 'exclusive_offer' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => markPositionFilled(candidate.exclusiveJobId!, candidate.id)}
                              className="text-xs px-2 py-1"
                            >
                              <CheckCircle className="w-3 h-3 sm:mr-1" />
                              <span className="hidden sm:inline">Recruter</span>
                            </Button>
                          )}
                        </>
                      )}
                      
                      <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
                        <FileText className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucun candidat exclusif
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Les candidats apparaîtront ici lorsqu'ils postuleront à vos offres
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Tab CRM Mutualisé */}
        {activeTab === 'shared' && (
          <motion.div
            key="shared"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredCandidates.length > 0 ? (
              <>
                <Card padding="md" className="bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-green-900 dark:text-green-200">
                        CRM Mutualisé Actif
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {filteredCandidates.length} candidats disponibles pour tous les clients
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="primary" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Exporter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </Card>

                {filteredCandidates.map((candidate) => (
                  <Card key={candidate.id} padding="md" className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-medium">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {candidate.firstName} {candidate.lastName}
                            </h3>
                            {getStatusBadge(candidate.status)}
                            {candidate.handibienveillanceProfile && (
                              <Badge variant="success" size="sm">
                                <Heart className="w-3 h-3 mr-1" />
                                Handibienveillance
                              </Badge>
                            )}
                            {candidate.matchingScore && candidate.matchingScore > 90 && (
                              <Badge variant="warning" size="sm">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Top Match
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Disponibilité</p>
                              <p className="font-medium capitalize">{candidate.availability}</p>
                              <p className="text-gray-500">Ajouté le {candidate.applicationDate}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Profil</p>
                              <p className="font-medium">Score: {candidate.profileScore}/100</p>
                              <p className="text-gray-500">{candidate.experience} ans d'expérience</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Dernière activité</p>
                              <p className="font-medium">
                                {candidate.notes.length > 0 ? candidate.notes[candidate.notes.length - 1].date : 'Aucune'}
                              </p>
                              {candidate.status === 'shared_matched' && (
                                <p className="text-blue-600 text-xs">Matché pour autre offre</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" size="sm">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="primary" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Contacter
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    CRM mutualisé vide
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Les candidats apparaîtront ici après transfert depuis les pools exclusifs
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Tab Analytics */}
        {activeTab === 'analytics' && analytics && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Métriques globales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card padding="md" className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.exclusiveCandidates}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Candidats Exclusifs</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.sharedCandidates}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">CRM Mutualisé</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.avgTimeToHire}j
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Temps moyen recrutement</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.conversionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taux conversion</div>
              </Card>
            </div>

            {/* Workflow visualization */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Flux CRM Workflow
              </h3>
              
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="font-medium">Candidature</div>
                  <div className="text-sm text-gray-500">Pool exclusif</div>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400" />
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <UserCheck className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="font-medium">Évaluation</div>
                  <div className="text-sm text-gray-500">Processus recrutement</div>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400" />
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="font-medium">Décision</div>
                  <div className="text-sm text-gray-500">Recruté / Transféré</div>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400" />
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="font-medium">CRM Mutualisé</div>
                  <div className="text-sm text-gray-500">Disponible tous clients</div>
                </div>
              </div>
            </Card>

            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="md">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Répartition candidats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">En évaluation exclusive</span>
                    <Badge variant="warning">
                      {candidates.filter(c => c.status === 'exclusive_pending').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">En entretien</span>
                    <Badge variant="info">
                      {candidates.filter(c => c.status === 'exclusive_interview').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CRM mutualisé disponible</span>
                    <Badge variant="success">
                      {candidates.filter(c => c.status === 'shared_available').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recrutés</span>
                    <Badge variant="primary">
                      {candidates.filter(c => c.status.includes('accepted') || c.status.includes('hired')).length}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Performance système
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Candidats transférés</span>
                    <span className="font-medium">{analytics.candidatesTransferred}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Offres actives</span>
                    <span className="font-medium">{analytics.activeOffers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Postes pourvus</span>
                    <span className="font-medium">{analytics.filledPositions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux handibienveillance</span>
                    <span className="font-medium">
                      {Math.round((candidates.filter(c => c.handibienveillanceProfile).length / candidates.length) * 100)}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { CRMWorkflowManager };