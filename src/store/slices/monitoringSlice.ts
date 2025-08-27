import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface SensorData {
  id: string
  projectId: string
  timestamp: Date
  temperature: number
  humidity: number
  lightLevel: number
  ph: number
  ec: number
  co2: number
  airFlow: number
  soilMoisture?: number
  nutrientLevel?: number
}

export interface DailyDataEntry {
  id: string
  projectId: string
  date: Date
  temperature: number
  humidity: number
  lightLevel: number
  ph: number
  ec: number
  co2?: number
  airFlow?: number
  soilMoisture?: number
  nutrientLevel?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  projectId: string
  type: 'temperature' | 'humidity' | 'light' | 'ph' | 'ec' | 'co2' | 'airflow' | 'moisture' | 'nutrient' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  value?: number
  threshold?: number
  isRead: boolean
  createdAt: Date
  resolvedAt?: Date
}

export interface MonitoringSettings {
  projectId: string
  alerts: {
    temperature: { min: number; max: number; enabled: boolean }
    humidity: { min: number; max: number; enabled: boolean }
    lightLevel: { min: number; max: number; enabled: boolean }
    ph: { min: number; max: number; enabled: boolean }
    ec: { min: number; max: number; enabled: boolean }
    co2: { min: number; max: number; enabled: boolean }
    airFlow: { min: number; max: number; enabled: boolean }
    soilMoisture: { min: number; max: number; enabled: boolean }
    nutrientLevel: { min: number; max: number; enabled: boolean }
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dataRetention: number // days
  updateInterval: number // seconds
}

interface MonitoringState {
  sensorData: SensorData[]
  dailyDataEntries: DailyDataEntry[]
  alerts: Alert[]
  settings: MonitoringSettings[]
  currentProjectData: SensorData[]
  isLoading: boolean
  error: string | null
  isConnected: boolean
  lastUpdate: Date | null
  filters: {
    timeRange: '1h' | '6h' | '24h' | '7d' | '30d'
    sensors: string[]
  }
}

const initialState: MonitoringState = {
  sensorData: [],
  dailyDataEntries: [],
  alerts: [],
  settings: [],
  currentProjectData: [],
  isLoading: false,
  error: null,
  isConnected: false,
  lastUpdate: null,
  filters: {
    timeRange: '24h',
    sensors: [],
  },
}

// Async thunks
export const fetchSensorData = createAsyncThunk(
  'monitoring/fetchSensorData',
  async ({ projectId, timeRange }: { projectId: string; timeRange: string }) => {
    // TODO: Implement API call
    return []
  }
)

export const fetchAlerts = createAsyncThunk(
  'monitoring/fetchAlerts',
  async (projectId: string) => {
    // TODO: Implement API call
    return []
  }
)

export const markAlertAsRead = createAsyncThunk(
  'monitoring/markAlertAsRead',
  async (alertId: string) => {
    // TODO: Implement API call
    return alertId
  }
)

export const resolveAlert = createAsyncThunk(
  'monitoring/resolveAlert',
  async (alertId: string) => {
    // TODO: Implement API call
    return alertId
  }
)

export const updateMonitoringSettings = createAsyncThunk(
  'monitoring/updateSettings',
  async (settings: Partial<MonitoringSettings> & { projectId: string }) => {
    // TODO: Implement API call
    return settings
  }
)

export const connectToSensors = createAsyncThunk(
  'monitoring/connectToSensors',
  async (projectId: string) => {
    // TODO: Implement WebSocket connection
    return true
  }
)

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    addSensorData: (state, action: PayloadAction<SensorData>) => {
      state.sensorData.push(action.payload)
      if (action.payload.projectId === state.currentProjectData[0]?.projectId) {
        state.currentProjectData.push(action.payload)
        // Keep only last 1000 data points for current project
        if (state.currentProjectData.length > 1000) {
          state.currentProjectData = state.currentProjectData.slice(-1000)
        }
      }
      state.lastUpdate = new Date()
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload)
    },
    updateAlert: (state, action: PayloadAction<{ id: string; updates: Partial<Alert> }>) => {
      const { id, updates } = action.payload
      const alertIndex = state.alerts.findIndex(a => a.id === id)
      if (alertIndex !== -1) {
        state.alerts[alertIndex] = { ...state.alerts[alertIndex], ...updates }
      }
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload)
    },
    setCurrentProjectData: (state, action: PayloadAction<SensorData[]>) => {
      state.currentProjectData = action.payload
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<MonitoringState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        timeRange: '24h',
        sensors: [],
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearOldData: (state) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      state.sensorData = state.sensorData.filter(data => data.timestamp > thirtyDaysAgo)
    },
    addDailyDataEntry: (state, action: PayloadAction<DailyDataEntry>) => {
      state.dailyDataEntries.push(action.payload)
    },
    updateDailyDataEntry: (state, action: PayloadAction<{ id: string; updates: Partial<DailyDataEntry> }>) => {
      const { id, updates } = action.payload
      const entryIndex = state.dailyDataEntries.findIndex(entry => entry.id === id)
      if (entryIndex !== -1) {
        state.dailyDataEntries[entryIndex] = { 
          ...state.dailyDataEntries[entryIndex], 
          ...updates, 
          updatedAt: new Date() 
        }
      }
    },
    removeDailyDataEntry: (state, action: PayloadAction<string>) => {
      state.dailyDataEntries = state.dailyDataEntries.filter(entry => entry.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sensor data
      .addCase(fetchSensorData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSensorData.fulfilled, (state, action) => {
        state.isLoading = false
        state.sensorData = action.payload
        state.lastUpdate = new Date()
      })
      .addCase(fetchSensorData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Fehler beim Laden der Sensordaten'
      })
      // Fetch alerts
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload
      })
      // Mark alert as read
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        const alertIndex = state.alerts.findIndex(a => a.id === action.payload)
        if (alertIndex !== -1) {
          state.alerts[alertIndex].isRead = true
        }
      })
      // Resolve alert
      .addCase(resolveAlert.fulfilled, (state, action) => {
        const alertIndex = state.alerts.findIndex(a => a.id === action.payload)
        if (alertIndex !== -1) {
          state.alerts[alertIndex].resolvedAt = new Date()
        }
      })
      // Update settings
      .addCase(updateMonitoringSettings.fulfilled, (state, action) => {
        const { projectId, ...updates } = action.payload
        const settingsIndex = state.settings.findIndex(s => s.projectId === projectId)
        if (settingsIndex !== -1) {
          state.settings[settingsIndex] = { ...state.settings[settingsIndex], ...updates }
        } else {
          state.settings.push({ projectId, ...updates } as MonitoringSettings)
        }
      })
      // Connect to sensors
      .addCase(connectToSensors.fulfilled, (state) => {
        state.isConnected = true
      })
  },
})

export const {
  addSensorData,
  addAlert,
  updateAlert,
  removeAlert,
  setCurrentProjectData,
  setConnectionStatus,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearError,
  clearOldData,
  addDailyDataEntry,
  updateDailyDataEntry,
  removeDailyDataEntry,
} = monitoringSlice.actions

export default monitoringSlice.reducer
