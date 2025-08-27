export type PlantStage = 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'drying' | 'curing' | 'late_flowering' | 'flushing'

export type LogAction = 'watering' | 'feeding' | 'measurement' | 'note' | 'photo' | 'video' | 'voice'

// Neue Bewässerungs-Typen
export type PlantCategory = 'succulents' | 'tropical' | 'mediterranean' | 'foliage' | 'flowering'
export type PotSize = 'very_small' | 'small' | 'medium_small' | 'medium' | 'medium_large' | 'large' | 'very_large'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type TemperatureLevel = 'cold' | 'moderate' | 'warm' | 'hot'
export type HumidityLevel = 'low' | 'moderate' | 'high'

// Neue Typen für erweiterte Datenerfassung
export type GrowthPhase = 'seedling' | 'vegetative' | 'flowering' | 'late_flowering' | 'flushing'
export type MeasurementStatus = 'optimal' | 'warning' | 'critical' | 'excellent'
export type GrowType = 'indoor' | 'outdoor' | 'greenhouse'

// Erweiterte Messwerte mit VPD-Berechnung
export interface MeasurementData {
  // Grundwerte
  temperature: number // °C
  humidity: number // %
  lightLevel: number // μmol/m²/s (PPFD)
  ph: number
  ec: number // mS/cm
  co2?: number // ppm
  
  // Berechnete Werte
  vpd?: number // kPa (berechnet aus Temperatur und Luftfeuchtigkeit)
  
  // Zusätzliche Werte (nur Indoor)
  airFlow?: number // %
  soilMoisture?: number // %
  
  // Metadaten
  timestamp: Date
  growthPhase: GrowthPhase
  growType: GrowType
  notes?: string
}

// Zielbereiche je Wachstumsphase
export interface TargetRanges {
  temperature: { min: number; max: number; unit: string }
  humidity: { min: number; max: number; unit: string }
  lightLevel: { min: number; max: number; unit: string }
  ph: { min: number; max: number; unit: string }
  ec: { min: number; max: number; unit: string }
  co2: { min: number; max: number; unit: string }
  vpd: { min: number; max: number; unit: string }
}

// Analyse-Ergebnisse
export interface MeasurementAnalysis {
  status: MeasurementStatus
  message: string
  recommendations: string[]
  color: string
  icon: string
}

// Erweiterte Datenerfassung
export interface DailyDataEntry {
  id: string
  projectId: string
  date: Date
  growthPhase: GrowthPhase
  growType: GrowType
  
  // Messwerte
  temperature: number
  humidity: number
  lightLevel: number
  ph: number
  ec: number
  co2?: number
  airFlow?: number
  soilMoisture?: number
  
  // Berechnete Werte
  vpd?: number
  
  // Analyse
  analysis?: {
    temperature: MeasurementAnalysis
    humidity: MeasurementAnalysis
    lightLevel: MeasurementAnalysis
    ph: MeasurementAnalysis
    ec: MeasurementAnalysis
    co2?: MeasurementAnalysis
    vpd?: MeasurementAnalysis
  }
  
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Erinnerungen und Checklisten
export interface MeasurementReminder {
  id: string
  type: 'daily' | 'weekly' | 'custom'
  title: string
  description: string
  frequency: number // Tage
  lastReminder?: Date
  nextReminder: Date
  isActive: boolean
  measurements: string[] // Welche Messwerte erfasst werden sollen
}

export interface MeasurementChecklist {
  id: string
  title: string
  items: {
    id: string
    title: string
    description: string
    isCompleted: boolean
    category: 'temperature' | 'humidity' | 'light' | 'nutrients' | 'ventilation' | 'general'
  }[]
  createdAt: Date
  completedAt?: Date
}

export interface WateringSchedule {
  potVolumeLiters: number
  potDiameterCm: number
  waterAmountLiters: number
  baseIntervalDays: number
  plantExamples: string[]
}

export interface WateringData {
  category: PlantCategory
  potSize: PotSize
  schedule: WateringSchedule
  environmentalFactors: {
    season: Season
    temperature: TemperatureLevel
    humidity: HumidityLevel
  }
  adjustedWaterAmount?: number
  adjustedInterval?: number
  lastWatered?: string
  nextWatering?: string
}

export interface Plant {
  id: string
  name: string
  strain?: string
  stage: PlantStage
  startDate: string
  harvestDate?: string
  photos: PlantPhoto[]
  logs: PlantLog[]
  tasks: PlantTask[]
  settings: PlantSettings
  health: PlantHealth
  wateringData?: WateringData // Neue Bewässerungsdaten
  createdAt: string
  updatedAt: string
}

export interface PlantPhoto {
  id: string
  url: string
  thumbnailUrl: string
  caption?: string
  date: string
  tags: string[]
}

export interface PlantLog {
  id: string
  plantId: string
  action: LogAction
  date: string
  data: LogData
  photos?: PlantPhoto[]
  voiceMemo?: string
  barcode?: string
  createdAt: string
}

export interface LogData {
  // Watering
  amount?: number // ml
  runoff?: number // ml
  
  // Feeding
  nutrients?: NutrientMix[]
  
  // Measurements
  temperature?: number // °C
  humidity?: number // %
  ph?: number
  ec?: number
  ppm?: number
  vpd?: number
  
