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
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

export default function TermsPage() {
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const contentInView = useInView(contentRef, { once: true, amount: 0.3 })

  // Navigation visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsNavVisible(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Terms sections
  const termsSections = [
    {
      icon: Icons.document,
      title: "Nutzungsbedingungen",
      content: "Diese Bedingungen regeln die Nutzung unserer HomeBud-Plattform und definieren die Rechte und Pflichten aller Nutzer.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Icons.check,
      title: "Akzeptierte Nutzung",
      content: "Unsere Plattform darf nur für legale Zwecke und in Übereinstimmung mit geltendem Recht verwendet werden.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Icons.warning,
      title: "Haftungsausschluss",
      content: "Wir übernehmen keine Haftung für Schäden, die durch die Nutzung unserer Plattform entstehen könnten.",
      color: "from-amber-500 to-orange-600"
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
              Nutzungsbedingungen
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Bitte lesen Sie diese Bedingungen sorgfältig durch, bevor Sie unsere Plattform nutzen.
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

      {/* Terms Overview Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Wichtige <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Grundsätze</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Diese Grundsätze bilden die Basis für eine faire und sichere Nutzung unserer Plattform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {termsSections.map((section, index) => (
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

      {/* Detailed Terms Content */}
      <section ref={contentRef} className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={contentInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* General Terms */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Allgemeine Bedingungen</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Geltungsbereich:</strong> Diese Nutzungsbedingungen gelten für alle Nutzer der HomeBud-Plattform, 
                  einschließlich der Website, mobilen App und aller damit verbundenen Services.
                </p>
                <p>
                  <strong>Änderungen:</strong> Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. 
                  Nutzer werden über wesentliche Änderungen informiert.
                </p>
                <p>
                  <strong>Akzeptanz:</strong> Durch die Nutzung unserer Plattform akzeptieren Sie diese Bedingungen 
                  vollständig und stimmen zu, sich daran zu halten.
                </p>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Nutzer-Verantwortlichkeiten</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Legale Nutzung:</strong> Sie verpflichten sich, unsere Plattform nur für legale Zwecke zu nutzen 
                  und alle geltenden Gesetze und Vorschriften einzuhalten.
                </p>
                <p>
                  <strong>Kontoinformationen:</strong> Sie sind verantwortlich für die Vertraulichkeit Ihrer Anmeldedaten 
                  und alle Aktivitäten, die unter Ihrem Konto stattfinden.
                </p>
                <p>
                  <strong>Inhalte:</strong> Sie sind verantwortlich für alle Inhalte, die Sie auf unserer Plattform hochladen, 
                  teilen oder veröffentlichen.
                </p>
                <p>
                  <strong>Respektvoller Umgang:</strong> Wir erwarten von allen Nutzern einen respektvollen Umgang 
                  mit anderen Mitgliedern der Community.
                </p>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Verbotene Aktivitäten</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Illegale Aktivitäten:</strong> Die Nutzung unserer Plattform für illegale Zwecke ist streng verboten.
                </p>
                <p>
                  <strong>Schädliche Inhalte:</strong> Das Hochladen von schädlichen, beleidigenden oder unangemessenen 
                  Inhalten ist nicht erlaubt.
                </p>
                <p>
                  <strong>Spam und Werbung:</strong> Unerwünschte Werbung, Spam oder andere störende Aktivitäten sind verboten.
                </p>
                <p>
                  <strong>System-Manipulation:</strong> Versuche, unsere Systeme zu manipulieren oder zu hacken, sind untersagt.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Geistiges Eigentum</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Plattform-Inhalte:</strong> Alle Inhalte, Designs und Technologien auf unserer Plattform 
                  sind das geistige Eigentum von HomeBud oder unseren Partnern.
                </p>
                <p>
                  <strong>Nutzungslizenz:</strong> Wir gewähren Ihnen eine begrenzte, nicht-exklusive Lizenz zur 
                  Nutzung unserer Plattform für den vorgesehenen Zweck.
                </p>
                <p>
                  <strong>Ihre Inhalte:</strong> Sie behalten die Rechte an Ihren eigenen Inhalten, gewähren uns 
                  aber eine Lizenz zur Nutzung im Rahmen unserer Services.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Haftungsbeschränkung</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Keine Garantie:</strong> Wir stellen unsere Plattform "wie besehen" zur Verfügung, 
                  ohne ausdrückliche oder stillschweigende Garantien.
                </p>
                <p>
                  <strong>Haftungsausschluss:</strong> HomeBud haftet nicht für indirekte, zufällige oder 
                  Folgeschäden, die durch die Nutzung unserer Plattform entstehen könnten.
                </p>
                <p>
                  <strong>Haftungshöchstbetrag:</strong> Unsere Gesamthaftung ist auf den Betrag begrenzt, 
                  den Sie in den letzten 12 Monaten für unsere Services gezahlt haben.
                </p>
              </div>
            </div>

            {/* Termination */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Kündigung</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong>Ihrerseits:</strong> Sie können Ihr Konto jederzeit kündigen, indem Sie sich an 
                  unseren Support wenden.
                </p>
                <p>
                  <strong>Unsererseits:</strong> Wir können Ihr Konto bei Verstößen gegen diese Bedingungen 
                  oder aus anderen wichtigen Gründen kündigen.
                </p>
                <p>
                  <strong>Nach Kündigung:</strong> Nach der Kündigung verlieren Sie den Zugang zu unseren 
                  Services, aber Ihre Daten werden gemäß unserer Datenschutzerklärung behandelt.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">Kontakt</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns bitte:
                </p>
                <div className="bg-white/10 rounded-xl p-6">
                  <p><strong>E-Mail:</strong> legal@homebud.com</p>
                  <p><strong>Telefon:</strong> +49 30 12345678</p>
                  <p><strong>Adresse:</strong> HomeBud GmbH, Rechtsabteilung, Musterstraße 123, 10115 Berlin</p>
                </div>
                <p className="text-sm text-white/60 mt-4">
                  Letzte Aktualisierung: Dezember 2024
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
                  className={`transition-colors ${item.href === '/terms' ? 'text-green-400' : 'hover:text-white'}`}
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
