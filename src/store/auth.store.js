import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

      setAuth: ({ user, token, workspace }) =>
        set({
          user,
          token,
          ...(workspace !== undefined && { workspace }),
        }),

      logout: () => set({ token: null, user: null, workspace: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-store',
      // Persist token, user, and workspace so sessions survive page refresh
      partialize: (state) => ({ token: state.token, user: state.user, workspace: state.workspace }),
    }
  )
)