  // General
  notes?: string
  tags?: string[]
}

export interface NutrientMix {
  name: string
  amount: number // ml
  ratio?: number // ml/L
}

export interface PlantTask {
  id: string
  plantId: string
  title: string
  description?: string
  type: 'watering' | 'feeding' | 'measurement' | 'maintenance' | 'custom'
  dueDate: string
  completedAt?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  recurring?: RecurringPattern
  createdAt: string
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly'
  interval: number
  endDate?: string
}

export interface PlantSettings {
  substrate: string
  potSize: number // L
  lightSchedule: LightSchedule
  targetVPD: number
  targetEC: number
  targetPH: number
  targetTemperature: number
  targetHumidity: number
}

export interface LightSchedule {
  onTime: string // HH:MM
  offTime: string // HH:MM
  intensity?: number // %
}

export interface PlantHealth {
  vpd: number
  ec: number
  ph: number
  temperature: number
  humidity: number
  lastUpdated: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

export interface Strain {
  id: string
  name: string
  breeder: string
  type: 'indica' | 'sativa' | 'hybrid'
  thcContent: number // %
  cbdContent: number // %
  floweringWeeks: number
  photoperiod: 'auto' | 'photo'
  description: string
  effects: string[]
  flavors: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  yield: 'low' | 'medium' | 'high'
  height: 'short' | 'medium' | 'tall'
  climate: 'indoor' | 'outdoor' | 'greenhouse'
}

// Mykorrhiza-Integration Typen
export interface MycorrhizaStrain {
  id: string
  name: string
  scientificName: string
  type: 'endomycorrhiza' | 'ectomycorrhiza' | 'arbuscular'
  category: 'general' | 'cannabis_specific' | 'stress_resistant' | 'nutrient_optimized'
  
  // Wissenschaftliche Validierung
  validation: {
    studies: string[]
    researchInstitution: string
    publicationYear: number
    peerReviewed: boolean
  }
  
  // Eigenschaften
  benefits: string[]
  idealConditions: {
    plantTypes: string[]
    substrates: string[]
    climateZones: string[]
    phRange: { min: number; max: number }
    temperatureRange: { min: number; max: number }
  }
  
  // Dosierung
  dosage: {
    baseRate: number // Sporen pro Liter
    unit: 'spores/L' | 'g/L' | 'ml/L'
    applicationMethod: string
    frequency: string
  }
  
  // Kommerzielle Informationen
  commercial: {
    price: string
    certification: string[]
    availability: 'readily_available' | 'limited' | 'special_order'
    supplier: string
    rating: number
  }
  
  // Anwendungsempfehlungen
  application: {
    bestTime: string
    preparation: string[]
    precautions: string[]
    compatibility: string[]
  }
}

export interface DosageCalculation {
  strainId: string
  potSize: number // Liter
  substrateType: 'soil' | 'coco' | 'hydro' | 'perlite' | 'vermiculite' | 'mixed'
  plantType: 'cannabis' | 'vegetables' | 'herbs' | 'flowers' | 'trees'
  growthPhase: GrowthPhase
  
  // Berechnete Werte
  recommendedDosage: number
  dosageUnit: string
  cost: number
  applicationInstructions: string[]
  
  // Anpassungsfaktoren
  adjustments: {
    substrateFactor: number
    plantFactor: number
    phaseFactor: number
    totalFactor: number
  }
}

export interface MycorrhizaApplication {
  id: string
  strainId: string
  plantId: string
  date: Date
  dosage: number
  method: string
  notes?: string
  success: 'pending' | 'success' | 'failure'
  createdAt: Date
}

export interface RootAssessment {
  id: string
  plantId: string
  date: Date
  
  // Wurzelbewertung
  rootDensity: number // 1-10 Skala
  rootHealth: number // 1-10 Skala
  rootColor: 'white' | 'light_brown' | 'dark_brown' | 'black'
  rootSmell: 'fresh' | 'neutral' | 'musty' | 'rotten'
  
  // Pflanzenentwicklung
  plantHeight: number // cm
  plantWidth: number // cm
  leafCount: number
  leafColor: 'dark_green' | 'green' | 'light_green' | 'yellow' | 'brown'
  
  // Mykorrhiza-Effekte
  mycorrhizaEffects: {
    rootGrowth: number // 1-10 Skala
    stressResistance: number // 1-10 Skala
    nutrientUptake: number // 1-10 Skala
    overallHealth: number // 1-10 Skala
  }
  
  // Beobachtungen
  observations: string[]
  problems?: string[]
  recommendations?: string[]
  
  // Medien
  images?: string[]
  notes?: string
  createdAt: Date
}

export interface MycorrhizaComparison {
  id: string
  plantId: string
  startDate: Date
  
  // Kontrollgruppe (ohne Mykorrhiza)
  control: {
    initialAssessment: RootAssessment
    finalAssessment: RootAssessment
    yield?: number // Gramm
    growthRate: number // cm/Tag
  }
  
  // Versuchsgruppe (mit Mykorrhiza)
  treatment: {
    strainId: string
    initialAssessment: RootAssessment
    finalAssessment: RootAssessment
    yield?: number // Gramm
    growthRate: number // cm/Tag
  }
  
  // Vergleichsergebnisse
  results: {
    yieldImprovement?: number // Prozent
    growthImprovement: number // Prozent
    rootImprovement: number // Prozent
    stressResistanceImprovement: number // Prozent
    overallImprovement: number // Prozent
  }
  
  // Analyse
  analysis: {
    significantImprovement: boolean
    costBenefitRatio: number
    recommendations: string[]
    nextSteps: string[]
  }
  
  createdAt: Date
  updatedAt: Date
}

export interface MycorrhizaRecommendation {
  strainId: string
  confidence: number // 0-100%
  reasons: string[]
  alternatives: string[]
  expectedBenefits: string[]
  applicationPlan: {
    timing: string
    dosage: number
    method: string
    frequency: string
  }
}
