'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import { motion, AnimatePresence } from 'framer-motion'

import Sidebar from '@/components/navigation/Sidebar'
import BackButton from '@/components/ui/BackButton'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'

// Dynamischer Import der CannabisDiagnosisAnalyzer um Server-Side Import-Probleme zu vermeiden
const CannabisDiagnosisAnalyzer = dynamic(() => import('@/components/diagnosis/CannabisDiagnosisAnalyzer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Lade Diagnose-Tool...</span>
    </div>
  )
});




import { cannabisWateringDatabase } from '@/data/cannabisWateringDatabase'

interface Plant {
  id: string
  name: string
  strain: string
  stage: string
  health: number
  image: string
  potSize: string
  lastWatered: string
  environmentalFactors: {
    temperature: number
    humidity: number
    lightHours: number
  }
}

const mockPlants: Plant[] = [
  { 
    id: '1', 
    name: 'Gorilla Glue #4', 
    strain: 'Hybrid', 
    stage: 'flowering', 
    health: 95, 
    image: '🌿',
    potSize: 'medium',
    lastWatered: '2024-01-26T08:00:00',
    environmentalFactors: {
      temperature: 24,
      humidity: 55,
      lightHours: 12
    }
  },
  { 
    id: '2', 
    name: 'Northern Lights', 
    strain: 'Indica', 
    stage: 'vegetative', 
    health: 88, 
    image: '🌱',
    potSize: 'medium_large',
    lastWatered: '2024-01-25T10:00:00',
    environmentalFactors: {
      temperature: 26,
      humidity: 65,
      lightHours: 18
    }
  },
  { 
    id: '3', 
    name: 'Amnesia Haze', 
    strain: 'Sativa', 
    stage: 'seedling', 
    health: 92, 
    image: '🌱',
    potSize: 'small',
    lastWatered: '2024-01-26T06:00:00',
    environmentalFactors: {
      temperature: 24,
      humidity: 75,
      lightHours: 16
    }
  }
]

export default function DiagnosePage() {


  
  const [selectedPlant, setSelectedPlant] = useState<string>('')



  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'watering' | 'history' | 'treatment'>('ai')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])







  const getPlantHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500'
    if (health >= 75) return 'text-yellow-500'
    if (health >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  const getPlantHealthIcon = (health: number) => {
    if (health >= 90) return '🌿'
    if (health >= 75) return '🌱'
    if (health >= 60) return '🍃'
    return '🥀'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <AnimatedBackground />
      <FloatingIcons />
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-0 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <BackButton />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              🔬 Cannabis-Diagnose
            </h1>
            <p className="text-gray-600 text-lg">
              Wissenschaftlich validierte Diagnose basierend auf Forschung und bewährten Praktiken
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ai', label: 'KI-Diagnose', icon: '🤖' },
                { id: 'manual', label: 'Manuelle Diagnose', icon: '🔍' },
                { id: 'watering', label: 'Bewässerungs-Diagnose', icon: '💧' },
                { id: 'history', label: 'Verlauf', icon: '📊' },
                { id: 'treatment', label: 'Behandlungspläne', icon: '💊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Plant Selection */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">🌱 Pflanze auswählen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockPlants.map((plant) => (
                      <motion.div
                        key={plant.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPlant(plant.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPlant === plant.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-2xl">{plant.image}</div>
                          <div className={`text-sm font-medium ${getPlantHealthColor(plant.health)}`}>
                            {getPlantHealthIcon(plant.health)} {plant.health}%
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800">{plant.name}</h3>
                        <p className="text-sm text-gray-600">{plant.strain}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Phase: {plant.stage}</div>
                          <div>Topf: {plant.potSize}</div>
                          <div>Temp: {plant.environmentalFactors.temperature}°C</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Diagnosis Analyzer */}
                {selectedPlant && (
                  <CannabisDiagnosisAnalyzer
                    plantId={selectedPlant}
                    plantName={mockPlants.find(p => p.id === selectedPlant)?.name || ''}
                    onDiagnosisComplete={(result) => console.log('Diagnosis result:', result)}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'manual' && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Manuelle Symptom-Diagnose</h2>
                  
                  {/* Symptom Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Symptome auswählen:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { category: 'Blätter', symptoms: ['Gelbe Blätter', 'Braune Blattränder', 'Hängende Blätter', 'Welkende Blätter', 'Gekräuselte Blätter'] },
                        { category: 'Wurzeln', symptoms: ['Faulige Wurzeln', 'Weiße Wurzeln', 'Wurzelfäule', 'Wurzelbrand'] },
                        { category: 'Wachstum', symptoms: ['Langsames Wachstum', 'Verzögertes Wachstum', 'Kümmerwuchs', 'Übermäßiges Wachstum'] },
                        { category: 'Blüten', symptoms: ['Verfärbte Blüten', 'Verwelkte Blüten', 'Fehlende Blüten', 'Deformierte Blüten'] }
                      ].map((category) => (
                        <div key={category.category} className="space-y-2">
                          <h4 className="font-medium text-gray-700">{category.category}</h4>
                          {category.symptoms.map((symptom) => (
                            <label key={symptom} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSymptoms([...selectedSymptoms, symptom])
                                  } else {
                                    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
                                  }
                                }}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm text-gray-600">{symptom}</span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Button */}
                  <button
                    onClick={() => {
                      // Hier würde die manuelle Diagnose-Logik implementiert
                      console.log('Selected symptoms:', selectedSymptoms)
                    }}
                    disabled={selectedSymptoms.length === 0}
                    className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    🔍 Diagnose starten ({selectedSymptoms.length} Symptome)
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'watering' && (
              <motion.div
                key="watering"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">💧 Bewässerungs-Diagnose</h2>
                  <p className="text-gray-600 mb-6">
                    Basierend auf der validierten Cannabis-Bewässerungsdatenbank
                  </p>

                  {/* Watering Issues */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-600">⚠️ Überwässerung</h3>
                      <ul className="space-y-2">
                        {cannabisWateringDatabase.care_tips.signs_of_overwatering.map((symptom, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="text-red-500 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-600">🌵 Unterwässerung</h3>
                      <ul className="space-y-2">
                        {cannabisWateringDatabase.care_tips.signs_of_underwatering.map((symptom, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="text-orange-500 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Validated Research Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">🔬 Wissenschaftliche Validierung</h3>
                    <div className="text-sm text-blue-700">
                      <p>Diese Diagnose basiert auf validierten Forschungsergebnissen von:</p>
                      <ul className="mt-2 space-y-1">
                        {cannabisWateringDatabase.metadata.validation_sources.slice(0, 3).map((source, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Diagnose-Verlauf</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Diagnose-Verlauf wird implementiert...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'treatment' && (
              <motion.div
                key="treatment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">💊 Behandlungspläne</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Behandlungspläne werden implementiert...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </div>
      </div>
    </div>
  )
}
