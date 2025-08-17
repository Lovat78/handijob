// src/services/jobService.ts
import { Job } from '@/types';
import { mockJobs, simulateApiCall } from './mockData';

class JobService {
  async getJobs(companyId?: string): Promise<Job[]> {
    let jobs = mockJobs;
    if (companyId) {
      jobs = mockJobs.filter(job => job.companyId === companyId);
    }
    return simulateApiCall(jobs);
  }

  async getJobById(id: string): Promise<Job | null> {
    const job = mockJobs.find(j => j.id === id);
    return simulateApiCall(job || null);
  }

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyId: jobData.companyId || 'company-default',
      title: jobData.title!,
      description: jobData.description!,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      contractType: jobData.contractType || 'CDI',
      workMode: jobData.workMode || 'Hybride',
      location: jobData.location!,
      accessibilityFeatures: jobData.accessibilityFeatures || [],
      tags: jobData.tags || [],
      status: 'active',
      aiOptimized: false,
      handibienveillant: jobData.accessibilityFeatures ? jobData.accessibilityFeatures.length > 0 : false,
      viewCount: 0,
      applicationCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // TODO: Replace with Supabase client.from('jobs').insert()
    console.log('🚀 Job created (mock):', newJob.title);

    return simulateApiCall(newJob);
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const job = mockJobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');

    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // TODO: Replace with Supabase client.from('jobs').update()
    console.log('🚀 Job updated (mock):', updatedJob.title);

    return simulateApiCall(updatedJob);
  }

  async deleteJob(id: string): Promise<void> {
    // TODO: Replace with Supabase client.from('jobs').delete()
    console.log('🚀 Job deleted (mock):', id);
    
    return simulateApiCall(undefined);
  }
}

export const jobService = new JobService();