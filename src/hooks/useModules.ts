import { useCallback } from 'react'
import { useAppSelector } from '../store/store'
import {
  selectAvailableModules,
  selectEnabledModules,
  selectModuleSettings,
  selectIsLoading,
  selectError,
  selectLastUpdated
} from '../store/slices/moduleSlice'
import { Module } from '../types/modules'

export const useModules = () => {
  // State Selectors
  const availableModules = useAppSelector(selectAvailableModules)
  const enabledModules = useAppSelector(selectEnabledModules)
  const moduleSettings = useAppSelector(selectModuleSettings)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const lastUpdated = useAppSelector(selectLastUpdated)

  // Module Actions
  const toggleModuleById = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const enableModulesByIds = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const disableModulesByIds = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const resetAllModules = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  // Module Settings Actions
  const updateSettings = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const clearSettings = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const clearAllSettings = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  // Feature Flags Actions
  const loadFlags = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const exportFlags = useCallback(() => {
    // Temporär deaktiviert
    return undefined
  }, [])

  // Utility Actions
  const setLoadingState = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const setErrorMessage = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  const clearErrorMessage = useCallback(() => {
    // Temporär deaktiviert
  }, [])

  // Helper Functions
  const getModuleById = useCallback((moduleId: string) => {
    return availableModules.find((m: Module) => m.id === moduleId)
  }, [availableModules])

  const isModuleEnabled = useCallback((moduleId: string) => {
    return enabledModules.includes(moduleId)
  }, [enabledModules])

  const getModulesByCategory = useCallback((category: string) => {
    return availableModules.filter((m: Module) => m.category === category)
  }, [availableModules])

  const getEnabledModulesByCategory = useCallback((category: string) => {
    return availableModules.filter((m: Module) => 
      m.category === category && enabledModules.includes(m.id)
    )
  }, [availableModules, enabledModules])

  const getModuleDependencies = useCallback((moduleId: string) => {
    const module = availableModules.find((m: Module) => m.id === moduleId)
    if (!module) return []
    
    return module.dependencies.map((depId: string) => 
      availableModules.find((m: Module) => m.id === depId)
    ).filter(Boolean) as Module[]
  }, [availableModules])

  const getModuleDependents = useCallback((moduleId: string) => {
    return availableModules.filter((m: Module) => m.dependencies.includes(moduleId))
  }, [availableModules])

  const getModuleSettings = useCallback((moduleId: string) => {
    const settings = moduleSettings.find((ms: { moduleId: string; settings: Record<string, any> }) => ms.moduleId === moduleId)
    return settings?.settings || {}
  }, [moduleSettings])

  const canEnableModule = useCallback((moduleId: string) => {
    const module = availableModules.find((m: Module) => m.id === moduleId)
    if (!module) return false
    
    // Standard-Module sind immer aktivierbar
    if (module.isDefault) return true
    
    // Prüfen, ob alle Abhängigkeiten erfüllt sind
    const missingDependencies = module.dependencies.filter(
      (dep: string) => !enabledModules.includes(dep)
    )
    
    return missingDependencies.length === 0
  }, [availableModules, enabledModules])

  const getMissingDependencies = useCallback((moduleId: string) => {
    const module = availableModules.find((m: Module) => m.id === moduleId)
    if (!module) return []
    
    return module.dependencies.filter((dep: string) => !enabledModules.includes(dep))
  }, [availableModules, enabledModules])

  const getEnabledModulesCount = useCallback(() => {
    return enabledModules.length
  }, [enabledModules])

  const getTotalModulesCount = useCallback(() => {
    return availableModules.length
  }, [availableModules])

  const getPremiumModulesCount = useCallback(() => {
    return availableModules.filter((m: Module) => m.isPremium).length
  }, [availableModules])

  const getEnabledPremiumModulesCount = useCallback(() => {
    return availableModules.filter((m: Module) => 
      m.isPremium && enabledModules.includes(m.id)
    ).length
  }, [availableModules, enabledModules])

  return {
    // State
    availableModules,
    enabledModules,
    moduleSettings,
    isLoading,
    error,
    lastUpdated,

    // Actions
    toggleModule: toggleModuleById,
    enableModules: enableModulesByIds,
    disableModules: disableModulesByIds,
    resetModules: resetAllModules,
    updateModuleSettings: updateSettings,
    clearModuleSettings: clearSettings,
    clearAllModuleSettings: clearAllSettings,
    loadFeatureFlags: loadFlags,
    exportFeatureFlags: exportFlags,
    setLoading: setLoadingState,
    setError: setErrorMessage,
    clearError: clearErrorMessage,

    // Helper Functions
    getModuleById,
    isModuleEnabled,
    getModulesByCategory,
    getEnabledModulesByCategory,
    getModuleDependencies,
    getModuleDependents,
    getModuleSettings,
    canEnableModule,
    getMissingDependencies,
    getEnabledModulesCount,
    getTotalModulesCount,
    getPremiumModulesCount,
    getEnabledPremiumModulesCount
  }
}
