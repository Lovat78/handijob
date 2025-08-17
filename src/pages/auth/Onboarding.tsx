// src/pages/auth/Onboarding.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  Users, 
  Target, 
  Settings,
  Star,
  ArrowRight,
  Briefcase,
  Heart,
  Shield
} from 'lucide-react';
import { Button, Card, ProgressBar, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { UserRole } from '@/types';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface CompanySetupData {
  industry: string;
  size: string;
  oethStatus: boolean;
  priorities: string[];
}

interface CandidateSetupData {
  experienceLevel: string;
  workMode: string[];
  accessibilityNeeds: boolean;
  accommodationTypes: string[];
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updateCompany } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanySetupData>({
    industry: '',
    size: '',
    oethStatus: false,
    priorities: []
  });
  const [candidateData, setCandidateData] = useState<CandidateSetupData>({
    experienceLevel: '',
    workMode: [],
    accessibilityNeeds: false,
    accommodationTypes: []
  });

  // Configuration des étapes selon le rôle
  const getStepsForRole = (): OnboardingStep[] => {
    if (user?.role === 'company') {
      return [
        {
          id: 0,
          title: 'Bienvenue sur Handi.jobs',
          description: 'Découvrez comment notre plateforme révolutionne le recrutement inclusif',
          icon: <Heart className="w-8 h-8" />,
          component: <WelcomeStep />
        },
        {
          id: 1,
          title: 'Informations entreprise',
          description: 'Renseignez les détails de votre organisation',
          icon: <Building2 className="w-8 h-8" />,
          component: <CompanyInfoStep data={companyData} onChange={setCompanyData} />
        },
        {
          id: 2,
          title: 'Objectifs de recrutement',
          description: 'Définissez vos priorités et besoins',
          icon: <Target className="w-8 h-8" />,
          component: <RecruitmentGoalsStep data={companyData} onChange={setCompanyData} />
        },
        {
          id: 3,
          title: 'Configuration terminée',
          description: 'Votre compte est prêt !',
          icon: <Check className="w-8 h-8" />,
          component: <CompletionStep />
        }
      ];
    } else {
      return [
        {
          id: 0,
          title: 'Bienvenue sur Handi.jobs',
          description: 'Trouvez votre prochain emploi dans un environnement inclusif',
          icon: <Heart className="w-8 h-8" />,
          component: <WelcomeStep />
        },
        {
          id: 1,
          title: 'Votre profil',
          description: 'Parlez-nous de votre expérience',
          icon: <Users className="w-8 h-8" />,
          component: <CandidateProfileStep data={candidateData} onChange={setCandidateData} />
        },
        {
          id: 2,
          title: 'Préférences d\'accessibilité',
          description: 'Aidez-nous à vous proposer les meilleures opportunités',
          icon: <Shield className="w-8 h-8" />,
          component: <AccessibilityStep data={candidateData} onChange={setCandidateData} />
        },
        {
          id: 3,
          title: 'Profil terminé',
          description: 'Commencez à explorer les opportunités !',
          icon: <Check className="w-8 h-8" />,
          component: <CompletionStep />
        }
      ];
    }
  };

  const steps = getStepsForRole();
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (user?.role === 'company') {
        await updateCompany({
          industry: companyData.industry,
          size: companyData.size as any,
          oethStatus: companyData.oethStatus
        });
      } else {
        await updateProfile({
          // Mise à jour des préférences candidat
        });
      }

      toast.success('Configuration terminée', 'Votre profil a été configuré avec succès');
      
      // Redirection selon le rôle
      setTimeout(() => {
        if (user?.role === 'company') {
          navigate('/dashboard/company');
        } else {
          navigate('/dashboard/candidate');
        }
      }, 1500);
      
    } catch (error) {
      toast.error('Erreur', 'Impossible de sauvegarder votre configuration');
    } finally {
      setIsCompleting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === steps.length - 1) return true;
    
    if (user?.role === 'company') {
      if (currentStep === 1) {
        return companyData.industry && companyData.size;
      }
      if (currentStep === 2) {
        return companyData.priorities.length > 0;
      }
    } else {
      if (currentStep === 1) {
        return candidateData.experienceLevel && candidateData.workMode.length > 0;
      }
      if (currentStep === 2) {
        return true; // L'accessibilité est optionnelle
      }
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accessibility-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header avec progression */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configuration de votre compte
            </h1>
            <p className="text-gray-600">
              Étape {currentStep + 1} sur {steps.length}
            </p>
          </motion.div>

          <ProgressBar
            value={progress}
            className="max-w-md mx-auto"
            color="bg-primary-600"
            showPercentage={false}
          />

          {/* Navigation des étapes */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${
                    index <= currentStep ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index < currentStep
                        ? 'bg-primary-600 text-white'
                        : index === currentStep
                        ? 'bg-primary-100 border-2 border-primary-600'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block max-w-20 text-center">
                    {step.title.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <Card padding="lg" className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px] flex flex-col"
            >
              {/* En-tête de l'étape */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {steps[currentStep].icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-600">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Contenu de l'étape */}
              <div className="flex-1">
                {steps[currentStep].component}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex"
              >
                Passer pour le moment
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  disabled={isCompleting}
                  isLoading={isCompleting}
                  className="flex items-center space-x-2"
                >
                  <span>Terminer</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Composant d'accueil
const WelcomeStep: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accessibility-500 rounded-full mx-auto flex items-center justify-center">
      <Heart className="w-16 h-16 text-white" />
    </div>
    
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">
        Bienvenue dans l'écosystème Handi.jobs
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Notre plateforme utilise l'intelligence artificielle pour créer des opportunités 
        d'emploi inclusives et favoriser la diversité en entreprise. Ensemble, construisons 
        un monde professionnel plus équitable.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto flex items-center justify-center mb-3">
          <Briefcase className="w-6 h-6 text-primary-600" />
        </div>
        <h4 className="font-medium text-gray-900">Matching IA</h4>
        <p className="text-sm text-gray-600">Algorithmes avancés pour des recommandations pertinentes</p>
      </div>
      
      <div className="text-center">
        <div className="w-12 h-12 bg-accessibility-100 rounded-lg mx-auto flex items-center justify-center mb-3">
          <Shield className="w-6 h-6 text-accessibility-600" />
        </div>
        <h4 className="font-medium text-gray-900">Accessibilité</h4>
        <p className="text-sm text-gray-600">Interface conçue pour tous les utilisateurs</p>
      </div>
      
      <div className="text-center">
        <div className="w-12 h-12 bg-success-100 rounded-lg mx-auto flex items-center justify-center mb-3">
          <Star className="w-6 h-6 text-success-600" />
        </div>
        <h4 className="font-medium text-gray-900">Conformité</h4>
        <p className="text-sm text-gray-600">Respect des obligations OETH</p>
      </div>
    </div>
  </div>
);

// Étape informations entreprise
interface CompanyInfoStepProps {
  data: CompanySetupData;
  onChange: (data: CompanySetupData) => void;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ data, onChange }) => {
  const industries = [
    'Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce',
    'Industrie', 'Services', 'Média', 'Transport', 'Autre'
  ];

  const sizes = [
    { value: '1-10', label: '1-10 salariés' },
    { value: '11-50', label: '11-50 salariés' },
    { value: '51-200', label: '51-200 salariés' },
    { value: '201-500', label: '201-500 salariés' },
    { value: '500+', label: '500+ salariés' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secteur d'activité *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {industries.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => onChange({ ...data, industry })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                data.industry === industry
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Taille de l'entreprise *
        </label>
        <div className="space-y-2">
          {sizes.map((size) => (
            <label
              key={size.value}
              className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:border-primary-300"
            >
              <input
                type="radio"
                name="company-size"
                value={size.value}
                checked={data.size === size.value}
                onChange={(e) => onChange({ ...data, size: e.target.value })}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{size.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.oethStatus}
            onChange={(e) => onChange({ ...data, oethStatus: e.target.checked })}
            className="mt-1 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              Mon entreprise est soumise à l'OETH
            </span>
            <p className="text-xs text-gray-600 mt-1">
              L'Obligation d'Emploi des Travailleurs Handicapés concerne les entreprises 
              de 20 salariés et plus. Cela nous aidera à personnaliser votre expérience.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

// Étape objectifs de recrutement
interface RecruitmentGoalsStepProps {
  data: CompanySetupData;
  onChange: (data: CompanySetupData) => void;
}

const RecruitmentGoalsStep: React.FC<RecruitmentGoalsStepProps> = ({ data, onChange }) => {
  const priorities = [
    { id: 'diversity', label: 'Améliorer la diversité', icon: '🌈' },
    { id: 'compliance', label: 'Respecter les obligations OETH', icon: '⚖️' },
    { id: 'talent', label: 'Accéder à de nouveaux talents', icon: '🎯' },
    { id: 'inclusion', label: 'Renforcer l\'inclusion', icon: '🤝' },
    { id: 'image', label: 'Améliorer l\'image employeur', icon: '⭐' },
    { id: 'innovation', label: 'Favoriser l\'innovation', icon: '💡' }
  ];

  const togglePriority = (priorityId: string) => {
    const newPriorities = data.priorities.includes(priorityId)
      ? data.priorities.filter(p => p !== priorityId)
      : [...data.priorities, priorityId];
    
    onChange({ ...data, priorities: newPriorities });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Quels sont vos objectifs principaux ?
        </h3>
        <p className="text-gray-600 mb-6">
          Sélectionnez les priorités qui correspondent à votre stratégie RH (au moins une)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorities.map((priority) => {
            const isSelected = data.priorities.includes(priority.id);
            return (
              <button
                key={priority.id}
                type="button"
                onClick={() => togglePriority(priority.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-300 bg-white hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{priority.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{priority.label}</h4>
                    {isSelected && (
                      <Badge variant="success" size="sm" className="mt-1">
                        Sélectionné
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {data.priorities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-4 rounded-lg"
        >
          <h4 className="font-medium text-green-900 mb-2">
            Parfait ! Nous personnaliserons votre expérience selon ces priorités :
          </h4>
          <ul className="text-sm text-green-800">
            {data.priorities.map((priorityId) => {
              const priority = priorities.find(p => p.id === priorityId);
              return (
                <li key={priorityId} className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{priority?.label}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

// Étape profil candidat
interface CandidateProfileStepProps {
  data: CandidateSetupData;
  onChange: (data: CandidateSetupData) => void;
}

const CandidateProfileStep: React.FC<CandidateProfileStepProps> = ({ data, onChange }) => {
  const experienceLevels = [
    { value: 'junior', label: 'Débutant (0-2 ans)', icon: '🌱' },
    { value: 'intermediate', label: 'Intermédiaire (2-5 ans)', icon: '🔧' },
    { value: 'senior', label: 'Expérimenté (5+ ans)', icon: '🎯' },
    { value: 'expert', label: 'Expert (10+ ans)', icon: '⭐' }
  ];

  const workModes = [
    { id: 'remote', label: 'Télétravail', icon: '🏠' },
    { id: 'onsite', label: 'Présentiel', icon: '🏢' },
    { id: 'hybrid', label: 'Hybride', icon: '🔄' }
  ];

  const toggleWorkMode = (modeId: string) => {
    const newModes = data.workMode.includes(modeId)
      ? data.workMode.filter(m => m !== modeId)
      : [...data.workMode, modeId];
    
    onChange({ ...data, workMode: newModes });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Niveau d'expérience *
        </label>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center space-x-4 p-4 rounded-lg border cursor-pointer hover:border-primary-300"
            >
              <input
                type="radio"
                name="experience-level"
                value={level.value}
                checked={data.experienceLevel === level.value}
                onChange={(e) => onChange({ ...data, experienceLevel: e.target.value })}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-2xl">{level.icon}</span>
              <span className="text-gray-700 font-medium">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Modes de travail souhaités *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workModes.map((mode) => {
            const isSelected = data.workMode.includes(mode.id);
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => toggleWorkMode(mode.id)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-300 bg-white hover:border-primary-300'
                }`}
              >
                <div className="text-2xl mb-2">{mode.icon}</div>
                <div className="font-medium text-gray-900">{mode.label}</div>
                {isSelected && (
                  <Badge variant="success" size="sm" className="mt-2">
                    Sélectionné
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Étape accessibilité
interface AccessibilityStepProps {
  data: CandidateSetupData;
  onChange: (data: CandidateSetupData) => void;
}

const AccessibilityStep: React.FC<AccessibilityStepProps> = ({ data, onChange }) => {
  const accommodationTypes = [
    { id: 'wheelchair', label: 'Accessibilité fauteuil roulant', icon: '♿' },
    { id: 'hearing', label: 'Aménagements auditifs', icon: '🦻' },
    { id: 'visual', label: 'Aménagements visuels', icon: '👁️' },
    { id: 'cognitive', label: 'Support cognitif', icon: '🧠' },
    { id: 'schedule', label: 'Horaires flexibles', icon: '⏰' },
    { id: 'environment', label: 'Environnement adapté', icon: '🌟' }
  ];

  const toggleAccommodation = (typeId: string) => {
    const newTypes = data.accommodationTypes.includes(typeId)
      ? data.accommodationTypes.filter(t => t !== typeId)
      : [...data.accommodationTypes, typeId];
    
    onChange({ ...data, accommodationTypes: newTypes });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">
          Informations sur l'accessibilité
        </h3>
        <p className="text-sm text-blue-800">
          Ces informations nous aident à vous proposer des emplois avec les aménagements 
          appropriés. Elles restent confidentielles et ne sont partagées qu'avec votre accord.
        </p>
      </div>

      <div>
        <label className="flex items-start space-x-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={data.accessibilityNeeds}
            onChange={(e) => onChange({ ...data, accessibilityNeeds: e.target.checked })}
            className="mt-1 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              J'ai besoin d'aménagements spécifiques
            </span>
            <p className="text-xs text-gray-600 mt-1">
              Cochez cette case si vous souhaitez préciser vos besoins d'accessibilité
            </p>
          </div>
        </label>

        {data.accessibilityNeeds && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-gray-700">
              Types d'aménagements souhaités
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accommodationTypes.map((type) => {
                const isSelected = data.accommodationTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleAccommodation(type.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{type.label}</h4>
                        {isSelected && (
                          <Badge variant="success" size="sm" className="mt-1">
                            Sélectionné
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">
          🎯 Nos engagements
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Confidentialité absolue de vos informations</li>
          <li>• Partenariat avec des entreprises inclusives</li>
          <li>• Accompagnement personnalisé dans votre recherche</li>
          <li>• Respect de vos choix et de votre autonomie</li>
        </ul>
      </div>
    </div>
  );
};

// Étape de finalisation
const CompletionStep: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-32 h-32 bg-gradient-to-br from-success-500 to-primary-500 rounded-full mx-auto flex items-center justify-center"
      >
        <Check className="w-16 h-16 text-white" />
      </motion.div>
      
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          🎉 Félicitations !
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {user?.role === 'company' 
            ? 'Votre compte entreprise est maintenant configuré. Vous pouvez commencer à publier des offres et rechercher des talents.'
            : 'Votre profil candidat est prêt ! Explorez dès maintenant les opportunités qui vous correspondent.'
          }
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accessibility-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">
          Prochaines étapes recommandées :
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {user?.role === 'company' ? (
            <>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Publiez votre première offre d'emploi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Explorez la base de candidats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Découvrez le matching IA</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Complétez votre profil et CV</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Parcourez les offres d'emploi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success-600" />
                <span>Activez les recommandations IA</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;