'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { completeTreatmentStep, updateTreatmentPlan } from '@/store/slices/diagnosisSlice'

import { TreatmentPlan } from '@/store/slices/diagnosisSlice'

interface TreatmentPlanManagerProps {
  plan: TreatmentPlan
  onUpdate?: (plan: TreatmentPlan) => void
}

export default function TreatmentPlanManager({ plan, onUpdate }: TreatmentPlanManagerProps) {
  const dispatch = useDispatch()
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [showNotes, setShowNotes] = useState<string | null>(null)

  const handleCompleteStep = async (stepId: string) => {
    try {
      dispatch(completeTreatmentStep({ planId: plan.id, stepId }))
      onUpdate?.(plan)
    } catch (error) {
      console.error('Schritt als abgeschlossen markieren fehlgeschlagen:', error)
    }
  }

  const handleAddNotes = async (stepId: string, notes: string) => {
    try {
      dispatch(updateTreatmentPlan({
        id: plan.id,
        updates: {
          steps: plan.steps.map(step => 
            step.id === stepId ? { ...step, notes } : step
          )
        }
      }))
      setShowNotes(null)
      onUpdate?.(plan)
    } catch (error) {
      console.error('Notizen hinzufügen fehlgeschlagen:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'Sofort'
      case 'high': return 'Hoch'
      case 'medium': return 'Mittel'
      case 'low': return 'Niedrig'
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500 text-white'
      case 'completed': return 'bg-green-500 text-white'
      case 'paused': return 'bg-yellow-500 text-black'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'completed': return 'Abgeschlossen'
      case 'paused': return 'Pausiert'
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Behandlungsplan</h3>
          <p className="text-white/60 text-sm">
            Erstellt am {new Date(plan.createdAt).toLocaleDateString('de-DE')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
            {getStatusText(plan.status)}
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{Math.round(plan.progress)}%</div>
            <div className="text-white/60 text-sm">Fortschritt</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-white/10 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${plan.progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {plan.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="text-white/60 text-sm">{step.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(step.priority)}`}>
                    {getPriorityText(step.priority)}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>⏱️ {step.estimatedDuration}</span>
                  {step.completed && step.completedAt && (
                    <span>✅ {new Date(step.completedAt).toLocaleDateString('de-DE')}</span>
                  )}
                </div>

                {/* Notes */}
                {step.notes && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <p className="text-white/80 text-sm">
                      <strong>Notizen:</strong> {step.notes}
                    </p>
                  </div>
                )}

                {/* Expandable Details */}
                <AnimatePresence>
                  {expandedStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3"
                    >
                      <div className="p-3 bg-white/5 rounded-lg">
                        <h5 className="font-medium text-white mb-2">Detaillierte Anweisungen:</h5>
                        <p className="text-white/80 text-sm">{step.description}</p>
                      </div>

                      {/* Add Notes */}
                      {showNotes === step.id ? (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Notizen hinzufügen..."
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowNotes(null)}
                              className="px-3 py-1 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition-all duration-300"
                            >
                              Abbrechen
                            </button>
                            <button
                              onClick={() => {
                                const textarea = document.querySelector(`textarea[placeholder="Notizen hinzufügen..."]`) as HTMLTextAreaElement
                                if (textarea) {
                                  handleAddNotes(step.id, textarea.value)
                                }
                              }}
                              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300"
                            >
                              Speichern
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowNotes(step.id)}
                          className="text-sm text-green-400 hover:text-green-300 transition-colors duration-300"
                        >
                          + Notizen hinzufügen
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-end space-y-2 ml-4">
                {!step.completed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCompleteStep(step.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    Abschließen
                  </motion.button>
                ) : (
                  <span className="text-green-400 text-sm font-medium">✓ Abgeschlossen</span>
                )}

                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  {expandedStep === step.id ? '▼' : '▶'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <h4 className="font-semibold text-white mb-2">Zusammenfassung</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-white/60">Gesamt Schritte</div>
            <div className="text-white font-medium">{plan.steps.length}</div>
          </div>
          <div>
            <div className="text-white/60">Abgeschlossen</div>
            <div className="text-white font-medium">{plan.steps.filter(s => s.completed).length}</div>
          </div>
          <div>
            <div className="text-white/60">Verbleibend</div>
            <div className="text-white font-medium">{plan.steps.filter(s => !s.completed).length}</div>
          </div>
          <div>
            <div className="text-white/60">Fortschritt</div>
            <div className="text-white font-medium">{Math.round(plan.progress)}%</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          Plan pausieren
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          Plan bearbeiten
        </motion.button>
      </div>
    </motion.div>
  )
}
