'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGrowType } from '@/hooks/useGrowType'

import { 
  GrowthPhase, 
  GrowType, 
  DailyDataEntry as DailyDataEntryType,
  MeasurementReminder,
  MeasurementChecklist
} from '@/types/plant'
import { 
  calculateVPD, 
  getTargetRanges, 
  analyzeAllMeasurements, 
  getMeasurementTips 
} from '@/services/measurementAnalysisService'
import { measurementsStore, remindersStore, checklistsStore } from '@/services/measurementsLocalStore'

// Einfache UI-Komponenten
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

const Button: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ children, onClick, type = 'button', variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  const variantClasses = {
    default: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

const Tabs: React.FC<{ children: React.ReactNode; defaultValue: string; className?: string }> = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any)
        }
        return child
      })}
    </div>
  )
}

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

const TabsTrigger: React.FC<{ 
  children: React.ReactNode
  value: string
  className?: string
  activeTab?: string
  setActiveTab?: (value: string) => void
}> = ({ children, value, className = '', activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab?.(value)}
    className={`${className} ${activeTab === value ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
  >
    {children}
  </button>
)

const TabsContent: React.FC<{ 
  children: React.ReactNode
  value: string
  className?: string
  activeTab?: string
}> = ({ children, value, className = '', activeTab }) => (
  <div className={`${className} ${activeTab === value ? 'block' : 'hidden'}`}>
    {children}
  </div>
)

// Hauptkomponente
export default function MeasurementsPageContent() {
  const { growType } = useGrowType()
  const [activeTab, setActiveTab] = useState('overview')
  const [measurements, setMeasurements] = useState<DailyDataEntryType[]>([])
  const [reminders, setReminders] = useState<MeasurementReminder[]>([])
  const [checklists, setChecklists] = useState<MeasurementChecklist[]>([])

  // Lade Daten beim Mount
  React.useEffect(() => {
    const loadData = () => {
      try {
        const storedMeasurements = measurementsStore.getAll()
        const storedReminders = remindersStore.getAll()
        const storedChecklists = checklistsStore.getAll()
        
        setMeasurements(storedMeasurements)
        setReminders(storedReminders)
        setChecklists(storedChecklists)
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
      }
    }

    loadData()
  }, [])

  // Analysiere alle Messungen
  const analysis = React.useMemo(() => {
    if (measurements.length === 0) return null
    // Verwende die letzte Messung für die Analyse
    const latestMeasurement = measurements[measurements.length - 1]
    return analyzeAllMeasurements(latestMeasurement, 'vegetative', growType)
  }, [measurements, growType])

  // Hole Tipps basierend auf den Messungen
  const tips = React.useMemo(() => {
    if (!analysis) return []
    // Sammle alle Tipps für verschiedene Parameter
    const allTips: string[] = []
    Object.keys(analysis).forEach(parameter => {
      const parameterTips = getMeasurementTips(parameter)
      allTips.push(...parameterTips)
    })
    return allTips
  }, [analysis])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messungen & Analyse
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Überwache und analysiere deine Pflanzen-Messungen für optimales Wachstum
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <TabsTrigger 
              value="overview" 
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="measurements" 
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Messungen
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Analyse
            </TabsTrigger>
            <TabsTrigger 
              value="reminders" 
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Erinnerungen
            </TabsTrigger>
          </TabsList>

          {/* Übersicht Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Aktuelle Messungen */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Aktuelle Messungen
                </h3>
                <div className="space-y-3">
                  {measurements.slice(-3).map((measurement, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(measurement.date).toLocaleDateString('de-DE')}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {measurement.temperature}°C / {measurement.humidity}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Wachstumsphase */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Wachstumsphase
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {growType === 'indoor' ? 'Indoor' : 'Outdoor'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktuelle Phase: {analysis?.currentPhase || 'Unbekannt'}
                  </p>
                </div>
              </Card>

              {/* Nächste Erinnerung */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Nächste Erinnerung
                </h3>
                <div className="text-center">
                  {reminders.length > 0 ? (
                    <div>
                      <div className="text-lg font-medium text-blue-600 mb-1">
                        {reminders[0].title}
                      </div>
                                              <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(reminders[0].nextReminder).toLocaleDateString('de-DE')}
                        </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Keine anstehenden Erinnerungen
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Schnellaktionen */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Schnellaktionen
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setActiveTab('measurements')}>
                  Neue Messung hinzufügen
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('reminders')}>
                  Erinnerung erstellen
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('analysis')}>
                  Detaillierte Analyse
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Messungen Tab */}
          <TabsContent value="measurements" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Alle Messungen
              </h3>
              {measurements.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                  Noch keine Messungen vorhanden. Füge deine erste Messung hinzu!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Datum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Temperatur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Luftfeuchtigkeit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          VPD
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {measurements.map((measurement, index) => {
                        const vpd = calculateVPD(measurement.temperature, measurement.humidity)
                        return (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(measurement.date).toLocaleDateString('de-DE')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {measurement.temperature}°C
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {measurement.humidity}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {vpd.toFixed(2)} kPa
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Analyse Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {analysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* VPD-Analyse */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    VPD-Analyse
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Durchschnittlicher VPD:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.averageVPD.toFixed(2)} kPa
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">VPD-Bereich:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.vpdRange.min.toFixed(2)} - {analysis.vpdRange.max.toFixed(2)} kPa
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Optimale VPD:</span>
                        <span className="font-medium text-green-600">
                          {getTargetRanges('vegetative', growType).vpd.min.toFixed(2)} - {getTargetRanges('vegetative', growType).vpd.max.toFixed(2)} kPa
                        </span>
                    </div>
                  </div>
                </Card>

                {/* Temperatur-Analyse */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Temperatur-Analyse
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Durchschnittstemperatur:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.averageTemperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Temperaturbereich:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.temperatureRange.min.toFixed(1)}°C - {analysis.temperatureRange.max.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Optimale Temperatur:</span>
                        <span className="font-medium text-green-600">
                          {getTargetRanges('vegetative', growType).temperature.min.toFixed(1)}°C - {getTargetRanges('vegetative', growType).temperature.max.toFixed(1)}°C
                        </span>
                    </div>
                  </div>
                </Card>

                {/* Luftfeuchtigkeits-Analyse */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Luftfeuchtigkeits-Analyse
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Durchschnittsluftfeuchtigkeit:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.averageHumidity.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Luftfeuchtigkeitsbereich:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.humidityRange.min.toFixed(1)}% - {analysis.humidityRange.max.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Optimale Luftfeuchtigkeit:</span>
                        <span className="font-medium text-green-600">
                          {getTargetRanges('vegetative', growType).humidity.min.toFixed(1)}% - {getTargetRanges('vegetative', growType).humidity.max.toFixed(1)}%
                        </span>
                    </div>
                  </div>
                </Card>

                {/* Wachstumsphase */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Wachstumsphase
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Aktuelle Phase:</span>
                      <span className="font-medium text-blue-600">
                        {analysis.currentPhase}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Phase-Dauer:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.phaseDuration} Tage
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Nächste Phase:</span>
                      <span className="font-medium text-green-600">
                        {analysis.nextPhase}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                  Keine Daten für die Analyse verfügbar. Füge Messungen hinzu, um detaillierte Einblicke zu erhalten.
                </p>
              </Card>
            )}

            {/* Tipps */}
            {tips.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Optimierungstipps
                </h3>
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Erinnerungen Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Messungs-Erinnerungen
                </h3>
                <Button size="sm">
                  Neue Erinnerung
                </Button>
              </div>
              
              {reminders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                  Keine Erinnerungen vorhanden. Erstelle eine Erinnerung, um keine Messung zu verpassen!
                </p>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{reminder.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(reminder.nextReminder).toLocaleDateString('de-DE')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {reminder.frequency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Checklisten */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Messungs-Checklisten
                </h3>
                <Button size="sm">
                  Neue Checkliste
                </Button>
              </div>
              
              {checklists.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                  Keine Checklisten vorhanden. Erstelle eine Checkliste für strukturierte Messungen!
                </p>
              ) : (
                <div className="space-y-3">
                  {checklists.map((checklist, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{checklist.title}</h4>
                      <div className="space-y-2">
                        {checklist.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2">
                            <input
                              id={`checklist-${index}-${itemIndex}`}
                              name={`checklist-${index}-${itemIndex}`}
                              type="checkbox"
                              aria-label={`${item.description} abhaken`}
                              checked={item.isCompleted}
                              onChange={() => {
                                // Handle checkbox change
                              }}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
