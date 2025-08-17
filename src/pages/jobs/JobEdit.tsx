// src/pages/jobs/JobEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, 
  Eye, 
  Brain, 
  ArrowLeft,
  MapPin, 
  Euro,
  Clock,
  Users,
  Accessibility,
  AlertTriangle
} from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui';
import { useJobStore } from '@/stores/jobStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Job, ContractType, WorkMode, AccessibilityType } from '@/types';

const jobSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères'),
  contractType: z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance']),
  workMode: z.enum(['Présentiel', 'Télétravail', 'Hybride']),
  location: z.object({
    city: z.string().min(2, 'Ville requise'),
    zipCode: z.string().min(5, 'Code postal requis')
  }),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  requirements: z.array(z.string()).min(1, 'Au moins une exigence requise'),
  benefits: z.array(z.string()).min(1, 'Au moins un avantage requis')
}).refine(data => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: 'Le salaire maximum doit être supérieur au minimum',
  path: ['salaryMax']
});

type JobFormData = z.infer<typeof jobSchema>;

const JobEdit: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [selectedAccessibility, setSelectedAccessibility] = useState<AccessibilityType[]>([]);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { jobs, updateJob, fetchJobById, isLoading } = useJobStore();
  const { company } = useAuth();
  const { toast } = useToast();

  const job = jobs.find(j => j.id === jobId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      contractType: 'CDI',
      workMode: 'Hybride',
      requirements: [],
      benefits: []
    }
  });

  const watchedDescription = watch('description');

  useEffect(() => {
    if (jobId && !job) {
      fetchJobById(jobId);
    }
  }, [jobId, job, fetchJobById]);

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        contractType: job.contractType as any,
        workMode: job.workMode as any,
        location: {
          city: job.location.city,
          zipCode: job.location.zipCode || ''
        },
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        requirements: job.requirements || [],
        benefits: job.benefits || []
      });
      setRequirements(job.requirements || ['']);
      setBenefits(job.benefits || ['']);
      setSelectedAccessibility(job.accessibilityFeatures?.map(f => f.type) || []);
    }
  }, [job, reset]);

  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
    setValue('requirements', newRequirements.filter(r => r.trim()));
    setHasChanges(true);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    setValue('requirements', newRequirements.filter(r => r.trim()));
    setHasChanges(true);
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
    setValue('benefits', newBenefits.filter(b => b.trim()));
    setHasChanges(true);
  };

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
    setValue('benefits', newBenefits.filter(b => b.trim()));
    setHasChanges(true);
  };

  const handleAiOptimization = async () => {
    setAiOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimizedDescription = watchedDescription + '\n\n✨ Optimisé par IA :\n- Poste ouvert aux personnes en situation de handicap\n- Environnement de travail inclusif\n- Possibilité d\'aménagements personnalisés';
      
      setValue('description', optimizedDescription);
      setHasChanges(true);
      toast.success('Offre optimisée par IA !', 'Langage inclusif et accessibilité ajoutés');
    } finally {
      setAiOptimizing(false);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!company || !jobId) return;

    try {
      const jobData: Partial<Job> = {
        ...data,
        id: jobId,
        companyId: company.id,
        location: {
          ...data.location,
          street: job?.location.street || '',
          country: 'France'
        },
        accessibilityFeatures: selectedAccessibility.map(type => ({
          type,
          description: `Support pour ${type}`,
          available: true
        })),
        tags: data.title.split(' ').concat(data.description.split(' ')).slice(0, 10),
        aiOptimized: watchedDescription.includes('✨ Optimisé par IA'),
        handibienveillant: watchedDescription.includes('handicap') || watchedDescription.includes('inclusif'),
        updatedAt: new Date().toISOString()
      };

      await updateJob(jobId, jobData);
      toast.success('Offre mise à jour avec succès !');
      setHasChanges(false);
      navigate('/jobs');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour', 'Veuillez réessayer');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        navigate('/jobs');
      }
    } else {
      navigate('/jobs');
    }
  };

  const accessibilityOptions = [
    { type: 'wheelchair_accessible' as AccessibilityType, label: 'Accessible en fauteuil roulant', icon: '♿' },
    { type: 'hearing_impaired' as AccessibilityType, label: 'Malentendants', icon: '👂' },
    { type: 'visually_impaired' as AccessibilityType, label: 'Malvoyants', icon: '👁️' },
    { type: 'cognitive_support' as AccessibilityType, label: 'Troubles cognitifs', icon: '🧠' },
    { type: 'flexible_schedule' as AccessibilityType, label: 'Horaires flexibles', icon: '🕐' },
    { type: 'remote_work' as AccessibilityType, label: 'Télétravail possible', icon: '🏠' }
  ];

  if (!job && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Offre non trouvée
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          L'offre que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/jobs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modifier l'offre
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {job.title}
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <Badge variant="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Modifications non sauvegardées
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations générales */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations générales
          </h2>
          
          <div className="space-y-4">
            <Input
              {...register('title')}
              label="Titre du poste *"
              placeholder="Ex: Développeur Frontend React Senior"
              error={errors.title?.message}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description du poste *
              </label>
              <div className="relative">
                <textarea
                  {...register('description')}
                  placeholder="Décrivez les missions, responsabilités et environnement de travail..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleAiOptimization}
                  disabled={aiOptimizing}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  {aiOptimizing ? 'Optimisation...' : 'IA'}
                </Button>
              </div>
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de contrat *
                </label>
                <select
                  {...register('contractType')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
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
                  Mode de travail *
                </label>
                <select
                  {...register('workMode')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="Présentiel">Présentiel</option>
                  <option value="Télétravail">Télétravail</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('location.city')}
                label="Ville *"
                placeholder="Ex: Paris"
                error={errors.location?.city?.message}
                fullWidth
              />

              <Input
                {...register('location.zipCode')}
                label="Code postal *"
                placeholder="Ex: 75001"
                error={errors.location?.zipCode?.message}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('salaryMin', { valueAsNumber: true })}
                type="number"
                label="Salaire minimum (€/an)"
                placeholder="Ex: 45000"
                error={errors.salaryMin?.message}
                fullWidth
              />

              <Input
                {...register('salaryMax', { valueAsNumber: true })}
                type="number"
                label="Salaire maximum (€/an)"
                placeholder="Ex: 60000"
                error={errors.salaryMax?.message}
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Exigences */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Exigences du poste
          </h2>
          
          <div className="space-y-3">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder="Ex: Maîtrise de React et TypeScript"
                  fullWidth
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  disabled={requirements.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addRequirement}
            >
              + Ajouter une exigence
            </Button>
          </div>
        </Card>

        {/* Avantages */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Avantages proposés
          </h2>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="Ex: Télétravail flexible"
                  fullWidth
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  disabled={benefits.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addBenefit}
            >
              + Ajouter un avantage
            </Button>
          </div>
        </Card>

        {/* Accessibilité */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <Accessibility className="w-5 h-5 inline mr-2" />
            Accessibilité et accompagnement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessibilityOptions.map((option) => (
              <label
                key={option.type}
                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <input
                  type="checkbox"
                  checked={selectedAccessibility.includes(option.type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAccessibility([...selectedAccessibility, option.type]);
                    } else {
                      setSelectedAccessibility(selectedAccessibility.filter(t => t !== option.type));
                    }
                    setHasChanges(true);
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="sm:w-auto"
          >
            Annuler
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            className="sm:w-auto"
            onClick={() => navigate(`/jobs/${jobId}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export { JobEdit };