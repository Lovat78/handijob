// src/components/candidate/IntelligentCVGenerator.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  FileText, 
  Sparkles, 
  Download, 
  Eye, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCandidateStore } from '@/stores/candidateStore';

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
  requiredSkills: string[];
  missingSkills: string[];
}

interface CVAnalysis {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  accessibility: {
    score: number;
    features: string[];
  };
  relevantExperiences: Experience[];
  skillsAlignment: {
    matched: string[];
    missing: string[];
    transferable: string[];
  };
}

interface GeneratedCV {
  id: string;
  jobId: string;
  content: {
    summary: string;
    experiences: Experience[];
    skills: string[];
    education: Education[];
    accessibility: string[];
  };
  aiOptimizations: string[];
  handibienveillantScore: number;
  estimatedImpact: string;
}

const IntelligentCVGenerator: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [generatedCV, setGeneratedCV] = useState<GeneratedCV | null>(null);
  const [availableJobs, setAvailableJobs] = useState<JobMatch[]>([]);

  const { user } = useAuth();
  const { currentCandidate } = useCandidateStore();

  // Simulation données matching jobs
  useEffect(() => {
    // TODO: Replace with real API call to get matched jobs
    const mockJobs: JobMatch[] = [
      {
        jobId: 'job-1',
        title: 'Développeur Frontend React Senior',
        company: 'TechCorp Inclusive',
        matchScore: 87,
        requiredSkills: ['React', 'TypeScript', 'Accessibilité', 'Tests'],
        missingSkills: ['Next.js']
      },
      {
        jobId: 'job-2', 
        title: 'UX Designer Accessibilité',
        company: 'Design & Access',
        matchScore: 92,
        requiredSkills: ['Figma', 'WCAG', 'User Research', 'Prototypage'],
        missingSkills: ['Adobe XD']
      },
      {
        jobId: 'job-3',
        title: 'Chef de Projet Digital Inclusif', 
        company: 'Innovation Hub',
        matchScore: 78,
        requiredSkills: ['Agile', 'Leadership', 'Accessibility', 'Budget'],
        missingSkills: ['PMP', 'SAFe']
      }
    ];
    
    setAvailableJobs(mockJobs);
  }, []);

  const analyzeProfile = async (job: JobMatch) => {
    setIsAnalyzing(true);
    setSelectedJob(job);
    
    // Simulation analyse IA du profil vs job
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis: CVAnalysis = {
      overallScore: job.matchScore,
      strengths: [
        'Expérience technique solide en développement web',
        'Sensibilité forte à l\'accessibilité numérique', 
        'Capacité d\'adaptation et résilience',
        'Communication claire et empathique'
      ],
      improvements: [
        'Mettre en avant projets accessibilité',
        'Quantifier impact des réalisations',
        'Ajouter certifications récentes',
        'Détailler soft skills management'
      ],
      accessibility: {
        score: 95,
        features: [
          'Expérience développement WCAG 2.1',
          'Tests avec technologies d\'assistance',
          'Formation accessibilité certifiée'
        ]
      },
      relevantExperiences: [
        // Expériences les plus pertinentes pour ce job
      ],
      skillsAlignment: {
        matched: job.requiredSkills.filter(skill => 
          Math.random() > 0.3 // Simulation matching
        ),
        missing: job.missingSkills,
        transferable: ['Problem solving', 'Team work', 'Communication']
      }
    };
    
    setCvAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const generateOptimizedCV = async () => {
    if (!selectedJob || !cvAnalysis) return;
    
    setIsGenerating(true);
    
    // Simulation génération IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const optimizedCV: GeneratedCV = {
      id: `cv-${Date.now()}`,
      jobId: selectedJob.jobId,
      content: {
        summary: `Développeur expérimenté spécialisé en solutions accessibles et inclusives, avec ${Math.floor(Math.random() * 8) + 3} ans d'expérience. Expert en ${selectedJob.requiredSkills.slice(0, 3).join(', ')} avec une passion pour créer des expériences utilisateur universellement accessibles.`,
        experiences: [
          // Expériences réorganisées et optimisées
        ],
        skills: [
          ...cvAnalysis.skillsAlignment.matched,
          ...cvAnalysis.skillsAlignment.transferable
        ],
        education: [],
        accessibility: cvAnalysis.accessibility.features
      },
      aiOptimizations: [
        'Réorganisation expériences par pertinence',
        'Mise en avant compétences accessibilité',
        'Quantification impacts projets',
        'Adaptation vocabulaire secteur',
        'Intégration mots-clés ATS-friendly'
      ],
      handibienveillantScore: cvAnalysis.accessibility.score,
      estimatedImpact: '+40% chances de décrocher entretien'
    };
    
    setGeneratedCV(optimizedCV);
    setIsGenerating(false);
  };

  const downloadCV = (format: 'pdf' | 'docx') => {
    // TODO: Implement CV download with formatting
    console.log(`Downloading CV in ${format} format`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          CV Intelligent Automatisé
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          IA génère un CV personnalisé pour chaque offre, optimisant vos chances de succès
        </p>
      </div>

      {/* Jobs disponibles */}
      <Card padding="md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          Offres correspondant à votre profil
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableJobs.map((job) => (
            <Card
              key={job.jobId}
              padding="sm"
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedJob?.jobId === job.jobId 
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : ''
              }`}
              onClick={() => analyzeProfile(job)}
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge
                    variant={job.matchScore >= 85 ? 'success' : job.matchScore >= 70 ? 'warning' : 'default'}
                  >
                    {job.matchScore}% match
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isAnalyzing}
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeProfile(job);
                    }}
                  >
                    {isAnalyzing && selectedJob?.jobId === job.jobId ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-1" />
                        Analyser
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Compétences requises:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="info" size="xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <Badge variant="default" size="xs">
                        +{job.requiredSkills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Analyse du profil */}
      <AnimatePresence>
        {cvAnalysis && selectedJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card padding="md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary-600" />
                  Analyse IA de votre profil
                </h2>
                <Badge variant="success" size="lg">
                  {cvAnalysis.overallScore}% compatibilité
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forces détectées */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-success-600" />
                    Forces identifiées
                  </h3>
                  <ul className="space-y-2">
                    {cvAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {strength}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Améliorations suggérées */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-warning-600" />
                    Optimisations recommandées
                  </h3>
                  <ul className="space-y-2">
                    {cvAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {improvement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Score accessibilité */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-900 dark:text-blue-200">
                    Score Handibienveillance
                  </h3>
                  <Badge variant="info" size="lg">
                    {cvAnalysis.accessibility.score}%
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.accessibility.features.map((feature, index) => (
                    <Badge key={index} variant="info" size="sm">
                      ♿ {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bouton génération */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={generateOptimizedCV}
                  isLoading={isGenerating}
                  className="px-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Génération IA en cours...' : 'Générer CV Optimisé'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV généré */}
      <AnimatePresence>
        {generatedCV && selectedJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card padding="md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-success-600" />
                  CV Optimisé IA - {selectedJob.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">
                    Handibienveillant {generatedCV.handibienveillantScore}%
                  </Badge>
                  <Badge variant="info">
                    {generatedCV.estimatedImpact}
                  </Badge>
                </div>
              </div>

              {/* Optimisations appliquées */}
              <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <h3 className="font-medium text-success-900 dark:text-success-200 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimisations IA appliquées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generatedCV.aiOptimizations.map((optimization, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success-600 flex-shrink-0" />
                      <span className="text-sm text-success-800 dark:text-success-200">
                        {optimization}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aperçu CV */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentCandidate?.firstName} {currentCandidate?.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedJob.title}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Résumé professionnel
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {generatedCV.content.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Compétences clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCV.content.skills.slice(0, 8).map((skill, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {generatedCV.content.accessibility.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Expertise accessibilité
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCV.content.accessibility.map((feature, index) => (
                          <Badge key={index} variant="info" size="sm">
                            ♿ {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {/* TODO: Preview full CV */}}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu complet
                </Button>
                
                <Button
                  variant="primary"
                  onClick={() => downloadCV('pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => downloadCV('docx')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger Word
                </Button>
                
                <Button
                  variant="success"
                  onClick={() => {/* TODO: Apply with generated CV */}}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Postuler avec ce CV
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { IntelligentCVGenerator };
