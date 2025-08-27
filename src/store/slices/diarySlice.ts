import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface DiaryEntry {
  id: string
  projectId: string
  date: Date
  title: string
  content: string
  images: {
    id: string
    url: string
    caption?: string
    aiAnalysis?: AIAnalysis
  }[]
  tags: string[]
  mood: 'excellent' | 'good' | 'neutral' | 'poor' | 'critical'
  weather?: {
    temperature: number
    humidity: number
    description: string
  }
  activities: {
    type: 'watering' | 'feeding' | 'pruning' | 'transplanting' | 'harvesting' | 'other'
    description: string
    time: Date
  }[]
  notes: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AIAnalysis {
  id: string
  imageId: string
  health: {
    score: number // 0-100
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    issues: string[]
    recommendations: string[]
  }
  growth: {
    stage: 'seedling' | 'vegetative' | 'flowering' | 'harvest'
    progress: number // 0-100
    estimatedDaysToHarvest?: number
  }
  trichomes?: {
    clear: number
    cloudy: number
    amber: number
    recommendation: 'wait' | 'harvest' | 'overripe'
  }
  pests?: {
    detected: boolean
    type?: string
    severity?: 'low' | 'medium' | 'high'
    treatment?: string
  }
  nutrients?: {
    deficiencies: string[]
    excesses: string[]
    recommendations: string[]
  }
  createdAt: Date
}

export interface DiarySettings {
  projectId: string
  autoAnalysis: boolean
  publicSharing: boolean
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
  reminderTime: string // HH:MM
  tags: string[]
  templates: {
    id: string
    name: string
    content: string
    tags: string[]
  }[]
}

interface DiaryState {
  entries: DiaryEntry[]
  currentEntry: DiaryEntry | null
  settings: DiarySettings[]
  isLoading: boolean
  error: string | null
  filters: {
    dateRange: { start: Date | null; end: Date | null }
    tags: string[]
    mood: string[]
    activities: string[]
  }
  aiAnalysisQueue: string[] // image IDs waiting for analysis
}

const initialState: DiaryState = {
  entries: [],
  currentEntry: null,
  settings: [],
  isLoading: false,
  error: null,
  filters: {
    dateRange: { start: null, end: null },
    tags: [],
    mood: [],
    activities: [],
  },
  aiAnalysisQueue: [],
}

// Async thunks
export const fetchDiaryEntries = createAsyncThunk(
  'diary/fetchEntries',
  async ({ projectId, filters }: { projectId: string; filters?: any }) => {
    // TODO: Implement API call
    return []
  }
)

export const createDiaryEntry = createAsyncThunk(
  'diary/createEntry',
  async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement API call
    return { ...entry, id: 'temp-id', createdAt: new Date(), updatedAt: new Date() }
  }
)

export const updateDiaryEntry = createAsyncThunk(
  'diary/updateEntry',
  async ({ id, updates }: { id: string; updates: Partial<DiaryEntry> }) => {
    // TODO: Implement API call
    return { id, updates }
  }
)

export const deleteDiaryEntry = createAsyncThunk(
  'diary/deleteEntry',
  async (id: string) => {
    // TODO: Implement API call
    return id
  }
)

export const uploadImage = createAsyncThunk(
  'diary/uploadImage',
  async ({ file, entryId }: { file: File; entryId: string }) => {
    // TODO: Implement image upload
    return { url: 'temp-url', id: 'temp-id' }
  }
)

export const analyzeImage = createAsyncThunk(
  'diary/analyzeImage',
  async (imageId: string) => {
    // TODO: Implement AI analysis
    return { imageId, analysis: {} as AIAnalysis }
  }
)

