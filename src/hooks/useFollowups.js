import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { followupsApi } from '@/api/followups.api'
import { qk } from '@/lib/queryKeys'
import { toast } from 'sonner'

export function useFollowups(params = {}) {
  const qc = useQueryClient()

  // Map frontend `filter` param to backend `when` param
  const apiParams = params.filter ? { ...params, when: params.filter, filter: undefined } : params

  const query = useQuery({
    queryKey: qk.followups.mine(params),
    queryFn: () => followupsApi.mine(apiParams),
    select: (res) => {
      const raw = res.data
      // Backend may return array or { followups, counts }
      const list = Array.isArray(raw) ? raw : (raw?.followups || raw?.items || [])
      const counts = raw?.counts || {}
      return { followups: list, counts }
    },
  })

  const createMutation = useMutation({
    mutationFn: ({ leadId, formData }) => followupsApi.create(leadId, formData),
    onSuccess: (_, { leadId }) => {
      qc.invalidateQueries({ queryKey: qk.followups.mine(params) })
      qc.invalidateQueries({ queryKey: qk.leads.followups(leadId) })
      qc.invalidateQueries({ queryKey: qk.leads.one(leadId) })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Followup logged successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to log followup'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData, leadId }) => followupsApi.update(id, formData),
    onSuccess: (_, { leadId }) => {
      qc.invalidateQueries({ queryKey: qk.followups.mine(params) })
      if (leadId) {
        qc.invalidateQueries({ queryKey: qk.leads.followups(leadId) })
        qc.invalidateQueries({ queryKey: qk.leads.one(leadId) })
      }
      toast.success('Followup updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update followup'),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, leadId }) => followupsApi.delete(id),
    onSuccess: (_, { leadId }) => {
      qc.invalidateQueries({ queryKey: qk.followups.mine(params) })
      if (leadId) qc.invalidateQueries({ queryKey: qk.leads.followups(leadId) })
      toast.success('Followup deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete followup'),
  })

  return {
    followups: query.data?.followups || [],
    counts: query.data?.counts || {},
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    createFollowup: createMutation.mutateAsync,
    updateFollowup: updateMutation.mutateAsync,
    deleteFollowup: deleteMutation.mutateAsync,
  }
}
