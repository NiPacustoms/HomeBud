'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GrowthPhase {
  id: string
  cycleId: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  startDate: string
  endDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface GrowCycle {
  id: string
  name: string
  plantName: string
  startDate: string
  endDate: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  progress: number
  tasks: any[]
  notes: string
}

interface PhasePlanningModalProps {
  isOpen: boolean
  onClose: () => void
  growCycles: GrowCycle[]
  existingPhases?: GrowthPhase[]
  onSave: (phases: Omit<GrowthPhase, 'id' | 'createdAt' | 'updatedAt'>[]) => void
}

export default function PhasePlanningModal({ 
  isOpen, 
  onClose, 
  growCycles, 
  existingPhases = [], 
  onSave 
}: PhasePlanningModalProps) {
  const [selectedCycle, setSelectedCycle] = useState<string>('')
  const [phases, setPhases] = useState<Omit<GrowthPhase, 'id' | 'createdAt' | 'updatedAt'>[]>([])

  useEffect(() => {
    if (existingPhases.length > 0) {
      setPhases(existingPhases.map(phase => ({
        cycleId: phase.cycleId,
        stage: phase.stage,
        startDate: phase.startDate,
        endDate: phase.endDate,
        notes: phase.notes
      })))
    } else {
      setPhases([])
    }
  }, [existingPhases])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'bg-gray-500'
      case 'seedling': return 'bg-blue-500'
      case 'vegetative': return 'bg-green-500'
      case 'flowering': return 'bg-purple-500'
      case 'harvest': return 'bg-yellow-500'
      case 'completed': return 'bg-green-600'
      default: return 'bg-gray-500'
    }
  }

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'planning': return 'Planung'
      case 'seedling': return 'Keimling'
      case 'vegetative': return 'Vegetativ'
      case 'flowering': return 'Blüte'
      case 'harvest': return 'Ernte'
      case 'completed': return 'Abgeschlossen'
      default: return stage
    }
  }

  const stageOptions = [
    { value: 'planning', name: 'Planung', color: 'bg-gray-500' },
    { value: 'seedling', name: 'Keimling', color: 'bg-blue-500' },
    { value: 'vegetative', name: 'Vegetativ', color: 'bg-green-500' },
    { value: 'flowering', name: 'Blüte', color: 'bg-purple-500' },
    { value: 'harvest', name: 'Ernte', color: 'bg-yellow-500' },
    { value: 'completed', name: 'Abgeschlossen', color: 'bg-green-600' }
  ]

  const addPhase = () => {
    if (!selectedCycle) return

    const newPhase: Omit<GrowthPhase, 'id' | 'createdAt' | 'updatedAt'> = {
      cycleId: selectedCycle,
      stage: 'planning',
      startDate: new Date().toISOString().split('T')[0] as string,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] as string,
      notes: ''
    }

    setPhases(prev => [...prev, newPhase])
  }

  const updatePhase = (index: number, field: keyof GrowthPhase, value: string) => {
    setPhases(prev => prev.map((phase, i) => 
      i === index ? { ...phase, [field]: value } : phase
    ))
  }

  const removePhase = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (phases.length === 0) return
    onSave(phases)
    onClose()
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Wachstumsphasen planen
                </h2>
                <p className="text-white/60 text-sm">
                  Planen Sie die verschiedenen Wachstumsphasen für Ihre Pflanzen
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Modal schließen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cycle Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Grow-Zyklus auswählen
              </label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                aria-label="Grow-Zyklus für Phasenplanung auswählen"
              >
                <option value="">Zyklus auswählen...</option>
                {growCycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name} - {cycle.plantName}
                  </option>
                ))}
              </select>
            </div>

            {/* Phases */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Phasen</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addPhase}
                  disabled={!selectedCycle}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Phase hinzufügen</span>
                </motion.button>
              </div>

              {phases.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <div className="text-4xl mb-4">🌱</div>
                  <p>Noch keine Phasen geplant.</p>
                  <p className="text-sm mt-2">Wählen Sie einen Zyklus aus und fügen Sie Phasen hinzu.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {phases.map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Stage */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Phase
                          </label>
                          <select
                            value={phase.stage}
                            onChange={(e) => updatePhase(index, 'stage', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            aria-label={`Phase ${index + 1} auswählen`}
                          >
                            {stageOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Start Date */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Startdatum
                          </label>
                          <input
                            type="date"
                            value={phase.startDate}
                            onChange={(e) => updatePhase(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            aria-label={`Startdatum für Phase ${index + 1}`}
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Enddatum
                          </label>
                          <input
                            type="date"
                            value={phase.endDate}
                            onChange={(e) => updatePhase(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            aria-label={`Enddatum für Phase ${index + 1}`}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removePhase(index)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* Duration and Color Preview */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded ${getStageColor(phase.stage)}`}></div>
                          <span className="text-white/60 text-sm">
                            {getStageName(phase.stage)}
                          </span>
                          <span className="text-white/40 text-sm">
                            {calculateDuration(phase.startDate, phase.endDate)} Tage
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Notizen
                        </label>
                        <textarea
                          value={phase.notes}
                          onChange={(e) => updatePhase(index, 'notes', e.target.value)}
                          placeholder="Notizen zur Phase..."
                          rows={2}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Abbrechen
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={phases.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Phasen speichern
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
