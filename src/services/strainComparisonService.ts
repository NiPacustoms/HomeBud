import { MycorrhizaStrain } from '@/types/plant'
import { mycorrhizaStrains } from './mycorrhizaService'

export interface StrainComparison {
  strain1: MycorrhizaStrain
  strain2: MycorrhizaStrain
  comparison: {
    rootColonization: {
      winner: string
      difference: number
      description: string
    }
    nutrientUptake: {
      winner: string
      difference: number
      description: string
    }
    stressTolerance: {
      winner: string
      difference: number
      description: string
    }
    costEffectiveness: {
      winner: string
      difference: number
      description: string
    }
    cannabisOptimization: {
      winner: string
      difference: number
      description: string
    }
    overallScore: {
      winner: string
      strain1Score: number
      strain2Score: number
      difference: number
    }
  }
  recommendations: {
    bestForIndoor: string
    bestForOutdoor: string
    bestForDrought: string
    bestForSalt: string
    bestForCold: string
    bestValue: string
  }
  detailedAnalysis: {
    strengths: {
      strain1: string[]
      strain2: string[]
    }
    weaknesses: {
      strain1: string[]
      strain2: string[]
    }
    idealConditions: {
      strain1: string[]
      strain2: string[]
    }
  }
}

export interface StrainComparisonFilters {
  category?: string
  minRating?: number
  maxPrice?: number
  stressTolerance?: string[]
  nutrientFocus?: string[]
  applicationMethod?: string[]
}

// Bewertungsskalen für verschiedene Eigenschaften





// Strain-Vergleich durchführen
export const compareStrains = (strain1Id: string, strain2Id: string): StrainComparison => {
  const strain1 = mycorrhizaStrains.find(s => s.id === strain1Id)
  const strain2 = mycorrhizaStrains.find(s => s.id === strain2Id)

  if (!strain1 || !strain2) {
    throw new Error('Einer oder beide Stämme nicht gefunden')
  }

  // Wurzelkolonisierung vergleichen
  const rootColonization1 = getRootColonizationScore(strain1)
  const rootColonization2 = getRootColonizationScore(strain2)
  const rootColonizationDiff = rootColonization1 - rootColonization2

  // Nährstoffaufnahme vergleichen
  const nutrientUptake1 = getNutrientUptakeScore(strain1)
  const nutrientUptake2 = getNutrientUptakeScore(strain2)
  const nutrientUptakeDiff = nutrientUptake1 - nutrientUptake2

  // Stresstoleranz vergleichen
  const stressTolerance1 = getStressToleranceScore(strain1)
  const stressTolerance2 = getStressToleranceScore(strain2)
  const stressToleranceDiff = stressTolerance1 - stressTolerance2

  // Kosten-Effektivität vergleichen
  const costEffectiveness1 = getCostEffectivenessScore(strain1)
  const costEffectiveness2 = getCostEffectivenessScore(strain2)
  const costEffectivenessDiff = costEffectiveness1 - costEffectiveness2

  // Cannabis-Optimierung vergleichen
  const cannabisOptimization1 = getCannabisOptimizationScore(strain1)
  const cannabisOptimization2 = getCannabisOptimizationScore(strain2)
  const cannabisOptimizationDiff = cannabisOptimization1 - cannabisOptimization2

  // Gesamtscore berechnen
  const overallScore1 = (rootColonization1 + nutrientUptake1 + stressTolerance1 + costEffectiveness1 + cannabisOptimization1) / 5
  const overallScore2 = (rootColonization2 + nutrientUptake2 + stressTolerance2 + costEffectiveness2 + cannabisOptimization2) / 5
  const overallDiff = overallScore1 - overallScore2

  return {
    strain1,
    strain2,
    comparison: {
      rootColonization: {
        winner: rootColonizationDiff > 0 ? strain1.name : strain2.name,
        difference: Math.abs(rootColonizationDiff),
        description: getRootColonizationDescription(rootColonizationDiff, strain1, strain2)
      },
      nutrientUptake: {
        winner: nutrientUptakeDiff > 0 ? strain1.name : strain2.name,
        difference: Math.abs(nutrientUptakeDiff),
        description: getNutrientUptakeDescription(nutrientUptakeDiff, strain1, strain2)
      },
      stressTolerance: {
        winner: stressToleranceDiff > 0 ? strain1.name : strain2.name,
        difference: Math.abs(stressToleranceDiff),
        description: getStressToleranceDescription(stressToleranceDiff, strain1, strain2)
      },
      costEffectiveness: {
        winner: costEffectivenessDiff > 0 ? strain1.name : strain2.name,
        difference: Math.abs(costEffectivenessDiff),
        description: getCostEffectivenessDescription(costEffectivenessDiff, strain1, strain2)
      },
      cannabisOptimization: {
        winner: cannabisOptimizationDiff > 0 ? strain1.name : strain2.name,
        difference: Math.abs(cannabisOptimizationDiff),
        description: getCannabisOptimizationDescription(cannabisOptimizationDiff, strain1, strain2)
      },
      overallScore: {
        winner: overallDiff > 0 ? strain1.name : strain2.name,
        strain1Score: Math.round(overallScore1 * 10) / 10,
        strain2Score: Math.round(overallScore2 * 10) / 10,
        difference: Math.abs(overallDiff)
      }
    },
    recommendations: {
      bestForIndoor: getIndoorRecommendation(strain1, strain2),
      bestForOutdoor: getOutdoorRecommendation(strain1, strain2),
      bestForDrought: getDroughtRecommendation(strain1, strain2),
      bestForSalt: getSaltRecommendation(strain1, strain2),
      bestForCold: getColdRecommendation(strain1, strain2),
      bestValue: getValueRecommendation(strain1, strain2)
    },
    detailedAnalysis: {
      strengths: {
        strain1: getStrainStrengths(strain1),
        strain2: getStrainStrengths(strain2)
      },
      weaknesses: {
        strain1: getStrainWeaknesses(strain1),
        strain2: getStrainWeaknesses(strain2)
      },
      idealConditions: {
        strain1: getIdealConditions(strain1),
        strain2: getIdealConditions(strain2)
      }
    }
  }
}

