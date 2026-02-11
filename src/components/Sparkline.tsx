interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showEndDot?: boolean
}

export default function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'var(--accent)',
  showEndDot = false,
}: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 2

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const lastPoint = data[data.length - 1]
  const lastX = width - padding
  const lastY = height - padding - ((lastPoint - min) / range) * (height - padding * 2)

  // Determine trend color
  const isUpward = data[data.length - 1] > data[0]
  const trendColor = isUpward ? '#4caf50' : data[data.length - 1] < data[0] ? '#e53935' : color

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={trendColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.8 }}
      />
      {showEndDot && (
        <circle
          cx={lastX}
          cy={lastY}
          r="2.5"
          fill={trendColor}
        />
      )}
    </svg>
  )
}
