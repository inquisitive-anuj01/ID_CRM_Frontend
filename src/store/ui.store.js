import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      leadsViewMode: 'table', // 'table' | 'kanban'
      leadView: 'list',
      sidebarOpen: false,
      commandPaletteOpen: false,

      setLeadsViewMode: (mode) => set({ leadsViewMode: mode }),
      setLeadView: (view) => set({ leadView: view }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'ui-store',
      partialize: (s) => ({ leadsViewMode: s.leadsViewMode }),
    }
  )
)
