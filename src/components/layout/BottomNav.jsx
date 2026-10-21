import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Layers, AlarmClock, BarChart2, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/ui.store'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Layers },
  { to: '/followups', label: 'Followups', icon: AlarmClock },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
]

export function BottomNav() {
  const { setLeadModalOpen } = useUIStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-surface/90 backdrop-blur-lg px-2 lg:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors',
              isActive ? 'text-brand' : 'text-text-muted hover:text-text'
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Floating Quick Action */}
      <button
        type="button"
        onClick={() => setLeadModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-5 h-12 w-12 rounded-full bg-brand text-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
        aria-label="Add Lead"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>
    </nav>
  )
}
