// src/components/matching/MatchingScore.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  MapPin, 
  Award, 
  Users, 
  DollarSign,
  Accessibility,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { MatchResult, MatchReason } from '@/types';

interface MatchingScoreProps {
  matchResult: MatchResult;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const MatchingScore: React.FC<MatchingScoreProps> = ({
  matchResult,
  showDetails = true,
  variant = 'default',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'reasons' | 'recommendations'>('breakdown');

  const { score, breakdown, confidence, reasons, recommendations } = matchResult;

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent match';
    if (score >= 80) return 'Très bon match';
    if (score >= 70) return 'Bon match';
    if (score >= 60) return 'Match correct';
    if (score >= 40) return 'Match partiel';
    return 'Match faible';
  };

  const getScoreDescription = (score: number): string => {
    if (score >= 90) return 'Ce candidat correspond parfaitement à vos critères';
    if (score >= 80) return 'Ce candidat a un excellent potentiel pour ce poste';
    if (score >= 70) return 'Ce candidat correspond bien à vos besoins';
    if (score >= 60) return 'Ce candidat présente des qualités intéressantes';
    if (score >= 40) return 'Ce candidat nécessite une évaluation approfondie';
    return 'Ce candidat ne correspond pas aux critères principaux';
  };

  const breakdownItems = [
    {
      key: 'skillsMatch' as keyof typeof breakdown,
      label: 'Compétences',
      icon: Award,
      value: breakdown.skillsMatch,
      description: 'Correspondance entre les compétences du candidat et celles requises'
    },
    {
      key: 'experienceMatch' as keyof typeof breakdown,
      label: 'Expérience',
      icon: TrendingUp,
      value: breakdown.experienceMatch,
      description: 'Adéquation du niveau d\'expérience avec les exigences du poste'
    },
    {
      key: 'locationMatch' as keyof typeof breakdown,
      label: 'Localisation',
      icon: MapPin,
      value: breakdown.locationMatch,
      description: 'Proximité géographique et facilité de déplacement'
    },
    {
      key: 'accessibilityMatch' as keyof typeof breakdown,
      label: 'Accessibilité',
      icon: Accessibility,
      value: breakdown.accessibilityMatch,
      description: 'Compatibilité des aménagements et besoins d\'accessibilité'
    },
    {
      key: 'cultureMatch' as keyof typeof breakdown,
      label: 'Culture',
      icon: Users,
      value: breakdown.cultureMatch,
      description: 'Alignement avec les valeurs et la culture d\'entreprise'
    },
    {
      key: 'salaryMatch' as keyof typeof breakdown,
      label: 'Salaire',
      icon: DollarSign,
      value: breakdown.salaryMatch,
      description: 'Compatibilité entre attentes salariales et offre'
    }
  ];

  const getReasonIcon = (reason: MatchReason) => {
    if (reason.positive) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (reason.weight > 0.7) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Card variant="default" padding="sm" className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              {score}%
            </span>
          </div>
          <Badge variant={getScoreColor(score)} size="sm">
            {getScoreLabel(score)}
          </Badge>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card variant="default" padding="md">
        {/* Header principal */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Target className="w-8 h-8 text-primary-600" />
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {score}%
              </div>
              <div className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {confidence}% de confiance
              </div>
            </div>
          </div>
          
          <Badge variant={getScoreColor(score)} size="lg" className="mb-2">
            {getScoreLabel(score)}
          </Badge>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getScoreDescription(score)}
          </p>
        </div>

        {/* Barre de progression principale */}
        <div className="mb-6">
          <ProgressBar 
            value={score} 
            color={getScoreColor(score)} 
            size="lg"
            showValue
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>Match parfait</span>
            <span>100%</span>
          </div>
        </div>

        {/* Détails expandables */}
        {showDetails && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                Voir le détail du matching
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('breakdown')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'breakdown'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Détail par critère
                    </button>
                    <button
                      onClick={() => setActiveTab('reasons')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'reasons'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Raisons
                    </button>
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'recommendations'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Recommandations
                    </button>
                  </div>

                  {/* Contenu des tabs */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'breakdown' && (
                      <motion.div
                        key="breakdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {breakdownItems.map((item, index) => (
                          <motion.div
                            key={item.key}
                            variants={itemVariants}
                            className="relative"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <item.icon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {item.label}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.value}%
                              </span>
                            </div>
                            <ProgressBar 
                              value={item.value} 
                              color={getScoreColor(item.value)} 
                              size="sm"
                            />
                            {variant === 'detailed' && (
                              <p className="mt-1 text-xs text-gray-500">
                                {item.description}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'reasons' && (
                      <motion.div
                        key="reasons"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {reasons.length > 0 ? (
                          reasons.map((reason, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              {getReasonIcon(reason)}
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {reason.description}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="default" size="sm">
                                    {reason.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Poids: {Math.round(reason.weight * 100)}%
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Aucune raison détaillée disponible
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'recommendations' && (
                      <motion.div
                        key="recommendations"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {recommendations.length > 0 ? (
                          recommendations.map((recommendation, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                {recommendation}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Aucune recommandation disponible
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer avec metadata */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Analyse générée le {new Date(matchResult.createdAt).toLocaleDateString('fr-FR')}
            </span>
            <div className="flex items-center space-x-1">
              <Info className="w-3 h-3" />
              <span>IA Handi.jobs</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { MatchingScore };