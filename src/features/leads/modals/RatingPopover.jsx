import { Stars } from '@/components/ui/Stars'

export function RatingPopover({ rating = 0, onChange }) {
  return (
    <div className="p-2 bg-surface rounded-xl border border-border shadow-lg">
      <p className="text-[11px] font-semibold text-text-muted mb-1.5 px-1">Lead Priority / Quality</p>
      <Stars value={rating} onChange={onChange} size={20} />
    </div>
  )
}
