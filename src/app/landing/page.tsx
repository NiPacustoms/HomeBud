'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AnimatedBackground, { WaveBackground, FloatingIcons } from '@/components/landing/AnimatedBackground'
import Logo from '@/components/ui/Logo'

export default function LandingPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: "🌱",
      title: "Intelligentes Plant-Tracking",
      description: "Verfolge jede Phase deiner Pflanzen mit KI-gestützter Analyse und automatischen Empfehlungen.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: "📊",
      title: "Real-time Monitoring",
      description: "Überwache VPD, EC, pH und mehr mit präzisen Sensoren und intelligenten Alerts.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: "🤖",
      title: "KI-Diagnose",
      description: "Analysiere Blattprobleme mit künstlicher Intelligenz und erhalte 7-Tage-Behandlungspläne.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Optimiert für Smartphones mit Offline-Funktionalität und Push-Benachrichtigungen.",
      color: "from-orange-500 to-red-600"
    }
  ]

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "50k+", label: "Aktive Nutzer" },
    { number: "1M+", label: "Pflanzen getrackt" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />

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
                  style={{ filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.3)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.7))' }}
                  onLoad={() => console.log('Logo loaded successfully')}
                  onError={(e) => {
                    console.log('Logo failed to load:', e);
                    // @ts-ignore
                    console.log('Logo path:', e.target.src);
                  }}
                />
              </div>
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
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300"
            >
              Registrieren
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
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
            📊
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={featuresInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Warum <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">HomeBud</span>?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Die erste KI-gestützte Grow-Management-App, die deine Pflanzen versteht und dir hilft, bessere Ergebnisse zu erzielen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative" style={{ perspective: 1000 }}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={featuresInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05, rotateX: 12, rotateY: 12 }}
                  whileTap={{ scale: 1.03, rotateX: 10, rotateY: 10 }}
                  className="group relative will-change-transform"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <motion.div 
                    className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full"
                    transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <WaveBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bereit für die Zukunft des Growings?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Starte noch heute und erlebe, wie KI dein Grow-Management revolutioniert.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-full font-semibold text-xl hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
            >
              Kostenlos starten
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="text-white font-bold text-xl">HomeBud</span>
            </div>
            <div className="flex space-x-6 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
