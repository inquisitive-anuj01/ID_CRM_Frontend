import { cn } from '@/lib/cn'

/** PolicyBadge: shows in-policy / out-of-policy status on followup */
export function PolicyBadge({ status }) {
  const isIn = status === 'inpolicy'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        isIn
          ? 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30'
          : 'bg-[var(--warn)]/15 text-[var(--warn)] border border-[var(--warn)]/30'
      )}
    >
      {isIn ? '✅ In policy' : '⚠ Out of policy'}
    </span>
  )
}
