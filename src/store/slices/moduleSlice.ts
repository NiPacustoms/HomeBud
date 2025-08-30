import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { 
  Module, 
  FeatureFlags, 
  ModuleSettings, 
  AVAILABLE_MODULES,
  DEFAULT_MODULES,
  checkModuleDependencies,
  resolveModuleDependencies
} from '../../types/modules'

export interface ModuleState {
  availableModules: Module[]
  enabledModules: string[]
  moduleSettings: ModuleSettings[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

const initialState: ModuleState = {
  availableModules: AVAILABLE_MODULES,
  enabledModules: DEFAULT_MODULES.map(module => module.id),
  moduleSettings: [],
  isLoading: false,
  error: null,
  lastUpdated: null
}

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    // Module aktivieren/deaktivieren
    toggleModule: (state, action: PayloadAction<string>) => {
      const moduleId = action.payload
      const module = state.availableModules.find(m => m.id === moduleId)
      
      if (!module) return

      const isCurrentlyEnabled = state.enabledModules.includes(moduleId)
      
      if (isCurrentlyEnabled) {
        // Modul deaktivieren
        if (module.isDefault) {
          // Standard-Module können nicht deaktiviert werden
          return
        }
        
        // Alle abhängigen Module deaktivieren
        const dependentModules = state.availableModules.filter(m => 
          m.dependencies.includes(moduleId)
        )
        
        state.enabledModules = state.enabledModules.filter(id => 
          id !== moduleId && !dependentModules.some(m => m.id === id)
        )
      } else {
        // Modul aktivieren
        const dependencyCheck = checkModuleDependencies(moduleId, state.enabledModules)
        
        if (dependencyCheck.isValid) {
          state.enabledModules.push(moduleId)
        } else {
          // Fehler setzen, wenn Abhängigkeiten fehlen
          state.error = `Modul "${module.name}" benötigt: ${dependencyCheck.missingDependencies.join(', ')}`
          return
        }
      }
      
      state.lastUpdated = new Date()
      state.error = null
    },

    // Mehrere Module gleichzeitig aktivieren
    enableModules: (state, action: PayloadAction<string[]>) => {
      const moduleIds = action.payload
      const modulesToEnable: string[] = []
      const errors: string[] = []

      // Alle Module auf Abhängigkeiten prüfen
      moduleIds.forEach(moduleId => {
        const dependencyCheck = checkModuleDependencies(moduleId, state.enabledModules)
        if (dependencyCheck.isValid) {
          modulesToEnable.push(moduleId)
        } else {
          const module = state.availableModules.find(m => m.id === moduleId)
          errors.push(`${module?.name}: ${dependencyCheck.missingDependencies.join(', ')}`)
        }
      })

      if (errors.length > 0) {
        state.error = `Fehler beim Aktivieren: ${errors.join('; ')}`
        return
      }

      // Module aktivieren
      modulesToEnable.forEach(moduleId => {
        if (!state.enabledModules.includes(moduleId)) {
          state.enabledModules.push(moduleId)
        }
      })

      state.lastUpdated = new Date()
      state.error = null
    },

    // Mehrere Module gleichzeitig deaktivieren
    disableModules: (state, action: PayloadAction<string[]>) => {
      const moduleIds = action.payload
      
      moduleIds.forEach(moduleId => {
        const module = state.availableModules.find(m => m.id === moduleId)
        if (module && !module.isDefault) {
          // Alle abhängigen Module deaktivieren
          const dependentModules = state.availableModules.filter(m => 
            m.dependencies.includes(moduleId)
          )
          
          state.enabledModules = state.enabledModules.filter(id => 
            id !== moduleId && !dependentModules.some(m => m.id === id)
          )
        }
      })

      state.lastUpdated = new Date()
      state.error = null
    },

    // Alle Module zurücksetzen
    resetModules: (state) => {
      state.enabledModules = DEFAULT_MODULES.map(module => module.id)
      state.moduleSettings = []
      state.lastUpdated = new Date()
      state.error = null
    },

    // Module-Einstellungen aktualisieren
    updateModuleSettings: (state, action: PayloadAction<ModuleSettings>) => {
      const { moduleId, settings } = action.payload
      const existingIndex = state.moduleSettings.findIndex(ms => ms.moduleId === moduleId)
      
      if (existingIndex !== -1) {
        state.moduleSettings[existingIndex].settings = {
          ...state.moduleSettings[existingIndex].settings,
          ...settings
        }
      } else {
        state.moduleSettings.push(action.payload)
      }
      
      state.lastUpdated = new Date()
    },

    // Module-Einstellungen löschen
    clearModuleSettings: (state, action: PayloadAction<string>) => {
      state.moduleSettings = state.moduleSettings.filter(ms => ms.moduleId !== action.payload)
      state.lastUpdated = new Date()
    },

    // Alle Module-Einstellungen löschen
    clearAllModuleSettings: (state) => {
      state.moduleSettings = []
      state.lastUpdated = new Date()
    },

    // Feature-Flags aus externer Quelle laden (z.B. Firestore)
    loadFeatureFlags: (state, action: PayloadAction<FeatureFlags>) => {
      const featureFlags = action.payload
      
      // Alle Module entsprechend der Feature-Flags aktivieren/deaktivieren
      state.enabledModules = Object.entries(featureFlags)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([moduleId, _]) => moduleId)
      
      state.lastUpdated = new Date()
      state.error = null
    },

