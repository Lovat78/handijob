// src/components/publishing/MultiChannelPublisher.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Share2, 
  Calendar, 
  BarChart3,
  CheckCircle, 
  AlertCircle, 
  Clock,
  Zap,
  Target,
  Send,
  Eye,
  TrendingUp,
  MapPin,
  Users,
  Sparkles,
  Settings,
  Heart,
  RefreshCw
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar, Toggle } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Types
interface PublicationChannel {
  id: string;
  name: string;
  type: 'jobboard' | 'social' | 'specialized';
  icon: React.ReactNode;
  enabled: boolean;
  cost: number;
  reach: number;
  performance: 'excellent' | 'good' | 'average';
  premium: boolean;
  handiFriendly: boolean;
  estimatedViews: number;
  avgApplications: number;
}

interface PublicationAnalytics {
  channelId: string;
  channelName: string;
  views: number;
  clicks: number;
  applications: number;
  cost: number;
  roi: number;
  handiFriendlyScore: number;
}

interface JobPublication {
  id: string;
  title: string;
  description: string;
  handibienveillanceScore: number;
  estimatedBudget: number;
  channels: PublicationChannel[];
  analytics: PublicationAnalytics[];
  status: 'draft' | 'publishing' | 'published' | 'paused' | 'ended';
  totalReach: number;
  totalApplications: number;
}

