import { cn } from '@/lib/cn'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-surface-2',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent',
        'before:animate-[shimmer_1.5s_infinite]',
        className
      )}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-line">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
