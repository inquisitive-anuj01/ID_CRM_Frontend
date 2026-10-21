import { cn } from '@/lib/cn'

const variants = {
  default: 'border border-line text-ink bg-surface-2',
  brand:   'border border-brand text-brand bg-brand/10',
  success: 'border border-[var(--success)] text-[var(--success)] bg-[var(--success)]/10',
  danger:  'border border-[var(--danger)] text-[var(--danger)] bg-[var(--danger)]/10',
  warn:    'border border-[var(--warn)] text-[var(--warn)] bg-[var(--warn)]/10',
  info:    'border border-[var(--info)] text-[var(--info)] bg-[var(--info)]/10',
  ghost:   'text-muted bg-surface-2',
}

export function Badge({ variant = 'default', className, children, dot, style }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest',
        variants[variant] ?? variants.default,
        className
      )}
      style={style}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ background: dot }}
        />
      )}
      {children}
    </span>
  )
}
