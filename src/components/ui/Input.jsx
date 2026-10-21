import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef(function Input(
  { label, error, hint, className, wrapperClassName, required, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink',
          'placeholder:text-muted transition-all duration-150',
          'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
})
