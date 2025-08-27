'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface TrainingTask {
  id: string
  name: string
  description: string
  week: number
  day: number
  completed: boolean
  type: 'lst' | 'scrog' | 'topping' | 'defoliation'
}

interface TrainingAssistantProps {
  onUpdate: (training: any) => void
}

export default function TrainingAssistant({ onUpdate }: TrainingAssistantProps) {
  const [activeTab, setActiveTab] = useState('lst')
  const [trainingTasks, setTrainingTasks] = useState<TrainingTask[]>([
    {
      id: '1',
      name: 'Erstes Topping',
      description: 'Haupttrieb nach 4. Nodien abschneiden',
      week: 3,
      day: 1,
      completed: false,
      type: 'topping'
    },
    {
      id: '2',
      name: 'LST Start',
      description: 'Haupttrieb vorsichtig zur Seite biegen',
      week: 3,
      day: 3,
      completed: false,
      type: 'lst'
    },
    {
      id: '3',
      name: 'SCROG-Netz installieren',
      description: 'Netz 20cm über Pflanzen anbringen',
      week: 4,
      day: 1,
      completed: false,
      type: 'scrog'
    },
    {
      id: '4',
      name: 'Zweites Topping',
      description: 'Seitentriebe nach 3. Nodien toppen',
      week: 4,
      day: 7,
      completed: false,
      type: 'topping'
    },
    {
      id: '5',
      name: 'SCROG-Training',
      description: 'Triebe durch Netz führen und verteilen',
      week: 5,
      day: 1,
      completed: false,
      type: 'scrog'
    },
    {
      id: '6',
      name: 'Entlaubung (Unterbereich)',
      description: 'Untere Blätter entfernen für bessere Luftzirkulation',
      week: 6,
      day: 1,
      completed: false,
      type: 'defoliation'
    }
  ])

  const toggleTask = (taskId: string) => {
    setTrainingTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const tabs = [
    { id: 'lst', label: 'LST', icon: '🌱', description: 'Low Stress Training' },
    { id: 'scrog', label: 'SCROG', icon: '🕸️', description: 'Screen of Green' },
    { id: 'topping', label: 'Topping', icon: '✂️', description: 'Triebspitzen entfernen' },
    { id: 'defoliation', label: 'Entlaubung', icon: '🍃', description: 'Blattentfernung' },
    { id: 'schedule', label: 'Zeitplan', icon: '📅', description: 'Training-Kalender' }
  ]

  const lstGuide = [
    { step: 1, title: 'Warten auf 4-5 Nodien', description: 'Pflanze sollte mindestens 4 Nodien haben' },
    { step: 2, title: 'Vorsichtig biegen', description: 'Haupttrieb sanft zur Seite biegen, nicht brechen' },
    { step: 3, title: 'Fixieren', description: 'Mit Draht oder Kabelbinder fixieren' },
    { step: 4, title: 'Wiederholen', description: 'Alle 2-3 Tage nachjustieren' }
  ]

  const scrogGuide = [
    { step: 1, title: 'Netz installieren', description: '20-30cm über Pflanzen anbringen' },
    { step: 2, title: 'Triebe führen', description: 'Wachsende Triebe durch Maschen führen' },
    { step: 3, title: 'Verteilen', description: 'Triebe gleichmäßig über Netz verteilen' },
    { step: 4, title: 'Trimmen', description: 'Überstehende Triebe abschneiden' }
  ]

  const toppingGuide = [
    { step: 1, title: 'Richtigen Zeitpunkt wählen', description: 'Nach 4-6 Nodien, nicht zu früh' },
    { step: 2, title: 'Sauber schneiden', description: 'Mit steriler Schere direkt über Nodien' },
    { step: 3, title: 'Warten', description: 'Pflanze 3-5 Tage zur Erholung lassen' },
    { step: 4, title: 'Weiteres Training', description: 'Neue Triebe für LST vorbereiten' }
  ]

  const getTasksByType = (type: string) => {
    return trainingTasks.filter(task => task.type === type)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Training-Assistent</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* LST Guide */}
      {activeTab === 'lst' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Low Stress Training (LST)</h4>
          <div className="grid gap-4">
            {lstGuide.map((guide, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {guide.step}
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{guide.title}</h5>
                    <p className="text-white/60 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h5 className="text-green-400 font-medium mb-2">💡 Tipp</h5>
            <p className="text-white/80 text-sm">
              LST sollte täglich überprüft und nachjustiert werden. Die Pflanze wächst schnell und 
              Triebe können sich aus der gewünschten Position lösen.
            </p>
          </div>
        </div>
      )}

      {/* SCROG Guide */}
      {activeTab === 'scrog' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Screen of Green (SCROG)</h4>
          <div className="grid gap-4">
            {scrogGuide.map((guide, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {guide.step}
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{guide.title}</h5>
                    <p className="text-white/60 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h5 className="text-white font-medium mb-2">Netz-Spezifikationen</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Maschenweite:</span>
                  <span className="text-white">5x5cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Höhe:</span>
                  <span className="text-white">20-30cm über Pflanzen</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Material:</span>
                  <span className="text-white">Nylon oder Draht</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h5 className="text-white font-medium mb-2">SCROG-Vorteile</h5>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Maximale Lichtausnutzung</li>
                <li>• Gleichmäßige Blütenbildung</li>
                <li>• Höhere Erträge</li>
                <li>• Bessere Luftzirkulation</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Topping Guide */}
      {activeTab === 'topping' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Topping & Fimming</h4>
          <div className="grid gap-4">
            {toppingGuide.map((guide, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {guide.step}
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{guide.title}</h5>
                    <p className="text-white/60 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h5 className="text-red-400 font-medium mb-2">⚠️ Wichtig</h5>
            <p className="text-white/80 text-sm">
              Topping ist irreversibel. Stelle sicher, dass die Pflanze gesund und stark genug ist. 
              Nicht während der Blütephase durchführen.
            </p>
          </div>
        </div>
      )}

      {/* Defoliation Guide */}
      {activeTab === 'defoliation' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Entlaubung (Defoliation)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-white font-medium">Wann entlauben?</h5>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h6 className="text-green-400 font-medium">Woche 1-2 (Vegetation)</h6>
                  <p className="text-white/60 text-sm">Untere Blätter entfernen für bessere Luftzirkulation</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h6 className="text-green-400 font-medium">Woche 3-4 (Blütebeginn)</h6>
                  <p className="text-white/60 text-sm">Große Schattenblätter entfernen</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h6 className="text-green-400 font-medium">Woche 6-7 (Mittelblüte)</h6>
                  <p className="text-white/60 text-sm">Innere Blätter für Lichtdurchlässigkeit</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-white font-medium">Entlaubungs-Regeln</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Maximal 20-30% der Blätter entfernen</li>
                <li>• Nur gesunde Pflanzen entlauben</li>
                <li>• Nicht während Stress-Phasen</li>
                <li>• Saubere, sterile Werkzeuge verwenden</li>
                <li>• Nach Entlaubung 3-5 Tage warten</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Training Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Training-Zeitplan</h4>
          
          <div className="space-y-4">
            {trainingTasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  task.completed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-white/40 hover:border-white/60'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 text-white" />}
                    </motion.button>
                    <div>
                      <h5 className={`font-medium ${task.completed ? 'text-green-400' : 'text-white'}`}>
                        {task.name}
                      </h5>
                      <p className="text-white/60 text-sm">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-sm">Woche {task.week}</div>
                    <div className="text-white/60 text-sm">Tag {task.day}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
