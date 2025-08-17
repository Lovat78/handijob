// src/pages/profile/Settings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Accessibility,
  Volume2,
  Type,
  Contrast,
  Lock,
  Database,
  FileText,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useOnboarding } from '@/components/onboarding/GuidedTour';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, company } = useAuth();
  const { toast } = useToast();
  const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { startOnboarding } = useOnboarding();

  // États pour les préférences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newMatches: true,
    applications: true,
    messages: true,
    newsletter: false
  });

  const [accessibility, setAccessibility] = useState({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataProcessing: true
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'company', label: 'Entreprise', icon: <Building className="w-4 h-4" />, companyOnly: true },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Confidentialité', icon: <Shield className="w-4 h-4" /> },
    { id: 'data', label: 'Mes données', icon: <Database className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibilité', icon: <Accessibility className="w-4 h-4" /> },
    { id: 'appearance', label: 'Apparence', icon: <Palette className="w-4 h-4" /> },
    { id: 'account', label: 'Compte', icon: <Lock className="w-4 h-4" /> }
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      toast.success('Paramètres sauvegardés', `Les paramètres ${section} ont été mis à jour.`);
    } catch (error) {
      toast.error('Erreur', 'Impossible de sauvegarder les paramètres.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    openConfirmDialog({
      type: 'danger',
      title: 'Supprimer le compte',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte ?\n\nCette action est irréversible et supprimera toutes vos données.',
      confirmText: 'Supprimer définitivement',
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Compte supprimé', 'Votre compte a été supprimé définitivement.');
      }
    });
  };

  const handleExportData = () => {
    toast.info('Export en cours', 'Vos données sont en cours de préparation...');
    setTimeout(() => {
      // Simulation de téléchargement
      const data = {
        user: user,
        company: company,
        exportDate: new Date().toISOString(),
        dataTypes: ['profile', 'applications', 'messages', 'preferences']
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `handi-jobs-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Export terminé', 'Vos données ont été téléchargées.');
    }, 2000);
  };

  const handleRequestDataDeletion = () => {
    openConfirmDialog({
      type: 'warning',
      title: 'Demande de suppression des données',
      message: 'Voulez-vous demander la suppression de toutes vos données personnelles ?\n\nUne demande sera envoyée à notre équipe qui la traitera dans les 30 jours.',
      confirmText: 'Demander la suppression',
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Demande envoyée', 'Votre demande de suppression a été transmise à notre équipe.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres & Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez vos préférences, données personnelles et paramètres RGPD
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs
                .filter(tab => !tab.companyOnly || user?.role === 'company')
                .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-3">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informations personnelles
                  </h2>
                  <Button variant="primary" onClick={() => handleSave('profil')} isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      defaultValue={user?.firstName}
                      leftIcon={<User className="w-4 h-4" />}
                      fullWidth
                    />
                    <Input
                      label="Nom"
                      defaultValue={user?.lastName}
                      leftIcon={<User className="w-4 h-4" />}
                      fullWidth
                    />
                  </div>
                  
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email}
                    leftIcon={<Mail className="w-4 h-4" />}
                    fullWidth
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Téléphone"
                      placeholder="+33 6 12 34 56 78"
                      leftIcon={<Phone className="w-4 h-4" />}
                      fullWidth
                    />
                    <Input
                      label="Localisation"
                      placeholder="Paris, France"
                      leftIcon={<MapPin className="w-4 h-4" />}
                      fullWidth
                    />
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Photo de profil
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Changer la photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG max 2MB
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Data Management Tab - NOUVEAU */}
          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* RGPD Banner */}
              <Card padding="md">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                        Vos droits RGPD
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Conformément au RGPD, vous avez un contrôle total sur vos données personnelles.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Gestion de mes données
                </h2>

                <div className="space-y-6">
                  {/* Export Data */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger mes données
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Obtenez une copie complète de toutes vos données personnelles stockées sur Handi.jobs.
                          Le fichier contiendra votre profil, candidatures, messages et préférences.
                        </p>
                        <p className="text-xs text-gray-500">
                          Format : JSON • Délai : Immédiat • Taille estimée : {user?.role === 'company' ? '2-5 MB' : '500 KB - 2 MB'}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={handleExportData}
                        className="ml-4"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>

                  {/* Data Portability */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Portabilité des données
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Transférez vos données vers un autre service. Nous pouvons générer un export 
                          dans un format standardisé compatible avec d'autres plateformes.
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats disponibles : JSON, CSV, XML
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="ml-4"
                      >
                        Demander
                      </Button>
                    </div>
                  </div>

                  {/* Data Categories */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Catégories de données collectées
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { category: 'Identité', details: 'Nom, prénom, email, téléphone' },
                        { category: 'Profil professionnel', details: 'CV, compétences, expériences' },
                        { category: 'Candidatures', details: 'Offres, statuts, échanges' },
                        { category: 'Préférences', details: 'Notifications, accessibilité' },
                        { category: 'Données techniques', details: 'Logs de connexion, IP' },
                        { category: 'Entreprise', details: 'Informations société (si applicable)' }
                      ].map((item) => (
                        <div key={item.category} className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.category}
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            {item.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Retention */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Conservation des données
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Données de profil</span>
                        <span className="text-gray-900 dark:text-white">Tant que le compte est actif</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Candidatures</span>
                        <span className="text-gray-900 dark:text-white">3 ans après la dernière activité</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Logs techniques</span>
                        <span className="text-gray-900 dark:text-white">12 mois maximum</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Deletion */}
                  <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-red-900 dark:text-red-200 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suppression de mes données
                        </h3>
                        <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                          Demandez la suppression complète de toutes vos données personnelles.
                          Cette action est irréversible et votre compte sera définitivement fermé.
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          Délai de traitement : 30 jours maximum conformément au RGPD
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={handleRequestDataDeletion}
                        className="ml-4 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Demander
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confidentialité et sécurité
                  </h2>
                  <Button variant="primary" onClick={() => handleSave('confidentialité')} isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Visibilité du profil
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'profileVisible', label: 'Profil visible publiquement', description: 'Votre profil peut être trouvé dans les recherches' },
                        { key: 'showEmail', label: 'Afficher l\'email', description: 'Votre email sera visible sur votre profil' },
                        { key: 'showPhone', label: 'Afficher le téléphone', description: 'Votre numéro sera visible sur votre profil' },
                        { key: 'allowMessages', label: 'Autoriser les messages', description: 'Les recruteurs peuvent vous contacter directement' }
                      ].map((option) => (
                        <label key={option.key} className="flex items-start justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {option.label}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {option.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy[option.key as keyof typeof privacy] as boolean}
                            onChange={(e) => setPrivacy(prev => ({
                              ...prev,
                              [option.key]: e.target.checked
                            }))}
                            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Consentement RGPD
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-start justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Traitement des données personnelles
                          </span>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Autoriser Handi.jobs à traiter vos données pour le matching et les recommandations
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.dataProcessing}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, dataProcessing: e.target.checked }))}
                          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        Vous pouvez retirer votre consentement à tout moment. Certaines fonctionnalités peuvent être limitées.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Account Tab - Mise à jour */}
          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="md">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Sécurité du compte
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Changer le mot de passe
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <Input
                        label="Mot de passe actuel"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="w-4 h-4" />}
                        fullWidth
                      />
                      <Input
                        label="Nouveau mot de passe"
                        type={showPassword ? 'text' : 'password'}
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
                        fullWidth
                      />
                      <Input
                        label="Confirmer le nouveau mot de passe"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="w-4 h-4" />}
                        fullWidth
                      />
                      <Button variant="primary" isLoading={isLoading}>
                        Mettre à jour le mot de passe
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Sessions actives
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Session actuelle
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Chrome sur Windows • Paris, France
                          </p>
                        </div>
                        <Badge variant="success" size="sm">Actuel</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Mobile Safari
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            iPhone • il y a 2 heures
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Déconnecter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tour guidé */}
              <Card padding="md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Aide et assistance
                </h3>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Relancer le tour guidé
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Redécouvrez les fonctionnalités principales de Handi.jobs avec notre tour interactif.
                        Parfait pour se rafraîchir la mémoire ou explorer de nouvelles fonctionnalités.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        startOnboarding();
                        toast.info('Tour guidé', 'Le tour guidé va commencer dans quelques instants...');
                      }}
                      className="ml-4"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Démarrer
                    </Button>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <h2 className="text-lg font-semibold text-red-600 mb-4">
                  Zone de danger
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-md font-medium text-red-900 dark:text-red-200 mb-2">
                      Supprimer le compte
                    </h3>
                    <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées 
                      conformément au RGPD.
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer définitivement mon compte
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Les autres tabs restent identiques... */}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialogComponent />
    </div>
  );
};

export { Settings };