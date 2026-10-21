import { useDraggable } from '@dnd-kit/core'
import { Card } from '@/components/ui/Card'
import { Stars } from '@/components/ui/Stars'
import { LabelChip } from '@/components/shared/LabelChip'
import { OverdueBadge } from '@/components/shared/OverdueBadge'
import { formatINR } from '@/lib/money'
import { Phone, Calendar, GripVertical, Building2, User2 } from 'lucide-react'

// Color map for priority / status pills
const QUALITY_COLORS = {
  5: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  4: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  3: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  2: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  1: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
}

const QUALITY_LABELS = {
  5: 'VERY HOT',
  4: 'HIGH',
  3: 'MEDIUM',
  2: 'LOW',
  1: 'COLD',
}

export function LeadCard({ lead, onClick, isOverlay = false }) {
  if (!lead) return null

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead._id,
    data: { lead },
    disabled: isOverlay,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const rating = lead.rating || 3
  const qualityClass = QUALITY_COLORS[rating] || QUALITY_COLORS[3]
  const qualityText = QUALITY_LABELS[rating] || 'MEDIUM'

  // Formatter for date
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const assignedUser = lead.assignedTo
  const initials = assignedUser?.name
    ? assignedUser.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '—'

  const handleClick = (e) => {
    // If we're dragging, ignore click
    if (isDragging) return
    onClick?.(lead)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative select-none rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
        isOverlay
          ? 'rotate-2 shadow-2xl ring-2 ring-brand border-brand bg-surface scale-105 z-50'
          : isDragging
          ? 'opacity-30 border-dashed border-border bg-surface-2/40'
          : 'border-border bg-surface hover:border-brand/60 hover:shadow-md'
      }`}
    >
      <div className="p-3.5 space-y-2.5 pointer-events-none">
        {/* Card Header: Title + Grip */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-text truncate group-hover:text-brand transition-colors">
              {lead.customerName || lead.name || 'Unnamed Lead'}
            </h4>
            {(lead.companyName || lead.company) && (
              <p className="text-[11px] text-text-muted truncate flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 shrink-0" />
                {lead.companyName || lead.company}
              </p>
            )}
          </div>

          <div
            className="p-1 -mr-1 -mt-1 text-text-muted/40 hover:text-brand transition-colors shrink-0"
            title="Drag to change status"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Amount & Quality Badge */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${qualityClass}`}>
            {qualityText}
          </span>

          {lead.estimateAmount > 0 && (
            <span className="text-xs font-black text-text">
              {formatINR ? formatINR(lead.estimateAmount) : `₹${lead.estimateAmount}`}
            </span>
          )}
        </div>

        {/* Labels / Tags */}
        {lead.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.labels.slice(0, 2).map((l, i) => {
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
            {lead.labels.length > 2 && (
              <span className="text-[10px] text-text-muted self-center">+{lead.labels.length - 2}</span>
            )}
          </div>
        )}

        {/* Card Footer: Assignee & Followup / Date */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
          {/* Assignee Avatar */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-[10px] border border-brand/30"
              title={assignedUser?.name || 'Unassigned'}
            >
              {initials}
            </span>
            <span className="truncate text-text-muted text-[11px]">
              {assignedUser?.name?.split(' ')[0] || 'Unassigned'}
            </span>
          </div>

          {/* Followup / Due Date */}
          {lead.nextFollowupDate ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-text-muted">
              <Calendar className="h-3 w-3 text-brand" />
              <span>{formatDate(lead.nextFollowupDate)}</span>
            </div>
          ) : lead.createdAt ? (
            <span className="text-[10px] text-text-muted/70">
              {formatDate(lead.createdAt)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
