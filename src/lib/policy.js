/**
 * Followup policy preview (mirrors the backend formula)
 * gap = now - lead.lastFollowupDate (or lead.createdAt)
 * allowed = settings.followupAllowedMinutes (default 30)
 * difference = gap - allowed
 * policyStatus = gap >= allowed ? 'inpolicy' : 'outofpolicy'
 */
export function computePolicy({ lastFollowupAt, createdAt, nextFollowupDate, allowedMinutes = 30 }) {
  const now = new Date()
  const lastDate = lastFollowupAt || createdAt
  if (!lastDate) return null

  const gapMs = now - new Date(lastDate)
  const gapMin = Math.round(gapMs / 60000)
  const difference = gapMin - allowedMinutes
  const status = gapMin >= allowedMinutes ? 'inpolicy' : 'outofpolicy'

  // Next followup gap from now
  let nfdGapMin = null
  if (nextFollowupDate) {
    const nfdMs = new Date(nextFollowupDate) - now
    nfdGapMin = Math.round(nfdMs / 60000)
  }

  return {
    gapMin,
    allowedMin: allowedMinutes,
    difference,
    status,
    nfdGapMin,
    label:
      status === 'inpolicy'
        ? `Gap ${gapMin}m · Allowed ${allowedMinutes}m · Difference ${difference}m → ✅ In policy`
        : `Gap ${gapMin}m · Allowed ${allowedMinutes}m · ⚠ Out of policy (behind by ${Math.abs(difference)}m)`,
  }
}
