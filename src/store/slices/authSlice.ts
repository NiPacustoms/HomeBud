import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Vollständig gemockter Auth Service - KEINE externen Dependencies!
const MockAuthService = {
  login: async (email: string, password: string) => {
    return Promise.resolve({ uid: 'mock-uid', email, displayName: 'Mock User' });
  },
  loginWithGoogle: async () => {
    return Promise.resolve({ uid: 'mock-google-uid', email: 'mock@google.com', displayName: 'Mock Google User' });
  },
  register: async (email: string, password: string, displayName?: string) => {
    return Promise.resolve({ uid: 'mock-register-uid', email, displayName: displayName || 'Mock User' });
  },
  logout: async () => {
    return Promise.resolve();
  },
  resetPassword: async (email: string) => {
    return Promise.resolve();
  }
};

// Async Thunks mit Mock Service
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    return MockAuthService.login(email, password);
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async () => {
    return MockAuthService.loginWithGoogle();
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }) => {
    return MockAuthService.register(email, password, displayName);
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await MockAuthService.logout();
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => {
    await MockAuthService.resetPassword(email);
  }
);

// Auth State Interface
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial State
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login fehlgeschlagen';
      });

    // Google Login
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Google Login fehlgeschlagen';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registrierung fehlgeschlagen';
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout fehlgeschlagen';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Passwort-Reset fehlgeschlagen';
      });
  },
});

// Actions
export const { setUser, clearError, setLoading } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Reducer
export default authSlice.reducer;
