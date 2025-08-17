// src/components/matching/AIMatchingWidget.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Info,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  X,
  Settings
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useMatching } from '@/hooks/useMatching';
import { MatchResult } from '@/types';

interface AIMatchingWidgetProps {
  candidateId?: string;
  jobId?: string;
  onMatchFound?: (match: MatchResult) => void;
  onViewAllMatches?: () => void;
  className?: string;
}

interface AISuggestion {
  id: string;
  type: 'candidate' | 'job' | 'optimization' | 'insight';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const AIMatchingWidget: React.FC<AIMatchingWidgetProps> = ({
  candidateId,
  jobId,
  onMatchFound,
  onViewAllMatches,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { matches, isLoading, calculateMatch, getMatchingStats } = useMatching();
  
  // Suggestions IA simulées
  const [suggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      type: 'candidate',
      title: '3 nouveaux candidats très compatibles',
      description: 'Des profils avec plus de 85% de matching viennent d\'être détectés',
      confidence: 92,
      actionable: true,
      action: {
        label: 'Voir les candidats',
        onClick: () => onViewAllMatches?.()
      }
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Optimisation suggérée',
      description: 'Ajoutez "React Native" aux compétences pour attirer 15% de candidats en plus',
      confidence: 78,
      actionable: true,
      action: {
        label: 'Appliquer',
        onClick: () => console.log('Optimization applied')
      }
    },
    {
      id: '3',
      type: 'insight',
      title: 'Tendance du marché',
      description: 'Les profils avec accessibilité cognitive sont 23% plus actifs cette semaine',
      confidence: 85,
      actionable: false
    },
    {
      id: '4',
      type: 'job',
      title: 'Similarité détectée',
      description: 'Cette offre ressemble à 94% à votre poste "Dev Frontend" qui a eu 47 candidatures',
      confidence: 94,
      actionable: true,
      action: {
        label: 'Comparer',
        onClick: () => console.log('Compare jobs')
      }
    }
  ]);

  const stats = getMatchingStats();

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [suggestions.length, autoRefresh]);

  const handleAnalyze = async () => {
    if (!candidateId || !jobId) return;
    
    setIsAnalyzing(true);
    try {
      await calculateMatch(candidateId, jobId);
      const newMatch = matches.find(m => m.candidateId === candidateId && m.jobId === jobId);
      if (newMatch) {
        onMatchFound?.(newMatch);
      }
    } catch (error) {
      console.error('Error analyzing match:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTypeIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'candidate': return Users;
      case 'job': return Target;
      case 'optimization': return TrendingUp;
      case 'insight': return Lightbulb;
      default: return Info;
    }
  };

  const getTypeColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'candidate': return 'text-blue-600 bg-blue-100';
      case 'job': return 'text-green-600 bg-green-100';
      case 'optimization': return 'text-purple-600 bg-purple-100';
      case 'insight': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 70) return 'warning';
    return 'error';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card variant="default" padding="md" className="relative overflow-hidden">
        {/* Background gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20" />
        
        {/* Header */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Assistant IA Matching
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suggestions personnalisées
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Paramètres */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Rotation automatique
                  </span>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      autoRefresh ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoRefresh ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Statistiques rapides */}
        {stats && (
          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.totalMatches}
                </div>
                <div className="text-xs text-gray-500">Matches totaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.averageScore}%
                </div>
                <div className="text-xs text-gray-500">Score moyen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.highQualityMatches}
                </div>
                <div className="text-xs text-gray-500">Matches excellents</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestion principale */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Suggestion IA
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {suggestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSuggestion(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSuggestion ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSuggestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              {(() => {
                const suggestion = suggestions[currentSuggestion];
                const IconComponent = getTypeIcon(suggestion.type);
                
                return (
                  <>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(suggestion.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {suggestion.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getConfidenceColor(suggestion.confidence)} size="sm">
                          {suggestion.confidence}% confiance
                        </Badge>
                        {suggestion.type === 'candidate' && (
                          <Star className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      
                      {suggestion.actionable && suggestion.action && (
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<ChevronRight className="w-3 h-3" />}
                          onClick={suggestion.action.onClick}
                        >
                          {suggestion.action.label}
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Actions rapides */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Actions rapides
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              leftIcon={<Target className="w-4 h-4" />}
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={!candidateId || !jobId}
            >
              {isAnalyzing ? 'Analyse...' : 'Analyser match'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<Users className="w-4 h-4" />}
              onClick={onViewAllMatches}
            >
              Voir tous
            </Button>
          </div>
        </motion.div>

        {/* Insights IA */}
        <motion.div variants={itemVariants} className="relative">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Insights IA
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-800 dark:text-green-300">
                  Optimisation des compétences activée
                </span>
              </div>
              <Badge variant="success" size="sm">+12%</Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-3 h-3 text-yellow-600" />
                <span className="text-xs text-yellow-800 dark:text-yellow-300">
                  Période de forte activité détectée
                </span>
              </div>
              <Badge variant="warning" size="sm">Actif</Badge>
            </div>
          </div>
        </motion.div>

        {/* Indicateur de statut IA */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">IA Active</span>
          </div>
        </div>

        {/* Mode de chargement global */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-6 h-6 text-primary-600" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  IA en cours d'analyse...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dernière mise à jour */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Dernière analyse: {new Date().toLocaleTimeString('fr-FR')}
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-primary-500 rounded-full" />
              <span>Handi.jobs AI v2.1</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { AIMatchingWidget };