// src/components/forms/ProfileForm.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  CandidateProfile, 
  Skill, 
  Education, 
  Language, 
  Certification,
  SkillCategory 
} from '@/types';

// Schéma de validation
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  title: z
    .string()
    .min(1, 'Le titre professionnel est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères'),
  summary: z
    .string()
    .max(500, 'Le résumé ne peut pas dépasser 500 caractères')
    .optional(),
  location: z.object({
    city: z.string().min(1, 'La ville est requise')
  }),
  email: z
    .string()
    .email('Format d\'email invalide')
    .optional(),
  phone: z
    .string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Format de téléphone invalide')
    .optional(),
  experience: z
    .number()
    .min(0, 'L\'expérience ne peut pas être négative')
    .max(50, 'L\'expérience ne peut pas dépasser 50 ans'),
  skills: z
    .array(z.object({
      name: z.string().min(1, 'Le nom de la compétence est requis'),
      level: z.number().min(0).max(100),
      category: z.enum(['technical', 'soft', 'language', 'tool'] as const).optional(),
      verified: z.boolean().default(false)
    }))
    .default([]),
  education: z
    .array(z.object({
      degree: z.string().min(1, 'Le diplôme est requis'),
      school: z.string().min(1, 'L\'établissement est requis'),
      field: z.string().optional(),
      startYear: z.number().min(1900).max(new Date().getFullYear()),
      endYear: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
      current: z.boolean().default(false),
      description: z.string().optional()
    }))
    .default([]),
  languages: z
    .array(z.object({
      name: z.string().min(1, 'Le nom de la langue est requis'),
      level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Natif'] as const),
      certified: z.boolean().default(false)
    }))
    .default([]),
  certifications: z
    .array(z.object({
      name: z.string().min(1, 'Le nom de la certification est requis'),
      issuer: z.string().min(1, 'L\'organisme est requis'),
      date: z.string().optional(),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().url('URL invalide').optional()
    }))
    .default([])
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface FileUpload {
  file: File;
  preview?: string;
  type: 'cv' | 'avatar' | 'portfolio';
  id: string;
}

interface ProfileFormProps {
  initialData?: Partial<CandidateProfile>;
  userRole?: 'candidate' | 'company';
  onSuccess?: (profile: CandidateProfile) => void;
  onCancel?: () => void;
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  userRole = 'candidate',
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('personal');
  
