import { cannabisWateringDatabase } from '@/data/cannabisWateringDatabase'
import { PlantStage, PotSize, Season, TemperatureLevel, HumidityLevel } from '@/types/plant'

export interface WateringCalculation {
  waterAmount: number
  intervalDays: number
  nextWatering: Date
  recommendations: string[]
  warnings: string[]
  validatedData: {
    researchSources: string[]
    confidenceLevel: 'high' | 'medium' | 'low'
    lastValidated: string
    scientificNotes: string[]
  }
}

export interface EnvironmentalFactors {
  season: Season
  temperature: TemperatureLevel
  humidity: HumidityLevel
}

export class CannabisWateringService {
  /**
   * Berechnet die optimale Wassermenge und Bewässerungsintervalle
   */
  static calculateWatering(
    stage: PlantStage,
    potSize: PotSize,
    environmentalFactors: EnvironmentalFactors
  ): WateringCalculation {
    // Konvertiere PlantStage zu Cannabis-Stage
    const cannabisStage = this.convertPlantStageToCannabisStage(stage)
    
    // Hole Basis-Daten aus der Datenbank
    const stageData = cannabisWateringDatabase.cannabis_stages[cannabisStage]
    const scheduleData = cannabisWateringDatabase.watering_schedule[cannabisStage]?.[potSize]
    
    if (!scheduleData) {
      throw new Error(`Keine Bewässerungsdaten für Stage: ${cannabisStage}, Topfgröße: ${potSize}`)
    }
    
    // Basis-Wassermenge
    let waterAmount = scheduleData.water_amount_liters
    let intervalDays = scheduleData.base_interval_days
    
    // Umweltfaktoren anwenden
    const seasonFactor = cannabisWateringDatabase.watering_rules.frequency_factors.season[environmentalFactors.season]
    const temperatureFactor = cannabisWateringDatabase.watering_rules.frequency_factors.temperature[environmentalFactors.temperature]
    const humidityFactor = cannabisWateringDatabase.watering_rules.frequency_factors.humidity[environmentalFactors.humidity]
    
    // Gesamtfaktor berechnen
    const totalFactor = seasonFactor * temperatureFactor * humidityFactor
    
    // Wassermenge und Intervall anpassen
    waterAmount *= totalFactor
    intervalDays = Math.max(1, Math.round(intervalDays / totalFactor))
    
    // Nächste Bewässerung berechnen
    const nextWatering = new Date()
    nextWatering.setDate(nextWatering.getDate() + intervalDays)
    
    // Empfehlungen und Warnungen generieren
    const recommendations = this.generateRecommendations(cannabisStage, environmentalFactors)
    const warnings = this.generateWarnings(cannabisStage, environmentalFactors, waterAmount)
    
    // Validierte Daten hinzufügen
    const validatedData = this.generateValidatedData(cannabisStage, potSize, scheduleData)
    
    return {
      waterAmount: Math.round(waterAmount * 100) / 100, // Auf 2 Dezimalstellen runden
      intervalDays,
      nextWatering,
      recommendations,
      warnings,
      validatedData
    }
  }
  
  /**
   * Konvertiert PlantStage zu Cannabis-Stage
   */
  private static convertPlantStageToCannabisStage(stage: PlantStage): string {
    switch (stage) {
      case 'seedling':
        return 'seedling'
      case 'vegetative':
        return 'vegetative'
      case 'flowering':
        return 'flowering'
      case 'harvest':
        return 'late_flowering'
      case 'drying':
      case 'curing':
        return 'flushing'
      default:
        return 'vegetative'
    }
  }
  
  /**
   * Generiert Empfehlungen basierend auf Stage und Umweltfaktoren
   */
  private static generateRecommendations(stage: string, factors: EnvironmentalFactors): string[] {
    const recommendations: string[] = []
    
    // Allgemeine Empfehlungen
    recommendations.push(...cannabisWateringDatabase.care_tips.general)
    
    // Stage-spezifische Empfehlungen
    if (cannabisWateringDatabase.care_tips.stage_specific[stage]) {
      recommendations.push(...cannabisWateringDatabase.care_tips.stage_specific[stage])
    }
    
    // Umweltfaktor-spezifische Empfehlungen
    if (factors.temperature === 'hot') {
      recommendations.push('Bei hohen Temperaturen häufiger gießen und auf Anzeichen von Trockenheit achten')
    }
    
    if (factors.humidity === 'low') {
      recommendations.push('Bei niedriger Luftfeuchtigkeit mehr gießen und eventuell Luftbefeuchter verwenden')
    }
    
    if (factors.season === 'winter') {
      recommendations.push('Im Winter weniger gießen und auf Überwässerung achten')
    }
    
    return recommendations
  }
  
  /**
   * Generiert Warnungen basierend auf Stage und Umweltfaktoren
   */
  private static generateWarnings(stage: string, factors: EnvironmentalFactors, waterAmount: number): string[] {
    const warnings: string[] = []
    
    // Warnungen bei extremen Werten
    if (waterAmount > 5) {
      warnings.push('Hohe Wassermenge - achten Sie auf gute Drainage')
    }
    
    if (factors.temperature === 'hot' && factors.humidity === 'high') {
      warnings.push('Hohe Temperatur + hohe Luftfeuchtigkeit erhöht Schimmelrisiko')
    }
    
    if (stage === 'seedling' && waterAmount > 0.5) {
      warnings.push('Vorsicht bei Keimlingen - zu viel Wasser kann Wurzeln schädigen')
    }
    
    return warnings
  }
  
