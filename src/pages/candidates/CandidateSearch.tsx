// src/pages/candidates/CandidateSearch.tsx - VERSION CONNECTÉE
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User,
  Brain,
  MapPin,
  Briefcase,
  Star,
  Sliders
} from 'lucide-react';
import { Button, Card, Badge, Input, Spinner } from '@/components/ui';
import { CandidateCard } from '@/components/candidate/CandidateCard';
import { ContactModal } from '@/components/modals/ContactModal';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useCandidateStore } from '@/stores/candidateStore';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';
import { createAllHandlers } from '@/utils/actionHandlers';

const CandidateSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactConfig, setContactConfig] = useState<{
    type: 'candidate' | 'company';
    targetId: string;
    jobId: string | null;
  } | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

  const { 
    candidates, 
    isLoading, 
    searchFilters, 
    fetchCandidates, 
    setSearchFilters 
  } = useCandidateStore();

  // Créer les handlers avec le contexte
  const handlers = createAllHandlers({
    navigate,
    toast,
    openConfirmDialog
  });

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    if (debouncedSearch) {
      setSearchFilters({ search: debouncedSearch });
      // Déclencher recherche avec délai pour simulation
      handlers.search.handleSearch(debouncedSearch, searchFilters);
    }
  }, [debouncedSearch]);

  // Handlers spécifiques à cette page
  const handleViewProfile = (candidateId: string) => {
    handlers.candidate.handleViewCandidateProfile(candidateId);
  };

  const handleContactCandidate = (candidateId: string) => {
    handlers.candidate.handleContactCandidate(
      candidateId,
      setContactConfig,
      setShowContactModal
    );
  };

  const handleSaveCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      handlers.candidate.handleSaveCandidate(
        candidateId, 
        `${candidate.profile.firstName} ${candidate.profile.lastName}`
      );
    }
  };

  const handleClearFilters = () => {
    const resetFilters = () => {
      setSearchFilters({
        search: '',
        skills: [],
        location: '',
        availability: true,
        disabilityTypes: [],
        experienceLevel: ''
      });
      setSearchTerm('');
    };
    
    handlers.search.handleClearFilters(resetFilters);
  };

  const handleSendMessage = async (message: string, targetId: string) => {
    await handlers.modal.handleSendMessage(message, targetId, { navigate, toast, openConfirmDialog });
    setShowContactModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Recherche de candidats
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Trouvez les talents qui correspondent à vos besoins
          </p>
        </div>
        
        <Button 
          variant="primary"
          onClick={() => handlers.navigation.handleGoToMatching()}
        >
          <Brain className="w-4 h-4 mr-2" />
          Matching IA
        </Button>
      </div>

      {/* Search and Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher par compétences, expérience, titre..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setFilterOpen(!filterOpen)}
            className="md:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>

        {/* Advanced Filters Panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Localisation
                </label>
                <Input
                  type="text"
                  placeholder="Ville, région..."
                  leftIcon={<MapPin className="w-4 h-4" />}
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({ location: e.target.value })}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niveau d'expérience
                </label>
                <select
                  value={searchFilters.experienceLevel}
                  onChange={(e) => setSearchFilters({ experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">Tous niveaux</option>
                  <option value="junior">Junior (0-2 ans)</option>
                  <option value="intermediate">Intermédiaire (3-5 ans)</option>
                  <option value="senior">Senior (6-10 ans)</option>
                  <option value="expert">Expert (10+ ans)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compétences clés
                </label>
                <Input
                  type="text"
                  placeholder="React, Python, Design..."
                  leftIcon={<Star className="w-4 h-4" />}
                  value={searchFilters.skills.join(', ')}
                  onChange={(e) => setSearchFilters({ 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  fullWidth
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={searchFilters.availability}
                  onChange={(e) => setSearchFilters({ availability: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Disponible uniquement
                </span>
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                <Sliders className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Search Statistics */}
      {searchTerm && (
        <Card padding="sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Recherche pour "{searchTerm}"
            </span>
            <Badge variant="info" size="sm">
              {candidates.length} résultat{candidates.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </Card>
      )}

      {/* Results */}
      {candidates.length === 0 ? (
        <Card padding="lg">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun candidat trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Essayez de modifier vos critères de recherche ou utilisez des mots-clés différents
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="ghost" onClick={handleClearFilters}>
                Réinitialiser les filtres
              </Button>
              <Button 
                variant="primary"
                onClick={() => handlers.navigation.handleGoToMatching()}
              >
                <Brain className="w-4 h-4 mr-2" />
                Essayer le matching IA
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Tri et actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {candidates.length} candidat{candidates.length > 1 ? 's' : ''} trouvé{candidates.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trier par :</span>
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                <option>Pertinence</option>
                <option>Expérience</option>
                <option>Disponibilité</option>
                <option>Localisation</option>
              </select>
            </div>
          </div>

          {/* Liste des candidats */}
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewProfile={handleViewProfile}
              onContact={handleContactCandidate}
              onSave={handleSaveCandidate}
            />
          ))}
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && contactConfig && (
        <ContactModal
          isOpen={showContactModal}
          type={contactConfig.type}
          targetId={contactConfig.targetId}
          jobId={contactConfig.jobId}
          onClose={() => setShowContactModal(false)}
          onSend={handleSendMessage}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialogComponent />
    </div>
  );
};

export { CandidateSearch };