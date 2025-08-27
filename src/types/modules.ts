export interface Module {
  id: string
  name: string
  description: string
  category: ModuleCategory
  isEnabled: boolean
  isDefault: boolean
  isPremium: boolean
  status?: 'available' | 'coming-soon' | 'beta' | 'deprecated'
  dependencies: string[]
  icon: string
  route: string
  component: string
  order: number
  features?: string[] // Neue Features-Liste für detaillierte Beschreibung
}

export type ModuleCategory = 
  | 'core'
  | 'planning'
  | 'monitoring'
  | 'management'
  | 'genetics'
  | 'knowledge'
  | 'harvest'
  | 'analysis'
  | 'premium'
  | 'scientific' // Neue Kategorie für wissenschaftliches Monitoring
  | 'automation' // Neue Kategorie für IoT & Automatisierung
  | 'training'   // Neue Kategorie für Trainings-Assistent
  | 'biological' // Neue Kategorie für biologische Innovationen
  | 'compliance' // Neue Kategorie für Legal & Compliance

export interface ModuleDependency {
  moduleId: string
  required: boolean
  message?: string
}

export interface ModuleSettings {
  moduleId: string
  settings: Record<string, any>
}

export interface FeatureFlags {
  [moduleId: string]: boolean
}

export interface UserModulePreferences {
  userId: string
  featureFlags: FeatureFlags
  moduleSettings: ModuleSettings[]
  lastUpdated: Date
}

