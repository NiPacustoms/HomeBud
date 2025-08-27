'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TrainingStep {
  id: string
  title: string
  description: string
  materials: string[]
  instructions: string[]
  tips: string[]
  warnings: string[]
}

export const toppingSteps: TrainingStep[] = [
  {
    id: 'timing',
    title: 'Perfekter Zeitpunkt',
    description: 'Optimales Timing für Topping/Fimming basierend auf Wachstumsphase',
    materials: [],
    instructions: [
      'Topping: Woche 4-5, mindestens 4-5 Knotenpaare',
      'FIMing: Woche 3-4, weniger stressig als Topping',
      'Countdown-Timer: "In 3 Tagen ist optimaler Topping-Zeitpunkt"',
      'Gesundheits-Check: "Pflanze muss vital und stress-frei sein"'
    ],
    tips: [
      'Strain-spezifisch: Indica verträgt Topping besser als Sativa',
      'Auto-Reminder: "Pflanze ist bereit für Topping!"',
      'Stress-Level-Monitoring: Nur bei gesunden Pflanzen durchführen'
    ],
    warnings: ['Nicht zu früh - Pflanze muss stabil genug sein']
  },
  {
    id: 'technique',
    title: 'Schnitt-Technik',
    description: 'Präzise Schnitttechniken für erfolgreiches Topping/Fimming',
    materials: ['Sterilisierte Schere', 'Rasierklinge', 'Desinfektionsmittel'],
    instructions: [
      'Topping: "Sauberer Schnitt oberhalb des 4. Knotens"',
      'FIMing: "75% der Spitze abschneiden, 25% stehen lassen"',
      'Werkzeug-Empfehlung: Sterilisierte Schere oder Rasierklinge',
      'Nachsorge: "2-3 Tage nur beobachten, nicht düngen"'
    ],
    tips: [
      'Foto-Upload: "Zeig dein Topping - KI prüft ob korrekt"',
      'Sauberer Schnitt: Immer scharfe, sterile Werkzeuge verwenden',
      'Schnittwinkel: 45° für optimale Heilung'
    ],
    warnings: ['Nicht zu tief schneiden - kann Pflanze schwächen']
  },
  {
    id: 'recovery',
    title: 'Recovery-Tracking',
    description: 'Überwachung der Erholung und Erfolgsmessung',
    materials: [],
    instructions: [
      'Stress-Indikatoren: Welken, Verfärbung, verlangsamtes Wachstum',
      'Erholungs-Timeline: "Normal: 3-5 Tage bis neue Triebe sichtbar"',
      'Erfolgs-Messung: "2 neue Haupttriebe = perfektes Topping"',
      'Wachstums-Boost: "Topping kann +30-50% Ertrag bringen"'
    ],
    tips: [
      'Patience: Nicht zu früh eingreifen - Pflanze braucht Zeit',
      'Monitoring: Tägliche Beobachtung der neuen Triebe',
      'Optimierung: Bei Bedarf weitere Topping-Sessions planen'
    ],
    warnings: ['Bei Stress-Symptomen: Sofort Recovery-Phase einleiten']
  }
]