export const generateTimelapse = createAsyncThunk(
  'diary/generateTimelapse',
  async ({ projectId, dateRange }: { projectId: string; dateRange: { start: Date; end: Date } }) => {
    // TODO: Implement timelapse generation
    return { url: 'temp-timelapse-url' }
  }
)

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setCurrentEntry: (state, action: PayloadAction<DiaryEntry | null>) => {
      state.currentEntry = action.payload
    },
    addEntry: (state, action: PayloadAction<DiaryEntry>) => {
      state.entries.unshift(action.payload)
    },
    updateEntryLocal: (state, action: PayloadAction<{ id: string; updates: Partial<DiaryEntry> }>) => {
      const { id, updates } = action.payload
      const entryIndex = state.entries.findIndex(e => e.id === id)
      if (entryIndex !== -1) {
        state.entries[entryIndex] = { ...state.entries[entryIndex], ...updates, updatedAt: new Date() }
      }
      if (state.currentEntry?.id === id) {
        state.currentEntry = { ...state.currentEntry, ...updates, updatedAt: new Date() }
      }
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(e => e.id !== action.payload)
      if (state.currentEntry?.id === action.payload) {
        state.currentEntry = null
      }
    },
    addImageToEntry: (state, action: PayloadAction<{ entryId: string; image: DiaryEntry['images'][0] }>) => {
      const { entryId, image } = action.payload
      const entryIndex = state.entries.findIndex(e => e.id === entryId)
      if (entryIndex !== -1) {
        state.entries[entryIndex].images.push(image)
      }
      if (state.currentEntry?.id === entryId) {
        state.currentEntry.images.push(image)
      }
    },
    updateImageAnalysis: (state, action: PayloadAction<{ imageId: string; analysis: AIAnalysis }>) => {
      const { imageId, analysis } = action.payload
      // Update in all entries
      state.entries.forEach(entry => {
        entry.images.forEach(image => {
          if (image.id === imageId) {
            image.aiAnalysis = analysis
          }
        })
      })
      if (state.currentEntry) {
        state.currentEntry.images.forEach(image => {
          if (image.id === imageId) {
            image.aiAnalysis = analysis
          }
        })
      }
    },
    addToAnalysisQueue: (state, action: PayloadAction<string>) => {
      if (!state.aiAnalysisQueue.includes(action.payload)) {
        state.aiAnalysisQueue.push(action.payload)
      }
    },
    removeFromAnalysisQueue: (state, action: PayloadAction<string>) => {
      state.aiAnalysisQueue = state.aiAnalysisQueue.filter(id => id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<DiaryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        dateRange: { start: null, end: null },
        tags: [],
        mood: [],
        activities: [],
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchDiaryEntries.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDiaryEntries.fulfilled, (state, action) => {
        state.isLoading = false
        state.entries = action.payload
      })
      .addCase(fetchDiaryEntries.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Fehler beim Laden der Tagebucheinträge'
      })
      // Create entry
      .addCase(createDiaryEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload)
        state.currentEntry = action.payload
      })
      // Update entry
      .addCase(updateDiaryEntry.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const entryIndex = state.entries.findIndex(e => e.id === id)
        if (entryIndex !== -1) {
          state.entries[entryIndex] = { ...state.entries[entryIndex], ...updates, updatedAt: new Date() }
        }
        if (state.currentEntry?.id === id) {
          state.currentEntry = { ...state.currentEntry, ...updates, updatedAt: new Date() }
        }
      })
      // Delete entry
      .addCase(deleteDiaryEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(e => e.id !== action.payload)
        if (state.currentEntry?.id === action.payload) {
          state.currentEntry = null
        }
      })
      // Upload image
      .addCase(uploadImage.fulfilled, (state, action) => {
        // Image upload completed, add to analysis queue if auto-analysis is enabled
        state.aiAnalysisQueue.push(action.payload.id)
      })
      // Analyze image
      .addCase(analyzeImage.fulfilled, (state, action) => {
        const { imageId, analysis } = action.payload
        // Update image analysis in all entries
        state.entries.forEach(entry => {
          entry.images.forEach(image => {
            if (image.id === imageId) {
              image.aiAnalysis = analysis
            }
          })
        })
        if (state.currentEntry) {
          state.currentEntry.images.forEach(image => {
            if (image.id === imageId) {
              image.aiAnalysis = analysis
            }
          })
        }
        // Remove from queue
        state.aiAnalysisQueue = state.aiAnalysisQueue.filter(id => id !== imageId)
      })
  },
})

export const {
  setCurrentEntry,
  addEntry,
  updateEntryLocal,
  removeEntry,
  addImageToEntry,
  updateImageAnalysis,
  addToAnalysisQueue,
  removeFromAnalysisQueue,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearError,
} = diarySlice.actions

export default diarySlice.reducer
