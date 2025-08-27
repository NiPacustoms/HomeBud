import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { MeasurementReminder, MeasurementChecklist } from '@/types/plant'

interface MeasurementRemindersProps {
  reminders: MeasurementReminder[]
  checklists: MeasurementChecklist[]
  onAddReminder: (reminder: Omit<MeasurementReminder, 'id'>) => void
  onToggleReminder: (id: string) => void
  onCompleteChecklist: (id: string) => void
  className?: string
}

export const MeasurementReminders: React.FC<MeasurementRemindersProps> = ({
  reminders,
  checklists,
  onAddReminder,
  onToggleReminder,
  onCompleteChecklist,
  className = ''
}) => {
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: 'daily' as const,
    title: '',
    description: '',
    frequency: 1,
    measurements: [] as string[]
  })

  const measurementOptions = [
    { value: 'temperature', label: '🌡️ Temperatur' },
    { value: 'humidity', label: '💧 Luftfeuchtigkeit' },
    { value: 'lightLevel', label: '☀️ Lichtstärke' },
    { value: 'ph', label: '🧪 pH-Wert' },
    { value: 'ec', label: '⚡ EC-Wert' },
    { value: 'co2', label: '🌿 CO₂' },
    { value: 'vpd', label: '🌡️ VPD' }
  ]

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.description) {
      onAddReminder({
        ...newReminder,
        nextReminder: new Date(Date.now() + newReminder.frequency * 24 * 60 * 60 * 1000),
        isActive: true
      })
      setNewReminder({
        type: 'daily',
        title: '',
        description: '',
        frequency: 1,
        measurements: []
      })
      setShowAddReminder(false)
    }
  }

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅'
      case 'weekly': return '📆'
      case 'custom': return '⏰'
      default: return '🔔'
    }
  }

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'weekly': return 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'custom': return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      default: return 'bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              🔔 Erinnerungen & Checklisten
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Regelmäßige Messungen und Kontrollen
            </p>
          </div>
          <button
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Erinnerung
          </button>
        </div>

        {/* Neue Erinnerung hinzufügen */}
        {showAddReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border"
          >
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
              Neue Erinnerung erstellen
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="z.B. Tägliche Messung"
                  aria-label="Erinnerungstitel eingeben"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                  placeholder="Was soll gemessen werden?"
                  aria-label="Erinnerungsbeschreibung eingeben"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Typ
                  </label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    aria-label="Erinnerungstyp auswählen"
                  >
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="custom">Benutzerdefiniert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Häufigkeit (Tage)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newReminder.frequency}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    aria-label="Häufigkeit in Tagen eingeben"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Zu messende Werte
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {measurementOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReminder.measurements.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewReminder(prev => ({
                              ...prev,
                              measurements: [...prev.measurements, option.value]
                            }))
                          } else {
                            setNewReminder(prev => ({
                              ...prev,
                              measurements: prev.measurements.filter(m => m !== option.value)
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleAddReminder}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Erinnerung erstellen
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aktive Erinnerungen */}
        <div className="space-y-3">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            🔔 Aktive Erinnerungen
          </h4>
          {reminders.filter(r => r.isActive).length === 0 ? (
            <p className="text-sm text-neutral-500 italic">
              Keine aktiven Erinnerungen. Erstelle eine neue Erinnerung für regelmäßige Messungen.
            </p>
          ) : (
            reminders.filter(r => r.isActive).map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${getReminderColor(reminder.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getReminderIcon(reminder.type)}</span>
                    <div>
                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {reminder.title}
                      </h5>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {reminder.description}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Alle {reminder.frequency} Tag(e) • Nächste: {reminder.nextReminder.toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleReminder(reminder.id)}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Deaktivieren
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Checklisten */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            ✅ Mess-Checklisten
          </h4>
          {checklists.length === 0 ? (
            <p className="text-sm text-neutral-500 italic">
              Keine Checklisten vorhanden. Erstelle eine Checkliste für systematische Kontrollen.
            </p>
          ) : (
            checklists.map((checklist) => (
              <motion.div
                key={checklist.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {checklist.title}
                  </h5>
                  {!checklist.completedAt && (
                    <button
                      onClick={() => onCompleteChecklist(checklist.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Abschließen
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                                             <input
                         type="checkbox"
                         checked={item.isCompleted}
                         disabled
                         className="rounded"
                         aria-label={`${item.title} abgeschlossen`}
                       />
                      <span className={`text-sm ${item.isCompleted ? 'line-through text-neutral-500' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {checklist.completedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✅ Abgeschlossen am {new Date(checklist.completedAt).toLocaleDateString('de-DE')}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}

export default MeasurementReminders
