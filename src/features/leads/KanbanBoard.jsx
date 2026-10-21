import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { useStatuses } from '@/hooks/useMasters'
import { leadsApi } from '@/api/leads.api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function KanbanBoard({ boardData = [], onLeadClick, onStatusModalRequired }) {
  const qc = useQueryClient()
  const { statuses } = useStatuses()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over) return

    const leadId = active.id
    const targetStatusKey = over.id

    // Find the lead in boardData
    let foundLead = null
    for (const col of boardData) {
      const match = col.leads?.find((l) => l._id === leadId)
      if (match) {
        foundLead = match
        break
      }
    }

    if (!foundLead) return
    const currentStatus = foundLead.status?.key || foundLead.status
    if (currentStatus === targetStatusKey) return

    // If moving to cancel/lost, require reason modal
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
      toast.success('Lead status moved')
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {statuses.map((status) => {
          const colData = boardData.find((b) => b.status === status.key || b._id === status.key)
          const leads = colData?.leads || []

          return (
            <KanbanColumn
              key={status.key}
              status={status}
              leads={leads}
              onLeadClick={onLeadClick}
            />
          )
        })}
      </div>
    </DndContext>
  )
}
