import { useDroppable } from '@dnd-kit/core'
import { LeadCard } from './LeadCard'
import { formatINR } from '@/lib/money'
import { Plus } from 'lucide-react'

// Distinct Jira-style text colors for columns
const STATUS_HEADER_COLORS = {
  new: 'text-blue-400',
  contacted: 'text-purple-400',
  visited: 'text-amber-400',
  in_progress: 'text-yellow-400',
  processing: 'text-yellow-400',
  proposal: 'text-orange-400',
  confirm: 'text-emerald-400',
  won: 'text-emerald-400',
  done: 'text-emerald-400',
  cancel: 'text-rose-400',
  lost: 'text-rose-400',
}

export function KanbanColumn({
  status,
  index = 1,
  leads = [],
  onLeadClick,
  onAddLead,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.key,
  })

  const totalAmount = leads.reduce((sum, l) => sum + (l.estimateAmount || 0), 0)
  const headerColor = STATUS_HEADER_COLORS[status.key] || 'text-text'

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 rounded-2xl border transition-all ${
        isOver
          ? 'border-brand bg-brand/10 ring-2 ring-brand/30 shadow-lg'
          : 'border-border/80 bg-surface-2/40'
      } p-3 max-h-[calc(100vh-230px)]`}
    >
      {/* ── Jira-Style Column Header ── */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-border/80">
        <div className="flex items-center gap-2 min-w-0">
          {/* Index Number */}
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface text-[11px] font-mono font-bold text-text-muted border border-border">
            {index}
          </span>

          {/* Status Title */}
          <h3 className={`text-xs font-black uppercase tracking-wider truncate ${headerColor}`}>
            {status.name}
          </h3>

          {/* Count Badge */}
          <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-text-muted border border-border">
            {leads.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Add Button */}
          {onAddLead && (
            <button
              onClick={() => onAddLead(status.key)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-colors"
              title={`Add lead to ${status.name}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-header with total column deal amount */}
      {totalAmount > 0 && (
        <div className="flex items-center justify-between px-1.5 py-1 text-[11px] text-text-muted">
          <span>Pipeline Value</span>
          <span className="font-bold text-text">
            {formatINR ? formatINR(totalAmount) : `₹${totalAmount}`}
          </span>
        </div>
      )}

      {/* ── Cards Scroll Container ── */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-2.5 pr-1 min-h-[140px]">
        {leads.length === 0 ? (
          <div
            className={`flex items-center justify-center h-28 border-2 border-dashed rounded-xl text-xs text-text-muted/60 transition-colors ${
              isOver ? 'border-brand bg-brand/5 text-brand font-semibold' : 'border-border/60'
            }`}
          >
            Drop leads here
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onClick={() => onLeadClick?.(lead)}
            />
          ))
        )}
      </div>
    </div>
  )
}
