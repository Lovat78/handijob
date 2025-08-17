// src/test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Brain: () => <div data-testid="brain-icon">Brain</div>,
  Target: () => <div data-testid="target-icon">Target</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
  AlertTriangle: () => <div data-testid="alert-triangle-icon">AlertTriangle</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Award: () => <div data-testid="award-icon">Award</div>,
  FileText: () => <div data-testid="file-text-icon">FileText</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  RefreshCw: () => <div data-testid="refresh-cw-icon">RefreshCw</div>,
  Lightbulb: () => <div data-testid="lightbulb-icon">Lightbulb</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  DollarSign: () => <div data-testid="dollar-sign-icon">DollarSign</div>,
  Send: () => <div data-testid="send-icon">Send</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: () => ({ jobId: 'test-job-123' }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

// Mock stores
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user',
      role: 'candidate',
      firstName: 'Test',
      lastName: 'User',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

vi.mock('@/stores/candidateStore', () => ({
  useCandidateStore: () => ({
    currentCandidate: {
      id: 'test-candidate',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
    },
  }),
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})