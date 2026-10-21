import { useState, useEffect } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { StatusPill } from '@/components/shared/StatusPill'
import { Details } from './tabs/Details'
import { Followups } from './tabs/Followups'
import { History } from './tabs/History'
import { StatusModal } from './modals/StatusModal'
import { AssignModal } from './modals/AssignModal'
import { LabelsModal } from './modals/LabelsModal'
import { DeleteConfirm } from './modals/DeleteConfirm'
import { FollowupFormModal } from './FollowupFormModal'
import { LeadFormModal } from './LeadFormModal'
import { useLead, useLeadFollowups, useLeadHistory } from '@/hooks/useLeads'
import { useStatuses } from '@/hooks/useMasters'
import {
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Mail,
  X,
  History as HistoryIcon,
  User,
  List,
  TrendingUp,
} from 'lucide-react'

export function LeadDrawer({ leadId, open, onClose }) {
  const [activeTab, setActiveTab] = useState('details')
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [labelsModalOpen, setLabelsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

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

  const handleDelete = async () => {
    await deleteLead()
    setDeleteModalOpen(false)
    onClose()
  }

  const cleanPhone = (lead?.mobile || lead?.phone || '').replace(/[^0-9]/g, '')
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
  const currentStatusKey = lead?.status?.key || lead?.status

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        side={isMobile ? 'bottom' : 'right'}
        className={
          isMobile
            ? 'rounded-t-3xl max-h-[90vh] p-0 flex flex-col'
            : 'w-full max-w-xl md:max-w-2xl p-0 flex flex-col border-l border-border bg-surface'
        }
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-border bg-surface flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-text truncate">
                {lead?.customerName || lead?.name || 'Lead Details'}
              </h2>
              {lead && <StatusPill status={lead.status?.name || lead.status} color={lead.status?.color} />}
            </div>

            {(lead?.companyName || lead?.company) && (
              <p className="text-xs text-text-muted">{lead.companyName || lead.company}</p>
            )}

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {lead?.mobile && (
                <a
                  href={`tel:${lead.mobile}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand text-black font-bold text-[11px] hover:bg-brand/90 transition-colors shadow-sm"
                >
                  <Phone className="h-3 w-3" />
                  Call
                </a>
              )}
              {cleanPhone && (
                <a
                  href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(lead?.name || '')},`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#25D366] text-white font-bold text-[11px] hover:opacity-90 transition-opacity shadow-sm"
                >
                  <MessageSquare className="h-3 w-3 fill-current" />
                  WhatsApp
                </a>
              )}
              {lead?.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-2 border border-border text-text font-medium text-[11px] hover:text-brand transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  Email
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="outline" size="xs" onClick={() => setEditModalOpen(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeleteModalOpen(true)}
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Interactive Pipeline Stage Progress Bar ── */}
        {statuses.length > 0 && (
          <div className="px-5 py-3 border-b border-border/80 bg-surface-2/40">
            <div className="flex items-center justify-between pb-1.5 mb-1">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-brand" />
                Pipeline Progress Stage
              </span>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="text-[10px] font-bold text-brand hover:underline"
              >
                Change Stage
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {statuses.map((st, i) => {
                const isCurrent = currentStatusKey === st.key
                return (
                  <button
                    key={st.key}
                    onClick={() => updateStatus({ status: st.key })}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${
                      isCurrent
                        ? 'bg-brand text-black border-brand shadow-sm font-black scale-105'
                        : 'bg-surface text-text-muted hover:text-text border-border hover:border-brand/40'
                    }`}
                  >
                    <span className="h-3.5 w-3.5 rounded-full bg-black/10 flex items-center justify-center text-[9px]">
                      {i + 1}
                    </span>
                    <span>{st.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs & Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-surface-2 border border-border mb-4">
              <TabsTrigger value="details" className="flex-1 gap-1.5 text-xs">
                <User className="h-3.5 w-3.5" />
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="followups" className="flex-1 gap-1.5 text-xs">
                <List className="h-3.5 w-3.5" />
                <span>Followups ({followups.length})</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 gap-1.5 text-xs">
                <HistoryIcon className="h-3.5 w-3.5" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Details
                lead={lead}
                onOpenStatus={() => setStatusModalOpen(true)}
                onOpenAssign={() => setAssignModalOpen(true)}
                onOpenLabels={() => setLabelsModalOpen(true)}
                onRatingChange={(rating) => updateRating({ rating })}
              />
            </TabsContent>

            <TabsContent value="followups">
              <Followups
                followups={followups}
                isLoading={followupsLoading}
                onAddFollowup={() => setFollowupModalOpen(true)}
              />
            </TabsContent>

            <TabsContent value="history">
              <History history={history} isLoading={historyLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </Sheet>

      {/* Action Modals */}
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
