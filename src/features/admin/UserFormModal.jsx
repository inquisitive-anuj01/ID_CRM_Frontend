import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().optional(),
  role: z.enum(['admin', 'staff', 'manager']),
  designation: z.string().optional(),
  phone: z.string().optional(),
})

export function UserFormModal({ open, onClose, onSubmit, user = null, isSubmitting = false }) {
  const isEdit = Boolean(user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'staff',
      designation: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'staff',
        designation: user.designation || '',
        phone: user.mobile || user.phone || '',
      })
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        designation: '',
        phone: '',
      })
    }
  }, [user, reset])

  const handleFormSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
      designation: values.designation || undefined,
      mobile: values.phone || undefined,
    }

    if (isEdit) {
      if (values.password) {
        payload.password = values.password
      }
    } else {
      payload.password = values.password
    }

    await onSubmit(payload)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit User: ${user.name}` : 'Add New Team Member'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Rahul Sharma"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email Address"
          type="email"
          required
          disabled={isEdit}
          placeholder="rahul@company.com"
          {...register('email')}
          error={errors.email?.message}
        />

        {!isEdit && (
          <Input
            label="Initial Password"
            type="password"
            required
            placeholder="At least 8 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
            error={errors.password?.message}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Role"
            required
            {...register('role')}
            error={errors.role?.message}
            options={[
              { value: 'staff', label: 'Staff / Sales / BD' },
              { value: 'manager', label: 'Manager' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          <Input
            label="Designation"
            placeholder="e.g. Senior Lead Specialist"
            {...register('designation')}
            error={errors.designation?.message}
          />
        </div>

        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