export const supercroppingSteps: TrainingStep[] = [
  {
    id: 'preparation',
    title: 'Vorbereitung & Timing',
    description: 'Optimale Vorbereitung für erfolgreiches Supercropping',
    materials: ['Garden Tape', 'Clips', 'Stützsystem'],
    instructions: [
      'Optimaler Zeitpunkt: Späte Vegetation, 1-2 Wochen vor Blüte',
      'Ziel-Zweige: Dominante, dickere Äste auswählen',
      'Vorbereitungs-Phase: "Pflanze 24h vor Supercropping nicht gießen"',
      'Stütz-System vorbereiten: "Gebrochene Stellen mit Tape oder Clips stützen"'
    ],
    tips: [
      'Strain-Auswahl: Robuste Indica-Sorten vertragen Supercropping besser',
      'Timing-Check: "Pflanze muss in optimaler Verfassung sein"',
      'Planung: Nur 2-3 Zweige pro Session bearbeiten'
    ],
    warnings: ['Nur bei gesunden, kräftigen Pflanzen durchführen']
  },
  {
    id: 'technique',
    title: 'Supercropping-Technik',
    description: 'Fortgeschrittene Drück-und-Biege-Methode',
    materials: ['Garden Tape', 'Clips', 'Stützsystem'],
    instructions: [
      'Drück-und-Biege-Methode: "Stiel zwischen Fingern rollen bis weich"',
      '90°-Regel: "Zweig um 90° biegen, nicht brechen"',
      'Stütz-System: "Gebrochene Stellen mit Tape oder Clips stützen"',
      'Sicherheits-Check: "Wasser- und Nährstofffluss muss erhalten bleiben"'
    ],
    tips: [
      'Sanft vorgehen: Nicht zu viel Druck ausüben',
      'Knuckle-Entwicklung: "Verstärkung an Bruchstelle nach 1 Woche normal"',
      'Wachstums-Boost: "Supercropping kann +15-20% Ertrag bringen"'
    ],
    warnings: ['Bei komplettem Bruch: Notfall-Klonen als Backup vorbereiten']
  },
  {
    id: 'healing',
    title: 'Heilungs-Monitoring',
    description: 'Überwachung der Heilung und Knuckle-Entwicklung',
    materials: [],
    instructions: [
      'Knuckle-Entwicklung: "Verstärkung an Bruchstelle nach 1 Woche normal"',
      'Wachstums-Boost: "Supercropping kann +15-20% Ertrag bringen"',
      'Notfall-Protokoll: "Wenn Zweig komplett bricht → Klonen als Backup"',
      'Heilungs-Zeit: "2-3 Wochen bis vollständige Heilung"'
    ],
    tips: [
      'Patience: Knuckle braucht Zeit zur Entwicklung',
      'Monitoring: Tägliche Kontrolle der gebrochenen Stellen',
      'Optimierung: Bei Bedarf weitere Supercropping-Sessions'
    ],
    warnings: ['Bei Infektionen: Sofort betroffene Bereiche entfernen']
  }
]

export const defoliationSteps: TrainingStep[] = [
  {
    id: 'phases',
    title: 'Phasen-spezifische Entlaubung',
    description: 'Strategische Blattentfernung je nach Wachstumsphase',
    materials: ['Sterilisierte Schere', 'Handschuhe'],
    instructions: [
      'Woche 3 Vegetation: Große Fächerblätter unten entfernen',
      'Woche 1 Blüte: Moderate Entlaubung für Lichtdurchdringung',
      'Woche 3 Blüte: Letzte größere Entlaubung vor Harzproduktion',
      'Woche 6+ Blüte: Nur noch gelbe/kranke Blätter entfernen'
    ],
    tips: [
      '20%-Regel: Nie mehr als 20% der Blätter pro Session',
      '3-Tage-Regel: Mindestens 3 Tage zwischen Entlaubungs-Sessions',
      'Prioritäten-Liste: "Erst große, dann kleine, erst unten, dann oben"'
    ],
    warnings: ['Nicht zu viel auf einmal - Pflanze braucht Blätter für Photosynthese']
  },
  {
    id: 'selection',
    title: 'Intelligent Selection',
    description: 'Intelligente Auswahl der zu entfernenden Blätter',
    materials: ['Sterilisierte Schere', 'Handschuhe'],
    instructions: [
      'Entfernen: Gelbe, kranke, überschattete, nach innen wachsende Blätter',
      'Behalten: Alle gesunden Fächerblätter mit direktem Lichteinfall',
      'Foto-Vergleich: "Vorher-Nachher für optimale Lernkurve"',
      'Belassungs-Guide: "Gesunde Solarblätter = Energielieferanten"'
    ],
    tips: [
      'Licht-Check: "Entferne nur Blätter, die andere überschatten"',
      'Gesundheits-Check: "Kranke Blätter sofort entfernen"',
      'Balance: "Behalte genug Blätter für optimale Photosynthese"'
    ],
    warnings: ['Nicht zu viele Blätter auf einmal - kann Pflanze schwächen']
  }
]

