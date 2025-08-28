'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plant } from '@/types/plant'
import { Card } from '@/components/ui/Card'
import { StatusCard } from '@/components/ui/StatusCard'
import BackButton from '@/components/ui/BackButton'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'

interface PlantDetailProps {
  params: { id: string }
}

// Mock QuickLogComposer für Build
const QuickLogComposer = ({ plant, isOpen, onClose }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h3>Quick Log für {plant.name}</h3>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Schließen
        </button>
      </div>
    </div>
  );
};

export default function PlantDetailPage({ params }: PlantDetailProps) {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'diagnose'>('overview')
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false)
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false)

  useEffect(() => {
    // TODO: Fetch plant data by ID
    // For now, we'll use mock data
    const mockPlant: Plant = {
      id: params.id,
      name: 'Gorilla Glue #4',
      strain: 'Hybrid',
      stage: 'flowering',
      startDate: new Date('2024-01-15').toISOString(),
      photos: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=200&h=150&fit=crop',
          caption: 'Tag 45 - Blüte beginnt',
          date: new Date('2024-03-01').toISOString(),
          tags: ['flowering', 'closeup']
        }
      ],
      logs: [],
      tasks: [],
      settings: {
        substrate: 'Coco Coir',
        potSize: 11,
        lightSchedule: {
          onTime: '06:00',
          offTime: '18:00',
          intensity: 100
        },
        targetVPD: 1.2,
        targetEC: 1.8,
        targetPH: 6.0,
        targetTemperature: 24,
        targetHumidity: 60
      },
      health: {
        vpd: 1.1,
        ec: 1.7,
        ph: 6.1,
        temperature: 23.5,
        humidity: 58,
        lastUpdated: new Date().toISOString(),
        status: 'good'
      },
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPlant(mockPlant)
  }, [params.id])

  if (!plant) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Lade Pflanze...</p>
        </div>
      </div>
    )
  }

  const getStageLabel = (stage: string) => {
    const labels = {
      seedling: 'Keimling',
      vegetative: 'Vegetativ',
      flowering: 'Blüte',
      harvest: 'Ernte',
      drying: 'Trocknung',
      curing: 'Reifung'
    }
    return labels[stage as keyof typeof labels] || stage
  }

  const getStageColor = (stage: string) => {
    const colors = {
      seedling: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      vegetative: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      flowering: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      harvest: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      drying: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      curing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getHealthStatusColor = (status: string) => {
    const colors = {
      excellent: 'bg-green-500',
      good: 'bg-blue-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getAgeInDays = () => {
    const diffTime = Math.abs(new Date().getTime() - new Date(plant.startDate).getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getFloweringProgress = () => {
    if (plant.stage !== 'flowering') return 0
    const floweringStart = new Date(new Date(plant.startDate).getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days after start
    const now = new Date()
    const totalFloweringDays = 70 // 10 weeks
    const daysInFlowering = Math.max(0, Math.floor((now.getTime() - floweringStart.getTime()) / (1000 * 60 * 60 * 24)))
    return Math.min(100, Math.max(0, (daysInFlowering / totalFloweringDays) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />
      
      {/* Hero Section */}
      <div className={`relative transition-all duration-300 ${isHeroCollapsed ? 'h-32' : 'h-96'}`}>
        <div className="absolute inset-0">
          <img
            src={plant.photos[0]?.url || 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=800&h=600&fit=crop'}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <BackButton href="/plants" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{plant.name}</h1>
              {plant.strain && (
                <p className="text-white/80 text-lg mb-3">{plant.strain}</p>
              )}
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(plant.stage)}`}>
                  {getStageLabel(plant.stage)}
                </span>
                <span className="text-white/80 text-sm">
                  Tag {getAgeInDays()}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsHeroCollapsed(!isHeroCollapsed)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isHeroCollapsed ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getHealthStatusColor(plant.health.status)}`}></div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  VPD: {plant.health.vpd.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getHealthStatusColor(plant.health.status)}`}></div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  EC: {plant.health.ec.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getHealthStatusColor(plant.health.status)}`}></div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  pH: {plant.health.ph.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getHealthStatusColor(plant.health.status)}`}></div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {plant.health.temperature.toFixed(1)}°C
                </span>
              </div>
            </div>
            
            {plant.stage === 'flowering' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Ernte-Progress:</span>
                <div className="w-20 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${getFloweringProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {getFloweringProgress().toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Übersicht' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'diagnose', label: 'Diagnose' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatusCard
                title="Pflanzen-Status"
                value={getStageLabel(plant.stage)}
                subtitle={`Tag ${getAgeInDays()}`}
                status={plant.health.status}
                icon="🌱"
              />
              <StatusCard
                title="VPD"
                value={plant.health.vpd.toFixed(1)}
                subtitle="kPa"
                status={plant.health.vpd > 1.5 ? 'warning' : 'good'}
                icon="💨"
              />
              <StatusCard
                title="EC"
                value={plant.health.ec.toFixed(1)}
                subtitle="mS/cm"
                status={plant.health.ec > 2.0 ? 'warning' : 'good'}
                icon="⚡"
              />
            </div>
            
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Pflanzen-Einstellungen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Substrat</label>
                    <p className="text-neutral-900 dark:text-neutral-100">{plant.settings.substrate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Topf-Größe</label>
                    <p className="text-neutral-900 dark:text-neutral-100">{plant.settings.potSize}L</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Licht-Schedule</label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {plant.settings.lightSchedule.onTime} - {plant.settings.lightSchedule.offTime}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ziel-VPD</label>
                    <p className="text-neutral-900 dark:text-neutral-100">{plant.settings.targetVPD} kPa</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Timeline
                </h3>
                <div className="text-center py-8">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Timeline wird implementiert...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'diagnose' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  KI-Diagnose
                </h3>
                <div className="text-center py-8">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    KI-Diagnose wird implementiert...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsQuickLogOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
        aria-label="Quick Log erstellen"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Quick Log Composer */}
      {plant && (
        <QuickLogComposer
          plant={plant}
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
        />
      )}
    </div>
  )
}
