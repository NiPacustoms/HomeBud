'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CannabisWateringService, WateringCalculation, EnvironmentalFactors } from '@/services/cannabisWateringService'
import { PlantStage, PotSize, Season, TemperatureLevel, HumidityLevel } from '@/types/plant'
import Card from '@/components/ui/Card'
import ValidatedResearchInfo from './ValidatedResearchInfo'

interface CannabisWateringCalculatorProps {
  currentStage?: PlantStage
  currentPotSize?: PotSize
  onCalculationUpdate?: (calculation: WateringCalculation) => void
}

export default function CannabisWateringCalculator({
  currentStage = 'vegetative',
  currentPotSize = 'medium',
  onCalculationUpdate
}: CannabisWateringCalculatorProps) {
  const [stage, setStage] = useState<PlantStage>(currentStage)
  const [potSize, setPotSize] = useState<PotSize>(currentPotSize)
  const [environmentalFactors, setEnvironmentalFactors] = useState<EnvironmentalFactors>({
    season: 'summer',
    temperature: 'moderate',
    humidity: 'moderate'
  })
  const [calculation, setCalculation] = useState<WateringCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResearchInfo, setShowResearchInfo] = useState(false)

  const potSizes = CannabisWateringService.getPotSizes()
  const cannabisStages = CannabisWateringService.getCannabisStages()

  useEffect(() => {
    calculateWatering()
  }, [stage, potSize, environmentalFactors])

  const calculateWatering = () => {
    setIsCalculating(true)
    try {
      const result = CannabisWateringService.calculateWatering(stage, potSize, environmentalFactors)
      setCalculation(result)
      onCalculationUpdate?.(result)
    } catch (error) {
      console.error('Fehler bei der Bewässerungsberechnung:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleEnvironmentalChange = (factor: keyof EnvironmentalFactors, value: any) => {
    setEnvironmentalFactors(prev => ({
      ...prev,
      [factor]: value
    }))
  }

  const getStageIcon = (stageKey: string) => {
    const icons: Record<string, string> = {
      seedling: '🌱',
      vegetative: '🌿',
      flowering: '🌸',
      late_flowering: '🌺',
      flushing: '🍂'
    }
    return icons[stageKey] || '🌿'
  }

  const getPotSizeIcon = (sizeKey: string) => {
    const icons: Record<string, string> = {
      very_small: '🟢',
      small: '🟢',
      medium_small: '🟡',
      medium: '🟡',
      medium_large: '🟠',
      large: '🟠',
      very_large: '🔴'
    }
    return icons[sizeKey] || '🟡'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cannabis Bewässerungsrechner</h2>
        <p className="text-gray-600">Optimale Bewässerung basierend auf Wachstumsphase und Umweltbedingungen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eingabefelder */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Pflanzen-Einstellungen</h3>
          
          {/* Wachstumsphase */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wachstumsphase
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(cannabisStages).map(([key, stageData]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStage(key as PlantStage)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    stage === key
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{getStageIcon(key)}</div>
                    <div className="text-sm font-medium">{stageData.name}</div>
                    <div className="text-xs text-gray-500">{stageData.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Topfgröße */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topfgröße
            </label>
            <select
              value={potSize}
              onChange={(e) => setPotSize(e.target.value as PotSize)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Topfgröße auswählen"
            >
              {Object.entries(potSizes).map(([key, sizeData]) => (
                <option key={key} value={key}>
                  {getPotSizeIcon(key)} {sizeData.description} ({sizeData.volume_liters}L, Ø{sizeData.diameter_cm}cm)
                </option>
              ))}
            </select>
          </div>

          {/* Umweltfaktoren */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Umweltbedingungen</h4>
            
            {/* Jahreszeit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jahreszeit</label>
              <select
                value={environmentalFactors.season}
                onChange={(e) => handleEnvironmentalChange('season', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                aria-label="Jahreszeit auswählen"
              >
                <option value="spring">Frühling</option>
                <option value="summer">Sommer</option>
                <option value="autumn">Herbst</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            {/* Temperatur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperatur</label>
              <select
                value={environmentalFactors.temperature}
                onChange={(e) => handleEnvironmentalChange('temperature', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                aria-label="Temperatur auswählen"
              >
                <option value="cold">Kalt (&lt;18°C)</option>
                <option value="moderate">Moderat (18-24°C)</option>
                <option value="warm">Warm (24-28°C)</option>
                <option value="hot">Heiß (&gt;28°C)</option>
              </select>
            </div>

            {/* Luftfeuchtigkeit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Luftfeuchtigkeit</label>
              <select
                value={environmentalFactors.humidity}
                onChange={(e) => handleEnvironmentalChange('humidity', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                aria-label="Luftfeuchtigkeit auswählen"
              >
                <option value="low">Niedrig (&lt;40%)</option>
                <option value="moderate">Moderat (40-60%)</option>
                <option value="high">Hoch (&gt;60%)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Ergebnisse */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Bewässerungsplan</h3>
          
          {isCalculating ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : calculation ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Hauptwerte */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{calculation.waterAmount}L</div>
                    <div className="text-sm text-blue-700">Wassermenge</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{calculation.intervalDays}</div>
                    <div className="text-sm text-green-700">Tage Intervall</div>
                  </div>
                </div>

                {/* Nächste Bewässerung */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800 mb-1">Nächste Bewässerung</div>
                  <div className="text-lg font-semibold text-yellow-900">
                    {calculation.nextWatering.toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Empfehlungen */}
                {calculation.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">💡 Empfehlungen</h4>
                    <ul className="space-y-1">
                      {calculation.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Validierte Daten */}
                {calculation.validatedData && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">🔬 Wissenschaftliche Validierung</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Vertrauensniveau:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          calculation.validatedData.confidenceLevel === 'high' 
                            ? 'bg-green-100 text-green-800' 
                            : calculation.validatedData.confidenceLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {calculation.validatedData.confidenceLevel === 'high' ? 'Hoch' :
                           calculation.validatedData.confidenceLevel === 'medium' ? 'Mittel' : 'Niedrig'}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600">
                        <div>Letzte Validierung: {calculation.validatedData.lastValidated}</div>
                        <div className="mt-1">
                          <span className="font-medium">Quellen:</span> {calculation.validatedData.researchSources.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowResearchInfo(true)}
                        className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        📚 Detaillierte Forschung anzeigen
                      </button>
                    </div>
                  </div>
                )}

                {/* Warnungen */}
                {calculation.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">⚠️ Warnungen</h4>
                    <ul className="space-y-1">
                      {calculation.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Aktions-Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => {
                      // Hier könnte man einen Bewässerungslog erstellen
                      alert('Bewässerung protokolliert!')
                    }}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    💧 Bewässerung protokollieren
                  </button>
                  <button
                    onClick={() => {
                      // Hier könnte man einen 30-Tage-Plan anzeigen
                      alert('30-Tage-Plan wird generiert...')
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📅 30-Tage-Plan
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Bitte wählen Sie die Pflanzen-Einstellungen aus
            </div>
          )}
        </Card>
      </div>

      {/* Zusätzliche Informationen */}
      {calculation && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Pflegetipps für {cannabisStages[stage]?.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Spezielle Hinweise</h4>
              <ul className="space-y-1">
                {cannabisStages[stage]?.special_notes?.slice(0, 3).map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Anzeichen von Problemen</h4>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-red-600">Überwässerung:</div>
                  <div className="text-xs text-gray-600">Gelbe Blätter, Schimmel, fauliger Geruch</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-600">Unterwässerung:</div>
                  <div className="text-xs text-gray-600">Hängende Blätter, trockene Erde, braune Ränder</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ValidatedResearchInfo Modal */}
      {showResearchInfo && (
        <ValidatedResearchInfo
          stage={stage}
          potSize={potSize}
          onClose={() => setShowResearchInfo(false)}
        />
      )}
    </div>
  )
}
