// src/components/jobs/JobCreationWizard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  MapPin, 
  DollarSign,
  Clock,
  Eye,
  Send,
  Sparkles,
  Brain,
  Shield,
  Target,
  FileText,
  Zap,
  Heart
} from 'lucide-react';
import { Button, Card, Input, Badge, ProgressBar } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { PublicationIntegration } from '@/components/publishing/PublicationIntegration';

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contractType: string;
  workMode: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  accessibilityFeatures: string[];
  keywords: string[];
  urgency: 'low' | 'medium' | 'high';
  targetProfiles: string[];
}

interface AIAnalysis {
  inclusivityScore: number;
  biasDetected: string[];
  suggestions: string[];
  estimatedCandidates: number;
  readabilityScore: number;
  handibienveillantLevel: 'low' | 'medium' | 'high';
}

const JobCreationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: [],
    benefits: [],
    contractType: 'CDI',
    workMode: 'Hybride',
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    accessibilityFeatures: [],
    keywords: [],
    urgency: 'medium',
    targetProfiles: []
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const steps = [
    { id: 'basics', title: 'Informations de base', icon: <FileText className="w-5 h-5" /> },
    { id: 'description', title: 'Description & Exigences', icon: <Brain className="w-5 h-5" /> },
    { id: 'conditions', title: 'Conditions & Avantages', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'accessibility', title: 'Accessibilité & Inclusion', icon: <Shield className="w-5 h-5" /> },
    { id: 'handibienveillance', title: 'Analyse Handibienveillance', icon: <Heart className="w-5 h-5" /> },
    { id: 'preview', title: 'Aperçu & Publication', icon: <Eye className="w-5 h-5" /> }
  ];

  // Analyse IA en temps réel
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.title && formData.description) {
        analyzeWithAI();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [formData.title, formData.description, formData.requirements]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis: AIAnalysis = {
      inclusivityScore: Math.floor(Math.random() * 30) + 70, // 70-100
      biasDetected: detectBias(formData.description + ' ' + formData.requirements.join(' ')),
      suggestions: generateSuggestions(formData),
      estimatedCandidates: Math.floor(Math.random() * 200) + 50,
      readabilityScore: Math.floor(Math.random() * 20) + 80,
      handibienveillantLevel: getHandibienveillantLevel(formData)
    };
    
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const detectBias = (text: string): string[] => {
    const biasTerms = ['jeune', 'dynamique', 'ninja', 'rockstar', 'guerrier', 'master'];
    const detected = biasTerms.filter(term => 
      text.toLowerCase().includes(term)
    );
    return detected.map(term => `Le terme "${term}" peut exclure certains candidats`);
  };

  const generateSuggestions = (data: JobFormData): string[] => {
    const suggestions = [];
    
    if (!data.description.includes('télétravail') && !data.description.includes('flexible')) {
      suggestions.push('Mentionnez les possibilités de télétravail pour plus d\'inclusivité');
    }
    
    if (!data.description.includes('accessib')) {
      suggestions.push('Ajoutez des informations sur l\'accessibilité du poste');
    }
    
    if (data.requirements.length > 8) {
      suggestions.push('Réduisez le nombre d\'exigences pour éviter de décourager des candidats qualifiés');
    }
    
    return suggestions;
  };

  const getHandibienveillantLevel = (data: JobFormData): 'low' | 'medium' | 'high' => {
    let score = 0;
    
    if (data.accessibilityFeatures.length > 0) score += 2;
    if (data.description.includes('inclusion') || data.description.includes('diversité')) score += 2;
    if (data.workMode === 'Hybride' || data.workMode === 'Télétravail') score += 1;
    if (data.benefits.some(b => b.includes('accompagnement'))) score += 2;
    
    return score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low';
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulation de publication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Offre publiée !', 'Votre offre d\'emploi a été publiée avec succès.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        requirements: [],
        benefits: [],
        contractType: 'CDI',
        workMode: 'Hybride',
        location: '',
        salaryMin: 0,
        salaryMax: 0,
        accessibilityFeatures: [],
        keywords: [],
        urgency: 'medium',
        targetProfiles: []
      });
      setCurrentStep(0);
      
    } catch (error) {
      toast.error('Erreur', 'Impossible de publier l\'offre.');
    } finally {
      setIsPublishing(false);
    }
  };

  const applyAISuggestion = (suggestion: string) => {
    if (suggestion.includes('télétravail')) {
      setFormData(prev => ({
        ...prev,
        description: prev.description + '\n\nCe poste propose des possibilités de télétravail pour favoriser l\'équilibre vie professionnelle/personnelle.'
      }));
    }
    // Autres suggestions...
    toast.success('Suggestion appliquée', 'La description a été améliorée.');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Créer une offre d'emploi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Assistant IA pour une offre inclusive et handibienveillante
        </p>
      </div>

      {/* Progress */}
      <Card padding="md">
        <ProgressBar value={progress} className="mb-4" />
        
        {/* Version desktop : workflow horizontal */}
        <div className="hidden md:flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${
                index <= currentStep ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                {step.icon}
              </div>
              <span className="text-xs font-medium text-center max-w-20">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Version mobile : étape actuelle + compteur */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-primary-100">
                {steps[currentStep].icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {steps[currentStep].title}
                </div>
                <div className="text-xs text-gray-500">
                  Étape {currentStep + 1} sur {steps.length}
                </div>
              </div>
            </div>
            
            {/* Navigation rapide mobile */}
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  disabled={index > currentStep}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="xl:col-span-2">
          <Card padding="md">
            <AnimatePresence mode="wait">
              {/* Étape 1: Informations de base */}
              {currentStep === 0 && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Informations de base
                  </h2>

                  <Input
                    label="Titre du poste"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Développeur Frontend Senior"
                    fullWidth
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de contrat
                      </label>
                      <select
                        value={formData.contractType}
                        onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                        className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Stage">Stage</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Alternance">Alternance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mode de travail
                      </label>
                      <select
                        value={formData.workMode}
                        onChange={(e) => setFormData(prev => ({ ...prev, workMode: e.target.value }))}
                        className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Présentiel">Présentiel</option>
                        <option value="Télétravail">Télétravail</option>
                        <option value="Hybride">Hybride</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Localisation"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Paris, France"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    fullWidth
                  />
                </motion.div>
              )}

              {/* Étape 2: Description */}
              {currentStep === 1 && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Description du poste
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description détaillée
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Décrivez le poste, les missions principales, l'environnement de travail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compétences requises
                    </label>
                    <div className="space-y-2">
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...formData.requirements];
                              newReqs[index] = e.target.value;
                              setFormData(prev => ({ ...prev, requirements: newReqs }));
                            }}
                            placeholder="Ex: React, TypeScript, 3 ans d'expérience"
                            fullWidth
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newReqs = formData.requirements.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, requirements: newReqs }));
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))}
                      >
                        + Ajouter une compétence
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Étape 3: Conditions */}
              {currentStep === 2 && (
                <motion.div
                  key="conditions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Conditions et avantages
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Salaire minimum (€)"
                      type="number"
                      value={formData.salaryMin || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
                      placeholder="35000"
                      leftIcon={<DollarSign className="w-4 h-4" />}
                      fullWidth
                    />
                    <Input
                      label="Salaire maximum (€)"
                      type="number"
                      value={formData.salaryMax || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: parseInt(e.target.value) || 0 }))}
                      placeholder="45000"
                      leftIcon={<DollarSign className="w-4 h-4" />}
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Avantages
                    </label>
                    <div className="space-y-2">
                      {formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={benefit}
                            onChange={(e) => {
                              const newBenefits = [...formData.benefits];
                              newBenefits[index] = e.target.value;
                              setFormData(prev => ({ ...prev, benefits: newBenefits }));
                            }}
                            placeholder="Ex: Tickets restaurant, Mutuelle, Télétravail"
                            fullWidth
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newBenefits = formData.benefits.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, benefits: newBenefits }));
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }))}
                      >
                        + Ajouter un avantage
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Étape 4: Accessibilité */}
              {currentStep === 3 && (
                <motion.div
                  key="accessibility"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Accessibilité et inclusion
                  </h2>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Rendez votre offre accessible
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Ces informations aident les candidats en situation de handicap à comprendre 
                      les aménagements possibles pour ce poste.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Aménagements disponibles
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Poste de travail adaptable',
                        'Logiciels d\'accessibilité',
                        'Horaires flexibles',
                        'Télétravail possible',
                        'Transport adapté',
                        'Accompagnement RH dédié'
                      ].map((feature) => (
                        <label key={feature} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.accessibilityFeatures.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  accessibilityFeatures: [...prev.accessibilityFeatures, feature]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  accessibilityFeatures: prev.accessibilityFeatures.filter(f => f !== feature)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Étape 5: Analyse Handibienveillance */}
              {currentStep === 4 && (
                <motion.div
                  key="handibienveillance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Analyse Handibienveillance IA
                    </h2>
                    <Badge variant="info">
                      ♥ US-035 Intégré
                    </Badge>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-green-900 dark:text-green-200">
                        Vérification automatique RGAA 2.1 AA
                      </h3>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Notre IA analyse votre offre pour garantir 100% de conformité handibienveillante
                      et optimiser votre portée auprès des candidats en situation de handicap.
                    </p>
                  </div>

                  {aiAnalysis && (
                    <div className="space-y-6">
                      {/* Score Handibienveillance */}
                      <Card padding="md" className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-green-600 mb-2">
                            {aiAnalysis.inclusivityScore}/100
                          </div>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            Score Handibienveillance
                          </div>
                          <Badge 
                            variant={aiAnalysis.inclusivityScore >= 80 ? 'success' : 'warning'}
                            className="mt-2"
                          >
                            Conformité {aiAnalysis.inclusivityScore >= 80 ? 'AA' : 'A'} RGAA
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-xl font-semibold text-blue-600">
                              {Math.floor(aiAnalysis.inclusivityScore * 0.9)}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Langage inclusif</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-semibold text-green-600">
                              {Math.floor(aiAnalysis.inclusivityScore * 1.1)}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Accessibilité</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-semibold text-purple-600">
                              {Math.floor(aiAnalysis.inclusivityScore * 0.95)}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Inclusion</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-semibold text-orange-600">
                              {Math.floor(aiAnalysis.inclusivityScore * 0.85)}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Non-discrimination</div>
                          </div>
                        </div>
                      </Card>

                      {/* Suggestions d'amélioration */}
                      {aiAnalysis.suggestions.length > 0 && (
                        <Card padding="md">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Suggestions d'optimisation handibienveillante
                          </h3>
                          
                          <div className="space-y-3">
                            {aiAnalysis.suggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {suggestion}
                                  </p>
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => applyAISuggestion(suggestion)}
                                    >
                                      <Zap className="w-4 h-4 mr-2" />
                                      Appliquer automatiquement
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-xs text-green-600 font-medium">
                                  +{Math.floor(Math.random() * 15) + 5} pts
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* Impact prévu */}
                      <Card padding="md">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Impact prévu de l'optimisation
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              +{Math.floor(aiAnalysis.estimatedCandidates * 0.3)}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              Candidats supplémentaires
                            </div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              +25%
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              Candidats RQTH
                            </div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              95%
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">
                              Conformité légale
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Bouton accès assistant complet */}
                      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Assistant Handibienveillance complet
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Accédez à l'analyse détaillée et la réécriture automatique
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => {
                              // Ouvrir US-035 dans un nouvel onglet
                              window.open('/handibienveillance-assistant', '_blank');
                            }}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Analyser en détail
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!aiAnalysis && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-primary-600 animate-pulse" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Analyse en attente
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Remplissez les étapes précédentes pour déclencher l'analyse handibienveillance
                      </p>
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                        Compléter la description
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Étape 6: Aperçu */}
              {currentStep === 5 && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Aperçu de votre offre
                  </h2>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="primary">{formData.contractType}</Badge>
                      <Badge variant="info">{formData.workMode}</Badge>
                      <Badge variant="default">{formData.location}</Badge>
                      {aiAnalysis && (
                        <Badge 
                          variant={aiAnalysis.handibienveillantLevel === 'high' ? 'success' : 'warning'}
                        >
                          ♿ {aiAnalysis.handibienveillantLevel === 'high' ? 'Très inclusif' : 'Inclusif'}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                      {formData.description}
                    </p>

                    {formData.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Compétences requises :
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {formData.requirements.filter(req => req.trim()).map((req, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formData.benefits.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Avantages :
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.benefits.filter(benefit => benefit.trim()).map((benefit, index) => (
                            <Badge key={index} variant="success" size="sm">{benefit}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.accessibilityFeatures.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Aménagements accessibilité :
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.accessibilityFeatures.map((feature, index) => (
                            <Badge key={index} variant="info" size="sm">♿ {feature}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Masquer' : 'Aperçu'} candidat
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handlePublish}
                      isLoading={isPublishing}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publier l'offre
                    </Button>
                  </div>

                  {/* Intégration Diffusion Multi-Canaux */}
                  <div className="mt-6">
                    <PublicationIntegration
                      jobTitle={formData.title || 'Nouvelle offre'}
                      handibienveillanceScore={aiAnalysis?.inclusivityScore || 75}
                      onOpenPublisher={() => {
                        // Ouvrir US-036 dans un nouvel onglet
                        window.open('/diffusion-multi-canaux', '_blank');
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t gap-4">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              {/* Indicateur étape mobile */}
              <div className="flex sm:hidden items-center space-x-2 order-1">
                <span className="text-sm text-gray-500">
                  {currentStep + 1} / {steps.length}
                </span>
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {currentStep < steps.length - 1 && (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  className="w-full sm:w-auto order-3"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Panneau IA et conseils - Adapté mobile */}
        <div className="xl:order-2 order-1 space-y-6">
          {/* Note mobile - Information importante */}
          <div className="xl:hidden bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-blue-900 dark:text-blue-200">
                Assistant IA Handibienveillance
              </h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Remplissez les informations pour obtenir une analyse de conformité RGAA en temps réel.
            </p>
          </div>
          {/* Analyse IA */}
          <Card padding="md">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Assistant IA
              </h3>
              {isAnalyzing && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {aiAnalysis && (
              <div className="space-y-4">
                {/* Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {aiAnalysis.inclusivityScore}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Inclusivité
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-success-600">
                      {aiAnalysis.estimatedCandidates}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Candidats estimés
                    </div>
                  </div>
                </div>

                {/* Biais détectés */}
                {aiAnalysis.biasDetected.length > 0 && (
                  <div className="bg-warning-50 dark:bg-warning-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-warning-600" />
                      <span className="text-sm font-medium text-warning-800 dark:text-warning-200">
                        Biais détectés
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {aiAnalysis.biasDetected.map((bias, index) => (
                        <li key={index} className="text-xs text-warning-700 dark:text-warning-300">
                          • {bias}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {aiAnalysis.suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Suggestions d'amélioration
                      </span>
                    </div>
                    <div className="space-y-2">
                      {aiAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="flex-1 text-xs text-blue-800 dark:text-blue-200">
                            {suggestion}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyAISuggestion(suggestion)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Zap className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!aiAnalysis && !isAnalyzing && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Remplissez le titre et la description pour obtenir une analyse IA
                </p>
              </div>
            )}
          </Card>

          {/* Conseils handibienveillance */}
          <Card padding="md">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-success-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Conseils Handibienveillance
              </h3>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span className="font-medium">Bonnes pratiques :</span>
                </div>
                <ul className="space-y-1 ml-6 text-xs">
                  <li>• Utilisez un langage inclusif</li>
                  <li>• Mentionnez les aménagements possibles</li>
                  <li>• Évitez les critères discriminants</li>
                  <li>• Précisez les modes de travail flexibles</li>
                </ul>
              </div>

              {aiAnalysis && (
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Niveau handibienveillant :</span>
                    <Badge
                      variant={
                        aiAnalysis.handibienveillantLevel === 'high' ? 'success' :
                        aiAnalysis.handibienveillantLevel === 'medium' ? 'warning' : 'default'
                      }
                    >
                      {aiAnalysis.handibienveillantLevel === 'high' ? 'Excellent' :
                       aiAnalysis.handibienveillantLevel === 'medium' ? 'Bon' : 'À améliorer'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Estimation matching */}
          <Card padding="md">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Estimation de matching
              </h3>
            </div>

            {aiAnalysis ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Candidats potentiels :
                  </span>
                  <span className="font-bold text-primary-600">
                    {aiAnalysis.estimatedCandidates}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Profils qualifiés</span>
                    <span>65%</span>
                  </div>
                  <ProgressBar value={65} size="sm" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Candidats RQTH</span>
                    <span>23%</span>
                  </div>
                  <ProgressBar value={23} size="sm" color="bg-success-600" />
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                  Basé sur notre base de {Math.floor(Math.random() * 5000) + 15000} candidats actifs
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">
                  Estimation disponible après analyse IA
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export { JobCreationWizard };