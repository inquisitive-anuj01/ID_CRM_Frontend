import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { DateTimeField } from '@/components/ui/DateTimeField'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import http from '@/api/http'
import {
  Plus,
  CheckCircle2,
  Trash2,
  Clock,
  AlarmClock,
  CalendarDays,
  StickyNote,
} from 'lucide-react'
import { toast } from 'sonner'
import { fmtDateTime } from '@/lib/dates'

// ─── Per-module form components ──────────────────────────────────────────────

function TaskForm({ onClose, onSaved }) {
  const { user } = useAuthStore()
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: user?._id || '',
  })
  const { data: users = [] } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => http.get('/users'),
    select: (r) => r.data?.users || (Array.isArray(r.data) ? r.data : []),
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4">
      <Input label="Task Title *" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Enter task title…" />
      <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Optional details…" />
      <div className="grid grid-cols-2 gap-3">
        <DateTimeField label="Due Date *" value={form.dueDate} onChange={(v) => set('dueDate', v)} />
        <Select
          label="Priority"
          value={form.priority}
          onChange={(e) => set('priority', e.target.value)}
          options={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
      </div>
      {users.length > 0 && (
        <Select
          label="Assign To *"
          value={form.assignedTo}
          onChange={(e) => set('assignedTo', e.target.value)}
          options={users.map((u) => ({ value: u._id, label: u.name }))}
        />
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button
          variant="solid"
          disabled={!form.title || !form.dueDate}
          onClick={() => onSaved({ ...form, dueDate: new Date(form.dueDate).toISOString() })}
        >
          Save Task
        </Button>
      </div>
    </div>
  )
}

function NoteForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', content: '', color: '#FEF08A' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const colors = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FED7AA', '#F5D0FE']
  return (
    <div className="space-y-4">
      <Input label="Note Title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Optional title…" />
      <Textarea label="Content *" value={form.content} onChange={(e) => set('content', e.target.value)} rows={4} placeholder="Write your note here…" />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">Color</label>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button key={c} type="button" onClick={() => set('color', c)}
              className={`h-7 w-7 rounded-full border-2 transition-all ${form.color === c ? 'border-brand scale-110' : 'border-transparent'}`}
              style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="solid" disabled={!form.content} onClick={() => onSaved(form)}>Save Note</Button>
      </div>
    </div>
  )
}

function ReminderForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', remindAt: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <div className="space-y-4">
      <Input label="Reminder Title *" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="What do you need to remember?" />
      <DateTimeField label="Remind At *" value={form.remindAt} onChange={(v) => set('remindAt', v)} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="solid" disabled={!form.title || !form.remindAt}
          onClick={() => onSaved({ ...form, remindAt: new Date(form.remindAt).toISOString() })}>
          Set Reminder
        </Button>
      </div>
    </div>
  )
}

function MeetingForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', startAt: '', endAt: '', location: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <div className="space-y-4">
      <Input label="Meeting Title *" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Meeting subject…" />
      <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Agenda or notes…" />
      <div className="grid grid-cols-2 gap-3">
        <DateTimeField label="Start Time *" value={form.startAt} onChange={(v) => set('startAt', v)} />
        <DateTimeField label="End Time *" value={form.endAt} onChange={(v) => set('endAt', v)} />
      </div>
      <Input label="Location / Link" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Address or Zoom/Meet link…" />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="solid" disabled={!form.title || !form.startAt || !form.endAt}
          onClick={() => onSaved({ ...form, startAt: new Date(form.startAt).toISOString(), endAt: new Date(form.endAt).toISOString() })}>
          Schedule Meeting
        </Button>
      </div>
    </div>
  )
}

function TodoForm({ onClose, onSaved }) {
  const [title, setTitle] = useState('')
  return (
    <div className="space-y-4">
      <Input label="Todo *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="solid" disabled={!title} onClick={() => onSaved({ title })}>Add Todo</Button>
      </div>
    </div>
  )
}

// ─── Module config ────────────────────────────────────────────────────────────

