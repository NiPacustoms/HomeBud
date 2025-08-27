'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTile {
  id: string;
  label: string;
  moduleId: string;
  enabled: boolean;
  value?: string | number;
  unit?: string;
  status?: 'good' | 'warning' | 'error' | 'neutral';
  icon?: string;
}

interface DashboardTilesProps {
  tiles: DashboardTile[];
  onTileToggle?: (tileId: string) => void;
  onModuleToggle?: (moduleId: string) => void;
  showQuickToggle?: boolean;
}

const moduleConfig = {
  monitoring: { name: 'Monitoring', icon: '📊', color: 'from-blue-500 to-cyan-600' },
  mycorrhiza: { name: 'Mykorrhiza', icon: '🍄', color: 'from-green-500 to-emerald-600' },
  trichoderma: { name: 'Trichoderma', icon: '🦠', color: 'from-purple-500 to-pink-600' },
  biological: { name: 'Biologische Innovationen', icon: '🧬', color: 'from-indigo-500 to-blue-600' },
  planning: { name: 'Planung', icon: '📅', color: 'from-orange-500 to-red-600' },
  training: { name: 'Training', icon: '🌱', color: 'from-lime-500 to-green-600' },
  diagnosis: { name: 'Diagnose', icon: '🔍', color: 'from-red-500 to-pink-600' },
  vpd: { name: 'VPD', icon: '🌡️', color: 'from-teal-500 to-cyan-600' },
  watering: { name: 'Bewässerung', icon: '💧', color: 'from-blue-500 to-indigo-600' },
  seeds: { name: 'Samen & Strains', icon: '🌿', color: 'from-emerald-500 to-green-600' },
  plants: { name: 'Pflanzen', icon: '🌺', color: 'from-pink-500 to-rose-600' },
  setup: { name: 'Setup', icon: '⚙️', color: 'from-gray-500 to-slate-600' }
};

export default function DashboardTiles({
  tiles,
  onTileToggle,
  onModuleToggle,
  showQuickToggle = true
}: DashboardTilesProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const getTilesByModule = (moduleId: string) => {
    return tiles.filter(tile => tile.moduleId === moduleId && tile.enabled);
  };

  const getModuleStats = (moduleId: string) => {
    const moduleTiles = tiles.filter(tile => tile.moduleId === moduleId);
    const enabledCount = moduleTiles.filter(tile => tile.enabled).length;
    return { total: moduleTiles.length, enabled: enabledCount };
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleModuleToggle = (moduleId: string) => {
    if (onModuleToggle) {
      onModuleToggle(moduleId);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📊';
    }
  };

  // Gruppiere Tiles nach Modulen
  const modules = Object.keys(moduleConfig);
  const modulesWithTiles = modules.filter(moduleId => {
    const moduleTiles = getTilesByModule(moduleId);
    return moduleTiles.length > 0;
  });

  if (modulesWithTiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Kacheln aktiv</h3>
        <p className="text-gray-600">Aktivieren Sie Kacheln in den Einstellungen, um sie hier zu sehen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modulesWithTiles.map((moduleId) => {
        const moduleTiles = getTilesByModule(moduleId);
        const stats = getModuleStats(moduleId);
        const isExpanded = expandedModules.has(moduleId);
        const allEnabled = tiles.filter(tile => tile.moduleId === moduleId).every(tile => tile.enabled);
        const moduleInfo = moduleConfig[moduleId as keyof typeof moduleConfig];

        return (
          <motion.div
            key={moduleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Module Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100">
              <button
                onClick={() => toggleModuleExpansion(moduleId)}
                className="flex items-center space-x-3 flex-1 text-left"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r ${moduleInfo.color}`}>
                  {moduleInfo.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{moduleInfo.name}</h3>
                  <p className="text-sm text-gray-600">
                    {stats.enabled} von {stats.total} Kacheln aktiv
                  </p>
                </div>
              </button>
              
              {/* Quick Toggle */}
              {showQuickToggle && (
                <button
                  onClick={() => handleModuleToggle(moduleId)}
                  className={`w-12 h-8 rounded-full transition-colors duration-300 flex items-center justify-center ${
                    allEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Alle ${moduleInfo.name} Kacheln ${allEnabled ? 'ausblenden' : 'einblenden'}`}
                >
                  <svg className={`w-4 h-4 ${allEnabled ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Module Tiles Grid */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {moduleTiles.map((tile) => (
                        <motion.div
                          key={tile.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => onTileToggle?.(tile.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{tile.icon || '📊'}</span>
                              <h4 className="font-medium text-gray-900">{tile.label}</h4>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tile.status)}`}>
                              {getStatusIcon(tile.status)}
                            </span>
                          </div>
                          
                          {tile.value !== undefined && (
                            <div className="text-2xl font-bold text-gray-900">
                              {tile.value}
                              {tile.unit && (
                                <span className="text-sm font-normal text-gray-600 ml-1">
                                  {tile.unit}
                                </span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed Tiles Preview */}
            {!isExpanded && moduleTiles.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {moduleTiles.slice(0, 4).map((tile) => (
                    <div key={tile.id} className="text-center">
                      <div className="text-lg mb-1">{tile.icon || '📊'}</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{tile.label}</div>
                      {tile.value !== undefined && (
                        <div className="text-lg font-bold text-gray-900">
                          {tile.value}
                          {tile.unit && <span className="text-xs text-gray-600">{tile.unit}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                  {moduleTiles.length > 4 && (
                    <div className="text-center">
                      <div className="text-lg mb-1">➕</div>
                      <div className="text-sm text-gray-600">
                        +{moduleTiles.length - 4} weitere
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