// Alle verfügbaren Module
export const AVAILABLE_MODULES: Module[] = [
  // Core Module (immer aktiviert)
  {
    id: 'strain-database',
    name: 'Strain-Datenbank',
    description: 'KI-gestützte Auswahl & Filter, Basis-Daten zu Strains',
    category: 'core',
    isEnabled: true,
    isDefault: true,
    isPremium: false,
    dependencies: [],
    icon: '🌱',
    route: '/plants',
    component: 'PlantList',
    order: 1,
    features: [
      'KI-gestützte Strain-Empfehlung basierend auf Klima, Erfahrungslevel und gewünschten Effekten',
      'Blockchain-Integration für Genetik-Authentizität und Rückverfolgbarkeit',
      'Performance-Dashboard für Strain-Vergleiche mit Community-Daten',
      'Detaillierte Cannabinoid- und Terpen-Profile',
      'Zucht-Assistent für eigene Kreuzungen'
    ]
  },
  {
    id: 'settings-support',
    name: 'Einstellungen & Support',
    description: 'Personalisierung, Datenschutz, Chatbot, mehrsprachige UI',
    category: 'core',
    isEnabled: true,
    isDefault: true,
    isPremium: false,
    dependencies: [],
    icon: '⚙️',
    route: '/settings',
    component: 'Settings',
    order: 2
  },

  // Scientific Monitoring Module
  {
    id: 'scientific-monitoring',
    name: 'Wissenschaftliches Monitoring',
    description: 'PPFD-Steuerung, VPD-Management, pH-Überwachung, CO2-Anreicherung',
    category: 'scientific',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🔬',
    route: '/scientific',
    component: 'ScientificMonitoring',
    order: 3,
    features: [
      'PPFD-Steuerung: Präzise Lichtmessung von 100-1000 μmol/m²/s je Wachstumsphase',
      'VPD-Management: Automatische Berechnung von Vapor Pressure Deficit (0.8-1.6 kPa)',
      'pH-Überwachung: Kontinuierliche Kontrolle für optimalen Bereich (6.0-6.5 für Erde, 5.5-6.0 für Hydro)',
      'CO2-Anreicherung: Steuerung auf 800-1200 ppm in der Blütephase',
      'Spektrale LED-Steuerung mit automatischer Anpassung'
    ]
  },

  // Biological Innovations Modules
  {
    id: 'tissue-culture',
    name: 'Tissue Culture & Wurzel-Optimierung',
    description: 'Geführtes In-vitro-Stecklingsprotokoll mit haushaltsüblichen Hilfsmitteln',
    category: 'biological',
    isEnabled: false,
    isDefault: false,
    isPremium: true,
    dependencies: [],
    icon: '🧬',
    route: '/tissue-culture',
    component: 'TissueCulture',
    order: 1,
    features: [
      'Geführtes In-vitro-Stecklingsprotokoll mit haushaltsüblichen Hilfsmitteln',
      'Einfache sterile Checklisten ohne Profi-Laborgerät',
      'Digitale Klon-Akten mit Status-Tracking',
      'Monitoring und Erinnerungen für Medienwechsel und Umsetzungen',
      'Schritt-für-Schritt-Anleitung für vereinfachte In-vitro-Vermehrung'
    ]
  },
  {
    id: 'mycorrhiza-integration',
    name: 'Mykorrhiza-Integration',
    description: 'Pilzauswahl, Dosierungsrechner, Erfolgs-Monitoring',
    category: 'biological',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🍄',
    route: '/mycorrhiza',
    component: 'MycorrhizaIntegration',
    order: 2,
    features: [
      'Empfehlung zertifizierter Mykorrhiza-Stämme (z.B. Glomus intraradices)',
      'Dosierungsrechner: optimale Sporenmenge je Topfgröße',
      'Einbindungs-Timeline mit Push-Remindern',
      'In-App-Wurzelbewertungsbogen für Dokumentation',
      'Langzeit-Analyse: Ertragsvergleich mit/ohne Mykorrhiza'
    ]
  },
  {
    id: 'trichoderma-application',
    name: 'Trichoderma-Anwendung',
    description: 'Schutz & Wachstum, Kombi-Pakete, integriertes Monitoring',
    category: 'biological',
    isEnabled: false,
    isDefault: false,
    isPremium: true,
    dependencies: ['mycorrhiza-integration'],
    icon: '🛡️',
    route: '/trichoderma',
    component: 'TrichodermaApplication',
    order: 3,
    features: [
      'Auswahl passender Trichoderma-Stämme (z.B. T. harzianum T22)',
      'Kombi-Pakete: Mykorrhiza + Trichoderma für Synergien',
      'Dosisplan pro Wachstumsphase',
      'Fruchtkörper-Detektor: Foto-Upload erkennt Pilzwachstum',
      'Bodenbiologie-Dashboard: EC- und pH-Verlauf mit biologischer Aktivität'
    ]
  },

  // Automation & IoT Module
  {
    id: 'smart-grow-system',
    name: 'Smart-Grow-System',
    description: 'MQTT-Bridge, Edge-Computing, Regelbasierte Automatisierung',
    category: 'automation',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    status: 'coming-soon',
    dependencies: ['scientific-monitoring'],
    icon: '🤖',
    route: '/automation',
    component: 'SmartGrowSystem',
    order: 5,
    features: [
      'MQTT-Bridge: Direkte Verbindung zu ESP32/Raspberry Pi Controllern',
      'Edge-Computing: Lokale KI-Entscheidungen ohne Internet',
      'Regelbasierte Automatisierung: Drag & Drop Interface für Wenn-Dann-Regeln',
      'Multi-Sensor Dashboard: Echtzeit-Überwachung aller Parameter',
      'Automatische Steuerung: Bewässerungssystem mit EC/pH-Anpassung',
      'Klimasteuerung (Temperatur, Luftfeuchte, Ventilation)',
      'Lichtzyklen mit spektraler Anpassung',
      'CO2-Dosierung basierend auf Wachstumsphase'
    ]
  },

  // Training Assistant Module
  {
    id: 'training-assistant',
    name: 'Trainings-Assistent',
    description: 'LST, SCROG, Topping/Fimming, Supercropping, Entlaubung',
    category: 'training',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '✂️',
    route: '/training',
    component: 'TrainingAssistant',
    order: 6,
    features: [
      'LST (Low Stress Training): Schritt-für-Schritt mit optimalem Timing',
      'SCROG (Screen of Green): Netz-Setup und Zweig-Management',
      'Topping/Fimming: Präzise Schnitt-Anleitungen',
      'Supercropping: Stress-Techniken für höhere Erträge',
      'Entlaubung: Wachstumsphasen-spezifische Blattentfernung'
    ]
  },

  // KI-Diagnose Module
  {
    id: 'ai-diagnosis',
    name: 'KI-Diagnose & Troubleshooting',
    description: 'Foto-basierte Diagnose mit 92-94% Genauigkeit',
    category: 'management',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🔍',
    route: '/diagnose',
    component: 'AIDiagnosis',
    order: 7,
    features: [
      '92-94% Genauigkeit bei Schädlings-/Krankheitserkennung',
      'Nährstoffmangel-Identifikation durch Blattanalyse',
      'Automatische Behandlungsvorschläge',
      'Verlaufs-Dokumentation mit Foto-Timeline'
    ]
  },

  // Scientific Fertilizer Plan Module
  {
    id: 'scientific-fertilizer',
    name: 'Wissenschaftlicher Düngeplan',
    description: 'Präzise Nährstoffsteuerung mit NPK-Verhältnissen je Wachstumsphase',
    category: 'management',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🌿',
    route: '/fertilizer',
    component: 'ScientificFertilizer',
    order: 8,
    features: [
      'Frühe Vegetation: 2:1:2 NPK-Verhältnis',
      'Mittlere Vegetation: 10:5:7 NPK-Verhältnis',
      'Späte Vegetation: 7:7:7 NPK-Verhältnis',
      'Blüte Woche 1-2: 5:7:10 NPK-Verhältnis',
      'Blüte Mitte: 6:10:15 NPK-Verhältnis',
      'Blüte Ende: 4:7:10 NPK-Verhältnis'
    ]
  },

  // Harvest Optimization Module
  {
    id: 'harvest-optimization',
    name: 'Ernte-Optimierung',
    description: 'Trichom-Analyse per KI, dynamische Ernteschätzung, Curing-Assistent',
    category: 'harvest',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: ['ai-diagnosis'],
    icon: '🌾',
    route: '/harvest',
    component: 'HarvestOptimization',
    order: 9,
    features: [
      'Trichom-Analyse per KI (ohne AR - direkte Foto-Analyse)',
      'Dynamische Ernteschätzung basierend auf Strain und Bedingungen',
      'Trocknungs-Umgebung-Monitoring (18-20°C, 50-60% rF)',
      'Curing-Assistent mit täglichen Erinnerungen'
    ]
  },

  // Legal & Compliance Module
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance',
    description: 'CanG-konforme Rechtssicherheit, Bundesland-spezifische Gesetze',
    category: 'compliance',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '⚖️',
    route: '/compliance',
    component: 'LegalCompliance',
    order: 10,
    features: [
      'Bundesland-spezifische Cannabis-Gesetze',
      'Automatische Updates bei Rechtsänderungen',
      'Blockchain-Dokumentation für Cannabis Social Clubs',
      'Anonyme Protokollierung für Behörden',
      'Export-Funktionen für offizielle Nachweise'
    ]
  },

  // Planning Module
  {
    id: 'setup-wizard',
    name: 'Setup-Assistent',
    description: 'Wizard für Standort, Beleuchtung, Substrate',
    category: 'planning',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🏗️',
    route: '/setup',
    component: 'SetupWizard',
    order: 11
  },
  {
    id: 'budget-planner',
    name: 'Budget- & Einkaufsplaner',
    description: 'Kostenkalkulation, Einkaufsliste, Affiliate-Links',
    category: 'planning',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '💰',
    route: '/budget',
    component: 'BudgetPlanner',
    order: 12
  },
  {
    id: 'planting-schedule',
    name: 'Pflanzplan & Erinnerungen',
    description: 'KI-Ernte-Zeitpläne, Wetter-Integration, Push-Notifications',
    category: 'planning',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '📅',
    route: '/planner',
    component: 'PlantingPlanner',
    order: 13
  },

  // Monitoring Module
  {
    id: 'multi-sensor-monitoring',
    name: 'Multi-Sensor Monitoring',
    description: 'Live-Dashboard (Temp, CO₂, pH, EC, Licht), Heatmaps',
    category: 'monitoring',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '📊',
    route: '/monitoring',
    component: 'MonitoringDashboard',
    order: 14
  },

  // Management Module
  {
    id: 'photo-diary',
    name: 'Foto-Tagebuch & KI-Diagnose',
    description: 'Bild-Upload, Schädlings- und Mangel-Erkennung, Handlungsempfehlungen',
    category: 'management',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '📸',
    route: '/diary',
    component: 'PhotoDiary',
    order: 15
  },
  {
    id: 'todo-tutorials',
    name: 'To-Do-Listen & Tutorials',
    description: 'Smarte Task-Listen, Video-/AR-Tutorials (Setup, Pflege)',
    category: 'management',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '✅',
    route: '/todos',
    component: 'TodoTutorials',
    order: 16
  },

  // Genetics Module
  {
    id: 'strain-collection',
    name: 'Strain-Collection & Vergleich',
    description: 'Performance-Dashboard, Community-Daten-Vergleich',
    category: 'genetics',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: ['strain-database'],
    icon: '🧬',
    route: '/strains',
    component: 'StrainCollection',
    order: 17
  },

  // Knowledge Module
  {
    id: 'knowledge-community',
    name: 'Wissen & Community',
    description: 'AI-kuratierter Feed, Foren, Mentoren-Matching',
    category: 'knowledge',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: [],
    icon: '🧠',
    route: '/knowledge',
    component: 'KnowledgeCommunity',
    order: 18
  },

  // Analysis Module
  {
    id: 'analysis-export',
    name: 'Analyse & Export',
    description: 'KPI-Dashboards, Benchmarking, PDF/CSV-Export',
    category: 'analysis',
    isEnabled: false,
    isDefault: false,
    isPremium: false,
    dependencies: ['multi-sensor-monitoring', 'planting-schedule', 'todo-tutorials'],
    icon: '📈',
    route: '/analysis',
    component: 'AnalysisExport',
    order: 19
  },

  // Premium Module
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    description: 'Sprachgesteuerte Bedienung der App',
    category: 'premium',
    isEnabled: false,
    isDefault: false,
    isPremium: true,
    dependencies: [],
    icon: '🎤',
    route: '/voice',
    component: 'VoiceAssistant',
    order: 20
  },
  {
    id: 'grow-simulator',
    name: 'Grow-Simulator',
    description: '3D-Simulation verschiedener Grow-Setups',
    category: 'premium',
    isEnabled: false,
    isDefault: false,
    isPremium: true,
    dependencies: [],
    icon: '🎮',
    route: '/simulator',
    component: 'GrowSimulator',
    order: 21
  },
  {
    id: 'blockchain-export',
    name: 'Blockchain-Export',
    description: 'Sichere Dokumentation auf der Blockchain',
    category: 'premium',
    isEnabled: false,
    isDefault: false,
    isPremium: true,
    dependencies: [],
    icon: '🔗',
    route: '/blockchain',
    component: 'BlockchainExport',
    order: 22
  }
]

