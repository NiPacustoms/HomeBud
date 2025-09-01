'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { FirebaseUser } from '@/types/firebase'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signUp: (email: string, password: string, displayName?: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      try {
        const { getAuth, onAuthStateChanged } = await import('firebase/auth')
        const { app } = await import('@/services/firebase/app')
        
        const auth = getAuth(app)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
        
        return unsubscribe
      } catch (error) {
        console.error('Auth initialization failed:', error)
        setLoading(false)
        return () => {}
      }
    }
    
    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth')
      const { app } = await import('@/services/firebase/app')
      const auth = getAuth(app)
      return signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      const { app } = await import('@/services/firebase/app')
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      return signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { getAuth, createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const { app } = await import('@/services/firebase/app')
      const auth = getAuth(app)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
      
      return result
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { getAuth, signOut: firebaseSignOut } = await import('firebase/auth')
      const { app } = await import('@/services/firebase/app')
      const auth = getAuth(app)
      return firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { getAuth, sendPasswordResetEmail } = await import('firebase/auth')
      const { app } = await import('@/services/firebase/app')
      const auth = getAuth(app)
      return sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signInWithGoogle, 
      signUp, 
      signOut, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
