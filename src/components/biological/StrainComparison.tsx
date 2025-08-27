'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Star, 
  CheckCircle, 
  XCircle,
  Info,
  Filter,
  Search,
  Zap,
  Shield,
  Leaf,
  DollarSign,
  Thermometer,
  Droplets,
  Snowflake,
  Sun,
  Home,
  TreePine
} from 'lucide-react'
import { 
  compareStrains, 
  filterStrainsForComparison, 
  getTopStrainsForApplication,
  StrainComparison as ComparisonType,
  StrainComparisonFilters 
} from '@/services/strainComparisonService'
import { mycorrhizaStrains } from '@/services/mycorrhizaService'
import { MycorrhizaStrain } from '@/types/plant'

export default function StrainComparison() {
  const [selectedStrain1, setSelectedStrain1] = useState<string>('')
  const [selectedStrain2, setSelectedStrain2] = useState<string>('')
  const [comparison, setComparison] = useState<ComparisonType | null>(null)
  const [filters, setFilters] = useState<StrainComparisonFilters>({})
  const [filteredStrains, setFilteredStrains] = useState<MycorrhizaStrain[]>([])
  const [topStrains, setTopStrains] = useState<{ [key: string]: MycorrhizaStrain[] }>({})
  const [activeTab, setActiveTab] = useState<'comparison' | 'top-strains' | 'filters'>('comparison')

  // Filtere Stämme basierend auf Kriterien
  useEffect(() => {
    const filtered = filterStrainsForComparison(filters)
    setFilteredStrains(filtered)
  }, [filters])

  // Top-Stämme für verschiedene Anwendungen laden
  useEffect(() => {
    const applications = ['indoor', 'outdoor', 'drought', 'salt', 'cold', 'cannabis', 'value']
    const topStrainsData: { [key: string]: MycorrhizaStrain[] } = {}
    
    applications.forEach(app => {
      topStrainsData[app] = getTopStrainsForApplication(app, 5)
    })
    
    setTopStrains(topStrainsData)
  }, [])

  // Vergleich durchführen
  const handleCompare = () => {
    if (selectedStrain1 && selectedStrain2) {
      try {
        const result = compareStrains(selectedStrain1, selectedStrain2)
        setComparison(result)
      } catch (error) {
        console.error('Fehler beim Vergleich:', error)
      }
    }
  }

  // Filter aktualisieren
  const updateFilter = (key: keyof StrainComparisonFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cannabis_specific': return <Leaf className="w-4 h-4" />
      case 'nutrient_optimized': return <Zap className="w-4 h-4" />
      case 'stress_resistant': return <Shield className="w-4 h-4" />
      case 'general': return <TreePine className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
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

  const getApplicationIcon = (application: string) => {
    switch (application) {
      case 'indoor': return <Home className="w-4 h-4" />
      case 'outdoor': return <TreePine className="w-4 h-4" />
      case 'drought': return <Droplets className="w-4 h-4" />
      case 'salt': return <Thermometer className="w-4 h-4" />
      case 'cold': return <Snowflake className="w-4 h-4" />
      case 'cannabis': return <Leaf className="w-4 h-4" />
      case 'value': return <DollarSign className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getApplicationName = (application: string) => {
    switch (application) {
      case 'indoor': return 'Indoor-Anbau'
      case 'outdoor': return 'Outdoor-Anbau'
      case 'drought': return 'Trockenheitsresistenz'
      case 'salt': return 'Salztoleranz'
      case 'cold': return 'Kältetoleranz'
      case 'cannabis': return 'Cannabis-Optimierung'
      case 'value': return 'Kosten-Effektivität'
      default: return application
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
              📊 Strain-Vergleich
            </h1>
            <p className="text-xl text-green-200 mb-8">
              Detaillierte Gegenüberstellung von Mykorrhiza-Stämmen
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'comparison', label: 'Strain-Vergleich', icon: BarChart3 },
              { id: 'top-strains', label: 'Top-Stämme', icon: Award },
              { id: 'filters', label: 'Filter', icon: Filter }
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
          
          {/* Strain-Vergleich */}
          {activeTab === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stamm-Auswahl */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🎯 Stämme für Vergleich auswählen
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Erster Stamm
                    </label>
                    <select
                      value={selectedStrain1}
                      onChange={(e) => setSelectedStrain1(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Stamm auswählen...</option>
                      {mycorrhizaStrains.map((strain) => (
                        <option key={strain.id} value={strain.id}>
                          {strain.name} ({getCategoryName(strain.category)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zweiter Stamm
                    </label>
                    <select
                      value={selectedStrain2}
                      onChange={(e) => setSelectedStrain2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Stamm auswählen...</option>
                      {mycorrhizaStrains.map((strain) => (
                        <option key={strain.id} value={strain.id}>
                          {strain.name} ({getCategoryName(strain.category)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCompare}
                  disabled={!selectedStrain1 || !selectedStrain2}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Vergleich durchführen
                </button>
              </Card>

              {/* Vergleichsergebnisse */}
              {comparison && (
                <div className="space-y-6">
                  {/* Übersicht */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      📊 Vergleichsübersicht
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Stamm 1 */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {comparison.strain1.name}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(comparison.strain1.category)}
                          <span className="text-sm text-blue-700">
                            {getCategoryName(comparison.strain1.category)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-blue-700">
                            {comparison.strain1.commercial.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {comparison.strain1.commercial.price}
                        </p>
                      </div>

                      {/* Stamm 2 */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">
                          {comparison.strain2.name}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(comparison.strain2.category)}
                          <span className="text-sm text-green-700">
                            {getCategoryName(comparison.strain2.category)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-green-700">
                            {comparison.strain2.commercial.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          {comparison.strain2.commercial.price}
                        </p>
                      </div>
                    </div>

                    {/* Gesamtscore */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        🏆 Gesamtscore
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {comparison.comparison.overallScore.strain1Score}
                          </div>
                          <div className="text-sm text-gray-600">{comparison.strain1.name}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">
                            vs
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {comparison.comparison.overallScore.strain2Score}
                          </div>
                          <div className="text-sm text-gray-600">{comparison.strain2.name}</div>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Gewinner: {comparison.comparison.overallScore.winner}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Detaillierte Vergleiche */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      📈 Detaillierte Vergleiche
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Wurzelkolonisierung */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          🌱 Wurzelkolonisierung
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gewinner:</span>
                          <span className="font-medium text-green-600">
                            {comparison.comparison.rootColonization.winner}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comparison.comparison.rootColonization.description}
                        </p>
                      </div>

                      {/* Nährstoffaufnahme */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          ⚡ Nährstoffaufnahme
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gewinner:</span>
                          <span className="font-medium text-green-600">
                            {comparison.comparison.nutrientUptake.winner}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comparison.comparison.nutrientUptake.description}
                        </p>
                      </div>

                      {/* Stresstoleranz */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          🛡️ Stresstoleranz
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gewinner:</span>
                          <span className="font-medium text-green-600">
                            {comparison.comparison.stressTolerance.winner}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comparison.comparison.stressTolerance.description}
                        </p>
                      </div>

                      {/* Kosten-Effektivität */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          💰 Kosten-Effektivität
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gewinner:</span>
                          <span className="font-medium text-green-600">
                            {comparison.comparison.costEffectiveness.winner}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comparison.comparison.costEffectiveness.description}
                        </p>
                      </div>

                      {/* Cannabis-Optimierung */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          🌿 Cannabis-Optimierung
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gewinner:</span>
                          <span className="font-medium text-green-600">
                            {comparison.comparison.cannabisOptimization.winner}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comparison.comparison.cannabisOptimization.description}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Empfehlungen */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      🎯 Anwendungsempfehlungen
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Indoor-Anbau:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestForIndoor}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <TreePine className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Outdoor-Anbau:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestForOutdoor}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">Trockenheitsresistenz:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestForDrought}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Salztoleranz:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestForSalt}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Snowflake className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Kältetoleranz:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestForCold}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Bester Wert:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                          {comparison.recommendations.bestValue}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Detaillierte Analyse */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      🔍 Detaillierte Analyse
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stamm 1 */}
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-3">
                          {comparison.strain1.name}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Stärken:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.strengths.strain1.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Schwächen:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.weaknesses.strain1.map((weakness, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Ideale Bedingungen:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.idealConditions.strain1.map((condition, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Stamm 2 */}
                      <div>
                        <h4 className="font-semibold text-green-900 mb-3">
                          {comparison.strain2.name}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Stärken:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.strengths.strain2.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Schwächen:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.weaknesses.strain2.map((weakness, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Ideale Bedingungen:</h5>
                            <ul className="space-y-1">
                              {comparison.detailedAnalysis.idealConditions.strain2.map((condition, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* Top-Stämme */}
          {activeTab === 'top-strains' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🏆 Top-Stämme nach Anwendung
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(topStrains).map(([application, strains]) => (
                    <div key={application} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        {getApplicationIcon(application)}
                        <h3 className="font-semibold text-gray-900">
                          {getApplicationName(application)}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        {strains.map((strain, index) => (
                          <div key={strain.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">
                                #{index + 1}
                              </span>
                              <span className="text-sm text-gray-900">
                                {strain.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">
                                {strain.commercial.rating}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Filter */}
          {activeTab === 'filters' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🔍 Stämme filtern
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategorie
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => updateFilter('category', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Alle Kategorien</option>
                      <option value="cannabis_specific">Cannabis-spezifisch</option>
                      <option value="nutrient_optimized">Nährstoff-optimiert</option>
                      <option value="stress_resistant">Stress-resistent</option>
                      <option value="general">Allgemein</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mindestbewertung
                    </label>
                    <select
                      value={filters.minRating || ''}
                      onChange={(e) => updateFilter('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Alle Bewertungen</option>
                      <option value="4.0">4.0+</option>
                      <option value="4.5">4.5+</option>
                      <option value="4.8">4.8+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximaler Preis
                    </label>
                    <select
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Alle Preise</option>
                      <option value="20">€20 oder weniger</option>
                      <option value="25">€25 oder weniger</option>
                      <option value="30">€30 oder weniger</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Gefilterte Stämme ({filteredStrains.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStrains.map((strain) => (
                      <div key={strain.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{strain.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{strain.commercial.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(strain.category)}
                          <span className="text-sm text-gray-600">
                            {getCategoryName(strain.category)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">
                          {strain.commercial.price}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {strain.benefits.slice(0, 2).map((benefit, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {benefit.split(' ').slice(0, 3).join(' ')}...
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
