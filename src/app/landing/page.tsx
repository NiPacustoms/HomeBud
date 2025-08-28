'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    if (router) {
      router.push('/pricing')
    }
  }

  const handleSignIn = () => {
    if (router) {
      router.push('/dashboard')
    }
  }

  // Features data
  const features = [
    {
      id: 'ai-diagnosis',
      title: 'KI-gestützte Diagnose',
      description: 'Analysieren Sie Ihre Pflanzen mit künstlicher Intelligenz und erhalten Sie professionelle Empfehlungen.',
      icon: '🤖',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'grow-tracking',
      title: 'Grow-Tracking',
      description: 'Verfolgen Sie den Fortschritt Ihrer Pflanzen von der Keimung bis zur Ernte.',
      icon: '🌱',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'vpd-optimization',
      title: 'VPD-Optimierung',
      description: 'Optimieren Sie das Vapor Pressure Deficit für perfekte Wachstumsbedingungen.',
      icon: '🌡️',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  // Stats data
  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "50k+", label: "Aktive Nutzer" },
    { number: "1M+", label: "Pflanzen getrackt" },
    { number: "24/7", label: "Support" }
  ]

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <motion.div 
              className="mb-16 -mt-16 flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Logo size="xl" className="text-white" />
            </motion.div>
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed mt-12 md:mt-16 mb-8">
              Intelligentes Grow Management mit KI-Unterstützung
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300"
            >
              Registrieren
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Anmelden
            </motion.button>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 text-4xl opacity-20"
          >
            🌱
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 text-4xl opacity-20"
          >
            🌿
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Intelligente <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Entdecken Sie die fortschrittlichsten Tools für professionelles Cannabis-Growing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                <p className="text-white/60 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vertrauen Sie auf <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">bewährte Qualität</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bereit für professionelles Growing?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Starten Sie noch heute mit HomeBud und erleben Sie die Zukunft des Cannabis-Growings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300"
              >
                Registrieren
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
