'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/navigation/Sidebar'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'
import { AVAILABLE_MODULES, ModuleCategory } from '@/types/modules'
import { AnimatePresence } from 'framer-motion'
import DashboardTiles from '@/components/dashboard/DashboardTiles'
import DashboardCustomization from '@/components/dashboard/DashboardCustomization'
import DashboardCore from '@/components/dashboard/DashboardCore'

interface DashboardTile {
  id: string;
  label: string;
  moduleId: string;
  enabled: boolean;
  value?: string | number;
  unit?: string;
  status?: 'good' | 'warning' | 'error' | 'neutral';
  icon?: string;
  size: 'small' | 'medium' | 'large' | 'full-width';
  position: number;
}

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('core')
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'core'>('core')
  const [showDashboardCustomization, setShowDashboardCustomization] = useState(false)
  

  
  // Mock-Daten für Dashboard-Kacheln mit aktuellen Werten
  const [dashboardTiles, setDashboardTiles] = useState<DashboardTile[]>([
    // Monitoring Module
    { id: 'temperature', label: 'Temperatur', moduleId: 'monitoring', enabled: true, value: 24, unit: '°C', status: 'good', icon: '🌡️', size: 'medium', position: 1 },
    { id: 'humidity', label: 'Luftfeuchtigkeit', moduleId: 'monitoring', enabled: true, value: 65, unit: '%', status: 'good', icon: '💧', size: 'medium', position: 2 },
    { id: 'ph', label: 'pH-Wert', moduleId: 'monitoring', enabled: true, value: 6.2, unit: '', status: 'good', icon: '🧪', size: 'medium', position: 3 },
    { id: 'ec', label: 'EC-Wert', moduleId: 'monitoring', enabled: true, value: 1.2, unit: 'mS/cm', status: 'good', icon: '⚡', size: 'medium', position: 4 },
    { id: 'co2', label: 'CO2-Gehalt', moduleId: 'monitoring', enabled: false, value: 800, unit: 'ppm', status: 'neutral', icon: '🌬️', size: 'medium', position: 5 },
    { id: 'light', label: 'Lichtintensität', moduleId: 'monitoring', enabled: false, value: 450, unit: 'μmol/m²/s', status: 'warning', icon: '💡', size: 'medium', position: 6 },
    
    // Mykorrhiza Module
    { id: 'mycorrhiza-status', label: 'Mykorrhiza-Status', moduleId: 'mycorrhiza', enabled: true, value: 'Aktiv', status: 'good', icon: '🍄', size: 'medium', position: 7 },
    { id: 'mycorrhiza-application', label: 'Anwendungsplan', moduleId: 'mycorrhiza', enabled: true, value: 'In 3 Tagen', status: 'warning', icon: '📅', size: 'medium', position: 8 },
    { id: 'mycorrhiza-effects', label: 'Wirkungsanalyse', moduleId: 'mycorrhiza', enabled: false, value: '85%', status: 'good', icon: '📊', size: 'medium', position: 9 },
    
    // Trichoderma Module
    { id: 'trichoderma-status', label: 'Trichoderma-Status', moduleId: 'trichoderma', enabled: true, value: 'Aktiv', status: 'good', icon: '🦠', size: 'medium', position: 10 },
    { id: 'trichoderma-application', label: 'Anwendungsplan', moduleId: 'trichoderma', enabled: true, value: 'Heute', status: 'good', icon: '📅', size: 'medium', position: 11 },
    { id: 'trichoderma-effects', label: 'Wirkungsanalyse', moduleId: 'trichoderma', enabled: false, value: '92%', status: 'good', icon: '📊', size: 'medium', position: 12 },
    
    // Planning Module
    { id: 'grow-calendar', label: 'Anbau-Kalender', moduleId: 'planning', enabled: true, value: 'Tag 45', status: 'good', icon: '📅', size: 'medium', position: 13 },
    { id: 'phase-planning', label: 'Phasen-Planung', moduleId: 'planning', enabled: true, value: 'Blüte', status: 'good', icon: '🌱', size: 'medium', position: 14 },
    { id: 'task-scheduler', label: 'Aufgaben-Planer', moduleId: 'planning', enabled: false, value: '2 offen', status: 'warning', icon: '✅', size: 'medium', position: 15 },
    
    // Training Module
    { id: 'training-methods', label: 'Trainings-Methoden', moduleId: 'training', enabled: true, value: 'LST', status: 'good', icon: '🌿', size: 'medium', position: 16 },
    { id: 'training-schedule', label: 'Trainings-Plan', moduleId: 'training', enabled: false, value: 'Nächste Woche', status: 'neutral', icon: '📋', size: 'medium', position: 17 },
    { id: 'training-progress', label: 'Trainings-Fortschritt', moduleId: 'training', enabled: false, value: '75%', status: 'good', icon: '📈', size: 'medium', position: 18 },
    
    // Diagnosis Module
    { id: 'ai-diagnosis', label: 'KI-Diagnose', moduleId: 'diagnosis', enabled: true, value: 'Gesund', status: 'good', icon: '🤖', size: 'medium', position: 19 },
    { id: 'symptom-checker', label: 'Symptom-Checker', moduleId: 'diagnosis', enabled: false, value: 'Keine', status: 'good', icon: '🔍', size: 'medium', position: 20 },
    { id: 'treatment-plans', label: 'Behandlungspläne', moduleId: 'diagnosis', enabled: false, value: '0 aktiv', status: 'neutral', icon: '💊', size: 'medium', position: 21 },
    
    // VPD Module
    { id: 'vpd-chart', label: 'VPD-Chart', moduleId: 'vpd', enabled: true, value: 1.2, unit: 'kPa', status: 'good', icon: '📊', size: 'medium', position: 22 },
    { id: 'vpd-calculator', label: 'VPD-Rechner', moduleId: 'vpd', enabled: false, value: 'Bereit', status: 'neutral', icon: '🧮', size: 'medium', position: 23 },
    { id: 'vpd-optimization', label: 'VPD-Optimierung', moduleId: 'vpd', enabled: false, value: 'Optimal', status: 'good', icon: '⚙️', size: 'medium', position: 24 },
    
    // Watering Module
    { id: 'watering-calculator', label: 'Bewässerungs-Rechner', moduleId: 'watering', enabled: true, value: '2.5L', status: 'good', icon: '💧', size: 'medium', position: 25 },
    { id: 'watering-schedule', label: 'Bewässerungs-Plan', moduleId: 'watering', enabled: false, value: 'Morgen', status: 'warning', icon: '📅', size: 'medium', position: 26 },
    { id: 'watering-history', label: 'Bewässerungs-Historie', moduleId: 'watering', enabled: false, value: '7 Tage', status: 'neutral', icon: '📊', size: 'medium', position: 27 },
    
    // Seeds Module
    { id: 'seed-database', label: 'Samen-Datenbank', moduleId: 'seeds', enabled: true, value: '156', status: 'good', icon: '🌱', size: 'medium', position: 28 },
    { id: 'strain-database', label: 'Strain-Datenbank', moduleId: 'seeds', enabled: true, value: '89', status: 'good', icon: '🌿', size: 'medium', position: 29 },
    { id: 'germination-tracker', label: 'Keimungs-Tracker', moduleId: 'seeds', enabled: false, value: '0 aktiv', status: 'neutral', icon: '🌱', size: 'medium', position: 30 },
    
    // Plants Module
    { id: 'plant-list', label: 'Pflanzen-Liste', moduleId: 'plants', enabled: true, value: '12', status: 'good', icon: '🌺', size: 'medium', position: 31 },
    { id: 'plant-details', label: 'Pflanzen-Details', moduleId: 'plants', enabled: true, value: '3 aktiv', status: 'good', icon: '📋', size: 'medium', position: 32 },
    { id: 'plant-health', label: 'Pflanzen-Gesundheit', moduleId: 'plants', enabled: false, value: '95%', status: 'good', icon: '❤️', size: 'medium', position: 33 },
    
    // Setup Module
    { id: 'grow-setup', label: 'Anbau-Setup', moduleId: 'setup', enabled: true, value: 'Konfiguriert', status: 'good', icon: '⚙️', size: 'medium', position: 34 },
    { id: 'automation-setup', label: 'Automatisierung', moduleId: 'setup', enabled: false, value: 'Inaktiv', status: 'neutral', icon: '🤖', size: 'medium', position: 35 },
    { id: 'parameter-calculator', label: 'Parameter-Rechner', moduleId: 'setup', enabled: false, value: 'Bereit', status: 'neutral', icon: '🧮', size: 'medium', position: 36 }
  ]);

  const categoryColors: Record<ModuleCategory, string> = {
    core: 'from-blue-500 to-cyan-600',
    planning: 'from-green-500 to-emerald-600',
    monitoring: 'from-purple-500 to-violet-600',
    management: 'from-orange-500 to-red-600',
    genetics: 'from-pink-500 to-rose-600',
    knowledge: 'from-indigo-500 to-blue-600',
    harvest: 'from-yellow-500 to-orange-600',
    analysis: 'from-teal-500 to-cyan-600',
    premium: 'from-amber-500 to-yellow-600',
    scientific: 'from-emerald-500 to-green-600',
    automation: 'from-slate-500 to-gray-600',
    training: 'from-lime-500 to-green-600',
    biological: 'from-fuchsia-500 to-pink-600',
    compliance: 'from-red-500 to-pink-600'
  }

  const categoryNames: Record<ModuleCategory, string> = {
    core: 'Kern-Module',
    planning: 'Planung',
    monitoring: 'Monitoring',
    management: 'Management',
    genetics: 'Genetik',
    knowledge: 'Wissen',
    harvest: 'Ernte',
    analysis: 'Analyse',
    premium: 'Premium',
    scientific: 'Wissenschaftliches Monitoring',
    automation: 'Automatisierung & IoT',
    training: 'Trainings-Assistent',
    biological: 'Biologische Innovationen',
    compliance: 'Legal & Compliance'
  }



  const getModulesForCategory = (category: ModuleCategory) => {
    return AVAILABLE_MODULES.filter(module => module.category === category)
  }

  // Featured Modules für die Übersicht
  const finalFeaturedModules = [
    {
      id: 'ai-diagnosis',
      name: 'KI-Diagnose',
      description: 'Automatische Pflanzenanalyse mit KI',
      icon: '🤖',
      status: 'available',
      category: 'diagnosis' as ModuleCategory,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'vpd-optimization',
      name: 'VPD-Optimierung',
      description: 'Wissenschaftliche VPD-Berechnung',
      icon: '🌡️',
      status: 'available',
      category: 'monitoring' as ModuleCategory,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'mycorrhiza',
      name: 'Mykorrhiza-Manager',
      description: 'Biologische Nährstoffoptimierung',
      icon: '🍄',
      status: 'available',
      category: 'biological' as ModuleCategory,
      color: 'from-green-500 to-emerald-600'
    }
  ]

  const handleTileToggle = (tileId: string) => {
    setDashboardTiles((prev: DashboardTile[]) => prev.map((tile: DashboardTile) => 
      tile.id === tileId ? { ...tile, enabled: !tile.enabled } : tile
    ));
  };

  const handleModuleToggle = (moduleId: string) => {
    const moduleTiles = dashboardTiles.filter((tile: DashboardTile) => tile.moduleId === moduleId);
    const allEnabled = moduleTiles.every((tile: DashboardTile) => tile.enabled);
    
    setDashboardTiles((prev: DashboardTile[]) => prev.map((tile: DashboardTile) => 
      tile.moduleId === moduleId ? { ...tile, enabled: !allEnabled } : tile
    ));
  };

  const handleDashboardCustomizationSave = (tiles: DashboardTile[]) => {
    setDashboardTiles((prev: DashboardTile[]) => prev.map((tile: DashboardTile) => {
      const updatedTile = tiles.find((t: DashboardTile) => t.id === tile.id);
      return updatedTile ? { ...tile, enabled: updatedTile.enabled } : tile;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-0 lg:pl-64 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                HomeBud Dashboard
              </h1>
              <p className="text-white/70 text-lg">
                Optimierte Cannabis-Growing App basierend auf wissenschaftlichen Erkenntnissen
              </p>
            </div>
            

          </div>
        </motion.div>



        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
            {[
              { id: 'core', name: 'Kernansicht', icon: '🎯' },
              { id: 'overview', name: 'Übersicht', icon: '📊' },
              { id: 'modules', name: 'Module', icon: '🧩' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'core' && (
            <motion.div
              key="core"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardCore
                growProject={{
                  id: 'project-1',
                  strainName: 'Northern Lights Auto',
                  phase: 'flowering',
                  phaseProgress: 65,
                  startDate: new Date('2024-01-15'),
                  estimatedHarvest: new Date('2024-03-15'),
                  plantCount: 4
                }}
                monitoringValues={[
                  {
                    id: 'temperature',
                    label: 'Temperatur',
                    value: 24.5,
                    unit: '°C',
                    target: { min: 20, max: 28, optimal: { min: 22, max: 26 } },
                    status: 'good',
                    icon: '🌡️',
                    lastUpdated: new Date()
                  },
                  {
                    id: 'humidity',
                    label: 'Luftfeuchtigkeit',
                    value: 58,
                    unit: '%',
                    target: { min: 40, max: 70, optimal: { min: 50, max: 65 } },
                    status: 'good',
                    icon: '💧',
                    lastUpdated: new Date()
                  },
                  {
                    id: 'ppfd',
                    label: 'PPFD',
                    value: 650,
                    unit: 'μmol/m²/s',
                    target: { min: 400, max: 1000, optimal: { min: 600, max: 800 } },
                    status: 'good',
                    icon: '💡',
                    lastUpdated: new Date()
                  },
                  {
                    id: 'vpd',
                    label: 'VPD',
                    value: 1.2,
                    unit: 'kPa',
                    target: { min: 0.8, max: 1.6, optimal: { min: 1.0, max: 1.4 } },
                    status: 'good',
                    icon: '🌡️',
                    lastUpdated: new Date()
                  },
                  {
                    id: 'ph',
                    label: 'pH-Wert',
                    value: 6.1,
                    unit: '',
                    target: { min: 5.5, max: 6.5, optimal: { min: 5.8, max: 6.2 } },
                    status: 'good',
                    icon: '🧪',
                    lastUpdated: new Date()
                  },
                  {
                    id: 'co2',
                    label: 'CO₂',
                    value: 850,
                    unit: 'ppm',
                    target: { min: 400, max: 1200, optimal: { min: 800, max: 1000 } },
                    status: 'good',
                    icon: '🌬️',
                    lastUpdated: new Date()
                  }
                ]}
                todoItems={[
                  {
                    id: 'todo-1',
                    title: 'pH-Wert messen',
                    description: 'Tägliche pH-Kontrolle der Nährlösung',
                    dueDate: new Date(),
                    priority: 'high',
                    category: 'monitoring',
                    completed: false
                  },
                  {
                    id: 'todo-2',
                    title: 'Mykorrhiza-Dosierung',
                    description: 'Wöchentliche Mykorrhiza-Anwendung',
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    priority: 'medium',
                    category: 'biological',
                    completed: false
                  },
                  {
                    id: 'todo-3',
                    title: 'Tissue Culture Subkultur',
                    description: 'Klone in neue Petrischalen übertragen',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    priority: 'critical',
                    category: 'tissue-culture',
                    completed: false
                  }
                ]}
                kiRecommendations={[
                  {
                    id: 'rec-1',
                    message: 'Erhöhe PPFD um 10%',
                    action: 'Lichtintensität von 650 auf 715 μmol/m²/s erhöhen',
                    priority: 'medium',
                    category: 'lighting'
                  },
                  {
                    id: 'rec-2',
                    message: 'pH leicht senken',
                    action: 'pH-Wert von 6.1 auf 5.9 reduzieren für optimale Nährstoffaufnahme',
                    priority: 'high',
                    category: 'nutrients'
                  }
                ]}
                performanceData={{
                  yieldForecast: 85,
                  growthRate: 2.3,
                  height: 45,
                  lightDistribution: [
                    [85, 90, 95, 100, 95, 90, 85, 80],
                    [80, 85, 90, 95, 90, 85, 80, 75],
                    [75, 80, 85, 90, 85, 80, 75, 70],
                    [70, 75, 80, 85, 80, 75, 70, 65],
                    [65, 70, 75, 80, 75, 70, 65, 60],
                    [60, 65, 70, 75, 70, 65, 60, 55],
                    [55, 60, 65, 70, 65, 60, 55, 50],
                    [50, 55, 60, 65, 60, 55, 50, 45]
                  ]
                }}
                photos={[
                  {
                    id: 'photo-1',
                    url: '/mock-photo-1.jpg',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    note: 'Tag 45 - Blüte beginnt'
                  },
                  {
                    id: 'photo-2',
                    url: '/mock-photo-2.jpg',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    note: 'Tag 42 - Trichome sichtbar'
                  },
                  {
                    id: 'photo-3',
                    url: '/mock-photo-3.jpg',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    note: 'Tag 40 - Wachstum stabil'
                  }
                ]}
              />
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard Tiles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">📊 Dashboard-Kacheln</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDashboardCustomization(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Anpassen
                  </motion.button>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                  <DashboardTiles
                    tiles={dashboardTiles}
                    onTileToggle={handleTileToggle}
                    onModuleToggle={handleModuleToggle}
                    showQuickToggle={true}
                  />
                </div>
              </motion.div>

              {/* Featured Modules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-white mb-6">🚀 Empfohlene Module</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {finalFeaturedModules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 relative ${
                        module.status === 'coming-soon' ? 'overflow-hidden' : ''
                      }`}
                    >
                      {/* Coming Soon Overlay */}
                      {module.status === 'coming-soon' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl mb-2">🚧</div>
                            <div className="text-amber-400 font-bold text-lg">Coming Soon</div>
                          </div>
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 bg-gradient-to-r ${categoryColors[module.category]}`}>
                        {module.icon}
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                        {module.status === 'coming-soon' && (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm mb-4">{module.description}</p>

                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">📊 App-Statistiken</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {AVAILABLE_MODULES.length}
                    </div>
                    <div className="text-white/70">Module verfügbar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {AVAILABLE_MODULES.filter(m => m.isDefault).length}
                    </div>
                    <div className="text-white/70">Standard-Module</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      {AVAILABLE_MODULES.filter(m => m.isPremium).length}
                    </div>
                    <div className="text-white/70">Premium-Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {Object.keys(categoryNames).length}
                    </div>
                    <div className="text-white/70">Kategorien</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">📦 Module nach Kategorien</h2>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(categoryNames).map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category as ModuleCategory)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? `bg-gradient-to-r ${categoryColors[category as ModuleCategory]} text-white shadow-lg`
                          : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {categoryNames[category as ModuleCategory]}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Modules for Selected Category */}
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {getModulesForCategory(selectedCategory).map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl bg-gradient-to-r ${categoryColors[module.category]}`}>
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                          {module.isDefault && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              Standard
                            </span>
                          )}
                          {module.isPremium && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                          {module.status === 'coming-soon' && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 mb-4">{module.description}</p>
                        

                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dashboard Customization Overlay */}
      <DashboardCustomization
        isOpen={showDashboardCustomization}
        onClose={() => setShowDashboardCustomization(false)}
        onSave={handleDashboardCustomizationSave}
        currentTiles={dashboardTiles}
      />
    </div>
  )
}
