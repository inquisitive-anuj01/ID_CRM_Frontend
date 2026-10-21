import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard } from './LeadCard'
import { useStatuses } from '@/hooks/useMasters'
import { leadsApi } from '@/api/leads.api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const DEFAULT_STATUSES = [
  { key: 'new', name: 'New', color: '#3B82F6' },
  { key: 'processing', name: 'Processing', color: '#EAB308' },
  { key: 'visited', name: 'Visited', color: '#F97316' },
  { key: 'confirm', name: 'Confirm', color: '#10B981' },
  { key: 'cancel', name: 'Cancel', color: '#EF4444' },
]

export function KanbanBoard({
  boardData = [],
  isLoading = false,
  onLeadClick,
  onStatusModalRequired,
  onAddLeadWithStatus,
}) {
  const qc = useQueryClient()
  const { statuses = [] } = useStatuses()
  const [activeLead, setActiveLead] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Use loaded statuses, or board data statuses, or default CRM statuses
  let columnsList = []
  if (statuses.length > 0) {
    columnsList = statuses
  } else if (boardData.length > 0) {
    columnsList = boardData.map((b) =>
      typeof b.status === 'object' ? b.status : { key: b.status, name: b.status }
    )
  } else {
    columnsList = DEFAULT_STATUSES
  }

  const handleDragStart = (event) => {
    const { active } = event
    const lead = active.data?.current?.lead
    if (lead) {
      setActiveLead(lead)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveLead(null)
    if (!over) return

    const leadId = active.id
    const targetStatusKey = over.id

    // Locate the lead
    let foundLead = active.data?.current?.lead
    if (!foundLead) {
      for (const col of boardData) {
        const match = col.leads?.find((l) => l._id === leadId)
        if (match) {
          foundLead = match
          break
        }
      }
    }

    if (!foundLead) return
    const currentStatus = foundLead.status?.key || foundLead.status
    if (currentStatus === targetStatusKey) return

    // If moving to cancel/lost, trigger terminal reason modal
    if (targetStatusKey === 'cancel' || targetStatusKey === 'lost') {
      if (onStatusModalRequired) {
        onStatusModalRequired(foundLead, targetStatusKey)
        return
      }
    }

    try {
      await leadsApi.status(leadId, { status: targetStatusKey })
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Lead moved to ${targetStatusKey.toUpperCase()}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
        {columnsList.map((status, idx) => {
          // Robust matching: handles when b.status is string or object
          const colData = boardData.find(
            (b) =>
              (b.status?.key || b.status || b._id) === status.key ||
              (b.status?.key || b.status || b._id) === status._id
          )
          const leads = colData?.leads || []

          return (
            <KanbanColumn
              key={status.key || status._id || idx}
              status={status}
              index={idx + 1}
              leads={leads}
              onLeadClick={onLeadClick}
              onAddLead={onAddLeadWithStatus}
            />
          )
        })}
      </div>

      {/* Floating preview while dragging */}
      <DragOverlay>
        {activeLead ? (
          <div className="w-72 sm:w-80 pointer-events-none">
            <LeadCard lead={activeLead} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
