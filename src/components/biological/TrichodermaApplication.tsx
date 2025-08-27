'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Shield, 
  Calculator, 
  Calendar, 
  Camera, 
  BarChart3, 
  Zap,
  Save,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Activity,
  Droplets,
  TrendingUp
} from 'lucide-react'

interface TrichodermaStrain {
  id: string
  name: string
  scientificName: string
  targetPathogens: string[]
  benefits: string[]
  dosage: string
  price: string
  compatibility: string[]
  rating: number
}

interface DosagePlan {
  phase: string
  dosage: number
  frequency: string
  method: string
  notes: string
}

interface DiseaseTreatment {
  id: string
  disease: string
  severity: 'low' | 'medium' | 'high'
  treatment: string
  dosage: number
  frequency: string
  isActive: boolean
}

interface FungalDetection {
  id: string
  date: Date
  imageUrl: string
  detection: 'beneficial' | 'pathogenic' | 'unknown'
  confidence: number
  notes: string
}

interface SoilBiologyData {
  date: Date
  ec: number
  ph: number
  biologicalActivity: number
  trichodermaCount: number
  pathogenCount: number
}

export default function TrichodermaApplication() {
  const [activeTab, setActiveTab] = useState<'strains' | 'dosage' | 'disease' | 'detection' | 'dashboard'>('strains')
  const [selectedStrain, setSelectedStrain] = useState<string>('')
  const [detections, setDetections] = useState<FungalDetection[]>([])
  const [soilData, setSoilData] = useState<SoilBiologyData[]>([])

  const trichodermaStrains: TrichodermaStrain[] = [
    {
      id: 'trichoderma-harzianum-t22',
      name: 'Trichoderma harzianum T22',
      scientificName: 'Trichoderma harzianum strain T22',
      targetPathogens: [
        'Fusarium oxysporum',
        'Rhizoctonia solani',
        'Pythium spp.',
        'Botrytis cinerea'
      ],
      benefits: [
        'Wurzelkrankheiten-Schutz',
        'Verbesserte Nährstoffaufnahme',
        'Schnelle Kolonisierung',
        'Synergie mit Mykorrhiza'
      ],
      dosage: '2g/10L in Keimlösung, 1g/10L während Blüte',
      price: '€35/100g',
      compatibility: ['Mykorrhiza', 'Bacillus subtilis', 'Pseudomonas fluorescens'],
      rating: 4.9
    },
    {
      id: 'trichoderma-viride',
      name: 'Trichoderma viride',
      scientificName: 'Trichoderma viride',
      targetPathogens: [
        'Sclerotinia sclerotiorum',
        'Alternaria spp.',
        'Aspergillus spp.',
        'Penicillium spp.'
      ],
      benefits: [
        'Luftpilz-Kontrolle',
        'Antibiotika-Produktion',
        'Pflanzenwachstumsförderung',
        'Stress-Toleranz'
      ],
      dosage: '1.5g/10L alle 2 Wochen',
      price: '€30/100g',
      compatibility: ['Mykorrhiza', 'Azetobacter'],
      rating: 4.7
    },
    {
      id: 'trichoderma-koningii',
      name: 'Trichoderma koningii',
      scientificName: 'Trichoderma koningii',
      targetPathogens: [
        'Verticillium dahliae',
        'Fusarium solani',
        'Phytophthora spp.',
        'Sclerotium rolfsii'
      ],
      benefits: [
        'Bodenpilz-Kontrolle',
        'Enzym-Produktion',
        'Bodenstruktur-Verbesserung',
        'Organische Substanz-Abbau'
      ],
      dosage: '2.5g/10L beim Umtopfen',
      price: '€32/100g',
      compatibility: ['Mykorrhiza', 'Rhizobium'],
      rating: 4.6
    },
    {
      id: 'trichoderma-atroviride',
      name: 'Trichoderma atroviride',
      scientificName: 'Trichoderma atroviride',
      targetPathogens: [
        'Armillaria mellea',
        'Heterobasidion annosum',
        'Phellinus weirii',
        'Ganoderma spp.'
      ],
      benefits: [
        'Holzfäule-Kontrolle',
        'Lignin-Abbau',
        'Cellulose-Hydrolyse',
        'Antioxidantien-Produktion'
      ],
      dosage: '3g/10L für Wurzelbehandlung',
      price: '€38/100g',
      compatibility: ['Mykorrhiza', 'Bacillus thuringiensis'],
      rating: 4.5
    }
  ]

  const dosagePlans: DosagePlan[] = [
    {
      phase: 'Keimung',
      dosage: 2.0,
      frequency: 'Einmalig',
      method: 'In Keimlösung mischen',
      notes: 'Höhere Dosierung für schnelle Etablierung'
    },
    {
      phase: 'Vegetative Phase',
      dosage: 1.0,
      frequency: 'Alle 2 Wochen',
      method: 'Mit Gießwasser verabreichen',
      notes: 'Regelmäßige Anwendung für kontinuierlichen Schutz'
    },
    {
      phase: 'Blütephase',
      dosage: 1.0,
      frequency: 'Wöchentlich',
      method: 'Mit Dünger mischen',
      notes: 'Reduzierte Dosierung, aber höhere Frequenz'
    },
    {
      phase: 'Wartung',
      dosage: 0.5,
      frequency: 'Alle 3-4 Wochen',
      method: 'Top-Dressing',
      notes: 'Niedrige Dosierung zur Aufrechterhaltung'
    }
  ]

  const diseaseTreatments: DiseaseTreatment[] = [
    {
      id: '1',
      disease: 'Fusarium-Welke',
      severity: 'high',
      treatment: 'Trichoderma harzianum T22 + Mykorrhiza',
      dosage: 3.0,
      frequency: 'Alle 3 Tage',
      isActive: true
    },
    {
      id: '2',
      disease: 'Wurzelfäule',
      severity: 'medium',
      treatment: 'Trichoderma viride Spot-Behandlung',
      dosage: 2.5,
      frequency: 'Alle 5 Tage',
      isActive: true
    },
    {
      id: '3',
      disease: 'Grauschimmel',
      severity: 'low',
      treatment: 'Trichoderma koningii Blattspray',
      dosage: 1.5,
      frequency: 'Wöchentlich',
      isActive: false
    }
  ]

  const comboPackages = [
    {
      name: 'Mykorrhiza + Trichoderma Premium',
      description: 'Optimale Kombination für maximale Wurzelgesundheit',
      contents: [
        'Glomus intraradices (50g)',
        'Trichoderma harzianum T22 (30g)',
        'Anwendungsplan',
        'Monitoring-Tools'
      ],
      price: '€45',
      savings: '€15'
    },
    {
      name: 'Complete Soil Biology Kit',
      description: 'Vollständiges biologisches Bodenmanagement',
      contents: [
        'Mykorrhiza-Mix (100g)',
        'Trichoderma-Mix (50g)',
        'Bacillus subtilis (25g)',
        'pH-Regulator',
        'EC-Meter'
      ],
      price: '€75',
      savings: '€25'
    }
  ]

  const addFungalDetection = (detection: Omit<FungalDetection, 'id'>) => {
    const newDetection: FungalDetection = {
      ...detection,
      id: Date.now().toString()
    }
    setDetections([...detections, newDetection])
  }

  const getSoilBiologyTrends = () => {
    // Simulierte Daten für Bodenbiologie-Trends
    return {
      biologicalActivity: 85, // %
      trichodermaCount: 1200, // CFU/g
      pathogenCount: 45, // CFU/g
      trend: 'positive' as const
    }
  }

  return (
    <div className="min-h-screen bg-homebud-gradient text-white relative overflow-x-hidden">
      <MorphingBackground />
      <FloatingElements count={15} />
      <BackgroundBlobs />
      
      <HomeBudNavigation>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HomeBudLogo onClick={() => window.history.back()} />
            <div className="flex items-center space-x-4">
              <HomeBudButton variant="secondary" size="default">
                <Save className="w-4 h-4 mr-2" />
                Daten speichern
              </HomeBudButton>
              <HomeBudButton variant="primary" size="default">
                <Download className="w-4 h-4 mr-2" />
                Bericht exportieren
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
              Trichoderma-Anwendung
            </AnimatedGradientText>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Schutz & Wachstum mit Trichoderma-Stämmen. Kombi-Pakete mit Mykorrhiza, 
              Fruchtkörper-Detektor und integriertes Bodenbiologie-Monitoring.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="relative z-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
            {[
              { id: 'strains', name: 'Stammauswahl', icon: Shield },
              { id: 'dosage', name: 'Dosisplan', icon: Calculator },
              { id: 'disease', name: 'Krankheitsbehandlung', icon: Zap },
              { id: 'detection', name: 'Fruchtkörper-Detektor', icon: Camera },
              { id: 'dashboard', name: 'Bodenbiologie', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'strains' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Trichoderma-Stämme</h3>
                <p className="text-white/80 mb-6">
                  Wählen Sie aus unseren spezialisierten Trichoderma-Stämmen für optimalen 
                  Pflanzenschutz und Wachstumsförderung.
                </p>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                {trichodermaStrains.map((strain) => (
                  <InteractiveCard key={strain.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{strain.name}</h4>
                        <p className="text-white/70 italic">{strain.scientificName}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{strain.rating}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Ziel-Pathogene:</h5>
                      <div className="flex flex-wrap gap-1">
                        {strain.targetPathogens.map((pathogen, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                            {pathogen}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Vorteile:</h5>
                      <ul className="space-y-1 text-sm text-white/80">
                        {strain.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Kompatibilität:</h5>
                      <div className="flex flex-wrap gap-1">
                        {strain.compatibility.map((compat, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {compat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-white/70">Dosierung: {strain.dosage}</p>
                        <p className="text-white/70">{strain.price}</p>
                      </div>
                      <HomeBudButton 
                        variant={selectedStrain === strain.id ? "secondary" : "primary"}
                        size="small"
                        onClick={() => setSelectedStrain(strain.id)}
                      >
                        {selectedStrain === strain.id ? 'Ausgewählt' : 'Auswählen'}
                      </HomeBudButton>
                    </div>
                  </InteractiveCard>
                ))}
              </div>

              {/* Kombi-Pakete */}
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Kombi-Pakete für Synergien</h3>
                <p className="text-white/80 mb-6">
                  Optimierte Kombinationen von Mykorrhiza und Trichoderma für maximale Effektivität.
                </p>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                {comboPackages.map((pkg, index) => (
                  <InteractiveCard key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{pkg.name}</h4>
                        <p className="text-white/70">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{pkg.price}</p>
                        <p className="text-sm text-green-400">Sparen Sie {pkg.savings}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Inhalt:</h5>
                      <ul className="space-y-1 text-sm text-white/80">
                        {pkg.contents.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <HomeBudButton variant="primary" className="w-full">
                      Paket bestellen
                    </HomeBudButton>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'dosage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Dosisplan pro Wachstumsphase</h3>
                <p className="text-white/80 mb-6">
                  Optimierte Dosierung und Anwendung von Trichoderma während des gesamten Wachstumszyklus.
                </p>
              </InteractiveCard>

              <div className="grid gap-4">
                {dosagePlans.map((plan, index) => (
                  <InteractiveCard key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-lg font-semibold">{index + 1}</span>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold">{plan.phase}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                            <span>Dosierung: {plan.dosage}g/10L</span>
                            <span>Frequenz: {plan.frequency}</span>
                            <span>Methode: {plan.method}</span>
                          </div>
                          <p className="text-sm text-white/80 mt-2">{plan.notes}</p>
                        </div>
                      </div>
                      
                      <HomeBudButton variant="primary" size="small">
                        Anwenden
                      </HomeBudButton>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'disease' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Krankheitsbehandlung</h3>
                <p className="text-white/80 mb-6">
                  Spezifische Behandlungsprotokolle für verschiedene Pflanzenkrankheiten mit Trichoderma.
                </p>
              </InteractiveCard>

              <div className="grid gap-4">
                {diseaseTreatments.map((treatment) => (
                  <InteractiveCard key={treatment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          treatment.severity === 'high' ? 'bg-red-500/20' :
                          treatment.severity === 'medium' ? 'bg-yellow-500/20' :
                          'bg-green-500/20'
                        }`}>
                          <AlertCircle className={`w-6 h-6 ${
                            treatment.severity === 'high' ? 'text-red-400' :
                            treatment.severity === 'medium' ? 'text-yellow-400' :
                            'text-green-400'
                          }`} />
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold">{treatment.disease}</h4>
                          <p className="text-white/70">{treatment.treatment}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                            <span>Dosierung: {treatment.dosage}g/10L</span>
                            <span>Frequenz: {treatment.frequency}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              treatment.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {treatment.isActive ? 'Aktiv' : 'Inaktiv'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <HomeBudButton 
                          variant={treatment.isActive ? "secondary" : "primary"}
                          size="small"
                        >
                          {treatment.isActive ? 'Pausieren' : 'Aktivieren'}
                        </HomeBudButton>
                        <HomeBudButton variant="secondary" size="small">
                          Anpassen
                        </HomeBudButton>
                      </div>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'detection' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fruchtkörper-Detektor</h3>
                  <p className="text-white/80">
                    KI-gestützte Erkennung von Pilzwachstum - unterscheidet zwischen Nutz- und Schadpilzen.
                  </p>
                </div>
                <HomeBudButton variant="primary">
                  <Camera className="w-4 h-4 mr-2" />
                  Foto hochladen
                </HomeBudButton>
              </div>

              {detections.length === 0 ? (
                <InteractiveCard className="p-12 text-center">
                  <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Noch keine Pilz-Detektionen</h4>
                  <p className="text-white/70 mb-4">
                    Laden Sie ein Foto hoch, um Pilzwachstum zu analysieren und zu klassifizieren.
                  </p>
                  <HomeBudButton variant="primary">
                    Erste Analyse starten
                  </HomeBudButton>
                </InteractiveCard>
              ) : (
                <div className="grid gap-4">
                  {detections.map((detection) => (
                    <InteractiveCard key={detection.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white/50" />
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold">
                              Pilz-Detektion - {detection.date.toLocaleDateString()}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                              <span className={`px-2 py-1 rounded text-xs ${
                                detection.detection === 'beneficial' ? 'bg-green-500/20 text-green-400' :
                                detection.detection === 'pathogenic' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {detection.detection === 'beneficial' ? 'Nützlich' :
                                 detection.detection === 'pathogenic' ? 'Pathogen' : 'Unbekannt'}
                              </span>
                              <span>Konfidenz: {detection.confidence}%</span>
                            </div>
                            <p className="text-sm text-white/80 mt-2">{detection.notes}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <HomeBudButton variant="secondary" size="small">
                            Details
                          </HomeBudButton>
                          <HomeBudButton variant="secondary" size="small">
                            Bearbeiten
                          </HomeBudButton>
                        </div>
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Bodenbiologie-Dashboard</h3>
                <p className="text-white/80 mb-6">
                  EC- und pH-Verlauf ergänzt um biologischen Aktivitäts-Score und Pilz-Populationen.
                </p>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Bodenparameter</h4>
                  {(() => {
                    const trends = getSoilBiologyTrends()
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <span className="text-white/70">Biologische Aktivität:</span>
                          </div>
                          <span className="text-xl font-bold text-blue-400">
                            {trends.biologicalActivity}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="text-white/70">Trichoderma (CFU/g):</span>
                          </div>
                          <span className="text-xl font-bold text-green-400">
                            {trends.trichodermaCount.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-white/70">Pathogene (CFU/g):</span>
                          </div>
                          <span className="text-xl font-bold text-red-400">
                            {trends.pathogenCount}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </InteractiveCard>

                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Trends & Empfehlungen</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">Positiver Trend</span>
                      </div>
                      <p className="text-sm text-white/80">
                        Trichoderma-Population steigt kontinuierlich. Biologische Aktivität ist optimal.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">Empfehlung</span>
                      </div>
                      <p className="text-sm text-white/80">
                        Erhöhen Sie die Trichoderma-Dosierung in der Blütephase für maximalen Schutz.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Droplets className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">Wasserqualität</span>
                      </div>
                      <p className="text-sm text-white/80">
                        pH-Wert leicht erhöht. Verwenden Sie pH-regulierende Zusätze.
                      </p>
                    </div>
                  </div>
                </InteractiveCard>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <HomeBudFooter>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 HomeBud. Trichoderma-Anwendung - Schutz & Wachstum.</p>
          </div>
        </div>
      </HomeBudFooter>
    </div>
  )
}
