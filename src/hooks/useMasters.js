import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mastersApi } from '@/api/masters.api'
import { settingsApi } from '@/api/settings.api'
import { qk } from '@/lib/queryKeys'
import { toast } from 'sonner'

export function useStatuses(includeAll = false) {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: [...qk.masters.statuses, { includeAll }],
    queryFn: () => mastersApi.statuses({ all: includeAll }),
    select: (res) => res.data || [],
  })

  const createMutation = useMutation({
    mutationFn: (data) => mastersApi.createStatus(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.statuses })
      toast.success('Status created successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to create status'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mastersApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.statuses })
      toast.success('Status updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mastersApi.deleteStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.statuses })
      toast.success('Status deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete status'),
  })

  const reorderMutation = useMutation({
    mutationFn: (order) => mastersApi.reorderStatuses({ order }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.statuses })
      toast.success('Statuses reordered')
    },
    onError: (err) => toast.error(err.message || 'Failed to reorder statuses'),
  })

  return {
    statuses: query.data || [],
    isLoading: query.isLoading,
    createStatus: createMutation.mutateAsync,
    updateStatus: updateMutation.mutateAsync,
    deleteStatus: deleteMutation.mutateAsync,
    reorderStatuses: reorderMutation.mutateAsync,
  }
}

export function useSources() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: qk.masters.sources,
    queryFn: () => mastersApi.sources(),
    select: (res) => res.data || [],
  })

  const createMutation = useMutation({
    mutationFn: (data) => mastersApi.createSource(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.sources })
      toast.success('Source created')
    },
    onError: (err) => toast.error(err.message || 'Failed to create source'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mastersApi.updateSource(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.sources })
      toast.success('Source updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update source'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mastersApi.deleteSource(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.sources })
      toast.success('Source deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete source'),
  })

  return {
    sources: query.data || [],
    isLoading: query.isLoading,
    createSource: createMutation.mutateAsync,
    updateSource: updateMutation.mutateAsync,
    deleteSource: deleteMutation.mutateAsync,
  }
}

export function useLabels() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: qk.masters.labels,
    queryFn: () => mastersApi.labels(),
    select: (res) => res.data || [],
  })

  const createMutation = useMutation({
    mutationFn: (data) => mastersApi.createLabel(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.labels })
      toast.success('Label created')
    },
    onError: (err) => toast.error(err.message || 'Failed to create label'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mastersApi.updateLabel(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.labels })
      toast.success('Label updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update label'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mastersApi.deleteLabel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.labels })
      toast.success('Label deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete label'),
  })

  return {
    labels: query.data || [],
    isLoading: query.isLoading,
    createLabel: createMutation.mutateAsync,
    updateLabel: updateMutation.mutateAsync,
    deleteLabel: deleteMutation.mutateAsync,
  }
}

export function useCategories() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: qk.masters.categories,
    queryFn: () => mastersApi.categories(),
    select: (res) => res.data || [],
  })

  const createMutation = useMutation({
    mutationFn: (data) => mastersApi.createCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.categories })
      toast.success('Category created')
    },
    onError: (err) => toast.error(err.message || 'Failed to create category'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mastersApi.updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.categories })
      toast.success('Category updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mastersApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.masters.categories })
      toast.success('Category deleted')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete category'),
  })

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
  }
}

export function useSettings() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: qk.settings,
    queryFn: () => settingsApi.get(),
    select: (res) => res.data || {},
  })

  const updateMutation = useMutation({
    mutationFn: (data) => settingsApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.settings })
      toast.success('Settings updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update settings'),
  })

  return {
    settings: query.data || {},
    isLoading: query.isLoading,
    updateSettings: updateMutation.mutateAsync,
  }
}
