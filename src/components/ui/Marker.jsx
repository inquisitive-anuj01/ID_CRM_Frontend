import { cn } from '@/lib/cn'

/** Marker: the signature brand headline element */
export const Marker = ({ children, as: Tag = 'span', className = '' }) => (
  <Tag
    className={cn(
      'inline-block -rotate-1 bg-brand px-3 py-0.5 sm:px-4 font-black tracking-display',
      'text-[#0A0A0A] shadow-[5px_5px_0_var(--pop-shadow)]',
      className
    )}
  >
    {children}
  </Tag>
)
