import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import {
  Search,
  LayoutDashboard,
  Layers,
  AlarmClock,
  BarChart2,
  Users,
  Settings,
  Plus,
  Moon,
  Sun,
  LogOut,
  User,
  Shield,
  FileText,
  Calendar,
  CheckSquare,
} from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { isAdmin } from '@/lib/permissions'
import http from '@/api/http'

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setLeadModalOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Global keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  // Live search debounced
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await http.get('/search', { params: { q: query } })
        setSearchResults(res.data?.leads || res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const runAction = (callback) => {
    setCommandPaletteOpen(false)
    callback()
  }

  if (!commandPaletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Menu" className="w-full flex flex-col">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-text-muted shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search leads, commands, pages... (Cmd+K)"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-block rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-text-muted border border-border">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 divide-y divide-border/40">
            <Command.Empty className="py-6 text-center text-xs text-text-muted">
              No results found.
            </Command.Empty>

            {searchResults.length > 0 && (
              <Command.Group heading="Leads" className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                {searchResults.map((lead) => (
                  <Command.Item
                    key={lead._id}
                    onSelect={() => runAction(() => navigate(`/leads?id=${lead._id}`))}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
                  >
                    <Layers className="h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <span className="font-semibold">{lead.name}</span>
                      <span className="ml-2 text-[11px] opacity-70">{lead.phone}</span>
                    </div>
                    {lead.company && <span className="text-[10px] opacity-60 truncate">{lead.company}</span>}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
              <Command.Item
                onSelect={() => runAction(() => navigate('/dashboard'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/leads'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Leads & Pipeline</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/followups'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <AlarmClock className="h-4 w-4" />
                <span>Followups & Agenda</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/customers'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Customers & Clients</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/reports'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Analytics & Reports</span>
              </Command.Item>
            </Command.Group>

            {isAdmin(user) && (
              <Command.Group heading="Admin" className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <Command.Item
                  onSelect={() => runAction(() => navigate('/admin/users'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runAction(() => navigate('/admin/masters'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Master Data Configuration</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runAction(() => navigate('/admin/settings'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>CRM Settings & Followup Policy</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runAction(() => navigate('/admin/import'))}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Excel Lead Import</span>
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
              <Command.Item
                onSelect={() => runAction(() => setLeadModalOpen(true))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Lead</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/customers?add=1'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Client</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => toggleTheme())}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Toggle Theme ({theme === 'dark' ? 'Light' : 'Dark'})</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => navigate('/profile'))}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text cursor-pointer hover:bg-brand hover:text-black transition-colors"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runAction(() => {
                    logout()
                    navigate('/login')
                  })
                }
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-danger cursor-pointer hover:bg-danger hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
    </div>
  )
}
