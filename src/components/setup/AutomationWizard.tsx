'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  condition: string
  action: string
  enabled: boolean
}

interface AutomationWizardProps {
  onUpdate: (automation: any) => void
}

export default function AutomationWizard({ onUpdate }: AutomationWizardProps) {
  const [activeTab, setActiveTab] = useState('sensors')
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Temperatur-Kontrolle',
      condition: 'Temperatur > 28°C',
      action: 'Lüfter einschalten',
      enabled: true
    },
    {
      id: '2',
      name: 'Luftfeuchte-Kontrolle',
      condition: 'Luftfeuchte > 70%',
      action: 'Entfeuchter einschalten',
      enabled: true
    },
    {
      id: '3',
      name: 'Lichtzyklus',
      condition: 'Zeit = 06:00',
      action: 'Licht einschalten (18/6)',
      enabled: true
    },
    {
      id: '4',
      name: 'pH-Kontrolle',
      condition: 'pH < 5.8 oder pH > 6.5',
      action: 'pH-Alarm senden',
      enabled: false
    }
  ])

  const sensorTypes = [
    { id: 'temperature', name: 'Temperatur', icon: '🌡️', placement: 'Zeltmitte, 30cm über Pflanzen' },
    { id: 'humidity', name: 'Luftfeuchte', icon: '💧', placement: 'Zeltmitte, 30cm über Pflanzen' },
    { id: 'co2', name: 'CO₂', icon: '🌿', placement: 'Zeltmitte, 50cm über Pflanzen' },
    { id: 'ph', name: 'pH', icon: '🧪', placement: 'Nährstofftank' },
    { id: 'ec', name: 'EC', icon: '⚡', placement: 'Nährstofftank' },
    { id: 'soil_moisture', name: 'Bodenfeuchte', icon: '🌱', placement: 'Topfmitte, 5cm tief' }
  ]

  const automationDevices = [
    { id: 'ventilation', name: 'Belüftung', icon: '💨', type: 'Abluftventilator' },
    { id: 'heating', name: 'Heizung', icon: '🔥', type: 'Heizmatte/Heizlüfter' },
    { id: 'cooling', name: 'Kühlung', icon: '❄️', type: 'Klimaanlage/Ventilator' },
    { id: 'dehumidifier', name: 'Entfeuchter', icon: '💨', type: 'Entfeuchter' },
    { id: 'humidifier', name: 'Befeuchter', icon: '💧', type: 'Ultraschall-Befeuchter' },
    { id: 'lighting', name: 'Beleuchtung', icon: '💡', type: 'LED-Controller' },
    { id: 'watering', name: 'Bewässerung', icon: '🚿', type: 'Dosierpumpe' },
    { id: 'co2_generator', name: 'CO₂-Generator', icon: '🌿', type: 'CO₂-Brenner' }
  ]

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const tabs = [
    { id: 'sensors', label: 'Sensoren', icon: '📡' },
    { id: 'devices', label: 'Geräte', icon: '🔌' },
    { id: 'rules', label: 'Regeln', icon: '⚙️' },
    { id: 'scheduling', label: 'Zeitplan', icon: '⏰' }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">IoT & Automatisierung</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sensor Setup */}
      {activeTab === 'sensors' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Sensor-Platzierung</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensorTypes.map((sensor) => (
              <div key={sensor.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{sensor.icon}</span>
                  <div>
                    <h5 className="text-white font-medium">{sensor.name}</h5>
                    <p className="text-white/60 text-sm">{sensor.placement}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Empfohlen</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Devices */}
      {activeTab === 'devices' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Automatisierungs-Geräte</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationDevices.map((device) => (
              <div key={device.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{device.icon}</span>
                  <div>
                    <h5 className="text-white font-medium">{device.name}</h5>
                    <p className="text-white/60 text-sm">{device.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">Optional</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Regelbasierte Automatisierung</h4>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-white font-medium">{rule.name}</h5>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleRule(rule.id)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      rule.enabled 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {rule.enabled ? (
                      <Check className="w-4 h-4" />
                    ) : (
                                              <X className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Bedingung:</span>
                    <p className="text-white font-medium">{rule.condition}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Aktion:</span>
                    <p className="text-white font-medium">{rule.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:border-white/40 hover:text-white transition-all duration-300"
          >
            + Neue Regel hinzufügen
          </motion.button>
        </div>
      )}

      {/* Scheduling */}
      {activeTab === 'scheduling' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Zeitplan-Management</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h5 className="text-white font-medium mb-3">Lichtzyklus</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Vegetation:</span>
                  <span className="text-white">18h an / 6h aus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Blüte:</span>
                  <span className="text-white">12h an / 12h aus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Startzeit:</span>
                  <span className="text-white">06:00 Uhr</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h5 className="text-white font-medium mb-3">Bewässerung</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Frequenz:</span>
                  <span className="text-white">Alle 2-3 Tage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Zeit:</span>
                  <span className="text-white">08:00 Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Menge:</span>
                  <span className="text-white">20% Abfluss</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h5 className="text-white font-medium mb-3">CO₂-Zeitplan</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-white/80">Ein:</span>
                <span className="text-white">30 min nach Licht</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Aus:</span>
                <span className="text-white">30 min vor Licht aus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Nur in Blüte:</span>
                <span className="text-green-400">Ja</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
