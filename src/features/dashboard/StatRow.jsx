import { StatCard } from '@/components/shared/StatCard'
import { formatINR } from '@/lib/money'
import { Layers, DollarSign, Award, AlarmClock, AlertTriangle } from 'lucide-react'

export function StatRow({ summary = {} }) {
  const totalLeads = summary.totalLeads ?? summary.leadsCount ?? 0
  const pipelineValue = summary.pipelineValue ?? summary.totalAmount ?? 0
  const wonCount = summary.wonCount ?? summary.convertedLeads ?? 0
  const todayFollowups = summary.todayFollowups ?? summary.pendingToday ?? 0
  const overdueCount = summary.overdueCount ?? summary.overdueFollowups ?? 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatCard
        icon={Layers}
        label="Total Active Leads"
        value={totalLeads}
        accent="#38BDF8"
      />
      <StatCard
        icon={DollarSign}
        label="Pipeline Value"
        value={formatINR ? formatINR(pipelineValue) : `₹${pipelineValue}`}
        accent="#DEB104"
      />
      <StatCard
        icon={Award}
        label="Converted / Won"
        value={wonCount}
        accent="#22C55E"
      />
      <StatCard
        icon={AlarmClock}
        label="Followups Today"
        value={todayFollowups}
        accent="#DEB104"
      />
      <StatCard
        icon={AlertTriangle}
        label="Overdue SLA"
        value={overdueCount}
        accent="#F87171"
      />
    </div>
  )
}
