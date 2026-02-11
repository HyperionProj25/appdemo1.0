import { useState, useEffect } from 'react'
import { Benchmarks } from '../data/csvStats'

interface RadarChartProps {
  /** 3 values, each 0-100 */
  values: number[]
  /** Labels for each axis */
  labels: string[]
  /** Benchmark data for HS/College/Pro overlays */
  benchmarks: Benchmarks
  /** Size in px */
  size?: number
}

const LEVELS = ['HS', 'COLLEGE', 'PRO'] as const
type Level = typeof LEVELS[number]

const levelColors: Record<Level, string> = {
  HS: 'rgba(100,180,255,0.6)',
  COLLEGE: 'rgba(100,255,150,0.5)',
  PRO: 'rgba(255,200,60,0.5)',
}

export default function RadarChart({ values, labels, benchmarks, size = 200 }: RadarChartProps) {
  const [activeLevel, setActiveLevel] = useState<Level | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const cx = 75, cy = 68
  const maxR = 55
  // 3 axes at 120° apart, starting from top
  const angles = [-90, 30, 150].map(a => (a * Math.PI) / 180)

  function toPoint(axisIdx: number, pct: number): [number, number] {
    const r = (pct / 100) * maxR
    return [cx + r * Math.cos(angles[axisIdx]), cy + r * Math.sin(angles[axisIdx])]
  }

  function polygonPoints(vals: number[]): string {
    return vals.map((v, i) => toPoint(i, v).join(',')).join(' ')
  }

  // Grid rings at 25%, 50%, 75%, 100%
  const rings = [25, 50, 75, 100]

  const benchmarkKey = activeLevel ? activeLevel.toLowerCase() as 'hs' | 'college' | 'pro' : null
  const benchmarkVals = benchmarkKey ? benchmarks[benchmarkKey] : null

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {LEVELS.map(lv => (
          <button
            key={lv}
            onClick={() => setActiveLevel(activeLevel === lv ? null : lv)}
            style={{
              padding: '6px 18px',
              background: activeLevel === lv ? 'var(--accent)' : '#1e1e1e',
              border: `1px solid ${activeLevel === lv ? 'var(--accent)' : '#333'}`,
              borderRadius: 4,
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 11,
              color: activeLevel === lv ? '#000' : 'var(--text)',
              cursor: 'pointer',
              letterSpacing: '1px',
              transition: 'all 0.2s ease',
            }}
          >
            {lv}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg
          viewBox="0 0 150 140"
          style={{
            width: '100%',
            maxWidth: size,
            maxHeight: size * 0.85,
            overflow: 'visible',
          }}
        >
          {/* Grid rings */}
          {rings.map(pct => (
            <polygon
              key={pct}
              points={polygonPoints([pct, pct, pct])}
              fill="none"
              stroke={`rgba(80,80,80,${pct === 100 ? 0.25 : 0.12})`}
              strokeWidth={pct === 100 ? 0.8 : 0.5}
            />
          ))}

          {/* Axis lines */}
          {angles.map((_, i) => {
            const [ex, ey] = toPoint(i, 100)
            return (
              <line
                key={i}
                x1={cx} y1={cy} x2={ex} y2={ey}
                stroke="rgba(80,80,80,0.15)" strokeWidth="0.5"
              />
            )
          })}

          {/* Benchmark overlay */}
          {benchmarkVals && (
            <polygon
              points={polygonPoints(benchmarkVals)}
              fill={levelColors[activeLevel!] ? levelColors[activeLevel!].replace(/[\d.]+\)$/, '0.08)') : 'none'}
              stroke={levelColors[activeLevel!] || 'rgba(255,255,255,0.3)'}
              strokeWidth="1"
              strokeDasharray="4,3"
              style={{
                transition: 'all 0.4s ease',
                opacity: mounted ? 1 : 0,
              }}
            />
          )}

          {/* Player polygon */}
          <polygon
            points={polygonPoints(values)}
            fill="rgba(224,172,68,0.15)"
            stroke="var(--accent)"
            strokeWidth="1.5"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: mounted ? 'scale(1)' : 'scale(0.3)',
              opacity: mounted ? 1 : 0,
              transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
            }}
          />

          {/* Player dots at vertices */}
          {values.map((v, i) => {
            const [px, py] = toPoint(i, v)
            return (
              <circle
                key={i}
                cx={px} cy={py} r="3"
                fill="var(--accent)"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.3s ease ${0.3 + i * 0.1}s`,
                }}
              />
            )
          })}

          {/* Axis labels */}
          {labels.map((label, i) => {
            const [lx, ly] = toPoint(i, 115)
            return (
              <text
                key={i}
                x={lx} y={ly + (i === 0 ? -2 : 4)}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="9"
                fontWeight="700"
              >
                {label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
