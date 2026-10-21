import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Stars } from '@/components/ui/Stars'
import { LabelChip } from '@/components/shared/LabelChip'
import { FollowupCard } from '../FollowupCard'
import { FollowupFormModal } from '../FollowupFormModal'
import { LeadFormModal } from '../LeadFormModal'
import { StatusModal } from './StatusModal'
import { AssignModal } from './AssignModal'
import { LabelsModal } from './LabelsModal'
import { DeleteConfirm } from './DeleteConfirm'
import { useLead, useLeadFollowups, useLeadHistory } from '@/hooks/useLeads'
import { useStatuses } from '@/hooks/useMasters'
import { formatINR } from '@/lib/money'
import {
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Calendar,
  User2,
  Edit2,
  Trash2,
  Plus,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText,
} from 'lucide-react'

export function LeadDetailModal({ leadId, open, onClose }) {
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [labelsModalOpen, setLabelsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const {
    lead,
    isLoading: leadLoading,
    updateStatus,
    assignLead,
    updateLabels,
    updateRating,
    deleteLead,
  } = useLead(leadId)

  const { data: followups = [], isLoading: followupsLoading, refetch: refetchFollowups } = useLeadFollowups(leadId)
  const { data: history = [], isLoading: historyLoading } = useLeadHistory(leadId)
  const { statuses = [] } = useStatuses()

  if (!open) return null

  const cleanPhone = (lead?.mobile || lead?.phone || '').replace(/[^0-9]/g, '')
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
  const currentStatusKey = lead?.status?.key || lead?.status

  const handleDelete = async () => {
    await deleteLead()
    setDeleteModalOpen(false)
    onClose()
  }

  // Active status color
  const statusColor = lead?.status?.color || '#DEB104'

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="2xl"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          {/* ── Header: Lead identity & quick contact actions ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-text">
                  {lead?.customerName || lead?.name || 'Lead Details'}
                </h2>
                {lead?.status && (
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border shadow-sm"
                    style={{
                      backgroundColor: `${statusColor}20`,
                      color: statusColor,
                      borderColor: `${statusColor}40`,
                    }}
                  >
                    ● {lead?.status?.name || lead?.status}
                  </span>
                )}
              </div>

              {(lead?.companyName || lead?.company) && (
                <p className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
                  <Building2 className="h-3.5 w-3.5 text-brand shrink-0" />
                  {lead?.companyName || lead?.company}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {lead?.mobile && (
                <a
                  href={`tel:${lead.mobile}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-black text-xs font-bold hover:bg-brand/90 transition-all shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </a>
              )}

              {cleanPhone && (
                <a
                  href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(lead?.name || '')},`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  <MessageSquare className="h-3.5 w-3.5 fill-current" />
                  WhatsApp
                </a>
              )}

              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* ── Interactive Pipeline Progress Tracker (All States) ── */}
          <div className="rounded-2xl border border-border bg-surface-2/60 p-3.5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-brand" />
                Pipeline Progress Stage
              </span>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="text-[11px] font-bold text-brand hover:underline"
              >
                Change Stage
              </button>
            </div>

            {/* Stepper bubbles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {statuses.map((st, i) => {
                const isCurrent = currentStatusKey === st.key
                return (
                  <button
                    key={st.key}
                    onClick={() => updateStatus({ status: st.key })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      isCurrent
                        ? 'bg-brand text-black border-brand shadow-md scale-105'
                        : 'bg-surface text-text-muted hover:text-text border-border hover:border-brand/40'
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{st.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Main Two-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── Left Column: Followups Activity Timeline & Notes (7 cols) ── */}
            <div className="lg:col-span-7 space-y-5">
              {/* Activity Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" />
                  <h3 className="font-bold text-text text-sm">
                    Followups & Activity ({followups.length})
                  </h3>
                </div>

                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => setFollowupModalOpen(true)}
                  className="bg-brand text-black font-bold shadow-sm"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Log Followup / Voice
                </Button>
              </div>

              {/* Followups List */}
              {followupsLoading ? (
                <div className="py-8 text-center text-xs text-text-muted animate-pulse">
                  Loading activity timeline…
                </div>
              ) : followups.length === 0 ? (
                <div className="p-6 rounded-2xl border-2 border-dashed border-border/80 text-center space-y-2 bg-surface-2/20">
                  <p className="font-semibold text-text text-sm">No followups logged yet</p>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Log call notes, record audio voice notes, or schedule the next reminder.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFollowupModalOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Log First Followup
                  </Button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {followups.map((f) => (
                    <FollowupCard key={f._id} followup={f} />
                  ))}
                </div>
              )}

              {/* Lead Requirements / Description Notes */}
              {(lead?.description || lead?.notes) && (
                <div className="p-4 rounded-xl border border-border bg-surface-2/40 space-y-2">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-brand" />
                    Requirement & Notes
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap">
                    {lead.description || lead.notes}
                  </p>
                </div>
              )}
            </div>

            {/* ── Right Column: Lead Metadata, Owner, Deal & Financials (5 cols) ── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Financial & Quality Box */}
              <div className="p-4 rounded-2xl border border-border bg-surface-2/50 space-y-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Deal & Quality
                </span>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-text-muted">Estimated Deal</span>
                    <p className="text-xl font-black text-text">
                      {formatINR ? formatINR(lead?.estimateAmount || 0) : `₹${lead?.estimateAmount || 0}`}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-text-muted">Lead Quality</span>
                    <div className="mt-1">
                      <Stars
                        value={lead?.rating || 0}
                        onChange={(r) => updateRating({ rating: r })}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Box */}
              <div className="p-4 rounded-2xl border border-border bg-surface-2/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Assigned Owner
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs border border-brand/30">
                      {lead?.assignedTo?.name ? lead.assignedTo.name[0].toUpperCase() : '—'}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-text">
                        {lead?.assignedTo?.name || 'Unassigned'}
                      </p>
                      {lead?.assignedTo?.email && (
                        <p className="text-[10px] text-text-muted">{lead.assignedTo.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button size="xs" variant="outline" onClick={() => setAssignModalOpen(true)}>
                  Change
                </Button>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl border border-border bg-surface-2/50 space-y-2.5 text-xs">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Primary Contact
                </span>

                {lead?.mobile && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Phone</span>
                    <a href={`tel:${lead.mobile}`} className="font-semibold text-text hover:text-brand">
                      {lead.mobile}
                    </a>
                  </div>
                )}

                {lead?.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Email</span>
                    <a href={`mailto:${lead.email}`} className="font-semibold text-text hover:text-brand truncate max-w-[160px]">
                      {lead.email}
                    </a>
                  </div>
                )}

                {lead?.source && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Lead Source</span>
                    <span className="font-semibold text-text">
                      {typeof lead.source === 'object' ? lead.source.name : lead.source}
                    </span>
                  </div>
                )}

                {lead?.address && (
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-text-muted block text-[11px]">Address / Location</span>
                    <p className="text-text mt-0.5">{lead.address}</p>
                  </div>
                )}
              </div>

              {/* Labels */}
              <div className="p-4 rounded-2xl border border-border bg-surface-2/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Attached Labels
                  </span>
                  <Button size="xs" variant="ghost" onClick={() => setLabelsModalOpen(true)}>
                    Manage
                  </Button>
                </div>

                {lead?.labels?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {lead.labels.map((l, i) => {
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
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No labels attached</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Auxiliary Modals */}
      <StatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        lead={lead}
        onSubmit={updateStatus}
      />

      <AssignModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        lead={lead}
        onSubmit={assignLead}
      />

      <LabelsModal
        open={labelsModalOpen}
        onClose={() => setLabelsModalOpen(false)}
        lead={lead}
        onSubmit={updateLabels}
      />

      <DeleteConfirm
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        leadName={lead?.name}
      />

      <FollowupFormModal
        open={followupModalOpen}
        onClose={() => setFollowupModalOpen(false)}
        lead={lead}
        onSuccess={refetchFollowups}
      />

      {editModalOpen && (
        <LeadFormModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={lead}
        />
      )}
    </>
  )
}
