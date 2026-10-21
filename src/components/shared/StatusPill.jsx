import { Badge } from '@/components/ui/Badge'

/** Status pill that renders with the status's own color */
export function StatusPill({ status, color, size = 'sm' }) {
  if (!status) return null

  const style = color
    ? {
        background: color + '22',
        color,
        border: `1px solid ${color}44`,
      }
    : undefined

  return (
    <Badge
      className="font-bold uppercase"
      style={style}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={color ? { background: color } : { background: 'currentColor' }}
      />
      {status}
    </Badge>
  )
}
