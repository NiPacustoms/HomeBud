'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui'
import { Button, Badge } from '@/components/ui'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Thermometer,
  Droplets,
  Sun,
  Zap,
  Leaf,
  LineChart,
  PieChart,
  BarChart,
  Download,
  Share2,
  Settings
} from '@/components/ui/icons'

interface KPIData {
  yieldForecast: {
    current: number
    target: number
    trend: 'up' | 'down' | 'stable'
    unit: string
  }
  growthCurve: {
    current: number
    target: number
    trend: 'up' | 'down' | 'stable'
    unit: string
  }
  efficiency: {
    current: number
    target: number
    trend: 'up' | 'down' | 'stable'
    unit: string
  }
  quality: {
    current: number
    target: number
    trend: 'up' | 'down' | 'stable'
    unit: string
  }
}

interface MeasurementData {
  temperature: number[]
  humidity: number[]
  vpd: number[]
  light: number[]
  co2: number[]
  ph: number[]
  ec: number[]
  timestamps: string[]
}

interface OptimalRanges {
  temperature: { min: number; max: number; optimal: number }
  humidity: { min: number; max: number; optimal: number }
  vpd: { min: number; max: number; optimal: number }
  light: { min: number; max: number; optimal: number }
  co2: { min: number; max: number; optimal: number }
  ph: { min: number; max: number; optimal: number }
  ec: { min: number; max: number; optimal: number }
}



