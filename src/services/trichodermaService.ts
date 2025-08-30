import trichodermaData from '../../public/data/trichoderma-database.json'

export interface TrichodermaStrain {
  id: string
  name: string
  mechanisms: string[]
  application_methods: string[]
  optimal_soil_pH: [number, number]
  optimal_temperature_celsius: [number, number]
  recommended_dosage_g_per_liter: number
}

export interface ComboPackage {
  id: string
  name: string
  description: string
  mycorrhiza_strain: string
  trichoderma_strain: string
  mixing_ratio: {
    mycorrhiza_percent: number
    trichoderma_percent: number
  }
  application_timing: string
  benefits: string[]
  dosage_per_liter: {
    mycorrhiza_g: number
    trichoderma_g: number
  }
}

export interface DosageCalculation {
  substrateVolume: number
  substrateType: 'coco_coir' | 'soil_mix' | 'hydroponic'
  growthPhase: 'germination' | 'vegetative' | 'flowering' | 'maintenance'
  selectedStrain?: string
  selectedCombo?: string
  calculatedDosage: {
    trichoderma_g: number
    mycorrhiza_g?: number
    total_g: number
    application_method: string
    frequency: string
    notes: string
  }
}

export interface ApplicationRecord {
  id: string
  date: Date
  strainId: string
  strainName: string
  dosage: number
  substrateVolume: number
  substrateType: string
  growthPhase: string
  applicationMethod: string
  observations: string
  effectiveness: 'excellent' | 'good' | 'fair' | 'poor'
}

class TrichodermaService {
  private applicationRecords: ApplicationRecord[] = []

  // Alle Trichoderma-Stämme abrufen
  getAllStrains(): TrichodermaStrain[] {
    return trichodermaData.trichoderma_strains as TrichodermaStrain[]
  }

  // Stamm nach ID abrufen
  getStrainById(id: string): TrichodermaStrain | undefined {
    return trichodermaData.trichoderma_strains.find(strain => strain.id === id) as TrichodermaStrain | undefined
  }

  // Stämme nach Wirkmechanismus filtern
  getStrainsByMechanism(mechanism: string): TrichodermaStrain[] {
    return trichodermaData.trichoderma_strains.filter(strain =>
      strain.mechanisms.some(m => m.toLowerCase().includes(mechanism.toLowerCase()))
    ) as TrichodermaStrain[]
  }

  // Stämme nach Anwendungsmethode filtern
  getStrainsByApplicationMethod(method: string): TrichodermaStrain[] {
    return trichodermaData.trichoderma_strains.filter(strain =>
      strain.application_methods.some(m => m.toLowerCase().includes(method.toLowerCase()))
    ) as TrichodermaStrain[]
  }

  // Stämme nach pH-Bereich filtern
  getStrainsByPH(pH: number): TrichodermaStrain[] {
    return trichodermaData.trichoderma_strains.filter(strain => {
      const phRange = strain.optimal_soil_pH;
      return phRange && phRange.length >= 2 && 
             typeof phRange[0] === 'number' && typeof phRange[1] === 'number' &&
             pH >= phRange[0] && pH <= phRange[1];
    }) as TrichodermaStrain[]
  }

  // Stämme nach Temperaturbereich filtern
  getStrainsByTemperature(temp: number): TrichodermaStrain[] {
    return trichodermaData.trichoderma_strains.filter(strain => {
      const tempRange = strain.optimal_temperature_celsius;
      return tempRange && tempRange.length >= 2 && 
             typeof tempRange[0] === 'number' && typeof tempRange[1] === 'number' &&
             temp >= tempRange[0] && temp <= tempRange[1];
    }) as TrichodermaStrain[]
  }

  // Alle Kombi-Pakete abrufen
  getAllComboPackages(): ComboPackage[] {
    return trichodermaData.combo_packages
  }

  // Kombi-Paket nach ID abrufen
  getComboPackageById(id: string): ComboPackage | undefined {
    return trichodermaData.combo_packages.find(pkg => pkg.id === id)
  }

  // Dosierung berechnen
  calculateDosage(params: {
    substrateVolume: number
    substrateType: 'coco_coir' | 'soil_mix' | 'hydroponic'
    growthPhase: 'germination' | 'vegetative' | 'flowering' | 'maintenance'
    selectedStrain?: string
    selectedCombo?: string
  }): DosageCalculation {
    const { substrateVolume, substrateType, growthPhase, selectedStrain, selectedCombo } = params
    
    let trichoderma_g = 0
    let mycorrhiza_g = 0
    let application_method = ''
    let frequency = ''
    let notes = ''

    if (selectedCombo) {
      // Kombi-Paket Dosierung
      const combo = this.getComboPackageById(selectedCombo)
      if (combo) {
        trichoderma_g = combo.dosage_per_liter.trichoderma_g * substrateVolume
        mycorrhiza_g = combo.dosage_per_liter.mycorrhiza_g * substrateVolume
        application_method = combo.application_timing
        frequency = 'Einmalig bei Substratinokulation'
        notes = `Kombi-Paket: ${combo.name}`
      }
    } else if (selectedStrain) {
      // Einzelstamm Dosierung
      const strain = this.getStrainById(selectedStrain)
      if (strain) {
        const baseDosage = strain.recommended_dosage_g_per_liter * substrateVolume
        
        // Substrat-Multiplikator anwenden
        const substrateMultiplier = trichodermaData.application_guidelines.substrate_types[substrateType].dosage_multiplier
        
        // Wachstumsphase-Multiplikator anwenden
        const phaseMultiplier = trichodermaData.application_guidelines.growth_phases[growthPhase].dosage_multiplier
        
        trichoderma_g = baseDosage * substrateMultiplier * phaseMultiplier
        application_method = trichodermaData.application_guidelines.substrate_types[substrateType].application_method
        frequency = trichodermaData.application_guidelines.growth_phases[growthPhase].frequency
        notes = `Stamm: ${strain.name}`
      }
    }

    return {
      substrateVolume,
      substrateType,
      growthPhase,
      selectedStrain,
      selectedCombo,
      calculatedDosage: {
        trichoderma_g: Math.round(trichoderma_g * 100) / 100,
        ...(mycorrhiza_g > 0 && { mycorrhiza_g: Math.round(mycorrhiza_g * 100) / 100 }),
        total_g: Math.round((trichoderma_g + (mycorrhiza_g || 0)) * 100) / 100,
        application_method,
        frequency,
        notes
      }
    }
  }

