import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { LeadFilters } from './LeadFilters'
import { LeadTable } from './LeadTable'
import { KanbanBoard } from './KanbanBoard'
import { LeadDrawer } from './LeadDrawer'
import { LeadDetailModal } from './modals/LeadDetailModal'
import { LeadFormModal } from './LeadFormModal'
import { AssignModal } from './modals/AssignModal'
import { StatusModal } from './modals/StatusModal'
import { useLeads, useLeadsBoard, useLeadMutations } from '@/hooks/useLeads'
import { useUIStore } from '@/store/ui.store'
import { leadsApi } from '@/api/leads.api'
import {
  Plus,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Users,
  CheckSquare,
  X,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'

export function LeadsPage() {
  const { setLeadsViewMode } = useUIStore()

  // Default to 'table', persist in localStorage and sync with store
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('idcrm_leads_view') || 'table'
    } catch {
      return 'table'
    }
  })

  const handleViewChange = (mode) => {
    setViewMode(mode)
    try {
      localStorage.setItem('idcrm_leads_view', mode)
    } catch {}
    if (typeof setLeadsViewMode === 'function') {
      setLeadsViewMode(mode)
    }
  }

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    assignedTo: '',
    page: 1,
    limit: 25,
  })

  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createInitialData, setCreateInitialData] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  // Bulk modals
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false)

  // Status modal trigger for drag & drop terminal lost
  const [dragStatusTarget, setDragStatusTarget] = useState(null)

  const { leads, meta, isLoading, refetch } = useLeads(filters)
  const { columns: boardData, isLoading: boardLoading, refetch: refetchBoard } = useLeadsBoard(filters)
  const { bulkAssign, bulkStatus } = useLeadMutations()

  const handleLeadClick = (lead) => {
    setSelectedLeadId(lead._id)
    setDrawerOpen(true)
  }

  const handleAddLeadWithStatus = (statusKey) => {
    setCreateInitialData({ status: statusKey })
    setCreateModalOpen(true)
  }

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(leads.map((l) => l._id))
    }
  }

  const handleExport = async () => {
    try {
      const res = await leadsApi.export(filters)
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'leads-export.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Leads spreadsheet exported')
    } catch {
      toast.error('Export failed')
    }
  }

  const handleBulkAssign = async ({ assignedTo }) => {
    await bulkAssign({ ids: selectedIds, userId: assignedTo })
    setSelectedIds([])
    setBulkAssignOpen(false)
  }

  const handleBulkStatus = async ({ status }) => {
    await bulkStatus({ ids: selectedIds, status })
    setSelectedIds([])
    setBulkStatusOpen(false)
  }

  return (
    <Page>
      <PageHeader
        title="Lead Management"
        marker="Pipeline"
        description="Monitor pipeline conversion, schedule followups, and close deals"
        actions={
          <div className="flex items-center gap-2">
            {/* View Switcher: Table vs Kanban */}
            <div className="flex items-center rounded-xl border border-border bg-surface-2 p-1 gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => handleViewChange('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-brand text-black shadow-sm font-black'
                    : 'text-text-muted hover:text-text hover:bg-surface'
                }`}
                aria-label="Table View"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-brand text-black shadow-sm font-black'
                    : 'text-text-muted hover:text-text hover:bg-surface'
                }`}
                aria-label="Kanban View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Kanban</span>
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:inline-flex">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>

            <Button variant="solid" size="sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="mb-6 space-y-4">
        <LeadFilters
          filters={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              search: '',
              status: '',
              source: '',
              assignedTo: '',
              page: 1,
              limit: 25,
            })
          }
        />

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand/10 border border-brand/30 text-xs animate-in fade-in">
            <span className="font-bold text-text">
              {selectedIds.length} lead{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" onClick={() => setBulkAssignOpen(true)}>
                <Users className="h-3.5 w-3.5 mr-1" />
                Assign Owner
              </Button>
              <Button size="xs" variant="outline" onClick={() => setBulkStatusOpen(true)}>
                <CheckSquare className="h-3.5 w-3.5 mr-1" />
                Update Status
              </Button>
              <Button size="xs" variant="ghost" onClick={() => setSelectedIds([])}>
                <X className="h-3.5 w-3.5 mr-1" />
                Deselect
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        <div className="space-y-6">
          {/* Jira-style Kanban Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total</span>
              <p className="text-2xl font-black text-text mt-1">{meta?.total || leads.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Done</span>
              <p className="text-2xl font-black text-emerald-500 mt-1">
                {boardData.find((c) => ['won', 'confirm', 'done'].includes(c.status?.key || c.status))?.leads?.length || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Overdue</span>
              <p className="text-2xl font-black text-rose-500 mt-1">
                {leads.filter((l) => l.overdueMinutes > 0 || (l.nextFollowupDate && new Date(l.nextFollowupDate) < new Date())).length}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">In Progress</span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {boardData.find((c) => ['in_progress', 'processing', 'contacted', 'visited'].includes(c.status?.key || c.status))?.leads?.length || 0}
              </p>
            </div>
          </div>

          {/* Kanban Board */}
          <KanbanBoard
            boardData={boardData}
            isLoading={boardLoading}
            onLeadClick={handleLeadClick}
            onAddLeadWithStatus={handleAddLeadWithStatus}
            onStatusModalRequired={(lead, targetStatus) => {
              setDragStatusTarget({ lead, targetStatus })
            }}
          />
        </div>
      ) : (
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
          onLeadClick={handleLeadClick}
          onAddLead={() => {
            setCreateInitialData(null)
            setCreateModalOpen(true)
          }}
        />
      )}

      {/* Lead Details Drawer (Desktop: Right Sidebar, Mobile: Bottom Drawer) */}
      {selectedLeadId && (
        <LeadDrawer
          leadId={selectedLeadId}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedLeadId(null)
          }}
        />
      )}

      {/* Create Lead Modal */}
      <LeadFormModal
        open={createModalOpen}
        initialData={createInitialData}
        onClose={() => {
          setCreateModalOpen(false)
          setCreateInitialData(null)
        }}
        onSuccess={() => {
          refetch()
          refetchBoard()
        }}
      />

      {/* Bulk Modals */}
      <AssignModal
        open={bulkAssignOpen}
        onClose={() => setBulkAssignOpen(false)}
        onSubmit={handleBulkAssign}
      />

      <StatusModal
        open={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        onSubmit={handleBulkStatus}
      />
    </Page>
  )
}
