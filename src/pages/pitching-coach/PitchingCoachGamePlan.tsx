import { useState } from 'react'
import { pitchingStaff, pitchColors } from '../../data/pitchingStaff'

// Mock opposing lineup
const opposingLineup = [
  { id: 'B01', name: 'Troy Fenwick', bats: 'R', avg: .285, ops: .842, weakness: 'SL low-away', tendency: 'Aggressive early, chases elevated FB', hotZones: [0.6, 0.3, 0.4, 0.8, 0.9, 0.5, 0.3, 0.2, 0.4] },
  { id: 'B02', name: 'Nate Escobedo', bats: 'L', avg: .302, ops: .895, weakness: 'CB down', tendency: 'Patient, works counts. Vulnerable to backdoor breaking balls', hotZones: [0.4, 0.7, 0.8, 0.3, 0.5, 0.9, 0.2, 0.6, 0.7] },
  { id: 'B03', name: 'Clay Hendrix', bats: 'R', avg: .268, ops: .780, weakness: 'CH arm-side', tendency: 'Pull-heavy, sits on fastball. Off-speed makes him uncomfortable', hotZones: [0.7, 0.4, 0.2, 0.9, 0.6, 0.3, 0.8, 0.5, 0.4] },
  { id: 'B04', name: 'Vince Holloway', bats: 'R', avg: .275, ops: .820, weakness: 'FF up-and-in', tendency: 'Power hitter. Disciplined approach but struggles with velocity inside', hotZones: [0.5, 0.8, 0.6, 0.4, 0.7, 0.8, 0.3, 0.5, 0.7] },
  { id: 'B05', name: 'Sawyer Pratt', bats: 'L', avg: .258, ops: .745, weakness: 'SL backdoor', tendency: 'Contact-first, bunts well. No real power threat', hotZones: [0.3, 0.5, 0.6, 0.4, 0.8, 0.5, 0.6, 0.3, 0.2] },
  { id: 'B06', name: 'Bryce Kessler', bats: 'R', avg: .292, ops: .868, weakness: 'CB 12-6', tendency: 'Handles velocity well but timing disrupted by big curves', hotZones: [0.8, 0.6, 0.3, 0.7, 0.9, 0.4, 0.5, 0.7, 0.6] },
  { id: 'B07', name: 'Javon Redd', bats: 'L', avg: .245, ops: .710, weakness: 'FF elevated', tendency: 'Free swinger, will expand. Attack with strikes', hotZones: [0.4, 0.3, 0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.3] },
  { id: 'B08', name: 'Leo Quintana', bats: 'R', avg: .262, ops: .755, weakness: 'SW glove-side', tendency: 'Good speed, may bunt or slap. Keep ball down', hotZones: [0.3, 0.6, 0.4, 0.5, 0.7, 0.5, 0.7, 0.4, 0.6] },
  { id: 'B09', name: 'Will Ashby', bats: 'L', avg: .238, ops: .690, weakness: 'CH down', tendency: 'Weak bat. Pitch around to get to top of order with bases empty', hotZones: [0.2, 0.4, 0.3, 0.3, 0.5, 0.4, 0.4, 0.6, 0.2] },
]

// Recommended pitch sequences per batter type
function getRecommendedSequence(weakness: string): string[] {
  if (weakness.includes('SL')) return ['FF in', 'FF up', 'SL low-away']
  if (weakness.includes('CB')) return ['FF middle', 'CH arm-side', 'CB down']
  if (weakness.includes('CH')) return ['FF up', 'FF in', 'CH down']
  if (weakness.includes('FF')) return ['SL away', 'CH arm-side', 'FF up-in']
  if (weakness.includes('SW')) return ['FF in', 'FF up', 'SW glove-side']
  return ['FF middle', 'SL away', 'CH down']
}

