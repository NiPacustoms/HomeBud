import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { useGrowType } from '@/hooks/useGrowType'
import { AnimatePresence } from 'framer-motion'
import { 
  GrowthPhase, 
  GrowType, 
  DailyDataEntry as DailyDataEntryType 
} from '@/types/plant'
import { 
  calculateVPD, 
  getTargetRanges, 
  analyzeAllMeasurements, 
  getMeasurementTips 
} from '@/services/measurementAnalysisService'

export interface DailyDataEntry {
  id: string
  projectId: string
  date: Date
  growthPhase: GrowthPhase
  growType: GrowType
  temperature: number
  humidity: number
  lightLevel: number
  ph: number
  ec: number
  co2?: number
  airFlow?: number
  soilMoisture?: number
  vpd?: number
  analysis?: any
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface DailyDataEntryProps {
  onSave: (data: Omit<DailyDataEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  lastEntry?: DailyDataEntry
  className?: string
}

export const DailyDataEntry: React.FC<DailyDataEntryProps> = ({
  onSave,
  lastEntry,
  className = ''
}) => {
  const { growType } = useGrowType()
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedGrowthPhase, setSelectedGrowthPhase] = useState<GrowthPhase>(
    lastEntry?.growthPhase || 'vegetative'
  )
  const [showTips, setShowTips] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    temperature: lastEntry?.temperature || 24,
    humidity: lastEntry?.humidity || 60,
    lightLevel: lastEntry?.lightLevel || 450,
    ph: lastEntry?.ph || 6.0,
    ec: lastEntry?.ec || 1.2,
    co2: lastEntry?.co2 || 800,
    airFlow: lastEntry?.airFlow || 50,
    soilMoisture: lastEntry?.soilMoisture || 70,
    notes: ''
  })

  // VPD-Berechnung
  const currentVPD = calculateVPD(formData.temperature, formData.humidity)
  
  // Zielbereiche basierend auf Wachstumsphase
  const targetRanges = getTargetRanges(selectedGrowthPhase, growType as GrowType)
  
  // Automatische Analyse
  const analysis = analyzeAllMeasurements(
    {
      temperature: formData.temperature,
      humidity: formData.humidity,
      lightLevel: formData.lightLevel,
      ph: formData.ph,
      ec: formData.ec,
      co2: formData.co2
    },
    selectedGrowthPhase,
    growType as GrowType
  )

  const handleInputChange = (field: keyof typeof formData, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      projectId: 'current', // TODO: Get from active project
      date: new Date(),
      growthPhase: selectedGrowthPhase,
      growType: growType as GrowType,
      vpd: currentVPD,
      analysis,
      ...formData
    })
    setIsExpanded(false)
    setFormData(prev => ({ ...prev, notes: '' }))
  }

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min) return 'text-red-500'
    if (value > max) return 'text-orange-500'
    return 'text-green-500'
  }

  const getStatusIcon = (value: number, min: number, max: number) => {
    if (value < min) return '⚠️'
    if (value > max) return '⚠️'
    return '✅'
  }

  const growthPhaseOptions = [
    { value: 'seedling', label: '🌱 Keimling', description: '0-14 Tage nach Keimung' },
    { value: 'vegetative', label: '🌿 Vegetativ', description: '15-60 Tage Wachstum' },
    { value: 'flowering', label: '🌸 Blüte', description: '61-90 Tage Blüte' },
    { value: 'late_flowering', label: '🌺 Späte Blüte', description: '91-120 Tage Reifung' },
    { value: 'flushing', label: '🚿 Spülphase', description: '7-14 Tage vor Ernte' }
  ]

  const renderMeasurementField = (
    label: string,
    field: keyof typeof formData,
    range: { min: number; max: number; unit: string },
    icon: string,
    step: number = 0.1,
    tips?: string[]
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {icon} {label} ({range.unit})
        </label>
        {tips && (
          <button
            type="button"
            onClick={() => setShowTips(showTips === field ? null : field)}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            💡 Tipps
          </button>
        )}
      </div>
      
      <div className="relative">
        <input
          type="number"
          step={step}
          value={formData[field] as number}
          onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            getStatusColor(formData[field] as number, range.min, range.max)
          }`}
          aria-label={`${label} eingeben`}
        />
        <span className="absolute right-3 top-2 text-lg">
          {getStatusIcon(formData[field] as number, range.min, range.max)}
        </span>
      </div>
      
      <p className="text-xs text-neutral-500">
        Empfohlen: {range.min}-{range.max}{range.unit}
      </p>
      
      {tips && showTips === field && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Mess-Tipps für {label}:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            {tips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <Card className={`${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              📊 Erweiterte Datenerfassung
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manuelle Eingabe mit automatischer Analyse und VPD-Berechnung
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {isExpanded ? 'Schließen' : 'Daten eingeben'}
          </motion.button>
        </div>

        {lastEntry && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📅 Letzter Eintrag: {lastEntry.date.toLocaleDateString('de-DE')} - 
              {lastEntry.temperature}°C, {lastEntry.humidity}% Luftfeuchte, VPD: {lastEntry.vpd?.toFixed(2)} kPa
            </p>
          </div>
        )}

        {/* Info-Box für erweiterte Funktionen */}
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400 text-lg">🚀</span>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Neue Funktionen verfügbar
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Wachstumsphasen-spezifische Analyse, VPD-Berechnung, Mess-Tipps und automatische Empfehlungen
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Wachstumsphase Auswahl */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  🌱 Aktuelle Wachstumsphase
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {growthPhaseOptions.map((phase) => (
                    <button
                      key={phase.value}
                      type="button"
                      onClick={() => setSelectedGrowthPhase(phase.value as GrowthPhase)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedGrowthPhase === phase.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-green-300'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {phase.label}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {phase.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hauptwerte */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderMeasurementField(
                  'Temperatur',
                  'temperature',
                  targetRanges.temperature,
                  '🌡️',
                  0.1,
                  getMeasurementTips('temperature')
                )}
                
                {renderMeasurementField(
                  'Luftfeuchtigkeit',
                  'humidity',
                  targetRanges.humidity,
                  '💧',
                  1,
                  getMeasurementTips('humidity')
                )}
                
                {renderMeasurementField(
                  'Lichtstärke (PPFD)',
                  'lightLevel',
                  targetRanges.lightLevel,
                  '☀️',
                  10,
                  getMeasurementTips('lightLevel')
                )}
                
                {renderMeasurementField(
                  'pH-Wert',
                  'ph',
                  targetRanges.ph,
                  '🧪',
                  0.1,
                  getMeasurementTips('ph')
                )}
                
                {renderMeasurementField(
                  'EC-Wert',
                  'ec',
                  targetRanges.ec,
                  '⚡',
                  0.1,
                  getMeasurementTips('ec')
                )}
                
                {renderMeasurementField(
                  'CO₂',
                  'co2',
                  targetRanges.co2,
                  '🌿',
                  10,
                  getMeasurementTips('co2')
                )}
              </div>

              {/* VPD-Anzeige */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      🌡️ VPD (Vapor Pressure Deficit)
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Berechnet aus Temperatur und Luftfeuchtigkeit
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      getStatusColor(currentVPD, targetRanges.vpd.min, targetRanges.vpd.max)
                    }`}>
                      {currentVPD.toFixed(2)} kPa
                    </div>
                    <div className="text-xs text-neutral-500">
                      Ziel: {targetRanges.vpd.min}-{targetRanges.vpd.max} kPa
                    </div>
                  </div>
                </div>
              </div>

              {/* Zusätzliche Werte für Indoor */}
              {growType === 'indoor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      💨 Luftstrom (%)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={formData.airFlow}
                      onChange={(e) => handleInputChange('airFlow', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Luftstrom in Prozent eingeben"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      🌱 Bodenfeuchte (%)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={formData.soilMoisture}
                      onChange={(e) => handleInputChange('soilMoisture', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Bodenfeuchte in Prozent eingeben"
                    />
                  </div>
                </div>
              )}

              {/* Notizen */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  📝 Notizen (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Besondere Beobachtungen, Probleme, Erfolge..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📊 Daten speichern & Analysieren
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default DailyDataEntry
