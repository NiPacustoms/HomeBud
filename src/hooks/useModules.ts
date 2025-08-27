import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import {
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
  clearError,
  selectAvailableModules,
  selectEnabledModules,
  selectModuleSettings,
  selectModuleById,
  selectEnabledModuleById,
  selectModulesByCategory,
  selectEnabledModulesByCategory,
  selectModuleDependencies,
  selectModuleDependents,
  selectIsLoading,
  selectError,
  selectLastUpdated
} from '../store/slices/moduleSlice'
import { Module, ModuleSettings, FeatureFlags } from '../types/modules'

export const useModules = () => {
  const dispatch = useAppDispatch()

  // State Selectors
  const availableModules = useAppSelector(selectAvailableModules)
  const enabledModules = useAppSelector(selectEnabledModules)
  const moduleSettings = useAppSelector(selectModuleSettings)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const lastUpdated = useAppSelector(selectLastUpdated)

  // Module Actions
  const toggleModuleById = useCallback((moduleId: string) => {
    dispatch(toggleModule(moduleId))
  }, [dispatch])

  const enableModulesByIds = useCallback((moduleIds: string[]) => {
    dispatch(enableModules(moduleIds))
  }, [dispatch])

  const disableModulesByIds = useCallback((moduleIds: string[]) => {
    dispatch(disableModules(moduleIds))
  }, [dispatch])

  const resetAllModules = useCallback(() => {
    dispatch(resetModules())
  }, [dispatch])

  // Module Settings Actions
  const updateSettings = useCallback((moduleId: string, settings: Record<string, any>) => {
    dispatch(updateModuleSettings({ moduleId, settings }))
  }, [dispatch])

  const clearSettings = useCallback((moduleId: string) => {
    dispatch(clearModuleSettings(moduleId))
  }, [dispatch])

  const clearAllSettings = useCallback(() => {
    dispatch(clearAllModuleSettings())
  }, [dispatch])

  // Feature Flags Actions
  const loadFlags = useCallback((featureFlags: FeatureFlags) => {
    dispatch(loadFeatureFlags(featureFlags))
  }, [dispatch])

  const exportFlags = useCallback(() => {
    return dispatch(exportFeatureFlags())
  }, [dispatch])

  // Utility Actions
  const setLoadingState = useCallback((isLoading: boolean) => {
    dispatch(setLoading(isLoading))
  }, [dispatch])

  const setErrorMessage = useCallback((error: string | null) => {
    dispatch(setError(error))
  }, [dispatch])

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Helper Functions
  const getModuleById = useCallback((moduleId: string) => {
    return availableModules.find(m => m.id === moduleId)
  }, [availableModules])

  const isModuleEnabled = useCallback((moduleId: string) => {
    return enabledModules.includes(moduleId)
  }, [enabledModules])

  const getModulesByCategory = useCallback((category: string) => {
    return availableModules.filter(m => m.category === category)
  }, [availableModules])

  const getEnabledModulesByCategory = useCallback((category: string) => {
    return availableModules.filter(m => 
      m.category === category && enabledModules.includes(m.id)
    )
  }, [availableModules, enabledModules])

  const getModuleDependencies = useCallback((moduleId: string) => {
    const module = availableModules.find(m => m.id === moduleId)
    if (!module) return []
    
    return module.dependencies.map(depId => 
      availableModules.find(m => m.id === depId)
    ).filter(Boolean) as Module[]
  }, [availableModules])

  const getModuleDependents = useCallback((moduleId: string) => {
    return availableModules.filter(m => m.dependencies.includes(moduleId))
  }, [availableModules])

  const getModuleSettings = useCallback((moduleId: string) => {
    const settings = moduleSettings.find(ms => ms.moduleId === moduleId)
    return settings?.settings || {}
  }, [moduleSettings])

  const canEnableModule = useCallback((moduleId: string) => {
    const module = availableModules.find(m => m.id === moduleId)
    if (!module) return false
    
    // Standard-Module sind immer aktivierbar
    if (module.isDefault) return true
    
    // Prüfen, ob alle Abhängigkeiten erfüllt sind
    const missingDependencies = module.dependencies.filter(
      dep => !enabledModules.includes(dep)
    )
    
    return missingDependencies.length === 0
  }, [availableModules, enabledModules])

  const getMissingDependencies = useCallback((moduleId: string) => {
    const module = availableModules.find(m => m.id === moduleId)
    if (!module) return []
    
    return module.dependencies.filter(dep => !enabledModules.includes(dep))
  }, [availableModules, enabledModules])

  const getEnabledModulesCount = useCallback(() => {
    return enabledModules.length
  }, [enabledModules])

  const getTotalModulesCount = useCallback(() => {
    return availableModules.length
  }, [availableModules])

  const getPremiumModulesCount = useCallback(() => {
    return availableModules.filter(m => m.isPremium).length
  }, [availableModules])

  const getEnabledPremiumModulesCount = useCallback(() => {
    return availableModules.filter(m => 
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
