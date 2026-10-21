import { cn } from '@/lib/cn'
import { overdueLabel } from '@/lib/dates'

/** Red pulsing overdue badge */
export function OverdueBadge({ minutes, className }) {
  const label = overdueLabel(minutes)
  if (!label) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
        'bg-[var(--danger)]/15 border border-[var(--danger)]/30 text-[var(--danger)]',
        'text-[10px] font-bold uppercase tracking-wider',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)] overdue-dot flex-shrink-0" />
      {label}
    </span>
  )
}
