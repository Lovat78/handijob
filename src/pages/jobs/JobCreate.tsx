// src/pages/jobs/JobCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Brain,
  MapPin,
  Euro,
  Clock,
  Briefcase,
  Users,
  Accessibility,
  Plus,
  X,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Input, Badge, Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useJobStore } from '@/stores/jobStore';
import { Job, ContractType, WorkMode } from '@/types';

const jobSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères'),
  contractType: z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance']),
  workMode: z.enum(['Présentiel', 'Télétravail', 'Hybride']),
  location: z.object({
    street: z.string().optional(),
    city: z.string().min(2, 'La ville est requise'),
    zipCode: z.string().min(5, 'Le code postal est requis'),
    country: z.string().default('France')
  }),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional()
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: "Le salaire maximum doit être supérieur au minimum",
  path: ["salaryMax"]
});

type JobFormData = z.infer<typeof jobSchema>;

const JobCreate: React.FC = () => {
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { company } = useAuth();
  const { createJob } = useJobStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      location: { country: 'France' }
    }
  });

  const watchedData = watch();

  // Options d'accessibilité
  const accessibilityOptions = [
    { type: 'wheelchair_accessible', label: 'Accessible PMR', icon: '♿' },
    { type: 'hearing_impaired', label: 'Adaptation malentendants', icon: '👂' },
    { type: 'visually_impaired', label: 'Adaptation malvoyants', icon: '👁️' },
    { type: 'cognitive_support', label: 'Support cognitif', icon: '🧠' },
    { type: 'flexible_schedule', label: 'Horaires flexibles', icon: '⏰' },
    { type: 'remote_work', label: 'Télétravail possible', icon: '💻' }
  ];

  // Gestion des exigences
  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  // Gestion des avantages
  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  // Gestion des tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Optimisation IA
  const handleAiOptimization = async () => {
    if (!watchedData.description) {
      toast.warning('Description manquante', 'Ajoutez une description pour utiliser l\'optimisation IA.');
      return;
    }

    setAiOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      
      // Suggestions d'amélioration
      const suggestions = [
        "Mettre en avant l'accessibilité du poste",
        "Ajouter des mots-clés inclusifs",
        "Préciser les aménagements possibles"
      ];
      
      toast.success('Optimisation terminée !', 'Votre offre a été optimisée pour l\'inclusion.');
      
      // Ajouter automatiquement des tags suggérés
      const suggestedTags = ['Inclusion', 'Accessibilité', 'Diversité'];
      setTags(prev => [...new Set([...prev, ...suggestedTags])]);
      
    } catch (error) {
      toast.error('Erreur', 'Impossible d\'optimiser l\'offre. Veuillez réessayer.');
    } finally {
      setAiOptimizing(false);
    }
  };

  // Soumission du formulaire
  const onSubmit = async (data: JobFormData) => {
    if (!company) {
      toast.error('Erreur', 'Informations entreprise manquantes.');
      return;
    }

    setIsLoading(true);
    try {
      const jobData: Partial<Job> = {
        ...data,
        companyId: company.id,
        requirements: requirements.filter(req => req.trim() !== ''),
        benefits: benefits.filter(ben => ben.trim() !== ''),
        tags,
        accessibilityFeatures: selectedAccessibility.map(type => {
          const option = accessibilityOptions.find(opt => opt.type === type);
          return {
            type: type as any,
            description: option?.label || '',
            available: true
          };
        }),
        status: 'active',
        aiOptimized: tags.includes('IA Optimisé'),
        handibienveillant: selectedAccessibility.length > 0
      };

      await createJob(jobData);
      toast.success('Offre créée !', 'Votre offre d\'emploi a été publiée avec succès.');
      navigate('/jobs');
      
    } catch (error) {
      toast.error('Erreur', 'Impossible de créer l\'offre. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Créer une offre d'emploi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Rédigez une offre attractive et inclusive avec l'aide de notre IA
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
          >
            Annuler
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations de base
          </h2>
          
          <div className="space-y-4">
            <Input
              {...register('title')}
              label="Titre du poste *"
              placeholder="ex: Développeur Frontend Senior"
              error={errors.title?.message}
              fullWidth
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description du poste *
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAiOptimization}
                  isLoading={aiOptimizing}
                  disabled={!watchedData.description}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Optimiser avec IA
                </Button>
              </div>
              <textarea
                {...register('description')}
                placeholder="Décrivez les missions, responsabilités et environnement de travail..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Input
                  {...register('location.city')}
                  label="Ville *"
                  placeholder="Paris, Lyon..."
                  leftIcon={<MapPin className="w-4 h-4" />}
                  error={errors.location?.city?.message}
                  fullWidth
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('salaryMin', { valueAsNumber: true })}
                label="Salaire minimum (€/an)"
                type="number"
                placeholder="45000"
                leftIcon={<Euro className="w-4 h-4" />}
                fullWidth
              />
              <Input
                {...register('salaryMax', { valueAsNumber: true })}
                label="Salaire maximum (€/an)"
                type="number"
                placeholder="65000"
                leftIcon={<Euro className="w-4 h-4" />}
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
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder="ex: 3+ années d'expérience en React"
                  className="flex-1"
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addRequirement}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une exigence
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
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="ex: Télétravail flexible"
                  className="flex-1"
                />
                {benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addBenefit}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un avantage
            </Button>
          </div>
        </Card>

        {/* Compétences recherchées */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compétences recherchées
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="ex: React, TypeScript, Design..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag}>
                Ajouter
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="info" size="sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Accessibilité */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Accessibility className="w-5 h-5 mr-2" />
            Accessibilité et inclusion
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

          {selectedAccessibility.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Offre Handibienveillante
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Cette offre sera marquée comme inclusive et apparaîtra en priorité dans les recherches des candidats en situation de handicap.
              </p>
            </div>
          )}
        </Card>

        {/* Conseil IA */}
        <Card padding="md">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                💡 Conseils pour une offre attractive
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>• Utilisez un langage inclusif et évitez les termes discriminants</li>
                <li>• Mentionnez explicitement l'ouverture aux personnes en situation de handicap</li>
                <li>• Décrivez les aménagements et adaptations possibles du poste</li>
                <li>• Mettez en avant la culture d'entreprise et les valeurs d'inclusion</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/jobs')}
            className="sm:w-auto"
          >
            Annuler
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            className="sm:w-auto"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          
          <Button
            type="submit"
            isLoading={isLoading}
            className="sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Publier l'offre
          </Button>
        </div>
      </form>
    </div>
  );
};

export { JobCreate };