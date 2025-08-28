'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  CheckCircle,
  Search,
  Star,
  Award,
  BookOpen
} from 'lucide-react'
import { 
  DosageCalculation, 
  MycorrhizaRecommendation,
  RootAssessment,
  MycorrhizaComparison,
  GrowthPhase 
} from '@/types/plant'
import { 
  mycorrhizaStrains,
  calculateMycorrhizaDosage,
  getMycorrhizaRecommendations,
  calculateRootHealthScore
} from '@/services/mycorrhizaService'

export default function MycorrhizaIntegration() {
  const [activeTab, setActiveTab] = useState<'strains' | 'calculator' | 'monitoring' | 'comparison' | 'analytics'>('strains')
  const [selectedStrain, setSelectedStrain] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Dosierungsrechner
  const [calculatorData, setCalculatorData] = useState({
    potSize: 10,
    substrateType: 'soil' as DosageCalculation['substrateType'],
    plantType: 'cannabis' as DosageCalculation['plantType'],
    growthPhase: 'vegetative' as GrowthPhase
  })
  const [dosageResult, setDosageResult] = useState<DosageCalculation | null>(null)
  
  // Empfehlungssystem
  const [recommendationData] = useState({
    plantType: 'cannabis',
    potSize: 10,
    substrateType: 'soil',
    location: 'indoor' as 'indoor' | 'outdoor' | 'greenhouse',
    goals: [] as string[]
  })
  const [recommendations, setRecommendations] = useState<MycorrhizaRecommendation[]>([])
  
  // Erfolgs-Monitoring
  const [assessments, setAssessments] = useState<RootAssessment[]>([])
  const [comparisons, setComparisons] = useState<MycorrhizaComparison[]>([])
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [newAssessment, setNewAssessment] = useState<Partial<RootAssessment>>({
    plantId: 'current',
    date: new Date(),
    rootDensity: 5,
    rootHealth: 5,
    rootColor: 'light_brown',
    rootSmell: 'neutral',
    plantHeight: 30,
    plantWidth: 20,
    leafCount: 10,
    leafColor: 'green',
    mycorrhizaEffects: {
      rootGrowth: 5,
      stressResistance: 5,
      nutrientUptake: 5,
      overallHealth: 5
    },
    observations: []
  })

  // Filtere Stämme
  const filteredStrains = mycorrhizaStrains.filter(strain => {
    const matchesCategory = filterCategory === 'all' || strain.category === filterCategory
    const matchesSearch = strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strain.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Dosierung berechnen
  const handleCalculateDosage = () => {
    if (selectedStrain) {
      try {
        const result = calculateMycorrhizaDosage(
          selectedStrain,
          calculatorData.potSize,
          calculatorData.substrateType,
          calculatorData.plantType,
          calculatorData.growthPhase
        )
        setDosageResult(result)
      } catch (error) {
        console.error('Fehler bei Dosierungsberechnung:', error)
      }
    }
  }

  // Empfehlungen generieren
  const handleGenerateRecommendations = () => {
    const results = getMycorrhizaRecommendations(
      recommendationData.plantType,
      recommendationData.potSize,
      recommendationData.substrateType,
      recommendationData.location,
      recommendationData.goals
    )
    setRecommendations(results)
  }

  // Wurzelbewertung hinzufügen
  const handleAddAssessment = () => {
    if (newAssessment.plantId && newAssessment.date) {
      const assessment: RootAssessment = {
        id: Date.now().toString(),
        plantId: newAssessment.plantId,
        date: newAssessment.date,
        rootDensity: newAssessment.rootDensity || 5,
        rootHealth: newAssessment.rootHealth || 5,
        rootColor: newAssessment.rootColor || 'light_brown',
        rootSmell: newAssessment.rootSmell || 'neutral',
        plantHeight: newAssessment.plantHeight || 30,
        plantWidth: newAssessment.plantWidth || 20,
        leafCount: newAssessment.leafCount || 10,
        leafColor: newAssessment.leafColor || 'green',
        mycorrhizaEffects: newAssessment.mycorrhizaEffects || {
          rootGrowth: 5,
          stressResistance: 5,
          nutrientUptake: 5,
          overallHealth: 5
        },
        observations: newAssessment.observations || [],
        createdAt: new Date()
      }
      setAssessments([...assessments, assessment])
      setShowAssessmentForm(false)
      setNewAssessment({
        plantId: 'current',
        date: new Date(),
        rootDensity: 5,
        rootHealth: 5,
        rootColor: 'light_brown',
        rootSmell: 'neutral',
        plantHeight: 30,
        plantWidth: 20,
        leafCount: 10,
        leafColor: 'green',
        mycorrhizaEffects: {
          rootGrowth: 5,
          stressResistance: 5,
          nutrientUptake: 5,
          overallHealth: 5
        },
        observations: []
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cannabis_specific': return '🌱'
      case 'nutrient_optimized': return '⚡'
      case 'stress_resistant': return '🛡️'
      case 'general': return '🍄'
      default: return '🍄'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cannabis_specific': return 'Cannabis-spezifisch'
      case 'nutrient_optimized': return 'Nährstoff-optimiert'
      case 'stress_resistant': return 'Stress-resistent'
      case 'general': return 'Allgemein'
      default: return 'Unbekannt'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'arbuscular': return '🔄'
      case 'ectomycorrhiza': return '🌿'
      case 'endomycorrhiza': return '🔗'
      default: return '🍄'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              🍄 Mykorrhiza-Integration
            </h1>
            <p className="text-xl text-green-200 mb-8">
              Wissenschaftlich validierte Pilzstämme für optimale Pflanzenentwicklung
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'strains', label: 'Pilzauswahl', icon: Search },
              { id: 'calculator', label: 'Dosierungsrechner', icon: Calculator },
              { id: 'monitoring', label: 'Erfolgs-Monitoring', icon: TrendingUp },
              { id: 'comparison', label: 'Vergleich', icon: BarChart3 },
              { id: 'analytics', label: 'Analytik', icon: BookOpen }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/10 text-green-200 hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Pilzauswahl */}
          {activeTab === 'strains' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Filter und Suche */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔍 Suche
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Stamm-Name oder wissenschaftlicher Name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ Kategorie
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Alle Kategorien</option>
                      <option value="cannabis_specific">Cannabis-spezifisch</option>
                      <option value="nutrient_optimized">Nährstoff-optimiert</option>
                      <option value="stress_resistant">Stress-resistent</option>
                      <option value="general">Allgemein</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Stämme Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStrains.map((strain) => (
                  <motion.div
                    key={strain.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {strain.name}
                          </h3>
                          <p className="text-sm text-gray-600 italic">
                            {strain.scientificName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {strain.commercial.rating}
                          </span>
                        </div>
                      </div>

                      {/* Kategorien */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg">{getCategoryIcon(strain.category)}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {getCategoryName(strain.category)}
                        </span>
                        <span className="text-lg">{getTypeIcon(strain.type)}</span>
                        <span className="text-sm text-gray-600 capitalize">
                          {strain.type}
                        </span>
                      </div>

                      {/* Vorteile */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Vorteile:</h4>
                        <ul className="space-y-1">
                          {strain.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Wissenschaftliche Validierung */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Wissenschaftlich validiert
                          </span>
                        </div>
                        <p className="text-xs text-blue-700">
                          {strain.validation.researchInstitution} ({strain.validation.publicationYear})
                        </p>
                      </div>

                      {/* Kommerzielle Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {strain.commercial.price}
                          </p>
                          <p className="text-xs text-gray-600">
                            {strain.commercial.supplier}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          {strain.commercial.certification.map((cert, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Aktionen */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStrain(strain.id)
                            setActiveTab('calculator')
                          }}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Dosierung berechnen
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStrain(strain.id)
                            setActiveTab('monitoring')
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
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
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🧮 Dosierungsrechner
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topfgröße (L)
                    </label>
                    <input
                      type="number"
                      value={calculatorData.potSize}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, potSize: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Substrat
                    </label>
                    <select
                      value={calculatorData.substrateType}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, substrateType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="soil">Erde</option>
                      <option value="coco">Kokos</option>
                      <option value="hydro">Hydro</option>
                      <option value="perlite">Perlite</option>
                      <option value="vermiculite">Vermiculite</option>
                      <option value="mixed">Gemisch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pflanzentyp
                    </label>
                    <select
                      value={calculatorData.plantType}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, plantType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="cannabis">Cannabis</option>
                      <option value="vegetables">Gemüse</option>
                      <option value="herbs">Kräuter</option>
                      <option value="flowers">Blumen</option>
                      <option value="trees">Bäume</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wachstumsphase
                    </label>
                    <select
                      value={calculatorData.growthPhase}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, growthPhase: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="seedling">Keimling</option>
                      <option value="vegetative">Vegetativ</option>
                      <option value="flowering">Blüte</option>
                      <option value="late_flowering">Späte Blüte</option>
                      <option value="flushing">Spülphase</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={handleCalculateDosage}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Calculator className="w-4 h-4 inline mr-2" />
                    Dosierung berechnen
                  </button>
                </div>

                {/* Ergebnis */}
                {dosageResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      📊 Dosierungsempfehlung
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Empfohlene Dosierung:</strong>
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {dosageResult.recommendedDosage.toFixed(2)}g
                        </p>
                        <p className="text-sm text-green-600">
                          Kosten: ~€{dosageResult.cost}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Anpassungsfaktoren:</strong>
                        </p>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>Substrat: {dosageResult.adjustments.substrateFactor.toFixed(2)}x</li>
                          <li>Pflanze: {dosageResult.adjustments.plantFactor.toFixed(2)}x</li>
                          <li>Phase: {dosageResult.adjustments.phaseFactor.toFixed(2)}x</li>
                          <li>Gesamt: {dosageResult.adjustments.totalFactor.toFixed(2)}x</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-green-700 mb-2">
                        <strong>Anwendungsanweisungen:</strong>
                      </p>
                      <ul className="text-sm text-green-600 space-y-1">
                        {dosageResult.applicationInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Erfolgs-Monitoring */}
          {activeTab === 'monitoring' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    📊 Erfolgs-Monitoring
                  </h2>
                  <button
                    onClick={() => setShowAssessmentForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Wurzelbewertung
                  </button>
                </div>

                {/* Wurzelbewertungen */}
                <div className="space-y-4">
                  {assessments.map((assessment) => {
                    const healthScore = calculateRootHealthScore(assessment)
                    return (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Wurzelbewertung - {assessment.date.toLocaleDateString('de-DE')}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Pflanze: {assessment.plantId}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {healthScore}/10
                            </div>
                            <div className="text-sm text-gray-600">
                              Gesundheits-Score
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Wurzeldichte:</span>
                            <div className="font-medium">{assessment.rootDensity}/10</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Wurzelgesundheit:</span>
                            <div className="font-medium">{assessment.rootHealth}/10</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Pflanzenhöhe:</span>
                            <div className="font-medium">{assessment.plantHeight}cm</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Blattanzahl:</span>
                            <div className="font-medium">{assessment.leafCount}</div>
                          </div>
                        </div>

                        {assessment.observations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">Beobachtungen:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {assessment.observations.map((observation, index) => (
                                <li key={index}>• {observation}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {assessments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Noch keine Wurzelbewertungen vorhanden.</p>
                      <p className="text-sm">Erstelle deine erste Bewertung um den Erfolg zu dokumentieren.</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Wurzelbewertung Formular */}
              {showAssessmentForm && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Neue Wurzelbewertung
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wurzeldichte (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newAssessment.rootDensity}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, rootDensity: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 (schlecht)</span>
                        <span>{newAssessment.rootDensity}</span>
                        <span>10 (exzellent)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wurzelgesundheit (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newAssessment.rootHealth}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, rootHealth: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 (krank)</span>
                        <span>{newAssessment.rootHealth}</span>
                        <span>10 (gesund)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pflanzenhöhe (cm)
                      </label>
                      <input
                        type="number"
                        value={newAssessment.plantHeight}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, plantHeight: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blattanzahl
                      </label>
                      <input
                        type="number"
                        value={newAssessment.leafCount}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, leafCount: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddAssessment}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Bewertung speichern
                    </button>
                    <button
                      onClick={() => setShowAssessmentForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* Vergleich */}
          {activeTab === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📈 Vorher-Nachher Vergleich
                </h2>
                
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Vergleichsfunktion wird implementiert...</p>
                  <p className="text-sm">Hier können Sie Pflanzen mit und ohne Mykorrhiza vergleichen.</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Analytik */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📊 Analytik & Trends
                </h2>
                
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Analytik-Funktionen werden implementiert...</p>
                  <p className="text-sm">Hier werden detaillierte Analysen und Trends angezeigt.</p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
