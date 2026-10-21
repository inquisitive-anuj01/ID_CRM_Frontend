import { Badge } from '@/components/ui/Badge'
import { useStatuses } from '@/hooks/useMasters'

/** Status pill that renders with the status's own master name & color */
export function StatusPill({ status, color, size = 'sm' }) {
  const { statuses = [] } = useStatuses()

  if (!status) return null

  const rawKey = typeof status === 'object' ? status.key || status.name : String(status)
  const matched = statuses.find(
    (s) => s.key === rawKey || s.name?.toLowerCase() === rawKey?.toLowerCase()
  )

  const displayName = matched?.name || (typeof status === 'object' ? status.name : status)
  const finalColor = color || matched?.color || (typeof status === 'object' ? status.color : undefined)

  const style = finalColor
    ? {
        background: finalColor + '22',
        color: finalColor,
        border: `1px solid ${finalColor}44`,
      }
    : undefined

  return (
    <Badge
      className="font-bold uppercase tracking-wider text-[11px]"
      style={style}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={finalColor ? { background: finalColor } : { background: 'currentColor' }}
      />
      <span>{displayName}</span>
    </Badge>
  )
}