// Bewertungsfunktionen
const getRootColonizationScore = (strain: MycorrhizaStrain): number => {
  // Basierend auf der Wurzelkolonisierung aus der JSON-Datenbank
  const colonizationLevel = strain.benefits.find(benefit => 
    benefit.includes('Wurzelkolonisierung') || 
    benefit.includes('hohe Wurzelkolonisierung') ||
    benefit.includes('sehr hohe Wurzelkolonisierung')
  )
  
  if (colonizationLevel?.includes('sehr hoch')) return 10
  if (colonizationLevel?.includes('hoch')) return 8
  if (colonizationLevel?.includes('mittel')) return 6
  return 4
}

const getNutrientUptakeScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  strain.benefits.forEach(benefit => {
    if (benefit.includes('Phosphor')) score += 4
    if (benefit.includes('Stickstoff')) score += 3
    if (benefit.includes('Kalium')) score += 3
    if (benefit.includes('allgemeine Nährstoffe')) score += 2
    if (benefit.includes('Nährstoffaufnahme')) score += 2
  })
  return Math.min(score, 10)
}

const getStressToleranceScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  strain.benefits.forEach(benefit => {
    if (benefit.includes('Trockenheit') || benefit.includes('Dürre')) score += 3
    if (benefit.includes('Hitze')) score += 3
    if (benefit.includes('Salz')) score += 3
    if (benefit.includes('Kälte')) score += 3
    if (benefit.includes('Stress')) score += 2
  })
  return Math.min(score, 10)
}

const getCostEffectivenessScore = (strain: MycorrhizaStrain): number => {
  const price = parseFloat(strain.commercial.price.match(/€(\d+)/)?.[1] || '25')
  const rating = strain.commercial.rating
  
  // Niedrigerer Preis und höhere Bewertung = bessere Kosten-Effektivität
  const priceScore = Math.max(0, 10 - (price - 20) / 2) // 20€ = 10 Punkte, 30€ = 5 Punkte
  const ratingScore = rating * 2 // 4.5 = 9 Punkte, 5.0 = 10 Punkte
  
  return Math.round(((priceScore + ratingScore) / 2) * 10) / 10
}

