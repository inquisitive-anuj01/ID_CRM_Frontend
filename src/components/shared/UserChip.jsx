import { Avatar } from '@/components/ui/Avatar'

/** Compact user chip: avatar + name */
export function UserChip({ user, size = 'xs' }) {
  if (!user) return <span className="text-xs text-muted">—</span>
  return (
    <span className="inline-flex items-center gap-1.5">
      <Avatar name={user.name} size={size} />
      <span className="text-xs font-medium text-ink truncate max-w-[120px]">{user.name}</span>
    </span>
  )
}
