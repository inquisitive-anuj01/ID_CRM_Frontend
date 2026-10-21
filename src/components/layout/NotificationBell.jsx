import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications.api'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from '@/components/ui/Dropdown'
import { fmtTimeAgo } from '@/lib/dates'
import { cn } from '@/lib/cn'

export function NotificationBell() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.unreadCount(),
    refetchInterval: 30000,
  })

  const { data: listData } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: () => notificationsApi.list({ limit: 5 }),
    enabled: open,
  })

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = data?.data?.unreadCount ?? data?.unreadCount ?? 0
  const notifications = listData?.data?.notifications ?? listData?.data ?? []

  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-black ring-2 ring-bg animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownTrigger>

      <DropdownContent align="end" className="w-80 p-0 shadow-xl bg-surface border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-text">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-text-muted">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  if (!n.isRead) markReadMutation.mutate(n._id)
                }}
                className={cn(
                  'flex flex-col gap-1 px-4 py-3 text-xs transition-colors cursor-pointer hover:bg-surface-2',
                  !n.isRead && 'bg-brand/5'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-text">{n.title}</span>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {fmtTimeAgo ? fmtTimeAgo(n.createdAt) : new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted line-clamp-2">{n.body || n.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border text-center">
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            View all notifications →
          </Link>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
