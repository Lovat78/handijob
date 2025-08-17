// src/pages/matching/MatchResults.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Target,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  BookmarkPlus,
  Share2
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useMatching } from '@/hooks/useMatching';
import { useCandidateStore } from '@/stores/candidateStore';
import { useJobStore } from '@/stores/jobStore';
import { MatchResult } from '@/types';

// Composant principal MatchResults
const MatchResults: React.FC = () => {
  const [jobId] = useState<string>('1'); // Simulation d'un jobId
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'date'>('score');
  
  const { matches, isLoading, fetchMatches } = useMatching();
  const { candidates } = useCandidateStore();
  const { jobs } = useJobStore();
  
  const job = jobs.find(j => j.id === jobId);
  
  useEffect(() => {
    if (jobId) {
      fetchMatches({ jobId });
    }
  }, [jobId]);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return match.score >= 80;
    if (selectedFilter === 'medium') return match.score >= 60 && match.score < 80;
    if (selectedFilter === 'low') return match.score < 60;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'experience') {
      const candidateA = candidates.find(c => c.id === a.candidateId);
      const candidateB = candidates.find(c => c.id === b.candidateId);
      return (candidateB?.profile.experience || 0) - (candidateA?.profile.experience || 0);
    }
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });
  
  const stats = {
    total: matches.length,
    high: matches.filter(m => m.score >= 80).length,
    medium: matches.filter(m => m.score >= 60 && m.score < 80).length,
    low: matches.filter(m => m.score < 60).length,
    avgScore: matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length) : 0
  };
  
  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Offre non trouvée
        </h1>
        <Button onClick={() => window.history.back()}>
          Retour au matching
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Résultats de matching
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {job.title} • {job.location.city}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>
      
      {/* Statistiques */}
      <Card padding="md">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total candidats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.high}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Excellents (80%+)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bons (60-79%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.low}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Faibles (&lt;60%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score moyen</div>
          </div>
        </div>
      </Card>
      
      {/* Filtres et tri */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par score :</span>
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'Tous', count: stats.total },
                { key: 'high', label: 'Excellents', count: stats.high },
                { key: 'medium', label: 'Bons', count: stats.medium },
                { key: 'low', label: 'Faibles', count: stats.low }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key as any)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedFilter === filter.key
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="score">Score de matching</option>
              <option value="experience">Expérience</option>
              <option value="date">Date d'analyse</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Liste des résultats */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des résultats...
              </p>
            </div>
          </motion.div>
        ) : filteredMatches.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg">
              <div className="text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aucun candidat ne correspond aux critères sélectionnés
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredMatches.map((match, index) => {
              const candidate = candidates.find(c => c.id === match.candidateId);
              if (!candidate) return null;
              
              return (
                <motion.div
                  key={match.candidateId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card padding="md" hoverable>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profil candidat */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getScoreColor(match.score)}`}>
                            {match.score}%
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {candidate.profile.firstName} {candidate.profile.lastName}
                              </h3>
                              {candidate.accessibility.needsAccommodation && (
                                <Badge variant="success" size="sm">♿</Badge>
                              )}
                              {candidate.availability && (
                                <Badge variant="info" size="sm">Disponible</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {candidate.profile.title}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {candidate.profile.location.city}
                              </div>
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {candidate.profile.experience} ans d'exp.
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Actif récemment
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Développeur passionné par l'accessibilité et les technologies modernes.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.profile.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill.name} variant="info" size="sm">
                              {skill.name} ({skill.level}%)
                            </Badge>
                          ))}
                          {candidate.profile.skills.length > 4 && (
                            <Badge variant="default" size="sm">
                              +{candidate.profile.skills.length - 4} autres
                            </Badge>
                          )}
                        </div>
                        
                        {/* Points clés du matching */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Points clés du matching :
                          </h4>
                          <div className="space-y-1">
                            {match.reasons.slice(0, 3).map((reason, i) => (
                              <div key={i} className="flex items-start text-sm">
                                {reason.positive ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {reason.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Scores et actions */}
                      <div className="space-y-4">
                        {/* Breakdown des scores */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Détail du scoring :
                          </h4>
                          <div className="space-y-3">
                            <ProgressBar
                              value={match.breakdown.skillsMatch}
                              color={getScoreBg(match.breakdown.skillsMatch)}
                              label="Compétences"
                            />
                            <ProgressBar
                              value={match.breakdown.experienceMatch}
                              color={getScoreBg(match.breakdown.experienceMatch)}
                              label="Expérience"
                            />
                            <ProgressBar
                              value={match.breakdown.locationMatch}
                              color={getScoreBg(match.breakdown.locationMatch)}
                              label="Localisation"
                            />
                            <ProgressBar
                              value={match.breakdown.accessibilityMatch}
                              color={getScoreBg(match.breakdown.accessibilityMatch)}
                              label="Accessibilité"
                            />
                          </div>
                        </div>
                        
                        {/* Confiance et recommandations */}
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Niveau de confiance
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {match.confidence}%
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="space-y-2">
                          <Button variant="primary" size="sm" fullWidth>
                            <Mail className="w-4 h-4 mr-2" />
                            Contacter par email
                          </Button>
                          <Button variant="outline" size="sm" fullWidth>
                            <Phone className="w-4 h-4 mr-2" />
                            Programmer un appel
                          </Button>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Profil complet
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BookmarkPlus className="w-4 h-4 mr-2" />
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { MatchResults };