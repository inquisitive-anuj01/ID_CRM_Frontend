import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/cn'

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </RadixTabs.Root>
  )
}

export function TabsList({ className, children }) {
  return (
    <RadixTabs.List
      className={cn(
        'flex gap-1 rounded-xl bg-surface-2 p-1 border border-line',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

export function TabsTrigger({ value, className, children }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'flex-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted',
        'transition-all duration-150 select-none',
        'data-[state=active]:bg-brand data-[state=active]:text-[#0A0A0A] data-[state=active]:shadow-pop',
        'hover:text-ink',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

export function TabsContent({ value, className, children }) {
  return (
    <RadixTabs.Content value={value} className={cn('mt-4', className)}>
      {children}
    </RadixTabs.Content>
  )
}
