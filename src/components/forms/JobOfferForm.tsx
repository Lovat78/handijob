// src/components/forms/JobOfferForm.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  MapPin, 
  Euro, 
  Clock, 
  Users,
  Building2,
  Accessibility,
  Save,
  Send,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useJobStore } from '@/stores/jobStore';
import { useToast } from '@/hooks/useToast';
import { 
  Job, 
  ContractType, 
  WorkMode, 
  AccessibilityType, 
  AccessibilityFeature 
} from '@/types';

// Schéma de validation Zod
const jobOfferSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(50, 'La description doit contenir au moins 50 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères'),
  requirements: z
    .array(z.string().min(1, 'Le critère ne peut pas être vide'))
    .min(1, 'Au moins un critère requis est nécessaire'),
  benefits: z
    .array(z.string().min(1, 'L\'avantage ne peut pas être vide'))
    .optional(),
  contractType: z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'] as const, {
    required_error: 'Le type de contrat est requis'
  }),
  workMode: z.enum(['Présentiel', 'Télétravail', 'Hybride'] as const, {
    required_error: 'Le mode de travail est requis'
  }),
  location: z.object({
    street: z.string().min(1, 'L\'adresse est requise'),
    city: z.string().min(1, 'La ville est requise'),
    zipCode: z.string().min(1, 'Le code postal est requis').regex(/^\d{5}$/, 'Code postal invalide'),
    country: z.string().default('France')
  }),
  salaryMin: z
    .number()
    .min(0, 'Le salaire minimum ne peut pas être négatif')
    .optional(),
  salaryMax: z
    .number()
    .min(0, 'Le salaire maximum ne peut pas être négatif')
    .optional(),
  accessibilityFeatures: z
    .array(z.object({
      type: z.enum([
        'wheelchair_accessible',
        'hearing_impaired',
        'visually_impaired',
        'cognitive_support',
        'flexible_schedule',
        'remote_work'
      ] as const),
      description: z.string(),
      available: z.boolean()
    }))
    .default([]),
  tags: z
    .array(z.string())
    .default([]),
  handibienveillant: z.boolean().default(false)
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: "Le salaire maximum doit être supérieur au salaire minimum",
  path: ["salaryMax"]
});

type JobOfferFormData = z.infer<typeof jobOfferSchema>;

interface JobOfferFormProps {
  initialData?: Partial<Job>;
  onSuccess?: (job: Job) => void;
  onCancel?: () => void;
  className?: string;
}

