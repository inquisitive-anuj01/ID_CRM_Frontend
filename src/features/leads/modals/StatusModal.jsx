import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useStatuses } from '@/hooks/useMasters'

export function StatusModal({ open, onClose, lead, onSubmit }) {
  const { statuses } = useStatuses()
  const [status, setStatus] = useState('')
  const [lossReason, setLossReason] = useState('')
  const [lossRemarks, setLossRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (lead) {
      setStatus(lead.status?.key || lead.status || 'new')
      setLossReason(lead.lossReason || '')
      setLossRemarks(lead.lossRemarks || '')
    }
  }, [lead])

  const isTerminalLost = status === 'cancel' || status === 'lost'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { status }
      if (isTerminalLost) {
        payload.cancelReason = lossRemarks ? `${lossReason}: ${lossRemarks}` : lossReason
      }
      await onSubmit(payload)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Update Lead Status">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Select
          label="Pipeline Stage / Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statuses.map((s) => ({ value: s.key, label: s.name }))}
        />

        {isTerminalLost && (
          <>
            <Select
              label="Loss / Cancellation Reason"
              required
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
              options={[
                { value: '', label: 'Select reason...' },
                { value: 'High Price', label: 'Budget / High Price' },
                { value: 'Competitor Chosen', label: 'Competitor Chosen' },
                { value: 'No Requirement', label: 'No Requirement / Dropped' },
                { value: 'Unresponsive', label: 'Unresponsive / Not Reachable' },
                { value: 'Other', label: 'Other Reason' },
              ]}
            />

            <Textarea
              label="Loss Remarks"
              value={lossRemarks}
              onChange={(e) => setLossRemarks(e.target.value)}
              placeholder="Provide extra details on why the client canceled..."
              rows={2}
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
