// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
// import { useAutoLogin } from '@/hooks/useAutoLogin'; // Désactivé temporairement
import { useUIStore } from '@/stores/uiStore';
import { useMobile } from '@/hooks/useMobile';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';

// Layout
import { Layout } from '@/components/layout/Layout';

// Dashboard Pages
import { CompanyDashboard } from '@/pages/dashboard/CompanyDashboard';
import { CandidateDashboard } from '@/pages/dashboard/CandidateDashboard';

// Job Pages
import { JobList } from '@/pages/jobs/JobList';
import { JobCreationWizard } from '@/components/jobs/JobCreationWizard';

// Candidate Pages
import { CandidateSearch } from '@/pages/candidates/CandidateSearch';
import { CandidateWorkflow } from '@/components/recruitment/CandidateWorkflow';

// Recruitment Pages
import { PrequalificationEngine } from '@/components/recruitment/PrequalificationEngine';

// Matching Pages
import { AIMatching } from '@/pages/matching/AIMatching';

// 🆕 NEW USER STORIES COMPONENTS
import { IntelligentCVGenerator } from '@/components/candidate/IntelligentCVGenerator';
import { PredictiveMatchingEngine } from '@/components/matching/PredictiveMatchingEngine';
import HandibienveillanceAssistant from '@/components/recruitment/HandibienveillanceAssistant';
import { MultiChannelPublisher } from '@/components/publishing/MultiChannelPublisher';
import { CRMWorkflowManager } from '@/components/crm/CRMWorkflowManager';
import { PipelineManager } from '@/components/pipeline/PipelineManager';

// Profile Pages
import { UserProfile } from '@/components/profile/UserProfile';
import { Settings } from '@/pages/profile/Settings';

// Analytics Pages
import { AnalyticsComplete } from '@/pages/analytics/AnalyticsComplete';
import { OETHReportsGenerator } from '@/components/analytics/OETHReportsGenerator';

// Admin Pages
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';

// Onboarding
import { GuidedTour, useOnboarding } from '@/components/onboarding/GuidedTour';

// Accessibility
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityManager';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
        <span className="text-white font-bold text-2xl">H</span>
      </div>
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'company' | 'candidate' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router Component avec onboarding
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Dashboard selon le rôle */}
      {user.role === 'company' && <CompanyDashboard />}
      {user.role === 'candidate' && <CandidateDashboard />}
      {user.role === 'admin' && <CompanyDashboard />}
      
      {/* Tour d'onboarding */}
      <GuidedTour 
        isVisible={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    </>
  );
};

// Wrapper pour PredictiveMatchingEngine avec params
const PredictiveMatchingWrapper: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  return <PredictiveMatchingEngine jobId={jobId || ''} />;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { darkMode, accessibilityMode, fontSize } = useUIStore();
  const { isMobile } = useMobile();
  const { setSidebarOpen } = useUIStore();
  
  // 🚀 AUTO-LOGIN CANDIDAT POUR PIERRE - DÉSACTIVÉ
  // useAutoLogin();

  // Initialize theme and accessibility on app load
  useEffect(() => {
    // Dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Font size
    document.documentElement.setAttribute('data-font-size', fontSize);

    // Accessibility mode
    if (accessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  }, [darkMode, accessibilityMode, fontSize]);

  // Mobile navigation handler
  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  // Show loading screen during auth check
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AccessibilityProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              } 
            />

            {/* Protected Routes with Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard - No nested redirect here */}
              <Route index element={<DashboardRouter />} />
              <Route path="dashboard" element={<DashboardRouter />} />

              {/* Profile Routes */}
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute requiredRole="candidate">
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="settings" 
                element={<Settings />} 
              />

              {/* Jobs */}
              <Route path="jobs" element={<JobList />} />
              <Route 
                path="jobs/create" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <JobCreationWizard />
                  </ProtectedRoute>
                } 
              />

              {/* Candidates (Company only) */}
              <Route 
                path="candidates" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CandidateSearch />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="candidates/workflow" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CandidateWorkflow />
                  </ProtectedRoute>
                } 
              />

              {/* Recruitment & Prequalification */}
              <Route 
                path="prequalification" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <PrequalificationEngine />
                  </ProtectedRoute>
                } 
              />

              {/* Matching */}
              <Route path="matching" element={<AIMatching />} />
              
              {/* 🆕 US-034: Matching Prédictif IA 95%+ */}
              <Route 
                path="matching/predictive/:jobId" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <PredictiveMatchingWrapper />
                  </ProtectedRoute>
                } 
              />
              
              {/* 🆕 US-035: Assistant IA Handibienveillance */}
              <Route 
                path="handibienveillance-assistant" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <HandibienveillanceAssistant />
                  </ProtectedRoute>
                } 
              />
              
              {/* 🆕 US-036: Diffusion Multi-Canaux Automatique */}
              <Route 
                path="diffusion-multi-canaux" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <MultiChannelPublisher />
                  </ProtectedRoute>
                } 
              />
              
              {/* 🆕 US-037: CRM Workflow Manager */}
              <Route 
                path="crm-workflow" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CRMWorkflowManager />
                  </ProtectedRoute>
                } 
              />

              {/* 🆕 US-038: Pipeline Automatisé */}
              <Route 
                path="pipeline-automatise" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <PipelineManager />
                  </ProtectedRoute>
                } 
              />
              {/* 🆕 US-033: CV Intelligent IA */}
              <Route 
                path="cv-generator" 
                element={
                  <ProtectedRoute requiredRole="candidate">
                    <IntelligentCVGenerator />
                  </ProtectedRoute>
                } 
              />

              {/* Analytics */}
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <AnalyticsComplete />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reports" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <OETHReportsGenerator />
                  </ProtectedRoute>
                } 
              />{/* Admin & User Management */}
              <Route 
                path="users" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <UserManagementPanel />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Fallback - redirect to dashboard if authenticated, login if not */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;