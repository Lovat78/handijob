// src/components/publishing/__tests__/MultiChannelPublisher.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiChannelPublisher } from '../MultiChannelPublisher';

// Mock hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'company@example.com',
      firstName: 'Test',
      lastName: 'Company',
      role: 'company'
    }
  })
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn()
    }
  })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => children
}));

describe('MultiChannelPublisher - US-036', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the multi-channel publisher interface', () => {
    render(<MultiChannelPublisher />);
    
    // Header
    expect(screen.getByText('Diffusion Multi-Canaux')).toBeInTheDocument();
    expect(screen.getByText('Maximisez la visibilité de vos offres avec la publication automatique')).toBeInTheDocument();
    
    // Job summary card
    expect(screen.getByText('Développeur Full Stack - Accessible et Inclusif')).toBeInTheDocument();
    expect(screen.getByText('Score 87/100')).toBeInTheDocument();
  });

  it('shows available publication channels', () => {
    render(<MultiChannelPublisher />);
    
    // Main jobboards
    expect(screen.getByText('Indeed')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn Jobs')).toBeInTheDocument();
    expect(screen.getByText('Apec')).toBeInTheDocument();
    expect(screen.getByText('RegionsJob')).toBeInTheDocument();
    expect(screen.getByText('HelloWork')).toBeInTheDocument();
    
    // Social networks
    expect(screen.getByText('LinkedIn Social')).toBeInTheDocument();
    expect(screen.getByText('Twitter/X')).toBeInTheDocument();
    expect(screen.getByText('Facebook Jobs')).toBeInTheDocument();
    
    // Specialized sites
    expect(screen.getByText('Agefiph')).toBeInTheDocument();
    expect(screen.getByText('Mission Handicap')).toBeInTheDocument();
    expect(screen.getByText('MyJobCompany')).toBeInTheDocument();
  });

  it('allows channel selection and shows summary', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Select Indeed channel
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    expect(indeedCard).toBeInTheDocument();
    
    await user.click(indeedCard!);
    
    // Should show selection summary
    await waitFor(() => {
      expect(screen.getByText('1 canaux sélectionnés')).toBeInTheDocument();
    });
    
    // Should show estimated reach and budget
    expect(screen.getByText(/Portée estimée/)).toBeInTheDocument();
    expect(screen.getByText(/Budget total/)).toBeInTheDocument();
  });

  it('provides quick selection options', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Click "Tous les canaux"
    const allChannelsButton = screen.getByRole('button', { name: /tous les canaux/i });
    await user.click(allChannelsButton);
    
    // Should select all 11 channels
    await waitFor(() => {
      expect(screen.getByText('11 canaux sélectionnés')).toBeInTheDocument();
    });
  });

  it('filters channels by type correctly', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Click "Handibienveillants" filter
    const handiFriendlyButton = screen.getByRole('button', { name: /handibienveillants/i });
    await user.click(handiFriendlyButton);
    
    // Should select only handiFriendly channels (6 channels)
    await waitFor(() => {
      expect(screen.getByText(/canaux sélectionnés/)).toBeInTheDocument();
    });
  });

  it('shows channel details and performance indicators', () => {
    render(<MultiChannelPublisher />);
    
    // Check channel details for Indeed
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    
    // Should show cost, reach, and performance
    expect(screen.getByText('150€')).toBeInTheDocument(); // Indeed cost
    expect(screen.getByText('95 000')).toBeInTheDocument(); // Indeed reach
    expect(screen.getByText('Excellente')).toBeInTheDocument(); // Indeed performance
  });

  it('identifies handiFriendly and premium channels', () => {
    render(<MultiChannelPublisher />);
    
    // Should show "Inclusif" badges for handiFriendly channels
    const inclusifBadges = screen.getAllByText('Inclusif');
    expect(inclusifBadges.length).toBeGreaterThan(0);
    
    // Should show "Premium" badge for premium channels
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('handles publication process', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Select a channel first
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    await user.click(indeedCard!);
    
    // Click publish button
    await waitFor(() => {
      const publishButton = screen.getByRole('button', { name: /publier maintenant/i });
      expect(publishButton).toBeInTheDocument();
      return user.click(publishButton);
    });
    
    // Should show publishing state
    await waitFor(() => {
      expect(screen.getByText(/déjà publié/i)).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Switch to analytics tab
    const analyticsTab = screen.getByRole('button', { name: /analytics/i });
    await user.click(analyticsTab);
    
    // Should show analytics content
    expect(screen.getByText('Aucune donnée analytique')).toBeInTheDocument();
    expect(screen.getByText('Publiez votre offre pour commencer à collecter des données de performance')).toBeInTheDocument();
  });

  it('shows real-time analytics after publication', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Select and publish
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    await user.click(indeedCard!);
    
    await waitFor(() => {
      const publishButton = screen.getByRole('button', { name: /publier maintenant/i });
      return user.click(publishButton);
    });
    
    // Switch to analytics after publication
    await waitFor(() => {
      const analyticsTab = screen.getByRole('button', { name: /analytics/i });
      return user.click(analyticsTab);
    });
    
    // Should show performance metrics
    await waitFor(() => {
      expect(screen.getByText('Performance globale')).toBeInTheDocument();
      expect(screen.getByText('Vues totales')).toBeInTheDocument();
      expect(screen.getByText('Clics')).toBeInTheDocument();
      expect(screen.getByText('Candidatures')).toBeInTheDocument();
    });
  });

  it('calculates budget and reach correctly', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Select Indeed (150€, 95000 reach)
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    await user.click(indeedCard!);
    
    await waitFor(() => {
      expect(screen.getByText('150€')).toBeInTheDocument(); // Budget
      expect(screen.getByText('95 000')).toBeInTheDocument(); // Reach
    });
    
    // Select LinkedIn Jobs (200€, 75000 reach) 
    const linkedinCard = screen.getByText('LinkedIn Jobs').closest('.cursor-pointer');
    await user.click(linkedinCard!);
    
    await waitFor(() => {
      expect(screen.getByText('350€')).toBeInTheDocument(); // Total budget: 150 + 200
      expect(screen.getByText('170 000')).toBeInTheDocument(); // Total reach: 95000 + 75000
    });
  });

  it('shows specialized handicap channels prominently', () => {
    render(<MultiChannelPublisher />);
    
    // Specialized channels should be clearly identified
    expect(screen.getByText('Agefiph')).toBeInTheDocument();
    expect(screen.getByText('Mission Handicap')).toBeInTheDocument();
    expect(screen.getByText('MyJobCompany')).toBeInTheDocument();
    
    // Agefiph should be free
    const agefiph = screen.getByText('Agefiph').closest('.cursor-pointer');
    expect(agefiph).toHaveTextContent('Gratuit');
  });

  it('prevents publication without channel selection', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // Try to publish without selecting channels
    // No publish button should be visible without selection
    expect(screen.queryByRole('button', { name: /publier maintenant/i })).not.toBeInTheDocument();
  });

  it('shows publication status indicators', async () => {
    const user = userEvent.setup();
    render(<MultiChannelPublisher />);
    
    // After publication, should show active status
    const indeedCard = screen.getByText('Indeed').closest('.cursor-pointer');
    await user.click(indeedCard!);
    
    await waitFor(() => {
      const publishButton = screen.getByRole('button', { name: /publier maintenant/i });
      return user.click(publishButton);
    });
    
    // Should show "En ligne" badge and active publication card
    await waitFor(() => {
      expect(screen.getByText('En ligne')).toBeInTheDocument();
      expect(screen.getByText('Publication active')).toBeInTheDocument();
    });
  });
});
