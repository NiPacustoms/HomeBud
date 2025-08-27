'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cannabisWateringDatabase } from '@/data/cannabisWateringDatabase'
import Card from '@/components/ui/Card'

interface ValidatedResearchInfoProps {
  stage: string
  potSize: string
  onClose: () => void
}

export default function ValidatedResearchInfo({ stage, potSize, onClose }: ValidatedResearchInfoProps) {
  const [activeTab, setActiveTab] = useState<'research' | 'parameters' | 'sources'>('research')

  const stageData = cannabisWateringDatabase.cannabis_stages[stage]
  const potData = cannabisWateringDatabase.pot_sizes[potSize]
  const scheduleData = cannabisWateringDatabase.watering_schedule[stage]?.[potSize]

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">🔬 Wissenschaftliche Validierung</h2>
              <p className="text-blue-100">
                {stageData?.name} - {potData?.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Schließen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'research', label: 'Forschung', icon: '📊' },
              { id: 'parameters', label: 'Parameter', icon: '⚙️' },
              { id: 'sources', label: 'Quellen', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'research' && (
              <motion.div
                key="research"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Validierte Berechnung */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Validierte Berechnung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Wassermenge</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {scheduleData?.water_amount_liters}L
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((scheduleData?.water_amount_liters / scheduleData?.pot_volume_liters) * 100)}% des Topfvolumens
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Intervall</div>
                      <div className="text-2xl font-bold text-green-600">
                        {scheduleData?.base_interval_days} Tage
                      </div>
                      <div className="text-xs text-gray-500">
                        Basierend auf {stageData?.name}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Wissenschaftliche Notizen */}
                {scheduleData?.validated_notes && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Wissenschaftliche Notizen</h3>
                    <ul className="space-y-2">
                      {scheduleData.validated_notes.map((note, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Validierte Anforderungen */}
                {stageData?.validated_requirements && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Optimale Bedingungen</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Temperatur</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.temperature_range.min}-{stageData.validated_requirements.temperature_range.max}°C
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Luftfeuchtigkeit</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.humidity_range.min}-{stageData.validated_requirements.humidity_range.max}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">pH-Wert</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.ph_optimal.min}-{stageData.validated_requirements.ph_optimal.max}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">EC-Wert</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.ec_optimal.min}-{stageData.validated_requirements.ec_optimal.max}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Lichtstunden</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.light_hours.min}-{stageData.validated_requirements.light_hours.max}h
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Bodenfeuchtigkeit</div>
                        <div className="font-semibold text-gray-800">
                          {stageData.validated_requirements.soil_moisture.min}-{stageData.validated_requirements.soil_moisture.max}%
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === 'parameters' && (
              <motion.div
                key="parameters"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Topf-Spezifikationen */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🏺 Topf-Spezifikationen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Volumen</div>
                      <div className="font-semibold text-gray-800">{potData?.volume_liters}L</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Durchmesser</div>
                      <div className="font-semibold text-gray-800">Ø{potData?.diameter_cm}cm</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-600">Drainage-Anforderungen</div>
                      <div className="font-semibold text-gray-800">{potData?.drainage_requirements}</div>
                    </div>
                  </div>
                </Card>

                {/* Validierte Verwendung */}
                {potData?.validated_usage && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Empfohlene Verwendung</h3>
                    <ul className="space-y-1">
                      {potData.validated_usage.map((usage, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {usage}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Validierte Parameter */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ Validierte Parameter</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Bodenfeuchtigkeit-Ziel</div>
                      <div className="font-semibold text-gray-800">
                        {cannabisWateringDatabase.watering_rules.validated_parameters.soil_moisture_target}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">pH-Bereich</div>
                      <div className="font-semibold text-gray-800">
                        {cannabisWateringDatabase.watering_rules.validated_parameters.ph_range.min}-{cannabisWateringDatabase.watering_rules.validated_parameters.ph_range.max}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">EC-Bereich</div>
                      <div className="font-semibold text-gray-800">
                        {cannabisWateringDatabase.watering_rules.validated_parameters.ec_range.min}-{cannabisWateringDatabase.watering_rules.validated_parameters.ec_range.max}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'sources' && (
              <motion.div
                key="sources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Validierungsquellen */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Validierungsquellen</h3>
                  <div className="space-y-3">
                    {cannabisWateringDatabase.metadata.validation_sources.map((source, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-blue-500 text-lg">📖</div>
                        <div>
                          <div className="font-medium text-gray-800">{source}</div>
                          <div className="text-sm text-gray-600">Peer-reviewed Forschung</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Validierte Forschung */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🔬 Validierte Forschung</h3>
                  <div className="space-y-4">
                    {Object.entries(cannabisWateringDatabase.care_tips.validated_research).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-700 mb-2 capitalize">
                          {category.replace('_', ' ')}
                        </h4>
                        <ul className="space-y-1">
                          {items.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Metadaten */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ℹ️ Datenbank-Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{cannabisWateringDatabase.metadata.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Letzte Aktualisierung:</span>
                      <span className="font-medium">{cannabisWateringDatabase.metadata.last_updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Validierungsquellen:</span>
                      <span className="font-medium">{cannabisWateringDatabase.metadata.validation_sources.length}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Vertrauensniveau: 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getConfidenceColor('high')}`}>
                Hoch
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
