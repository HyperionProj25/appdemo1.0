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

  const color = isPositive ? 'var(--color-positive)' : isNegative ? 'var(--color-negative)' : 'var(--muted)'
  const fontSize = size === 'sm' ? 11 : 14

  const displayValue = Math.abs(value).toFixed(1)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontFamily: 'var(--font-body)',
      fontSize,
      fontWeight: 600,
      color,
    }}>
      {showArrow && !isNeutral && (
        <svg
          width={size === 'sm' ? 9 : 12}
          height={size === 'sm' ? 9 : 12}
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
