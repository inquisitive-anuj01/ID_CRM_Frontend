import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

/** Dashboard stat card matching the website's dark card with circle icon + big number */
export function StatCard({ icon: Icon, label, value, sub, accent, trend, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-line bg-surface p-5',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ background: accent ? `${accent}22` : 'var(--brand)22' }}
          >
            <Icon size={20} style={{ color: accent ?? 'var(--brand)' }} />
          </div>
        )}
        {trend !== undefined && (
          <span
            className={cn(
              'text-xs font-bold',
              trend > 0 ? 'text-[var(--success)]' : trend < 0 ? 'text-[var(--danger)]' : 'text-muted'
            )}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <motion.p
        className="text-3xl font-black text-ink tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {value ?? '—'}
      </motion.p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </motion.div>
  )
}
