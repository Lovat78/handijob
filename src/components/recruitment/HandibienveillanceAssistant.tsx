// src/components/recruitment/HandibienveillanceAssistant.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  Eye,
  Heart,
  Award,
  Lightbulb,
  Download,
  Settings
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

interface HandibienveillanceScore {
  global: number;
  language: number;
  accessibility: number;
  inclusion: number;
  discrimination: number;
}

interface Suggestion {
  id: string;
  type: 'language' | 'accessibility' | 'inclusion' | 'discrimination';
  severity: 'critical' | 'important' | 'suggestion';
  original: string;
  suggestion: string;
  reason: string;
  impact: number;
}

interface JobOfferAnalysis {
  score: HandibienveillanceScore;
  suggestions: Suggestion[];
  rewrittenContent: string;
  conformityLevel: 'A' | 'AA' | 'AAA';
  estimatedImpact: {
    candidateReach: number;
    inclusionScore: number;
    legalCompliance: number;
  };
}

const HandibienveillanceAssistant: React.FC = () => {
  const [jobContent, setJobContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobOfferAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'rewrite'>('analysis');
  const { toast } = useToast();

  // Simulation analyse IA handibienveillance
  const analyzeJobOffer = async () => {
    if (!jobContent.trim()) {
      toast.error('Veuillez saisir le contenu de l\'offre d\'emploi');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation délai analyse IA
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulation analyse handibienveillance
    const mockAnalysis: JobOfferAnalysis = {
      score: {
        global: 72,
        language: 68,
        accessibility: 85,
        inclusion: 70,
        discrimination: 65
      },
      suggestions: [
        {
          id: '1',
          type: 'language',
          severity: 'critical',
          original: 'Nous recherchons un développeur senior dynamique',
          suggestion: 'Nous recherchons une personne expérimentée en développement',
          reason: 'Langage inclusif - éviter les termes genrés',
          impact: 15
        },
        {
          id: '2',
          type: 'accessibility',
          severity: 'important',
          original: 'Poste en open space',
          suggestion: 'Environnement de travail adaptable avec espaces calmes disponibles',
          reason: 'Accessibilité cognitive et sensorielle',
          impact: 12
        },
        {
          id: '3',
          type: 'inclusion',
          severity: 'suggestion',
          original: 'Ambiance jeune et dynamique',
          suggestion: 'Équipe collaborative et bienveillante',
          reason: 'Éviter discriminations liées à l\'âge',
          impact: 8
        },
        {
          id: '4',
          type: 'discrimination',
          severity: 'critical',
          original: 'Personne valide uniquement',
          suggestion: 'Poste ouvert à toutes les personnes qualifiées',
          reason: 'Discrimination directe interdite',
          impact: 20
        }
      ],
      rewrittenContent: `# Développeur/se Full Stack - CDI

Notre entreprise recherche une personne expérimentée en développement full stack pour rejoindre notre équipe collaborative et bienveillante.

## Missions
- Développement d'applications web accessibles
- Collaboration avec l'équipe produit
- Participation aux décisions techniques

## Profil recherché  
- Expérience en React/TypeScript
- Connaissance des bonnes pratiques d'accessibilité
- Capacité d'adaptation et de communication

## Environnement de travail
- Environnement adaptable avec espaces calmes disponibles
- Télétravail possible selon préférences
- Équipements ergonomiques fournis
- Accompagnement personnalisé si nécessaire

## Avantages
- Formation continue accessible
- Mutuelle complète incluant handicap
- Comité d'entreprise inclusif
- Évolution de carrière basée sur les compétences

**Poste ouvert à toutes les personnes qualifiées, conformément à notre politique d'inclusion.**`,
      conformityLevel: 'AA',
      estimatedImpact: {
        candidateReach: 35,
        inclusionScore: 28,
        legalCompliance: 95
      }
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    toast.success('Analyse handibienveillance terminée !');
  };

  const applySuggestion = (suggestionId: string) => {
    if (!analysis) return;
    
    const suggestion = analysis.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Appliquer la suggestion au contenu
    const newContent = jobContent.replace(suggestion.original, suggestion.suggestion);
    setJobContent(newContent);
    
    // Mettre à jour le score
    const updatedAnalysis = {
      ...analysis,
      score: {
        ...analysis.score,
        global: Math.min(100, analysis.score.global + suggestion.impact)
      },
      suggestions: analysis.suggestions.filter(s => s.id !== suggestionId)
    };
    
    setAnalysis(updatedAnalysis);
    toast.success('Suggestion appliquée !');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'important': return 'text-orange-600 bg-orange-100';
      case 'suggestion': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Assistant IA Handibienveillance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Analysez et optimisez vos offres d'emploi pour une inclusion parfaite et une conformité RGAA automatique
        </p>
      </div>

      {/* Input Section */}
      <Card padding="lg">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contenu de l'offre d'emploi
            </h2>
          </div>
          
          <textarea
            value={jobContent}
            onChange={(e) => setJobContent(e.target.value)}
            placeholder="Collez ici le contenu de votre offre d'emploi pour analyse handibienveillance..."
            className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {jobContent.length} caractères • RGAA 2.1 AA compliance
            </div>
            
            <Button
              onClick={analyzeJobOffer}
              disabled={isAnalyzing || !jobContent.trim()}
              className="px-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Analyser l'handibienveillance
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <Card padding="lg">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Score <span className="hidden sm:inline">Handibienveillance</span><span className="sm:hidden">Handi</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" className="text-xs">
                      Conformité {analysis.conformityLevel}
                    </Badge>
                    <Badge variant="info" className="text-xs">
                      <span className="hidden sm:inline">RGAA 2.1 AA</span>
                      <span className="sm:hidden">RGAA {analysis.conformityLevel}</span>
                    </Badge>
                  </div>
                </div>

                {/* Global Score */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.score.global)}`}>
                    {analysis.score.global}/100
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Score global d'inclusivité
                  </p>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`text-lg sm:text-xl font-semibold ${getScoreColor(analysis.score.language)}`}>
                      {analysis.score.language}%
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="hidden sm:inline">Langage inclusif</span>
                      <span className="sm:hidden">Langage</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`text-lg sm:text-xl font-semibold ${getScoreColor(analysis.score.accessibility)}`}>
                      {analysis.score.accessibility}%
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="hidden sm:inline">Accessibilité</span>
                      <span className="sm:hidden">Access.</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`text-lg sm:text-xl font-semibold ${getScoreColor(analysis.score.inclusion)}`}>
                      {analysis.score.inclusion}%
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="hidden sm:inline">Inclusion</span>
                      <span className="sm:hidden">Inclusion</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`text-lg sm:text-xl font-semibold ${getScoreColor(analysis.score.discrimination)}`}>
                      {analysis.score.discrimination}%
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="hidden sm:inline">Non-discrimination</span>
                      <span className="sm:hidden">Non-discrim.</span>
                    </p>
                  </div>
                </div>

                {/* Impact Estimation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3 text-sm sm:text-base">
                    <span className="hidden sm:inline">Impact estimé de l'optimisation</span>
                    <span className="sm:hidden">Impact optimisation</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold text-sm sm:text-base">+{analysis.estimatedImpact.candidateReach}%</div>
                      <div className="text-blue-700 dark:text-blue-300">
                        <span className="hidden sm:inline">Portée candidats</span>
                        <span className="sm:hidden">Candidats</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold text-sm sm:text-base">+{analysis.estimatedImpact.inclusionScore}%</div>
                      <div className="text-blue-700 dark:text-blue-300">
                        <span className="hidden sm:inline">Score inclusion</span>
                        <span className="sm:hidden">Inclusion</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold text-sm sm:text-base">{analysis.estimatedImpact.legalCompliance}%</div>
                      <div className="text-blue-700 dark:text-blue-300">
                        <span className="hidden sm:inline">Conformité légale</span>
                        <span className="sm:hidden">Conformité</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Analyse
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'suggestions'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Suggestions ({analysis.suggestions.length})
              </button>
              <button
                onClick={() => setActiveTab('rewrite')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'rewrite'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 inline mr-2" />
                Version optimisée
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card padding="lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Analyse détaillée
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                            Points forts détectés
                          </h4>
                          <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Missions clairement définies
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Évolution de carrière mentionnée
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Télétravail proposé
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                            Points d'amélioration
                          </h4>
                          <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                            <li className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Langage non inclusif détecté
                            </li>
                            <li className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Accessibilité à améliorer
                            </li>
                            <li className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Risques de discrimination
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'suggestions' && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card padding="lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Suggestions d'amélioration
                    </h3>
                    
                    <div className="space-y-4">
                      {analysis.suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="secondary"
                                className={getSeverityColor(suggestion.severity)}
                              >
                                {suggestion.severity}
                              </Badge>
                              <Badge variant="outline">
                                {suggestion.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              +{suggestion.impact} points
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div>
                              <span className="text-sm font-medium text-red-600">Actuel :</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                "{suggestion.original}"
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-green-600">Suggestion :</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                "{suggestion.suggestion}"
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-blue-600">Raison :</span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {suggestion.reason}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => applySuggestion(suggestion.id)}
                            className="w-full"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Appliquer cette suggestion
                          </Button>
                        </div>
                      ))}
                      
                      {analysis.suggestions.length === 0 && (
                        <div className="text-center py-8 text-green-600">
                          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                          <h4 className="font-medium">Parfait !</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Toutes les suggestions ont été appliquées
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'rewrite' && (
                <motion.div
                  key="rewrite"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Version optimisée handibienveillante
                      </h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Settings className="w-4 h-4 mr-2" />
                          Personnaliser
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {analysis.rewrittenContent}
                      </pre>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Version handibienveillante validée !
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            Cette version respecte les standards RGAA 2.1 AA et favorise l'inclusion de tous les profils de candidats.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HandibienveillanceAssistant;