const FORMS = {
  '/tasks': TaskForm,
  '/notes': NoteForm,
  '/reminders': ReminderForm,
  '/meetings': MeetingForm,
  '/todos': TodoForm,
}

function getItemLabel(item, endpoint) {
  if (endpoint === '/notes') return item.title || item.content?.slice(0, 60) || 'Untitled'
  return item.title || item.name || 'Untitled'
}

function getItemMeta(item, endpoint) {
  if (endpoint === '/tasks') return item.dueDate ? `Due: ${fmtDateTime ? fmtDateTime(item.dueDate) : new Date(item.dueDate).toLocaleDateString()}` : ''
  if (endpoint === '/notes') return item.content?.slice(0, 80) || ''
  if (endpoint === '/reminders') return item.remindAt ? `At: ${fmtDateTime ? fmtDateTime(item.remindAt) : new Date(item.remindAt).toLocaleString()}` : ''
  if (endpoint === '/meetings') return item.startAt ? `${fmtDateTime ? fmtDateTime(item.startAt) : new Date(item.startAt).toLocaleString()}${item.location ? ' · ' + item.location : ''}` : ''
  return item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
}

function getIcon(endpoint) {
  if (endpoint === '/tasks') return <Clock className="h-4 w-4 text-brand" />
  if (endpoint === '/notes') return <StickyNote className="h-4 w-4 text-yellow-500" />
  if (endpoint === '/reminders') return <AlarmClock className="h-4 w-4 text-orange-400" />
  if (endpoint === '/meetings') return <CalendarDays className="h-4 w-4 text-purple-400" />
  return <CheckCircle2 className="h-4 w-4 text-text-muted" />
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function GenericModulePage({ title, marker, description, endpoint }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)

  const { data: items = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => http.get(endpoint),
    select: (res) => res.data?.items || (Array.isArray(res.data) ? res.data : []),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => http.post(endpoint, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoint] })
      setModalOpen(false)
      toast.success(`${marker} created`)
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoint] })
      toast.success('Deleted')
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isDone }) => http.patch(`${endpoint}/${id}`, { isDone }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  })

  const FormComponent = FORMS[endpoint] || TodoForm

  return (
    <Page>
      <PageHeader
        title={title}
        marker={marker || 'Hub'}
        description={description}
        actions={
          <Button variant="solid" onClick={() => setModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add {marker}
          </Button>
        }
      />

      <div className="max-w-4xl space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </>
        ) : items.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            description={`Create your first ${marker?.toLowerCase() || 'item'} to stay organized.`}
            action={
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add {marker || title}
              </Button>
            }
          />
        ) : (
          items.map((item, idx) => (
            <Card
              key={item._id || idx}
              className="p-4 bg-surface border-border flex items-center justify-between gap-3 hover:border-brand/40 transition-colors group"
              style={endpoint === '/notes' ? { borderLeft: `4px solid ${item.color || '#FEF08A'}` } : {}}
            >
              <div className="flex items-center gap-3 min-w-0">
                {endpoint === '/todos' ? (
                  <button
                    onClick={() => toggleMutation.mutate({ id: item._id, isDone: !item.isDone })}
                    className="shrink-0 transition-colors"
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${item.isDone ? 'text-success fill-success/20' : 'text-text-muted hover:text-brand'}`}
                    />
                  </button>
                ) : (
                  <span className="shrink-0">{getIcon(endpoint)}</span>
                )}
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${item.isDone ? 'line-through text-text-muted' : 'text-text'}`}>
                    {getItemLabel(item, endpoint)}
                  </p>
                  {getItemMeta(item, endpoint) && (
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{getItemMeta(item, endpoint)}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item._id)}
                className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </Card>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Add ${marker || title}`} className="max-w-lg">
        <FormComponent
          onClose={() => setModalOpen(false)}
          onSaved={(payload) => createMutation.mutate(payload)}
          endpoint={endpoint}
        />
      </Modal>
    </Page>
  )
}
