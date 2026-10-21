import { FollowupCard } from '../FollowupCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus } from 'lucide-react'

export function Followups({ followups = [], isLoading, onAddFollowup }) {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="text-xs font-semibold text-text">
          Activity Timeline ({followups.length})
        </span>
        <Button size="sm" variant="solid" onClick={onAddFollowup}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Log Followup
        </Button>
      </div>

      {followups.length === 0 ? (
        <EmptyState
          title="No followups logged yet"
          description="Log client calls, meetings, or WhatsApp updates to maintain the policy SLA."
          action={
            <Button size="sm" variant="outline" onClick={onAddFollowup}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Log First Followup
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {followups.map((f) => (
            <FollowupCard key={f._id} followup={f} />
          ))}
        </div>
      )}
    </div>
  )
}