export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'alerts'>('overview')
  const [chartType, setChartType] = useState<'line' | 'heatmap' | 'bar'>('line')

  // Mock-Daten für KPIs
  const kpiData: KPIData = {
    yieldForecast: {
      current: 450,
      target: 500,
      trend: 'up',
      unit: 'g/m²'
    },
    growthCurve: {
      current: 2.8,
      target: 3.2,
      trend: 'up',
      unit: 'cm/Tag'
    },
    efficiency: {
      current: 87,
      target: 90,
      trend: 'stable',
      unit: '%'
    },
    quality: {
      current: 92,
      target: 95,
      trend: 'up',
      unit: '%'
    }
  }

  // Mock-Daten für Messungen
  const measurementData: MeasurementData = {
    temperature: [22, 23, 24, 25, 24, 23, 22, 23, 24, 25, 26, 25, 24, 23, 22, 23, 24, 25, 24, 23, 22, 23, 24, 25],
    humidity: [65, 67, 68, 66, 65, 64, 63, 65, 67, 68, 69, 67, 66, 65, 64, 65, 67, 68, 67, 66, 65, 66, 67, 68],
    vpd: [1.1, 1.2, 1.3, 1.1, 1.0, 0.9, 0.8, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.2],
    light: [400, 420, 450, 480, 500, 480, 450, 420, 400, 380, 360, 380, 400, 420, 450, 480, 500, 480, 450, 420, 400, 380, 360, 380],
    co2: [800, 820, 850, 880, 900, 880, 850, 820, 800, 780, 760, 780, 800, 820, 850, 880, 900, 880, 850, 820, 800, 780, 760, 780],
    ph: [6.2, 6.3, 6.4, 6.3, 6.2, 6.1, 6.0, 6.1, 6.2, 6.3, 6.4, 6.3, 6.2, 6.1, 6.0, 6.1, 6.2, 6.3, 6.4, 6.3, 6.2, 6.1, 6.0, 6.1],
    ec: [1.8, 1.9, 2.0, 1.9, 1.8, 1.7, 1.6, 1.7, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7, 1.6, 1.7, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7, 1.6, 1.7],
    timestamps: Array.from({ length: 24 }, (_, i) => `${i}:00`)
  }

  // Optimale Bereiche
  const optimalRanges: OptimalRanges = {
    temperature: { min: 20, max: 28, optimal: 24 },
    humidity: { min: 60, max: 75, optimal: 67 },
    vpd: { min: 0.8, max: 1.3, optimal: 1.0 },
    light: { min: 400, max: 600, optimal: 500 },
    co2: { min: 800, max: 1200, optimal: 1000 },
    ph: { min: 5.8, max: 6.5, optimal: 6.2 },
    ec: { min: 1.5, max: 2.5, optimal: 2.0 }
  }



  const getStatusColor = (value: number, min: number, max: number, optimal: number) => {
    if (value >= min && value <= max) {
      if (Math.abs(value - optimal) <= (max - min) * 0.1) {
        return 'bg-green-500' // Optimal
      } else if (Math.abs(value - optimal) <= (max - min) * 0.2) {
        return 'bg-yellow-500' // Gut
      } else {
        return 'bg-orange-500' // Akzeptabel
      }
    } else {
      return 'bg-red-500' // Außerhalb des Bereichs
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-400" />
              Analytics & Performance Dashboard
            </h1>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Live-Daten
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
              {[
                { id: '7d', label: '7T' },
                { id: '30d', label: '30T' },
                { id: '90d', label: '90T' },
                { id: '1y', label: '1J' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    timeRange === range.id
                      ? 'bg-green-500 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Übersicht', icon: BarChart3 },
            { id: 'charts', label: 'Charts', icon: LineChart },
            { id: 'alerts', label: 'Alerts', icon: AlertCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* KPI-Übersicht */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-green-400" />
              KPI-Übersicht
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Ertragsprognose */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-400" />
                    Ertragsprognose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {kpiData.yieldForecast.current} {kpiData.yieldForecast.unit}
                      </div>
                      <div className="text-sm text-white/60">
                        Ziel: {kpiData.yieldForecast.target} {kpiData.yieldForecast.unit}
                      </div>
                    </div>
                    {getTrendIcon(kpiData.yieldForecast.trend)}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(kpiData.yieldForecast.current / kpiData.yieldForecast.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wachstumskurve */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Wachstumskurve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {kpiData.growthCurve.current} {kpiData.growthCurve.unit}
                      </div>
                      <div className="text-sm text-white/60">
                        Ziel: {kpiData.growthCurve.target} {kpiData.growthCurve.unit}
                      </div>
                    </div>
                    {getTrendIcon(kpiData.growthCurve.trend)}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(kpiData.growthCurve.current / kpiData.growthCurve.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effizienz */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Effizienz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {kpiData.efficiency.current} {kpiData.efficiency.unit}
                      </div>
                      <div className="text-sm text-white/60">
                        Ziel: {kpiData.efficiency.target} {kpiData.efficiency.unit}
                      </div>
                    </div>
                    {getTrendIcon(kpiData.efficiency.trend)}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${(kpiData.efficiency.current / kpiData.efficiency.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualität */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    Qualität
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {kpiData.quality.current} {kpiData.quality.unit}
                      </div>
                      <div className="text-sm text-white/60">
                        Ziel: {kpiData.quality.target} {kpiData.quality.unit}
                      </div>
                    </div>
                    {getTrendIcon(kpiData.quality.trend)}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(kpiData.quality.current / kpiData.quality.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messdaten mit Ampel-System */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  Messdaten & Ampel-System
                </CardTitle>
                <CardDescription className="text-white/60">
                  Aktuelle Werte im Vergleich zu optimalen Bereichen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(optimalRanges).map(([key, range]) => {
                    const currentValue = measurementData[key as keyof MeasurementData]?.[23] || 0
                    const statusColor = getStatusColor(currentValue, range.min, range.max, range.optimal)
                    
                    return (
                      <div key={key} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white capitalize">
                            {key === 'vpd' ? 'VPD' : key === 'co2' ? 'CO₂' : key === 'ph' ? 'pH' : key === 'ec' ? 'EC' : key}
                          </span>
                          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {currentValue}
                          {key === 'temperature' ? '°C' : 
                           key === 'humidity' ? '%' : 
                           key === 'vpd' ? ' kPa' : 
                           key === 'light' ? ' µmol' : 
                           key === 'co2' ? ' ppm' : 
                           key === 'ph' ? '' : 
                           key === 'ec' ? ' mS/cm' : ''}
                        </div>
                        <div className="text-xs text-white/60">
                          Optimal: {range.optimal}
                          {key === 'temperature' ? '°C' : 
                           key === 'humidity' ? '%' : 
                           key === 'vpd' ? ' kPa' : 
                           key === 'light' ? ' µmol' : 
                           key === 'co2' ? ' ppm' : 
                           key === 'ph' ? '' : 
                           key === 'ec' ? ' mS/cm' : ''}
                        </div>
                        <div className="text-xs text-white/40 mt-1">
                          {range.min} - {range.max}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts */}
        {activeTab === 'charts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <LineChart className="w-6 h-6 text-green-400" />
                Grafische Messdaten
              </h2>
              
              <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
                {[
                  { id: 'line', label: 'Linie', icon: LineChart },
                  { id: 'heatmap', label: 'Heatmap', icon: BarChart },
                  { id: 'bar', label: 'Balken', icon: BarChart3 }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id as any)}
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-all ${
                      chartType === type.id
                        ? 'bg-green-500 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperatur & Luftfeuchtigkeit */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Temperatur & Luftfeuchtigkeit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="text-center text-white/60 mt-20">
                      Chart-Komponente wird hier angezeigt
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VPD & Licht */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">VPD & Licht</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="text-center text-white/60 mt-20">
                      Chart-Komponente wird hier angezeigt
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* pH & EC */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">pH & EC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="text-center text-white/60 mt-20">
                      Chart-Komponente wird hier angezeigt
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CO₂ */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">CO₂-Konzentration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="text-center text-white/60 mt-20">
                      Chart-Komponente wird hier angezeigt
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}



        {/* Alerts */}
        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              Warnungen & Abweichungen
            </h2>
            
            <div className="space-y-4">
              {/* Kritische Abweichungen */}
              <Card className="bg-red-500/10 backdrop-blur-md border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Kritische Abweichungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-300">Temperatur zu hoch</div>
                        <div className="text-sm text-red-200/80 mt-1">
                          Aktuell: 26°C | Optimal: 20-28°C | Maßnahme: Lüftung erhöhen
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warnungen */}
              <Card className="bg-yellow-500/10 backdrop-blur-md border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Warnungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-yellow-300">VPD leicht über optimal</div>
                        <div className="text-sm text-yellow-200/80 mt-1">
                          Aktuell: 1.3 kPa | Optimal: 0.8-1.3 kPa | Überwachen
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Empfehlungen */}
              <Card className="bg-green-500/10 backdrop-blur-md border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Empfehlungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-300">Alle Werte im optimalen Bereich</div>
                        <div className="text-sm text-green-200/80 mt-1">
                          Ihre Pflanzen entwickeln sich optimal. Weiter so!
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
