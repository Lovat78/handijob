// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, Moon, Sun, Settings, LogOut, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { useClickOutside } from '@/hooks';

const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { user, logout } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();

  const userMenuRef = useClickOutside<HTMLDivElement>(() => setUserMenuOpen(false));

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    // Route différente selon le rôle
    if (user?.role === 'candidate') {
      navigate('/profile'); // Page profil candidat
    } else {
      navigate('/settings'); // Page paramètres entreprise
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-primary-600 dark:bg-gray-800 border-b border-primary-700 dark:border-gray-700 rounded-bl-lg rounded-br-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Bouton hamburger - visible sur desktop ET mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            className="hover:bg-primary-700 dark:hover:bg-gray-700 text-white dark:text-gray-300 hover:text-white dark:hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 dark:text-white font-bold text-sm">H</span>
            </div>
            {!isMobile && (
              <span className="font-bold text-xl text-white dark:text-gray-100">
                Handi.jobs
              </span>
            )}
          </div>
        </div>

        {/* Center section - Search (desktop only) */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-white/30 dark:focus:ring-primary-500 text-sm text-white dark:text-gray-100 placeholder-white/70 dark:placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Search mobile */}
          {isMobile && (
            <Button variant="ghost" size="sm" aria-label="Rechercher" className="hover:bg-primary-700 dark:hover:bg-gray-700 text-white dark:text-gray-300 hover:text-white dark:hover:text-white">
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
            className="hover:bg-primary-700 dark:hover:bg-gray-700 text-white dark:text-gray-300 hover:text-white dark:hover:text-white"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" aria-label="Notifications" className="hover:bg-primary-700 dark:hover:bg-gray-700 text-white dark:text-gray-300 hover:text-white dark:hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Badge
              variant="error"
              size="sm"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="Menu utilisateur"
              className="relative hover:bg-primary-700 dark:hover:bg-gray-700 text-white dark:text-gray-300 hover:text-white dark:hover:text-white"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.role === 'company' ? 'Entreprise' : user?.role === 'candidate' ? 'Candidat' : 'Admin'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 mr-3" />
                      Mon profil & données
                    </button>
                    
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Paramètres
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };