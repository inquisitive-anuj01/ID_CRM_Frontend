import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { useLabels } from '@/hooks/useMasters'

export function LabelsModal({ open, onClose, lead, onSubmit }) {
  const { labels } = useLabels()
  const [selectedLabels, setSelectedLabels] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (lead) {
      const ids =
        lead.labels?.map((l) => {
          if (typeof l === 'object' && l !== null) {
            return l.label?._id || l.label || l._id || l.id
          }
          return l
        }) || []
      setSelectedLabels(ids.filter(Boolean))
    }
  }, [lead])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        labels: selectedLabels.map((id) => ({ label: id, amount: 0 })),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Lead Labels">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5">
            Select Tags & Badges
          </label>
          <MultiSelect
            options={labels.map((l) => ({ value: l._id, label: l.name, color: l.color }))}
            value={selectedLabels}
            onChange={setSelectedLabels}
            placeholder="Choose tags..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Labels'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
