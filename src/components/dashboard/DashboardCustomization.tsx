'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_MODULES, ModuleCategory } from '@/types/modules';

interface DashboardTile {
  id: string;
  label: string;
  moduleId: string;
  enabled: boolean;
}

interface DashboardCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tiles: DashboardTile[]) => void;
  currentTiles: DashboardTile[];
}

// Mock-Daten für Dashboard-Kacheln
const mockDashboardTiles: DashboardTile[] = [
  // Monitoring Module
  { id: 'temperature', label: 'Temperatur', moduleId: 'monitoring', enabled: true },
  { id: 'humidity', label: 'Luftfeuchtigkeit', moduleId: 'monitoring', enabled: true },
  { id: 'ph', label: 'pH-Wert', moduleId: 'monitoring', enabled: true },
  { id: 'ec', label: 'EC-Wert', moduleId: 'monitoring', enabled: true },
  { id: 'co2', label: 'CO2-Gehalt', moduleId: 'monitoring', enabled: false },
  { id: 'light', label: 'Lichtintensität', moduleId: 'monitoring', enabled: false },
  
  // Mykorrhiza Module
  { id: 'mycorrhiza-status', label: 'Mykorrhiza-Status', moduleId: 'mycorrhiza', enabled: true },
  { id: 'mycorrhiza-application', label: 'Anwendungsplan', moduleId: 'mycorrhiza', enabled: true },
  { id: 'mycorrhiza-effects', label: 'Wirkungsanalyse', moduleId: 'mycorrhiza', enabled: false },
  
  // Trichoderma Module
  { id: 'trichoderma-status', label: 'Trichoderma-Status', moduleId: 'trichoderma', enabled: true },
  { id: 'trichoderma-application', label: 'Anwendungsplan', moduleId: 'trichoderma', enabled: true },
  { id: 'trichoderma-effects', label: 'Wirkungsanalyse', moduleId: 'trichoderma', enabled: false },
  
  // Biological Module
  { id: 'tissue-culture', label: 'Gewebekultur', moduleId: 'biological', enabled: false },
  { id: 'biological-controls', label: 'Biologische Kontrolle', moduleId: 'biological', enabled: false },
  
  // Planning Module
  { id: 'grow-calendar', label: 'Anbau-Kalender', moduleId: 'planning', enabled: true },
  { id: 'phase-planning', label: 'Phasen-Planung', moduleId: 'planning', enabled: true },
  { id: 'task-scheduler', label: 'Aufgaben-Planer', moduleId: 'planning', enabled: false },
  
  // Training Module
  { id: 'training-methods', label: 'Trainings-Methoden', moduleId: 'training', enabled: true },
  { id: 'training-schedule', label: 'Trainings-Plan', moduleId: 'training', enabled: false },
  { id: 'training-progress', label: 'Trainings-Fortschritt', moduleId: 'training', enabled: false },
  
  // Diagnosis Module
  { id: 'ai-diagnosis', label: 'KI-Diagnose', moduleId: 'diagnosis', enabled: true },
  { id: 'symptom-checker', label: 'Symptom-Checker', moduleId: 'diagnosis', enabled: false },
  { id: 'treatment-plans', label: 'Behandlungspläne', moduleId: 'diagnosis', enabled: false },
  
  // VPD Module
  { id: 'vpd-chart', label: 'VPD-Chart', moduleId: 'vpd', enabled: true },
  { id: 'vpd-calculator', label: 'VPD-Rechner', moduleId: 'vpd', enabled: false },
  { id: 'vpd-optimization', label: 'VPD-Optimierung', moduleId: 'vpd', enabled: false },
  
  // Watering Module
  { id: 'watering-calculator', label: 'Bewässerungs-Rechner', moduleId: 'watering', enabled: true },
  { id: 'watering-schedule', label: 'Bewässerungs-Plan', moduleId: 'watering', enabled: false },
  { id: 'watering-history', label: 'Bewässerungs-Historie', moduleId: 'watering', enabled: false },
  
  // Seeds Module
  { id: 'seed-database', label: 'Samen-Datenbank', moduleId: 'seeds', enabled: true },
  { id: 'strain-database', label: 'Strain-Datenbank', moduleId: 'seeds', enabled: true },
  { id: 'germination-tracker', label: 'Keimungs-Tracker', moduleId: 'seeds', enabled: false },
  
  // Plants Module
  { id: 'plant-list', label: 'Pflanzen-Liste', moduleId: 'plants', enabled: true },
  { id: 'plant-details', label: 'Pflanzen-Details', moduleId: 'plants', enabled: true },
  { id: 'plant-health', label: 'Pflanzen-Gesundheit', moduleId: 'plants', enabled: false },
  
  // Setup Module
  { id: 'grow-setup', label: 'Anbau-Setup', moduleId: 'setup', enabled: true },
  { id: 'automation-setup', label: 'Automatisierung', moduleId: 'setup', enabled: false },
  { id: 'parameter-calculator', label: 'Parameter-Rechner', moduleId: 'setup', enabled: false }
];

