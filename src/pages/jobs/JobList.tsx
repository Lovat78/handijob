// src/pages/jobs/JobList.tsx - VERSION CONNECTÉE
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Users, 
  MapPin, 
  Clock,
  MoreVertical,
  Briefcase,
  Edit,
  Trash2
} from 'lucide-react';
import { Button, Card, Badge, Input, Spinner } from '@/components/ui';
import { JobDetailModal } from '@/components/modals/JobDetailModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useJobStore } from '@/stores/jobStore';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { createAllHandlers } from '@/utils/actionHandlers';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  onEdit: (jobId: string) => void;
  onDelete: (jobId: string, jobTitle: string) => void;
  onViewCandidates: (jobId: string) => void;
  onContact: (companyId: string, jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onViewCandidates,
  onContact 
}) => {
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'paused': return 'En pause';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="md" hoverable>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {job.title}
              </h3>
              {job.aiOptimized && (
                <Badge variant="info" size="sm">
                  IA
                </Badge>
              )}
              {job.handibienveillant && (
                <Badge variant="success" size="sm">♿ Inclusif</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 space-x-4 mb-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location.city}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {job.contractType}
              </div>
              <div>
                {job.workMode}
              </div>
            </div>

            {job.salaryMin && job.salaryMax && (
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {job.salaryMin.toLocaleString()}€ - {job.salaryMax.toLocaleString()}€
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(job.status)} size="sm">
              {getStatusText(job.status)}
            </Badge>
            
            {/* Actions Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label="Options"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[160px]"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onViewDetails(job.id);
                        setShowActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </button>
                    
                    {user?.role === 'company' && (
                      <>
                        <button
                          onClick={() => {
                            onEdit(job.id);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </button>
                        
                        <button
                          onClick={() => {
                            onViewCandidates(job.id);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Candidatures ({job.applicationCount})
                        </button>
                        
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        
                        <button
                          onClick={() => {
                            onDelete(job.id, job.title);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {job.viewCount} vues
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {job.applicationCount} candidatures
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user?.role === 'candidate' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => onContact(job.companyId, job.id)}
              >
                Postuler
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const JobList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
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
  
  const { jobs, isLoading, fetchJobs, setFilters, filters } = useJobStore();
  const { company, user } = useAuth();
  const { isMobile } = useMobile();

  // Créer les handlers
  const handlers = createAllHandlers({
    navigate,
    toast,
    openConfirmDialog
  });

  useEffect(() => {
    if (company) {
      fetchJobs(company.id);
    }
  }, [company, fetchJobs]);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Handlers spécifiques à cette page
  const handleViewDetails = (jobId: string) => {
    handlers.job.handleViewJobDetails(jobId, setSelectedJobId, setShowJobModal);
  };

  const handleEditJob = (jobId: string) => {
    handlers.job.handleEditJob(jobId);
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    handlers.job.handleDeleteJob(jobId, jobTitle);
  };

  const handleViewCandidates = (jobId: string) => {
    handlers.job.handleViewJobCandidates(jobId);
  };

  const handleContactCompany = (companyId: string, jobId: string) => {
    handlers.company.handleContactCompanyAboutJob(
      companyId, 
      jobId, 
      setContactConfig, 
      setShowContactModal
    );
  };

  const handleJobApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      handlers.job.handleJobApply(jobId, job.title);
    }
  };

  const handleSendMessage = async (message: string, targetId: string) => {
    await handlers.modal.handleSendMessage(message, targetId, { navigate, toast, openConfirmDialog });
    setShowContactModal(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesContract = !filters.contractType || job.contractType === filters.contractType;
    const matchesWorkMode = !filters.workMode || job.workMode === filters.workMode;
    
    return matchesSearch && matchesContract && matchesWorkMode;
  });

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
            Offres d'emploi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''}
          </p>
        </div>
        
        {user?.role === 'company' && (
          <Button 
            size={isMobile ? 'lg' : 'md'}
            onClick={() => handlers.navigation.handleGoToJobCreate()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une offre
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher une offre..."
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
            Filtres
          </Button>
        </div>

        {/* Filters Panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de contrat
                </label>
                <select
                  value={filters.contractType}
                  onChange={(e) => setFilters({ contractType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">Tous</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mode de travail
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) => setFilters({ workMode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">Tous</option>
                  <option value="Présentiel">Présentiel</option>
                  <option value="Télétravail">Télétravail</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ search: '', contractType: '', workMode: '', location: '', accessibilityRequired: false })}
                  fullWidth
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card padding="lg">
          <div className="text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {user?.role === 'company' 
                ? 'Commencez par créer votre première offre d\'emploi'
                : 'Aucune offre ne correspond à vos critères de recherche'
              }
            </p>
            {user?.role === 'company' && (
              <Button onClick={() => handlers.navigation.handleGoToJobCreate()}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une offre
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              onViewDetails={handleViewDetails}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onViewCandidates={handleViewCandidates}
              onContact={handleContactCompany}
            />
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={showJobModal}
        jobId={selectedJobId}
        onClose={() => setShowJobModal(false)}
        onApply={handleJobApply}
        onContact={(companyId) => handleContactCompany(companyId, selectedJobId || '')}
      />

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

export { JobList };