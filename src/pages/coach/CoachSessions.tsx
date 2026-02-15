import { useState } from 'react'
import { players, getPlayerFullName } from '../../data/players'

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

const generateDots = (baseEV: number, seed: number) => {
  const dots: { ev: number; la: number }[] = []
  for (let i = 0; i < 28; i++) {
    const s = ((seed + i * 17) % 100) / 100
    const ev = baseEV + (s - 0.5) * 20
    const la = -10 + s * 40 + ((seed + i * 31) % 20) - 10
    dots.push({ ev: Math.round(ev * 10) / 10, la: Math.round(la * 10) / 10 })
  }
  return dots
}

const generateDistribution = (baseEV: number, seed: number) => {
  const buckets = [
    { label: '<80', min: 0, max: 80 },
    { label: '80-85', min: 80, max: 85 },
    { label: '85-90', min: 85, max: 90 },
    { label: '90-95', min: 90, max: 95 },
    { label: '95-100', min: 95, max: 100 },
    { label: '100+', min: 100, max: 200 },
  ]
  const dots = generateDots(baseEV, seed)
  return buckets.map((b) => ({
    label: b.label,
    count: dots.filter((d) => d.ev >= b.min && d.ev < b.max).length,
  }))
}

export default function CoachSessions() {
  const durhamBulls = players.filter(
    (p) => p.sport === 'Baseball' && p.team === 'Durham Bulls'
  )
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    durhamBulls.length > 0 ? durhamBulls[0].id : ''
  )

  const selectedPlayer = durhamBulls.find((p) => p.id === selectedPlayerId) || durhamBulls[0]

  if (!selectedPlayer) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 32, color: 'var(--text)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-bright)' }}>
          Session Comparison
        </h1>
        <p style={{ color: 'var(--muted)' }}>No Durham Bulls players found.</p>
      </div>
    )
  }

  const playerName = getPlayerFullName(selectedPlayer)

  // Session A (older): stats minus offset; Session B (recent): actual stats
  const sessionA = {
    avgEV: Math.round((selectedPlayer.avgEV - 2.3) * 10) / 10,
    maxEV: Math.round((selectedPlayer.maxEV - 2.8) * 10) / 10,
    avgBS: Math.round((selectedPlayer.avgBS - 1.5) * 10) / 10,
    swings: selectedPlayer.swings - 12,
    hardHit: Math.round((selectedPlayer.avgEV / selectedPlayer.maxEV) * 100 * 0.92 * 10) / 10,
    barrel: Math.round((selectedPlayer.avgEV / selectedPlayer.maxEV) * 50 * 0.88 * 10) / 10,
  }

  const sessionB = {
    avgEV: selectedPlayer.avgEV,
    maxEV: selectedPlayer.maxEV,
    avgBS: selectedPlayer.avgBS,
    swings: selectedPlayer.swings,
    hardHit: Math.round((selectedPlayer.avgEV / selectedPlayer.maxEV) * 100 * 10) / 10,
    barrel: Math.round((selectedPlayer.avgEV / selectedPlayer.maxEV) * 50 * 10) / 10,
  }

  const dotsA = generateDots(selectedPlayer.avgEV - 2, 42)
  const dotsB = generateDots(selectedPlayer.avgEV, 73)

  const distA = generateDistribution(selectedPlayer.avgEV - 2, 42)
  const distB = generateDistribution(selectedPlayer.avgEV, 73)

  const maxDist = Math.max(...distA.map((d) => d.count), ...distB.map((d) => d.count), 1)

  const metricsA = [
    { label: 'Avg EV', value: sessionA.avgEV, unit: 'mph' },
    { label: 'Max EV', value: sessionA.maxEV, unit: 'mph' },
    { label: 'Bat Speed', value: sessionA.avgBS, unit: 'mph' },
    { label: 'Swings', value: sessionA.swings, unit: '' },
    { label: 'Hard Hit %', value: sessionA.hardHit, unit: '%' },
    { label: 'Barrel %', value: sessionA.barrel, unit: '%' },
  ]

  const metricsB = [
    { label: 'Avg EV', value: sessionB.avgEV, unit: 'mph' },
    { label: 'Max EV', value: sessionB.maxEV, unit: 'mph' },
    { label: 'Bat Speed', value: sessionB.avgBS, unit: 'mph' },
    { label: 'Swings', value: sessionB.swings, unit: '' },
    { label: 'Hard Hit %', value: sessionB.hardHit, unit: '%' },
    { label: 'Barrel %', value: sessionB.barrel, unit: '%' },
  ]

  // Diff metrics
  const diffMetrics = [
    {
      label: 'Avg EV',
      a: sessionA.avgEV,
      b: sessionB.avgEV,
      unit: 'mph',
      delta: Math.round((sessionB.avgEV - sessionA.avgEV) * 10) / 10,
    },
    {
      label: 'Max EV',
      a: sessionA.maxEV,
      b: sessionB.maxEV,
      unit: 'mph',
      delta: Math.round((sessionB.maxEV - sessionA.maxEV) * 10) / 10,
    },
    {
      label: 'Bat Speed',
      a: sessionA.avgBS,
      b: sessionB.avgBS,
      unit: 'mph',
      delta: Math.round((sessionB.avgBS - sessionA.avgBS) * 10) / 10,
    },
    {
      label: 'Hard Hit %',
      a: sessionA.hardHit,
      b: sessionB.hardHit,
      unit: '%',
      delta: Math.round((sessionB.hardHit - sessionA.hardHit) * 10) / 10,
    },
    {
      label: 'Swings',
      a: sessionA.swings,
      b: sessionB.swings,
      unit: '',
      delta: sessionB.swings - sessionA.swings,
    },
  ]

  const evDelta = Math.round((sessionB.avgEV - sessionA.avgEV) * 10) / 10
  const bsDelta = Math.round((sessionB.avgBS - sessionA.avgBS) * 10) / 10
  const hhDelta = Math.round((sessionB.hardHit - sessionA.hardHit) * 10) / 10

  const evDirection = evDelta >= 0 ? 'improvement' : 'decline'
  const narrativeText =
    `Between Session A (Jan 8) and Session B (Feb 5), ${playerName} showed ` +
    `${evDirection} in exit velocity (${evDelta >= 0 ? '+' : ''}${evDelta} mph), ` +
    `moving from ${sessionA.avgEV} mph to ${sessionB.avgEV} mph average. ` +
    `Bat speed ${bsDelta >= 0 ? 'increased' : 'decreased'} by ${Math.abs(bsDelta)} mph, ` +
    `suggesting ${bsDelta >= 0 ? 'improved swing mechanics and better barrel control' : 'a potential fatigue factor worth monitoring'}. ` +
    `Hard hit percentage ${hhDelta >= 0 ? 'rose' : 'dropped'} from ${sessionA.hardHit}% to ${sessionB.hardHit}%, ` +
    `indicating ${hhDelta >= 0 ? 'more consistent quality contact on centered hits' : 'a shift in contact quality that warrants review'}. ` +
    `Overall, the data points toward ${evDelta >= 0 && bsDelta >= 0 ? 'positive development trends heading into the season' : 'areas to address in upcoming sessions'}.`

  const renderScatter = (dots: { ev: number; la: number }[], opacity: number, label: string) => (
    <div style={{ ...cardStyle, marginBottom: 16 }}>
      <div style={secTitle}>{label} — Exit Velo vs Launch Angle</div>
      <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Gridlines */}
        {[70, 80, 90, 100, 110].map((ev) => {
          const y = 190 - (ev - 60) / 50 * 170
          return (
            <g key={`grid-h-${ev}`}>
              <line x1={10} y1={y} x2={290} y2={y} stroke="var(--accent-bg-medium)" strokeWidth={0.5} />
              <text x={4} y={y + 3} fill="var(--muted)" fontSize={6} fontFamily="var(--font-mono)" textAnchor="end">
                {ev}
              </text>
            </g>
          )
        })}
        {[-10, 0, 10, 20, 30].map((la) => {
          const x = (la + 30) / 60 * 280 + 10
          return (
            <g key={`grid-v-${la}`}>
              <line x1={x} y1={10} x2={x} y2={190} stroke="var(--accent-bg-medium)" strokeWidth={0.5} />
              <text x={x} y={198} fill="var(--muted)" fontSize={6} fontFamily="var(--font-mono)" textAnchor="middle">
                {la}°
              </text>
            </g>
          )
        })}
        {/* Axis labels */}
        <text x={150} y={208} fill="var(--muted)" fontSize={7} fontFamily="var(--font-heading)" textAnchor="middle" style={{ letterSpacing: '0.5px' }}>
          Launch Angle
        </text>
        <text
          x={-100}
          y={8}
          fill="var(--muted)"
          fontSize={7}
          fontFamily="var(--font-heading)"
          textAnchor="middle"
          transform="rotate(-90)"
          style={{ letterSpacing: '0.5px' }}
        >
          Exit Velocity (mph)
        </text>
        {/* Axes */}
        <line x1={10} y1={190} x2={290} y2={190} stroke="rgba(224,172,68,0.2)" strokeWidth={1} />
        <line x1={10} y1={10} x2={10} y2={190} stroke="rgba(224,172,68,0.2)" strokeWidth={1} />
        {/* Dots */}
        {dots.map((d, i) => {
          const cx = (d.la + 30) / 60 * 280 + 10
          const cy = 190 - (d.ev - 60) / 50 * 170
          return (
            <circle
              key={i}
              cx={Math.max(10, Math.min(290, cx))}
              cy={Math.max(10, Math.min(190, cy))}
              r={3.5}
              fill="var(--accent)"
              opacity={opacity}
            />
          )
        })}
      </svg>
    </div>
  )

  const renderDistribution = (dist: { label: string; count: number }[], label: string) => (
    <div style={{ ...cardStyle, marginBottom: 16 }}>
      <div style={secTitle}>{label} — EV Distribution</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dist.map((bucket) => (
          <div key={bucket.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--muted)',
                width: 48,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {bucket.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 14,
                background: 'rgba(224,172,68,0.08)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(bucket.count / maxDist) * 100}%`,
                  height: '100%',
                  background: 'var(--accent)',
                  borderRadius: 3,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text)',
                width: 20,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {bucket.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMetrics = (metrics: { label: string; value: number; unit: string }[], label: string) => (
    <div style={{ ...cardStyle }}>
      <div style={secTitle}>{label} — Key Metrics</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: 'rgba(224,172,68,0.04)',
              borderRadius: 6,
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-bright)',
                lineHeight: 1.2,
              }}
            >
              {m.value}
              {m.unit && (
                <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>{m.unit}</span>
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--muted)',
                marginTop: 4,
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
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
          Session Comparison
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          Compare training sessions side-by-side to track progress
        </p>
      </div>

      {/* Player Selector */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: 'var(--accent)',
          }}
        >
          Player
        </label>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          style={{
            background: 'var(--bg)',
            color: 'var(--text-bright)',
            border: '1px solid var(--orange-border)',
            borderRadius: 6,
            padding: '8px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
            cursor: 'pointer',
            minWidth: 220,
          }}
        >
          {durhamBulls.map((p) => (
            <option key={p.id} value={p.id}>
              {getPlayerFullName(p)} — {p.position}
            </option>
          ))}
        </select>
      </div>

      {/* Session Date Labels */}
      <div
        className="anim-slide-up anim-delay-1"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 13,
            color: 'var(--text)',
            padding: '10px 16px',
            background: 'rgba(224,172,68,0.06)',
            borderRadius: 6,
            border: '1px solid rgba(224,172,68,0.12)',
            textAlign: 'center',
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Session A:</span>{' '}
          <span style={{ color: 'var(--muted)' }}>Jan 8, 2026</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 13,
            color: 'var(--text)',
            padding: '10px 16px',
            background: 'rgba(224,172,68,0.06)',
            borderRadius: 6,
            border: '1px solid rgba(224,172,68,0.12)',
            textAlign: 'center',
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Session B:</span>{' '}
          <span style={{ color: 'var(--muted)' }}>Feb 5, 2026</span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div
        className="anim-slide-up anim-delay-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Session A Column */}
        <div>
          {renderScatter(dotsA, 0.4, 'Session A')}
          {renderDistribution(distA, 'Session A')}
          {renderMetrics(metricsA, 'Session A')}
        </div>

        {/* Session B Column */}
        <div>
          {renderScatter(dotsB, 0.8, 'Session B')}
          {renderDistribution(distB, 'Session B')}
          {renderMetrics(metricsB, 'Session B')}
        </div>
      </div>

      {/* Bottom Diff Summary Card */}
      <div style={{ ...cardStyle, marginBottom: 28 }}>
        <div style={secTitle}>Session Comparison Summary</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {diffMetrics.map((dm) => {
            const isPositive = dm.delta >= 0
            const color = isPositive ? '#4ade80' : '#f87171'
            const arrow = isPositive ? '\u2191' : '\u2193'
            return (
              <div
                key={dm.label}
                style={{
                  flex: '1 1 160px',
                  textAlign: 'center',
                  padding: '14px 8px',
                  background: 'rgba(224,172,68,0.03)',
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--muted)',
                    marginBottom: 8,
                  }}
                >
                  {dm.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 15,
                      color: 'var(--muted)',
                    }}
                  >
                    {dm.a}
                  </span>
                  <span style={{ color: 'var(--accent)', fontSize: 14 }}>{'\u2192'}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 15,
                      color: 'var(--text-bright)',
                      fontWeight: 700,
                    }}
                  >
                    {dm.b}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    color,
                    marginTop: 6,
                  }}
                >
                  {arrow} {isPositive ? '+' : ''}
                  {dm.delta}
                  {dm.unit ? ` ${dm.unit}` : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Comparison Narrative */}
      <div
        className="anim-slide-up anim-delay-3"
        style={{
          background: 'var(--accent-bg-subtle)',
          border: '1px solid var(--accent-border-subtle)',
          borderRadius: 10,
          padding: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: 'var(--accent)',
            marginBottom: 12,
          }}
        >
          AI Session Analysis
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            lineHeight: 1.7,
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {narrativeText}
        </p>
      </div>
    </div>
  )
}
