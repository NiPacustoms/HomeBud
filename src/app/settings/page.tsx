'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/navigation/Sidebar'
import BackButton from '@/components/ui/BackButton'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'

interface Module {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
  category: 'core' | 'advanced' | 'experimental'
  version: string
}

interface NotificationSetting {
  id: string
  name: string
  description: string
  enabled: boolean
  type: 'email' | 'push' | 'sms'
}

const mockModules: Module[] = [
  {
    id: 'ai-diagnosis',
    name: 'KI-Diagnose',
    description: 'Künstliche Intelligenz zur Pflanzen-Diagnose',
    icon: '🤖',
    enabled: true,
    category: 'core',
    version: '1.2.0'
  },
  {
    id: 'vpd-optimization',
    name: 'VPD-Optimierung',
    description: 'Automatische VPD-Berechnung und Optimierung',
    icon: '🌡️',
    enabled: true,
    category: 'advanced',
    version: '1.0.5'
  },
  {
    id: 'nutrient-tracking',
    name: 'Nährstoff-Tracking',
    description: 'Detailliertes Nährstoff-Management',
    icon: '🌿',
    enabled: false,
    category: 'core',
    version: '1.1.2'
  },
  {
    id: 'community-features',
    name: 'Community-Features',
    description: 'Austausch mit anderen Growern',
    icon: '👥',
    enabled: true,
    category: 'core',
    version: '0.9.8'
  },
  {
    id: 'advanced-analytics',
    name: 'Erweiterte Analytics',
    description: 'Detaillierte Statistiken und Berichte',
    icon: '📊',
    enabled: false,
    category: 'advanced',
    version: '1.3.1'
  },
  {
    id: 'automation',
    name: 'Automatisierung',
    description: 'Automatische Bewässerung und Beleuchtung',
    icon: '⚡',
    enabled: false,
    category: 'experimental',
    version: '0.8.4'
  }
]

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: 'watering-reminder',
    name: 'Bewässerungserinnerungen',
    description: 'Erinnerungen für geplante Bewässerungen',
    enabled: true,
    type: 'push'
  },
  {
    id: 'nutrient-reminder',
    name: 'Nährstoff-Erinnerungen',
    description: 'Erinnerungen für Nährstoffgaben',
    enabled: true,
    type: 'push'
  },
  {
    id: 'health-alerts',
    name: 'Gesundheits-Warnungen',
    description: 'Warnungen bei Pflanzenproblemen',
    enabled: true,
    type: 'push'
  },
  {
    id: 'weekly-reports',
    name: 'Wöchentliche Berichte',
    description: 'Zusammenfassung der Woche per E-Mail',
    enabled: false,
    type: 'email'
  },
  {
    id: 'community-updates',
    name: 'Community-Updates',
    description: 'Neue Beiträge und Antworten',
    enabled: false,
    type: 'push'
  }
]

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'general' | 'modules' | 'notifications' | 'privacy' | 'account'>('general')
  const [modules, setModules] = useState<Module[]>(mockModules)
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotificationSettings)

  const [language, setLanguage] = useState('de')
  const [timezone, setTimezone] = useState('Europe/Berlin')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  const handleModuleToggle = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, enabled: !module.enabled } : module
    ))
  }

  const handleNotificationToggle = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, enabled: !notification.enabled } : notification
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'from-green-500 to-emerald-600'
      case 'advanced': return 'from-blue-500 to-cyan-600'
      case 'experimental': return 'from-purple-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'core': return 'Kern-Features'
      case 'advanced': return 'Erweitert'
      case 'experimental': return 'Experimentell'
      default: return category
    }
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Einstellungen ⚙️
          </h1>
          <p className="text-white/60 text-lg">
            Passen Sie HomeBud an Ihre Bedürfnisse an.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 overflow-x-auto">
            {[
              { id: 'general', label: 'Allgemein', icon: '⚙️' },
              { id: 'modules', label: 'Module', icon: '🧩' },
              { id: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
              { id: 'privacy', label: 'Datenschutz', icon: '🔒' },
              { id: 'account', label: 'Konto', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
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
            { label: 'Aktive Module', value: modules.filter(m => m.enabled).length, color: 'from-green-500 to-emerald-600' },
            { label: 'Benachrichtigungen', value: notifications.filter(n => n.enabled).length, color: 'from-blue-500 to-cyan-600' },
            { label: 'Kern-Features', value: modules.filter(m => m.category === 'core').length, color: 'from-purple-500 to-pink-600' },
            { label: 'Experimentell', value: modules.filter(m => m.category === 'experimental').length, color: 'from-orange-500 to-red-600' }
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Allgemeine Einstellungen</h2>
                
                <div className="space-y-6">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Sprache
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                    >
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {/* Timezone Selection */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Zeitzone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Europe/Berlin">Europa/Berlin (UTC+1)</option>
                      <option value="Europe/London">Europa/London (UTC+0)</option>
                      <option value="America/New_York">Amerika/New York (UTC-5)</option>
                      <option value="Asia/Tokyo">Asien/Tokio (UTC+9)</option>
                    </select>
                  </div>

                  {/* Units Selection */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Einheiten
                    </label>
                    <div className="flex space-x-4">
                      {[
                        { value: 'metric', label: 'Metrisch (Celsius, cm, l)' },
                        { value: 'imperial', label: 'Imperial (Fahrenheit, inch, gal)' }
                      ].map((unit) => (
                        <label key={unit.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="units"
                            value={unit.value}
                            checked={units === unit.value}
                            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
                            className="w-4 h-4 text-green-500 bg-white/10 border-white/20 focus:ring-green-500 focus:ring-2"
                          />
                          <span className="text-white/80">{unit.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Module verwalten</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{module.icon}</span>
                          <div>
                            <h3 className="font-semibold text-white">{module.name}</h3>
                            <p className="text-white/60 text-sm">{module.description}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleModuleToggle(module.id)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            module.enabled ? 'bg-green-500' : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full shadow-md"
                            animate={{ x: module.enabled ? 24 : 4 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(module.category)} text-white`}>
                          {getCategoryName(module.category)}
                        </span>
                        <span className="text-white/40 text-sm">v{module.version}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Benachrichtigungen</h2>
                
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{notification.name}</h3>
                        <p className="text-white/60 text-sm">{notification.description}</p>
                        <span className="text-xs text-white/40 mt-1 inline-block">
                          {notification.type === 'email' ? '📧 E-Mail' : 
                           notification.type === 'push' ? '📱 Push-Benachrichtigung' : '💬 SMS'}
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNotificationToggle(notification.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          notification.enabled ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ x: notification.enabled ? 24 : 4 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Datenschutz & Sicherheit</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Datenanalyse</h3>
                      <p className="text-white/60 text-sm">Anonymisierte Daten zur Verbesserung der App verwenden</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-12 h-6 rounded-full bg-green-500 transition-colors duration-300"
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        animate={{ x: 24 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Backup & Sync</h3>
                      <p className="text-white/60 text-sm">Daten in der Cloud sichern und synchronisieren</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-12 h-6 rounded-full bg-green-500 transition-colors duration-300"
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        animate={{ x: 24 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Zwei-Faktor-Authentifizierung</h3>
                      <p className="text-white/60 text-sm">Zusätzliche Sicherheit für Ihr Konto</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-12 h-6 rounded-full bg-white/20 transition-colors duration-300"
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        animate={{ x: 4 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Alle Daten löschen
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Konto-Einstellungen</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value="user@example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Benutzername
                    </label>
                    <input
                      type="text"
                      value="GrowMaster2024"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                      readOnly
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    >
                      Passwort ändern
                    </motion.button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Konto löschen
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300"
          >
            Einstellungen speichern
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
