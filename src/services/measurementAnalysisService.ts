import { 
  GrowthPhase, 
  GrowType, 
  TargetRanges, 
  MeasurementAnalysis, 
  MeasurementStatus 
} from '@/types/plant'

// VPD-Berechnung nach wissenschaftlichen Standards
export const calculateVPD = (temperature: number, humidity: number): number => {
  // Magnus-Formel für Sättigungsdampfdruck
  const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3))
  
  // Tatsächlicher Dampfdruck
  const actualVaporPressure = saturationVaporPressure * (humidity / 100)
  
  // VPD = Sättigungsdampfdruck - Tatsächlicher Dampfdruck
  return saturationVaporPressure - actualVaporPressure
}

// Zielbereiche je Wachstumsphase und Grow-Type
export const getTargetRanges = (growthPhase: GrowthPhase, growType: GrowType): TargetRanges => {
  const baseRanges = {
    seedling: {
      temperature: { min: 22, max: 26, unit: '°C' },
      humidity: { min: 70, max: 80, unit: '%' },
      lightLevel: { min: 100, max: 300, unit: 'μmol/m²/s' },
      ph: { min: 6.2, max: 6.8, unit: '' },
      ec: { min: 0.8, max: 1.2, unit: 'mS/cm' },
      co2: { min: 400, max: 600, unit: 'ppm' },
      vpd: { min: 0.4, max: 0.8, unit: 'kPa' }
    },
    vegetative: {
      temperature: { min: 22, max: 28, unit: '°C' },
      humidity: { min: 60, max: 70, unit: '%' },
      lightLevel: { min: 400, max: 600, unit: 'μmol/m²/s' },
      ph: { min: 6.0, max: 7.0, unit: '' },
      ec: { min: 1.2, max: 1.8, unit: 'mS/cm' },
      co2: { min: 600, max: 1000, unit: 'ppm' },
      vpd: { min: 0.8, max: 1.2, unit: 'kPa' }
    },
    flowering: {
      temperature: { min: 20, max: 26, unit: '°C' },
      humidity: { min: 45, max: 55, unit: '%' },
      lightLevel: { min: 600, max: 1000, unit: 'μmol/m²/s' },
      ph: { min: 6.0, max: 6.8, unit: '' },
      ec: { min: 1.5, max: 2.2, unit: 'mS/cm' },
      co2: { min: 800, max: 1200, unit: 'ppm' },
      vpd: { min: 1.2, max: 1.6, unit: 'kPa' }
    },
    late_flowering: {
      temperature: { min: 18, max: 24, unit: '°C' },
      humidity: { min: 40, max: 50, unit: '%' },
      lightLevel: { min: 500, max: 800, unit: 'μmol/m²/s' },
      ph: { min: 6.0, max: 6.8, unit: '' },
      ec: { min: 1.2, max: 1.8, unit: 'mS/cm' },
      co2: { min: 600, max: 1000, unit: 'ppm' },
      vpd: { min: 1.4, max: 1.8, unit: 'kPa' }
    },
    flushing: {
      temperature: { min: 18, max: 24, unit: '°C' },
      humidity: { min: 40, max: 50, unit: '%' },
      lightLevel: { min: 400, max: 600, unit: 'μmol/m²/s' },
      ph: { min: 6.0, max: 7.0, unit: '' },
      ec: { min: 0.5, max: 1.0, unit: 'mS/cm' },
      co2: { min: 400, max: 600, unit: 'ppm' },
      vpd: { min: 1.4, max: 1.8, unit: 'kPa' }
    }
  }

  const phaseRanges = baseRanges[growthPhase]
  
  // Anpassung je nach Grow-Type
  switch (growType) {
    case 'outdoor':
      return {
        ...phaseRanges,
        temperature: { min: 18, max: 32, unit: '°C' },
        humidity: { min: 40, max: 80, unit: '%' },
        lightLevel: { min: 200, max: 1000, unit: 'μmol/m²/s' },
        co2: { min: 400, max: 600, unit: 'ppm' }
      }
    case 'greenhouse':
      return {
        ...phaseRanges,
        temperature: { min: 20, max: 30, unit: '°C' },
        humidity: { min: 45, max: 75, unit: '%' },
        lightLevel: { min: 300, max: 900, unit: 'μmol/m²/s' },
        co2: { min: 500, max: 1000, unit: 'ppm' }
      }
    default: // indoor
      return phaseRanges
  }
}

