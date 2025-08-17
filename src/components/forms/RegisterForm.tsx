// src/components/forms/RegisterForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Check,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { UserRole, CompanySize } from '@/types';

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  role: z.enum(['company', 'candidate'] as const, {
    required_error: 'Veuillez sélectionner votre profil'
  })
});

const step2Schema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Format de téléphone invalide')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

const step3CompanySchema = z.object({
  companyName: z
    .string()
    .min(1, 'Le nom de l\'entreprise est requis')
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  industry: z
    .string()
    .min(1, 'Le secteur d\'activité est requis'),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'] as const, {
    required_error: 'Veuillez sélectionner la taille de l\'entreprise'
  }),
  website: z
    .string()
    .optional()
    .refine(val => !val || val.startsWith('http'), 'L\'URL doit commencer par http:// ou https://'),
  address: z.object({
    street: z.string().min(1, 'L\'adresse est requise'),
    city: z.string().min(1, 'La ville est requise'),
    zipCode: z.string().min(1, 'Le code postal est requis').regex(/^\d{5}$/, 'Code postal invalide'),
    country: z.string().default('France')
  }),
  oethStatus: z.boolean().default(false)
});

const step3CandidateSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre professionnel est requis'),
  experience: z
    .number()
    .min(0, 'L\'expérience ne peut pas être négative')
    .max(50, 'L\'expérience ne peut pas dépasser 50 ans'),
  location: z.object({
    city: z.string().min(1, 'La ville est requise')
  }),
  needsAccommodation: z.boolean().default(false),
  accommodationTypes: z.array(z.string()).optional()
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3CompanyData = z.infer<typeof step3CompanySchema>;
type Step3CandidateData = z.infer<typeof step3CandidateSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  // Forms pour chaque étape
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange'
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange'
  });

  const step3CompanyForm = useForm<Step3CompanyData>({
    resolver: zodResolver(step3CompanySchema),
    mode: 'onChange'
  });

  const step3CandidateForm = useForm<Step3CandidateData>({
    resolver: zodResolver(step3CandidateSchema),
    mode: 'onChange'
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    let isValid = false;
    let stepData = {};

    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger();
        if (isValid) {
          stepData = step1Form.getValues();
        }
        break;
      case 2:
        isValid = await step2Form.trigger();
        if (isValid) {
          stepData = step2Form.getValues();
        }
        break;
    }

    if (isValid) {
      setFormData(prev => ({ ...prev, ...stepData }));
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const form = formData.role === 'company' ? step3CompanyForm : step3CandidateForm;
    const isValid = await form.trigger();
    
    if (!isValid) return;

    const step3Data = form.getValues();
    const finalData = { ...formData, ...step3Data };

    try {
      await register(finalData);
      toast.success(
        'Inscription réussie !', 
        'Vérifiez votre email pour activer votre compte'
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        'Erreur lors de l\'inscription',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  const companySizes: { value: CompanySize; label: string }[] = [
    { value: '1-10', label: '1-10 employés' },
    { value: '11-50', label: '11-50 employés' },
    { value: '51-200', label: '51-200 employés' },
    { value: '201-500', label: '201-500 employés' },
    { value: '500+', label: '500+ employés' }
  ];

  const industries = [
    'Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce', 
    'Industrie', 'Services', 'Transport', 'Immobilier', 'Autre'
  ];

  const accommodationTypes = [
    'Accessibilité PMR', 'Adaptation poste de travail', 'Horaires flexibles',
    'Télétravail', 'Support technique', 'Accompagnement personnalisé'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-2xl mx-auto ${className}`}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-600">
            Rejoignez la communauté Handi.jobs
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            value={progress}
            color="bg-primary-600"
            label={`Étape ${currentStep} sur ${totalSteps}`}
            showPercentage={false}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : ''}>
              Profil
            </span>
            <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : ''}>
              Informations
            </span>
            <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : ''}>
              Détails
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Étape 1: Choix du profil */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quel est votre profil ?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="company"
                    {...step1Form.register('role')}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-lg transition-all hover:border-primary-300 ${
                    step1Form.watch('role') === 'company' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200'
                  }`}>
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                    <h3 className="text-lg font-semibold text-center mb-2">
                      Entreprise
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Recruter des talents en situation de handicap
                    </p>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="candidate"
                    {...step1Form.register('role')}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-lg transition-all hover:border-primary-300 ${
                    step1Form.watch('role') === 'candidate' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200'
                  }`}>
                    <User className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                    <h3 className="text-lg font-semibold text-center mb-2">
                      Candidat
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Trouver un emploi adapté à mes besoins
                    </p>
                  </div>
                </label>
              </div>

              {step1Form.formState.errors.role && (
                <p className="text-sm text-error-600 text-center" role="alert">
                  {step1Form.formState.errors.role.message}
                </p>
              )}
            </motion.div>
          )}

          {/* Étape 2: Informations personnelles */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Vos informations personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={step2Form.formState.errors.firstName?.message}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    {...step2Form.register('firstName')}
                  />
                </div>

                <div>
                  <Input
                    label="Nom"
                    placeholder="Votre nom"
                    error={step2Form.formState.errors.lastName?.message}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    {...step2Form.register('lastName')}
                  />
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                error={step2Form.formState.errors.email?.message}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                {...step2Form.register('email')}
              />

              <Input
                label="Téléphone"
                type="tel"
                placeholder="01 23 45 67 89"
                error={step2Form.formState.errors.phone?.message}
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                {...step2Form.register('phone')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={step2Form.formState.errors.password?.message}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    {...step2Form.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmer le mot de passe"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={step2Form.formState.errors.confirmPassword?.message}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    {...step2Form.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Étape 3: Détails spécifiques */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {formData.role === 'company' ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Informations de l'entreprise
                  </h2>

                  <Input
                    label="Nom de l'entreprise"
                    placeholder="Nom de votre entreprise"
                    error={step3CompanyForm.formState.errors.companyName?.message}
                    icon={<Building2 className="w-5 h-5 text-gray-400" />}
                    {...step3CompanyForm.register('companyName')}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secteur d'activité
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        {...step3CompanyForm.register('industry')}
                      >
                        <option value="">Sélectionnez un secteur</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taille de l'entreprise
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        {...step3CompanyForm.register('size')}
                      >
                        <option value="">Sélectionnez la taille</option>
                        {companySizes.map(size => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Site web (optionnel)"
                    placeholder="https://www.example.com"
                    error={step3CompanyForm.formState.errors.website?.message}
                    {...step3CompanyForm.register('website')}
                  />

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Adresse</h3>
                    <Input
                      placeholder="Adresse"
                      error={step3CompanyForm.formState.errors.address?.street?.message}
                      icon={<MapPin className="w-5 h-5 text-gray-400" />}
                      {...step3CompanyForm.register('address.street')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Ville"
                        error={step3CompanyForm.formState.errors.address?.city?.message}
                        {...step3CompanyForm.register('address.city')}
                      />
                      <Input
                        placeholder="Code postal"
                        error={step3CompanyForm.formState.errors.address?.zipCode?.message}
                        {...step3CompanyForm.register('address.zipCode')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="oethStatus"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      {...step3CompanyForm.register('oethStatus')}
                    />
                    <label htmlFor="oethStatus" className="text-sm text-gray-700">
                      Mon entreprise est soumise à l'obligation d'emploi des travailleurs handicapés (OETH)
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Votre profil professionnel
                  </h2>

                  <Input
                    label="Titre professionnel"
                    placeholder="Ex: Développeur Full Stack"
                    error={step3CandidateForm.formState.errors.title?.message}
                    {...step3CandidateForm.register('title')}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Années d'expérience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        {...step3CandidateForm.register('experience', { valueAsNumber: true })}
                      />
                    </div>

                    <Input
                      label="Ville"
                      placeholder="Votre ville"
                      error={step3CandidateForm.formState.errors.location?.city?.message}
                      icon={<MapPin className="w-5 h-5 text-gray-400" />}
                      {...step3CandidateForm.register('location.city')}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="needsAccommodation"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        {...step3CandidateForm.register('needsAccommodation')}
                      />
                      <label htmlFor="needsAccommodation" className="text-sm text-gray-700">
                        J'ai besoin d'aménagements de poste
                      </label>
                    </div>

                    {step3CandidateForm.watch('needsAccommodation') && (
                      <div className="ml-6 space-y-2">
                        <p className="text-sm text-gray-600">Types d'aménagements :</p>
                        <div className="flex flex-wrap gap-2">
                          {accommodationTypes.map(type => (
                            <Badge key={type} variant="info" size="sm">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                disabled={!step1Form.watch('role') && currentStep === 1}
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export { RegisterForm };