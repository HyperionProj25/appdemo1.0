interface ChangeIndicatorProps {
  value: number
  suffix?: string
  showArrow?: boolean
  size?: 'sm' | 'md'
}

export default function ChangeIndicator({
  value,
  suffix = '',
  showArrow = true,
  size = 'sm',
}: ChangeIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  const color = isPositive ? '#4caf50' : isNegative ? '#e53935' : 'var(--muted)'
  const fontSize = size === 'sm' ? 10 : 12

  const displayValue = Math.abs(value).toFixed(1)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      fontFamily: 'var(--font-body)',
      fontSize,
      fontWeight: 600,
      color,
    }}>
      {showArrow && !isNeutral && (
        <svg
          width={size === 'sm' ? 8 : 10}
          height={size === 'sm' ? 8 : 10}
          viewBox="0 0 10 10"
          fill="currentColor"
          style={{ transform: isNegative ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M5 2L9 7H1L5 2Z" />
        </svg>
      )}
      {isPositive ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  )
}
