'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AVAILABLE_MODULES, Module, ModuleCategory } from '@/types/modules'

interface ModuleManagerProps {
  enabledModules: string[]
  onToggleModule: (moduleId: string) => void
}

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

export default function ModuleManager({ enabledModules, onToggleModule }: ModuleManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('core')
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  const toggleModule = (moduleId: string) => {
    onToggleModule(moduleId)
  }

  const toggleExpanded = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  const getModulesForCategory = (category: ModuleCategory): Module[] => {
    return AVAILABLE_MODULES.filter(module => module.category === category)
  }

  const isModuleEnabled = (moduleId: string): boolean => {
    return enabledModules.includes(moduleId)
  }

  const canEnableModule = (module: Module): boolean => {
    if (module.isDefault) return false
    if (isModuleEnabled(module.id)) return true
    
    // Prüfe Abhängigkeiten
    return module.dependencies.every(dep => enabledModules.includes(dep))
  }

  const getMissingDependencies = (module: Module): string[] => {
    return module.dependencies.filter(dep => !enabledModules.includes(dep))
  }

  return (
    <div className="space-y-6">
      {/* Kategorie-Navigation */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(categoryNames).map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category as ModuleCategory)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === category
                ? `bg-gradient-to-r ${categoryColors[category as ModuleCategory]} text-white shadow-lg`
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {categoryNames[category as ModuleCategory]}
          </motion.button>
        ))}
      </div>

      {/* Module-Liste für ausgewählte Kategorie */}
      <div className="space-y-4">
        {getModulesForCategory(selectedCategory).map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/5 backdrop-blur-md border rounded-xl p-4 transition-all duration-300 ${
              isModuleEnabled(module.id)
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                  isModuleEnabled(module.id)
                    ? `bg-gradient-to-r ${categoryColors[module.category]}`
                    : 'bg-white/10'
                }`}>
                  {module.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">
                      {module.name}
                    </h3>
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
                  </div>
                  
                  <p className="text-white/70 mt-1">
                    {module.description}
                  </p>

                  {/* Features-Liste */}
                  {module.features && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleExpanded(module.id)}
                        className="text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        {expandedModule === module.id ? 'Features ausblenden' : 'Features anzeigen'}
                      </button>
                      
                      <AnimatePresence>
                        {expandedModule === module.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2"
                          >
                            {module.features.map((feature, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <span className="text-green-400 mt-1">•</span>
                                <span className="text-white/80">{feature}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Abhängigkeiten */}
                  {module.dependencies.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-white/50">
                        Abhängigkeiten: {module.dependencies.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Fehlende Abhängigkeiten */}
                  {!canEnableModule(module) && !module.isDefault && (
                    <div className="mt-2">
                      <p className="text-xs text-red-400">
                        Benötigt: {getMissingDependencies(module).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle-Button */}
              <div className="flex items-center space-x-3">
                {!module.isDefault && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleModule(module.id)}
                    disabled={!canEnableModule(module)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isModuleEnabled(module.id)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                        : canEnableModule(module)
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                    }`}
                  >
                    {isModuleEnabled(module.id) ? 'Deaktivieren' : 'Aktivieren'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistik */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {AVAILABLE_MODULES.length}
            </div>
            <div className="text-sm text-white/70">Module verfügbar</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {enabledModules.length}
            </div>
            <div className="text-sm text-white/70">Aktiviert</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {AVAILABLE_MODULES.filter(m => m.isDefault).length}
            </div>
            <div className="text-sm text-white/70">Standard</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              {AVAILABLE_MODULES.filter(m => m.isPremium).length}
            </div>
            <div className="text-sm text-white/70">Premium</div>
          </div>
        </div>
      </div>
    </div>
  )
}
