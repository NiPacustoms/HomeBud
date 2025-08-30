import { useAuth as useAuthClient } from '@/components/AuthClient'

export function useAuth() {
  const { user, loading } = useAuthClient()
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    signIn: async (email: string, password: string) => {
      // TODO: Implement Firebase sign in
      console.log('Sign in:', email, password)
    },
    signUp: async (email: string, password: string, displayName?: string) => {
      // TODO: Implement Firebase sign up
      console.log('Sign up:', email, password, displayName)
    },
    signOut: async () => {
      // TODO: Implement Firebase sign out
      console.log('Sign out')
    },
    updateProfile: async (updates: any) => {
      // TODO: Implement profile update
      console.log('Update profile:', updates)
    },
  }
}
