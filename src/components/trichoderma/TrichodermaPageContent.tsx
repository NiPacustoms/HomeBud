'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

export default function TrichodermaPageContent() {
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
    try {
      setStrains(trichodermaService.getAllStrains())
      setComboPackages(trichodermaService.getAllComboPackages())
      setApplicationRecords(trichodermaService.getApplicationRecords())
    } catch (error) {
      console.error('Fehler beim Laden der Trichoderma-Daten:', error)
    }
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
    try {
      const dosage = trichodermaService.calculateDosage({
        selectedStrain,
        substrateVolume,
        substrateType,
        growthPhase
      })
      setCalculatedDosage(dosage)
    } catch (error) {
      console.error('Fehler bei der Dosierungsberechnung:', error)
    }
  }

  // Empfehlungen generieren
  const generateRecommendations = () => {
    try {
      const recs = trichodermaService.getRecommendation({
        plantType,
        substrateType: 'soil_mix',
        currentPH,
        currentTemperature,
        growthPhase: 'vegetative',
        hasDiseaseIssues
      })
      setRecommendations(recs)
    } catch (error) {
      console.error('Fehler bei der Empfehlungsgenerierung:', error)
    }
  }

  // Anwendung hinzufügen
  const addApplication = () => {
    try {
      if (newApplication.strainId && newApplication.strainName) {
        const application: ApplicationRecord = {
          ...newApplication as ApplicationRecord,
          id: Date.now().toString(),
          date: new Date()
        }
        trichodermaService.saveApplicationRecord(application)
        setApplicationRecords([...applicationRecords, application])
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
        setShowApplicationForm(false)
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Anwendung:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Trichoderma Anwendung
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Optimale Nutzung von Trichoderma-Stämmen für gesundes Pflanzenwachstum und natürlichen Pflanzenschutz
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'strains', label: 'Stämme', icon: Shield },
              { id: 'calculator', label: 'Dosierungsrechner', icon: Calculator },
              { id: 'combos', label: 'Kombipakete', icon: Package },
              { id: 'monitoring', label: 'Monitoring', icon: BarChart3 },
              { id: 'recommendations', label: 'Empfehlungen', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Stämme Tab */}
            {activeTab === 'strains' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Stämme durchsuchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <select
                      id="filterMechanism"
                      name="filterMechanism"
                      aria-label="Mechanismus filtern"
                      value={filterMechanism}
                      onChange={(e) => setFilterMechanism(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Alle Mechanismen</option>
                      <option value="antagonism">Antagonismus</option>
                      <option value="competition">Konkurrenz</option>
                      <option value="parasitism">Parasitismus</option>
                      <option value="induced resistance">Induzierte Resistenz</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStrains.map((strain) => (
                    <motion.div
                      key={strain.id}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {strain.name}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {strain.mechanisms[0] || 'Standard'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {strain.mechanisms.join(', ')}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Target className="w-4 h-4 mr-2" />
                          <span>Mechanismen: {strain.mechanisms.join(', ')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Droplet className="w-4 h-4 mr-2" />
                          <span>Dosierung: {strain.recommended_dosage_g_per_liter} g/L</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedStrain(strain.id)}
                        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Auswählen
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Dosierungsrechner Tab */}
            {activeTab === 'calculator' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Dosierungsrechner
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Berechne die optimale Dosierung für deine Anwendung
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trichoderma-Stamm
                    </label>
                    <select
                      id="strainSelect"
                      name="strainSelect"
                      aria-label="Trichoderma-Stamm auswählen"
                      value={selectedStrain}
                      onChange={(e) => setSelectedStrain(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Stamm auswählen</option>
                      {strains.map((strain) => (
                        <option key={strain.id} value={strain.id}>
                          {strain.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Substratvolumen (L)
                    </label>
                    <input
                      id="substrateVolume"
                      name="substrateVolume"
                      type="number"
                      aria-label="Substratvolumen in Litern"
                      placeholder="Volumen eingeben"
                      value={substrateVolume}
                      onChange={(e) => setSubstrateVolume(Number(e.target.value))}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Substrattyp
                    </label>
                    <select
                      id="substrateType"
                      name="substrateType"
                      aria-label="Substrattyp auswählen"
                      value={substrateType}
                      onChange={(e) => setSubstrateType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="soil_mix">Erdmischung</option>
                      <option value="coco_coir">Kokosfaser</option>
                      <option value="hydroponic">Hydroponik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wachstumsphase
                    </label>
                    <select
                      id="growthPhase"
                      name="growthPhase"
                      aria-label="Wachstumsphase auswählen"
                      value={growthPhase}
                      onChange={(e) => setGrowthPhase(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="germination">Keimung</option>
                      <option value="vegetative">Vegetativ</option>
                      <option value="flowering">Blüte</option>
                      <option value="maintenance">Wartung</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateDosage}
                    disabled={!selectedStrain}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Dosierung berechnen
                  </button>
                </div>

                {calculatedDosage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6"
                  >
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                      Berechnete Dosierung
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Benötigte Menge:</span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {calculatedDosage.calculatedDosage.total_g}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Konzentration:</span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {calculatedDosage.calculatedDosage.trichoderma_g}g/L
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Anwendungsfrequenz:</span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {calculatedDosage.calculatedDosage.frequency}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Weitere Tabs können hier hinzugefügt werden */}
            {activeTab === 'combos' && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Kombipakete
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Funktion wird bald verfügbar sein
                </p>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Monitoring
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Funktion wird bald verfügbar sein
                </p>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Empfehlungen
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Funktion wird bald verfügbar sein
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
