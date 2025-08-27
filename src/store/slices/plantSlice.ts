import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Plant, PlantLog, PlantTask, PlantStage, LogAction } from '@/types/plant'

interface PlantState {
  plants: Plant[]
  currentPlant: Plant | null
  loading: boolean
  error: string | null
  filters: {
    stage: PlantStage | 'all'
    search: string
  }
}

const initialState: PlantState = {
  plants: [],
  currentPlant: null,
  loading: false,
  error: null,
  filters: {
    stage: 'all',
    search: ''
  }
}

// Async Thunks
export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async () => {
    // TODO: Implement API call
    return []
  }
)

export const createPlant = createAsyncThunk(
  'plants/createPlant',
  async (plantData: Partial<Plant>) => {
    // TODO: Implement API call
    const newPlant: Plant = {
      id: Date.now().toString(),
      name: plantData.name || 'Neue Pflanze',
      stage: plantData.stage || 'seedling',
      startDate: plantData.startDate || new Date(),
      photos: [],
      logs: [],
      tasks: [],
      settings: {
        substrate: 'Coco',
        potSize: 10,
        lightSchedule: {
          onTime: '06:00',
          offTime: '18:00'
        },
        targetVPD: 1.2,
        targetEC: 1.8,
        targetPH: 6.2,
        targetTemperature: 24,
        targetHumidity: 65
      },
      health: {
        vpd: 1.2,
        ec: 1.8,
        ph: 6.2,
        temperature: 24,
        humidity: 65,
        lastUpdated: new Date(),
        status: 'good'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newPlant
  }
)

export const updatePlant = createAsyncThunk(
  'plants/updatePlant',
  async ({ id, updates }: { id: string; updates: Partial<Plant> }) => {
    // TODO: Implement API call
    return { id, updates }
  }
)

export const deletePlant = createAsyncThunk(
  'plants/deletePlant',
  async (id: string) => {
    // TODO: Implement API call
    return id
  }
)

export const addPlantLog = createAsyncThunk(
  'plants/addPlantLog',
  async ({ plantId, logData }: { plantId: string; logData: Partial<PlantLog> }) => {
    // TODO: Implement API call
    const newLog: PlantLog = {
      id: Date.now().toString(),
      plantId,
      action: logData.action || 'note',
      date: logData.date || new Date(),
      data: logData.data || {},
      createdAt: new Date()
    }
    return { plantId, log: newLog }
  }
)

export const addPlantTask = createAsyncThunk(
  'plants/addPlantTask',
  async ({ plantId, taskData }: { plantId: string; taskData: Partial<PlantTask> }) => {
    // TODO: Implement API call
    const newTask: PlantTask = {
      id: Date.now().toString(),
      plantId,
      title: taskData.title || 'Neue Aufgabe',
      type: taskData.type || 'custom',
      dueDate: taskData.dueDate || new Date(),
      priority: taskData.priority || 'medium',
      createdAt: new Date()
    }
    return { plantId, task: newTask }
  }
)

const plantSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    setCurrentPlant: (state, action: PayloadAction<Plant | null>) => {
      state.currentPlant = action.payload
    },
    setFilter: (state, action: PayloadAction<{ key: keyof PlantState['filters']; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value
    },
    clearFilters: (state) => {
      state.filters = { stage: 'all', search: '' }
    },
    updatePlantHealth: (state, action: PayloadAction<{ plantId: string; health: Partial<Plant['health']> }>) => {
      const plant = state.plants.find(p => p.id === action.payload.plantId)
      if (plant) {
        plant.health = { ...plant.health, ...action.payload.health, lastUpdated: new Date() }
      }
      if (state.currentPlant?.id === action.payload.plantId) {
        state.currentPlant.health = { ...state.currentPlant.health, ...action.payload.health, lastUpdated: new Date() }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plants
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false
        state.plants = action.payload
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Fehler beim Laden der Pflanzen'
      })
      
      // Create Plant
      .addCase(createPlant.fulfilled, (state, action) => {
        state.plants.push(action.payload)
        state.currentPlant = action.payload
      })
      
      // Update Plant
      .addCase(updatePlant.fulfilled, (state, action) => {
        const index = state.plants.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.plants[index] = { ...state.plants[index], ...action.payload.updates, updatedAt: new Date() }
        }
        if (state.currentPlant?.id === action.payload.id) {
          state.currentPlant = { ...state.currentPlant, ...action.payload.updates, updatedAt: new Date() }
        }
      })
      
      // Delete Plant
      .addCase(deletePlant.fulfilled, (state, action) => {
        state.plants = state.plants.filter(p => p.id !== action.payload)
        if (state.currentPlant?.id === action.payload) {
          state.currentPlant = null
        }
      })
      
      // Add Plant Log
      .addCase(addPlantLog.fulfilled, (state, action) => {
        const plant = state.plants.find(p => p.id === action.payload.plantId)
        if (plant) {
          plant.logs.push(action.payload.log)
          plant.updatedAt = new Date()
        }
        if (state.currentPlant?.id === action.payload.plantId) {
          state.currentPlant.logs.push(action.payload.log)
          state.currentPlant.updatedAt = new Date()
        }
      })
      
      // Add Plant Task
      .addCase(addPlantTask.fulfilled, (state, action) => {
        const plant = state.plants.find(p => p.id === action.payload.plantId)
        if (plant) {
          plant.tasks.push(action.payload.task)
          plant.updatedAt = new Date()
        }
        if (state.currentPlant?.id === action.payload.plantId) {
          state.currentPlant.tasks.push(action.payload.task)
          state.currentPlant.updatedAt = new Date()
        }
      })
  }
})

export const { setCurrentPlant, setFilter, clearFilters, updatePlantHealth } = plantSlice.actions

// Selectors
export const selectAllPlants = (state: { plants: PlantState }) => state.plants.plants
export const selectCurrentPlant = (state: { plants: PlantState }) => state.plants.currentPlant
export const selectPlantsLoading = (state: { plants: PlantState }) => state.plants.loading
export const selectPlantsError = (state: { plants: PlantState }) => state.plants.error
export const selectPlantsFilters = (state: { plants: PlantState }) => state.plants.filters

export const selectFilteredPlants = (state: { plants: PlantState }) => {
  const { plants, filters } = state.plants
  return plants.filter(plant => {
    const matchesStage = filters.stage === 'all' || plant.stage === filters.stage
    const matchesSearch = !filters.search || 
      plant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      plant.strain?.toLowerCase().includes(filters.search.toLowerCase())
    return matchesStage && matchesSearch
  })
}

export const selectTodayTasks = (state: { plants: PlantState }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return state.plants.plants.flatMap(plant => 
    plant.tasks
      .filter(task => {
        const taskDate = new Date(task.dueDate)
        return taskDate >= today && taskDate < tomorrow && !task.completedAt
      })
      .map(task => ({ ...task, plantName: plant.name }))
  ).sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export default plantSlice.reducer
