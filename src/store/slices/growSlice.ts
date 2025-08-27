import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Strain {
  id: string
  name: string
  type: 'indica' | 'sativa' | 'hybrid'
  thc: number
  cbd: number
  floweringTime: number
  yield: 'low' | 'medium' | 'high'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  effects: string[]
  flavors: string[]
  imageUrl?: string
  genetics?: {
    parent1?: string
    parent2?: string
    breeder?: string
  }
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GrowProject {
  id: string
  name: string
  description?: string
  strain: Strain
  status: 'planning' | 'germination' | 'vegetative' | 'flowering' | 'harvesting' | 'curing' | 'completed'
  startDate: Date
  expectedHarvestDate?: Date
  actualHarvestDate?: Date
  location: {
    type: 'indoor' | 'outdoor' | 'greenhouse'
    size: number // in square meters
    description?: string
  }
  setup: {
    lighting: string
    ventilation: string
    nutrients: string[]
    medium: 'soil' | 'coco' | 'hydroponic' | 'aeroponic'
    containers: string
  }
  budget: {
    total: number
    spent: number
    currency: 'EUR' | 'USD'
  }
  notes: string[]
  images: {
    id: string
    url: string
    caption?: string
    date: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

interface GrowState {
  projects: GrowProject[]
  strains: Strain[]
  currentProject: GrowProject | null
  isLoading: boolean
  error: string | null
  userPreferences: {
    growType: 'indoor' | 'outdoor' | 'greenhouse'
    experience: 'beginner' | 'intermediate' | 'expert'
    timeBudget: '5min' | '30min' | '60min+'
    budget: 'low' | 'mid' | 'premium'
  }
  filters: {
    status: string[]
    type: string[]
    difficulty: string[]
  }
}

const initialState: GrowState = {
  projects: [],
  strains: [],
  currentProject: null,
  isLoading: false,
  error: null,
  userPreferences: {
    growType: 'indoor',
    experience: 'beginner',
    timeBudget: '30min',
    budget: 'mid'
  },
  filters: {
    status: [],
    type: [],
    difficulty: [],
  },
}

// Async thunks
export const fetchProjects = createAsyncThunk(
  'grow/fetchProjects',
  async () => {
    // TODO: Implement API call
    return []
  }
)

export const createProject = createAsyncThunk(
  'grow/createProject',
  async (project: Omit<GrowProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement API call
    return { ...project, id: 'temp-id', createdAt: new Date(), updatedAt: new Date() }
  }
)

export const updateProject = createAsyncThunk(
  'grow/updateProject',
  async ({ id, updates }: { id: string; updates: Partial<GrowProject> }) => {
    // TODO: Implement API call
    return { id, updates }
  }
)

export const deleteProject = createAsyncThunk(
  'grow/deleteProject',
  async (id: string) => {
    // TODO: Implement API call
    return id
  }
)

export const fetchStrains = createAsyncThunk(
  'grow/fetchStrains',
  async () => {
    // TODO: Implement API call
    return []
  }
)

const growSlice = createSlice({
  name: 'grow',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<GrowProject | null>) => {
      state.currentProject = action.payload
    },
    addProject: (state, action: PayloadAction<GrowProject>) => {
      state.projects.push(action.payload)
    },
    updateProjectLocal: (state, action: PayloadAction<{ id: string; updates: Partial<GrowProject> }>) => {
      const { id, updates } = action.payload
      const projectIndex = state.projects.findIndex(p => p.id === id)
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates, updatedAt: new Date() }
      }
      if (state.currentProject?.id === id) {
        state.currentProject = { ...state.currentProject, ...updates, updatedAt: new Date() }
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null
      }
    },
    addStrain: (state, action: PayloadAction<Strain>) => {
      state.strains.push(action.payload)
    },
    updateStrain: (state, action: PayloadAction<{ id: string; updates: Partial<Strain> }>) => {
      const { id, updates } = action.payload
      const strainIndex = state.strains.findIndex(s => s.id === id)
      if (strainIndex !== -1) {
        state.strains[strainIndex] = { ...state.strains[strainIndex], ...updates, updatedAt: new Date() }
      }
    },
    removeStrain: (state, action: PayloadAction<string>) => {
      state.strains = state.strains.filter(s => s.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<GrowState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        type: [],
        difficulty: [],
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
    setGrowType: (state, action: PayloadAction<'indoor' | 'outdoor' | 'greenhouse'>) => {
      state.userPreferences.growType = action.payload
    },
    setUserPreferences: (state, action: PayloadAction<Partial<GrowState['userPreferences']>>) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Fehler beim Laden der Projekte'
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
        state.currentProject = action.payload
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const projectIndex = state.projects.findIndex(p => p.id === id)
        if (projectIndex !== -1) {
          state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates, updatedAt: new Date() }
        }
        if (state.currentProject?.id === id) {
          state.currentProject = { ...state.currentProject, ...updates, updatedAt: new Date() }
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null
        }
      })
      // Fetch strains
      .addCase(fetchStrains.fulfilled, (state, action) => {
        state.strains = action.payload
      })
  },
})

export const {
  setCurrentProject,
  addProject,
  updateProjectLocal,
  removeProject,
  addStrain,
  updateStrain,
  removeStrain,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearError,
  setGrowType,
  setUserPreferences,
} = growSlice.actions

export default growSlice.reducer
