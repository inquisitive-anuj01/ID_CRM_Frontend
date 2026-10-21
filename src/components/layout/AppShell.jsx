import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { TopNav } from './TopNav'
import { BottomNav } from './BottomNav'
import { CommandPalette } from './CommandPalette'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { initSocket, disconnectSocket } from '@/lib/socket'
import { LeadFormModal } from '@/features/leads/LeadFormModal'

export function AppShell() {
  const { token, user } = useAuthStore()
  const { leadModalOpen, setLeadModalOpen } = useUIStore()

  useEffect(() => {
    if (token) {
      initSocket(token)
    }
    return () => {
      disconnectSocket()
    }
  }, [token])

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-brand selection:text-black flex flex-col font-sans">
      <TopNav />

      <main className="flex-1 pb-20 lg:pb-12 pt-4 sm:pt-6">
        <Outlet />
      </main>

      <BottomNav />
      <CommandPalette />

      {/* Global Quick Add Lead Modal */}
      {leadModalOpen && (
        <LeadFormModal
          open={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
        />
      )}
    </div>
  )
}
