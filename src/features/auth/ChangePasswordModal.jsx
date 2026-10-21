import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth.api'
import { toast } from 'sonner'

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function ChangePasswordModal({ open, onClose }) {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (values) => {
    try {
      setSubmitting(true)
      await authApi.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      toast.success('Password changed successfully')
      reset()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <Input
          label="Current Password"
          type="password"
          required
          {...register('oldPassword')}
          error={errors.oldPassword?.message}
          placeholder="••••••••"
        />

        <Input
          label="New Password"
          type="password"
          required
          {...register('newPassword')}
          error={errors.newPassword?.message}
          placeholder="At least 6 characters"
        />

        <Input
          label="Confirm New Password"
          type="password"
          required
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="Repeat new password"
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
