'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ValueRange {
  min: number;
  max: number;
  optimal?: {
    min: number;
    max: number;
  };
}

interface ValueVisualizationProps {
  value: number;
  range: ValueRange;
  unit?: string;
  label: string;
  showBar?: boolean;
  showStatus?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ValueVisualization({
  value,
  range,
  unit = '',
  label,
  showBar = true,
  showStatus = true,
  size = 'medium'
}: ValueVisualizationProps) {
  const getStatus = (value: number, range: ValueRange) => {
    if (value < range.min) return 'low';
    if (value > range.max) return 'high';
    if (range.optimal && (value < range.optimal.min || value > range.optimal.max)) return 'warning';
    return 'optimal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal': return 'Optimal';
      case 'warning': return 'Achtung';
      case 'low': return 'Zu niedrig';
      case 'high': return 'Zu hoch';
      default: return 'Unbekannt';
    }
  };

  const status = getStatus(value, range);
  const totalRange = range.max - range.min;
  const valuePosition = Math.max(0, Math.min(100, ((value - range.min) / totalRange) * 100));

  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`${sizeClasses[size]} space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">{label}</span>
        {showStatus && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-500 min-w-[3rem]">{range.min}{unit}</span>
        {showBar && (
          <div className="flex-1 relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${valuePosition}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-2 rounded-full ${getBarColor(status)}`}
              />
              {range.optimal && (
                <div 
                  className="absolute top-0 h-2 bg-green-300 opacity-50 rounded-full"
                  style={{
                    left: `${((range.optimal.min - range.min) / totalRange) * 100}%`,
                    width: `${((range.optimal.max - range.optimal.min) / totalRange) * 100}%`
                  }}
                />
              )}
            </div>
          </div>
        )}
        <span className="text-gray-500 min-w-[3rem]">{range.max}{unit}</span>
      </div>

      <div className="text-center">
        <span className="font-bold text-lg">{value}{unit}</span>
      </div>
    </div>
  );
}

// Komponente für einfache Trend-Diagramme
interface TrendData {
  date: string;
  value: number;
}

interface TrendChartProps {
  data: TrendData[];
  range: ValueRange;
  unit?: string;
  label: string;
  height?: number;
}

export function TrendChart({ data, range, unit = '', label, height = 100 }: TrendChartProps) {
  if (data.length < 2) return null;

  const maxValue = Math.max(...data.map(d => d.value), range.max);
  const minValue = Math.min(...data.map(d => d.value), range.min);
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    return height - ((value - minValue) / valueRange) * height;
  };

  const getStatusColor = (value: number) => {
    if (value < range.min) return '#ef4444';
    if (value > range.max) return '#ef4444';
    if (range.optimal && (value < range.optimal.min || value > range.optimal.max)) return '#eab308';
    return '#22c55e';
  };

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 200;
    const y = getY(point.value);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="relative" style={{ height: `${height + 20}px` }}>
        <svg width="100%" height={height} className="border border-gray-200 rounded">
          {/* Hintergrund-Bereiche */}
          <rect x="0" y={getY(range.max)} width="100%" height={getY(range.min) - getY(range.max)} fill="#fef3c7" opacity="0.3" />
          {range.optimal && (
            <rect x="0" y={getY(range.optimal.max)} width="100%" height={getY(range.optimal.min) - getY(range.optimal.max)} fill="#dcfce7" opacity="0.3" />
          )}
          
          {/* Trendlinie */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
          
          {/* Datenpunkte */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 200;
            const y = getY(point.value);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={getStatusColor(point.value)}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Achsenbeschriftungen */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{minValue}{unit}</span>
          <span>{maxValue}{unit}</span>
        </div>
      </div>
    </div>
  );
}
