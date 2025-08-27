'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface ParameterCalculatorProps {
  parameters: {
    ppfd: number
    vpd: number
    ph: number
    ec: number
    co2: number
    temperature: number
    humidity: number
  }
  onUpdate: (parameters: any) => void
}

export default function ParameterCalculator({ parameters, onUpdate }: ParameterCalculatorProps) {
  const [activeTab, setActiveTab] = useState('ppfd')

  const calculateVPD = (temp: number, humidity: number) => {
    // Vereinfachte VPD-Berechnung
    const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3))
    const actualVaporPressure = saturationVaporPressure * (humidity / 100)
    return saturationVaporPressure - actualVaporPressure
  }

  const getVPDStatus = (vpd: number, phase: 'veg' | 'flower') => {
    const ranges = {
      veg: { min: 0.8, max: 1.1 },
      flower: { min: 1.2, max: 1.6 }
    }
    const range = ranges[phase]
    
    if (vpd < range.min) return { status: 'low', color: 'text-red-400', message: 'VPD zu niedrig - erhöhe Temperatur oder senke Luftfeuchte' }
    if (vpd > range.max) return { status: 'high', color: 'text-red-400', message: 'VPD zu hoch - senke Temperatur oder erhöhe Luftfeuchte' }
    return { status: 'optimal', color: 'text-green-400', message: 'VPD im optimalen Bereich' }
  }

  const getPPFDStatus = (ppfd: number, phase: 'veg' | 'flower') => {
    const ranges = {
      veg: { min: 200, max: 600 },
      flower: { min: 600, max: 1000 }
    }
    const range = ranges[phase]
    
    if (ppfd < range.min) return { status: 'low', color: 'text-red-400', message: 'PPFD zu niedrig - erhöhe LED-Leistung' }
    if (ppfd > range.max) return { status: 'high', color: 'text-red-400', message: 'PPFD zu hoch - reduziere LED-Leistung' }
    return { status: 'optimal', color: 'text-green-400', message: 'PPFD im optimalen Bereich' }
  }

  const tabs = [
    { id: 'ppfd', label: 'PPFD', icon: '💡' },
    { id: 'vpd', label: 'VPD', icon: '🌡️' },
    { id: 'nutrients', label: 'Nährstoffe', icon: '🧪' },
    { id: 'climate', label: 'Klima', icon: '🌬️' }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Wissenschaftliche Parameter</h3>
      
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

      {/* PPFD Calculator */}
      {activeTab === 'ppfd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Vegetationsphase</h4>
              <div className="space-y-2">
                <label className="text-white/80">PPFD (μmol/m²/s)</label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  value={parameters.ppfd}
                  onChange={(e) => onUpdate({ ...parameters, ppfd: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60">
                  <span>100</span>
                  <span className="text-green-400 font-medium">{parameters.ppfd}</span>
                  <span>800</span>
                </div>
              </div>
              {(() => {
                const status = getPPFDStatus(parameters.ppfd, 'veg')
                return (
                  <div className={`p-3 rounded-lg bg-white/5 ${status.color}`}>
                    <p className="text-sm">{status.message}</p>
                  </div>
                )
              })()}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Blütephase</h4>
              <div className="space-y-2">
                <label className="text-white/80">PPFD (μmol/m²/s)</label>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  value={parameters.ppfd + 200}
                  onChange={(e) => onUpdate({ ...parameters, ppfd: parseInt(e.target.value) - 200 })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60">
                  <span>400</span>
                  <span className="text-green-400 font-medium">{parameters.ppfd + 200}</span>
                  <span>1200</span>
                </div>
              </div>
              {(() => {
                const status = getPPFDStatus(parameters.ppfd + 200, 'flower')
                return (
                  <div className={`p-3 rounded-lg bg-white/5 ${status.color}`}>
                    <p className="text-sm">{status.message}</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* VPD Calculator */}
      {activeTab === 'vpd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Temperatur (°C)</h4>
              <input
                type="range"
                min="18"
                max="32"
                value={parameters.temperature}
                onChange={(e) => onUpdate({ ...parameters, temperature: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>18°C</span>
                <span className="text-green-400 font-medium">{parameters.temperature}°C</span>
                <span>32°C</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Luftfeuchte (%)</h4>
              <input
                type="range"
                min="30"
                max="80"
                value={parameters.humidity}
                onChange={(e) => onUpdate({ ...parameters, humidity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>30%</span>
                <span className="text-green-400 font-medium">{parameters.humidity}%</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/5 rounded-lg">
              <h5 className="text-white font-medium mb-2">Vegetation VPD</h5>
              {(() => {
                const vpd = calculateVPD(parameters.temperature, parameters.humidity)
                const status = getVPDStatus(vpd, 'veg')
                return (
                  <div>
                    <p className={`text-2xl font-bold ${status.color}`}>{vpd.toFixed(2)} kPa</p>
                    <p className={`text-sm ${status.color}`}>{status.message}</p>
                  </div>
                )
              })()}
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <h5 className="text-white font-medium mb-2">Blüte VPD</h5>
              {(() => {
                const vpd = calculateVPD(parameters.temperature, parameters.humidity)
                const status = getVPDStatus(vpd, 'flower')
                return (
                  <div>
                    <p className={`text-2xl font-bold ${status.color}`}>{vpd.toFixed(2)} kPa</p>
                    <p className={`text-sm ${status.color}`}>{status.message}</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Nutrients */}
      {activeTab === 'nutrients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">pH-Wert</h4>
              <input
                type="range"
                min="5.5"
                max="7.0"
                step="0.1"
                value={parameters.ph}
                onChange={(e) => onUpdate({ ...parameters, ph: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>5.5</span>
                <span className="text-green-400 font-medium">{parameters.ph}</span>
                <span>7.0</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm text-green-400">
                  {parameters.ph < 6.0 ? 'pH zu niedrig - erhöhe mit pH-Up' : 
                   parameters.ph > 6.5 ? 'pH zu hoch - senke mit pH-Down' : 
                   'pH im optimalen Bereich (6.0-6.5)'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">EC-Wert (mS/cm)</h4>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={parameters.ec}
                onChange={(e) => onUpdate({ ...parameters, ec: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>0.8</span>
                <span className="text-green-400 font-medium">{parameters.ec}</span>
                <span>2.5</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm text-green-400">
                  {parameters.ec < 1.0 ? 'EC zu niedrig - erhöhe Nährstoffkonzentration' : 
                   parameters.ec > 2.0 ? 'EC zu hoch - reduziere Nährstoffkonzentration' : 
                   'EC im optimalen Bereich (1.0-2.0)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Climate */}
      {activeTab === 'climate' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">CO₂ (ppm)</h4>
              <input
                type="range"
                min="400"
                max="1500"
                value={parameters.co2}
                onChange={(e) => onUpdate({ ...parameters, co2: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>400</span>
                <span className="text-green-400 font-medium">{parameters.co2}</span>
                <span>1500</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm text-green-400">
                  {parameters.co2 < 800 ? 'CO₂ zu niedrig für optimale Photosynthese' : 
                   parameters.co2 > 1200 ? 'CO₂ zu hoch - reduziere Dosierung' : 
                   'CO₂ im optimalen Bereich (800-1200 ppm)'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Klima-Profil</h4>
              <div className="p-4 bg-white/5 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Vegetation:</span>
                  <span className="text-white">22-26°C, 60-70% rF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Blüte:</span>
                  <span className="text-white">20-28°C, 40-60% rF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Trocknung:</span>
                  <span className="text-white">18-22°C, 50-60% rF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
