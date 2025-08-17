// src/utils/actionHandlers.ts
import { NavigateFunction } from 'react-router-dom';

// Types pour les handlers
export interface ActionHandlersContext {
  navigate: NavigateFunction;
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
  openConfirmDialog: (config: {
    type?: 'danger' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

// ========== JOB HANDLERS ==========

export const createJobHandlers = (context: ActionHandlersContext) => ({
  handleViewJobDetails: (jobId: string, setSelectedJobId: (id: string) => void, setShowJobModal: (show: boolean) => void) => {
    setSelectedJobId(jobId);
    setShowJobModal(true);
  },

  handleEditJob: (jobId: string) => {
    context.navigate(`/jobs/${jobId}/edit`);
  },

  handleDeleteJob: async (jobId: string, jobTitle: string) => {
    context.openConfirmDialog({
      type: 'danger',
      title: 'Supprimer l\'offre',
      message: `Êtes-vous sûr de vouloir supprimer l'offre "${jobTitle}" ?\n\nCette action est irréversible et supprimera également toutes les candidatures associées.`,
      confirmText: 'Supprimer',
      onConfirm: async () => {
        // Simuler suppression
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.toast.success('Offre supprimée', 'L\'offre d\'emploi a été supprimée avec succès.');
        // TODO: Appeler deleteJob du store
      }
    });
  },

  handleViewJobCandidates: (jobId: string) => {
    context.navigate(`/jobs/${jobId}/candidates`);
  },

  handleJobApply: async (jobId: string, jobTitle: string) => {
    context.openConfirmDialog({
      type: 'info',
      title: 'Confirmer la candidature',
      message: `Voulez-vous postuler à l'offre "${jobTitle}" ?\n\nVotre profil et CV seront transmis au recruteur.`,
      confirmText: 'Postuler',
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        context.toast.success('Candidature envoyée !', 'Votre candidature a été transmise au recruteur.');
      }
    });
  }
});

// ========== CANDIDATE HANDLERS ==========

export const createCandidateHandlers = (context: ActionHandlersContext) => ({
  handleViewCandidateProfile: (candidateId: string) => {
    context.navigate(`/candidates/${candidateId}`);
  },

  handleContactCandidate: (candidateId: string, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({
      type: 'candidate',
      targetId: candidateId,
      jobId: null
    });
    setShowContactModal(true);
  },

  handleContactCandidateFromJob: (candidateId: string, jobId: string, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({
      type: 'candidate',
      targetId: candidateId,
      jobId: jobId
    });
    setShowContactModal(true);
  },

  handleSaveCandidate: async (candidateId: string, candidateName: string) => {
    context.toast.success('Candidat sauvegardé', `${candidateName} a été ajouté à vos favoris.`);
    // TODO: Implémenter sauvegarde dans le store
  },

  handleUnsaveCandidate: async (candidateId: string, candidateName: string) => {
    context.openConfirmDialog({
      type: 'warning',
      title: 'Retirer des favoris',
      message: `Retirer ${candidateName} de vos candidats favoris ?`,
      confirmText: 'Retirer',
      onConfirm: async () => {
        context.toast.info('Candidat retiré', `${candidateName} a été retiré de vos favoris.`);
      }
    });
  }
});

// ========== COMPANY HANDLERS ==========

export const createCompanyHandlers = (context: ActionHandlersContext) => ({
  handleContactCompany: (companyId: string, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({
      type: 'company',
      targetId: companyId,
      jobId: null
    });
    setShowContactModal(true);
  },

  handleContactCompanyAboutJob: (companyId: string, jobId: string, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({
      type: 'company',
      targetId: companyId,
      jobId: jobId
    });
    setShowContactModal(true);
  },

  handleViewCompanyProfile: (companyId: string) => {
    context.navigate(`/companies/${companyId}`);
  }
});

// ========== MATCHING HANDLERS ==========

export const createMatchingHandlers = (context: ActionHandlersContext) => ({
  handleViewMatchDetails: (candidateId: string, jobId: string) => {
    // Ouvrir modal détails du match avec breakdown
    context.toast.info('Détails du match', 'Analyse détaillée du matching en cours de développement.');
  },

  handleContactFromMatch: (candidateId: string, jobId: string, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({
      type: 'candidate',
      targetId: candidateId,
      jobId: jobId
    });
    setShowContactModal(true);
  },

  handleSaveMatchedCandidate: async (candidateId: string, score: number) => {
    context.toast.success('Match sauvegardé', `Candidat ajouté avec un score de ${score}%.`);
  }
});

// ========== NAVIGATION HANDLERS ==========

export const createNavigationHandlers = (context: ActionHandlersContext) => ({
  handleGoToJobCreate: () => {
    context.navigate('/jobs/create');
  },

  handleGoToCandidateSearch: () => {
    context.navigate('/candidates');
  },

  handleGoToAnalytics: () => {
    context.navigate('/analytics');
  },

  handleGoToSettings: () => {
    context.navigate('/settings');
  },

  handleGoToMatching: () => {
    context.navigate('/matching');
  },

  handleGoToProfile: () => {
    context.navigate('/profile');
  }
});

// ========== MODALS HANDLERS ==========

export const createModalHandlers = () => ({
  handleOpenJobDetails: (jobId: string, setSelectedJobId: (id: string) => void, setShowJobModal: (show: boolean) => void) => {
    setSelectedJobId(jobId);
    setShowJobModal(true);
  },

  handleCloseJobDetails: (setShowJobModal: (show: boolean) => void) => {
    setShowJobModal(false);
  },

  handleOpenContact: (type: 'candidate' | 'company', targetId: string, jobId: string | null, setContactConfig: (config: any) => void, setShowContactModal: (show: boolean) => void) => {
    setContactConfig({ type, targetId, jobId });
    setShowContactModal(true);
  },

  handleCloseContact: (setShowContactModal: (show: boolean) => void) => {
    setShowContactModal(false);
  },

  handleSendMessage: async (message: string, targetId: string, context: ActionHandlersContext) => {
    // Simuler envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    context.toast.success('Message envoyé', 'Votre message a été transmis avec succès.');
  }
});

// ========== SEARCH HANDLERS ==========

export const createSearchHandlers = (context: ActionHandlersContext) => ({
  handleSearch: async (query: string, filters: any) => {
    context.toast.info('Recherche en cours', 'Analyse des profils correspondants...');
    // TODO: Implémenter recherche réelle
    await new Promise(resolve => setTimeout(resolve, 1500));
    context.toast.success('Recherche terminée', `${Math.floor(Math.random() * 20) + 5} résultats trouvés.`);
  },

  handleClearFilters: (resetFilters: () => void) => {
    resetFilters();
    context.toast.info('Filtres réinitialisés', 'Tous les filtres ont été remis à zéro.');
  },

  handleSaveSearch: async (searchName: string, query: string, filters: any) => {
    context.toast.success('Recherche sauvegardée', `"${searchName}" a été ajoutée à vos recherches favorites.`);
  }
});

// ========== UTILS HANDLERS ==========

export const createUtilsHandlers = (context: ActionHandlersContext) => ({
  handleCopyToClipboard: async (text: string, label: string = 'Lien') => {
    try {
      await navigator.clipboard.writeText(text);
      context.toast.success(`${label} copié`, 'Le contenu a été copié dans le presse-papiers.');
    } catch (error) {
      context.toast.error('Erreur', 'Impossible de copier le contenu.');
    }
  },

  handleShare: async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // Fallback vers copie
        await navigator.clipboard.writeText(url);
        context.toast.success('Lien copié', 'Le lien a été copié pour partage.');
      }
    } else {
      await navigator.clipboard.writeText(url);
      context.toast.success('Lien copié', 'Le lien a été copié pour partage.');
    }
  },

  handleDownload: (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    context.toast.success('Téléchargement lancé', `${filename} est en cours de téléchargement.`);
  }
});

// ========== FACTORY FUNCTION ==========

export const createAllHandlers = (context: ActionHandlersContext) => ({
  job: createJobHandlers(context),
  candidate: createCandidateHandlers(context),
  company: createCompanyHandlers(context),
  matching: createMatchingHandlers(context),
  navigation: createNavigationHandlers(context),
  modal: createModalHandlers(),
  search: createSearchHandlers(context),
  utils: createUtilsHandlers(context)
});