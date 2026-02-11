import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AIPanel from '../components/AIPanel'
import RadarChart from '../components/RadarChart'
import DonutGauge from '../components/DonutGauge'
import { getPlayer, getPlayerName } from '../data/players'
import { playerSuggestions, getPlayerAIResponse } from '../data/mockAI'
import { getPitcherForPlayer, pitchColors, pitchingBenchmarks, normalizePitching } from '../data/csvStats'

const PITCH_FILTERS = ['ALL', 'FB', 'CB', 'CH', 'SL', 'CT'] as const
type PitchFilter = typeof PITCH_FILTERS[number]

export default function PlayerPitching() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const player = getPlayer(playerId || '3000002')
  const [mode, setMode] = useState<'training' | 'live'>('training')
  const [bottomTab, setBottomTab] = useState<'usage' | 'avgmetrics'>('usage')
  const [showAI, setShowAI] = useState(false)
  const [pitchFilter, setPitchFilter] = useState<PitchFilter>('ALL')
  const [dotCount, setDotCount] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)

  const pitcher = getPitcherForPlayer(playerId || '3000002')

  if (!player) return <div style={{ padding: 40, color: '#fff' }}>Player not found</div>
  const name = getPlayerName(player)

  const pitchTypes = mode === 'training' ? pitcher.trainingPitchTypes : pitcher.livePitchTypes
  const allDots = mode === 'training' ? pitcher.trainingDots : pitcher.liveDots
  const filteredDots = pitchFilter === 'ALL' ? allDots : allDots.filter(d => d.type === pitchFilter)
  const filteredMovement = pitchFilter === 'ALL' ? pitcher.movementDots : pitcher.movementDots.filter(d => d.type === pitchFilter)
  const filteredPitchTypes = pitchFilter === 'ALL' ? pitchTypes : pitchTypes.filter(pt => pt.abbr === pitchFilter)

  const fbOffset = mode === 'live' ? 2 : 0
  const pitchCountOffset = mode === 'live' ? 18 : 0

  // Avg spin for radar (from FB type)
  const fbType = pitchTypes.find(pt => pt.abbr === 'FB')
  const avgSpin = fbType ? fbType.spin : 2400
  const weakContact = 32 // placeholder

  const radarValues = normalizePitching(pitcher.avgFB + fbOffset, avgSpin, weakContact)

  // Stagger dots
  useEffect(() => {
    setDotCount(0)
    setFadeKey(k => k + 1)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDotCount(i)
      if (i >= filteredDots.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [mode, pitchFilter, filteredDots.length])

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Sidebar playerName={name} playerId={playerId} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 28px 14px' }}>
        {/* Header */}
        <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, justifyContent: 'center', flexShrink: 0 }}>
          <img src="/branding/icon.png" alt="" style={{ width: 40 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, letterSpacing: '5px', textTransform: 'uppercase' }}>BASELINE PITCHING</h1>
        </div>

        {/* Controls */}
        <div className="anim-fade-in anim-delay-1" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Pitch type selector */}
            <select
              value={pitchFilter}
              onChange={e => setPitchFilter(e.target.value as PitchFilter)}
              style={{
                padding: '8px 14px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                background: 'var(--panel)',
                color: 'var(--text)',
                border: '1px solid var(--card-border)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {PITCH_FILTERS.map(f => (
                <option key={f} value={f}>{f === 'ALL' ? 'ALL PITCHES' : f}</option>
              ))}
            </select>
            <button className="btn" disabled title="Coming soon">DATE</button>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--orange-border)', borderRadius: 6, overflow: 'hidden' }}>
            <button onClick={() => setMode('training')} style={{ padding: '8px 26px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', border: 'none', borderRight: '1px solid var(--orange-border)', background: mode === 'training' ? 'var(--accent)' : 'transparent', color: mode === 'training' ? '#000' : 'var(--muted)', transition: 'all 0.15s' }}>TRAINING</button>
            <button onClick={() => setMode('live')} style={{ padding: '8px 26px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', border: 'none', background: mode === 'live' ? 'var(--accent)' : 'transparent', color: mode === 'live' ? '#000' : 'var(--muted)', transition: 'all 0.15s' }}>LIVE</button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflow: 'auto' }}>
          {/* Top row: Summary + Stack Up */}
          <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
            <div className="anim-slide-up anim-delay-2" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px 20px', boxShadow: 'inset 0 1px 0 var(--accent)' }}>
              <div style={secHead}>PLAYER SUMMARY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
                {[
                  { label: 'AVG FB', val: `${pitcher.avgFB + fbOffset}`, unit: 'MPH', highlight: false },
                  { label: 'MAX FB', val: `${pitcher.maxFB + fbOffset}`, unit: 'MPH', highlight: true },
                  { label: 'AVG BS', val: `${pitcher.avgBS}`, unit: 'MPH', highlight: false },
                  { label: 'PITCHES', val: `${pitcher.pitches + pitchCountOffset}`, unit: '', highlight: false },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: s.highlight ? 'var(--accent)' : 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--text-bright)', background: '#1e1e1e', borderRadius: 6, padding: '6px 8px', border: '1px solid #2a2a2a' }}>
                      {s.val}{s.unit && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>{s.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="anim-slide-up anim-delay-3" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '16px 20px', boxShadow: 'inset 0 1px 0 var(--accent)', display: 'flex', flexDirection: 'column' }}>
              <div style={secHead}>HOW YOU STACK UP</div>
              <RadarChart
                values={radarValues}
                labels={['FB Velo', 'WC', 'FB Spin']}
                benchmarks={pitchingBenchmarks}
                size={200}
              />
            </div>
          </div>

          {/* Bottom row: Pitch breakdown + Session Analysis + Movement/Release */}
          <div key={fadeKey} className="tab-content-enter" style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
            {/* Pitch type usage with DonutGauge */}
            <div className="anim-slide-up anim-delay-4" style={{ width: 280, minWidth: 280, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', overflow: 'auto' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: 'var(--panel)', border: `1px solid ${bottomTab === 'usage' ? 'var(--accent)' : 'var(--card-border)'}`, borderRadius: 4, color: bottomTab === 'usage' ? 'var(--text)' : 'var(--muted)', cursor: 'pointer' }} onClick={() => setBottomTab('usage')}>{'\u25BC'} USAGE</button>
                <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: 'var(--panel)', border: `1px solid ${bottomTab === 'avgmetrics' ? 'var(--accent)' : 'var(--card-border)'}`, borderRadius: 4, color: bottomTab === 'avgmetrics' ? 'var(--text)' : 'var(--muted)', cursor: 'pointer' }} onClick={() => setBottomTab('avgmetrics')}>AVG METRICS</button>
              </div>
              {filteredPitchTypes.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, width: 28, color: 'var(--text)', flexShrink: 0 }}>{pt.abbr}</div>
                  <div style={{ flexShrink: 0 }}>
                    <DonutGauge
                      value={pt.usage}
                      label={`${pt.usage}`}
                      size={80}
                      color={pt.color}
                      strokeWidth={6}
                    />
                  </div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: 10 }}>
                    <div>Velo: {pt.velo} MPH</div>
                    <div>Vert Break: {pt.vBreak} in</div>
                    <div>Horz Break: {pt.hBreak} in</div>
                    <div>Spin: {pt.spin} RPM</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Session Analysis */}
            <div className="anim-slide-up anim-delay-5" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={secHead2}>SESSION ANALYSIS</div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 95" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                  <rect x="15" y="5" width="70" height="80" fill="none" stroke="rgba(100,100,100,0.3)" strokeWidth="0.4" />
                  <rect x="30" y="20" width="40" height="50" fill="none" stroke="rgba(150,150,150,0.3)" strokeWidth="0.4" />
                  {filteredDots.slice(0, dotCount).map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={pitchColors[d.type] || '#888'} opacity="0.9">
                      <animate attributeName="r" from="0" to="1.5" dur="0.25s" fill="freeze" />
                      <animate attributeName="opacity" from="0" to="0.9" dur="0.25s" fill="freeze" />
                    </circle>
                  ))}
                </svg>
              </div>
              {/* Outcome percentages */}
              {filteredPitchTypes.length > 0 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', fontSize: 10, color: 'var(--muted)', paddingTop: 6, flexShrink: 0 }}>
                  {filteredPitchTypes.map(pt => (
                    <div key={pt.abbr} style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: pt.color, fontWeight: 700 }}>{pt.abbr}:</span>
                      {Object.entries(pt.outcomes).filter(([, v]) => v && v !== '0%').map(([k, v]) => (
                        <span key={k}>{k} {v}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column: Movement Plot + Release Point */}
            <div style={{ width: 220, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="anim-slide-up anim-delay-6" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={secHead2}>MOVEMENT PLOT</div>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(100,100,100,0.2)" strokeWidth="0.3" />
                    <line x1="50" y1="5" x2="50" y2="75" stroke="rgba(100,100,100,0.2)" strokeWidth="0.3" />
                    <text x="8" y="78" fill="var(--muted)" fontSize="6">H Break</text>
                    <text x="52" y="8" fill="var(--muted)" fontSize="6">V Break</text>
                    {filteredMovement.map((d, i) => (
                      <circle key={i} cx={50 + d.x * 3} cy={40 - d.y * 2.5} r="1.4" fill={pitchColors[d.type] || '#888'} opacity="0.85">
                        <animate attributeName="r" from="0" to="1.4" dur="0.3s" begin={`${i * 0.02}s`} fill="freeze" />
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>
              <div className="anim-slide-up anim-delay-7" style={{ height: 90, background: 'var(--card-bg)', border: '1px solid var(--orange-border)', borderRadius: 6, padding: '14px', boxShadow: 'inset 0 0 20px rgba(224,172,68,0.04)', flexShrink: 0 }}>
                <div style={secHead2}>RELEASE POINT</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                  <svg viewBox="0 0 60 30" style={{ width: '100%' }}>
                    {pitcher.releaseDots.map((d, i) => (
                      <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="var(--accent)" opacity={d.opacity} />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '6px 0', flexShrink: 0 }}>
            <button style={{ padding: '9px 18px', background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 6, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', transition: 'all 0.2s' }} onClick={() => navigate(`/player/${playerId}/pitching/metrics`)} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,172,68,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--panel)'; e.currentTarget.style.borderColor = 'var(--orange-border)' }}>VIEW METRICS &rarr;</button>
          </div>
        </div>
      </div>

      {showAI ? (
        <div style={{ position: 'relative' }}>
          <button style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--card-border)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowAI(false)}>&times;</button>
          <AIPanel suggestions={playerSuggestions} onQuery={(q) => getPlayerAIResponse(q, name)} />
        </div>
      ) : (
        <button style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--panel)', border: '1px solid var(--orange-border)', borderRadius: 10, padding: '12px 16px', cursor: 'pointer', zIndex: 100 }} onClick={() => setShowAI(true)}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, color: 'var(--text)', textAlign: 'center' as const, lineHeight: 1.3 }}>TALK TO<br />YOUR DATA</span>
          <img src="/branding/icon.png" alt="" style={{ width: 34 }} />
        </button>
      )}
    </div>
  )
}

const secHead: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text)', textAlign: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--orange-border)' }
const secHead2: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-bright)', marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid var(--orange-border)', flexShrink: 0 }
