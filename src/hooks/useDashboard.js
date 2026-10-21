import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.api'
import { qk } from '@/lib/queryKeys'

export function useDashboard(params = {}) {
  const summaryQuery = useQuery({
    queryKey: qk.dashboard.summary(params),
    queryFn: () => dashboardApi.summary(params),
    select: (res) => res.data || {},
  })

  const schedulesQuery = useQuery({
    queryKey: ['dashboard', 'schedules', params],
    queryFn: () => dashboardApi.schedules(params),
    select: (res) => res.data || [],
  })

  return {
    summary: summaryQuery.data || {},
    schedules: schedulesQuery.data || [],
    isLoading: summaryQuery.isLoading || schedulesQuery.isLoading,
    refetch: () => {
      summaryQuery.refetch()
      schedulesQuery.refetch()
    },
  }
}

export function useDashboardLeads(status, params = {}) {
  return useQuery({
    queryKey: qk.dashboard.leads(status, params),
    queryFn: () => dashboardApi.leads({ status, ...params }),
    enabled: Boolean(status),
    select: (res) => res.data || [],
  })
}
