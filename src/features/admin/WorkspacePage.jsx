import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/store/auth.store'
import { workspaceApi } from '@/api/workspace.api'
import { disconnectSocket } from '@/lib/socket'
import { Building2, Save, Trash2, AlertTriangle, Calendar, Users, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { fmtDateTime } from '@/lib/dates'

export function WorkspacePage() {
  const navigate = useNavigate()
  const { workspace, setWorkspace, logout } = useAuthStore()
  const [name, setName] = useState(workspace?.name || '')
  const [renaming, setRenaming] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (workspace?.name) {
      setName(workspace.name)
    }
  }, [workspace])

  const handleRename = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Workspace name cannot be empty')
      return
    }
    try {
      setRenaming(true)
      const res = await workspaceApi.rename({ name: name.trim() })
      const updated = res.data
      setWorkspace(updated)
      toast.success('Workspace renamed successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to rename workspace')
    } finally {
      setRenaming(false)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (confirmName !== workspace?.name) {
      toast.error('Workspace name does not match')
      return
    }
    try {
      setDeleting(true)
      await workspaceApi.delete()
      toast.success('Workspace and all data permanently deleted')
      disconnectSocket()
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Failed to delete workspace')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Page>
      <PageHeader
        title="Workspace Settings"
        marker="Settings"
        description="Manage company details, workspace identity, and organization controls"
      />

      <div className="max-w-4xl space-y-6">
        {/* Workspace Overview */}
        <Card className="border-border bg-surface p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="h-14 w-14 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">{workspace?.name || 'My Workspace'}</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Active multi-tenant organization workspace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-center gap-1.5 text-text-muted mb-1">
                <Hash className="h-3.5 w-3.5" />
                <span>Workspace Slug</span>
              </div>
              <p className="font-semibold text-text font-mono text-sm">{workspace?.slug || '—'}</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-center gap-1.5 text-text-muted mb-1">
                <Users className="h-3.5 w-3.5" />
                <span>Company Size</span>
              </div>
              <p className="font-semibold text-text text-sm">{workspace?.companySize || 'Not specified'}</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-center gap-1.5 text-text-muted mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created Date</span>
              </div>
              <p className="font-semibold text-text text-sm">
                {workspace?.createdAt ? fmtDateTime(workspace.createdAt) : '—'}
              </p>
            </div>
          </div>
        </Card>

        {/* Rename Workspace Form */}
        <Card className="border-border bg-surface p-6">
          <h3 className="text-base font-bold text-text mb-1">Rename Workspace</h3>
          <p className="text-xs text-text-muted mb-4">
            Change the display name of your company. This will update across all dashboards, headers, and team views.
          </p>

          <form onSubmit={handleRename} className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Company / Workspace Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new company name"
                required
              />
            </div>

            <Button type="submit" variant="solid" disabled={renaming}>
              <Save className="mr-1.5 h-4 w-4" />
              {renaming ? 'Saving Changes...' : 'Save Workspace Name'}
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger/30 bg-danger/5 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-danger">Danger Zone — Delete Workspace</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Permanently delete this entire workspace and all its data. All leads, customers, followups, notes,
                tasks, reminders, meetings, and team accounts will be strictly deleted from the database.
                <strong className="text-danger ml-1">This action cannot be undone.</strong>
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-danger/20 flex justify-end">
            <Button
              type="button"
              variant="solid"
              onClick={() => {
                setConfirmName('')
                setDeleteModalOpen(true)
              }}
              className="bg-danger hover:bg-danger-hover border-transparent shadow-none cursor-pointer"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete Entire Workspace
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Workspace Deletion"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-text-muted leading-relaxed">
            Please type <strong className="text-text selection:bg-brand selection:text-black">{workspace?.name}</strong> to confirm you want to permanently delete this workspace and all associated database records:
          </p>

          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Type company name exactly"
            className="border-danger/40 focus:border-danger"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="solid"
              disabled={confirmName !== workspace?.name || deleting}
              onClick={handleDeleteWorkspace}
              className="bg-danger text-white hover:bg-danger-hover border-transparent"
            >
              {deleting ? 'Deleting Workspace...' : 'Delete Everything & Exit'}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}