    // Feature-Flags in externes Format exportieren
    exportFeatureFlags: (state) => {
      const featureFlags: FeatureFlags = {}
      state.availableModules.forEach(module => {
        featureFlags[module.id] = state.enabledModules.includes(module.id)
      })
      // Redux reducers sollten den State ändern, nicht Werte zurückgeben
      // Die Feature-Flags werden über einen Selector verfügbar gemacht
    },

    // Loading-Status setzen
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Fehler setzen
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Fehler löschen
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  toggleModule,
  enableModules,
  disableModules,
  resetModules,
  updateModuleSettings,
  clearModuleSettings,
  clearAllModuleSettings,
  loadFeatureFlags,
  exportFeatureFlags,
  setLoading,
  setError,
  clearError
} = moduleSlice.actions

// Selectors
export const selectAvailableModules = (state: { modules: ModuleState }) => 
  state.modules.availableModules

export const selectEnabledModules = (state: { modules: ModuleState }) => 
  state.modules.enabledModules

export const selectModuleSettings = (state: { modules: ModuleState }) => 
  state.modules.moduleSettings

export const selectModuleById = (state: { modules: ModuleState }, moduleId: string) =>
  state.modules.availableModules.find(m => m.id === moduleId)

export const selectEnabledModuleById = (state: { modules: ModuleState }, moduleId: string) =>
  state.modules.enabledModules.includes(moduleId)

export const selectModulesByCategory = (state: { modules: ModuleState }, category: string) =>
  state.modules.availableModules.filter(m => m.category === category)

export const selectEnabledModulesByCategory = (state: { modules: ModuleState }, category: string) =>
  state.modules.availableModules.filter(m => 
    m.category === category && state.modules.enabledModules.includes(m.id)
  )

export const selectModuleDependencies = (state: { modules: ModuleState }, moduleId: string) => {
  const module = state.modules.availableModules.find(m => m.id === moduleId)
  if (!module) return []
  
  return module.dependencies.map(depId => 
    state.modules.availableModules.find(m => m.id === depId)
  ).filter(Boolean)
}

export const selectModuleDependents = (state: { modules: ModuleState }, moduleId: string) =>
  state.modules.availableModules.filter(m => m.dependencies.includes(moduleId))

export const selectIsLoading = (state: { modules: ModuleState }) => 
  state.modules.isLoading

export const selectError = (state: { modules: ModuleState }) => 
  state.modules.error

export const selectLastUpdated = (state: { modules: ModuleState }) => 
  state.modules.lastUpdated

export default moduleSlice.reducer
