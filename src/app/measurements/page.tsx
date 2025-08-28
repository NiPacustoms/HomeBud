'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGrowType } from '@/hooks/useGrowType'
import AppLayout from '@/components/layout/AppLayout'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
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
}> = ({ children, value, className = '', activeTab }) => {
  if (activeTab !== value) return null
  return <div className={className}>{children}</div>
}

// Mock-Daten für Demozwecke
const mockMeasurements: DailyDataEntryType[] = [
  {
    id: '1',
    projectId: 'current',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    growthPhase: 'vegetative',
    growType: 'indoor',
    temperature: 24.5,
    humidity: 65,
    lightLevel: 450,
    ph: 6.2,
    ec: 1.4,
    co2: 800,
    airFlow: 60,
    soilMoisture: 75,
    vpd: 0.9,
    notes: 'Pflanzen wachsen gut, keine Probleme beobachtet',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    projectId: 'current',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    growthPhase: 'vegetative',
    growType: 'indoor',
    temperature: 26.0,
    humidity: 58,
    lightLevel: 480,
    ph: 6.0,
    ec: 1.6,
    co2: 850,
    airFlow: 55,
    soilMoisture: 70,
    vpd: 1.1,
    notes: 'Temperatur etwas hoch, Lüftung erhöht',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockReminders: MeasurementReminder[] = [
  {
    id: '1',
    type: 'daily',
    title: 'Tägliche Messungen',
    description: 'Temperatur, Luftfeuchtigkeit, pH und EC messen',
    frequency: 1,
    lastReminder: new Date(Date.now() - 12 * 60 * 60 * 1000),
    nextReminder: new Date(Date.now() + 12 * 60 * 60 * 1000),
    isActive: true,
    measurements: ['temperature', 'humidity', 'ph', 'ec']
  },
  {
    id: '2',
    type: 'weekly',
    title: 'Wöchentliche CO₂-Messung',
    description: 'CO₂-Gehalt und Lichtstärke überprüfen',
    frequency: 7,
    lastReminder: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextReminder: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isActive: true,
    measurements: ['co2', 'lightLevel']
  }
]

const mockChecklists: MeasurementChecklist[] = [
  {
    id: '1',
    title: 'Tägliche Messungen',
    items: [
      {
        id: '1',
        title: 'Temperatur messen',
        description: 'Messe die Temperatur in Pflanzenhöhe',
        isCompleted: true,
        category: 'temperature'
      },
      {
        id: '2',
        title: 'Luftfeuchtigkeit prüfen',
        description: 'Kontrolliere den Hygrometer',
        isCompleted: true,
        category: 'humidity'
      },
      {
        id: '3',
        title: 'pH-Wert testen',
        description: 'Messe den pH-Wert der Nährlösung',
        isCompleted: false,
        category: 'nutrients'
      },
      {
        id: '4',
        title: 'EC-Wert kontrollieren',
        description: 'Überprüfe die Leitfähigkeit',
        isCompleted: false,
        category: 'nutrients'
      }
    ],
    createdAt: new Date()
  }
]

export default function MeasurementsPage() {
  const { growType } = useGrowType()
  const [measurements, setMeasurements] = useState<DailyDataEntryType[]>([])
  const [reminders, setReminders] = useState<MeasurementReminder[]>([])
  const [checklists, setChecklists] = useState<MeasurementChecklist[]>([])
  // Hinweis: Auswahl der Wachstumsphase erfolgt im Formular, nicht auf der Seite
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Initiales Laden aus LocalStorage (ohne Backend)
  React.useEffect(() => {
    const storedMeasurements = measurementsStore.getAll()
    const storedReminders = remindersStore.getAll()
    const storedChecklists = checklistsStore.getAll()

    if (storedMeasurements.length === 0) {
      // Bootstrap mit Mock-Daten beim ersten Start
      mockMeasurements.forEach(m => measurementsStore.add(m))
    }
    if (storedReminders.length === 0) {
      mockReminders.forEach(r => remindersStore.add(r))
    }
    if (storedChecklists.length === 0) {
      mockChecklists.forEach(c => checklistsStore.add(c))
    }

    setMeasurements(measurementsStore.getAll())
    setReminders(remindersStore.getAll())
    setChecklists(checklistsStore.getAll())
  }, [])

  const handleSaveMeasurement = (data: Omit<DailyDataEntryType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingId) {
      const updated = measurementsStore.update(editingId, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date()
      }))
      setMeasurements(updated)
      setEditingId(null)
    } else {
      const newMeasurement: DailyDataEntryType = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      measurementsStore.add(newMeasurement)
      setMeasurements(measurementsStore.getAll())
    }
    setShowNewEntry(false)
  }

  const handleEditMeasurement = (id: string) => {
    setEditingId(id)
    setShowNewEntry(true)
  }

  const handleDeleteMeasurement = (id: string) => {
    const updated = measurementsStore.remove(id)
    setMeasurements(updated)
  }

  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    const updated = checklistsStore.update(checklistId, (cl) => ({
      ...cl,
      items: cl.items.map(it => it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it)
    }))
    setChecklists(updated)
  }

  const handleToggleReminderActive = (reminderId: string) => {
    const updated = remindersStore.update(reminderId, (r) => ({
      ...r,
      isActive: !r.isActive
    }))
    setReminders(updated)
  }

  const handleAddReminder = () => {
    const newR: MeasurementReminder = {
      id: Date.now().toString(),
      type: 'daily',
      title: 'Neue Erinnerung',
      description: 'Tägliche Messung',
      frequency: 1,
      lastReminder: new Date(),
      nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
      measurements: ['temperature', 'humidity']
    }
    remindersStore.add(newR)
    setReminders(remindersStore.getAll())
  }

  const handleExportData = (format: 'csv' | 'json') => {
    if (measurements.length === 0) {
      return
    }
    const data = measurements.map(m => ({
      Datum: m.date.toLocaleDateString('de-DE'),
      Wachstumsphase: m.growthPhase,
      Temperatur: `${m.temperature}°C`,
      Luftfeuchtigkeit: `${m.humidity}%`,
      'Lichtstärke (PPFD)': `${m.lightLevel} μmol/m²/s`,
      'pH-Wert': m.ph,
      'EC-Wert': `${m.ec} mS/cm`,
      'CO₂': m.co2 ? `${m.co2} ppm` : '-',
      'VPD': m.vpd ? `${m.vpd.toFixed(2)} kPa` : '-',
      'Luftstrom': m.airFlow ? `${m.airFlow}%` : '-',
      'Bodenfeuchte': m.soilMoisture ? `${m.soilMoisture}%` : '-',
      Notizen: m.notes || '-'
    }))

    if (format === 'csv') {
      const headers = Object.keys(data[0] as Record<string, unknown>)
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${(row as any)[h]}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `messungen_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    } else {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `messungen_${new Date().toISOString().split('T')[0]}.json`
      link.click()
    }
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

  const timeRangeOptions = [
    { value: 'day', label: '📅 Heute', days: 1 },
    { value: 'week', label: '📊 Diese Woche', days: 7 },
    { value: 'month', label: '📈 Dieser Monat', days: 30 }
  ]

  const filteredMeasurements = measurements.filter(m => {
    const daysDiff = (Date.now() - m.date.getTime()) / (1000 * 60 * 60 * 24)
    const selectedDays = timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.days || 7
    return daysDiff <= selectedDays
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Sensordaten-Erfassung
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professionelle Erfassung und Analyse aller wichtigen Messwerte für optimales Pflanzenwachstum
          </p>
        </motion.div>

        {/* Haupt-Tabs */}
        <Tabs defaultValue="entry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg">
            <TabsTrigger value="entry" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              📝 Neue Messung
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              📊 Historie
            </TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              ⏰ Erinnerungen
            </TabsTrigger>
            <TabsTrigger value="checklists" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              ✅ Checklisten
            </TabsTrigger>
          </TabsList>

          {/* Neue Messung Tab */}
          <TabsContent value="entry" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Neue Messung erfassen
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Erfasse alle wichtigen Messwerte für deine Pflanzen
                  </p>
                </div>
                <Button
                  onClick={() => setShowNewEntry(!showNewEntry)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {showNewEntry ? 'Schließen' : 'Messung starten'}
                </Button>
              </div>

              {showNewEntry && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MeasurementEntryForm
                    onSave={handleSaveMeasurement}
                    growType={growType as GrowType}
                    className="mt-6"
                  />
                </motion.div>
              )}
            </Card>
          </TabsContent>

          {/* Historie Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Messverlauf & Trends
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Analysiere deine Messdaten über verschiedene Zeiträume
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExportData('csv')}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    📊 CSV Export
                  </Button>
                  <Button
                    onClick={() => handleExportData('json')}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    🔧 JSON Export
                  </Button>
                </div>
              </div>

              {/* Zeitraum-Filter */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  {timeRangeOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => setSelectedTimeRange(option.value as 'day' | 'week' | 'month')}
                      variant={selectedTimeRange === option.value ? 'default' : 'outline'}
                      className={selectedTimeRange === option.value ? 'bg-green-600' : ''}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messdaten-Tabelle */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Datum</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Phase</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Temp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Luftfeuchte</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">pH</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">EC</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">VPD</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Notizen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMeasurements.map((measurement) => {
                      const targetRanges = getTargetRanges(measurement.growthPhase, measurement.growType)
                      return (
                        <tr key={measurement.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {measurement.date.toLocaleDateString('de-DE')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {growthPhaseOptions.find(p => p.value === measurement.growthPhase)?.label}
                            </span>
                          </td>
                          <td className={`py-3 px-4 ${getStatusColor(measurement.temperature, targetRanges.temperature.min, targetRanges.temperature.max)}`}>
                            {measurement.temperature}°C {getStatusIcon(measurement.temperature, targetRanges.temperature.min, targetRanges.temperature.max)}
                          </td>
                          <td className={`py-3 px-4 ${getStatusColor(measurement.humidity, targetRanges.humidity.min, targetRanges.humidity.max)}`}>
                            {measurement.humidity}% {getStatusIcon(measurement.humidity, targetRanges.humidity.min, targetRanges.humidity.max)}
                          </td>
                          <td className={`py-3 px-4 ${getStatusColor(measurement.ph, targetRanges.ph.min, targetRanges.ph.max)}`}>
                            {measurement.ph} {getStatusIcon(measurement.ph, targetRanges.ph.min, targetRanges.ph.max)}
                          </td>
                          <td className={`py-3 px-4 ${getStatusColor(measurement.ec, targetRanges.ec.min, targetRanges.ec.max)}`}>
                            {measurement.ec} mS/cm {getStatusIcon(measurement.ec, targetRanges.ec.min, targetRanges.ec.max)}
                          </td>
                          <td className={`py-3 px-4 ${measurement.vpd ? getStatusColor(measurement.vpd, targetRanges.vpd.min, targetRanges.vpd.max) : 'text-gray-400'}`}>
                            {measurement.vpd ? `${measurement.vpd.toFixed(2)} kPa ${getStatusIcon(measurement.vpd, targetRanges.vpd.min, targetRanges.vpd.max)}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {measurement.notes || '-'}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <Button variant="outline" onClick={() => handleEditMeasurement(measurement.id)}>Bearbeiten</Button>
                            <Button variant="outline" onClick={() => handleDeleteMeasurement(measurement.id)}>Löschen</Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredMeasurements.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Keine Messdaten für den ausgewählten Zeitraum verfügbar.</p>
                  <p>Erfasse deine erste Messung im Tab "Neue Messung".</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Erinnerungen Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mess-Erinnerungen
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verwalte Erinnerungen für regelmäßige Messungen
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddReminder}>
                  ➕ Neue Erinnerung
                </Button>
              </div>

              <div className="grid gap-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Nächste Erinnerung: {reminder.nextReminder.toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {reminder.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleToggleReminderActive(reminder.id)}>
                          {reminder.isActive ? 'Deaktivieren' : 'Aktivieren'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Checklisten Tab */}
          <TabsContent value="checklists" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mess-Checklisten
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Organisiere deine Messungen mit strukturierten Checklisten
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  ➕ Neue Checkliste
                </Button>
              </div>

              <div className="grid gap-4">
                {checklists.map((checklist) => (
                  <div key={checklist.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{checklist.title}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {checklist.items.filter(item => item.isCompleted).length} / {checklist.items.length} erledigt
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => handleToggleChecklistItem(checklist.id, item.id)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            aria-label={`Checkliste: ${item.title}`}
                          />
                          <div className="flex-1">
                            <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {item.title}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Neue Komponente für die Messungseingabe
interface MeasurementEntryFormProps {
  onSave: (data: Omit<DailyDataEntryType, 'id' | 'createdAt' | 'updatedAt'>) => void
  growType: GrowType
  className?: string
}

function MeasurementEntryForm({ onSave, growType, className = '' }: MeasurementEntryFormProps) {
  const [selectedGrowthPhase, setSelectedGrowthPhase] = useState<GrowthPhase>('vegetative')
  const [showTips, setShowTips] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    temperature: 24,
    humidity: 60,
    lightLevel: 450,
    ph: 6.0,
    ec: 1.2,
    co2: 800,
    airFlow: 50,
    soilMoisture: 70,
    notes: ''
  })

  // VPD-Berechnung
  const currentVPD = calculateVPD(formData.temperature, formData.humidity)
  
  // Zielbereiche basierend auf Wachstumsphase
  const growthPhaseOptions = [
    { value: "seedling", label: "🌱 Keimling", description: "0-14 Tage nach Keimung" },
    { value: "vegetative", label: "🌿 Vegetativ", description: "15-60 Tage Wachstum" },
    { value: "flowering", label: "🌸 Blüte", description: "61-90 Tage Blüte" },
    { value: "late_flowering", label: "🌺 Späte Blüte", description: "91-120 Tage Reifung" },
    { value: "flushing", label: "🚿 Spülphase", description: "7-14 Tage vor Ernte" }
  ]
  
  const targetRanges = getTargetRanges(selectedGrowthPhase, growType)
  
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
    growType
  )

  const handleInputChange = (field: keyof typeof formData, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      projectId: 'current',
      date: new Date(),
      growthPhase: selectedGrowthPhase,
      growType: growType,
      vpd: currentVPD,
      analysis,
      ...formData
    })
  }

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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      
      <input
        type="number"
        step={step}
        value={formData[field] as number}
        onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        aria-label={`${label} eingeben`}
      />
      
      <p className="text-xs text-gray-500">
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
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Wachstumsphase Auswahl */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {phase.label}
                </div>
                <div className="text-xs text-gray-500">
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
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {currentVPD.toFixed(2)} kPa
            </div>
            <div className="text-xs text-gray-500">
              Ziel: {targetRanges.vpd.min}-{targetRanges.vpd.max} kPa
            </div>
          </div>
        </div>
      </div>

      {/* Zusätzliche Werte für Indoor */}
      {growType === 'indoor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              💨 Luftstrom (%)
            </label>
            <input
              type="number"
              step="5"
              value={formData.airFlow}
              onChange={(e) => handleInputChange('airFlow', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Luftstrom in Prozent eingeben"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🌱 Bodenfeuchte (%)
            </label>
            <input
              type="number"
              step="5"
              value={formData.soilMoisture}
              onChange={(e) => handleInputChange('soilMoisture', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Bodenfeuchte in Prozent eingeben"
            />
          </div>
        </div>
      )}

      {/* Notizen */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          📝 Notizen (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          placeholder="Besondere Beobachtungen, Probleme, Erfolge..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
        >
          📊 Messung speichern & Analysieren
        </Button>
      </div>
    </form>
  )
}
