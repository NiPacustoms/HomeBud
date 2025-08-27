import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import growReducer from './slices/growSlice'
import monitoringReducer from './slices/monitoringSlice'
import diaryReducer from './slices/diarySlice'
import communityReducer from './slices/communitySlice'
import uiReducer from './slices/uiSlice'
import plantReducer from './slices/plantSlice'
import moduleReducer from './slices/moduleSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    grow: growReducer,
    monitoring: monitoringReducer,
    diary: diaryReducer,
    community: communityReducer,
    ui: uiReducer,
    plants: plantReducer,
    modules: moduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