export const combinedSteps: TrainingStep[] = [
  {
    id: 'combinations',
    title: 'Training-Kombinationen',
    description: 'Optimale Kombinationen verschiedener Training-Techniken',
    materials: ['Alle Materialien der einzelnen Techniken'],
    instructions: [
      'LST + SCROG: "Beste Kombination für maximalen Ertrag"',
      'Topping + LST: "Perfekt für breite, buschige Pflanzen"',
      'Supercropping + Entlaubung: "Für fortgeschrittene Grower"',
      'Kombinierte Strategien: "Mehrere Techniken für maximale Ergebnisse"'
    ],
    tips: [
      'Timing-Koordination: "Techniken nicht gleichzeitig durchführen"',
      'Recovery-Zeit: "Zwischen Techniken ausreichend Pause"',
      'Strain-spezifisch: "Nicht alle Kombinationen für alle Sorten"'
    ],
    warnings: ['Nicht zu viele Techniken gleichzeitig - kann Pflanze überfordern']
  },
  {
    id: 'timing',
    title: 'Timing-Koordination',
    description: 'Perfekte Koordination verschiedener Training-Techniken',
    materials: [],
    instructions: [
      'Woche 1-2: Wachstum beobachten',
      'Woche 3-4: LST beginnen, erstes Topping',
      'Woche 5-6: SCROG-Netz installieren, intensive LST-Phase',
      'Woche 7-8: SCROG füllen, selektive Entlaubung',
      'Woche 9: Blüte einleiten, finales Training'
    ],
    tips: [
      'Planung: "12-Wochen-Vorschau aller Training-Termine"',
      'Strain-spezifisch: "Autoflowers vs. Photoperioden"',
      'Saisonale Tipps: "Im Sommer weniger Stress, mehr Recovery-Zeit"'
    ],
    warnings: ['Bei Stress-Symptomen: Training pausieren und Recovery einleiten']
  }
]

interface TrainingMethodsProps {
  methodId: string
  activeStep: string
  onStepChange: (stepId: string) => void
}

export default function TrainingMethods({ methodId, activeStep, onStepChange }: TrainingMethodsProps) {
  const getSteps = () => {
    switch (methodId) {
      case 'topping': return toppingSteps
      case 'supercropping': return supercroppingSteps
      case 'defoliation': return defoliationSteps
      case 'combined': return combinedSteps
      default: return toppingSteps
    }
  }

  const steps = getSteps()

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        📖 {methodId === 'topping' ? 'Topping/Fimming' :
            methodId === 'supercropping' ? 'Supercropping' :
            methodId === 'defoliation' ? 'Entlaubung' :
            'Kombinierte Strategien'} - Detaillierter Guide
      </h2>
      
      {/* Step Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeStep === step.id
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {steps.map((step) => (
        step.id === activeStep && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>

            {step.materials.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">🛠️ Benötigte Materialien</h4>
                <div className="flex flex-wrap gap-2">
                  {step.materials.map((material, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">📋 Schritt-für-Schritt Anleitung</h4>
              <div className="space-y-3">
                {step.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-green-400 font-bold">{idx + 1}.</span>
                    <span className="text-white/90">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            {step.tips.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">💡 Pro-Tipps</h4>
                <div className="space-y-2">
                  {step.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                      <span className="text-blue-400">💡</span>
                      <span className="text-white/90">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.warnings.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">⚠️ Wichtige Warnungen</h4>
                <div className="space-y-2">
                  {step.warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg">
                      <span className="text-red-400">⚠️</span>
                      <span className="text-white/90">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )
      ))}
    </div>
  )
}
