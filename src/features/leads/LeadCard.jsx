import { Card } from '@/components/ui/Card'
import { Stars } from '@/components/ui/Stars'
import { UserChip } from '@/components/shared/UserChip'
import { LabelChip } from '@/components/shared/LabelChip'
import { OverdueBadge } from '@/components/shared/OverdueBadge'
import { formatINR } from '@/lib/money'
import { Phone, Calendar, GripVertical } from 'lucide-react'

export function LeadCard({ lead, onClick, isDragging = false }) {
  if (!lead) return null

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border border-border bg-surface p-3.5 shadow-sm hover:border-brand/50 hover:shadow-md transition-all cursor-pointer ${
        isDragging ? 'rotate-2 shadow-xl ring-2 ring-brand' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-text truncate group-hover:text-brand transition-colors">
            {lead.name}
          </h4>
          {lead.company && (
            <p className="text-[11px] text-text-muted truncate mt-0.5">{lead.company}</p>
          )}
        </div>

        {lead.rating > 0 && (
          <div className="shrink-0">
            <Stars value={lead.rating} readonly size={12} />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-text">
        <span>{formatINR ? formatINR(lead.estimateAmount || 0) : `₹${lead.estimateAmount || 0}`}</span>
        {lead.overdueMinutes > 0 && <OverdueBadge minutes={lead.overdueMinutes} />}
      </div>

      {lead.labels?.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {lead.labels.slice(0, 3).map((l, i) => {
            const labelData = l.label && typeof l.label === 'object' ? l.label : (typeof l === 'object' ? l : { name: l })
            return (
              <LabelChip
                key={l._id || i}
                label={labelData.name || labelData}
                color={labelData.color}
                amount={l.amount}
              />
            )
          })}
          {lead.labels.length > 3 && (
            <span className="text-[10px] text-text-muted font-medium">+{lead.labels.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
        <div className="flex items-center gap-1.5 truncate">
          <Phone className="h-3 w-3" />
          <span className="truncate">{lead.mobile || lead.phone || '—'}</span>
        </div>
        <UserChip user={lead.assignedTo} size="xs" />
      </div>
    </div>
  )
}
