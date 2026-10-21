import { Button } from '@/components/ui/Button'
import { Marker } from '@/components/ui/Marker'

export function PageHeader({ title, marker, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          {marker ? <Marker>{title}</Marker> : title}
        </h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {(actions || children) && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {children}
        </div>
      )}
    </div>
  )
}
