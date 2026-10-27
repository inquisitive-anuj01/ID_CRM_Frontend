import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUsers } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/auth.store'
import { UserFormModal } from './UserFormModal'
import { Modal } from '@/components/ui/Modal'
import { Plus, Search, Edit2, ShieldAlert, CheckCircle2, XCircle, KeyRound, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function UsersPage() {
  const { user: currentUser } = useAuthStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [resetModalUser, setResetModalUser] = useState(null)
  const [deleteModalUser, setDeleteModalUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { users, isLoading, createUser, updateUser, toggleActive, resetPassword, deleteUser } = useUsers()

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    )
  })

  const handleOpenAdd = () => {
    setSelectedUser(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleSave = async (data) => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser._id, data })
      } else {
        await createUser(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      setResetting(true)
      await resetPassword({ id: resetModalUser._id, data: { newPassword } })
      setResetModalUser(null)
      setNewPassword('')
    } catch (err) {
      console.error(err)
    } finally {
      setResetting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return
    try {
      setDeleting(true)
      await deleteUser(deleteModalUser._id)
      setDeleteModalUser(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Page>
      <PageHeader
        title="Team Members"
        marker="Users"
        description="Manage workspace users, roles, and permissions"
        actions={
          <Button variant="solid" onClick={handleOpenAdd}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Member
          </Button>
        }
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or role..."
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
        <div className="text-xs text-text-muted">
          Total: <strong className="text-text">{filteredUsers.length}</strong> members
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No members found"
          description={search ? 'No users match your search criteria.' : 'Start by inviting team members to your CRM.'}
          action={
            <Button variant="outline" size="sm" onClick={handleOpenAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add User
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden border-border bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Designation</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => {
                  const isSelf = currentUser?._id === u._id
                  return (
                    <tr key={u._id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="font-semibold text-text flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-medium">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={u.role === 'admin' ? 'brand' : 'default'} className="uppercase">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {u.designation || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleOpenEdit(u)}
                            aria-label="Edit"
                            title="Edit User"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setResetModalUser(u)
                              setNewPassword('')
                            }}
                            aria-label="Reset Password"
                            title="Reset Password"
                            className="text-text-muted hover:text-brand"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={u.isActive ? 'ghost' : 'outline'}
                            size="xs"
                            disabled={isSelf}
                            onClick={() => toggleActive({ id: u._id, isActive: !u.isActive })}
                            className={u.isActive ? 'text-danger hover:bg-danger/10' : 'text-success'}
                            title={isSelf ? 'Cannot deactivate yourself' : (u.isActive ? 'Deactivate User' : 'Activate User')}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          {!isSelf && (
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setDeleteModalUser(u)}
                              aria-label="Delete User"
                              title="Delete User Permanently"
                              className="text-danger hover:bg-danger/15 hover:text-danger"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-danger" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        user={selectedUser}
      />

      {/* Reset Password Modal */}
      <Modal
        open={Boolean(resetModalUser)}
        onClose={() => setResetModalUser(null)}
        title={`Reset Password: ${resetModalUser?.name || ''}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
          <p className="text-xs text-text-muted">
            Enter a new password for <strong className="text-text">{resetModalUser?.email}</strong>.
          </p>
          <Input
            label="New Password"
            type="password"
            required
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setResetModalUser(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="solid" disabled={resetting}>
              {resetting ? 'Resetting...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        open={Boolean(deleteModalUser)}
        onClose={() => setDeleteModalUser(null)}
        title="Delete Team Member"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-danger" />
            <div>
              <p className="font-semibold text-danger">Strict Database Deletion</p>
              <p className="text-danger/90 mt-0.5 leading-relaxed">
                This action is permanent and will strictly delete{' '}
                <strong className="text-white">{deleteModalUser?.name}</strong> ({deleteModalUser?.email}) from the database.
                Any active leads assigned to this user will be reassigned to you.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteModalUser(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="solid"
              disabled={deleting}
              onClick={handleDeleteUser}
              className="bg-danger text-white hover:bg-danger-hover border-transparent"
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}
