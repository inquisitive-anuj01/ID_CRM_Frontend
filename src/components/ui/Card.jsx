import { cn } from '@/lib/cn'

export function Card({ className, children, pop, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface p-4',
        pop && 'shadow-pop-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-3 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-base font-bold text-ink', className)} {...props}>
      {children}
    </h3>
  )
}
