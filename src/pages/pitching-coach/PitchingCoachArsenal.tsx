import { useState } from 'react'
import { pitchingStaff, pitchColors, type PitchArsenal } from '../../data/pitchingStaff'

export default function PitchingCoachArsenal() {
  const [selectedId, setSelectedId] = useState(pitchingStaff[0].id)
  const pitcher = pitchingStaff.find(p => p.id === selectedId) || pitchingStaff[0]

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)', border: '1px solid var(--orange-border)',
    borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
  }

  const stuffColor = (val: number) => val >= 115 ? 'var(--color-positive)' : val >= 100 ? 'var(--color-warning)' : 'var(--color-negative)'

  // Movement plot dimensions
  const plotSize = 300
  const plotPad = 40

  // Scale breaks to fit plot
  const allPitches = pitcher.arsenal
  const maxHB = Math.max(...allPitches.map(p => Math.abs(p.hb))) + 4
  const maxIVB = Math.max(...allPitches.map(p => Math.abs(p.ivb))) + 4

  const scaleX = (hb: number) => plotPad + ((hb + maxHB) / (maxHB * 2)) * (plotSize - plotPad * 2)
  const scaleY = (ivb: number) => plotPad + ((maxIVB - ivb) / (maxIVB * 2)) * (plotSize - plotPad * 2)

  // Tunneling score (mock)
  const tunnelingScore = (78 + Math.round(pitcher.stuffPlus * 0.12))

  // Velocity distribution mock
  const veloDistribution = pitcher.arsenal.map(p => ({
    type: p.type,
    name: p.name,
    min: Math.round(p.velo - 1.5),
    avg: p.velo,
    max: Math.round(p.velo + 2),
    color: pitchColors[p.type] || 'var(--accent)',
  }))

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Arsenal Analysis
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Pitch movement profiles, velocity distribution, and tunneling
        </p>
      </div>

      {/* Pitcher selector */}
      <div className="anim-slide-up anim-delay-1" style={{ marginBottom: 28 }}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            background: 'var(--panel)', border: '1px solid var(--orange-border)',
            borderRadius: 8, padding: '10px 16px', color: 'var(--text-bright)',
            fontFamily: 'var(--font-body)', fontSize: 14, minWidth: 280, outline: 'none', cursor: 'pointer',
          }}
        >
          {pitchingStaff.map(p => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} — {p.role} ({p.throws}HP)
            </option>
          ))}
        </select>
      </div>

      <div className="anim-slide-up anim-delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Left: Arsenal cards */}
        <div>
          <div style={secTitle}>Pitch Arsenal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {pitcher.arsenal.map((pitch: PitchArsenal) => (
              <div key={pitch.type} style={{ ...cardStyle, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: pitchColors[pitch.type] || 'var(--accent)',
                    }} />
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>
                      {pitch.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>({pitch.type})</span>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                    background: `${stuffColor(pitch.stuffPlus)}22`, color: stuffColor(pitch.stuffPlus),
                  }}>{pitch.stuffPlus} Stuff+</span>
                </div>

                {/* Usage bar */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>Usage</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>{pitch.usage}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface-tint-3)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pitch.usage}%`, background: pitchColors[pitch.type] || 'var(--accent)', borderRadius: 2 }} />
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {[
                    { label: 'Velo', value: `${pitch.velo}` },
                    { label: 'Spin', value: `${pitch.spin}` },
                    { label: 'IVB', value: `${pitch.ivb}"` },
                    { label: 'HB', value: `${pitch.hb}"` },
                    { label: 'Whiff%', value: `${pitch.whiffRate}%` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-bright)', fontWeight: 600 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Movement profile SVG */}
        <div>
          <div style={secTitle}>Movement Profile</div>
          <div style={cardStyle}>
            <svg width={plotSize} height={plotSize} style={{ display: 'block', margin: '0 auto' }}>
              {/* Background */}
              <rect x={plotPad} y={plotPad} width={plotSize - plotPad * 2} height={plotSize - plotPad * 2} fill="var(--surface-tint-1)" rx="4" />

              {/* Gridlines */}
              {[-2, -1, 0, 1, 2].map(n => {
                const hbVal = (n / 2) * maxHB
                const ivbVal = (n / 2) * maxIVB
                const x = scaleX(hbVal)
                const y = scaleY(ivbVal)
                return (
                  <g key={n}>
                    <line x1={x} y1={plotPad} x2={x} y2={plotSize - plotPad} stroke="var(--surface-tint-2)" strokeWidth="1" />
                    <line x1={plotPad} y1={y} x2={plotSize - plotPad} y2={y} stroke="var(--surface-tint-2)" strokeWidth="1" />
                  </g>
                )
              })}

              {/* Axis lines */}
              <line x1={scaleX(0)} y1={plotPad} x2={scaleX(0)} y2={plotSize - plotPad} stroke="var(--surface-tint-3)" strokeWidth="1.5" />
              <line x1={plotPad} y1={scaleY(0)} x2={plotSize - plotPad} y2={scaleY(0)} stroke="var(--surface-tint-3)" strokeWidth="1.5" />

              {/* Axis labels */}
              <text x={plotSize / 2} y={plotSize - 8} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--font-body)">
                Horizontal Break (in)
              </text>
              <text x={10} y={plotSize / 2} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--font-body)" transform={`rotate(-90, 10, ${plotSize / 2})`}>
                Induced Vertical Break (in)
              </text>

              {/* Pitch dots */}
              {allPitches.map(pitch => (
                <g key={pitch.type}>
                  <circle
                    cx={scaleX(pitch.hb)}
                    cy={scaleY(pitch.ivb)}
                    r={10 + pitch.usage * 0.15}
                    fill={pitchColors[pitch.type] || 'var(--accent)'}
                    opacity={0.7}
                  />
                  <text
                    x={scaleX(pitch.hb)}
                    y={scaleY(pitch.ivb) + 3}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="var(--font-body)"
                  >
                    {pitch.type}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {allPitches.map(p => (
                <div key={p.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: pitchColors[p.type] || 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tunneling Score */}
          <div style={{ ...cardStyle, marginTop: 20, padding: 24 }}>
            <div style={secTitle}>Tunneling Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: 42, fontWeight: 700,
                color: tunnelingScore >= 90 ? 'var(--color-positive)' : tunnelingScore >= 80 ? 'var(--accent)' : 'var(--color-warning)',
              }}>
                {tunnelingScore}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-bright)', marginBottom: 4 }}>
                  {tunnelingScore >= 90 ? 'Elite' : tunnelingScore >= 80 ? 'Above Average' : 'Average'} tunnel quality
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                  Measures how well pitches look the same out of the hand before separating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Velocity distribution */}
      <div className="anim-slide-up anim-delay-3" style={secTitle}>Velocity Distribution</div>
      <div className="anim-slide-up anim-delay-3" style={cardStyle}>
        <div style={{ display: 'flex', gap: 20 }}>
          {veloDistribution.map(p => (
            <div key={p.type} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-bright)', fontWeight: 600 }}>{p.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{p.min}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--surface-tint-2)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    left: `${((p.min - (p.min - 2)) / ((p.max + 2) - (p.min - 2))) * 100}%`,
                    right: `${(1 - (p.max - (p.min - 2)) / ((p.max + 2) - (p.min - 2))) * 100}%`,
                    height: '100%', background: p.color, borderRadius: 4, opacity: 0.7,
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{p.max}</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-bright)' }}>{p.avg}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', marginLeft: 4 }}>avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
