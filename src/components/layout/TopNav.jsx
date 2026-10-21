import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Users, BarChart2, Bell, Sun, Moon, Plus,
  ChevronDown, LogOut, User, Lock, Settings, Tag, Layers,
  BookOpen, ListTodo, StickyNote, AlarmClock, CalendarDays,
  UserCheck, Import, Command
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
import { isAdmin } from '@/lib/permissions'
import { cn } from '@/lib/cn'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Layers },
  { to: '/followups', label: 'Followups', icon: AlarmClock },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
]

export function TopNav() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { setCommandPaletteOpen } = useUIStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur-md">
      <Page>
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-black text-black text-sm">
              ID
            </span>
            <span className="hidden font-black text-ink sm:block">CRM</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors',
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
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-muted hover:text-ink hover:bg-ink/5 transition-colors">
                  Work <ChevronDown size={12} />
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
                  'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors',
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
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-muted hover:text-ink hover:bg-ink/5 transition-colors">
                    Admin <ChevronDown size={12} />
                  </button>
                </DropdownTrigger>
                <DropdownContent align="start">
                  <DropdownItem onSelect={() => navigate('/admin/users')} icon={Users}>Users</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/masters')} icon={Tag}>Masters</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/settings')} icon={Settings}>Settings</DropdownItem>
                  <DropdownItem onSelect={() => navigate('/admin/import')} icon={Import}>Import Leads</DropdownItem>
                </DropdownContent>
              </Dropdown>
            )}
          </nav>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Command palette trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs text-muted hover:border-brand transition-colors"
              title="Search (⌘K)"
            >
              <Command size={12} />
              <span className="hidden md:block">Search</span>
              <kbd className="hidden md:block rounded bg-surface px-1 text-[10px] border border-line">⌘K</kbd>
            </button>

            {/* Quick add */}
            <Dropdown>
              <DropdownTrigger asChild>
                <Button size="icon" className="bg-brand text-black shadow-pop hover:bg-[var(--brand-hover)]">
                  <Plus size={18} />
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-muted hover:text-brand transition-colors"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Avatar / user menu */}
            <Dropdown>
              <DropdownTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-line p-1 pr-2 hover:border-brand transition-colors">
                  <Avatar name={user?.name} size="xs" />
                  <span className="hidden sm:block text-xs font-bold text-ink max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className="text-muted" />
                </button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>{user?.email}</DropdownLabel>
                <DropdownSeparator />
                <DropdownItem onSelect={() => navigate('/profile')} icon={User}>Profile</DropdownItem>
                <DropdownItem onSelect={() => navigate('/profile?tab=password')} icon={Lock}>Change Password</DropdownItem>
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
