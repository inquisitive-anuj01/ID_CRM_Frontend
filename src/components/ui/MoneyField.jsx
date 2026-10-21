import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { formatINR, parseINR } from '@/lib/money'

export const MoneyField = forwardRef(function MoneyField(
  { label, error, required, value, onChange, readOnly, className, ...props },
  ref
) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange?.(Number(raw) || 0)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand pointer-events-none">
          ₹
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          readOnly={readOnly}
          value={value ? value.toLocaleString('en-IN') : ''}
          onChange={handleChange}
          className={cn(
            'w-full rounded-xl border border-line bg-surface-2 pl-8 pr-4 py-2.5 text-sm text-ink tabular-nums',
            'placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
            readOnly && 'bg-surface cursor-default',
            error && 'border-[var(--danger)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
})
