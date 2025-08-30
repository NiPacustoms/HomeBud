import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { DailyDataEntry, GrowthPhase } from '@/types/plant'

interface DataVisualizationProps {
  data: DailyDataEntry[]
  className?: string
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  className = ''
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('7d')
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'lightLevel' | 'ph' | 'ec' | 'vpd'>('temperature')
  const [selectedPhase, setSelectedPhase] = useState<GrowthPhase | 'all'>('all')

  // Filtere Daten basierend auf Zeitraum
  const getFilteredData = () => {
    const now = new Date()
    const daysAgo = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    return data
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .filter(entry => selectedPhase === 'all' || entry.growthPhase === selectedPhase)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const filteredData = getFilteredData()

  // Berechne Statistiken
  const calculateStats = (metric: string) => {
    const values = filteredData.map(entry => entry[metric as keyof DailyDataEntry] as number).filter(v => v !== undefined)
    
    if (values.length === 0) return null
    
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    // Standardabweichung
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    
    // Trend (einfache lineare Regression)
    const n = values.length
    const xSum = (n * (n - 1)) / 2
    const ySum = sum
    const xySum = values.reduce((acc, val, i) => acc + val * i, 0)
    const x2Sum = values.reduce((acc, _, i) => acc + i * i, 0)
    
    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum)
    const trend = slope > 0 ? 'steigend' : slope < 0 ? 'fallend' : 'stabil'
    
    return { avg, min, max, stdDev, trend, count: values.length }
  }

  const stats = calculateStats(selectedMetric)

  const getMetricInfo = (metric: string) => {
    const info = {
      temperature: { label: 'Temperatur', unit: '°C', icon: '🌡️', color: 'text-red-500' },
      humidity: { label: 'Luftfeuchtigkeit', unit: '%', icon: '💧', color: 'text-blue-500' },
      lightLevel: { label: 'Lichtstärke', unit: 'μmol/m²/s', icon: '☀️', color: 'text-yellow-500' },
      ph: { label: 'pH-Wert', unit: '', icon: '🧪', color: 'text-purple-500' },
      ec: { label: 'EC-Wert', unit: 'mS/cm', icon: '⚡', color: 'text-green-500' },
      vpd: { label: 'VPD', unit: 'kPa', icon: '🌡️', color: 'text-indigo-500' }
    }
    return info[metric as keyof typeof info]
  }

  const metricInfo = getMetricInfo(selectedMetric)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'steigend': return '📈'
      case 'fallend': return '📉'
      case 'stabil': return '➡️'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'steigend': return 'text-green-600 dark:text-green-400'
      case 'fallend': return 'text-red-600 dark:text-red-400'
      case 'stabil': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  // Wachstumsphasen-Filter
  const growthPhases = [
    { value: 'all', label: 'Alle Phasen' },
    { value: 'seedling', label: '🌱 Keimling' },
    { value: 'vegetative', label: '🌿 Vegetativ' },
    { value: 'flowering', label: '🌸 Blüte' },
    { value: 'late_flowering', label: '🌺 Späte Blüte' },
    { value: 'flushing', label: '🚿 Spülphase' }
  ]

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              📊 Datenvisualisierung & Trends
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Analyse deiner Messwerte über Zeit
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Zeitraum
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Zeitraum auswählen"
            >
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
              <option value="90d">Letzte 90 Tage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Messwert
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Messwert auswählen"
            >
              <option value="temperature">🌡️ Temperatur</option>
              <option value="humidity">💧 Luftfeuchtigkeit</option>
              <option value="lightLevel">☀️ Lichtstärke</option>
              <option value="ph">🧪 pH-Wert</option>
              <option value="ec">⚡ EC-Wert</option>
              <option value="vpd">🌡️ VPD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Wachstumsphase
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Wachstumsphase auswählen"
            >
              {growthPhases.map(phase => (
                <option key={phase.value} value={phase.value}>
                  {phase.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiken */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.avg.toFixed(1)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Durchschnitt {metricInfo.unit}
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.min.toFixed(1)}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Minimum {metricInfo.unit}
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.max.toFixed(1)}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Maximum {metricInfo.unit}
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {getTrendIcon(stats.trend)}
              </div>
              <div className={`text-sm ${getTrendColor(stats.trend)}`}>
                Trend: {stats.trend}
              </div>
            </div>
          </div>
        )}

        {/* Datenpunkte */}
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            {metricInfo.icon} {metricInfo.label} - Verlauf
          </h4>
          
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">
                Keine Daten für den ausgewählten Zeitraum verfügbar.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.map((entry, index) => {
                const value = entry[selectedMetric as keyof DailyDataEntry] as number
                const date = new Date(entry.date)
                const isLatest = index === filteredData.length - 1
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      isLatest 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`text-lg ${metricInfo.color}`}>
                          {metricInfo.icon}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {value?.toFixed(1)} {metricInfo.unit}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {date.toLocaleDateString('de-DE')} um {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {entry.growthPhase === 'seedling' && '🌱'}
                          {entry.growthPhase === 'vegetative' && '🌿'}
                          {entry.growthPhase === 'flowering' && '🌸'}
                          {entry.growthPhase === 'late_flowering' && '🌺'}
                          {entry.growthPhase === 'flushing' && '🚿'}
                        </div>
                        {isLatest && (
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Neueste
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Zusammenfassung */}
        {stats && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              📈 Zusammenfassung
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <strong>Datenpunkte:</strong> {stats.count} Messungen
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <strong>Standardabweichung:</strong> {stats.stdDev.toFixed(2)} {metricInfo.unit}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <strong>Bereich:</strong> {stats.max.toFixed(1)} - {stats.min.toFixed(1)} {metricInfo.unit}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <strong>Trend:</strong> {getTrendIcon(stats.trend)} {stats.trend}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default DataVisualization
