'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/ui/BackButton'

export default function DatenschutzPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  // Datenschutz sections
  const datenschutzSections = [
    {
      title: "Datensammlung",
      content: "Wir sammeln nur die Daten, die für die Bereitstellung unserer Dienstleistungen erforderlich sind. Dazu gehören grundlegende Kontoinformationen, Grow-Daten und Nutzungsstatistiken.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Datensicherheit",
      content: "Alle Daten werden mit modernsten Verschlüsselungsstandards geschützt. Wir verwenden SSL/TLS-Verschlüsselung und speichern Daten in sicheren, zertifizierten Rechenzentren.",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Datennutzung",
      content: "Ihre Daten werden ausschließlich zur Verbesserung unserer Services und zur personalisierten Bereitstellung von Grow-Empfehlungen verwendet. Wir verkaufen niemals persönliche Daten.",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Cookies & Tracking",
      content: "Wir verwenden Cookies nur für die Funktionalität der App. Keine Tracking-Cookies von Drittanbietern. Sie können Cookies jederzeit in Ihren Browsereinstellungen deaktivieren.",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Ihre Rechte",
      content: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter datenschutz@homebud.app",
      color: "from-teal-500 to-cyan-600"
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
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative py-20 overflow-hidden"
      >
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
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Datenschutz
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-white/60 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Schutz Ihrer persönlichen Daten und Privatsphäre
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section ref={contentRef} className="relative py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            {datenschutzSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                  🔒
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <div className="text-white/80 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300"
          >
            Zurück zur Startseite
          </motion.button>
        </div>
      </footer>
    </div>
  )
}
