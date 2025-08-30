'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '@/store/store'
import { createTreatmentPlan, submitFeedback } from '@/store/slices/diagnosisSlice'
import { DiagnosisResult } from '@/store/slices/diagnosisSlice'

interface DiagnosisResultsProps {
  diagnosis: DiagnosisResult
  onClose?: () => void
}

export default function DiagnosisResults({ diagnosis }: DiagnosisResultsProps) {
  const dispatch = useAppDispatch()
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState({ accuracy: 5, helpfulness: 5, comments: '' })

  const handleCreateTreatmentPlan = async () => {
    try {
      await dispatch(createTreatmentPlan(diagnosis.id)).unwrap()
    } catch (error) {
      console.error('Behandlungsplan erstellen fehlgeschlagen:', error)
    }
  }

  const handleSubmitFeedback = async () => {
    try {
      await dispatch(submitFeedback({
        diagnosisId: diagnosis.id,
        ...feedback
      })).unwrap()
      setShowFeedback(false)
    } catch (error) {
      console.error('Feedback senden fehlgeschlagen:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'from-green-500 to-emerald-600'
      case 'medium': return 'from-yellow-500 to-orange-600'
      case 'high': return 'from-red-500 to-pink-600'
      case 'critical': return 'from-red-600 to-red-800'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Gering'
      case 'medium': return 'Mittel'
      case 'high': return 'Hoch'
      case 'critical': return 'Kritisch'
      default: return severity
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">KI-Diagnose Ergebnisse</h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateTreatmentPlan}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            Behandlungsplan erstellen
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFeedback(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Feedback geben
          </motion.button>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className={`bg-gradient-to-r ${getSeverityColor(diagnosis.severity)} p-6 rounded-xl text-white mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold">{diagnosis.primaryIssue}</h4>
            <p className="text-white/90">Gesundheit: {diagnosis.overallHealth}%</p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {getSeverityText(diagnosis.severity)}
            </span>
            <p className="text-sm text-white/80 mt-1">KI-Konfidenz: {diagnosis.confidence}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrient Deficiencies */}
        {diagnosis.nutrientDeficiencies.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">🌱 Nährstoffmängel</h4>
            {diagnosis.nutrientDeficiencies.map((deficiency, index) => (
              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">{deficiency.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(deficiency.severity)} text-white`}>
                    {getSeverityText(deficiency.severity)}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-2">Konfidenz: {deficiency.confidence}%</p>
                <ul className="text-sm text-white/60 space-y-1">
                  {deficiency.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Pest Infestations */}
        {diagnosis.pestInfestations.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">🕷️ Schädlingsbefall</h4>
            {diagnosis.pestInfestations.map((pest, index) => (
              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">{pest.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(pest.severity)} text-white`}>
                    {getSeverityText(pest.severity)}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-2">Konfidenz: {pest.confidence}%</p>
                <div className="text-sm text-white/60">
                  <p className="font-medium mb-1">Behandlung:</p>
                  <ul className="space-y-1">
                    {pest.treatment.map((treatment, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disease Infections */}
        {diagnosis.diseaseInfections.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">🦠 Krankheiten</h4>
            {diagnosis.diseaseInfections.map((disease, index) => (
              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">{disease.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(disease.severity)} text-white`}>
                    {getSeverityText(disease.severity)}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-2">Konfidenz: {disease.confidence}%</p>
                <div className="text-sm text-white/60">
                  <p className="font-medium mb-1">Behandlung:</p>
                  <ul className="space-y-1">
                    {disease.treatment.map((treatment, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Environmental Issues */}
        {diagnosis.environmentalIssues.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">🌡️ Umweltprobleme</h4>
            {diagnosis.environmentalIssues.map((issue, index) => (
              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">{issue.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(issue.severity)} text-white`}>
                    {getSeverityText(issue.severity)}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-2">Konfidenz: {issue.confidence}%</p>
                <div className="text-sm text-white/60">
                  <p className="font-medium mb-1">Empfehlungen:</p>
                  <ul className="space-y-1">
                    {issue.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Recommendations */}
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-white">📋 Empfohlene Maßnahmen</h4>
        
        {diagnosis.immediateActions.length > 0 && (
          <div>
            <h5 className="text-red-400 font-medium mb-2">⚡ Sofortmaßnahmen</h5>
            <ul className="space-y-2">
              {diagnosis.immediateActions.map((action, index) => (
                <li key={index} className="flex items-center space-x-2 text-white/80">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis.shortTermActions.length > 0 && (
          <div>
            <h5 className="text-yellow-400 font-medium mb-2">📅 Kurzfristige Maßnahmen</h5>
            <ul className="space-y-2">
              {diagnosis.shortTermActions.map((action, index) => (
                <li key={index} className="flex items-center space-x-2 text-white/80">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis.longTermActions.length > 0 && (
          <div>
            <h5 className="text-green-400 font-medium mb-2">🌱 Langfristige Maßnahmen</h5>
            <ul className="space-y-2">
              {diagnosis.longTermActions.map((action, index) => (
                <li key={index} className="flex items-center space-x-2 text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Feedback zur KI-Diagnose</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Wie genau war die Diagnose? (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedback({ ...feedback, accuracy: rating })}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          feedback.accuracy >= rating
                            ? 'bg-yellow-500 border-yellow-500 text-white'
                            : 'border-white/20 text-white/60 hover:border-white/40'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Wie hilfreich waren die Empfehlungen? (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedback({ ...feedback, helpfulness: rating })}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          feedback.helpfulness >= rating
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-white/20 text-white/60 hover:border-white/40'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Zusätzliche Kommentare (optional)
                  </label>
                  <textarea
                    value={feedback.comments}
                    onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                    placeholder="Ihre Anmerkungen helfen uns, die KI zu verbessern..."
                    className="w-full h-20 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitFeedback}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    Feedback senden
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
