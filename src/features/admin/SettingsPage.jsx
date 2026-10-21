import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSettings } from '@/hooks/useMasters'
import { Clock, Shield, Sliders, CheckCircle2 } from 'lucide-react'

export function SettingsPage() {
  const { settings, isLoading, updateSettings } = useSettings()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      startHour: 9,
      endHour: 21,
      maxFollowupGapHours: 48,
      autoReassignHours: 24,
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        startHour: settings.startHour ?? 9,
        endHour: settings.endHour ?? 21,
        maxFollowupGapHours: settings.maxFollowupGapHours ?? 48,
        autoReassignHours: settings.autoReassignHours ?? 24,
      })
    }
  }, [settings, reset])

  const onSubmit = async (values) => {
    await updateSettings({
      startHour: Number(values.startHour),
      endHour: Number(values.endHour),
      maxFollowupGapHours: Number(values.maxFollowupGapHours),
      autoReassignHours: Number(values.autoReassignHours),
    })
  }

  return (
    <Page>
      <PageHeader
        title="CRM Settings"
        marker="Policy"
        description="Configure followup working hours, SLA thresholds, and team automation rules"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <Card className="p-6 bg-surface border-border space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Clock className="h-5 w-5 text-brand" />
            <div>
              <h3 className="text-sm font-bold text-text">Followup Policy & Working Hours</h3>
              <p className="text-xs text-text-muted">
                Define valid working hours for scheduling customer callbacks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Calling Start Hour (24-hr format)"
              type="number"
              min={0}
              max={23}
              {...register('startHour')}
              helperText="e.g. 9 for 09:00 AM"
            />

            <Input
              label="Calling End Hour (24-hr format)"
              type="number"
              min={0}
              max={23}
              {...register('endHour')}
              helperText="e.g. 21 for 09:00 PM"
            />
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Shield className="h-5 w-5 text-brand" />
            <div>
              <h3 className="text-sm font-bold text-text">SLA & Escalation Rules</h3>
              <p className="text-xs text-text-muted">
                Control maximum allowable gap between client touchpoints before alerts trigger.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Max Followup Gap (Hours)"
              type="number"
              min={1}
              {...register('maxFollowupGapHours')}
              helperText="Leads without interaction exceeding this gap will flag as Overdue"
            />

            <Input
              label="Auto Reassign Stale Leads (Hours)"
              type="number"
              min={0}
              {...register('autoReassignHours')}
              helperText="Set to 0 to disable automatic reassignment"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="solid" disabled={isLoading} className="px-6">
            Save Settings
          </Button>
        </div>
      </form>
    </Page>
  )
}
