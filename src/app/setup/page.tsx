'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import ParameterCalculator from '@/components/setup/ParameterCalculator'
import AutomationWizard from '@/components/setup/AutomationWizard'
import TrainingAssistant from '@/components/setup/TrainingAssistant'
import GrowTypeSelector from '@/components/setup/GrowTypeSelector'

interface SetupData {
  experience: 'beginner' | 'intermediate' | 'expert'
  growType: 'indoor' | 'outdoor' | 'greenhouse'
  timeBudget: '5min' | '30min' | '60min+'
  space: {
    width: number
    depth: number
    height: number
  }
  budget: 'low' | 'mid' | 'premium'
  goals: string[]
  strain: string
  equipment: {
    tent: string
    lighting: string
    ventilation: string
    nutrients: string
  }
  parameters: {
    ppfd: number
    vpd: number
    ph: number
    ec: number
    co2: number
    temperature: number
    humidity: number
  }
}

const setupSteps = [
  {
    id: 'experience',
    title: 'Erfahrungslevel',
    description: 'Wie erfahren bist du im Cannabis-Growing?'
  },
  {
    id: 'growType',
    title: 'Anbau-Art',
    description: 'Wähle zwischen Indoor, Outdoor oder Gewächshaus'
  },
  {
    id: 'time',
    title: 'Zeitbudget',
    description: 'Wie viel Zeit kannst du täglich investieren?'
  },
  {
    id: 'space',
    title: 'Platzanalyse',
    description: 'Gib die Maße deines Grow-Raums ein'
  },
  {
    id: 'budget',
    title: 'Budget',
    description: 'Was ist dein Budget für das Setup?'
  },
  {
    id: 'goals',
    title: 'Ziele',
    description: 'Was ist dir am wichtigsten?'
  },
  {
    id: 'strain',
    title: 'Sorte',
    description: 'Welche Sorte möchtest du anbauen?'
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Dein personalisiertes Setup'
  },
  {
    id: 'parameters',
    title: 'Parameter',
    description: 'Wissenschaftliche Einstellungen'
  },
  {
    id: 'automation',
    title: 'Automatisierung',
    description: 'IoT-Integration & Regelbasierte Systeme'
  },
  {
    id: 'training',
    title: 'Training',
    description: 'LST, SCROG & Topping-Plan'
  },
  {
    id: 'biology',
    title: 'Biologie',
    description: 'Mykorrhiza & Wurzeloptimierung'
  },
  {
    id: 'safety',
    title: 'Sicherheit',
    description: 'Risiko-Prävention & Checks'
  },
  {
    id: 'installation',
    title: 'Installation',
    description: 'Schritt-für-Schritt Aufbau'
  },
  {
    id: 'shopping',
    title: 'Einkauf',
    description: 'Budget-Optimierung & Shop-Vergleich'
  },
  {
    id: 'summary',
    title: 'Zusammenfassung',
    description: 'Dein komplettes Setup'
  }
]

const experienceOptions = [
  { id: 'beginner', label: 'Anfänger', description: 'Erste Grow-Versuche', icon: '🌱' },
  { id: 'intermediate', label: 'Fortgeschritten', description: 'Bereits einige Ernten', icon: '🌿' },
  { id: 'expert', label: 'Profi', description: 'Jahrelange Erfahrung', icon: '🌳' }
]

const timeOptions = [
  { id: '5min', label: '5 Minuten', description: 'Minimaler Aufwand', icon: '⚡' },
  { id: '30min', label: '30 Minuten', description: 'Moderate Pflege', icon: '⏰' },
  { id: '60min+', label: '60+ Minuten', description: 'Intensive Betreuung', icon: '🔬' }
]

const budgetOptions = [
  { id: 'low', label: 'Low-Cost', description: '€200-500', icon: '💰' },
  { id: 'mid', label: 'Mid-Range', description: '€500-1500', icon: '💎' },
  { id: 'premium', label: 'Premium', description: '€1500+', icon: '👑' }
]

const goalOptions = [
  { id: 'yield', label: 'Maximaler Ertrag', icon: '📈' },
  { id: 'quality', label: 'Höchste Qualität', icon: '⭐' },
  { id: 'discretion', label: 'Diskretion', icon: '🤫' },
  { id: 'sustainability', label: 'Nachhaltigkeit', icon: '🌍' },
  { id: 'speed', label: 'Schnelle Ernte', icon: '🏃' },
  { id: 'learning', label: 'Lernen & Experimentieren', icon: '��' }
]

const strainOptions = [
  { id: 'indica', label: 'Indica', description: 'Entspannend, kompakt', icon: '🌙' },
  { id: 'sativa', label: 'Sativa', description: 'Energisch, hochwachsend', icon: '☀️' },
  { id: 'hybrid', label: 'Hybrid', description: 'Ausgewogen', icon: '⚖️' },
  { id: 'autoflower', label: 'Autoflower', description: 'Einfach, schnell', icon: '🔄' }
]



