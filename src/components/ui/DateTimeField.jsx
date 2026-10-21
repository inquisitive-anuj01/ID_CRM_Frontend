import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { fmt } from '@/lib/dates'

export function DateTimeField({
  label,
  error,
  required,
  value,
  onChange,
  placeholder = 'Select date & time',
  min,
  className,
}) {
  // Convert Date/string to datetime-local format
  const toLocal = (d) => {
    if (!d) return ''
    const date = new Date(d)
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const handleChange = (e) => {
    const val = e.target.value
    if (val && onChange) onChange(new Date(val))
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
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="datetime-local"
          value={toLocal(value)}
          onChange={handleChange}
          min={min ? toLocal(min) : undefined}
          className={cn(
            'w-full rounded-xl border border-line bg-surface-2 pl-9 pr-4 py-2.5 text-sm text-ink',
            'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
            '[color-scheme:dark]',
            error && 'border-[var(--danger)]',
            className
          )}
        />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}
