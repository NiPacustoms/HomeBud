import React from 'react'
import { Card } from '@/components/ui/Card'
import { useDailyData } from '@/hooks/useDailyData'
import { useGrowType } from '@/hooks/useGrowType'

interface CurrentValuesDisplayProps {
  className?: string
}

export const CurrentValuesDisplay: React.FC<CurrentValuesDisplayProps> = ({
  className = ''
}) => {
  const { getLastEntry, getWeeklyAverage } = useDailyData()
  const { growType } = useGrowType()
  
  const lastEntry = getLastEntry()
  const weeklyAverage = getWeeklyAverage()

  const getRecommendedRanges = () => {
    switch (growType) {
      case 'indoor':
        return {
          temperature: { min: 22, max: 28, unit: '°C' },
          humidity: { min: 50, max: 70, unit: '%' },
          lightLevel: { min: 400, max: 800, unit: 'μmol/m²/s' },
          ph: { min: 5.8, max: 6.5, unit: '' },
          ec: { min: 1.0, max: 2.0, unit: 'mS/cm' },
          co2: { min: 600, max: 1200, unit: 'ppm' }
        }
      case 'outdoor':
        return {
          temperature: { min: 18, max: 32, unit: '°C' },
          humidity: { min: 40, max: 80, unit: '%' },
          lightLevel: { min: 200, max: 1000, unit: 'μmol/m²/s' },
          ph: { min: 6.0, max: 7.0, unit: '' },
          ec: { min: 0.8, max: 1.8, unit: 'mS/cm' },
          co2: { min: 400, max: 600, unit: 'ppm' }
        }
      case 'greenhouse':
        return {
          temperature: { min: 20, max: 30, unit: '°C' },
          humidity: { min: 45, max: 75, unit: '%' },
          lightLevel: { min: 300, max: 900, unit: 'μmol/m²/s' },
          ph: { min: 5.8, max: 6.8, unit: '' },
          ec: { min: 0.9, max: 1.9, unit: 'mS/cm' },
          co2: { min: 500, max: 1000, unit: 'ppm' }
        }
      default:
        return {
          temperature: { min: 22, max: 28, unit: '°C' },
          humidity: { min: 50, max: 70, unit: '%' },
          lightLevel: { min: 400, max: 800, unit: 'μmol/m²/s' },
          ph: { min: 5.8, max: 6.5, unit: '' },
          ec: { min: 1.0, max: 2.0, unit: 'mS/cm' },
          co2: { min: 600, max: 1200, unit: 'ppm' }
        }
    }
  }

  const ranges = getRecommendedRanges()

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min) return 'text-red-500 bg-red-50 dark:bg-red-900/20'
    if (value > max) return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
    return 'text-green-500 bg-green-50 dark:bg-green-900/20'
  }

  const getStatusIcon = (value: number, min: number, max: number) => {
    if (value < min) return '📉'
    if (value > max) return '📈'
    return '✅'
  }

  const renderValueCard = (
    title: string,
    value: number | undefined,
    unit: string,
    min: number,
    max: number,
    icon: string
  ) => {
    if (value === undefined) return null

    const statusColor = getStatusColor(value, min, max)
    const statusIcon = getStatusIcon(value, min, max)

    return (
      <div className={`p-4 rounded-lg border ${statusColor}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {title}
            </span>
          </div>
          <span className="text-lg">{statusIcon}</span>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {value}{unit}
        </div>
        <div className="text-xs text-neutral-500 mt-1">
          Ziel: {min}-{max}{unit}
        </div>
      </div>
    )
  }

  if (!lastEntry) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Keine Daten verfügbar
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Erfasse deine ersten Messwerte, um hier eine Übersicht zu sehen.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              📈 Aktuelle Werte
            </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Letzte manuelle Eingabe: {lastEntry.date.toLocaleDateString('de-DE')} um {lastEntry.date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </p>
          </div>
          <div className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
            {growType.toUpperCase()}
          </div>
        </div>

        {/* Hauptwerte Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {renderValueCard(
            'Temperatur',
            lastEntry.temperature,
            '°C',
            ranges.temperature.min,
            ranges.temperature.max,
            '🌡️'
          )}
          {renderValueCard(
            'Luftfeuchtigkeit',
            lastEntry.humidity,
            '%',
            ranges.humidity.min,
            ranges.humidity.max,
            '💧'
          )}
          {renderValueCard(
            'Lichtstärke',
            lastEntry.lightLevel,
            'μmol/m²/s',
            ranges.lightLevel.min,
            ranges.lightLevel.max,
            '☀️'
          )}
          {renderValueCard(
            'pH-Wert',
            lastEntry.ph,
            '',
            ranges.ph.min,
            ranges.ph.max,
            '🧪'
          )}
          {renderValueCard(
            'EC-Wert',
            lastEntry.ec,
            'mS/cm',
            ranges.ec.min,
            ranges.ec.max,
            '⚡'
          )}
          {renderValueCard(
            'CO₂',
            lastEntry.co2,
            'ppm',
            ranges.co2.min,
            ranges.co2.max,
            '🌿'
          )}
        </div>

        {/* Zusätzliche Werte für Indoor */}
        {growType === 'indoor' && (lastEntry.airFlow !== undefined || lastEntry.soilMoisture !== undefined) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Zusätzliche Indoor-Werte
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lastEntry.airFlow !== undefined && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span>💨</span>
                    <span className="text-sm font-medium">Luftstrom</span>
                  </div>
                  <div className="text-lg font-bold">{lastEntry.airFlow}%</div>
                </div>
              )}
              {lastEntry.soilMoisture !== undefined && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span>🌱</span>
                    <span className="text-sm font-medium">Bodenfeuchte</span>
                  </div>
                  <div className="text-lg font-bold">{lastEntry.soilMoisture}%</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wöchentlicher Durchschnitt */}
        {weeklyAverage && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              📊 Wöchentlicher Durchschnitt
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="text-center">
                <div className="font-medium">Temp</div>
                <div className="text-neutral-600">{weeklyAverage.temperature.toFixed(1)}°C</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Luftfeuchte</div>
                <div className="text-neutral-600">{weeklyAverage.humidity.toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium">pH</div>
                <div className="text-neutral-600">{weeklyAverage.ph.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">EC</div>
                <div className="text-neutral-600">{weeklyAverage.ec.toFixed(1)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Notizen */}
        {lastEntry.notes && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              📝 Notizen
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-3 rounded">
              {lastEntry.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default CurrentValuesDisplay
