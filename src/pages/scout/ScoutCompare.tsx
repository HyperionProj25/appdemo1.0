import { useState } from 'react'
import { players, getPlayerFullName } from '../../data/players'
import Sparkline from '../../components/Sparkline'

const baseballPlayers = players.filter(p => p.sport === 'Baseball')

const playerColors = ['#E0AC44', 'var(--color-positive)', 'var(--color-info)']
const playerFills = [
  'rgba(224,172,68,0.6)',
  'rgba(76,175,80,0.6)',
  'rgba(33,150,243,0.6)',
]

const cardStyle: React.CSSProperties = {
  background: 'var(--panel)',
  border: '1px solid var(--orange-border)',
  borderRadius: 10,
  padding: 24,
  boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
}

const secTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: 'var(--accent)',
  marginBottom: 18,
}

const generateTrend = (base: number, variance: number): number[] => {
  const r: number[] = []
  let c = base - variance
  for (let i = 0; i < 8; i++) {
    c += (Math.random() - 0.3) * variance * 0.5
    r.push(Math.round(c * 10) / 10)
  }
  return r
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const normalizeAvgEV = (v: number) => clamp(((v - 70) / 30) * 100, 0, 100)
const normalizeMaxEV = (v: number) => clamp(((v - 85) / 25) * 100, 0, 100)
const normalizeBatSpeed = (v: number) => clamp(((v - 40) / 25) * 100, 0, 100)
const normalizePower = (maxEV: number) => clamp(((maxEV - 75) / 35) * 100, 0, 100)
const normalizeContact = (swings: number) => Math.min(swings * 1.5, 100)

const radarLabels = ['Avg EV', 'Max EV', 'Bat Speed', 'Power', 'Contact']
const axisCount = 5
const cx = 150
const cy = 150
const radius = 120

function getRadarPoint(axisIndex: number, value: number): { x: number; y: number } {
  const angle = (Math.PI * 2 * axisIndex) / axisCount - Math.PI / 2
  const r = (value / 100) * radius
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

function polygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const pt = getRadarPoint(i, v)
      return `${pt.x},${pt.y}`
    })
    .join(' ')
}

function concentricPentagon(scale: number): string {
  const pts: string[] = []
  for (let i = 0; i < axisCount; i++) {
    const pt = getRadarPoint(i, scale)
    pts.push(`${pt.x},${pt.y}`)
  }
  return pts.join(' ')
}

const levelOrder: Record<string, number> = { A: 1, 'A+': 2, AA: 3, AAA: 4, MLB: 5 }

