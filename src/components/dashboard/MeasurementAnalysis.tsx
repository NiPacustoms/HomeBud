import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { MeasurementAnalysis as AnalysisType } from '@/types/plant'

interface MeasurementAnalysisProps {
  analysis: {
    temperature: AnalysisType
    humidity: AnalysisType
    lightLevel: AnalysisType
    ph: AnalysisType
    ec: AnalysisType
    co2?: AnalysisType
    vpd?: AnalysisType
  }
  className?: string
}

export const MeasurementAnalysis: React.FC<MeasurementAnalysisProps> = ({
  analysis,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'warning':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-800 dark:text-green-200'
      case 'warning':
        return 'text-orange-800 dark:text-orange-200'
      case 'critical':
        return 'text-red-800 dark:text-red-200'
      default:
        return 'text-gray-800 dark:text-gray-200'
    }
  }

  const measurements = [
    { key: 'temperature', label: '🌡️ Temperatur', analysis: analysis.temperature },
    { key: 'humidity', label: '💧 Luftfeuchtigkeit', analysis: analysis.humidity },
    { key: 'lightLevel', label: '☀️ Lichtstärke', analysis: analysis.lightLevel },
    { key: 'ph', label: '🧪 pH-Wert', analysis: analysis.ph },
    { key: 'ec', label: '⚡ EC-Wert', analysis: analysis.ec },
    ...(analysis.co2 ? [{ key: 'co2', label: '🌿 CO₂', analysis: analysis.co2 }] : []),
    ...(analysis.vpd ? [{ key: 'vpd', label: '🌡️ VPD', analysis: analysis.vpd }] : [])
  ]

  const criticalIssues = measurements.filter(m => m.analysis.status === 'critical')
  const warnings = measurements.filter(m => m.analysis.status === 'warning')
  const optimal = measurements.filter(m => m.analysis.status === 'optimal')

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              🔍 Automatische Analyse
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sofortige Bewertung deiner Messwerte
            </p>
          </div>
          <div className="flex space-x-2">
            {criticalIssues.length > 0 && (
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full">
                {criticalIssues.length} kritisch
              </span>
            )}
            {warnings.length > 0 && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                {warnings.length} Warnungen
              </span>
            )}
            {optimal.length > 0 && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                {optimal.length} optimal
              </span>
            )}
          </div>
        </div>

        {/* Kritische Probleme */}
        {criticalIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              🚨 Kritische Probleme
            </h4>
            <div className="space-y-2">
              {criticalIssues.map((measurement) => (
                <div
                  key={measurement.key}
                  className={`p-3 rounded-lg border ${getStatusColor(measurement.analysis.status)}`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{measurement.analysis.icon}</span>
                    <div className="flex-1">
                      <h5 className={`font-medium ${getStatusTextColor(measurement.analysis.status)}`}>
                        {measurement.label}
                      </h5>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {measurement.analysis.message}
                      </p>
                      {measurement.analysis.recommendations.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {measurement.analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-red-600 dark:text-red-400">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Warnungen */}
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
              ⚠️ Warnungen
            </h4>
            <div className="space-y-2">
              {warnings.map((measurement) => (
                <div
                  key={measurement.key}
                  className={`p-3 rounded-lg border ${getStatusColor(measurement.analysis.status)}`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{measurement.analysis.icon}</span>
                    <div className="flex-1">
                      <h5 className={`font-medium ${getStatusTextColor(measurement.analysis.status)}`}>
                        {measurement.label}
                      </h5>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {measurement.analysis.message}
                      </p>
                      {measurement.analysis.recommendations.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {measurement.analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-orange-600 dark:text-orange-400">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Optimale Werte */}
        {optimal.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              ✅ Optimale Werte
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {optimal.map((measurement) => (
                <div
                  key={measurement.key}
                  className={`p-3 rounded-lg border ${getStatusColor(measurement.analysis.status)}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{measurement.analysis.icon}</span>
                    <div>
                      <h5 className={`font-medium ${getStatusTextColor(measurement.analysis.status)}`}>
                        {measurement.label}
                      </h5>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {measurement.analysis.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Zusammenfassung */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            📊 Zusammenfassung
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {optimal.length}
              </div>
              <div className="text-green-700 dark:text-green-300">Optimal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {warnings.length}
              </div>
              <div className="text-orange-700 dark:text-orange-300">Warnungen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {criticalIssues.length}
              </div>
              <div className="text-red-700 dark:text-red-300">Kritisch</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MeasurementAnalysis
