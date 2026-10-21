import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Select({
  label,
  error,
  required,
  placeholder = 'Select...',
  options = [],
  value,
  onValueChange,
  disabled,
  className,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex w-full items-center justify-between rounded-xl border border-line',
            'bg-surface-2 px-4 py-2.5 text-sm text-ink',
            'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'data-[placeholder]:text-muted',
            error && 'border-[var(--danger)]',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={14} className="text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-xl border border-line bg-surface shadow-pop-lg"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-ink',
                    'select-none outline-none',
                    'data-[highlighted]:bg-brand/10 data-[highlighted]:text-ink',
                    'data-[state=checked]:text-brand'
                  )}
                >
                  {opt.dot && (
                    <span
                      className="mr-2 h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ background: opt.dot }}
                    />
                  )}
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2">
                    <Check size={12} className="text-brand" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}
