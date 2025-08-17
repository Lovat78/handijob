// src/test/utils/test-utils.tsx
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test data generators
export const generateMockJob = (overrides = {}) => ({
  id: 'test-job-123',
  title: 'Développeur Frontend React Senior',
  company: 'TechCorp Inclusive',
  matchScore: 87,
  requiredSkills: ['React', 'TypeScript', 'Accessibilité', 'Tests'],
  missingSkills: ['Next.js'],
  ...overrides
})

export const generateMockCandidate = (overrides = {}) => ({
  candidateId: 'test-candidate-123',
  candidate: {
    name: 'Sarah Martin',
    currentRole: 'Frontend Developer',
    experience: '5 ans',
    location: 'Paris, France',
    hasRQTH: true
  },
  overallScore: 96,
  confidence: 94,
  breakdown: {
    technical: 98,
    soft: 92,
    experience: 95,
    accessibility: 100,
    cultural: 88
  },
  strengths: [
    'Expert React/TypeScript avec projets accessibilité',
    'Excellente communication et empathie'
  ],
  concerns: [
    'Peu d\'expérience management équipe'
  ],
  successPrediction: {
    probability: 94,
    factors: ['Adéquation technique parfaite'],
    timeline: '6-8 semaines adaptation'
  },
  accessibilityFit: {
    score: 100,
    adaptations: ['Lecteur d\'écran configuré'],
    concerns: []
  },
  aiInsights: ['Profil idéal pour mission accessibilité'],
  recommendedActions: ['Entretien technique avec démo accessibilité'],
  ...overrides
})

// Mock handlers for async operations
export const mockAsyncOperation = (data: any, delay = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}

// Accessibility test helpers
export const checkAccessibilityAttributes = (element: HTMLElement) => {
  const hasAriaLabel = element.hasAttribute('aria-label')
  const hasRole = element.hasAttribute('role')
  const hasTabIndex = element.hasAttribute('tabindex')
  
  return { hasAriaLabel, hasRole, hasTabIndex }
}

// Handibienveillance test helpers
export const calculateHandibienveillanceScore = (features: string[]) => {
  const accessibilityKeywords = ['télétravail', 'handicap', 'accessibilité', 'inclusif', 'adaptation']
  const matchingFeatures = features.filter(feature => 
    accessibilityKeywords.some(keyword => 
      feature.toLowerCase().includes(keyword)
    )
  )
  
  return Math.min((matchingFeatures.length / features.length) * 100, 100)
}