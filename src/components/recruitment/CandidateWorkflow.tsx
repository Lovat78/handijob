// src/components/recruitment/CandidateWorkflow.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageCircle,
  Calendar,
  Star,
  StarOff,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronRight,
  Plus,
  Download
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, Job } from '@/types';

interface Application {
  id: string;
  candidateId: string;
  candidate: Candidate;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  stage: ApplicationStage;
  appliedAt: string;
  lastUpdated: string;
  score: number;
  notes: ApplicationNote[];
  documents: ApplicationDocument[];
  timeline: ApplicationEvent[];
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected';
type ApplicationStage = 'application' | 'screening' | 'interview1' | 'interview2' | 'final' | 'decision';

interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

interface ApplicationDocument {
  id: string;
  name: string;
  type: 'cv' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  url: string;
  uploadedAt: string;
}

interface ApplicationEvent {
  id: string;
  type: 'status_change' | 'note_added' | 'interview_scheduled' | 'document_uploaded';
  description: string;
  timestamp: string;
  authorName?: string;
}

// Données mockées
const mockApplications: Application[] = [
  {
    id: '1',
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
          { name: 'TypeScript', level: 80, category: 'technical' }
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
    status: 'reviewing',
    stage: 'screening',
    appliedAt: '2024-08-08',
    lastUpdated: '2024-08-10',
    score: 92,
    notes: [
      {
        id: 'n1',
        authorId: 'u2',
        authorName: 'Marie Dubois',
        content: 'Profil très intéressant, expérience solide en React. À contacter rapidement.',
        createdAt: '2024-08-09',
        isPrivate: false
      }
    ],
    documents: [
      {
        id: 'd1',
        name: 'CV_Ahmed_Benali.pdf',
        type: 'cv',
        url: '/documents/cv1.pdf',
        uploadedAt: '2024-08-08'
      }
    ],
    timeline: [
      {
        id: 'e1',
        type: 'status_change',
        description: 'Candidature reçue',
        timestamp: '2024-08-08'
      },
      {
        id: 'e2',
        type: 'note_added',
        description: 'Note ajoutée par Marie Dubois',
        timestamp: '2024-08-09',
        authorName: 'Marie Dubois'
      }
    ],
    tags: ['Prioritaire', 'RQTH'],
    priority: 'high'
  },
  {
    id: '2',
    candidateId: 'c2',
    candidate: {
      id: 'c2',
      userId: 'u3',
      profile: {
        firstName: 'Sophie',
        lastName: 'Martin',
        title: 'Designer UX/UI',
        summary: 'Designer créative spécialisée en accessibilité',
        location: { city: 'Lyon' },
        email: 'sophie.martin@example.fr',
        experience: 3,
        skills: [
          { name: 'Figma', level: 95, category: 'tool' },
          { name: 'Design Systems', level: 85, category: 'technical' },
          { name: 'Accessibilité', level: 90, category: 'technical' }
        ]
      },
      accessibility: {
        needsAccommodation: false,
        accommodationTypes: []
      },
      preferences: {
        contractTypes: ['CDI', 'Freelance'],
        workModes: ['Télétravail', 'Hybride'],
        salaryRange: { min: 40000, max: 50000 },
        locations: ['Lyon', 'Remote']
      },
      availability: true,
      lastActive: '2024-08-09',
      createdAt: '2024-02-01'
    },
    jobId: 'j2',
    job: {
      id: 'j2',
      companyId: 'comp1',
      title: 'Designer UX/UI',
      description: 'Designer pour produits accessibles',
      requirements: ['Figma', 'Design Systems', 'Accessibilité'],
      benefits: ['Remote', 'Formation'],
      contractType: 'CDI',
      workMode: 'Télétravail',
      location: { street: '456 ave Design', city: 'Lyon', zipCode: '69001', country: 'France' },
      salaryMin: 42000,
      salaryMax: 52000,
      accessibilityFeatures: [],
      tags: ['Design', 'Accessibilité'],
      status: 'active',
      aiOptimized: true,
      handibienveillant: true,
      viewCount: 89,
      applicationCount: 12,
      createdAt: '2024-07-20',
      updatedAt: '2024-08-01'
    },
    status: 'shortlisted',
    stage: 'interview1',
    appliedAt: '2024-08-05',
    lastUpdated: '2024-08-10',
    score: 88,
    notes: [],
    documents: [
      {
        id: 'd2',
        name: 'CV_Sophie_Martin.pdf',
        type: 'cv',
        url: '/documents/cv2.pdf',
        uploadedAt: '2024-08-05'
      },
      {
        id: 'd3',
        name: 'Portfolio_Sophie.pdf',
        type: 'portfolio',
        url: '/documents/portfolio1.pdf',
        uploadedAt: '2024-08-05'
      }
    ],
    timeline: [
      {
        id: 'e3',
        type: 'status_change',
        description: 'Candidature reçue',
        timestamp: '2024-08-05'
      },
      {
        id: 'e4',
        type: 'status_change',
        description: 'Passée en shortlist',
        timestamp: '2024-08-07'
      }
    ],
    tags: ['Portfolio+'],
    priority: 'medium'
  }
];

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const variants = {
    new: { variant: 'info' as const, label: 'Nouvelle' },
    reviewing: { variant: 'warning' as const, label: 'En cours' },
    shortlisted: { variant: 'success' as const, label: 'Présélectionnée' },
    interviewing: { variant: 'info' as const, label: 'Entretien' },
    offered: { variant: 'success' as const, label: 'Offre envoyée' },
    hired: { variant: 'success' as const, label: 'Embauchée' },
    rejected: { variant: 'error' as const, label: 'Refusée' }
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};

const PriorityBadge: React.FC<{ priority: Application['priority'] }> = ({ priority }) => {
  const variants = {
    low: { variant: 'default' as const, label: 'Faible' },
    medium: { variant: 'warning' as const, label: 'Moyenne' },
    high: { variant: 'error' as const, label: 'Haute' }
  };

  const config = variants[priority];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};

const ApplicationCard: React.FC<{
  application: Application;
  onViewDetails: (application: Application) => void;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => void;
  onAddNote: (applicationId: string) => void;
}> = ({ application, onViewDetails, onUpdateStatus, onAddNote }) => {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const candidate = application.candidate;

  return (
    <Card padding="md" hoverable>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
              {candidate.profile.firstName[0]}{candidate.profile.lastName[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {candidate.profile.firstName} {candidate.profile.lastName}
                </h3>
                <StatusBadge status={application.status} />
                <PriorityBadge priority={application.priority} />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {candidate.profile.title}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning-500" />
                  <span>Score: {application.score}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Postulé le {new Date(application.appliedAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{candidate.profile.location.city}</span>
                </div>
              </div>

              {/* Tags */}
              {application.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {application.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-[180px]"
                    onMouseLeave={() => setShowActions(false)}
                  >
                    <button
                      onClick={() => {
                        onViewDetails(application);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir le détail
                    </button>
                    
                    <button
                      onClick={() => {
                        onAddNote(application.id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ajouter une note
                    </button>

                    <button
                      onClick={() => {
                        onUpdateStatus(application.id, 'shortlisted');
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Présélectionner
                    </button>

                    <button
                      onClick={() => {
                        onUpdateStatus(application.id, 'rejected');
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-error-600"
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Infos candidat */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Informations candidat</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{candidate.profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{candidate.profile.experience} ans d'expérience</span>
                    </div>
                    {candidate.accessibility.needsAccommodation && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary-500" />
                        <span>Besoins d'aménagement: {candidate.accessibility.accommodationTypes.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compétences principales */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Compétences principales</h4>
                  <div className="space-y-2">
                    {candidate.profile.skills.slice(0, 3).map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" size="sm" onClick={() => onViewDetails(application)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Voir le profil complet
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contacter
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Planifier entretien
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger CV
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

const AddNoteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string, isPrivate: boolean) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSave(note, isPrivate);
      setNote('');
      setIsPrivate(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une note">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ajouter une note sur cette candidature..."
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="private" className="text-sm text-gray-600 dark:text-gray-400">
            Note privée (visible par vous uniquement)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Ajouter la note
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const CandidateWorkflow: React.FC = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Application['priority'] | 'all'>('all');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.candidate.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate.profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (application: Application) => {
    console.log('View details:', application);
    toast.info('Fonctionnalité en cours', 'La vue détaillée sera bientôt disponible');
  };

  const handleUpdateStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status, 
            lastUpdated: new Date().toISOString(),
            timeline: [
              ...app.timeline,
              {
                id: Date.now().toString(),
                type: 'status_change',
                description: `Statut changé vers: ${status}`,
                timestamp: new Date().toISOString()
              }
            ]
          }
        : app
    ));
    toast.success('Statut mis à jour', `La candidature a été mise à jour`);
  };

  const handleAddNote = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setShowNoteModal(true);
  };

  const handleSaveNote = (noteContent: string, isPrivate: boolean) => {
    if (selectedApplicationId) {
      const newNote: ApplicationNote = {
        id: Date.now().toString(),
        authorId: company?.userId || 'current-user',
        authorName: `${company?.name || 'Utilisateur'}`,
        content: noteContent,
        createdAt: new Date().toISOString(),
        isPrivate
      };

      setApplications(prev => prev.map(app => 
        app.id === selectedApplicationId 
          ? { 
              ...app, 
              notes: [...app.notes, newNote],
              lastUpdated: new Date().toISOString(),
              timeline: [
                ...app.timeline,
                {
                  id: Date.now().toString(),
                  type: 'note_added',
                  description: 'Note ajoutée',
                  timestamp: new Date().toISOString(),
                  authorName: newNote.authorName
                }
              ]
            }
          : app
      ));

      toast.success('Note ajoutée', 'La note a été ajoutée à la candidature');
    }
    setShowNoteModal(false);
    setSelectedApplicationId(null);
  };

  const statusCounts = {
    new: applications.filter(app => app.status === 'new').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interviewing: applications.filter(app => app.status === 'interviewing').length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length
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
            Gestion des candidatures
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Suivez et gérez toutes vos candidatures en un seul endroit
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Importer candidatures
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{statusCounts.new}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Nouvelles</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.reviewing}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">En cours</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{statusCounts.shortlisted}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Présélectionnées</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{statusCounts.interviewing}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Entretiens</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{statusCounts.hired}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Embauchées</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Refusées</p>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, poste ou offre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouvelles</option>
                <option value="reviewing">En cours</option>
                <option value="shortlisted">Présélectionnées</option>
                <option value="interviewing">Entretiens</option>
                <option value="hired">Embauchées</option>
                <option value="rejected">Refusées</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Haute priorité</option>
              <option value="medium">Priorité moyenne</option>
              <option value="low">Faible priorité</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ApplicationCard
                application={application}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
                onAddNote={handleAddNote}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredApplications.length === 0 && (
          <Card padding="lg">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Aucune candidature ne correspond à vos critères'
                  : 'Aucune candidature pour le moment'
                }
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Modal d'ajout de note */}
      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setSelectedApplicationId(null);
        }}
        onSave={handleSaveNote}
      />
    </motion.div>
  );
};

export { CandidateWorkflow };