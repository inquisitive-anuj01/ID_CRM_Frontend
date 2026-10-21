import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

/** Bottom sheet (mobile-first) using vaul */
export function Sheet({ open, onClose, title, children, footer, side = 'bottom', className }) {
  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose?.()} direction={side}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Drawer.Content
          className={cn(
            'fixed z-50 flex flex-col bg-surface',
            side === 'bottom'
              ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[96vh]'
              : 'right-0 top-0 bottom-0 rounded-l-3xl w-full max-w-3xl',
            'border-t border-line shadow-pop-lg',
            className
          )}
        >
          {side === 'bottom' && (
            <div className="mx-auto mt-3 mb-1 h-1 w-12 rounded-full bg-line" />
          )}

          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            {title && (
              <Drawer.Title className="text-base font-bold text-ink">{title}</Drawer.Title>
            )}
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-4">
              {footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
