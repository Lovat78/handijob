// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { UserRole, CompanySize } from '@/types';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  role: z.enum(['company', 'candidate']),
  companyData: z.object({
    name: z.string().optional(),
    industry: z.string().optional(),
    size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
    address: z.object({
      city: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().default('France')
    }).optional()
  }).optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions d\'utilisation')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyData: { address: { country: 'France' } }
    }
  });

  const watchedRole = watch('role');
  const watchedData = watch();

  // Gestion des étapes
  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedRole(null);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success('Compte créé !', 'Bienvenue sur Handi.jobs');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription', 'Vérifiez vos informations');
    }
  };

  const roleOptions = [
    {
      value: 'company' as UserRole,
      title: 'Recruteur / Entreprise',
      description: 'Publiez des offres d\'emploi et trouvez les meilleurs talents inclusifs',
      icon: <Building className="w-8 h-8" />,
      features: [
        'Publier des offres d\'emploi inclusives',
        'Accéder au matching IA avancé',
        'Gérer les candidatures et communications',
        'Suivre la conformité OETH',
        'Analytics et reporting détaillés'
      ],
      color: 'from-blue-500 to-primary-600'
    },
    {
      value: 'candidate' as UserRole,
      title: 'Candidat',
      description: 'Trouvez votre emploi idéal dans un environnement inclusif et bienveillant',
      icon: <User className="w-8 h-8" />,
      features: [
        'Recherche d\'offres personnalisée',
        'Matching IA avec vos compétences',
        'Profil optimisé pour l\'inclusion',
        'Accompagnement et conseils carrière',
        'Accès prioritaire aux offres handibienveillantes'
      ],
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const companySizes = [
    { value: '1-10' as CompanySize, label: '1-10 employés' },
    { value: '11-50' as CompanySize, label: '11-50 employés' },
    { value: '51-200' as CompanySize, label: '51-200 employés' },
    { value: '201-500' as CompanySize, label: '201-500 employés' },
    { value: '500+' as CompanySize, label: '500+ employés' }
  ];

  const industries = [
    'Technologie / IT',
    'Santé / Médical',
    'Éducation / Formation',
    'Finance / Banque',
    'Commerce / Vente',
    'Industrie / Manufacturing',
    'Services / Consulting',
    'Communication / Marketing',
    'Transport / Logistique',
    'Autre'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rejoignez Handi.jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            La plateforme de recrutement inclusif nouvelle génération
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Comment souhaitez-vous utiliser Handi.jobs ?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choisissez le profil qui vous correspond le mieux
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roleOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => handleRoleSelection(option.value)}
                >
                  <Card padding="lg" hoverable>
                    <div className={`w-full h-24 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center mb-6`}>
                      <div className="text-white">
                        {option.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {option.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant="primary"
                      fullWidth
                      className="mt-6"
                    >
                      Choisir ce profil
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2: Registration Form */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card padding="lg">
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousStep}
                >
                  ← Retour
                </Button>
                <div className="flex-1 text-center">
                  <Badge variant="info" size="sm">
                    {selectedRole === 'company' ? 'Recruteur' : 'Candidat'}
                  </Badge>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      {...register('firstName')}
                      label="Prénom *"
                      placeholder="Votre prénom"
                      leftIcon={<User className="w-4 h-4" />}
                      error={errors.firstName?.message}
                      fullWidth
                    />
                    <Input
                      {...register('lastName')}
                      label="Nom *"
                      placeholder="Votre nom"
                      leftIcon={<User className="w-4 h-4" />}
                      error={errors.lastName?.message}
                      fullWidth
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      {...register('email')}
                      type="email"
                      label="Email *"
                      placeholder="votre@email.fr"
                      leftIcon={<Mail className="w-4 h-4" />}
                      error={errors.email?.message}
                      fullWidth
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sécurité
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      label="Mot de passe *"
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      error={errors.password?.message}
                      fullWidth
                    />
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirmer le mot de passe *"
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      error={errors.confirmPassword?.message}
                      fullWidth
                    />
                  </div>
                </div>

                {/* Informations entreprise (si recruteur) */}
                {watchedRole === 'company' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Informations entreprise
                    </h3>
                    <div className="space-y-4">
                      <Input
                        {...register('companyData.name')}
                        label="Nom de l'entreprise *"
                        placeholder="TechCorp Innovation"
                        leftIcon={<Building className="w-4 h-4" />}
                        fullWidth
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Secteur d'activité
                          </label>
                          <select
                            {...register('companyData.industry')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          >
                            <option value="">Sélectionner un secteur</option>
                            {industries.map((industry) => (
                              <option key={industry} value={industry}>
                                {industry}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Taille de l'entreprise
                          </label>
                          <select
                            {...register('companyData.size')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          >
                            <option value="">Sélectionner une taille</option>
                            {companySizes.map((size) => (
                              <option key={size.value} value={size.value}>
                                {size.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          {...register('companyData.address.city')}
                          label="Ville"
                          placeholder="Paris, Lyon..."
                          leftIcon={<MapPin className="w-4 h-4" />}
                          fullWidth
                        />
                        <Input
                          {...register('companyData.address.zipCode')}
                          label="Code postal"
                          placeholder="75001"
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditions d'utilisation */}
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      {...register('acceptTerms')}
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      J'accepte les{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                  size="lg"
                >
                  Créer mon compte
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Déjà un compte ?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export { Register };