const getCannabisOptimizationScore = (strain: MycorrhizaStrain): number => {
  let score = 5 // Basis-Score für alle Stämme
  
  if (strain.category === 'cannabis_specific') score += 3
  if (strain.benefits.some(b => b.includes('Cannabis'))) score += 2
  if (strain.benefits.some(b => b.includes('Ertrag'))) score += 2
  if (strain.benefits.some(b => b.includes('Blütenbildung'))) score += 1
  
  return Math.min(score, 10)
}

// Beschreibungsfunktionen
const getRootColonizationDescription = (diff: number, strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  if (diff > 0) {
    return `${strain1.name} zeigt eine ${Math.abs(diff).toFixed(1)} Punkte höhere Wurzelkolonisierung als ${strain2.name}. Dies führt zu schnellerer Etablierung und besserer Nährstoffaufnahme.`
  } else if (diff < 0) {
    return `${strain2.name} zeigt eine ${Math.abs(diff).toFixed(1)} Punkte höhere Wurzelkolonisierung als ${strain1.name}. Dies führt zu schnellerer Etablierung und besserer Nährstoffaufnahme.`
  } else {
    return `Beide Stämme zeigen ähnliche Wurzelkolonisierung. Die Wahl kann basierend auf anderen Faktoren getroffen werden.`
  }
}

const getNutrientUptakeDescription = (diff: number, strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  if (diff > 0) {
    return `${strain1.name} bietet eine ${Math.abs(diff).toFixed(1)} Punkte bessere Nährstoffaufnahme als ${strain2.name}. Besonders effektiv für ${getNutrientFocus(strain1)}.`
  } else if (diff < 0) {
    return `${strain2.name} bietet eine ${Math.abs(diff).toFixed(1)} Punkte bessere Nährstoffaufnahme als ${strain1.name}. Besonders effektiv für ${getNutrientFocus(strain2)}.`
  } else {
    return `Beide Stämme zeigen ähnliche Nährstoffaufnahme-Eigenschaften.`
  }
}

const getStressToleranceDescription = (diff: number, strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  if (diff > 0) {
    return `${strain1.name} zeigt eine ${Math.abs(diff).toFixed(1)} Punkte bessere Stresstoleranz als ${strain2.name}. Ideal für ${getStressFocus(strain1)}.`
  } else if (diff < 0) {
    return `${strain2.name} zeigt eine ${Math.abs(diff).toFixed(1)} Punkte bessere Stresstoleranz als ${strain1.name}. Ideal für ${getStressFocus(strain2)}.`
  } else {
    return `Beide Stämme zeigen ähnliche Stresstoleranz-Eigenschaften.`
  }
}

const getCostEffectivenessDescription = (diff: number, strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  if (diff > 0) {
    return `${strain1.name} bietet bessere Kosten-Effektivität (${Math.abs(diff).toFixed(1)} Punkte) als ${strain2.name}. Preis: ${strain1.commercial.price}, Bewertung: ${strain1.commercial.rating}/5.`
  } else if (diff < 0) {
    return `${strain2.name} bietet bessere Kosten-Effektivität (${Math.abs(diff).toFixed(1)} Punkte) als ${strain1.name}. Preis: ${strain2.commercial.price}, Bewertung: ${strain2.commercial.rating}/5.`
  } else {
    return `Beide Stämme zeigen ähnliche Kosten-Effektivität.`
  }
}

const getCannabisOptimizationDescription = (diff: number, strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  if (diff > 0) {
    return `${strain1.name} ist ${Math.abs(diff).toFixed(1)} Punkte besser für Cannabis optimiert als ${strain2.name}. ${getCannabisBenefits(strain1)}`
  } else if (diff < 0) {
    return `${strain2.name} ist ${Math.abs(diff).toFixed(1)} Punkte besser für Cannabis optimiert als ${strain1.name}. ${getCannabisBenefits(strain2)}`
  } else {
    return `Beide Stämme zeigen ähnliche Cannabis-Optimierung.`
  }
}

