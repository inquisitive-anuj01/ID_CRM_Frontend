import { useDroppable } from '@dnd-kit/core'
import { LeadCard } from './LeadCard'
import { formatINR } from '@/lib/money'

export function KanbanColumn({ status, leads = [], onLeadClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.key,
  })

  const totalAmount = leads.reduce((sum, l) => sum + (l.estimateAmount || 0), 0)

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 rounded-2xl border bg-surface-2/40 p-3 max-h-[calc(100vh-220px)] transition-colors ${
        isOver ? 'border-brand bg-brand/5 ring-2 ring-brand/20' : 'border-border'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: status.color || '#DEB104' }}
          />
          <h3 className="text-xs font-bold text-text uppercase tracking-wider">{status.name}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-text-muted border border-border">
            {leads.length}
          </span>
        </div>

        {totalAmount > 0 && (
          <span className="text-[11px] font-semibold text-text-muted">
            {formatINR ? formatINR(totalAmount) : `₹${totalAmount}`}
          </span>
        )}
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {leads.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted italic border-2 border-dashed border-border/60 rounded-xl">
            Drop leads here
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onClick={() => onLeadClick(lead)}
            />
          ))
        )}
      </div>
    </div>
  )
}
