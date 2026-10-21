import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // Light theme is default

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyTheme(next)
      },

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      initTheme: () => {
        // Clear legacy dark default if stored
        try {
          if (localStorage.getItem('theme-store')) {
            const legacy = JSON.parse(localStorage.getItem('theme-store') || '{}')
            if (legacy?.state?.theme === 'dark' && !localStorage.getItem('idcrm-theme-v2')) {
              localStorage.removeItem('theme-store')
            }
          }
        } catch (_) {}
        applyTheme(get().theme || 'light')
      },
    }),
    {
      name: 'idcrm-theme-v2',
      version: 1,
    }
  )
)

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
