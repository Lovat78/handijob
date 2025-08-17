// Candidate service
import { apiClient, type ApiResponse, type PaginatedResponse } from './api';
import { mockCandidates } from './mockData';
import type { 
  Candidate, 
  CandidateFilters, 
  CandidateStats,
  CandidateSearchResult,
  Experience,
  Education,
  CandidateSkill,
  Language 
} from '@/types';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

class CandidateService {
  // Get candidates with filters and pagination
  async getCandidates(filters: CandidateFilters = {}, page = 1, limit = 10): Promise<PaginatedResponse<Candidate>> {
    if (MOCK_MODE) {
      return this.mockGetCandidates(filters, page, limit);
    }

    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      };

      const response = await apiClient.get<PaginatedResponse<Candidate>>('/candidates', params);
      return response;
    } catch (error) {
      console.error('Get candidates error:', error);
      throw new Error('Erreur lors du chargement des candidats');
    }
  }

  // Mock get candidates for development
  private async mockGetCandidates(filters: CandidateFilters, page: number, limit: number): Promise<PaginatedResponse<Candidate>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let candidates = [...mockCandidates];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      candidates = candidates.filter(candidate => 
        candidate.firstName.toLowerCase().includes(search) ||
        candidate.lastName.toLowerCase().includes(search) ||
        candidate.skills.some(skill => skill.name.toLowerCase().includes(search))
      );
    }

    if (filters.location) {
      candidates = candidates.filter(candidate => 
        candidate.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        candidate.location.region.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.disabilities?.length) {
      candidates = candidates.filter(candidate => 
        candidate.disabilities.some(disability => 
          filters.disabilities!.includes(disability.type)
        )
      );
    }

    if (filters.skills?.length) {
      candidates = candidates.filter(candidate => 
        candidate.skills.some(skill => 
          filters.skills!.includes(skill.name)
        )
      );
    }

    if (filters.experience) {
      candidates = candidates.filter(candidate => {
        const totalExperience = candidate.experience.reduce((total, exp) => {
          const startYear = new Date(exp.startDate).getFullYear();
          const endYear = exp.current ? new Date().getFullYear() : new Date(exp.endDate!).getFullYear();
          return total + (endYear - startYear);
        }, 0);
        
        return totalExperience >= (filters.experience!.min || 0) && 
               totalExperience <= (filters.experience!.max || 100);
      });
    }

    // Pagination
    const total = candidates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    return {
      data: paginatedCandidates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    };
  }

  // Get candidate by ID
  async getCandidateById(id: string): Promise<Candidate> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const candidate = mockCandidates.find(c => c.id === id);
      if (!candidate) throw new Error('Candidat non trouvé');
      return candidate;
    }

    try {
      const response = await apiClient.get<ApiResponse<Candidate>>(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get candidate error:', error);
      throw new Error('Erreur lors du chargement du candidat');
    }
  }

  // Update candidate profile
  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingCandidate = mockCandidates.find(c => c.id === id);
      if (!existingCandidate) throw new Error('Candidat non trouvé');
      
      const updatedCandidate: Candidate = {
        ...existingCandidate,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedCandidate;
    }

    try {
      const response = await apiClient.put<ApiResponse<Candidate>>(`/candidates/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update candidate error:', error);
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  // Search candidates with AI
  async searchCandidatesWithAI(query: string, filters: CandidateFilters = {}): Promise<CandidateSearchResult[]> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const candidates = mockCandidates.filter(candidate => 
        candidate.firstName.toLowerCase().includes(query.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(query.toLowerCase()) ||
        candidate.skills.some(skill => skill.name.toLowerCase().includes(query.toLowerCase()))
      );

      return candidates.map(candidate => ({
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        location: candidate.location,
        skills: candidate.skills,
        experience: candidate.experience,
        availability: candidate.availability,
        matchScore: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
        matchReasons: [
          'Compétences techniques alignées',
          'Expérience pertinente',
          'Localisation compatible'
        ],
      }));
    }

    try {
      const response = await apiClient.post<ApiResponse<CandidateSearchResult[]>>('/candidates/ai-search', {
        query,
        filters,
      });
      return response.data;
    } catch (error) {
      console.error('AI search candidates error:', error);
      throw new Error('Erreur lors de la recherche IA');
    }
  }

  // Add experience
  async addExperience(candidateId: string, experience: Omit<Experience, 'id'>): Promise<Experience> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newExperience: Experience = {
        ...experience,
        id: 'exp-' + Date.now(),
      };
      
      return newExperience;
    }

    try {
      const response = await apiClient.post<ApiResponse<Experience>>(
        `/candidates/${candidateId}/experience`,
        experience
      );
      return response.data;
    } catch (error) {
      console.error('Add experience error:', error);
      throw new Error('Erreur lors de l\'ajout de l\'expérience');
    }
  }

  // Update experience
  async updateExperience(candidateId: string, experienceId: string, data: Partial<Experience>): Promise<Experience> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedExperience: Experience = {
        id: experienceId,
        title: data.title || 'Titre',
        company: data.company || 'Entreprise',
        startDate: data.startDate || '2020-01-01',
        current: data.current || false,
        description: data.description || 'Description',
        skills: data.skills || [],
        ...data,
      };
      
      return updatedExperience;
    }

    try {
      const response = await apiClient.put<ApiResponse<Experience>>(
        `/candidates/${candidateId}/experience/${experienceId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update experience error:', error);
      throw new Error('Erreur lors de la mise à jour de l\'expérience');
    }
  }

  // Delete experience
  async deleteExperience(candidateId: string, experienceId: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Experience deleted', experienceId);
      return;
    }

    try {
      await apiClient.delete(`/candidates/${candidateId}/experience/${experienceId}`);
    } catch (error) {
      console.error('Delete experience error:', error);
      throw new Error('Erreur lors de la suppression de l\'expérience');
    }
  }

  // Add education
  async addEducation(candidateId: string, education: Omit<Education, 'id'>): Promise<Education> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newEducation: Education = {
        ...education,
        id: 'edu-' + Date.now(),
      };
      
      return newEducation;
    }

    try {
      const response = await apiClient.post<ApiResponse<Education>>(
        `/candidates/${candidateId}/education`,
        education
      );
      return response.data;
    } catch (error) {
      console.error('Add education error:', error);
      throw new Error('Erreur lors de l\'ajout de la formation');
    }
  }

  // Update education
  async updateEducation(candidateId: string, educationId: string, data: Partial<Education>): Promise<Education> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedEducation: Education = {
        id: educationId,
        institution: data.institution || 'Institution',
        degree: data.degree || 'Diplôme',
        field: data.field || 'Domaine',
        startDate: data.startDate || '2020-01-01',
        current: data.current || false,
        ...data,
      };
      
      return updatedEducation;
    }

    try {
      const response = await apiClient.put<ApiResponse<Education>>(
        `/candidates/${candidateId}/education/${educationId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update education error:', error);
      throw new Error('Erreur lors de la mise à jour de la formation');
    }
  }

  // Delete education
  async deleteEducation(candidateId: string, educationId: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Education deleted', educationId);
      return;
    }

    try {
      await apiClient.delete(`/candidates/${candidateId}/education/${educationId}`);
    } catch (error) {
      console.error('Delete education error:', error);
      throw new Error('Erreur lors de la suppression de la formation');
    }
  }

  // Add skill
  async addSkill(candidateId: string, skill: Omit<CandidateSkill, 'id'>): Promise<CandidateSkill> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newSkill: CandidateSkill = {
        ...skill,
        id: 'skill-' + Date.now(),
      };
      
      return newSkill;
    }

    try {
      const response = await apiClient.post<ApiResponse<CandidateSkill>>(
        `/candidates/${candidateId}/skills`,
        skill
      );
      return response.data;
    } catch (error) {
      console.error('Add skill error:', error);
      throw new Error('Erreur lors de l\'ajout de la compétence');
    }
  }

  // Update skill
  async updateSkill(candidateId: string, skillId: string, data: Partial<CandidateSkill>): Promise<CandidateSkill> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedSkill: CandidateSkill = {
        id: skillId,
        name: data.name || 'Compétence',
        category: data.category || 'technical',
        level: data.level || 'beginner',
        experience: data.experience || 0,
        certified: data.certified || false,
        ...data,
      };
      
      return updatedSkill;
    }

    try {
      const response = await apiClient.put<ApiResponse<CandidateSkill>>(
        `/candidates/${candidateId}/skills/${skillId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update skill error:', error);
      throw new Error('Erreur lors de la mise à jour de la compétence');
    }
  }

  // Delete skill
  async deleteSkill(candidateId: string, skillId: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      console.log('Mock: Skill deleted', skillId);
      return;
    }

    try {
      await apiClient.delete(`/candidates/${candidateId}/skills/${skillId}`);
    } catch (error) {
      console.error('Delete skill error:', error);
      throw new Error('Erreur lors de la suppression de la compétence');
    }
  }

  // Upload resume
  async uploadResume(candidateId: string, file: File): Promise<{ url: string }> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        url: 'https://example.com/resumes/mock-resume-' + Date.now() + '.pdf'
      };
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await apiClient.upload<ApiResponse<{ url: string }>>(
        `/candidates/${candidateId}/resume`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Upload resume error:', error);
      throw new Error('Erreur lors du téléchargement du CV');
    }
  }

  // Get candidate statistics
  async getCandidateStats(): Promise<CandidateStats> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        totalCandidates: 158,
        activeCandidates: 124,
        byDisabilityType: [
          { type: 'mobility', count: 45 },
          { type: 'visual', count: 32 },
          { type: 'hearing', count: 28 },
          { type: 'cognitive', count: 25 },
          { type: 'mental-health', count: 18 },
          { type: 'chronic-illness', count: 10 },
        ],
        byLocation: [
          { location: 'Paris', count: 42 },
          { location: 'Lyon', count: 28 },
          { location: 'Toulouse', count: 20 },
          { location: 'Bordeaux', count: 15 },
          { location: 'Lille', count: 12 },
        ],
        topSkills: [
          { skill: 'JavaScript', count: 65 },
          { skill: 'Communication', count: 58 },
          { skill: 'React', count: 42 },
          { skill: 'Python', count: 38 },
          { skill: 'Gestion de projet', count: 35 },
        ],
        averageExperience: 4.2,
      };
    }

    try {
      const response = await apiClient.get<ApiResponse<CandidateStats>>('/candidates/stats');
      return response.data;
    } catch (error) {
      console.error('Get candidate stats error:', error);
      throw new Error('Erreur lors du chargement des statistiques');
    }
  }

  // Export candidate data
  async exportCandidateData(candidateId: string): Promise<Blob> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = JSON.stringify({
        message: 'Données du candidat exportées (simulation)',
        candidateId,
        exportedAt: new Date().toISOString(),
      }, null, 2);
      
      return new Blob([mockData], { type: 'application/json' });
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/export`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export candidate data error:', error);
      throw new Error('Erreur lors de l\'export des données');
    }
  }
}

// Export singleton instance
export const candidateService = new CandidateService();
