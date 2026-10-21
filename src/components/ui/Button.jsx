import { cn } from '@/lib/cn'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-150 ' +
  'active:translate-x-[2px] active:translate-y-[2px] focus-visible:outline-none focus-visible:shadow-glow ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none'

const variants = {
  solid:
    'bg-brand text-[#0A0A0A] shadow-pop hover:bg-[var(--brand-hover)] active:shadow-[2px_2px_0_var(--pop-shadow)]',
  outline:
    'border-2 border-ink text-ink shadow-[4px_4px_0_rgb(222_177_4/.6)] hover:bg-ink/5 active:shadow-[2px_2px_0_rgb(222_177_4/.6)]',
  ghost:   'text-ink hover:bg-ink/10 active:bg-ink/20',
  danger:  'bg-[var(--danger)] text-white shadow-pop active:shadow-[2px_2px_0_var(--pop-shadow)]',
  brand:   'bg-brand text-[#0A0A0A] hover:bg-[var(--brand-hover)]',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
  icon: 'h-10 w-10 p-0',
  'icon-sm': 'h-8 w-8 p-0',
}

export function Button({
  variant = 'solid',
  size = 'md',
  className,
  children,
  loading,
  ...props
}) {
  return (
    <button
      className={cn(base, variants[variant] ?? variants.solid, sizes[size] ?? sizes.md, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