  const { updateProfile, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      skills: [],
      education: [],
      languages: [],
      certifications: [],
      experience: 0,
      ...initialData
    }
  });

  // Field arrays
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    update: updateSkill
  } = useFieldArray({
    control,
    name: 'skills'
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control,
    name: 'education'
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control,
    name: 'languages'
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification
  } = useFieldArray({
    control,
    name: 'certifications'
  });

  const skillCategories: { value: SkillCategory; label: string }[] = [
    { value: 'technical', label: 'Technique' },
    { value: 'soft', label: 'Savoir-être' },
    { value: 'language', label: 'Langue' },
    { value: 'tool', label: 'Outil' }
  ];

  const languageLevels = [
    { value: 'A1', label: 'A1 - Débutant' },
    { value: 'A2', label: 'A2 - Élémentaire' },
    { value: 'B1', label: 'B1 - Intermédiaire' },
    { value: 'B2', label: 'B2 - Intermédiaire avancé' },
    { value: 'C1', label: 'C1 - Avancé' },
    { value: 'C2', label: 'C2 - Maîtrise' },
    { value: 'Natif', label: 'Langue maternelle' }
  ];

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'skills', label: 'Compétences', icon: Award },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'languages', label: 'Langues', icon: Languages },
    { id: 'certifications', label: 'Certifications', icon: CheckCircle },
    { id: 'files', label: 'Documents', icon: FileText }
  ];

  // Gestion des fichiers
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'avatar' | 'portfolio') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileId = Math.random().toString(36).substr(2, 9);
      
      // Validation taille et type
      const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB pour avatar, 10MB pour autres
      const allowedTypes = type === 'avatar' 
        ? ['image/jpeg', 'image/png', 'image/webp']
        : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (file.size > maxSize) {
        toast.error('Fichier trop volumineux', `La taille maximale est de ${maxSize / 1024 / 1024}MB`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté', 'Veuillez sélectionner un fichier valide');
        return;
      }

      // Création preview pour les images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      const fileUpload: FileUpload = {
        file,
        preview,
        type,
        id: fileId
      };

      setUploadedFiles(prev => [...prev, fileUpload]);

      // Simulation upload avec progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);
    });
  }, [toast]);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulation de l'upload des fichiers
      const uploadPromises = uploadedFiles.map(async (fileUpload) => {
        // Ici on uploadrait le fichier vers le serveur
        return {
          url: `https://example.com/uploads/${fileUpload.file.name}`,
          type: fileUpload.type,
          name: fileUpload.file.name
        };
      });

      const uploadedFileUrls = await Promise.all(uploadPromises);

      const profileData: Partial<CandidateProfile> = {
        ...data,
        // Ajout des URLs des fichiers uploadés selon leur type
        // cv: uploadedFileUrls.find(f => f.type === 'cv')?.url,
        // avatar: uploadedFileUrls.find(f => f.type === 'avatar')?.url,
        // portfolio: uploadedFileUrls.filter(f => f.type === 'portfolio').map(f => ({ url: f.url, name: f.name }))
      };

      await updateProfile(profileData);
      
      toast.success(
        'Profil mis à jour',
        'Vos informations ont été sauvegardées avec succès'
      );
      
      onSuccess?.(profileData as CandidateProfile);
    } catch (error) {
      toast.error(
        'Erreur de sauvegarde',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  const getCompletionPercentage = () => {
    const data = watch();
    let completed = 0;
    let total = 0;

    // Champs obligatoires
    const requiredFields = ['firstName', 'lastName', 'title', 'location.city'];
    requiredFields.forEach(field => {
      total++;
      if (field.includes('.') ? data.location?.city : data[field as keyof ProfileFormData]) {
        completed++;
      }
    });

    // Champs optionnels mais importants
    total += 6;
    if (data.summary) completed++;
    if (data.email) completed++;
    if (data.phone) completed++;
    if (data.skills?.length > 0) completed++;
    if (data.education?.length > 0) completed++;
    if (data.languages?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon profil
          </h1>
          <p className="text-gray-600 mb-4">
            Complétez votre profil pour maximiser vos chances de matching
          </p>
          
          {/* Progress Bar */}
          <ProgressBar
            value={getCompletionPercentage()}
            color="bg-primary-600"
            label={`Profil complété à ${getCompletionPercentage()}%`}
            showPercentage={true}
            className="mb-6"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Informations personnelles */}
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informations personnelles
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Prénom"
                      placeholder="Votre prénom"
                      error={errors.firstName?.message}
                      {...register('firstName')}
                      disabled={isSubmitting}
                    />

                    <Input
                      label="Nom"
                      placeholder="Votre nom"
                      error={errors.lastName?.message}
                      {...register('lastName')}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Input
                    label="Titre professionnel"
                    placeholder="Ex: Développeur Full Stack Senior"
                    error={errors.title?.message}
                    {...register('title')}
                    disabled={isSubmitting}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résumé professionnel (optionnel)
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      rows={4}
                      placeholder="Décrivez brièvement votre profil et vos objectifs professionnels..."
                      {...register('summary')}
                      disabled={isSubmitting}
                    />
                    {errors.summary && (
                      <p className="mt-1 text-sm text-error-600" role="alert">
                        {errors.summary.message}
                      </p>
                    )}
                    <div className="mt-1 text-xs text-gray-500">
                      {watch('summary')?.length || 0} / 500 caractères
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Ville"
                      placeholder="Votre ville"
                      error={errors.location?.city?.message}
                      icon={<MapPin className="w-5 h-5 text-gray-400" />}
                      {...register('location.city')}
                      disabled={isSubmitting}
                    />

                    <Input
                      label="Email (optionnel)"
                      type="email"
                      placeholder="votre@email.com"
                      error={errors.email?.message}
                      icon={<Mail className="w-5 h-5 text-gray-400" />}
                      {...register('email')}
                      disabled={isSubmitting}
                    />

                    <Input
                      label="Téléphone (optionnel)"
                      type="tel"
                      placeholder="01 23 45 67 89"
                      error={errors.phone?.message}
                      icon={<Phone className="w-5 h-5 text-gray-400" />}
                      {...register('phone')}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      {...register('experience', { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-error-600" role="alert">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Compétences */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Compétences
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => appendSkill({ 
                        name: '', 
                        level: 50, 
                        category: 'technical',
                        verified: false 
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une compétence
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="md:col-span-2">
                            <Input
                              label="Compétence"
                              placeholder="Ex: React, Leadership"
                              error={errors.skills?.[index]?.name?.message}
                              {...register(`skills.${index}.name`)}
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Catégorie
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              {...register(`skills.${index}.category`)}
                              disabled={isSubmitting}
                            >
                              {skillCategories.map(category => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Niveau: {watch(`skills.${index}.level`) || 50}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            {...register(`skills.${index}.level`, { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    ))}

                    {skillFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune compétence ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une compétence" pour commencer</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Formation */}
            {activeTab === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Formation
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => appendEducation({ 
                        degree: '', 
                        school: '',
                        startYear: new Date().getFullYear(),
                        current: false
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une formation
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {educationFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Diplôme"
                            placeholder="Ex: Master en Informatique"
                            error={errors.education?.[index]?.degree?.message}
                            {...register(`education.${index}.degree`)}
                            disabled={isSubmitting}
                          />

                          <Input
                            label="Établissement"
                            placeholder="Ex: Université Paris-Saclay"
                            error={errors.education?.[index]?.school?.message}
                            {...register(`education.${index}.school`)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Input
                            label="Domaine d'étude (optionnel)"
                            placeholder="Ex: Intelligence Artificielle"
                            {...register(`education.${index}.field`)}
                            disabled={isSubmitting}
                          />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Année de début
                            </label>
                            <input
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              {...register(`education.${index}.startYear`, { valueAsNumber: true })}
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Année de fin
                            </label>
                            <input
                              type="number"
                              min="1900"
                              max={new Date().getFullYear() + 10}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              {...register(`education.${index}.endYear`, { valueAsNumber: true })}
                              disabled={isSubmitting || watch(`education.${index}.current`)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${index}`}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              {...register(`education.${index}.current`)}
                              disabled={isSubmitting}
                            />
                            <label htmlFor={`current-${index}`} className="text-sm text-gray-700">
                              Formation en cours
                            </label>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {educationFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune formation ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une formation" pour commencer</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Langues */}
            {activeTab === 'languages' && (
              <motion.div
                key="languages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Langues
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => appendLanguage({ 
                        name: '', 
                        level: 'B1',
                        certified: false 
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une langue
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {languageFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <Input
                            label="Langue"
                            placeholder="Ex: Anglais, Espagnol"
                            error={errors.languages?.[index]?.name?.message}
                            {...register(`languages.${index}.name`)}
                            disabled={isSubmitting}
                          />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Niveau
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              {...register(`languages.${index}.level`)}
                              disabled={isSubmitting}
                            >
                              {languageLevels.map(level => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`certified-${index}`}
                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                {...register(`languages.${index}.certified`)}
                                disabled={isSubmitting}
                              />
                              <label htmlFor={`certified-${index}`} className="text-sm text-gray-700">
                                Certifié
                              </label>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLanguage(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {languageFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Languages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune langue ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une langue" pour commencer</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Certifications */}
            {activeTab === 'certifications' && (
              <motion.div
                key="certifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Certifications
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => appendCertification({ 
                        name: '', 
                        issuer: ''
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une certification
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {certificationFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Nom de la certification"
                            placeholder="Ex: AWS Solutions Architect"
                            error={errors.certifications?.[index]?.name?.message}
                            {...register(`certifications.${index}.name`)}
                            disabled={isSubmitting}
                          />

                          <Input
                            label="Organisme"
                            placeholder="Ex: Amazon Web Services"
                            error={errors.certifications?.[index]?.issuer?.message}
                            {...register(`certifications.${index}.issuer`)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Input
                            label="Date d'obtention (optionnel)"
                            type="date"
                            {...register(`certifications.${index}.date`)}
                            disabled={isSubmitting}
                          />

                          <Input
                            label="Date d'expiration (optionnel)"
                            type="date"
                            {...register(`certifications.${index}.expiryDate`)}
                            disabled={isSubmitting}
                          />

                          <Input
                            label="ID de certification (optionnel)"
                            placeholder="Ex: AWS-SAA-123456"
                            {...register(`certifications.${index}.credentialId`)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Input
                            label="URL de vérification (optionnel)"
                            placeholder="https://..."
                            error={errors.certifications?.[index]?.url?.message}
                            {...register(`certifications.${index}.url`)}
                            disabled={isSubmitting}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                            className="ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {certificationFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune certification ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une certification" pour commencer</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Documents */}
            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card padding="lg" className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Documents
                  </h2>

                  {/* Upload CV */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        CV / Curriculum Vitae
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ajoutez votre CV au format PDF ou Word (max 10MB)
                      </p>
                      <input
                        type="file"
                        id="cv-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'cv')}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('cv-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir un fichier
                      </Button>
                    </div>
                  </div>

                  {/* Upload Avatar */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Photo de profil
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ajoutez une photo professionnelle (JPG, PNG, max 5MB)
                      </p>
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, 'avatar')}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir une image
                      </Button>
                    </div>
                  </div>

                  {/* Upload Portfolio */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Portfolio / Réalisations
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ajoutez des documents présentant vos réalisations
                      </p>
                      <input
                        type="file"
                        id="portfolio-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx,image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'portfolio')}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('portfolio-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir des fichiers
                      </Button>
                    </div>
                  </div>

                  {/* Liste des fichiers uploadés */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Fichiers uploadés</h3>
                      {uploadedFiles.map(fileUpload => (
                        <div key={fileUpload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {fileUpload.preview ? (
                              <img 
                                src={fileUpload.preview} 
                                alt="Preview" 
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <FileText className="w-10 h-10 text-gray-400" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {fileUpload.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB • {fileUpload.type}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {uploadProgress[fileUpload.id] !== undefined && uploadProgress[fileUpload.id] < 100 && (
                              <div className="w-16">
                                <ProgressBar
                                  value={uploadProgress[fileUpload.id]}
                                  color="bg-primary-600"
                                  showPercentage={false}
                                />
                              </div>
                            )}
                            
                            {uploadProgress[fileUpload.id] === 100 && (
                              <CheckCircle className="w-5 h-5 text-success-600" />
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileUpload.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Annuler
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !isDirty}
                isLoading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder le profil
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { ProfileForm };