// Analyse eines einzelnen Messwerts
export const analyzeMeasurement = (
  value: number,
  targetRange: { min: number; max: number; unit: string },
  parameter: string
): MeasurementAnalysis => {
  const { min, max } = targetRange
  const tolerance = (max - min) * 0.1 // 10% Toleranz
  
  let status: MeasurementStatus
  let message: string
  let recommendations: string[] = []
  let color: string
  let icon: string

  if (value >= min && value <= max) {
    status = 'optimal'
    message = `${parameter} im optimalen Bereich`
    color = 'text-green-500'
    icon = '✅'
  } else if (value >= min - tolerance && value <= max + tolerance) {
    status = 'warning'
    message = `${parameter} leicht außerhalb des optimalen Bereichs`
    color = 'text-orange-500'
    icon = '⚠️'
    
    if (value < min) {
      recommendations.push(`Erhöhe ${parameter} auf mindestens ${min}${targetRange.unit}`)
    } else {
      recommendations.push(`Reduziere ${parameter} auf maximal ${max}${targetRange.unit}`)
    }
  } else {
    status = 'critical'
    message = `${parameter} deutlich außerhalb des optimalen Bereichs`
    color = 'text-red-500'
    icon = '🚨'
    
    if (value < min) {
      recommendations.push(`Erhöhe ${parameter} dringend auf mindestens ${min}${targetRange.unit}`)
    } else {
      recommendations.push(`Reduziere ${parameter} dringend auf maximal ${max}${targetRange.unit}`)
    }
  }

  return {
    status,
    message,
    recommendations,
    color,
    icon
  }
}

// Vollständige Analyse aller Messwerte
export const analyzeAllMeasurements = (
  measurements: {
    temperature: number
    humidity: number
    lightLevel: number
    ph: number
    ec: number
    co2?: number
  },
  growthPhase: GrowthPhase,
  growType: GrowType
) => {
  const targetRanges = getTargetRanges(growthPhase, growType)
  const vpd = calculateVPD(measurements.temperature, measurements.humidity)

  const result: any = {
    temperature: analyzeMeasurement(measurements.temperature, targetRanges.temperature, 'Temperatur'),
    humidity: analyzeMeasurement(measurements.humidity, targetRanges.humidity, 'Luftfeuchtigkeit'),
    lightLevel: analyzeMeasurement(measurements.lightLevel, targetRanges.lightLevel, 'Lichtstärke'),
    ph: analyzeMeasurement(measurements.ph, targetRanges.ph, 'pH-Wert'),
    ec: analyzeMeasurement(measurements.ec, targetRanges.ec, 'EC-Wert'),
    vpd: analyzeMeasurement(vpd, targetRanges.vpd, 'VPD')
  }

  if (typeof measurements.co2 === 'number') {
    result.co2 = analyzeMeasurement(measurements.co2, targetRanges.co2, 'CO₂')
  }

  return result
}

// Hilfetexte für Messungen
export const getMeasurementTips = (parameter: string): string[] => {
  const tips = {
    temperature: [
      'Messe die Temperatur in Pflanzenhöhe, nicht am Boden',
      'Vermeide direkte Sonneneinstrahlung auf das Thermometer',
      'Messe mehrmals täglich für bessere Durchschnittswerte'
    ],
    humidity: [
      'Platziere das Hygrometer in Pflanzenhöhe',
      'Vermeide Messungen direkt nach dem Gießen',
      'Kontrolliere die Kalibrierung regelmäßig'
    ],
    lightLevel: [
      'Messe PPFD mit einem speziellen PAR-Meter',
      'Halte den Sensor horizontal in Pflanzenhöhe',
      'Messe an verschiedenen Stellen für Durchschnittswerte'
    ],
    ph: [
      'Kalibriere pH-Meter vor jeder Messung',
      'Messe in der Wurzelzone, nicht im Ablaufwasser',
      'Warte 30 Sekunden für stabilen Messwert'
    ],
    ec: [
      'Spüle EC-Meter vor und nach der Messung',
      'Messe bei Raumtemperatur (20-25°C)',
      'Kontrolliere die Kalibrierung monatlich'
    ],
    co2: [
      'Platziere CO₂-Sensor in Pflanzenhöhe',
      'Vermeide Messungen direkt an Lüftungsöffnungen',
      'Kontrolliere die Kalibrierung alle 6 Monate'
    ]
  }

  return tips[parameter as keyof typeof tips] || []
}

// Einheitenkonverter
export const convertUnits = {
  temperature: {
    celsiusToFahrenheit: (celsius: number) => (celsius * 9/5) + 32,
    fahrenheitToCelsius: (fahrenheit: number) => (fahrenheit - 32) * 5/9
  },
  lightLevel: {
    ppfdToLux: (ppfd: number) => ppfd * 54, // Näherungswert
    luxToPpfd: (lux: number) => lux / 54
  },
  ec: {
    mscmToPpm: (ec: number) => ec * 500, // Näherungswert
    ppmToMscm: (ppm: number) => ppm / 500
  }
}