  /**
   * Holt alle verfügbaren Topfgrößen
   */
  static getPotSizes(): Record<string, any> {
    return cannabisWateringDatabase.pot_sizes
  }
  
  /**
   * Holt alle verfügbaren Cannabis-Stages
   */
  static getCannabisStages(): Record<string, any> {
    return cannabisWateringDatabase.cannabis_stages
  }
  
  /**
   * Berechnet die optimale Topfgröße basierend auf der Pflanzenphase
   */
  static getRecommendedPotSize(stage: PlantStage): PotSize {
    switch (stage) {
      case 'seedling':
        return 'small'
      case 'vegetative':
        return 'medium'
      case 'flowering':
        return 'medium_large'
      case 'harvest':
        return 'large'
      default:
        return 'medium'
    }
  }
  
  /**
   * Erstellt einen Bewässerungsplan für die nächsten 30 Tage
   */
  static createWateringSchedule(
    stage: PlantStage,
    potSize: PotSize,
    environmentalFactors: EnvironmentalFactors,
    startDate: Date = new Date()
  ): Array<{ date: Date; waterAmount: number; notes: string[] }> {
    const schedule = []
    const calculation = this.calculateWatering(stage, potSize, environmentalFactors)
    
    let currentDate = new Date(startDate)
    
    for (let i = 0; i < 30; i += calculation.intervalDays) {
      const scheduleDate = new Date(currentDate)
      scheduleDate.setDate(currentDate.getDate() + i)
      
      schedule.push({
        date: scheduleDate,
        waterAmount: calculation.waterAmount,
        notes: calculation.recommendations.slice(0, 2) // Nur die ersten 2 Empfehlungen
      })
    }
    
    return schedule
  }
  
  /**
   * Generiert validierte Daten für die Berechnung
   */
  private static generateValidatedData(stage: string, potSize: PotSize, scheduleData: any) {
    const researchSources = cannabisWateringDatabase.metadata.validation_sources
    const confidenceLevel = this.getConfidenceLevel(stage, potSize)
    const scientificNotes = scheduleData.validated_notes || []
    
    return {
      researchSources: researchSources.slice(0, 3), // Top 3 Quellen
      confidenceLevel,
      lastValidated: cannabisWateringDatabase.metadata.last_updated,
      scientificNotes
    }
  }
  
  /**
   * Bestimmt das Vertrauensniveau basierend auf verfügbaren Daten
   */
  private static getConfidenceLevel(stage: string, potSize: PotSize): 'high' | 'medium' | 'low' {
    // Hohe Validierung für häufige Kombinationen
    if (['vegetative', 'flowering'].includes(stage) && ['medium', 'medium_large'].includes(potSize)) {
      return 'high'
    }
    // Mittlere Validierung für weniger häufige Kombinationen
    if (['seedling', 'late_flowering', 'flushing'].includes(stage)) {
      return 'medium'
    }
    // Niedrige Validierung für extreme Topfgrößen
    if (['very_small', 'very_large'].includes(potSize)) {
      return 'low'
    }
    return 'medium'
  }
  
  /**
   * Diagnostiziert Bewässerungsprobleme basierend auf Symptomen
   */
  static diagnoseWateringIssues(symptoms: string[]): { issue: string; solution: string[] } {
    const overwateringSymptoms = cannabisWateringDatabase.care_tips.signs_of_overwatering
    const underwateringSymptoms = cannabisWateringDatabase.care_tips.signs_of_underwatering
    
    const overwateringCount = symptoms.filter(symptom => 
      overwateringSymptoms.some(overSymptom => 
        symptom.toLowerCase().includes(overSymptom.toLowerCase())
      )
    ).length
    
    const underwateringCount = symptoms.filter(symptom => 
      underwateringSymptoms.some(underSymptom => 
        symptom.toLowerCase().includes(underSymptom.toLowerCase())
      )
    ).length
    
    if (overwateringCount > underwateringCount) {
      return {
        issue: 'Überwässerung',
        solution: [
          'Bewässerung reduzieren',
          'Erde zwischen Gießen trocknen lassen',
          'Drainage überprüfen',
          'Luftzirkulation verbessern'
        ]
      }
    } else if (underwateringCount > overwateringCount) {
      return {
        issue: 'Unterwässerung',
        solution: [
          'Häufiger gießen',
          'Wassermenge erhöhen',
          'Erde gleichmäßig feucht halten',
          'Topfgröße überprüfen'
        ]
      }
    } else {
      return {
        issue: 'Unbekanntes Problem',
        solution: [
          'Pflanzen genau beobachten',
          'Bewässerungsplan dokumentieren',
          'Umweltbedingungen überprüfen',
          'Bei Bedarf Expertenrat einholen'
        ]
      }
    }
  }
}