const JobOfferForm: React.FC<JobOfferFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [isAIOptimizing, setIsAIOptimizing] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const { createJob, updateJob, isLoading } = useJobStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    mode: 'onChange',
    defaultValues: {
      requirements: [''],
      benefits: [''],
      accessibilityFeatures: [],
      tags: [],
      handibienveillant: false,
      location: { country: 'France' },
      ...initialData
    }
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement
  } = useFieldArray({
    control,
    name: 'requirements'
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit
  } = useFieldArray({
    control,
    name: 'benefits'
  });

  const contractTypes: { value: ContractType; label: string }[] = [
    { value: 'CDI', label: 'CDI - Contrat à durée indéterminée' },
    { value: 'CDD', label: 'CDD - Contrat à durée déterminée' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Freelance', label: 'Freelance / Mission' },
    { value: 'Alternance', label: 'Alternance / Apprentissage' }
  ];

  const workModes: { value: WorkMode; label: string; description: string }[] = [
    { value: 'Présentiel', label: 'Présentiel', description: 'Sur site uniquement' },
    { value: 'Télétravail', label: 'Télétravail', description: 'À distance uniquement' },
    { value: 'Hybride', label: 'Hybride', description: 'Mélange présentiel/télétravail' }
  ];

  const accessibilityOptions: { 
    type: AccessibilityType; 
    label: string; 
    description: string 
  }[] = [
    { 
      type: 'wheelchair_accessible', 
      label: 'Accessible PMR', 
      description: 'Locaux accessibles aux personnes à mobilité réduite' 
    },
    { 
      type: 'hearing_impaired', 
      label: 'Déficience auditive', 
      description: 'Aménagements pour malentendants' 
    },
    { 
      type: 'visually_impaired', 
      label: 'Déficience visuelle', 
      description: 'Aménagements pour malvoyants' 
    },
    { 
      type: 'cognitive_support', 
      label: 'Support cognitif', 
      description: 'Accompagnement pour troubles cognitifs' 
    },
    { 
      type: 'flexible_schedule', 
      label: 'Horaires flexibles', 
      description: 'Adaptation des horaires de travail' 
    },
    { 
      type: 'remote_work', 
      label: 'Télétravail possible', 
      description: 'Possibilité de travail à distance' 
    }
  ];

  // Optimisation IA de l'offre
  const optimizeWithAI = async () => {
    setIsAIOptimizing(true);
    
    try {
      const currentValues = watch();
      
      // Simulation d'appel API IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Suggestions d'amélioration (simulation)
      const suggestions = [
        "Ajout du mot-clé 'inclusion' dans le titre",
        "Description reformulée en langage handibienveillant",
        "Ajout d'avantages liés à l'accessibilité",
        "Optimisation des critères pour réduire les biais"
      ];
      
      setAISuggestions(suggestions);
      
      // Application automatique des améliorations
      setValue('handibienveillant', true);
      setValue('title', currentValues.title + ' - Poste inclusif');
      
      toast.success(
        'Optimisation IA terminée',
        'Votre offre a été optimisée pour l\'inclusion'
      );
    } catch (error) {
      toast.error(
        'Erreur d\'optimisation',
        'Impossible d\'optimiser l\'offre avec l\'IA'
      );
    } finally {
      setIsAIOptimizing(false);
    }
  };

  const onSubmit = async (data: JobOfferFormData) => {
    try {
      const jobData: Partial<Job> = {
        ...data,
        status: 'draft',
        aiOptimized: aiSuggestions.length > 0,
        viewCount: 0,
        applicationCount: 0
      };

      if (initialData?.id) {
        await updateJob(initialData.id, jobData);
        toast.success('Offre mise à jour', 'Les modifications ont été sauvegardées');
      } else {
        const newJob = await createJob(jobData);
        toast.success('Offre créée', 'Votre offre d\'emploi a été créée avec succès');
        onSuccess?.(newJob);
      }
    } catch (error) {
      toast.error(
        'Erreur de sauvegarde',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  const publishJob = async () => {
    const data = watch();
    await onSubmit({ ...data, status: 'active' } as any);
  };

  const saveDraft = async () => {
    const data = watch();
    await onSubmit({ ...data, status: 'draft' } as any);
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
            {initialData?.id ? 'Modifier l\'offre' : 'Créer une offre d\'emploi'}
          </h1>
          <p className="text-gray-600">
            Créez une offre inclusive et attractive pour vos futurs collaborateurs
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations générales */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Informations générales
              </h2>
              <Button
                type="button"
                variant="ghost"
                onClick={optimizeWithAI}
                disabled={isAIOptimizing}
                isLoading={isAIOptimizing}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isAIOptimizing ? 'Optimisation...' : 'Optimiser avec l\'IA'}
              </Button>
            </div>

            <div className="space-y-6">
              <Input
                label="Titre du poste"
                placeholder="Ex: Développeur Full Stack Senior"
                error={errors.title?.message}
                {...register('title')}
                disabled={isSubmitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du poste
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={8}
                  placeholder="Décrivez les missions, responsabilités et contexte du poste..."
                  {...register('description')}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600" role="alert">
                    {errors.description.message}
                  </p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {watch('description')?.length || 0} / 2000 caractères
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    {...register('contractType')}
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionnez un type</option>
                    {contractTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.contractType && (
                    <p className="mt-1 text-sm text-error-600" role="alert">
                      {errors.contractType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de travail
                  </label>
                  <div className="space-y-2">
                    {workModes.map(mode => (
                      <label key={mode.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={mode.value}
                          {...register('workMode')}
                          className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          disabled={isSubmitting}
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {mode.label}
                          </span>
                          <p className="text-xs text-gray-500">{mode.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.workMode && (
                    <p className="mt-1 text-sm text-error-600" role="alert">
                      {errors.workMode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Localisation */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <MapPin className="inline w-5 h-5 mr-2" />
              Localisation
            </h2>

            <div className="space-y-4">
              <Input
                label="Adresse"
                placeholder="Adresse complète"
                error={errors.location?.street?.message}
                {...register('location.street')}
                disabled={isSubmitting}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ville"
                  placeholder="Ville"
                  error={errors.location?.city?.message}
                  {...register('location.city')}
                  disabled={isSubmitting}
                />
                <Input
                  label="Code postal"
                  placeholder="75000"
                  error={errors.location?.zipCode?.message}
                  {...register('location.zipCode')}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </Card>

          {/* Rémunération */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <Euro className="inline w-5 h-5 mr-2" />
              Rémunération (optionnel)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Salaire minimum (€/an)"
                  type="number"
                  placeholder="35000"
                  error={errors.salaryMin?.message}
                  {...register('salaryMin', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input
                  label="Salaire maximum (€/an)"
                  type="number"
                  placeholder="45000"
                  error={errors.salaryMax?.message}
                  {...register('salaryMax', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </Card>

          {/* Critères requis */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Critères requis
            </h2>

            <div className="space-y-4">
              {requirementFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    placeholder="Ex: 3 ans d'expérience en React"
                    error={errors.requirements?.[index]?.message}
                    {...register(`requirements.${index}`)}
                    disabled={isSubmitting}
                  />
                  {requirementFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={() => appendRequirement('')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un critère
              </Button>
            </div>
          </Card>

          {/* Avantages */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Avantages proposés
            </h2>

            <div className="space-y-4">
              {benefitFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    placeholder="Ex: Télétravail partiel, mutuelle, tickets restaurant"
                    {...register(`benefits.${index}`)}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={() => appendBenefit('')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un avantage
              </Button>
            </div>
          </Card>

          {/* Accessibilité */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <Accessibility className="inline w-5 h-5 mr-2" />
              Aménagements et accessibilité
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessibilityOptions.map(option => (
                <label key={option.type} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    onChange={(e) => {
                      const currentFeatures = watch('accessibilityFeatures') || [];
                      if (e.target.checked) {
                        setValue('accessibilityFeatures', [
                          ...currentFeatures,
                          {
                            type: option.type,
                            description: option.description,
                            available: true
                          }
                        ]);
                      } else {
                        setValue('accessibilityFeatures', 
                          currentFeatures.filter(f => f.type !== option.type)
                        );
                      }
                    }}
                    checked={watch('accessibilityFeatures')?.some(f => f.type === option.type) || false}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <input
                type="checkbox"
                id="handibienveillant"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register('handibienveillant')}
              />
              <label htmlFor="handibienveillant" className="text-sm text-gray-700">
                <Badge variant="success" size="sm" className="mr-2">
                  Handibienveillant
                </Badge>
                Cette offre respecte les critères d'inclusion et d'accessibilité
              </label>
            </div>
          </Card>

          {/* Suggestions IA */}
          <AnimatePresence>
            {aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card padding="lg" className="border-primary-200 bg-primary-50">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-primary-900">
                      Optimisations appliquées par l'IA
                    </h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center text-sm text-primary-800">
                        <CheckCircle className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Masquer' : 'Aperçu'}
              </Button>
              
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
                type="button"
                variant="secondary"
                onClick={saveDraft}
                disabled={isSubmitting || !isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder le brouillon
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publier l'offre
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Aperçu de l'offre */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8"
            >
              <Card padding="lg" className="border-gray-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Aperçu de l'offre
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {watch('title') || 'Titre du poste'}
                      </h4>
                      {watch('handibienveillant') && (
                        <Badge variant="success" size="sm">
                          Handibienveillant
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {watch('contractType') || 'Type de contrat'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {watch('location.city') || 'Ville'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {watch('workMode') || 'Mode de travail'}
                      </div>
                      {(watch('salaryMin') || watch('salaryMax')) && (
                        <div className="flex items-center">
                          <Euro className="w-4 h-4 mr-1" />
                          {watch('salaryMin') && watch('salaryMax') 
                            ? `${watch('salaryMin')?.toLocaleString()} - ${watch('salaryMax')?.toLocaleString()}€`
                            : watch('salaryMin') 
                              ? `À partir de ${watch('salaryMin')?.toLocaleString()}€`
                              : `Jusqu'à ${watch('salaryMax')?.toLocaleString()}€`
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {watch('description') || 'Description du poste...'}
                    </p>
                  </div>

                  {watch('requirements')?.filter(Boolean).length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Critères requis</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {watch('requirements')?.filter(Boolean).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {watch('benefits')?.filter(Boolean).length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Avantages</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {watch('benefits')?.filter(Boolean).map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {watch('accessibilityFeatures')?.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        <Accessibility className="inline w-4 h-4 mr-1" />
                        Aménagements disponibles
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {watch('accessibilityFeatures')?.map((feature, index) => (
                          <Badge key={index} variant="info" size="sm">
                            {accessibilityOptions.find(opt => opt.type === feature.type)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export { JobOfferForm };