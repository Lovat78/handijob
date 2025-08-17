import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Table, 
  Eye, 
  Calendar,
  Building,
  Users,
  Target,
  TrendingUp,
  X,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { Analytics, AnalyticsPeriod } from '@/types';

interface ReportExportProps {
  analytics: Analytics | null;
  companyName?: string;
  className?: string;
}

type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ExportConfig {
  format: ExportFormat;
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
  includeOETH: boolean;
  period: AnalyticsPeriod;
  customDateRange?: {
    start: string;
    end: string;
  };
}

const ReportExport: React.FC<ReportExportProps> = ({
  analytics,
  companyName = 'Entreprise',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
    includeOETH: true,
    period: 'month'
  });

  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const formatPeriodLabel = (period: AnalyticsPeriod): string => {
    switch (period) {
      case 'week':
        return 'Semaine';
      case 'month':
        return 'Mois';
      case 'quarter':
        return 'Trimestre';
      case 'year':
        return 'Année';
      default:
        return 'Période';
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'excel':
        return <Table className="w-4 h-4" />;
      case 'csv':
        return <Download className="w-4 h-4" />;
    }
  };

  const handleExport = async () => {
    if (!analytics) {
      toast.error('Erreur', 'Aucune donnée disponible pour l\'export');
      return;
    }

    setIsExporting(true);

    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileName = `rapport-handi-jobs-${analytics.period}-${Date.now()}.${exportConfig.format}`;
      
      // Ici, en réalité, on appellerait l'API pour générer le rapport
      toast.success('Export réussi', `Le rapport ${fileName} a été généré avec succès`);
      
    } catch (error) {
      toast.error('Erreur d\'export', 'Impossible de générer le rapport');
    } finally {
      setIsExporting(false);
    }
  };

  const renderPreviewContent = () => {
    if (!analytics) return null;

    return (
      <div className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Rapport d'Analytics RH
              </h1>
              <p className="text-gray-600">
                {companyName} • {formatPeriodLabel(analytics.period)} • {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {exportConfig.includeSummary && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Résumé Exécutif
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.data.recruitment.totalApplications}
                </div>
                <div className="text-sm text-gray-600">Candidatures totales</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.data.recruitment.activeJobs}
                </div>
                <div className="text-sm text-gray-600">Offres actives</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.data.diversity.oethRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Taux OETH</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.data.recruitment.averageTimeToHire}j
                </div>
                <div className="text-sm text-gray-600">Temps moyen recrutement</div>
              </div>
            </div>
          </section>
        )}

        {/* OETH Compliance */}
        {exportConfig.includeOETH && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-warning-600" />
              Conformité OETH
            </h2>
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Taux d'emploi actuel</span>
                <span className="text-lg font-bold">
                  {analytics.data.diversity.oethRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-warning-600 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.data.diversity.oethRate / 6 * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Objectif légal : 6% • 
                {analytics.data.diversity.oethRate >= 6 
                  ? ' ✅ Objectif atteint' 
                  : ` Reste à atteindre : ${(6 - analytics.data.diversity.oethRate).toFixed(1)}%`
                }
              </p>
            </div>
          </section>
        )}

        {/* Detailed Metrics */}
        {exportConfig.includeDetails && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Métriques Détaillées
            </h2>
            
            <div className="space-y-6">
              {/* Recruitment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recrutement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Taux d'embauche</span>
                    <span className="font-medium">{analytics.data.recruitment.hireRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût par embauche</span>
                    <span className="font-medium">{analytics.data.recruitment.costPerHire.toLocaleString('fr-FR')}€</span>
                  </div>
                </div>
              </div>

              {/* Diversity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Diversité & Inclusion</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Score d'inclusion</span>
                    <span className="font-medium">{analytics.data.diversity.inclusionScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hommes</span>
                    <span className="font-medium">{analytics.data.diversity.diversityBreakdown.gender.male}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Femmes</span>
                    <span className="font-medium">{analytics.data.diversity.diversityBreakdown.gender.female}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handicap</span>
                    <span className="font-medium">{analytics.data.diversity.diversityBreakdown.disability}%</span>
                  </div>
                </div>
              </div>

              {/* ROI */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Retour sur Investissement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>ROI global</span>
                    <span className="font-medium text-success-600">+{analytics.data.roi.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Économies totales</span>
                    <span className="font-medium">{analytics.data.roi.totalSavings.toLocaleString('fr-FR')}€</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          Rapport généré par Handi.Jobs • Confidentiel
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Export Button */}
      <Button
        variant="secondary"
        size="md"
        onClick={() => setShowPreview(true)}
        disabled={!analytics}
        className="inline-flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Exporter le rapport
      </Button>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Aperçu du rapport
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configurez et prévisualisez votre rapport avant export
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Configuration */}
              <div className="p-6 border-b bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format d'export
                    </label>
                    <div className="flex space-x-2">
                      {(['pdf', 'excel', 'csv'] as ExportFormat[]).map((format) => (
                        <button
                          key={format}
                          onClick={() => setExportConfig(prev => ({ ...prev, format }))}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            exportConfig.format === format
                              ? 'bg-primary-100 text-primary-700 border-primary-200'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          } border`}
                        >
                          {getFormatIcon(format)}
                          <span className="ml-1 uppercase">{format}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sections à inclure
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'includeSummary', label: 'Résumé exécutif' },
                        { key: 'includeOETH', label: 'Conformité OETH' },
                        { key: 'includeDetails', label: 'Métriques détaillées' },
                        { key: 'includeCharts', label: 'Graphiques' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={exportConfig[key as keyof ExportConfig] as boolean}
                            onChange={(e) => setExportConfig(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-end space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleExport}
                      disabled={isExporting}
                      isLoading={isExporting}
                      fullWidth
                    >
                      {getFormatIcon(exportConfig.format)}
                      <span className="ml-2">
                        {isExporting ? 'Export en cours...' : `Exporter ${exportConfig.format.toUpperCase()}`}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.print()}
                      fullWidth
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto" ref={previewRef}>
                {renderPreviewContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ReportExport };