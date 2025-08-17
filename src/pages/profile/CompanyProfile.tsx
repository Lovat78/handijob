import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Building2, Heart, Shield, BarChart3, Award } from 'lucide-react';
import { Button, Card, Badge, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Company, CompanySize, Address } from '@/types';

interface CompanyProfileProps {
  company?: Company;
  isEditing?: boolean;
  onSave?: (data: Partial<Company>) => Promise<void>;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  size: CompanySize;
  foundedYear: number;
  address: Address;
  values: string[];
  benefits: string[];
  accessibilityCommitment: string;
  oethStatus: boolean;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  company,
  isEditing = false,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: company?.name || '',
    description: company?.description || '',
    website: company?.website || '',
    email: company?.email || '',
    phone: company?.phone || '',
    industry: company?.industry || '',
    size: company?.size || '1-10',
    foundedYear: company?.foundedYear || new Date().getFullYear(),
    address: company?.address || {
      street: '',
      city: '',
      zipCode: '',
      country: 'France'
    },
    values: company?.values || [],
    benefits: company?.benefits || [],
    accessibilityCommitment: company?.accessibilityCommitment || '',
    oethStatus: company?.oethStatus || false
  });

  const [logo, setLogo] = useState<string | null>(company?.logo || null);
  const [isLoading, setIsLoading] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const companySizes: { value: CompanySize; label: string }[] = [
    { value: '1-10', label: 'Très petite entreprise (1-10 employés)' },
    { value: '11-50', label: 'Petite entreprise (11-50 employés)' },
    { value: '51-200', label: 'Entreprise moyenne (51-200 employés)' },
    { value: '201-500', label: 'Grande entreprise (201-500 employés)' },
    { value: '500+', label: 'Très grande entreprise (500+ employés)' }
  ];

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddressChange = useCallback((field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  }, []);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Erreur de fichier', 'Le fichier doit faire moins de 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const addValue = useCallback(() => {
    if (newValue.trim() && !formData.values.includes(newValue.trim())) {
      handleInputChange('values', [...formData.values, newValue.trim()]);
      setNewValue('');
    }
  }, [newValue, formData.values, handleInputChange]);

  const removeValue = useCallback((value: string) => {
    handleInputChange('values', formData.values.filter(v => v !== value));
  }, [formData.values, handleInputChange]);

  const addBenefit = useCallback(() => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      handleInputChange('benefits', [...formData.benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  }, [newBenefit, formData.benefits, handleInputChange]);

  const removeBenefit = useCallback((benefit: string) => {
    handleInputChange('benefits', formData.benefits.filter(b => b !== benefit));
  }, [formData.benefits, handleInputChange]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onSave) return;

    setIsLoading(true);
    try {
      await onSave({ ...formData, logo: logo || undefined });
      toast.success('Profil mis à jour', 'Les informations ont été sauvegardées avec succès');
    } catch (error) {
      toast.error('Erreur de sauvegarde', error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <motion.div variants={fadeIn}>
        <Card padding="lg" className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accessibility-600 px-6 py-8 text-white rounded-t-xl -m-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt="Logo entreprise" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-white/60" />
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white text-primary-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors touch-target"
                    aria-label="Modifier le logo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {isEditing ? 'Modifier le profil entreprise' : (formData.name || 'Profil entreprise')}
                </h1>
                <p className="text-blue-100">
                  {isEditing ? 'Gérez les informations de votre entreprise' : `${formData.address.city}, ${formData.address.country}`}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="sr-only"
              aria-label="Upload logo"
            />

            {/* Informations générales */}
            <motion.section variants={fadeIn}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                Informations générales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nom de l'entreprise"
                  placeholder="Nom de votre entreprise"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  required
                  fullWidth
                />

                <Input
                  label="Secteur d'activité"
                  placeholder="Ex: Technologie, Santé, Finance..."
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  disabled={!isEditing}
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'entreprise *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value as CompanySize)}
                    disabled={!isEditing}
                    required
                    className="input w-full"
                  >
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Année de création"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.foundedYear.toString()}
                  onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value) || new Date().getFullYear())}
                  disabled={!isEditing}
                  fullWidth
                />

                <Input
                  label="Site web"
                  type="url"
                  placeholder="https://votre-site.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />

                <Input
                  label="Email de contact"
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  required
                  fullWidth
                />

                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de l'entreprise *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  required
                  rows={4}
                  className="input w-full resize-none"
                  placeholder="Décrivez votre entreprise, sa mission, ses valeurs et son engagement envers l'inclusion..."
                />
              </div>
            </motion.section>

            {/* Adresse */}
            <motion.section variants={fadeIn}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Rue"
                    placeholder="123 Rue de la République"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    disabled={!isEditing}
                    required
                    fullWidth
                  />
                </div>
                
                <Input
                  label="Ville"
                  placeholder="Paris"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  disabled={!isEditing}
                  required
                  fullWidth
                />

                <Input
                  label="Code postal"
                  placeholder="75001"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  disabled={!isEditing}
                  required
                  fullWidth
                />
              </div>
            </motion.section>

            {/* Valeurs */}
            <motion.section variants={fadeIn}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-success-600" />
                Valeurs de l'entreprise
              </h2>
              
              {isEditing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Ajouter une valeur"
                    className="input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    onClick={addValue}
                    disabled={!newValue.trim()}
                  >
                    Ajouter
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {formData.values.map((value, index) => (
                  <Badge
                    key={index}
                    variant="success"
                    size="md"
                    className="inline-flex items-center gap-2"
                  >
                    {value}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeValue(value)}
                        className="text-success-600 hover:text-success-800 ml-1 transition-colors"
                        aria-label={`Supprimer ${value}`}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.values.length === 0 && (
                  <p className="text-gray-500 text-sm">Aucune valeur ajoutée</p>
                )}
              </div>
            </motion.section>

            {/* Avantages */}
            <motion.section variants={fadeIn}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-warning-600" />
                Avantages proposés
              </h2>
              
              {isEditing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Ajouter un avantage"
                    className="input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    onClick={addBenefit}
                    disabled={!newBenefit.trim()}
                  >
                    Ajouter
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="warning"
                    size="md"
                    className="inline-flex items-center gap-2"
                  >
                    {benefit}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="text-warning-600 hover:text-warning-800 ml-1 transition-colors"
                        aria-label={`Supprimer ${benefit}`}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-gray-500 text-sm">Aucun avantage ajouté</p>
                )}
              </div>
            </motion.section>

            {/* Engagement accessibilité */}
            <motion.section variants={fadeIn}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accessibility-600" />
                Engagement accessibilité
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez votre engagement envers l'accessibilité et l'inclusion
                  </label>
                  <textarea
                    value={formData.accessibilityCommitment}
                    onChange={(e) => handleInputChange('accessibilityCommitment', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="input w-full resize-none"
                    placeholder="Décrivez les aménagements, politiques et initiatives de votre entreprise pour l'inclusion des personnes en situation de handicap..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="oethStatus"
                    checked={formData.oethStatus}
                    onChange={(e) => handleInputChange('oethStatus', e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="oethStatus" className="text-sm font-medium text-gray-700">
                    Notre entreprise respecte l'Obligation d'Emploi des Travailleurs Handicapés (OETH)
                  </label>
                </div>

                {company?.oethRate !== undefined && (
                  <div className="bg-accessibility-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-accessibility-800">
                        Taux d'emploi OETH
                      </span>
                      <span className="text-lg font-bold text-accessibility-600">
                        {company.oethRate}%
                      </span>
                    </div>
                    <div className="w-full bg-accessibility-200 rounded-full h-2">
                      <div
                        className="bg-accessibility-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(company.oethRate / 6 * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-accessibility-700 mt-1">
                      Objectif légal : 6% minimum
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Actions */}
            {isEditing && (
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </Button>
                {onCancel && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={onCancel}
                  >
                    Annuler
                  </Button>
                )}
              </motion.div>
            )}
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};