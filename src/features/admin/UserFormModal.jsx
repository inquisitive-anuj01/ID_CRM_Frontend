import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
  isActive: z.boolean().optional(),
})

export function UserFormModal({ open, onClose, onSubmit, user = null, isSubmitting = false }) {
  const isEdit = Boolean(user)

  const {
    register,
    handleSubmit,
    control,
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
      isActive: true,
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
        isActive: user.isActive !== undefined ? Boolean(user.isActive) : true,
        password: '',
      })
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        designation: '',
        phone: '',
        isActive: true,
      })
    }
  }, [user, reset])

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        designation: values.designation?.trim() || '',
        mobile: values.phone?.trim() || '',
        isActive: values.isActive !== undefined ? Boolean(values.isActive) : true,
      }

      if (values.password && values.password.trim().length > 0) {
        payload.password = values.password.trim()
      }

      await onSubmit(payload)
      onClose()
    } catch (err) {
      console.error('Failed to save user:', err)
    }
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
          placeholder="rahul@company.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label={isEdit ? 'New Password (leave blank to keep current)' : 'Initial Password'}
          type="password"
          required={!isEdit}
          placeholder={isEdit ? '•••••••• (leave blank to keep current)' : 'At least 6 characters'}
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Role"
                required
                value={field.value}
                onValueChange={field.onChange}
                error={errors.role?.message}
                options={[
                  { value: 'staff', label: 'Staff / Sales / BD' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
            )}
          />

          {isEdit ? (
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status"
                  value={field.value ? 'true' : 'false'}
                  onValueChange={(val) => field.onChange(val === 'true')}
                  options={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
                  ]}
                />
              )}
            />
          ) : (
            <Input
              label="Designation"
              placeholder="e.g. Senior Lead Specialist"
              {...register('designation')}
              error={errors.designation?.message}
            />
          )}
        </div>

        {isEdit && (
          <Input
            label="Designation"
            placeholder="e.g. Senior Lead Specialist"
            {...register('designation')}
            error={errors.designation?.message}
          />
        )}

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
