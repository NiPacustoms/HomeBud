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
  BarChart3, 
  Save,
  Download,
  Clock,
  CheckCircle,
  Info,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Target,
  Droplet,
  Package
} from 'lucide-react'
import { 
  trichodermaService, 
  TrichodermaStrain, 
  ComboPackage, 
  DosageCalculation,
  ApplicationRecord 
} from '@/services/trichodermaService'

export default function TrichodermaApplicationEnhanced() {
  const [activeTab, setActiveTab] = useState<'strains' | 'calculator' | 'combos' | 'monitoring' | 'recommendations'>('strains')
  const [selectedStrain, setSelectedStrain] = useState<string>('')
  const [selectedCombo, setSelectedCombo] = useState<string>('')
  const [filterMechanism, setFilterMechanism] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  // Dosierungsrechner
  const [substrateVolume, setSubstrateVolume] = useState<number>(10)
  const [substrateType, setSubstrateType] = useState<'coco_coir' | 'soil_mix' | 'hydroponic'>('soil_mix')
  const [growthPhase, setGrowthPhase] = useState<'germination' | 'vegetative' | 'flowering' | 'maintenance'>('vegetative')
  const [calculatedDosage, setCalculatedDosage] = useState<DosageCalculation | null>(null)
  
  // Empfehlungen
  const [plantType, setPlantType] = useState<string>('Cannabis')
  const [currentPH, setCurrentPH] = useState<number>(6.5)
  const [currentTemperature, setCurrentTemperature] = useState<number>(22)
  const [hasDiseaseIssues, setHasDiseaseIssues] = useState<boolean>(false)
  const [recommendations, setRecommendations] = useState<{
    recommendedStrains: TrichodermaStrain[]
    recommendedCombos: ComboPackage[]
    reasoning: string
  } | null>(null)
  
  // Monitoring
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([])
  const [showApplicationForm, setShowApplicationForm] = useState<boolean>(false)
  const [newApplication, setNewApplication] = useState<Partial<ApplicationRecord>>({
    strainId: '',
    strainName: '',
    dosage: 0,
    substrateVolume: 10,
    substrateType: 'soil_mix',
    growthPhase: 'vegetative',
    applicationMethod: '',
    observations: '',
    effectiveness: 'good'
  })

  // Daten laden
  const [strains, setStrains] = useState<TrichodermaStrain[]>([])
  const [comboPackages, setComboPackages] = useState<ComboPackage[]>([])

  useEffect(() => {
    setStrains(trichodermaService.getAllStrains())
    setComboPackages(trichodermaService.getAllComboPackages())
    setApplicationRecords(trichodermaService.getApplicationRecords())
  }, [])

  // Gefilterte Stämme
  const filteredStrains = strains.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMechanism = !filterMechanism || strain.mechanisms.some(m => 
      m.toLowerCase().includes(filterMechanism.toLowerCase())
    )
    return matchesSearch && matchesMechanism
  })

  // Dosierung berechnen
  const calculateDosage = () => {
    if (selectedStrain || selectedCombo) {
      const calculation = trichodermaService.calculateDosage({
        substrateVolume,
        substrateType,
        growthPhase,
        selectedStrain,
        selectedCombo
      })
      setCalculatedDosage(calculation)
    }
  }

  // Empfehlungen generieren
  const generateRecommendations = () => {
    const recs = trichodermaService.getRecommendation({
      plantType,
      substrateType,
      currentPH,
      currentTemperature,
      growthPhase,
      hasDiseaseIssues
    })
    setRecommendations(recs)
  }

  // Anwendungsprotokoll speichern
  const saveApplicationRecord = () => {
    if (newApplication.strainId && newApplication.strainName && newApplication.dosage) {
      const record: Omit<ApplicationRecord, 'id'> = {
        date: new Date(),
        strainId: newApplication.strainId!,
        strainName: newApplication.strainName!,
        dosage: newApplication.dosage!,
        substrateVolume: newApplication.substrateVolume || 10,
        substrateType: newApplication.substrateType || 'soil_mix',
        growthPhase: newApplication.growthPhase || 'vegetative',
        applicationMethod: newApplication.applicationMethod || '',
        observations: newApplication.observations || '',
        effectiveness: newApplication.effectiveness || 'good'
      }
      
      trichodermaService.saveApplicationRecord(record)
      setApplicationRecords(trichodermaService.getApplicationRecords())
      setShowApplicationForm(false)
      setNewApplication({
        strainId: '',
        strainName: '',
        dosage: 0,
        substrateVolume: 10,
        substrateType: 'soil_mix',
        growthPhase: 'vegetative',
        applicationMethod: '',
        observations: '',
        effectiveness: 'good'
      })
    }
  }

  // Wirksamkeitsanalyse
  const effectivenessAnalysis = trichodermaService.getEffectivenessAnalysis()

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
              intelligente Dosierungsberechnung und integriertes Monitoring.
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
              { id: 'calculator', name: 'Dosierungsrechner', icon: Calculator },
              { id: 'combos', name: 'Kombi-Pakete', icon: Package },
              { id: 'recommendations', name: 'Empfehlungen', icon: Target },
              { id: 'monitoring', name: 'Monitoring', icon: BarChart3 }
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
          
          {/* Stammauswahl */}
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
                
                {/* Filter und Suche */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Stamm suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                                         <select
                       value={filterMechanism}
                       onChange={(e) => setFilterMechanism(e.target.value)}
                       className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 appearance-none"
                       aria-label="Wirkmechanismus filtern"
                     >
                      <option value="">Alle Mechanismen</option>
                      <option value="pathogen">Pathogenhemmung</option>
                      <option value="wachstum">Wachstumsförderung</option>
                      <option value="isr">ISR-Induktion</option>
                      <option value="enzym">Enzymproduktion</option>
                      <option value="nährstoff">Nährstoffmobilisierung</option>
                    </select>
                  </div>
                </div>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredStrains.map((strain) => (
                  <InteractiveCard key={strain.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{strain.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                          <span>pH: {strain.optimal_soil_pH[0]}-{strain.optimal_soil_pH[1]}</span>
                          <span>Temp: {strain.optimal_temperature_celsius[0]}°-{strain.optimal_temperature_celsius[1]}°C</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400">{strain.recommended_dosage_g_per_liter}g/L</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Wirkmechanismen:</h5>
                      <div className="flex flex-wrap gap-1">
                        {strain.mechanisms.map((mechanism, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {mechanism}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Anwendungsmethoden:</h5>
                      <div className="flex flex-wrap gap-1">
                        {strain.application_methods.map((method, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/70">
                        Empfohlene Dosierung: {strain.recommended_dosage_g_per_liter}g pro Liter Substrat
                      </div>
                      <HomeBudButton 
                        variant={selectedStrain === strain.id ? "secondary" : "primary"}
                        size="default"
                        onClick={() => setSelectedStrain(strain.id)}
                      >
                        {selectedStrain === strain.id ? 'Ausgewählt' : 'Auswählen'}
                      </HomeBudButton>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dosierungsrechner */}
          {activeTab === 'calculator' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Dosierungsrechner</h3>
                <p className="text-white/80 mb-6">
                  Berechnen Sie die optimale Dosierung basierend auf Substratvolumen, Typ und Wachstumsphase.
                </p>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Eingabefelder */}
                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Parameter</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Substratvolumen (Liter)
                      </label>
                      <input
                        type="number"
                        value={substrateVolume}
                        onChange={(e) => setSubstrateVolume(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                        min="1"
                        max="1000"
                      />
                    </div>

                    <div>
                      <label htmlFor="substrateType" className="block text-sm font-medium text-white/90 mb-2">
                        Substrattyp
                      </label>
                      <select
                        id="substrateType"
                        value={substrateType}
                        onChange={(e) => setSubstrateType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="soil_mix">Erdmischung</option>
                        <option value="coco_coir">Kokosfaser</option>
                        <option value="hydroponic">Hydroponisch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Wachstumsphase
                      </label>
                      <select
                        value={growthPhase}
                        onChange={(e) => setGrowthPhase(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="germination">Keimung</option>
                        <option value="vegetative">Vegetative Phase</option>
                        <option value="flowering">Blütephase</option>
                        <option value="maintenance">Wartung</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Trichoderma-Stamm
                      </label>
                      <select
                        value={selectedStrain}
                        onChange={(e) => setSelectedStrain(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="">Stamm auswählen...</option>
                        {strains.map(strain => (
                          <option key={strain.id} value={strain.id}>{strain.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Oder Kombi-Paket
                      </label>
                      <select
                        value={selectedCombo}
                        onChange={(e) => setSelectedCombo(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="">Kombi-Paket auswählen...</option>
                        {comboPackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                        ))}
                      </select>
                    </div>

                    <HomeBudButton 
                      variant="primary" 
                      className="w-full"
                      onClick={calculateDosage}
                      disabled={!selectedStrain && !selectedCombo}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Dosierung berechnen
                    </HomeBudButton>
                  </div>
                </InteractiveCard>

                {/* Ergebnis */}
                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Berechnete Dosierung</h4>
                  
                  {calculatedDosage ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-green-400">Trichoderma</span>
                          <span className="text-xl font-bold text-green-400">
                            {calculatedDosage.calculatedDosage.trichoderma_g}g
                          </span>
                        </div>
                        {calculatedDosage.calculatedDosage.mycorrhiza_g && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-400">Mykorrhiza</span>
                            <span className="text-xl font-bold text-blue-400">
                              {calculatedDosage.calculatedDosage.mycorrhiza_g}g
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">Gesamt</span>
                          <span className="text-xl font-bold text-white">
                            {calculatedDosage.calculatedDosage.total_g}g
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-white/60" />
                          <span className="text-white/80">Frequenz: {calculatedDosage.calculatedDosage.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Droplet className="w-4 h-4 text-white/60" />
                          <span className="text-white/80">Methode: {calculatedDosage.calculatedDosage.application_method}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Info className="w-4 h-4 text-white/60" />
                          <span className="text-white/80">{calculatedDosage.calculatedDosage.notes}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <Calculator className="w-12 h-12 mx-auto mb-4 text-white/30" />
                      <p>Wählen Sie einen Stamm oder ein Kombi-Paket und klicken Sie auf "Berechnen"</p>
                    </div>
                  )}
                </InteractiveCard>
              </div>
            </motion.div>
          )}

          {/* Kombi-Pakete */}
          {activeTab === 'combos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Kombi-Pakete Mykorrhiza + Trichoderma</h3>
                <p className="text-white/80 mb-6">
                  Optimierte Kombinationen für maximale Synergien zwischen Mykorrhiza und Trichoderma.
                </p>
              </InteractiveCard>

              <div className="grid gap-6">
                {comboPackages.map((pkg) => (
                  <InteractiveCard key={pkg.id} className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{pkg.name}</h4>
                        <p className="text-white/70 mb-4">{pkg.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold text-white/90 mb-2">Mykorrhiza-Stamm:</h5>
                            <p className="text-white/80">{pkg.mycorrhiza_strain}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-white/90 mb-2">Trichoderma-Stamm:</h5>
                            <p className="text-white/80">{pkg.trichoderma_strain}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400 mb-2">
                          {pkg.dosage_per_liter.mycorrhiza_g + pkg.dosage_per_liter.trichoderma_g}g/L
                        </div>
                        <div className="text-sm text-white/60">
                          Mischungsverhältnis: {pkg.mixing_ratio.mycorrhiza_percent}% / {pkg.mixing_ratio.trichoderma_percent}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-white/90 mb-2">Vorteile:</h5>
                      <div className="grid md:grid-cols-2 gap-2">
                        {pkg.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            <span className="text-sm text-white/80">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/70">
                        Anwendung: {pkg.application_timing}
                      </div>
                      <HomeBudButton 
                        variant={selectedCombo === pkg.id ? "secondary" : "primary"}
                        onClick={() => setSelectedCombo(pkg.id)}
                      >
                        {selectedCombo === pkg.id ? 'Ausgewählt' : 'Kombi-Paket wählen'}
                      </HomeBudButton>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empfehlungen */}
          {activeTab === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Intelligente Empfehlungen</h3>
                <p className="text-white/80 mb-6">
                  Erhalten Sie personalisierte Empfehlungen basierend auf Ihren Anbaubedingungen.
                </p>
              </InteractiveCard>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Eingabefelder */}
                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Anbaubedingungen</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Pflanzentyp
                      </label>
                      <input
                        type="text"
                        value={plantType}
                        onChange={(e) => setPlantType(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Substrattyp
                      </label>
                      <select
                        value={substrateType}
                        onChange={(e) => setSubstrateType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="soil_mix">Erdmischung</option>
                        <option value="coco_coir">Kokosfaser</option>
                        <option value="hydroponic">Hydroponisch</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          pH-Wert
                        </label>
                        <input
                          type="number"
                          value={currentPH}
                          onChange={(e) => setCurrentPH(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                          min="4"
                          max="9"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Temperatur (°C)
                        </label>
                        <input
                          type="number"
                          value={currentTemperature}
                          onChange={(e) => setCurrentTemperature(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                          min="10"
                          max="35"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Wachstumsphase
                      </label>
                      <select
                        value={growthPhase}
                        onChange={(e) => setGrowthPhase(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="germination">Keimung</option>
                        <option value="vegetative">Vegetative Phase</option>
                        <option value="flowering">Blütephase</option>
                        <option value="maintenance">Wartung</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="diseaseIssues"
                        checked={hasDiseaseIssues}
                        onChange={(e) => setHasDiseaseIssues(e.target.checked)}
                        className="w-4 h-4 text-green-400 bg-white/10 border-white/20 rounded focus:ring-green-400"
                      />
                      <label htmlFor="diseaseIssues" className="text-sm text-white/90">
                        Krankheitsprobleme vorhanden
                      </label>
                    </div>

                    <HomeBudButton 
                      variant="primary" 
                      className="w-full"
                      onClick={generateRecommendations}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Empfehlungen generieren
                    </HomeBudButton>
                  </div>
                </InteractiveCard>

                {/* Empfehlungen */}
                <InteractiveCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Empfohlene Stämme</h4>
                  
                  {recommendations ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-white/80">{recommendations.reasoning}</p>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-white/90 mb-2">Empfohlene Trichoderma-Stämme:</h5>
                        <div className="space-y-2">
                          {recommendations.recommendedStrains.map((strain, idx) => (
                            <div key={strain.id} className="p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{strain.name}</span>
                                <span className="text-sm text-green-400">#{idx + 1}</span>
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                {strain.mechanisms.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-white/90 mb-2">Empfohlene Kombi-Pakete:</h5>
                        <div className="space-y-2">
                          {recommendations.recommendedCombos.map((pkg, idx) => (
                            <div key={pkg.id} className="p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{pkg.name}</span>
                                <span className="text-sm text-blue-400">#{idx + 1}</span>
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                {pkg.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <Target className="w-12 h-12 mx-auto mb-4 text-white/30" />
                      <p>Geben Sie Ihre Anbaubedingungen ein und generieren Sie personalisierte Empfehlungen</p>
                    </div>
                  )}
                </InteractiveCard>
              </div>
            </motion.div>
          )}

          {/* Monitoring */}
          {activeTab === 'monitoring' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Anwendungsmonitoring</h3>
                  <p className="text-white/80">
                    Protokollieren Sie Ihre Trichoderma-Anwendungen und verfolgen Sie die Wirksamkeit.
                  </p>
                </div>
                <HomeBudButton 
                  variant="primary"
                  onClick={() => setShowApplicationForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Neue Anwendung
                </HomeBudButton>
              </div>

              {/* Wirksamkeitsanalyse */}
              <InteractiveCard className="p-6">
                <h4 className="text-lg font-semibold mb-4">Wirksamkeitsanalyse</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {effectivenessAnalysis.averageEffectiveness.toFixed(1)}
                    </div>
                    <div className="text-sm text-white/60">Durchschnittliche Wirksamkeit</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {applicationRecords.length}
                    </div>
                    <div className="text-sm text-white/60">Anwendungen protokolliert</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {effectivenessAnalysis.bestStrains.length}
                    </div>
                    <div className="text-sm text-white/60">Beste Stämme identifiziert</div>
                  </div>
                </div>
                
                {effectivenessAnalysis.recommendations.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h5 className="text-sm font-semibold text-yellow-400 mb-2">Empfehlungen:</h5>
                    <ul className="space-y-1">
                      {effectivenessAnalysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-white/80 flex items-center">
                          <Info className="w-3 h-3 text-yellow-400 mr-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </InteractiveCard>

              {/* Anwendungsprotokolle */}
              <InteractiveCard className="p-6">
                <h4 className="text-lg font-semibold mb-4">Anwendungsprotokolle</h4>
                
                {applicationRecords.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-white/30" />
                    <p>Noch keine Anwendungen protokolliert. Starten Sie mit der ersten Anwendung.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicationRecords.map((record) => (
                      <div key={record.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-white font-medium">{record.strainName}</h5>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                              <span>{record.date.toLocaleDateString()}</span>
                              <span>Dosierung: {record.dosage}g</span>
                              <span>Volumen: {record.substrateVolume}L</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                record.effectiveness === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                record.effectiveness === 'good' ? 'bg-blue-500/20 text-blue-400' :
                                record.effectiveness === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {record.effectiveness === 'excellent' ? 'Ausgezeichnet' :
                                 record.effectiveness === 'good' ? 'Gut' :
                                 record.effectiveness === 'fair' ? 'Mittel' : 'Schlecht'}
                              </span>
                            </div>
                            {record.observations && (
                              <p className="text-sm text-white/80 mt-2">{record.observations}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <HomeBudButton variant="secondary" size="default">
                              <Edit className="w-3 h-3" />
                            </HomeBudButton>
                            <HomeBudButton 
                              variant="secondary" 
                              size="default"
                              onClick={() => {
                                trichodermaService.deleteApplicationRecord(record.id)
                                setApplicationRecords(trichodermaService.getApplicationRecords())
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </HomeBudButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </InteractiveCard>
            </motion.div>
          )}
        </div>
      </section>

      {/* Anwendungsformular Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <InteractiveCard className="p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Neue Anwendung protokollieren</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Trichoderma-Stamm
                </label>
                <select
                  value={newApplication.strainId}
                  onChange={(e) => {
                    const strain = strains.find(s => s.id === e.target.value)
                    setNewApplication({
                      ...newApplication,
                      strainId: e.target.value,
                      strainName: strain?.name || ''
                    })
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="">Stamm auswählen...</option>
                  {strains.map(strain => (
                    <option key={strain.id} value={strain.id}>{strain.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Dosierung (g)
                </label>
                <input
                  type="number"
                  value={newApplication.dosage}
                  onChange={(e) => setNewApplication({...newApplication, dosage: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Substratvolumen (L)
                </label>
                <input
                  type="number"
                  value={newApplication.substrateVolume}
                  onChange={(e) => setNewApplication({...newApplication, substrateVolume: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Wirksamkeit
                </label>
                <select
                  value={newApplication.effectiveness}
                  onChange={(e) => setNewApplication({...newApplication, effectiveness: e.target.value as any})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="excellent">Ausgezeichnet</option>
                  <option value="good">Gut</option>
                  <option value="fair">Mittel</option>
                  <option value="poor">Schlecht</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Beobachtungen (optional)
                </label>
                <textarea
                  value={newApplication.observations}
                  onChange={(e) => setNewApplication({...newApplication, observations: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  rows={3}
                  placeholder="Notizen zur Anwendung..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <HomeBudButton 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowApplicationForm(false)}
              >
                Abbrechen
              </HomeBudButton>
              <HomeBudButton 
                variant="primary" 
                className="flex-1"
                onClick={saveApplicationRecord}
                disabled={!newApplication.strainId || !newApplication.dosage}
              >
                Speichern
              </HomeBudButton>
            </div>
          </InteractiveCard>
        </div>
      )}

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
