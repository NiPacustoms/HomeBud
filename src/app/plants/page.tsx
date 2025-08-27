'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/navigation/Sidebar'
import BackButton from '@/components/ui/BackButton'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'

interface Plant {
  id: string
  name: string
  strain: string
  stage: 'seedling' | 'vegetative' | 'flowering' | 'harvest'
  health: number
  daysOld: number
  lastWatered: string
  nextWatering: string
  image: string
  temperature: number
  humidity: number
  lightHours: number
}

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Gorilla Glue #4',
    strain: 'Hybrid',
    stage: 'flowering',
    health: 95,
    daysOld: 45,
    lastWatered: '2024-01-15',
    nextWatering: '2024-01-17',
    image: '🌿',
    temperature: 24.5,
    humidity: 65,
    lightHours: 12
  },
  {
    id: '2',
    name: 'Northern Lights',
    strain: 'Indica',
    stage: 'vegetative',
    health: 88,
    daysOld: 28,
    lastWatered: '2024-01-14',
    nextWatering: '2024-01-16',
    image: '🌱',
    temperature: 23.8,
    humidity: 62,
    lightHours: 18
  },
  {
    id: '3',
    name: 'Amnesia Haze',
    strain: 'Sativa',
    stage: 'seedling',
    health: 92,
    daysOld: 12,
    lastWatered: '2024-01-15',
    nextWatering: '2024-01-18',
    image: '🌱',
    temperature: 25.2,
    humidity: 68,
    lightHours: 16
  },
  {
    id: '4',
    name: 'White Widow',
    strain: 'Hybrid',
    stage: 'vegetative',
    health: 91,
    daysOld: 35,
    lastWatered: '2024-01-13',
    nextWatering: '2024-01-15',
    image: '🌿',
    temperature: 24.1,
    humidity: 64,
    lightHours: 18
  },
  {
    id: '5',
    name: 'OG Kush',
    strain: 'Indica',
    stage: 'flowering',
    health: 87,
    daysOld: 52,
    lastWatered: '2024-01-12',
    nextWatering: '2024-01-14',
    image: '🌸',
    temperature: 23.9,
    humidity: 58,
    lightHours: 12
  },
  {
    id: '6',
    name: 'Blue Dream',
    strain: 'Hybrid',
    stage: 'seedling',
    health: 94,
    daysOld: 8,
    lastWatered: '2024-01-16',
    nextWatering: '2024-01-19',
    image: '🌱',
    temperature: 25.5,
    humidity: 70,
    lightHours: 16
  }
]

export default function PlantsPage() {
  const router = useRouter()
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'health' | 'daysOld'>('name')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'from-blue-500 to-cyan-600'
      case 'vegetative': return 'from-green-500 to-emerald-600'
      case 'flowering': return 'from-purple-500 to-pink-600'
      case 'harvest': return 'from-yellow-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'Keimling'
      case 'vegetative': return 'Vegetativ'
      case 'flowering': return 'Blüte'
      case 'harvest': return 'Ernte'
      default: return stage
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400'
    if (health >= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Ausgezeichnet'
    if (health >= 75) return 'Gut'
    return 'Verbesserungsbedarf'
  }

  const filteredPlants = mockPlants
    .filter(plant => 
      selectedStage === 'all' || plant.stage === selectedStage
    )
    .filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.strain.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'health':
          return b.health - a.health
        case 'daysOld':
          return b.daysOld - a.daysOld
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handlePlantClick = (plantId: string) => {
    router.push(`/plants/${plantId}`)
  }

  const handleAddPlant = () => {
    router.push('/plants/new')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Pflanzen werden geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <BackButton href="/dashboard" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Meine Pflanzen 🌱
              </h1>
              <p className="text-white/60 text-lg">
                Verwalten und überwachen Sie alle Ihre Pflanzen an einem Ort.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddPlant}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Pflanze hinzufügen</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Gesamt Pflanzen', value: mockPlants.length, color: 'from-green-500 to-emerald-600' },
            { label: 'Durchschnittliche Gesundheit', value: `${Math.round(mockPlants.reduce((acc, p) => acc + p.health, 0) / mockPlants.length)}%`, color: 'from-blue-500 to-cyan-600' },
            { label: 'Aktive Zyklen', value: mockPlants.filter(p => p.stage !== 'harvest').length, color: 'from-purple-500 to-pink-600' },
            { label: 'Nächste Bewässerung', value: 'in 2 Tagen', color: 'from-orange-500 to-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Pflanze suchen
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Nach Namen oder Sorte suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Stage Filter */}
              <div className="lg:w-48">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Wachstumsphase
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Alle Phasen</option>
                  <option value="seedling">Keimling</option>
                  <option value="vegetative">Vegetativ</option>
                  <option value="flowering">Blüte</option>
                  <option value="harvest">Ernte</option>
                </select>
              </div>

              {/* Sort */}
              <div className="lg:w-48">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Sortieren nach
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'health' | 'daysOld')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="name">Name</option>
                  <option value="health">Gesundheit</option>
                  <option value="daysOld">Alter</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plants Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {filteredPlants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-medium text-white mb-2">Keine Pflanzen gefunden</h3>
              <p className="text-white/60 mb-6">
                {searchTerm || selectedStage !== 'all' 
                  ? 'Versuchen Sie andere Suchkriterien oder Filter.'
                  : 'Fügen Sie Ihre erste Pflanze hinzu, um zu beginnen!'
                }
              </p>
              {!searchTerm && selectedStage === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddPlant}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Erste Pflanze hinzufügen
                </motion.button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant, index) => (
                <motion.div
                  key={plant.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlantClick(plant.id)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  {/* Plant Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStageColor(plant.stage)} text-white`}>
                      {getStageName(plant.stage)}
                    </div>
                    <div className={`text-sm font-medium ${getHealthColor(plant.health)}`}>
                      {plant.health}%
                    </div>
                  </div>

                  {/* Plant Image and Name */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{plant.image}</div>
                    <h3 className="text-xl font-bold text-white mb-1">{plant.name}</h3>
                    <p className="text-white/60 text-sm">{plant.strain}</p>
                  </div>

                  {/* Plant Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Alter:</span>
                      <span className="text-white">{plant.daysOld} Tage</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Temperatur:</span>
                      <span className="text-white">{plant.temperature}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Luftfeuchtigkeit:</span>
                      <span className="text-white">{plant.humidity}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Lichtstunden:</span>
                      <span className="text-white">{plant.lightHours}h</span>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Gesundheit</span>
                      <span>{getHealthStatus(plant.health)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getStageColor(plant.stage)}`}
                        style={{ width: `${plant.health}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Watering Info */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Letzte Bewässerung:</span>
                      <span className="text-white">{new Date(plant.lastWatered).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-white/60">Nächste Bewässerung:</span>
                      <span className="text-white">{new Date(plant.nextWatering).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlantClick(plant.id)
                    }}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-xl font-medium hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300"
                  >
                    Details anzeigen
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Schnellaktionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Alle Pflanzen bewässern',
                description: 'Bewässerung für alle Pflanzen planen',
                icon: '💧',
                color: 'from-blue-500 to-cyan-600'
              },
              {
                title: 'Nährstoffe hinzufügen',
                description: 'Nährstoffplan für alle Pflanzen',
                icon: '🌿',
                color: 'from-green-500 to-emerald-600'
              },
              {
                title: 'Grow-Phase ändern',
                description: 'Wachstumsphasen anpassen',
                icon: '📊',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white text-left hover:shadow-xl transition-all duration-300`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
