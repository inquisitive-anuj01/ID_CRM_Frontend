import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)

const TZ = 'Asia/Kolkata'

/** Parse any date and set to IST */
export const toIST = (d) => dayjs(d).tz(TZ)

/** Display format used across CRM: DD-MM-YYYY HH:mm */
export const fmt = (d) => (d ? toIST(d).format('DD-MM-YYYY HH:mm') : '—')

/** Short date */
export const fmtDate = (d) => (d ? toIST(d).format('DD MMM YYYY') : '—')

/** Time only */
export const fmtTime = (d) => (d ? toIST(d).format('HH:mm') : '—')

/** Relative time: "in 5m", "Overdue 2h" */
export const fromNow = (d) => {
  if (!d) return '—'
  return toIST(d).fromNow()
}

/** Overdue minutes → human readable "Overdue 2h 10m" */
export const overdueLabel = (minutes) => {
  if (!minutes || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `Overdue ${m}m`
  if (m === 0) return `Overdue ${h}h`
  return `Overdue ${h}h ${m}m`
}

/** Check if a date is in the past */
export const isPast = (d) => dayjs(d).isBefore(dayjs())

/** Quick chip helpers for followup modal */
export const quickChips = () => {
  const now = dayjs().tz(TZ)
  return [
    { label: '+30 min',      value: now.add(30, 'minute').toDate() },
    { label: '+1 hr',        value: now.add(1, 'hour').toDate() },
    { label: 'Today 6 PM',   value: now.hour(18).minute(0).second(0).toDate() },
    { label: 'Tomorrow 11 AM', value: now.add(1, 'day').hour(11).minute(0).second(0).toDate() },
    { label: 'Next week',    value: now.add(7, 'day').hour(10).minute(0).second(0).toDate() },
  ]
}

export const fmtDateTime = fmt
export const fmtTimeAgo = fromNow

export { dayjs, TZ }
