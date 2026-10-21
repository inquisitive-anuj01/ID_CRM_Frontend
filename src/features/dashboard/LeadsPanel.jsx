import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/shared/StatusPill'
import { formatINR } from '@/lib/money'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Layers } from 'lucide-react'

export function LeadsPanel({ stages = [] }) {
  const navigate = useNavigate()

  return (
    <Card className="p-5 bg-surface border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold text-text">Pipeline by Stage</h3>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="text-xs font-semibold text-brand hover:underline flex items-center"
        >
          View Kanban
          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {stages.length === 0 ? (
          <p className="text-xs text-text-muted py-4 text-center">No pipeline stages available.</p>
        ) : (
          stages.map((stage, idx) => {
            const count = stage.count || 0
            const amount = stage.totalAmount || 0

            return (
              <div
                key={idx}
                onClick={() => navigate(`/leads?status=${stage.status?.key || stage._id}`)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-surface-2/40 hover:bg-surface-2 hover:border-brand/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.status?.color || '#DEB104' }}
                  />
                  <span className="text-xs font-semibold text-text">
                    {stage.status?.name || stage._id || 'Stage'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {amount > 0 && (
                    <span className="font-semibold text-text-muted font-mono">
                      {formatINR ? formatINR(amount) : `₹${amount}`}
                    </span>
                  )}
                  <span className="flex h-5 min-w-[22px] items-center justify-center rounded-full bg-surface text-[11px] font-bold text-text border border-border">
                    {count}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
