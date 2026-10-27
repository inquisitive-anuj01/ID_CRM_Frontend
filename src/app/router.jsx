import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { LeadsPage } from '@/features/leads/LeadsPage'
import { MyFollowupsPage } from '@/features/followups/MyFollowupsPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { UsersPage } from '@/features/admin/UsersPage'
import { MastersPage } from '@/features/admin/MastersPage'
import { SettingsPage } from '@/features/admin/SettingsPage'
import { ImportPage } from '@/features/admin/ImportPage'
import { WorkspacePage } from '@/features/admin/WorkspacePage'
import { GenericModulePage } from '@/features/phase2/GenericModulePage'
import { CustomersPage } from '@/features/customers/CustomersPage'
import { ForbiddenPage } from '@/features/misc/ForbiddenPage'
import { NotFoundPage } from '@/features/misc/NotFoundPage'
import { useAuthStore } from '@/store/auth.store'
import { isAdmin } from '@/lib/permissions'

function ProtectedRoute({ children }) {
  const { token } = useAuthStore()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AdminRoute({ children }) {
  const { user } = useAuthStore()
  if (!isAdmin(user)) {
    return <ForbiddenPage />
  }
  return children
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'leads',
        element: <LeadsPage />,
      },
      {
        path: 'followups',
        element: <MyFollowupsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },

      // Admin routes
      {
        path: 'admin/workspace',
        element: (
          <AdminRoute>
            <WorkspacePage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/masters',
        element: (
          <AdminRoute>
            <MastersPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/import',
        element: (
          <AdminRoute>
            <ImportPage />
          </AdminRoute>
        ),
      },

      // Phase 2 routes
      {
        path: 'tasks',
        element: <GenericModulePage title="Team Tasks" marker="Tasks" description="Delegate and track customer sales tasks" endpoint="/tasks" />,
      },
      {
        path: 'todos',
        element: <GenericModulePage title="My To-Do List" marker="Todos" description="Personal checklist and daily reminders" endpoint="/todos" />,
      },
      {
        path: 'notes',
        element: <GenericModulePage title="Workspace Notes" marker="Notes" description="Scratchpad for customer ideas and strategy" endpoint="/notes" />,
      },
      {
        path: 'reminders',
        element: <GenericModulePage title="Reminders" marker="Alerts" description="Time-sensitive call and deal reminders" endpoint="/reminders" />,
      },
      {
        path: 'meetings',
        element: <GenericModulePage title="Client Meetings" marker="Meet" description="Virtual and on-site client presentations" endpoint="/meetings" />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'calendar',
        element: <GenericModulePage title="Schedule Calendar" marker="Planner" description="Monthly view of meetings and followups" endpoint="/calendar" />,
      },

      // Error routes
      {
        path: '403',
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