const moduleCategories = {
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

export default function DashboardCustomization({
  isOpen,
  onClose,
  onSave,
  currentTiles
}: DashboardCustomizationProps) {
  const [tiles, setTiles] = useState<DashboardTile[]>(currentTiles);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTiles(currentTiles);
  }, [currentTiles]);

  const handleTileToggle = (tileId: string) => {
    setTiles(prev => prev.map(tile => 
      tile.id === tileId ? { ...tile, enabled: !tile.enabled } : tile
    ));
  };

  const handleModuleToggle = (moduleId: string) => {
    const moduleTiles = tiles.filter(tile => tile.moduleId === moduleId);
    const allEnabled = moduleTiles.every(tile => tile.enabled);
    
    setTiles(prev => prev.map(tile => 
      tile.moduleId === moduleId ? { ...tile, enabled: !allEnabled } : tile
    ));
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

  const resetToDefault = () => {
    setTiles(prev => prev.map(tile => ({ ...tile, enabled: true })));
  };

  const handleSave = () => {
    onSave(tiles);
    onClose();
  };

  const getTilesByModule = (moduleId: string) => {
    return tiles.filter(tile => tile.moduleId === moduleId);
  };

  const getModuleStats = (moduleId: string) => {
    const moduleTiles = getTilesByModule(moduleId);
    const enabledCount = moduleTiles.filter(tile => tile.enabled).length;
    return { total: moduleTiles.length, enabled: enabledCount };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Dashboard anpassen</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Schließen"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {Object.entries(moduleCategories).map(([moduleId, moduleInfo]) => {
                  const moduleTiles = getTilesByModule(moduleId);
                  const stats = getModuleStats(moduleId);
                  const isExpanded = expandedModules.has(moduleId);
                  const allEnabled = moduleTiles.every(tile => tile.enabled);

                  if (moduleTiles.length === 0) return null;

                  return (
                    <div key={moduleId} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Module Header */}
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <button
                          onClick={() => toggleModuleExpansion(moduleId)}
                          className="flex items-center space-x-3 flex-1 text-left"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-r ${moduleInfo.color}`}>
                            {moduleInfo.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{moduleInfo.name}</h3>
                            <p className="text-sm text-gray-500">
                              {stats.enabled} von {stats.total} aktiv
                            </p>
                          </div>
                        </button>
                        
                        {/* Quick Toggle */}
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
                      </div>

                      {/* Module Tiles */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className="p-4 space-y-3">
                              {moduleTiles.map((tile) => (
                                <div key={tile.id} className="flex items-center justify-between py-2">
                                  <span className="text-gray-700 font-medium">{tile.label}</span>
                                  <button
                                    onClick={() => handleTileToggle(tile.id)}
                                    className={`relative w-12 h-8 rounded-full transition-colors duration-300 ${
                                      tile.enabled ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                    aria-label={`${tile.label} ${tile.enabled ? 'ausblenden' : 'einblenden'}`}
                                  >
                                    <motion.div
                                      className="w-6 h-6 bg-white rounded-full shadow-md"
                                      animate={{ x: tile.enabled ? 20 : 2 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              <button
                onClick={resetToDefault}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Standard wiederherstellen
              </button>
              <button
                onClick={handleSave}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Änderungen speichern
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
