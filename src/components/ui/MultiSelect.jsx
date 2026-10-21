import { useState, useRef } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * MultiSelect with chip display and searchable dropdown
 * options: [{ value, label, color? }]
 * value: string[]
 */
export function MultiSelect({
  label,
  required,
  error,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select...',
  className,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = options.filter(
    (o) =>
      !search ||
      o.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (val) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val))
    } else {
      onChange?.([...value, val])
    }
  }

  const remove = (val, e) => {
    e.stopPropagation()
    onChange?.(value.filter((v) => v !== val))
  }

  const selectedOptions = options.filter((o) => value.includes(o.value))

  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          'min-h-[44px] flex flex-wrap items-center gap-1.5 rounded-xl border border-line',
          'bg-surface-2 px-3 py-2 cursor-pointer select-none',
          'focus-within:border-brand transition-colors',
          open && 'border-brand ring-2 ring-brand/20',
          error && 'border-[var(--danger)]',
          className
        )}
      >
        {selectedOptions.length === 0 && (
          <span className="text-sm text-muted">{placeholder}</span>
        )}
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={
              opt.color
                ? { background: opt.color + '22', color: opt.color, border: `1px solid ${opt.color}44` }
                : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }
            }
          >
            {opt.label}
            <button onClick={(e) => remove(opt.value, e)} className="hover:opacity-70">
              <X size={10} />
            </button>
          </span>
        ))}
        <ChevronDown size={14} className={cn('ml-auto text-muted transition-transform', open && 'rotate-180')} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-line bg-surface shadow-pop-lg">
          <div className="border-b border-line p-2">
            <input
              autoFocus
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted">No options found</p>
            )}
            {filtered.map((opt) => {
              const selected = value.includes(opt.value)
              return (
                <div
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand/10"
                >
                  {opt.color && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: opt.color }}
                    />
                  )}
                  <span className="flex-1">{opt.label}</span>
                  {selected && <Check size={12} className="text-brand" />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch('') }} />
      )}
    </div>
  )
}
