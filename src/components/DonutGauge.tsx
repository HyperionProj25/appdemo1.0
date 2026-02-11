import { useState, useEffect } from 'react'

interface DonutGaugeProps {
  /** Value 0-100 representing fill percentage */
  value: number
  /** Display text in center */
  label: string
  /** Gauge size in px */
  size?: number
  /** Stroke color */
  color?: string
  /** Optional secondary color for gradient end */
  colorEnd?: string
  /** Track background color */
  trackColor?: string
  /** Stroke width */
  strokeWidth?: number
}

export default function DonutGauge({
  value,
  label,
  size = 80,
  color = 'var(--accent)',
  colorEnd,
  trackColor = 'rgba(60,60,60,0.5)',
  strokeWidth = 6,
}: DonutGaugeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const fillLength = (Math.min(100, Math.max(0, value)) / 100) * circumference
  const offset = circumference - fillLength
  const center = size / 2
  const gradId = `gauge-grad-${Math.random().toString(36).slice(2, 8)}`
  const useGradient = !!colorEnd

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {useGradient && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
      )}

      {/* Track */}
      <circle
        cx={center} cy={center} r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />

      {/* Fill arc */}
      <circle
        cx={center} cy={center} r={r}
        fill="none"
        stroke={useGradient ? `url(#${gradId})` : color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={mounted ? offset : circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) 0.2s',
        }}
      />

      {/* Center text */}
      <text
        x={center} y={center + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-bright)"
        fontSize={size * 0.18}
        fontWeight="bold"
        fontFamily="var(--font-heading)"
      >
        {label}
      </text>
    </svg>
  )
}
