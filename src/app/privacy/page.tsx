'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/ui/BackButton'

// Icons
const Icons = {
  logo: (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  lock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  eye: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function PrivacyPage() {
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const contentInView = useInView(contentRef, { once: true, amount: 0.3 })

  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Navigation visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsNavVisible(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Privacy sections
  const privacySections = [
    {
      icon: Icons.shield,
      title: "Datensammlung",
      content: "Wir sammeln nur die Daten, die für die Bereitstellung unserer Dienstleistungen erforderlich sind. Dazu gehören grundlegende Kontoinformationen, Grow-Daten und Nutzungsstatistiken.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Icons.lock,
      title: "Datensicherheit",
      content: "Alle Daten werden mit modernsten Verschlüsselungsstandards geschützt. Wir verwenden SSL/TLS-Verschlüsselung und speichern Daten in sicheren, zertifizierten Rechenzentren.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Icons.eye,
      title: "Datennutzung",
      content: "Ihre Daten werden ausschließlich zur Verbesserung unserer Services und zur personalisierten Bereitstellung von Grow-Empfehlungen verwendet. Wir verkaufen niemals persönliche Daten.",
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
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
                {Icons.logo}
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

      {/* Header Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative py-20 overflow-hidden"
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
            <div className="flex items-center justify-between mb-4">
              <BackButton href="/" />
            </div>
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
              Datenschutz
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Ihr Vertrauen ist uns wichtig. Wir schützen Ihre Daten mit höchsten Sicherheitsstandards.
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Kontaktiere uns</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              PDF herunterladen
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Privacy Overview Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Datenschutz <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Übersicht</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Wir sind verpflichtet, Ihre Privatsphäre zu schützen und transparent über unsere Datenschutzpraktiken zu informieren.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center cursor-pointer relative overflow-hidden group"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${section.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6`}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    {section.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                    {section.title}
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Privacy Content */}
      <section ref={contentRef} className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={contentInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Data Collection */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Datensammlung</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Kontoinformationen:</strong> Name, E-Mail-Adresse, Telefonnummer (optional) für die Kontoerstellung und Kommunikation.
                </p>
                <p>
                  <strong>Grow-Daten:</strong> Informationen über Ihre Pflanzen, Wachstumsphasen, Nährstoffverbrauch und Ernteergebnisse.
                </p>
                <p>
                  <strong>Nutzungsdaten:</strong> Wie Sie unsere App verwenden, welche Features Sie nutzen und wie oft Sie sich einloggen.
                </p>
                <p>
                  <strong>Geräteinformationen:</strong> Gerätetyp, Betriebssystem und App-Version für optimale Funktionalität.
                </p>
              </div>
            </div>

            {/* Data Usage */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Verwendung Ihrer Daten</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Service-Bereitstellung:</strong> Wir verwenden Ihre Daten, um Ihnen Zugang zu unseren Grow-Management-Tools zu gewähren.
                </p>
                <p>
                  <strong>Personalisierung:</strong> Ihre Grow-Daten helfen uns, personalisierte Empfehlungen und Analysen zu erstellen.
                </p>
                <p>
                  <strong>Service-Verbesserung:</strong> Wir analysieren anonymisierte Nutzungsdaten, um unsere App kontinuierlich zu verbessern.
                </p>
                <p>
                  <strong>Kommunikation:</strong> Wir kontaktieren Sie bei wichtigen Updates, Sicherheitswarnungen oder Support-Anfragen.
                </p>
              </div>
            </div>

            {/* Data Protection */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Datenschutzmaßnahmen</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Verschlüsselung:</strong> Alle Daten werden mit AES-256-Verschlüsselung geschützt, sowohl bei der Übertragung als auch bei der Speicherung.
                </p>
                <p>
                  <strong>Zugriffskontrolle:</strong> Nur autorisierte Mitarbeiter haben Zugang zu Ihren Daten, und dieser Zugriff wird streng überwacht.
                </p>
                <p>
                  <strong>Regelmäßige Audits:</strong> Wir führen regelmäßige Sicherheitsaudits durch, um unsere Datenschutzmaßnahmen zu überprüfen.
                </p>
                <p>
                  <strong>Backup-Sicherheit:</strong> Alle Backups werden verschlüsselt und in sicheren, geografisch verteilten Rechenzentren gespeichert.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Ihre Rechte</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Zugriff:</strong> Sie haben das Recht, alle Daten einzusehen, die wir über Sie gespeichert haben.
                </p>
                <p>
                  <strong>Berichtigung:</strong> Sie können ungenaue oder unvollständige Daten korrigieren lassen.
                </p>
                <p>
                  <strong>Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen, außer wenn wir sie aus rechtlichen Gründen aufbewahren müssen.
                </p>
                <p>
                  <strong>Datenübertragbarkeit:</strong> Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.
                </p>
                <p>
                  <strong>Widerspruch:</strong> Sie können der Verarbeitung Ihrer Daten für bestimmte Zwecke widersprechen.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Kontakt</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte:
                </p>
                <div className="bg-white/10 rounded-xl p-6">
                  <p><strong>E-Mail:</strong> privacy@homebud.com</p>
                  <p><strong>Telefon:</strong> +49 30 12345678</p>
                  <p><strong>Adresse:</strong> HomeBud GmbH, Datenschutz, Musterstraße 123, 10115 Berlin</p>
                </div>
                <p className="text-sm text-white/60 mt-4">
                  Wir werden alle Anfragen innerhalb von 30 Tagen beantworten.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                {Icons.logo}
              </div>
              <span className="text-white font-bold text-xl">HomeBud</span>
            </div>
            <div className="flex space-x-6 text-white/60">
              {[
                { label: 'Datenschutz', href: '/privacy' },
                { label: 'AGB', href: '/terms' },
                { label: 'Kontakt', href: '/contact' }
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className={`transition-colors ${item.href === '/privacy' ? 'text-green-400' : 'hover:text-white'}`}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
