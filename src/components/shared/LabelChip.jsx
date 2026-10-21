/** Colored label chip with optional amount display */
export function LabelChip({ label, amount, color }) {
  // Support label being an object: { label: { name, color }, amount } or { name, color } or string
  const labelObj = typeof label === 'object' && label !== null ? (label.label || label) : null
  const labelText = typeof label === 'string' ? label : (labelObj?.name || label?.name || '')
  const chipColor = color || labelObj?.color || label?.color
  const chipAmount = amount ?? label?.amount ?? 0

  const style = chipColor
    ? { background: chipColor + '22', color: chipColor, border: `1px solid ${chipColor}44` }
    : { background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={style}
    >
      {labelText}
      {chipAmount > 0 && (
        <span className="ml-1 opacity-75">₹{chipAmount.toLocaleString('en-IN')}</span>
      )}
    </span>
  )
}
