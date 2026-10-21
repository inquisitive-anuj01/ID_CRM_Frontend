import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/cn'

export function TooltipProvider({ children }) {
  return (
    <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>
  )
}

export function Tooltip({ children, content, side = 'top', align = 'center' }) {
  if (!content) return children

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={4}
          className={cn(
            'z-50 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink shadow-pop',
            'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-line" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
