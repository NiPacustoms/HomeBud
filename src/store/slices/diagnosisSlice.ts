import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Interfaces für die KI-Diagnose
export interface NutrientDeficiency {
  type: 'nitrogen' | 'phosphorus' | 'potassium' | 'magnesium' | 'iron' | 'calcium' | 'zinc' | 'manganese'
  severity: 'low' | 'medium' | 'high'
  confidence: number
  affectedAreas: string[]
  symptoms: string[]
  recommendations: string[]
}

export interface PestInfestation {
  type: 'spider_mites' | 'thrips' | 'whiteflies' | 'aphids' | 'fungus_gnats' | 'scale_insects'
  severity: 'low' | 'medium' | 'high'
  confidence: number
  affectedAreas: string[]
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export interface DiseaseInfection {
  type: 'powdery_mildew' | 'botrytis' | 'root_rot' | 'leaf_spot' | 'fusarium' | 'pythium'
  severity: 'low' | 'medium' | 'high'
  confidence: number
  affectedAreas: string[]
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export interface EnvironmentalIssue {
  type: 'overwatering' | 'underwatering' | 'heat_stress' | 'cold_stress' | 'light_burn' | 'wind_burn'
  severity: 'low' | 'medium' | 'high'
  confidence: number
  symptoms: string[]
  recommendations: string[]
}

export interface DiagnosisResult {
  id: string
  plantId: string
  plantName: string
  timestamp: Date
  imageUrl?: string
  analysisType: 'photo' | 'manual' | 'sensor_data'
  
  // KI-Analyse Ergebnisse
  nutrientDeficiencies: NutrientDeficiency[]
  pestInfestations: PestInfestation[]
  diseaseInfections: DiseaseInfection[]
  environmentalIssues: EnvironmentalIssue[]
  
  // Gesamtbewertung
  overallHealth: number // 0-100
  primaryIssue: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  
  // Empfehlungen
  immediateActions: string[]
  shortTermActions: string[]
  longTermActions: string[]
  
  // Sensor-Daten zur Zeit der Diagnose
  sensorData?: {
    temperature: number
    humidity: number
    ph: number
    ec: number
    lightLevel: number
  }
  
  // Follow-up
  followUpDate?: Date
  followUpCompleted: boolean
  followUpResult?: DiagnosisResult
  
  // Status
  status: 'pending' | 'analyzing' | 'completed' | 'resolved'
  notes?: string
}

export interface TreatmentPlan {
  id: string
  diagnosisId: string
  plantId: string
  createdAt: Date
  
  steps: {
    id: string
    title: string
    description: string
    priority: 'immediate' | 'high' | 'medium' | 'low'
    estimatedDuration: string
    completed: boolean
    completedAt?: Date
    notes?: string
  }[]
  
  status: 'active' | 'completed' | 'paused'
  progress: number // 0-100
}

export interface AITrainingData {
  id: string
  plantId: string
  imageUrl: string
  diagnosis: DiagnosisResult
  userFeedback: {
    accuracy: number // 1-5
    helpfulness: number // 1-5
    comments?: string
  }
  timestamp: Date
}

interface DiagnosisState {
  diagnoses: DiagnosisResult[]
  treatmentPlans: TreatmentPlan[]
  trainingData: AITrainingData[]
  currentDiagnosis: DiagnosisResult | null
  isAnalyzing: boolean
  analysisProgress: number
  error: string | null
  
  // KI-Modelle Status
  modelStatus: {
    pestDetection: 'ready' | 'loading' | 'error'
    diseaseDetection: 'ready' | 'loading' | 'error'
    nutrientAnalysis: 'ready' | 'loading' | 'error'
    environmentalAnalysis: 'ready' | 'loading' | 'error'
  }
  
  // Statistiken
  statistics: {
    totalDiagnoses: number
    accuracyRate: number
    averageResponseTime: number
    mostCommonIssues: Array<{ issue: string; count: number }>
  }
}

const initialState: DiagnosisState = {
  diagnoses: [],
  treatmentPlans: [],
  trainingData: [],
  currentDiagnosis: null,
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,
  modelStatus: {
    pestDetection: 'ready',
    diseaseDetection: 'ready',
    nutrientAnalysis: 'ready',
    environmentalAnalysis: 'ready'
  },
  statistics: {
    totalDiagnoses: 0,
    accuracyRate: 0,
    averageResponseTime: 0,
    mostCommonIssues: []
  }
}

// Async Thunks
export const analyzePlantPhoto = createAsyncThunk(
  'diagnosis/analyzePlantPhoto',
  async ({ 
    plantId, 
    imageFile, 
    additionalData 
  }: { 
    plantId: string
    imageFile: File
    additionalData?: {
      growthStage?: string
      symptoms?: string
      environmentalConditions?: any
    }
  }) => {
    // TODO: Implement actual AI analysis
    // This would call the AI service with the image and return analysis results
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock response - in real implementation this would come from AI service
    const mockResult: DiagnosisResult = {
      id: Date.now().toString(),
      plantId,
      plantName: 'Test Plant',
      timestamp: new Date(),
      imageUrl: URL.createObjectURL(imageFile),
      analysisType: 'photo',
      
      nutrientDeficiencies: [
        {
          type: 'nitrogen',
          severity: 'medium',
          confidence: 87,
          affectedAreas: ['lower leaves'],
          symptoms: ['Yellowing of lower leaves', 'Slow growth'],
          recommendations: ['Apply nitrogen-rich fertilizer', 'Check pH levels']
        }
      ],
      pestInfestations: [],
      diseaseInfections: [],
      environmentalIssues: [],
      
      overallHealth: 75,
      primaryIssue: 'Nitrogen deficiency',
      severity: 'medium',
      confidence: 87,
      
      immediateActions: ['Apply nitrogen fertilizer'],
      shortTermActions: ['Monitor pH levels', 'Adjust watering schedule'],
      longTermActions: ['Implement regular feeding schedule'],
      
      status: 'completed',
      followUpCompleted: false
    }
    
    return mockResult
  }
)

export const analyzeManualSymptoms = createAsyncThunk(
  'diagnosis/analyzeManualSymptoms',
  async ({ 
    plantId, 
    symptoms, 
    growthStage, 
    environmentalData 
  }: { 
    plantId: string
    symptoms: string
    growthStage: string
    environmentalData?: any
  }) => {
    // TODO: Implement AI analysis based on manual input
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResult: DiagnosisResult = {
      id: Date.now().toString(),
      plantId,
      plantName: 'Test Plant',
      timestamp: new Date(),
      analysisType: 'manual',
      
      nutrientDeficiencies: [],
      pestInfestations: [],
      diseaseInfections: [],
      environmentalIssues: [
        {
          type: 'overwatering',
          severity: 'low',
          confidence: 78,
          symptoms: ['Wilting leaves', 'Yellowing'],
          recommendations: ['Reduce watering frequency', 'Improve drainage']
        }
      ],
      
      overallHealth: 82,
      primaryIssue: 'Overwatering',
      severity: 'low',
      confidence: 78,
      
      immediateActions: ['Stop watering for 2-3 days'],
      shortTermActions: ['Check soil moisture', 'Improve drainage'],
      longTermActions: ['Establish proper watering schedule'],
      
      status: 'completed',
      followUpCompleted: false
    }
    
    return mockResult
  }
)

export const createTreatmentPlan = createAsyncThunk(
  'diagnosis/createTreatmentPlan',
  async (diagnosisId: string) => {
    // TODO: Implement treatment plan generation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockPlan: TreatmentPlan = {
      id: Date.now().toString(),
      diagnosisId,
      plantId: '1',
      createdAt: new Date(),
      steps: [
        {
          id: '1',
          title: 'Apply nitrogen fertilizer',
          description: 'Mix 2:1:2 NPK fertilizer with water and apply to soil',
          priority: 'immediate',
          estimatedDuration: '30 minutes',
          completed: false
        },
        {
          id: '2',
          title: 'Check pH levels',
          description: 'Test soil pH and adjust if necessary',
          priority: 'high',
          estimatedDuration: '15 minutes',
          completed: false
        }
      ],
      status: 'active',
      progress: 0
    }
    
    return mockPlan
  }
)

export const submitFeedback = createAsyncThunk(
  'diagnosis/submitFeedback',
  async ({ 
    diagnosisId, 
    accuracy, 
    helpfulness, 
    comments 
  }: { 
    diagnosisId: string
    accuracy: number
    helpfulness: number
    comments?: string
  }) => {
    // TODO: Submit feedback to improve AI models
    return { diagnosisId, accuracy, helpfulness, comments }
  }
)

const diagnosisSlice = createSlice({
  name: 'diagnosis',
  initialState,
  reducers: {
    setCurrentDiagnosis: (state, action: PayloadAction<DiagnosisResult | null>) => {
      state.currentDiagnosis = action.payload
    },
    setAnalysisProgress: (state, action: PayloadAction<number>) => {
      state.analysisProgress = action.payload
    },
    updateDiagnosis: (state, action: PayloadAction<{ id: string; updates: Partial<DiagnosisResult> }>) => {
      const { id, updates } = action.payload
      const diagnosisIndex = state.diagnoses.findIndex(d => d.id === id)
      if (diagnosisIndex !== -1) {
        state.diagnoses[diagnosisIndex] = { ...state.diagnoses[diagnosisIndex], ...updates }
      }
    },
    addDiagnosis: (state, action: PayloadAction<DiagnosisResult>) => {
      state.diagnoses.unshift(action.payload)
    },
    removeDiagnosis: (state, action: PayloadAction<string>) => {
      state.diagnoses = state.diagnoses.filter(d => d.id !== action.payload)
    },
    updateTreatmentPlan: (state, action: PayloadAction<{ id: string; updates: Partial<TreatmentPlan> }>) => {
      const { id, updates } = action.payload
      const planIndex = state.treatmentPlans.findIndex(p => p.id === id)
      if (planIndex !== -1) {
        state.treatmentPlans[planIndex] = { ...state.treatmentPlans[planIndex], ...updates }
      }
    },
    completeTreatmentStep: (state, action: PayloadAction<{ planId: string; stepId: string }>) => {
      const { planId, stepId } = action.payload
      const plan = state.treatmentPlans.find(p => p.id === planId)
      if (plan) {
        const step = plan.steps.find(s => s.id === stepId)
        if (step) {
          step.completed = true
          step.completedAt = new Date()
          
          // Update progress
          const completedSteps = plan.steps.filter(s => s.completed).length
          plan.progress = (completedSteps / plan.steps.length) * 100
          
          if (plan.progress === 100) {
            plan.status = 'completed'
          }
        }
      }
    },
    setModelStatus: (state, action: PayloadAction<{ model: keyof DiagnosisState['modelStatus']; status: DiagnosisState['modelStatus'][keyof DiagnosisState['modelStatus']] }>) => {
      const { model, status } = action.payload
      state.modelStatus[model] = status
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Analyze plant photo
      .addCase(analyzePlantPhoto.pending, (state) => {
        state.isAnalyzing = true
        state.analysisProgress = 0
        state.error = null
      })
      .addCase(analyzePlantPhoto.fulfilled, (state, action) => {
        state.isAnalyzing = false
        state.analysisProgress = 100
        state.diagnoses.unshift(action.payload)
        state.currentDiagnosis = action.payload
      })
      .addCase(analyzePlantPhoto.rejected, (state, action) => {
        state.isAnalyzing = false
        state.error = action.error.message || 'Fehler bei der Foto-Analyse'
      })
      
      // Analyze manual symptoms
      .addCase(analyzeManualSymptoms.pending, (state) => {
        state.isAnalyzing = true
        state.analysisProgress = 0
        state.error = null
      })
      .addCase(analyzeManualSymptoms.fulfilled, (state, action) => {
        state.isAnalyzing = false
        state.analysisProgress = 100
        state.diagnoses.unshift(action.payload)
        state.currentDiagnosis = action.payload
      })
      .addCase(analyzeManualSymptoms.rejected, (state, action) => {
        state.isAnalyzing = false
        state.error = action.error.message || 'Fehler bei der Symptom-Analyse'
      })
      
      // Create treatment plan
      .addCase(createTreatmentPlan.fulfilled, (state, action) => {
        state.treatmentPlans.push(action.payload)
      })
      
      // Submit feedback
      .addCase(submitFeedback.fulfilled, (state, action) => {
        // TODO: Update AI model training data
        console.log('Feedback submitted:', action.payload)
      })
  }
})

export const {
  setCurrentDiagnosis,
  setAnalysisProgress,
  updateDiagnosis,
  addDiagnosis,
  removeDiagnosis,
  updateTreatmentPlan,
  completeTreatmentStep,
  setModelStatus,
  setError,
  clearError
} = diagnosisSlice.actions

export default diagnosisSlice.reducer
