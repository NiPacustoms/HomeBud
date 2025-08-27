export interface GrowCycle {
  id: string
  name: string
  plantName: string
  startDate: string
  endDate: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  progress: number
  tasks: Task[]
  notes: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'watering' | 'nutrients' | 'pruning' | 'monitoring' | 'other'
}

export interface CalendarNote {
  id: string
  date: string
  title: string
  content: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface GrowthPhase {
  id: string
  cycleId: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  startDate: string
  endDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

export const mockGrowCycles: GrowCycle[] = [
  {
    id: '1',
    name: 'Winter Grow 2024',
    plantName: 'Gorilla Glue #4',
    startDate: '2024-01-01',
    endDate: '2024-04-15',
    stage: 'flowering',
    progress: 65,
    tasks: [
      {
        id: '1',
        title: 'Gorilla Glue #4 bewässern (Plagron)',
        description: '2,5L pH-optimiertes Wasser (pH 6.2-6.5) bei 22°C. Topfgewicht prüfen - nur bewässern wenn Erde trocken ist. 20% Abfluss gewährleisten. Plagron Alga Grow für Wurzelgesundheit.',
        dueDate: '2024-01-16T08:00:00',
        completed: false,
        priority: 'high',
        category: 'watering'
      },
      {
        id: '2',
        title: 'Plagron Blüte-Nährstoffe für Gorilla Glue #4',
        description: 'Plagron Terra Bloom 4ml/L + Plagron Terra Grow 2ml/L + Plagron Power Roots 1ml/L. EC-Wert: 1.8-2.0, pH: 6.2-6.5. 2,5L Lösung zubereiten. Woche 6 der Blüte.',
        dueDate: '2024-01-17T10:00:00',
        completed: false,
        priority: 'medium',
        category: 'nutrients'
      },
      {
        id: '3',
        title: 'Trichom-Check Gorilla Glue #4',
        description: 'Lupe verwenden - Trichome sollten 70% milchig, 30% klar sein. Ernte in 7-10 Tagen wenn 10% bernsteinfarben. Plagron Sugar Royal für letzten Push.',
        dueDate: '2024-01-18T14:00:00',
        completed: false,
        priority: 'low',
        category: 'monitoring'
      },
      {
        id: '4',
        title: 'VPD & Klima-Kontrolle',
        description: 'Temperatur: 22-24°C, Luftfeuchtigkeit: 45-55%, VPD: 1.2-1.4 kPa. Plagron Green Sensation für Stressreduktion.',
        dueDate: '2024-01-19T09:00:00',
        completed: false,
        priority: 'medium',
        category: 'monitoring'
      }
    ],
    notes: 'Pflanze entwickelt sich sehr gut. Trichome werden milchig. VPD optimal bei 1.2 kPa. Plagron-System zeigt exzellente Ergebnisse.'
  },
  {
    id: '2',
    name: 'Indoor Saison',
    plantName: 'Northern Lights',
    startDate: '2024-01-15',
    endDate: '2024-05-01',
    stage: 'vegetative',
    progress: 35,
    tasks: [
      {
        id: '5',
        title: 'Northern Lights bewässern (Canna)',
        description: '1,8L pH-optimiertes Wasser (pH 6.0-6.3) bei 20°C. Pflanze ist noch jung - vorsichtig bewässern. Erde sollte feucht aber nicht nass sein. Canna Rhizotonic für Wurzelstimulation.',
        dueDate: '2024-01-18T16:00:00',
        completed: false,
        priority: 'high',
        category: 'watering'
      },
      {
        id: '6',
        title: 'Canna Terra Vega für Northern Lights',
        description: 'Canna Terra Vega 3ml/L + Canna Rhizotonic 2ml/L + Canna Cannazym 1ml/L. EC-Wert: 1.2-1.4, pH: 6.0-6.3. 1,8L Lösung zubereiten. Woche 4 der Vegetation.',
        dueDate: '2024-01-20T11:00:00',
        completed: false,
        priority: 'high',
        category: 'nutrients'
      },
      {
        id: '7',
        title: 'LST-Training Northern Lights',
        description: 'Hauptstamm vorsichtig nach unten biegen. Zweige mit weichen Kabelbindern fixieren. Nicht zu stark biegen - Stress vermeiden. Canna Boost für Stressreduktion.',
        dueDate: '2024-01-21T08:00:00',
        completed: false,
        priority: 'medium',
        category: 'pruning'
      }
    ],
    notes: 'Pflanze wächst kompakt und gesund. 5 Hauptzweige entwickelt. Canna-System zeigt starkes vegetatives Wachstum.'
  },
  {
    id: '3',
    name: 'Autoflower Test',
    plantName: 'Amnesia Haze Auto',
    startDate: '2024-01-10',
    endDate: '2024-03-20',
    stage: 'seedling',
    progress: 15,
    tasks: [
      {
        id: '8',
        title: 'Amnesia Haze Auto bewässern (Advanced Nutrients)',
        description: '0,5L pH-optimiertes Wasser (pH 6.0-6.2) bei 20°C. Sehr vorsichtig - nur um die Pflanze herum. Erde sollte leicht feucht sein. Advanced Nutrients Voodoo Juice für Wurzelentwicklung.',
        dueDate: '2024-01-16T07:00:00',
        completed: true,
        priority: 'high',
        category: 'watering'
      },
      {
        id: '9',
        title: 'Advanced Nutrients Keimlings-Nährstoffe',
        description: 'Advanced Nutrients Sensi Grow A+B 1ml/L + Voodoo Juice 1ml/L + B-52 0.5ml/L. EC-Wert: 0.8-1.0, pH: 6.0-6.2. Nur 0,5L Lösung - sehr schwache Dosierung.',
        dueDate: '2024-01-17T12:00:00',
        completed: false,
        priority: 'low',
        category: 'nutrients'
      },
      {
        id: '10',
        title: 'Lichtabstand prüfen Amnesia Haze',
        description: 'LED-Panel auf 60cm Abstand einstellen. 18/6 Lichtzyklus. PPFD sollte 200-300 μmol/m²/s betragen. Advanced Nutrients Bud Candy für Stressreduktion.',
        dueDate: '2024-01-19T10:00:00',
        completed: false,
        priority: 'medium',
        category: 'monitoring'
      }
    ],
    notes: 'Autoflower entwickelt sich gut. Kompaktes Wachstum. Advanced Nutrients-System für Autoflowers optimiert.'
  },
  {
    id: '4',
    name: 'CBD Medical',
    plantName: 'Charlotte\'s Web',
    startDate: '2024-01-05',
    endDate: '2024-04-30',
    stage: 'planning',
    progress: 5,
    tasks: [
      {
        id: '11',
        title: 'Plagron CBD-Setup vorbereiten',
        description: 'Grow-Raum für CBD-Pflanzen vorbereiten. Plagron Light Mix Erde, pH: 6.0-6.3, EC: 1.0-1.2. CBD-optimierte Beleuchtung installieren.',
        dueDate: '2024-01-16T15:00:00',
        completed: false,
        priority: 'high',
        category: 'other'
      },
      {
        id: '12',
        title: 'Charlotte\'s Web Samen bestellen',
        description: 'Charlotte\'s Web CBD-Samen bestellen. Plagron CBD-spezifische Nährstoffe: Terra Grow, Terra Bloom, Sugar Royal für CBD-Produktion.',
        dueDate: '2024-01-18T13:00:00',
        completed: false,
        priority: 'medium',
        category: 'other'
      },
      {
        id: '13',
        title: 'Plagron CBD-Nährstoffe kaufen',
        description: 'Plagron Terra Grow 5L, Terra Bloom 5L, Sugar Royal 1L, Power Roots 1L. CBD-optimierte Dosierung: 20% weniger N als THC-Strains.',
        dueDate: '2024-01-20T16:00:00',
        completed: false,
        priority: 'medium',
        category: 'other'
      }
    ],
    notes: 'Medizinischer Anbau für CBD-Extraktion geplant. Plagron-System für CBD-Optimierung.'
  },
  {
    id: '5',
    name: 'Outdoor Vorbereitung',
    plantName: 'White Widow',
    startDate: '2024-03-01',
    endDate: '2024-10-15',
    stage: 'planning',
    progress: 10,
    tasks: [
      {
        id: '14',
        title: 'Canna Outdoor-Aussaat planen',
        description: 'Aussaat-Termin für Outdoor-Saison festlegen. Canna Terra Professional Plus Erde, pH: 6.0-6.5. Canna Start für Keimlinge vorbereiten.',
        dueDate: '2024-01-22T09:00:00',
        completed: false,
        priority: 'high',
        category: 'other'
      },
      {
        id: '15',
        title: 'Outdoor-Standort mit Canna-System',
        description: 'Optimalen Outdoor-Standort finden. Canna Terra Vega für vegetative Phase, Canna Terra Flores für Blüte. Wetterresistente Dosierung.',
        dueDate: '2024-01-25T14:00:00',
        completed: false,
        priority: 'medium',
        category: 'other'
      },
      {
        id: '16',
        title: 'Canna Outdoor-Equipment prüfen',
        description: 'Canna Terra Professional Plus 50L, Canna Vega 1L, Canna Flores 1L, Canna Boost 1L. Outdoor-optimierte Dosierung: 50% der Indoor-Werte.',
        dueDate: '2024-01-28T11:00:00',
        completed: false,
        priority: 'low',
        category: 'other'
      }
    ],
    notes: 'Outdoor-Saison 2024 vorbereiten. White Widow für optimales Klima. Canna-System für Outdoor-Performance.'
  }
]

// Mock-Wachstumsphasen
export const mockGrowthPhases: GrowthPhase[] = [
  {
    id: '1',
    cycleId: '1',
    stage: 'seedling',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    notes: 'Keimlingsphase: 18/6 Lichtzyklus, hohe Luftfeuchtigkeit (70-80%), Temperatur 22-24°C',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  {
    id: '2',
    cycleId: '1',
    stage: 'vegetative',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    notes: 'Vegetative Phase: 18/6 Lichtzyklus, LST-Training, Nährstoffe erhöhen',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  {
    id: '3',
    cycleId: '1',
    stage: 'flowering',
    startDate: '2024-02-16',
    endDate: '2024-04-15',
    notes: 'Blütephase: 12/12 Lichtzyklus, Blüte-Nährstoffe, Trichome überwachen',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  {
    id: '4',
    cycleId: '2',
    stage: 'vegetative',
    startDate: '2024-01-15',
    endDate: '2024-03-01',
    notes: 'Vegetative Phase für Northern Lights: Kompaktes Wachstum fördern',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  {
    id: '5',
    cycleId: '2',
    stage: 'flowering',
    startDate: '2024-03-02',
    endDate: '2024-05-01',
    notes: 'Blütephase: Northern Lights benötigt 8-9 Wochen Blütezeit',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  }
]

// Mock-Kalender-Notizen
export const mockCalendarNotes: CalendarNote[] = [
  {
    id: '1',
    date: '2024-01-16',
    title: 'pH-Wert prüfen',
    content: 'pH-Wert des Wassers auf 6.2-6.5 einstellen. Plagron pH-Plus/Min verwenden.',
    color: 'blue',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00'
  },
  {
    id: '2',
    date: '2024-01-18',
    title: 'Lichtzyklus anpassen',
    content: 'Für Blüte auf 12/12 Lichtzyklus umstellen. Timer überprüfen.',
    color: 'yellow',
    priority: 'medium',
    createdAt: '2024-01-15T14:30:00',
    updatedAt: '2024-01-15T14:30:00'
  },
  {
    id: '3',
    date: '2024-01-20',
    title: 'Ventilator reinigen',
    content: 'Ventilator und Filter reinigen. Luftzirkulation optimieren.',
    color: 'green',
    priority: 'low',
    createdAt: '2024-01-15T16:00:00',
    updatedAt: '2024-01-15T16:00:00'
  },
  {
    id: '4',
    date: '2024-01-22',
    title: 'Ernte vorbereiten',
    content: 'Ernte-Equipment vorbereiten. Scheren reinigen, Handschuhe bereitstellen.',
    color: 'purple',
    priority: 'high',
    createdAt: '2024-01-15T18:00:00',
    updatedAt: '2024-01-15T18:00:00'
  }
]

// Hilfsfunktionen für die Kalenderansicht
export const getStageColor = (stage: string) => {
  switch (stage) {
    case 'planning': return 'bg-gray-500'
    case 'seedling': return 'bg-blue-500'
    case 'vegetative': return 'bg-green-500'
    case 'flowering': return 'bg-purple-500'
    case 'harvest': return 'bg-yellow-500'
    case 'completed': return 'bg-green-600'
    default: return 'bg-gray-500'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'border-green-500'
    case 'medium': return 'border-yellow-500'
    case 'high': return 'border-red-500'
    default: return 'border-gray-500'
  }
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'watering': return '💧'
    case 'nutrients': return '🌿'
    case 'pruning': return '✂️'
    case 'monitoring': return '📊'
    case 'other': return '📝'
    default: return '📋'
  }
}

export const getStageName = (stage: string) => {
  switch (stage) {
    case 'planning': return 'Planung'
    case 'seedling': return 'Keimling'
    case 'vegetative': return 'Vegetativ'
    case 'flowering': return 'Blüte'
    case 'harvest': return 'Ernte'
    case 'completed': return 'Abgeschlossen'
    default: return stage
  }
}
