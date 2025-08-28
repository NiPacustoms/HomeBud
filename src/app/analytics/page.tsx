'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Badge } from '@/components/ui'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Zap
} from '@/components/ui/icons'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'alerts'>('overview')

  // Mock-Daten für KPIs
  const kpiData = {
    yieldForecast: {
      current: 450,
      target: 500,
      trend: 'up' as const,
      unit: 'g/m²'
    },
    growthCurve: {
      current: 2.8,
      target: 3.2,
      trend: 'up' as const,
      unit: 'cm/Tag'
    },
    efficiency: {
      current: 87,
      target: 90,
      trend: 'stable' as const,
      unit: '%'
    },
    quality: {
      current: 92,
      target: 95,
      trend: 'up' as const,
      unit: '%'
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
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Übersicht', icon: BarChart3 },
            { id: 'charts', label: 'Charts', icon: BarChart3 },
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
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <div className="pb-3">
                  <h3 className="text-lg flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Ertragsprognose
                  </h3>
                </div>
                <div className="pt-0">
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
                </div>
              </div>

              {/* Wachstumskurve */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <div className="pb-3">
                  <h3 className="text-lg flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Wachstumskurve
                  </h3>
                </div>
                <div className="pt-0">
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
                </div>
              </div>

              {/* Effizienz */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <div className="pb-3">
                  <h3 className="text-lg flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Effizienz
                  </h3>
                </div>
                <div className="pt-0">
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
                </div>
              </div>

              {/* Qualität */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <div className="pb-3">
                  <h3 className="text-lg flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    Qualität
                  </h3>
                </div>
                <div className="pt-0">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        {activeTab === 'charts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              Grafische Messdaten
            </h2>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <div className="text-center text-white/60">
                Chart-Komponenten werden hier angezeigt
              </div>
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
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <div className="text-center text-white/60">
                Alle Werte im optimalen Bereich
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
