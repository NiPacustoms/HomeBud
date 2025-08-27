'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/ui/BackButton'
import { 
  MorphingBackground, 
  FloatingElements, 
  BackgroundBlobs, 
  AnimatedGradientText, 
  InteractiveCard, 
  HomeBudButton, 
  HomeBudLogo, 
  HomeBudFooter 
} from '@/components/ui/HomeBudDesign'

export default function AboutPage() {
  const router = useRouter()

  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })



  // Team members
  const teamMembers = [
    {
      id: 1,
      name: "Max Mustermann",
      role: "Gründer & CEO",
      description: "Experte für Grow-Management und KI-Entwicklung",
      avatar: "👨‍💼",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      name: "Anna Schmidt",
      role: "Lead Developer",
      description: "Full-Stack Entwicklerin mit Fokus auf KI-Integration",
      avatar: "👩‍💻",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 3,
      name: "Tom Weber",
      role: "Grow-Experte",
      description: "Professioneller Grower mit 15+ Jahren Erfahrung",
      avatar: "👨‍🌾",
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Morphing Background */}
      <MorphingBackground />
      
      {/* Floating Elements */}
      <FloatingElements count={25} />



      {/* Header Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative py-20 overflow-hidden"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-homebud-hero"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <BackgroundBlobs />
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
            <AnimatedGradientText size="hero" className="mb-6">
              Über HomeBud
            </AnimatedGradientText>
            <motion.p 
              className="text-2xl md:text-3xl text-white/80 mb-8 leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Die Zukunft des professionellen Cannabis-Anbaus beginnt hier
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <HomeBudButton variant="primary" size="large">
              Mehr erfahren
            </HomeBudButton>
            <HomeBudButton variant="secondary" size="large">
              Kontakt aufnehmen
            </HomeBudButton>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
        <FloatingElements count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={aboutInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <AnimatedGradientText size="large" className="mb-6">
              Unsere <span className="gradient-text-homebud">Mission</span>
            </AnimatedGradientText>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Wir revolutionieren den Cannabis-Anbau durch KI-gestützte Technologie und professionelle Werkzeuge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-6">Warum HomeBud?</h3>
              <div className="space-y-4 text-white/80">
                <p>HomeBud kombiniert jahrelange Erfahrung im Cannabis-Anbau mit modernster KI-Technologie.</p>
                <p>Unsere Plattform bietet professionelle Werkzeuge für jeden Grower, von Anfängern bis zu Experten.</p>
                <p>Durch kontinuierliche Forschung und Entwicklung bleiben wir an der Spitze der Innovation.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <div className="text-8xl">🌱</div>
              </div>
            </motion.div>
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-white mb-12">Unser Team</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <InteractiveCard
                  key={member.id}
                  className="text-center"
                  onClick={() => console.log(`Clicked ${member.name}`)}
                >
                  <div className={`w-24 h-24 bg-gradient-to-r ${member.color} rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6`}>
                    {member.avatar}
                  </div>
                  
                  <h4 className="text-xl font-semibold text-white mb-2">{member.name}</h4>
                  <p className="text-green-400 font-medium mb-3">{member.role}</p>
                  <p className="text-white/60">{member.description}</p>
                </InteractiveCard>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-12">Unsere Erfolge</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "50k+", label: "Erfolgreiche Grows" },
                { number: "99.9%", label: "VPD-Optimierung" },
                { number: "24/7", label: "Support" },
                { number: "4.9/5", label: "Bewertung" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold gradient-text-homebud mb-2">{stat.number}</div>
                  <div className="text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <HomeBudFooter>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <HomeBudLogo size="small" onClick={() => router.push('/')} />
          <div className="flex space-x-6 text-white/60">
            {[
              { label: 'Datenschutz', href: '/privacy' },
              { label: 'AGB', href: '/terms' },
              { label: 'Kontakt', href: '/contact' }
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </div>
      </HomeBudFooter>
    </div>
  )
}
