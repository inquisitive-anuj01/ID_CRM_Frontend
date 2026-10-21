import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Stars({ value = 0, max = 5, onChange, readonly, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        return (
          <button
            key={i}
            type="button"
            onClick={onChange && !readonly ? () => onChange(i + 1 === value ? 0 : i + 1) : undefined}
            className={cn(
              'transition-transform duration-100',
              !readonly && 'hover:scale-125 cursor-pointer',
              readonly && 'cursor-default'
            )}
            aria-label={`${i + 1} star${i !== 0 ? 's' : ''}`}
            tabIndex={readonly ? -1 : 0}
          >
            <Star
              size={size}
              className={cn(
                filled ? 'text-brand fill-brand' : 'text-line fill-transparent'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
