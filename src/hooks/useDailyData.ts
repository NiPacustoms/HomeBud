import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { addDailyDataEntry, updateDailyDataEntry, removeDailyDataEntry, DailyDataEntry } from '../store/slices/monitoringSlice'

export const useDailyData = () => {
  const dispatch = useDispatch()
  const { dailyDataEntries, isLoading, error } = useSelector(
    (state: RootState) => state.monitoring
  )

  const addEntry = (entry: Omit<DailyDataEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DailyDataEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    dispatch(addDailyDataEntry(newEntry))
  }

  const updateEntry = (id: string, updates: Partial<DailyDataEntry>) => {
    dispatch(updateDailyDataEntry({ id, updates }))
  }

  const removeEntry = (id: string) => {
    dispatch(removeDailyDataEntry(id))
  }

  const getLastEntry = () => {
    if (dailyDataEntries.length === 0) return null
    return dailyDataEntries[dailyDataEntries.length - 1]
  }

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return dailyDataEntries.filter((entry: DailyDataEntry) => 
      entry.date >= startDate && entry.date <= endDate
    )
  }

  const getEntriesByProject = (projectId: string) => {
    return dailyDataEntries.filter((entry: DailyDataEntry) => entry.projectId === projectId)
  }

  const getTodayEntry = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return dailyDataEntries.find(entry => 
      entry.date >= today && entry.date < tomorrow
    )
  }

  const getWeeklyAverage = (projectId?: string) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const entries = projectId 
      ? getEntriesByProject(projectId).filter(entry => entry.date >= weekAgo)
      : dailyDataEntries.filter(entry => entry.date >= weekAgo)

    if (entries.length === 0) return null

    const sum = entries.reduce((acc: {
      temperature: number;
      humidity: number;
      lightLevel: number;
      ph: number;
      ec: number;
      co2: number;
      airFlow: number;
      soilMoisture: number;
      nutrientLevel: number;
    }, entry: DailyDataEntry) => ({
      temperature: acc.temperature + entry.temperature,
      humidity: acc.humidity + entry.humidity,
      lightLevel: acc.lightLevel + entry.lightLevel,
      ph: acc.ph + entry.ph,
      ec: acc.ec + entry.ec,
      co2: acc.co2 + (entry.co2 || 0),
      airFlow: acc.airFlow + (entry.airFlow || 0),
      soilMoisture: acc.soilMoisture + (entry.soilMoisture || 0),
      nutrientLevel: acc.nutrientLevel + (entry.nutrientLevel || 0),
    }), {
      temperature: 0,
      humidity: 0,
      lightLevel: 0,
      ph: 0,
      ec: 0,
      co2: 0,
      airFlow: 0,
      soilMoisture: 0,
      nutrientLevel: 0,
    })

    const count = entries.length
    return {
      temperature: sum.temperature / count,
      humidity: sum.humidity / count,
      lightLevel: sum.lightLevel / count,
      ph: sum.ph / count,
      ec: sum.ec / count,
      co2: sum.co2 / count,
      airFlow: sum.airFlow / count,
      soilMoisture: sum.soilMoisture / count,
      nutrientLevel: sum.nutrientLevel / count,
    }
  }

  return {
    dailyDataEntries,
    isLoading,
    error,
    addEntry,
    updateEntry,
    removeEntry,
    getLastEntry,
    getEntriesByDateRange,
    getEntriesByProject,
    getTodayEntry,
    getWeeklyAverage
  }
}
