// src/components/profile/UserProfile.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Edit3, 
  Save, 
  X,
  Shield,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Settings,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Card, Input, Badge, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface UserProfileProps {
  isModal?: boolean;
  onClose?: () => void;
  editable?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isModal = false,
  onClose,
  editable = true,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  
  const { user, company } = useAuth();
  const { toast } = useToast();

  // États pour l'édition
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    jobTitle: '',
    experience: '',
    skills: [] as string[],
    languages: [] as string[],
    availability: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profil mis à jour', 'Vos informations ont été sauvegardées.');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur', 'Impossible de sauvegarder le profil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      jobTitle: '',
      experience: '',
      skills: [],
      languages: [],
      availability: true
    });
    setIsEditing(false);
  };

  const exportPersonalData = () => {
    const data = {
      profile: {
        ...formData,
        userId: user?.id,
        role: user?.role,
        createdAt: user?.createdAt,
        lastLoginAt: user?.lastLoginAt
      },
      company: company,
      privacy: {
        profileVisible: true,
        dataProcessingConsent: true,
        marketingConsent: false
      },
      exportDate: new Date().toISOString(),
      rgpdCompliance: true
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profil-${user?.firstName}-${user?.lastName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Export terminé', 'Vos données personnelles ont été téléchargées.');
  };

  const ProfileContent = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec photo et actions */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Infos principales */}
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Prénom"
                      className="w-32"
                    />
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Nom"
                      className="w-32"
                    />
                  </div>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="Titre professionnel"
                    className="w-full"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {formData.jobTitle || (user?.role === 'company' ? 'Recruteur' : 'Candidat')}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {formData.location || 'France'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Membre depuis {new Date(user?.createdAt || Date.now()).getFullYear()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {editable && (
              <>
                {isEditing ? (
                  <>
                    <Button variant="ghost" onClick={handleCancel} disabled={isLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </>
            )}
            
            <Button variant="ghost" onClick={() => setShowPersonalData(!showPersonalData)}>
              {showPersonalData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Badges et statuts */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="success" size="sm">
            ✓ Email vérifié
          </Badge>
          <Badge variant="info" size="sm">
            {user?.role === 'company' ? '🏢 Entreprise' : '👤 Candidat'}
          </Badge>
          {user?.role === 'candidate' && (
            <Badge variant="warning" size="sm">
              ♿ Accompagnement disponible
            </Badge>
          )}
          {formData.availability && (
            <Badge variant="success" size="sm">
              🟢 Disponible
            </Badge>
          )}
        </div>
      </Card>

      {/* Informations de contact */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Informations de contact
        </h3>
        
        {showPersonalData ? (
          <div className="space-y-3">
            {isEditing ? (
              <>
                <Input
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  leftIcon={<Mail className="w-4 h-4" />}
                  fullWidth
                />
                <Input
                  label="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  leftIcon={<Phone className="w-4 h-4" />}
                  placeholder="+33 6 12 34 56 78"
                  fullWidth
                />
                <Input
                  label="Localisation"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  placeholder="Paris, France"
                  fullWidth
                />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                {formData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{formData.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{formData.location || 'Non renseigné'}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Données personnelles masquées pour la confidentialité
            </p>
            <Button variant="secondary" size="sm" onClick={() => setShowPersonalData(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Afficher mes données
            </Button>
          </div>
        )}
      </Card>

      {/* Informations professionnelles (candidat uniquement) */}
      {user?.role === 'candidate' && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Profil professionnel
          </h3>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biographie professionnelle
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none"
                    placeholder="Décrivez votre parcours et vos objectifs..."
                  />
                </div>
                <Input
                  label="Années d'expérience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Ex: 5 ans"
                  fullWidth
                />
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">À propos</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.bio || 'Professionnel expérimenté dans le domaine du recrutement inclusif et de l\'accompagnement des personnes en situation de handicap.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Expérience
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.experience || '3+ années'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Compétences principales
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {['Accessibilité', 'Inclusion', 'RH'].map((skill) => (
                        <Badge key={skill} variant="default" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Informations entreprise (company uniquement) */}
      {user?.role === 'company' && company && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Entreprise
          </h3>

          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{company.industry}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Taille :</span>
                <span className="ml-2 text-gray-900 dark:text-white">{company.size} employés</span>
              </div>
              <div>
                <span className="text-gray-500">Taux OETH :</span>
                <span className="ml-2 text-gray-900 dark:text-white">{company.oethRate}%</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                ✓ Entreprise engagée dans l'inclusion et le handicap
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Actions RGPD */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Mes données personnelles (RGPD)
        </h3>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conformément au RGPD, vous avez un contrôle total sur vos données personnelles.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={exportPersonalData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter mes données
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/settings'}>
              <Settings className="w-4 h-4 mr-2" />
              Gérer mes données
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  if (isModal) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose || (() => {})}
        title="Mon profil"
        size="lg"
      >
        <ProfileContent />
      </Modal>
    );
  }

  return <ProfileContent />;
};

export { UserProfile };