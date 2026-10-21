import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { StatRow } from './StatRow'
import { LeadsPanel } from './LeadsPanel'
import { SchedulesPanel } from './SchedulesPanel'
import { LeadFormModal } from '@/features/leads/LeadFormModal'
import { useDashboard } from '@/hooks/useDashboard'
import { useStatuses } from '@/hooks/useMasters'
import { Plus, RefreshCw, BarChart2, Zap } from 'lucide-react'

export function DashboardPage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const { summary, schedules, isLoading, refetch } = useDashboard()
  const { statuses } = useStatuses()

  const stages = summary.stages || summary.byStatus || statuses.map((s) => ({
    status: s,
    count: summary.statusCounts?.[s.key] || 0,
    totalAmount: summary.statusAmounts?.[s.key] || 0,
  }))

  return (
    <Page>
      <PageHeader
        title="Sales Dashboard"
        marker="Live"
        description="Real-time revenue pipeline, lead flow velocity, and interaction SLAs"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="solid" size="sm" onClick={() => setLeadModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Lead
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="mb-6">
        <StatRow summary={summary} />
      </div>

      {/* Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsPanel stages={stages} />
        <SchedulesPanel schedules={schedules} />
      </div>

      {/* Quick Add Modal */}
      <LeadFormModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </Page>
  )
}
