'use client'

import React, { useState, useEffect, useMemo } from 'react'


interface VPDChartProps {
  onVPDChange?: (vpd: number, status: string) => void
  showCalculator?: boolean
}

interface VPDZone {
  min: number
  max: number
  color: string
  label: string
  description: string
  recommendation: string
}

export default function VPDChart({ onVPDChange, showCalculator = true }: VPDChartProps) {
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity] = useState(60)
  const [vpd, setVpd] = useState(0)
  const [status, setStatus] = useState('')

  // Dimlux Lighting VPD-Zonen basierend auf professionellen Cannabis-Growing-Standards
  const vpdZones: VPDZone[] = [
    { 
      min: 0, 
      max: 0.3, 
      color: '#dc2626', 
      label: 'Kritisch niedrig', 
      description: 'Pflanzen können nicht transpirieren, Wurzelfäule möglich',
      recommendation: 'Temperatur erhöhen oder Luftfeuchte senken'
    },
    { 
      min: 0.3, 
      max: 0.6, 
      color: '#ea580c', 
      label: 'Zu niedrig', 
      description: 'Langsames Wachstum, erhöhte Krankheitsanfälligkeit',
      recommendation: 'Temperatur auf 24-26°C erhöhen'
    },
    { 
      min: 0.6, 
      max: 0.8, 
      color: '#f59e0b', 
      label: 'Niedrig (Seedling)', 
      description: 'Gut für Keimlinge und Jungpflanzen',
      recommendation: 'Optimal für die ersten 2-3 Wochen'
    },
    { 
      min: 0.8, 
      max: 1.2, 
      color: '#16a34a', 
      label: 'Optimal (Vegetation)', 
      description: 'Perfekte Bedingungen für vegetatives Wachstum',
      recommendation: 'Ideal für 18/6 Lichtzyklus'
    },
    { 
      min: 1.2, 
      max: 1.6, 
      color: '#059669', 
      label: 'Optimal (Blüte)', 
      description: 'Perfekte Bedingungen für Blüte und Trichombildung',
      recommendation: 'Ideal für 12/12 Lichtzyklus'
    },
    { 
      min: 1.6, 
      max: 2.0, 
      color: '#f59e0b', 
      label: 'Hoch', 
      description: 'Erhöhter Stress, aber noch tolerierbar',
      recommendation: 'Luftfeuchte erhöhen oder Temperatur senken'
    },
    { 
      min: 2.0, 
      max: 2.5, 
      color: '#ea580c', 
      label: 'Sehr hoch', 
      description: 'Starker Stress, Wachstumsstörungen möglich',
      recommendation: 'Sofortige Klimaanpassung erforderlich'
    },
    { 
      min: 2.5, 
      max: 4.0, 
      color: '#dc2626', 
      label: 'Kritisch hoch', 
      description: 'Gefahr für Pflanzen, sofortiges Handeln nötig',
      recommendation: 'Notfall-Klimaanpassung erforderlich'
    }
  ]

  // Dimlux Lighting VPD-Berechnung (präzisere Formel)
  const calculateVPD = (temp: number, hum: number): number => {
    // Verbesserte Magnus-Formel für höhere Präzision
    const a = 17.27
    const b = 237.7
    const saturationVaporPressure = 0.6108 * Math.exp((a * temp) / (temp + b))
    const actualVaporPressure = saturationVaporPressure * (hum / 100)
    return Math.max(0, saturationVaporPressure - actualVaporPressure)
  }

  const getVPDZone = (vpdValue: number): VPDZone => {
    const zone = vpdZones.find(zone => vpdValue >= zone.min && vpdValue < zone.max)
    return zone || vpdZones[3]!
  }

  // Memoized chart data für bessere Performance
  const chartData = useMemo(() => {
    const data = []
    for (let temp = 15; temp <= 35; temp += 0.5) {
      for (let hum = 30; hum <= 95; hum += 1) {
        const vpdValue = calculateVPD(temp, hum)
        const zone = getVPDZone(vpdValue)
        data.push({
          temp,
          hum,
          vpd: vpdValue,
          color: zone.color,
          zone: zone.label
        })
      }
    }
    return data
  }, [])

  useEffect(() => {
    const calculatedVPD = calculateVPD(temperature, humidity)
    setVpd(calculatedVPD)
    const zone = getVPDZone(calculatedVPD)
    setStatus(zone.label)
    
    if (onVPDChange) {
      onVPDChange(calculatedVPD, zone.label)
    }
  }, [temperature, humidity, onVPDChange])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">VPD-Chart (Dimlux Lighting Standard)</h3>
        <p className="text-white/60">Professioneller VPD-Chart basierend auf Dimlux Lighting Standards</p>
      </div>

      {/* VPD Calculator */}
      {showCalculator && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-lg font-semibold text-white mb-4">Temperatur (°C)</h4>
            <input
              type="range"
              min="15"
              max="35"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full mb-2"
              aria-label="Temperatur einstellen"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>15°C</span>
              <span className="text-green-400 font-medium">{temperature}°C</span>
              <span>35°C</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-lg font-semibold text-white mb-4">Luftfeuchte (%)</h4>
            <input
              type="range"
              min="30"
              max="95"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="w-full mb-2"
              aria-label="Luftfeuchte einstellen"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>30%</span>
              <span className="text-green-400 font-medium">{humidity}%</span>
              <span>95%</span>
            </div>
          </div>
        </div>
      )}

      {/* Current VPD Display */}
      <div className="text-center mb-6">
        <div className="inline-block p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-4xl font-bold text-white mb-2">{vpd.toFixed(2)} kPa</div>
          <div className={`text-lg font-medium ${getVPDZone(vpd).color === '#16a34a' || getVPDZone(vpd).color === '#059669' ? 'text-green-400' : getVPDZone(vpd).color === '#dc2626' ? 'text-red-400' : 'text-orange-400'}`}>
            {status}
          </div>
          <p className="text-white/60 text-sm mt-2">{getVPDZone(vpd).description}</p>
          <p className="text-blue-400 text-xs mt-1">{getVPDZone(vpd).recommendation}</p>
        </div>
      </div>

      {/* Interactive VPD Chart */}
      <div className="relative">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">VPD-Chart (Dimlux Standard)</h4>
          
          {/* Chart Container */}
          <div className="relative w-full h-96 bg-black/20 rounded-lg overflow-hidden">
            {/* Chart Grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" aria-label="VPD-Chart">
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* VPD Zones */}
              {chartData.map((point, index) => (
                <circle
                  key={index}
                  cx={(point.temp - 15) * 10 + 20}
                  cy={300 - (point.hum - 30) * 3.85}
                  r="1"
                  fill={point.color}
                  opacity="0.7"
                />
              ))}
              
              {/* Current Point */}
              <circle
                cx={(temperature - 15) * 10 + 20}
                cy={300 - (humidity - 30) * 3.85}
                r="4"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              
              {/* Axes */}
              <line x1="20" y1="20" x2="20" y2="280" stroke="white" strokeWidth="2" />
              <line x1="20" y1="280" x2="380" y2="280" stroke="white" strokeWidth="2" />
              
              {/* Axis Labels */}
              <text x="10" y="150" fill="white" fontSize="12" transform="rotate(-90, 10, 150)">
                Luftfeuchte (%)
              </text>
              <text x="200" y="295" fill="white" fontSize="12" textAnchor="middle">
                Temperatur (°C)
              </text>
              
              {/* Temperature Scale */}
              {[15, 20, 25, 30, 35].map(temp => (
                <g key={temp}>
                  <line
                    x1={(temp - 15) * 10 + 20}
                    y1="275"
                    x2={(temp - 15) * 10 + 20}
                    y2="285"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={(temp - 15) * 10 + 20}
                    y="295"
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {temp}°
                  </text>
                </g>
              ))}
              
              {/* Humidity Scale */}
              {[30, 45, 60, 75, 90].map(hum => (
                <g key={hum}>
                  <line
                    x1="15"
                    y1={300 - (hum - 30) * 3.85}
                    x2="25"
                    y2={300 - (hum - 30) * 3.85}
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x="10"
                    y={300 - (hum - 30) * 3.85 + 3}
                    fill="white"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {hum}%
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* VPD Zones Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vpdZones.map((zone, index) => (
          <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: zone.color }}
              ></div>
              <h5 className="text-white font-medium text-sm">{zone.label}</h5>
            </div>
            <p className="text-white/60 text-xs">{zone.description}</p>
            <p className="text-white/40 text-xs mt-1">{zone.min.toFixed(1)} - {zone.max.toFixed(1)} kPa</p>
            <p className="text-blue-400 text-xs mt-1">{zone.recommendation}</p>
          </div>
        ))}
      </div>

      {/* Dimlux Lighting Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <h4 className="text-green-400 font-semibold mb-3">🌱 Vegetationsphase (18/6)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/80">Optimaler VPD:</span>
              <span className="text-white">0.8 - 1.2 kPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Temperatur:</span>
              <span className="text-white">22 - 26°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Luftfeuchte:</span>
              <span className="text-white">60 - 70%</span>
            </div>
            <div className="text-blue-400 text-xs mt-2">
              💡 Dimlux Tipp: Höhere Luftfeuchte fördert vegetatives Wachstum
            </div>
          </div>
        </div>

        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
          <h4 className="text-purple-400 font-semibold mb-3">🌸 Blütephase (12/12)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/80">Optimaler VPD:</span>
              <span className="text-white">1.2 - 1.6 kPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Temperatur:</span>
              <span className="text-white">20 - 28°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Luftfeuchte:</span>
              <span className="text-white">40 - 60%</span>
            </div>
            <div className="text-blue-400 text-xs mt-2">
              💡 Dimlux Tipp: Niedrigere Luftfeuchte fördert Trichombildung
            </div>
          </div>
        </div>
      </div>

      {/* Dimlux Professional Tips */}
      <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <h4 className="text-blue-400 font-semibold mb-3">💡 Dimlux Professional VPD-Tipps</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <h5 className="text-white font-medium mb-2">VPD zu niedrig? (0.0-0.6 kPa)</h5>
            <ul className="space-y-1">
              <li>• Temperatur um 2-3°C erhöhen</li>
              <li>• Luftfeuchte um 10-15% senken</li>
              <li>• Belüftung verstärken</li>
              <li>• Entfeuchter einschalten</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium mb-2">VPD zu hoch? (1.8+ kPa)</h5>
            <ul className="space-y-1">
              <li>• Temperatur um 2-3°C senken</li>
              <li>• Luftfeuchte um 10-15% erhöhen</li>
              <li>• Befeuchter einschalten</li>
              <li>• Belüftung reduzieren</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-xs">
            <strong>Dimlux Pro-Tipp:</strong> VPD sollte über 24 Stunden konstant gehalten werden. 
            Schwankungen von mehr als ±0.3 kPa können Stress verursachen.
          </p>
        </div>
      </div>
    </div>
  )
}
