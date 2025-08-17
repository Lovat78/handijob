import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid3X3, List, ChevronLeft, ChevronRight,
  MapPin, Clock, Briefcase, Euro, User, Shield, Plus, X
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useCandidateStore } from '@/hooks/useCandidateStore';
import { Candidate, User as UserType } from '@/types';

interface FilterOptions {
  search: string;
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  location: string;
  availability: boolean[];
  preferredWorkMode: string[];
  hasAccessibilityNeeds: boolean | null;
  salaryMin: number;
  salaryMax: number;
}

interface SortOption {
  field: 'name' | 'experience' | 'lastActive' | 'createdAt';
  direction: 'asc' | 'desc';
}

interface CandidateListProps {
  initialFilters?: Partial<FilterOptions>;
  onCandidateSelect?: (candidate: Candidate) => void;
  onCandidatesSelect?: (candidates: Candidate[]) => void;
  selectable?: boolean;
  multiSelect?: boolean;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const CandidateList: React.FC<CandidateListProps> = ({
  initialFilters = {},
  onCandidateSelect,
  onCandidatesSelect,
  selectable = false,
  multiSelect = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    candidates, 
    isLoading, 
    error, 
    fetchCandidates, 
    searchCandidates 
  } = useCandidateStore();

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    skills: [],
    experienceMin: 0,
    experienceMax: 20,
    location: '',
    availability: [],
    preferredWorkMode: [],
    hasAccessibilityNeeds: null,
    salaryMin: 0,
    salaryMax: 200000,
    ...initialFilters
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'lastActive',
    direction: 'desc'
  });

  const [newSkill, setNewSkill] = useState('');

  // Available options
  const workModeOptions = [
    { value: 'Présentiel', label: 'Présentiel' },
    { value: 'Télétravail', label: 'Télétravail' },
    { value: 'Hybride', label: 'Hybride' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Nom (A-Z)', field: 'name' as const, direction: 'asc' as const },
    { value: 'name-desc', label: 'Nom (Z-A)', field: 'name' as const, direction: 'desc' as const },
    { value: 'experience-desc', label: 'Expérience (Plus à moins)', field: 'experience' as const, direction: 'desc' as const },
    { value: 'experience-asc', label: 'Expérience (Moins à plus)', field: 'experience' as const, direction: 'asc' as const },
    { value: 'lastActive-desc', label: 'Récemment actif', field: 'lastActive' as const, direction: 'desc' as const },
    { value: 'createdAt-desc', label: 'Récemment inscrit', field: 'createdAt' as const, direction: 'desc' as const }
  ];

  // Effects
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    if (filters.search) {
      const debounceTimer = setTimeout(() => {
        searchCandidates(filters.search);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [filters.search, searchCandidates]);

  // Filtered and sorted candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      // Skills filter
      if (filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.every(skill =>
          candidate.profile.skills.some(candidateSkill =>
            candidateSkill.name.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasRequiredSkills) return false;
      }

      // Experience filter
      if (candidate.profile.experience < filters.experienceMin || candidate.profile.experience > filters.experienceMax) {
        return false;
      }

      // Location filter
      if (filters.location && !candidate.profile.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Work mode filter
      if (filters.preferredWorkMode.length > 0 && candidate.preferences?.workMode) {
        if (!filters.preferredWorkMode.includes(candidate.preferences.workMode)) {
          return false;
        }
      }

      // Accessibility filter
      if (filters.hasAccessibilityNeeds !== null) {
        const hasNeeds = candidate.accessibility.needsAccommodation;
        if (filters.hasAccessibilityNeeds !== hasNeeds) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOption.field) {
        case 'name':
          aValue = `${a.profile.lastName} ${a.profile.firstName}`.toLowerCase();
          bValue = `${b.profile.lastName} ${b.profile.firstName}`.toLowerCase();
          break;
        case 'experience':
          aValue = a.profile.experience;
          bValue = b.profile.experience;
          break;
        case 'lastActive':
          aValue = new Date(a.lastActive).getTime();
          bValue = new Date(b.lastActive).getTime();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOption.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCandidates, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCandidates, currentPage, itemsPerPage]);

  // Handlers
  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      setSortOption({ field: option.field, direction: option.direction });
    }
  }, []);

  const handleCandidateSelect = useCallback((candidate: Candidate) => {
    if (!selectable) return;

    if (multiSelect) {
      setSelectedCandidates(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(candidate.id)) {
          newSelected.delete(candidate.id);
        } else {
          newSelected.add(candidate.id);
        }
        
        const selectedCandidatesList = sortedCandidates.filter(c => newSelected.has(c.id));
        onCandidatesSelect?.(selectedCandidatesList);
        
        return newSelected;
      });
    } else {
      onCandidateSelect?.(candidate);
    }
  }, [selectable, multiSelect, onCandidateSelect, onCandidatesSelect, sortedCandidates]);

  const addSkillFilter = useCallback(() => {
    if (newSkill.trim() && !filters.skills.includes(newSkill.trim())) {
      handleFilterChange('skills', [...filters.skills, newSkill.trim()]);
      setNewSkill('');
    }
  }, [newSkill, filters.skills, handleFilterChange]);

  const removeSkillFilter = useCallback((skill: string) => {
    handleFilterChange('skills', filters.skills.filter(s => s !== skill));
  }, [filters.skills, handleFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      skills: [],
      experienceMin: 0,
      experienceMax: 20,
      location: '',
      availability: [],
      preferredWorkMode: [],
      hasAccessibilityNeeds: null,
      salaryMin: 0,
      salaryMax: 200000
    });
    setCurrentPage(1);
  }, []);

  const selectAll = useCallback(() => {
    if (!multiSelect) return;
    const allIds = new Set(paginatedCandidates.map(c => c.id));
    setSelectedCandidates(allIds);
    onCandidatesSelect?.(paginatedCandidates);
  }, [multiSelect, paginatedCandidates, onCandidatesSelect]);

  const deselectAll = useCallback(() => {
    setSelectedCandidates(new Set());
    onCandidatesSelect?.([]);
  }, [onCandidatesSelect]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatSalaryRange = (candidate: Candidate) => {
    if (!candidate.preferences?.salary) return 'Non spécifié';
    const { min, max } = candidate.preferences.salary;
    return `${min.toLocaleString('fr-FR')} - ${max.toLocaleString('fr-FR')} €`;
  };

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        <Card padding="lg" className="text-center">
          <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-error-600" />
          </div>
          <h3 className="text-lg font-medium text-error-800 mb-2">Erreur de chargement</h3>
          <p className="text-error-600 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => fetchCandidates()}
          >
            Réessayer
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div variants={fadeIn} className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Candidats</h1>
            <p className="text-gray-600 mt-2">
              {sortedCandidates.length} candidat{sortedCandidates.length > 1 ? 's' : ''} trouvé{sortedCandidates.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors touch-target ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Vue grille"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors touch-target ${
                  viewMode === 'table'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Vue tableau"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters toggle */}
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, compétences, localisation..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input w-full pl-12"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort */}
            <select
              value={`${sortOption.field}-${sortOption.direction}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Multi-select controls */}
            {multiSelect && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                >
                  Tout sélectionner
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAll}
                >
                  Tout désélectionner
                </Button>
                {selectedCandidates.size > 0 && (
                  <Badge variant="info" size="md">
                    {selectedCandidates.size} sélectionné{selectedCandidates.size > 1 ? 's' : ''}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Clear filters */}
          {(filters.skills.length > 0 || filters.location || filters.preferredWorkMode.length > 0 || filters.hasAccessibilityNeeds !== null) && (
            <button
              onClick={clearFilters}
              className="text-sm text-error-600 hover:text-error-800 transition-colors"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      </motion.div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <Card padding="lg" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skills filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Ajouter une compétence"
                      className="input flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillFilter())}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={addSkillFilter}
                      disabled={!newSkill.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="info"
                        size="sm"
                        className="inline-flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillFilter(skill)}
                          className="text-info-600 hover:text-info-800"
                          aria-label={`Supprimer ${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience (années)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={filters.experienceMin}
                      onChange={(e) => handleFilterChange('experienceMin', parseInt(e.target.value) || 0)}
                      className="input w-20"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={filters.experienceMax}
                      onChange={(e) => handleFilterChange('experienceMax', parseInt(e.target.value) || 20)}
                      className="input w-20"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Location filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Ville, région..."
                    className="input w-full"
                  />
                </div>

                {/* Work mode filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de travail
                  </label>
                  <div className="space-y-2">
                    {workModeOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.preferredWorkMode.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('preferredWorkMode', [...filters.preferredWorkMode, option.value]);
                            } else {
                              handleFilterChange('preferredWorkMode', filters.preferredWorkMode.filter(w => w !== option.value));
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accessibility filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Besoins d'accessibilité
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accessibility"
                        checked={filters.hasAccessibilityNeeds === null}
                        onChange={() => handleFilterChange('hasAccessibilityNeeds', null)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Tous</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accessibility"
                        checked={filters.hasAccessibilityNeeds === true}
                        onChange={() => handleFilterChange('hasAccessibilityNeeds', true)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Avec besoins d'accessibilité</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accessibility"
                        checked={filters.hasAccessibilityNeeds === false}
                        onChange={() => handleFilterChange('hasAccessibilityNeeds', false)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Sans besoins spécifiques</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading && (
        <motion.div
          variants={fadeIn}
          className="flex justify-center items-center py-12"
        >
          <div className="spinner" />
        </motion.div>
      )}

      {/* No results */}
      {!isLoading && sortedCandidates.length === 0 && (
        <motion.div variants={fadeIn}>
          <Card padding="lg" className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou vos filtres.
            </p>
            <Button
              variant="primary"
              onClick={clearFilters}
            >
              Effacer les filtres
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {!isLoading && sortedCandidates.length > 0 && (
        <>
          {/* Grid view */}
          {viewMode === 'grid' && (
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {paginatedCandidates.map(candidate => (
                <motion.div
                  key={candidate.id}
                  variants={fadeIn}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    padding="md"
                    hoverable
                    className={`cursor-pointer border-2 transition-all ${
                      selectedCandidates.has(candidate.id) 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-transparent hover:border-primary-200'
                    }`}
                    onClick={() => handleCandidateSelect(candidate)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accessibility-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getInitials(candidate.profile.firstName, candidate.profile.lastName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {candidate.profile.firstName} {candidate.profile.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {candidate.profile.location.city}
                          </p>
                        </div>
                      </div>
                      
                      {selectable && multiSelect && (
                        <input
                          type="checkbox"
                          checked={selectedCandidates.has(candidate.id)}
                          onChange={() => handleCandidateSelect(candidate)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{candidate.profile.summary}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {candidate.profile.experience} an{candidate.profile.experience > 1 ? 's' : ''} d'expérience
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Euro className="w-4 h-4" />
                        {formatSalaryRange(candidate)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="info"
                            size="sm"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                        {candidate.profile.skills.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{candidate.profile.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {candidate.accessibility.needsAccommodation && (
                          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Accessible
                          </Badge>
                        )}
                        
                        {candidate.availability && (
                          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Disponible
                          </Badge>
                        )}
                      </div>

                      {candidate.preferences?.workMode && (
                        <Badge 
                          variant={
                            candidate.preferences.workMode === 'Télétravail' ? 'info' :
                            candidate.preferences.workMode === 'Hybride' ? 'warning' : 'default'
                          }
                          size="sm"
                        >
                          {candidate.preferences.workMode}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Table view */}
          {viewMode === 'table' && (
            <motion.div variants={fadeIn}>
              <Card padding="sm" className="overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {multiSelect && (
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={paginatedCandidates.length > 0 && paginatedCandidates.every(c => selectedCandidates.has(c.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  selectAll();
                                } else {
                                  deselectAll();
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compétences
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expérience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localisation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disponibilité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mode de travail
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCandidates.map(candidate => (
                        <tr
                          key={candidate.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedCandidates.has(candidate.id) ? 'bg-primary-50' : ''
                          }`}
                          onClick={() => handleCandidateSelect(candidate)}
                        >
                          {multiSelect && (
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.has(candidate.id)}
                                onChange={() => handleCandidateSelect(candidate)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accessibility-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {getInitials(candidate.profile.firstName, candidate.profile.lastName)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {candidate.profile.firstName} {candidate.profile.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{candidate.profile.email}</div>
                                {candidate.accessibility.needsAccommodation && (
                                  <Badge variant="success" size="sm" className="inline-flex items-center gap-1 mt-1">
                                    <Shield className="w-3 h-3" />
                                    Accessible
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {candidate.profile.skills.slice(0, 2).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="info"
                                  size="sm"
                                >
                                  {skill.name}
                                </Badge>
                              ))}
                              {candidate.profile.skills.length > 2 && (
                                <Badge variant="default" size="sm">
                                  +{candidate.profile.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {candidate.profile.experience} an{candidate.profile.experience > 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.profile.location.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={candidate.availability ? 'success' : 'warning'}
                              size="sm"
                            >
                              {candidate.availability ? 'Disponible' : 'Indisponible'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {candidate.preferences?.workMode && (
                              <Badge 
                                variant={
                                  candidate.preferences.workMode === 'Télétravail' ? 'info' :
                                  candidate.preferences.workMode === 'Hybride' ? 'warning' : 'default'
                                }
                                size="sm"
                              >
                                {candidate.preferences.workMode}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <div className="text-sm text-gray-700">
                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, sortedCandidates.length)} sur {sortedCandidates.length} candidats
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};