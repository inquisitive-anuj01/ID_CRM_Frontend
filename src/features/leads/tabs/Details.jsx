import { Phone, Mail, Building, Tag, UserCheck, Star, MessageSquare, DollarSign, ExternalLink } from 'lucide-react'
import { StatusPill } from '@/components/shared/StatusPill'
import { UserChip } from '@/components/shared/UserChip'
import { LabelChip } from '@/components/shared/LabelChip'
import { Stars } from '@/components/ui/Stars'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/money'
import { fmtDateTime } from '@/lib/dates'
import { useStatuses } from '@/hooks/useMasters'

export function Details({
  lead,
  onOpenStatus,
  onOpenAssign,
  onOpenLabels,
  onRatingChange,
}) {
  const { statuses = [] } = useStatuses()

  if (!lead) return null

  const currentStatusKey = lead?.status?.key || (typeof lead?.status === 'string' ? lead?.status : '')
  const matchedStatus = statuses.find((s) => s.key === currentStatusKey)
  const statusDisplayName = matchedStatus?.name || (typeof lead?.status === 'object' ? lead?.status?.name : lead?.status) || 'New'
  const statusColor = matchedStatus?.color || lead?.status?.color

  const cleanPhone = (lead.mobileFull || lead.mobile || '').replace(/[^0-9]/g, '')
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`

  return (
    <div className="space-y-6 text-xs">
      {/* Quick Contact Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`tel:${lead.mobile || lead.phone}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-black font-semibold hover:bg-brand-hover transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          Call Client
        </a>

        {cleanPhone && (
          <a
            href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(lead.customerName || lead.name || '')},`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            WhatsApp
          </a>
        )}

        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-text hover:text-brand transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
        )}
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status card */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-2">
          <div className="mb-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">Status</span>
          </div>
          <StatusPill status={statusDisplayName} color={statusColor} />
          {lead.lossReason && (
            <p className="mt-1.5 text-[11px] text-danger">Reason: {lead.lossReason}</p>
          )}
        </div>

        {/* Assigned Owner card */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">Assigned Owner</span>
            <Button variant="ghost" size="xs" onClick={onOpenAssign} className="h-6 text-[11px] text-brand p-0 hover:bg-transparent hover:underline">
              Reassign
            </Button>
          </div>
          <UserChip user={lead.assignedTo} size="sm" />
        </div>

        {/* Estimate Value card */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">Estimated Value</span>
          <p className="mt-1 text-base font-bold text-text">
            {formatINR ? formatINR(lead.estimateAmount || 0) : `₹${lead.estimateAmount || 0}`}
          </p>
        </div>

        {/* Priority Rating card */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">Lead Quality</span>
          <div className="mt-1.5">
            <Stars value={lead.rating || 0} onChange={onRatingChange} size={18} />
          </div>
        </div>
      </div>

      {/* Details list */}
      <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
        <h4 className="text-[11px] uppercase font-bold tracking-wider text-text-muted border-b border-border pb-2">
          Lead Information
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-text-muted">Phone:</span>
            <p className="font-semibold text-text mt-0.5">{lead.mobileFull || lead.mobile || '—'}</p>
          </div>
          <div>
            <span className="text-text-muted">Email:</span>
            <p className="font-semibold text-text mt-0.5 truncate">{lead.email || '—'}</p>
          </div>
          <div>
            <span className="text-text-muted">Company / Project:</span>
            <p className="font-semibold text-text mt-0.5">{lead.companyName || lead.company || '—'}</p>
          </div>
          <div>
            <span className="text-text-muted">Inbound Source:</span>
            <p className="font-semibold text-text mt-0.5">{lead.source?.name || lead.source || 'Direct'}</p>
          </div>
          <div>
            <span className="text-text-muted">Created Date:</span>
            <p className="font-semibold text-text mt-0.5">
              {fmtDateTime ? fmtDateTime(lead.createdAt) : new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-text-muted">Last Followup:</span>
            <p className="font-semibold text-text mt-0.5">
              {lead.lastFollowupAt ? (fmtDateTime ? fmtDateTime(lead.lastFollowupAt) : new Date(lead.lastFollowupAt).toLocaleString()) : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">Tags & Labels</span>
          <Button variant="ghost" size="xs" onClick={onOpenLabels} className="h-6 text-[11px] text-brand p-0 hover:bg-transparent hover:underline">
            Manage
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {lead.labels?.length > 0 ? (
            lead.labels.map((l, i) => {
              const labelData = l.label && typeof l.label === 'object' ? l.label : (typeof l === 'object' ? l : { name: l })
              return (
                <LabelChip
                  key={l._id || i}
                  label={labelData.name || labelData}
                  color={labelData.color}
                  amount={l.amount}
                />
              )
            })
          ) : (
            <span className="text-xs text-text-muted italic">No labels attached</span>
          )}
        </div>
      </div>

      {/* Internal Notes */}
      {(lead.comment || lead.notes) && (
        <div className="p-4 rounded-xl border border-border bg-surface">
          <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted block mb-1">
            Requirements / Internal Notes
          </span>
          <p className="text-xs text-text whitespace-pre-wrap leading-relaxed">{lead.comment || lead.notes}</p>
        </div>
      )}
    </div>
  )
}
