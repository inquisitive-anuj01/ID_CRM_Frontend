import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Users, BarChart2, Bell, Sun, Moon, Plus,
  ChevronDown, LogOut, User, Lock, Settings, Tag, Layers,
  BookOpen, ListTodo, StickyNote, AlarmClock, CalendarDays,
  UserCheck, Import, Command, Building2
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useUIStore } from '@/store/ui.store'
import { Page } from './Page'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  Dropdown, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownLabel,
} from '@/components/ui/Dropdown'
import { NotificationBell } from './NotificationBell'
import { authApi } from '@/api/auth.api'
import { disconnectSocket } from '@/lib/socket'
import { isAdmin } from '@/lib/permissions'
import { cn } from '@/lib/cn'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Layers },
  { to: '/followups', label: 'Followups', icon: AlarmClock },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
]

export function TopNav() {
  const { user, workspace, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { setCommandPaletteOpen } = useUIStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    disconnectSocket()
    logout()
    navigate('/login')
  }

  const companyInitials = (workspace?.name || 'CRM')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'ID'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur-md">
      <Page>
        <div className="flex h-14 items-center gap-2 min-w-0">

          {/* Logo — shrinks company name text on smaller screens */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 group min-w-0 max-w-[180px] xl:max-w-[240px]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand font-black text-black text-[10px] uppercase tracking-tight shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {companyInitials}
            </span>
            <span className="font-black text-ink tracking-tight truncate text-[11px] xl:text-sm leading-tight">
              {workspace?.name || 'CRM'}
            </span>
          </Link>

          {/* Desktop nav — compress spacing so long names don't overflow */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2 shrink-0">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'px-2 xl:px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-brand text-black'
                      : 'text-muted hover:text-ink hover:bg-ink/5'
                  )
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Work dropdown */}
            <Dropdown>
              <DropdownTrigger asChild>
                <button className="flex items-center gap-0.5 px-2 xl:px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest text-muted hover:text-ink hover:bg-ink/5 transition-colors whitespace-nowrap">
                  Work <ChevronDown size={11} />
                </button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownItem onSelect={() => navigate('/tasks')} icon={ListTodo}>Tasks</DropdownItem>
                <DropdownItem onSelect={() => navigate('/todos')} icon={ListTodo}>To-Dos</DropdownItem>
                <DropdownItem onSelect={() => navigate('/notes')} icon={StickyNote}>Notes</DropdownItem>
                <DropdownItem onSelect={() => navigate('/reminders')} icon={AlarmClock}>Reminders</DropdownItem>
                <DropdownItem onSelect={() => navigate('/meetings')} icon={Users}>Meetings</DropdownItem>
                <DropdownItem onSelect={() => navigate('/calendar')} icon={CalendarDays}>Calendar</DropdownItem>
              </DropdownContent>
            </Dropdown>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                cn(
                  'px-2 xl:px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-brand text-black'
                    : 'text-muted hover:text-ink hover:bg-ink/5'
                )
              }
            >
              Customers
            </NavLink>

            {/* Admin dropdown */}
            {isAdmin(user) && (
              <Dropdown>
                <DropdownTrigger asChild>
                  <button className="flex items-center gap-0.5 px-2 xl:px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest text-muted hover:text-ink hover:bg-ink/5 transition-colors whitespace-nowrap">
                    Admin <ChevronDown size={11} />
                  </button>
                </DropdownTrigger>
                <DropdownContent align="start">
                  <DropdownItem onSelect={() => navigate('/admin/workspace')} icon={Building2}>Workspace</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/users')} icon={Users}>Users</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/masters')} icon={Tag}>Masters</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/settings')} icon={Settings}>Settings</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/import')} icon={Import}>Import Leads</DropdownItem>
                </DropdownContent>
              </Dropdown>
            )}
          </nav>

          {/* Spacer pushes right actions to the end */}
          <div className="flex-1 min-w-0" />

          {/* Right actions — tight gap, no wrapping */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Command palette trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[10px] xl:text-xs text-muted hover:border-brand transition-colors whitespace-nowrap"
              title="Search (⌘K)"
            >
              <Command size={11} />
              <span className="hidden xl:block">Search</span>
              <kbd className="hidden xl:block rounded bg-surface px-1 text-[10px] border border-line">⌘K</kbd>
            </button>

            {/* Quick add */}
            <Dropdown>
              <DropdownTrigger asChild>
                <Button size="icon" className="h-8 w-8 bg-brand text-black shadow-pop hover:bg-[var(--brand-hover)]">
                  <Plus size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>Quick Add</DropdownLabel>
                <DropdownItem onSelect={() => navigate('/leads?add=1')} icon={Layers}>Lead</DropdownItem>
                <DropdownItem onSelect={() => navigate('/customers?add=1')} icon={Users}>Client / Customer</DropdownItem>
                <DropdownItem onSelect={() => navigate('/followups?add=1')} icon={AlarmClock}>Followup</DropdownItem>
                <DropdownItem onSelect={() => navigate('/tasks?add=1')} icon={ListTodo}>Task</DropdownItem>
                <DropdownItem onSelect={() => navigate('/reminders?add=1')} icon={AlarmClock}>Reminder</DropdownItem>
                <DropdownItem onSelect={() => navigate('/meetings?add=1')} icon={Users}>Meeting</DropdownItem>
                <DropdownItem onSelect={() => navigate('/notes?add=1')} icon={StickyNote}>Note</DropdownItem>
              </DropdownContent>
            </Dropdown>

            {/* Notifications */}
            <NotificationBell />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-2 text-muted hover:text-brand transition-colors shrink-0"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Avatar / user menu */}
            <Dropdown>
              <DropdownTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-line p-1 pr-2 hover:border-brand transition-colors shrink-0">
                  <Avatar name={user?.name} size="xs" />
                  <span className="hidden sm:block text-[10px] xl:text-xs font-bold text-ink max-w-[60px] xl:max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={11} className="text-muted" />
                </button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>
                  <p className="font-bold text-text truncate">{workspace?.name || 'Workspace'}</p>
                  <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                </DropdownLabel>
                <DropdownSeparator />
                <DropdownItem onSelect={() => navigate('/profile')} icon={User}>Profile</DropdownItem>
                <DropdownItem onSelect={() => navigate('/profile?tab=password')} icon={Lock}>Change Password</DropdownItem>
                {isAdmin(user) && (
                  <DropdownItem onSelect={() => navigate('/admin/workspace')} icon={Building2}>Workspace Settings</DropdownItem>
                )}
                <DropdownSeparator />
                <DropdownItem onSelect={handleLogout} icon={LogOut} className="text-[var(--danger)]">
                  Logout
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </Page>
    </header>
  )
}
