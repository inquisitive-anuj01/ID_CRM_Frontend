import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Dropdown = RadixDropdown.Root
export const DropdownTrigger = RadixDropdown.Trigger

export function DropdownContent({ children, className, align = 'end', sideOffset = 4 }) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[180px] overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-pop-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
}

export function DropdownItem({ children, className, onSelect, disabled, icon: Icon }) {
  return (
    <RadixDropdown.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink',
        'select-none outline-none transition-colors',
        'data-[highlighted]:bg-brand/10 data-[highlighted]:text-ink',
        'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
        className
      )}
    >
      {Icon && <Icon size={14} className="shrink-0 text-muted" />}
      {children}
    </RadixDropdown.Item>
  )
}

export function DropdownSeparator() {
  return <RadixDropdown.Separator className="my-1 h-px bg-line" />
}

export function DropdownLabel({ children, className }) {
  return (
    <RadixDropdown.Label
      className={cn('px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted', className)}
    >
      {children}
    </RadixDropdown.Label>
  )
}
