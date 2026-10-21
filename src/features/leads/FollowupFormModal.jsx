import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { DateTimeField } from '@/components/ui/DateTimeField'
import { FileDrop } from '@/components/ui/FileDrop'
import { VoiceRecorder } from '@/components/ui/VoiceRecorder'
import { Button } from '@/components/ui/Button'
import { useCategories } from '@/hooks/useMasters'
import { useFollowups } from '@/hooks/useFollowups'
import { computePolicy } from '@/lib/policy'
import { PhoneCall, Calendar, Paperclip, Mic, ShieldAlert, CheckCircle2 } from 'lucide-react'

export function FollowupFormModal({ open, onClose, lead, onSuccess }) {
  const { categories } = useCategories()
  const { createFollowup } = useFollowups()

  const [category, setCategory] = useState('')
  const [remarks, setRemarks] = useState('')
  const [nextFollowupDate, setNextFollowupDate] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Ensure default category is selected once categories load
  const selectedCategory = category || categories[0]?._id || ''

  // Live policy preview
  const policy = computePolicy({
    lastFollowupAt: lead?.lastFollowupAt,
    createdAt: lead?.createdAt,
    nextFollowupDate,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!remarks.trim() && !audioBlob) {
      alert('Please add remarks or record a voice note.')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('category', selectedCategory)
      formData.append('comment', remarks)
      formData.append('remarks', remarks)
      if (nextFollowupDate) {
        formData.append('nextFollowupDate', new Date(nextFollowupDate).toISOString())
      }
      if (audioBlob) {
        formData.append('files', audioBlob, 'voice-note.webm')
      }
      files.forEach((file) => {
        formData.append('files', file)
      })

      await createFollowup({ leadId: lead._id, formData })
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Log Followup: ${lead?.name || 'Lead'}`}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Policy indicator pill */}
        {policy && (
          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
              policy.status === 'inpolicy'
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-warn/10 text-warn border border-warn/20'
            }`}
          >
            {policy.status === 'inpolicy' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0" />
            )}
            <span>{policy.label}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Interaction Category"
            required
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}
            options={
              categories.length > 0
                ? categories.map((c) => ({ value: c._id, label: c.name }))
                : [
                    { value: 'Call', label: 'Call' },
                    { value: 'Meeting', label: 'Meeting' },
                    { value: 'WhatsApp', label: 'WhatsApp' },
                    { value: 'Email', label: 'Email' },
                  ]
            }
          />

          <DateTimeField
            label="Next Scheduled Followup"
            value={nextFollowupDate}
            onChange={setNextFollowupDate}
            placeholder="Pick date & time"
          />
        </div>

        <Textarea
          label="Discussion Remarks"
          required={!audioBlob}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Summary of conversation, key points discussed, client feedback..."
          rows={3}
        />

        {/* Voice Note Recorder */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5 flex items-center gap-1.5">
            <Mic className="h-3.5 w-3.5 text-brand" />
            Voice Note (Optional)
          </label>
          <VoiceRecorder onRecorded={setAudioBlob} />
        </div>

        {/* Attachment upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5 flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5 text-brand" />
            Attachments (Optional)
          </label>
          <FileDrop value={files} onChange={setFiles} maxFiles={3} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Saving Followup...' : 'Save Followup'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
