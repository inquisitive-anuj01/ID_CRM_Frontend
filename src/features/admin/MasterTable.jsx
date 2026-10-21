import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

export function MasterTable({
  title,
  description,
  items = [],
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  hasColor = false,
  hasKey = false,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [reordering, setReordering] = useState(false)

  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [color, setColor] = useState('#DEB104')

  const openAdd = () => {
    setEditingItem(null)
    setName('')
    setKey('')
    setColor('#DEB104')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setName(item.name || '')
    setKey(item.key || '')
    setColor(item.color || '#DEB104')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const payload = { name: name.trim() }
    if (hasKey) payload.key = key.trim() || name.trim().toLowerCase().replace(/\s+/g, '_')
    if (hasColor) payload.color = color

    if (editingItem) {
      await onUpdate({ id: editingItem._id, data: payload })
    } else {
      await onCreate(payload)
    }
    setModalOpen(false)
  }

  const handleMove = async (index, direction) => {
    if (!onReorder || reordering) return
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return

    try {
      setReordering(true)
      const reordered = [...items]
      const [moved] = reordered.splice(index, 1)
      reordered.splice(targetIndex, 0, moved)

      const payload = reordered.map((item, idx) => ({
        id: item._id,
        order: idx + 1,
      }))
      await onReorder(payload)
    } catch (err) {
      console.error('Reorder error:', err)
    } finally {
      setReordering(false)
    }
  }

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await onDelete(deleteTargetId)
      setDeleteTargetId(null)
      setDeleteConfirmOpen(false)
    }
  }

  return (
    <Card className="border-border bg-surface p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-border gap-3">
        <div>
          <h3 className="text-sm font-bold text-text">{title}</h3>
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
        <Button size="sm" variant="outline" onClick={openAdd}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
            <tr>
              {onReorder && <th className="px-3 py-3 w-24 text-center">Order</th>}
              <th className="px-5 py-3">Name</th>
              {hasKey && <th className="px-5 py-3">Key</th>}
              {hasColor && <th className="px-5 py-3">Color Preview</th>}
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={hasKey && hasColor ? (onReorder ? 5 : 4) : 4} className="px-5 py-6 text-center text-text-muted">
                  No items configured.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item._id} className="hover:bg-surface-2/50 transition-colors">
                  {onReorder && (
                    <td className="px-3 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="xs"
                          disabled={idx === 0 || reordering}
                          onClick={() => handleMove(idx, -1)}
                          title="Move Up"
                          className="h-7 w-7 p-0 hover:bg-surface-2"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          disabled={idx === items.length - 1 || reordering}
                          onClick={() => handleMove(idx, 1)}
                          title="Move Down"
                          className="h-7 w-7 p-0 hover:bg-surface-2"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-3.5 font-semibold text-text">
                    <div className="flex items-center gap-2">
                      {hasColor && (
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color || '#DEB104' }}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  {hasKey && <td className="px-5 py-3.5 text-text-muted font-mono">{item.key}</td>}
                  {hasColor && (
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border"
                        style={{
                          backgroundColor: item.color ? item.color + '22' : 'transparent',
                          color: item.color || 'inherit',
                          borderColor: item.color ? item.color + '44' : 'var(--border)',
                        }}
                      >
                        {item.color}
                      </span>
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => openEdit(item)}
                        aria-label="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setDeleteTargetId(item._id)
                          setDeleteConfirmOpen(true)
                        }}
                        className="text-danger hover:bg-danger/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit ${title}` : `Add New ${title}`}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Input
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
          />

          {hasKey && (
            <Input
              label="Key Identifier"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. in_progress"
              helperText="Unique identifier for backend pipeline"
            />
          )}

          {hasColor && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5">
                Brand / Badge Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-14 rounded cursor-pointer border border-border bg-surface p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#HEX"
                  className="font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="solid">
              Save Item
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item?"
        description="Are you sure you want to delete this configuration item? This action cannot be undone."
        destructive
      />
    </Card>
  )
}
