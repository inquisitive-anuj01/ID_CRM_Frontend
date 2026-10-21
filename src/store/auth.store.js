import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-store',
      // Persist both token and user so sessions survive page refresh
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
