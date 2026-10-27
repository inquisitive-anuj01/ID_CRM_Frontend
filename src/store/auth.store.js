import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { queryClient } from '@/app/queryClient'

export const clearAllAppCache = () => {
  try {
    queryClient.cancelQueries()
    queryClient.clear()
  } catch (err) {
    console.error('[Auth] Error clearing query cache:', err)
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      workspace: null,
      isLoading: false,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setWorkspace: (workspace) => set({ workspace }),
      setLoading: (isLoading) => set({ isLoading }),

      setAuth: ({ user, token, workspace }) => {
        clearAllAppCache()
        set({
          user,
          token,
          ...(workspace !== undefined && { workspace }),
        })
      },

      logout: () => {
        clearAllAppCache()
        set({ token: null, user: null, workspace: null })
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-store',
      // Persist token, user, and workspace so sessions survive page refresh
      partialize: (state) => ({ token: state.token, user: state.user, workspace: state.workspace }),
    }
  )
)