export default function ScoutCompare() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    baseballPlayers[0]?.id ?? '',
    baseballPlayers[1]?.id ?? '',
  ])

  const selectedPlayers = selectedIds
    .filter(id => id !== '')
    .map(id => baseballPlayers.find(p => p.id === id)!)
    .filter(Boolean)

  const handleSelect = (index: number, value: string) => {
    setSelectedIds(prev => {
      const next = [...prev]
      if (index === 2 && value === '') {
        return next.slice(0, 2)
      }
      next[index] = value
      return next
    })
  }

  const hasThird = selectedIds.length > 2 && selectedIds[2] !== ''

  const radarValues = selectedPlayers.map(p => [
    normalizeAvgEV(p.avgEV),
    normalizeMaxEV(p.maxEV),
    normalizeBatSpeed(p.avgBS),
    normalizePower(p.maxEV),
    normalizeContact(p.swings),
  ])

  const trendData = selectedPlayers.map(p => generateTrend(p.avgEV, 4))

  const metricRows: { label: string; getValue: (p: typeof selectedPlayers[0]) => number | string; format?: (v: number | string) => string; isLevel?: boolean }[] = [
    { label: 'Avg EV', getValue: p => p.avgEV, format: v => Number(v).toFixed(1) + ' mph' },
    { label: 'Max EV', getValue: p => p.maxEV, format: v => Number(v).toFixed(1) + ' mph' },
    { label: 'Bat Speed', getValue: p => p.avgBS, format: v => Number(v).toFixed(1) + ' mph' },
    { label: 'Swings', getValue: p => p.swings, format: v => String(v) },
    { label: 'Age', getValue: p => p.age, format: v => String(v) },
    { label: 'Level', getValue: p => p.level, format: v => String(v), isLevel: true },
  ]

  const generateSummary = (): string => {
    if (selectedPlayers.length < 2) return ''
    const names = selectedPlayers.map(p => getPlayerFullName(p))

    let highestPowerIdx = 0
    let bestBatSpeedIdx = 0
    let mostConsistentIdx = 0
    let highestPower = 0
    let bestBatSpeed = 0
    let lowestVariance = Infinity

    selectedPlayers.forEach((p, i) => {
      const power = p.maxEV - 75
      if (power > highestPower) {
        highestPower = power
        highestPowerIdx = i
      }
      if (p.avgBS > bestBatSpeed) {
        bestBatSpeed = p.avgBS
        bestBatSpeedIdx = i
      }
      const evDiff = Math.abs(p.maxEV - p.avgEV)
      if (evDiff < lowestVariance) {
        lowestVariance = evDiff
        mostConsistentIdx = i
      }
    })

    const lines: string[] = []
    lines.push(
      `${names[highestPowerIdx]} leads in raw power with a max exit velocity of ${selectedPlayers[highestPowerIdx].maxEV.toFixed(1)} mph.`
    )
    lines.push(
      `${names[bestBatSpeedIdx]} has the best bat speed at ${selectedPlayers[bestBatSpeedIdx].avgBS.toFixed(1)} mph.`
    )
    lines.push(
      `${names[mostConsistentIdx]} shows the most consistency with only a ${lowestVariance.toFixed(1)} mph gap between average and max exit velocity.`
    )

    if (selectedPlayers.length === 2) {
      const evDiff = Math.abs(selectedPlayers[0].avgEV - selectedPlayers[1].avgEV)
      if (evDiff < 2) {
        lines.push(
          `Both prospects are closely matched in average exit velocity (${evDiff.toFixed(1)} mph difference).`
        )
      }
    }

    return lines.join(' ')
  }

  const selectStyle: React.CSSProperties = {
    background: 'var(--panel)',
    color: 'var(--text-bright)',
    border: '1px solid var(--orange-border)',
    borderRadius: 6,
    padding: '10px 14px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    cursor: 'pointer',
    minWidth: 220,
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div className="anim-fade-in" style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-bright)',
            margin: 0,
            marginBottom: 6,
          }}
        >
          Prospect Comparison
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          Compare prospects side-by-side across key metrics
        </p>
      </div>

      {/* Player Selectors */}
      <div className="anim-slide-up anim-delay-1" style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={secTitle}>Select Prospects</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Player 1 */}
          <select
            style={selectStyle}
            value={selectedIds[0] ?? ''}
            onChange={e => handleSelect(0, e.target.value)}
          >
            {baseballPlayers.map(p => (
              <option key={p.id} value={p.id}>
                {getPlayerFullName(p)} — {p.position} ({p.level})
              </option>
            ))}
          </select>

          <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            vs
          </span>

          {/* Player 2 */}
          <select
            style={selectStyle}
            value={selectedIds[1] ?? ''}
            onChange={e => handleSelect(1, e.target.value)}
          >
            {baseballPlayers.map(p => (
              <option key={p.id} value={p.id}>
                {getPlayerFullName(p)} — {p.position} ({p.level})
              </option>
            ))}
          </select>

          <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            vs
          </span>

          {/* Player 3 (optional) */}
          <select
            style={selectStyle}
            value={selectedIds[2] ?? ''}
            onChange={e => handleSelect(2, e.target.value)}
          >
            <option value="">Add third prospect...</option>
            {baseballPlayers.map(p => (
              <option key={p.id} value={p.id}>
                {getPlayerFullName(p)} — {p.position} ({p.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-side stat cards */}
      <div
        className="anim-slide-up anim-delay-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${selectedPlayers.length}, 1fr)`,
          gap: 16,
          marginBottom: 24,
        }}
      >
        {selectedPlayers.map((p, i) => (
          <div key={p.id} style={{ ...cardStyle, borderTopColor: playerColors[i], borderTopWidth: 3 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20,
                fontWeight: 700,
                color: playerColors[i],
                marginBottom: 4,
              }}
            >
              {getPlayerFullName(p)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--muted)',
                marginBottom: 16,
              }}
            >
              {p.position} &middot; {p.level} &middot; {p.team}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
                marginBottom: 16,
              }}
            >
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                Age: <span style={{ color: 'var(--text-bright)' }}>{p.age}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                Height: <span style={{ color: 'var(--text-bright)' }}>{p.height}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                Weight: <span style={{ color: 'var(--text-bright)' }}>{p.weight} lbs</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                Bats/Throws: <span style={{ color: 'var(--text-bright)' }}>{p.bats}/{p.throws}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--orange-border)', paddingTop: 12 }}>
              {[
                { label: 'Avg EV', value: p.avgEV.toFixed(1) + ' mph' },
                { label: 'Max EV', value: p.maxEV.toFixed(1) + ' mph' },
                { label: 'Bat Speed', value: p.avgBS.toFixed(1) + ' mph' },
                { label: 'Swings', value: String(p.swings) },
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: 'var(--muted)' }}>{stat.label}</span>
                  <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="anim-slide-up anim-delay-2" style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={secTitle}>Radar Comparison</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 300 300" width={300} height={300}>
            {/* Concentric pentagons for scale */}
            {[25, 50, 75, 100].map(scale => (
              <polygon
                key={scale}
                points={concentricPentagon(scale)}
                fill="none"
                stroke="var(--accent-border-subtle)"
                strokeWidth={1}
              />
            ))}

            {/* Axis lines */}
            {Array.from({ length: axisCount }).map((_, i) => {
              const pt = getRadarPoint(i, 100)
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="rgba(224,172,68,0.2)"
                  strokeWidth={1}
                />
              )
            })}

            {/* Axis labels */}
            {radarLabels.map((label, i) => {
              const pt = getRadarPoint(i, 115)
              return (
                <text
                  key={label}
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--muted)"
                  fontSize={10}
                  fontFamily="var(--font-body)"
                >
                  {label}
                </text>
              )
            })}

            {/* Player polygons */}
            {radarValues.map((values, i) => (
              <polygon
                key={i}
                points={polygonPoints(values)}
                fill={playerFills[i]}
                stroke={playerColors[i]}
                strokeWidth={2}
                opacity={0.7}
              />
            ))}

            {/* Player dots on vertices */}
            {radarValues.map((values, i) =>
              values.map((v, j) => {
                const pt = getRadarPoint(j, v)
                return (
                  <circle
                    key={`${i}-${j}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill={playerColors[i]}
                    stroke="var(--panel)"
                    strokeWidth={1}
                  />
                )
              })
            )}
          </svg>
        </div>

        {/* Radar legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          {selectedPlayers.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: playerColors[i],
                }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>
                {getPlayerFullName(p)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Comparison Table */}
      <div className="anim-slide-up anim-delay-3" style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={secTitle}>Metrics Comparison</div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--orange-border)',
                  color: 'var(--muted)',
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Metric
              </th>
              {selectedPlayers.map((p, i) => (
                <th
                  key={p.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--orange-border)',
                    color: playerColors[i],
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {getPlayerFullName(p)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricRows.map((row, rowIdx) => {
              const values = selectedPlayers.map(p => row.getValue(p))
              const numericValues = values.map(v => typeof v === 'number' ? v : 0)
              const maxVal = Math.max(...numericValues)
              const leaderIndices = row.isLevel ? [] : numericValues
                .map((v, i) => (v === maxVal ? i : -1))
                .filter(i => i !== -1)

              return (
                <tr key={row.label}>
                  <td
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(224,172,68,0.08)',
                      color: 'var(--text)',
                      fontWeight: 500,
                    }}
                  >
                    {row.label}
                  </td>
                  {selectedPlayers.map((p, i) => {
                    const isLeader = leaderIndices.includes(i) && selectedPlayers.length > 1
                    const displayVal = row.format
                      ? row.format(values[i])
                      : String(values[i])
                    return (
                      <td
                        key={p.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(224,172,68,0.08)',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: isLeader ? 'var(--color-positive)' : 'var(--text-bright)',
                          background: isLeader ? 'rgba(76,175,80,0.08)' : 'transparent',
                          borderRadius: isLeader ? 4 : 0,
                        }}
                      >
                        {displayVal}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* EV Trend Sparklines */}
      <div className="anim-slide-up anim-delay-3" style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={secTitle}>Exit Velocity Trends</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ position: 'relative', width: 300, height: 80 }}>
            {selectedPlayers.map((p, i) => (
              <div key={p.id} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Sparkline data={trendData[i]} width={300} height={80} showEndDot />
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          {selectedPlayers.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: playerColors[i],
                }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>
                {getPlayerFullName(p)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Summary */}
      <div
        style={{
          background: 'var(--accent-bg-subtle)',
          border: '1px solid var(--accent-border-subtle)',
          borderRadius: 10,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div style={secTitle}>Comparison Summary</div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {generateSummary()}
        </p>
      </div>
    </div>
  )
}
