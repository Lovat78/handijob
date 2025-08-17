// Matching service
import { apiClient, type ApiResponse, type PaginatedResponse } from './api';
import { mockMatches } from './mockData';
import type { 
  MatchResult, 
  MatchingCriteria,
  BulkMatchingRequest,
  BulkMatchingResult,
  MatchingStats,
  MatchingInsight,
  MatchingPreferences,
  MatchingQueue,
  MatchFeedback,
  MatchStatus 
} from '@/types';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

class MatchingService {
  // Get matches for a job
  async getJobMatches(jobId: string, page = 1, limit = 10): Promise<PaginatedResponse<MatchResult>> {
    if (MOCK_MODE) {
      return this.mockGetJobMatches(jobId, page, limit);
    }

    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
      };

      const response = await apiClient.get<PaginatedResponse<MatchResult>>(
        `/jobs/${jobId}/matches`,
        params
      );
      return response;
    } catch (error) {
      console.error('Get job matches error:', error);
      throw new Error('Erreur lors du chargement des correspondances');
    }
  }

  // Mock get job matches
  private async mockGetJobMatches(jobId: string, page: number, limit: number): Promise<PaginatedResponse<MatchResult>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const matches = mockMatches.filter(match => match.jobId === jobId);
    const total = matches.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMatches = matches.slice(startIndex, endIndex);

    return {
      data: paginatedMatches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    };
  }

  // Get matches for a candidate
  async getCandidateMatches(candidateId: string, page = 1, limit = 10): Promise<PaginatedResponse<MatchResult>> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 900));

      const matches = mockMatches.filter(match => match.candidateId === candidateId);
      const total = matches.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMatches = matches.slice(startIndex, endIndex);

      return {
        data: paginatedMatches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        success: true,
      };
    }

    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
      };

      const response = await apiClient.get<PaginatedResponse<MatchResult>>(
        `/candidates/${candidateId}/matches`,
        params
      );
      return response;
    } catch (error) {
      console.error('Get candidate matches error:', error);
      throw new Error('Erreur lors du chargement des correspondances');
    }
  }

  // Run AI matching for a job
  async runJobMatching(criteria: MatchingCriteria): Promise<MatchResult[]> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Generate mock matches
      const mockResults: MatchResult[] = Array.from({ length: 5 }, (_, i) => ({
        id: 'match-' + Date.now() + '-' + i,
        jobId: criteria.jobId,
        candidateId: 'candidate-' + (i + 1),
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        factors: [
          {
            category: 'skills',
            weight: 0.3,
            score: Math.floor(Math.random() * 40) + 60,
            details: 'Correspondance des compétences techniques',
            positive: true,
          },
          {
            category: 'experience',
            weight: 0.25,
            score: Math.floor(Math.random() * 30) + 65,
            details: 'Expérience en adéquation avec le poste',
            positive: true,
          },
          {
            category: 'accessibility',
            weight: 0.2,
            score: Math.floor(Math.random() * 20) + 80,
            details: 'Besoins d\'accessibilité compatibles',
            positive: true,
          },
        ],
        recommendations: [
          {
            type: 'interview-preparation',
            title: 'Préparer l\'entretien',
            description: 'Points clés à aborder lors de l\'entretien',
            priority: 'high',
            actionable: true,
          },
        ],
        createdAt: new Date().toISOString(),
        status: 'pending',
      }));

      return mockResults;
    }

    try {
      const response = await apiClient.post<ApiResponse<MatchResult[]>>('/matching/run', criteria);
      return response.data;
    } catch (error) {
      console.error('Run job matching error:', error);
      throw new Error('Erreur lors du lancement du matching');
    }
  }

  // Run bulk matching
  async runBulkMatching(request: BulkMatchingRequest): Promise<BulkMatchingResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result: BulkMatchingResult = {
        id: 'bulk-' + Date.now(),
        status: 'processing',
        progress: 25,
        totalJobs: request.jobIds.length,
        processedJobs: Math.floor(request.jobIds.length * 0.25),
        totalMatches: 0,
        results: [],
        startedAt: new Date().toISOString(),
      };

      return result;
    }

    try {
      const response = await apiClient.post<ApiResponse<BulkMatchingResult>>('/matching/bulk', request);
      return response.data;
    } catch (error) {
      console.error('Run bulk matching error:', error);
      throw new Error('Erreur lors du lancement du matching en lot');
    }
  }

  // Get bulk matching status
  async getBulkMatchingStatus(id: string): Promise<BulkMatchingResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const result: BulkMatchingResult = {
        id,
        status: Math.random() > 0.5 ? 'completed' : 'processing',
        progress: Math.floor(Math.random() * 100),
        totalJobs: 10,
        processedJobs: Math.floor(Math.random() * 10),
        totalMatches: Math.floor(Math.random() * 50),
        results: [],
        startedAt: new Date(Date.now() - 30000).toISOString(),
        completedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
      };

      return result;
    }

    try {
      const response = await apiClient.get<ApiResponse<BulkMatchingResult>>(`/matching/bulk/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get bulk matching status error:', error);
      throw new Error('Erreur lors du chargement du statut');
    }
  }

  // Update match status
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<MatchResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const existingMatch = mockMatches.find(m => m.id === matchId);
      if (!existingMatch) throw new Error('Correspondance non trouvée');

      return {
        ...existingMatch,
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const response = await apiClient.patch<ApiResponse<MatchResult>>(
        `/matching/${matchId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Update match status error:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  }

  // Add match feedback
  async addMatchFeedback(matchId: string, feedback: Omit<MatchFeedback, 'createdAt' | 'userId'>): Promise<MatchResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 700));

      const existingMatch = mockMatches.find(m => m.id === matchId);
      if (!existingMatch) throw new Error('Correspondance non trouvée');

      const fullFeedback: MatchFeedback = {
        ...feedback,
        createdAt: new Date().toISOString(),
        userId: 'current-user-id',
      };

      return {
        ...existingMatch,
        feedback: fullFeedback,
      };
    }

    try {
      const response = await apiClient.post<ApiResponse<MatchResult>>(
        `/matching/${matchId}/feedback`,
        feedback
      );
      return response.data;
    } catch (error) {
      console.error('Add match feedback error:', error);
      throw new Error('Erreur lors de l\'ajout du feedback');
    }
  }

  // Get matching statistics
  async getMatchingStats(): Promise<MatchingStats> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1200));

      return {
        totalMatches: 1247,
        averageScore: 78.5,
        successRate: 34.2,
        improvementSuggestions: [
          {
            area: 'Pondération des compétences',
            suggestion: 'Augmenter le poids des compétences soft',
            impact: 'medium',
          },
          {
            area: 'Critères d\'accessibilité',
            suggestion: 'Affiner les critères de compatibilité',
            impact: 'high',
          },
        ],
        algorithmPerformance: {
          precision: 0.82,
          recall: 0.76,
          f1Score: 0.79,
        },
      };
    }

    try {
      const response = await apiClient.get<ApiResponse<MatchingStats>>('/matching/stats');
      return response.data;
    } catch (error) {
      console.error('Get matching stats error:', error);
      throw new Error('Erreur lors du chargement des statistiques');
    }
  }

  // Get matching insights
  async getMatchingInsights(): Promise<MatchingInsight[]> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      return [
        {
          type: 'skill-demand',
          title: 'Forte demande en React',
          description: 'Les compétences React sont très recherchées (+25% ce mois)',
          data: { skill: 'React', increase: 25 },
          trend: 'improving',
          actionable: true,
          recommendations: [
            'Proposer des formations React aux candidats',
            'Cibler les développeurs React dans les campagnes',
          ],
        },
        {
          type: 'accessibility-need',
          title: 'Manque d\'offres accessibles',
          description: 'Seulement 45% des offres sont marquées comme accessibles',
          data: { percentage: 45 },
          trend: 'declining',
          actionable: true,
          recommendations: [
            'Sensibiliser les entreprises à l\'accessibilité',
            'Créer un guide des bonnes pratiques',
          ],
        },
      ];
    }

    try {
      const response = await apiClient.get<ApiResponse<MatchingInsight[]>>('/matching/insights');
      return response.data;
    } catch (error) {
      console.error('Get matching insights error:', error);
      throw new Error('Erreur lors du chargement des insights');
    }
  }

  // Get user matching preferences
  async getMatchingPreferences(userId: string): Promise<MatchingPreferences> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        autoMatch: true,
        notificationThreshold: 75,
        maxDailyMatches: 10,
        preferredMatchingTime: '09:00',
        excludedCandidates: [],
        excludedJobs: [],
        customWeights: {
          skills: 0.35,
          experience: 0.25,
          accessibility: 0.2,
          location: 0.1,
          availability: 0.1,
        },
      };
    }

    try {
      const response = await apiClient.get<ApiResponse<MatchingPreferences>>(`/users/${userId}/matching-preferences`);
      return response.data;
    } catch (error) {
      console.error('Get matching preferences error:', error);
      throw new Error('Erreur lors du chargement des préférences');
    }
  }

  // Update matching preferences
  async updateMatchingPreferences(userId: string, preferences: Partial<MatchingPreferences>): Promise<MatchingPreferences> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        autoMatch: true,
        notificationThreshold: 75,
        maxDailyMatches: 10,
        preferredMatchingTime: '09:00',
        excludedCandidates: [],
        excludedJobs: [],
        ...preferences,
      };
    }

    try {
      const response = await apiClient.put<ApiResponse<MatchingPreferences>>(
        `/users/${userId}/matching-preferences`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error('Update matching preferences error:', error);
      throw new Error('Erreur lors de la mise à jour des préférences');
    }
  }

  // Get matching queue
  async getMatchingQueue(): Promise<MatchingQueue[]> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 700));

      return [
        {
          id: 'queue-1',
          type: 'single',
          priority: 'high',
          status: 'processing',
          request: {
            jobId: 'job-1',
            filters: { minScore: 70 },
          },
          progress: 65,
          estimatedCompletion: new Date(Date.now() + 120000).toISOString(),
          createdAt: new Date(Date.now() - 180000).toISOString(),
          startedAt: new Date(Date.now() - 60000).toISOString(),
        },
        {
          id: 'queue-2',
          type: 'bulk',
          priority: 'normal',
          status: 'queued',
          request: {
            jobIds: ['job-2', 'job-3'],
            criteria: { jobId: 'bulk', filters: {} },
            notify: true,
            priority: 'normal',
          },
          progress: 0,
          createdAt: new Date(Date.now() - 60000).toISOString(),
        },
      ];
    }

    try {
      const response = await apiClient.get<ApiResponse<MatchingQueue[]>>('/matching/queue');
      return response.data;
    } catch (error) {
      console.error('Get matching queue error:', error);
      throw new Error('Erreur lors du chargement de la file d\'attente');
    }
  }

  // Cancel matching job
  async cancelMatchingJob(queueId: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Matching job cancelled', queueId);
      return;
    }

    try {
      await apiClient.delete(`/matching/queue/${queueId}`);
    } catch (error) {
      console.error('Cancel matching job error:', error);
      throw new Error('Erreur lors de l\'annulation du job');
    }
  }

  // Get match details
  async getMatchDetails(matchId: string): Promise<MatchResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const match = mockMatches.find(m => m.id === matchId);
      if (!match) throw new Error('Correspondance non trouvée');
      
      return match;
    }

    try {
      const response = await apiClient.get<ApiResponse<MatchResult>>(`/matching/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Get match details error:', error);
      throw new Error('Erreur lors du chargement des détails');
    }
  }

  // Refresh match score
  async refreshMatchScore(matchId: string): Promise<MatchResult> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const match = mockMatches.find(m => m.id === matchId);
      if (!match) throw new Error('Correspondance non trouvée');

      return {
        ...match,
        score: Math.floor(Math.random() * 30) + 70,
        confidence: Math.random() * 0.3 + 0.7,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const response = await apiClient.post<ApiResponse<MatchResult>>(`/matching/${matchId}/refresh`);
      return response.data;
    } catch (error) {
      console.error('Refresh match score error:', error);
      throw new Error('Erreur lors du recalcul du score');
    }
  }

  // Export matching data
  async exportMatchingData(filters: { 
    dateFrom?: string;
    dateTo?: string;
    jobIds?: string[];
    candidateIds?: string[];
    minScore?: number;
  }): Promise<Blob> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockData = JSON.stringify({
        message: 'Données de matching exportées (simulation)',
        filters,
        exportedAt: new Date().toISOString(),
      }, null, 2);

      return new Blob([mockData], { type: 'application/json' });
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/matching/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(filters),
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export matching data error:', error);
      throw new Error('Erreur lors de l\'export des données');
    }
  }
}

// Export singleton instance
export const matchingService = new MatchingService();
