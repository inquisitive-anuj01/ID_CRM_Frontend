import { fmtDateTime } from '@/lib/dates'
import { UserChip } from '@/components/shared/UserChip'
import { History as HistoryIcon, Clock, ArrowRight } from 'lucide-react'

export function History({ history = [], isLoading }) {
  if (isLoading) {
    return <div className="p-4 text-xs text-text-muted">Loading audit history...</div>
  }

  if (history.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-text-muted flex flex-col items-center">
        <Clock className="h-6 w-6 mb-2 text-text-muted/60" />
        <p>No historical updates recorded for this lead yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-1">
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {history.map((item, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-bg" />
            <div className="rounded-xl border border-border bg-surface p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                <span className="font-semibold text-text capitalize">{item.action || 'Updated'}</span>
                <span>{fmtDateTime ? fmtDateTime(item.createdAt) : new Date(item.createdAt).toLocaleString()}</span>
              </div>

              {(() => {
                if (!item.changes) return null
                const changesList = Array.isArray(item.changes)
                  ? item.changes.map((c) => ({
                      field: c.field,
                      from: typeof c.from === 'object' ? JSON.stringify(c.from) : c.from,
                      to: typeof c.to === 'object' ? JSON.stringify(c.to) : c.to,
                    }))
                  : Object.entries(item.changes).map(([field, val]) => ({
                      field,
                      from: typeof val?.from === 'object' ? JSON.stringify(val?.from) : val?.from,
                      to: typeof val?.to === 'object' ? JSON.stringify(val?.to) : val?.to,
                    }))

                if (changesList.length === 0) return null

                return (
                  <div className="space-y-1 pt-1">
                    {changesList.map(({ field, from, to }, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-medium text-text-muted capitalize">{field}:</span>
                        <span className="line-through text-text-muted">{String(from ?? 'None')}</span>
                        <ArrowRight className="h-3 w-3 text-text-muted" />
                        <span className="font-semibold text-text">{String(to ?? 'None')}</span>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {(item.actor || item.performedBy) && (
                <div className="pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] text-text-muted">
                  <span>By:</span>
                  <UserChip user={item.actor || item.performedBy} size="xs" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
