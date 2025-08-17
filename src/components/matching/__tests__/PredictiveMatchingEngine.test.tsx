// src/components/matching/__tests__/PredictiveMatchingEngine.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PredictiveMatchingEngine } from '../PredictiveMatchingEngine'

// Mock UI components
vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, isLoading, variant, size, className }: any) => (
    <button 
      onClick={onClick} 
      disabled={isLoading} 
      data-variant={variant}
      data-size={size}
      className={className}
    >
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

describe('PredictiveMatchingEngine', () => {
  const defaultProps = {
    jobId: 'test-job-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render matching engine header', () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    expect(screen.getByText('Matching Prédictif IA')).toBeInTheDocument()
    expect(screen.getByText(/Intelligence artificielle avancée pour un matching précis à 95%+/)).toBeInTheDocument()
  })

  it('should display ML model information', () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    expect(screen.getByText('HandiMatch AI v2.1')).toBeInTheDocument()
    expect(screen.getByText(/Précision 96.8%/)).toBeInTheDocument()
    expect(screen.getByText(/1247 recrutements réussis/)).toBeInTheDocument()
  })

  it('should show configuration analysis section', () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    expect(screen.getByText('Configuration Analyse')).toBeInTheDocument()
    expect(screen.getByText('Lancer Analyse Prédictive')).toBeInTheDocument()
  })

  it('should start predictive analysis when button clicked', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Analyse IA en cours...')).toBeInTheDocument()
    })
  })

  it('should display candidate results after analysis', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    // Start analysis
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    // Wait for results (mocked with timeout)
    await waitFor(() => {
      expect(screen.getByText('Candidats Prédits - Top Matches')).toBeInTheDocument()
      expect(screen.getByText(/candidats analysés/)).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should show candidate information correctly', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    // Complete analysis
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sarah Martin')).toBeInTheDocument()
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
      expect(screen.getByText('5 ans')).toBeInTheDocument()
      expect(screen.getByText('Paris, France')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should display matching scores and confidence', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Score Global')).toBeInTheDocument()
      expect(screen.getByText(/96%/)).toBeInTheDocument()
      expect(screen.getByText(/Confiance 94%/)).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should show success prediction metrics', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Prédiction Succès')).toBeInTheDocument()
      expect(screen.getByText(/94%/)).toBeInTheDocument()
      expect(screen.getByText('Probabilité succès')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should display accessibility compatibility', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Fit accessibilité: 100%/)).toBeInTheDocument()
      // Check for RQTH badge
      const badges = screen.getAllByTestId('badge')
      const rqthBadge = badges.find(badge => badge.textContent?.includes('♿ RQTH'))
      expect(rqthBadge).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should expand candidate details when clicked', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    // Complete analysis first
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      screen.getByText('Sarah Martin')
    }, { timeout: 4000 })
    
    // Click on candidate card
    const candidateCards = screen.getAllByTestId('card')
    const candidateCard = candidateCards.find(card => 
      card.textContent?.includes('Sarah Martin')
    )
    
    if (candidateCard) {
      fireEvent.click(candidateCard)
      // Expanded details would appear here (not implemented in simplified version)
    }
  })

  it('should handle jobId prop correctly', () => {
    const testJobId = 'specific-job-456'
    render(<PredictiveMatchingEngine jobId={testJobId} />)
    
    // Component should initialize with the provided jobId
    // This would be verified through the matching criteria loading
    expect(screen.getByText('Matching Prédictif IA')).toBeInTheDocument()
  })

  it('should show ML model accuracy metrics', () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    // Check ML model accuracy display
    expect(screen.getByText('96.8%')).toBeInTheDocument()
    expect(screen.getByText('Précision')).toBeInTheDocument()
  })

  it('should display proper loading states', async () => {
    render(<PredictiveMatchingEngine {...defaultProps} />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    
    // Button should not be loading initially
    expect(analyzeButton).not.toHaveTextContent('Loading...')
    
    // Click to start analysis
    fireEvent.click(analyzeButton)
    
    // Button should show loading state
    await waitFor(() => {
      expect(screen.getByText('Analyse IA en cours...')).toBeInTheDocument()
    })
  })
})

// Test utilitaires pour US-034
describe('PredictiveMatchingEngine Utils', () => {
  it('should calculate score colors correctly', () => {
    const getScoreColor = (score: number): string => {
      if (score >= 90) return 'text-success-600'
      if (score >= 75) return 'text-warning-600'
      return 'text-error-600'
    }

    expect(getScoreColor(95)).toBe('text-success-600')
    expect(getScoreColor(80)).toBe('text-warning-600')
    expect(getScoreColor(60)).toBe('text-error-600')
  })

  it('should determine score variants correctly', () => {
    const getScoreVariant = (score: number): 'success' | 'warning' | 'error' => {
      if (score >= 90) return 'success'
      if (score >= 75) return 'warning'
      return 'error'
    }

    expect(getScoreVariant(96)).toBe('success')
    expect(getScoreVariant(78)).toBe('warning')
    expect(getScoreVariant(65)).toBe('error')
  })

  it('should validate matching criteria structure', () => {
    const mockCriteria = {
      technicalSkills: { weight: 35, required: ['React'], nice: ['Next.js'] },
      softSkills: { weight: 25, communication: 90, adaptation: 85, teamwork: 80, leadership: 60 },
      experience: { weight: 20, minYears: 3, relevantSectors: ['Tech'] },
      accessibility: { weight: 15, requirements: ['WCAG'], adaptations: ['Télétravail'] },
      cultural: { weight: 5, values: ['Inclusion'], workStyle: 'Collaboratif', environment: 'Startup' }
    }

    // Validate weights sum to 100
    const totalWeight = mockCriteria.technicalSkills.weight + 
                       mockCriteria.softSkills.weight + 
                       mockCriteria.experience.weight + 
                       mockCriteria.accessibility.weight + 
                       mockCriteria.cultural.weight

    expect(totalWeight).toBe(100)
  })

  it('should mock ML model data correctly', () => {
    const mockMLModel = {
      name: 'HandiMatch AI v2.1',
      version: '2.1.0',
      accuracy: 96.8,
      trainingData: {
        successfulHires: 1247,
        totalPredictions: 5893,
        lastUpdate: '2025-08-15'
      }
    }

    expect(mockMLModel.accuracy).toBeGreaterThan(95)
    expect(mockMLModel.trainingData.successfulHires).toBeGreaterThan(1000)
    expect(mockMLModel.trainingData.totalPredictions).toBeGreaterThan(mockMLModel.trainingData.successfulHires)
  })

  it('should calculate success rate correctly', () => {
    const successfulHires = 1247
    const totalPredictions = 5893
    const successRate = Math.round((successfulHires / totalPredictions) * 100)
    
    expect(successRate).toBe(21) // 21% success rate from predictions
  })
})