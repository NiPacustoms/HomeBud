import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface MeasurementTipsProps {
  className?: string
}

export const MeasurementTips: React.FC<MeasurementTipsProps> = ({
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const tips = [
    {
      category: '🌡️ Temperatur',
      tips: [
        'Verwende ein digitales Thermometer für genaue Messungen',
        'Messe in Pflanzenhöhe, nicht am Boden',
        'Vermeide direkte Sonneneinstrahlung auf das Thermometer',
        'Messe zur gleichen Tageszeit für konsistente Werte'
      ]
    },
    {
      category: '💧 Luftfeuchtigkeit',
      tips: [
        'Hygrometer sind günstig und genau',
        'Platziere das Hygrometer in Pflanzenhöhe',
        'Vermeide Messungen direkt nach dem Gießen',
        'Kontrolliere auch die Luftfeuchtigkeit außerhalb des Zeltes'
      ]
    },
    {
      category: '☀️ Lichtstärke',
      tips: [
        'Lux-Meter sind eine günstige Alternative zu PAR-Metern',
        'Messe in verschiedenen Bereichen deines Grows',
        'Berücksichtige die Entfernung zur Lichtquelle',
        'Messe zur Hauptlichtzeit für repräsentative Werte'
      ]
    },
    {
      category: '🧪 pH-Wert',
      tips: [
        'pH-Streifen sind günstig und einfach zu verwenden',
        'Messe sowohl Gießwasser als auch Ablaufwasser',
        'Kalibriere pH-Meter regelmäßig',
        'Messe vor und nach der Düngung'
      ]
    },
    {
      category: '⚡ EC-Wert',
      tips: [
        'EC-Meter sind wichtig für Hydrokultur',
        'Messe das Gießwasser vor der Düngung',
        'Kontrolliere auch das Ablaufwasser',
        'Führe ein Protokoll über EC-Änderungen'
      ]
    },
    {
      category: '🌿 CO₂',
      tips: [
        'CO₂-Meter sind optional für Indoor-Growing',
        'Messe in verschiedenen Höhen',
        'Berücksichtige die Raumgröße',
        'CO₂ ist besonders wichtig in der Blütephase'
      ]
    }
  ]

  const generalTips = [
    '📅 Messe täglich zur gleichen Zeit für konsistente Daten',
    '📝 Führe ein Notizbuch für zusätzliche Beobachtungen',
    '📱 Nutze die App für systematische Dokumentation',
    '🔍 Beobachte deine Pflanzen auf Anzeichen von Stress',
    '⚖️ Vergleiche deine Werte mit den empfohlenen Bereichen',
    '🔄 Passe deine Bedingungen schrittweise an'
  ]

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              💡 Mess-Tipps
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              So erhältst du genaue Werte mit deinen Messgeräten
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isExpanded ? 'Weniger anzeigen' : 'Tipps anzeigen'}
          </motion.button>
        </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</span>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Manuelle Dateneingabe
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Trage deine Messwerte manuell ein. Die regelmäßige Eingabe hilft dir dabei, 
                    deine Pflanzenentwicklung optimal zu verfolgen.
                  </p>
                </div>
              </div>
            </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4">
            {/* Allgemeine Tipps */}
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                📋 Allgemeine Empfehlungen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generalTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
                    <span className="text-neutral-400 text-sm">•</span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spezifische Tipps nach Kategorien */}
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                🔬 Spezifische Mess-Tipps
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tips.map((category, index) => (
                  <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
                    <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      {category.category}
                    </h5>
                    <ul className="space-y-1">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start space-x-2">
                          <span className="text-neutral-400 text-xs mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Empfohlene Messgeräte */}
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                🛒 Empfohlene Messgeräte
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-medium text-green-800 dark:text-green-200 mb-1">Grundausstattung</div>
                  <ul className="text-green-700 dark:text-green-300 space-y-1">
                    <li>• Digitales Thermometer (€10-20)</li>
                    <li>• Hygrometer (€5-15)</li>
                    <li>• pH-Streifen (€5-10)</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">Erweiterte Ausstattung</div>
                  <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• pH-Meter (€20-50)</li>
                    <li>• EC-Meter (€30-80)</li>
                    <li>• Lux-Meter (€20-40)</li>
                  </ul>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-medium text-purple-800 dark:text-purple-200 mb-1">Optional</div>
                  <ul className="text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• CO₂-Meter (€50-150)</li>
                    <li>• PAR-Meter (€100-300)</li>
                    <li>• Bodenfeuchte-Sensor (€20-50)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Konsistenz ist der Schlüssel zum Erfolg
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Regelmäßige manuelle Eingabe hilft dir dabei, deine Pflanzenentwicklung optimal zu verfolgen 
                  und deine Pflanzen besser kennen zu lernen!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  )
}

export default MeasurementTips
