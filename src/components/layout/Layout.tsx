// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SidebarCandidate } from './SidebarCandidate'; // FORCE CANDIDAT
import { MobileNav } from './MobileNav';
import { BottomTabs } from './BottomTabs';
import { ToastContainer } from '@/components/ui';
import { useMobile } from '@/hooks/useMobile';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';

const Layout: React.FC = () => {
  const { isMobile } = useMobile();
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated, user } = useAuth();

  console.log('🏠 Layout render - user role:', user?.role);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Outlet />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fixe */}
      <Header />

      <div className="flex h-screen pt-16">
        {/* Sidebar pour desktop - ROLLBACK FORCE */}
        {!isMobile && (
          <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            <Sidebar />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobile && <MobileNav />}

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation pour mobile */}
      {isMobile && <BottomTabs />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export { Layout };