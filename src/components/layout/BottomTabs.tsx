// src/components/layout/BottomTabs.tsx
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Users, Brain, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

interface TabItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
  roles: ('company' | 'candidate' | 'admin')[];
}

const BottomTabs: React.FC = () => {
  const { user } = useAuth();

  // Tabs avec contrôle par rôles
  const allTabs: TabItem[] = useMemo(() => [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Accueil', 
      path: '/dashboard',
      roles: ['company', 'candidate', 'admin']
    },
    { 
      icon: <Briefcase className="w-5 h-5" />, 
      label: 'Offres', 
      path: '/jobs', 
      badge: 8,
      roles: ['company', 'candidate', 'admin']
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Candidats', 
      path: '/candidates',
      roles: ['company', 'admin'] // Seulement entreprises
    },
    { 
      icon: <Brain className="w-5 h-5" />, 
      label: 'Matching', 
      path: '/matching',
      roles: ['company', 'candidate', 'admin']
    },
    { 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: 'Stats', 
      path: '/analytics',
      roles: ['company', 'admin'] // Seulement entreprises
    }
  ], []);

  // Filtrer les tabs selon le rôle de l'utilisateur
  const tabs = useMemo(() => {
    if (!user?.role) return [];
    return allTabs.filter(tab => tab.roles.includes(user.role));
  }, [allTabs, user?.role]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 px-1 text-xs relative transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <Badge
                  variant="error"
                  size="sm"
                  className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </div>
            <span className="mt-1 font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export { BottomTabs };