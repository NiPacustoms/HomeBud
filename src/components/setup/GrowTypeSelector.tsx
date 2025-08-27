import React from 'react'
import { motion } from 'framer-motion'

export interface GrowTypeOption {
  id: 'indoor' | 'outdoor' | 'greenhouse'
  label: string
  description: string
  icon: string
  advantages: string[]
  considerations: string[]
  recommendedModules: string[]
}

export const growTypeOptions: GrowTypeOption[] = [
  { 
    id: 'indoor', 
    label: 'Indoor', 
    description: 'Künstliche Beleuchtung und vollständige Kontrolle über alle Parameter', 
    icon: '🏠',
    advantages: ['Vollständige Kontrolle', 'Ganzjähriger Anbau', 'Diskretion', 'Optimale Bedingungen'],
    considerations: ['Höhere Kosten', 'Technische Ausrüstung', 'Energieverbrauch'],
    recommendedModules: ['setup-wizard', 'multi-sensor-monitoring', 'iot-automation', 'fertilizer-management']
  },
  { 
    id: 'outdoor', 
    label: 'Outdoor', 
    description: 'Natürliche Sonne und Luftzirkulation im Freien', 
    icon: '🌳',
    advantages: ['Niedrige Kosten', 'Natürliches Licht', 'Keine Energieversorgung', 'Größere Pflanzen'],
    considerations: ['Wetterabhängig', 'Saisonal begrenzt', 'Schädlingsrisiko', 'Sichtbarkeit'],
    recommendedModules: ['setup-wizard', 'legal-check', 'photo-diary', 'harvest-assistant']
  },
  { 
    id: 'greenhouse', 
    label: 'Gewächshaus', 
    description: 'Kontrollierte Umgebung mit natürlichem Licht', 
    icon: '🏡',
    advantages: ['Natürliches Licht', 'Wettergeschützt', 'Erweiterte Saison', 'Kontrollierte Bedingungen'],
    considerations: ['Mittlere Kosten', 'Platzbedarf', 'Temperaturkontrolle nötig'],
    recommendedModules: ['setup-wizard', 'multi-sensor-monitoring', 'photo-diary', 'fertilizer-management']
  }
]

interface GrowTypeSelectorProps {
  selectedType: 'indoor' | 'outdoor' | 'greenhouse'
  onTypeChange: (type: 'indoor' | 'outdoor' | 'greenhouse') => void
  showDetails?: boolean
  className?: string
}

export const GrowTypeSelector: React.FC<GrowTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  showDetails = true,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showDetails && (
        <>
          <h3 className="text-2xl font-bold text-white mb-4">Wähle deine Anbau-Art</h3>
          <p className="text-white/60 mb-6">
            Jede Methode hat ihre Vor- und Nachteile. Wähle die Option, die am besten zu deiner Situation passt.
          </p>
        </>
      )}
      
      <div className="grid gap-6">
        {growTypeOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeChange(option.id)}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedType === option.id
                ? 'border-green-500 bg-green-500/10'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{option.icon}</span>
              <div className="text-left flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">{option.label}</h4>
                <p className="text-white/60 mb-4">{option.description}</p>
                
                {showDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-green-400 font-medium mb-2">✅ Vorteile</h5>
                      <ul className="text-sm text-white/70 space-y-1">
                        {option.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-orange-400 font-medium mb-2">⚠️ Zu beachten</h5>
                      <ul className="text-sm text-white/70 space-y-1">
                        {option.considerations.map((consideration, index) => (
                          <li key={index}>• {consideration}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default GrowTypeSelector