const MultiChannelPublisher: React.FC = () => {
  const [publication, setPublication] = useState<JobPublication | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'analytics'>('channels');
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);

  const { user } = useAuth();
  const { toast } = useToast();

  // Canaux de diffusion disponibles
  const availableChannels: PublicationChannel[] = [
    // Jobboards principaux
    {
      id: 'indeed',
      name: 'Indeed',
      type: 'jobboard',
      icon: <Globe className="w-5 h-5" />,
      enabled: true,
      cost: 150,
      reach: 95000,
      performance: 'excellent',
      premium: false,
      handiFriendly: true,
      estimatedViews: 15000,
      avgApplications: 45
    },
    {
      id: 'linkedin-jobs',
      name: 'LinkedIn Jobs',
      type: 'jobboard',
      icon: <Users className="w-5 h-5" />,
      enabled: true,
      cost: 200,
      reach: 75000,
      performance: 'excellent',
      premium: true,
      handiFriendly: true,
      estimatedViews: 12000,
      avgApplications: 38
    },
    {
      id: 'apec',
      name: 'Apec',
      type: 'jobboard',
      icon: <Target className="w-5 h-5" />,
      enabled: true,
      cost: 180,
      reach: 45000,
      performance: 'good',
      premium: false,
      handiFriendly: false,
      estimatedViews: 8000,
      avgApplications: 25
    },
    {
      id: 'regionsJob',
      name: 'RegionsJob',
      type: 'jobboard',
      icon: <MapPin className="w-5 h-5" />,
      enabled: true,
      cost: 120,
      reach: 35000,
      performance: 'good',
      premium: false,
      handiFriendly: false,
      estimatedViews: 6000,
      avgApplications: 18
    },
    {
      id: 'hellowork',
      name: 'HelloWork',
      type: 'jobboard',
      icon: <Sparkles className="w-5 h-5" />,
      enabled: true,
      cost: 100,
      reach: 25000,
      performance: 'average',
      premium: false,
      handiFriendly: false,
      estimatedViews: 4000,
      avgApplications: 12
    },

    // Réseaux sociaux
    {
      id: 'linkedin-social',
      name: 'LinkedIn Social',
      type: 'social',
      icon: <Share2 className="w-5 h-5" />,
      enabled: true,
      cost: 80,
      reach: 50000,
      performance: 'good',
      premium: false,
      handiFriendly: true,
      estimatedViews: 8000,
      avgApplications: 15
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      type: 'social',
      icon: <Send className="w-5 h-5" />,
      enabled: true,
      cost: 50,
      reach: 30000,
      performance: 'average',
      premium: false,
      handiFriendly: false,
      estimatedViews: 5000,
      avgApplications: 8
    },
    {
      id: 'facebook',
      name: 'Facebook Jobs',
      type: 'social',
      icon: <Users className="w-5 h-5" />,
      enabled: true,
      cost: 60,
      reach: 40000,
      performance: 'average',
      premium: false,
      handiFriendly: false,
      estimatedViews: 6000,
      avgApplications: 10
    },

    // Sites spécialisés handicap
    {
      id: 'agefiph',
      name: 'Agefiph',
      type: 'specialized',
      icon: <Heart className="w-5 h-5" />,
      enabled: true,
      cost: 0,
      reach: 15000,
      performance: 'excellent',
      premium: false,
      handiFriendly: true,
      estimatedViews: 3000,
      avgApplications: 25
    },
    {
      id: 'mission-handicap',
      name: 'Mission Handicap',
      type: 'specialized',
      icon: <Heart className="w-5 h-5" />,
      enabled: true,
      cost: 50,
      reach: 12000,
      performance: 'excellent',
      premium: false,
      handiFriendly: true,
      estimatedViews: 2500,
      avgApplications: 20
    },
    {
      id: 'myjobcompany',
      name: 'MyJobCompany',
      type: 'specialized',
      icon: <Heart className="w-5 h-5" />,
      enabled: true,
      cost: 80,
      reach: 8000,
      performance: 'good',
      premium: false,
      handiFriendly: true,
      estimatedViews: 1500,
      avgApplications: 12
    }
  ];

  // Simulation données offre actuelle
  useEffect(() => {
    setPublication({
      id: 'job-123',
      title: 'Développeur Full Stack - Accessible et Inclusif',
      description: 'Poste en CDI pour développeur expérimenté, télétravail possible, environnement inclusif...',
      handibienveillanceScore: 87,
      estimatedBudget: 0,
      channels: availableChannels,
      analytics: [],
      status: 'draft',
      totalReach: 0,
      totalApplications: 0
    });
  }, []);

  // Calcul budget et portée estimée
  useEffect(() => {
    if (!publication) return;

    const selected = publication.channels.filter(c => selectedChannels.includes(c.id));
    const budget = selected.reduce((sum, channel) => sum + channel.cost, 0);
    const reach = selected.reduce((sum, channel) => sum + channel.reach, 0);

    setEstimatedBudget(budget);
    setEstimatedReach(reach);
  }, [selectedChannels, publication]);

  // Sélection/désélection canal
  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Sélection rapide par type
  const selectChannelsByType = (type: 'all' | 'recommended' | 'handiFriendly' | 'free') => {
    if (!publication) return;

    let channelsToSelect: string[] = [];

    switch (type) {
      case 'all':
        channelsToSelect = publication.channels.map(c => c.id);
        break;
      case 'recommended':
        channelsToSelect = publication.channels
          .filter(c => c.performance === 'excellent' || (c.performance === 'good' && c.cost < 150))
          .map(c => c.id);
        break;
      case 'handiFriendly':
        channelsToSelect = publication.channels
          .filter(c => c.handiFriendly)
          .map(c => c.id);
        break;
      case 'free':
        channelsToSelect = publication.channels
          .filter(c => c.cost === 0)
          .map(c => c.id);
        break;
    }

    setSelectedChannels(channelsToSelect);
  };

  // Publication multi-canaux
  const publishToChannels = async () => {
    if (selectedChannels.length === 0) {
      toast.error('Aucun canal sélectionné', 'Veuillez sélectionner au moins un canal de diffusion.');
      return;
    }

    setIsPublishing(true);

    try {
      // Simulation publication sur chaque canal
      for (let i = 0; i < selectedChannels.length; i++) {
        const channelId = selectedChannels[i];
        const channel = publication?.channels.find(c => c.id === channelId);
        
        if (channel) {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          console.log(`📡 Publication sur ${channel.name}...`);
          
          const initialAnalytics: PublicationAnalytics = {
            channelId: channel.id,
            channelName: channel.name,
            views: 0,
            clicks: 0,
            applications: 0,
            cost: channel.cost,
            roi: 0,
            handiFriendlyScore: channel.handiFriendly ? 95 : 60
          };

          setPublication(prev => prev ? {
            ...prev,
            analytics: [...prev.analytics, initialAnalytics],
            status: 'publishing'
          } : null);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPublication(prev => prev ? {
        ...prev,
        status: 'published',
        totalReach: estimatedReach,
        totalApplications: 0
      } : null);

      toast.success(
        'Publication réussie !', 
        `Votre offre a été publiée sur ${selectedChannels.length} canaux. Portée estimée : ${estimatedReach.toLocaleString()} candidats.`
      );

      startAnalyticsSimulation();

    } catch (error) {
      toast.error('Erreur de publication', 'Impossible de publier sur certains canaux.');
      setPublication(prev => prev ? { ...prev, status: 'draft' } : null);
    } finally {
      setIsPublishing(false);
    }
  };

  // Simulation métriques temps réel
  const startAnalyticsSimulation = () => {
    const interval = setInterval(() => {
      setPublication(prev => {
        if (!prev || prev.status !== 'published') {
          clearInterval(interval);
          return prev;
        }

        const updatedAnalytics = prev.analytics.map(analytics => ({
          ...analytics,
          views: analytics.views + Math.floor(Math.random() * 50) + 10,
          clicks: analytics.clicks + Math.floor(Math.random() * 15) + 2,
          applications: analytics.applications + Math.floor(Math.random() * 5),
          roi: analytics.applications > 0 ? ((analytics.applications * 1000) / analytics.cost) : 0
        }));

        return {
          ...prev,
          analytics: updatedAnalytics,
          totalApplications: updatedAnalytics.reduce((sum, a) => sum + a.applications, 0)
        };
      });
    }, 3000);

    setTimeout(() => clearInterval(interval), 30000);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChannelTypeIcon = (type: string) => {
    switch (type) {
      case 'jobboard': return <Globe className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      case 'specialized': return <Heart className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (!publication) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement des canaux de diffusion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Diffusion Multi-Canaux
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Maximisez la visibilité de vos offres avec la publication automatique
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="success" className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>Score {publication.handibienveillanceScore}/100</span>
          </Badge>
          
          {publication.status === 'published' && (
            <Badge 
              variant="success"
              className="flex items-center space-x-1"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>En ligne</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Résumé offre */}
      <Card padding="md" className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {publication.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {publication.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-primary-600">{estimatedReach.toLocaleString()}</div>
              <div className="text-gray-500">Portée estimée</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{estimatedBudget}€</div>
              <div className="text-gray-500">Budget total</div>
            </div>
            {publication.status === 'published' && (
              <div className="text-center">
                <div className="font-bold text-blue-600">{publication.totalApplications}</div>
                <div className="text-gray-500">Candidatures</div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('channels')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'channels'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Canaux ({selectedChannels.length}/{availableChannels.length})
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
          {publication.analytics.length > 0 && (
            <Badge variant="primary" size="sm" className="ml-2">
              {publication.analytics.length}
            </Badge>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Onglet Canaux */}
        {activeTab === 'channels' && (
          <motion.div
            key="channels"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sélection rapide */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Sélection rapide
              </h3>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectChannelsByType('all')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Tous les canaux
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectChannelsByType('recommended')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Recommandés
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectChannelsByType('handiFriendly')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Handibienveillants
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectChannelsByType('free')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gratuits
                </Button>
              </div>
            </Card>

            {/* Liste des canaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availableChannels.map((channel) => (
                <Card 
                  key={channel.id}
                  padding="md"
                  className={`cursor-pointer transition-all ${
                    selectedChannels.includes(channel.id)
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleChannel(channel.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        channel.type === 'specialized' ? 'bg-red-100 text-red-600' :
                        channel.type === 'social' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {channel.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {channel.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getChannelTypeIcon(channel.type)}
                          <span className="text-xs text-gray-500 capitalize">
                            {channel.type === 'jobboard' ? 'Job board' : 
                             channel.type === 'social' ? 'Réseau social' : 
                             'Site spécialisé'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Toggle
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Coût :</span>
                      <span className="font-medium">
                        {channel.cost === 0 ? 'Gratuit' : `${channel.cost}€`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Portée :</span>
                      <span className="font-medium">{channel.reach.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Performance :</span>
                      <Badge 
                        variant="secondary"
                        className={getPerformanceColor(channel.performance)}
                        size="sm"
                      >
                        {channel.performance === 'excellent' ? 'Excellente' :
                         channel.performance === 'good' ? 'Bonne' : 'Moyenne'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex space-x-1">
                      {channel.handiFriendly && (
                        <Badge variant="success" size="sm">
                          <Heart className="w-3 h-3 mr-1" />
                          Inclusif
                        </Badge>
                      )}
                      {channel.premium && (
                        <Badge variant="warning" size="sm">
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      ~{channel.avgApplications} candidatures
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Résumé sélection */}
            {selectedChannels.length > 0 && (
              <Card padding="md" className="bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-200">
                      {selectedChannels.length} canaux sélectionnés
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Portée estimée : {estimatedReach.toLocaleString()} candidats • 
                      Budget total : {estimatedBudget}€
                    </p>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={publishToChannels}
                    isLoading={isPublishing}
                    disabled={publication.status === 'published'}
                  >
                    {publication.status === 'published' ? 'Déjà publié' : 'Publier maintenant'}
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Onglet Analytics */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {publication.analytics.length > 0 ? (
              <>
                {/* Métriques globales */}
                <Card padding="md">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Performance globale
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {publication.analytics.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Vues totales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {publication.analytics.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Clics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {publication.totalApplications}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Candidatures</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {estimatedBudget}€
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Budget dépensé</div>
                    </div>
                  </div>
                </Card>

                {/* Performance par canal */}
                <Card padding="md">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Performance par canal
                  </h3>
                  
                  <div className="space-y-4">
                    {publication.analytics.map((analytics) => (
                      <div 
                        key={analytics.channelId}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                            {availableChannels.find(c => c.id === analytics.channelId)?.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {analytics.channelName}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{analytics.views} vues</span>
                              <span>{analytics.clicks} clics</span>
                              <span>{analytics.applications} candidatures</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">
                            ROI: {analytics.roi > 0 ? `${analytics.roi.toFixed(1)}x` : '-'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {analytics.cost}€ dépensé
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card padding="lg">
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucune donnée analytique
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Publiez votre offre pour commencer à collecter des données de performance
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('channels')}
                  >
                    Configurer la publication
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions rapides */}
      {publication.status === 'published' && (
        <Card padding="md" className="bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-200">
                  Publication active
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Votre offre est diffusée sur {selectedChannels.length} canaux
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Voir analytics
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export { MultiChannelPublisher };
