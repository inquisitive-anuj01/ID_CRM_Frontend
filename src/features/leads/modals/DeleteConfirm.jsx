import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function DeleteConfirm({ open, onClose, onConfirm, leadName }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Lead?"
      description={`Are you sure you want to delete "${leadName || 'this lead'}"? It can be restored by an administrator if needed.`}
      confirmLabel="Delete Lead"
      destructive
    />
  )
}
