import { useState } from 'react'
import Sparkline from '../../components/Sparkline'
import { pitchingStaff, type Pitcher } from '../../data/pitchingStaff'

const generateTrend = (base: number, variance: number): number[] => {
  const result: number[] = []
  let current = base - variance
  for (let i = 0; i < 8; i++) {
    current += (Math.random() - 0.3) * variance * 0.5
    result.push(Math.round(current * 10) / 10)
  }
  return result
}

const relievers = pitchingStaff.filter(p => p.role === 'RP' || p.role === 'CL')

// Availability calendar: 3 days forward
const calendarDays = ['Today', 'Tomorrow', 'Day 3']

function getProjectedReadiness(pitcher: Pitcher, dayOffset: number): 'green' | 'yellow' | 'red' {
  // Simple projection: each day of rest improves readiness
  if (dayOffset === 0) return pitcher.readiness
  if (pitcher.readiness === 'red' && dayOffset === 1) return 'yellow'
  if (pitcher.readiness === 'red' && dayOffset >= 2) return 'green'
  if (pitcher.readiness === 'yellow' && dayOffset >= 1) return 'green'
  return 'green'
}

export default function PitchingCoachBullpen() {
  const [simPitcherId, setSimPitcherId] = useState('')
  const [simPitchCount, setSimPitchCount] = useState(25)
  const [simResult, setSimResult] = useState<{ acwr: number; readiness: 'green' | 'yellow' | 'red' } | null>(null)

  const handleSimulate = () => {
    const pitcher = pitchingStaff.find(p => p.id === simPitcherId)
    if (!pitcher) return

    const newAcute = pitcher.pitchCount7Day + simPitchCount
    const chronic = pitcher.pitchCount28Day / 4
    const newACWR = +(newAcute / chronic).toFixed(2)
    const readiness: 'green' | 'yellow' | 'red' =
      newACWR >= 1.3 ? 'red' : newACWR >= 1.1 ? 'yellow' : 'green'

    setSimResult({ acwr: newACWR, readiness })
  }

  const readinessColor = (r: 'green' | 'yellow' | 'red') =>
    r === 'green' ? 'var(--color-positive)' : r === 'yellow' ? 'var(--color-warning)' : 'var(--color-negative)'

  const readinessLabel = (r: 'green' | 'yellow' | 'red') =>
    r === 'green' ? 'Available' : r === 'yellow' ? 'Limited' : 'Unavailable'

  const cardStyle: React.CSSProperties = {
    background: 'var(--panel)', border: '1px solid var(--orange-border)',
    borderRadius: 10, padding: 24, boxShadow: 'inset 0 1px 0 var(--accent-bg-medium)',
  }

  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 18,
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="anim-fade-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--text-bright)', marginBottom: 4 }}>
          Bullpen Management
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Readiness board, availability calendar, and usage simulator
        </p>
      </div>

      {/* Readiness Board */}
      <div style={secTitle}>Readiness Board</div>
      <div className="anim-slide-up anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {relievers.map(p => {
          const color = readinessColor(p.readiness)
          // Days since last appearance
          const lastDate = new Date(p.lastAppearance)
          const today = new Date('2026-02-14')
          const daysRest = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

          return (
            <div key={p.id} style={{
              ...cardStyle, padding: 18,
              borderLeft: `4px solid ${color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 2 }}>
                    {p.firstName} {p.lastName}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700,
                      background: p.role === 'CL' ? 'var(--color-negative-bg)' : 'rgba(158,158,158,0.15)',
                      color: p.role === 'CL' ? 'var(--color-negative)' : 'var(--muted)',
                    }}>{p.role}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
                      {p.throws}HP
                    </span>
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', background: `${color}22`, color,
                }}>{readinessLabel(p.readiness)}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>Days Rest</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-bright)' }}>{daysRest}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>7d PC</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-bright)' }}>{p.pitchCount7Day}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>28d PC</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{p.pitchCount28Day}</div>
                </div>
              </div>

              {/* ACWR bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>ACWR</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: color }}>{p.acwr.toFixed(2)}</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-tint-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${Math.min(100, (p.acwr / 1.6) * 100)}%`,
                    background: color,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              {/* Stuff+ sparkline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>Stuff+</span>
                <Sparkline data={generateTrend(p.stuffPlus, 5)} width={60} height={16} showEndDot />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-bright)' }}>{p.stuffPlus}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Availability Calendar */}
      <div style={secTitle}>Availability Calendar (3-Day Forward)</div>
      <div className="anim-slide-up anim-delay-2" style={{ ...cardStyle, padding: 0, marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--orange-border)' }}>
              <th style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', width: 180 }}>
                Pitcher
              </th>
              {calendarDays.map(d => (
                <th key={d} style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center' }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {relievers.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < relievers.length - 1 ? '1px solid var(--surface-tint-2)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>
                    {p.firstName} {p.lastName}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{p.role} — {p.throws}HP</div>
                </td>
                {calendarDays.map((_, dayIdx) => {
                  const projected = getProjectedReadiness(p, dayIdx)
                  const bgColor = readinessColor(projected)
                  return (
                    <td key={dayIdx} style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-block', width: 36, height: 36, borderRadius: 8,
                        background: `${bgColor}22`, border: `1px solid ${bgColor}44`,
                        lineHeight: '36px',
                      }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%', background: bgColor,
                          margin: '13px auto', boxShadow: `0 0 6px ${bgColor}55`,
                        }} />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Usage Simulator */}
      <div style={secTitle}>Usage Simulator</div>
      <div className="anim-slide-up anim-delay-3" style={cardStyle}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Project how a reliever's workload would change if they pitch tonight.
        </p>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Select Pitcher
            </label>
            <select
              value={simPitcherId}
              onChange={e => { setSimPitcherId(e.target.value); setSimResult(null) }}
              style={{
                background: 'var(--bg)', border: '1px solid var(--orange-border)',
                borderRadius: 6, padding: '10px 14px', color: 'var(--text-bright)',
                fontFamily: 'var(--font-body)', fontSize: 13, minWidth: 220, outline: 'none',
              }}
            >
              <option value="">Choose...</option>
              {relievers.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.2px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Projected Pitch Count
            </label>
            <input
              type="number"
              value={simPitchCount}
              onChange={e => { setSimPitchCount(Number(e.target.value)); setSimResult(null) }}
              min={5} max={60} step={5}
              style={{
                background: 'var(--bg)', border: '1px solid var(--orange-border)',
                borderRadius: 6, padding: '10px 14px', color: 'var(--text-bright)',
                fontFamily: 'var(--font-mono)', fontSize: 14, width: 100, outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleSimulate}
            disabled={!simPitcherId}
            style={{
              padding: '10px 24px', background: simPitcherId ? 'var(--accent)' : 'transparent',
              border: `1px solid ${simPitcherId ? 'var(--accent)' : 'var(--muted)'}`,
              borderRadius: 6, color: simPitcherId ? '#000' : 'var(--muted)',
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '1px',
              cursor: simPitcherId ? 'pointer' : 'not-allowed',
            }}
          >
            Simulate
          </button>
        </div>

        {/* Simulation result */}
        {simResult && (() => {
          const pitcher = pitchingStaff.find(p => p.id === simPitcherId)!
          const color = readinessColor(simResult.readiness)
          const prevColor = readinessColor(pitcher.readiness)
          return (
            <div style={{
              padding: 24, borderRadius: 10,
              background: 'var(--accent-bg-subtle)', border: '1px solid var(--orange-border)',
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 14 }}>
                Projection for {pitcher.firstName} {pitcher.lastName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                    Current ACWR
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: prevColor }}>
                    {pitcher.acwr.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                    Projected ACWR
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color }}>
                    {simResult.acwr.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                    Projected Status
                  </div>
                  <span style={{
                    padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', background: `${color}22`, color,
                  }}>
                    {readinessLabel(simResult.readiness)}
                  </span>
                </div>
              </div>
              {simResult.readiness === 'red' && (
                <div style={{
                  marginTop: 14, padding: '10px 14px', borderRadius: 6,
                  background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-negative)',
                }}>
                  Warning: This usage would push {pitcher.lastName} into high-risk territory. Consider an alternative arm.
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
