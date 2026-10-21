import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // dark is default (matches website)

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
        applyTheme(get().theme)
      },
    }),
    { name: 'theme-store' }
  )
)

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
