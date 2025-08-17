// src/pages/analytics/Reports.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Mail,
  Share2
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface OETHReport {
  period: string;
  totalEmployees: number;
  targetEmployees: number;
  actualEmployees: number;
  complianceRate: number;
  obligationAmount: number;
  paidAmount: number;
  hiringsThisYear: number;
  retentionRate: number;
  accommodationsCost: number;
  trainingHours: number;
}

interface ReportFilter {
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  quarter?: number;
  month?: number;
}

const Reports: React.FC = () => {
  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    period: 'yearly',
    year: new Date().getFullYear()
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  
  const { analytics, fetchAnalytics, exportReport, isLoading } = useAnalytics();
  const { company } = useAuth();
  const { toast } = useToast();

  // Données OETH mockées pour la démonstration
  const oethData: OETHReport = {
    period: `${reportFilter.year}`,
    totalEmployees: 250,
    targetEmployees: 15, // 6% de 250
    actualEmployees: 12,
    complianceRate: 80, // 12/15 * 100
    obligationAmount: 45000, // Montant théorique de l'obligation
    paidAmount: 36000, // Montant payé (80% de compliance)
    hiringsThisYear: 8,
    retentionRate: 85,
    accommodationsCost: 25000,
    trainingHours: 120
  };

  useEffect(() => {
    fetchAnalytics(reportFilter.period);
  }, [reportFilter, fetchAnalytics]);

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      
      switch (reportType) {
        case 'oeth':
          toast.success('Rapport OETH généré', 'Le rapport de conformité est prêt');
          break;
        case 'diversity':
          toast.success('Rapport diversité généré', 'Les métriques de diversité sont compilées');
          break;
        case 'performance':
          toast.success('Rapport performance généré', 'Les KPIs de recrutement sont analysés');
          break;
        default:
          toast.success('Rapport généré avec succès');
      }
      
      // Simuler le téléchargement
      const link = document.createElement('a');
      link.href = '#';
      link.download = `rapport-${reportType}-${Date.now()}.pdf`;
      link.click();
      
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkExport = async () => {
    if (selectedReports.length === 0) {
      toast.error('Aucun rapport sélectionné');
      return;
    }
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`${selectedReports.length} rapport(s) exporté(s)`, 'Archive ZIP téléchargée');
      setSelectedReports([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getComplianceStatus = (rate: number) => {
    if (rate >= 100) return { status: 'success', label: 'Conforme', icon: CheckCircle };
    if (rate >= 80) return { status: 'warning', label: 'Partiellement conforme', icon: AlertTriangle };
    return { status: 'error', label: 'Non conforme', icon: AlertTriangle };
  };

  const complianceStatus = getComplianceStatus(oethData.complianceRate);
  const ComplianceIcon = complianceStatus.icon;

  const reportTypes = [
    {
      id: 'oeth',
      title: 'Rapport OETH',
      description: 'Conformité obligation d\'emploi des travailleurs handicapés',
      icon: FileText,
      priority: 'high'
    },
    {
      id: 'diversity',
      title: 'Rapport Diversité',
      description: 'Métriques de diversité et inclusion',
      icon: Users,
      priority: 'medium'
    },
    {
      id: 'performance',
      title: 'Performance Recrutement',
      description: 'KPIs et efficacité des processus de recrutement',
      icon: TrendingUp,
      priority: 'medium'
    },
    {
      id: 'retention',
      title: 'Analyse Rétention',
      description: 'Taux de rétention et satisfaction employés',
      icon: Target,
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports et Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conformité OETH et métriques de performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchAnalytics(reportFilter.period)}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          {selectedReports.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkExport}
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter ({selectedReports.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filtres de période */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Période :</span>
            </div>
            
            <select
              value={reportFilter.period}
              onChange={(e) => setReportFilter({ 
                ...reportFilter, 
                period: e.target.value as 'monthly' | 'quarterly' | 'yearly' 
              })}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
            
            <select
              value={reportFilter.year}
              onChange={(e) => setReportFilter({ ...reportFilter, year: parseInt(e.target.value) })}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              {[2024, 2023, 2022, 2021].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <Badge variant={complianceStatus.status as any} size="md">
            <ComplianceIcon className="w-4 h-4 mr-2" />
            {complianceStatus.label}
          </Badge>
        </div>
      </Card>

      {/* Vue d'ensemble OETH */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conformité OETH {reportFilter.year}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleGenerateReport('oeth')}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter OETH
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {oethData.actualEmployees}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Employés TH
            </div>
            <div className="text-xs text-gray-500">
              Objectif: {oethData.targetEmployees}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {oethData.complianceRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Taux de conformité
            </div>
            <div className="text-xs text-gray-500">
              Minimum: 100%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {oethData.hiringsThisYear}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Recrutements TH
            </div>
            <div className="text-xs text-gray-500">
              Cette année
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {oethData.retentionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Taux de rétention
            </div>
            <div className="text-xs text-gray-500">
              12 derniers mois
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">Progression vers l'objectif</span>
              <span className="text-gray-600 dark:text-gray-400">{oethData.actualEmployees}/{oethData.targetEmployees}</span>
            </div>
            <ProgressBar
              value={oethData.complianceRate}
              color={oethData.complianceRate >= 100 ? 'bg-green-600' : oethData.complianceRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'}
              label=""
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Financier</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Obligation théorique</span>
                  <span className="font-medium">{oethData.obligationAmount.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Montant versé</span>
                  <span className="font-medium">{oethData.paidAmount.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Économies réalisées</span>
                  <span className="font-medium text-green-600">
                    {(oethData.obligationAmount - oethData.paidAmount).toLocaleString()}€
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Accompagnement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Coût aménagements</span>
                  <span className="font-medium">{oethData.accommodationsCost.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Heures de formation</span>
                  <span className="font-medium">{oethData.trainingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ROI estimé</span>
                  <span className="font-medium text-green-600">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bibliothèque de rapports */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bibliothèque de rapports
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedReports.length > 0 && (
              <span>{selectedReports.length} rapport(s) sélectionné(s)</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReports.includes(report.id);
            
            return (
              <motion.div
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedReports(prev =>
                      prev.includes(report.id)
                        ? prev.filter(id => id !== report.id)
                        : [...prev, report.id]
                    );
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={
                        report.priority === 'high' ? 'error' : 
                        report.priority === 'medium' ? 'warning' : 'default'
                      } 
                      size="sm"
                    >
                      {report.priority === 'high' ? 'Prioritaire' : 
                       report.priority === 'medium' ? 'Important' : 'Standard'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Dernière génération: il y a 2 jours
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(report.id);
                        }}
                        disabled={isGenerating}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Générer
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Rapport partagé par email');
                        }}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Historique des rapports */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Historique des exports
        </h2>
        
        <div className="space-y-3">
          {[
            { name: 'Rapport OETH 2024', date: '2024-01-15', size: '2.4 MB', status: 'Téléchargé' },
            { name: 'Analyse Diversité Q4', date: '2024-01-10', size: '1.8 MB', status: 'Partagé' },
            { name: 'Performance Recrutement', date: '2024-01-05', size: '3.1 MB', status: 'Téléchargé' },
            { name: 'Rapport OETH Q4 2023', date: '2023-12-31', size: '2.2 MB', status: 'Archivé' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.date} • {item.size}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={item.status === 'Téléchargé' ? 'success' : item.status === 'Partagé' ? 'info' : 'default'} 
                  size="sm"
                >
                  {item.status}
                </Badge>
                
                <Button variant="ghost" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alertes et recommandations */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alertes et recommandations
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Objectif OETH non atteint
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Il manque 3 employés pour atteindre l'objectif de 6%. Considérez intensifier les recrutements TH.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Rapport annuel à générer
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Le rapport OETH annuel doit être soumis avant le 15 février 2024.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Excellent taux de rétention
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Votre taux de rétention de 85% est supérieur à la moyenne du secteur (78%).
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { Reports };