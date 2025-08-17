// src/components/pipeline/NotificationCenter.tsx - US-038 PIPELINE AUTOMATISÉ
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Settings,
  Send,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Eye,
  Calendar,
  Target,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle, Modal } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Types Notifications
interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'internal';
  category: 'stage_change' | 'reminder' | 'deadline' | 'action_required' | 'welcome' | 'rejection';
  trigger: 'manual' | 'automatic' | 'scheduled';
  subject?: string;
  content: string;
  variables: NotificationVariable[];
  stage?: string;
  delay?: number; // en heures
  conditions?: NotificationCondition[];
  active: boolean;
  recipients: NotificationRecipient[];
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

interface NotificationVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'url';
  required: boolean;
  defaultValue?: string;
  description: string;
}

interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less' | 'in_range';
  value: any;
  description: string;
}

interface NotificationRecipient {
  type: 'candidate' | 'recruiter' | 'manager' | 'team' | 'custom';
  value?: string; // email custom ou ID
  role?: string;
}

interface NotificationHistory {
  id: string;
  templateId: string;
  templateName: string;
  type: 'email' | 'sms' | 'push' | 'internal';
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  recipientEmail: string;
  subject?: string;
  content: string;
  sentAt: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  errorMessage?: string;
  openedAt?: string;
  clickedAt?: string;
  campaignId?: string;
  metadata: Record<string, any>;
}

interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  mostUsedTemplate: string;
  activeTemplates: number;
  pendingNotifications: number;
}

