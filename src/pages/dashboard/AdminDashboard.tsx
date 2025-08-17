// src/pages/dashboard/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  UserCheck,
  Clock,
  Star
} from 'lucide-react';
import { Button, Card, Badge, Input, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { User, Company, Job, Analytics } from '@/types';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  activeMatches: number;
  oethCompliantCompanies: number;
  accessibilityScore: number;
  monthlyGrowth: number;
  systemHealth: number;
}

interface PlatformActivity {
  id: string;
  type: 'user_registration' | 'job_posted' | 'match_created' | 'company_verified';
  description: string;
  timestamp: string;
  user?: string;
  metadata?: any;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeMatches: 0,
    oethCompliantCompanies: 0,
    accessibilityScore: 0,
    monthlyGrowth: 0,
    systemHealth: 0
  });
  
  const [activities, setActivities] = useState<PlatformActivity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies' | 'jobs' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Simulation des données admin
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1247,
        totalCompanies: 89,
        totalJobs: 342,
        activeMatches: 156,
        oethCompliantCompanies: 67,
        accessibilityScore: 87,
        monthlyGrowth: 12.5,
        systemHealth: 98.7
      });

      setActivities(getMockActivities());
      setUsers(getMockUsers());
      setCompanies(getMockCompanies());
      setJobs(getMockJobs());
      
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les données administrateur');
    } finally {
      setIsLoading(false);
    }
  };

  const getMockActivities = (): PlatformActivity[] => [
    {
      id: '1',
      type: 'user_registration',
      description: 'Nouvel utilisateur inscrit - Marie Dubois',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      user: 'marie.dubois@example.com'
    },
    {
      id: '2',
      type: 'job_posted',
      description: 'Nouvelle offre publiée - Développeur Frontend',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      user: 'TechCorp'
    },
    {
      id: '3',
      type: 'match_created',
      description: 'Nouveau match créé avec score 94%',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '4',
      type: 'company_verified',
      description: 'Entreprise vérifiée - InnovateCorp',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  const getMockUsers = (): User[] => [
    {
      id: '1',
      email: 'marie.dubois@example.com',
      role: 'candidate',
      firstName: 'Marie',
      lastName: 'Dubois',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastLoginAt: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      email: 'jean.martin@techcorp.fr',
      role: 'company',
      firstName: 'Jean',
      lastName: 'Martin',
      isActive: true,
      createdAt: '2024-01-10T09:00:00Z',
      lastLoginAt: '2024-01-20T16:45:00Z'
    }
  ];

  const getMockCompanies = (): Company[] => [
    {
      id: '1',
      userId: '2',
      name: 'TechCorp',
      industry: 'Technologie',
      size: '51-200',
      oethStatus: true,
      oethRate: 6.2,
      address: {
        street: '123 Rue de la Tech',
        city: 'Paris',
        zipCode: '75001',
        country: 'France'
      },
      createdAt: '2024-01-10T09:00:00Z'
    }
  ];

  const getMockJobs = (): Job[] => [
    {
      id: '1',
      companyId: '1',
      title: 'Développeur Frontend React',
      description: 'Poste de développeur frontend...',
      requirements: ['React', 'TypeScript', 'CSS'],
      benefits: ['Télétravail', 'Formation'],
      contractType: 'CDI',
      workMode: 'Hybride',
      location: {
        street: '123 Rue de la Tech',
        city: 'Paris',
        zipCode: '75001',
        country: 'France'
      },
      accessibilityFeatures: [],
      tags: ['Tech', 'Frontend'],
      status: 'active',
      aiOptimized: true,
      handibienveillant: true,
      viewCount: 45,
      applicationCount: 12,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type: PlatformActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'job_posted':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'match_created':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'company_verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: PlatformActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return 'bg-green-50 border-green-200';
      case 'job_posted':
        return 'bg-blue-50 border-blue-200';
      case 'match_created':
        return 'bg-yellow-50 border-yellow-200';
      case 'company_verified':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    toast.info('Action', `${action} pour l'utilisateur ${userId}`);
  };

  const handleCompanyAction = (action: string, companyId: string) => {
    toast.info('Action', `${action} pour l'entreprise ${companyId}`);
  };

  const handleJobAction = (action: string, jobId: string) => {
    toast.info('Action', `${action} pour l'offre ${jobId}`);
  };

  const exportData = (type: string) => {
    toast.success('Export', `Export ${type} en cours...`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données administrateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de la plateforme Handi.jobs
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => exportData('global')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setActiveTab('analytics')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'companies', label: 'Entreprises', icon: Building2 },
            { id: 'jobs', label: 'Offres', icon: Briefcase },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu selon l'onglet actif */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card padding="md" className="bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Utilisateurs Total</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      +{stats.monthlyGrowth}% ce mois
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card padding="md" className="bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Entreprises</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalCompanies}</p>
                    <p className="text-xs text-green-700 mt-1">
                      {stats.oethCompliantCompanies} conformes OETH
                    </p>
                  </div>
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card padding="md" className="bg-gradient-to-r from-purple-50 to-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Offres Actives</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalJobs}</p>
                    <p className="text-xs text-purple-700 mt-1">
                      {stats.activeMatches} matches actifs
                    </p>
                  </div>
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
              </Card>

              <Card padding="md" className="bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Santé Système</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.systemHealth}%</p>
                    <p className="text-xs text-orange-700 mt-1">
                      Score accessibilité: {stats.accessibilityScore}%
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
              </Card>
            </div>

            {/* Graphiques et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score d'accessibilité */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Score d'Accessibilité Plateforme
                  </h3>
                  <Badge variant={stats.accessibilityScore >= 90 ? 'success' : 'warning'}>
                    {stats.accessibilityScore >= 90 ? 'Excellent' : 'Bon'}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>WCAG 2.1 AA</span>
                      <span>{stats.accessibilityScore}%</span>
                    </div>
                    <ProgressBar 
                      value={stats.accessibilityScore} 
                      color="bg-green-600"
                      className="h-2"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>• Navigation clavier: ✅ Conforme</p>
                    <p>• Contraste couleurs: ✅ Conforme</p>
                    <p>• Lecteurs d'écran: ✅ Optimisé</p>
                    <p>• Responsive mobile: ✅ Adaptatif</p>
                  </div>
                </div>
              </Card>

              {/* Activité récente */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Activité Récente
                  </h3>
                  <Button variant="ghost" size="sm">
                    Voir tout
                  </Button>
                </div>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

{activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => exportData('users')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </Button>
            </div>

            {/* Table des utilisateurs */}
            <Card padding="sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={user.role === 'admin' ? 'error' : user.role === 'company' ? 'info' : 'success'}
                          >
                            {user.role === 'admin' ? 'Admin' : 
                             user.role === 'company' ? 'Entreprise' : 'Candidat'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.isActive ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-green-700">Actif</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                <span className="text-sm text-red-700">Inactif</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction('Voir', user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction('Modifier', user.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction('Supprimer', user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
		{activeTab === 'companies' && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres OETH
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => exportData('companies')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </Button>
            </div>

            {/* Table des entreprises */}
            <Card padding="sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Secteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taille
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        OETH
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {company.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {company.address.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{company.industry}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{company.size}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {company.oethStatus ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-700">
                                  {company.oethRate}%
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">N/A</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(company.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompanyAction('Voir', company.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompanyAction('Modifier', company.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompanyAction('Désactiver', company.id)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}	


        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une offre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => exportData('jobs')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </Button>
            </div>

            {/* Table des offres */}
            <Card padding="sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Offre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gary-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vues
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidatures
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Publié
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.contractType} • {job.workMode}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {job.handibienveillant && (
                                <Badge variant="success" size="sm">
                                  Handibienveillant
                                </Badge>
                              )}
                              {job.aiOptimized && (
                                <Badge variant="info" size="sm">
                                  IA Optimisée
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {companies.find(c => c.id === job.companyId)?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={
                              job.status === 'active' ? 'success' :
                              job.status === 'paused' ? 'warning' : 'error'
                            }
                          >
                            {job.status === 'active' ? 'Active' :
                             job.status === 'paused' ? 'En pause' : 
                             job.status === 'closed' ? 'Fermée' : 'Brouillon'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.viewCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.applicationCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(job.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleJobAction('Voir', job.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleJobAction('Modifier', job.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleJobAction('Supprimer', job.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conformité OETH */}
              <Card padding="md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Conformité OETH des Entreprises
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entreprises conformes</span>
                    <span className="text-lg font-semibold text-green-600">
                      {stats.oethCompliantCompanies}/{stats.totalCompanies}
                    </span>
                  </div>
                  <ProgressBar 
                    value={(stats.oethCompliantCompanies / stats.totalCompanies) * 100}
                    color="bg-green-600"
                  />
                  <div className="text-sm text-gray-600">
                    {Math.round((stats.oethCompliantCompanies / stats.totalCompanies) * 100)}% 
                    des entreprises respectent leurs obligations
                  </div>
                </div>
              </Card>

              {/* Croissance utilisateurs */}
              <Card padding="md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Croissance Mensuelle
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary-600">
                      +{stats.monthlyGrowth}%
                    </span>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>• Nouveaux candidats: +45</p>
                    <p>• Nouvelles entreprises: +12</p>
                    <p>• Offres publiées: +78</p>
                  </div>
                </div>
              </Card>

              {/* Performance matching */}
              <Card padding="md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Performance du Matching IA
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">94.2%</div>
                      <div className="text-sm text-gray-600">Précision</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">87.5%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>• Matches créés ce mois: {stats.activeMatches}</p>
                    <p>• Taux de succès: 76%</p>
                    <p>• Temps moyen de traitement: 0.3s</p>
                  </div>
                </div>
              </Card>

              {/* Alertes système */}
              <Card padding="md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Alertes et Monitoring
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-900">
                        Système opérationnel
                      </div>
                      <div className="text-xs text-green-700">
                        Uptime: 99.9% • Latence: 120ms
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="text-sm font-medium text-yellow-900">
                        Maintenance prévue
                      </div>
                      <div className="text-xs text-yellow-700">
                        Demain 02:00 - 04:00 (mise à jour IA)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">
                        Sécurité renforcée
                      </div>
                      <div className="text-xs text-blue-700">
                        2FA activée pour 89% des comptes admin
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Métriques détaillées */}
            <Card padding="md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Métriques Détaillées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {((stats.activeMatches / stats.totalJobs) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de matching</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.activeMatches} matches sur {stats.totalJobs} offres
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    2.4j
                  </div>
                  <div className="text-sm text-gray-600">Temps moyen de recrutement</div>
                  <div className="text-xs text-gray-500 mt-1">
                    -30% par rapport au mois dernier
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    92%
                  </div>
                  <div className="text-sm text-gray-600">Taux de rétention candidats</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Candidats actifs après 3 mois
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;