// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LoginCredentials } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur de connexion', 'Vérifiez vos identifiants');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card padding="lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Handi.jobs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Recrutement inclusif nouvelle génération
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="votre@email.fr"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              fullWidth
            />

            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              fullWidth
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
            >
              Se connecter
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Mot de passe oublié ?
            </Link>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          {/* Demo credentials - PIERRE TEST RAPIDE */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 text-center mb-3">
              🚀 Test Rapide Pierre :
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await login({
                      email: 'ahmed.benali@example.fr',
                      password: 'password123'
                    });
                    toast.success('Connexion candidat réussie !');
                    navigate('/dashboard');
                  } catch (error) {
                    toast.error('Erreur connexion candidat');
                  }
                }}
                className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                👤 Connexion Candidat (Ahmed)
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await login({
                      email: 'marie.dubois@techcorp.fr',
                      password: 'password123'
                    });
                    toast.success('Connexion entreprise réussie !');
                    navigate('/dashboard');
                  } catch (error) {
                    toast.error('Erreur connexion entreprise');
                  }
                }}
                className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                🏢 Connexion Entreprise (Marie)
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
              Clic direct = connexion automatique
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export { Login };