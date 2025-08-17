// src/components/crm/SharedCRMInterface.tsx - US-037 CRM MUTUALISÉ (SUITE)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Users, 
  Share2, 
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Heart,
  Zap,
  Target,
  Award,
  FileText,
  MessageSquare,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

interface SharedCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileScore: number;
  handibienveillanceProfile: boolean;
  availability: 'immediate' | 'negotiable' | 'future';
  profile: {
    skills: string[];
    experience: number;
    education: string;
    location: string;
    remote: boolean;
    salary?: { min: number; max: number; currency: string };
  };
  sharedSince: string;
  previousExclusive: {
    jobTitle: string;
    company: string;
    reason: 'position_filled' | 'rejected' | 'withdrawn';
    date: string;
  };
  matching: {
    globalScore: number;
    topMatches: Array<{
      jobId: string;
      jobTitle: string;
      company: string;
      score: number;
      status: 'suggested' | 'contacted' | 'interviewing' | 'pending';
    }>;
  };
  activity: {
    lastActive: string;
    profileViews: number;
    contactAttempts: number;
    responseRate: number;
  };
  tags: string[];
  aiSuggestions: string[];
  status: 'available' | 'contacted' | 'interviewing' | 'on_hold' | 'hired';
}

interface SharedCRMStats {
  totalCandidates: number;
  availableCandidates: number;
  contactedCandidates: number;
  handibienveillanceCandidates: number;
  avgProfileScore: number;
  newThisWeek: number;
  topSkills: Array<{ skill: string; count: number }>;
}

