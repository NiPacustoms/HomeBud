'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Icons
const Icons = {
  logo: () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
}

export default function PricingPage() {
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [, setSelectedPlan] = useState('pro')
  const heroRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 })

  // Navigation visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsNavVisible(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Pricing plans
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '19',
      period: 'Monat',
      description: 'Perfekt für Einsteiger und kleine Grows',
      features: [
        'Bis zu 3 Pflanzen',
        'Grundlegende Grow-Phasen-Tracking',
        'Basis-Statistiken',
        'Community-Support',
        'Mobile App'
      ],
      color: 'from-blue-500 to-cyan-600',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '29',
      period: 'Monat',
      description: 'Für ernsthafte Grower und kommerzielle Projekte',
      features: [
        'Unbegrenzte Pflanzen',
        'KI-gestützte Trichom-Analyse',
        'VPD-Optimierung',
        'Erweiterte Analytics',
        'Nährstoff-Management',
        '24/7 Support',
        'API-Zugang',
        'Team-Funktionen'
      ],
      color: 'from-green-500 to-emerald-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '49',
      period: 'Monat',
      description: 'Für große Grow-Operationen und Unternehmen',
      features: [
        'Alle Pro-Features',
        'White-Label-Lösung',
        'Dedizierter Account Manager',
        'Custom Integration',
        'On-Premise Deployment',
        'SLA-Garantie',
        'Schulungen & Workshops',
        'Priority Support'
      ],
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20"></div>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: isLoaded ? `${Math.random() * 100}%` : '0%',
              top: isLoaded ? `${Math.random() * 100}%` : '0%',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isNavVisible ? 0 : -100, opacity: isNavVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Icons.logo />
              </div>
              <span className="text-white font-bold text-xl">HomeBud</span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Zurück</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: 'linear-gradient(45deg, #10b981, #059669, #10b981)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Preise
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Wählen Sie den perfekten Plan für Ihre Grow-Bedürfnisse.
            </motion.p>
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
              onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Pläne anzeigen</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Kostenlos testen
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing-section" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={pricingInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Transparente <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Preise</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Keine versteckten Kosten. Wählen Sie den Plan, der zu Ihnen passt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 cursor-pointer group ${
                  plan.popular ? 'ring-2 ring-green-500/50' : ''
                }`}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                animate={pricingInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={pricingInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1"
                  >
                    <span>⭐</span>
                    <span>Beliebt</span>
                  </motion.div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                      {plan.name}
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">€</span>
                        <span className="text-6xl font-bold text-white ml-1">{plan.price}</span>
                        <span className="text-white/60 ml-2">/{plan.period}</span>
                      </div>
                    </div>
                    
                    <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ x: -20, opacity: 0 }}
                        animate={pricingInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center space-x-3 text-white/80 group-hover:text-white transition-colors duration-300"
                      >
                        <div className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icons.check />
                        </div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-500/25'
                        : 'border-2 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">
                      {plan.id === 'starter' ? 'Kostenlos starten' : 'Jetzt wählen'}
                    </span>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={pricingInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-white/60 text-lg mb-6">
              Alle Pläne beinhalten eine 30-tägige kostenlose Testphase
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Kontakt für Enterprise
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Häufige <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Fragen</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen zu unseren Preisen.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Kann ich meinen Plan jederzeit wechseln?",
                answer: "Ja, Sie können Ihren Plan jederzeit hoch- oder herabstufen. Änderungen werden zum nächsten Abrechnungszeitpunkt wirksam."
              },
              {
                question: "Gibt es eine Mindestvertragslaufzeit?",
                answer: "Nein, alle unsere Pläne sind monatlich kündbar. Sie können jederzeit ohne zusätzliche Kosten kündigen."
              },
              {
                question: "Was passiert nach der kostenlosen Testphase?",
                answer: "Nach 30 Tagen wird Ihr Konto automatisch auf den gewählten kostenpflichtigen Plan umgestellt, falls Sie nicht kündigen."
              },
              {
                question: "Bieten Sie Rabatte für Jahresabonnements?",
                answer: "Ja, bei Jahresabonnements erhalten Sie 2 Monate kostenlos. Das entspricht einem Rabatt von 17%."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer group hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Icons.logo />
              </div>
              <span className="text-white font-bold text-xl">HomeBud</span>
            </div>
            <div className="flex space-x-6 text-white/60">
              {['Datenschutz', 'AGB', 'Kontakt'].map((item) => (
                <motion.a
                  key={item}
                  href={`/${item === 'Datenschutz' ? 'privacy' : item === 'AGB' ? 'terms' : 'contact'}`}
                  className="transition-colors hover:text-white"
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
  )
}