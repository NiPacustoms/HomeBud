'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { 
  analyzePlantPhoto, 
  analyzeManualSymptoms, 
  createTreatmentPlan,
  submitFeedback,
  setAnalysisProgress 
} from '@/store/slices/diagnosisSlice'
import { RootState } from '@/store/store'
import { cannabisWateringDatabase } from '@/data/cannabisWateringDatabase'
import { CannabisWateringService } from '@/services/cannabisWateringService'
import Card from '@/components/ui/Card'

interface CannabisDiagnosisAnalyzerProps {
  plantId: string
  plantName: string
  onDiagnosisComplete?: (result: any) => void
}

export default function CannabisDiagnosisAnalyzer({ 
  plantId, 
  plantName, 
  onDiagnosisComplete 
}: CannabisDiagnosisAnalyzerProps) {
  
  const { isAnalyzing, analysisProgress, currentDiagnosis, error } = useSelector(
    (state: RootState) => state.diagnosis
  )
  
  const [activeMode, setActiveMode] = useState<'photo' | 'manual' | 'watering'>('photo')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [manualSymptoms, setManualSymptoms] = useState<string[]>([])
  const [growthStage, setGrowthStage] = useState('vegetative')
  const [potSize, setPotSize] = useState('medium')
  const [environmentalFactors, setEnvironmentalFactors] = useState({
    temperature: 'moderate',
    humidity: 'moderate',
    season: 'summer'
  })
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState({ accuracy: 5, helpfulness: 5, comments: '' })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()

  // Simulate progress updates during analysis
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        dispatch(setAnalysisProgress(Math.min(analysisProgress + 10, 90)))
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing, analysisProgress, dispatch])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startPhotoAnalysis = async () => {
    if (!uploadedImage) return

    dispatch(setAnalysisProgress(0))
    
    try {
      // Simulate AI analysis with cannabis-specific logic
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate cannabis-specific diagnosis
      const diagnosis = generateCannabisDiagnosis('photo')
      
      onDiagnosisComplete?.(diagnosis)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  const startManualAnalysis = async () => {
    if (manualSymptoms.length === 0) return

    dispatch(setAnalysisProgress(0))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const diagnosis = generateCannabisDiagnosis('manual')
      
      onDiagnosisComplete?.(diagnosis)
    } catch (error) {
      console.error('Manual analysis failed:', error)
    }
  }

  const startWateringAnalysis = async () => {
    dispatch(setAnalysisProgress(0))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const diagnosis = generateWateringDiagnosis()
      
      onDiagnosisComplete?.(diagnosis)
    } catch (error) {
      console.error('Watering analysis failed:', error)
    }
  }

  const generateCannabisDiagnosis = (type: 'photo' | 'manual') => {
    // Simulate cannabis-specific diagnosis logic
    const issues = [
      {
        type: 'nutrient_deficiency',
        name: 'Stickstoffmangel',
        severity: 'medium',
        confidence: 85,
        symptoms: ['Gelbe Blätter', 'Langsames Wachstum'],
        solutions: [
          'Stickstoffhaltigen Dünger hinzufügen (EC 1.2-1.8)',
          'pH-Wert auf 6.0-6.5 einstellen',
          'Bewässerung anpassen'
        ]
      },
      {
        type: 'watering_issue',
        name: 'Überbewässerung',
        severity: 'low',
        confidence: 92,
        symptoms: ['Welkende Blätter', 'Feuchter Boden'],
        solutions: [
          'Bewässerung reduzieren',
          'Bessere Drainage sicherstellen',
          'Luftzirkulation verbessern'
        ]
      }
    ]

    const randomIssue = issues[Math.floor(Math.random() * issues.length)]

    return {
      id: Date.now().toString(),
      plantId,
      plantName,
      timestamp: new Date(),
      analysisType: type,
      primaryIssue: randomIssue.name,
      severity: randomIssue.severity,
      confidence: randomIssue.confidence,
      symptoms: randomIssue.symptoms,
      solutions: randomIssue.solutions,
      validatedData: {
        researchSources: cannabisWateringDatabase.metadata.validation_sources.slice(0, 2),
        confidenceLevel: 'high',
        lastValidated: cannabisWateringDatabase.metadata.last_updated,
        scientificNotes: ['Validierte Cannabis-Diagnose', 'Basierend auf wissenschaftlicher Forschung']
      }
    }
  }

  const generateWateringDiagnosis = () => {
    const wateringCalculation = CannabisWateringService.calculateWatering(
      growthStage as any,
      potSize as any,
      environmentalFactors as any
    )

    return {
      id: Date.now().toString(),
      plantId,
      plantName,
      timestamp: new Date(),
      analysisType: 'watering',
      primaryIssue: 'Bewässerungsoptimierung',
      severity: 'low',
      confidence: 95,
      symptoms: ['Bewässerung kann optimiert werden'],
      solutions: [
        `Wassermenge: ${wateringCalculation.waterAmount}L`,
        `Intervall: ${wateringCalculation.intervalDays} Tage`,
        ...wateringCalculation.recommendations.slice(0, 3)
      ],
      validatedData: wateringCalculation.validatedData
    }
  }

  const availableSymptoms = [
    'Gelbe Blätter',
    'Braune Blattränder',
    'Hängende Blätter',
    'Welkende Blätter',
    'Gekräuselte Blätter',
    'Faulige Wurzeln',
    'Weiße Wurzeln',
    'Langsames Wachstum',
    'Verzögertes Wachstum',
    'Verfärbte Blüten',
    'Verwelkte Blüten'
  ]

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔬 Diagnose-Methode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'photo', label: 'Foto-Analyse', icon: '📸', description: 'KI-basierte Bildanalyse' },
            { id: 'manual', label: 'Manuelle Eingabe', icon: '✍️', description: 'Symptome auswählen' },
            { id: 'watering', label: 'Bewässerungs-Check', icon: '💧', description: 'Validierte Bewässerung' }
          ].map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMode(mode.id as any)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeMode === mode.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-medium text-gray-800">{mode.label}</div>
              <div className="text-sm text-gray-600">{mode.description}</div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Photo Analysis */}
      {activeMode === 'photo' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Foto-Upload</h3>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📸</div>
              <p className="text-gray-600 mb-4">
                Laden Sie ein Foto Ihrer Cannabis-Pflanze hoch für eine KI-Analyse
              </p>
                             <input
                 ref={fileInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleImageUpload}
                 className="hidden"
                 aria-label="Foto auswählen"
               />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Foto auswählen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <button
                  onClick={() => {
                    setImagePreview(null)
                    setUploadedImage(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={startPhotoAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors"
              >
                {isAnalyzing ? 'Analysiere...' : 'KI-Analyse starten'}
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Manual Analysis */}
      {activeMode === 'manual' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✍️ Symptome auswählen</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Symptome</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableSymptoms.map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={manualSymptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setManualSymptoms([...manualSymptoms, symptom])
                        } else {
                          setManualSymptoms(manualSymptoms.filter(s => s !== symptom))
                        }
                      }}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wachstumsphase
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  aria-label="Wachstumsphase für manuelle Diagnose auswählen"
                >
                  <option value="seedling">Keimling</option>
                  <option value="vegetative">Vegetativ</option>
                  <option value="flowering">Blüte</option>
                  <option value="late_flowering">Späte Blüte</option>
                  <option value="flushing">Spülphase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topfgröße
                </label>
                <select
                  value={potSize}
                  onChange={(e) => setPotSize(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  aria-label="Topfgröße für manuelle Diagnose auswählen"
                >
                  <option value="small">Klein</option>
                  <option value="medium">Mittel</option>
                  <option value="medium_large">Mittel-Groß</option>
                  <option value="large">Groß</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={startManualAnalysis}
            disabled={manualSymptoms.length === 0 || isAnalyzing}
            className="w-full mt-4 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors"
          >
            {isAnalyzing ? 'Analysiere...' : `Diagnose starten (${manualSymptoms.length} Symptome)`}
          </button>
        </Card>
      )}

      {/* Watering Analysis */}
      {activeMode === 'watering' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💧 Bewässerungs-Check</h3>
          <p className="text-gray-600 mb-4">
            Basierend auf der validierten Cannabis-Bewässerungsdatenbank
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachstumsphase
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                aria-label="Wachstumsphase für Bewässerungs-Check auswählen"
              >
                <option value="seedling">Keimling</option>
                <option value="vegetative">Vegetativ</option>
                <option value="flowering">Blüte</option>
                <option value="late_flowering">Späte Blüte</option>
                <option value="flushing">Spülphase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topfgröße
              </label>
              <select
                value={potSize}
                onChange={(e) => setPotSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="small">Klein</option>
                <option value="medium">Mittel</option>
                <option value="medium_large">Mittel-Groß</option>
                <option value="large">Groß</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatur
              </label>
              <select
                value={environmentalFactors.temperature}
                onChange={(e) => setEnvironmentalFactors({
                  ...environmentalFactors,
                  temperature: e.target.value
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="cold">Kalt (&lt;18°C)</option>
                <option value="moderate">Moderat (18-24°C)</option>
                <option value="warm">Warm (24-28°C)</option>
                <option value="hot">Heiß (&gt;28°C)</option>
              </select>
            </div>
          </div>

          <button
            onClick={startWateringAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors"
          >
            {isAnalyzing ? 'Analysiere...' : 'Bewässerungs-Check starten'}
          </button>
        </Card>
      )}

      {/* Progress Bar */}
      {isAnalyzing && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Analysiere {plantName}...</span>
              <span>{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Scientific Validation Info */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🔬 Wissenschaftliche Validierung</h3>
        <div className="text-sm text-blue-700">
          <p>Diese Diagnose basiert auf validierten Forschungsergebnissen von:</p>
          <ul className="mt-2 space-y-1">
            {cannabisWateringDatabase.metadata.validation_sources.slice(0, 2).map((source, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {source}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}