  // Empfehlung basierend auf Bedingungen generieren
  getRecommendation(params: {
    plantType: string
    substrateType: string
    currentPH: number
    currentTemperature: number
    growthPhase: string
    hasDiseaseIssues: boolean
  }): {
    recommendedStrains: TrichodermaStrain[]
    recommendedCombos: ComboPackage[]
    reasoning: string
  } {
    const { plantType, substrateType, currentPH, currentTemperature, growthPhase, hasDiseaseIssues } = params
    
    let recommendedStrains: TrichodermaStrain[] = []
    let reasoning = ''

    // Basis-Filterung nach pH und Temperatur
    let candidates = this.getStrainsByPH(currentPH)
    candidates = candidates.filter(strain => 
      currentTemperature >= strain.optimal_temperature_celsius[0] && 
      currentTemperature <= strain.optimal_temperature_celsius[1]
    )

    if (hasDiseaseIssues) {
      // Bei Krankheitsproblemen: Stämme mit starker Pathogenhemmung bevorzugen
      candidates = candidates.filter(strain =>
        strain.mechanisms.some(m => 
          m.toLowerCase().includes('pathogen') || 
          m.toLowerCase().includes('antagonismus') ||
          m.toLowerCase().includes('isr')
        )
      )
      reasoning = 'Stämme mit starker Pathogenhemmung für Krankheitsbekämpfung ausgewählt.'
    } else {
      // Bei gesunden Pflanzen: Wachstumsförderung bevorzugen
      candidates = candidates.filter(strain =>
        strain.mechanisms.some(m => 
          m.toLowerCase().includes('wachstum') || 
          m.toLowerCase().includes('nährstoff')
        )
      )
      reasoning = 'Stämme mit Wachstumsförderung für optimale Entwicklung ausgewählt.'
    }

    // Top 3 Empfehlungen
    recommendedStrains = candidates.slice(0, 3)

    // Kombi-Pakete empfehlen
    const recommendedCombos = trichodermaData.combo_packages.slice(0, 2)

    return {
      recommendedStrains,
      recommendedCombos,
      reasoning
    }
  }

  // Anwendungsprotokoll speichern
  saveApplicationRecord(record: Omit<ApplicationRecord, 'id'>): void {
    const newRecord: ApplicationRecord = {
      ...record,
      id: Date.now().toString()
    }
    this.applicationRecords.push(newRecord)
    
    // Lokale Speicherung
    localStorage.setItem('trichoderma_applications', JSON.stringify(this.applicationRecords))
  }

  // Anwendungsprotokolle laden
  getApplicationRecords(): ApplicationRecord[] {
    const stored = localStorage.getItem('trichoderma_applications')
    if (stored) {
      this.applicationRecords = JSON.parse(stored).map((record: any) => ({
        ...record,
        date: new Date(record.date)
      }))
    }
    return this.applicationRecords
  }

  // Anwendungsprotokoll löschen
  deleteApplicationRecord(id: string): void {
    this.applicationRecords = this.applicationRecords.filter(record => record.id !== id)
    localStorage.setItem('trichoderma_applications', JSON.stringify(this.applicationRecords))
  }

  // Wirksamkeitsanalyse
  getEffectivenessAnalysis(): {
    averageEffectiveness: number
    bestStrains: string[]
    recommendations: string[]
  } {
    const records = this.getApplicationRecords()
    
    if (records.length === 0) {
      return {
        averageEffectiveness: 0,
        bestStrains: [],
        recommendations: ['Noch keine Anwendungsdaten vorhanden. Starten Sie mit der ersten Anwendung.']
      }
    }

    // Durchschnittliche Wirksamkeit berechnen
    const effectivenessScores = {
      'excellent': 4,
      'good': 3,
      'fair': 2,
      'poor': 1
    }

    const totalScore = records.reduce((sum, record) => 
      sum + effectivenessScores[record.effectiveness], 0
    )
    const averageEffectiveness = totalScore / records.length

    // Beste Stämme identifizieren
    const strainScores: { [key: string]: number[] } = {}
    records.forEach(record => {
      if (!strainScores[record.strainId]) {
        strainScores[record.strainId] = []
      }
      strainScores[record.strainId].push(effectivenessScores[record.effectiveness])
    })

    const bestStrains = Object.entries(strainScores)
      .map(([strainId, scores]) => ({
        strainId,
        averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3)
      .map(item => item.strainId)

    // Empfehlungen generieren
    const recommendations: string[] = []
    
    if (averageEffectiveness < 2.5) {
      recommendations.push('Erhöhen Sie die Dosierung oder wechseln Sie zu einem anderen Stamm.')
    }
    
    if (records.length < 5) {
      recommendations.push('Mehr Anwendungsdaten sammeln für bessere Analyse.')
    }

    return {
      averageEffectiveness: Math.round(averageEffectiveness * 100) / 100,
      bestStrains,
      recommendations
    }
  }
}

export const trichodermaService = new TrichodermaService()
