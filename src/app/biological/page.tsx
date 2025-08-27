'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  MorphingBackground, 
  FloatingElements, 
  BackgroundBlobs, 
  AnimatedGradientText, 
  InteractiveCard, 
  HomeBudButton, 
  HomeBudNavigation, 
  HomeBudLogo, 
  HomeBudFooter 
} from '@/components/ui/HomeBudDesign'
import { 
  TestTube, 
  Leaf, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const biologicalModules = [
  {
    id: 'tissue-culture',
    name: 'Tissue Culture & Wurzel-Optimierung',
    description: 'Geführtes In-vitro-Stecklingsprotokoll mit haushaltsüblichen Hilfsmitteln',
    icon: TestTube,
    route: '/tissue-culture',
    features: [
      'Geführtes In-vitro-Stecklingsprotokoll mit haushaltsüblichen Hilfsmitteln',
      'Einfache sterile Checklisten ohne Profi-Laborgerät',
      'Digitale Klon-Akten mit Status-Tracking',
      'Monitoring und Erinnerungen für Medienwechsel und Umsetzungen'
    ],
    isPremium: true
  },
  {
    id: 'mycorrhiza-integration',
    name: 'Mykorrhiza-Integration',
    description: 'Pilzauswahl, Dosierungsrechner, Erfolgs-Monitoring',
    icon: Leaf,
    route: '/mycorrhiza',
    features: [
      'Empfehlung zertifizierter Mykorrhiza-Stämme',
      'Dosierungsrechner: optimale Sporenmenge je Topfgröße',
      'Einbindungs-Timeline mit Push-Remindern',
      'In-App-Wurzelbewertungsbogen für Dokumentation'
    ],
    isPremium: false
  },
  {
    id: 'trichoderma-application',
    name: 'Trichoderma-Anwendung',
    description: 'Schutz & Wachstum, Kombi-Pakete, integriertes Monitoring',
    icon: Shield,
    route: '/trichoderma',
    features: [
      'Auswahl passender Trichoderma-Stämme',
      'Kombi-Pakete: Mykorrhiza + Trichoderma für Synergien',
      'Fruchtkörper-Detektor: Foto-Upload erkennt Pilzwachstum',
      'Bodenbiologie-Dashboard: EC- und pH-Verlauf mit biologischer Aktivität'
    ],
    isPremium: true
  }
]

export default function BiologicalInnovationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-homebud-gradient text-white relative overflow-x-hidden">
      <MorphingBackground />
      <FloatingElements count={20} />
      <BackgroundBlobs />
      
      <HomeBudNavigation>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HomeBudLogo onClick={() => router.push('/')} />
            <div className="flex items-center space-x-4">
              <HomeBudButton variant="secondary" size="default">
                Alle Module aktivieren
              </HomeBudButton>
              <HomeBudButton variant="primary" size="default">
                Premium upgraden
              </HomeBudButton>
            </div>
          </div>
        </div>
      </HomeBudNavigation>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AnimatedGradientText className="text-5xl md:text-6xl font-bold mb-6">
              Biologische Innovationen
            </AnimatedGradientText>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Revolutionäre biologische Lösungen für optimale Pflanzenentwicklung. 
              Von Tissue Culture bis Mykorrhiza-Integration - wissenschaftlich fundiert und praxisnah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <InteractiveCard className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">+30%</h3>
              <p className="text-white/70">Ertragssteigerung mit Mykorrhiza</p>
            </InteractiveCard>
            <InteractiveCard className="p-6 text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">-80%</h3>
              <p className="text-white/70">Reduzierung von Wurzelkrankheiten</p>
            </InteractiveCard>
            <InteractiveCard className="p-6 text-center">
              <TestTube className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">100%</h3>
                              <p className="text-white/70">Professionelle Pflanzenvermehrung mit haushaltsüblichen Hilfsmitteln</p>
            </InteractiveCard>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-center mb-4">Verfügbare Module</h2>
            <p className="text-white/70 text-center max-w-2xl mx-auto">
              Wählen Sie aus unseren drei spezialisierten biologischen Innovationsmodulen 
              für professionellen Cannabis-Anbau.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {biologicalModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <InteractiveCard className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <module.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{module.name}</h3>
                        {module.isPremium && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 mb-6">{module.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/90 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <HomeBudButton 
                    variant="primary" 
                    className="w-full"
                    onClick={() => router.push(module.route)}
                  >
                    <span>Modul öffnen</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </HomeBudButton>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Warum biologische Innovationen?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Wissenschaftlich fundierte Lösungen für nachhaltigen und effizienten Cannabis-Anbau.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <InteractiveCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Wissenschaftliche Grundlage</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Peer-reviewed Studien und Forschungsergebnisse</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Zertifizierte Stämme und Qualitätskontrolle</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Optimierte Dosierungen basierend auf wissenschaftlichen Erkenntnissen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Langzeitstudien zur Effektivität und Sicherheit</span>
                </li>
              </ul>
            </InteractiveCard>

            <InteractiveCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Praktische Anwendung</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Schritt-für-Schritt Anleitungen für Hobbyanwender</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatisierte Erinnerungen und Zeitpläne</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>KI-gestützte Diagnose und Monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Community-basierte Erfahrungsberichte und Tipps</span>
                </li>
              </ul>
            </InteractiveCard>
          </div>
        </div>
      </section>

      <HomeBudFooter>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 HomeBud. Biologische Innovationen - Wissenschaftlich fundiert, praktisch anwendbar.</p>
          </div>
        </div>
      </HomeBudFooter>
    </div>
  )
}
