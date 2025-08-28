'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoNoBackground } from '@/components/ui/Logo'


interface Feature {
  id: string
  title: string
  description: string
  icon: string
  color: string
  status: 'available' | 'coming-soon' | 'beta'
}

const features: Feature[] = [
  {
    id: 'ai-diagnosis',
    title: 'KI-gestützte Diagnose',
    description: 'Analysieren Sie Ihre Pflanzen mit künstlicher Intelligenz und erhalten Sie professionelle Empfehlungen.',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-600',
    status: 'available'
  },
  {
    id: 'grow-tracking',
    title: 'Grow-Tracking',
    description: 'Verfolgen Sie den Fortschritt Ihrer Pflanzen von der Keimung bis zur Ernte.',
    icon: '🌱',
    color: 'from-green-500 to-emerald-600',
    status: 'available'
  },
  {
    id: 'vpd-optimization',
    title: 'VPD-Optimierung',
    description: 'Optimieren Sie das Vapor Pressure Deficit für perfekte Wachstumsbedingungen.',
    icon: '🌡️',
    color: 'from-purple-500 to-pink-600',
    status: 'available'
  },
  {
    id: 'nutrient-management',
    title: 'Nährstoff-Management',
    description: 'Verwalten Sie Ihre Düngepläne und optimieren Sie die Nährstoffzufuhr.',
    icon: '🌿',
    color: 'from-orange-500 to-red-600',
    status: 'coming-soon'
  },
  {
    id: 'community',
    title: 'Grower-Community',
    description: 'Tauschen Sie sich mit anderen Growern aus und teilen Sie Ihre Erfahrungen.',
    icon: '👥',
    color: 'from-indigo-500 to-purple-600',
    status: 'coming-soon'
  },
  {
    id: 'analytics',
    title: 'Erweiterte Analytics',
    description: 'Detaillierte Statistiken und Berichte für professionelle Grower.',
    icon: '📊',
    color: 'from-teal-500 to-cyan-600',
    status: 'coming-soon'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Max Mustermann',
    role: 'Hobby-Grower',
    content: 'HomeBud hat mein Growing komplett revolutioniert. Die KI-Diagnose funktioniert erstaunlich gut!',
    avatar: '👨‍🌾',
    rating: 5
  },
  {
    id: 2,
    name: 'Anna Schmidt',
    role: 'Semi-Professional',
    content: 'Endlich eine App, die wirklich für Grower entwickelt wurde. Die VPD-Optimierung ist ein Game-Changer.',
    avatar: '👩‍🌾',
    rating: 5
  },
  {
    id: 3,
    name: 'Tom Weber',
    role: 'Professioneller Grower',
    content: 'Die Analytics und das Tracking sind auf professionellem Niveau. Sehr empfehlenswert!',
    avatar: '👨‍💼',
    rating: 5
  }
]

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

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



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'from-green-500 to-emerald-600'
      case 'coming-soon': return 'from-yellow-500 to-orange-600'
      case 'beta': return 'from-purple-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Verfügbar'
      case 'coming-soon': return 'Demnächst'
      case 'beta': return 'Beta'
      default: return status
    }
  }

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
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Premium Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20"
            animate={{ opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Floating orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -40, 0],
              y: [0, 25, 0]
            }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Additional premium orbs */}
          <motion.div 
            className="absolute top-1/3 right-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-2xl"
            animate={{ 
              scale: [0.8, 1.1, 0.8],
              rotate: [0, 90, 180],
              opacity: [0.35, 0.5, 0.35]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1.1, 0.9, 1.1],
              rotate: [180, 270, 360],
              opacity: [0.4, 0.55, 0.4]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Particle effects */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              style={{
                left: `${(i * 13) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.15, 0.4, 0.15],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 6 + (i % 3) * 0.8,
                repeat: Infinity,
                delay: (i % 4) * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
          
          {/* Geometric shapes */}
          <motion.div 
            className="absolute top-1/6 right-1/6 w-32 h-32 border border-green-500/20 rounded-lg"
            animate={{ 
              rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
              scale: [1, 1.06, 1],
              opacity: [0.22, 0.32, 0.22]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-1/6 left-1/6 w-24 h-24 border border-emerald-500/20 rounded-full"
            animate={{ 
              rotate: [360, 270, 180, 90, 0],
              scale: [1, 0.9, 1],
              opacity: [0.28, 0.4, 0.28]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Energy waves */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mb-16"
          >
            <div className="flex justify-center">
              <div className="relative -mt-16 inline-block">

                

 
                                 {/* Schaukelnde Lampe aus Bild */}
                 <motion.div
                   className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20"
                   style={{
                     transformOrigin: 'top center'
                   }}
                   animate={{
                     rotate: [-3, 3, -3],
                     y: [0, -2, 0]
                   }}
                   transition={{
                     rotate: {
                       duration: 4,
                       repeat: Infinity,
                       ease: "easeInOut"
                     },
                     y: {
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }
                   }}
                 >
                   {/* Lampenkabel */}
                   <div className="w-0.5 h-16 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto mb-2"></div>
                   
                   {/* Lampe aus Bild */}
                   <div className="relative">
                     <img
                       src="/Design ohne Titel (26).png"
                       alt="Growlampe"
                       className="mx-auto drop-shadow-lg"
                       style={{
                         width: '768px',
                         height: 'auto',
                         filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                       }}
                     />
                   </div>
                   
                   {/* Lichtkegel von der Lampe */}
                   <motion.div
                     className="absolute top-16 left-1/2 transform -translate-x-1/2 w-48 h-32"
                     style={{
                       background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
                       transformOrigin: 'center top',
                       filter: 'blur(8px)'
                     }}
                     animate={{
                       opacity: [0.4, 0.8, 0.4],
                       scale: [0.95, 1.05, 0.95]
                     }}
                     transition={{
                       duration: 3,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   />
                 </motion.div>

                {/* Leichter weißer Blur-Effekt hinter dem Logo */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    filter: 'blur(20px)',
                    transform: 'translateY(10px)'
                  }}
                />
   
                  <LogoNoBackground size="3xl" className="relative mix-blend-normal block" />
              </div>
            </div>
            <motion.p 
              className="text-2xl md:text-3xl text-white/60 max-w-4xl mx-auto leading-relaxed -mt-20 md:-mt-32 mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Die intelligente App für professionelles Cannabis-Growing mit KI-gestützter Diagnose, 
              VPD-Optimierung und umfassendem Tracking.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Registrieren</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Premium button effects */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Floating sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  style={{
                    left: `${20 + (i * 30)}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.25, 0.6, 0.25],
                    scale: [0, 1, 0],
                    x: [0, (i % 2 === 0 ? 5 : -5), 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                />
              ))}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Anmelden
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '10,000+', label: 'Aktive Grower' },
              { value: '95%', label: 'Zufriedenheit' },
              { value: '24/7', label: 'KI-Support' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 1 + index * 0.15 }}
                className="text-center relative group"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {/* Background glow effect */}
          <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ 
                    scale: [1, 1.06, 1],
                    opacity: [0.28, 0.45, 0.28]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(16, 185, 129, 0.3)',
                        '0 0 20px rgba(16, 185, 129, 0.6)',
                        '0 0 10px rgba(16, 185, 129, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    {stat.value}
          </motion.div>
                  <div className="text-white/60">{stat.label}</div>
        </div>
                
                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
                    className="absolute w-1 h-1 bg-green-400/40 rounded-full"
              style={{
                      left: `${30 + (i * 20)}%`,
                      top: `${20 + (i * 10)}%`,
              }}
              animate={{
                      y: [0, -15, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (i % 2 === 0 ? 4 : -4), 0]
              }}
              transition={{
                      duration: 2 + i * 0.3,
                repeat: Infinity,
                      delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
        

      </section>

      {/* Rest der Seite mit Hintergrund-Gradient (Grün → Schwarz, von unten nach oben) */}
      <div className="bg-gradient-to-t from-emerald-600/30 to-black">
 
      {/* Features Section */}
      <section id="features" className="py-20 relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.id} className="relative" style={{ perspective: 1000 }}>
                <motion.div
                  className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 cursor-pointer group hover:bg-white/15 transition-colors duration-200 will-change-transform"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'center', backfaceVisibility: 'hidden' }}
                  initial={{ 
                    x: index < 3 ? -100 : 100, 
                    y: 50, 
                    opacity: 0,
                    rotateY: index < 3 ? -15 : 15
                  }}
                  whileInView={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    rotateY: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: (index % 3) * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transition = 'transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    el.style.transform = `translateZ(20px) scale(1.04) rotateX(0deg) rotateY(0deg)`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transition = 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    el.style.transform = ''
                    el.style.boxShadow = ''
                  }}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    const rect = el.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2
                    const mouseX = e.clientX
                    const mouseY = e.clientY
                    
                    const rotateX = ((mouseY - centerY) / (rect.height / 2)) * -8
                    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 8
                    
                    el.style.transition = 'transform 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    el.style.transform = `translateZ(20px) scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                    el.style.boxShadow = `${rotateY * 0.5}px ${rotateX * 0.5}px 20px rgba(0, 0, 0, 0.3)`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl backdrop-blur-sm`}></div>
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(feature.status)} text-white`}>
                        {getStatusText(feature.status)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <motion.div
                 initial={{ y: 50, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Was unsere <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Grower</span> sagen
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Echte Erfahrungsberichte von Growern, die HomeBud bereits nutzen.
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
                 <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{testimonials[activeTestimonial]?.avatar}</div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial]?.rating || 0)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <blockquote className="text-xl text-white/80 mb-6 italic">
                  "{testimonials[activeTestimonial]?.content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{testimonials[activeTestimonial]?.name}</div>
                  <div className="text-white/60">{testimonials[activeTestimonial]?.role}</div>
                </div>
                 </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-green-500' : 'bg-white/20'
                  }`}
                  aria-label={`Testimonial ${index + 1} anzeigen`}
                  title={`Testimonial ${index + 1} anzeigen`}
                />
             ))}
           </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
                Anmelden
            </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">HomeBud</span>
              </div>
              <p className="text-white/60 mb-4 max-w-md">
                Die intelligente App für professionelles Cannabis-Growing mit KI-gestützter Diagnose und umfassendem Tracking.
              </p>
              <div className="flex space-x-4">
                {['🌐', '📱', '💬', '📧'].map((icon, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg hover:bg-white/20 transition-all duration-300"
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Produkt</h3>
              <ul className="space-y-2 text-white/60">
                {['Features', 'Preise'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href={`/${item.toLowerCase() === 'features' ? '#features' : item.toLowerCase()}`}
                      className="hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Unternehmen</h3>
              <ul className="space-y-2 text-white/60">
                {['Über uns', 'Kontakt'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/40 text-sm mb-4 md:mb-0">
              © 2024 HomeBud. Alle Rechte vorbehalten.
            </div>
            <div className="flex space-x-6 text-white/60 text-sm">
              {['Datenschutz', 'AGB', 'Impressum'].map((item) => (
                <motion.a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
