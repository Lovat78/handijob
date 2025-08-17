// src/components/layout/Sidebar.tsx - NAVIGATION SELON PROFIL
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Users, 
  Brain,
  Target, 
  Settings,
  FileText,
  LogOut,
  Plus,
  BarChart3,
  Search,
  UserCheck,
  Heart,
  Share2,
  Zap,
  Sparkles,
  Database,
  Workflow
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen } = useUIStore();

  // NAVIGATION SELON PROFIL UTILISATEUR
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

  // GUARD: Si pas d'utilisateur, ne pas afficher la sidebar
  if (!user) {
    return null;
  }

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 overflow-y-auto ${
      sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full min-h-0">
        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              data-tour={item.path === '/dashboard' ? 'dashboard' : 
                        item.path === '/jobs' ? 'jobs' :
                        item.path === '/candidates' ? 'candidates' :
                        item.path === '/matching' ? 'matching' : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  sidebarOpen ? 'px-3 py-2' : 'px-2 py-3 justify-center'
                } ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              
              {sidebarOpen && (
                <>
                  <span className="flex-1 ml-3">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section & Logout - STYLE MOBILENAV */}
        <div className="mt-auto p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Profil utilisateur - seulement si sidebar ouverte */}
          {sidebarOpen && (
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
          
          {/* Bouton déconnexion - STYLE MOBILENAV */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
            }}
            className={`w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };