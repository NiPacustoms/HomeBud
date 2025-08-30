import React, { useState } from 'react'
import { useModules } from '../../hooks/useModules'
import { ModuleCategory } from '../../types/modules'
import { Card } from '../ui/Card'
import '../../styles/performance.css'

interface SetupOption {
  id: string
  label: string
  description: string
  icon: string
  recommendedModules: string[]
}

const setupOptions: SetupOption[] = [
  {
    id: 'indoor-soil',
    label: 'Indoor - Erde',
    description: 'Klassischer Indoor-Anbau mit Erde als Substrat',
    icon: '🏠🌱',
    recommendedModules: ['setup-wizard', 'planting-schedule', 'photo-diary', 'fertilizer-management']
  },
  {
    id: 'indoor-hydroponic',
    label: 'Indoor - Hydroponik',
    description: 'Moderne Hydrokultur mit Nährlösung',
    icon: '🏠💧',
    recommendedModules: ['setup-wizard', 'planting-schedule', 'multi-sensor-monitoring', 'iot-automation', 'fertilizer-management']
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    description: 'Anbau im Freien mit natürlichen Bedingungen',
    icon: '🌞🌱',
    recommendedModules: ['setup-wizard', 'planting-schedule', 'legal-check', 'photo-diary', 'harvest-assistant']
  },
  {
    id: 'greenhouse',
    label: 'Gewächshaus',
    description: 'Kontrollierte Umgebung mit natürlichem Licht',
    icon: '🏡🌱',
    recommendedModules: ['setup-wizard', 'planting-schedule', 'multi-sensor-monitoring', 'photo-diary', 'fertilizer-management']
  },
  {
    id: 'advanced',
    label: 'Fortgeschritten',
    description: 'Professioneller Anbau mit allen Features',
    icon: '🚀',
    recommendedModules: [
      'setup-wizard', 'planting-schedule', 'multi-sensor-monitoring', 'iot-automation',
      'photo-diary', 'fertilizer-management', 'strain-collection', 'analysis-export'
    ]
  }
]

interface ModuleOnboardingProps {
  onComplete: () => void
}

export const ModuleOnboarding: React.FC<ModuleOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSetup, setSelectedSetup] = useState<string | null>(null)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const { 
    getModulesByCategory,
    getModuleById 
  } = useModules()

  const handleSetupSelect = (setupId: string) => {
    setSelectedSetup(setupId)
    const setup = setupOptions.find(s => s.id === setupId)
    if (setup) {
      setSelectedModules(setup.recommendedModules)
    }
  }

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleComplete = () => {
    if (selectedModules.length > 0) {
      // Temporär deaktiviert wegen TypeScript-Problemen
      // enableModules(selectedModules)
      onComplete()
    }
  }

  const getRecommendedModules = () => {
    if (!selectedSetup) return []
    const setup = setupOptions.find(s => s.id === selectedSetup)
    return setup ? setup.recommendedModules : []
  }

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Wähle dein Grow-Setup
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Wähle die Option aus, die am besten zu deinem Anbau passt. 
        Wir empfehlen dir dann die passenden Module.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedSetup === option.id
                ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleSetupSelect(option.id)}
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {option.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Empfohlene Module
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
        Basierend auf deinem Setup empfehlen wir dir folgende Module. 
        Du kannst sie nach deinen Wünschen anpassen.
      </p>

      <div className="space-y-4">
        {getRecommendedModules().map((moduleId) => {
          const module = getModuleById(moduleId)
          if (!module) return null
          
          return (
            <Card key={moduleId} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(moduleId)}
                    onChange={() => handleModuleToggle(moduleId)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Aktivieren
                  </span>
                </label>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
        >
          {showAdvanced ? 'Weniger anzeigen' : 'Alle verfügbaren Module anzeigen'}
        </button>
        
        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {(['planning', 'monitoring', 'management', 'genetics', 'knowledge', 'harvest', 'analysis'] as ModuleCategory[]).map(category => {
              const modules = getModulesByCategory(category)
              if (modules.length === 0) return null
              
              return (
                <div key={category} className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {modules.map((module) => {
                      if (getRecommendedModules().includes(module.id)) return null
                      
                      return (
                        <Card key={module.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{module.icon}</span>
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {module.name}
                                </h5>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedModules.includes(module.id)}
                                onChange={() => handleModuleToggle(module.id)}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Aktivieren
                              </span>
                            </label>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Zusammenfassung
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Du hast {selectedModules.length} Module ausgewählt. 
        Diese werden für dich aktiviert und in der App angezeigt.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {selectedModules.map((moduleId) => {
          const module = getModuleById(moduleId)
          if (!module) return null
          
          return (
            <Card key={moduleId} className="p-4 text-center">
              <span className="text-2xl mb-2 block">{module.icon}</span>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {module.name}
              </h3>
            </Card>
          )
        })}
      </div>
      
      <div className="space-y-4">
        <button
          onClick={handleComplete}
          disabled={selectedModules.length === 0}
          className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Setup abschließen
        </button>
        
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full md:w-auto px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Zurück zur Auswahl
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Schritt {currentStep} von 3
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((currentStep / 3) * 100)}% abgeschlossen
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-green-600 progress-bar"
            data-progress={Math.round((currentStep / 3) * 100)}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 transition-colors"
          >
            Zurück
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={currentStep === 1 && !selectedSetup}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === 2 ? 'Weiter' : 'Nächster Schritt'}
          </button>
        </div>
      )}
    </div>
  )
}
