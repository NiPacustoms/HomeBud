'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DailyDataEntry from './DailyDataEntry'
import CurrentValuesDisplay from './CurrentValuesDisplay'
import DataVisualization from './DataVisualization'
import MeasurementAnalysis from './MeasurementAnalysis'
import MeasurementReminders from './MeasurementReminders'
import { DailyDataEntry as DailyDataEntryType, MeasurementReminder, MeasurementChecklist } from '@/types/plant'

interface DashboardProps {
  className?: string
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const [dailyData, setDailyData] = useState<DailyDataEntryType[]>([])
  const [reminders, setReminders] = useState<MeasurementReminder[]>([])
  const [checklists, setChecklists] = useState<MeasurementChecklist[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Mock-Daten für Demo
  useEffect(() => {
    // Simuliere vorhandene Daten
    const mockData: DailyDataEntryType[] = [
      {
        id: '1',
        projectId: 'current',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 Tage ago
        growthPhase: 'vegetative',
        growType: 'indoor',
        temperature: 24.5,
        humidity: 65,
        lightLevel: 450,
        ph: 6.2,
        ec: 1.4,
        co2: 800,
        airFlow: 60,
        soilMoisture: 70,
        vpd: 0.9,
        notes: 'Pflanzen wachsen gut',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        projectId: 'current',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 Tage ago
        growthPhase: 'vegetative',
        growType: 'indoor',
        temperature: 25.2,
        humidity: 62,
        lightLevel: 480,
        ph: 6.1,
        ec: 1.5,
        co2: 850,
        airFlow: 65,
        soilMoisture: 75,
        vpd: 1.1,
        notes: 'Lichtintensität erhöht',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        projectId: 'current',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 Tage ago
        growthPhase: 'vegetative',
        growType: 'indoor',
        temperature: 26.1,
        humidity: 58,
        lightLevel: 520,
        ph: 6.3,
        ec: 1.6,
        co2: 900,
        airFlow: 70,
        soilMoisture: 80,
        vpd: 1.3,
        notes: 'Temperatur etwas hoch',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        projectId: 'current',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 Tage ago
        growthPhase: 'flowering',
        growType: 'indoor',
        temperature: 23.8,
        humidity: 52,
        lightLevel: 650,
        ph: 6.0,
        ec: 1.8,
        co2: 1000,
        airFlow: 75,
        soilMoisture: 85,
        vpd: 1.4,
        notes: 'Blütephase gestartet',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        projectId: 'current',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 Tage ago
        growthPhase: 'flowering',
        growType: 'indoor',
        temperature: 24.2,
        humidity: 48,
        lightLevel: 680,
        ph: 6.1,
        ec: 1.9,
        co2: 1100,
        airFlow: 80,
        soilMoisture: 90,
        vpd: 1.5,
        notes: 'Blüten entwickeln sich gut',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        projectId: 'current',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 Tag ago
        growthPhase: 'flowering',
        growType: 'indoor',
        temperature: 23.5,
        humidity: 45,
        lightLevel: 720,
        ph: 6.2,
        ec: 2.0,
        co2: 1150,
        airFlow: 85,
        soilMoisture: 95,
        vpd: 1.6,
        notes: 'Optimaler Zustand',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    setDailyData(mockData)

    // Mock-Erinnerungen
    const mockReminders: MeasurementReminder[] = [
      {
        id: '1',
        type: 'daily',
        title: 'Tägliche Messung',
        description: 'Temperatur, Luftfeuchtigkeit, pH und EC messen',
        frequency: 1,
        nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true,
        measurements: ['temperature', 'humidity', 'ph', 'ec']
      },
      {
        id: '2',
        type: 'weekly',
        title: 'Wöchentliche Kontrolle',
        description: 'Alle Werte inklusive CO₂ und VPD überprüfen',
        frequency: 7,
        nextReminder: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        measurements: ['temperature', 'humidity', 'lightLevel', 'ph', 'ec', 'co2', 'vpd']
      }
    ]

    setReminders(mockReminders)

    // Mock-Checklisten
    const mockChecklists: MeasurementChecklist[] = [
      {
        id: '1',
        title: 'Tägliche Kontrolle',
        items: [
          {
            id: '1',
            title: 'Temperatur messen',
            description: 'Thermometer in Pflanzenhöhe platzieren',
            isCompleted: true,
            category: 'temperature'
          },
          {
            id: '2',
            title: 'Luftfeuchtigkeit prüfen',
            description: 'Hygrometer kalibrieren und messen',
            isCompleted: true,
            category: 'humidity'
          },
          {
            id: '3',
            title: 'pH-Wert kontrollieren',
            description: 'pH-Meter kalibrieren und in Wurzelzone messen',
            isCompleted: false,
            category: 'nutrients'
          },
          {
            id: '4',
            title: 'Lüftung überprüfen',
            description: 'Luftstrom und Ventilation kontrollieren',
            isCompleted: true,
            category: 'ventilation'
          }
        ],
        createdAt: new Date(),
        completedAt: undefined
      }
    ]

    setChecklists(mockChecklists)
  }, [])

  const handleSaveData = (data: Omit<DailyDataEntryType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DailyDataEntryType = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setDailyData(prev => [newEntry, ...prev])
    setShowAnalysis(true)
  }

  const handleAddReminder = (reminder: Omit<MeasurementReminder, 'id'>) => {
    const newReminder: MeasurementReminder = {
      ...reminder,
      id: Date.now().toString()
    }
    setReminders(prev => [...prev, newReminder])
  }

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ))
  }

  const handleCompleteChecklist = (id: string) => {
    setChecklists(prev => prev.map(c => 
      c.id === id ? { ...c, completedAt: new Date() } : c
    ))
  }

  const lastEntry = dailyData[0]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          🏠 HomeBud Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Erweiterte Datenerfassung mit automatischer Analyse und VPD-Berechnung
        </p>
      </motion.div>

      {/* Erweiterte Datenerfassung */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DailyDataEntry
          onSave={handleSaveData}
          lastEntry={lastEntry}
        />
      </motion.div>

      {/* Aktuelle Werte */}
      {lastEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CurrentValuesDisplay
            lastEntry={lastEntry}
          />
        </motion.div>
      )}

      {/* Automatische Analyse */}
      {showAnalysis && lastEntry?.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MeasurementAnalysis
            analysis={lastEntry.analysis}
          />
        </motion.div>
      )}

      {/* Datenvisualisierung */}
      {dailyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DataVisualization
            data={dailyData}
          />
        </motion.div>
      )}

      {/* Erinnerungen & Checklisten */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MeasurementReminders
          reminders={reminders}
          checklists={checklists}
          onAddReminder={handleAddReminder}
          onToggleReminder={handleToggleReminder}
          onCompleteChecklist={handleCompleteChecklist}
        />
      </motion.div>

      {/* Info-Box für neue Funktionen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            🚀 Neue Funktionen verfügbar!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-green-700 dark:text-green-300">
              <div className="font-medium">🌱 Wachstumsphasen</div>
              <div>Automatische Anpassung der Zielwerte</div>
            </div>
            <div className="text-green-700 dark:text-green-300">
              <div className="font-medium">🌡️ VPD-Berechnung</div>
              <div>Wissenschaftliche VPD-Formel</div>
            </div>
            <div className="text-green-700 dark:text-green-300">
              <div className="font-medium">🔍 Automatische Analyse</div>
              <div>Sofortige Bewertung und Empfehlungen</div>
            </div>
            <div className="text-green-700 dark:text-green-300">
              <div className="font-medium">📊 Erweiterte Trends</div>
              <div>Detaillierte Statistiken und Visualisierung</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
