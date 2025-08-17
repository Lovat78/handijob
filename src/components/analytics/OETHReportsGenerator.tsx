// src/components/analytics/OETHReportsGenerator.tsx
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Euro,
  Eye,
  Filter
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';

interface OETHData {
  year: number;
  totalEmployees: number;
  targetEmployees: number;
  currentEmployees: number;
  complianceRate: number;
  annualContribution: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  recruitmentGoal: number;
  actualRecruitment: number;
  exemptions: number;
  lastUpdateDate: string;
}

interface OETHReport {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  status: 'draft' | 'final' | 'submitted';
  data: OETHData;
}

// Données mockées OETH
const mockOETHData: OETHData = {
  year: 2024,
  totalEmployees: 520,
  targetEmployees: 31, // 6% de 520
  currentEmployees: 28,
  complianceRate: 90.3,
  annualContribution: 15600,
  status: 'partial',
  recruitmentGoal: 5,
  actualRecruitment: 3,
  exemptions: 2,
  lastUpdateDate: '2024-08-10'
};

const mockReports: OETHReport[] = [
  {
    id: '1',
    title: 'Rapport OETH 2024 - Trimestre 2',
    period: 'Q2 2024',
    generatedAt: '2024-07-15',
    status: 'submitted',
    data: mockOETHData
  },
  {
    id: '2',
    title: 'Rapport OETH 2024 - Trimestre 1',
    period: 'Q1 2024',
    generatedAt: '2024-04-15',
    status: 'final',
    data: { ...mockOETHData, complianceRate: 85.2, currentEmployees: 26 }
  }
];

const StatusBadge: React.FC<{ status: OETHData['status'] }> = ({ status }) => {
  const variants = {
    'compliant': { variant: 'success' as const, label: 'Conforme' },
    'partial': { variant: 'warning' as const, label: 'Partiellement conforme' },
    'non-compliant': { variant: 'error' as const, label: 'Non conforme' }
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} size="md">
      {config.label}
    </Badge>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}> = ({ title, value, subtitle, icon, trend, color }) => (
  <Card padding="md" hoverable>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
            <span className="text-sm text-success-600 font-medium">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const OETHReportsGenerator: React.FC = () => {
  const { company } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<OETHReport[]>(mockReports);
  const [currentData] = useState<OETHData>(mockOETHData);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulation génération rapport
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: OETHReport = {
      id: Date.now().toString(),
      title: `Rapport OETH ${selectedPeriod} - Trimestre 3`,
      period: `Q3 ${selectedPeriod}`,
      generatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      data: currentData
    };

    setReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
  };

  const handleExportReport = (reportId: string, format: 'pdf' | 'excel') => {
    // Simulation export
    console.log(`Exporting report ${reportId} as ${format}`);
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 100) return 'text-success-600';
    if (rate >= 80) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Rapports OETH
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Génération et suivi des rapports d'Obligation d'Emploi des Travailleurs Handicapés
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerateReport}
            isLoading={isGenerating}
            disabled={isGenerating}
          >
            <FileText className="w-4 h-4 mr-2" />
            Générer rapport
          </Button>
        </div>
      </div>

      {/* Métriques OETH actuelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Taux de conformité"
          value={`${currentData.complianceRate}%`}
          subtitle={`${currentData.currentEmployees}/${currentData.targetEmployees} employés`}
          icon={<BarChart3 className="w-6 h-6" />}
          trend={5.1}
          color="bg-primary-100 text-primary-600"
        />
        
        <MetricCard
          title="Employés RQTH"
          value={currentData.currentEmployees}
          subtitle={`Objectif: ${currentData.targetEmployees}`}
          icon={<Users className="w-6 h-6" />}
          color="bg-success-100 text-success-600"
        />
        
        <MetricCard
          title="Recrutements 2024"
          value={`${currentData.actualRecruitment}/${currentData.recruitmentGoal}`}
          subtitle="Objectif atteint à 60%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-warning-100 text-warning-600"
        />
        
        <MetricCard
          title="Contribution annuelle"
          value={`${(currentData.annualContribution / 1000).toFixed(0)}k€`}
          subtitle="Si objectif non atteint"
          icon={<Euro className="w-6 h-6" />}
          color="bg-error-100 text-error-600"
        />
      </div>

      {/* Statut de conformité */}
      <Card padding="lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Statut de conformité OETH
            </h3>
            <StatusBadge status={currentData.status} />
          </div>
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progression vers l'objectif
              </span>
              <span className={`text-sm font-semibold ${getComplianceColor(currentData.complianceRate)}`}>
                {currentData.complianceRate}%
              </span>
            </div>
            <ProgressBar
              value={currentData.complianceRate}
              max={100}
              color={currentData.complianceRate >= 100 ? 'bg-success-600' : 
                     currentData.complianceRate >= 80 ? 'bg-warning-600' : 'bg-error-600'}
              showPercentage={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Effectif total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentData.totalEmployees}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dernière mise à jour</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(currentData.lastUpdateDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Liste des rapports */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rapports générés
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Tous les statuts</span>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </h4>
                    <Badge 
                      variant={
                        report.status === 'submitted' ? 'success' :
                        report.status === 'final' ? 'info' : 'warning'
                      }
                      size="sm"
                    >
                      {report.status === 'submitted' ? 'Soumis' :
                       report.status === 'final' ? 'Final' : 'Brouillon'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Période: {report.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Généré le {new Date(report.generatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>Conformité: {report.data.complianceRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, 'pdf')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, 'excel')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun rapport généré pour le moment
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateReport}
              className="mt-4"
            >
              Générer votre premier rapport
            </Button>
          </div>
        )}
      </Card>

      {/* Informations légales */}
      <Card padding="md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-info-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white mb-1">
              Rappel réglementaire
            </p>
            <p>
              Les entreprises de 20 salariés et plus doivent employer 6% de travailleurs handicapés. 
              Le rapport OETH doit être transmis annuellement avant le 1er mars via la DSN.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { OETHReportsGenerator };