// Empfehlungsfunktionen
const getIndoorRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const indoorScore1 = getIndoorScore(strain1)
  const indoorScore2 = getIndoorScore(strain2)
  
  if (indoorScore1 > indoorScore2) {
    return `${strain1.name} - Optimale Temperatur: ${strain1.idealConditions.temperatureRange.min}-${strain1.idealConditions.temperatureRange.max}°C, pH: ${strain1.idealConditions.phRange.min}-${strain1.idealConditions.phRange.max}`
  } else {
    return `${strain2.name} - Optimale Temperatur: ${strain2.idealConditions.temperatureRange.min}-${strain2.idealConditions.temperatureRange.max}°C, pH: ${strain2.idealConditions.phRange.min}-${strain2.idealConditions.phRange.max}`
  }
}

const getOutdoorRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const outdoorScore1 = getOutdoorScore(strain1)
  const outdoorScore2 = getOutdoorScore(strain2)
  
  if (outdoorScore1 > outdoorScore2) {
    return `${strain1.name} - Klimazonen: ${strain1.idealConditions.climateZones.join(', ')}, Substrate: ${strain1.idealConditions.substrates.join(', ')}`
  } else {
    return `${strain2.name} - Klimazonen: ${strain2.idealConditions.climateZones.join(', ')}, Substrate: ${strain2.idealConditions.substrates.join(', ')}`
  }
}

const getDroughtRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const droughtScore1 = getDroughtScore(strain1)
  const droughtScore2 = getDroughtScore(strain2)
  
  if (droughtScore1 > droughtScore2) {
    return `${strain1.name} - Hervorragende Trockenheitstoleranz, ideal für aride Klimazonen`
  } else {
    return `${strain2.name} - Hervorragende Trockenheitstoleranz, ideal für aride Klimazonen`
  }
}

const getSaltRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const saltScore1 = getSaltScore(strain1)
  const saltScore2 = getSaltScore(strain2)
  
  if (saltScore1 > saltScore2) {
    return `${strain1.name} - Salz- und Hitzetoleranz, ideal für salzhaltige Böden`
  } else {
    return `${strain2.name} - Salz- und Hitzetoleranz, ideal für salzhaltige Böden`
  }
}

const getColdRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const coldScore1 = getColdScore(strain1)
  const coldScore2 = getColdScore(strain2)
  
  if (coldScore1 > coldScore2) {
    return `${strain1.name} - Kältetoleranz, ideal für kalte Klimazonen (${strain1.idealConditions.temperatureRange.min}-${strain1.idealConditions.temperatureRange.max}°C)`
  } else {
    return `${strain2.name} - Kältetoleranz, ideal für kalte Klimazonen (${strain2.idealConditions.temperatureRange.min}-${strain2.idealConditions.temperatureRange.max}°C)`
  }
}

const getValueRecommendation = (strain1: MycorrhizaStrain, strain2: MycorrhizaStrain): string => {
  const valueScore1 = getCostEffectivenessScore(strain1)
  const valueScore2 = getCostEffectivenessScore(strain2)
  
  if (valueScore1 > valueScore2) {
    return `${strain1.name} - Beste Kosten-Effektivität: ${strain1.commercial.price}, Bewertung: ${strain1.commercial.rating}/5`
  } else {
    return `${strain2.name} - Beste Kosten-Effektivität: ${strain2.commercial.price}, Bewertung: ${strain2.commercial.rating}/5`
  }
}

// Hilfsfunktionen für Bewertungen
const getIndoorScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  const tempRange = strain.idealConditions.temperatureRange
  const phRange = strain.idealConditions.phRange
  
  // Temperatur-Bewertung (15-28°C ideal für Indoor)
  if (tempRange.min <= 15 && tempRange.max >= 28) score += 3
  else if (tempRange.min <= 18 && tempRange.max >= 25) score += 2
  else score += 1
  
  // pH-Bewertung (5.5-7.0 ideal für Indoor)
  if (phRange.min <= 5.5 && phRange.max >= 7.0) score += 3
  else if (phRange.min <= 6.0 && phRange.max >= 6.5) score += 2
  else score += 1
  
  // Substrat-Bewertung
  if (strain.idealConditions.substrates.includes('soil') || strain.idealConditions.substrates.includes('coco')) score += 2
  
  return score
}

const getOutdoorScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  
  // Klimazonen-Bewertung
  if (strain.idealConditions.climateZones.includes('temperate') || strain.idealConditions.climateZones.includes('mediterranean')) score += 2
  if (strain.idealConditions.climateZones.includes('arid')) score += 1
  
  // Substrat-Bewertung
  if (strain.idealConditions.substrates.includes('outdoor') || strain.idealConditions.substrates.includes('mixed')) score += 2
  
  // Stresstoleranz-Bewertung
  if (strain.benefits.some(b => b.includes('Trockenheit') || b.includes('Hitze'))) score += 2
  
  return score
}

const getDroughtScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  strain.benefits.forEach(benefit => {
    if (benefit.includes('Trockenheit') || benefit.includes('Dürre')) score += 3
    if (benefit.includes('Wasserhaltekapazität')) score += 2
  })
  return score
}

const getSaltScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  strain.benefits.forEach(benefit => {
    if (benefit.includes('Salz')) score += 3
    if (benefit.includes('Hitze')) score += 1
  })
  return score
}

const getColdScore = (strain: MycorrhizaStrain): number => {
  let score = 0
  strain.benefits.forEach(benefit => {
    if (benefit.includes('Kälte')) score += 3
  })
  if (strain.idealConditions.temperatureRange.min <= 12) score += 2
  return score
}

// Hilfsfunktionen für Beschreibungen
const getNutrientFocus = (strain: MycorrhizaStrain): string => {
  const nutrients = []
  if (strain.benefits.some(b => b.includes('Phosphor'))) nutrients.push('Phosphor')
  if (strain.benefits.some(b => b.includes('Stickstoff'))) nutrients.push('Stickstoff')
  if (strain.benefits.some(b => b.includes('Kalium'))) nutrients.push('Kalium')
  return nutrients.length > 0 ? nutrients.join(', ') : 'allgemeine Nährstoffe'
}

const getStressFocus = (strain: MycorrhizaStrain): string => {
  const stresses = []
  if (strain.benefits.some(b => b.includes('Trockenheit') || b.includes('Dürre'))) stresses.push('Trockenheit')
  if (strain.benefits.some(b => b.includes('Hitze'))) stresses.push('Hitze')
  if (strain.benefits.some(b => b.includes('Salz'))) stresses.push('Salz')
  if (strain.benefits.some(b => b.includes('Kälte'))) stresses.push('Kälte')
  return stresses.length > 0 ? stresses.join(', ') : 'allgemeine Stressbedingungen'
}

const getCannabisBenefits = (strain: MycorrhizaStrain): string => {
  const benefits = []
  if (strain.category === 'cannabis_specific') benefits.push('Cannabis-spezifisch optimiert')
  if (strain.benefits.some(b => b.includes('Ertrag'))) benefits.push('Ertragssteigerung')
  if (strain.benefits.some(b => b.includes('Blütenbildung'))) benefits.push('Verbesserte Blütenbildung')
  return benefits.length > 0 ? benefits.join(', ') : 'Grundlegende Cannabis-Unterstützung'
}

// Stärken und Schwächen analysieren
const getStrainStrengths = (strain: MycorrhizaStrain): string[] => {
  const strengths = []
  
  if (strain.category === 'cannabis_specific') strengths.push('Cannabis-spezifisch optimiert')
  if (strain.benefits.some(b => b.includes('sehr hoch'))) strengths.push('Sehr hohe Wurzelkolonisierung')
  if (strain.benefits.some(b => b.includes('schnell'))) strengths.push('Schnelle Kolonisierung')
  if (strain.benefits.some(b => b.includes('Ertrag'))) strengths.push('Ertragssteigerung')
  if (strain.benefits.some(b => b.includes('Trockenheit'))) strengths.push('Hervorragende Trockenheitstoleranz')
  if (strain.benefits.some(b => b.includes('Salz'))) strengths.push('Salztoleranz')
  if (strain.benefits.some(b => b.includes('Kälte'))) strengths.push('Kältetoleranz')
  if (strain.commercial.rating >= 4.8) strengths.push('Hervorragende Bewertung')
  
  return strengths
}

