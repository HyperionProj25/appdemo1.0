import { useState, useEffect, useCallback } from 'react'

export interface ChartPoint {
  date: string
  value: number
}

export interface Annotation {
  date: string
  label: string
}

interface AnimatedChartProps {
  points: ChartPoint[]
  yMin: number
  yMax: number
  yTicks: number[]
  annotations?: Annotation[]
  /** Unit suffix for tooltip, e.g. "MPH", "°", "%" */
  unit?: string
  color?: string
  /** Gradient fill color */
  fillColor?: string
  width?: number
  height?: number
}

/** Catmull-Rom to cubic bezier conversion for smooth curves */
function catmullRomToBezier(pts: [number, number][], tension = 0.3): string {
  if (pts.length < 2) return ''
  if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`

  let d = `M ${pts[0][0]} ${pts[0][1]}`

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]

    const cp1x = p1[0] + (p2[0] - p0[0]) * tension
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`
  }
  return d
}

/** Parse a date string like "9/13", "10/1", "11/14" into a sortable number (month * 100 + day) */
function parseDateNum(date: string): number {
  const parts = date.replace(/\/\d{2,4}$/, '').split('/')
  const m = parseInt(parts[0], 10) || 0
  const d = parseInt(parts[1], 10) || 0
  return m * 100 + d
}

/** Normalize annotation date — strip trailing year if present (e.g. "9/25/25" → "9/25") */
function normalizeDate(date: string): string {
  const parts = date.split('/')
  if (parts.length >= 3) return `${parts[0]}/${parts[1]}`
  return date
}

export default function AnimatedChart({
  points,
  yMin,
  yMax,
  yTicks,
  annotations = [],
  unit = '',
  color = 'var(--accent)',
  fillColor,
  width = 540,
  height = 200,
}: AnimatedChartProps) {
  const [mounted, setMounted] = useState(false)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [pathLength, setPathLength] = useState(1000)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const measuredRef = useCallback((node: SVGPathElement | null) => {
    if (node) {
      setPathLength(node.getTotalLength())
    }
  }, [])

  const padL = 35, padR = 15, padT = 15, padB = 25
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const scaleX = (i: number) => padL + (i / Math.max(1, points.length - 1)) * plotW
  const scaleY = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH

  const svgPts: [number, number][] = points.map((p, i) => [scaleX(i), scaleY(p.value)])
  const curvePath = catmullRomToBezier(svgPts)

  // Area fill path
  const areaPath = svgPts.length > 0
    ? curvePath + ` L ${svgPts[svgPts.length - 1][0]},${padT + plotH} L ${svgPts[0][0]},${padT + plotH} Z`
    : ''

  const gradientId = `chart-grad-${Math.random().toString(36).slice(2, 8)}`
  const resolvedFill = fillColor || 'rgba(224,172,68,0.2)'

  // Build date → index lookup for data points
  const dateNums = points.map(p => parseDateNum(p.date))

  /** Get the x position for an annotation date, interpolating between data points if needed */
  function getAnnotationX(annDate: string): number | null {
    const norm = normalizeDate(annDate)
    const target = parseDateNum(norm)

    // Exact match on a data point
    for (let i = 0; i < points.length; i++) {
      if (normalizeDate(points[i].date) === norm || parseDateNum(points[i].date) === target) {
        return scaleX(i)
      }
    }

    // Interpolate between data points
    if (points.length < 2) return null
    if (target <= dateNums[0]) return scaleX(0)
    if (target >= dateNums[dateNums.length - 1]) return scaleX(points.length - 1)

    for (let i = 0; i < dateNums.length - 1; i++) {
      if (target >= dateNums[i] && target <= dateNums[i + 1]) {
        const frac = (target - dateNums[i]) / (dateNums[i + 1] - dateNums[i])
        return scaleX(i) + frac * (scaleX(i + 1) - scaleX(i))
      }
    }
    return null
  }

  // Find annotation matching a point date (for value labels on data points)
  function findAnnotation(date: string) {
    const norm = normalizeDate(date)
    const num = parseDateNum(date)
    return annotations.find(a => {
      const aNorm = normalizeDate(a.date)
      return aNorm === norm || parseDateNum(a.date) === num
    })
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.6" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines + labels */}
      {yTicks.map(v => (
        <g key={v}>
          <line
            x1={padL} y1={scaleY(v)}
            x2={width - padR} y2={scaleY(v)}
            stroke="rgba(100,100,100,0.2)" strokeWidth="0.5"
          />
          <text
            x={padL - 6} y={scaleY(v) + 3}
            fill="var(--muted)" fontSize="10" textAnchor="end"
          >
            {v}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={scaleX(i)} y={height - 4}
          fill="var(--muted)" fontSize="9" textAnchor="middle"
        >
          {p.date}
        </text>
      ))}

      {/* Area fill */}
      {areaPath && (
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        />
      )}

      {/* Animated curve line */}
      <path
        ref={measuredRef}
        d={curvePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: mounted ? 0 : pathLength,
          transition: `stroke-dashoffset 1.5s ease-out 0.15s`,
        }}
      />

      {/* Annotation lines — can appear at any date, interpolated */}
      {annotations.map((ann, ai) => {
        const sx = getAnnotationX(ann.date)
        if (sx === null) return null
        return (
          <g key={`ann-${ai}`} style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.4s ease ${0.5 + ai * 0.1}s` }}>
            <line
              x1={sx} y1={padT + plotH}
              x2={sx} y2={padT - 2}
              stroke="rgba(224,172,68,0.5)" strokeDasharray="4,3" strokeWidth="0.8"
            />
            <text
              x={sx + 4} y={padT + 2}
              fill="var(--accent-light)" fontSize="7" fontWeight="bold"
            >
              {ann.label}
            </text>
            {/* Small diamond marker at top of line */}
            <polygon
              points={`${sx},${padT - 5} ${sx + 3},${padT - 2} ${sx},${padT + 1} ${sx - 3},${padT - 2}`}
              fill="var(--accent)" opacity="0.7"
            />
          </g>
        )
      })}

      {/* Data points with stagger */}
      {svgPts.map(([px, py], i) => (
        <g key={i}>
          <circle
            cx={px} cy={py} r={hoverIdx === i ? 5 : 3}
            fill={color}
            style={{
              opacity: mounted ? 1 : 0,
              transition: `opacity 0.3s ease ${0.3 + i * 0.08}s, r 0.15s ease`,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          />
          {/* Value label on hover or for annotated points */}
          {(hoverIdx === i || findAnnotation(points[i].date)) && (
            <text
              x={px + 6} y={py - 8}
              fill="var(--text-bright)" fontSize="10" fontWeight="bold"
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.2s' }}
            >
              {points[i].value}{unit}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
