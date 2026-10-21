import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { queryClient } from './queryClient'
import { useThemeStore } from '@/store/theme.store'

export function Providers({ children }) {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
