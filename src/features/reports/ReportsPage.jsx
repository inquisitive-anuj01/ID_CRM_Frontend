import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { reportsApi } from '@/api/reports.api'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { BarChart2, PieChart as PieIcon, Users, CheckCircle, Download } from 'lucide-react'
import { formatINR } from '@/lib/money'

const COLORS = ['#DEB104', '#38BDF8', '#22C55E', '#A3E635', '#A78BFA', '#F87171', '#F59E0B']

export function ReportsPage() {
  const [range, setRange] = useState('30d')

  const { data: statusData = [], isLoading: statusLoading } = useQuery({
    queryKey: ['reports', 'leads-summary', range],
    queryFn: () => reportsApi.leadsSummary({ range }),
    select: (res) => res.data || [],
  })

  const { data: sourceData = [], isLoading: sourceLoading } = useQuery({
    queryKey: ['reports', 'by-source', range],
    queryFn: () => reportsApi.bySource({ range }),
    select: (res) => res.data || [],
  })

  const { data: userData = [], isLoading: userLoading } = useQuery({
    queryKey: ['reports', 'by-user', range],
    queryFn: () => reportsApi.byUser({ range }),
    select: (res) => res.data || [],
  })

  const { data: complianceData = {}, isLoading: compLoading } = useQuery({
    queryKey: ['reports', 'compliance', range],
    queryFn: () => reportsApi.compliance({ range }),
    select: (res) => res.data || {},
  })

  const handleExport = async () => {
    try {
      const res = await reportsApi.export({ range })
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `crm-analytics-${range}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Page>
      <PageHeader
        title="Analytics & Reports"
        marker="Insights"
        description="Conversion rates, inbound attribution, sales team performance, and SLA compliance"
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="h-9 text-xs w-32"
              options={[
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last Quarter' },
                { value: 'all', label: 'All Time' },
              ]}
            />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leads by Status Chart */}
        <Card className="p-5 bg-surface border-border">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
            <BarChart2 className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-bold text-text">Pipeline by Status</h3>
          </div>

          {statusLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis
                    dataKey="status.name"
                    stroke="#CAD5E2"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#CAD5E2" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      borderColor: '#262626',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#DEB104" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Inbound Sources Distribution */}
        <Card className="p-5 bg-surface border-border">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
            <PieIcon className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-bold text-text">Inbound Attribution</h3>
          </div>

          {sourceLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="totalLeads"
                    nameKey="source.name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name || 'Unknown'} (${(percent * 100).toFixed(0)}%)`}
                    fontSize={11}
                  >
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      borderColor: '#262626',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card className="p-0 overflow-hidden border-border bg-surface mb-6">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <Users className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold text-text">Team Performance & Win Rates</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Team Member</th>
                <th className="px-5 py-3.5">Assigned Leads</th>
                <th className="px-5 py-3.5">Won Deals</th>
                <th className="px-5 py-3.5">Pipeline Value</th>
                <th className="px-5 py-3.5">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {userData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-text-muted">
                    No individual performance data available for this range.
                  </td>
                </tr>
              ) : (
                userData.map((u) => {
                  const rate = u.totalLeads > 0 ? Math.round((u.wonLeads / u.totalLeads) * 100) : 0
                  return (
                    <tr key={u._id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-text">{u.name || u.user?.name || 'Agent'}</td>
                      <td className="px-5 py-3.5">{u.totalLeads || 0}</td>
                      <td className="px-5 py-3.5 text-success font-semibold">{u.wonLeads || 0}</td>
                      <td className="px-5 py-3.5 font-mono">
                        {formatINR ? formatINR(u.totalAmount || 0) : `₹${u.totalAmount || 0}`}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-brand">{rate}%</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  )
}
