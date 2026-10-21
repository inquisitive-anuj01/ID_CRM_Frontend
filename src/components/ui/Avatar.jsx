import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '@/lib/cn'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const sizes = {
  xs:  'h-6 w-6 text-[10px]',
  sm:  'h-8 w-8 text-xs',
  md:  'h-10 w-10 text-sm',
  lg:  'h-12 w-12 text-base',
  xl:  'h-16 w-16 text-xl',
}

export function Avatar({ name, src, size = 'md', className }) {
  return (
    <RadixAvatar.Root
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-brand/20 ring-1 ring-brand/30',
        sizes[size] ?? sizes.md,
        className
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={name}
        className="h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center font-bold text-brand"
      >
        {getInitials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
