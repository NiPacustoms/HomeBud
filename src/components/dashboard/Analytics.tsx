'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Sun
} from '@/components/ui/icons'

interface AnalyticsData {
  temperature: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  humidity: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  light: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  vpd: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  plantHealth: {
    score: number
    status: 'excellent' | 'good' | 'fair' | 'poor'
    issues: string[]
  }
  growthRate: {
    current: number
    target: number
    trend: 'up' | 'down' | 'stable'
  }
}

interface AnalyticsProps {
  className?: string
  variant?: 'sidebar' | 'dashboard'
  isVisible?: boolean
  onToggleVisibility?: () => void
}

export default function Analytics({ 
  className = '', 
  variant = 'dashboard',
  isVisible = true,
  onToggleVisibility 
}: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  // Mock-Daten für Analytics
  const analyticsData: AnalyticsData = {
    temperature: {
      current: 24.5,
      average: 23.8,
      trend: 'up'
    },
    humidity: {
      current: 65,
      average: 62,
      trend: 'up'
    },
    light: {
      current: 450,
      average: 420,
      trend: 'stable'
    },
    vpd: {
      current: 1.2,
      average: 1.1,
      trend: 'up'
    },
    plantHealth: {
      score: 87,
      status: 'good',
      issues: ['Leicht erhöhte Temperatur', 'VPD leicht über optimal']
    },
    growthRate: {
      current: 2.3,
      target: 2.5,
      trend: 'up'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      case 'poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Ausgezeichnet'
      case 'good':
        return 'Gut'
      case 'fair':
        return 'Mittel'
      case 'poor':
        return 'Schlecht'
      default:
        return 'Unbekannt'
    }
  }

  if (variant === 'sidebar') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 ${className}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </h3>
              {onToggleVisibility && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleVisibility}
                  className="text-white/70 hover:text-white"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Zeitraum-Auswahl */}
            <div className="flex space-x-1 mb-4">
              {[
                { id: '7d', label: '7T' },
                { id: '30d', label: '30T' },
                { id: '90d', label: '90T' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    timeRange === range.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Kompakte Metriken */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white/80">Temperatur</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white">
                    {analyticsData.temperature.current}°C
                  </span>
                  {getTrendIcon(analyticsData.temperature.trend)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/80">Luftfeuchtigkeit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white">
                    {analyticsData.humidity.current}%
                  </span>
                  {getTrendIcon(analyticsData.humidity.trend)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/80">VPD</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white">
                    {analyticsData.vpd.current} kPa
                  </span>
                  {getTrendIcon(analyticsData.vpd.trend)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/80">Pflanzengesundheit</span>
                </div>
                <Badge className={`text-xs ${getStatusColor(analyticsData.plantHealth.status)}`}>
                  {analyticsData.plantHealth.score}%
                </Badge>
              </div>
            </div>

            {/* Warnungen */}
            {analyticsData.plantHealth.issues.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Warnungen</span>
                </div>
                <ul className="text-xs text-yellow-300 space-y-1">
                  {analyticsData.plantHealth.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Dashboard-Variante
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analytics & Monitoring
          </h2>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Live-Daten
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
            {[
              { id: '7d', label: '7 Tage' },
              { id: '30d', label: '30 Tage' },
              { id: '90d', label: '90 Tage' }
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperatur */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-400" />
              Temperatur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {analyticsData.temperature.current}°C
                </div>
                <div className="text-sm text-white/60">
                  Ø {analyticsData.temperature.average}°C
                </div>
              </div>
              {getTrendIcon(analyticsData.temperature.trend)}
            </div>
          </CardContent>
        </Card>

        {/* Luftfeuchtigkeit */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              Luftfeuchtigkeit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {analyticsData.humidity.current}%
                </div>
                <div className="text-sm text-white/60">
                  Ø {analyticsData.humidity.average}%
                </div>
              </div>
              {getTrendIcon(analyticsData.humidity.trend)}
            </div>
          </CardContent>
        </Card>

        {/* VPD */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              VPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {analyticsData.vpd.current} kPa
                </div>
                <div className="text-sm text-white/60">
                  Ø {analyticsData.vpd.average} kPa
                </div>
              </div>
              {getTrendIcon(analyticsData.vpd.trend)}
            </div>
          </CardContent>
        </Card>

        {/* Pflanzengesundheit */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Gesundheit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {analyticsData.plantHealth.score}%
                </div>
                <div className="text-sm text-white/60">
                  {getStatusText(analyticsData.plantHealth.status)}
                </div>
              </div>
              <Badge className={getStatusColor(analyticsData.plantHealth.status)}>
                {analyticsData.plantHealth.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wachstumsrate */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Wachstumsrate
          </CardTitle>
          <CardDescription className="text-white/60">
            Aktuelle Wachstumsrate im Vergleich zum Ziel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-3xl font-bold text-white">
                  {analyticsData.growthRate.current} cm/Tag
                </div>
                <div className="text-sm text-white/60">
                  Ziel: {analyticsData.growthRate.target} cm/Tag
                </div>
              </div>
              {getTrendIcon(analyticsData.growthRate.trend)}
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Fortschritt</div>
              <div className="text-lg font-semibold text-white">
                {Math.round((analyticsData.growthRate.current / analyticsData.growthRate.target) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnungen und Empfehlungen */}
      {analyticsData.plantHealth.issues.length > 0 && (
        <Card className="bg-yellow-500/10 backdrop-blur-md border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-6 h-6" />
              Warnungen & Empfehlungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.plantHealth.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-yellow-300">{issue}</div>
                    <div className="text-sm text-yellow-200/80 mt-1">
                      Überwachen Sie diese Werte und passen Sie bei Bedarf an.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
