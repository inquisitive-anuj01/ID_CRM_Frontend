import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users.api'
import { qk } from '@/lib/queryKeys'
import { toast } from 'sonner'

export function useUsers(params = {}) {
  const qc = useQueryClient()

  const listQuery = useQuery({
    queryKey: qk.users.list(params),
    queryFn: () => usersApi.list(params),
    select: (res) => res.data || [],
  })

  const optionsQuery = useQuery({
    queryKey: qk.users.options,
    queryFn: () => usersApi.options ? usersApi.options() : usersApi.list({ limit: 100 }),
    select: (res) => res.data?.users || res.data || [],
  })

  const createMutation = useMutation({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to create user'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to update user'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      isActive ? usersApi.activate(id) : usersApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User status updated')
    },
    onError: (err) => toast.error(err.message || 'Failed to update user status'),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.resetPassword(id, data),
    onSuccess: () => {
      toast.success('Password reset successfully')
    },
    onError: (err) => toast.error(err.message || 'Failed to reset password'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted permanently from database')
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user'),
  })

  return {
    users: listQuery.data || [],
    userOptions: optionsQuery.data || [],
    isLoading: listQuery.isLoading,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    toggleActive: toggleActiveMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
  }
}
