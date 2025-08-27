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
  mail: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  location: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  send: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

export default function ContactPage() {
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const formInView = useInView(formRef, { once: true, amount: 0.3 })

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  // Contact methods
  const contactMethods = [
    {
      icon: Icons.mail,
      title: "E-Mail",
      value: "info@homebud.com",
      description: "Wir antworten innerhalb von 24 Stunden",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Icons.phone,
      title: "Telefon",
      value: "+49 30 12345678",
      description: "Mo-Fr 9:00 - 18:00 Uhr",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Icons.location,
      title: "Adresse",
      value: "Musterstraße 123, 10115 Berlin",
      description: "Besuchen Sie uns gerne persönlich",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Icons.clock,
      title: "Support",
      value: "24/7 Verfügbar",
      description: "Unser KI-Support ist rund um die Uhr für Sie da",
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
              Kontakt
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Wir sind für Sie da! Kontaktieren Sie uns bei Fragen, Feedback oder Support-Anfragen.
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
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Nachricht senden</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              FAQ durchsuchen
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Methods Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Verschiedene <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Kontaktmöglichkeiten</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Wählen Sie die für Sie bequemste Art, uns zu erreichen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center cursor-pointer relative overflow-hidden group"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${method.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6`}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    {method.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                    {method.title}
                  </h3>
                  
                  <p className="text-white font-medium mb-2 group-hover:text-white transition-colors duration-300">
                    {method.value}
                  </p>
                  
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {method.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} id="contact-form" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={formInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Senden Sie uns eine <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Nachricht</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={formInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            {submitSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Nachricht erfolgreich gesendet!</h3>
                <p className="text-white/60 text-lg">Vielen Dank für Ihre Nachricht. Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="ihre.email@beispiel.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Betreff *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Bitte wählen Sie einen Betreff</option>
                    <option value="general">Allgemeine Anfrage</option>
                    <option value="support">Technischer Support</option>
                    <option value="billing">Abrechnung & Rechnung</option>
                    <option value="partnership">Partnerschaft & Kooperation</option>
                    <option value="feedback">Feedback & Vorschläge</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Beschreiben Sie Ihr Anliegen detailliert..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Wird gesendet...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Nachricht senden</span>
                        {Icons.send}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Häufig gestellte <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Fragen</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Finden Sie schnell Antworten auf die häufigsten Fragen.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Wie funktioniert das HomeBud-System?",
                answer: "Unser System kombiniert IoT-Sensoren, KI-Analyse und mobile Apps, um Ihren Grow-Prozess zu überwachen und zu optimieren."
              },
              {
                question: "Welche Pflanzen kann ich mit HomeBud anbauen?",
                answer: "HomeBud ist für alle Arten von Pflanzen optimiert, die in Innenräumen oder Gewächshäusern angebaut werden können."
              },
              {
                question: "Gibt es einen kostenlosen Test?",
                answer: "Ja, wir bieten eine 30-tägige kostenlose Testphase für alle unsere Pläne an."
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

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Alle FAQ anzeigen
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
                {Icons.logo}
              </div>
              <span className="text-white font-bold text-xl">HomeBud</span>
            </div>
            <div className="flex space-x-6 text-white/60">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Contact', href: '/contact' }
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className={`transition-colors ${item.href === '/contact' ? 'text-green-400' : 'hover:text-white'}`}
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
