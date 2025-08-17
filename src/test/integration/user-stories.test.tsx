// src/test/integration/user-stories.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { IntelligentCVGenerator } from '@/components/candidate/IntelligentCVGenerator'
import { PredictiveMatchingEngine } from '@/components/matching/PredictiveMatchingEngine'

describe('US-033: CV Intelligent IA - Integration Tests', () => {
  it('should complete full CV generation workflow', async () => {
    render(<IntelligentCVGenerator />)
    
    // 1. Initial state - jobs displayed
    await waitFor(() => {
      expect(screen.getByText('Offres correspondant à votre profil')).toBeInTheDocument()
    })
    
    // 2. Select a job and analyze
    const analyzeButtons = screen.getAllByText(/Analyser/)
    fireEvent.click(analyzeButtons[0])
    
    // 3. Wait for analysis completion
    await waitFor(() => {
      expect(screen.getByText('Analyse IA de votre profil')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // 4. Generate CV
    const generateButton = screen.getByText(/Générer CV Optimisé/)
    fireEvent.click(generateButton)
    
    // 5. Verify CV generation
    await waitFor(() => {
      expect(screen.getByText(/CV Optimisé IA/)).toBeInTheDocument()
      expect(screen.getByText('Optimisations IA appliquées')).toBeInTheDocument()
    }, { timeout: 4000 })
    
    // 6. Verify download options
    expect(screen.getByText('Télécharger PDF')).toBeInTheDocument()
    expect(screen.getByText('Télécharger Word')).toBeInTheDocument()
  })

  it('should maintain accessibility throughout workflow', async () => {
    render(<IntelligentCVGenerator />)
    
    // Complete workflow
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      screen.getByText(/Générer CV Optimisé/)
    }, { timeout: 3000 })
    
    const generateButton = screen.getByText(/Générer CV Optimisé/)
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      // Verify accessibility features are preserved
      expect(screen.getByText('Expertise accessibilité')).toBeInTheDocument()
      const accessibilityBadges = screen.getAllByText(/♿/)
      expect(accessibilityBadges.length).toBeGreaterThan(0)
    }, { timeout: 4000 })
  })

  it('should calculate handibienveillance score accurately', async () => {
    render(<IntelligentCVGenerator />)
    
    const analyzeButton = screen.getAllByText(/Analyser/)[0]
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument()
      // Score should be displayed as percentage
      const scoreElements = screen.getAllByText(/%/)
      expect(scoreElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })
})

describe('US-034: Matching Prédictif IA - Integration Tests', () => {
  it('should complete full matching analysis workflow', async () => {
    render(<PredictiveMatchingEngine jobId="test-job-123" />)
    
    // 1. Initial state - ML model displayed
    expect(screen.getByText('HandiMatch AI v2.1')).toBeInTheDocument()
    expect(screen.getByText(/96.8%/)).toBeInTheDocument()
    
    // 2. Start analysis
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    // 3. Verify loading state
    await waitFor(() => {
      expect(screen.getByText('Analyse IA en cours...')).toBeInTheDocument()
    })
    
    // 4. Wait for results
    await waitFor(() => {
      expect(screen.getByText('Candidats Prédits - Top Matches')).toBeInTheDocument()
      expect(screen.getByText('Sarah Martin')).toBeInTheDocument()
    }, { timeout: 4000 })
    
    // 5. Verify candidate details
    expect(screen.getByText('Score Global')).toBeInTheDocument()
    expect(screen.getByText('Prédiction Succès')).toBeInTheDocument()
  })

  it('should display accurate matching scores', async () => {
    render(<PredictiveMatchingEngine jobId="test-job-123" />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      // Verify score displays
      expect(screen.getByText(/96%/)).toBeInTheDocument() // Overall score
      expect(screen.getByText(/94%/)).toBeInTheDocument() // Success prediction
      expect(screen.getByText(/Confiance 94%/)).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should handle accessibility compatibility correctly', async () => {
    render(<PredictiveMatchingEngine jobId="test-job-123" />)
    
    const analyzeButton = screen.getByText('Lancer Analyse Prédictive')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      // Check accessibility fit scoring
      expect(screen.getByText(/Fit accessibilité: 100%/)).toBeInTheDocument()
      
      // Verify RQTH indicator
      const badges = screen.getAllByTestId('badge')
      const rqthBadge = badges.find(badge => badge.textContent?.includes('♿ RQTH'))
      expect(rqthBadge).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('should validate ML model performance metrics', () => {
    render(<PredictiveMatchingEngine jobId="test-job-123" />)
    
    // Verify ML model accuracy display
    expect(screen.getByText('96.8%')).toBeInTheDocument()
    expect(screen.getByText('Précision')).toBeInTheDocument()
    expect(screen.getByText(/1247 recrutements réussis/)).toBeInTheDocument()
  })
})

describe('Cross-Component Integration Tests', () => {
  it('should maintain consistent UI patterns between US-033 and US-034', () => {
    const { rerender } = render(<IntelligentCVGenerator />)
    
    // Check CV Generator UI
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CV Intelligent Automatisé')
    
    // Switch to Matching Engine
    rerender(<PredictiveMatchingEngine jobId="test-job-123" />)
    
    // Check Matching Engine UI
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Matching Prédictif IA')
    
    // Both should have similar card-based layouts and button patterns
  })

  it('should handle error states gracefully', async () => {
    // Mock console.error to avoid test noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<PredictiveMatchingEngine jobId="" />)
    
    // Component should handle empty jobId gracefully
    expect(screen.getByText('Matching Prédictif IA')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})

describe('Performance Tests', () => {
  it('should render components within acceptable time', async () => {
    const startTime = performance.now()
    
    render(<IntelligentCVGenerator />)
    
    await waitFor(() => {
      expect(screen.getByText('CV Intelligent Automatisé')).toBeInTheDocument()
    })
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Render should complete within 1 second
    expect(renderTime).toBeLessThan(1000)
  })

  it('should handle multiple concurrent operations', async () => {
    render(<IntelligentCVGenerator />)
    
    // Simulate rapid user interactions
    const buttons = screen.getAllByText(/Analyser/)
    
    // Click multiple buttons rapidly
    buttons.forEach(button => {
      fireEvent.click(button)
    })
    
    // Should handle gracefully without crashes
    expect(screen.getByText('CV Intelligent Automatisé')).toBeInTheDocument()
  })
})