const SharedCRMInterface: React.FC = () => {
  const [candidates, setCandidates] = useState<SharedCandidate[]>([]);
  const [stats, setStats] = useState<SharedCRMStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'immediate' | 'negotiable' | 'future'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'contacted' | 'interviewing'>('all');
  const [handiFriendlyOnly, setHandiFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'views' | 'matching'>('score');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadSharedCandidates();
  }, []);

  const loadSharedCandidates = async () => {
    // Simulation candidats CRM mutualisé
    const mockCandidates: SharedCandidate[] = [
      {
        id: 'shared-1',
        firstName: 'Thomas',
        lastName: 'Leroy',
        email: 'thomas.leroy@example.com',
        phone: '+33 6 11 22 33 44',
        profileScore: 96,
        handibienveillanceProfile: true,
        availability: 'immediate',
        profile: {
          skills: ['Project Management', 'Agile', 'Scrum', 'Accessibility', 'WCAG', 'Leadership'],
          experience: 8,
          education: 'MBA + Certification Accessibilité',
          location: 'Paris',
          remote: true,
          salary: { min: 65000, max: 80000, currency: 'EUR' }
        },
        sharedSince: '2025-08-10',
        previousExclusive: {
          jobTitle: 'Chef de Projet Senior',
          company: 'TechCorp',
          reason: 'position_filled',
          date: '2025-08-08'
        },
        matching: {
          globalScore: 94,
          topMatches: [
            { jobId: 'job-a', jobTitle: 'Directeur Produit Accessibilité', company: 'AccessTech', score: 98, status: 'suggested' },
            { jobId: 'job-b', jobTitle: 'Chef de Projet Digital', company: 'Innovation Corp', score: 92, status: 'contacted' },
            { jobId: 'job-c', jobTitle: 'Product Owner Senior', company: 'StartupXYZ', score: 89, status: 'suggested' }
          ]
        },
        activity: {
          lastActive: '2025-08-16',
          profileViews: 47,
          contactAttempts: 12,
          responseRate: 85
        },
        tags: ['senior', 'accessibility-expert', 'leadership', 'remote-ok'],
        aiSuggestions: [
          'Profil idéal pour postes direction produit',
          'Forte expertise accessibilité très demandée',
          'Disponibilité immédiate = opportunité'
        ],
        status: 'available'
      },
      {
        id: 'shared-2',
        firstName: 'Sarah',
        lastName: 'Cohen',
        email: 'sarah.cohen@example.com',
        profileScore: 88,
        handibienveillanceProfile: true,
        availability: 'negotiable',
        profile: {
          skills: ['Full Stack', 'React', 'Node.js', 'Python', 'Django', 'Accessibility'],
          experience: 6,
          education: 'École Ingénieur',
          location: 'Lyon',
          remote: true
        },
        sharedSince: '2025-08-12',
        previousExclusive: {
          jobTitle: 'Développeur Full Stack',
          company: 'DevCorp',
          reason: 'rejected',
          date: '2025-08-11'
        },
        matching: {
          globalScore: 86,
          topMatches: [
            { jobId: 'job-d', jobTitle: 'Lead Developer', company: 'TechStart', score: 91, status: 'interviewing' },
            { jobId: 'job-e', jobTitle: 'Senior Full Stack', company: 'WebAgency', score: 84, status: 'contacted' }
          ]
        },
        activity: {
          lastActive: '2025-08-15',
          profileViews: 23,
          contactAttempts: 6,
          responseRate: 92
        },
        tags: ['full-stack', 'accessibility', 'remote', 'responsive'],
        aiSuggestions: [
          'Compétences techniques solides',
          'Expérience accessibilité différenciante',
          'Taux de réponse excellent (92%)'
        ],
        status: 'interviewing'
      },
      {
        id: 'shared-3',
        firstName: 'Marc',
        lastName: 'Dubois',
        email: 'marc.dubois@example.com',
        profileScore: 82,
        handibienveillanceProfile: false,
        availability: 'immediate',
        profile: {
          skills: ['UX Design', 'UI Design', 'Figma', 'Adobe Creative', 'User Research'],
          experience: 4,
          education: 'Master Design',
          location: 'Bordeaux',
          remote: false
        },
        sharedSince: '2025-08-14',
        previousExclusive: {
          jobTitle: 'UX Designer',
          company: 'DesignStudio',
          reason: 'withdrawn',
          date: '2025-08-13'
        },
        matching: {
          globalScore: 79,
          topMatches: [
            { jobId: 'job-f', jobTitle: 'Senior UX Designer', company: 'CreativeAgency', score: 87, status: 'suggested' },
            { jobId: 'job-g', jobTitle: 'Product Designer', company: 'StartupMode', score: 81, status: 'suggested' }
          ]
        },
        activity: {
          lastActive: '2025-08-16',
          profileViews: 15,
          contactAttempts: 3,
          responseRate: 67
        },
        tags: ['design', 'ux', 'creative', 'on-site'],
        aiSuggestions: [
          'Disponibilité immédiate intéressante',
          'Portfolio créatif à valoriser',
          'Préfère travail sur site'
        ],
        status: 'available'
      }
    ];

    // Calcul des statistiques
    const mockStats: SharedCRMStats = {
      totalCandidates: mockCandidates.length,
      availableCandidates: mockCandidates.filter(c => c.status === 'available').length,
      contactedCandidates: mockCandidates.filter(c => c.status === 'contacted' || c.status === 'interviewing').length,
      handibienveillanceCandidates: mockCandidates.filter(c => c.handibienveillanceProfile).length,
      avgProfileScore: Math.round(mockCandidates.reduce((sum, c) => sum + c.profileScore, 0) / mockCandidates.length),
      newThisWeek: mockCandidates.filter(c => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.sharedSince) > weekAgo;
      }).length,
      topSkills: [
        { skill: 'Accessibilité', count: 3 },
        { skill: 'React', count: 2 },
        { skill: 'Python', count: 2 },
        { skill: 'Project Management', count: 1 },
        { skill: 'UX Design', count: 1 }
      ]
    };

    setCandidates(mockCandidates);
    setStats(mockStats);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !skillFilter || 
      candidate.profile.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    const matchesAvailability = availabilityFilter === 'all' || candidate.availability === availabilityFilter;
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesHandiFriendly = !handiFriendlyOnly || candidate.handibienveillanceProfile;

    return matchesSearch && matchesSkill && matchesAvailability && matchesStatus && matchesHandiFriendly;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.profileScore - a.profileScore;
      case 'recent':
        return new Date(b.sharedSince).getTime() - new Date(a.sharedSince).getTime();
      case 'views':
        return b.activity.profileViews - a.activity.profileViews;
      case 'matching':
        return b.matching.globalScore - a.matching.globalScore;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success" className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Disponible</span>
        </Badge>;
      case 'contacted':
        return <Badge variant="info" className="flex items-center space-x-1">
          <Mail className="w-3 h-3" />
          <span>Contacté</span>
        </Badge>;
      case 'interviewing':
        return <Badge variant="warning" className="flex items-center space-x-1">
          <MessageSquare className="w-3 h-3" />
          <span>En entretien</span>
        </Badge>;
      case 'on_hold':
        return <Badge variant="secondary" className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>En attente</span>
        </Badge>;
      case 'hired':
        return <Badge variant="primary" className="flex items-center space-x-1">
          <Award className="w-3 h-3" />
          <span>Recruté</span>
        </Badge>;
      default:
        return <Badge variant="secondary">Statut inconnu</Badge>;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'text-green-600 bg-green-100';
      case 'negotiable': return 'text-orange-600 bg-orange-100';
      case 'future': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const contactCandidate = async (candidateId: string, method: 'email' | 'phone') => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          status: 'contacted' as const,
          activity: {
            ...candidate.activity,
            contactAttempts: candidate.activity.contactAttempts + 1,
            lastActive: new Date().toISOString().split('T')[0]
          }
        };
      }
      return candidate;
    }));

    toast.success(
      'Contact initié',
      `${method === 'email' ? 'Email envoyé' : 'Appel programmé'} avec succès.`
    );
  };

  const bulkContact = async (candidateIds: string[]) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidateIds.includes(candidate.id)) {
        return {
          ...candidate,
          status: 'contacted' as const,
          activity: {
            ...candidate.activity,
            contactAttempts: candidate.activity.contactAttempts + 1
          }
        };
      }
      return candidate;
    }));

    setSelectedCandidates([]);
    toast.success('Contact en masse', `${candidateIds.length} candidats contactés simultanément.`);
  };

  const exportCandidates = () => {
    const dataToExport = filteredCandidates.map(candidate => ({
      nom: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      telephone: candidate.phone || '',
      score: candidate.profileScore,
      competences: candidate.profile.skills.join(', '),
      experience: `${candidate.profile.experience} ans`,
      localisation: candidate.profile.location,
      disponibilite: candidate.availability,
      statut: candidate.status,
      handibienveillance: candidate.handibienveillanceProfile ? 'Oui' : 'Non'
    }));

    // Simulation export CSV
    console.log('Export CSV:', dataToExport);
    toast.success('Export réussi', `${dataToExport.length} candidats exportés au format CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-green-600" />
            <span>CRM Mutualisé</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Candidats disponibles pour tous les clients abonnés
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => bulkContact(selectedCandidates)}
            disabled={selectedCandidates.length === 0}
          >
            <Mail className="w-4 h-4 mr-1" />
            Contacter sélectionnés ({selectedCandidates.length})
          </Button>
          <Button variant="ghost" onClick={exportCandidates}>
            <Download className="w-4 h-4 mr-1" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card padding="md" className="text-center">
            <Database className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalCandidates}</div>
            <div className="text-xs text-gray-500">Total candidats</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.availableCandidates}</div>
            <div className="text-xs text-gray-500">Disponibles</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-1 text-orange-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.contactedCandidates}</div>
            <div className="text-xs text-gray-500">En process</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <Heart className="w-6 h-6 mx-auto mb-1 text-red-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.handibienveillanceCandidates}</div>
            <div className="text-xs text-gray-500">Handibienveillants</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgProfileScore}</div>
            <div className="text-xs text-gray-500">Score moyen</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.newThisWeek}</div>
            <div className="text-xs text-gray-500">Nouveaux (7j)</div>
          </Card>
        </div>
      )}

      {/* Filtres et recherche */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher par nom, email, compétences, localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Compétence..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-32"
            />
            
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toute disponibilité</option>
              <option value="immediate">Immédiate</option>
              <option value="negotiable">Négociable</option>
              <option value="future">Future</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="available">Disponible</option>
              <option value="contacted">Contacté</option>
              <option value="interviewing">En entretien</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="score">Score profil</option>
              <option value="recent">Plus récent</option>
              <option value="views">Plus consulté</option>
              <option value="matching">Meilleur matching</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <Toggle
                checked={handiFriendlyOnly}
                onChange={setHandiFriendlyOnly}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Handibienveillants
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Toggle
                checked={showAISuggestions}
                onChange={setShowAISuggestions}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                IA Suggestions
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
            <Card padding="md" className="hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                {/* Checkbox sélection */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCandidates(prev => [...prev, candidate.id]);
                      } else {
                        setSelectedCandidates(prev => prev.filter(id => id !== candidate.id));
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>
                
                {/* Contenu principal */}
                <div className="flex-1 space-y-3">
                  {/* En-tête */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{candidate.email}</span>
                        {candidate.phone && (
                          <>
                            <span>•</span>
                            <Phone className="w-4 h-4" />
                            <span>{candidate.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(candidate.status)}
                      {candidate.handibienveillanceProfile && (
                        <Badge variant="success" size="sm" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Handibienveillance</span>
                          <span className="sm:hidden">Handi+</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Métriques */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Score Profil</p>
                      <div className="text-lg font-bold text-blue-600">{candidate.profileScore}%</div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Matching Global</p>
                      <div className="text-lg font-bold text-green-600">{candidate.matching.globalScore}%</div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Disponibilité</p>
                      <Badge className={getAvailabilityColor(candidate.availability)} size="sm">
                        {candidate.availability === 'immediate' ? 'Immédiate' :
                         candidate.availability === 'negotiable' ? 'Négociable' : 'Future'}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Activité</p>
                      <div className="flex items-center space-x-1">
                        <div className="text-sm font-medium">{candidate.activity.profileViews} vues</div>
                        <div className={`w-2 h-2 rounded-full ${
                          candidate.activity.responseRate > 80 ? 'bg-green-500' :
                          candidate.activity.responseRate > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Localisation</p>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{candidate.profile.location}</span>
                        {candidate.profile.remote && (
                          <Badge variant="info" size="sm">Remote</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Compétences clés</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.profile.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" size="sm" className="text-xs">
                          {skill.length > 10 ? skill.substring(0, 10) + '...' : skill}
                        </Badge>
                      ))}
                      {candidate.profile.skills.length > 4 && (
                        <Badge variant="secondary" size="sm" className="text-xs">
                          +{candidate.profile.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Top matches */}
                  {candidate.matching.topMatches.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Top Matches IA</p>
                      <div className="space-y-1">
                        {candidate.matching.topMatches.slice(0, 2).map((match, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{match.jobTitle} - {match.company}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-green-600">{match.score}%</span>
                              <Badge 
                                variant={match.status === 'suggested' ? 'secondary' : 'primary'} 
                                size="sm"
                              >
                                {match.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IA Suggestions */}
                  {showAISuggestions && candidate.aiSuggestions.length > 0 && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        IA Insights
                      </p>
                      <div className="space-y-1">
                        {candidate.aiSuggestions.map((suggestion, index) => (
                          <p key={index} className="text-sm text-purple-800 dark:text-purple-200">
                            • {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Historique exclusivité */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Précédente exclusivité</p>
                    <div className="text-sm">
                      <span className="font-medium">{candidate.previousExclusive.jobTitle}</span>
                      <span className="text-gray-500"> chez {candidate.previousExclusive.company}</span>
                      <span className="text-gray-400"> • {candidate.previousExclusive.date}</span>
                      <Badge 
                        variant={
                          candidate.previousExclusive.reason === 'position_filled' ? 'info' :
                          candidate.previousExclusive.reason === 'rejected' ? 'warning' : 'secondary'
                        } 
                        size="sm" 
                        className="ml-2"
                      >
                        {candidate.previousExclusive.reason === 'position_filled' ? 'Poste pourvu' :
                         candidate.previousExclusive.reason === 'rejected' ? 'Non retenu' : 'Désisté'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => contactCandidate(candidate.id, 'email')}
                    disabled={candidate.status === 'hired'}
                    className="text-xs px-2 py-1"
                  >
                    <Mail className="w-3 h-3 sm:mr-1" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                  
                  {candidate.phone && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => contactCandidate(candidate.id, 'phone')}
                      disabled={candidate.status === 'hired'}
                      className="text-xs px-2 py-1"
                    >
                      <Phone className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Appeler</span>
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
                    <FileText className="w-3 h-3 sm:mr-1" />
                    <span className="hidden sm:inline">Profil</span>
                  </Button>
                  
                  {candidate.matching.topMatches.length > 0 && (
                    <Button variant="secondary" size="sm" className="text-xs px-2 py-1">
                      <Target className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Matches</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* État vide */}
      {filteredCandidates.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-8">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Aucun candidat trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajustez vos filtres de recherche ou attendez de nouveaux transferts
            </p>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {filteredCandidates.length > 10 && (
        <Card padding="md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {Math.min(10, filteredCandidates.length)} sur {filteredCandidates.length} candidats
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="ghost" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export { SharedCRMInterface };