export default function SetupAssistant() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState<SetupData>({
    experience: 'beginner',
    growType: 'indoor',
    timeBudget: '30min',
    space: { width: 100, depth: 100, height: 200 },
    budget: 'mid',
    goals: [],
    strain: 'hybrid',
    equipment: {
      tent: '',
      lighting: '',
      ventilation: '',
      nutrients: ''
    },
    parameters: {
      ppfd: 400,
      vpd: 1.0,
      ph: 6.0,
      ec: 1.2,
      co2: 800,
      temperature: 25,
      humidity: 60
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateSetupData = (key: keyof SetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [key]: value }))
  }

  const updateGoals = (goalId: string) => {
    setSetupData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const calculateEquipment = () => {
    const { experience, growType, space, budget, goals, strain } = setupData
    const area = space.width * space.depth / 10000 // m²
    
    // Equipment basierend auf Grow-Type
    if (growType === 'outdoor') {
      return {
        tent: 'Nicht benötigt (Outdoor)',
        lighting: 'Natürliches Sonnenlicht',
        ventilation: 'Natürliche Luftzirkulation',
        nutrients: budget === 'premium' ? 'Premium Bio-Dünger' : 'Standard Bio-Dünger'
      }
    }
    
    if (growType === 'greenhouse') {
      return {
        tent: 'Gewächshaus vorhanden',
        lighting: area > 2 ? 'Zusätzliche LED-Beleuchtung' : 'Nur natürliches Licht',
        ventilation: 'Gewächshaus-Lüftung + optionaler Ventilator',
        nutrients: budget === 'premium' ? 'Premium 3-Phasen' : 'Standard 2-Phasen'
      }
    }
    
    // Indoor-Anbau (Standard)
    // Tent-Empfehlung
    let tentSize = '60x60x160'
    if (area > 1) tentSize = '80x80x160'
    if (area > 1.5) tentSize = '100x100x200'
    if (area > 2) tentSize = '120x120x200'
    
    // LED-Empfehlung basierend auf PPFD
    const targetPPFD = goals.includes('yield') ? 800 : 600
    const ledWattage = Math.round(area * targetPPFD / 2.5)
    
    // Ventilation basierend auf Raumgröße
    const airVolume = Math.round(area * space.height * 0.3) // m³/h
    
    return {
      tent: `${tentSize}cm Zelt`,
      lighting: `${ledWattage}W LED`,
      ventilation: `${airVolume}m³/h Abluft`,
      nutrients: budget === 'premium' ? 'Premium 3-Phasen' : 'Standard 2-Phasen'
    }
  }

  const renderStep = () => {
    const step = setupSteps[currentStep]
    
    switch (step.id) {
      case 'experience':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Wähle dein Erfahrungslevel</h3>
            <div className="grid gap-4">
              {experienceOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetupData('experience', option.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    setupData.experience === option.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-white">{option.label}</h4>
                      <p className="text-white/60">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'growType':
        return (
          <GrowTypeSelector
            selectedType={setupData.growType}
            onTypeChange={(type) => updateSetupData('growType', type)}
          />
        )

      case 'time':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Tägliches Zeitbudget</h3>
            <div className="grid gap-4">
              {timeOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetupData('timeBudget', option.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    setupData.timeBudget === option.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-white">{option.label}</h4>
                      <p className="text-white/60">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'space':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Raummaße (in cm)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'width', label: 'Breite', icon: '↔️' },
                { key: 'depth', label: 'Tiefe', icon: '↕️' },
                { key: 'height', label: 'Höhe', icon: '↕️' }
              ].map((dimension) => (
                <div key={dimension.key} className="space-y-2">
                  <label className="flex items-center space-x-2 text-white">
                    <span className="text-xl">{dimension.icon}</span>
                    <span>{dimension.label}</span>
                  </label>
                  <input
                    type="number"
                    value={setupData.space[dimension.key as keyof typeof setupData.space]}
                    onChange={(e) => updateSetupData('space', {
                      ...setupData.space,
                      [dimension.key]: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-green-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-white/80">
                Fläche: {(setupData.space.width * setupData.space.depth / 10000).toFixed(2)} m²
              </p>
            </div>
          </div>
        )

      case 'budget':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Budget-Kategorie</h3>
            <div className="grid gap-4">
              {budgetOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetupData('budget', option.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    setupData.budget === option.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-white">{option.label}</h4>
                      <p className="text-white/60">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'goals':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Wähle deine Ziele (Mehrfachauswahl möglich)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateGoals(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    setupData.goals.includes(goal.id)
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-white font-medium">{goal.label}</span>
                    {setupData.goals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'strain':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Cannabis-Sorte</h3>
            <div className="grid gap-4">
              {strainOptions.map((strain) => (
                <motion.button
                  key={strain.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetupData('strain', strain.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    setupData.strain === strain.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{strain.icon}</span>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-white">{strain.label}</h4>
                      <p className="text-white/60">{strain.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'equipment':
        const equipment = calculateEquipment()
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Dein personalisiertes Equipment</h3>
            <div className="grid gap-4">
              {Object.entries(equipment).map(([key, value]) => (
                <div key={key} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white capitalize mb-2">
                    {key === 'tent' ? 'Zelt' : key === 'lighting' ? 'Beleuchtung' : key === 'ventilation' ? 'Belüftung' : 'Nährstoffe'}
                  </h4>
                  <p className="text-green-400 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'parameters':
        return (
          <ParameterCalculator 
            parameters={setupData.parameters}
            onUpdate={(newParams) => updateSetupData('parameters', newParams)}
          />
        )

      case 'automation':
        return (
          <AutomationWizard 
            onUpdate={(automation) => console.log('Automation updated:', automation)}
          />
        )

      case 'training':
        return (
          <TrainingAssistant 
            onUpdate={(training) => console.log('Training updated:', training)}
          />
        )

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
            <p className="text-white/60">Dieser Schritt wird noch implementiert...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-white/60 mb-4">
            <span>Schritt {currentStep + 1} von {setupSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / setupSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / setupSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              currentStep === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
                            <ChevronLeft className="w-5 h-5" />
            <span>Zurück</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentStep === setupSteps.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              currentStep === setupSteps.length - 1
                ? 'bg-green-500 text-white'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <span>{currentStep === setupSteps.length - 1 ? 'Fertigstellen' : 'Weiter'}</span>
                            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
