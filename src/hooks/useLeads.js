import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '@/api/leads.api'
import { qk } from '@/lib/queryKeys'
import { toast } from 'sonner'

export function useLeads(params = {}) {
  const qc = useQueryClient()

  const listQuery = useQuery({
    queryKey: qk.leads.list(params),
    queryFn: () => leadsApi.list(params),
    select: (res) => ({
      leads: res.data?.leads || res.data || [],
      meta: res.meta || {},
    }),
  })

  return {
    leads: listQuery.data?.leads || [],
    meta: listQuery.data?.meta || {},
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    refetch: listQuery.refetch,
  }
}

export function useLeadsBoard(params = {}) {
  const boardQuery = useQuery({
    queryKey: qk.leads.board(params),
    queryFn: () => leadsApi.board(params),
    select: (res) => res.data || [],
  })

  return {
    columns: boardQuery.data || [],
    isLoading: boardQuery.isLoading,
    isFetching: boardQuery.isFetching,
    refetch: boardQuery.refetch,
  }
}

export function useLead(id) {
  const qc = useQueryClient()

  const leadQuery = useQuery({
    queryKey: qk.leads.one(id),
    queryFn: () => leadsApi.one(id),
    enabled: Boolean(id),
    select: (res) => res.data,
  })

  const updateMutation = useMutation({
    mutationFn: (data) => leadsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads.one(id) })
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update lead'),
  })

  const updateStatusMutation = useMutation({
    mutationFn: (data) => leadsApi.status(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads.one(id) })
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Status updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  })

  const assignMutation = useMutation({
    mutationFn: (data) => leadsApi.assign(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads.one(id) })
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead reassigned')
    },
    onError: (err) => toast.error(err.message || 'Failed to reassign lead'),
  })

  const updateLabelsMutation = useMutation({
    mutationFn: (data) => leadsApi.labels(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads.one(id) })
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Labels updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update labels'),
  })

  const updateRatingMutation = useMutation({
    mutationFn: (data) => leadsApi.rating(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads.one(id) })
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Rating updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update rating'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete lead'),
  })

  return {
    lead: leadQuery.data,
    isLoading: leadQuery.isLoading,
    updateLead: updateMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    assignLead: assignMutation.mutateAsync,
    updateLabels: updateLabelsMutation.mutateAsync,
    updateRating: updateRatingMutation.mutateAsync,
    deleteLead: deleteMutation.mutateAsync,
  }
}

export function useLeadFollowups(leadId) {
  return useQuery({
    queryKey: qk.leads.followups(leadId),
    queryFn: () => leadsApi.followups(leadId),
    enabled: Boolean(leadId),
    select: (res) => res.data || [],
  })
}

export function useLeadHistory(leadId) {
  return useQuery({
    queryKey: qk.leads.history(leadId),
    queryFn: () => leadsApi.history(leadId),
    enabled: Boolean(leadId),
    select: (res) => res.data || [],
  })
}

export function useLeadMutations() {
  const qc = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data) => leadsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Lead created successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to create lead'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => leadsApi.update(id, data),
    onSuccess: (res, vars) => {
      // Invalidate the specific lead AND all list/board queries
      const updatedId = res?.data?._id || vars?.id
      if (updatedId) {
        qc.invalidateQueries({ queryKey: qk.leads.one(updatedId) })
        qc.invalidateQueries({ queryKey: ['lead', updatedId] })
      }
      qc.invalidateQueries({ queryKey: ['lead'] })
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Lead updated successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to update lead'),
  })

  const bulkAssignMutation = useMutation({
    mutationFn: (data) => leadsApi.bulkAssign(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Leads assigned successfully')
    },
    onError: (err) => toast.error(err.message || 'Bulk assignment failed'),
  })

  const bulkStatusMutation = useMutation({
    mutationFn: (data) => leadsApi.bulkStatus(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Leads status updated')
    },
    onError: (err) => toast.error(err.message || 'Bulk status update failed'),
  })

  return {
    createLead: createMutation.mutateAsync,
    updateLead: updateMutation.mutateAsync,
    bulkAssign: bulkAssignMutation.mutateAsync,
    bulkStatus: bulkStatusMutation.mutateAsync,
  }
}
