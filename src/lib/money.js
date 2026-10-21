/** Format as Indian currency: ₹10,000 */
const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatINR = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0'
  return inr.format(amount)
}

/** Compact format for large numbers: ₹1.2L, ₹3Cr */
export const formatINRCompact = (amount) => {
  if (!amount) return '₹0'
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(1)}L`
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(1)}K`
  return formatINR(amount)
}

/** Parse Indian-formatted number string to number */
export const parseINR = (str) => {
  if (!str) return 0
  return Number(String(str).replace(/[^0-9.]/g, '')) || 0
}
