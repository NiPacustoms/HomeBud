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

// SSR-kompatible Store-Konfiguration
const createStore = () => {
  return configureStore({
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
  });
};

// Store nur im Browser erstellen
let store: ReturnType<typeof createStore> | undefined;

export const getStore = () => {
  if (typeof window === 'undefined') {
    // Server-side: Dummy Store
    return {
      getState: () => ({}),
      dispatch: () => {},
      subscribe: () => () => {},
    } as any;
  }
  
  if (!store) {
    store = createStore();
  }
  
  return store;
};

export const store = typeof window !== 'undefined' ? getStore() : undefined;

export type RootState = ReturnType<typeof createStore> extends { getState: () => infer T } ? T : any;
export type AppDispatch = ReturnType<typeof createStore> extends { dispatch: infer T } ? T : any;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  return dispatch;
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
