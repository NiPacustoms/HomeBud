import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'de' | 'en'
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    privacy: {
      profileVisible: boolean
      growDataVisible: boolean
      allowAnalytics: boolean
    }
  }
  subscription: {
    plan: 'free' | 'premium' | 'pro'
    status: 'active' | 'inactive' | 'cancelled'
    validUntil: Date
    features: string[]
  }
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
}

// Async thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    // TODO: Implement Firebase auth
    return { user: null, profile: null }
  }
)

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }) => {
    // TODO: Implement Firebase auth
    return { user: null, profile: null }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    // TODO: Implement Firebase sign out
    return null
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<UserProfile>) => {
    // TODO: Implement profile update
    return updates
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserProfile['preferences']>>) => {
      if (state.profile) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.isAuthenticated = true
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Anmeldung fehlgeschlagen'
      })
      // Sign up
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.isAuthenticated = true
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registrierung fehlgeschlagen'
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.profile = null
        state.isAuthenticated = false
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload }
        }
      })
  },
})

export const {
  setUser,
  setProfile,
  setLoading,
  setError,
  setInitialized,
  clearError,
  updatePreferences,
} = authSlice.actions

export default authSlice.reducer