const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history' | 'settings' | 'analytics'>('templates');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    setIsLoading(true);
    
    // Simulation données notifications
    const mockTemplates: NotificationTemplate[] = [
      {
        id: 'tpl-welcome',
        name: 'Accusé réception candidature',
        type: 'email',
        category: 'welcome',
        trigger: 'automatic',
        subject: 'Candidature reçue - {{jobTitle}}',
        content: `Bonjour {{candidateName}},

Nous avons bien reçu votre candidature pour le poste de {{jobTitle}}.

Votre dossier va être étudié par notre équipe dans les prochains jours. Vous recevrez une réponse sous 48 heures.

Nous restons à votre disposition pour toute information.

Cordialement,
L'équipe de recrutement`,
        variables: [
          {
            key: 'candidateName',
            label: 'Nom du candidat',
            type: 'text',
            required: true,
            description: 'Prénom et nom du candidat'
          },
          {
            key: 'jobTitle',
            label: 'Titre du poste',
            type: 'text',
            required: true,
            description: 'Intitulé du poste'
          },
          {
            key: 'companyName',
            label: 'Nom de l\'entreprise',
            type: 'text',
            required: false,
            defaultValue: 'HandiJob',
            description: 'Nom de l\'organisation'
          }
        ],
        stage: 'application',
        delay: 0,
        active: true,
        recipients: [
          {
            type: 'candidate'
          }
        ],
        createdAt: '2025-08-01',
        lastUsed: '2025-08-16',
        usageCount: 47
      },
      {
        id: 'tpl-interview',
        name: 'Invitation entretien',
        type: 'email',
        category: 'stage_change',
        trigger: 'manual',
        subject: 'Invitation entretien - {{jobTitle}}',
        content: `Bonjour {{candidateName}},

Suite à l'étude de votre candidature, nous souhaitons vous rencontrer pour un entretien.

📅 Créneaux proposés :
{{availableSlots}}

Merci de confirmer votre disponibilité en répondant à ce mail.

L'entretien aura lieu :
📍 {{interviewLocation}}
⏰ Durée estimée : {{interviewDuration}}

Nous restons à votre disposition.

Cordialement,
{{recruiterName}}`,
        variables: [
          {
            key: 'candidateName',
            label: 'Nom du candidat',
            type: 'text',
            required: true,
            description: 'Prénom et nom du candidat'
          },
          {
            key: 'jobTitle',
            label: 'Titre du poste',
            type: 'text',
            required: true,
            description: 'Intitulé du poste'
          },
          {
            key: 'availableSlots',
            label: 'Créneaux disponibles',
            type: 'text',
            required: true,
            description: 'Liste des créneaux proposés'
          },
          {
            key: 'interviewLocation',
            label: 'Lieu entretien',
            type: 'text',
            required: true,
            description: 'Adresse ou lien visio'
          },
          {
            key: 'interviewDuration',
            label: 'Durée entretien',
            type: 'text',
            required: false,
            defaultValue: '45 minutes',
            description: 'Durée estimée'
          },
          {
            key: 'recruiterName',
            label: 'Nom recruteur',
            type: 'text',
            required: true,
            description: 'Nom du responsable recrutement'
          }
        ],
        stage: 'interview',
        active: true,
        recipients: [
          {
            type: 'candidate'
          },
          {
            type: 'recruiter'
          }
        ],
        createdAt: '2025-08-01',
        lastUsed: '2025-08-15',
        usageCount: 23
      },
      {
        id: 'tpl-reminder',
        name: 'Rappel action RH',
        type: 'internal',
        category: 'reminder',
        trigger: 'automatic',
        subject: 'Action requise - {{candidateName}}',
        content: `🔔 RAPPEL AUTOMATIQUE

Candidat : {{candidateName}}
Poste : {{jobTitle}}
Étape : {{currentStage}}

Action requise depuis {{daysSinceLastActivity}} jours.

👉 Consulter le dossier : {{candidateUrl}}`,
        variables: [
          {
            key: 'candidateName',
            label: 'Nom du candidat',
            type: 'text',
            required: true,
            description: 'Prénom et nom du candidat'
          },
          {
            key: 'jobTitle',
            label: 'Titre du poste',
            type: 'text',
            required: true,
            description: 'Intitulé du poste'
          },
          {
            key: 'currentStage',
            label: 'Étape actuelle',
            type: 'text',
            required: true,
            description: 'Nom de l\'étape en cours'
          },
          {
            key: 'daysSinceLastActivity',
            label: 'Jours sans activité',
            type: 'number',
            required: true,
            description: 'Nombre de jours depuis dernière action'
          },
          {
            key: 'candidateUrl',
            label: 'Lien candidat',
            type: 'url',
            required: true,
            description: 'URL vers le dossier candidat'
          }
        ],
        delay: 72, // 3 jours
        conditions: [
          {
            field: 'daysSinceLastActivity',
            operator: 'greater',
            value: 3,
            description: 'Plus de 3 jours sans activité'
          }
        ],
        active: true,
        recipients: [
          {
            type: 'recruiter'
          },
          {
            type: 'manager'
          }
        ],
        createdAt: '2025-08-01',
        lastUsed: '2025-08-16',
        usageCount: 15
      },
      {
        id: 'tpl-rejection',
        name: 'Réponse négative bienveillante',
        type: 'email',
        category: 'rejection',
        trigger: 'manual',
        subject: 'Suite à votre candidature - {{jobTitle}}',
        content: `Bonjour {{candidateName}},

Nous vous remercions de l'intérêt que vous portez à notre entreprise et du temps consacré à votre candidature pour le poste de {{jobTitle}}.

Après examen attentif de votre profil, nous ne donnons pas suite à votre candidature pour ce poste spécifique. Cette décision ne remet pas en cause vos compétences professionnelles.

Nous conservons votre candidature dans notre base de données et vous recontacterons si un poste correspondant mieux à votre profil se présentait.

Nous vous souhaitons pleine réussite dans vos recherches.

Cordialement,
L'équipe de recrutement`,
        variables: [
          {
            key: 'candidateName',
            label: 'Nom du candidat',
            type: 'text',
            required: true,
            description: 'Prénom et nom du candidat'
          },
          {
            key: 'jobTitle',
            label: 'Titre du poste',
            type: 'text',
            required: true,
            description: 'Intitulé du poste'
          }
        ],
        stage: 'decision',
        active: true,
        recipients: [
          {
            type: 'candidate'
          }
        ],
        createdAt: '2025-08-01',
        lastUsed: '2025-08-14',
        usageCount: 8
      },
      {
        id: 'tpl-sms-reminder',
        name: 'SMS rappel entretien',
        type: 'sms',
        category: 'reminder',
        trigger: 'automatic',
        content: `Bonjour {{candidateName}}, 

Rappel : entretien prévu demain {{interviewDate}} à {{interviewTime}} pour le poste {{jobTitle}}.

Lieu : {{interviewLocation}}

À bientôt !`,
        variables: [
          {
            key: 'candidateName',
            label: 'Prénom candidat',
            type: 'text',
            required: true,
            description: 'Prénom uniquement pour SMS'
          },
          {
            key: 'interviewDate',
            label: 'Date entretien',
            type: 'date',
            required: true,
            description: 'Date de l\'entretien'
          },
          {
            key: 'interviewTime',
            label: 'Heure entretien',
            type: 'text',
            required: true,
            description: 'Heure de l\'entretien'
          },
          {
            key: 'jobTitle',
            label: 'Poste',
            type: 'text',
            required: true,
            description: 'Titre du poste'
          },
          {
            key: 'interviewLocation',
            label: 'Lieu',
            type: 'text',
            required: true,
            description: 'Lieu ou visio'
          }
        ],
        delay: 24, // 24h avant
        active: true,
        recipients: [
          {
            type: 'candidate'
          }
        ],
        createdAt: '2025-08-05',
        lastUsed: '2025-08-15',
        usageCount: 12
      }
    ];

    const mockHistory: NotificationHistory[] = [
      {
        id: 'hist-1',
        templateId: 'tpl-welcome',
        templateName: 'Accusé réception candidature',
        type: 'email',
        candidateId: 'cand-1',
        candidateName: 'Sarah Martinez',
        candidateEmail: 'sarah.martinez@example.com',
        recipientEmail: 'sarah.martinez@example.com',
        subject: 'Candidature reçue - Développeur Full Stack Senior',
        content: 'Email personnalisé envoyé...',
        sentAt: '2025-08-16T09:15:00Z',
        status: 'opened',
        openedAt: '2025-08-16T09:32:00Z',
        metadata: {
          jobTitle: 'Développeur Full Stack Senior',
          companyName: 'HandiJob'
        }
      },
      {
        id: 'hist-2',
        templateId: 'tpl-interview',
        templateName: 'Invitation entretien',
        type: 'email',
        candidateId: 'cand-2',
        candidateName: 'Ahmed Benali',
        candidateEmail: 'ahmed.benali@example.com',
        recipientEmail: 'ahmed.benali@example.com',
        subject: 'Invitation entretien - Développeur Full Stack Senior',
        content: 'Invitation personnalisée...',
        sentAt: '2025-08-15T14:20:00Z',
        status: 'clicked',
        openedAt: '2025-08-15T14:45:00Z',
        clickedAt: '2025-08-15T14:47:00Z',
        metadata: {
          jobTitle: 'Développeur Full Stack Senior',
          recruiterName: 'Pierre Martin'
        }
      },
      {
        id: 'hist-3',
        templateId: 'tpl-sms-reminder',
        templateName: 'SMS rappel entretien',
        type: 'sms',
        candidateId: 'cand-2',
        candidateName: 'Ahmed Benali',
        candidateEmail: 'ahmed.benali@example.com',
        recipientEmail: '+33612345678',
        content: 'Bonjour Ahmed, Rappel : entretien prévu demain...',
        sentAt: '2025-08-16T08:00:00Z',
        status: 'delivered',
        metadata: {
          jobTitle: 'Développeur Full Stack Senior',
          interviewDate: '17/08/2025'
        }
      },
      {
        id: 'hist-4',
        templateId: 'tpl-reminder',
        templateName: 'Rappel action RH',
        type: 'internal',
        candidateId: 'cand-3',
        candidateName: 'Julie Moreau',
        candidateEmail: 'julie.moreau@example.com',
        recipientEmail: 'rh@handijob.com',
        subject: 'Action requise - Julie Moreau',
        content: 'Candidat en attente depuis 4 jours...',
        sentAt: '2025-08-16T10:00:00Z',
        status: 'sent',
        metadata: {
          jobTitle: 'UX Designer Inclusif',
          daysSinceLastActivity: 4
        }
      },
      {
        id: 'hist-5',
        templateId: 'tpl-rejection',
        templateName: 'Réponse négative bienveillante',
        type: 'email',
        candidateId: 'cand-4',
        candidateName: 'Marc Dubois',
        candidateEmail: 'marc.dubois@example.com',
        recipientEmail: 'marc.dubois@example.com',
        subject: 'Suite à votre candidature - Chef de Projet',
        content: 'Réponse négative personnalisée...',
        sentAt: '2025-08-15T16:30:00Z',
        status: 'opened',
        openedAt: '2025-08-15T17:15:00Z',
        metadata: {
          jobTitle: 'Chef de Projet Digital'
        }
      }
    ];

    const mockStats: NotificationStats = {
      totalSent: 156,
      deliveryRate: 98.2,
      openRate: 67.5,
      clickRate: 23.8,
      bounceRate: 1.8,
      mostUsedTemplate: 'Accusé réception candidature',
      activeTemplates: mockTemplates.filter(t => t.active).length,
      pendingNotifications: 3
    };

    setTemplates(mockTemplates);
    setHistory(mockHistory);
    setStats(mockStats);
    setIsLoading(false);
  };

  const sendTestNotification = async (template: NotificationTemplate) => {
    if (!user?.email) {
      toast.error('Erreur', 'Utilisateur non connecté');
      return;
    }

    // Simulation envoi test
    const testHistory: NotificationHistory = {
      id: `test-${Date.now()}`,
      templateId: template.id,
      templateName: `[TEST] ${template.name}`,
      type: template.type,
      candidateId: 'test-candidate',
      candidateName: 'Test Candidat',
      candidateEmail: 'test@example.com',
      recipientEmail: user.email,
      subject: template.subject?.replace(/\{\{.*?\}\}/g, '[VARIABLE]'),
      content: template.content.replace(/\{\{.*?\}\}/g, '[VARIABLE]'),
      sentAt: new Date().toISOString(),
      status: 'sent',
      metadata: {
        isTest: true
      }
    };

    setHistory(prev => [testHistory, ...prev]);
    
    if (soundEnabled) {
      // Son notification (simulation)
      console.log('🔔 Son notification envoyé');
    }

    toast.success('Test envoyé', `Notification ${template.type} envoyée à ${user.email}`);
    setIsTestModalOpen(false);
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        return { ...template, active: !template.active };
      }
      return template;
    }));

    const template = templates.find(t => t.id === templateId);
    toast.success(
      'Template modifié',
      `"${template?.name}" ${template?.active ? 'désactivé' : 'activé'}`
    );
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template supprimé', `"${template.name}" supprimé avec succès`);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchTerm || 
      item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'opened':
        return <Eye className="w-4 h-4 text-purple-600" />;
      case 'clicked':
        return <Target className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      case 'internal':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bell className="w-8 h-8 mx-auto mb-4 animate-pulse text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement des notifications...</p>
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
            Centre de Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestion des communications automatisées du pipeline
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {stats && (
            <>
              <Badge variant="primary" className="flex items-center space-x-1">
                <Send className="w-4 h-4" />
                <span>{stats.totalSent} envoyés</span>
              </Badge>
              <Badge variant="success" className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{stats.openRate}% ouverture</span>
              </Badge>
              {stats.pendingNotifications > 0 && (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{stats.pendingNotifications} en attente</span>
                </Badge>
              )}
            </>
          )}
          
          <Button
            variant={soundEnabled ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouveau template
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Edit className="w-4 h-4 inline mr-2" />
          Templates ({filteredTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Historique ({filteredHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Paramètres
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Templates */}
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtres Templates */}
            <Card padding="md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Rechercher templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Tous types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                    <option value="internal">Interne</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Liste Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        template.type === 'email' ? 'bg-blue-100 text-blue-600' :
                        template.type === 'sms' ? 'bg-green-100 text-green-600' :
                        template.type === 'push' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" size="sm">
                            {template.category}
                          </Badge>
                          {template.trigger === 'automatic' && (
                            <Badge variant="primary" size="sm">
                              <Zap className="w-3 h-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Toggle
                      checked={template.active}
                      onChange={() => toggleTemplate(template.id)}
                      size="sm"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {template.subject && (
                      <div className="font-medium mb-1">📧 {template.subject}</div>
                    )}
                    {template.content.substring(0, 120)}...
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.usageCount} utilisations</span>
                    <span>Modifié {template.lastUsed}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsTestModalOpen(true);
                      }}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsTemplateModalOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucun template trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Créez votre premier template de notification
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setIsTemplateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un template
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Historique */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtres Historique */}
            <Card padding="md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Rechercher dans l'historique..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Tous types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                    <option value="internal">Interne</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="pending">En attente</option>
                    <option value="sent">Envoyé</option>
                    <option value="delivered">Délivré</option>
                    <option value="opened">Ouvert</option>
                    <option value="clicked">Cliqué</option>
                    <option value="failed">Échec</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Liste Historique */}
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <Card key={item.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'email' ? 'bg-blue-100 text-blue-600' :
                        item.type === 'sms' ? 'bg-green-100 text-green-600' :
                        item.type === 'push' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getTypeIcon(item.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.templateName}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <Badge variant={
                              item.status === 'delivered' || item.status === 'opened' || item.status === 'clicked' ? 'success' :
                              item.status === 'failed' ? 'error' :
                              item.status === 'pending' ? 'warning' : 'secondary'
                            } size="sm">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.subject && (
                            <div className="font-medium">📧 {item.subject}</div>
                          )}
                          <div>
                            👤 {item.candidateName} • 📧 {item.recipientEmail}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📤 {new Date(item.sentAt).toLocaleString('fr-FR')}</span>
                          {item.openedAt && (
                            <span>👁️ Ouvert {new Date(item.openedAt).toLocaleString('fr-FR')}</span>
                          )}
                          {item.clickedAt && (
                            <span>🖱️ Cliqué {new Date(item.clickedAt).toLocaleString('fr-FR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredHistory.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucune notification trouvée
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    L'historique apparaîtra ici une fois les premières notifications envoyées
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && stats && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Métriques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card padding="md" className="text-center">
                <Send className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSent}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total envoyés</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.deliveryRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taux de livraison</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.openRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taux d'ouverture</div>
              </Card>
              
              <Card padding="md" className="text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.clickRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taux de clic</div>
              </Card>
            </div>

            {/* Templates les plus utilisés */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Templates les plus utilisés
              </h3>
              <div className="space-y-3">
                {templates
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <div className={`p-2 rounded ${
                          template.type === 'email' ? 'bg-blue-100 text-blue-600' :
                          template.type === 'sms' ? 'bg-green-100 text-green-600' :
                          template.type === 'push' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getTypeIcon(template.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {template.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {template.usageCount}
                        </div>
                        <div className="text-sm text-gray-500">utilisations</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Paramètres */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres généraux
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Sons de notification
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Jouer un son lors des nouvelles notifications
                    </div>
                  </div>
                  <Toggle
                    checked={soundEnabled}
                    onChange={setSoundEnabled}
                  />
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    Fournisseurs de services
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-gray-500">SendGrid</div>
                        </div>
                      </div>
                      <Badge variant="success">Connecté</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">SMS</div>
                          <div className="text-sm text-gray-500">Twilio</div>
                        </div>
                      </div>
                      <Badge variant="success">Connecté</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Push</div>
                          <div className="text-sm text-gray-500">Firebase</div>
                        </div>
                      </div>
                      <Badge variant="warning">Configuration requise</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Test Notification */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Tester la notification"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedTemplate.name}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Type: {selectedTemplate.type} • Catégorie: {selectedTemplate.category}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Cette notification de test sera envoyée à votre adresse email avec des variables de démonstration.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setIsTestModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={() => sendTestNotification(selectedTemplate)}
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer le test
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export { NotificationCenter };