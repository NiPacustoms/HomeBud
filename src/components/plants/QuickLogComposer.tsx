'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAppDispatch } from '@/store/store'
import { addPlantLog } from '@/store/slices/plantSlice'
import { LogAction, LogData, Plant } from '@/types/plant'
import '../../styles/performance.css'

interface QuickLogComposerProps {
  plant: Plant
  isOpen: boolean
  onClose: () => void
  defaultAction?: LogAction
}

const actionConfig = {
  watering: {
    label: 'Gießen',
    icon: '💧',
    fields: ['amount', 'runoff'],
    required: ['amount']
  },
  feeding: {
    label: 'Düngen',
    icon: '🌱',
    fields: ['nutrients', 'amount'],
    required: ['nutrients']
  },
  measurement: {
    label: 'Messen',
    icon: '📊',
    fields: ['temperature', 'humidity', 'ph', 'ec', 'vpd'],
    required: []
  },
  note: {
    label: 'Notiz',
    icon: '📝',
    fields: ['notes'],
    required: []
  },
  photo: {
    label: 'Foto',
    icon: '📸',
    fields: ['notes'],
    required: []
  },
  video: {
    label: 'Video',
    icon: '🎥',
    fields: ['notes'],
    required: []
  },
  voice: {
    label: 'Sprachmemo',
    icon: '🎤',
    fields: ['notes'],
    required: []
  }
}

export default function QuickLogComposer({ 
  plant, 
  isOpen, 
  onClose, 
  defaultAction = 'note' 
}: QuickLogComposerProps) {
  const dispatch = useAppDispatch()
  const [selectedAction, setSelectedAction] = useState<LogAction>(defaultAction)
  const [formData, setFormData] = useState<LogData>({})
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedAction(defaultAction)
      setFormData({})
    }
  }, [isOpen, defaultAction])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleInputChange = (field: keyof LogData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const config = actionConfig[selectedAction]
    const hasRequiredFields = config.required.every(field => 
      formData[field as keyof LogData] !== undefined && 
      formData[field as keyof LogData] !== ''
    )

    if (!hasRequiredFields) {
      // Show validation error
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(addPlantLog({
        plantId: plant.id,
        logData: {
          action: selectedAction,
          date: new Date().toISOString(),
          data: formData
        }
      })).unwrap()
      
      onClose()
      setFormData({})
    } catch (error) {
      console.error('Fehler beim Erstellen des Logs:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: string) => {
    switch (field) {
      case 'amount':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Menge (ml)
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>
        )
      
      case 'runoff':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Ablauf (ml)
            </label>
            <input
              type="number"
              value={formData.runoff || ''}
              onChange={(e) => handleInputChange('runoff', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>
        )
      
      case 'temperature':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Temperatur (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature || ''}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="24.0"
            />
          </div>
        )
      
      case 'humidity':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Luftfeuchtigkeit (%)
            </label>
            <input
              type="number"
              value={formData.humidity || ''}
              onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="65"
            />
          </div>
        )
      
      case 'ph':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              pH-Wert
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.ph || ''}
              onChange={(e) => handleInputChange('ph', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="6.2"
            />
          </div>
        )
      
      case 'ec':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              EC (mS/cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.ec || ''}
              onChange={(e) => handleInputChange('ec', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="1.8"
            />
          </div>
        )
      
      case 'vpd':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              VPD (kPa)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.vpd || ''}
              onChange={(e) => handleInputChange('vpd', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="1.2"
            />
          </div>
        )
      
      case 'notes':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Notizen
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Notizen hinzufügen..."
            />
          </div>
        )
      
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div
        ref={sheetRef}
        className="bg-white dark:bg-neutral-900 rounded-t-2xl w-full max-h-[85vh] overflow-hidden slide-up-animation"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-neutral-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Quick-Log für {plant.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label="Schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Action Chips */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Aktion auswählen
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(actionConfig).map(([action, config]) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action as LogAction)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                    selectedAction === action
                      ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-sm font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-4">
            {actionConfig[selectedAction].fields.map(field => (
              <div key={field}>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Media Actions */}
          {['photo', 'video', 'voice'].includes(selectedAction) && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Medien hinzufügen
              </label>
              <div className="flex space-x-3">
                {selectedAction === 'photo' && (
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
                    <span className="text-2xl">📸</span>
                    <span className="text-sm font-medium">Foto aufnehmen</span>
                  </button>
                )}
                {selectedAction === 'video' && (
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
                    <span className="text-2xl">🎥</span>
                    <span className="text-sm font-medium">Video aufnehmen</span>
                  </button>
                )}
                {selectedAction === 'voice' && (
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-100 border-2 border-red-500 text-red-700'
                        : 'border-2 border-dashed border-neutral-300 hover:border-primary-500'
                    }`}
                  >
                    <span className="text-2xl">{isRecording ? '⏹️' : '🎤'}</span>
                    <span className="text-sm font-medium">
                      {isRecording ? 'Aufnahme stoppen' : 'Sprachmemo aufnehmen'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:text-neutral-300 dark:bg-neutral-700 dark:border-neutral-600 dark:hover:bg-neutral-600 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Speichern...' : 'Als Log übernehmen'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
