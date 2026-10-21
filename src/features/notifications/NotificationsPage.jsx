import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { notificationsApi } from '@/api/notifications.api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fmtDateTime, fmtTimeAgo } from '@/lib/dates'
import { Bell, CheckCheck, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'

export function NotificationsPage() {
  const qc = useQueryClient()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', { unreadOnly }],
    queryFn: () => notificationsApi.list({ unreadOnly }),
  })

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('All notifications marked as read')
    },
  })

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = data?.data?.notifications || data?.data || []

  return (
    <Page>
      <PageHeader
        title="Notifications Center"
        marker="Alerts"
        description="Real-time system updates, lead assignments, and SLA followup alerts"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              disabled={notifications.length === 0}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark All as Read
            </Button>
          </div>
        }
      />

      <div className="max-w-3xl space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="All caught up!"
            description="You have no unread notifications at this time."
          />
        ) : (
          notifications.map((n) => (
            <Card
              key={n._id}
              onClick={() => {
                if (!n.isRead) markReadMutation.mutate(n._id)
              }}
              className={`p-4 border-border transition-all cursor-pointer ${
                !n.isRead
                  ? 'bg-brand/5 border-brand/40 shadow-sm'
                  : 'bg-surface hover:bg-surface-2'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      !n.isRead ? 'bg-brand text-black' : 'bg-surface-2 text-text-muted'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-text">{n.title}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{n.body || n.message}</p>
                  </div>
                </div>

                <span className="text-[11px] text-text-muted shrink-0">
                  {fmtTimeAgo ? fmtTimeAgo(n.createdAt) : new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </Page>
  )
}
