'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}

const navItems: NavItem[] = [
  {
    name: 'Startseite',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a2 2 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    description: 'Zurück zur Startseite'
  },
  {
    name: 'VPD-Chart',
    href: '/vpd-chart',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: 'Interaktiver VPD-Chart'
  },
  {
    name: 'Setup',
    href: '/setup',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    ),
    description: 'Setup-Assistent'
  },
  {
    name: 'Kontakt',
    href: '/contact',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Kontaktieren Sie uns'
  },
  {
    name: 'Preise',
    href: '/pricing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    description: 'Unsere Preise und Pläne'
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
    description: 'App-Einstellungen anpassen'
  }
]

export default function DynamicNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Subtiles Logo-Badge im Hero, nur vor Scroll sichtbar */}
      {!isScrolled && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => router.push('/')}
          className="fixed top-4 left-4 z-40 flex items-center space-x-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-white hover:bg-white/10 transition-all duration-300"
          aria-label="Zur Startseite"
          title="Zur Startseite"
        >
          <img 
            src="/logo.png" 
            alt="HomeBud Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="hidden sm:inline text-sm font-semibold text-white/80">HomeBud</span>
        </motion.button>
      )}

      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 right-4 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300 ${
          isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        title={isOpen ? 'Menü schließen' : 'Menü öffnen'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </motion.button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 right-0 h-full w-80 z-50 bg-black/90 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="HomeBud Logo" 
                  className="w-10 h-10 rounded-xl"
                />
                <span className="text-white font-bold text-xl">HomeBud</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Menü schließen"
                title="Menü schließen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.href}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
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
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/pricing')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                Upgrade auf Pro
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation: nur nach Scroll sichtbar */}
      {isScrolled && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`hidden lg:block fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">HomeBud</span>
              </motion.div>

              <div className="hidden lg:flex items-center space-x-1">
                {navItems.slice(1, 6).map((item) => (
                  <motion.button
                    key={item.href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.href)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400 border border-green-500/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              <div className="hidden lg:flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/pricing')}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Preise
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/settings')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  aria-label="Einstellungen"
                  title="Einstellungen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826-3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </>
  )
}
