'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo, { LogoOnly, LogoNoBackground, LogoText } from '@/components/ui/Logo'
import Analytics from '@/components/dashboard/Analytics'
import DashboardCustomization from '@/components/dashboard/DashboardCustomization'

interface SidebarItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    description: 'Übersicht über Ihre Pflanzen'
  },
  {
    name: 'Pflanzen',
    href: '/plants',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: 'Pflanzen verwalten'
  },
  {
    name: 'Diagnose',
    href: '/diagnose',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'KI-gestützte Pflanzen-Analyse'
  },
  {
    name: 'Planer',
    href: '/planner',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Grow-Zyklen planen'
  },
  {
    name: 'Messungen',
    href: '/measurements',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: 'Sensordaten erfassen & analysieren'
  },
  {
    name: 'Einstellungen',
    href: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'App-Einstellungen'
  }
]

// Analytics-Button für die Sidebar
const analyticsButton = {
  name: 'Analytics',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  description: 'Analytics & Monitoring'
}

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showDashboardCustomization, setShowDashboardCustomization] = useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </motion.button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCollapsed(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 left-0 h-full w-80 z-50 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <LogoText size="sm" />
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Navigation schließen"
                title="Navigation schließen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.href}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.href)}
                                  className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-sm ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 border border-green-500/40 text-green-400 shadow-lg shadow-green-500/20'
                    : 'text-white/80 hover:bg-white/20 hover:text-white border border-transparent hover:border-white/20'
                }`}
                >
                  <div className={`p-2 rounded-lg ${
                    pathname === item.href ? 'bg-green-500/20' : 'bg-white/5'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-white/60">{item.description}</div>
                    )}
                  </div>
                </motion.button>
              ))}
              
              {/* Analytics Toggle Button */}
              <motion.button
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-sm ${
                  showAnalytics
                    ? 'bg-gradient-to-r from-blue-500/30 to-cyan-600/30 border border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20'
                    : 'text-white/80 hover:bg-white/20 hover:text-white border border-transparent hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  showAnalytics ? 'bg-blue-500/20' : 'bg-white/5'
                }`}>
                  {analyticsButton.icon}
                </div>
                <div>
                  <div className="font-medium">{analyticsButton.name}</div>
                  {analyticsButton.description && (
                    <div className="text-sm text-white/60">{analyticsButton.description}</div>
                  )}
                </div>
              </motion.button>
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                Zurück zur Startseite
              </motion.button>
            </div>
            
            {/* Analytics Panel */}
            <Analytics 
              variant="sidebar"
              isVisible={showAnalytics}
              onToggleVisibility={() => setShowAnalytics(false)}
              className="mt-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`hidden lg:block fixed top-0 left-0 h-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl z-40 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`p-6 transition-all duration-300 ${isSidebarCollapsed ? 'px-3' : ''}`}>

          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute top-6 right-4 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            title={isSidebarCollapsed ? "Sidebar erweitern" : "Sidebar einklappen"}
            aria-label={isSidebarCollapsed ? "Sidebar erweitern" : "Sidebar einklappen"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7"} />
            </svg>
          </motion.button>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ x: isSidebarCollapsed ? 0 : 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center rounded-xl text-left transition-all duration-300 backdrop-blur-sm ${
                  isSidebarCollapsed ? 'justify-center p-3' : 'space-x-4 p-4'
                } ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 border border-green-500/40 text-green-400 shadow-lg shadow-green-500/20'
                    : 'text-white/80 hover:bg-white/20 hover:text-white border border-transparent hover:border-white/20'
                }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div className={`p-2 rounded-lg ${
                  pathname === item.href ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-white/60">{item.description}</div>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className={`absolute bottom-20 transition-all duration-300 ${
            isSidebarCollapsed ? 'left-3 right-3' : 'left-6 right-6'
          }`}>
            {/* Dashboard Customization Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDashboardCustomization(true)}
              className={`w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 mb-3 ${
                isSidebarCollapsed ? 'py-3 px-3' : 'py-3 px-4'
              }`}
              title={isSidebarCollapsed ? "Dashboard anpassen" : undefined}
            >
              {isSidebarCollapsed ? (
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                "Dashboard anpassen"
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 ${
                isSidebarCollapsed ? 'py-3 px-3' : 'py-3 px-4'
              }`}
              title={isSidebarCollapsed ? "Zurück zur Startseite" : undefined}
            >
              {isSidebarCollapsed ? (
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              ) : (
                "Zurück zur Startseite"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Customization Overlay */}
      <DashboardCustomization
        isOpen={showDashboardCustomization}
        onClose={() => setShowDashboardCustomization(false)}
        onSave={(tiles) => {
          console.log('Dashboard tiles saved:', tiles);
          setShowDashboardCustomization(false);
        }}
        currentTiles={[
          { id: 'temperature', label: 'Temperatur', moduleId: 'monitoring', enabled: true },
          { id: 'humidity', label: 'Luftfeuchtigkeit', moduleId: 'monitoring', enabled: true },
          { id: 'ph', label: 'pH-Wert', moduleId: 'monitoring', enabled: true },
          { id: 'ec', label: 'EC-Wert', moduleId: 'monitoring', enabled: true }
        ]}
      />
    </>
  )
}
