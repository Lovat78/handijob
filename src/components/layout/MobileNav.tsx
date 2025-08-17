// src/components/layout/MobileNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  Users, 
  Brain, 
  BarChart3,
  Zap,
  Settings,
  X,
  Plus,
  Target,
  Heart,
  Share2,
  UserCheck,
  Sparkles,
  LogOut,
  Database,
  Workflow
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { Badge, Button } from '@/components/ui';

const MobileNav: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // NAVIGATION IDENTIQUE À SIDEBAR - SELON PROFIL UTILISATEUR
  const getNavigationByRole = () => {
    if (!user) {
      return [];
    }

    const common = [
      {
        icon: <Home className="w-5 h-5" />,
        label: 'Tableau de bord',
        path: '/dashboard'
      }
    ];

    if (user.role === 'candidate') {
      return [
        ...common,
        {
          icon: <Briefcase className="w-5 h-5" />,
          label: 'Offres d\'emploi',
          path: '/jobs'
        },
        {
          icon: <Sparkles className="w-5 h-5" />,
          label: 'CV Intelligent IA',
          path: '/cv-generator'
        },
        {
          icon: <Brain className="w-5 h-5" />,
          label: 'Matching IA',
          path: '/matching'
        },
        {
          icon: <Target className="w-5 h-5" />,
          label: 'Mon profil',
          path: '/profile'
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: 'Paramètres',
          path: '/settings'
        }
      ];
    }

    if (user.role === 'company') {
      return [
        ...common,
        {
          icon: <Plus className="w-5 h-5" />,
          label: 'Créer une offre',
          path: '/jobs/create'
        },
        {
          icon: <Briefcase className="w-5 h-5" />,
          label: 'Mes offres',
          path: '/jobs'
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: 'Rechercher candidats',
          path: '/candidates'
        },
        {
          icon: <Brain className="w-5 h-5" />,
          label: 'Matching IA',
          path: '/matching'
        },
        {
          icon: <Zap className="w-5 h-5" />,
          label: 'Matching Prédictif IA',
          path: '/matching/predictive/demo-job'
        },
        {
          icon: <Heart className="w-5 h-5" />,
          label: 'Assistant Handibienveillance',
          path: '/handibienveillance-assistant'
        },
        {
          icon: <Workflow className="w-5 h-5" />,
          label: 'Pipeline Automatisé',
          path: '/pipeline-automatise'
        },
        {
          icon: <Database className="w-5 h-5" />,
          label: 'CRM Workflow',
          path: '/crm-workflow'
        },
        {
          icon: <Share2 className="w-5 h-5" />,
          label: 'Diffusion Multi-Canaux',
          path: '/diffusion-multi-canaux'
        },
        {
          icon: <BarChart3 className="w-5 h-5" />,
          label: 'Analytics',
          path: '/analytics'
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          label: 'Gestion équipe',
          path: '/users'
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: 'Paramètres',
          path: '/settings'
        }
      ];
    }

    return common;
  };

  const navigationItems = getNavigationByRole();

  return (
    <>
      {/* Bottom Navigation pour mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-600 dark:bg-gray-800 border-t border-primary-700 dark:border-gray-700 z-40 safe-area-pb rounded-tl-lg rounded-tr-lg">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-xs transition-colors relative ${
                  isActive
                    ? 'text-white dark:text-gray-100'
                    : 'text-white/70 dark:text-gray-400 hover:text-white dark:hover:text-gray-200'
                }`
              }
            >
              <div className="relative">
                {item.icon}
              </div>
              <span className="font-medium truncate max-w-[60px]">
                {item.label === 'Tableau de bord' ? 'Accueil' : 
                 item.label === 'Offres d\'emploi' || item.label === 'Mes offres' ? 'Offres' :
                 item.label === 'CV Intelligent IA' ? 'CV IA' :
                 item.label === 'Mon profil' ? 'Profil' :
                 item.label === 'Rechercher candidats' ? 'Candidats' :
                 item.label === 'Matching Prédictif IA' ? 'Matching+' :
                 item.label === 'Gestion équipe' ? 'Équipe' :
                 item.label === 'Paramètres' ? 'Config' :
                 item.label.length > 8 ? item.label.substring(0, 8) : item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Overlay pour sidebar mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden overflow-y-auto"
            >
              {/* Header mobile avec bouton fermer */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 bg-primary-600 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 dark:text-white font-bold text-lg">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white dark:text-gray-100">
                      Handi.jobs
                    </span>
                    <span className="text-xs text-white/70 dark:text-gray-400">
                      {user?.role === 'company' ? 'Entreprise' : 'Candidat'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white dark:text-gray-300 hover:bg-primary-700 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex flex-1 flex-col px-6 py-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Section utilisateur + Déconnexion */}
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  {user && (
                    <div className="px-3 py-2 mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.role === 'company' ? 'Entreprise' : user.role === 'candidate' ? 'Candidat' : 'Admin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export { MobileNav };