export default function PitchingCoachGamePlan() {
  const starters = pitchingStaff.filter(p => p.role === 'SP')
  const [selectedPitcherId, setSelectedPitcherId] = useState(starters[0]?.id || '')
  const selectedPitcher = pitchingStaff.find(p => p.id === selectedPitcherId)

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)', border: '1px solid var(--orange-border)',
    borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
  }

  // Zone colors
  const zoneColor = (intensity: number) => {
    if (intensity >= 0.8) return 'rgba(229,57,53,0.7)'
    if (intensity >= 0.6) return 'rgba(255,152,0,0.6)'
    if (intensity >= 0.4) return 'rgba(255,235,59,0.4)'
    return 'rgba(76,175,80,0.3)'
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Game Plan
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Opponent analysis and pitch sequencing strategy
        </p>
      </div>

      {/* Pitcher selector */}
      <div className="anim-slide-up anim-delay-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase' }}>
          Your Pitcher
        </label>
        <select
          value={selectedPitcherId}
          onChange={e => setSelectedPitcherId(e.target.value)}
          style={{
            background: 'var(--panel)', border: '1px solid var(--orange-border)',
            borderRadius: 8, padding: '10px 16px', color: 'var(--text-bright)',
            fontFamily: 'var(--font-body)', fontSize: 14, minWidth: 260, outline: 'none', cursor: 'pointer',
          }}
        >
          {pitchingStaff.map(p => (
            <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.role} ({p.throws}HP)</option>
          ))}
        </select>
        {selectedPitcher && (
          <div style={{ display: 'flex', gap: 12 }}>
            {selectedPitcher.arsenal.map(pitch => (
              <span key={pitch.type} style={{
                padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: `${pitchColors[pitch.type]}22`, color: pitchColors[pitch.type],
              }}>{pitch.type} {pitch.velo}</span>
            ))}
          </div>
        )}
      </div>

      {/* Opposing Lineup */}
      <div className="anim-slide-up anim-delay-2" style={secTitle}>Opposing Lineup — Nashville Sounds</div>
      <div className="anim-slide-up anim-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {opposingLineup.map((batter, idx) => {
          const sequence = getRecommendedSequence(batter.weakness)
          return (
            <div key={batter.id} style={cardStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '240px 120px 1fr', gap: 20, alignItems: 'center' }}>
                {/* Batter info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', fontWeight: 700,
                    }}>{idx + 1}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text-bright)' }}>
                      {batter.name}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                    Bats {batter.bats} — .{Math.round(batter.avg * 1000)} AVG / {batter.ops.toFixed(3)} OPS
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                    {batter.tendency}
                  </div>
                </div>

                {/* Hot/Cold Zone SVG */}
                <div>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                      const row = Math.floor(i / 3)
                      const col = i % 3
                      return (
                        <rect
                          key={i}
                          x={col * 30}
                          y={row * 30}
                          width={28}
                          height={28}
                          rx={3}
                          fill={zoneColor(batter.hotZones[i])}
                          stroke="var(--surface-tint-3)"
                          strokeWidth="1"
                        />
                      )
                    })}
                  </svg>
                </div>

                {/* Strategy */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', background: 'var(--color-negative-bg)', color: 'var(--color-negative)',
                    }}>Weakness</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-bright)' }}>{batter.weakness}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Sequence:
                    </span>
                    {sequence.map((s, si) => (
                      <span key={si} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: 'var(--surface-tint-2)', color: 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                        }}>{s}</span>
                        {si < sequence.length - 1 && <span style={{ color: 'var(--muted)', fontSize: 10 }}>&rarr;</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Strategy narrative */}
      <div className="anim-slide-up anim-delay-3" style={secTitle}>Game Strategy</div>
      <div className="anim-slide-up anim-delay-3" style={{
        ...cardStyle,
        background: 'var(--accent-bg-subtle)',
        border: '1px solid var(--accent)',
      }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
          {selectedPitcher ? (
            <>
              <strong style={{ color: 'var(--accent)' }}>Scouting Summary:</strong> Nashville's lineup is right-heavy (6 RHH, 3 LHH) with
              a team OPS of .792. They rank 4th in the league in chase rate but struggle against elevated fastballs
              and sharp breaking balls.
              <br /><br />
              <strong style={{ color: 'var(--accent)' }}>Key Matchups:</strong> Escobedo (#2) and Kessler (#6) are the biggest threats.
              Attack Escobedo early with fastballs inside, then expand with the breaking ball. For Kessler, sequence with
              off-speed to disrupt timing before going to the curveball.
              <br /><br />
              <strong style={{ color: 'var(--accent)' }}>Game Plan for {selectedPitcher.firstName} {selectedPitcher.lastName}:</strong> Lean
              on the {selectedPitcher.arsenal[0].name} ({selectedPitcher.arsenal[0].velo} mph) early in counts to establish.
              Use the {selectedPitcher.arsenal[1].name} as the primary out pitch — it
              has a {selectedPitcher.arsenal[1].whiffRate}% whiff rate. Against left-handed hitters, focus
              on {selectedPitcher.throws === 'R' ? 'the changeup arm-side' : 'the slider away'}. Aim for 60% first-pitch
              strike rate and keep pitch count under 95 through 6 innings.
              <br /><br />
              <strong style={{ color: 'var(--accent)' }}>Bullpen Plan:</strong> Have the 7th-8th covered by the middle relievers. If {selectedPitcher.lastName} exits
              after 6, bridge to Davis for the save. Washington is on limited availability — use only in high-leverage spots.
            </>
          ) : (
            'Select a pitcher above to see the full game strategy.'
          )}
        </div>
      </div>
    </div>
  )
}
