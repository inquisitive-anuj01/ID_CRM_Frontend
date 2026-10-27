import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/auth.store'
import { ChangePasswordModal } from '@/features/auth/ChangePasswordModal'
import { User, Mail, Shield, Calendar, KeyRound, Sparkles } from 'lucide-react'
import { fmtDateTime } from '@/lib/dates'

export function ProfilePage() {
  const { user, workspace } = useAuthStore()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  return (
    <Page>
      <PageHeader
        title="My Profile"
        marker="Account"
        description="View your account details and manage security settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 bg-surface border-border">
          <Avatar name={user?.name || 'User'} size="xl" className="h-20 w-20 text-2xl mb-4 bg-brand text-black font-bold ring-4 ring-brand/20" />
          <h2 className="text-xl font-bold text-text">{user?.name}</h2>
          <p className="text-xs text-text-muted mt-1">{user?.designation || 'Team Member'}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="brand" className="uppercase font-semibold">
              {user?.role || 'user'}
            </Badge>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-border space-y-3 text-left text-xs">
            <div className="flex items-center gap-2 text-text-muted">
              <Mail className="h-4 w-4 text-brand" />
              <span className="text-text font-medium truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Shield className="h-4 w-4 text-brand" />
              <span>Role: <strong className="text-text capitalize">{user?.role}</strong></span>
            </div>
            {user?.lastLoginAt && (
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar className="h-4 w-4 text-brand" />
                <span>Last login: {fmtDateTime ? fmtDateTime(user.lastLoginAt) : new Date(user.lastLoginAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Security & Settings Card */}
        <Card className="md:col-span-2 p-6 bg-surface border-border space-y-6">
          <div>
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand" />
              Security & Credentials
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Keep your account protected with a strong, updated password.
            </p>

            <div className="mt-4 p-4 rounded-xl border border-border bg-surface-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text">Password</p>
                <p className="text-[11px] text-text-muted">Last updated: Regularly recommended</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              Workspace Information
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-surface-2">
                <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">Company Workspace</span>
                <p className="mt-1 text-sm font-semibold text-text">{workspace?.name || 'Inquisitive Digital'}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface-2">
                <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">Workspace Slug</span>
                <p className="mt-1 text-sm font-semibold text-text font-mono">{workspace?.slug || 'inquisitive-digital'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </Page>
  )
}
