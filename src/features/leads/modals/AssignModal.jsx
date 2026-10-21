import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useUsers } from '@/hooks/useUsers'

export function AssignModal({ open, onClose, lead, onSubmit }) {
  const { userOptions } = useUsers()
  const [assignedTo, setAssignedTo] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (lead) {
      setAssignedTo(lead.assignedTo?._id || lead.assignedTo || '')
      setReason('')
    }
  }, [lead])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ userId: assignedTo, reason })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign Lead Owner">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Select
          label="Team Member"
          required
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={[
            { value: '', label: 'Select team member...' },
            ...userOptions.map((u) => ({ value: u._id, label: `${u.name} (${u.role})` })),
          ]}
        />

        <Textarea
          label="Reassignment Reason (Optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Territory handoff, specialized product requirement..."
          rows={2}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
