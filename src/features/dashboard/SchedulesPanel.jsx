import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { fmtDateTime } from '@/lib/dates'
import { useNavigate } from 'react-router-dom'
import { AlarmClock, ChevronRight, Phone, Calendar } from 'lucide-react'

export function SchedulesPanel({ schedules = [] }) {
  const navigate = useNavigate()

  return (
    <Card className="p-5 bg-surface border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <AlarmClock className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold text-text">Scheduled Followups</h3>
        </div>
        <button
          onClick={() => navigate('/followups')}
          className="text-xs font-semibold text-brand hover:underline flex items-center"
        >
          View Agenda
          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {schedules.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center italic">
            No scheduled followups pending.
          </p>
        ) : (
          schedules.slice(0, 6).map((item, idx) => {
            const lead = item.lead || item
            return (
              <div
                key={idx}
                onClick={() => navigate(`/followups`)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-surface-2/40 hover:bg-surface-2 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-text truncate">{lead.customerName || lead.name || 'Client'}</p>
                  <p className="text-[11px] text-text-muted flex items-center gap-1.5">
                    <Phone className="h-3 w-3" />
                    <span>{lead.mobile || lead.phone || '—'}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-brand block">
                    {item.nextFollowupDate
                      ? fmtDateTime ? fmtDateTime(item.nextFollowupDate) : new Date(item.nextFollowupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Scheduled'}
                  </span>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    {item.category || 'Call'}
                  </Badge>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
