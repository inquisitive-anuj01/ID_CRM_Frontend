import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      leadView: 'board', // 'board' | 'list'
      sidebarOpen: false,
      commandPaletteOpen: false,

      setLeadView: (view) => set({ leadView: view }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'ui-store',
      partialize: (s) => ({ leadView: s.leadView }),
    }
  )
)
