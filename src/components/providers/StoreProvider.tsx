'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { getStore } from '@/store/store'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Browser-only Store-Erstellung
  const store = getStore()
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
