import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { FollowupFormModal } from '@/features/leads/FollowupFormModal'
import { LeadDrawer } from '@/features/leads/LeadDrawer'
import { useFollowups } from '@/hooks/useFollowups'
import { fmtDateTime, fmtTimeAgo } from '@/lib/dates'
import {
  AlarmClock,
  Phone,
  MessageSquare,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Plus,
  ExternalLink,
} from 'lucide-react'

export function MyFollowupsPage() {
  const [tab, setTab] = useState('today')
  const [selectedLead, setSelectedLead] = useState(null)
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [activeDrawerLeadId, setActiveDrawerLeadId] = useState(null)

  const { followups, counts, isLoading, refetch } = useFollowups({ filter: tab })

  const handleOpenLog = (lead) => {
    setSelectedLead(lead)
    setFollowupModalOpen(true)
  }

  return (
    <Page>
      <PageHeader
        title="Followups Agenda"
        marker="Schedule"
        description="Daily callback queues, scheduled appointments, and overdue followups"
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-surface border border-border">
          <TabsTrigger value="today" className="gap-2">
            <AlarmClock className="h-4 w-4" />
            <span>Today's Agenda</span>
            {counts.today > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-black">
                {counts.today}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span>Overdue</span>
            {counts.overdue > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {counts.overdue}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>All Activities</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : followups.length === 0 ? (
            <EmptyState
              title={`No ${tab} followups`}
              description="Your schedule is clear! You are on top of your customer pipeline."
            />
          ) : (
            <div className="space-y-3">
              {followups.map((item) => {
                const lead = item.lead || item
                const cleanPhone = (lead.mobile || lead.phone || '').replace(/[^0-9]/g, '')
                const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`

                return (
                  <Card
                    key={item._id}
                    className="p-4 bg-surface border-border hover:border-brand/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveDrawerLeadId(lead._id)}
                          className="font-bold text-sm text-text hover:text-brand transition-colors text-left"
                        >
                          {lead.customerName || lead.name || 'Lead'}
                        </button>
                        {(lead.companyName || lead.company) && (
                          <span className="text-xs text-text-muted">({lead.companyName || lead.company})</span>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {typeof item.category === 'object' ? item.category?.name : (item.category || (typeof lead.status === 'object' ? lead.status?.name : lead.status) || 'Call')}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span>Phone: <strong className="text-text">{lead.mobile || lead.phone || '—'}</strong></span>
                        {item.nextFollowupDate && (
                          <span>
                            Scheduled: <strong className="text-brand">{fmtDateTime ? fmtDateTime(item.nextFollowupDate) : new Date(item.nextFollowupDate).toLocaleString()}</strong>
                          </span>
                        )}
                      </div>

                      {(item.comment || item.remarks) && (
                        <p className="text-xs text-text-muted line-clamp-1 mt-1">
                          Last note: {item.comment || item.remarks}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="h-4 w-4 fill-current" />
                        </a>
                      )}
                      <a
                        href={`tel:${lead.mobile || lead.phone}`}
                        className="p-2 rounded-full bg-surface-2 border border-border text-text hover:text-brand transition-colors"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <Button
                        size="xs"
                        variant="solid"
                        onClick={() => handleOpenLog(lead)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Log Followup
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Followup Log Modal */}
      {selectedLead && (
        <FollowupFormModal
          open={followupModalOpen}
          onClose={() => {
            setFollowupModalOpen(false)
            setSelectedLead(null)
          }}
          lead={selectedLead}
          onSuccess={refetch}
        />
      )}

      {/* Lead Drawer */}
      {activeDrawerLeadId && (
        <LeadDrawer
          leadId={activeDrawerLeadId}
          open={Boolean(activeDrawerLeadId)}
          onClose={() => setActiveDrawerLeadId(null)}
        />
      )}
    </Page>
  )
}
