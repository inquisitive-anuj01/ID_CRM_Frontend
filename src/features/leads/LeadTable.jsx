import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/shared/StatusPill'
import { UserChip } from '@/components/shared/UserChip'
import { LabelChip } from '@/components/shared/LabelChip'
import { OverdueBadge } from '@/components/shared/OverdueBadge'
import { Stars } from '@/components/ui/Stars'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatINR } from '@/lib/money'
import { fmtDateTime } from '@/lib/dates'
import { Phone, MessageSquare, ChevronRight } from 'lucide-react'

export function LeadTable({
  leads = [],
  isLoading,
  selectedIds = [],
  onSelectToggle,
  onSelectAll,
  onLeadClick,
  onAddLead,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try clearing search filters or create a new lead to get started."
        action={
          <button
            onClick={onAddLead}
            className="px-4 py-2 rounded-full bg-brand text-black text-xs font-bold hover:bg-brand-hover shadow-md transition-all"
          >
            Create New Lead
          </button>
        }
      />
    )
  }

  const allSelected = leads.length > 0 && selectedIds.length === leads.length

  return (
    <Card className="p-0 overflow-hidden border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-border text-brand focus:ring-brand"
                />
              </th>
              <th className="px-4 py-3.5">Client Contact</th>
              <th className="px-4 py-3.5">Company / Project</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Estimate</th>
              <th className="px-4 py-3.5">Quality</th>
              <th className="px-4 py-3.5">Owner</th>
              <th className="px-4 py-3.5">Followup</th>
              <th className="px-4 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => {
              const isSelected = selectedIds.includes(lead._id)
              const cleanPhone = (lead.mobile || lead.phone || '').replace(/[^0-9]/g, '')
              const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`

              return (
                <tr
                  key={lead._id}
                  onClick={() => onLeadClick(lead)}
                  className={`hover:bg-surface-2/60 transition-colors cursor-pointer ${
                    isSelected ? 'bg-brand/5' : ''
                  }`}
                >
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(lead._id)}
                      className="rounded border-border text-brand focus:ring-brand"
                    />
                  </td>

                  {/* Name + Phone */}
                  <td className="px-4 py-3.5">
                    <div>
                      <span className="font-bold text-text hover:text-brand transition-colors">
                        {lead.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted">
                        <span>{lead.mobile || lead.phone}</span>
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#25D366] hover:scale-110 transition-transform"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3 w-3 fill-current" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3.5 text-text-muted">
                    {lead.company || '—'}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusPill
                      status={lead.status?.name || lead.status}
                      color={lead.status?.color}
                    />
                  </td>

                  {/* Estimate */}
                  <td className="px-4 py-3.5 font-semibold text-text font-mono">
                    {formatINR ? formatINR(lead.estimateAmount || 0) : `₹${lead.estimateAmount || 0}`}
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3.5">
                    <Stars value={lead.rating || 0} readonly size={12} />
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3.5">
                    <UserChip user={lead.assignedTo} size="xs" />
                  </td>

                  {/* Followup SLA / Overdue */}
                  <td className="px-4 py-3.5">
                    {lead.overdueMinutes > 0 ? (
                      <OverdueBadge minutes={lead.overdueMinutes} />
                    ) : lead.nextFollowupDate ? (
                      <span className="text-[11px] text-text-muted">
                        {fmtDateTime ? fmtDateTime(lead.nextFollowupDate) : new Date(lead.nextFollowupDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-text-muted text-[11px]">—</span>
                    )}
                  </td>

                  {/* Arrow */}
                  <td className="px-4 py-3.5 text-right">
                    <ChevronRight className="h-4 w-4 text-text-muted/60 ml-auto" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
