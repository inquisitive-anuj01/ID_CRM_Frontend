import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MoneyField } from '@/components/ui/MoneyField'
import { Stars } from '@/components/ui/Stars'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { leadSchema } from './schema'
import { useStatuses, useSources, useLabels } from '@/hooks/useMasters'
import { useUsers } from '@/hooks/useUsers'
import { useLeadMutations } from '@/hooks/useLeads'
import { leadsApi } from '@/api/leads.api'
import { AlertCircle } from 'lucide-react'

export function LeadFormModal({ open, onClose, initialData = null, onSuccess }) {
  const isEdit = Boolean(initialData)
  const { createLead } = useLeadMutations()
  const { statuses } = useStatuses()
  const { sources } = useSources()
  const { labels } = useLabels()
  const { userOptions } = useUsers()

  const [submitting, setSubmitting] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      mobile: '',
      countryCode: '+91',
      email: '',
      company: '',
      service: '',
      source: '',
      status: 'new',
      estimateAmount: 0,
      rating: 3,
      notes: '',
      labels: [],
      assignedTo: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.customerName || initialData.name || '',
        mobile: initialData.mobile || initialData.phone || '',
        countryCode: initialData.countryCode || '+91',
        email: initialData.email || '',
        company: initialData.companyName || initialData.company || '',
        service: initialData.service || '',
        source: initialData.source?._id || initialData.source || '',
        status: initialData.status?.key || initialData.status || 'new',
        estimateAmount: initialData.estimateAmount || 0,
        rating: initialData.rating ?? 3,
        notes: initialData.comment || initialData.notes || '',
        labels: initialData.labels?.map((l) => (typeof l === 'object' ? l.label?._id || l._id : l)) || [],
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      })
    } else {
      reset({
        name: '',
        mobile: '',
        countryCode: '+91',
        email: '',
        company: '',
        service: '',
        source: sources[0]?._id || '',
        status: statuses[0]?.key || 'new',
        estimateAmount: 0,
        rating: 3,
        notes: '',
        labels: [],
        assignedTo: '',
      })
    }
  }, [initialData, reset, statuses, sources])


  const mobileValue = watch('mobile')

  // Check duplicate mobile
  useEffect(() => {
    if (!mobileValue || mobileValue.length < 8 || isEdit) {
      setDuplicateWarning(null)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await leadsApi.checkDuplicate(mobileValue)
        if (res.data?.duplicate) {
          setDuplicateWarning(`A lead with this phone already exists: ${res.data.lead?.name}`)
        } else {
          setDuplicateWarning(null)
        }
      } catch {}
    }, 400)

    return () => clearTimeout(timer)
  }, [mobileValue, isEdit])

  const buildPayload = (values) => ({
    customerName: values.name,
    mobile: values.mobile,
    countryCode: values.countryCode || '+91',
    email: values.email || undefined,
    companyName: values.company || undefined,
    comment: values.notes || undefined,
    source: values.source || undefined,
    status: values.status || 'new',
    assignedTo: values.assignedTo || undefined,
    estimateAmount: values.estimateAmount || 0,
    rating: values.rating || 0,
    labels: (values.labels || []).map((id) => ({ label: id, amount: 0 })),
  })

  const onSubmit = async (values) => {
    try {
      setSubmitting(true)
      const payload = buildPayload(values)
      if (isEdit) {
        await leadsApi.update(initialData._id, payload)
      } else {
        await createLead(payload)
      }
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
      title={isEdit ? `Edit Lead: ${initialData?.name}` : 'Create New Lead'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {duplicateWarning && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warn/10 border border-warn/30 text-warn text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client / Contact Name"
            required
            placeholder="e.g. Vikram Malhotra"
            {...register('name')}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5">
              Contact Phone <span className="text-danger">*</span>
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-border bg-surface-2 text-xs font-semibold text-text">
                +91
              </span>
              <Input
                placeholder="9876543210"
                {...register('mobile')}
                error={errors.mobile?.message}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="vikram@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Company / Project Name"
            placeholder="e.g. Skyline Ventures"
            {...register('company')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Pipeline Status"
            {...register('status')}
            options={statuses.map((s) => ({ value: s.key, label: s.name }))}
          />

          <Select
            label="Inbound Source"
            {...register('source')}
            options={sources.map((s) => ({ value: s._id, label: s.name }))}
          />

          <Select
            label="Assign To"
            {...register('assignedTo')}
            options={[
              { value: '', label: 'Unassigned' },
              ...userOptions.map((u) => ({ value: u._id, label: u.name })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="estimateAmount"
            control={control}
            render={({ field }) => (
              <MoneyField
                label="Estimated Value"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">
              Initial Lead Rating
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="pt-1.5">
                  <Stars value={field.value} onChange={field.onChange} size={22} />
                </div>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5">
            Tags & Labels
          </label>
          <Controller
            name="labels"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={labels.map((l) => ({ value: l._id, label: l.name, color: l.color }))}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Select tags..."
              />
            )}
          />
        </div>

        <Textarea
          label="Internal Requirements / Notes"
          placeholder="Client project details, specific timelines, special notes..."
          rows={3}
          {...register('notes')}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
