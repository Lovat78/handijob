import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut';

interface ChartData {
  [key: string]: any;
}

interface ChartProps {
  type: ChartType;
  data: ChartData[];
  title?: string;
  height?: number;
  colors?: string[];
  dataKeys?: string[];
  xAxisKey?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  loading?: boolean;
  className?: string;
  formatTooltip?: (value: any, name: string) => string[];
  formatXAxis?: (value: any) => string;
  formatYAxis?: (value: any) => string;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  dataKeys = [],
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  loading = false,
  className = '',
  formatTooltip,
  formatXAxis,
  formatYAxis
}) => {
  const defaultColors = [
    '#3b82f6', // primary-500
    '#10b981', // success-500
    '#f59e0b', // warning-500
    '#ef4444', // error-500
    '#8b5cf6', // purple-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316'  // orange-500
  ];

  const chartColors = colors.length > 0 ? colors : defaultColors;

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {formatTooltip ? formatTooltip(entry.value, entry.name)[0] : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            {showTooltip && <Tooltip content={customTooltip} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              {dataKeys.map((key, index) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={chartColors[index % chartColors.length]} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={chartColors[index % chartColors.length]} 
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            {showTooltip && <Tooltip content={customTooltip} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={chartColors[index % chartColors.length]}
                fill={`url(#gradient-${key})`}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            {showTooltip && <Tooltip content={customTooltip} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[index % chartColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
      case 'donut':
        const innerRadius = type === 'donut' ? 60 : 0;
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={120}
              paddingAngle={2}
              dataKey={dataKeys[0] || 'value'}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={customTooltip} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        {title && (
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        )}
        <div className="animate-pulse">
          <div className="flex space-x-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">Aucune donnée disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export { Chart };