const getStrainWeaknesses = (strain: MycorrhizaStrain): string[] => {
  const weaknesses = []
  
  if (strain.category === 'general') weaknesses.push('Nicht cannabis-spezifisch')
  if (strain.benefits.some(b => b.includes('mittel'))) weaknesses.push('Mittlere Wurzelkolonisierung')
  if (strain.commercial.rating < 4.5) weaknesses.push('Niedrigere Bewertung')
  if (parseFloat(strain.commercial.price.match(/€(\d+)/)?.[1] || '25') > 30) weaknesses.push('Höherer Preis')
  
  return weaknesses
}

const getIdealConditions = (strain: MycorrhizaStrain): string[] => {
  const conditions = []
  
  conditions.push(`Temperatur: ${strain.idealConditions.temperatureRange.min}-${strain.idealConditions.temperatureRange.max}°C`)
  conditions.push(`pH: ${strain.idealConditions.phRange.min}-${strain.idealConditions.phRange.max}`)
  conditions.push(`Substrate: ${strain.idealConditions.substrates.join(', ')}`)
  conditions.push(`Klimazonen: ${strain.idealConditions.climateZones.join(', ')}`)
  conditions.push(`Anwendung: ${strain.dosage.applicationMethod}`)
  
  return conditions
}

// Stämme nach Kriterien filtern
export const filterStrainsForComparison = (filters: StrainComparisonFilters): MycorrhizaStrain[] => {
  return mycorrhizaStrains.filter(strain => {
    if (filters.category && strain.category !== filters.category) return false
    if (filters.minRating && strain.commercial.rating < filters.minRating) return false
    if (filters.maxPrice) {
      const price = parseFloat(strain.commercial.price.match(/€(\d+)/)?.[1] || '25')
      if (price > filters.maxPrice) return false
    }
    if (filters.stressTolerance && filters.stressTolerance.length > 0) {
      const hasStressTolerance = filters.stressTolerance.some(stress => 
        strain.benefits.some(benefit => benefit.includes(stress))
      )
      if (!hasStressTolerance) return false
    }
    if (filters.nutrientFocus && filters.nutrientFocus.length > 0) {
      const hasNutrientFocus = filters.nutrientFocus.some(nutrient => 
        strain.benefits.some(benefit => benefit.includes(nutrient))
      )
      if (!hasNutrientFocus) return false
    }
    if (filters.applicationMethod && filters.applicationMethod.length > 0) {
      const hasApplicationMethod = filters.applicationMethod.some(method => 
        strain.dosage.applicationMethod.includes(method)
      )
      if (!hasApplicationMethod) return false
    }
    return true
  })
}

// Top-Stämme für verschiedene Anwendungen
export const getTopStrainsForApplication = (application: string, limit: number = 5): MycorrhizaStrain[] => {
  let filteredStrains = [...mycorrhizaStrains]
  
  switch (application) {
    case 'indoor':
      filteredStrains.sort((a, b) => getIndoorScore(b) - getIndoorScore(a))
      break
    case 'outdoor':
      filteredStrains.sort((a, b) => getOutdoorScore(b) - getOutdoorScore(a))
      break
    case 'drought':
      filteredStrains.sort((a, b) => getDroughtScore(b) - getDroughtScore(a))
      break
    case 'salt':
      filteredStrains.sort((a, b) => getSaltScore(b) - getSaltScore(a))
      break
    case 'cold':
      filteredStrains.sort((a, b) => getColdScore(b) - getColdScore(a))
      break
    case 'cannabis':
      filteredStrains.sort((a, b) => getCannabisOptimizationScore(b) - getCannabisOptimizationScore(a))
      break
    case 'value':
      filteredStrains.sort((a, b) => getCostEffectivenessScore(b) - getCostEffectivenessScore(a))
      break
    default:
      filteredStrains.sort((a, b) => b.commercial.rating - a.commercial.rating)
  }
  
  return filteredStrains.slice(0, limit)
}
