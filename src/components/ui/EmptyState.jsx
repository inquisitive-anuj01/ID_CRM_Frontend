import { Marker } from './Marker'
import { Button } from './Button'

export function EmptyState({
  headline,
  description,
  action,
  actionLabel,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <Icon size={28} className="text-brand" />
        </div>
      )}
      <h2 className="text-2xl font-black">
        <Marker>{headline ?? 'Nothing here.'}</Marker>
      </h2>
      {description && (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
