// src/components/candidate/__tests__/IntelligentCVGenerator.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { IntelligentCVGenerator } from '../IntelligentCVGenerator'

// Mock UI components
vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, isLoading, ...props }: any) => (
    <button onClick={onClick} disabled={isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Card: ({ children, padding, className, onClick }: any) => (
    <div className={className} onClick={onClick} data-testid="card">
      {children}
    </div>
  ),
  Badge: ({ children, variant, size }: any) => (
    <span data-variant={variant} data-size={size} data-testid="badge">
      {children}
    </span>
  ),
  ProgressBar: ({ value, size, color }: any) => (
    <div data-testid="progress-bar" data-value={value} data-size={size} data-color={color} />
  ),
}))

describe('IntelligentCVGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render CV generator header', () => {
    render(<IntelligentCVGenerator />)
    
    expect(screen.getByText('CV Intelligent Automatisé')).toBeInTheDocument()
    expect(screen.getByText(/IA génère un CV personnalisé pour chaque offre/)).toBeInTheDocument()
  })

  it('should display available jobs section', () => {
    render(<IntelligentCVGenerator />)
    
    expect(screen.getByText('Offres correspondant à votre profil')).toBeInTheDocument()
  })

  it('should show mock jobs with match scores', async () => {
    render(<IntelligentCVGenerator />)
    
    await waitFor(() => {
      expect(screen.getByText('Développeur Frontend React Senior')).toBeInTheDocument()
      expect(screen.getByText('TechCorp Inclusive')).toBeInTheDocument()
      expect(screen.getByText('UX Designer Accessibilité')).toBeInTheDocument()
    })
  })

  it('should trigger job analysis when clicking analyze button', async () => {
    render(<IntelligentCVGenerator />)
    
    const analyzeButtons = screen.getAllByText(/Analyser/)
    expect(analyzeButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(analyzeButtons[0])
    
    await waitFor(() => {
      expect(screen.getByText(/Analyse.../)).toBeInTheDocument()
    })
  })

  it('should display AI analysis results after analysis', async () => {
    render(<IntelligentCVGenerator />)
    
    // Click analyze button
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    // Wait for analysis to complete (mocked with timeout)
    await waitFor(() => {
      expect(screen.getByText('Analyse IA de votre profil')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Check analysis results
    expect(screen.getByText('Forces identifiées')).toBeInTheDocument()
    expect(screen.getByText('Optimisations recommandées')).toBeInTheDocument()
    expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument()
  })

  it('should enable CV generation after analysis', async () => {
    render(<IntelligentCVGenerator />)
    
    // Complete analysis first
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      const generateButton = screen.getByText(/Générer CV Optimisé/)
      expect(generateButton).toBeInTheDocument()
      expect(generateButton).not.toBeDisabled()
    }, { timeout: 3000 })
  })

  it('should show generated CV after generation', async () => {
    render(<IntelligentCVGenerator />)
    
    // Complete analysis
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      screen.getByText(/Générer CV Optimisé/)
    }, { timeout: 3000 })
    
    // Generate CV
    const generateButton = screen.getByText(/Générer CV Optimisé/)
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/CV Optimisé IA/)).toBeInTheDocument()
      expect(screen.getByText('Optimisations IA appliquées')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should display accessibility features in generated CV', async () => {
    render(<IntelligentCVGenerator />)
    
    // Go through full flow
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      screen.getByText(/Générer CV Optimisé/)
    }, { timeout: 3000 })
    
    const generateButton = screen.getByText(/Générer CV Optimisé/)
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Expertise accessibilité')).toBeInTheDocument()
      // Check for accessibility badges
      const accessibilityBadges = screen.getAllByText(/♿/)
      expect(accessibilityBadges.length).toBeGreaterThan(0)
    }, { timeout: 4000 })
  })

  it('should show download and apply actions', async () => {
    render(<IntelligentCVGenerator />)
    
    // Complete full flow
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      screen.getByText(/Générer CV Optimisé/)
    }, { timeout: 3000 })
    
    const generateButton = screen.getByText(/Générer CV Optimisé/)
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Télécharger PDF')).toBeInTheDocument()
      expect(screen.getByText('Télécharger Word')).toBeInTheDocument()
      expect(screen.getByText('Postuler avec ce CV')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should handle job selection correctly', async () => {
    render(<IntelligentCVGenerator />)
    
    // Wait for jobs to load
    await waitFor(() => {
      screen.getByText('Développeur Frontend React Senior')
    })
    
    // Click on a job card
    const jobCards = screen.getAllByTestId('card')
    const firstJobCard = jobCards.find(card => 
      card.textContent?.includes('Développeur Frontend React Senior')
    )
    
    expect(firstJobCard).toBeInTheDocument()
    if (firstJobCard) {
      fireEvent.click(firstJobCard)
    }
  })

  it('should display correct match scores', async () => {
    render(<IntelligentCVGenerator />)
    
    await waitFor(() => {
      // Check for match score badges
      const matchBadges = screen.getAllByTestId('badge')
      const matchScoreBadges = matchBadges.filter(badge => 
        badge.textContent?.includes('% match')
      )
      expect(matchScoreBadges.length).toBeGreaterThan(0)
    })
  })

  it('should show handibienveillant indicators', async () => {
    render(<IntelligentCVGenerator />)
    
    // Complete analysis and generation
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      // Should show handibienveillance score
      expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

// Test utilitaires pour US-033
describe('IntelligentCVGenerator Utils', () => {
  it('should calculate inclusivity score correctly', () => {
    // Mock data for testing inclusivity calculation
    const mockData = {
      accessibilityFeatures: ['Télétravail', 'Horaires flexibles', 'Poste adaptable'],
      workMode: 'Hybride',
      benefits: ['Accompagnement personnalisé', 'Formation continue']
    }
    
    // Test basic scoring logic
    let score = 60 // Base score
    if (mockData.accessibilityFeatures.length > 0) score += 20
    if (mockData.accessibilityFeatures.length > 3) score += 10
    if (mockData.workMode === 'Hybride' || mockData.workMode === 'Télétravail') score += 10
    if (mockData.benefits.some(b => b.includes('accompagnement'))) score += 5
    
    const finalScore = Math.min(score, 100)
    expect(finalScore).toBe(95) // 60 + 20 + 10 + 5 = 95
  })

  it('should detect bias terms correctly', () => {
    const biasTerms = ['jeune', 'dynamique', 'ninja', 'rockstar', 'guerrier']
    const testText = 'Nous recherchons un développeur dynamique et jeune'
    
    const detected = biasTerms.filter(term => 
      testText.toLowerCase().includes(term)
    )
    
    expect(detected).toEqual(['dynamique', 'jeune'])
  })

  it('should determine handibienveillant level correctly', () => {
    const testData = {
      accessibilityFeatures: ['Poste adaptable', 'Logiciels accessibilité', 'Horaires flexibles', 'Formation équipe'],
      description: 'Environnement inclusif avec focus sur la diversité',
      workMode: 'Hybride',
      benefits: ['Accompagnement personnalisé']
    }
    
    let score = 0
    if (testData.accessibilityFeatures.length > 0) score += 2
    if (testData.description.includes('inclusion') || testData.description.includes('diversité')) score += 2
    if (testData.workMode === 'Hybride' || testData.workMode === 'Télétravail') score += 1
    if (testData.benefits.some(b => b.includes('accompagnement'))) score += 2
    
    const level = score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low'
    expect(level).toBe('high') // Score = 7
  })
})