import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  sparklineData?: Array<{ value: number }>;
  subtitle?: string;
  loading?: boolean;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend = 'stable',
  icon,
  color = 'primary',
  sparklineData,
  subtitle,
  loading = false,
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success-50',
          iconBg: 'bg-success-100',
          iconColor: 'text-success-600',
          text: 'text-success-600'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          iconBg: 'bg-warning-100',
          iconColor: 'text-warning-600',
          text: 'text-warning-600'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          iconBg: 'bg-error-100',
          iconColor: 'text-error-600',
          text: 'text-error-600'
        };
      case 'info':
        return {
          bg: 'bg-info-50',
          iconBg: 'bg-info-100',
          iconColor: 'text-info-600',
          text: 'text-info-600'
        };
      default:
        return {
          bg: 'bg-primary-50',
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600',
          text: 'text-primary-600'
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-gray-400';
    }
  };

  const getSparklineColor = () => {
    switch (color) {
      case 'success':
        return '#059669';
      case 'warning':
        return '#d97706';
      case 'error':
        return '#dc2626';
      case 'info':
        return '#2563eb';
      default:
        return '#3b82f6';
    }
  };

  const colorClasses = getColorClasses();

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses.iconBg}`}>
            <div className={colorClasses.iconColor}>
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Trend and Sparkline */}
      <div className="flex items-center justify-between">
        {/* Trend indicator */}
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}

        {/* Sparkline chart */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="flex-1 ml-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getSparklineColor()} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getSparklineColor()} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={getSparklineColor()}
                  strokeWidth={2}
                  fill={`url(#gradient-${color})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { KPICard };