// Module nach Kategorien gruppieren
export const MODULES_BY_CATEGORY = AVAILABLE_MODULES.reduce((acc, module) => {
  if (!acc[module.category]) {
    acc[module.category] = []
  }
  acc[module.category].push(module)
  return acc
}, {} as Record<ModuleCategory, Module[]>)

// Standard-Module (immer aktiviert)
export const DEFAULT_MODULES = AVAILABLE_MODULES.filter(module => module.isDefault)

// Premium-Module
export const PREMIUM_MODULES = AVAILABLE_MODULES.filter(module => module.isPremium)

// Module-Abhängigkeiten prüfen
export function checkModuleDependencies(
  moduleId: string, 
  enabledModules: string[]
): { isValid: boolean; missingDependencies: string[] } {
  const module = AVAILABLE_MODULES.find(m => m.id === moduleId)
  if (!module) {
    return { isValid: false, missingDependencies: [] }
  }

  const missingDependencies = module.dependencies.filter(
    dep => !enabledModules.includes(dep)
  )

  return {
    isValid: missingDependencies.length === 0,
    missingDependencies
  }
}

// Alle Abhängigkeiten für ein Modul auflösen
export function resolveModuleDependencies(
  moduleId: string, 
  enabledModules: string[]
): string[] {
  const module = AVAILABLE_MODULES.find(m => m.id === moduleId)
  if (!module) return []

  const allDependencies = new Set<string>()
  
  function addDependencies(modId: string) {
    const mod = AVAILABLE_MODULES.find(m => m.id === modId)
    if (!mod) return
    
    mod.dependencies.forEach(dep => {
      if (!allDependencies.has(dep)) {
        allDependencies.add(dep)
        addDependencies(dep)
      }
    })
  }

  addDependencies(moduleId)
  return Array.from(allDependencies)
}
