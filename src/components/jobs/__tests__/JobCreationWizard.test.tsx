// src/components/jobs/__tests__/JobCreationWizard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobCreationWizard } from '../JobCreationWizard';

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

describe('JobCreationWizard - Responsive Tests', () => {
  beforeEach(() => {
    // Reset viewport size
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  it('renders the job creation wizard with responsive workflow', () => {
    render(<JobCreationWizard />);
    
    // Header
    expect(screen.getByText('Créer une offre d\'emploi')).toBeInTheDocument();
    expect(screen.getByText('Assistant IA pour une offre inclusive et handibienveillante')).toBeInTheDocument();
    
    // Progress bar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // First step should be visible
    expect(screen.getByText('Informations de base')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre du poste')).toBeInTheDocument();
  });

  it('shows desktop workflow navigation on large screens', () => {
    render(<JobCreationWizard />);
    
    // Desktop workflow should show all steps horizontally
    const desktopWorkflow = screen.getByText('Informations de base').closest('.hidden.md\\:flex');
    expect(desktopWorkflow).toBeInTheDocument();
  });

  it('shows mobile workflow navigation on small screens', () => {
    // Mock small screen
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    
    render(<JobCreationWizard />);
    
    // Mobile workflow should show current step
    expect(screen.getByText('Étape 1 sur 6')).toBeInTheDocument();
    
    // Navigation dots should be present
    const dots = screen.getAllByRole('button', { name: '' });
    expect(dots).toHaveLength(6); // 6 steps = 6 dots
  });

  it('has touch-friendly form elements', async () => {
    const user = userEvent.setup();
    render(<JobCreationWizard />);
    
    // Input should have proper mobile styling
    const titleInput = screen.getByLabelText('Titre du poste');
    expect(titleInput).toHaveClass('w-full');
    
    // Type in input
    await user.type(titleInput, 'Développeur Frontend');
    expect(titleInput).toHaveValue('Développeur Frontend');
    
    // Select should have touch-friendly styling
    const contractSelect = screen.getByDisplayValue('CDI');
    expect(contractSelect).toHaveClass('py-3', 'text-base'); // Larger touch targets
  });

  it('navigates through workflow steps', async () => {
    const user = userEvent.setup();
    render(<JobCreationWizard />);
    
    // Fill first step
    await user.type(screen.getByLabelText('Titre du poste'), 'Développeur React Senior');
    await user.type(screen.getByLabelText('Localisation'), 'Paris, France');
    
    // Go to next step
    const nextButton = screen.getByRole('button', { name: /suivant/i });
    await user.click(nextButton);
    
    // Should be on step 2
    await waitFor(() => {
      expect(screen.getByText('Description du poste')).toBeInTheDocument();
    });
  });

  it('shows responsive grid layout', () => {
    render(<JobCreationWizard />);
    
    // Main grid should be responsive
    const mainGrid = screen.getByText('Informations de base').closest('.grid');
    expect(mainGrid).toHaveClass('grid-cols-1', 'xl:grid-cols-3');
    
    // Main form should span 2 columns on desktop
    const formSection = screen.getByText('Informations de base').closest('.xl\\:col-span-2');
    expect(formSection).toBeInTheDocument();
  });

  it('shows mobile-specific UI elements', () => {
    render(<JobCreationWizard />);
    
    // Mobile info panel should be hidden on desktop but visible on mobile
    const mobileInfo = screen.getByText('Assistant IA Handibienveillance').closest('.xl\\:hidden');
    expect(mobileInfo).toBeInTheDocument();
  });

  it('has responsive navigation buttons', () => {
    render(<JobCreationWizard />);
    
    const nextButton = screen.getByRole('button', { name: /suivant/i });
    const prevButton = screen.getByRole('button', { name: /précédent/i });
    
    // Buttons should be full width on mobile, auto on desktop
    expect(nextButton).toHaveClass('w-full', 'sm:w-auto');
    expect(prevButton).toHaveClass('w-full', 'sm:w-auto');
  });

  it('triggers IA analysis when content is filled', async () => {
    const user = userEvent.setup();
    render(<JobCreationWizard />);
    
    // Fill title and description
    await user.type(screen.getByLabelText('Titre du poste'), 'Développeur Full Stack');
    
    // Move to description step
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    
    await waitFor(() => {
      const descriptionTextarea = screen.getByPlaceholderText(/Décrivez le poste/);
      expect(descriptionTextarea).toBeInTheDocument();
    });
    
    // Fill description to trigger AI analysis
    const descriptionTextarea = screen.getByPlaceholderText(/Décrivez le poste/);
    await user.type(descriptionTextarea, 'Nous recherchons un développeur passionné pour rejoindre notre équipe inclusive. Télétravail possible.');
    
    // AI analysis should trigger after delay (mocked)
    await waitFor(() => {
      expect(screen.getByText('Assistant IA')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles form submission on mobile', async () => {
    const user = userEvent.setup();
    render(<JobCreationWizard />);
    
    // Fill minimal required fields and navigate to end
    await user.type(screen.getByLabelText('Titre du poste'), 'Test Job');
    await user.type(screen.getByLabelText('Localisation'), 'Paris');
    
    // Navigate through all steps quickly
    for (let i = 0; i < 5; i++) {
      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);
      await waitFor(() => {}, { timeout: 500 });
    }
    
    // Should reach final step
    await waitFor(() => {
      expect(screen.getByText('Aperçu de votre offre')).toBeInTheDocument();
    });
    
    // Publish button should be available
    const publishButton = screen.getByRole('button', { name: /publier l'offre/i });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toHaveClass('w-full', 'sm:w-auto'); // Responsive button
  });
});
